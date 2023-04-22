import { z } from 'zod';
import asyncMw from 'express-asyncmw';
import schema from '../../../shares/schema';
import { BaseUserLocationModel } from '../models/attributes';
import UserLocation from '../models';

export const createUserLocationMw = asyncMw<{
  reqBody: z.infer<(typeof schema)['userLocations']['userLocationSchema']>;
  params: {
    userId: string;
  };
  extends: {
    userLocation: BaseUserLocationModel;
  };
}>(async (req, res, next) => {
  const [userLocation] = await UserLocation.instance.upsert({
    ...req.body,
    userId: +req.params.userId,
  });

  req.userLocation = userLocation;

  return next();
});
