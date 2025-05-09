import { Request, Response } from 'express';
import { toResponse } from '../utils/error';
import logger from '../log';
import getIHostSyncDeviceList from './public/getIHostSyncDeviceList';
import db from '../utils/db';
import electricityDataUtil from '../utils/electricityDataUtil';
import _ from 'lodash';
import { getUiidOperateInstance } from '../utils/deviceOperateInstanceMange';

/** 同步eWeLink设备到iHost (Synchronize eWelink device to iHost)*/
export default async function toSyncDeviceToIHost(req: Request, res: Response) {
    try {
        const { deviceId } = req.params;
        let realDeviceId, remoteIndex;

        if (deviceId.indexOf('_') > -1) {
            realDeviceId = deviceId.split('_')[0];
            remoteIndex = Number(deviceId.split('_')[1]);
        } else {
            realDeviceId = deviceId;
        }

        const operateInstance = getUiidOperateInstance(realDeviceId);
        const resData = await operateInstance?.syncDeviceToIHost(remoteIndex);

        if (typeof resData === 'number') {
            return res.json(toResponse(resData));
        }
        if (!resData) {
            logger.error('sync device to iHost fail----------------------');
            return res.json(toResponse(500));
        }

        if (resData?.payload?.description === 'headers.Authorization is invalid' || (resData as any)?.message === 'headers.Authorization is invalid') {
            logger.info('sync iHost device,iHost token useless-------------------------clear');

            //iHostToken 失效，清空 (Invalidate, clear)
            db.setDbValue('iHostToken', '');
            return res.json(toResponse(1100));
        }

        if (resData?.payload.type === 'INVALID_PARAMETERS') {
            logger.error('sync device to iHost error params------------------', resData.payload);
            //参数错误 (Parameter error)
            return res.json(toResponse(500));
        }

        await getIHostSyncDeviceList();

        //清空电量缓存 (Clear battery cache)
        electricityDataUtil.clearDeviceCache(deviceId);

        res.json(toResponse(0));
    } catch (error: any) {
        logger.error('to sync device to iHost code error-----------------------------', error);
        res.json(toResponse(500));
    }
}
