import { Options, diskStorage } from "multer";
import { randomBytes } from "crypto";
import { Request } from "express";

const multerConfigUser = {
  storage: diskStorage({
    destination: (req: Request, file, callback) => {
      callback(null, `${__dirname}/../../../public/avatar`);
    },

    filename: (req, file, callback) => {
      randomBytes(16, (err, hash) => {
        if (err) callback(err, file.filename);

        const fileName = `${hash.toString("hex")}-${file.originalname
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")}`;

        callback(null, fileName);
      });
    },
  }),

  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB
  },

  fileFilter: (req: Request, file, callback) => {
    const allowedMimes = ["image/jpeg", "image/jpg", "image/png"];

    if (allowedMimes.includes(file.mimetype)) callback(null, true);
    else callback(new Error("Invalid mime type."));
  },
} as Options;

export default multerConfigUser;
