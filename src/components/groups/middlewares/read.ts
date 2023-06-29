import asyncMw from 'express-asyncmw';
import { createNotFoundResponse } from '@krsbx/response-formatter';
import Group from '../models';
import { BaseGroupModel } from '../models/attributes';

export const getGroupByGroupIdMw = asyncMw<{
  params: {
    groupId: string;
  };
  extends: {
    group: BaseGroupModel;
  };
}>(async (req, res, next) => {
  const group = await Group.instance.findOne({
    where: {
      id: req.params.groupId,
    },
  });

  if (!group) {
    return res
      .status(404)
      .json(createNotFoundResponse(`Group with id ${req.params.groupId}`));
  }

  req.group = group;

  return next();
});

export const getGroupsMw = asyncMw<{
  extends: {
    groups: {
      rows: BaseGroupModel[];
      count: number;
    };
  };
}>(async (req, res, next) => {
  const groups = await Group.instance.factory.findAll(
    {},
    req.filterQueryParams,
    req.query
  );

  req.groups = groups;

  return next();
});
