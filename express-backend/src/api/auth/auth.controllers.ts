import { Response } from 'express';
import { handleLoginRequest } from '../../application/auth/handeler/handleLoginRequest';
import { CRequest } from '../../shared/customRequest';

/**
 * @openapi
 * /api/auth/login:
 *   post:
 *     summary: Login to the system
 *     description: Login to the system
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
  * 
 *     responses:
 *       '201':
 *         description: Token
 *       '400':
 *         description: Invalid request
 */
export function login(req: CRequest, res: Response) {
    handleLoginRequest(req)
        .then(({ headers, statusCode, data }) =>
            res
                .set(headers)
                .status(statusCode)
                .send(data)
        )
        .catch(e => res.status(500).end())

}