// CLIENTS
import { User } from "@prisma/client";
import prismaClient from "@database";

import bcrypt from "bcrypt";
import generatePathImage from "@utils/pathFiles";

const generateHashPassword = (passwod: string) => {
  const saltRounds = 10;
  const salt = bcrypt.genSaltSync(saltRounds);
  const hashedPass = bcrypt.hashSync(passwod, salt);

  return hashedPass;
};

export default {
  async store(
    data: Pick<User, "name" | "lastname" | "email" | "password" | "avatar">,
    filename: string
  ): Promise<User | null> {
    const newUser = await prismaClient.user.create({
      data: {
        ...data,
        password: generateHashPassword(data.password),
        avatar: generatePathImage(`/filesUser/${filename}`),
      },
    });

    return newUser;
  },
  async listAndCountAll() {
    const rowsPromise = prismaClient.user.findMany({
      where: {
        role: "User",
      },
    });
    const countPromise = prismaClient.user.count();

    const [rows, count] = await Promise.all([rowsPromise, countPromise]);

    return {
      rows,
      count,
    };
  },
  async updateById(
    id: User["id"],
    data: Pick<User, "name" | "lastname" | "email">
  ) {
    const userUpdate = await prismaClient.user.update({
      where: { id },
      data: {
        ...data,
      },
    });

    return userUpdate;
  },
  async deleteById(id: User["id"]) {
    const user = await prismaClient.user.delete({
      where: {
        id,
      },
    });

    return user;
  },
  async updateDataResetPassword(
    id: User["id"],
    data: Pick<User, "password_token_reset" | "password_token_expiry">
  ): Promise<User | null> {
    const user = await prismaClient.user.findUnique({
      where: { id },
    });

    await prismaClient.user.update({
      where: { id },
      data: data,
    });

    return user;
  },
  async updatePassword(
    id: string,
    data: Pick<User, "password">
  ): Promise<User | null> {
    const user = await prismaClient.user.findUnique({
      where: { id },
    });

    if (data.password) {
      const hashedPass = generateHashPassword(data.password);

      await prismaClient.user.update({
        where: { id },
        data: {
          password: hashedPass,
        },
      });
    }
    return user;
  },
};
