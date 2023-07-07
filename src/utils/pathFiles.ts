import dotenv from "dotenv";
dotenv.config();

const generatePathImage = (path: string): string => {
  const pathImage = `${process.env.APP_URL}:${process.env.PORT}/${path}`;

  return pathImage;
};

export default generatePathImage;
