import { HttpResponse } from "./httpResponse.models";

export default function makeHttpError({ statusCode, errorMessage }: { statusCode: number, errorMessage: string }):HttpResponse{
    return {
      headers: {
        'Content-Type': 'application/json'
      },
      statusCode,
      data: JSON.stringify({
        success: false,
        error: errorMessage
      })
    };
  }
  