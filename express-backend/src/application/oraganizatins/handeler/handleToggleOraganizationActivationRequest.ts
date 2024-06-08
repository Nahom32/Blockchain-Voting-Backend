import { CRequest } from "@shared/customRequest";
import * as  organizationList from "@application/oraganizatins/organization.list";
import makeHttpError from "@shared/makeHttpError";
import makeHttpResponse from "@shared/makeHttpResponse";
import {CustomError, RequiredParameterError, NotFoundError} from "@shared/customError";

export default async function handleToggleOraganizationActivationRequest(httpRequest:CRequest){
    try {
        const organizationId = httpRequest.params.organizationId
        if (!organizationId) {
            throw new RequiredParameterError('organizationId is Requerd.')
        }
        const oraganization = await organizationList.getOraganizationById(organizationId);
        if(!oraganization){
            throw new NotFoundError('Oraganization not found.')
        }
        oraganization.isActive = !oraganization.isActive
        await organizationList.updateOraganization(oraganization)
        return makeHttpResponse({
            statusCode: 200,
            data: oraganization
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
        errorMessage: "Oraganization could not be updated."
      });
    }
}
    