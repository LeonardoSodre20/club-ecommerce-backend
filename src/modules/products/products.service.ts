import prismaClient from "@database";
import { Product } from "@prisma/client";
import dotenv from "dotenv";
dotenv.config();

import { IDataQrCode } from "@interfaces/IProducts";

// SORT FUNCTIONS
import sortFunctions from "@utils/sortFunctions";
import { QrCodePix } from "qrcode-pix";

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
    const productPromise = prismaClient.product.findMany({
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
    const countPromise = prismaClient.product.count();

    const [rows, count] = await Promise.all([productPromise, countPromise]);

    const sortedRows = sortFunctions.SortByText(rows, (key) => key.name, order);

    return {
      rows: sortedRows,
      count,
    };
  },
  async generateQrcodePix(data: Omit<IDataQrCode, "version">) {
    const qrCode = QrCodePix({
      version: "01",
      key: data.key,
      name: data.name,
      city: data.city,
      value: Number(data.value),
    });

    return {
      qrcode: await qrCode.base64(),
      codePix: qrCode.payload(),
    };
  },
};
