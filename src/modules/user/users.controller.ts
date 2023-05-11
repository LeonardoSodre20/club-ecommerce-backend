import { platform } from "process";
import { unlink } from "fs";
import { Response, Request } from "express";
import bcrypt from "bcrypt";

// PROVIDER
import prismaClient from "@database";

// TYPES
import { IUserTypes } from "@interfaces/IUsers";
import { User } from "@prisma/client";

const updateImage = async (avatar: string, id: string) => {
  let newAvatar = avatar;

  if (platform === "win32") newAvatar = avatar.split("\\")[3];
  else if (platform === "linux") newAvatar = avatar.split("/")[3];

  const newData = {
    avatar: `${process.env.APP_URL}/avatars/${newAvatar}`,
  };

  const updatedUser = await prismaClient.user.update({
    where: { id },
    data: newData,
  });

  return updatedUser;
};

const updateAvatarConfig = async (
  id: string,
  avatar: User["avatar"]
): Promise<User | null> => {
  const user = await prismaClient.user.findUnique({
    where: {
      id,
    },
  });
  const oldAvatarPath = user?.avatar?.split("/avatars/")[1];

  unlink(`../../tmp/avatars/${oldAvatarPath}`, (e) => {
    if (e) console.log(e);
  });

  const updatedUser = updateImage(String(avatar), id);

  return updatedUser;
};

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

    const updateUser = {
      name,
      lastname,
      email,
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
  async updateAvatar(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const avatar = req.file?.path;

      let user;

      user = await updateAvatarConfig(id, String(avatar));

      if (user === null) return res.status(204).json();

      if (avatar) user = await updateAvatarConfig(id, avatar);

      return res.status(200).json({
        message: "Avatar atualizado.",
        user,
      });
    } catch (e) {
      console.log(e);

      return res.status(500).json({ message: "Erro ao atualizar avatar." });
    }
  },
};
