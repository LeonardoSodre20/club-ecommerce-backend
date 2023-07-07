import { Request, Response } from "express";
import jwt, { Secret, verify } from "jsonwebtoken";
import bcrypt from "bcrypt";
import crypto from "crypto";
import * as dotenv from "dotenv";
dotenv.config();

// PROVIDDER
import prismaClient from "@database";

// CONFIGS
import { sendEmail } from "@helpers/mail.controller";
import authConfig from "@config/auth.config";

// TYPES
import { ILoginTypes } from "@interfaces/IAuth";
import usersController from "@modules/user/users.controller";
import dayjs from "dayjs";

export default {
  async login(req: Request, res: Response): Promise<Response> {
    const { email, password }: ILoginTypes = req.body;

    const checkUserExist = await prismaClient.user.findUnique({
      where: {
        email,
      },
    });

    if (checkUserExist?.status === "Inativo") {
      return res.status(401).json({ message: "Usuário Desabilitado !" });
    }

    const checkPass = await bcrypt.compare(
      password,
      String(checkUserExist?.password)
    );

    if (!checkUserExist) {
      return res.status(422).json({ message: "Credenciais Inválidas !" });
    }

    if (!checkPass) {
      return res.status(422).json({ message: "Credenciais Inválidas !" });
    }

    if (checkUserExist?.role !== "Admin") {
      return res.status(422).json({ message: "Credenciais Inválidas !" });
    }

    const { secret_token, expires_in_token } = authConfig;

    try {
      const token = jwt.sign({ id: checkUserExist.id }, secret_token, {
        expiresIn: expires_in_token,
      });

      return res.status(200).json({
        message: "Autenticação realizada com sucesso !",
        checkUserExist,
        token,
      });
    } catch (err) {
      console.log(err);
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

      if (user === null) {
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
          message: "E-mail de recuperação de senha enviado com sucesso !",
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

  async validateToken(req: Request, res: Response): Promise<Response> {
    const { email, token } = req.body;

    try {
      const user = await prismaClient.user.findUnique({
        where: {
          email,
        },
      });

      if (token != user?.password_token_reset) {
        return res.status(400).json({ message: "Token Inválido !" });
      }

      const now = new Date();

      if (user?.password_token_expiry) {
        if (now > user?.password_token_expiry) {
          return res
            .status(400)
            .json({ message: "Token Expirado . Tente gerar outro !" });
        }
      }

      return res.status(200).json({ message: "Token enviado com sucesso !" });
    } catch (err) {
      return res.status(500).json({
        message: "Erro ao encaminhar o token de recuperação de senha !",
      });
    }
  },

  async resetPassword(req: Request, res: Response): Promise<Response> {
    const { email, password } = req.body;

    try {
      const user = await prismaClient.user.findUnique({
        where: {
          email,
        },
      });

      if (user?.id) {
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
