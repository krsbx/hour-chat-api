import asyncMw from 'express-asyncmw';
import { z } from 'zod';
import { createCodeStatus } from '@krsbx/response-formatter';
import schema from '../../../shares/schema';
import { UserAttribute } from '../../users/models/attributes';
import * as events from '../events';

export const createStoryMw = asyncMw<{
  reqBody: z.infer<(typeof schema.stories)['createStorySchema']>;
  extends: {
    currentUser: Omit<UserAttribute, 'password'>;
  };
}>(async (req, res) => {
  await events.createUserStory({
    ...req.body,
    userId: req.currentUser.id,
  });

  return res.status(200).json({
    ...createCodeStatus(200),
    message: 'Story created successfully',
  });
});
