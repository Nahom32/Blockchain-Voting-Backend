import {Response } from 'express';
import { CRequest } from '@shared/customRequest';
import handleFileUploadRequestRequest from '@application/file-upload/handeler/handleFileUploadRequestRequest';

/**
 * @openapi
 * tags:
 *   - name: File upload
 *     description: Operations related to auth 
 */

/**
 * @openapi
 * /upload:
 *   post:
 *     summary: Upload an image
 *     tags:
 *      - File upload 
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       '200':
 *         description: Successfully uploaded image
 *         content:
 *           application/json:
 *             example:
 *               imageUrl: /uploads/1234567890.jpg
 *       '400':
 *         description: No file uploaded
 */
export function uploadFileController(req: CRequest, res: Response){
  handleFileUploadRequestRequest(req)
      .then(({ headers, statusCode, data }) =>
        res
          .set(headers)
          .status(statusCode)
          .send(data)
      )
      .catch(e => res.status(500).end())
}