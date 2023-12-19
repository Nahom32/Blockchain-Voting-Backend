import { RequiredParameterError, InvalidPropertyError } from '../../shared/ customError';
import { User } from './user.models';


export default function makeUser(user: any, saltRounds:number): User {

    if (!user.email) {
        throw new RequiredParameterError('User must have an email.')
    }
    
    const validEmail = validateEmail(user.email)

    if (!validEmail) {
        throw new InvalidPropertyError('User must have a valid email.')
    }

    if (!user.password) {
        throw new RequiredParameterError('User must have a password.')
    }

    return {
        email: user.email,
        password: user.password,
        saltRounds: saltRounds
    }
}

function validateEmail(email: string) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}