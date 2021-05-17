import {mimeTypes} from 'file-type';
import Joi from "joi";
import path from "path";
import UploadService from "../../services/UploadService";
import {MyContext} from "../../types/koa";
import Controller from "../Controller";

export const UploadFieldName = 'file';
export const MaxUploadFileSizeMB = 16;
export const MaxUploadFileSizeByte = MaxUploadFileSizeMB * 1024 * 1024;

export const FileUploadSchema = Joi.object({
  fieldname: Joi.string().required().label('Field name'),
  originalname: Joi.string().required().label('Original file name'),
  mimetype: Joi.string().valid(...mimeTypes).label('Mime type'),
  size: Joi.number().positive().less(MaxUploadFileSizeByte).message(`Max file size allowed: ${MaxUploadFileSizeMB}MB`).label('File size'),
  encoding: Joi.string().label('Encoding value'),
  buffer: Joi.binary().label('Buffer value'),
});

class UploadController extends Controller {
  public async uploadFile(ctx: MyContext): Promise<void> {
    const validated = UploadController.assert(FileUploadSchema, ctx.file);
    const extension = path.extname(validated.originalname);
    // TODO save in DB
    await UploadService.uploadFile(validated.buffer, extension);
    // console.log({file});
    ctx.status = 201;
  }

}

export default new UploadController;