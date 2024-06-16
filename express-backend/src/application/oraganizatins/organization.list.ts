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
  userEmail: string
): Promise<Organization[]> {
  const organizations = await prisma.organizations.findMany({
    where: {
      members: {
        some: {
          email: userEmail,
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
    // Query to get the first and last recorded data for the electionId
    const [firstRecord, lastRecord] = await Promise.all([
      prisma.electionData.findFirst({
        where: { electionId: electionId },
        orderBy: { createdAt: 'asc' },
      }),
      prisma.electionData.findFirst({
        where: { electionId: electionId },
        orderBy: { createdAt: 'desc' },
      }),
    ]);
  
    if (!firstRecord || !lastRecord || !firstRecord.createdAt || !lastRecord.createdAt) {
      throw new Error("No valid records found for the given electionId");
    }
  
    const start = new Date(firstRecord.createdAt);
    const end = new Date(lastRecord.createdAt);
    console.log(start, end);
    const duration = end.getTime() - start.getTime();
    let interval;
  
    if (duration <= 1000 * 60) {
      // Duration is less than or equal to one minute
      interval = 1000; // second intervals
    } else if (duration <= 1000 * 60 * 60) {
      // Duration is less than or equal to one hour
      interval = 1000 * 10; // 10-second intervals
    } else if (duration <= 1000 * 60 * 60 * 24) {
      // Duration is less than or equal to one day
      interval = 1000 * 60 * 5; // 5-minute intervals
    } else if (duration <= 1000 * 60 * 60 * 24 * 30) {
      // Duration is less than or equal to one month
      interval = 1000 * 60 * 60; // hourly intervals
    } else if (duration <= 1000 * 60 * 60 * 24 * 365) {
      // Duration is less than or equal to one year
      interval = 1000 * 60 * 60 * 6; // 6-hour intervals
    } else {
      // Duration is greater than one year
      interval = 1000 * 60 * 60 * 24 * 30 * 3; // 3-month intervals
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
  