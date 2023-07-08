import _ from 'lodash';
import { z } from 'zod';
import asyncMw from 'express-asyncmw';
import {
  createCodeStatus,
  createNotFoundResponse,
} from '@krsbx/response-formatter';
import User from '../../users/models';
import schema from '../../../shares/schema';
import { BaseUserModel } from '../../users/models/attributes';
import Group from '../../groups/models';
import { BaseGroupModel } from '../../groups/models/attributes';

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

export const checkGroupExistsMw = asyncMw<{
  reqBody: z.infer<(typeof schema.chats)['groupMessageSchema']>;
  extends: {
    group: BaseGroupModel;
  };
}>(async (req, res, next) => {
  const group = await Group.instance.findOne({
    where: {
      id: req.body.uuid,
    },
  });

  if (!group) {
    return res.status(404).json(createNotFoundResponse('Group'));
  }

  req.group = group;

  return next();
});

export const checkGroupMessageUsersExistsMw = asyncMw<{
  reqBody: z.infer<(typeof schema.chats)['createGroupSchema']>;
}>(async (req, res, next) => {
  const members = await Promise.all(
    _.map(req.body.members, (member) =>
      User.instance.findOne({
        where: {
          id: member,
        },
      })
    )
  );

  if (_.compact(members).length !== req.body.members.length) {
    return res.status(400).json({
      ...createCodeStatus(400),
      message: `Some of the member are invalid`,
    });
  }

  return next();
});
