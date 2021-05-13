import {ValidationErrorItem} from 'joi';
import {Context, Next} from "koa";
import {ErrorType, ExceptionType, HttpCode, HttpText,} from "../types/errorHandler";

interface MyError extends Error {
  details?: ValidationErrorItem,
  status?: number,
  expose?: boolean
}

class ErrorHandler {
  static async handle(ctx: Context, next: Next): Promise<void> {
    await next().catch(error => {
      ErrorHandler.handleEverythingElse(error, ctx);
    });
  }

  private static buildErrorMessage(error: MyError, ctx: Context) {
    const status: number = error.status || ctx.status || HttpCode.internalServerError;
    const errorMessage: string = error.message || error.details?.toString() || HttpText.internalServerError;

    return `[${error.name}:${status}] - [${errorMessage}]`;
  }

  private static handleEverythingElse(error: MyError, ctx: Context) {

    switch (error.name) {
      case ExceptionType.validationErrorException:
        ctx.status = HttpCode.badRequest;
        ctx.body = error.details.message;
        break;
      case ErrorType.jsonWebTokenError:
      case ErrorType.tokenExpiredError:
        ctx.status = HttpCode.unauthorized;
        ctx.body = error.message;
        break;
      case ErrorType.error:
      case ErrorType.validationError:
        ctx.status = HttpCode.badRequest;
        ctx.body = error.message;
        break;
      case ErrorType.typeError:
      case ErrorType.castError:
        ctx.status = HttpCode.badRequest;
        ctx.body = HttpText.badRequest;
        break;
      default:
        ctx.status = HttpCode.internalServerError;
        ctx.body = HttpText.internalServerError;
    }

    if (error.status > 0) {
      ctx.status = error.status;
      ctx.body = error.message;
    }

    ctx.app.emit('error:server', ErrorHandler.buildErrorMessage(error, ctx));
  }
}

export default ErrorHandler.handle;