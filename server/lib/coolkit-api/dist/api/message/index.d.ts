export interface MessageItem {
    msgid: string;
    msgType: 'shareNotify_v2' | 'cancelShareNotify_v2' | 'opsNotify_v2' | 'pushNotify_v2' | 'alarmNotify_v2' | 'IOTCameraNotify_v2';
    message: object;
    date: number;
}
export declare const message: {
    getMessageList(params?: {
        familyid?: string;
        from?: number;
        num?: number;
    }): Promise<{
        error: number;
        msg: string;
        data: {
            messageList: MessageItem[];
        };
    }>;
};
