import asyncMw from 'express-asyncmw';
import { createNotFoundResponse } from '@krsbx/response-formatter';
import Story from '../models';
import { BaseStoryModel } from '../models/attributes';

export const getStoryByStoryIdMw = asyncMw<{
  params: {
    storyId: string;
  };
  extends: {
    story: BaseStoryModel;
  };
}>(async (req, res, next) => {
  const story = await Story.instance.findOne({
    where: {
      id: req.params.storyId,
    },
  });

  if (!story) {
    return res
      .status(404)
      .json(createNotFoundResponse(`Story with id ${req.params.storyId}`));
  }

  req.story = story;

  return next();
});
