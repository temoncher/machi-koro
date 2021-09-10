import * as express from 'express';

/**
 * https://stackoverflow.com/questions/56973265/what-does-express-async-handler-do
 */
export const asyncHandler = <T extends express.RequestHandler<any, any, any, any, any>>(fn: T): T => {
  // eslint-disable-next-line @typescript-eslint/promise-function-async
  const handlerFunction: express.RequestHandler = (...args) => {
    const requestHandlerPromise = fn(...args);
    const next = args[args.length - 1] as express.NextFunction;

    return Promise.resolve(requestHandlerPromise).catch(next);
  };

  // https://stackoverflow.com/questions/56505560/how-to-fix-ts2322-could-be-instantiated-with-a-different-subtype-of-constraint
  return handlerFunction as unknown as T;
};
