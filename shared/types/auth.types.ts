export enum UserRole {
  ADMIN = 'admin',
  SALES = 'sales',
}

export interface IUser {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: IUser;
  accessToken: string;
}
