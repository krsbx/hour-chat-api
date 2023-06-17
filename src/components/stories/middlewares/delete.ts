import asyncMw from 'express-asyncmw';
import { createCodeStatus } from '@krsbx/response-formatter';
import * as events from '../events';

export const deleteStoryMw = asyncMw<{
  params: {
    uuid: string;
  };
}>(async (req, res) => {
  await events.deleteUserStory(req.params.uuid);

  return res.status(200).json(createCodeStatus(200));
});
