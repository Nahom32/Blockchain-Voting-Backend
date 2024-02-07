import { Response } from "express";
import { 
    handleCreateOrganaizationRequest, 
    handleCreateMemberRequest,
    handleGetMemberRequest,
    handleGetOraganizationsRequest,
    handleToggleOraganizationActivationRequest
} from "@application/oraganizatins";
import { CRequest } from "@shared/customRequest";

/**
 * @openapi
 * tags:
 *   - name: Organaization
 *     description: Operations related to Organaization 
 */

/**
 * @openapi
 * /api/v1/oraganizatins:
 *   post:
 *     summary: Create a new organaization
 *     description: Create a new organaization
 *     tags:
 *      - Organaization
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               shortName:
 *                 type: string
 *             example:
 *               name: Addis Abeba
 *               shortName: AAiT
 * 
 *     responses:
 *       '201':
 *         description: Oraganizatin created
 *       '400':
 *         description: Invalid request
 */
export function createOraganizatinController(req:CRequest, res:Response){
    handleCreateOrganaizationRequest(req)
        .then(({ headers, statusCode, data }) =>
            res
            .set(headers)
            .status(statusCode)
            .send(data)
        ).catch(e => res.status(500).end())
}

/**
 * @openapi
 * /api/v1/oraganizatins/members:
 *   post:
 *     summary: Create a new members
 *     description: Create a new members
 *     tags:
 *      - Organaization
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               organizationId:
 *                 type: string
 *             example:
 *               name: Teshome Nbret
 *               email: teshomeemial
 *               organizationId: ewfuiefuiwef
 * 
 *     responses:
 *       '201':
 *         description: Member created
 *       '400':
 *         description: Invalid request
 */
export function createMemberController(req:CRequest, res:Response){
    handleCreateMemberRequest(req)
        .then(({ headers, statusCode, data }) =>
            res
            .set(headers)
            .status(statusCode)
            .send(data)
        ).catch(e => res.status(500).end())
}


/**
 * @openapi
 * /api/v1/oraganizatins/members/{organizationId}:
 *   get:
 *     summary: Get members of an organaization
 *     description: Get members of an organaization
 *     tags:
 *      - Organaization
 *     parameters:
 *       - in: path
 *         name: organizationId
 *         required: true
 *         description: ID of the organaization to get members
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: A successful response
 *       '400':
 *         description: Invalid request
 */
export function getMemberController(req:CRequest, res:Response){
    handleGetMemberRequest(req)
        .then(({ headers, statusCode, data }) =>
            res
            .set(headers)
            .status(statusCode)
            .send(data)
        ).catch(e => res.status(500).end())
}

/**
 * @openapi
 * /api/v1/oraganizatins:
 *   get:
 *     summary: Get all organaizations
 *     description: Get all organaizations
 *     tags:
 *      - Organaization
 *     responses:
 *       '200':
 *         description: A successful response
 *       '400':
 *         description: Invalid request
 */
export function getOraganizationsController(req:CRequest, res:Response){
    handleGetOraganizationsRequest(req)
        .then(({ headers, statusCode, data }) =>
            res
            .set(headers)
            .status(statusCode)
            .send(data)
        ).catch(e => res.status(500).end())
}

/**
 * @openapi
 * /api/v1/oraganizatins/{organizationId}:
 *   put:
 *     summary: Toggle organaization activation
 *     description: Toggle organaization activation
 *     tags:
 *      - Organaization
 *     parameters:
 *       - in: path
 *         name: organizationId
 *         required: true
 *         description: ID of the organaization to toggle activation
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: A successful response
 *       '400':
 *         description: Invalid request
 */
export function toggleOraganizationActivationController(req:CRequest, res:Response){
    handleToggleOraganizationActivationRequest(req)
        .then(({ headers, statusCode, data }) =>
            res
            .set(headers)
            .status(statusCode)
            .send(data)
        ).catch(e => res.status(500).end())
}