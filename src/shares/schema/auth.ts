import _ from 'lodash';
import { z } from 'zod';

export const loginUserSchema = z
  .object({
    username: z.string().min(5).nullable(),
    email: z.string().email().nullable(),
    password: z.string().min(5),
  })
  .superRefine(({ email, username }, ctx) => {
    if (_.isEmpty(email) && _.isEmpty(username)) {
      ctx.addIssue({
        code: 'custom',
        path: ['email', 'username'],
        message: 'Email or Username are required',
      });
    }
  });
