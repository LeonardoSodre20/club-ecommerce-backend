import express, { urlencoded, json } from "express";
import cors, { CorsOptions } from "cors";
import * as dotenv from "dotenv";
import path from "path";
dotenv.config();

// ROUTES
import routes from "@routes/routes";

const port = process.env.PORT;

const app = express();
app.use(cors());
app.use(json());
app.use(urlencoded({ extended: true }));

// ROUTES

app.use("/", routes);

app.use(
  "/files",
  express.static(path.join(__dirname, "..", "public", "images_categories"))
);
app.use(
  "/filesUser",
  express.static(path.join(__dirname, "..", "public", "avatar"))
);

app.use(
  "/filesProduct",
  express.static(path.join(__dirname, "..", "public", "productsImage"))
);

app.listen(port, () =>
  console.log(`Server is running on ${process.env.APP_URL}`)
);
