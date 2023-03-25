import { Request, Response } from "express";
import jwt, { Secret } from "jsonwebtoken";
import bcrypt from "bcrypt";
import crypto from "crypto";
import * as dotenv from "dotenv";
dotenv.config();

// PROVIDDER
import prismaClient from "@database";

// CONFIG MAIL
import { sendEmail } from "@helpers/mail.controller";

const secret_key: Secret = process.env.SECRET_KEY as string;

// TYPES
import { ILoginTypes } from "@interfaces/IAuth";
import usersController from "@modules/user/users.controller";

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

  async forgotPassword(req: Request, res: Response): Promise<Response> {
    const { email } = req.body;

    try {
      const user = await prismaClient.user.findUnique({
        where: {
          email,
        },
      });

      if (user == null) {
        return res.status(204).json({ message: "E-mail não encontrado !" });
      }

      if (user) {
        const passwordCodeReset = crypto
          .randomBytes(4)
          .toString("hex")
          .toUpperCase();

        const now = new Date();

        now.setHours(now.getHours() + 1);

        await usersController.updateForgotPassword(user.id, {
          password_token_reset: passwordCodeReset,
          password_token_expiry: now,
        });

        sendEmail({
          to: email,
          subject: "Recuperação de senha Ecommerce",
          message: `Olá , ${user.name} , seu código de recuperação de senha : ${passwordCodeReset}`,
        });

        return res.status(200).json({
          message: "Token de recuperação de senha enviado com sucesso !",
        });
      }

      return res.status(204).json({ message: "Usuário não encontrado !" });
    } catch (err) {
      console.log(err);
      return res
        .status(500)
        .json({ message: "Erro ao enviar o e-mail de recuperação de senha !" });
    }
  },

  async resetPassword(req: Request, res: Response): Promise<Response> {
    const { email, token, password } = req.body;

    try {
      const user = await prismaClient.user.findUnique({
        where: {
          email,
        },
      });

      const now = new Date();

      if (user?.id && user?.password_token_expiry) {
        if (now > user.password_token_expiry)
          return res
            .status(400)
            .json({ message: "Token expirado. Gere um novo" });

        await usersController.updateUser(user?.id, {
          ...user,
          password,
        });
      }

      return res
        .status(200)
        .json({ message: "Nova senha cadastrada com sucesso." });
    } catch (err) {
      console.log(err);
      return res
        .status(500)
        .json({ message: "Erro no encaminhamento do token !" });
    }
  },
};
