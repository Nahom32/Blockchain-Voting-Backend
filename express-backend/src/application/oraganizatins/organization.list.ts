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

export async function getElectionData(electionId: any, startTime:any, endTime: any): Promise<any[]> {
  const start = new Date(startTime);
const end = new Date(endTime);

const duration = end.getTime() - start.getTime();;
let interval; 

if (duration <= 1000 * 60 * 60 * 24) {
  // Duration is less than or equal to one day
  interval = 1000 * 60 * 60; // hourly intervals
} else if (duration <= 1000 * 60 * 60 * 24 * 30) {
  // Duration is less than or equal to one month
  interval = 1000 * 60 * 60 * 24; // daily intervals
} else {
  // Duration is greater than one month
  interval = 1000 * 60 * 60 * 24 * 7; // weekly intervals
}

const intervals: Date[] = [];
for (let i = start.getTime(); i <= end.getTime(); i += interval) {
  intervals.push(new Date(i));
}

const votes = await prisma.electionData.findMany({
  where: {
      electionId: electionId,
    createdAt: {
      gte: start,
      lte: end,
    },
  },
});

const result: { [key: string]: any[] } = {};

intervals.forEach((interval: any, index: any) => {
  const nextInterval = intervals[index + 1];
  if (!nextInterval) return;

  votes.forEach(vote => {
    if (vote.createdAt! >= interval && vote.createdAt! < nextInterval) {
      if (!result[vote.candidateName]) {
        result[vote.candidateName] = [];
      }

      const seriesEntry = result[vote.candidateName].find((entry: { name: string; }) => entry.name === interval.toISOString());
      if (seriesEntry) {
        seriesEntry.value += 1;
      } else {
        result[vote.candidateName].push({ name: interval.toISOString(), value: 1 });
      }
    }
  });
});

return Object.keys(result).map(candidateName => ({
  candidateName,
  series: result[candidateName],
}));

}