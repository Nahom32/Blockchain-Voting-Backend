import makeCredentials from "./credentials";
import { Credentials } from "./credentials.models";
import AuthErrorMessage from "./auth-error-message";


describe('Credentials', () => {
    test('should throw an error if email is not provided', () => {
        const credentials: Credentials = {
            email: '',
            password: 'password'
        }
        expect(() => makeCredentials(credentials)).toThrow(AuthErrorMessage.EMAIL_CANNOT_BE_EMPTY)
    })

    test('should throw an error if password is not provided', () => {
        const credentials: Credentials = {
            email: 'email',
            password: ''
        }
        expect(() => makeCredentials(credentials)).toThrow(AuthErrorMessage.PASSWORD_CANNOT_BE_EMPTY)
    })

    test('should return credentials if email and password are provided', () => {
        const credentials: Credentials = {
            email: 'email',
            password: 'password'
        }
        expect(makeCredentials(credentials)).toEqual(credentials)
    })
});
