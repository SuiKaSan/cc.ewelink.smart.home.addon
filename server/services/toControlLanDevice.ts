import { Request, Response } from 'express';
import controlLanDevice from './public/controlLanDevice';
import getKwsData from './public/getKwsData';
import { IReqData } from '../ts/interface/IReqData';
import logger from '../log';
import { decode } from 'js-base64';
import getDayKwsData from './public/getDayKwsData';
import EUiid from '../ts/enum/EUiid';
import { LAN_WEB_SOCKET_UIID_DEVICE_LIST, WEB_SOCKET_UIID_DEVICE_LIST, ZIGBEE_UIID_DEVICE_LIST } from '../const';
import controlWebSocketDevice from './webSocket/controlWebSocketDevice';
import _ from 'lodash';
import getWebSocketKwsData from './webSocket/getWebSocketDayKwsData';
import getWebSocketRealSummarize from './webSocket/getWebSocketRealSummarize';
import webSocketRealSummarizeStartEnd from './webSocket/webSocketRealSummarizeStartEnd';
import deviceStateUtil from '../utils/deviceStateUtil';
import deviceDataUtil from '../utils/deviceDataUtil';
import uiid_130 from './uiid/uiid_130';


/**
 * 开放给ihost后端的接口，收到iHost后端请求，控制局域网设备
 * Open the interface to the ihost backend, receive the ihost backend request, and control the LAN device
 * */
export default async function toControlLanDevice(req: Request, res: Response) {
    const reqData = req.body as IReqData;
    const { header, endpoint, payload } = reqData.directive;
    const { message_id } = header;
    const iHostState = payload.state;
    logger.info('control state ----', JSON.stringify(iHostState, null, 2));

    try {
        const { tags = null } = endpoint;

        if (!tags || !tags?.deviceInfo) {
            throw new Error('no tags deviceInfo');
        }
        const deviceInfo = JSON.parse(decode(tags?.deviceInfo));
        let { uiid } = deviceInfo;
        const { deviceId } = deviceInfo;

        if (uiid === EUiid.uiid_130) {
            return uiid_130.receiveRequest(req, res)
        }

        // zigbee-U子设备由zigbee-U决定(zigbee-U sub-device is determined by zigbee-U)
        if (deviceDataUtil.isZigbeeUSubDevice(deviceId)) {
            uiid = EUiid.uiid_243;
        }
        //websocket请求 (Websocket request )
        if (WEB_SOCKET_UIID_DEVICE_LIST.includes(uiid)) {
            if (header.name === 'QueryDeviceStates') {
                if (uiid === EUiid.uiid_5) {
                    const type = _.get(iHostState, ['power-consumption', 'type'], null);

                    if (type === 'summarize') {
                        return res.json(await getWebSocketKwsData(req));
                    } else if (type === 'rlSummarize') {
                        return res.json(await getWebSocketRealSummarize(req));
                    }
                }


                throw new Error('no match');
            } else if (header.name === 'UpdateDeviceStates') {
                if (uiid === EUiid.uiid_5) {
                    const rlSummarize = _.get(iHostState, ['power-consumption', 'powerConsumption', 'rlSummarize'], null);
                    //实时电量开始或者结束接口 （Real-time battery start or end api）
                    if (rlSummarize !== null) {
                        return res.json(await webSocketRealSummarizeStartEnd(req));
                    }
                }


                return res.json(await controlWebSocketDevice(req));
            }

            return;
        }

        if (LAN_WEB_SOCKET_UIID_DEVICE_LIST.includes(uiid)) {
            const isInLanProtocol = deviceStateUtil.isInLanProtocol(deviceId);

            if (!isInLanProtocol) {
                if (header.name === 'QueryDeviceStates') {
                    throw new Error('no match');
                } else if (header.name === 'UpdateDeviceStates') {
                    return res.json(await controlWebSocketDevice(req));
                }

                return;
            }
        }

        //局域网请求 (LAN request)
        if (header.name === 'QueryDeviceStates') {
            if (uiid === EUiid.uiid_190) {
                return res.json(await getKwsData(req));
            } else if (uiid === EUiid.uiid_182) {
                return res.json(await getDayKwsData(req));
            }
            throw new Error('no match');
        } else if (header.name === 'UpdateDeviceStates') {
            //灯设备拆开能力开关和亮度(Light fixtures with ability to switch on and off and brightness)
            if ([EUiid.uiid_103, EUiid.uiid_104, EUiid.uiid_135, EUiid.uiid_136].includes(uiid)) {
                const powerStateObj = _.get(iHostState, 'power', null);
                const brightnessObj = _.get(iHostState, 'brightness', null);

                if (powerStateObj && brightnessObj) {
                    const powerReq = _.cloneDeep(req);
                    powerReq.body.directive.payload.state = _.pick(iHostState, 'power');
                    const powerRes = await controlLanDevice(powerReq);
                    const brightnessReq = _.cloneDeep(req);
                    brightnessReq.body.directive.payload.state = _.omit(iHostState, 'power');
                    await controlLanDevice(brightnessReq);
                    return res.json(powerRes);
                }
            }
            return res.json(await controlLanDevice(req));
        }
    } catch (error: any) {
        logger.error(`to control device code error ---------------${error}`);

        return res.json({
            event: {
                header: {
                    name: 'ErrorResponse',
                    message_id,
                    version: '1',
                },
                payload: {
                    type: 'ENDPOINT_UNREACHABLE',
                },
            },
        });
    }
}
