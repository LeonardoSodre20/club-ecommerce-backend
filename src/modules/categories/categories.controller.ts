import { Response, Request } from "express";

// PROVIDER
import prismaClient from "@database";

// SERVICE
import categoriesService from "./categories.service";

export default {
  async store(req: Request, res: Response) {
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
  async listAll(req: Request, res: Response) {
    try {
      const allCategories = await categoriesService.listAll();

      return res
        .status(200)
        .json({ message: "Categorias listadas com sucesso !", allCategories });
    } catch (err) {
      return res
        .status(500)
        .json({ message: "Erro ao listar as categorias !" });
    }
  },
  async listById(req: Request, res: Response) {
    const { id } = req.params;

    try {
      const category = await categoriesService.listById(id);

      return res
        .status(200)
        .json({ message: "Categoria listada com sucesso !", category });
    } catch (err) {
      return res.status(500).json({ message: "Erro ao listar a categoria !" });
    }
  },
  async listByName(req: Request, res: Response) {
    const { name } = req.params;

    try {
      const category = await categoriesService.listByName(name);

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
  async deleteById(req: Request, res: Response) {
    const { id } = req.params;

    try {
      const category = await categoriesService.deleteById(id);

      return res
        .status(200)
        .json({ message: "Categoria deletada com sucesso !", category });
    } catch (err) {
      return res.status(500).json({ message: "Erro ao deletar a categoria !" });
    }
  },
};
