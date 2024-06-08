import { CRequest } from "@shared/customRequest";
import makeCredentials from "../credentials";
import { userList } from "@application/user";
import { CustomError, NotFoundError, RequiredParameterError } from "@shared/customError";
import makeHttpResponse from "@shared/makeHttpResponse";
import makeHttpError from "@shared/makeHttpError";
import { comparePassword } from "@application/services/hash-services";
import { generateTokens } from "@application/services/jwt-services";
import { LoginAccessData, UserDto } from "../credentials.models";
import { Role } from "@application/user/user.models";
import * as  organizationList from "@application/oraganizatins/organization.list";


export async function handleLoginRequest(httpRequest: CRequest) {
    try {
        const credentials = httpRequest.body;
        const credentialsValidated = makeCredentials(credentials);
        const userFound = await userList.getUserByEmail(credentialsValidated.email)

        if (!userFound) {
            throw new NotFoundError('User with email and password not found.')
        }
        const passwordMatch = await comparePassword(credentialsValidated.password, userFound.password, userFound.saltRounds);
        if (!passwordMatch) {
            throw new NotFoundError('User with email and password not found.')
        }
        const memberOf = await organizationList.getOrganizationsUserMemberOf(userFound.id);
        const ownerOf = await organizationList.getOraganizationsByUserId(userFound.id);
        const {accessToken, refreshToken} = generateTokens(userFound.id, userFound.email,userFound.role as Role, memberOf);
        const user: UserDto = {
            id: userFound.id,
            email: userFound.email,
            isEmailVerified: userFound.isEmailVerified,
            role: userFound.role,
            memberOf: memberOf,
            ownerOf: ownerOf
        }
        const loginAccessData: LoginAccessData = {
            accessToken,
            refreshToken,
            user
        }
        return makeHttpResponse({
            statusCode: 200,
            data: loginAccessData
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