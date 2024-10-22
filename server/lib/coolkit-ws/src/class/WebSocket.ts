import getWsIpServices from '../services/getWsIpServices';
import { createNonce, createAppTs, createDeviceTs, getListenerHook, sleep } from '../utils/tools';
import { IConfig, IDeviceConfig, IResponse, IWsParams, IWsHandler, ISendDeviceParams } from '../ts/interfaces';
import WebSocket from 'isomorphic-ws';
import EE from './../utils/eventEmitter';
import { EErrorCode, EEventType, EOpenEventType } from '../ts/enum';

export default class WebSocketService {
    public static connectConfig: IConfig;
    public static hbInterval: NodeJS.Timeout | null;
    public static timeoutTimer: NodeJS.Timeout | null;
    public static isOpen: boolean;
    public static ws: WebSocket | null;
    public wsState = 'INIT';
    private static initClose = false;
    private static heartBeat: number;
    public static isReconnecting = false;
    private static listenerHook: string;
    private static retryCount = 0;
    private static callBackStack = new Map();
    private static initTs = `${Date.now()}`;
    /** 重连允许的最长时间，默认为2小时 */
    private static maxReconnectTime = 2 * 60;
    /** 重连累计时间, 单位为毫秒 */
    private static reconnectTotalTime = 0

    constructor(config: IConfig) {
        WebSocketService.connectConfig = config;
    }

    /**
     * 内部函数
     * 初始化长连接
     * @private
     * @returns {Promise<IResponse>}
     * @memberof WebSocketService
     */
    private async _initWs(ts: string): Promise<IResponse> {
        return new Promise(async (resolve) => {
            // 重置所需字段
            const { debug, region, useTestEnv = false } = WebSocketService.connectConfig;
            console.log(`CK_WS: wsState being initiated to INIT`);
            this.wsState = 'INIT';
            WebSocketService.initClose = false;
            WebSocketService.initTs = ts;
            // 获取服务器地址
            WebSocketService.listenerHook = getListenerHook(WebSocketService.connectConfig);
            const dispatchAdd = await getWsIpServices(region, useTestEnv);
            if (dispatchAdd.error !== 0) {
                console.log(`CK_WS: wsState being changed to CLOSED and error being: ${JSON.stringify(dispatchAdd)}`);
                this.wsState = 'CLOSED';
                resolve({
                    error: EErrorCode.GET_WS_SERVER_ERROR,
                    msg: 'network connect error, can not access ws domain server',
                })
                return;
            }

            const port = dispatchAdd?.port && typeof dispatchAdd.port === 'number' ? dispatchAdd.port : '8080';
            const ws = new WebSocket(`wss://${dispatchAdd.domain}:${port}/api/ws`);
            // 重连状态下调用不同的监听方法
            WebSocketService.isReconnecting
                ? EE.on(`${ts}${EEventType.RECONNECT_STATUS}`, (ev) => {
                    if (ev.error === 0) {
                        console.log('CK_WS: reconnect success, and the state change to CONNECTED');
                        this.wsState = 'CONNECTED';
                        WebSocketService.isReconnecting = false;
                    }
                    WebSocketService.connectConfig.debug && console.log(`CK_WS: reconnect finish`);
                    resolve(ev);
                })
                : EE.once(`${ts}${WebSocketService.listenerHook}`, (ev) => {
                    if (ev.error === 0) {
                        console.log('CK_WS: init success');
                        this.wsState = 'CONNECTED';
                    } else {
                        console.log('CK_WS: init failed');
                        !WebSocketService.isReconnecting && this.close();
                    }
                    resolve(ev);
                });

            // 初始化超时直接报错
            const { reqTimeout = 15000 } = WebSocketService.connectConfig;
            setTimeout(() => {
                if (!WebSocketService.isOpen) {
                    // 非重连状态下的超时则主动关闭
                    !WebSocketService.isReconnecting && this.close();
                    resolve({
                        error: EErrorCode.REQ_FAIL_OR_TIMEOUT,
                        msg: '请求超时',
                    });
                }
            }, reqTimeout);

            ws.onclose = (ev: WebSocket.CloseEvent) => this.onClose(ev, ts);
            ws.onopen = (ev: WebSocket.OpenEvent) => this.onOpen(ev, ts);
            ws.onerror = (ev: WebSocket.ErrorEvent) => this.onError(ev, ts);
            ws.onmessage = (ev: WebSocket.MessageEvent) => this.onMessage(ev, ts);
            WebSocketService.ws = ws;
        });
    }

    /**
     * 内部函数
     * 长连接重连函数x
     * @private
     * @memberof WebSocketService
     */
    private async reconnect() {
        if (WebSocketService.isReconnecting) {
            console.log(`CK_WS: already in reconnect state, won't trigger again`);
            return;
        }

        WebSocketService.isOpen = false;
        WebSocketService.isReconnecting = true;
        WebSocketService.ws = null;
        WebSocketService.hbInterval && clearInterval(WebSocketService.hbInterval);
        const { debug = false, retryInterval = 5, maxRetry = 10 } = WebSocketService.connectConfig;

        // 不论成功或失败 每个长连接实例都默认只会重试10次
        for (; WebSocketService.retryCount < maxRetry;) {
            const retryCount = WebSocketService.retryCount + 1;
            // 每次重连之前都清空监听事件
            this.close();
            if (!WebSocketService.isOpen && !WebSocketService.initClose) {
                console.log(`CK_WS: reconnect for the ${retryCount} times`);
                debug && console.log(`CK_WS: the ${retryCount} times reconnection begins in ${Date.now()}`);
                const res = await this._initWs(`${Date.now()}`);
                debug && console.log(`CK_WS: the ${retryCount} times reconnection ends and result being: ${JSON.stringify(res, null, 4)}`);
                if (res.error !== 0) {
                    // 重新开启所有监听事件
                    this._onAllEventCallBack();
                    console.log(`CK_WS: the ${retryCount} times reconnection failed and the result being: `, res.msg);
                    EE.emit(EOpenEventType.RECONNECT, {
                        error: EErrorCode.RECONNECT_FAIL,
                        data: {
                            totalTime: WebSocketService.reconnectTotalTime / 1000,
                            count: retryCount
                        },
                        msg: res?.msg || 'reconnect fail'
                    })
                    WebSocketService.retryCount++;
                    if (retryCount + 1 > maxRetry) {
                        console.log(`CK_WS: reach the reconnection limit, stop reconnect loop`);
                        EE.emit(EOpenEventType.RECONNECT, {
                            error: EErrorCode.RECONNECT_COUNT_EXCEEDED,
                            data: {
                                totalTime: WebSocketService.reconnectTotalTime / 1000,
                                count: retryCount
                            }
                        })
                    } else {
                        console.log(`CK_WS: wait for the ${retryCount + 1} time reconnection and the time is: ${Date.now()}`);
                    }
                    // 最大重试间隔为2小时
                    const actualInterval = this._getRetryInterval(retryInterval);
                    WebSocketService.reconnectTotalTime = WebSocketService.reconnectTotalTime + actualInterval;
                    await sleep(actualInterval);
                    continue;
                }
            }
            console.log(`CK_WS: the ${retryCount} times reconnection success`);
            // 重新开启所有监听事件
            this._onAllEventCallBack();
            EE.emit(EOpenEventType.RECONNECT, {
                error: 0,
                msg: 'success'
            })
            // 将重连时间清零
            WebSocketService.reconnectTotalTime = 0;
            // 将重连次数清零
            WebSocketService.retryCount = 0;
            break;
        }

        // 重连失败
        // 1.关闭重连状态 2.主动关闭长连接
        if (!WebSocketService.isOpen) {
            WebSocketService.ws = null;
            WebSocketService.isReconnecting = false;
        }
    }

    /**
     * 内部函数
     * 监听长连接开启消息
     * @param {WebSocket} that
     * @memberof WebSocketService
     */
    private async onOpen(ev: WebSocket.OpenEvent, ts: string) {
        WebSocketService.connectConfig.debug && console.log('CK_WS: ws connection opened');
        WebSocketService.isOpen && EE.emit(EOpenEventType.OPEN, ev);
        // 发送消息开启连接
        await WebSocketService._sendHandShakeMsg(ts);
    }

    /**
     * 内部函数
     * 监听长连接错误消息
     * @private
     * @param {WebSocket} that
     * @param {Error} err
     * @memberof WebSocketService
     */
    private async onError(ev: WebSocket.ErrorEvent, ts?: string) {
        WebSocketService.isOpen && EE.emit(EOpenEventType.ERROR, ev);
        console.log(`CK_WS: wsState being changed to ERROR`);
        this.wsState = 'ERROR';

        if (!WebSocketService.isReconnecting) {
            // 尝试重连
            console.log('CK_WS: ws connect error, start reconnection');
            await this.reconnect();
            return;
        }

        // 重连失败 发送消息
        if (WebSocketService.isReconnecting) {
            WebSocketService.connectConfig.debug && console.log(`CK_WS: connection error, reconnection failed`);
            EE.emit(`${ts}${EEventType.RECONNECT_STATUS}`, {
                error: EErrorCode.RECONNECT_FAIL,
                msg: 'reconnect error',
            });
        }
    }

    /**
     * 内部函数
     * 监听长连接关闭消息
     * @param {WebSocket} that
     * @param {number} code
     * @param {string} reason
     * @memberof WebSocketService
     */
    private async onClose(ev: WebSocket.CloseEvent, ts?: string) {
        WebSocketService.connectConfig.debug && console.log(`CK_WS: ws connection closed`);
        WebSocketService.isOpen && EE.emit(EOpenEventType.CLOSE, ev);
        console.log(`CK_WS: wsState being changed to CLOSED by close callback`);
        this.wsState = 'CLOSED';
        // 用户主动关闭则不再连接
        if (WebSocketService.initClose) {
            console.log('CK_WS: the user choose to close the connection');
            WebSocketService.hbInterval && clearInterval(WebSocketService.hbInterval!);
            WebSocketService.initClose = false;
            return;
        }

        if (!WebSocketService.isReconnecting) {
            // 否则重连
            console.log('CK_WS: connection close due to error, start reconnection');
            await this.reconnect();
            return;
        }

        // 重连失败 发送消息
        if (WebSocketService.isReconnecting) {
            WebSocketService.connectConfig.debug && console.log(`CK_WS: connection closed, reconnection failed`);
            EE.emit(`${ts}${EEventType.RECONNECT_STATUS}`, {
                error: EErrorCode.RECONNECT_COUNT_EXCEEDED,
                msg: 'reconnect close',
            });
        }
    }

    /**
     * 内部函数
     * 监听长连接发送消息
     * @private
     * @param {string} ev
     * @returns
     * @memberof WebSocketService
     */
    private async onMessage(ev: WebSocket.MessageEvent, ts?: string) {
        const { debug = false, heartBeatRatio = 90 } = WebSocketService.connectConfig;
        WebSocketService.isOpen && EE.emit(EOpenEventType.MESSAGE, ev);
        // 心跳返回值
        const { data } = ev;
        debug && console.log(`CK_WS: ws connection receive message: `, data);
        if (data === 'pong') {
            EE.emit(EEventType.PING_PONG);
            return;
        }

        const decodedData = JSON.parse(data as string);
        // 握手返回值
        if (decodedData.error === 0 && decodedData.config && decodedData.config.hb && ts) {
            console.log('CK_WS: ws connection handshake success');
            WebSocketService.isOpen = true;

            // 配置心跳间隔时间
            let heartBeat = decodedData.config.hbInterval * 1000 * (Math.floor(heartBeatRatio) / 100);
            // 当传入参数设置心跳为0时或大于规定时间，默认取心跳规定时间的 80% 作为心跳间隔
            if (heartBeat === 0 || heartBeat > decodedData.config.hbInterval * 1000) {
                heartBeat = decodedData.config.hbInterval * 1000 * 0.9;
            }
            // 存储心跳间隔
            WebSocketService.heartBeat = heartBeat;

            // 开始心跳
            WebSocketService.sendMessage('ping');
            await this._waitForPingPong();

            // 配置定时器 按时心跳
            WebSocketService.hbInterval = setInterval(async () => {
                WebSocketService.sendMessage('ping');
                await this._waitForPingPong();
            }, heartBeat);

            // 重连的情况下发送重连相关监听事件
            if (WebSocketService.isReconnecting) {
                EE.emit(`${ts}${EEventType.RECONNECT_STATUS}`, {
                    error: 0,
                    msg: 'success',
                });
                return;
            }

            EE.emit(`${ts}${WebSocketService.listenerHook}`, {
                error: 0,
                msg: 'success',
            });

            WebSocketService.isReconnecting = false;
            return;
        }

        if (decodedData.error !== 0 && decodedData.actionName === 'userOnline') {
            console.log('CK_WS: ws connection handshake error: ', decodedData.error);

            if (WebSocketService.isReconnecting) {
                WebSocketService.connectConfig.debug && console.log(`CK_WS: ws connection handshake error, reconnection failed`);
                EE.emit(`${ts}${EEventType.RECONNECT_STATUS}`, {
                    error: EErrorCode.RECONNECT_FAIL,
                    msg: 'auth fail',
                });
            }

            EE.emit(`${ts}${WebSocketService.listenerHook}`, {
                error: decodedData.error,
                msg: decodedData["reason"] ? decodedData["reason"] : 'webSocket handshake error',
            });
            return;
        }

        // 发送设备开关信息 / 设备查询结果返回值
        if ((decodedData.hasOwnProperty('error') && decodedData.deviceid) || decodedData.params) {
            const { sequence, deviceid } = decodedData;
            EE.emit(`${EEventType.DEVICE_MSG}${sequence}${deviceid}`, decodedData);
        }

        // 设备自主开关返回值
        // decodedData.action
    }

    /**
     * 内部函数
     * 发送即握手协议
     * @private
     * @static
     * @memberof WebSocketService
     */
    private static async _sendHandShakeMsg(ts: string) {
        let params: IWsParams;
        if (WebSocketService.connectConfig.userAgent === 'device') {
            const { userAgent, apikey, chipid, deviceid } = WebSocketService.connectConfig;
            params = {
                action: 'register',
                userAgent,
                apikey,
                deviceid,
                d_seq: ts,
            };

            chipid && (params.chipid = chipid);
        } else {
            const { appid, userAgent, at, apikey } = WebSocketService.connectConfig;
            params = {
                action: 'userOnline',
                version: 8,
                ts: createAppTs(),
                at,
                userAgent,
                apikey,
                appid,
                nonce: createNonce(),
                sequence: ts,
            };
        }

        WebSocketService.sendMessage(params);
    }


    /**
    * 内部函数
    * 等待心跳，如果规定时间内没有心跳则重连
    * @date 24/06/2022
    * @private
    * @returns {*} 
    * @memberof WebSocketService
    */
    private async _waitForPingPong() {
        const maxTime = 1000 * 5;
        let timer: NodeJS.Timeout | null = null;
        return new Promise((resolve) => {
            // 超出规定心跳时间进行重连
            timer = setTimeout(async () => {
                // 重试连接
                console.log(`CK_WS: reach the heartbeat limit, start reconnection`);
                await this.reconnect();
                resolve(1);
            }, maxTime);

            // 接收到消息则不进行重连
            EE.once(EEventType.PING_PONG, () => {
                WebSocketService.connectConfig.debug && console.log(`CK_WS: heartbeat working as expected in ${Date.now()}`);
                // 清除重连定时器
                timer && clearTimeout(timer);
                resolve(1);
            });
        });
    }

    /**
    * 内部函数
    * 开启所有已存储的监听事件
    * @returns
    * @memberof WebSocketService
    */
    private _onAllEventCallBack() {
        const eventNames = EE.eventNames();

        for (const [name, cb] of WebSocketService.callBackStack.entries()) {
            // 已注册的事件不再重复注册
            if (eventNames.includes(name)) continue;
            EE.on(name, cb);
        }
    }

    /**
   * 内部函数
   * 生成重连间隔
   * @returns
   * @memberof WebSocketService
   */
    private _getRetryInterval(retryInterval: number) {
        const maxRetryInterval = WebSocketService.connectConfig.maxRetryInterval || WebSocketService.maxReconnectTime;
        const retryCount = WebSocketService.retryCount + 1;
        let interval = retryInterval;
        // 默认间隔为5s
        if (retryInterval < 5) {
            WebSocketService.connectConfig.debug && console.log("CK_WS: retry interval set to lower than default interval(5s), return to default setting");
            interval = 5;
        }
        const userInterval = retryCount * interval * 1000;
        const maxInterval = maxRetryInterval * 1000;
        // 最大重试间隔不超过规定时间
        return userInterval >= maxInterval ? maxInterval : userInterval;
    }


    /**
    * 外部暴露函数
    * 给长连接发送消息
    * @static
    * @param {(IWsParams | string)} params
    * @returns
    * @memberof WebSocketService
    */
    public static sendMessage(params: IWsParams | string) {
        if (WebSocketService.ws && WebSocketService.ws.readyState === 1) {
            WebSocketService.connectConfig.debug && console.log(`CK_WS: ws connection sends message in ${Date.now()} and with params being `, params);
            // 发送心跳
            if (typeof params === 'string') {
                WebSocketService.ws.send(params);
                return;
            }
            WebSocketService.ws.send(JSON.stringify(params));
        }
    }

    /**
     *
     * 发送设备消息
     * @param {IDeviceConfig} deviceConfig
     * @param {('query' | 'update')} action
     * @returns
     * @memberof WebSocketService
     */
    public async sendThing(deviceConfig: IDeviceConfig, action: 'query' | 'update' | 'upgrade') {
        const { deviceid, params, ownerApikey } = deviceConfig;
        const sequence = `${Date.now()}`;
        const notDevice = WebSocketService.connectConfig.userAgent !== 'device';

        let deviceParams: ISendDeviceParams = {
            action,
            deviceid,
            apikey: ownerApikey,
            userAgent: WebSocketService.connectConfig.userAgent,
            sequence,
            params,
        };
        if ((action === 'query' || action === 'update') && notDevice) {
            deviceParams.selfApikey = WebSocketService.connectConfig.apikey;
        }

        WebSocketService.sendMessage(deviceParams);
        return deviceParams;
    }

    /**
     * 外部暴露函数
     * 初始化长连接
     * @returns
     * @memberof WebSocketService
     */
    public async init() {
        if (WebSocketService.ws) {
            WebSocketService.connectConfig.debug && console.log('CK_WS: ws connection exists, stop init');
            return {
                error: 0,
                msg: 'ws connection exists, stop init',
            };
        }
        WebSocketService.connectConfig.debug && console.log("CK_WS: ws connection begin init")
        return await this._initWs(`${Date.now()}`);
    }

    /**
     * 外部暴露函数
     * 关闭长连接
     * @returns
     * @memberof WebSocketService
     */
    public close(userInit: boolean = false) {
        try {
            WebSocketService.connectConfig.debug && console.log('CK_WS: close function called');
            EE.removeAllListeners();
            if (WebSocketService.ws && WebSocketService.ws.readyState === WebSocketService.ws.OPEN) {
                WebSocketService.connectConfig.debug && console.log('CK_WS: ws connection begin close');
                if (userInit) {
                    WebSocketService.connectConfig.debug && console.log('CK_WS: the user choose to close the connection');
                    WebSocketService.initClose = true;
                }
                // 兼容 web 端与 node 端的使用
                if (typeof window !== 'undefined') {
                    WebSocketService.ws.close();
                } else {
                    WebSocketService.ws.terminate();
                    WebSocketService.ws.removeAllListeners();
                }
                WebSocketService.ws = null;
                WebSocketService.hbInterval && clearInterval(WebSocketService.hbInterval);
                console.log(`CK_WS: wsState being changed to CLOSED by close function`);
                this.wsState = 'CLOSED';
            }
        } catch (error) {
            console.error('CK_WS: ws function close error: ', error);
        }
    }

    /**
     * 外部暴露函数
     * 暴露外界长连接
     * @returns
     * @memberof WebSocketService
     */
    public send(params: IWsParams | string) {
        if (WebSocketService.ws) {
            WebSocketService.sendMessage(params);
        }
    }



    /**
    * 外部暴露函数
    * 更新callback
     * @date 24/06/2022
     * @param {string} emitName
     * @param {*} cb
     * @memberof WebSocketService
     */
    public updateCallback(emitName: string, cb: any) {
        if (WebSocketService.ws) {
            WebSocketService.callBackStack.set(emitName, cb);
        }
    }

}
