import { prisma } from "@shared/prisma";

export default function makeElectionData(data: any): any {
    
    return {
       electionId: data.electionId,
       candidateId: data.candidateId,
       candidateName: data.candidateName
    }
}