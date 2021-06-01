import {AutoIncrement, Column, Model, PrimaryKey, Table,} from 'sequelize-typescript';

export enum FileOwner {
  user = 'user',
  question = 'question'
}

export enum ResetTokenStatus {
  active = 'active',
  used = 'used',
  invalidated = 'invalidated'
}

export type ResetPasswordTokenType = {
  id: number;
  email: string;
  token: string;
  status: ResetTokenStatus;
  createdAt?: Date;
  updatedAt?: Date;
}

@Table({
  tableName: 'resetPasswordTokens',
  timestamps: true
})
export default class ResetPasswordTokenModel extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
  id!: number;

  @Column
  email!: string;

  @Column
  token!: string;

  @Column
  status!: ResetTokenStatus;
}
