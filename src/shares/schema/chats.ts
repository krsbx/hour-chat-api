import _ from 'lodash';
import { z } from 'zod';

export const privateMessageSchema = z.object({
  senderId: z.number(),
  receiverId: z.number(),
  body: z.string().min(3),
});

export const privateMessageTypingSchema = z.object({
  senderId: z.number(),
  receiverId: z.number(),
  typing: z.boolean(),
});

export const groupMessageSchema = z.object({
  senderId: z.number(),
  uuid: z.string(),
  body: z.string(),
});

export const groupMessageTypingSchema = z.object({
  senderId: z.number(),
  uuid: z.string(),
  typing: z.boolean(),
});

export const createGroupMessageSchema = z.object({
  members: z
    .array(z.number())
    .min(2)
    .refine((members) => _.uniq(members).length >= 2, {
      message: 'Array must contain at least 2 unique element(s)',
    }),
  name: z.string(),
});

export const removeFromGroupSchema = z.object({
  members: z.union([z.number(), z.array(z.number()).min(1)]),
  senderId: z.number(),
  uuid: z.string(),
});

export const removeGroupSchema = z.object({
  senderId: z.number(),
  uuid: z.string(),
});
