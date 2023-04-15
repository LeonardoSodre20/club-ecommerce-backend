import { Request, Response } from "express";
import bcrypt from "bcrypt";
import crypto from "crypto";
import * as dotenv from "dotenv";
dotenv.config();

// PROVIDDER
import prismaClient from "@database";
import GenerateRefreshToken from "@provider/GenerateRefreshToken";
import GenerateTokenProvider from "@provider/GenerateTokenProvider";

// CONFIG MAIL
import { sendEmail } from "@helpers/mail.controller";

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
      return res.status(422).json({ message: "Credenciais inválidas!" });
    }

    try {
      const token = await GenerateTokenProvider(checkUserExist?.id);
      const refreshToken = await GenerateRefreshToken(checkUserExist?.id);

      return res.status(200).json({
        message: "Autenticação realizada com sucesso !",
        checkUserExist,
        token,
        refreshToken,
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
        .json({ message: "Erro ao cadastrar uma nova senha!" });
    }
  },

  async refreshTokenUser(refresh_token: string) {
    const refreshToken = await prismaClient.refreshToken.findFirst({
      where: {
        id: refresh_token,
      },
    });

    if (!refreshToken) {
      throw new Error("Refresh Token Inválido !");
    }

    const token = GenerateTokenProvider(refreshToken.userId);

    return { token };
  },
};
