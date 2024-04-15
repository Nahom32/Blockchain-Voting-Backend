import { RequiredParameterError } from "@shared/customError";
import { Organization } from "./organization.models";

export default function makeOrganization(organization: any): Organization {
    if (!organization.name) {
        throw new RequiredParameterError('Organization must have a name.')
    }

    if (!organization.shortName) {
        throw new RequiredParameterError('Organization must have a shortName.')
    }
    
    return {
        name: organization.name,
        shortName:organization.shortName,
        isActive:false
    }
}