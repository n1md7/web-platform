import bcrypt from "bcrypt";
import crypto from "crypto";

export default class StringUtils {

  public static async hashPassword(password: string): Promise<string> {

    const saltRounds = 10;

    return new Promise((resolve, reject) => {
      bcrypt.hash(password, saltRounds, (error, hash) => {
        if (error) {
          reject(error);
        }

        resolve(hash);
      });
    });
  }

  public static async hashCompare(password: string, hash: string): Promise<boolean> {

    return bcrypt.compare(password, hash);
  }

  public static randomChars(len: number): string {
    return crypto.randomBytes(len / 2).toString('hex');
  }

  public static createHashFromBuffer(fileBuffer: string): string {
    const checksum = crypto.createHash('sha256');
    checksum.update(fileBuffer);

    return checksum.digest('hex');
  }

}
