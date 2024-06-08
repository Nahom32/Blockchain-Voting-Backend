import { CRequest } from "@shared/customRequest";
import {CustomError, NotFoundError, RequiredParameterError } from "@shared/customError";
import makeHttpResponse from "@shared/makeHttpResponse";
import makeHttpError from "@shared/makeHttpError";
import makeMember from "../member";
import * as memberList from "../member.list";
import { MemberDto } from "../organization.models";
import {notifyMemberTemplate} from '@shared/templates';
import sendMail, { MailInterface } from "@application/services/emials.services";
import * as  organizationList from "@application/oraganizatins/organization.list";



export default async function handleCreateMemberRequest(httpRequest:CRequest){
    try {
        const member = makeMember(httpRequest.body)

        const organization = await organizationList.getOraganizationById(member.organizationId)
        if(!organization){
            throw new NotFoundError('Organization not found.')
        }

        const newMember = await memberList.createMember(member)

        
        const emailTemplate = notifyMemberTemplate(newMember.name, organization.name)
        const mail: MailInterface = {
            to: newMember.email,
            subject: 'Welcome to the organization',
            html: emailTemplate.html,
        };
        await sendMail(mail);
        const responce:MemberDto = {
            id:newMember.id,
            name:newMember.name,
            email:newMember.email,
            organizationId:newMember.organizationId
        }
        return makeHttpResponse({
            statusCode: 201,
            data: responce
          });
        
    } catch (error) {
        console.error(error);
      if(error instanceof CustomError){

        if(error instanceof RequiredParameterError){
           return makeHttpError({
            statusCode: 400,
            errorMessage: error.message
          });
        }

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
        errorMessage: "Member could not be created."
      });
    }
}