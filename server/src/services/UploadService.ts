import fs from "fs";
import config from "../config";
import StringUtils from "../helpers/StringUtils";

export default class UploadService {
  public static async uploadFile(buffer: string, extension: string): Promise<string> {
    const checksum = StringUtils.createHashFromBuffer(buffer);
    const fileData = Buffer.from(buffer, 'hex');
    fs.writeFileSync(`${config.server.uploadDir}/${checksum}${extension}`, fileData);

    return checksum;
  }
}
