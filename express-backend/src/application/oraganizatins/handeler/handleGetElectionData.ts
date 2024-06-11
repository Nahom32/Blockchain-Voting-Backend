import { CRequest } from "@shared/customRequest";
import { CustomError, NotFoundError, RequiredParameterError } from "@shared/customError";
import makeHttpResponse from "@shared/makeHttpResponse";
import makeHttpError from "@shared/makeHttpError";
import * as organizationList from '../organization.list'

export default async function handleGetElectionTimeSeries(httpRequest: CRequest) {
    try {
        const {electionId, startTime, endTime} = httpRequest.query

        const electionData = await organizationList.getElectionData(electionId, startTime, endTime);

        return makeHttpResponse({
            statusCode: 200,
            data: electionData
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
