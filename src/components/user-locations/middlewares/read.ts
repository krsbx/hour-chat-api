import asyncMw from 'express-asyncmw';
import { createNotFoundResponse } from '@krsbx/response-formatter';
import UserLocation from '../models';
import { BaseUserLocationModel } from '../models/attributes';

export const getUserLocationMw = asyncMw<{
  params: {
    userId: string;
  };
  extends: {
    userLocation: BaseUserLocationModel;
  };
}>(async (req, res, next) => {
  const userLocation = await UserLocation.instance.findOne({
    where: {
      userId: req.params.userId,
    },
  });

  if (!userLocation) {
    return res
      .json(400)
      .json(
        createNotFoundResponse(`User location with userId ${req.params.userId}`)
      );
  }

  req.userLocation = userLocation;

  return next();
});

export const getUserLocationsMw = asyncMw<{
  extends: {
    userLocations: {
      rows: BaseUserLocationModel[];
      count: number;
    };
  };
}>(async (req, res, next) => {
  const userLocations = await UserLocation.instance.factory.findAll(
    {},
    req.filterQueryParams,
    req.query
  );

  req.userLocations = userLocations;

  return next();
});
