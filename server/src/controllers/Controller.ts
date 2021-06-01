import Joi, {NumberSchema, ObjectSchema, StringSchema} from "joi";
import JsonWebToken from 'jsonwebtoken';
import StringUtils from "../helpers/StringUtils";
import {ErrorType, HttpCode} from "../types/errorHandler";
import {JwtPayload, UserRole} from "./v1/UserController";

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
    const optionValues = {
      status: HttpCode.badRequest,
      exceptionMessage: 'Validation Error',
      errorType: ErrorType.exposeError,
      expose: true,
      ...options
    };

    super((optionValues as Options).exceptionMessage);
    this.name = (optionValues as Options).errorType;
    this.status = (optionValues as Options).status;
    this.expose = (optionValues as Options).expose;
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

  protected static generateNewJWT<Claims = JwtPayload>(claims: Claims): string {

    return JsonWebToken.sign(
      claims,
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN,
      }
    );
  }

  protected static generateRefreshTokenString(): string {
    return StringUtils.randomChars(128);
  }
}
