import { Op } from 'sequelize';
import asyncMw from 'express-asyncmw';
import { createNotFoundResponse } from '@krsbx/response-formatter';
import Group from '../models';
import { BaseGroupModel } from '../models/attributes';
import { UserAttribute } from '../../users/models/attributes';

export const getGroupByGroupIdMw = asyncMw<{
  params: {
    groupId: string;
  };
  extends: {
    currentUser: Omit<UserAttribute, 'password'>;
    group: BaseGroupModel;
  };
}>(async (req, res, next) => {
  const group = await Group.instance.findOne({
    where: {
      id: req.params.groupId,
      members: {
        [Op.contains]: [req.currentUser.id],
      },
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
    currentUser: Omit<UserAttribute, 'password'>;
    groups: {
      rows: BaseGroupModel[];
      count: number;
    };
  };
}>(async (req, res, next) => {
  const groups = await Group.instance.factory.findAll(
    {
      where: {
        members: {
          [Op.contains]: [req.currentUser.id],
        },
      },
    },
    req.filterQueryParams,
    req.query
  );

  req.groups = groups;

  return next();
});
