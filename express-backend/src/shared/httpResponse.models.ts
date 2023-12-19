export interface HttpResponse {
    headers: {
        'Content-Type': string
    },
    statusCode: number,
    data: string
}