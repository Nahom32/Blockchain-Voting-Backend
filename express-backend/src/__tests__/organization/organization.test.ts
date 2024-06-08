import { userList } from "@application/user";
import * as organizationList from "@application/oraganizatins/organization.list";
import supertest from "supertest";
import app from "../../app";
import * as verifyToken from "@application/services/jwt-services";
import * as memberList from "@application/oraganizatins/member.list";
import * as mail from "@application/services/emials.services";
import * as userLists from "@application/user/user.list";

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
};

export const verifyEmailPayload = {
  email: userInput.email,
  otp: "123456",
};

export const organizationListPayload = [
  {
    organizationId: "1",
    name: "Test Organization",
    shortName: "TO",
    isActive: true,
    userId: "1",
  },
  {
    organizationId: "2",
    name: "Test Organization 2",
    shortName: "TO2",
    isActive: true,
    userId: "2",
  },
];

export const organizationInput = {
  name: "Test Organization",
  shortName: "TO",
};

export const organizationMemberInput = {
  name: "Test User",
  email: "test@host.com",
  organizationId: "1",
};

export const organizationMemberPayload = {
  id: "1",
  name: "Test User",
  email: "test@host.com",
  organizationId: "1",
};

export const organizationMemberListPayload = [
  {
    id: "1",
    name: "Test User",
    email: "test@host.com",
    organizationId: "1",
  },
  {
    id: "2",
    name: "Test User 2",
    email: "test2@host.com",
    organizationId: "1",
  },
];

beforeEach(() => {
  jest.clearAllMocks();
  jest.resetAllMocks();
  jest.restoreAllMocks();
});

// crete organization

describe("Create Organization: given the organization name and shortName are valid: given the user is not logged in", () => {
  it("should return a 401", async () => {
    // Arrange
    // Arrange
    const verifyTokenMock = jest.spyOn(verifyToken, "verifyAccessToken").mockReturnValueOnce({
        id: "1",
        email: userInput.email,
        role: "ADMIN",
      });
    // @ts-ignore
    const createOraganizationMock = jest.spyOn(organizationList, "createOraganization").mockReturnValueOnce(organizationListPayload[0]);
    // Act
    const response = await supertest(app)
      .post("/api/v1/oraganizatins")
      .send({ name: "Test Organization", shortName: "TO" });

    // Assert
    expect(verifyTokenMock).not.toHaveBeenCalled();
    expect(createOraganizationMock).not.toHaveBeenCalled();
    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
    expect(response.body.error).toContain("Unauthorized");
  });
});


describe("Create Organization: given the organization name and shortName are valid: given the user is logged in", () => {
  it("should return the organization payload", async () => {
    // Arrange
    const verifyTokenMock = jest.spyOn(verifyToken, "verifyAccessToken").mockReturnValueOnce({
      id: "1",
      email: userInput.email,
      role: "ADMIN",
    });
      // @ts-ignore
    const createOraganizationMock = jest.spyOn(organizationList, "createOraganization").mockReturnValueOnce(organizationListPayload[0]);

    // Act

    const response = await supertest(app)
      .post("/api/v1/oraganizatins")
      .set("Authorization", "Bearer token")
      .send({ name: "Test Organization", shortName: "TO" });

    // Assert
    expect(verifyTokenMock).toHaveBeenCalled();
    expect(createOraganizationMock).toHaveBeenCalled();
    expect(response.status).toBe(201);
    expect(response.body.name).toContain("Test Organization");
    expect(response.body.shortName).toContain("TO");
  });
});

describe("Create Organization: given the organization name is invalid", () => {
  it("should return a 400", async () => {
    // Arrange
    const verifyTokenMock = jest.spyOn(verifyToken, "verifyAccessToken").mockReturnValueOnce({
      id: "1",
      email: userInput.email,
      role: "ADMIN",
    });
      // @ts-ignore
    const createOraganizationMock = jest.spyOn(organizationList, "createOraganization").mockReturnValueOnce(organizationListPayload[0]);

    // Act

    const response = await supertest(app)
      .post("/api/v1/oraganizatins")
      .set("Authorization", "Bearer token")
      .send({ name: "", shortName: "TO" });

    // Assert
    expect(verifyTokenMock).toHaveBeenCalled();
    expect(createOraganizationMock).not.toHaveBeenCalled();
    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.error).toBe("Organization must have a name.");
  });
});

describe("Create Organization: given the organization shortName is invalid", () => {
  it("should return a 400", async () => {
    // Arrange
    const verifyTokenMock = jest.spyOn(verifyToken, "verifyAccessToken").mockReturnValueOnce({
      id: "1",
      email: userInput.email,
      role: "ADMIN",
    });
      // @ts-ignore
    const createOraganizationMock = jest.spyOn(organizationList, "createOraganization").mockReturnValueOnce(organizationListPayload[0]);

    // Act

    const response = await supertest(app)
      .post("/api/v1/oraganizatins")
      .set("Authorization", "Bearer token")
      .send({ name: "Test Organization", shortName: "" });

    // Assert
    expect(verifyTokenMock).toHaveBeenCalled();
    expect(createOraganizationMock).not.toHaveBeenCalled();
    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.error).toBe("Organization must have a shortName.");
  });
});

// add user to organization

describe("Add User to Organization: given the member payload is valid: given the user is not logged in", () => {
  it("should return a 401", async () => {
    // Arrange
    const verifyTokenMock = jest.spyOn(verifyToken, "verifyAccessToken").mockReturnValueOnce({
      id: "1",
      email: userInput.email,
      role: "ADMIN",
    });
    // @ts-ignore
    const getOraganizationByIdMock = jest.spyOn(organizationList, "getOraganizationById").mockReturnValueOnce(organizationListPayload[0]);
    // @ts-ignore
    const createMemberMock = jest.spyOn(memberList, "createMember").mockReturnValueOnce(organizationMemberPayload);
    const sendMailMock = jest.spyOn(mail, "default").mockReturnValueOnce(Promise.resolve());
    // Act
    const response = await supertest(app).post("/api/v1/oraganizatins/members").send(organizationMemberInput);
    // Assert
    expect(verifyTokenMock).not.toHaveBeenCalled();
    expect(getOraganizationByIdMock).not.toHaveBeenCalled();
    expect(createMemberMock).not.toHaveBeenCalled();
    expect(sendMailMock).not.toHaveBeenCalled();
    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
    expect(response.body.error).toContain("Unauthorized");
  });
});

describe("Add User to Organization: given the member payload is valid: given the user is logged in: given the organization with organizationId exists", () => {
  it("should return the organization member payload", async () => {
    // Arrange
    const verifyTokenMock = jest.spyOn(verifyToken, "verifyAccessToken").mockReturnValueOnce({
      id: "1",
      email: userInput.email,
      role: "ADMIN",
    });
    // @ts-ignore
    const getOraganizationByIdMock = jest.spyOn(organizationList, "getOraganizationById").mockReturnValueOnce(organizationListPayload[0]);
    // @ts-ignore
    const createMemberMock = jest.spyOn(memberList, "createMember").mockReturnValueOnce(organizationMemberPayload);
    const sendMailMock = jest.spyOn(mail, "default").mockReturnValueOnce(Promise.resolve());
    // Act
    const response = await supertest(app).post("/api/v1/oraganizatins/members").send(organizationMemberInput);

    // Assert
    expect(verifyTokenMock).toHaveBeenCalled();
    expect(createMemberMock).toHaveBeenCalled();
    expect(getOraganizationByIdMock).toHaveBeenCalled();
    expect(sendMailMock).toHaveBeenCalled();
    expect(response.status).toBe(201);
    expect(response.body.organizationId).toContain("1");
  });
});

describe("Add User to Organization: given the organization with organizationId not exists", () => {
  it("should return a 404", async () => {
    // Arrange
    const verifyTokenMock = jest.spyOn(verifyToken, "verifyAccessToken").mockReturnValueOnce({
      id: "1",
      email: userInput.email,
      role: "ADMIN",
    });
    // @ts-ignore
    const getOraganizationByIdMock = jest.spyOn(organizationList, "getOraganizationById").mockReturnValueOnce(organizationListPayload[0]);
    // @ts-ignore
    const createMemberMock = jest.spyOn(memberList, "createMember").mockReturnValueOnce(organizationMemberPayload);
    const sendMailMock = jest.spyOn(mail, "default").mockReturnValueOnce(Promise.resolve());

    // Act

    const response = await supertest(app)
      .post("/api/v1/oraganizatins/members")
      .set("Authorization", "Bearer token")
      .send(organizationMemberInput);

    // Assert
    expect(verifyTokenMock).toHaveBeenCalled();
    expect(createMemberMock).not.toHaveBeenCalled();
    expect(getOraganizationByIdMock).toHaveBeenCalled();
    expect(sendMailMock).not.toHaveBeenCalled();
    expect(response.status).toBe(404);
    expect(response.body.success).toBe(false);
    expect(response.body.error).toContain("Organization not found.");
  });
});

describe("Add User to Organization: given the member email is invalid", () => {
  it("should return a 400", async () => {
    // Arrange
    const verifyTokenMock = jest.spyOn(verifyToken, "verifyAccessToken").mockReturnValueOnce({
      id: "1",
      email: userInput.email,
      role: "ADMIN",
    });
    // @ts-ignore
    const getOraganizationByIdMock = jest.spyOn(organizationList, "getOraganizationById").mockReturnValueOnce(organizationListPayload[0]);
    // @ts-ignore
    const createMemberMock = jest.spyOn(memberList, "createMember").mockReturnValueOnce(organizationMemberPayload);
    const sendMailMock = jest.spyOn(mail, "default").mockReturnValueOnce(Promise.resolve());
    // Act
    const response = await supertest(app)
      .post("/api/v1/oraganizatins/members")
      .set("Authorization", "Bearer token")
      .send({ ...organizationMemberInput, email: "" });

    // Assert
    expect(verifyTokenMock).toHaveBeenCalled();
    expect(createMemberMock).not.toHaveBeenCalled();
    expect(getOraganizationByIdMock).not.toHaveBeenCalled();
    expect(sendMailMock).not.toHaveBeenCalled();
    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.error).toContain("Member must have a email.");
  });
});

// get organization member

describe("Get Organization Members: given the organizationId is valid: given the user is not logged in", () => {
  it("should return a 401", async () => {
    // Arrange
    const verifyTokenMock = jest.spyOn(verifyToken, "verifyAccessToken").mockReturnValueOnce({
        id: "1",
        email: userInput.email,
        role: "ADMIN",
      });
      // @ts-ignore
    const getOraganizationByIdMock = jest.spyOn(organizationList, "getOraganizationById").mockReturnValueOnce(organizationListPayload[0]);
    // @ts-ignore
    const getMembersByOrganizationIdMock = jest.spyOn(memberList, "getMembersByOraganizationId").mockReturnValueOnce(organizationMemberListPayload);
    // Act
    const response = await supertest(app).get(
      "/api/v1/oraganizatins/members/1"
    );
    // Assert
    expect(verifyTokenMock).not.toHaveBeenCalled();
    expect(getOraganizationByIdMock).not.toHaveBeenCalled();
    expect(getMembersByOrganizationIdMock).not.toHaveBeenCalled();
    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
    expect(response.body.error).toContain("Unauthorized");
  });
});


describe("Get Organization Members: given the organizationId is valid: given the user is logged in: given the organization with organizationId exists", () => {
  it("should return the organization member payload", async () => {
    // Arrange
    const verifyTokenMock = jest.spyOn(verifyToken, "verifyAccessToken").mockReturnValueOnce({
      id: "1",
      email: userInput.email,
      role: "ADMIN",
    });
    // @ts-ignore
  const getOraganizationByIdMock = jest.spyOn(organizationList, "getOraganizationById").mockReturnValueOnce(organizationListPayload[0]);
  // @ts-ignore
  const getMembersByOrganizationIdMock = jest.spyOn(memberList, "getMembersByOraganizationId").mockReturnValueOnce(organizationMemberListPayload);
    // Act
    const response = await supertest(app)
      .get("/api/v1/oraganizatins/members/1")
      .set("Authorization", "Bearer token");

    // Assert
    expect(verifyTokenMock).toHaveBeenCalled();
    expect(getOraganizationByIdMock).toHaveBeenCalled();
    expect(getMembersByOrganizationIdMock).toHaveBeenCalled();
    expect(response.status).toBe(200);
    expect(response.body).toBe(organizationListPayload);
  });
});

// get all organization

describe("Get Organizations", () => {
  describe("given the user is not logged in", () => {
    it("should return a 401", async () => {
      // Arrange
      const verifyTokenMock = jest
        .spyOn(verifyToken, "verifyAccessToken")
        // @ts-ignore
        .mockReturnValueOnce({
          id: "1",
          email: userInput.email,
          role: "ADMIN",
        });

      const getOraganizationsMock = jest
        .spyOn(organizationList, "getOraganizations")
        // @ts-ignore
        .mockReturnValueOnce(organizationListPayload);

      // Act

      const response = await supertest(app).get("/api/v1/oraganizatins");

      // Assert
      expect(verifyTokenMock).not.toHaveBeenCalled();
      expect(getOraganizationsMock).not.toHaveBeenCalled();
      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain("Unauthorized");
    });
  });
  describe("given the user is logged in", () => {
    it("should return the organization list", async () => {
      // Arrange
      const verifyTokenMock = jest
        .spyOn(verifyToken, "verifyAccessToken")
        // @ts-ignore
        .mockReturnValueOnce({
          id: "1",
          email: userInput.email,
          role: "ADMIN",
        });

      const getOraganizationsMock = jest
        .spyOn(organizationList, "getOraganizations")
        // @ts-ignore
        .mockReturnValueOnce(organizationListPayload);

      // Act

      const response = await supertest(app)
        .get("/api/v1/oraganizatins")
        .set("Authorization", "Bearer token");

      // Assert
      expect(verifyTokenMock).toHaveBeenCalled();
      expect(getOraganizationsMock).toHaveBeenCalled();
      expect(response.status).toBe(200);
      expect(response.body).toEqual(organizationListPayload);
    });
  });
});

// toggleOraganizationActivationController

describe("Toggle Organization Activation: given the organizationId is valid: given the user is not logged in", () => {
  it("should return a 401", async () => {
    // Arrange
    const verifyTokenMock = jest
      .spyOn(verifyToken, "verifyAccessToken")
      // @ts-ignore
      .mockReturnValueOnce({
        id: "1",
        email: userInput.email,
        role: "ADMIN",
      });

    const getOraganizationByIdMock = jest
      .spyOn(organizationList, "getOraganizationById")
      // @ts-ignore
      .mockReturnValueOnce(organizationListPayload[0]);

    const updateOraganizationMock = jest
      .spyOn(organizationList, "updateOraganization")
      // @ts-ignore
      .mockReturnValueOnce(organizationListPayload[0]);

    // Act
    let organizationId = 1;
    const response = await supertest(app).put(
      "/api/v1/oraganizatins/" + organizationId
    );

    // Assert
    expect(verifyTokenMock).not.toHaveBeenCalled();
    expect(getOraganizationByIdMock).not.toHaveBeenCalled();
    expect(updateOraganizationMock).not.toHaveBeenCalled();
    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
    expect(response.body.error).toContain("Unauthorized");
  });
});

describe("Toggle Organization Activation: given the organizationId is valid: given the user is logged in", () => {
  describe("given the organization with organizationId exists", () => {
    it("should return the organization payload", async () => {
      // Arrange
      const verifyTokenMock = jest
        .spyOn(verifyToken, "verifyAccessToken")
        // @ts-ignore
        .mockReturnValueOnce({
          id: "1",
          email: userInput.email,
          role: "ADMIN",
        });

      const getOraganizationByIdMock = jest
        .spyOn(organizationList, "getOraganizationById")
        // @ts-ignore
        .mockReturnValueOnce(organizationListPayload[0]);

      const updateOraganizationMock = jest
        .spyOn(organizationList, "updateOraganization")
        // @ts-ignore
        .mockReturnValueOnce(organizationListPayload[0]);

      // Act
      const organizationId = 1;
      const response = await supertest(app)
        .put("/api/v1/oraganizatins/" + organizationId)
        .set("Authorization", "Bearer token");

      // Assert
      expect(verifyTokenMock).toHaveBeenCalled();
      expect(getOraganizationByIdMock).toHaveBeenCalled();
      expect(updateOraganizationMock).toHaveBeenCalled();
      expect(response.status).toBe(200);
      expect(response.body).toEqual(organizationListPayload[0]);
    });
  });
});

describe("Toggle Organization Activation:given the user is logged in: given the organization with organizationId not exists", () => {
  it("should return a 404", async () => {
    // Arrange
    const verifyTokenMock = jest
      .spyOn(verifyToken, "verifyAccessToken")
      // @ts-ignore
      .mockReturnValueOnce({
        id: "1",
        email: userInput.email,
        role: "ADMIN",
      });

    const getOraganizationByIdMock = jest
      .spyOn(organizationList, "getOraganizationById")
      .mockReturnValueOnce(Promise.resolve(null));

    const updateOraganizationMock = jest
      .spyOn(organizationList, "updateOraganization")
      // @ts-ignore
      .mockReturnValueOnce(organizationListPayload[0]);

    // Act

    let organizationId = 1;

    const response = await supertest(app)
      .put("/api/v1/oraganizatins/" + organizationId)
      .set("Authorization", "Bearer token");

    // Assert
    expect(verifyTokenMock).toHaveBeenCalled();
    expect(updateOraganizationMock).not.toHaveBeenCalled();
    expect(getOraganizationByIdMock).toHaveBeenCalled();
    expect(response.status).toBe(404);
    expect(response.body.success).toBe(false);
    expect(response.body.error).toContain("Oraganization not found");
  });
});

//  get organization by user Id

describe("Get Organization By User Id: given the user is not logged in: given the userId is valid", () => {
  it("should return a 401", async () => {
    // Arrange
    const verifyTokenMock = jest
      .spyOn(verifyToken, "verifyAccessToken")
      // @ts-ignore
      .mockReturnValueOnce({
        id: "1",
        email: userInput.email,
        role: "ADMIN",
      });

    const getOraganizationsByUserIdMock = jest
      .spyOn(organizationList, "getOraganizationsByUserId")
      // @ts-ignore
      .mockReturnValueOnce(organizationListPayload);

    // Act

    const response = await supertest(app).get("/api/v1/oraganizatins/user/1");

    // Assert
    expect(verifyTokenMock).not.toHaveBeenCalled();
    expect(getOraganizationsByUserIdMock).not.toHaveBeenCalled();
    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
    expect(response.body.error).toContain("Unauthorized");
  });
});

describe("Get Organization By User Id: given the user is logged in: given the userId is valid", () => {
  it("should return the organization list", async () => {
    // Arrange
    const verifyTokenMock = jest
      .spyOn(verifyToken, "verifyAccessToken")
      // @ts-ignore
      .mockReturnValueOnce({
        id: "1",
        email: userInput.email,
        role: "ADMIN",
      });

    const getOraganizationsByUserIdMock = jest
      .spyOn(organizationList, "getOraganizationsByUserId")
      // @ts-ignore
      .mockReturnValueOnce(organizationListPayload);

    // Act

    let userId = 1;
    const response = await supertest(app)
      .get("/api/v1/oraganizatins/user/" + userId)
      .set("Authorization", "Bearer token");

    // Assert
    expect(verifyTokenMock).toHaveBeenCalled();
    expect(getOraganizationsByUserIdMock).toHaveBeenCalled();
    expect(response.status).toBe(200);
    expect(response.body).toEqual(organizationListPayload);
  });
});

//

describe("Get Organization By User Id: given the user is logged in :given the user with userId not exists", () => {
  it("should return a 404", async () => {
    // Arrange
    const verifyTokenMock = jest
      .spyOn(verifyToken, "verifyAccessToken")
      // @ts-ignore
      .mockReturnValueOnce({
        id: "1",
        email: userInput.email,
        role: "ADMIN",
      });

    const getUserByIdMock = jest
      .spyOn(userLists, "getUserById")
      .mockReturnValueOnce(Promise.resolve(null));

    const getOraganizationsByUserIdMock = jest
      .spyOn(organizationList, "getOraganizationsByUserId")
      .mockReturnValueOnce(Promise.resolve(organizationListPayload));

    // Act

    const response = await supertest(app)
      .get("/api/v1/oraganizatins/user/1")
      .set("Authorization", "Bearer token");

    // Assert
    expect(verifyTokenMock).toHaveBeenCalled();
    expect(getUserByIdMock).toHaveBeenCalled();
    expect(getOraganizationsByUserIdMock).not.toHaveBeenCalled();
    expect(response.status).toBe(404);
    expect(response.body.success).toBe(false);
    expect(response.body.error).toContain("User not found");
  });
});
