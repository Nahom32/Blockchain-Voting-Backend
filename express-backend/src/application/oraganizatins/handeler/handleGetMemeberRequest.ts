import { CRequest } from "@shared/customRequest";
import { CustomError, NotFoundError, RequiredParameterError } from "@shared/customError";
import makeHttpResponse from "@shared/makeHttpResponse";
import makeHttpError from "@shared/makeHttpError";
import * as memberList from "../member.list";
import * as organizationList from '../organization.list'
import { MemberDto } from "../organization.models";

export default async function handleGetMemberRequest(httpRequest: CRequest) {
    try {
        const organizationId = httpRequest.params.organizationId
        if (!organizationId) {
            throw new RequiredParameterError('organizationId is Requerd.')
        }
        const organization = await organizationList.getOraganizationById(organizationId)
        if(!organization){
            throw new NotFoundError('Organization not found.')
        }
        
        const members = await memberList.getMembersByOraganizationId(organizationId);

        return makeHttpResponse({
            statusCode: 200,
            data: members
        });
    } catch (error) {
        console.error(error);
        if (error instanceof CustomError) {

            if (error instanceof RequiredParameterError) {
                return makeHttpError({
                    statusCode: 400,
                    errorMessage: error.message
                });
            }
            if (error instanceof NotFoundError) {
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
            errorMessage: "Proplrm while feating Memebers."
        });
    }
}

