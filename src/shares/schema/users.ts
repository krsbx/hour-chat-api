import { z } from 'zod';
import validator from 'validator';

export const createUserSchema = z
  .object({
    firstName: z.string().min(3),
    middleName: z.string().min(3).nullable(),
    lastName: z.string().min(3).nullable(),
    username: z.string().min(5),
    email: z.string().email(),
    phoneNumber: z.string().refine(validator.isMobilePhone),
    password: z.string().min(5),
    confirmPassword: z.string().min(5),
  })
  .superRefine(({ confirmPassword, password }, ctx) => {
    if (confirmPassword !== password) {
      ctx.addIssue({
        code: 'custom',
        path: ['confirmPassword'],
        message: 'Confirmation password did not match',
      });
    }
  });

export const updateUserSchema = z
  .object({
    firstName: z.string().min(3).nullable(),
    middleName: z.string().min(3).nullable(),
    lastName: z.string().min(3).nullable(),
    username: z.string().min(5).nullable(),
    email: z.string().email().nullable(),
    phoneNumber: z.string().refine(validator.isMobilePhone).nullable(),
    password: z.string().min(5).nullable(),
    confirmPassword: z.string().min(5).nullable(),
  })
  .superRefine(({ confirmPassword, password }, ctx) => {
    if (password && confirmPassword && confirmPassword !== password) {
      ctx.addIssue({
        code: 'custom',
        path: ['confirmPassword'],
        message: 'Confirmation password did not match',
      });
    }
  });
