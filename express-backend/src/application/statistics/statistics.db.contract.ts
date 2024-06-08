import { getAllElections, getElectionByOrganization, getSingleElection, getVoterTimeForElection } from "@application/services/blockchain-service";
import { ElectionTimeSeries, OrganizationGeneralElectionStatistics } from './statistics.models';
import statisticsPersistenceMethods from "./statistics.persistence";
import makeOrganizationList from "@application/oraganizatins/organization.list";
async function generalElectionByOrganizationUpdate(organizationId:string){
    const electionsByOrganization = await getElectionByOrganization(organizationId);
    console.log("This is the election created by the election org",electionsByOrganization)
    let numberOfElections = 0
    let numberOfVotes = 0
    for(let election of electionsByOrganization){
        numberOfElections+=1
        for(let candidate of election.candidates){
            numberOfVotes+=Number(candidate.VoteCount)
        }

    }
    const organizationStats: OrganizationGeneralElectionStatistics ={
        organizationId: organizationId,
        numberOfElections: numberOfElections,
        numberOfTotalVotes: numberOfVotes
    }
    let isObjectAvailable = await statisticsPersistenceMethods().checkOrganizationElectionStatistics(organizationId)
    if(isObjectAvailable === true){
        await statisticsPersistenceMethods().updateOrganizationGeneralElectionStatistics(organizationStats)
    }else{
        await statisticsPersistenceMethods().createOrganizationGeneralElectionStatistics(organizationStats)
    }
    
}
async function syncOrganizationElection(){
    let organizationList = await makeOrganizationList().getOraganizations();
    for(let organization of organizationList){
        generalElectionByOrganizationUpdate(organization.id as string);
    }
}

async function electionTimeSeriesSync(electionId: string){
    const electionTimeStamps = await getVoterTimeForElection(electionId) as number[];
    console.log("this are the electiontimestamps",electionTimeStamps)
    //console.log("this is the type of electionId", election)
    const electionData = await getSingleElection(electionId) as any;
    console.log("this is a single election",electionData)
    const timeSeries = await statisticsPersistenceMethods().getElectionTimeSeries(electionId)
    if(timeSeries !== null){
        const timeSeriesUpdate: ElectionTimeSeries = {
            id: timeSeries.id,
            electionName: timeSeries.electionName ,
            electionId: timeSeries.electionName,
            voterTimeStamps: electionTimeStamps
        }
        await statisticsPersistenceMethods().updateElectionTimeSeries(timeSeriesUpdate);
        return timeSeriesUpdate
    }else{
        const timeSeries: ElectionTimeSeries = {
            electionName: electionData.electionName ,
            electionId: electionId,
            voterTimeStamps: electionTimeStamps
        }
        await statisticsPersistenceMethods().createElectionTimeSeries(timeSeries);
        return timeSeries;
    }
    
}

async function syncAllElectionTimeSeries(){
    const elections = await getAllElections() as any
    console.log("This are the elections",elections)
   for(let election of elections){
    console.log("This is the electionId",election.electionId)
    console.log("this is the type of electionId", typeof election.electionId)
    electionTimeSeriesSync(election.electionId)
   }
}
async function syncElectionDatabase(){
    syncOrganizationElection()
    syncAllElectionTimeSeries()
}

export {
    generalElectionByOrganizationUpdate,
    syncOrganizationElection,
    electionTimeSeriesSync,
    syncAllElectionTimeSeries,
    syncElectionDatabase
}


