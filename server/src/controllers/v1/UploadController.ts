import Joi from "joi";
import mime from 'mime-types';
import path from "path";
import FileModel, {FileOwner, FileStatus} from "../../models/FileModel";
import UploadService from "../../services/UploadService";
import {MyContext} from "../../types/koa";
import Controller from "../Controller";

export const UploadFieldName = 'file';
export const MaxUploadFileSizeMB = 16;
export const MaxUploadFileSizeByte = MaxUploadFileSizeMB * 1024 * 1024;
export const AllowedMimeTypes = [
  mime.lookup('pdf'),
  mime.lookup('text'),
  mime.lookup('csv'),
  mime.lookup('xlsx'),
  mime.lookup('doc'),
  mime.lookup('docx'),
];

export const FileUploadSchema = Joi.object({
  fieldname: Joi.string().required().label('Field name'),
  originalname: Joi.string().required().label('Original file name'),
  mimetype: Joi.string().valid(...AllowedMimeTypes).label('Mime type'),
  size: Joi.number().positive().less(MaxUploadFileSizeByte).message(`Max file size allowed: ${MaxUploadFileSizeMB}MB`).label('File size'),
  encoding: Joi.string().label('Encoding value'),
  buffer: Joi.binary().label('Buffer value'),
});

const FileUploadParams = Joi.object({
  owner: Joi.string().valid(FileOwner.question, FileOwner.user).label('Owner value'),
  ownerId: Joi.number().positive().label('Owner identifier'),
});

class UploadController extends Controller {
  public async uploadFile(ctx: MyContext): Promise<void> {
    const validatedFile = UploadController.assert<{
      fieldname: string
      originalname: string
      mimetype: string
      size: number
      encoding: string
      buffer: string
    }>(FileUploadSchema, ctx.file);
    const validatedParam = UploadController.assert<{
      owner: FileOwner
      ownerId: number
    }>(FileUploadParams, ctx.request.body);

    // It includes dot as well e.g. ".pdf, .txt"
    const extension = path.extname(validatedFile.originalname);
    const name = await UploadService.uploadFile(validatedFile.buffer, extension);
    await FileModel.create({
      ownerId: validatedParam.ownerId,
      owner: validatedParam.owner,
      originalName: validatedFile.originalname,
      name: name,
      extension: extension,
      mime: validatedFile.mimetype,
      status: FileStatus.active
    });

    ctx.status = 201;
  }
}

export default new UploadController;
