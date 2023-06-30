import _ from 'lodash';
import { z } from 'zod';

const baseMessageSchema = z
  .object({
    body: z.string().optional(),
    files: z
      .array(
        z.object({
          uri: z.string().url(),
          name: z.string(),
          type: z.string().optional().nullable(),
        })
      )
      .optional(),
  })
  .superRefine((values, ctx) => {
    if (!values.body && !values.files?.length) {
      ctx.addIssue({
        code: 'custom',
        path: ['body', 'file'],
        message: 'Body or File are required',
      });
    }
  });

export const privateMessageSchema = z
  .object({
    senderId: z.string(),
    receiverId: z.string(),
  })
  .and(baseMessageSchema);

export const privateMessageTypingSchema = z.object({
  senderId: z.string(),
  receiverId: z.string(),
  typing: z.boolean(),
});

export const groupMessageSchema = z
  .object({
    senderId: z.string(),
    uuid: z.string(),
  })
  .and(baseMessageSchema);

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
