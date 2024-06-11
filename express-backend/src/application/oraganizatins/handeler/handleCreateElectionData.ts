import { CRequest } from "@shared/customRequest";
import * as  organizationList from "@application/oraganizatins/organization.list";
import {CustomError, RequiredParameterError, UniqueConstraintError } from "@shared/customError";
import makeHttpResponse from "@shared/makeHttpResponse";
import makeHttpError from "@shared/makeHttpError";
import makeElectionData from "../electionData";

export default async function handleCreateElectionData(httpRequest:CRequest){
    try {
        const data = makeElectionData(httpRequest.body)

        const newData = await organizationList.createElectionData( data.electionId, data.candidateId, data.candidateName)
        const responce:any = {
            electionId: newData.electionId,
            candidataId: newData.candidataId,
            candidateName: newData.candidateName
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
        errorMessage: "Election data could not be created."
      });
    }
}