import { ApiResponse, MsgLang } from "../index";
export type SortType = 1 | 2;
export interface RoomItem {
    id: string;
    name: string;
    index: string;
}
export interface FamilyItem {
    id: string;
    apikey: string;
    name: string;
    index: string;
    roomList?: RoomItem[];
    familyType: number;
    members: {
        apikey: string;
        phoneNumber?: string;
        email?: string;
        nickname?: string;
        comment?: string;
        wxNickname?: string;
        wxAvatar?: string;
    }[];
    sharedBy?: {
        apikey: string;
        phoneNumber?: string;
        email?: string;
        nickname?: string;
    };
}
export interface ThingItem {
    id: string;
    itemType: number;
}
export declare const family: {
    getFamilyList(params: {
        lang?: MsgLang;
    }): Promise<{
        error: number;
        msg: string;
        data: {
            familyList: FamilyItem[];
            currentFamilyId: string;
        };
    }>;
    addFamily(params: {
        name: string;
        sort: SortType;
        roomNameList?: string[];
    }): Promise<{
        error: number;
        msg: string;
        data: {
            id: string;
            name: string;
            index: number;
            roomList?: RoomItem[];
        };
    }>;
    addRoom(params: {
        familyid: string;
        name: string;
        sort: SortType;
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
        id?: string;
        name: string;
    }): Promise<ApiResponse>;
    updateRoom(params: {
        id: string;
        name: string;
    }): Promise<ApiResponse>;
    sortRoom(params: {
        familyid?: string;
        idList: string[];
    }): Promise<ApiResponse>;
    delFamily(params: {
        id: string;
        deviceFamily: string;
        switchFamily: string;
    }): Promise<ApiResponse>;
    delRoom(params: {
        id: string;
    }): Promise<ApiResponse>;
    sortThing(params: {
        familyid?: string;
        thingList: ThingItem[];
    }): Promise<ApiResponse>;
    setThing(params: {
        roomid: string;
        oldThingList: ThingItem[];
        newThingList: ThingItem[];
    }): Promise<ApiResponse>;
    changeFamily(params: {
        id: string;
    }): Promise<ApiResponse>;
    addShareFamily(params: {
        familyid: string;
        user: {
            countryCode?: string;
            phoneNumber?: string;
            email?: string;
        };
        comment?: string;
        shareType: number;
    }): Promise<ApiResponse>;
    delShareFamily(params: {
        familyid: string;
        apikey: string;
    }): Promise<ApiResponse>;
};
