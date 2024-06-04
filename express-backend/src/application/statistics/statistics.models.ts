export interface OrganizationGeneralElectionStatistics{
    id?:string,
    organizationId:string,
    numberOfElections:number,
    numberOfTotalVotes:number
}

export interface OrganizationSpecificElectionStatistics{
    id?:string,
    organizationId: string,
    electionId: string,
    numberOfVotes:number,
}
export interface IndividualGeneralElectionStatistics{
    id?:string,
    numberOfElections:number,
    numberOfVotes:number

}
export interface IndividualSpecificElectionStatistics{
    id?:string,
    electionId: string,
    numberOfVotes:number,
}
