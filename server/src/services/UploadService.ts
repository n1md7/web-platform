import fs from "fs";
import path from "path";
import {v4} from 'uuid';

export default class UploadService {
  public static async uploadFile(buffer: string, extension: string): Promise<string> {
    const fileData = Buffer.from(buffer, 'hex');
    const name = `${new Date().valueOf()}-${v4()}`;
    const uploadDir = path.join(__dirname, `../../uploads/`);
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    fs.writeFileSync(`${uploadDir}${name}${extension}`, fileData);

    return name;
  }
}
