import jwt from "jsonwebtoken";

//header Authorization de un admin de prueba: el middleware solo valida la firma del token,
//asi que el usuario no necesita existir en la base de pruebas
export const adminAuth = () =>
  `Bearer ${jwt.sign({ id: "000000000000000000000000", isAdmin: true, isEmployee: false }, process.env.JWT_KEY)}`;
