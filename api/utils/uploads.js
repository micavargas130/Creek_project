import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const PERSISTENT_DIR = "/data/uploads"; //Render Disk para imgs
const LOCAL_DIR = path.resolve(__dirname, "../public/uploads"); //path local para imgs

//si no existe el Render Disk se guarda en local
export const UPLOADS_DIR = fs.existsSync("/data") ? PERSISTENT_DIR : LOCAL_DIR;

//crear la carpeta si no existe (multer no la crea cuando destination es una funcion)
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  console.log("Carpeta creada:", UPLOADS_DIR);
}
