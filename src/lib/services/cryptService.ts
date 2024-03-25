import bcrypt from "bcryptjs";

export const hashPassword = async (password: string): Promise<string> => {
  const hashedPassword = await bcrypt.hash(password, process.env.SALT!);
  return hashedPassword;
};

export const comparePasswords = async (
  hashedPassword: string,
  password: string
): Promise<boolean> => {
  const isMatch = await bcrypt.compare(password, hashedPassword);
  return isMatch;
};
