import { CRequest } from "@shared/customRequest";
import {CustomError, RequiredParameterError } from "@shared/ customError";
import makeHttpResponse from "@shared/makeHttpResponse";
import makeHttpError from "@shared/makeHttpError";
import makeMember from "../member";
import makeMemberList from "../member.list";
import { MemberDto } from "../organization.models";

export default async function handleCreateMemberRequest(httpRequest:CRequest){
    try {
        const member = makeMember(httpRequest.body)
        const memberList = makeMemberList()

        const newMember = await memberList.createMember(member)
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