export type User = {
  id: string;
  email?: string;
  displayName?: string;
  passwordHash?: string;
  firstLoginDate?: Date;
  lastLoginDate?: Date;
  isAdmin?: boolean;
  dataFetched: boolean;
  image_72?: string;
  image_48?: string;
  image_32?: string;
  image_24?: string;
};
