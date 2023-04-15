import jwt, { Secret } from "jsonwebtoken";

const secret_key: Secret = process.env.SECRET_KEY as string;

async function GenerateTokenProvider(userId: string) {
  const token = jwt.sign({ id: userId }, secret_key, {
    expiresIn: "40s",
  });

  return token;
}

export default GenerateTokenProvider;
