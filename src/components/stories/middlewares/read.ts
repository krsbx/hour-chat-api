import asyncMw from 'express-asyncmw';
import { createNotFoundResponse } from '@krsbx/response-formatter';
import * as events from '../events';

export const getStoryByUuidMw = asyncMw<{
  params: {
    uuid: string;
  };
  extends: {
    story: HourChat.Firestore.BaseStory;
  };
}>(async (req, res, next) => {
  const story = await events.getUserStoryByuuid(req.params.uuid);

  if (!story) {
    return res.status(404).json(createNotFoundResponse('Story'));
  }

  req.story = story;

  return next();
});
