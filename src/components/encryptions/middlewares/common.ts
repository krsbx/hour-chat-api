import _ from 'lodash';
import {
  createForbiddenResponse,
  createNotFoundResponse,
} from '@krsbx/response-formatter';
import { z } from 'zod';
import asyncMw from 'express-asyncmw';
import schema from '../../../shares/schema';
import { BaseEncryptionModel } from '../models/attributes';
import { UserAttribute } from '../../users/models/attributes';
import { ENCRYPTION_TYPE } from '../../../shares/constant';
import Group from '../../groups/models';

export const validateEncryptionQueryMw = asyncMw<{
  reqQuery: HourChat.Encryption.EncryptionPayload;
  reqBody: z.infer<(typeof schema.encryptions)['encryptionQuery']>;
}>(async (req, res, next) => {
  req.body = await schema.encryptions.encryptionQuery.parseAsync({
    senderId: req.query.senderId,
    receiverId: req.query.receiverId,
    type: req.query.type,
  });

  return next();
});

export const checkUserAccessMw = asyncMw<{
  extends: {
    currentUser: Omit<UserAttribute, 'password'>;
    encryption: BaseEncryptionModel;
  };
}>(async (req, res, next) => {
  const isPrivate = req.encryption.dataValues.type === ENCRYPTION_TYPE.PRIVATE;
  let members = [
    req.encryption.dataValues.receiverId,
    req.encryption.dataValues.senderId,
  ];

  if (isPrivate && !_.includes(members, req.currentUser.id)) {
    return res.status(403).json(createForbiddenResponse());
  }

  const group = await Group.instance.findOne({
    where: {
      id: req.encryption.dataValues.senderId,
    },
  });

  if (!group) {
    return res.status(404).json(createNotFoundResponse('Encryption'));
  }

  members = group.dataValues.members;

  if (!_.includes(members, req.currentUser.id)) {
    return res.status(403).json(createForbiddenResponse());
  }

  return next();
});
