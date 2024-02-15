import { prisma } from "@shared/prisma";
import { Organization } from "./organization.models";

export default function makeOrganizationList(){
    return({
        createOraganization,
        getOraganizationById,
        getOraganizations,
        updateOraganization,
        getOraganizationByUserId,
        getOrganizationsByUserEmail
    });

    async function createOraganization(organization: Organization, userId:string): Promise<Organization>{
        const newOraganization = await prisma.organizations.create({
            data:{
                name: organization.name,
                shortName: organization.shortName,
                isActive: organization.isActive,
                userId: userId
            }as any
        });
        return newOraganization;
    }

    async function getOraganizationById(id: string):Promise<Organization>{
        const oraganization = await prisma.organizations.findFirst({
            where:{
                id: id
            },
        });
        return oraganization as Organization;
    }

    async function getOraganizations():Promise<Organization[]>{
        const oraganizations = await prisma.organizations.findMany();
        return oraganizations as Organization[];
    }

    async function updateOraganization(organization: Organization):Promise<Organization>{
        const updatedOraganization = await prisma.organizations.update({
            where:{
                id: organization.id
            },
            data:{
                name: organization.name,
                shortName: organization.shortName,
                isActive: organization.isActive
            }
        });
        return updatedOraganization;
    }

    async function getOraganizationByUserId(userId: string):Promise<Organization>{
        const oraganization = await prisma.organizations.findFirst({
            where:{
                userId: userId
            },
        });
        return oraganization as Organization;
    }

    async function getOrganizationsByUserEmail(email: string): Promise<Organization[]> {
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
}