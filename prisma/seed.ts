import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prismaClient = new PrismaClient();

async function main() {
  const admin = await prismaClient.user.create({
    data: {
      name: "Leonardo",
      lastname: "Sodré",
      role: "Admin",
      email: "LeonardoSodre25@outlook.com",
      password: await bcrypt.hash("019435398lvs@", 10),
    },
  });

  return admin;
}

main()
  .then(async () => {
    await prismaClient.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prismaClient.$disconnect();
    process.exit(1);
  });
