import * as userList from "../user.list";
import {
  CustomError,
  NotFoundError,
  RequiredParameterError
} from "@shared/customError";
import makeHttpResponse from "@shared/makeHttpResponse";
import makeHttpError from "@shared/makeHttpError";
import { forgetPasswordEmail } from "@shared/templates";
import sendMail, { MailInterface } from "@application/services/emials.services";
import { OtpType, generateOtp, saveOtp } from "@shared/otp-helper";
import { CRequest } from "@shared/customRequest";

export default async function handleForgetPasswordRequest(
  httpRequest: CRequest
) {
  try {
    const { email } = httpRequest.body;
    if (!email) {
      throw new RequiredParameterError("Email");
    }
    const userFound = await userList.getUserByEmail(email);
    if (!userFound) {
      throw new NotFoundError("User not found.");
    }
    const otp: string = generateOtp(6);
    await saveOtp(userFound.id, otp, OtpType.FORGET_PASSWORD);
    const emailTemplate = forgetPasswordEmail(otp);
    const mail: MailInterface = {
      to: userFound.email,
      subject: "Reset your password",
      html: emailTemplate.html,
    };

    await sendMail(mail);

    return makeHttpResponse({
      statusCode: 200,
      data: {
        message: "An email has been sent to your email address.",
      },
    });
  } catch (error) {
    console.error(error);
    if (error instanceof CustomError) {
      if (error instanceof NotFoundError) {
        return makeHttpError({
          statusCode: 404,
          errorMessage: error.message,
        });
      }
      return makeHttpError({
        statusCode: 422,
        errorMessage: error.message,
      });
    }

    return makeHttpError({
      statusCode: 500,
      errorMessage: "Internal server error.",
    });
  }
}
