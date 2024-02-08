import { prisma } from "@shared/prisma";
import { Member } from "./organization.models";


export default function makeMemberList(){
    return({
        createMember,
        getMembersByOraganizationId,
    });

    async function createMember(member: Member): Promise<Member>{
        const newMember = await prisma.members.create({
            data:{
                name: member.name,
                email: member.email,
                organizationId:member.organizationId
            }
        });
        return newMember;
    }

    async function getMembersByOraganizationId(organizationId: string):Promise<Member[]>{
        const members = await prisma.members.findMany({
            where:{
                organizationId:organizationId
            },
        });
        return members as Member[];
    }
}