import prismaClient from "@database";
import dotenv from "dotenv";
import fs from "fs/promises";
import path from "path";
dotenv.config();

// TYPES
import { Response, Request } from "express";
import { IProductsTypes } from "@interfaces/IProducts";

// SERVICE
import productsService from "./products.service";

export default {
  async store(req: Request, res: Response): Promise<Response> {
    const data = req.body;
    const image = req.file?.filename as string;

    try {
      const product = await productsService.store(image, data);

      return res
        .status(200)
        .json({ message: "Produto criado com sucesso !", product });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: "Erro ao criar o produto" });
    }
  },
  async listAndCount(req: Request, res: Response): Promise<Response> {
    try {
      const { pages, limit, search, order = "desc" } = req.query;

      const products = await productsService.listAndCount(
        Number(pages),
        Number(limit),
        String(search),
        order as "asc" | "desc"
      );

      return res.status(200).json({
        message: "Produtos listados com sucesso !",
        products,
      });
    } catch (err) {
      return res.status(500).json({ message: "Erro ao listar os produtos" });
    }
  },
  async listProductById(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;

    try {
      const product = await prismaClient.product.findUnique({
        where: {
          id: id,
        },
      });

      return res
        .status(200)
        .json({ message: "Produto listado com sucesso ! ", product });
    } catch (err) {
      return res.status(500).json({ message: "Erro ao listar o produto !" });
    }
  },
  async updateProduct(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const { name, quantity, status, price }: IProductsTypes = req.body;

    const productUpdated = {
      name,
      quantity,
      status,
      price,
    };

    try {
      const newProduct = await prismaClient.product.update({
        where: {
          id: String(id),
        },
        data: productUpdated,
      });

      return res
        .status(200)
        .json({ message: "Produto atualizado com sucesso !", newProduct });
    } catch (err) {
      return res.status(500).json({ message: "Erro ao atualizar o produto !" });
    }
  },
  async deleteProduct(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;

    try {
      const product = await prismaClient.product.findUnique({
        where: {
          id,
        },
      });
      await prismaClient.product.delete({
        where: {
          id: String(id),
        },
      });

      const pathImageProduct = path.resolve(
        __dirname,
        `../../../public/productsImage/${product?.image.split("/")[4]}`
      );

      await fs.unlink(pathImageProduct);

      return res
        .status(200)
        .json({ message: "Produto deletado com sucesso !" });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: "Erro ao deletar o produto !" });
    }
  },
};
