import { CRequest } from "@shared/customRequest";
import { CustomError, RequiredParameterError } from "@shared/ customError";
import makeHttpResponse from "@shared/makeHttpResponse";
import makeHttpError from "@shared/makeHttpError";
import makeOrganizationList from "../organization.list";

export default async function handleGetOrganizationsByUserIdRequest(httpRequest: CRequest) {
    try {
        const id = httpRequest.params.id
        if (!id) {
            throw new RequiredParameterError('user id is Requerd.')
        }
        const organizationList = makeOrganizationList()
        const organizations = await organizationList.getOraganizationsByUserId(id);

        return makeHttpResponse({
            statusCode: 200,
            data: organizations
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

