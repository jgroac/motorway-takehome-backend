type ExceptionStatusCode = 400 | 401 | 403 | 404 | 500;

export const errorCodes = {
  resourceMissing: 'RESOURCE_MISSING',
  invalidParams: 'INVALID_PARAMS',
} as const;

export const exceptionTypes = {
  notFound: 'NOT_FOUND_EXCEPTION',
  invalidRequest: 'INVALID_REQUEST_EXCEPTION',
} as const;

type ExceptionTypes = typeof exceptionTypes[keyof typeof exceptionTypes];
type ErrorCodeType = typeof errorCodes[keyof typeof errorCodes];

export interface ExceptionJSON {
  status: ExceptionStatusCode;
  error: {
    code: ErrorCodeType;
    type: ExceptionTypes;
    message: string;
    param: string;
  };
}

export default interface Exception {
  toJSON(): ExceptionJSON;
}
