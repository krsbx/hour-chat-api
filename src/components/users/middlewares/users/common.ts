import asyncMw from 'express-asyncmw';
import { ZodError, z } from 'zod';
import schema from '../../../../shares/schema';
import { pick } from '../../../../shares/common';

export const validateCreateUserPayloadMw = asyncMw<{
  reqBody: z.infer<(typeof schema.users)['createUserSchema']>;
}>(async (req, res, next) => {
  try {
    await schema.users.createUserSchema.parseAsync(req.body);

    return next();
  } catch (err) {
    if (err instanceof ZodError) {
      return res
        .status(400)
        .json(pick(err, ['name', 'message', 'stack', 'errors']));
    }

    return next(err);
  }
});

export const validateUpdateUserPayloadMw = asyncMw<{
  reqBody: z.infer<(typeof schema.users)['updateUserSchema']>;
}>(async (req, res, next) => {
  try {
    await schema.users.updateUserSchema.parseAsync(req.body);

    return next();
  } catch (err) {
    if (err instanceof ZodError) {
      return res
        .status(400)
        .json(pick(err, ['name', 'message', 'stack', 'errors']));
    }

    return next(err);
  }
});
