import { HttpResponse } from "./httpResponse.models";

export default function makeHttpResponse({ statusCode, data }: { statusCode: number, data: any }):HttpResponse {
    return {
      headers: {
        'Content-Type': 'application/json'
      },
      statusCode,
      data: JSON.stringify(data)
    };
  }
  