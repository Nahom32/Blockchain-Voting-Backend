import handleCreateElectionData from "@application/oraganizatins/handeler/handleCreateElectionData";
import handleGetElectionTimeSeries from "@application/oraganizatins/handeler/handleGetElectionData";
import { CRequest } from "@shared/customRequest";
import { RequestHandler, Response } from "express";

/**
 * @openapi
 * tags:
 *   - name: Election Statistics
 *     description: Operations related to Election statistics 
 */


/**
 * @openapi
 * /api/v1/elections/election-data:
 *   post:
 *     summary: Create a new Election statistics
 *     description: Create a new election statistics
 *     tags:
 *      - Election statistics
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               electionId:
 *                 type: string
 *               candidateId:
 *                 type: string
 *             example:
 *               electionId: ""
 *               candidateId: ""
 *               candidateName: ""
 * 
 *     responses:
 *       '201':
 *         description: Election statistics created
 *       '400':
 *         description: Invalid request
 */
export function createElectionDataController(req:CRequest, res:Response){
    handleCreateElectionData(req)
        .then(({ headers, statusCode, data }) =>
            res
            .set(headers)
            .status(statusCode)
            .send(data)
        ).catch(e => res.status(500).end())
}

/**
 * @openapi
 * /api/v1/elections/election-data:
 *   get:
 *     summary: Retrieve election statistics
 *     description: Retrieve election statistics for a specific election within a time range
 *     tags:
 *      - Election statistics
 *     parameters:
 *       - in: query
 *         name: electionId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the election
 *       - in: query
 *         name: startTime
 *         required: true
 *         schema:
 *           type: string
 *           format: date-time
 *         description: The start time for the statistics
 *       - in: query
 *         name: endTime
 *         required: true
 *         schema:
 *           type: string
 *           format: date-time
 *         description: The end time for the statistics
 *     responses:
 *       '200':
 *         description: Election statistics retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   candidateName:
 *                     type: string
 *                   series:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         name:
 *                           type: string
 *                         value:
 *                           type: number
 *       '400':
 *         description: Invalid request
 *       '500':
 *         description: Internal server error
 */

export async function getElectionTimeSeriesController(req:CRequest, res:Response){
    handleGetElectionTimeSeries(req)
    .then(({ headers, statusCode, data }) =>
        res
        .set(headers)
        .status(statusCode)
        .send(data)
    ).catch(e => res.status(500).end())
}