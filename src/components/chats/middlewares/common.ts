import { z } from 'zod';
import asyncMw from 'express-asyncmw';
import schema from '../../../shares/schema';

export const validatePrivateMessagePayloadMw = asyncMw<{
  reqBody: z.infer<(typeof schema.chats)['privateMessageSchema']>;
}>(async (req, res, next) => {
  await schema.chats.privateMessageSchema.parseAsync(req.body);

  return next();
});

export const validatePrivateMessageTypingPayloadMw = asyncMw<{
  reqBody: z.infer<(typeof schema.chats)['privateMessageTypingSchema']>;
}>(async (req, res, next) => {
  await schema.chats.privateMessageTypingSchema.parseAsync(req.body);

  return next();
});

export const validateCreateGroupMessagePayloadMw = asyncMw<{
  reqBody: z.infer<(typeof schema.chats)['createGroupMessageSchema']>;
}>(async (req, res, next) => {
  await schema.chats.createGroupMessageSchema.parseAsync(req.body);

  return next();
});

export const validateGroupMessagePayloadMw = asyncMw<{
  reqBody: z.infer<(typeof schema.chats)['groupMessageSchema']>;
}>(async (req, res, next) => {
  await schema.chats.groupMessageSchema.parseAsync(req.body);

  return next();
});

export const validateGroupMessageTypingPayloadMw = asyncMw<{
  reqBody: z.infer<(typeof schema.chats)['groupMessageTypingSchema']>;
}>(async (req, res, next) => {
  await schema.chats.groupMessageTypingSchema.parseAsync(req.body);

  return next();
});
