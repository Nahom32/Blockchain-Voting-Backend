import { InvalidPropertyError, RequiredParameterError } from '@shared/ customError';
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
    if(!user.confirmPassword){
        throw new RequiredParameterError('User must have a confirm password.')
    }
    if(user.password !== user.confirmPassword){
        throw new InvalidPropertyError('Password and confirm password must be same.')
    }

    return {
        email: user.email,
        password: user.password,
        role: user.role,
        saltRounds: saltRounds
    }
}

function validateEmail(email: string) {
    const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return emailRegex.test(email);
}