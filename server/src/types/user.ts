export type RequestAuthType = {
  email: string;
  password: string;
};

export type RequestUserType = {
  confirmPassword: string;
  email: string;
} & RequestAuthType;

export type UserType = {
  id: number;
  password: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  createdAt: Date;
  updatedAt: Date;
};

export enum UserRole {
  user = 'user',
  supplier = 'supplier',
  admin = 'admin',
}

export enum UserStatus {
  active = 'active',
  disabled = 'disabled',
  blocked = 'blocked'
}
