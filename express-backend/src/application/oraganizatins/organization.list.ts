import { prisma } from "@shared/prisma";
import { Organization } from "./organization.models";

export async function createOraganization(
  organization: Organization,
  userId: string
): Promise<Organization> {
  const newOraganization = await prisma.organizations.create({
    data: {
      name: organization.name,
      shortName: organization.shortName,
      isActive: organization.isActive,
      userId: userId,
    } as any,
  });
  return newOraganization;
}

export async function getOraganizationById(id: string): Promise<Organization | null> {
  const oraganization = await prisma.organizations.findFirst({
    where: {
      id: id,
    },
  });
  return oraganization;
}

export async function getOraganizations(): Promise<Organization[]> {
  const oraganizations = await prisma.organizations.findMany();
  return oraganizations as Organization[];
}

export async function updateOraganization(
  organization: Organization
): Promise<Organization> {
  const updatedOraganization = await prisma.organizations.update({
    where: {
      id: organization.id,
    },
    data: {
      name: organization.name,
      shortName: organization.shortName,
      isActive: organization.isActive,
    },
  });
  return updatedOraganization;
}

export async function getOraganizationsByUserId(
  id: string
): Promise<Organization[]> {
  const oraganizations = await prisma.organizations.findMany({
    where: {
      userId: id,
    },
  });
  return oraganizations as Organization[];
}

export async function getOrganizationsByUserEmail(
  email: string
): Promise<Organization[]> {
  const organizations = await prisma.organizations.findMany({
    where: {
      members: {
        some: {
          email: email,
        },
      },
    },
  });
  return organizations as Organization[];
}

export async function getOrganizationsUserMemberOf(
  userId: string
): Promise<Organization[]> {
  const organizations = await prisma.organizations.findMany({
    where: {
      members: {
        some: {
          id: userId,
        },
      },
    },
  });
  return organizations as Organization[];
}

// async function getOraganizationWithMembers(id: string):Promise<Organization>{
//     const oraganization = await prisma.organizations.findFirst({
//         where:{
//             id: id
//         },
//         include:{
//             members:true
//         }
//     });
//     return oraganization as Organization;
// }

export async function createElectionData(
  electionId: string,
  candidateId: string,
  candidateName: string,
): Promise<any> {
  const newData = await prisma.electionData.create({
    data: {
      electionId: electionId,
      candidateId: candidateId,
      candidateName: candidateName
    } as any,
  });
  return newData;
}
