import asyncMw from 'express-asyncmw';
import { createCodeStatus } from '@krsbx/response-formatter';
import * as events from '../events';
import db from '../../../models';
import Story from '../models';

export const deleteStoryMw = asyncMw<{
  params: {
    storyId: string;
  };
}>(async (req, res) => {
  await db.sequelize.transaction(async (tx) => {
    await Story.instance.destroy({
      where: {
        id: req.params.storyId,
      },
      transaction: tx,
    });

    await events.deleteUserStory(req.params.storyId);
  });

  return res.status(200).json(createCodeStatus(200));
});
