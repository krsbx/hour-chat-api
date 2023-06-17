import _ from 'lodash';
import { z } from 'zod';

export const createStorySchema = z
  .object({
    body: z.string().optional(),
    file: z
      .object({
        uri: z.string(),
        type: z.string().nullable().optional(),
        width: z.number().optional(),
        height: z.number().optional(),
      })
      .optional(),
  })
  .superRefine(({ body, file }, ctx) => {
    if (_.isEmpty(body) && _.isEmpty(file)) {
      ctx.addIssue({
        code: 'custom',
        path: ['body', 'file'],
        message: 'Body or File are required',
      });
    }

    if (
      !_.isEmpty(file) &&
      _.includes(file.type ?? '', 'images') &&
      (!file.width || !file.height)
    ) {
      ctx.addIssue({
        code: 'custom',
        path: ['file.width', 'file.height'],
        message: 'Width and Height are required for an image',
      });
    }
  });
