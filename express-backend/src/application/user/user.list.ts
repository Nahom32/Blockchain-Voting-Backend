import { prisma } from "@shared/prisma";
import { User } from "./user.models";

export async function createUser(user: User) {
  const newUser = await prisma.users.create({
    data: {
      email: user.email,
      password: user.password,
      saltRounds: user.saltRounds,
      role: user.role,
    },
  });
  return newUser;
}

export async function getUserByEmail(email: string) {
  const userFound = await prisma.users.findFirst({
    where: {
      email: email,
    },
  });
  return userFound;
}

export async function verifyUserEmail(userId: string) {
  await prisma.users.update({
    where: {
      id: userId,
    },
    data: {
      isEmailVerified: true,
    },
  });
}

export async function getUsers(): Promise<User[]> {
  const users = await prisma.users.findMany();
  return users as User[];
}

export async function getUserById(userId: string) {
  const userFound = await prisma.users.findFirst({
    where: {
      id: userId,
    },
  });
  return userFound;
}

export async function updateUserPassword(userId: string, password: string) {
  await prisma.users.update({
    where: {
      id: userId,
    },
    data: {
      password: password,
    },
  });
}
