import _ from 'lodash';
import { z } from 'zod';
import { ENCRYPTION_TYPE } from '../constant';

export const encryptionQuery = z
  .object({
    senderId: z.string(),
    receiverId: z.string(),
    type: z.enum([
      ENCRYPTION_TYPE.PRIVATE,
      ENCRYPTION_TYPE.GROUP,
      ENCRYPTION_TYPE.STORY,
    ]),
  })
  .superRefine(({ receiverId, senderId, type }, ctx) => {
    if (
      _.includes([ENCRYPTION_TYPE.GROUP, ENCRYPTION_TYPE.STORY], type) &&
      receiverId !== senderId
    ) {
      ctx.addIssue({
        code: 'custom',
        path: ['senderId', 'receiverId'],
        message: 'senderId and receiverId must be the same',
      });
    }
  });
