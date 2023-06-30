import express, { urlencoded, json } from "express";
import cors, { CorsOptions } from "cors";
import * as dotenv from "dotenv";

// ROUTES
import routesProduct from "@modules/products/products.routes";
import routesUser from "@modules/user/users.routes";
import routesAuth from "@modules/auth/auth.routes";
import routesCategories from "@modules/categories/categories.routes";
import routesRelatory from "@modules/relatory/relatory.routes";
import path from "path";

dotenv.config();
const port = process.env.PORT;
const corsOptions: CorsOptions = {
  origin: "http://localhost:5173",
};

const app = express();
app.use(cors(corsOptions));
app.use(json());
app.use(urlencoded({ extended: true }));

// ROUTES
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

app.use("/product", routesProduct);
app.use("/users", routesUser);
app.use("/auth", routesAuth);
app.use("/category", routesCategories);
app.use("/relatory", routesRelatory);

app.listen(port, () =>
  console.log(`Server is running on ${process.env.APP_URL}`)
);
