import jwt from "jsonwebtoken";
import Usuario from "../models/Usuario.js";

const validateJWT = async (req, res, next) => {
  const rawHeader =
    req.header("x-token") ||
    req.header("Authorization") ||
    "";

  const token = rawHeader.startsWith("Bearer ")
    ? rawHeader.slice(7)
    : rawHeader;

  if (!token) {
    console.log("");
    console.log("========================================");
    console.log("ERROR DE AUTENTICACION");
    console.log("No hay token en la peticion");
    console.log("========================================");
    console.log("");

    return res.status(401).json({
      msg: "No hay token en la peticion",
    });
  }

  if (!process.env.SECRETORPRIVATEKEY) {
    console.error("");
    console.error("========================================");
    console.error("ERROR DE CONFIGURACION");
    console.error("Falta SECRETORPRIVATEKEY");
    console.error("========================================");
    console.error("");

    return res.status(500).json({
      msg: "Error de configuracion del servidor",
    });
  }

  try {
    const { uid } = jwt.verify(
      token,
      process.env.SECRETORPRIVATEKEY
    );

    const usuario = await Usuario.findById(uid).select(
      "-password -__v"
    );

    if (!usuario) {
      console.log("");
      console.log("ERROR DE AUTENTICACION");
      console.log("El usuario del token no existe");
      console.log("");

      return res.status(401).json({
        msg: "Token no valido - el usuario no existe",
      });
    }

    if (usuario.status !== 0) {
      console.log("");
      console.log("ERROR DE AUTENTICACION");
      console.log("El usuario esta inactivo");
      console.log("");

      return res.status(401).json({
        msg: "Token no valido - el usuario esta inactivo",
      });
    }

    req.usuario = usuario;

    next();
  } catch (error) {
    console.log("");
    console.log("========================================");
    console.log("ERROR DE TOKEN");
    console.log("========================================");

    if (error?.name === "TokenExpiredError") {
      console.log("El token ha expirado");
      console.log("========================================");
      console.log("");

      return res.status(401).json({
        msg: "Token expirado",
      });
    }

    console.log("El token no es valido");
    console.log("========================================");
    console.log("");

    return res.status(401).json({
      msg: "Token no valido",
    });
  }
};

export { validateJWT };

