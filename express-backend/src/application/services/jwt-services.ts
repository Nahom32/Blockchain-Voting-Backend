import { Role } from '@application/user/user.models';
import { UnauthorizedError } from '@shared/ customError';
import jwt, { VerifyOptions } from 'jsonwebtoken';

function signToken(payload: any, secretKey:string, options: jwt.SignOptions = {}) {
    try {
        const token = jwt.sign(payload, secretKey, options);
        return token;
    } catch (error) {
        throw error;
    }
}

function verifyToken(token: string, secretKey:string, options?: VerifyOptions): any {
    try {
      const decoded = jwt.verify(token, secretKey, options);
      return decoded;
    } catch (error) {
      console.error(error);
      throw new UnauthorizedError('Unauthorized');
    }
  }

  export function generateTokens( id:string, email:string, role: Role): { accessToken: string; refreshToken: string } {
    const accessToken = signToken({ id, email, role }, process.env.ACCESS_TOKEN_SECRET_KEY as string);
    const refreshToken = signToken({ id, email, role }, process.env.REFRESH_TOKEN_SECRET_KEY as string);

    return { accessToken, refreshToken };
  }
  
  export function refreshAccessToken(refreshToken: string): { accessToken: string; refreshToken: string } {
    const decoded = verifyToken(refreshToken, process.env.REFRESH_TOKEN_SECRET_KEY as string);
    const tokens = generateTokens(decoded.id, decoded.email, decoded.role);
  
    return tokens;
  }

  export function verifyAccessToken(accessToken: string): any {
    const decoded = verifyToken(accessToken, process.env.ACCESS_TOKEN_SECRET_KEY as string);
    return decoded;
  }