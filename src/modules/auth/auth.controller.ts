import { Request, Response } from "express";
import prismaClient from "../../database";
import * as dotenv from "dotenv";
import jwt, { Secret } from "jsonwebtoken";
import bcrypt from "bcrypt";

dotenv.config();

const secret_key: Secret = process.env.SECRET_KEY as string;

// TYPES
import { ILoginTypes } from "../../interfaces/IAuth";

export default {
  async login(req: Request, res: Response): Promise<Response> {
    const { email, password }: ILoginTypes = req.body;

    const checkUserExist = await prismaClient.user.findUnique({
      where: {
        email,
      },
    });

    const checkPass = await bcrypt.compare(
      password,
      String(checkUserExist?.password)
    );

    if (!checkUserExist) {
      return res.status(422).json({ message: "Usuário não encontrado !" });
    }

    if (!checkPass) {
      return res.status(422).json({ message: "Senha inválida !" });
    }

    try {
      const token = jwt.sign({ id: checkUserExist.id }, secret_key, {
        expiresIn: "2 days",
      });

      return res.status(200).json({
        message: "Autenticação realizada com sucesso !",
        checkUserExist,
        token,
      });
    } catch (err) {
      return res.status(500).json({ message: "Erro ao se autenticar !" });
    }
  },
};
