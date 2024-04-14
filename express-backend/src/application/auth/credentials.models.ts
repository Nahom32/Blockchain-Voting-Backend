import { OrganizationDto } from "@application/oraganizatins/organization.models";

export interface Credentials {
    email: string;
    password: string;
}

export interface LoginAccessData{
    accessToken:string
    refreshToken:string
    user:UserDto
}

export interface UserDto {
    id: string;
    email: string;
    isEmailVerified: boolean;
    role: string;
    memberOf: OrganizationDto[];
    ownerOf: OrganizationDto[];
}