import { z } from 'zod/v4';

export const signinDto = z.object({
  body: z.object({
    username: z.string().min(1, 'Username is required'),
    password: z.string().min(1, 'Password is required'),
  }),
});

export type TSigninDto = z.infer<typeof signinDto>;
