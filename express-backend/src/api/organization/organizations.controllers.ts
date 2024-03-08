import { RequestHandler, Response } from "express";
import { 
    handleCreateOrganaizationRequest, 
    handleCreateMemberRequest,
    handleGetMemberRequest,
    handleGetOraganizationsRequest,
    handleToggleOraganizationActivationRequest,
    handleGetOraganizationWithMembersRequest,
} from "@application/oraganizatins";
import { CRequest, FileRequest } from "@shared/customRequest";
import handleGetOrganizationsByUserId from "@application/oraganizatins/handeler/handleGetOrganizationsByUserId";
import handleBulkCreateMemberRequest from "@application/oraganizatins/handeler/handleCreateMembersFromFileRequest";
import { serveCsvTemplate, serveExcelTemplate } from "@application/oraganizatins/handeler/handleDownloadTemplate";

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

/**
 * @openapi
 * /api/v1/oraganizatins/{organizationId}:
 *   get:
 *     summary: Get organaization with members
 *     description: Get organaization with members
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
export function getOraganizationWithMembersController(req:CRequest, res:Response){
    handleGetOraganizationWithMembersRequest(req)
        .then(({ headers, statusCode, data }) =>
            res
            .set(headers)
            .status(statusCode)
            .send(data)
        ).catch(e => res.status(500).end())

}


/**
 * @swagger
 * /oraganizatins/user/{userId}:
 *   get:
 *     summary: Get organizations by user ID
 *     tags: [Organaization]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         description: User ID
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Successful response
 *       '404':
 *         description: User not found
 *       '500':
 *         description: Internal server error
 */
export async function getOrganizationsByUserIdController(req:CRequest, res:Response){
    handleGetOrganizationsByUserId(req)
    .then(({ headers, statusCode, data }) =>
        res
        .set(headers)
        .status(statusCode)
        .send(data)
    ).catch(e => res.status(500).end())
}


/**
 * @openapi
 * /api/v1/oraganizatins/members/upload:
 *   post:
 *     summary: Bulk create members from file
 *     description: Bulk create members from CSV or Excel file
 *     tags:
 *      - Organaization
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - in: formData
 *         name: file
 *         type: file
 *         format: binary 
 *         description: The CSV or Excel file to upload
 *       - in: formData
 *         name: organizationId
 *         type: string
 *         description: ID of the organization to associate members
 *     responses:
 *       '201':
 *         description: Members created successfully
 *       '400':
 *         description: Invalid request or file type
 */
export function bulkCreateMembersFromFileController(req: FileRequest, res: Response) {
    handleBulkCreateMemberRequest(req, res)
        .then(({ headers, statusCode, data }) =>
            res
                .set(headers)
                .status(statusCode)
                .send(data)
        ).catch(e => res.status(500).end());
}

/**
 * @openapi
 * /api/v1/oraganizatins/members/template/csv:
 *   get:
 *     summary: Download CSV template
 *     description: Download a CSV template file for bulk member creation
 *     tags:
 *      - Organaization
 *     produces:
 *       - application/csv
 *     responses:
 *       '200':
 *         description: CSV template downloaded successfully
 */
export function downloadCsvTemplateController(req: FileRequest, res: Response){
    serveCsvTemplate(res)
};

/**
 * @openapi
 * /api/v1/oraganizatins/members/template/excel:
 *   get:
 *     summary: Download Excel template
 *     description: Download an Excel template file for bulk member creation
 *     tags:
 *      - Organaization
 *     produces:
 *       - application/vnd.openxmlformats-officedocument.spreadsheetml.sheet
 *     responses:
 *       '200':
 *         description: Excel template downloaded successfully
 */
export function downloadExcelTemplateController(req: FileRequest, res: Response){
    serveExcelTemplate(res)
};