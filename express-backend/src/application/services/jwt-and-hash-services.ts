import bcrypt from 'bcrypt';
import jwt, { VerifyOptions } from 'jsonwebtoken';
import { SECRET_KEY } from '../../config';


export async function hashPassword(password:string, saltRounds:number){
  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
  } catch (error) {
    throw new Error('Internal Server Error');
  }
}

export async function comparePassword(password:string, hashedPassword:string, saltRounds:number){
  try {
    const isPasswordValid = await bcrypt.compare(password, hashedPassword);
    return isPasswordValid;
  } catch (error) {
    throw new Error('Internal Server Error');
  }
}

export function signToken(payload: any, options: jwt.SignOptions = {}) {
    try {
        const token = jwt.sign(payload, SECRET_KEY, options);
        return token;
    } catch (error) {
        throw new Error('Internal Server Error');
    }
}

export function verifyToken(token: string, options?: VerifyOptions): any {
    try {
      const decoded = jwt.verify(token, SECRET_KEY, options);
      return decoded;
    } catch (error) {
      throw new Error('Unauthorized');
    }
  }