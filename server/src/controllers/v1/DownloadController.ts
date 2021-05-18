import * as fs from "fs";
import Joi from "joi";
import path from "path";
import FileModel, {FileType} from "../../models/FileModel";
import {HttpCode} from "../../types/errorHandler";
import {MyContext} from "../../types/koa";
import Controller, {UserInputValidationError} from "../Controller";

// Pattern is Date number following with UUID
const pattern = new RegExp(/^[\d]{12,13}-[\w]*-[\w]*-[\w]*-[\w]*-[\w]*$/);
const FileDownloadParams = Joi.object({
  fileHash: Joi.string().regex(pattern).label('File hash value'),
});

class DownloadController extends Controller {
  public async downloadFile(ctx: MyContext): Promise<void> {
    const validatedParam = DownloadController.assert<{ fileHash: string }>(FileDownloadParams, ctx.params);
    const file = await FileModel.findOne({
      where: {
        name: validatedParam.fileHash
      }
    }) as FileType;

    if (!file) {
      throw new UserInputValidationError(DownloadController.composeJoyErrorDetails([{
          message: 'File not found in database',
          key: 'fileHash',
          value: validatedParam.fileHash
        }]), HttpCode.notFound
      );
    }

    const filePath = path.join(__dirname, `../../../uploads/${file.name + file.extension}`);
    if (!fs.existsSync(filePath)) {
      throw new UserInputValidationError(DownloadController.composeJoyErrorDetails([{
          message: 'File not found in server',
          key: 'fileHash',
          value: validatedParam.fileHash
        }]), HttpCode.notFound
      );
    }

    ctx.body = fs.createReadStream(filePath);
    // Specifying original name so user will be downloading with that name
    ctx.set('Content-disposition', `attachment; filename=${file.originalName}`);
    ctx.set('Content-type', file.mime);
    // Ignore default behaviour and force download all kind of files
    ctx.set('Content-Type', 'application/force-download');
  }

}

export default new DownloadController;