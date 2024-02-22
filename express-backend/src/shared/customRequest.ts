import { Request} from 'express';

export interface CRequest extends Request{
    user?: any;
}

export interface FileRequest extends Request{
    files?: { [fieldname: string]: Express.Multer.File[] };
}