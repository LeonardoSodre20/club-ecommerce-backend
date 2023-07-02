import prismaClient from "@database";
import * as dotenv from "dotenv";
dotenv.config();

// TYPES
import { Category } from "@prisma/client";

export default {
  async store(
    data: Pick<Category, "name" | "image">,
    path: string
  ): Promise<Category> {
    const category = await prismaClient.category.create({
      data: {
        ...data,
        image: `${process.env.APP_URL}:${process.env.PORT}/files/${path}`,
      },
    });

    return category;
  },
};
