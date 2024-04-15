import { prisma } from "@shared/prisma";
import {InvalidPropertyError, NotFoundError } from "@shared/customError";


export enum OtpType {
    FORGET_PASSWORD = "FORGET_PASSWORD",
    EMAIL_VERIFICATION = "EMAIL_VERIFICATION"
}


export function generateOtp(len: number): string {
    const digits = '0123456789';
    let OTP = '';
    for (let i = 0; i < len; i++) {
        OTP += digits[Math.floor(Math.random() * 10)];
    }

    return OTP;
};

export async function  verifyOtp(
    userId: string,
    otp: string,
    type: OtpType
): Promise<void> {
    const existOtp = await prisma.otp.findFirst({
        where: {
            userId: userId,
            otp: otp,
            type: type,
        },
    })

    if(!existOtp){
        throw new NotFoundError('OTP not found.');
    }
    if(!existOtp.otpExpiration){
        return;
    }
    const currentDate = new Date();
    if (!existOtp || existOtp.otpExpiration < currentDate) {
        throw new InvalidPropertyError('OTP expired.');
    }
};

export async function saveOtp(
    userId: string,
    otp: string,
    type: OtpType,
): Promise<void> {
    const otpExpiration = new Date();
    otpExpiration.setMinutes(otpExpiration.getMinutes() + 10);
    await prisma.otp.create({
        data: {
            userId: userId,
            otp: otp,
            type: type,
            otpExpiration: otpExpiration,
        },
    });
};