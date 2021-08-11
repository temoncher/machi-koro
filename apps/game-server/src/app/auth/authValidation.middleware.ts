import { Request, Response, NextFunction } from 'express';
import { ZodError, ZodIssueCode, ZodIssue } from 'zod';

import { HTTPStatusCode } from '../common/HTTPStatusCode.enum';
import { ArrayUtils } from '../utils/array.utils';

import { AuthRequestBodySchema } from './authRequestBody.schema';

type ErrorInfo = {
  code: ZodIssueCode;
  message: string;

};

const convertZodIssueToErrorInfo = (issue: ZodIssue): ErrorInfo => {
  switch (issue.code) {
    case ZodIssueCode.invalid_type: {
      // 'undefined' is one of the types (ZodParsedType) in ZodInvalidTypeIssue.received.
      if (issue.received === 'undefined') {
        const lastKey = `'${ArrayUtils.lastItem(issue.path)}'`;

        return { code: issue.code, message: `'${lastKey}' required` };
      }

      return { code: issue.code, message: issue.message };
    }
    case ZodIssueCode.invalid_enum_value: {
      const lastKey = `'${ArrayUtils.lastItem(issue.path)}'`;
      const requiredValues = `'${issue.options.join("' or '")}'`;

      return { code: issue.code, message: `${lastKey} required and must be only ${requiredValues}` };
    }
    default:
      return { code: issue.code, message: issue.message };
  }
};

export const authValidationMiddleware = (schema: AuthRequestBodySchema) => (req: Request, res: Response, next: NextFunction): void => {
  try {
    schema.parse(req);
    next();
  } catch (error: unknown) {
    if (error instanceof ZodError) {
      const { issues } = error;

      res.status(HTTPStatusCode.BAD_REQUEST).send({
        message: 'Auth validation failed',
        errors: issues.map(convertZodIssueToErrorInfo),
      });
    } else {
      res.status(HTTPStatusCode.INTERNAL_ERROR).send('Internal Server Error');
    }
  }
};
