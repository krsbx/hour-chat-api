import { z } from 'zod';
import moment from 'moment';
import validator from 'validator';
import { GENDER } from '../constant';

export const createUserSchema = z
  .object({
    firstName: z.string().min(3),
    middleName: z.string().optional(),
    lastName: z.string().optional(),
    username: z.string().min(5),
    email: z.string().email(),
    phoneNumber: z.string().refine(validator.isMobilePhone),
    password: z.string().min(5),
    confirmPassword: z.string().min(5),
    dob: z
      .string()
      .optional()
      .refine((date) => {
        if (!date) return true;

        return moment(date).isValid();
      }),
    gender: z
      .enum([GENDER.MALE, GENDER.FEMALE, GENDER.OTHER])
      .optional()
      .nullable()
      .default(GENDER.OTHER),
    avatar: z.string().optional(),
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
    firstName: z.string().min(3).optional(),
    middleName: z.string().optional(),
    lastName: z.string().optional(),
    username: z.string().min(5).optional(),
    email: z.string().email().optional(),
    phoneNumber: z.string().refine(validator.isMobilePhone).optional(),
    password: z.string().min(5).optional(),
    confirmPassword: z.string().min(5).optional(),
    dob: z
      .string()
      .optional()
      .refine((date) => {
        if (!date) return true;

        return moment(date).isValid();
      }),
    gender: z.enum([GENDER.MALE, GENDER.FEMALE, GENDER.OTHER]).optional(),
    avatar: z.string().optional(),
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
