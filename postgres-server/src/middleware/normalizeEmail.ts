import { Request, Response, NextFunction } from 'express';

const normalizeEmail = (req: Request, res: Response, next: NextFunction): void => {
    if (req.query.email && typeof req.query.email === 'string') {
        req.query.email = req.query.email.toLowerCase();
    }

    if (Array.isArray(req.body)) {
        req.body = req.body.map(item => {
            if (item.email && typeof item.email === 'string') {
                item.email = item.email.toLowerCase();
            }
            return item;
        });
    } else {
        if (req.body.email && typeof req.body.email === 'string') {
            req.body.email = req.body.email.toLowerCase();
        }
    }

    next();
};

export default normalizeEmail;
