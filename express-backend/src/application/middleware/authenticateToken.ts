import { Response, NextFunction } from 'express';
import { verifyToken } from '../services/jwt-and-hash-services';
import { CRequest } from '../../shared/customRequest';

export function authenticateToken(req: CRequest, res: Response, next: NextFunction) {
  const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(403).json({ error: 'Forbidden' });
  }
}