import { FileRequest } from "@shared/customRequest";
import { Response } from "express";
import makeHttpResponse from "@shared/makeHttpResponse";
import makeHttpError from "@shared/makeHttpError";
import * as memberList from "../member.list";
import * as xlsx from 'xlsx';
import { Member } from "../organization.models";
import { Readable } from 'stream';
import csvParser from 'csv-parser';
import { queueEmails } from "@application/services/emials.services";
import * as  organizationList from "@application/oraganizatins/organization.list";
import {CustomError, NotFoundError } from "@shared/customError";


export default async function handleBulkCreateMemberRequest(req: FileRequest, res: Response) {
    try {

        if (req.files && req.files.file && req.body.organizationId) {
            const organizationId = req.body.organizationId;
            const organization = await organizationList.getOraganizationById(organizationId)
        if(!organization){
            throw new NotFoundError('Organization not found.')
        }
            const files = Array.isArray(req.files.file) ? req.files.file : [req.files.file];

            const members: Member[] = [];
            for (const file of files) {
                if (file.mimetype === 'text/csv' || file.mimetype === 'application/vnd.ms-excel' ||
                file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
                    const parsedMembers = await parseMembersFromFile(file, organizationId);
                    members.push(...parsedMembers);
                } else {
                    return makeHttpError({
                        statusCode: 400,
                        errorMessage: 'Invalid file type. Only CSV and Excel files are allowed.',
                    });
                }
            }

            const newMembers = await memberList.createMembersFromFile(members);
            queueEmails(members, organization.name);

            return makeHttpResponse({
                statusCode: 201,
                data: newMembers.map((member: Member) => ({
                    id: member.id,
                    name: member.name,
                    email: member.email,
                    organizationId: member.organizationId,
                })),
            });
        } else {
            return makeHttpError({
                statusCode: 400,
                errorMessage: 'File or organizationId not provided.',
            });
        }
    } catch (error) {
        console.error(error);
        if(error instanceof CustomError){

            if(error instanceof NotFoundError){
              return makeHttpError({
               statusCode: 404,
               errorMessage: error.message
             });
           }

            return makeHttpError({
              statusCode: 400,
              errorMessage: error.message
            });
          }
    
        return makeHttpError({
            statusCode: 500,
            errorMessage: 'Bulk member creation failed.',
        });
    }
}

async function parseMembersFromFile(file: any, organizationId: string): Promise<Member[]> {
    return new Promise(async (resolve, reject) => {
        const members: Member[] = [];

        try {
            if (file.mimetype === 'text/csv') {
                const stream = Readable.from(file.data.toString());

                const csvStream = stream.pipe(csvParser());
    
                csvStream.on('data', (row: any) => {
                    if (row.name && row.email) {
                        members.push({
                            name: row.name,
                            email: row.email,
                            organizationId: organizationId,
                        });
                    }
                });
    
                csvStream.on('end', () => {
                    resolve(members);
                });
    
                csvStream.on('error', (error: any) => {
                    reject(error);
                });
            } else if (file.mimetype === 'application/vnd.ms-excel' || file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
                const workbook = xlsx.read(new Uint8Array(file.data), { type: 'array' });
                const sheetName = workbook.SheetNames[0];
                const sheet = workbook.Sheets[sheetName];

                const data = xlsx.utils.sheet_to_json(sheet);

                data.forEach((row: any) => {
                    members.push({
                        name: row.name,
                        email: row.email,
                        organizationId: organizationId,
                    });
                });

                resolve(members);
            } else {
                reject('Invalid file type.');
            }
        } catch (error) {
            reject(error);
        }
    });
}
