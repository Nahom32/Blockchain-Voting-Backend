import { CRequest } from "@shared/customRequest";
import * as  userList from "../user.list";
import { Role, UserDto } from "../user.models";
import { CustomError, InvalidPropertyError, NotFoundError, RequiredParameterError, UniqueConstraintError } from "@shared/customError";
import makeHttpResponse from "@shared/makeHttpResponse";
import makeHttpError from "@shared/makeHttpError";
import {OtpType, verifyOtp } from "@shared/otp-helper";
import { hashPassword } from "@application/services/hash-services";

export default async function handleResetPasswordRequest(httpRequest: CRequest) {
    try {
        const { email, otp, password, confirmPassword } = httpRequest.body;
        if (!email) {
            throw new RequiredParameterError('Email');
        }
        if (!otp) {
            throw new RequiredParameterError('OTP');
        }
        if (!password) {
            throw new RequiredParameterError('Password');
        }
        if (!confirmPassword) {
            throw new RequiredParameterError('Confirm Password');
        }
        if(password !== confirmPassword){
            throw new InvalidPropertyError('Password and Confirm Password must be same.');
        }

        const userFound = await userList.getUserByEmail(email);
        if (!userFound) {
            throw new NotFoundError('User not found.');
        }
        await verifyOtp(userFound.id, otp, OtpType.FORGET_PASSWORD);
        const saltRounds = 10;

        const hashedPassword = await hashPassword(password, saltRounds);

        await userList.updateUserPassword(userFound.id, hashedPassword);
        const response:UserDto ={
            id:userFound.id,
            role: userFound.role as Role,
            email:userFound.email,
        }
        return makeHttpResponse({
            statusCode: 200,
            data: response
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
