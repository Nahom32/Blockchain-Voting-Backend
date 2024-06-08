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
export interface ElectionTimeSeries{
    id?:string,
    electionName: string,
    electionId: string,
    voterTimeStamps: number[],
}
export enum RangeEnum {
    MONTHLY = 'MONTHLY',
    WEEKLY = 'WEEKLY',
    YEARLY = 'YEARLY'
}
export interface ElectionTimeSeriesDTO{
    id?:string,
    electionName: string,
    electionId: string,
    timeSeries: Record<string,number>

}
