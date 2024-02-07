import { RequiredParameterError } from "@shared/ customError";
import { Member } from "./organization.models";

export default function makeMember(member: any): Member {
    if (!member.name) {
        throw new RequiredParameterError('Member must have a name.')
    }

    if (!member.email) {
        throw new RequiredParameterError('Member must have a emial.')
    }
    if(!member.organizationId){
        throw new RequiredParameterError('Member must have a Organization.')
    }
    
    return {
        name: member.name,
        email:member.email,
        organizationId:member.organizationId
    }
}