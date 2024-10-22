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
exports.scene = void 0;
const store_1 = require("../../store");
const utils_1 = require("../../utils");
exports.scene = {
    getSceneList(params) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, utils_1.sendRequest)('/v2/smartscene2/list', 'POST', params, (0, store_1.getAt)());
        });
    },
    addScene(params) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, utils_1.sendRequest)('/v2/smartscene2', 'POST', params, (0, store_1.getAt)());
        });
    },
    updateScene(params) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, utils_1.sendRequest)('/v2/smartscene2', 'PUT', params, (0, store_1.getAt)());
        });
    },
    getSpecScene(params) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, utils_1.sendRequest)('/v2/smartscene2/thelist', 'POST', params, (0, store_1.getAt)());
        });
    },
    deleteScene(params) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, utils_1.sendRequest)(`/v2/smartscene2?id=${params.id}`, 'DELETE', {}, (0, store_1.getAt)());
        });
    },
    setDeviceFeature(params) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, utils_1.sendRequest)('/v2/smartscene2/device-feature', 'POST', params, (0, store_1.getAt)());
        });
    },
    execDeviceFeature(params) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, utils_1.sendRequest)('/v2/smartscene2/device-feature/execute', 'POST', params, (0, store_1.getAt)());
        });
    },
    getMyScene(params) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, utils_1.sendRequest)('/v2/smartscene2/my-scene', 'POST', params, (0, store_1.getAt)());
        });
    },
    getSceneHistoryList(params) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, utils_1.sendRequest)('/v2/smartscene2/history-list', 'POST', params, (0, store_1.getAt)());
        });
    },
    sortScene(params) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, utils_1.sendRequest)('/v2/smartscene2/sort', 'POST', params, (0, store_1.getAt)());
        });
    },
    execScene(params) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, utils_1.sendRequest)('/v2/smartscene2/execute', 'POST', params, (0, store_1.getAt)());
        });
    },
    getExecHistory(params) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, utils_1.sendRequest)('/v2/smartscene2/history', 'POST', params, (0, store_1.getAt)());
        });
    },
    extSceneList(params) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, utils_1.sendRequest)('/v2/smartscene2/ext-scene', 'POST', params, (0, store_1.getAt)());
        });
    },
    getWebhookUrl() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, utils_1.sendRequest)('/v2/smartscene2/webhooks/url', 'GET', null, (0, store_1.getAt)());
        });
    },
    setWebhookAndScene(params) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, utils_1.sendRequest)('/v2/smartscene2/webhooks', 'POST', params, (0, store_1.getAt)());
        });
    },
    getWebhookAndScene() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, utils_1.sendRequest)('/v2/smartscene2/webhooks', 'GET', null, (0, store_1.getAt)());
        });
    },
    executeWebhook(params) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, utils_1.sendRequest)('/v2/smartscene2/webhooks/execute', 'GET', params, (0, store_1.getAt)());
        });
    }
};
