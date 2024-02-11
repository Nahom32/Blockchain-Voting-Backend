import { CRequest } from "@shared/customRequest";
import {CustomError, RequiredParameterError } from "@shared/ customError";
import makeHttpResponse from "@shared/makeHttpResponse";
import makeHttpError from "@shared/makeHttpError";
import makeMember from "../member";
import makeMemberList from "../member.list";
import { MemberDto } from "../organization.models";
import {notifyMemberTemplate} from '@shared/templates';
import sendMail, { MailInterface } from "@application/services/emials.services";
import makeOraganizationList from "../organization.list";



export default async function handleCreateMemberRequest(httpRequest:CRequest){
    try {
        const member = makeMember(httpRequest.body)
        const memberList = makeMemberList()

        const newMember = await memberList.createMember(member)
        const organizationList = makeOraganizationList()
        const organization = await organizationList.getOraganizationById(newMember.organizationId)
        const organizationName = organization?.name?organization.name:""

        
        const emailTemplate = notifyMemberTemplate(newMember.name, organizationName)
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