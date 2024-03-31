import { NextFunction, Request, Response } from 'express';

export function formatDateFields(req: Request, res: Response, next: NextFunction) {
    const dateFields = ['createdAt', 'updatedAt'];

    dateFields.forEach(field => {
        if (req.body[field]) {
            const date = new Date(req.body[field]);
            if (!isNaN(date.getTime())) { 
                req.body[field] = date.toISOString();
            } else {

                console.log(`Invalid date for field ${field}: ${req.body[field]}`);
            }
        }
    });

    next();
}
