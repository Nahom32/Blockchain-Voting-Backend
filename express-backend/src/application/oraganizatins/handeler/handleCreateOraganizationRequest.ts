import { CRequest } from "@shared/customRequest";
import makeOrganization from "../organization";
import makeOraganizationList from "../organization.list";
import {OrganizationDto} from "../organization.models";
import {CustomError, RequiredParameterError, UniqueConstraintError } from "@shared/customError";
import makeHttpResponse from "@shared/makeHttpResponse";
import makeHttpError from "@shared/makeHttpError";

export default async function handleCreateOrganaizationRequest(httpRequest:CRequest){
    try {
        const oraganizatin = makeOrganization(httpRequest.body)
        const oraganizationList = makeOraganizationList()
        console.log("httpRequest",httpRequest.user);
        const userId = httpRequest.user.id

        const newOraganization = await oraganizationList.createOraganization(oraganizatin, userId)
        const responce:OrganizationDto = {
            id:newOraganization.id,
            name:newOraganization.name,
            shortName:newOraganization.shortName,
            isActive:newOraganization.isActive
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
        if(error instanceof UniqueConstraintError){
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
        errorMessage: "Oraganization could not be created."
      });
    }
}