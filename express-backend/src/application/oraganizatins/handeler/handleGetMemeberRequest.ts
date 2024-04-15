import { CRequest } from "@shared/customRequest";
import { CustomError, RequiredParameterError } from "@shared/customError";
import makeHttpResponse from "@shared/makeHttpResponse";
import makeHttpError from "@shared/makeHttpError";
import makeMemberList from "../member.list";
import { MemberDto } from "../organization.models";

export default async function handleGetMemberRequest(httpRequest: CRequest) {
    try {
        const organizationId = httpRequest.params.organizationId
        if (!organizationId) {
            throw new RequiredParameterError('organizationId is Requerd.')
        }
        const memberList = makeMemberList()
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

