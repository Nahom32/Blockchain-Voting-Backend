import { userList } from "@application/user";
import * as organizationList from "@application/oraganizatins/organization.list";
import * as hash from "@application/services/hash-services";
import * as token from "@application/services/jwt-services";
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

describe("User Login", () => {

  describe("Authentication:User Login:given the email and password are valid", () => {
    it("should return the user payload", async () => {
      // Arrange
      // @ts-ignore
      const getUserByEmailMock = jest.spyOn(userList, "getUserByEmail").mockReturnValueOnce(userPayload);
      const comparePasswordMock = jest.spyOn(hash, "comparePassword").mockReturnValueOnce(Promise.resolve(true));
      const getOrganizationsUserMemberOfMock = jest.spyOn(organizationList, "getOrganizationsUserMemberOf").mockReturnValueOnce(Promise.resolve(organizationListPayload));
      const getOraganizationsByUserIdMock = jest.spyOn(organizationList, "getOraganizationsByUserId").mockReturnValueOnce(Promise.resolve(organizationListPayload));
      const generateTokensMock = jest.spyOn(token, "generateTokens").mockReturnValueOnce({
          accessToken: "accessToken",
          refreshToken: "refreshToken",
        });

      // Act
      const response = await supertest(app)
        .post("/api/v1/auth/login")
        .send({ email: userInput.email, password: userInput.password });
      // Assert
      expect(getUserByEmailMock).toHaveBeenCalled();
      expect(comparePasswordMock).toHaveBeenCalled();
      expect(getOrganizationsUserMemberOfMock).toHaveBeenCalled();
      expect(getOraganizationsByUserIdMock).toHaveBeenCalled();
      expect(generateTokensMock).toHaveBeenCalled();
      expect(response.status).toBe(200);
      expect(response.body.accessToken).toContain("accessToken");
      expect(response.body.refreshToken).toContain("refreshToken");
    });
  });

  describe("Authentication:User Login:given the user with  email is not Found", () => {
    it("should return a 404", async () => {
      // Arrange
      // @ts-ignore
      const getUserByEmailMock = jest.spyOn(userList, "getUserByEmail").mockReturnValueOnce(userPayload);
      const comparePasswordMock = jest.spyOn(hash, "comparePassword").mockReturnValueOnce(Promise.resolve(true));
      const getOrganizationsUserMemberOfMock = jest.spyOn(organizationList, "getOrganizationsUserMemberOf").mockReturnValueOnce(Promise.resolve(organizationListPayload));
      const getOraganizationsByUserIdMock = jest.spyOn(organizationList, "getOraganizationsByUserId").mockReturnValueOnce(Promise.resolve(organizationListPayload));
      const generateTokensMock = jest.spyOn(token, "generateTokens").mockReturnValueOnce({
          accessToken: "accessToken",
          refreshToken: "refreshToken",
        });
      // Act
      const response = await supertest(app)
        .post("/api/v1/auth/login")
        .send({ email: userInput.email, password: userInput.password });
      // Assert
      expect(getUserByEmailMock).toHaveBeenCalled();
      expect(comparePasswordMock).not.toHaveBeenCalled();
      expect(getOrganizationsUserMemberOfMock).not.toHaveBeenCalled();
      expect(getOraganizationsByUserIdMock).not.toHaveBeenCalled();
      expect(generateTokensMock).not.toHaveBeenCalled();
      expect(response.status).toBe(404);
    });
  });


  describe("Authentication:User Login:given the password is invalid", () => {
    it("should return a 404", async () => {
      // Arrange
      // @ts-ignore
      const getUserByEmailMock = jest.spyOn(userList, "getUserByEmail").mockReturnValueOnce(userPayload);
      const comparePasswordMock = jest.spyOn(hash, "comparePassword").mockReturnValueOnce(Promise.resolve(true));
      const getOrganizationsUserMemberOfMock = jest.spyOn(organizationList, "getOrganizationsUserMemberOf").mockReturnValueOnce(Promise.resolve(organizationListPayload));
      const getOraganizationsByUserIdMock = jest.spyOn(organizationList, "getOraganizationsByUserId").mockReturnValueOnce(Promise.resolve(organizationListPayload));
      const generateTokensMock = jest.spyOn(token, "generateTokens").mockReturnValueOnce({
          accessToken: "accessToken",
          refreshToken: "refreshToken",
        });
      // Act
      const response = await supertest(app)
        .post("/api/v1/auth/login")
        .send({ email: userInput.email, password: userInput.password });
      // Assert
      expect(getUserByEmailMock).toHaveBeenCalled();
      expect(comparePasswordMock).toHaveBeenCalled();
      expect(getOrganizationsUserMemberOfMock).not.toHaveBeenCalled();
      expect(getOraganizationsByUserIdMock).not.toHaveBeenCalled();
      expect(generateTokensMock).not.toHaveBeenCalled();
      expect(response.status).toBe(404);
    });
  });





});
