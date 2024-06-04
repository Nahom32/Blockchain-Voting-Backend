import { getAllElections, getElectionByOrganization } from "@application/services/blockchain-service";
import { OrganizationGeneralElectionStatistics } from './statistics.models';
import statisticsPersistenceMethods from "./statistics.persistence";
import makeOrganizationList from "@application/oraganizatins/organization.list";
async function generalElectionByOrganizationUpdate(organizationId:string){
    const electionsByOrganizationId = await getElectionByOrganization(organizationId);
    console.log(electionsByOrganizationId)
    let numberOfElections = 0
    let numberOfVotes = 0
    for(let election of electionsByOrganizationId){
        numberOfElections+=1
        for(let candidate of election.candidates){
            numberOfVotes+=candidate.VoteCount
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
async function orgElectionListener(){
    let organizationList = await makeOrganizationList().getOraganizations();
    for(let organization of organizationList){
        generalElectionByOrganizationUpdate(organization.id as string);
    }
}


export {generalElectionByOrganizationUpdate,
    orgElectionListener}

// async function generalElectionStatistics()

