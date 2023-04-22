import { z } from 'zod';

export const userLocationSchema = z.object({
  lat: z.number(),
  lng: z.number(),
});
