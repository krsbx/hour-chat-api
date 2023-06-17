import asyncMw from 'express-asyncmw';
import { z } from 'zod';
import { createCodeStatus } from '@krsbx/response-formatter';
import * as events from '../events';
import schema from '../../../shares/schema';
import { UserAttribute } from '../../users/models/attributes';

export const updateStoryMw = asyncMw<{
  params: {
    uuid: string;
  };
  reqBody: z.infer<(typeof schema.stories)['createStorySchema']>;
}>(async (req, res) => {
  await events.updateUserStory(req.params.uuid, req.body);

  return res.status(200).json(createCodeStatus(200));
});

export const likeStoryMw = asyncMw<{
  params: {
    uuid: string;
  };
  extends: {
    currentUser: Omit<UserAttribute, 'password'>;
  };
}>(async (req, res) => {
  await events.likeUserStory(req.params.uuid, req.currentUser.id);

  return res.status(200).json(createCodeStatus(200));
});

export const dislikeStoryMw = asyncMw<{
  params: {
    uuid: string;
  };
  extends: {
    currentUser: Omit<UserAttribute, 'password'>;
  };
}>(async (req, res) => {
  await events.dislikeUserStory(req.params.uuid, req.currentUser.id);

  return res.status(200).json(createCodeStatus(200));
});
