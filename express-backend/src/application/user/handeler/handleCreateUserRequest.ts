import { CRequest } from "@shared/customRequest";
import makeUser from "../user";
import makeUserList from "../user.list";
import { Role, User, UserDto } from "../user.models";
import { CustomError, InvalidPropertyError, RequiredParameterError, UniqueConstraintError } from "@shared/ customError";
import makeHttpResponse from "@shared/makeHttpResponse";
import makeHttpError from "@shared/makeHttpError";
import { hashPassword } from "@application/services/hash-services";
import {verifyEmailTemplate} from '@shared/templates';
import sendMail, { MailInterface } from "@application/services/emials.services";
import {OtpType, generateOtp, saveOtp } from "@shared/otp-helper";



async function handleCreateUserRequest(httpRequest: CRequest) {
    try {
      // generate roandom salt using rondom generator
      const saltRounds = 10;

      const user:User = makeUser(httpRequest.body, saltRounds);
      const userList = makeUserList();
      const userFound = await userList.getUserByEmail(user.email);
      if(userFound){
        throw new UniqueConstraintError('User already exists.')
      }
  

      const hashedPassword = await hashPassword(user.password, saltRounds);
      user.password = hashedPassword;

      const newUser = await userList.createUser(user);
      const responce:UserDto ={
        id:newUser.id,
        role: newUser.role as Role,
        email:newUser.email,
      }
      let tokenExpiration: any = new Date();
        tokenExpiration = tokenExpiration.setMinutes(
            tokenExpiration.getMinutes() + 10
        );

        const otp: string = generateOtp(6);
        await saveOtp(newUser.id, otp, OtpType.EMAIL_VERIFICATION);
        const emailTemplate = verifyEmailTemplate(otp);
        const mail: MailInterface = {
            to: user.email,
            subject: 'Verify your email',
            html: emailTemplate.html,
        };

        await sendMail(mail);

      return makeHttpResponse({
        statusCode: 201,
        data: responce
      });

    } catch (error) {
      console.error(error);
      if(error instanceof CustomError){

        if(error instanceof RequiredParameterError){
           return makeHttpError({
            statusCode: 400,
            errorMessage: error.message
          });
        }

        if(error instanceof InvalidPropertyError){
            return makeHttpError({
            statusCode: 400,
            errorMessage: error.message
          });
        }

        if(error instanceof UniqueConstraintError){
            return makeHttpError({
            statusCode: 409,
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
        errorMessage: "User could not be created."
      });
    }
  }
  
export default handleCreateUserRequest;