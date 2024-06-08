import { prisma } from "@shared/prisma";
import { ElectionTimeSeries, IndividualGeneralElectionStatistics, 
    OrganizationGeneralElectionStatistics } from "./statistics.models";

export default function statisticsPersistenceMethods(){
    return {
        createOrganizationGeneralElectionStatistics,
        updateOrganizationGeneralElectionStatistics,
        createIndividualElectionStatistics,
        updateIndividualElectionStatistics,
        checkOrganizationElectionStatistics,
        createElectionTimeSeries,
        updateElectionTimeSeries,
        getElectionTimeSeries,
        getGeneralOrganizationElectionStatistics
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
async function createIndividualElectionStatistics(individualStatistics: 
    IndividualGeneralElectionStatistics){
const newOrganizationStatistics = await prisma.individualGeneralElectionStatistics.create({
    data:{
        numberOfElections: individualStatistics.numberOfElections ,
        numberOfTotalVotes: individualStatistics.numberOfVotes
    }as any
});
    return newOrganizationStatistics;
} 

async function updateIndividualElectionStatistics(individualStatistics: 
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

async function createElectionTimeSeries(timeSeries:ElectionTimeSeries){
   const electionTimeSeries = await prisma.electionTimeSeries.create({
        data:{
            id: timeSeries.id,
            electionId: timeSeries.electionId,
            voterTimeStamps: timeSeries.voterTimeStamps,
            electionName: timeSeries.electionName
        }as any
   })
   return electionTimeSeries
}
async function updateElectionTimeSeries(timeSeries:ElectionTimeSeries){
    const updatedElectionTimeSeries = await prisma.electionTimeSeries.update({
        where:{
            id: timeSeries.id,
            electionId: timeSeries.electionId 
        },
        data:{
            id: timeSeries.id,
            electionId: timeSeries.electionId,
            electionName: timeSeries.electionName,
            voterTimeStamps: timeSeries.voterTimeStamps

        }
    })
    return updatedElectionTimeSeries
}

async function getElectionTimeSeries(electionId: string){
    const timeSeries = await prisma.electionTimeSeries.findFirst({
        where:{
            electionId: electionId
        }
    })
  return  timeSeries;
}

async function getGeneralOrganizationElectionStatistics(organizationId: string){
    const electionStatistics = await prisma.organizationGeneralElectionStatistics.findFirst(
        {
            where: {
                organizationId: organizationId
            }
        }
    )
    if(electionStatistics === null){
        throw Error("ElectionStatistics instance isn't created")
    }
    return electionStatistics
}


