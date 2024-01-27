import { CRequest } from "@shared/customRequest";
import makeCredentials from "../credentials";
import { makeUserList } from "@application/user";
import { CustomError, NotFoundError, RequiredParameterError } from "@shared/ customError";
import makeHttpResponse from "@shared/makeHttpResponse";
import makeHttpError from "@shared/makeHttpError";
import { comparePassword } from "@application/services/hash-services";
import { generateTokens } from "@application/services/jwt-services";
import { LoginAccessData } from "../credentials.models";


export async function handleLoginRequest(httpRequest: CRequest) {
    try {
        const credentials = httpRequest.body;
        const credentialsValidated = makeCredentials(credentials);
        const userList = makeUserList();
        const userFound = await userList.getUserByEmail(credentialsValidated.email)

        if (!userFound) {
            throw new NotFoundError('User with email and password not found.')
        }
        const passwordMatch = await comparePassword(credentialsValidated.password, userFound.password, userFound.saltRounds);
        if (!passwordMatch) {
            throw new NotFoundError('User with email and password not found.')
        }

        const tokens:LoginAccessData = generateTokens(userFound.id, userFound.email);

        return makeHttpResponse({
            statusCode: 200,
            data: tokens
        });

    } catch (error) {
        console.error(error);
        if (error instanceof CustomError) {
            if (error instanceof NotFoundError) {
                return makeHttpError({
                    statusCode: 404,
                    errorMessage: error.message
                });
            }
            if (error instanceof RequiredParameterError) {
                return makeHttpError({
                    statusCode: 400,
                    errorMessage: error.message
                });
            }

            return makeHttpError({
                statusCode: 400,
                errorMessage: error.message
            });
        }
        return makeHttpError({
            statusCode: 500,
            errorMessage: "Something went wrong."
        });
    }
}