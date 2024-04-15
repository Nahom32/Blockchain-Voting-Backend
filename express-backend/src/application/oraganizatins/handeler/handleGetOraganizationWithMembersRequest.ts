import { CRequest } from "@shared/customRequest";
import {OrganizationDto, OrganizationWithMembers} from "../organization.models";
import makeHttpResponse from "@shared/makeHttpResponse";
import makeHttpError from "@shared/makeHttpError";
import makeOraganizationList from "../organization.list";
import makeMemberList from "../member.list";
import {CustomError, NotFoundError } from "@shared/customError";


export default async function handleGetOraganizationWithMembersRequest(httpRequest:CRequest){
    try {
        const oraganizationList = makeOraganizationList()
        const oraganizationId = httpRequest.params.id;
        const oraganization = await oraganizationList.getOraganizationById(oraganizationId);
        if(!oraganization){
            throw new NotFoundError("Oraganization not found");
        }
        const oraganizationDto:OrganizationDto = {
            id: oraganization.id,
            name: oraganization.name,
            shortName: oraganization.shortName,
            isActive: oraganization.isActive,
            userId: oraganization.userId
        }

        const memberList = makeMemberList()
        const members = await memberList.getMembersByOraganizationId(oraganizationId);
        const oraganizationWithMembers:OrganizationWithMembers = {
            ...oraganizationDto,
            members: members
        }
        return makeHttpResponse({
            statusCode: 200,
            data: oraganizationWithMembers
          });
        
    } catch (error) {
        console.error(error);
        if(error instanceof CustomError){
            if(error instanceof NotFoundError){
                return makeHttpError({
                    statusCode: 404,
                    errorMessage: error.message
                });
            }
            return makeHttpError({
                statusCode: 400,
                errorMessage: error.message
            });
        }
        return makeHttpError({
            statusCode: 500,
            errorMessage: "Oraganization could not be fetched."
        });
    }
}
