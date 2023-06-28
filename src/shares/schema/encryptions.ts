import { z } from 'zod';
import { CHAT_TYPE } from '../constant';

export const encryptionQuery = z.object({
  senderId: z.union([z.number(), z.string()]),
  receiverId: z.union([z.number(), z.string()]),
  type: z.enum([CHAT_TYPE.PRIVATE, CHAT_TYPE.GROUP]),
});
