export interface User {
    id?: string;
    email: string;
    password: string;
    saltRounds: number;
    role: Role;
}

export interface UserDto{
    id: string;
    role: Role;
    email: string;
}

export enum Role {
    ADMIN= 'ADMIN',
    ELECTOR= 'ELECTOR',
    ELECTION_CREATOR='ELECTION_CREATOR'
}