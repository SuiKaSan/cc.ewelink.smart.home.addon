import EventSource from 'eventsource';
import mDnsDataParse from './mDnsDataParse';
import logger from '../log';
import zigbeePSseMap from '../ts/class/zigbeePSseMap';
import syncDeviceOnlineToIHost from '../services/public/syncDeviceOnlineToIHost';
import zigbeePOnlineMap from '../ts/class/zigbeePOnlineMap';
import _ from 'lodash';
import deviceMapUtil from './deviceMapUtil';
import deviceDataUtil from './deviceDataUtil';
import { ZIGBEE_UIID_FIVE_COLOR_LAMP_LIST } from '../constants/uiid';
import { sleep } from './timeUtils';
import { getUiidOperateInstance } from './deviceOperateInstanceMange';
import type Uiid168 from '../services/uiid/uiid168';
import type ZigbeeDeviceOperate from '../services/uiid/zigbeeDeviceOperate';

//zigbee-p 的子设备离线由sse维护，sse断了，全部子设备离线，sse连接到了，请求-p网关获取所有子设备接口，拿到子设备状态
// The offline sub-devices of /zigbee-p are maintained by sse. When sse is disconnected, all sub-devices are offline. When sse is connected, request the -p gateway to obtain all sub-device interfaces and obtain the sub-device status.

enum ESseActionType {
    /** 设备状态更新 (Device status updates)*/
    UPDATE = 'update',
    /** 设备在线状态更新 (Device online status update)*/
    ONLINE = 'sysmsg',
    /** 子设备被删除 (Child device deleted) */
    DELETE = 'removeDev',
}

enum ESseStatus {
    RECONNECTING = 'reconnecting',
    CONNECTED = 'connected',
    NOT_CONNECTED = 'notConnected',
}
/** 初始重连间隔时间 ms (initial reconnection interval ms )*/
const INITIAL_RETRY_INTERVAL = 5 * 1000;
/** 心跳停止多久就离线子设备，启动重连  (How long after the heartbeat stops, the sub-device will be offline and reconnected.)*/
const TIME_OUT = 40 * 1000;
/** 重连次数 (Number of reconnection) */
const TOTAL_RETRY_TIMES = 4;

/**
 * ip example：192.168.31.241
 * initialRetryInterval 重连间隔时间 (Reconnection interval)
 * maxRetryInterval 重连最大间隔时间 (Maximum reconnection interval)
 */
class SSEClient {
    private eventSource: EventSource | null = null;
    private ip: string;
    private deviceId: string;
    private devicekey: string; //网关的devicekey (Gateway devicekey)
    private currentRetryInterval: number;
    private timeout: any;
    private sseStatus: ESseStatus;
    private zigbeePInstance!: Uiid168 | undefined;    // 网关设备的操作实例

    constructor(ip: string, deviceId: string, devicekey: string) {
        this.ip = ip;
        this.deviceId = deviceId;
        this.devicekey = devicekey;
        this.currentRetryInterval = INITIAL_RETRY_INTERVAL;
        this.timeout = null;
        this.sseStatus = ESseStatus.NOT_CONNECTED;
    }

    connect() {
        return new Promise((resolve, reject) => {
            this.eventSource && this.eventSource.close();

            const mDnsDeviceData = deviceMapUtil.getMDnsDeviceDataByDeviceId(this.deviceId);
            if (mDnsDeviceData) {
                this.ip = mDnsDeviceData?.deviceData.ip;
            }

            logger.info('connect-----------', this.deviceId, this.ip, zigbeePSseMap.zigbeePSsePoolMap);

            zigbeePSseMap.zigbeePSsePoolMap.set(this.deviceId, { updateTime: Date.now(), ip: this.ip });

            this.eventSource = new EventSource(`http://${this.ip}:8081/zeroconf/sse`);

            this.eventSource.onopen = () => {
                this.sseStatus = ESseStatus.CONNECTED;
                resolve(true);

                logger.info('SSE connection opened-----------', this.deviceId, this.ip);
                this.heartbeatListen();

                this.currentRetryInterval = INITIAL_RETRY_INTERVAL; // Reset backOff interval on successful connection

                this.zigbeePInstance = getUiidOperateInstance<Uiid168>(this.deviceId);

                //去判断是否上线zigbee-p子设备 (To determine whether the zigbee p sub-device is online)
                // syncZigbeeDeviceOnlineToIHost(this.deviceId, true);
                this.zigbeePInstance?.syncZigbeeDeviceOnlineToIHost()
            };

            this.eventSource.onmessage = (event) => {
                this.heartbeatListen();

                //sse心跳 (Sse heartbeat)
                if (event.data === '') {
                    return;
                }
                const { data, iv } = JSON.parse(event.data);

                const sseData = mDnsDataParse.decryptionDataZigbeeP({ iv, key: this.devicekey, data });
                const { action, deviceid } = sseData;
                const zigbeePSubDeviceOperateInstance = getUiidOperateInstance<ZigbeeDeviceOperate>(deviceid); // zigbee-p 子设备实例

                if (action === ESseActionType.UPDATE) {
                    logger.info('zigbee-p -------------------', ESseActionType.UPDATE, JSON.stringify(sseData, null, 2));
                    // async device status to iHost
                    const { params } = sseData;
                    //保存在线状态，用于smart-home的前端页面 (Save online status for the front-end page of smart home)
                    deviceDataUtil.updateEWeLinkDeviceData(deviceid, 'params', params);
                    zigbeePOnlineMap.zigbeePSubDevicesMap.set(deviceid, true);
                    zigbeePSubDeviceOperateInstance?.syncDeviceStateToIHostByZigbeeP(params);
                    this.zigbeePInstance?.addZigbeeSubDevice(deviceid);

                    /**
                     * zigbee-p 网关固件版本：1.7.1
                     * 五色灯在切换模式时无 colorMode 字段 sse 上报则不会更新本地保存的云端数据，导致控制五色灯灯光亮度时从云端数据中获取当前 colorMode 不变。
                     * 上报模式对应亮度时，自动切换云端数据中的 colorMode 为该模式
                     *
                     * *zigbee-p gateway firmware version: 1.7.1
                     * When the five-color lamp switches modes, there is no colorMode field. If the sse report is reported, the locally saved cloud data will not be updated. As a result, when controlling the brightness of the five-color lamp, the current colorMode obtained from the cloud data remains unchanged.
                     * When the reporting mode corresponds to brightness, the colorMode in the cloud data is automatically switched to this mode.
                     */
                    const uiid = deviceDataUtil.getUiidByDeviceId(deviceid);
                    if (ZIGBEE_UIID_FIVE_COLOR_LAMP_LIST.includes(uiid)) {
                        const cctBrightness = _.get(params, 'cctBrightness', null);
                        const rgbBrightness = _.get(params, 'rgbBrightness', null);
                        cctBrightness && deviceDataUtil.updateEWeLinkDeviceData(deviceid, 'params', { colorMode: 'cct' });
                        rgbBrightness && deviceDataUtil.updateEWeLinkDeviceData(deviceid, 'params', { colorMode: 'rgb' });
                    }
                } else if (action === ESseActionType.ONLINE) {
                    logger.info('zigbee-p -------------------', ESseActionType.ONLINE, sseData);
                    const { params } = sseData;
                    //保存在线状态，用于smart-home的前端页面 (Save online status for the front-end page of smart home)
                    deviceDataUtil.updateEWeLinkDeviceData(deviceid, 'itemData', params);
                    zigbeePOnlineMap.zigbeePSubDevicesMap.set(deviceid, params.online);
                    syncDeviceOnlineToIHost(deviceid, params.online);
                    this.zigbeePInstance?.addZigbeeSubDevice(deviceid);
                } else if (action === ESseActionType.DELETE) {
                    logger.info('zigbee-p -------------------', ESseActionType.DELETE, JSON.stringify(sseData, null, 2));
                    zigbeePSubDeviceOperateInstance?.cancelSyncZigbeeDeviceToIHostBySse();
                    zigbeePOnlineMap.zigbeePSubDevicesMap.delete(deviceid);
                }
            };
            //连接失败大概需要电脑一分钟15秒，iHost3秒 (The connection failure takes about one minute and 15 seconds for the computer and 3 seconds for the i host.)
            this.eventSource.onerror = (error) => {
                logger.error('SSE connection error:', this.ip, this.deviceId, error);

                resolve(false);
                this.eventSource && this.eventSource.close();
                this.reconnectWithBackOff();
            };
        });
    }

    close(): void {
        logger.info('SSE connection closed', this.ip, this.deviceId);
        if (this.eventSource) {
            this.eventSource.close();
        }
        zigbeePSseMap.zigbeePSsePoolMap.delete(this.deviceId);
    }

    private heartbeatListen(): void {
        // 重置超时计时器 (Reset timeout timer)
        clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
            // 在超时时触发自定义的错误处理 (Trigger custom error handling on timeout)
            logger.info('Connection timed out.', this.ip, this.deviceId);
            this.reconnectWithBackOff();
        }, TIME_OUT);
    }

    private async reconnectWithBackOff() {
        if (this.sseStatus === ESseStatus.RECONNECTING) {
            return;
        }
        this.sseStatus = ESseStatus.RECONNECTING;

        for (let i = 1; i <= TOTAL_RETRY_TIMES; i++) {
            logger.info(`sse reconnecting ${i} times`, this.ip, this.deviceId);

            const isConnected = await this.connect();

            if (isConnected) {
                return;
            }

            await sleep(this.currentRetryInterval);
            // 重连失败一定次数，大概一分钟多，离线子设备 (Reconnection fails a certain number of times, about more than one minute, offline sub-device)
            if (i === TOTAL_RETRY_TIMES) {
                logger.info('reconnecting end -----');
                deviceMapUtil.setOfflineDevice(this.deviceId);
                this.zigbeePInstance?.toOfflineAllZigbeePDevices();
                this.close();
                return;
            }

            this.currentRetryInterval = this.currentRetryInterval * 2;
        }
    }
}

export default SSEClient;

// Example usage
// const sseClient = new SSEClient('192.168.31.241'); // Replace with your SSE ip
// sseClient.connect();
