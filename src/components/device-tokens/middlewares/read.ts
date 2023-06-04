import asyncMw from 'express-asyncmw';
import { createNotFoundResponse } from '@krsbx/response-formatter';
import DeviceToken from '../models';
import { BaseDeviceTokenModel } from '../models/attributes';

export const getDeviceTokenMw = asyncMw<{
  params: {
    userId: string;
  };
  extends: {
    deviceToken: BaseDeviceTokenModel;
  };
}>(async (req, res, next) => {
  const deviceToken = await DeviceToken.instance.findOne({
    where: {
      userId: req.params.userId,
    },
  });

  if (!deviceToken) {
    return res
      .status(404)
      .json(
        createNotFoundResponse(`User device token with id ${req.params.userId}`)
      );
  }

  req.deviceToken = deviceToken;

  return next();
});

export const getDeviceTokensMw = asyncMw<{
  extends: {
    deviceTokens: {
      rows: BaseDeviceTokenModel[];
      count: number;
    };
  };
}>(async (req, res, next) => {
  const deviceTokens = await DeviceToken.instance.factory.findAll(
    {},
    req.filterQueryParams,
    req.query
  );

  req.deviceTokens = deviceTokens;

  return next();
});
