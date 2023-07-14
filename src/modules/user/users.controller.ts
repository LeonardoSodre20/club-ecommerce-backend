import { Response, Request } from "express";
import dotenv from "dotenv";
dotenv.config();

// SERVICE
import usersService from "./users.service";

export default {
  async store(req: Request, res: Response): Promise<Response> {
    const data = req.body;

    try {
      const user = await usersService.store(
        data,
        req?.file?.filename as string
      );

      return res
        .status(200)
        .json({ message: "Usuário criado com sucesso !", user });
    } catch (err) {
      return res.status(500).json({ message: "Erro ao criar o usuário !" });
    }
  },
  async listAndCountAll(req: Request, res: Response) {
    try {
      const users = await usersService.listAndCountAll();

      return res
        .status(200)
        .json({ message: "Usuários listados com sucesso !", users });
    } catch (err) {
      return res.status(500).json({ message: "Erro ao listar os usuários !" });
    }
  },
  async updateById(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const data = req.body;
    try {
      const user = await usersService.updateById(id, data);

      return res
        .status(200)
        .json({ message: "Usuário atualizado com sucesso !", user });
    } catch (err) {
      return res.status(500).json({ message: "Erro ao atualizar o usuário !" });
    }
  },
  async deleteUsers(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    try {
      await usersService.deleteById(id);
      return res
        .status(200)
        .json({ message: "Usuário deletado com sucesso !" });
    } catch (err) {
      return res.status(500).json({ message: "Erro ao deletar o usuário !" });
    }
  },
};
