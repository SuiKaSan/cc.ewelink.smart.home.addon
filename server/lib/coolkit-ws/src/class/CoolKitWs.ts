import WebSocketService from './WebSocket';
import { IConfig, IDeviceConfig, IDeviceResponse, IQueryConfig, IReconnectEvent, IResponse, IUpgradeConfig, IWsParams } from '../ts/interfaces';
import WebSocket from 'ws';
import EE from './../utils/eventEmitter';
import { EErrorCode, EEventType, EOpenEventType } from '../ts/enum';
import coolKitWs from '..';
// import _ from

type TMethod = 'message' | 'open' | 'error' | 'close' | 'reconnect';

export default class CoolKitWs {
    private static ws: WebSocketService | null = null;

    /**
     *
     * 初始化长连接
     * @param {IConfig} config
     * @returns
     * @memberof CoolKitWs
     */
    public async init(config: IConfig) {
        try {
            if ((config.userAgent === 'app' || config.userAgent === 'pc_ewelink') && (!config.at || !config.apikey || !config.appid || !config.region)) {
                throw new Error('CK_WS: missing some parameter for app agent');
            }

            if (config.userAgent === 'device' && (!config.region || !config.apikey || !config.deviceid)) {
                throw new Error('CK_WS: missing some parameter for device agent');
            }

            const newWs = new WebSocketService(config);
            const result = await newWs.init();
            CoolKitWs.ws = newWs;
            return result;
        } catch (error) {
            throw new Error(`CK_WS: ws init error: ${error}`);
        }
    }

    /**
     *
     * 关闭长连接
     * @memberof CoolKitWs
     */
    public close() {
        const ws = this.getWs();
        ws.close(true);
    }

    /**
     * 外部函数
     * 判断长连接是否存在
     * @private
     * @returns
     * @memberof CoolKitWs
     */
    public isWsExist() {
        if (CoolKitWs.ws) {
            WebSocketService.connectConfig.debug && console.log(`CK_WS: connect exist, and the state being: ${CoolKitWs.ws.wsState}`);
            if (CoolKitWs.ws.wsState === 'CLOSED') {
                CoolKitWs.ws = null;
                return false;
            }

            return true;
        }

        return false;
    }

    
    /**
    * 外部函数
    * 判断长连接是否已连接
    * @private
    * @returns
    * @memberof CoolKitWs
    */
    public isWsConnected() {
        if (CoolKitWs.ws) {
            if (CoolKitWs.ws.wsState === 'CONNECTED') {
                return true;
            }
            
            WebSocketService.connectConfig.debug && console.log(`CK_WS: the connect state being: ${CoolKitWs.ws.wsState}`);
            return false;
        }

        return false;
    }


    /**
     * 外部函数
     * 获取长连接状态
     * @private
     * @returns
     * @memberof CoolKitWs
     */
    public wsState() {
        if (CoolKitWs.ws) {
            return CoolKitWs.ws.wsState;
        }

        return null;
    }

    /**
     * 外部函数
     * 发送长连接
     * @private
     * @returns
     * @memberof CoolKitWs
     */
    public sendMessage(params: IWsParams | string) {
        const ws = this.getWs();
        ws.send(params);
    }

    /**
     *
     * 更新设备信息
     * @param {IDeviceConfig} deviceConfig
     * @returns
     * @memberof CoolKitWs
     */
    public async updateThing(deviceConfig: IDeviceConfig): Promise<IDeviceResponse | IResponse> {
        const ws = this.getWs();
        const { deviceid, ownerApikey, params } = deviceConfig;
        if (!deviceid || !ownerApikey || !params) {
            throw new Error('CK_WS: all the parameters is not allowed to be null!');
        }
        const { sequence } = await ws.sendThing(deviceConfig, 'update');
        return await this.getMessage(sequence, deviceid);
    }

    /**
     *
     * 查询设备信息
     * @param {IQueryConfig} queryConfig
     * @returns
     * @memberof CoolKitWs
     */
    public async queryThing(queryConfig: IQueryConfig): Promise<IDeviceResponse | IResponse> {
        if (!CoolKitWs.ws || (CoolKitWs.ws && CoolKitWs.ws.wsState === 'CLOSED')) {
            return {
                error: EErrorCode.REQ_FAIL_OR_TIMEOUT,
                msg: 'Websocket is closed.',
            };
        }
        const { deviceid, ownerApikey, params } = queryConfig;
        if (!deviceid || !ownerApikey || !params) {
            throw new Error('CK_WS: all the parameters is not allowed to be null!');
        }
        const { sequence } = await CoolKitWs.ws.sendThing(queryConfig, 'query');
        return await this.getMessage(sequence, deviceid);
    }

    /**
     *
     * 升级设备
     * @param {IUpgradeConfig} upgradeConfig
     * @returns
     * @memberof CoolKitWs
     */
    public async upgradeThing(upgradeConfig: IUpgradeConfig): Promise<IDeviceResponse | IResponse> {
        if (!CoolKitWs.ws || (CoolKitWs.ws && CoolKitWs.ws.wsState === 'CLOSED')) {
            return {
                error: EErrorCode.REQ_FAIL_OR_TIMEOUT,
                msg: 'Websocket is closed.',
            };
        }
        const { deviceid, ownerApikey, params } = upgradeConfig;
        if (!deviceid || !ownerApikey || !params) {
            throw new Error('CK_WS: all the parameters is not allowed to be null!');
        }
        const { sequence } = await CoolKitWs.ws.sendThing(upgradeConfig, 'upgrade');
        return await this.getMessage(sequence, deviceid);
    }

    /**
     *
     * 监听长连接发送的消息
     * @param {'message'} method
     * @param {(event: { data: any; type: string; target: WebSocket }) => void} callback
     * @param {WebSocket.EventListenerOptions} [options]
     * @returns {Promise<void>}
     * @memberof CoolKitWs
     */
    public async on(method: 'message', callback: (event: { data: any; type: string; target: WebSocket }) => void, options?: WebSocket.EventListenerOptions): Promise<void>;

    /**
     *
     * 监听长连接开启消息
     * @param {'open'} method
     * @param {(event: { target: WebSocket }) => void} callback
     * @param {WebSocket.EventListenerOptions} [options]
     * @returns {Promise<void>}
     * @memberof CoolKitWs
     */
    public async on(method: 'open', callback: (event: { target: WebSocket }) => void, options?: WebSocket.EventListenerOptions): Promise<void>;

    /**
     *
     *　监听长连接错误消息
     * @param {'error'} method
     * @param {(event: { error: any; message: any; type: string; target: WebSocket }) => void} callback
     * @param {WebSocket.EventListenerOptions} [options]
     * @returns {Promise<void>}
     * @memberof CoolKitWs
     */
    public async on(
        method: 'error',
        callback: (event: { error: any; message: any; type: string; target: WebSocket }) => void,
        options?: WebSocket.EventListenerOptions
    ): Promise<void>;

    /**
     *
     * 监听长连接关闭消息
     * @param {'close'} method
     * @param {(event: { wasClean: boolean; code: number; reason: string; target: WebSocket }) => void} callback
     * @param {WebSocket.EventListenerOptions} [options]
     * @returns {Promise<void>}
     * @memberof CoolKitWs
     */
    public async on(
        method: 'close',
        callback: (event: { wasClean: boolean; code: number; reason: string; target: WebSocket }) => void,
        options?: WebSocket.EventListenerOptions
    ): Promise<void>;

    /**
     *
     * 监听长连接重连消息
     * @param {'reconnect'} method
     * @param {(reconnectEvent: IReconnectEvent) => void} callback
     * @returns {Promise<void>}
     * @memberof CoolKitWs
     */
    public async on(method: 'reconnect', callback: (reconnectInfo: IReconnectEvent) => void): Promise<void>;

    public async on(method: TMethod, callback: any) {
        const ws = this.getWs();
        // 执行并存储监听事件
        if (WebSocketService.ws && ws) {
            if (method === 'reconnect') {
                ws.updateCallback(`${EOpenEventType.RECONNECT}`, (reconnectEvent: IReconnectEvent) => callback(reconnectEvent));
                EE.on(`${EOpenEventType.RECONNECT}`, (reconnectEvent: IReconnectEvent) => callback(reconnectEvent));
                return;
            }
            ws.updateCallback(method, callback as unknown as any);
            EE.on(method, callback as unknown as any);
        }
    }

    /**
     *
     * 获取连接信息
     * @private
     * @param {string} sequence
     * @param {string} deviceid
     * @param {WebSocketService} ws
     * @returns
     * @memberof CoolKitWs
     */
    private getMessage(sequence: string, deviceid: string): Promise<IDeviceResponse | IResponse> {
        return new Promise((resolve) => {
            const { reqTimeout = 15000 } = WebSocketService.connectConfig;
            setTimeout(() => {
                resolve({
                    error: EErrorCode.REQ_FAIL_OR_TIMEOUT,
                    msg: '请求超时',
                });
            }, reqTimeout);
            EE.once(`${EEventType.DEVICE_MSG}${sequence}${deviceid}`, (data) => resolve(data));
        });
    }

    /**
     * 内部函数
     * 获取长连接
     * @private
     * @returns
     * @memberof CoolKitWs
     */
    private getWs() {
        if (CoolKitWs.ws) {
            return CoolKitWs.ws;
        }
        throw new Error('CK_WS: please init first!');
    }
}
