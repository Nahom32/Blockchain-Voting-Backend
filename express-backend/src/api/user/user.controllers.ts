import {Response } from 'express';
import { handleCreateUserRequest, handleVerifyEmailRequest,handleGetUsersRequest, handleForgetPasswordRequest, handleResetPasswordRequest } from '@application/user';
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

/**
 * @openapi
 * /api/v1/user:
 *   get:
 *     summary: Get all users
 *     description: Get all users
 *     tags:
 *      - User
 *     responses:
 *       '200':
 *         description: A successful response
 *       '400':
 *         description: Invalid request
 */
export function getUsersController(req:CRequest, res:Response){
  handleGetUsersRequest(req)
      .then(({ headers, statusCode, data }) =>
          res
          .set(headers)
          .status(statusCode)
          .send(data)
      ).catch(e => res.status(500).end())
}

/**
 * @openapi
 * /api/v1/user/forget-password:
 *   post:
 *     summary: Forget password
 *     description: Forget password
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
 *             example:
 *               email: john
 * 
 *     responses:
 *       '200':
 *         description: Password reset
 *       '400':
 *         description: Invalid request
 */
export function forgetPasswordController(req: CRequest, res: Response){
    handleForgetPasswordRequest(req)
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
 * /api/v1/user/reset-password:
 *   post:
 *     summary: Reset password
 *     description: Reset password
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
 *               password:
 *                 type: string
 *               confirmPassword:
 *                 type: string
 *             example:
 *               email: john
 *               otp: 1234
 *               password: Doe
 *               confirmPassword: Doe
 * 
 *     responses:
 *       '200':
 *         description: Password reset
 *       '400':
 *         description: Invalid request
 */
export function resetPasswordController(req: CRequest, res: Response){
    handleResetPasswordRequest(req)
      .then(({ headers, statusCode, data }) =>
        res
          .set(headers)
          .status(statusCode)
          .send(data)
      )
      .catch(e => res.status(500).end())
}