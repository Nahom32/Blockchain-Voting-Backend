import handleCreateElectionData from "@application/oraganizatins/handeler/handleCreateElectionData";
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
