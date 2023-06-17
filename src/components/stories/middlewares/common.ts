import { z } from 'zod';
import asyncMw from 'express-asyncmw';
import { createUnauthorizedResponse } from '@krsbx/response-formatter';
import schema from '../../../shares/schema';
import { UserAttribute } from '../../users/models/attributes';

export const validateStoryPayloadMw = asyncMw<{
  reqBody: z.infer<(typeof schema.stories)['createStorySchema']>;
}>(async (req, res, next) => {
  req.body = await schema.stories.createStorySchema.parseAsync(req.body);

  return next();
});

export const validateUserAccessMw = asyncMw<{
  extends: {
    story: HourChat.Firestore.BaseStory;
    currentUser: Omit<UserAttribute, 'password'>;
  };
}>(async (req, res, next) => {
  if (req.story.userId !== req.currentUser.id)
    return res.status(401).json(createUnauthorizedResponse());

  return next();
});
