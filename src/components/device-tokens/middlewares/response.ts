import _ from 'lodash';
import asyncMw from 'express-asyncmw';
import {
  createResourceResponse,
  createResourcesResponse,
} from '@krsbx/response-formatter';
import DeviceToken from '../models';
import { BaseDeviceTokenModel } from '../models/attributes';

export const returnDeviceTokenMw = asyncMw<{
  extends: {
    deviceToken: BaseDeviceTokenModel;
  };
}>(async (req, res) => {
  const deviceToken = await DeviceToken.instance.factory.modelToResource(
    req.deviceToken
  );

  return res.status(200).json(createResourceResponse(req, deviceToken));
});

export const returnDeviceTokensMw = asyncMw<{
  extends: {
    deviceTokens: {
      rows: BaseDeviceTokenModel[];
      count: number;
    };
  };
}>(async (req, res) => {
  const { count, rows } = req.deviceTokens;

  return res.status(200).json(
    createResourcesResponse(req, {
      rows: await Promise.all(
        _.map(rows, DeviceToken.instance.factory.modelToResource)
      ),
      count,
    })
  );
});
