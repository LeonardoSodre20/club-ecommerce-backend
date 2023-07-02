import { Response, Request } from "express";

// PROVIDER
import prismaClient from "@database";

// SERVICE
import categoriesService from "./categories.service";

export default {
  async store(req: Request, res: Response): Promise<Response> {
    try {
      const data = req.body;

      const newCategory = await categoriesService.store(
        data,
        req.file?.filename as string
      );

      return res
        .status(200)
        .json({ message: "Categoria criada com sucesso !", newCategory });
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
        include: {
          products: true,
        },
      });

      return res
        .status(200)
        .json({ message: "Categoria listada com sucesso !", category });
    } catch (err) {
      return res.status(500).json({ message: "Erro ao listar a categoria !" });
    }
  },
  async listCategoryByName(req: Request, res: Response): Promise<Response> {
    const { name } = req.params;

    try {
      const category = await prismaClient.category.findUnique({
        where: {
          name,
        },
        include: {
          products: true,
        },
      });

      if (category === null) {
        return res
          .status(424)
          .json({ message: "Não existe uma categoria com este nome !" });
      }

      return res
        .status(200)
        .json({ message: "Categoria filtrada com sucesso !", category });
    } catch (err) {
      return res
        .status(500)
        .json({ message: "Erro ao listar a categoria pelo nome !" });
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
