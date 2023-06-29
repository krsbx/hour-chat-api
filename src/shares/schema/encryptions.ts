import { z } from 'zod';
import { ENCRYPTION_TYPE } from '../constant';

export const encryptionQuery = z.object({
  senderId: z.string(),
  receiverId: z.string(),
  type: z.enum([
    ENCRYPTION_TYPE.PRIVATE,
    ENCRYPTION_TYPE.GROUP,
    ENCRYPTION_TYPE.STORY,
  ]),
});
