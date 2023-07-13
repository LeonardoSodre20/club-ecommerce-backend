import * as dotenv from "dotenv";
import { Secret } from "jsonwebtoken";
dotenv.config();

export default {
  secret_token: process.env.SECRET_KEY as Secret,
  expires_in_token: "30s",
};
