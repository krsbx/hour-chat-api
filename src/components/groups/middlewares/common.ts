import { createForbiddenResponse } from '@krsbx/response-formatter';
import asyncMw from 'express-asyncmw';
import { UserAttribute } from '../../users/models/attributes';
import { BaseGroupModel } from '../models/attributes';

export const validateUserAccessMw = asyncMw<{
  extends: {
    group: BaseGroupModel;
    currentUser: Omit<UserAttribute, 'password'>;
  };
}>(async (req, res, next) => {
  const { members } = req.group.dataValues;

  if (!members.includes(req.currentUser.id)) {
    return res.status(403).json(createForbiddenResponse());
  }

  return next();
});

export const convertGroupIdToUuidPayloadMw = asyncMw<{
  reqBody: {
    uuid: string;
  };
  params: {
    groupId: string;
  };
}>(async (req, res, next) => {
  if (req.body.uuid !== req.params.groupId) req.body.uuid = req.params.groupId;

  return next();
});
