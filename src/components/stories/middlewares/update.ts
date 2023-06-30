import _ from 'lodash';
import asyncMw from 'express-asyncmw';
import { z } from 'zod';
import { createCodeStatus } from '@krsbx/response-formatter';
import * as events from '../events';
import schema from '../../../shares/schema';
import { UserAttribute } from '../../users/models/attributes';
import db from '../../../models';
import Story from '../models';

export const updateStoryMw = asyncMw<{
  params: {
    storyId: string;
  };
  reqBody: z.infer<(typeof schema.stories)['createStorySchema']>;
}>(async (req, res) => {
  await db.sequelize.transaction(async (tx) => {
    if (_.isEmpty(req.body)) return;

    const [, [story]] = await Story.instance.update(req.body, {
      where: {
        id: req.params.storyId,
      },
      returning: true,
      transaction: tx,
    });

    await events.updateUserStory(req.params.storyId, story.dataValues);
  });

  return res.status(200).json(createCodeStatus(200));
});

export const likeStoryMw = asyncMw<{
  params: {
    storyId: string;
  };
  extends: {
    currentUser: Omit<UserAttribute, 'password'>;
  };
}>(async (req, res) => {
  await events.likeUserStory(req.params.storyId, req.currentUser.id);

  return res.status(200).json(createCodeStatus(200));
});

export const dislikeStoryMw = asyncMw<{
  params: {
    storyId: string;
  };
  extends: {
    currentUser: Omit<UserAttribute, 'password'>;
  };
}>(async (req, res) => {
  await events.dislikeUserStory(req.params.storyId, req.currentUser.id);

  return res.status(200).json(createCodeStatus(200));
});
