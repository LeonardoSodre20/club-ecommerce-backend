import { Response, Request, NextFunction } from "express";
import { verify } from "jsonwebtoken";

const secret_key = process.env.SECRET_KEY as string;

export async function ensureAutheticated(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authToken = req.headers.authorization; // RECUPERAÇÂO DO TOKEN

  if (!authToken) {
    return res.status(401).json({ message: "Sem autorização !" });
  }
  // BEARER 123912831283128312
  const [, token] = authToken.split(" ");

  try {
    verify(token, secret_key);
    return next();
  } catch (err: any) {
    return res.status(401).json({ message: "Token Inválido !" });
  }
}
