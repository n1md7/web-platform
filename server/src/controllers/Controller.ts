import Joi, {NumberSchema, ObjectSchema, StringSchema} from "joi";
import {ErrorType, HttpCode} from "../types/errorHandler";
import {UserRole} from "./v1/UserController";

type Options = {
  status?: HttpCode,
  exceptionMessage?: string;
  errorType?: ErrorType;
  expose?: boolean;
}

export class ExposeError extends Error {
  public status: number;
  public expose: boolean;
  public details: Joi.ValidationErrorItem[] | null;

  constructor(error: Joi.ValidationErrorItem[], options?: Options) {
    options.status = options.status || HttpCode.badRequest;
    options.exceptionMessage = options.exceptionMessage || 'Validation Error';
    options.errorType = options.errorType || ErrorType.exposeError;
    options.expose = options.expose || true;

    super((options as Options).exceptionMessage);
    this.name = (options as Options).errorType;
    this.status = (options as Options).status;
    this.expose = (options as Options).expose;
    this.details = error;
  }
}

interface AllowedRoles {
  currentRole: (role: string) => void
}

export default abstract class Controller {
  public static assert<P = any>(schema: ObjectSchema<any> | NumberSchema | StringSchema, validationParams: P): P {
    // Return all the errors detected during the validation
    const validation: Joi.ValidationResult = schema.validate(validationParams, {abortEarly: false});
    if (validation.error) {
      throw new ExposeError((validation as Joi.ValidationResult).error.details);
    }

    return validation.value;
  }

  public static composeJoyErrorDetails(params: {
    message: string,
    label?: string,
    value?: string,
    key?: string
  }[]): Joi.ValidationErrorItem[] {
    return params.map(param => ({
      message: param.message,
      context: {
        label: param.label || '',
        value: param.value || '',
        key: param.key || ''
      }
    })) as Joi.ValidationErrorItem[];
  }

  public static allowed(allowedRoles: UserRole[]): AllowedRoles {
    return {
      currentRole: (currentRole: UserRole) => {
        if (!allowedRoles.includes(currentRole)) {
          throw new ExposeError(Controller.composeJoyErrorDetails([{
            message: 'Your user does not have permission to access this endpoint'
          }]), {
            exceptionMessage: 'Access denied',
            status: HttpCode.forbidden
          });
        }
      }
    }
  }
}
