import { CRequest } from "@shared/customRequest";
import makeUserList from "../user.list";
import { Role, UserDto } from "../user.models";
import { CustomError, InvalidPropertyError, NotFoundError, RequiredParameterError, UniqueConstraintError } from "@shared/customError";
import makeHttpResponse from "@shared/makeHttpResponse";
import makeHttpError from "@shared/makeHttpError";
import {OtpType, verifyOtp } from "@shared/otp-helper";


export default async function handleVerifyEmailRequest(httpRequest: CRequest) {
    try {
        const { email, otp } = httpRequest.body;
        if (!email) {
            throw new RequiredParameterError('Email');
        }
        if (!otp) {
            throw new RequiredParameterError('OTP');
        }

        const userList = makeUserList();
        const userFound = await userList.getUserByEmail(email);
        if (!userFound) {
            throw new NotFoundError('User not found.');
        }
        await verifyOtp(userFound.id, otp, OtpType.EMAIL_VERIFICATION);
        await userList.verifyUserEmail(userFound.id);
        const responce:UserDto ={
            id:userFound.id,
            role: userFound.role as Role,
            email:userFound.email,
        }
        return makeHttpResponse({
            statusCode: 200,
            data: responce
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
            if (error instanceof InvalidPropertyError) {
                return makeHttpError({
                    statusCode: 400,
                    errorMessage: error.message
                });
            }
            return makeHttpError({
                statusCode: 422,
                errorMessage: error.message
            });
        }

        return makeHttpError({
            statusCode: 500,
            errorMessage: 'Internal server error.'
        });
    }
}