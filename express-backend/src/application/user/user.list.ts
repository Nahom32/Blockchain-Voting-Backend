import { prisma } from "@shared/prisma";
import { User } from './user.models';

export default function makeUserList() {
    return ({
        getUserByEmail,
        createUser,
    });

    async function createUser(user: User) {
        const newUser = await prisma.users.create({
            data: {
                email: user.email,
                password: user.password,
                saltRounds:user.saltRounds,
                role: user.role,
            },
        });
        return newUser
    }

    async function getUserByEmail(email: string) {
        const userFound = await prisma.users.findFirst({
            where: {
                email: email
            },
        });
        return userFound
    }
}