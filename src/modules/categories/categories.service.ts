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
  async listAll(): Promise<Category[]> {
    const allCategories = await prismaClient.category.findMany({
      include: {
        products: true,
      },
    });

    return allCategories;
  },
  async listById(id: Category["id"]) {
    const category = await prismaClient.category.findUnique({
      where: { id },
      include: { products: true },
    });

    return category;
  },
  async listByName(name: Category["name"]) {
    const category = await prismaClient.category.findUnique({
      where: { name },
      include: { products: true },
    });

    return category;
  },
  async deleteById(id: Category["id"]) {
    const category = await prismaClient.category.delete({
      where: { id },
    });

    return category;
  },
};
