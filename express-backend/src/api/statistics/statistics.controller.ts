import { handleGetTimeSeriesRequest } from "@application/statistics/handler/handleGetElectionTimeSeries";
import { handleGetOrganizationStatRequest } from "@application/statistics/handler/handleGetOrganizationStatistics";
import { CRequest } from "@shared/customRequest";
import {Response} from "express";
/**
 * @openapi
 * /api/v1/statistics/organization/{organizationId}:
 *   get:
 *     summary: Get members of an organization election statistics
 *     description: Get members of an organaization
 *     tags:
 *      - Statistics
 *     parameters:
 *       - in: path
 *         name: organizationId
 *         required: true
 *         description: ID of the organization to get statistics
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: A successful response
 *       '400':
 *         description: Invalid request
 */

export function getGeneralOrganizationElectionController(req:CRequest, res:Response){
    handleGetOrganizationStatRequest(req)
        .then(({ headers, statusCode, data }) =>
            res.
             set(headers)
            .status(statusCode) 
            .send(data)
        ).catch(e => res.status(500).end())
}
/**
 * @openapi
 * /api/v1/statistics/timeSeries/{electionId}:
 *   get:
 *     summary: Get election Time series for elections
 *     description: Get election time series
 *     tags:
 *      - Statistics
 *     parameters:
 *       - in: path
 *         name: electionId
 *         required: true
 *         description: ID of the organization to get statistics
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: A successful response
 *       '400':
 *         description: Invalid request
 */

export function getTimeSeriesController(req:CRequest, res:Response){
    handleGetTimeSeriesRequest(req)
    .then(({ headers, statusCode, data }) =>
        res.
         set(headers)
        .status(statusCode) 
        .send(data)
    ).catch(e => res.status(500).end())
}