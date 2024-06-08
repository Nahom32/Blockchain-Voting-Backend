import { environment } from 'src/environment';
import Web3 from 'web3';
const BLOCKCHAIN_URL = process.env['BLOCKCHAIN_URL']
const ABI = environment.contractAbi
const CONTRACT_ADDRESS = environment.contractAddress
let web3 = new Web3(BLOCKCHAIN_URL)

function getContract(contractAddress: string, abi: any){
    return new web3.eth.Contract(abi,contractAddress);
}
let electionContract = getContract(CONTRACT_ADDRESS as string, ABI)


function getAllElections(){
    return electionContract.methods.showExistingElections().call();
}

function getSingleElection(electionId: string){
    return electionContract.methods.getElectionbyId(electionId).call();
}
function getVoterTimeForElection(electionId: string){
    return electionContract.methods.getVoterTime(electionId).call();
}
async function getElectionByOrganization(organizationId: string): Promise<any>{
    return await electionContract.methods.fetchByOrganizationId(organizationId).call();
}



export {getContract, getAllElections, 
    getSingleElection,getVoterTimeForElection,getElectionByOrganization}

