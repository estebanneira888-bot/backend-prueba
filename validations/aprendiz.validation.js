/**
 * @fileoverview Cadenas de validacion para las rutas de aprendiz.
 * Mismo patron que curso.validation.js: todas las reglas de un campo van
 * encadenadas y separadas por .bail() para no consultar la BD con datos
 * invalidos. Ver la explicacion completa en curso.validation.js.
 * @module validations/aprendiz.validation
 */
import { check, param } from "express-validator";
import { validateFields } from "../middlewares/validateFields.js";
import { aprendizHelper } from "../helpers/aprendiz.helper.js";

const { validateExistAprendizById, validateExistCurso, validateExistDocumento, validateExistEmail } =
  aprendizHelper;

const aprendizVali = {};

/**
 * Valida los datos para registrar un aprendiz.
 */
aprendizVali.validateRegisterAprendiz = [
  check("documento", "El documento es obligatorio")
    .trim()
    .notEmpty()
    .bail()
    .custom(async (documento) => {
      await validateExistDocumento(documento);
    }),
  check("nombre", "El nombre es obligatorio").trim().notEmpty(),
  check("email", "El email es obligatorio")
    .trim()
    .notEmpty()
    .bail()
    .normalizeEmail()
    .isEmail()
    .withMessage("El email no es valido")
    .bail()
    .custom(async (email) => {
      await validateExistEmail(email);
    }),
  check("curso", "El curso es obligatorio")
    .notEmpty()
    .bail()
    .isMongoId()
    .withMessage("El curso no es valido")
    .bail()
    .custom(async (curso) => {
      await validateExistCurso(curso);
    }),
  validateFields,
];

/**
 * Valida los datos para actualizar un aprendiz.
 */
aprendizVali.validateUpdateAprendiz = [
  param("id", "El id no es valido")
    .isMongoId()
    .bail()
    .custom(async (id) => {
      await validateExistAprendizById(id);
    }),
  check("documento", "El documento es obligatorio")
    .trim()
    .notEmpty()
    .bail()
    .custom(async (documento, { req }) => {
      await validateExistDocumento(documento, req.params.id);
    }),
  check("nombre", "El nombre es obligatorio").trim().notEmpty(),
  check("email", "El email es obligatorio")
    .trim()
    .notEmpty()
    .bail()
    .normalizeEmail()
    .isEmail()
    .withMessage("El email no es valido")
    .bail()
    .custom(async (email, { req }) => {
      await validateExistEmail(email, req.params.id);
    }),
  check("curso", "El curso es obligatorio")
    .notEmpty()
    .bail()
    .isMongoId()
    .withMessage("El curso no es valido")
    .bail()
    .custom(async (curso) => {
      await validateExistCurso(curso);
    }),
  validateFields,
];

/**
 * Valida que el id enviado por la url corresponda a un aprendiz existente.
 */
aprendizVali.validateExistAprendiz = [
  param("id", "El id no es valido")
    .isMongoId()
    .bail()
    .custom(async (id) => {
      await validateExistAprendizById(id);
    }),
  validateFields,
];

/**
 * Valida el :curso de GET /api/aprendices/curso/:curso
 */
aprendizVali.validateExistCursoParam = [
  param("curso", "El curso no es valido")
    .isMongoId()
    .bail()
    .custom(async (curso) => {
      await validateExistCurso(curso);
    }),
  validateFields,
];

export { aprendizVali };
