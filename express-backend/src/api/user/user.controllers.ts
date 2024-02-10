import {Response } from 'express';
import { handleCreateUserRequest, handleVerifyEmailRequest } from '@application/user';
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
 *               confirmPassword:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum:
 *                    - ADMIN
 *                    - ELECTOR
 *                    - ELECTION_CREATOR
 *             example:
 *               email: john
 *               password: Doe
 *               confirmPassword: Doe
 *               role: ADMIN
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

/**
 * @openapi
 * /api/v1/user/verify-email:
 *   post:
 *     summary: Verify email
 *     description: Verify email
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
 *               otp:
 *                 type: string
 *             example:
 *               email: john
 *               otp: 1234
 * 
 *     responses:
 *       '200':
 *         description: Email verified
 *       '400':
 *         description: Invalid request
 */
export function verifyEmailController(req: CRequest, res: Response){
    handleVerifyEmailRequest(req)
      .then(({ headers, statusCode, data }) =>
        res
          .set(headers)
          .status(statusCode)
          .send(data)
      )
      .catch(e => res.status(500).end())
}