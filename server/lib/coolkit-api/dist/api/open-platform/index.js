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
Object.defineProperty(exports, "__esModule", { value: true });
exports.openPlatform = void 0;
const store_1 = require("../../store");
const utils_1 = require("../../utils");
exports.openPlatform = {
    getAuthInfo() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, utils_1.sendRequest)('/v2/open-platform/authentication', 'GET', null, (0, store_1.getAt)());
        });
    },
    applyAuth(params) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, utils_1.sendRequest)('/v2/open-platform/authentication', 'POST', params, (0, store_1.getAt)());
        });
    },
    createApp(params) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, utils_1.sendRequest)('/v2/open-platform/application', 'POST', params, (0, store_1.getAt)());
        });
    },
    removeApp(params) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, utils_1.sendRequest)(`/v2/open-platform/application?appid=${params.appid}`, 'DELETE', null, (0, store_1.getAt)());
        });
    },
    updateApp(params) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, utils_1.sendRequest)('/v2/open-platform/application', 'PUT', params, (0, store_1.getAt)());
        });
    },
    getAppList() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, utils_1.sendRequest)('/v2/open-platform/application', 'GET', null, (0, store_1.getAt)());
        });
    }
};
