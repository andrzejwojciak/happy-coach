export type User = {
  id: string;
  email?: string;
  password_hash?: string;
  firstLoginDate?: Date;
  lastLoginDate?: Date;
  isAdmin?: boolean;
  dataFetched: boolean;
};
