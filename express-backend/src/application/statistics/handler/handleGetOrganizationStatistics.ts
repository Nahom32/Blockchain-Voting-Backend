import { CustomError, RequiredParameterError } from "@shared/customError";
import { CRequest } from "@shared/customRequest";
import makeHttpError from "@shared/makeHttpError";
import makeHttpResponse from "@shared/makeHttpResponse";
import statisticsPersistenceMethods from "../statistics.persistence";

export async function handleGetOrganizationStatRequest(httpRequest:CRequest){
    try {
        const organizationId = httpRequest.params.organizationId
        console.log(organizationId)
        if (!organizationId) {
            throw new RequiredParameterError('organizationId is Required.')
        }
        const persistenceMethods = statisticsPersistenceMethods()
        const statistic = await persistenceMethods.getGeneralOrganizationElectionStatistics(organizationId);

        return makeHttpResponse({
            statusCode: 200,
            data: statistic
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
            errorMessage: "Problem while getting errors"
        });
    }
}
