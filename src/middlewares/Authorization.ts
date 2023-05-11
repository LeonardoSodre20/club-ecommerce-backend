import { Response, Request, NextFunction } from "express";
import { Secret, verify } from "jsonwebtoken";
import * as dotenv from "dotenv";

dotenv.config();

const secretKey: Secret = process.env.SECRET_KEY as string;

export function ensureAuthenticated(
  req: Request,
  res: Response,
  next: NextFunction
) {
  // recuperação do token de autenticação
  const authToken = req.headers.authorization;

  if (!authToken) {
    return res.status(401).json({ message: "Sem permissão. Token inválido !" });
  }

  // Bearer dasdas7d8a87sd7a8sdas
  const [, token] = authToken.split(" ");

  try {
    verify(token, secretKey);
    return next();
  } catch (err: any) {
    return res.status(401).json({ message: "Token inválido !" });
  }
}
