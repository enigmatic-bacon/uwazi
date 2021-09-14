import { Request, Response, NextFunction } from 'express';

export default (req: Request, res: Response, next: NextFunction) => {
  if (!['POST', 'DELETE', 'PUT', 'OPTIONS'].includes(req.method)) {
    return next();
  }
  if (req.get('X-Requested-With') === 'XMLHttpRequest') {
    return next();
  }
  res.status(401);
  return res.json({ error: 'Unauthorized', message: 'X-Requested-With header was not found!' });
};
