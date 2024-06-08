import { userList } from "@application/user";
import * as otp from "@shared/otp-helper";
import * as mail from "@application/services/emials.services";
import * as hashPassword from "@application/services/hash-services";
import supertest from "supertest";
import app from "../../app";

export const userInput = {
  email: "test@example.com",
  password: "Password123",
  confirmPassword: "Password123",
  role: "ADMIN",
};

export const userPayload = {
  id: "1",
  email: userInput.email,
  password: userInput.password,
  isEmailVerified: false,
  role: "ADMIN",
  saltRounds: 10,
  createdAt: new Date(),
  updatedAt: new Date(),
}

export const verifyEmailPayload = {
  email: userInput.email,
  otp: "123456",
}


export const organizationListPayload = [
  {
      organizationId: '1',
      name: 'Test Organization',
      shortName: 'TO',
      isActive: true,
      userId: '1',
  },
  {
      organizationId: '2',
      name: 'Test Organization 2',
      shortName: 'TO2',
      isActive: true,
      userId: '2',
  }
]

export const organizationInput = {
  name: 'Test Organization',
  shortName: 'TO',
}

export const organizationMemberInput = {
  name: 'Test User',
  email: 'test@host.com',
  organizationId: '1',
}

export const organizationMemberPayload = {
  id: '1',
  name: 'Test User',
  email: 'test@host.com',
  organizationId: '1',
}

export const organizationMemberListPayload = [
  {
      id: '1',
      name: 'Test User',
      email: 'test@host.com',
      organizationId: '1',
  },
  {
      id: '2',
      name: 'Test User 2',
      email: 'test2@host.com',
      organizationId: '1',
  }
]

beforeEach(() => {
  jest.clearAllMocks();
  jest.resetAllMocks();
  jest.restoreAllMocks();
});

describe("user", () => {
  describe("User Registration", () => {
    describe("user:User Registration:given the username and password are valid", () => {
      it("should return the user payload", async () => {
        // Arrange
          // @ts-ignore
        const createUserMock = jest.spyOn(userList, "createUser").mockReturnValueOnce(userPayload);
        const getUserByEmailMock = jest.spyOn(userList, "getUserByEmail").mockReturnValueOnce(Promise.resolve(null));
        const hashPasswordMock = jest.spyOn(hashPassword, "hashPassword").mockReturnValueOnce(Promise.resolve("hashedPassword"));
        const generateOtpMock = jest.spyOn(otp, "generateOtp").mockReturnValueOnce("123456");
        const saveOtpMock = jest.spyOn(otp, "saveOtp").mockReturnValueOnce(Promise.resolve());
        const sendMailMock = jest.spyOn(mail, "default").mockReturnValueOnce(Promise.resolve());
        // Act
        const response = await supertest(app).post("/api/v1/user").send(userInput);
        // Assert
        expect(createUserMock).toHaveBeenCalled();
        expect(getUserByEmailMock).toHaveBeenCalled();
        expect(hashPasswordMock).toHaveBeenCalled();
        expect(generateOtpMock).toHaveBeenCalled();
        expect(saveOtpMock).toHaveBeenCalled();
        expect(sendMailMock).toHaveBeenCalled();
        expect(response.status).toBe(201);
      });
    });

    describe("user:User Registration:given the passwords do not match", () => {
      it("should return a 400", async () => {
        // Arrange
        // @ts-ignore
        const createUserMock = jest.spyOn(userList, "createUser").mockReturnValueOnce(userPayload);
        const getUserByEmailMock = jest.spyOn(userList, "getUserByEmail").mockReturnValueOnce(Promise.resolve(null));
        const hashPasswordMock = jest.spyOn(hashPassword, "hashPassword").mockReturnValueOnce(Promise.resolve("hashedPassword"));
        const generateOtpMock = jest.spyOn(otp, "generateOtp").mockReturnValueOnce("123456");
        const saveOtpMock = jest.spyOn(otp, "saveOtp").mockReturnValueOnce(Promise.resolve());
        const sendMailMock = jest.spyOn(mail, "default").mockReturnValueOnce(Promise.resolve());
        // Act
        const response = await supertest(app)
          .post("/api/v1/user")
          .send({ ...userInput, confirmPassword: "wrongPassword" });
        // Assert
        expect(response.status).toBe(400);
      });
    });

    describe("user:User Registration:given the user already exists", () => {
      it("should return a 409", async () => {
        // Arrange
        // @ts-ignore
        const createUserMock = jest.spyOn(userList, "createUser").mockReturnValueOnce(userPayload);
        // @ts-ignore
        const getUserByEmailMock = jest.spyOn(userList, "getUserByEmail").mockReturnValueOnce(userPayload);
        const hashPasswordMock = jest.spyOn(hashPassword, "hashPassword").mockReturnValueOnce(Promise.resolve("hashedPassword"));
        const generateOtpMock = jest.spyOn(otp, "generateOtp").mockReturnValueOnce("123456");
        const saveOtpMock = jest.spyOn(otp, "saveOtp").mockReturnValueOnce(Promise.resolve());
        const sendMailMock = jest.spyOn(mail, "default").mockReturnValueOnce(Promise.resolve());
        // Act
        const response = await supertest(app).post("/api/v1/user").send(userInput);
        // Assert
        expect(response.status).toBe(409);
      });
    });


  });

  describe("User Verification", () => {

    describe("User:User Verification:given the email and otp is valid", () => {
      it("should return a 200", async () => {
        // Arrange
        // @ts-ignore
        const getUserByEmailMock = jest.spyOn(userList, "getUserByEmail").mockReturnValueOnce(userPayload);
        const verifyOtpMock = jest.spyOn(otp, "verifyOtp").mockReturnValueOnce(Promise.resolve());
        const verifyUserEmailMock = jest.spyOn(userList, "verifyUserEmail").mockReturnValueOnce(Promise.resolve());
        // Act
        const response = await supertest(app)
          .post("/api/v1/user/verify-email")
          .send(verifyEmailPayload);
        // Assert
        expect(getUserByEmailMock).toHaveBeenCalled();
        expect(verifyOtpMock).toHaveBeenCalled();
        expect(verifyUserEmailMock).toHaveBeenCalled();
        expect(response.status).toBe(200);
      });
    });
    

    describe("User:User Verification:given the user with  email is not Found", () => {
      it("should return a 404", async () => {
        // Arrange
        const getUserByEmailMock = jest.spyOn(userList, "getUserByEmail").mockReturnValueOnce(Promise.resolve(null));
        const verifyOtpMock = jest.spyOn(otp, "verifyOtp").mockReturnValueOnce(Promise.resolve());
        const verifyUserEmailMock = jest.spyOn(userList, "verifyUserEmail").mockReturnValueOnce(Promise.resolve());
        // Act
        const response = await supertest(app)
          .post("/api/v1/user/verify-email")
          .send(verifyEmailPayload);
        // Assert
        expect(getUserByEmailMock).toHaveBeenCalled();
        expect(verifyOtpMock).not.toHaveBeenCalled();
        expect(verifyUserEmailMock).not.toHaveBeenCalled();
        expect(response.status).toBe(404);
      });
    });

    // describe.skip("given the otp is invalid", () => {
    //   it("should return a 400", async () => {
    //     // Arrange
    //     const getUserByEmailMock = jest
    //       .spyOn(userList, "getUserByEmail")
    //       // @ts-ignore
    //       .mockReturnValueOnce(userPayload);

    //     const verifyOtpMock = jest
    //       .spyOn(otp, "verifyOtp")
    //       .mockReturnValueOnce(Promise.reject());
    //     // Act
    //     const response = await supertest(app)
    //       .post("/api/v1/user/verify-email")
    //       .send(verifyEmailPayload);
    //     // Assert
    //     expect(getUserByEmailMock).toHaveBeenCalled();
    //     expect(verifyOtpMock).toHaveBeenCalled();
    //     expect(response.status).toBe(400);
    //   });
    // });

  });
});
