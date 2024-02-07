import { CRequest } from "@shared/customRequest";
import {OrganizationDto} from "../organization.models";
import makeHttpResponse from "@shared/makeHttpResponse";
import makeHttpError from "@shared/makeHttpError";
import makeOraganizationList from "../organization.list";


export default async function handleGetOraganizationsRequest(httpRequest:CRequest){
    try {
        const oraganizationList = makeOraganizationList()
        const oraganizations = await oraganizationList.getOraganizations();

        return makeHttpResponse({
            statusCode: 200,
            data: oraganizations
          });
        
    } catch (error) {
        console.error(error);
      return makeHttpError({
        statusCode: 500,
        errorMessage: "Oraganization could not be fetched."
      });
    }
}