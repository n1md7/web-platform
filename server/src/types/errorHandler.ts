export enum HttpText {
  internalServerError = 'Internal Server Error',
  badRequest = 'Bad Request',
  unauthorized = 'Unauthorized',
  forbidden = 'Forbidden',
  notFound = 'Not Found',
  noContent = 'No Content',
  accepted = 'Accepted',
  created = 'Created'
}

export enum HttpCode {
  internalServerError = 500,
  unsupportedMediaType = 415,
  badRequest = 400,
  unauthorized = 401,
  forbidden = 403,
  notFound = 404,
  noContent = 204,
  accepted = 202,
  created = 201
}

export enum ErrorType {
  error = 'Error',
  typeError = 'TypeError',
  castError = 'CastError',
  mongoError = 'MongoError',
  validationError = 'ValidationError',
  jsonWebTokenError = 'JsonWebTokenError',
  tokenExpiredError = 'TokenExpiredError',
  exposeError = 'ExposeError'
}

export enum ExceptionType {
  validationErrorException = 'ValidationErrorException',
}

export enum MongoErrorCode {
  duplicateKey = 11000
}

export type MongoErrorType = {
  message: string,
  code: number,
  keyValue: {
    [key: string]: string
  }
};