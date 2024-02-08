export interface Organization{
    id?: string;
    name:string;
    shortName:string;
    isActive:boolean;
};

export interface OrganizationDto{
    id?: string;
    name:string;    
    shortName:string;
    isActive:boolean;
};

export interface Member{
    id?:string;
    name:string;
    email:string;
    organizationId:string;
};

export interface MemberDto{
    id?:string;
    name:string;
    email:string;
    organizationId:string;
};

export interface OrganizationWithMembers extends Organization{
    members:Member[];
};

