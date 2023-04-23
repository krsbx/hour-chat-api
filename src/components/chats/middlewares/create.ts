import { z } from 'zod';
import asyncMw from 'express-asyncmw';
import { createCodeStatus } from '@krsbx/response-formatter';
import schema from '../../../shares/schema';
import { BaseUserModel } from '../../users/models/attributes';
import events from '../events';

export const sendPrivateMessageMw = asyncMw<{
  reqBody: z.infer<(typeof schema.chats)['privateMessageSchema']>;
  extends: {
    sender: BaseUserModel;
    receiver: BaseUserModel;
  };
}>(async (req, res) => {
  await events.privateMessage.sendPrivateMessage(req.body);

  return res.status(200).json({
    ...createCodeStatus(200),
    message: 'Message sent successfully',
  });
});

export const createGroupMessageGroupMw = asyncMw<{
  reqBody: z.infer<(typeof schema.chats)['createGroupMessageSchema']>;
}>(async (req, res) => {
  await events.groupMessage.createGroupMessageGroup(req.body);

  return res.status(200).json({
    ...createCodeStatus(200),
    message: 'Group created successfully',
  });
});

export const sendGroupMessageMw = asyncMw<{
  reqBody: z.infer<(typeof schema.chats)['groupMessageSchema']>;
}>(async (req, res) => {
  await events.groupMessage.sendGroupMessage(req.body);

  return res.status(200).json({
    ...createCodeStatus(200),
    message: 'Message sent successfully',
  });
});
