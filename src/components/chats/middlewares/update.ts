import { z } from 'zod';
import asyncMw from 'express-asyncmw';
import { createCodeStatus } from '@krsbx/response-formatter';
import schema from '../../../shares/schema';
import events from '../events';
import { BaseGroupModel } from '../../groups/models/attributes';

export const updatePrivateMessageTypingMw = asyncMw<{
  reqBody: z.infer<(typeof schema.chats)['privateTypingSchema']>;
}>(async (req, res) => {
  await events.typing.updatePrivateTyping(req.body);

  return res.status(200).json({
    ...createCodeStatus(200),
    message: 'Typing status updated successfully',
  });
});

export const updateGroupMessageTypingMw = asyncMw<{
  reqBody: z.infer<(typeof schema.chats)['groupTypingSchema']>;
  extends: {
    group: BaseGroupModel;
  };
}>(async (req, res) => {
  await events.typing.updateGroupTyping(req.body, req.group);

  return res.status(200).json({
    ...createCodeStatus(200),
    message: 'Typing status updated successfully',
  });
});

export const modifyGroupMemberMw = asyncMw<{
  reqBody: z.infer<(typeof schema.chats)['modifyMemberSchema']>;
  reqQuery: {
    adding?: boolean;
  };
  extends: {
    group: BaseGroupModel;
  };
}>(async (req, res) => {
  if (req.query.adding) await events.group.addMember(req.body, req.group);
  else await events.group.removeMember(req.body, req.group);

  return res.status(200).json({
    ...createCodeStatus(200),
    message: 'Member/s modified successfully',
  });
});
