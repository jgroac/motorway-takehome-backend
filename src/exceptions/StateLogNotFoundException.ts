import Exception, {
  errorCodes,
  exceptionTypes,
  ExceptionJSON,
} from './Exception';

export default class StateLogNotFoundException
  extends Error
  implements Exception
{
  private paramKey = '';
  private paramValue = '';

  constructor(paramKey: string, paramValue: string) {
    const message = `State log for vehicle ${paramValue} not found`;
    super(message);
    this.name = this.constructor.name;
    this.paramKey = paramKey;
    this.paramValue = paramValue;
    Object.setPrototypeOf(this, StateLogNotFoundException.prototype);
  }

  toJSON(): ExceptionJSON {
    return {
      status: 404,
      error: {
        code: errorCodes.resourceMissing,
        type: exceptionTypes.notFound,
        message: this.message,
        param: this.paramKey,
      },
    };
  }
}
