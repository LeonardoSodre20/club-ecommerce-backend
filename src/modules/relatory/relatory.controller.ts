import prismaClient from "@database";
import { Request, Response } from "express";
import PdfPrinter from "pdfmake";
import fs from "fs";

// PDF CONFIG
import { fonts } from "@pdfConfig/configs";
import { TDocumentDefinitions } from "pdfmake/interfaces";

// SERVICE
import relatoryService from "./relatory.service";

export default {
  async getRelatoryInformations(
    req: Request,
    res: Response
  ): Promise<Response> {
    try {
      const total = await prismaClient.product.count();
      const productsAvailable = await prismaClient.product.count({
        where: {
          status: "Disponível",
        },
      });
      const productsUnavailable = await prismaClient.product.count({
        where: {
          status: "Indisponível",
        },
      });

      const usersActive = await prismaClient.user.count({
        where: {
          status: "Ativo",
        },
      });

      // PDF CONFIGURATION

      // const pdfGenerate = new PdfPrinter(fonts);

      // const docDefinitions: TDocumentDefinitions = {
      //   pageOrientation: "portrait",
      //   pageMargins: [40, 60, 40, 60],
      //   pageSize: "A4",
      //   defaultStyle: {
      //     font: "Courier",
      //   },

      //   header: {
      //     text: "RELATÒRIO DE DADOS MENSAL",
      //     style: {
      //       background: "#f10000",
      //     },
      //   },

      //   content: [
      //     {
      //       text: `TOTAL DE PRODUTOS : ${total}`,
      //       fontSize: 15,
      //       style: "header",
      //       alignment: "center",
      //     },
      //   ],
      // };
      // const hash = Math.floor(Math.random() * 1000000);

      // const pdfDoc = pdfGenerate.createPdfKitDocument(docDefinitions);
      // pdfDoc.pipe(
      //   fs.createWriteStream(`public/relatorys/relatory_(${String(hash)}).pdf`)
      // );
      // pdfDoc.end();

      return res.status(200).json({
        total,
        productsAvailable,
        productsUnavailable,
        usersActive,
      });
    } catch (err: any) {
      console.log(err);
      return res
        .status(500)
        .json({ message: "Erro ao listar as informações do relatório !" });
    }
  },
  async findAndAddByCategory(req: Request, res: Response) {
    try {
      const rows = await relatoryService.findAndAddByCategory();

      return res.status(200).json({ rows });
    } catch (err: any) {
      return res.status(500).json({ message: "Erro ao listar os produtos !" });
    }
  },
};
