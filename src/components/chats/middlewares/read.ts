import _ from 'lodash';
import { z } from 'zod';
import asyncMw from 'express-asyncmw';
import { createCodeStatus } from '@krsbx/response-formatter';
import User from '../../users/models';
import schema from '../../../shares/schema';
import { BaseUserModel } from '../../users/models/attributes';

export const checkPrivateMessageUsersExistsMw = asyncMw<{
  reqBody: z.infer<(typeof schema.chats)['privateMessageSchema']>;
  extends: {
    sender: BaseUserModel;
    receiver: BaseUserModel;
  };
}>(async (req, res, next) => {
  const [sender, receiver] = await Promise.all([
    User.instance.findOne({
      where: {
        id: req.body.senderId,
      },
    }),
    User.instance.findOne({
      where: {
        id: req.body.receiverId,
      },
    }),
  ]);

  const messages: string[] = [];

  if (!sender || !receiver) {
    if (!sender) {
      messages.push('Sender');
    }

    if (!sender) {
      messages.push('Receiver');
    }

    return res.status(400).json({
      ...createCodeStatus(400),
      message: `${messages.join(' and ')} is invalid`,
    });
  }

  req.sender = sender;
  req.receiver = sender;

  return next();
});

export const checkGroupMessageUsersExistsMw = asyncMw<{
  reqBody: z.infer<(typeof schema.chats)['createGroupMessageSchema']>;
}>(async (req, res, next) => {
  const members = await Promise.all(
    _.map(req.body.members, (member) =>
      User.instance.findOne({
        where: {
          id: member as number,
        },
      })
    )
  );

  if (_.compact(members).length !== req.body.members.size) {
    return res.status(400).json({
      ...createCodeStatus(400),
      message: `Some of the member are invalid`,
    });
  }

  return next();
});
