import prismaClient from "@database";
import { Product } from "@prisma/client";
import dotenv from "dotenv";
dotenv.config();

// SORT FUNCTIONS
import sortFunctions from "@utils/sortFunctions";

const PATH_IMAGE = `${process.env.APP_URL}:${process.env.PORT}/filesProduct`;

export default {
  async store(
    path: string,
    data: Pick<
      Product,
      "name" | "quantity" | "status" | "price" | "image" | "categoryName"
    >
  ): Promise<Product | null> {
    const product = await prismaClient.product.create({
      data: {
        ...data,
        image: `${PATH_IMAGE}/${path}`,
      },
    });

    return product;
  },
  async listAndCount(
    page: number,
    limit: number,
    query: string,
    order: "asc" | "desc"
  ) {
    const productPromise = await prismaClient.product.findMany({
      skip: page * limit,
      take: limit,
      where: {
        name: {
          contains: query,
        },
      },
      orderBy: {
        id: "desc",
      },
    });
    const countPromise = await prismaClient.product.count();

    const [rows, count] = await Promise.all([productPromise, countPromise]);

    const sortedRows = sortFunctions.SortByText(rows, (key) => key.name, order);

    return {
      rows: sortedRows,
      count,
    };
  },
};
