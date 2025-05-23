import { showStore, setBlockList } from './store';
import { type CoolkitEnergy } from './api';
import { getCmsContent } from './utils';
declare function init(params: {
    appId: string;
    appSecret: string;
    debug?: boolean;
    useTestEnv?: boolean;
    at?: string;
    rt?: string;
    countryCode?: string;
    timeout?: number;
    region?: string;
}): void;
declare const _default: {
    init: typeof init;
    showStore: typeof showStore;
    user: {
        login(params: {
            lang?: import("./api").MsgLang | undefined;
            countryCode: string;
            email?: string | undefined;
            phoneNumber?: string | undefined;
            password: string;
        }): Promise<import("./api/user").CommonUserResponse>;
        logout(): Promise<import("./api").ApiResponse>;
        changePwd(params: {
            oldPassword: string;
            newPassword: string;
        }): Promise<import("./api").ApiResponse>;
        getProfile(): Promise<{
            error: number;
            msg: string;
            data: {
                user: import("./api/user").UserInfo;
                region: import("./api/user").RegionType;
            };
        }>;
        updateProfile(params: {
            nickname?: string | undefined;
            acceptEmailAd?: boolean | undefined;
            accountConsult?: boolean | undefined;
            mpUserData?: any;
            language?: string | undefined;
            lang?: string | undefined;
            setupIwatch?: boolean | undefined;
        }): Promise<import("./api").ApiResponse>;
        refresh(): Promise<{
            error: number;
            msg: string;
            data: {
                at: string;
                rt: string;
            };
        }>;
        register(params: {
            countryCode: string;
            email?: string | undefined;
            phoneNumber?: string | undefined;
            verificationCode: string;
            password: string;
        }): Promise<import("./api/user").CommonUserResponse>;
        sendVerificationCode(params: {
            type: number;
            email?: string | undefined;
            phoneNumber?: string | undefined;
        }): Promise<import("./api").ApiResponse>;
        smsLogin(params: {
            countryCode: string;
            lang?: import("./api").MsgLang | undefined;
            phoneNumber: string;
            verificationCode: string;
        }): Promise<import("./api/user").CommonUserResponse>;
        resetPwd(params: {
            email?: string | undefined;
            phoneNumber?: string | undefined;
            verificationCode: string;
            password: string;
        }): Promise<import("./api/user").CommonUserResponse>;
        closeAccount(params: {
            verificationCode: string;
        }): Promise<import("./api").ApiResponse>;
        verifyAccount(params: {
            email?: string | undefined;
            phoneNumber?: string | undefined;
            password: string;
            operation: number;
            extraInfo?: {
                sso?: string | undefined;
                sig?: string | undefined;
            } | undefined;
        }): Promise<{
            error: number;
            msg: string;
            data: {
                redirectUrl?: string | undefined;
            };
        }>;
        trialMembership(params: {
            email?: string | undefined;
            phoneNumber?: string | undefined;
        }): Promise<import("./api").ApiResponse>;
        getQrCode(params: {
            type: string;
            extra?: {
                oldCode?: string | undefined;
            } | undefined;
        }): Promise<{
            error: number;
            msg: string;
            data: {
                code: string;
                region: string;
                status: string;
                extra: {
                    applicantName?: string | undefined;
                };
            };
        }>;
        getQrCodeStatus(params: {
            code: string;
        }): Promise<{
            error: number;
            msg: string;
            data: {
                status: string;
                extra: {
                    at?: string | undefined;
                    rt?: string | undefined;
                    user?: import("./api/user").UserInfo | undefined;
                    deviceInfo?: any;
                    endpointId?: string | undefined;
                    userRegion?: string | undefined;
                    clientId?: string | undefined;
                };
            };
        }>;
        getCastList(): Promise<{
            error: number;
            msg: string;
            data: {
                _id: string;
                subject: {
                    weather: {
                        geo: string;
                        cityId: string;
                        cityName: string;
                    };
                    calendar: boolean;
                };
                charts: string[];
                things: string[];
                cookie?: any;
                scenes: string[];
                name: string;
                setting?: {
                    backgroundColor: string;
                } | undefined;
                index?: number | undefined;
                cameras?: string[] | undefined;
                apikey: string;
                __v: number;
            }[];
        }>;
        addCast(params: {
            name: string;
            things?: string[] | undefined;
            cookie?: any;
            scenes?: string[] | undefined;
            pinCode?: string | undefined;
            charts?: string[] | undefined;
            subject: {
                calendar?: boolean | undefined;
                weather?: {
                    geo: string;
                    cityName?: string | undefined;
                } | undefined;
            };
            setting?: {
                backgroundColor: string;
            } | undefined;
            cameras?: string[] | undefined;
            index?: number | undefined;
        }): Promise<import("./api").ApiResponse>;
        castLogin(params: {
            lang?: import("./api").MsgLang | undefined;
            countryCode: string;
            email?: string | undefined;
            phoneNumber?: string | undefined;
            password: string;
        }): Promise<{
            error: number;
            msg: string;
            data?: {
                user: import("./api/user").UserInfo;
                at: string;
                rt: string;
                region: import("./api/user").RegionType;
                clientId: string;
            } | undefined;
        }>;
        editCast(params: {
            id: string;
            name: string;
            things?: string[] | undefined;
            scenes?: string[] | undefined;
            cookie?: any;
            pinCode?: string | undefined;
            charts?: string[] | undefined;
            subject?: {
                calendar?: boolean | undefined;
                weather?: {
                    geo: string;
                    cityName: string;
                } | undefined;
            } | undefined;
            setting?: {
                backgroundColor: string;
            } | undefined;
            cameras?: string[] | undefined;
            index?: number | undefined;
        }): Promise<import("./api").ApiResponse>;
        removeCast(params: {
            id: string;
        }): Promise<import("./api").ApiResponse>;
        editMultiCast(params: {
            id: string;
            name?: string | undefined;
            things?: string[] | undefined;
            cookie?: any;
            scenes?: string[] | undefined;
            pinCode?: string | undefined;
            charts?: string[] | undefined;
            subject?: {
                calendar?: boolean | undefined;
                weather?: {
                    geo: string;
                    cityName: string;
                } | undefined;
            } | undefined;
            setting?: {
                backgroundColor: string;
            } | undefined;
            cameras?: string[] | undefined;
            index?: number | undefined;
        }[]): Promise<import("./api").ApiResponse>;
    };
    home: {
        homepage(params?: {
            lang?: import("./api").MsgLang | undefined;
            clientInfo?: {
                model?: string | undefined;
                os?: string | undefined;
                imei?: string | undefined;
                romVersion?: string | undefined;
                appVersion?: string | undefined;
            } | undefined;
            getUser?: {} | undefined;
            getFamily?: {} | undefined;
            getThing?: {
                num?: number | undefined;
                beginIndex?: number | undefined;
            } | undefined;
            getScene?: {} | undefined;
            getMessage?: {
                from?: number | undefined;
                num?: number | undefined;
            } | undefined;
        } | undefined): Promise<{
            error: number;
            msg: string;
            data: {
                userInfo?: import("./api/user").UserInfo | undefined;
                familyInfo?: import("./api/family").FamilyItem | undefined;
                thingInfo?: {
                    thingList: (import("./api/device").DeviceListItemD | import("./api/device").DeviceListItemG)[];
                    total: number;
                } | undefined;
                sceneInfo?: any;
                messageInfo?: {
                    messageList: import("./api/message").MessageItem[];
                } | undefined;
            };
        }>;
    };
    device: {
        getThingList(params?: {
            lang?: import("./api").MsgLang | undefined;
            familyid?: string | undefined;
            num?: number | undefined;
            beginIndex?: number | undefined;
        } | undefined): Promise<{
            error: number;
            msg: string;
            data: {
                thingList: (import("./api/device").DeviceListItemD | import("./api/device").DeviceListItemG)[];
                total: number;
            };
        }>;
        getSpecThingList(params: {
            thingList: {
                itemType?: number | undefined;
                id: string;
            }[];
        }): Promise<{
            error: number;
            msg: string;
            data: {
                thingList: (import("./api/device").DeviceListItemD | import("./api/device").DeviceListItemG)[];
            };
        }>;
        getThingStatus(params: {
            type: 2 | 1;
            id: string;
            params?: string | undefined;
        }): Promise<{
            error: number;
            msg: string;
            data: {
                params: any;
            };
        }>;
        updateThingStatus(params: {
            type: 2 | 1;
            id: string;
            params: any;
        }): Promise<import("./api").ApiResponse>;
        updateMultiThingStatus(params: {
            thingList: {
                type: 2 | 1;
                id: string;
                params: any;
            }[];
            timeout?: number | undefined;
        }): Promise<{
            error: number;
            msg: string;
            data: {
                respList: {
                    type: 2 | 1;
                    id: string;
                    error: number;
                }[];
            };
        }>;
        addWifiDevice(params: {
            name: string;
            deviceid: string;
            settings?: {
                opsNotify?: number | undefined;
                opsHistory?: number | undefined;
                alarmNotify?: number | undefined;
            } | undefined;
            ifrCode?: string | undefined;
            digest: string;
            chipid?: string | undefined;
            familyid?: string | undefined;
            roomid?: string | undefined;
            sort?: number | undefined;
        }): Promise<{
            error: number;
            msg: string;
            data: {
                itemType: number;
                itemData: import("./api/device").DeviceListItem;
                index: number;
            };
        }>;
        addGsmDevice(params: {
            id: string;
            name: string;
            familyid?: string | undefined;
            roomid?: string | undefined;
            sort?: number | undefined;
        }): Promise<import("./api").ApiResponse>;
        updateDeviceInfo(params: {
            deviceid: string;
            name?: string | undefined;
            familyid?: string | undefined;
            roomid?: string | undefined;
        }): Promise<import("./api").ApiResponse>;
        delDevice(params: {
            deviceid: string;
        }): Promise<import("./api").ApiResponse>;
        updateDeviceTag(params: {
            deviceid: string;
            type?: "replace" | "merge" | undefined;
            tags: any;
        }): Promise<{
            error: number;
            msg: string;
            data: {
                updatedThing: any;
            };
        }>;
        getGroupList(params?: {
            lang?: import("./api").MsgLang | undefined;
        } | undefined): Promise<{
            error: number;
            msg: string;
            data: {
                groupList: {
                    itemType: number;
                    itemData: {
                        id: string;
                        name: string;
                        mainDeviceId: string;
                        family: import("./api/device").FamilyItem;
                        params: any;
                    };
                    index: number;
                }[];
            };
        }>;
        addGroup(params: {
            name: string;
            mainDeviceId: string;
            familyid?: string | undefined;
            roomid?: string | undefined;
            sort?: number | undefined;
            deviceidList?: string[] | undefined;
        }): Promise<{
            error: number;
            msg: string;
            data: {
                itemType: number;
                itemData: import("./api/device").GroupListItem;
                index: number;
            };
        }>;
        updateGroup(params: {
            id: string;
            name: string;
        }): Promise<import("./api").ApiResponse>;
        delGroup(params: {
            id: string;
        }): Promise<import("./api").ApiResponse>;
        updateGroupStatus(params: {
            id: string;
            params: any;
        }): Promise<import("./api").ApiResponse>;
        getAlarmHistory(params: {
            deviceid: string;
            type: string;
            from?: number | undefined;
            num?: number | undefined;
            rfChls?: string | undefined;
        }): Promise<{
            error: number;
            msg: string;
            data: {
                alarmHistories: {
                    request: string;
                    opsTime: number;
                    userAgent: string;
                    rfChl?: number | undefined;
                    opsSwitchs?: string[] | undefined;
                    opsAccount?: string | undefined;
                    triggerType?: number | undefined;
                }[];
            };
        }>;
        addGroupDevice(params: {
            id: string;
            deviceidList: string[];
        }): Promise<{
            error: number;
            msg: string;
            data: {
                updatedThingList: any[];
            };
        }>;
        delGroupDevice(params: {
            id: string;
            deviceidList: string[];
        }): Promise<{
            error: number;
            msg: string;
            data: {
                updatedThingList: any[];
            };
        }>;
        updateGroupList(params: {
            id: string;
            deviceidList: string[];
        }): Promise<{
            error: number;
            msg: string;
            data: {
                updatedThingList: any[];
            };
        }>;
        shareDevice(params: {
            deviceidList: string[];
            user: {
                countryCode?: string | undefined;
                phoneNumber?: string | undefined;
                email?: string | undefined;
            };
            permit: number;
            comment?: string | undefined;
            shareType?: number | undefined;
        }): Promise<{
            error: number;
            msg: string;
            data: {
                updatedThingList: any[];
            };
        }>;
        updateSharePermit(params: {
            deviceid: string;
            apikey: string;
            permit: number;
        }): Promise<{
            error: number;
            msg: string;
            data: {
                updatedThingList: any[];
            };
        }>;
        cancelShare(params: {
            deviceid: string;
            apikey: string;
        }): Promise<{
            error: number;
            msg: string;
            data: {
                updatedThingList: any[];
            };
        }>;
        getHistory(params: {
            deviceid: string;
            from?: number | undefined;
            num?: number | undefined;
        }): Promise<{
            error: number;
            msg: string;
            data: {
                histories: {
                    deviceid: string;
                    userAgent?: string | undefined;
                    opsSwitchs?: string | undefined;
                    request: string;
                    opsAccount?: string | undefined;
                    opsTime: number;
                }[];
            };
        }>;
        delHistory(params: {
            deviceid: string;
        }): Promise<import("./api").ApiResponse>;
        getOtaInfo(params: {
            deviceInfoList: {
                deviceid: string;
                model: string;
                version: string;
            }[];
        }): Promise<{
            error: number;
            msg: string;
            data: {
                otaInfoList: {
                    deviceid: string;
                    version: string;
                    binList: {
                        name: string;
                        downloadUrl: string;
                        digest?: string | undefined;
                    }[];
                    type: string;
                    forceTime: string;
                }[];
            };
        }>;
        addThirdPartyDevice(params: {
            accessToken?: string | undefined;
            puid?: string | undefined;
            partnerDevice: any[];
            type: number;
            familyid?: string | undefined;
            roomid?: string | undefined;
            sort?: number | undefined;
        }): Promise<{
            error: number;
            msg: string;
            data: {
                thingList: {
                    itemType: number;
                    itemData: import("./api/device").DeviceListItem;
                    index: number;
                }[];
            };
        }>;
        updateDeviceSettings(params: {
            deviceidList: string[];
            settings: import("./api/device").DeviceSettings;
        }): Promise<{
            error: number;
            msg: string;
            data: {
                updatedThingList: any[];
            };
        }>;
        getDeviceUsage(params: {
            deviceid: string;
            last: string;
            dateType: string;
            format?: string | undefined;
        }): Promise<{
            error: number;
            msg: string;
            data: {
                temperature?: {
                    hourly?: number[] | undefined;
                    daily?: {
                        min?: number | undefined;
                        max?: number | undefined;
                        avg?: number | undefined;
                    }[] | undefined;
                    monthly?: {
                        min?: number | undefined;
                        max?: number | undefined;
                        avg?: number | undefined;
                    }[] | undefined;
                } | undefined;
                humidity?: {
                    hourly: number[];
                    daily: {
                        min?: number | undefined;
                        max?: number | undefined;
                    }[];
                    monthly: {
                        min?: number | undefined;
                        max?: number | undefined;
                    }[];
                } | undefined;
                targetTemperature?: {
                    hourly: number[];
                    daily: {
                        avg?: number | undefined;
                    }[];
                    monthly: {
                        avg?: number | undefined;
                    }[];
                } | undefined;
                gasUsage?: {
                    hourly: number[];
                    daily: {
                        avg?: number | undefined;
                    }[];
                    monthly: {
                        avg?: number | undefined;
                    }[];
                } | undefined;
                hourlyData?: {
                    date: string;
                    time: string;
                    temperature?: string | undefined;
                    humidity?: string | undefined;
                    targetTemperature?: string | undefined;
                    gasUsage?: string | undefined;
                }[] | undefined;
            };
        }>;
        getTempHumHistory(params: {
            deviceid: string;
            last: string;
            format?: string | undefined;
        }): Promise<{
            error: number;
            msg: string;
            data: {
                tempHistory?: {
                    hourly: number[];
                    daily: {
                        min: number;
                        max: number;
                    }[];
                    monthly: {
                        min: number;
                        max: number;
                    }[];
                } | undefined;
                humHistory?: {
                    hourly: number[];
                    daily: {
                        min: number;
                        max: number;
                    }[];
                    monthly: {
                        min: number;
                        max: number;
                    }[];
                } | undefined;
                originalTempHumHistory: {
                    date: string;
                    time: string;
                    temperature: string | number;
                    humidity: string | number;
                }[];
            };
        }>;
        getMatterNodesReachableHubs(params: {
            deviceIds: string;
            includeOfflineHub?: boolean | undefined;
        }): Promise<{
            error: number;
            msg: string;
            data: {
                hubs: {
                    matterNodeId: string;
                    deviceId: string;
                    online: boolean;
                    name: string;
                    familyId: string;
                    familyName: string;
                    roomId?: string | undefined;
                    roomName?: string | undefined;
                }[];
            };
        }>;
    };
    family: {
        getFamilyList(params: {
            lang?: import("./api").MsgLang | undefined;
        }): Promise<{
            error: number;
            msg: string;
            data: {
                familyList: import("./api/family").FamilyItem[];
                currentFamilyId: string;
            };
        }>;
        addFamily(params: {
            name: string;
            sort: import("./api/family").SortType;
            roomNameList?: string[] | undefined;
        }): Promise<{
            error: number;
            msg: string;
            data: {
                id: string;
                name: string;
                index: number;
                roomList?: import("./api/family").RoomItem[] | undefined;
            };
        }>;
        addRoom(params: {
            familyid: string;
            name: string;
            sort: import("./api/family").SortType;
        }): Promise<{
            error: number;
            msg: string;
            data: {
                id: string;
                name: string;
                index: number;
            };
        }>;
        updateFamily(params: {
            id?: string | undefined;
            name: string;
        }): Promise<import("./api").ApiResponse>;
        updateRoom(params: {
            id: string;
            name: string;
        }): Promise<import("./api").ApiResponse>;
        sortRoom(params: {
            familyid?: string | undefined;
            idList: string[];
        }): Promise<import("./api").ApiResponse>;
        delFamily(params: {
            id: string;
            deviceFamily: string;
            switchFamily: string;
        }): Promise<import("./api").ApiResponse>;
        delRoom(params: {
            id: string;
        }): Promise<import("./api").ApiResponse>;
        sortThing(params: {
            familyid?: string | undefined;
            thingList: import("./api/family").ThingItem[];
        }): Promise<import("./api").ApiResponse>;
        setThing(params: {
            roomid: string;
            oldThingList: import("./api/family").ThingItem[];
            newThingList: import("./api/family").ThingItem[];
        }): Promise<import("./api").ApiResponse>;
        changeFamily(params: {
            id: string;
        }): Promise<import("./api").ApiResponse>;
        addShareFamily(params: {
            familyid: string;
            user: {
                countryCode?: string | undefined;
                phoneNumber?: string | undefined;
                email?: string | undefined;
            };
            comment?: string | undefined;
            shareType: number;
        }): Promise<import("./api").ApiResponse>;
        delShareFamily(params: {
            familyid: string;
            apikey: string;
        }): Promise<import("./api").ApiResponse>;
    };
    message: {
        getMessageList(params?: {
            familyid?: string | undefined;
            from?: number | undefined;
            num?: number | undefined;
        } | undefined): Promise<{
            error: number;
            msg: string;
            data: {
                messageList: import("./api/message").MessageItem[];
            };
        }>;
    };
    scene: {
        getSceneList(params: {
            familyid?: string | undefined;
            manual?: {
                num?: number | undefined;
                beginIndex?: number | undefined;
            } | undefined;
            condition?: {
                num?: number | undefined;
                beginIndex?: number | undefined;
            } | undefined;
            iwatch?: boolean | undefined;
            associatedWebhook?: boolean | undefined;
        }): Promise<{
            error: number;
            msg: string;
            data: {
                manualScenes: import("./api/scene").SceneComplex[];
                conditionScenes: import("./api/scene").SceneComplex[];
                iwatchScenes: import("./api/scene").SceneSimple[];
            };
        }>;
        addScene(params: {
            name: string;
            familyid?: string | undefined;
            sort?: number | undefined;
            sceneType: import("./api/scene").SceneType;
            condition?: {
                type: "and" | "or";
                disable?: boolean | undefined;
                triggers: {
                    triggerType: "device" | "timer" | "sun";
                    deviceInfo?: {
                        deviceid: string;
                        expression: string;
                    } | undefined;
                    timerInfo?: {
                        type: "oneShot" | "dayOfWeek";
                        oneShotTimestamp?: number | undefined;
                        dayOfWeek?: {
                            days: number[];
                            hour: number;
                            minute: number;
                            zone: number;
                        } | undefined;
                    } | undefined;
                    sunInfo?: {
                        type: "set" | "rise";
                        location: string;
                        extraInfo: string;
                    } | undefined;
                }[];
            } | undefined;
            operations: {
                actionType: string;
                deviceInfo?: {
                    deviceid: string;
                    params: any;
                } | undefined;
                delayInfo?: {
                    seconds: number;
                } | undefined;
                sceneInfo?: {
                    id: string;
                    action: string;
                } | undefined;
                localDeviceInfo?: {
                    localType: string;
                    deviceid: string;
                    params: any;
                } | undefined;
            }[];
            optRanges?: {
                name?: string | undefined;
                week: number[];
                startHour: number;
                startMin: number;
                endHour: number;
                endMin: number;
                zone: number;
                optTime: string;
            }[] | undefined;
            iconIndex?: number | undefined;
            notify?: boolean | undefined;
            associatedWebhook?: boolean | undefined;
        }): Promise<{
            error: number;
            msg: string;
            data: {
                id: string;
                index: number;
            };
        }>;
        updateScene(params: {
            id: string;
            name?: string | undefined;
            sceneType?: import("./api/scene").SceneType | undefined;
            condition?: any;
            operations?: any[] | undefined;
            optRanges?: any[] | undefined;
            iconIndex?: number | undefined;
            notify?: boolean | undefined;
            associatedWebhook?: boolean | undefined;
        }): Promise<{
            error: number;
            msg: string;
            data: {
                id: string;
                index: number;
            };
        }>;
        getSpecScene(params: {
            sceneIds: string[];
        }): Promise<{
            error: number;
            msg: string;
            data: {
                scenes: any[];
            };
        }>;
        deleteScene(params: {
            id: string;
        }): Promise<import("./api").ApiResponse>;
        setDeviceFeature(params: {
            deviceid: string;
            sceneId?: string | undefined;
            trigger?: any;
            operation?: any;
            optRanges?: any;
        }): Promise<{
            error: number;
            msg: string;
            data: {
                sceneId: string;
                trigger: any;
                operation: any;
            };
        }>;
        execDeviceFeature(params: {
            sceneId: string;
            info: any;
        }): Promise<{
            error: number;
            msg: string;
            data: {
                sceneId: string;
                trigger: any;
                operation: any;
            };
        }>;
        getMyScene(params: {
            page: number;
            size: number;
            versionTag: string;
        }): Promise<{
            error: number;
            msg: string;
            data: {
                scenes: {
                    id: string;
                    name: string;
                    familyid: string;
                    familyName: string;
                    index: number;
                    sceneType: string;
                    condition?: any;
                    operations: any;
                    iconIndex: number;
                    showOnHomepage: boolean;
                    notify: boolean;
                    handlerType: string;
                }[];
            };
        }>;
        getSceneHistoryList(params: {
            from?: number | undefined;
            num?: number | undefined;
            versionTag: string;
            associatedWebhook?: boolean | undefined;
        }): Promise<{
            error: number;
            msg: string;
            data: {
                histories: {
                    triggerType: string;
                    operations: any[];
                    ts: number;
                    sceneName: string;
                }[];
            };
        }>;
        sortScene(params: {
            familyid?: string | undefined;
            sceneType: import("./api/scene").SceneType;
            idList: string[];
        }): Promise<import("./api").ApiResponse>;
        execScene(params: {
            id: string;
            localDevice?: boolean | undefined;
        }): Promise<import("./api").ApiResponse>;
        getExecHistory(params: {
            id: string;
            from?: number | undefined;
            num?: number | undefined;
        }): Promise<{
            error: number;
            msg: string;
            data: {
                histories: {
                    triggerType: "manual" | "condition" | "scene";
                    triggers?: any[] | undefined;
                    scene?: {
                        id: string;
                        name: string;
                    } | undefined;
                    operations: {
                        actionType: "device" | "scene" | "delay" | "localDevice";
                        deviceInfo?: any;
                        delayInfo?: any;
                        sceneInfo?: any;
                        localDeviceInfo?: any;
                        error: number;
                        ts: number;
                    }[];
                    ts: number;
                }[];
            };
        }>;
        extSceneList(params: {
            familyid?: string | undefined;
            extType: string;
            sceneList: any[];
        }): Promise<{
            error: number;
            msg: string;
            data: {
                id: string;
            };
        }>;
        getWebhookUrl(): Promise<{
            error: number;
            msg: string;
            data: {
                webhookUrl: string;
            };
        }>;
        setWebhookAndScene(params: {
            bindingList: {
                webhookUrl: string;
                sceneId?: string | undefined;
            }[];
        }): Promise<import("./api").ApiResponse>;
        getWebhookAndScene(): Promise<{
            error: number;
            msg: string;
            data: {
                bindingList?: {
                    webhookUrl: string;
                    sceneId?: string | undefined;
                }[] | undefined;
            };
        }>;
        executeWebhook(params: {
            id: string;
        }): Promise<import("./api").ApiResponse>;
    };
    other: {
        uploadQuestionnaire(params: {
            type: string;
            from: string;
            duration: number;
            data: import("./api/other").QuestionnaireData[];
        }): Promise<import("./api").ApiResponse>;
        commonStatistics(params: import("./api/other").CommonStatisticsParamsCameraApp | import("./api/other").CommonStatisticsParamsCameraDockerGateway | import("./api/other").CommonStatisticsParamsMembershipIAP | import("./api/other").CommonStatisticsParamsOtaUpgradeReminder): Promise<import("./api").ApiResponse>;
        getThirdPlatformAuthCode(params: {
            platform: string;
            clientId: string;
            data: any;
        }): Promise<{
            error: number;
            msg: string;
            data: {
                code?: string | undefined;
                expiredAt?: number | undefined;
                extra?: any;
            };
        }>;
        getThirdpartyDevicesStatus(params: {
            thirdparty: string;
            deviceids: string[];
        }): Promise<{
            error: number;
            msg: string;
            data: {
                devices: {
                    deviceid: string;
                    online: boolean;
                    params: any;
                }[];
            };
        }>;
        getUploadFileS3PreSignUrl(params: {
            from: string;
            type: string;
            data?: any;
        }): Promise<{
            error: number;
            msg: string;
            data: {
                url: string;
                fields: {
                    key: string;
                    bucket: string;
                    'X-Amz-Algorithm': string;
                    'X-Amz-Credential': string;
                    'X-Amz-Date': string;
                    'X-Amz-Security-Token': string;
                    Policy: string;
                    'X-Amz-Signature': string;
                };
            };
        }>;
        eventTracking(params: {
            events: any[];
        }): Promise<import("./api").ApiResponse>;
        getCity(params: {
            location: string;
            langTag: string;
        }): Promise<{
            error: number;
            msg: string;
            data: {
                locations: {
                    country: string;
                    adm1: string;
                    adm2: string;
                    name: string;
                    lat: string;
                    lon: string;
                }[];
            };
        }>;
        getCityInfo(params: {
            geo?: string | undefined;
            cityId?: string | undefined;
            days?: number | undefined;
        }): Promise<{
            error: number;
            msg: string;
            data: {
                cityId: string;
                timeZone: number;
                dst: number;
                dstChange: string;
                temperature: number;
                tempRange: string;
                weather: number;
                officialIcon: string | number;
                forecasts: {
                    date: string;
                    weather: number;
                    officialIcon: string | number;
                    tempRange: string;
                }[];
                lastUpdatedAt: number;
            };
        }>;
    };
    openPlatform: {
        getAuthInfo(): Promise<{
            error: number;
            msg: string;
            data: {
                personal?: {
                    name?: string | undefined;
                    email?: string | undefined;
                    phoneNumber?: string | undefined;
                    identifyNumber?: string | undefined;
                    job: string;
                } | undefined;
                company?: {
                    name: string;
                    email: string;
                    phoneNumber?: string | undefined;
                    companyName?: string | undefined;
                    unifiedSocialCreditCode?: string | undefined;
                    legalPersonName?: string | undefined;
                    companyType?: string | undefined;
                    officialWebsite?: string | undefined;
                    companyBusinessInsights: string;
                    address: string;
                    businessLicenseKeys?: {
                        url: string;
                        key: string;
                    }[] | undefined;
                    postalCode?: string | undefined;
                    fax?: string | undefined;
                } | undefined;
                status: string;
                reason?: string | undefined;
            };
        }>;
        applyAuth(params: {
            personal?: {
                name?: string | undefined;
                email?: string | undefined;
                phoneNumber?: string | undefined;
                identifyNumber?: string | undefined;
                job: string;
            } | undefined;
            company?: {
                name: string;
                email: string;
                phoneNumber?: string | undefined;
                companyName: string;
                unifiedSocialCreditCode?: string | undefined;
                legalPersonName?: string | undefined;
                companyType?: string | undefined;
                officialWebsite?: string | undefined;
                companyBusinessInsights: string;
                address: string;
                businessLicenseKeys?: string[] | undefined;
                postalCode?: string | undefined;
                fax?: string | undefined;
            } | undefined;
        }): Promise<import("./api").ApiResponse>;
        createApp(params: {
            name: string;
            description: string;
            redirectURL: string;
        }): Promise<{
            error: number;
            msg: string;
            data: {
                appid: string;
                appSecret: string;
            };
        }>;
        removeApp(params: {
            appid: string;
        }): Promise<import("./api").ApiResponse>;
        updateApp(params: {
            appid: string;
            name: string;
            description: string;
            redirectURL: string;
        }): Promise<import("./api").ApiResponse>;
        getAppList(): Promise<{
            error: number;
            msg: string;
            data: {
                applicationList: {
                    appid: string;
                    appSecret: string;
                    name: string;
                    description: string;
                    redirectURL: string;
                    createdAt: string;
                    expiredAt: string;
                }[];
                creatingList?: string[] | undefined;
            };
        }>;
    };
    energy: {
        getDeviceEnergyGroup(params: {
            deviceid?: string | undefined;
        }): Promise<CoolkitEnergy.IDeviceEnergyResp<CoolkitEnergy.IGetDeviceEnergyGroupResp[]>>;
        deleteDeviceEnergyGroup(params: {
            id: string;
        }): Promise<CoolkitEnergy.IDeviceEnergyResp<any>>;
        createDeviceEnergyGroup(params: CoolkitEnergy.ICreateDeviceEnergyReq): Promise<CoolkitEnergy.IDeviceEnergyResp<CoolkitEnergy.ICreateDeviceEnergyGroupResp>>;
        updateDeviceEnergyGroup(params: CoolkitEnergy.IUpdateDeviceEnergyReq): Promise<CoolkitEnergy.IDeviceEnergyResp<any>>;
        getEnergyData(params: CoolkitEnergy.IEnergyDataReq): Promise<CoolkitEnergy.IDeviceEnergyResp<CoolkitEnergy.IGetDeviceEnergyDataResp>>;
        getEnergyDevices(): Promise<CoolkitEnergy.IDeviceEnergyResp<CoolkitEnergy.IEnergyDevicesResp[]>>;
    };
    getCmsContent: typeof getCmsContent;
    setBlockList: typeof setBlockList;
};
export default _default;
export { type CoolkitEnergy };
