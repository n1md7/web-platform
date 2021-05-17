import {FileExtension, MimeType} from 'file-type';
import {AutoIncrement, Column, ForeignKey, Model, PrimaryKey, Table,} from 'sequelize-typescript';
import AnswerModel from "./AnswerModel";
import UserModel from "./UserModel";

export enum FileOwner {
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
export default class FileModel extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
  id!: number;

  @ForeignKey(() => AnswerModel)
  @ForeignKey(() => UserModel)
  @Column
  ownerId!: number;

  @Column
  owner!: FileOwner;

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
