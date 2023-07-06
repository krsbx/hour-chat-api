import _ from 'lodash';
import { z } from 'zod';
import asyncMw from 'express-asyncmw';
import { createCodeStatus } from '@krsbx/response-formatter';
import schema from '../../../shares/schema';
import { BaseUserModel } from '../../users/models/attributes';
import events from '../events';
import { notifyUser, notifyUsers } from '../../device-tokens/events';
import { createFullName } from '../../users/utils/common';
import { BaseGroupModel } from '../../groups/models/attributes';
import { CHAT_TYPE } from '../../../shares/constant';

export const sendPrivateMessageMw = asyncMw<{
  reqBody: z.infer<(typeof schema.chats)['privateMessageSchema']>;
  extends: {
    sender: BaseUserModel;
    receiver: BaseUserModel;
  };
}>(async (req, res) => {
  const { receiverId, senderId, body, files } = req.body;

  const notification = {
    title: createFullName(req.sender.dataValues) ?? 'New message',
    body: body ?? '',
    senderId,
    type: CHAT_TYPE.PRIVATE,
    uuid: senderId,
  };

  if (_.isEmpty(notification.body) && files?.length) {
    notification.body = `${files.length} Files`;
  }

  await events.privateMessage.sendPrivateMessage(req.body);

  // Send notification if the receiver is not the user
  if (senderId !== receiverId) {
    await notifyUser(receiverId, notification);
  }

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
  extends: {
    group: BaseGroupModel;
  };
}>(async (req, res) => {
  const { senderId, body, files } = req.body;
  const { name, id } = req.group.dataValues;

  const notification = {
    title: name,
    body: body ?? '',
    senderId,
    type: CHAT_TYPE.GROUP,
    uuid: id,
  };

  if (_.isEmpty(notification.body) && files?.length) {
    notification.body = `${files.length} Files`;
  }

  const members = [...req.group.dataValues.members];
  const index = members.findIndex((member) => member === senderId);

  if (index > -1) members.splice(index, 1);

  await events.groupMessage.sendGroupMessage(req.body, req.group);
  await notifyUsers(members, notification);

  return res.status(200).json({
    ...createCodeStatus(200),
    message: 'Message sent successfully',
  });
});
