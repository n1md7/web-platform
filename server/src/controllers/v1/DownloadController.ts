import * as fs from "fs";
import Joi from "joi";
import path from "path";
import config from "../../config";
import FileModel, {FileType} from "../../models/FileModel";
import {HttpCode} from "../../types/errorHandler";
import {MyContext} from "../../types/koa";
import Controller, {ExposeError} from "../Controller";

enum Download {
  force,
  default,
}

// Pattern is hex value of file hash (checksum - SHA256)
const pattern = new RegExp(/^[A-Fa-f0-9]{64}$/);
const FileDownloadParams = Joi.object({
  fileHash: Joi.string().regex(pattern).label('File hash value'),
  forceDownload: Joi.number().optional().default(Download.force).valid(Download.force, Download.default).label('Force download'),
});

class DownloadController extends Controller {
  public async downloadFile(ctx: MyContext): Promise<void> {
    const validatedParam = DownloadController.assert<{ fileHash: string, forceDownload?: number }>(FileDownloadParams, ctx.params);
    const file = await FileModel.findOne({
      where: {
        name: validatedParam.fileHash
      }
    }) as FileType;

    if (!file) {
      throw new ExposeError(DownloadController.composeJoyErrorDetails([{
          message: 'File not found in database',
          key: 'fileHash',
          value: validatedParam.fileHash
        }]), {
          status: HttpCode.notFound,
          exceptionMessage: 'Not found'
        }
      );
    }

    const filePath = path.join(config.server.uploadDir, file.name + file.extension);
    if (!fs.existsSync(filePath)) {
      throw new ExposeError(DownloadController.composeJoyErrorDetails([{
          message: 'File not found in server',
          key: 'fileHash',
          value: validatedParam.fileHash
        }]), {
          status: HttpCode.notFound,
          exceptionMessage: 'Not found'
        }
      );
    }

    ctx.body = fs.createReadStream(filePath);
    // Specifying original name so user will be downloading with that name
    ctx.set('Content-disposition', `attachment; filename=${file.originalName}`);
    ctx.set('Content-type', file.mime);
    if (validatedParam.forceDownload === Download.force) {
      // Ignore default behaviour and force download all kind of files
      ctx.set('Content-Type', 'application/force-download');
    }
  }

}

export default new DownloadController;