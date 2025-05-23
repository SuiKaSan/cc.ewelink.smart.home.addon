import { EErrorCode } from "./enum";
interface IConfigForApp {
    at: string;
    apikey: string;
    appid: string;
    region: 'cn' | 'us' | 'eu' | 'as';
    userAgent: 'app' | 'pc_ewelink';
    useTestEnv?: boolean;
    debug?: boolean;
    reqTimeout?: number;
    heartBeatRatio?: number;
    retryInterval?: number;
    maxRetry?: number;
    maxRetryInterval?: number;
}
interface IConfigForDevice {
    region: 'cn' | 'us' | 'eu' | 'as';
    apikey: string;
    chipid?: string;
    deviceid: string;
    userAgent: 'device';
    useTestEnv?: boolean;
    debug?: boolean;
    reqTimeout?: number;
    heartBeatRatio?: number;
    retryInterval?: number;
    maxRetry?: number;
    maxRetryInterval?: number;
}
export type IConfig = IConfigForDevice | IConfigForApp;
export interface IWsParams {
    [key: string]: any;
}
export interface IDeviceConfig {
    deviceid: string;
    ownerApikey: string;
    params: any;
}
export interface IQueryConfig extends IDeviceConfig {
    params: string[];
}
export interface IUpgradeConfig extends IDeviceConfig {
    params: {
        model?: string;
        version: string;
        binList?: IBinList[];
    };
}
interface IBinList {
    downloadUrl: string;
    digest?: string;
    name: string;
}
export interface IResponse {
    error: number;
    msg: string;
    data?: WebSocket;
}
export interface IWsHandler {
    (wsResp: any): void;
}
export interface IDeviceResponse {
    error: number;
    deviceid: string;
    apikey: string;
    sequence: string;
    params?: any;
}
export interface ISendDeviceParams {
    action: 'upgrade' | 'update' | 'query';
    deviceid: string;
    apikey: string;
    userAgent: 'app' | 'device' | 'pc_ewelink';
    sequence: string;
    params: any;
    selfApikey?: string;
}
export type IReconnectEvent = IReconnectSuccess | IReconnectFail;
export interface IReconnectFail {
    error: EErrorCode;
    data: {
        totalTime: number;
        count: number;
    };
}
export interface IReconnectSuccess {
    error: 0;
    msg: string;
}
export interface IDispatchAppRes {
    error: number;
    reason: string;
    domain: string;
    IP: string;
    port: number;
}
export {};
