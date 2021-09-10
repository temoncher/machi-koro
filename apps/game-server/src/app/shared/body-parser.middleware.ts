import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

import { HTTPStatusCode } from '../types/HTTPStatusCode.enum';
import { convertIssueToErrorInfo } from '../utils/zod.utils';

export const bodyParserMiddleware = <S>(schema: z.ZodType<S>) => (req: Request, res: Response, next: NextFunction): void => {
  const parsingResult = schema.safeParse(req.body);

  if (!parsingResult.success) {
    const { issues } = parsingResult.error;

    res.status(HTTPStatusCode.BAD_REQUEST).send({
      message: 'Request body validation failed',
      errors: issues.map(convertIssueToErrorInfo),
    });

    return;
  }

  next();
};
