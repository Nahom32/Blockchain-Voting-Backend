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

  export function generateTokens( id:string, email:string): { accessToken: string; refreshToken: string } {
    const accessToken = signToken({ id, email }, process.env.ACCESS_TOKEN_SECRET_KEY as string, { expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN });
    const refreshToken = signToken({ id, email }, process.env.REFRESH_TOKEN_SECRET_KEY as string, { expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN });

    return { accessToken, refreshToken };
  }
  
  export function refreshAccessToken(refreshToken: string): { accessToken: string; refreshToken: string } {
    const decoded = verifyToken(refreshToken, process.env.REFRESH_TOKEN_SECRET_KEY as string);
    const tokens = generateTokens(decoded.id, decoded.email);
  
    return tokens;
  }

  export function verifyAccessToken(accessToken: string): any {
    const decoded = verifyToken(accessToken, process.env.ACCESS_TOKEN_SECRET_KEY as string);
    return decoded;
  }