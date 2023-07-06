import _ from 'lodash';
import { z } from 'zod';
import asyncMw from 'express-asyncmw';
import { createForbiddenResponse } from '@krsbx/response-formatter';
import schema from '../../../shares/schema';
import { UserAttribute } from '../../users/models/attributes';
import { BaseGroupModel } from '../../groups/models/attributes';

export const validateSenderPayloadMw = asyncMw<{
  reqBody: { senderId: string };
  extends: {
    currentUser: Omit<UserAttribute, 'password'>;
  };
}>(async (req, res, next) => {
  if (req.body.senderId !== req.currentUser.id) {
    return res.status(403).json(createForbiddenResponse());
  }

  return next();
});

export const validateGroupMemberMw = asyncMw<{
  reqBody: { members: string[] };
  extends: {
    currentUser: Omit<UserAttribute, 'password'>;
  };
}>(async (req, res, next) => {
  if (!_.includes(req.body.members, req.currentUser.id)) {
    return res.status(403).json(createForbiddenResponse());
  }

  return next();
});

export const validatePrivateMessagePayloadMw = asyncMw<{
  reqBody: z.infer<(typeof schema.chats)['privateMessageSchema']>;
}>(async (req, res, next) => {
  req.body = await schema.chats.privateMessageSchema.parseAsync(req.body);

  return next();
});

export const validatePrivateMessageTypingPayloadMw = asyncMw<{
  reqBody: z.infer<(typeof schema.chats)['privateMessageTypingSchema']>;
}>(async (req, res, next) => {
  req.body = await schema.chats.privateMessageTypingSchema.parseAsync(req.body);

  return next();
});

export const validateCreateGroupMessagePayloadMw = asyncMw<{
  reqBody: z.infer<(typeof schema.chats)['createGroupMessageSchema']>;
}>(async (req, res, next) => {
  req.body = await schema.chats.createGroupMessageSchema.parseAsync(req.body);

  return next();
});

export const validateGroupMessagePayloadMw = asyncMw<{
  reqBody: z.infer<(typeof schema.chats)['groupMessageSchema']>;
}>(async (req, res, next) => {
  req.body = await schema.chats.groupMessageSchema.parseAsync(req.body);

  return next();
});

export const validateGroupAccessMw = asyncMw<{
  reqBody: z.infer<(typeof schema.chats)['groupMessageSchema']>;
  extends: {
    group: BaseGroupModel;
  };
}>(async (req, res, next) => {
  if (!_.includes(req.group.dataValues.members, req.body.senderId)) {
    return res.status(403).json(createForbiddenResponse());
  }

  return next();
});

export const validateGroupMessageTypingPayloadMw = asyncMw<{
  reqBody: z.infer<(typeof schema.chats)['groupMessageTypingSchema']>;
}>(async (req, res, next) => {
  req.body = await schema.chats.groupMessageTypingSchema.parseAsync(req.body);

  return next();
});
