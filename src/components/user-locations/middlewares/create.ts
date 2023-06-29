import { z } from 'zod';
import asyncMw from 'express-asyncmw';
import schema from '../../../shares/schema';
import { BaseUserLocationModel } from '../models/attributes';
import UserLocation from '../models';

export const createUserLocationMw = asyncMw<{
  reqBody: z.infer<(typeof schema.userLocations)['userLocationSchema']>;
  params: {
    userId: string;
  };
  extends: {
    userLocation: BaseUserLocationModel;
  };
}>(async (req, res, next) => {
  const { lat, lng } = req.body;

  const [userLocation] = await UserLocation.instance.upsert({
    userId: req.params.userId,
    location: {
      type: 'Point',
      coordinates: [lng, lat],
    },
  });

  req.userLocation = userLocation;

  return next();
});
