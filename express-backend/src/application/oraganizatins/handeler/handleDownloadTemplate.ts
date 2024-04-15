import { Response } from 'express';
import * as path from 'path';
import makeHttpResponse from "@shared/makeHttpResponse";
import makeHttpError from "@shared/makeHttpError";
import { CustomError } from '@shared/customError';

export function serveCsvTemplate(res: Response) {
    try {
        serveTemplate(res, 'template.csv');
    } catch (error) {
        console.error(error);
        if (error instanceof CustomError) {
            return makeHttpError({
                statusCode: 400,
                errorMessage: error.message
            });
        }
        return makeHttpError({
            statusCode: 500,
            errorMessage: 'Internal Server Error',
        });
    }
}

export function serveExcelTemplate(res: Response) {
    try {
        serveTemplate(res, 'template.xlsx');
    } catch (error) {
        console.error(error);
        if (error instanceof CustomError) {
            return makeHttpError({
                statusCode: 400,
                errorMessage: error.message
            });
        }
        return makeHttpError({
            statusCode: 500,
            errorMessage: 'Internal Server Error',
        });
    }
}

function serveTemplate(res: Response, filename: string): void {
    const templatePath = path.join(__dirname, 'templates', filename);
    res.download(templatePath, filename, (err) => {
        if (err) {
            console.error('Error serving template:', err);
            throw new CustomError('Internal Server Error');
        }
    });
}
