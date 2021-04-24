export enum Token {
  jwt = "jwt-token",
  refresh = "refresh-token"
}

export type UserType = {
  id: number;
  username: string;
  email: string;
  role: UserRole
}

export enum UserRole {
  basic = 1,
  admin
}

