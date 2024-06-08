import { prisma } from "@shared/prisma";
import { Member } from "./organization.models";

export async function createMember(member: Member): Promise<Member> {
  const newMember = await prisma.members.create({
    data: {
      name: member.name,
      email: member.email,
      organizationId: member.organizationId,
    },
  });
  return newMember;
}

export async function getMembersByOraganizationId(
  organizationId: string
): Promise<Member[]> {
  const members = await prisma.members.findMany({
    where: {
      organizationId: organizationId,
    },
  });
  return members as Member[];
}

export async function createMembersFromFile(
  members: Member[]
): Promise<Member[]> {
  const newMembers = await prisma.members.createMany({
    data: members.map((member) => ({
      name: member.name,
      email: member.email,
      organizationId: member.organizationId,
    })),
  });
  return members as Member[];
}
