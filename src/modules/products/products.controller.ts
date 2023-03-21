import prismaClient from "../../database";

// TYPES
import { Response, Request } from "express";
import { IProductsTypes } from "../../interfaces/IProducts";

export default {
  async createProduct(req: Request, res: Response): Promise<Response> {
    const { name, quantity, status, price, categoryName }: IProductsTypes =
      req.body;

    const newProduct = {
      name,
      quantity,
      status,
      price,
      categoryName,
    };

    try {
      const product = await prismaClient.product.create({
        data: newProduct,
      });

      return res
        .status(200)
        .json({ message: "Produto criado com sucesso !", product });
    } catch (err) {
      return res.status(500).json({ message: "Erro ao criar o produto" });
    }
  },
  async listProducts(req: Request, res: Response): Promise<Response> {
    const { pages, limit, search } = req.query;
    try {
      const products = await prismaClient.product.findMany({
        skip: Number(pages) * Number(limit),
        where: {
          name: {
            contains: String(search),
          },
        },
        orderBy: {
          id: "asc",
        },
      });
      const quantity = await prismaClient.product.count();

      return res.status(200).json({
        message: "Produtos listados com sucesso !",
        products,
        quantity,
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
    const { name, quantity, status, price, categoryName }: IProductsTypes =
      req.body;

    const productUpdated = {
      name,
      quantity,
      status,
      price,
      categoryName,
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
      await prismaClient.product.delete({
        where: {
          id: String(id),
        },
      });

      return res
        .status(200)
        .json({ message: "Produto deletado com sucesso !" });
    } catch (err) {
      return res.status(500).json({ message: "Erro ao deletar o produto !" });
    }
  },
};
