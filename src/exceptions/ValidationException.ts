import Exception, {
  errorCodes,
  exceptionTypes,
  ExceptionJSON,
} from './Exception';

export default class ValidationException extends Error implements Exception {
  private paramKey = '';
  private paramValue = '';

  constructor(paramKey: string, paramValue: string, message: string) {
    super(message);
    this.name = this.constructor.name;
    this.paramKey = paramKey;
    this.paramValue = paramValue;
    Object.setPrototypeOf(this, ValidationException.prototype);
  }

  toJSON(): ExceptionJSON {
    return {
      status: 400,
      error: {
        code: errorCodes.invalidParams,
        type: exceptionTypes.invalidRequest,
        message: this.message,
        param: this.paramKey,
      },
    };
  }
}
