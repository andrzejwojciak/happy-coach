export type User = {
  id: string;
  email?: string;
  passwordHash?: string;
  firstLoginDate?: Date;
  lastLoginDate?: Date;
  isAdmin?: boolean;
  dataFetched: boolean;
};
