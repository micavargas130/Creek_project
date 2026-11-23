import { createError} from "../utils/error.js";
import jwt from "jsonwebtoken"

//el token puede venir en el header Authorization (Bearer) o en la cookie "token"
const getToken = (req) => {
    const header = req.headers.authorization;
    if (header && header.startsWith("Bearer ")) return header.slice(7);
    return req.cookies?.token;
};

export const verifyToken = (req, res, next) => {
    const token = getToken(req);

    if(!token) return next(createError(401, "You are not authenticated!"));

    jwt.verify(token, process.env.JWT_KEY, (err, user) => {
        if(err) return next(createError(401, "Token not valid!"));

        //si todo esta bien, manda la request
        req.user = user;
        next();
    });
};

export const isStaff = (user) => Boolean(user && (user.isAdmin || user.isEmployee));

//verifica el token y despues que el usuario cumpla la condicion
const requireRole = (isAllowed) => (req, res, next) => {
    verifyToken(req, res, (err) => {
        if (err) return next(err);
        if (isAllowed(req)) return next();
        return next(createError(403, "You are not authorized!"));
    });
};

//el propio usuario (por :id o :userId) o alguien del staff
export const verifyUser = requireRole(
    (req) => req.user.id === (req.params.id || req.params.userId) || isStaff(req.user)
);

//admin o empleado
export const verifyStaff = requireRole((req) => isStaff(req.user));

export const verifyAdmin = requireRole((req) => req.user.isAdmin);
