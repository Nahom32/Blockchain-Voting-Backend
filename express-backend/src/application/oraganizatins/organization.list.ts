import { PrismaClient } from "@prisma/client";
import { Organization } from "./organization.models";

export default function makeOrganizationList(){
    const prisma = new PrismaClient();
    return({
        createOraganization,
        getOraganizationById,
        getOraganizations,
        updateOraganization
    });

    async function createOraganization(organization: Organization): Promise<Organization>{
        const newOraganization = await prisma.organizations.create({
            data:{
                name: organization.name,
                shortName: organization.shortName,
                isActive: organization.isActive
            }
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
}