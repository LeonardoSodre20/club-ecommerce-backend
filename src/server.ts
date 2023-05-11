import express, { urlencoded, json } from "express";
import cors from "cors";
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

const app = express();
app.use(cors());
app.use(json());
app.use(urlencoded({ extended: true }));

// ROUTES
app.use(
  "/files",
  express.static(path.join(__dirname, "..", "public", "images_categories"))
);
app.use("/product", routesProduct);
app.use("/users", routesUser);
app.use("/auth", routesAuth);
app.use("/category", routesCategories);
app.use("/relatory", routesRelatory);

app.listen(port, () =>
  console.log(`Server is running on ${process.env.APP_URL}`)
);
