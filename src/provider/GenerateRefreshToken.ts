import prismaClient from "@database";
import dayjs from "dayjs";

async function GenerateRefreshToken(userId: string) {
  const expiryIn = dayjs().add(15, "second").unix();

  const generateRefreshToken = await prismaClient.refreshToken.create({
    data: {
      userId,
      expiryIn,
    },
  });

  return generateRefreshToken;
}

export default GenerateRefreshToken;
