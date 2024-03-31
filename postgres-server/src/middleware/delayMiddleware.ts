import { NextFunction, Request, Response } from 'express';

function delayMiddleware(delay = 1000) {
    return function (req: Request, res: Response, next: NextFunction) {
        setTimeout(next, delay);
    };
}

export default delayMiddleware;
