"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBlockList = exports.setBlockList = exports.getTimeout = exports.setTimeout = exports.getUseTestEnv = exports.setUseTestEnv = exports.getDebug = exports.setDebug = exports.getRt = exports.setRt = exports.getAt = exports.setAt = exports.getDomain = exports.setDomain = exports.getAppSecret = exports.setAppSecret = exports.getAppId = exports.setAppId = exports.showStore = void 0;
const store = {
    appId: '',
    appSecret: '',
    domain: '',
    at: '',
    rt: '',
    debug: false,
    useTestEnv: false,
    timeout: 15000,
    blockList: []
};
function showStore() {
    console.log(store);
}
exports.showStore = showStore;
function setAppId(v) {
    store.appId = v;
}
exports.setAppId = setAppId;
function getAppId() {
    return store.appId;
}
exports.getAppId = getAppId;
function setAppSecret(v) {
    store.appSecret = v;
}
exports.setAppSecret = setAppSecret;
function getAppSecret() {
    return store.appSecret;
}
exports.getAppSecret = getAppSecret;
function setDomain(v) {
    store.domain = v;
}
exports.setDomain = setDomain;
function getDomain() {
    return store.domain;
}
exports.getDomain = getDomain;
function setAt(v) {
    store.at = v;
}
exports.setAt = setAt;
function getAt() {
    return store.at;
}
exports.getAt = getAt;
function setRt(v) {
    store.rt = v;
}
exports.setRt = setRt;
function getRt() {
    return store.rt;
}
exports.getRt = getRt;
function setDebug(v) {
    store.debug = v;
}
exports.setDebug = setDebug;
function getDebug() {
    return store.debug;
}
exports.getDebug = getDebug;
function setUseTestEnv(v) {
    store.useTestEnv = v;
}
exports.setUseTestEnv = setUseTestEnv;
function getUseTestEnv() {
    return store.useTestEnv;
}
exports.getUseTestEnv = getUseTestEnv;
function setTimeout(v) {
    store.timeout = v;
}
exports.setTimeout = setTimeout;
function getTimeout() {
    return store.timeout;
}
exports.getTimeout = getTimeout;
function setBlockList(v) {
    store.blockList = v;
}
exports.setBlockList = setBlockList;
function getBlockList() {
    return store.blockList;
}
exports.getBlockList = getBlockList;
