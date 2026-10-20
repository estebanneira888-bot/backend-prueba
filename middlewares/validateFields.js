
import { validationResult } from "express-validator";

const validateFields = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const mensajes = errors.array().map((error) => error.msg);

    console.log("");
    console.log("========================================");
    console.log("ERROR DE VALIDACION");
    console.log("========================================");

    mensajes.forEach((mensaje) => {
      console.log("-> " + mensaje);
    });

    console.log("========================================");
    console.log("");

    return res.status(400).json({
      msg: "Error en la validacion",
      errors: mensajes,
    });
  }

  next();
};

export { validateFields };

