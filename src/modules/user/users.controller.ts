import { Response, Request } from "express";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
dotenv.config();

// PROVIDER
import prismaClient from "@database";

// TYPES
import { IUserTypes } from "@interfaces/IUsers";
import { User } from "@prisma/client";

// SERVICE
import usersService from "./users.service";

export default {
  async store(req: Request, res: Response): Promise<Response> {
    const data = req.body;

    try {
      const user = await usersService.store(
        data,
        req?.file?.filename as string
      );

      return res
        .status(200)
        .json({ message: "Usuário criado com sucesso !", user });
    } catch (err) {
      return res.status(500).json({ message: "Erro ao criar o usuário !" });
    }
  },
  async listAndCountAll(req: Request, res: Response) {
    try {
      const users = await usersService.listAndCountAll();

      return res
        .status(200)
        .json({ message: "Usuários listados com sucesso !", users });
    } catch (err) {
      return res.status(500).json({ message: "Erro ao listar os usuários !" });
    }
  },
  async updateById(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const data = req.body;
    try {
      const user = await usersService.updateById(id, data);

      return res
        .status(200)
        .json({ message: "Usuário atualizado com sucesso !", user });
    } catch (err) {
      return res.status(500).json({ message: "Erro ao atualizar o usuário !" });
    }
  },
  async deleteUsers(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    try {
      await usersService.deleteById(id);
      return res
        .status(200)
        .json({ message: "Usuário deletado com sucesso !" });
    } catch (err) {
      return res.status(500).json({ message: "Erro ao deletar o usuário !" });
    }
  },
  async updateForgotPassword(
    id: string,
    data: Pick<User, "password_token_reset" | "password_token_expiry">
  ): Promise<User | null> {
    const user = await prismaClient.user.findUnique({
      where: {
        id,
      },
    });

    await prismaClient.user.update({
      where: {
        id,
      },
      data: data,
    });

    return user;
  },
  async updateUser(id: string, data: User): Promise<User | null> {
    const user = await prismaClient.user.findUnique({
      where: {
        id,
      },
    });

    if (data.password) {
      const saltRounds = 10;
      const salt = bcrypt.genSaltSync(saltRounds);
      const hashedPassword = bcrypt.hashSync(data.password, salt);

      await prismaClient.user.update({
        where: { id },
        data: {
          ...data,
          password: hashedPassword,
        },
      });

      return user;
    }

    await prismaClient.user.update({
      where: { id },
      data: {
        ...data,
      },
    });

    return user;
  },
};
