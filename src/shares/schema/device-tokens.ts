import { z } from 'zod';

export const deviceTokenSchema = z.object({
  token: z.string(),
});
