import fs from "fs";
import path from "path";
import {uuid} from "uuidv4";

export default class UploadService {
  public static async uploadFile(buffer, extension: string): Promise<string> {
    const fileData = Buffer.from(buffer, 'hex');
    const name = `${new Date().valueOf()}-${uuid()}.${extension}`;
    const uploadDir = path.join(__dirname, `../../uploads/`);
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    fs.writeFileSync(`${uploadDir}${name}`, fileData);

    return name;
  }
}
