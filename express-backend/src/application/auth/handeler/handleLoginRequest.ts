import { makeUserList } from "../../user";
import makeCredentials from "../credentials";
import makeHttpError from '../../../shared/makeHttpError';
import makeHttpResponse from '../../../shared/makeHttpResponse';
import { CustomError, NotFoundError, RequiredParameterError } from "../../../shared/ customError";
import { comparePassword, signToken } from "../../services/jwt-and-hash-services";
import { CRequest } from "../../../shared/customRequest";
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

        const token = signToken(userFound.email);

        const responce:LoginAccessData = {
            accessToken:token
        }
        return makeHttpResponse({
            statusCode: 200,
            data: responce
        });

    } catch (error) {
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