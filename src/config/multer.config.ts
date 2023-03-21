import multer from "multer";
import * as dotenv from "dotenv";

dotenv.config();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(
      null,
      process.env.ENVIRONMENT === ("DEV" as string)
        ? `${__dirname}/uploads`
        : ""
    );
  },
});

const uploads = multer({ storage: storage });

export default uploads;
