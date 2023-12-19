export interface User {
    id?: string;
    email: string;
    password: string;
    saltRounds: number;
}

export interface UserDto{
    id: string;
    email: string;
}