import dotenv from "dotenv";
dotenv.config();

export default async function (api) {
  api.cache(true);
  return {
    presets: ['@babel/preset-env'],
  };
}