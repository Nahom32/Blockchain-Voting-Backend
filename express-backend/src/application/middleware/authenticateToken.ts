import { verifyAccessToken } from '@application/services/jwt-services';
import { CRequest } from '@shared/customRequest';
import { Response, NextFunction } from 'express';


export function authenticateToken(req: CRequest, res: Response, next: NextFunction) {
  const requestHeader = req.headers['authorization'];
  const token = requestHeader && requestHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({success: false, error: 'Unauthorized' });
  }

  try {
    const user = verifyAccessToken(token);
    req.user = user;
    next();
  } catch (error) {
    console.error(error);
    res.status(403).json({success: false, error: 'Forbidden' });
  }
}