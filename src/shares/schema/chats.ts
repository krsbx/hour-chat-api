import _ from 'lodash';
import { z } from 'zod';

export const privateMessageSchema = z.object({
  senderId: z.string(),
  receiverId: z.string(),
  body: z.string().min(3),
});

export const privateMessageTypingSchema = z.object({
  senderId: z.string(),
  receiverId: z.string(),
  typing: z.boolean(),
});

export const groupMessageSchema = z.object({
  senderId: z.string(),
  uuid: z.string(),
  body: z.string(),
});

export const groupMessageTypingSchema = z.object({
  senderId: z.string(),
  uuid: z.string(),
  typing: z.boolean(),
});

export const createGroupMessageSchema = z.object({
  members: z
    .array(z.string())
    .min(2)
    .refine((members) => _.uniq(members).length >= 2, {
      message: 'Array must contain at least 2 unique element(s)',
    }),
  name: z.string(),
});

export const removeFromGroupSchema = z.object({
  members: z.union([z.string(), z.array(z.string()).min(1)]),
  senderId: z.string(),
  uuid: z.string(),
});

export const removeGroupSchema = z.object({
  senderId: z.string(),
  uuid: z.string(),
});
