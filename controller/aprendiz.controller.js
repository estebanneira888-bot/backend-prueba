import Aprendiz from "../models/Aprendiz.js";

const aprendizCtrl = {};

// Registrar un nuevo aprendiz
aprendizCtrl.registerAprendiz = async (req, res) => {
  const { documento, nombre, email, curso } = req.body;
  try {
    const newAprendiz = new Aprendiz({
      documento: documento.trim(),
      nombre: nombre.toUpperCase().trim(),
      email: email.toLowerCase().trim(),
      curso,
    });
    await newAprendiz.save();
    res.json({ msg: "Aprendiz registrado correctamente" });
  } catch (error) {
    console.error(error);
    if (error?.code === 11000) {
      return res.status(400).json({ msg: "Documento o email ya registrado" });
    }
    res.status(500).json({ msg: "No fue posible terminar la operacion" });
  }
};

// Listar aprendices. populate("curso") reemplaza el id por el documento completo del curso.
aprendizCtrl.getAprendices = async (req, res) => {
  const { status } = req.query;
  try {
    const filtro =
      status === "0" || status === "1" || status === 0 || status === 1
        ? { status: Number(status) }
        : {};
    const aprendices = await Aprendiz.find(filtro)
      .populate("curso")
      .sort({ createdAt: -1 });
    res.json(aprendices);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "No fue posible terminar la operacion" });
  }
};

// Obtener un aprendiz por id
aprendizCtrl.getAprendizId = async (req, res) => {
  const { id } = req.params;
  try {
    const aprendiz = await Aprendiz.findById(id).populate("curso");
    if (!aprendiz) {
      return res.status(404).json({ msg: "El aprendiz no existe" });
    }
    res.json(aprendiz);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "No fue posible terminar la operacion" });
  }
};

// Listar los aprendices de un curso (ejemplo de consulta por relacion)
aprendizCtrl.getAprendicesByCurso = async (req, res) => {
  const { curso } = req.params;
  try {
    const aprendices = await Aprendiz.find({ curso, status: 0 }).populate("curso");
    res.json(aprendices);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "No fue posible terminar la operacion" });
  }
};

// Actualizar un aprendiz
aprendizCtrl.updateAprendiz = async (req, res) => {
  const { id } = req.params;
  const { documento, nombre, email, curso } = req.body;
  try {
    const aprendiz = await Aprendiz.findByIdAndUpdate(
      id,
      {
        documento: documento.trim(),
        nombre: nombre.toUpperCase().trim(),
        email: email.toLowerCase().trim(),
        curso,
      },
      { new: true, runValidators: true }
    );
    if (!aprendiz) {
      return res.status(404).json({ msg: "El aprendiz no existe" });
    }
    res.json({ msg: "Aprendiz actualizado correctamente" });
  } catch (error) {
    console.error(error);
    if (error?.code === 11000) {
      return res.status(400).json({ msg: "Documento o email ya registrado" });
    }
    res.status(500).json({ msg: "No fue posible terminar la operacion" });
  }
};

// Activar aprendiz (status 0)
aprendizCtrl.activeAprendiz = async (req, res) => {
  const { id } = req.params;
  try {
    const aprendiz = await Aprendiz.findByIdAndUpdate(
      id,
      { status: 0 },
      { new: true, runValidators: true }
    );
    if (!aprendiz) {
      return res.status(404).json({ msg: "El aprendiz no existe" });
    }
    res.json({ msg: "Aprendiz activado correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "No fue posible terminar la operacion" });
  }
};

// Desactivar aprendiz (status 1)
aprendizCtrl.inactiveAprendiz = async (req, res) => {
  const { id } = req.params;
  try {
    const aprendiz = await Aprendiz.findByIdAndUpdate(
      id,
      { status: 1 },
      { new: true, runValidators: true }
    );
    if (!aprendiz) {
      return res.status(404).json({ msg: "El aprendiz no existe" });
    }
    res.json({ msg: "Aprendiz desactivado correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "No fue posible terminar la operacion" });
  }
};

export { aprendizCtrl };
