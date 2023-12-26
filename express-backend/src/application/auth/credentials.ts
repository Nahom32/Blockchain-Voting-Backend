import { RequiredParameterError } from "@shared/ customError";
import { Credentials } from "./credentials.models";


export default function makeCredentials(credentials:any):Credentials {

    if (!credentials.email) {
        throw new RequiredParameterError('email cannot be empty.')
    }

    if (!credentials.password) {
        throw new RequiredParameterError(' password cannot be empty. ')
    }

    return {
        email: credentials.email,
        password: credentials.password
    }
}