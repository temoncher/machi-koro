import { ZodIssueCode, ZodIssue } from 'zod';

import { ArrayUtils } from './array.utils';

type ErrorInfo = {
  code: ZodIssueCode;
  message: string;
};

export const convertIssueToErrorInfo = (issue: ZodIssue): ErrorInfo => {
  switch (issue.code) {
    case ZodIssueCode.invalid_type: {
      // 'undefined' is one of the types (ZodParsedType) in ZodInvalidTypeIssue.received.
      if (issue.received === 'undefined') {
        const lastKey = `'${ArrayUtils.lastItem(issue.path) as string}'`;

        return { code: issue.code, message: `'${lastKey}' required` };
      }

      return { code: issue.code, message: issue.message };
    }
    case ZodIssueCode.invalid_enum_value: {
      const lastKey = `'${ArrayUtils.lastItem(issue.path) as string}'`;
      const requiredValues = `'${issue.options.join("' or '")}'`;

      return {
        code: issue.code,
        message: `${lastKey} required and must be only ${requiredValues}`,
      };
    }
    default:
      return { code: issue.code, message: issue.message };
  }
};
