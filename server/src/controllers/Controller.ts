import Joi from "joi";
import {HttpCode} from "../types/errorHandler";

class KoaError extends Error {
  private status: number;
  private expose: boolean;

  constructor(status: number, name: string, expose = true) {
    super(name);
    this.status = status;
    this.expose = expose;
  }
}

export default abstract class Controller {
  public static assert<P = any>(schema: Joi.ObjectSchema<any>, validationParams: P): P {
    const validation = schema.validate(validationParams);
    if (validation.error as Joi.ValidationError) {
      throw new KoaError(HttpCode.badRequest, validation.error.details.pop().message);
    }

    return validation.value;
  }
}
