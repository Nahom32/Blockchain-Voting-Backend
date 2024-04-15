import { RequiredParameterError } from "@shared/customError";
import { Credentials } from "./credentials.models";
import AuthErrorMessage from "./auth-error-message";


export default function makeCredentials(credentials:Credentials):Credentials {

    if (!credentials.email) {
        throw new RequiredParameterError(AuthErrorMessage.EMAIL_CANNOT_BE_EMPTY)
    }

    if (!credentials.password) {
        throw new RequiredParameterError(AuthErrorMessage.PASSWORD_CANNOT_BE_EMPTY)
    }

    return {
        email: credentials.email,
        password: credentials.password
    }
}