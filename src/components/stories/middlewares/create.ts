import asyncMw from 'express-asyncmw';
import { z } from 'zod';
import { createCodeStatus } from '@krsbx/response-formatter';
import schema from '../../../shares/schema';
import { UserAttribute } from '../../users/models/attributes';
import * as events from '../events';
import db from '../../../models';
import Story from '../models';

export const createStoryMw = asyncMw<{
  reqBody: z.infer<(typeof schema.stories)['createStorySchema']>;
  extends: {
    currentUser: Omit<UserAttribute, 'password'>;
  };
}>(async (req, res) => {
  await db.sequelize.transaction(async (tx) => {
    const payload = {
      ...req.body,
      userId: req.currentUser.id,
    };

    const story = await Story.instance.create(payload, {
      transaction: tx,
    });

    await events.createUserStory(story.dataValues);

    return story;
  });

  return res.status(200).json({
    ...createCodeStatus(200),
    message: 'Story created successfully',
  });
});
