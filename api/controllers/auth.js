import User from "../models/User.js"
import bycrypt from "bcryptjs"
import { createError } from "../utils/error.js";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";

//el client id de Google es publico (es el mismo que usa el frontend)
const GOOGLE_CLIENT_ID =
    process.env.GOOGLE_CLIENT_ID ||
    "417741299022-qianta46knjdh48qu8klcru99pv4o4u1.apps.googleusercontent.com";
const googleClient = new OAuth2Client(GOOGLE_CLIENT_ID);

//en produccion el front (Vercel) y la API (Render) estan en dominios distintos,
//asi que la cookie tiene que ser SameSite=None + Secure para que el navegador la mande
const isProduction = process.env.NODE_ENV === "production" || Boolean(process.env.RENDER);
const cookieOptions = {
    httpOnly: true,
    sameSite: isProduction ? "none" : "lax",
    secure: isProduction,
};
const TOKEN_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

const signToken = (user) =>
    jwt.sign(
        { id: user._id, email: user.email, first_name: user.first_name, last_name: user.last_name, isEmployee: user.isEmployee, isAdmin: user.isAdmin },
        process.env.JWT_KEY,
        { expiresIn: "7d" }
    );

//manda el token en una cookie y tambien en el body (el front lo usa en el header Authorization)
const sendSession = (res, user, status = 200, extra = {}) => {
    const token = signToken(user);
    res.cookie("token", token, { ...cookieOptions, maxAge: TOKEN_MAX_AGE_MS });
    return res.status(status).json({ ...user.toJSON(), token, ...extra });
};

export const register = async (req, res, next) => {
    try{
        //hasheo las contaseñas
        const salt = bycrypt.genSaltSync(10);
        const hash = bycrypt.hashSync(req.body.password, salt);

        const newUser = new User({
            email: req.body.email,
            password:hash,
            first_name: req.body.first_name,
	        last_name: req.body.last_name,
            phone:req.body.phone,
	        dni: req.body.dni || undefined, //"" chocaria con el indice unico
	        birthday: req.body.birthday,
	        ocupation: req.body.ocupation,
        })

    await newUser.save()
    res.status(200).json(newUser);

    }catch(err){
        next(err);
    }
}

export const login = async (req, res, next) => {
    try {

        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return next(createError(404, "User not found"));
        }

        //los usuarios creados con Google no tienen contraseña
        if (!user.password) {
            return next(createError(400, "Esta cuenta usa inicio de sesión con Google"));
        }

        const isPasswordCorrect = await bycrypt.compare(req.body.password, user.password);
        if (!isPasswordCorrect) {
            return next(createError(400, "Incorrect password or email"));
        }

        return sendSession(res, user);
    } catch (err) {
        next(err);
    }
};

export const loginWithGoogle = async (req, res, next) => {
   try {
    const { credential } = req.body;
    if (!credential) {
      return next(createError(400, "Falta la credencial de Google"));
    }

    //verificar con Google que el token es valido y fue emitido para esta app
    let payload;
    try {
      const ticket = await googleClient.verifyIdToken({ idToken: credential, audience: GOOGLE_CLIENT_ID });
      payload = ticket.getPayload();
    } catch (err) {
      return next(createError(401, "Credencial de Google inválida"));
    }

    if (!payload?.email || !payload.email_verified) {
      return next(createError(401, "El email de Google no está verificado"));
    }

    const { email, name = "", sub: googleId } = payload;
    let user = await User.findOne({ email });

    if (!user) {
      // separar nombre y apellido de lo que viene de Google
      const [first_name, ...rest] = name.split(" ");
      const last_name = rest.join(" ");

      // Crear usuario incompleto
      user = new User({
        first_name,
        last_name,
        email,
        googleId,
        isGoogleUser: true,
      });

      await user.save();

      // avisamos al frontend que debe completar su perfil
      return res.status(201).json({
        needsProfileCompletion: true,
        userId: user._id,
        email: user.email,
        token: signToken(user),
      });

    }

    // si ya existe, login normal
    const token = signToken(user);
    res.cookie("token", token, { ...cookieOptions, maxAge: TOKEN_MAX_AGE_MS });
    res.json({ needsProfileCompletion: false, user: { ...user.toJSON(), token } });

  } catch (err) {
    next(err);
  }
}


export const completeProfile = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { first_name, last_name, phone, dni, birthday, ocupation, password } = req.body;

    const update = { first_name, last_name, phone, dni: dni || undefined, birthday, ocupation };
    //si eligio una contraseña, tambien puede entrar con email y contraseña
    if (password) {
      update.password = bycrypt.hashSync(password, bycrypt.genSaltSync(10));
    }

    const user = await User.findByIdAndUpdate(id, update, { new: true });

    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    res.json({ message: "Perfil actualizado", user });
  } catch (err) {
    next(err);
  }
}

export const profile = async (req, res, next) => {
    const header = req.headers.authorization;
    const token = header?.startsWith("Bearer ") ? header.slice(7) : req.cookies.token;
    if (!token) return res.json(null);

    // verifica el token y decodifica los datos del usuario
    jwt.verify(token, process.env.JWT_KEY, {}, (err, user) => {
        // si el token es invalido o expiro, no hay sesion
        if (err) return res.json(null);
        res.json(user);
    });
}

export const logout = async (req, res, next) => {
    try {
        // se borra la cookie del token
        res.clearCookie("token", cookieOptions);
        res.status(200).json({ success: true });
    } catch (err) {
        next(err);
    }
};