import { CustomError, RequiredParameterError } from "@shared/customError";
import { CRequest } from "@shared/customRequest";
import makeHttpError from "@shared/makeHttpError";
import makeHttpResponse from "@shared/makeHttpResponse";
import statisticsPersistenceMethods from "../statistics.persistence";
import { ElectionTimeSeriesDTO, RangeEnum } from "../statistics.models";
import { calculateTimeSeriesDistribution } from "../election.time.series";

export async function handleGetTimeSeriesRequest(httpRequest:CRequest){
    try {
        const electionId = httpRequest.params.electionId
        const interval = RangeEnum.MONTHLY
        console.log(electionId)
        if (!electionId) {
            throw new RequiredParameterError('organizationId is Required.')
        }
        const persistenceMethods = statisticsPersistenceMethods()
        const statistic = await persistenceMethods.getElectionTimeSeries(electionId);
        let timeSeriesRecord: Record<string,number> = {};
        if(statistic !== null){
            timeSeriesRecord = calculateTimeSeriesDistribution(statistic.voterTimeStamps as number[], interval)
        }
        const statisticDTO:ElectionTimeSeriesDTO={
            electionName: statistic?.electionName as string,
            electionId: statistic?.electionId as string,
            timeSeries: timeSeriesRecord
        }
        return makeHttpResponse({
            statusCode: 200,
            data: statisticDTO
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
