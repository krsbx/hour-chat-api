import { z } from 'zod';
import asyncMw from 'express-asyncmw';
import { createCodeStatus } from '@krsbx/response-formatter';
import schema from '../../../shares/schema';
import events from '../events';

export const updatePrivateMessageTypingMw = asyncMw<{
  reqBody: z.infer<(typeof schema.chats)['privateMessageTypingSchema']>;
}>(async (req, res) => {
  await events.privateMessage.updatePrivateMessageTyping(req.body);

  return res.status(200).json({
    ...createCodeStatus(200),
    message: 'Typing status updated successfully',
  });
});

export const updateGroupMessageTypingMw = asyncMw<{
  reqBody: z.infer<(typeof schema.chats)['groupMessageTypingSchema']>;
}>(async (req, res) => {
  await events.groupMessage.updateGroupMessageTyping(req.body);

  return res.status(200).json({
    ...createCodeStatus(200),
    message: 'Typing status updated successfully',
  });
});
