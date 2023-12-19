import { PrismaClient } from '@prisma/client'
import { User } from './user.models';

export default function makeUserList() {
    const prisma = new PrismaClient()
    return ({
        getUserByEmail,
        createUser,
    });

    async function createUser(user: User) {
        const newUser = await prisma.users.create({
            data: {
                email: user.email,
                password: user.password,
                saltRounds:user.saltRounds
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