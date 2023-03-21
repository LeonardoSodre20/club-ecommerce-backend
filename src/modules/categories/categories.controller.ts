import { Response, Request } from "express";

import prismaClient from "../../database";

// TYPES
import { ICategoryTypes } from "../../interfaces/ICategory";

export default {
  async createCategory(req: Request, res: Response): Promise<Response> {
    const { name }: ICategoryTypes = req.body;

    const newCategory = {
      name,
    };

    try {
      const category = await prismaClient.category.create({
        data: newCategory,
      });

      return res
        .status(200)
        .json({ message: "Categoria criada com sucesso !", category });
    } catch (err) {
      return res.status(500).json({ message: "Erro ao criar a categoria !" });
    }
  },
  async listAllCategories(req: Request, res: Response): Promise<Response> {
    try {
      const allCategories = await prismaClient.category.findMany({
        include: {
          products: true,
        },
      });

      return res
        .status(200)
        .json({ message: "Categorias listadas com sucesso !", allCategories });
    } catch (err) {
      return res
        .status(500)
        .json({ message: "Erro ao listar as categorias !" });
    }
  },

  async listCategoryByID(req: Request, res: Response): Promise<Response> {
    const { id } = req.params; // TIPO PROVISÓRIO

    try {
      const category = await prismaClient.category.findUnique({
        where: {
          id: id,
        },
      });

      return res
        .status(200)
        .json({ message: "Categoria listada com sucesso !", category });
    } catch (err) {
      return res.status(500).json({ message: "Erro ao listar a categoria !" });
    }
  },
  async deleteCategoryByID(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;

    try {
      const category = await prismaClient.category.delete({
        where: {
          id: id,
        },
      });

      return res
        .status(200)
        .json({ message: "Categoria deletada com sucesso !", category });
    } catch (err) {
      return res.status(500).json({ message: "Erro ao deletar a categoria !" });
    }
  },
};
