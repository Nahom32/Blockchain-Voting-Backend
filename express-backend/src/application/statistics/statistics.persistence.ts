import { prisma } from "@shared/prisma";
import { IndividualGeneralElectionStatistics, 
    OrganizationGeneralElectionStatistics } from "./statistics.models";

export default function statisticsPersistenceMethods(){
    return {
        createOrganizationGeneralElectionStatistics,
        updateOrganizationGeneralElectionStatistics,
        createIndividualGeneralElectionStatistics,
        updateIndividualGeneralElectionStatistics,
        checkOrganizationElectionStatistics
    }
}
async function createOrganizationGeneralElectionStatistics(organizationStatistics: 
        OrganizationGeneralElectionStatistics){
    const newOrganizationStatistics = await prisma.organizationGeneralElectionStatistics.create({
        data:{
            organizationId: organizationStatistics.organizationId,
            numberOfElections: organizationStatistics.numberOfElections,
            numberOfTotalVotes: organizationStatistics.numberOfTotalVotes,
        }as any
    });
    return newOrganizationStatistics;
}

async function updateOrganizationGeneralElectionStatistics(organizationStatistics: 
    OrganizationGeneralElectionStatistics){
    const updatedOrganizationStatistics = await prisma.organizationGeneralElectionStatistics.update({
        where:{
            id: organizationStatistics.id,
            organizationId: organizationStatistics.organizationId
        },
        data:{
            numberOfElections: organizationStatistics.numberOfElections,
            numberOfTotalVotes: organizationStatistics.numberOfTotalVotes
        }
        
    });
    return updatedOrganizationStatistics;
}
async function createIndividualGeneralElectionStatistics(individualStatistics: 
    IndividualGeneralElectionStatistics){
const newOrganizationStatistics = await prisma.individualGeneralElectionStatistics.create({
    data:{
        numberOfElections: individualStatistics.numberOfElections ,
        numberOfTotalVotes: individualStatistics.numberOfVotes
    }as any
});
    return newOrganizationStatistics;
} 

async function updateIndividualGeneralElectionStatistics(individualStatistics: 
    IndividualGeneralElectionStatistics){
    const updatedOrganizationStatistics = await prisma.organizationGeneralElectionStatistics.update({
        where:{
            id: individualStatistics.id
        },
        data:{
            numberOfElections: individualStatistics.numberOfElections,
            numberOfTotalVotes: individualStatistics.numberOfVotes
        }
        
    });

    return updatedOrganizationStatistics;
}

async function checkOrganizationElectionStatistics(organizationId: string){
    const organizationElection = await prisma.organizationGeneralElectionStatistics.findFirst({
       where:{
        organizationId: organizationId
       } 
    });
    if(organizationElection !== null){
        return true;
    }
    return false;
}


