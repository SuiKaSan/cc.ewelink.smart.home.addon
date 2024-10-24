import { ApiResponse } from '../index';
export type SceneType = 'manual' | 'condition';
export interface SceneSimple {
    id: string;
}
export interface SceneComplex {
    id: string;
    name: string;
    familyid: string;
    index: number;
    sceneType: SceneType;
    condition?: any;
    operations: any[];
    optRanges?: any[];
    iconIndex?: number;
    notify?: boolean;
}
export declare const scene: {
    getSceneList(params: {
        familyid?: string;
        manual?: {
            num?: number;
            beginIndex?: number;
        };
        condition?: {
            num?: number;
            beginIndex?: number;
        };
        iwatch?: boolean;
        associatedWebhook?: boolean;
    }): Promise<{
        error: number;
        msg: string;
        data: {
            manualScenes: SceneComplex[];
            conditionScenes: SceneComplex[];
            iwatchScenes: SceneSimple[];
        };
    }>;
    addScene(params: {
        name: string;
        familyid?: string | undefined;
        sort?: number | undefined;
        sceneType: SceneType;
        condition?: {
            type: 'and' | 'or';
            disable?: boolean | undefined;
            triggers: {
                triggerType: 'device' | 'timer' | 'sun';
                deviceInfo?: {
                    deviceid: string;
                    expression: string;
                };
                timerInfo?: {
                    type: 'oneShot' | 'dayOfWeek';
                    oneShotTimestamp?: number;
                    dayOfWeek?: {
                        days: number[];
                        hour: number;
                        minute: number;
                        zone: number;
                    };
                };
                sunInfo?: {
                    type: 'rise' | 'set';
                    location: string;
                    extraInfo: string;
                };
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
        name?: string;
        sceneType?: SceneType;
        condition?: any;
        operations?: any[];
        optRanges?: any[];
        iconIndex?: number;
        notify?: boolean;
        associatedWebhook?: boolean;
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
    }): Promise<ApiResponse>;
    setDeviceFeature(params: {
        deviceid: string;
        sceneId?: string;
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
        from?: number;
        num?: number;
        versionTag: string;
        associatedWebhook?: boolean;
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
        familyid?: string;
        sceneType: SceneType;
        idList: string[];
    }): Promise<ApiResponse>;
    execScene(params: {
        id: string;
        localDevice?: boolean;
    }): Promise<ApiResponse>;
    getExecHistory(params: {
        id: string;
        from?: number;
        num?: number;
    }): Promise<{
        error: number;
        msg: string;
        data: {
            histories: {
                triggerType: 'manual' | 'condition' | 'scene';
                triggers?: any[];
                scene?: {
                    id: string;
                    name: string;
                };
                operations: {
                    actionType: 'device' | 'delay' | 'scene' | 'localDevice';
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
        familyid?: string;
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
            sceneId?: string;
        }[];
    }): Promise<ApiResponse>;
    getWebhookAndScene(): Promise<{
        error: number;
        msg: string;
        data: {
            bindingList?: {
                webhookUrl: string;
                sceneId?: string;
            }[];
        };
    }>;
    executeWebhook(params: {
        id: string;
    }): Promise<ApiResponse>;
};
