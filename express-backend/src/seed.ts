import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export async function hashPassword(password:string, saltRounds:number){
  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
  } catch (error) {
    throw error;
  }
}

async function main() {
  const adminUser = {
    id: "7d6b855d-5f5d-4e59-b83e-322c08360007",
    email: "admin@example.com",
    password: await hashPassword("Admin@1234", 10),
    isEmailVerified: true,
    role: Role.ADMIN,
    saltRounds: 10,
  };

  // Create the admin user in the database
  await prisma.users.upsert({
    where: { id: adminUser.id },
    update: {},
    create: {
      id: adminUser.id,
      email: adminUser.email,
      password: adminUser.password,
      isEmailVerified: adminUser.isEmailVerified,
      role: adminUser.role,
      saltRounds: adminUser.saltRounds,
    },
  });

  console.log("Admin user seeded successfully");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
