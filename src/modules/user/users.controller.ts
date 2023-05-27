import { Response, Request } from "express";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
dotenv.config();

// PROVIDER
import prismaClient from "@database";

// TYPES
import { IUserTypes } from "@interfaces/IUsers";
import { User } from "@prisma/client";

export default {
  async createUser(req: Request, res: Response): Promise<Response> {
    const { name, lastname, email, password }: IUserTypes = req.body;

    // CRIPTO PASS
    const saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds);
    const cryptographedPassword = bcrypt.hashSync(password, salt);

    // VERIFY USER EXIST
    const userAlredyExist = await prismaClient.user.findUnique({
      where: {
        email,
      },
    });

    if (userAlredyExist) {
      return res.status(422).json({ message: "Este e-mail já está em uso !" });
    }

    const newUser = {
      name,
      lastname,
      email,
      password: cryptographedPassword,
    };

    try {
      const user = await prismaClient.user.create({
        data: newUser,
      });

      return res
        .status(200)
        .json({ message: "Usuário criado com sucesso !", user });
    } catch (err) {
      return res.status(500).json({ message: "Erro ao criar o usuário !" });
    }
  },
  async listAndCountAllUsers(req: Request, res: Response): Promise<Response> {
    try {
      const users = await prismaClient.user.findMany();
      const quantity = await prismaClient.user.count();

      return res
        .status(200)
        .json({ message: "Usuários listados com sucesso !", users, quantity });
    } catch (err) {
      return res.status(500).json({ message: "Erro ao listar os usuários !" });
    }
  },
  async updateUsers(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const { name, lastname, email }: IUserTypes = req.body;
    const avatar = req.file?.filename as string;

    const updateUser = {
      name,
      lastname,
      email,
      avatar: `${process.env.APP_URL}:${process.env.PORT}/filesUser/${avatar}`,
    };

    try {
      const user = await prismaClient.user.update({
        where: {
          id: String(id),
        },
        data: updateUser,
      });

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
      await prismaClient.user.delete({
        where: {
          id: String(id),
        },
      });

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
