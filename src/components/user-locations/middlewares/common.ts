import { z } from 'zod';
import asyncMw from 'express-asyncmw';
import schema from '../../../shares/schema';

export const validateUserLocationPayloadMw = asyncMw<{
  reqBody: z.infer<(typeof schema.userLocations)['userLocationSchema']>;
}>(async (req, res, next) => {
  await schema.userLocations.userLocationSchema.parseAsync(req.body);

  return next();
});
