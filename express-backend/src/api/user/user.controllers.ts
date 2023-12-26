import {Response } from 'express';
import { handleCreateUserRequest } from '@application/user';
import { CRequest } from '@shared/customRequest';

/**
 * @openapi
 * tags:
 *   - name: User
 *     description: Operations related to User 
 */

/**
 * @openapi
 * /api/v1/user:
 *   post:
 *     summary: Create a new user
 *     description: Create a new user
 *     tags:
 *      - User
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *             example:
 *               email: john
 *               password: Doe
 * 
 *     responses:
 *       '201':
 *         description: User created
 *       '400':
 *         description: Invalid request
 */
export function createUserController(req: CRequest, res: Response){
    handleCreateUserRequest(req)
      .then(({ headers, statusCode, data }) =>
        res
          .set(headers)
          .status(statusCode)
          .send(data)
      )
      .catch(e => res.status(500).end())
}