import { Request, Response, NextFunction } from 'express';

declare global {
  namespace Express {
    interface Request {
      pagination: {
        skip: number;
        take: number;
        page: number;
        pageSize: number;
      };
    }
  }
}
const DEFAULT_PAGE_SIZE = 50;
const paginationMiddleware = (req: Request, res: Response, next: NextFunction) => {
  if (req.method === 'GET') {
    const page = parseInt(req.query.page as string, 10) || 1;
    const pageSize = parseInt(req.query.pageSize as string, 10) || DEFAULT_PAGE_SIZE;
    req.pagination = {
      skip: (page - 1) * pageSize,
      take: pageSize,
      page,
      pageSize,
    };
  }
  next();
};
export default paginationMiddleware;
