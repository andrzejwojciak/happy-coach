export type User = {
  id: string;
  email?: string;
  displayName?: string;
  passwordHash?: string;
  firstLoginDate?: Date;
  lastLoginDate?: Date;
  isAdmin?: boolean;
  dataFetched: boolean;
};
