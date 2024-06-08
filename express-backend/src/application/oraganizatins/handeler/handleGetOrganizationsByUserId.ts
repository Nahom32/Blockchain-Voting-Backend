import { CRequest } from "@shared/customRequest";
import { CustomError, NotFoundError, RequiredParameterError } from "@shared/customError";
import makeHttpResponse from "@shared/makeHttpResponse";
import makeHttpError from "@shared/makeHttpError";
import * as  organizationList from "@application/oraganizatins/organization.list";
import * as  userLists from "@application/user/user.list";

export default async function handleGetOrganizationsByUserIdRequest(httpRequest: CRequest) {
    try {
        const id = httpRequest.params.id
        if (!id) {
            throw new RequiredParameterError('user id is Requerd.')
        }
        const user = await userLists.getUserById(id);
        if (!user) {
            throw new NotFoundError('User not found.')
        }
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

