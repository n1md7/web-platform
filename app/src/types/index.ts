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

export type JoyError = {
  message: string,
  details: Array<{
    message: string,
    context: {
      valids?: Array<string>,
      label: string,
      value: string,
      key: string
    },
    type?: string,
    path?: Array<string>
  }>
};
