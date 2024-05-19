import { createError} from "../utils/error.js";
import jwt from "jsonwebtoken"


// Middleware para verificar si el token está en la lista negra
export const verifyToken = (req, res, next) => {
  try {
      // Obtener el token del encabezado de la solicitud o de las cookies
      const token = req.headers.authorization?.split(" ")[1] || req.cookies.token;

      // Verificar si el token está en la lista negra
      if (blacklist.includes(token)) {
          // Si el token está en la lista negra, considerar al usuario como no autenticado
          return res.status(401).json({ message: "Unauthorized" });
      }

      // Si el token no está en la lista negra, continuar con la siguiente middleware
      next();
  } catch (err) {
      // Manejar errores
      console.error("Error verifying token:", err);
      res.status(500).json({ error: "Internal Server Error" });
  }
}


export const verifyUser = (req, res, next) => {
    verifyToken(req, res, next, () => {
      if (req.user.id === req.params.id || req.user.isAdmin) {
        next();
      } else {
        return next(createError(403, "You are not authorized!"));
      }
    });
  };
  
  export const verifyAdmin = (req, res, next) => {
    verifyToken(req, res, next, () => {
      if (req.user.isAdmin) {
        next();
      } else {
        return next(createError(403, "You are not authorized!"));
      }
    });
  };