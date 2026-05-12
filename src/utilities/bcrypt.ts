import bcrypt from 'bcryptjs';
import { env } from '../config/index.ts';

export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(env.HASH_SALT);
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
};

export const comparePasswords = async (
  incomingPassword: string,
  hashedPassword: string
): Promise<boolean> => {
  return await bcrypt.compare(incomingPassword, hashedPassword);
};
