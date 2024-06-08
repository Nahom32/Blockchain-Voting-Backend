import { CRequest } from "@shared/customRequest";
import makeHttpResponse from "@shared/makeHttpResponse";
import makeHttpError from "@shared/makeHttpError";
import  * as userList from '../user.list'



export default async function handleGetUsersRequest(httpRequest:CRequest){
    try {
        const users = await userList.getUsers();

        return makeHttpResponse({
            statusCode: 200,
            data: users
          });
        
    } catch (error) {
        console.error(error);
      return makeHttpError({
        statusCode: 500,
        errorMessage: "Users could not be fetched."
      });
    }
}