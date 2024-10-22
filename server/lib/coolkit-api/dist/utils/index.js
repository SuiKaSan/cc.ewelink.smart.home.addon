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
exports.getDomainByRegion = exports.getDomainByCountryCode = exports.sendRequest = exports.getExactUrl = exports.getCmsContent = void 0;
const crypto_js_1 = __importDefault(require("crypto-js"));
const axios_1 = __importDefault(require("axios"));
const store_1 = require("../store");
const regionMap_1 = require("./regionMap");
function getNonce() {
    const chars = [
        '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
        'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J',
        'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T',
        'U', 'V', 'W', 'X', 'Y', 'Z',
        'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j',
        'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't',
        'u', 'v', 'w', 'x', 'y', 'z',
    ];
    let nonce = '';
    for (let i = 0; i < 8; i++)
        nonce += chars[Math.ceil(Math.random() * (chars.length - 1))];
    return nonce;
}
function getAuthSign(method, params) {
    let str = '';
    let sign = '';
    if (method === 'GET') {
        const paramList = [];
        Object.keys(params)
            .sort()
            .forEach((key) => {
            paramList.push(`${key}=${params[key]}`);
        });
        str = paramList.join('&');
    }
    else {
        str = JSON.stringify(params);
    }
    if ((0, store_1.getDebug)()) {
        console.log(`authorization sign:\n${str}\n\n`);
    }
    let tmp = crypto_js_1.default.HmacSHA256(str, (0, store_1.getAppSecret)());
    sign = crypto_js_1.default.enc.Base64.stringify(tmp);
    return sign;
}
function getCmsContent(params) {
    return __awaiter(this, void 0, void 0, function* () {
        const { project, region, locale, type, category, modelName, fwVersion } = params;
        let url = `https://appcms${(0, store_1.getUseTestEnv)() ? '-test' : ''}.coolkit.cn/appcms-service/v2/${type}.json?project=${project}&region=${region}&locale=${locale}`;
        if (category) {
            url += `&category=${JSON.stringify(params.category).replace(/"/g, '%22')}`;
        }
        if (modelName) {
            url += `&modelName=${modelName}`;
        }
        if (fwVersion) {
            url += `&fwVersion=${fwVersion}`;
        }
        try {
            const res = yield axios_1.default.get(url);
            return {
                data: res.data.data,
                error: res.data.err,
                msg: res.data.msg
            };
        }
        catch (err) {
            console.log(err);
            return {
                error: 500,
                msg: 'axios error',
                data: {}
            };
        }
    });
}
exports.getCmsContent = getCmsContent;
function getExactUrl(url) {
    let result = '';
    const i = url.indexOf('?');
    if (i !== -1) {
        result = url.slice(0, i);
    }
    else {
        result = url;
    }
    return result;
}
exports.getExactUrl = getExactUrl;
function sendRequest(url, method, params, at) {
    return __awaiter(this, void 0, void 0, function* () {
        const blockList = (0, store_1.getBlockList)();
        if (Array.isArray(blockList) && blockList.length !== 0) {
            if (blockList.some((item) => ((item.method === method) && (item.url === getExactUrl(url))))) {
                return {
                    error: -1,
                    msg: 'this request has been blocked',
                    data: {}
                };
            }
        }
        const config = {
            url,
            method,
            baseURL: (0, store_1.getDomain)(),
            headers: {},
            timeout: (0, store_1.getTimeout)()
        };
        config.headers['X-CK-Nonce'] = getNonce();
        config.headers['X-CK-Appid'] = (0, store_1.getAppId)();
        if (at) {
            config.headers['Authorization'] = `Bearer ${at}`;
        }
        else {
            config.headers['Authorization'] = `Sign ${getAuthSign(method, params)}`;
        }
        if (method === 'POST' || method === 'PUT' || method === 'DELETE') {
            config.headers['Content-Type'] = 'application/json';
        }
        if (method === 'GET' && params) {
            config.params = params;
        }
        else if (params) {
            config.data = params;
        }
        if ((0, store_1.getDebug)()) {
            console.log(`axios config:\n${JSON.stringify(config, null, 4)}\n\n`);
        }
        try {
            const res = yield (0, axios_1.default)(config);
            if ((0, store_1.getDebug)()) {
                console.log(`axios response:\n${JSON.stringify(res.data, null, 4)}\n\n`);
            }
            if (res.data.error === 10004) {
                (0, store_1.setDomain)(getDomainByRegion(res.data.data.region));
                return yield sendRequest(url, method, params, at);
            }
            return res.data;
        }
        catch (e) {
            console.log('sendRequest() error:', method, url, e.message);
            return {
                error: 500,
                msg: 'axios error',
                data: {},
            };
        }
    });
}
exports.sendRequest = sendRequest;
function getDomainByCountryCode(code) {
    const useTestEnv = (0, store_1.getUseTestEnv)();
    if (useTestEnv) {
        return getDomainByRegion('test');
    }
    const ret = regionMap_1.regionMap.filter((item) => item.countryCode === code);
    if (ret.length === 0) {
        return '';
    }
    else {
        return getDomainByRegion(ret[0].region);
    }
}
exports.getDomainByCountryCode = getDomainByCountryCode;
function getDomainByRegion(region) {
    let result = '';
    switch (region) {
        case 'cn':
            result = 'https://cn-apia.coolkit.cn';
            break;
        case 'as':
            result = 'https://as-apia.coolkit.cc';
            break;
        case 'us':
            result = 'https://us-apia.coolkit.cc';
            break;
        case 'eu':
            result = 'https://eu-apia.coolkit.cc';
            break;
        case 'ir':
            result = 'https://ir-apia.coolkit.cc';
            break;
        case 'test':
            result = 'https://test-apia.coolkit.cn';
            break;
        default:
            result = '';
            break;
    }
    return result;
}
exports.getDomainByRegion = getDomainByRegion;
