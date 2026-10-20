import bcrypt from "bcryptjs";

import Usuario from "../models/Usuario.js";
import { generarJWT } from "../helpers/generarJWT.js";

const usuarioCtrl = {};

/**
 * Registrar un nuevo usuario.
 *
 * La contraseña NUNCA se guarda tal cual. Se le aplica un hash con bcrypt:
 *   "123456"  ->  "$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy"
 *
 * El hash va en un solo sentido: de la contraseña se saca el hash, pero del
 * hash no se puede volver a la contraseña. Por eso al iniciar sesion no se
 * "desencripta" nada: se hashea lo que escribio el usuario y se comparan los
 * dos hashes (eso hace bcrypt.compareSync).
 *
 * El "salt" es un texto aleatorio que se mezcla antes de hashear, para que dos
 * personas con la misma contraseña no terminen con el mismo hash.
 */
usuarioCtrl.registerUsuario = async (req, res) => {
  const { nombre, email, password } = req.body;
  try {
    // Solo un ADMIN puede crear cuentas (el seed crea el primero).
    if (req.usuario?.rol !== "ADMIN") {
      return res.status(403).json({ msg: "No tienes permiso para crear usuarios" });
    }
    const newUsuario = new Usuario({
      nombre: nombre.toUpperCase().trim(),
      email: email.toLowerCase().trim(),
      password,
    });

    // Hashear antes de guardar (version async para no bloquear el event-loop)
    const salt = await bcrypt.genSalt(10);
    newUsuario.password = await bcrypt.hash(password, salt);

    await newUsuario.save();
    res.json({ msg: "Usuario registrado correctamente" });
  } catch (error) {
    console.error(error);
    if (error?.code === 11000) {
      return res.status(400).json({ msg: "El email ya esta registrado" });
    }
    res.status(500).json({ msg: "No fue posible terminar la operacion" });
  }
};

/**
 * Iniciar sesion.
 *
 * Responde { usuario, token }. El "usuario" sale sin password gracias al
 * metodo toJSON del modelo.
 *
 * Fijense que los tres errores posibles (email que no existe, usuario inactivo,
 * contraseña equivocada) responden casi lo mismo. Es a proposito: si dijeramos
 * "ese email no existe", le estariamos confirmando a un atacante cuales correos
 * SI estan registrados.
 */
usuarioCtrl.loginUsuario = async (req, res) => {
  const { email, password } = req.body;
  try {
    const usuario = await Usuario.findOne({ email: email.toLowerCase().trim() });

    if (!usuario) {
      return res.status(400).json({ msg: "Usuario o contraseña incorrectos" });
    }

    if (usuario.status !== 0) {
      return res.status(400).json({ msg: "Usuario o contraseña incorrectos" });
    }

    // Compara la contraseña escrita contra el hash guardado.
    const passwordValido = await bcrypt.compare(password, usuario.password);

    if (!passwordValido) {
      return res.status(400).json({ msg: "Usuario o contraseña incorrectos" });
    }

    // Todo bien: se genera el token con el id del usuario adentro.
    const token = await generarJWT(usuario._id);

    res.json({ usuario, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "No fue posible terminar la operacion" });
  }
};

export { usuarioCtrl };
