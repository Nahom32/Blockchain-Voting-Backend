import { RequiredParameterError } from "@shared/customError";
import { Organization } from "./organization.models";

export default function makeElectionData(data: any): any {
    
    return {
       electionId: data.electionId,
       candidateId: data.candidateId,
       candidateName: data.candidateName
    }
}