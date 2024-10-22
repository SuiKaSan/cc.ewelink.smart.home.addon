"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const WebSocket_1 = __importDefault(require("./WebSocket"));
const eventEmitter_1 = __importDefault(require("./../utils/eventEmitter"));
const enum_1 = require("../ts/enum");
class CoolKitWs {
    init(config) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if ((config.userAgent === 'app' || config.userAgent === 'pc_ewelink') && (!config.at || !config.apikey || !config.appid || !config.region)) {
                    throw new Error('CK_WS: missing some parameter for app agent');
                }
                if (config.userAgent === 'device' && (!config.region || !config.apikey || !config.deviceid)) {
                    throw new Error('CK_WS: missing some parameter for device agent');
                }
                const newWs = new WebSocket_1.default(config);
                const result = yield newWs.init();
                CoolKitWs.ws = newWs;
                return result;
            }
            catch (error) {
                throw new Error(`CK_WS: ws init error: ${error}`);
            }
        });
    }
    close() {
        const ws = this.getWs();
        ws.close(true);
    }
    isWsExist() {
        if (CoolKitWs.ws) {
            WebSocket_1.default.connectConfig.debug && console.log(`CK_WS: connect exist, and the state being: ${CoolKitWs.ws.wsState}`);
            if (CoolKitWs.ws.wsState === 'CLOSED') {
                CoolKitWs.ws = null;
                return false;
            }
            return true;
        }
        return false;
    }
    isWsConnected() {
        if (CoolKitWs.ws) {
            if (CoolKitWs.ws.wsState === 'CONNECTED') {
                return true;
            }
            WebSocket_1.default.connectConfig.debug && console.log(`CK_WS: the connect state being: ${CoolKitWs.ws.wsState}`);
            return false;
        }
        return false;
    }
    wsState() {
        if (CoolKitWs.ws) {
            return CoolKitWs.ws.wsState;
        }
        return null;
    }
    sendMessage(params) {
        const ws = this.getWs();
        ws.send(params);
    }
    updateThing(deviceConfig) {
        return __awaiter(this, void 0, void 0, function* () {
            const ws = this.getWs();
            const { deviceid, ownerApikey, params } = deviceConfig;
            if (!deviceid || !ownerApikey || !params) {
                throw new Error('CK_WS: all the parameters is not allowed to be null!');
            }
            const { sequence } = yield ws.sendThing(deviceConfig, 'update');
            return yield this.getMessage(sequence, deviceid);
        });
    }
    queryThing(queryConfig) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!CoolKitWs.ws || (CoolKitWs.ws && CoolKitWs.ws.wsState === 'CLOSED')) {
                return {
                    error: enum_1.EErrorCode.REQ_FAIL_OR_TIMEOUT,
                    msg: 'Websocket is closed.',
                };
            }
            const { deviceid, ownerApikey, params } = queryConfig;
            if (!deviceid || !ownerApikey || !params) {
                throw new Error('CK_WS: all the parameters is not allowed to be null!');
            }
            const { sequence } = yield CoolKitWs.ws.sendThing(queryConfig, 'query');
            return yield this.getMessage(sequence, deviceid);
        });
    }
    upgradeThing(upgradeConfig) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!CoolKitWs.ws || (CoolKitWs.ws && CoolKitWs.ws.wsState === 'CLOSED')) {
                return {
                    error: enum_1.EErrorCode.REQ_FAIL_OR_TIMEOUT,
                    msg: 'Websocket is closed.',
                };
            }
            const { deviceid, ownerApikey, params } = upgradeConfig;
            if (!deviceid || !ownerApikey || !params) {
                throw new Error('CK_WS: all the parameters is not allowed to be null!');
            }
            const { sequence } = yield CoolKitWs.ws.sendThing(upgradeConfig, 'upgrade');
            return yield this.getMessage(sequence, deviceid);
        });
    }
    on(method, callback) {
        return __awaiter(this, void 0, void 0, function* () {
            const ws = this.getWs();
            if (WebSocket_1.default.ws && ws) {
                if (method === 'reconnect') {
                    ws.updateCallback(`${enum_1.EOpenEventType.RECONNECT}`, (reconnectEvent) => callback(reconnectEvent));
                    eventEmitter_1.default.on(`${enum_1.EOpenEventType.RECONNECT}`, (reconnectEvent) => callback(reconnectEvent));
                    return;
                }
                ws.updateCallback(method, callback);
                eventEmitter_1.default.on(method, callback);
            }
        });
    }
    getMessage(sequence, deviceid) {
        return new Promise((resolve) => {
            const { reqTimeout = 15000 } = WebSocket_1.default.connectConfig;
            setTimeout(() => {
                resolve({
                    error: enum_1.EErrorCode.REQ_FAIL_OR_TIMEOUT,
                    msg: '请求超时',
                });
            }, reqTimeout);
            eventEmitter_1.default.once(`${enum_1.EEventType.DEVICE_MSG}${sequence}${deviceid}`, (data) => resolve(data));
        });
    }
    getWs() {
        if (CoolKitWs.ws) {
            return CoolKitWs.ws;
        }
        throw new Error('CK_WS: please init first!');
    }
}
CoolKitWs.ws = null;
exports.default = CoolKitWs;
