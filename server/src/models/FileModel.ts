import {AutoIncrement, Column, ForeignKey, Model, PrimaryKey, Table,} from 'sequelize-typescript';
import UserModel from "./UserModel";
import {FileExtension, MimeType} from 'file-type';

export enum Owner {
  user = 'user',
  answer = 'answer'
}

export enum FileStatus {
  active = 'active',
  removed = 'removed'
}

@Table({
  tableName: 'files',
  timestamps: true
})
export default class AnswerModel extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
  id!: number;

  @ForeignKey(() => AnswerModel)
  @ForeignKey(() => UserModel)
  @Column
  ownerId!: number;

  @Column
  owner!: Owner;

  @Column
  originalName!: string;

  @Column
  name!: string;

  @Column
  extension!: FileExtension;

  @Column
  mime!: MimeType;

  @Column
  status!: FileStatus;
}
