
import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";

import dbConnection from "./database.js";
import { validateJWT } from "./middlewares/validateJWT.js";
import { routerUsuario } from "./routes/usuarios.routes.js";
import { routerCurso } from "./routes/cursos.routes.js";
import { routerAprendiz } from "./routes/aprendices.routes.js";

dotenv.config();

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT || 4500;

    this.middlewares();
    this.routes();
    this.conexionBd();
  }

  middlewares() {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));

    const frontendUrl = process.env.URL_FRONTEND;

    this.app.use(
      cors(
        frontendUrl
          ? {
              origin: frontendUrl.split(",").map((o) => o.trim()),
            }
          : {}
      )
    );

    this.app.use(
      morgan((tokens, req, res) => {
        return [
          tokens.method(req, res),
          tokens.url(req, res),
          tokens.status(req, res),
          tokens["response-time"](req, res) + " ms",
        ].join(" ");
      })
    );
  }

  routes() {
    this.app.get("/", (req, res) => {
      console.log("");
      console.log("========================================");
      console.log("PETICION RECIBIDA: GET /");
      console.log("========================================");

      res.status(404).json({
        msg: "La ruta solicitada no existe",
      });
    });

    this.app.get("/life", (req, res) => {
      console.log("");
      console.log("Servidor funcionando correctamente");

      res.status(200).json({
        msg: "El servidor esta funcionando",
      });
    });

    this.app.use("/api/usuarios", routerUsuario);

    this.app.use("/api/cursos", validateJWT, routerCurso);

    this.app.use("/api/aprendices", validateJWT, routerAprendiz);

    this.app.use("/api/*", (req, res) => {
      console.log("");
      console.log("========================================");
      console.log("ERROR 404");
      console.log("Ruta no encontrada:");
      console.log(req.method + " " + req.originalUrl);
      console.log("========================================");

      res.status(404).json({
        msg: "La ruta solicitada no existe",
      });
    });

    this.app.use((req, res) => {
      console.log("");
      console.log("========================================");
      console.log("ERROR 404");
      console.log("Ruta no encontrada:");
      console.log(req.method + " " + req.originalUrl);
      console.log("========================================");

      res.status(404).json({
        msg: "La ruta solicitada no existe",
      });
    });

    this.app.use((err, req, res, next) => {
      console.error("");
      console.error("========================================");
      console.error("ERROR INTERNO DEL SERVIDOR");
      console.error("========================================");
      console.error(err);
      console.error("========================================");
      console.error("");

      res.status(err?.status || 500).json({
        msg: "Error interno del servidor",
      });
    });
  }

  async conexionBd() {
    if (!process.env.MONGO_URL) {
      console.error("");
      console.error("========================================");
      console.error("ERROR DE CONFIGURACION");
      console.error("Falta MONGO_URL en el archivo .env");
      console.error("========================================");
      console.error("");

      return;
    }

    if (!process.env.SECRETORPRIVATEKEY) {
      console.error("");
      console.error("========================================");
      console.error("ERROR DE CONFIGURACION");
      console.error("Falta SECRETORPRIVATEKEY en el archivo .env");
      console.error("========================================");
      console.error("");
    }

    try {
      await dbConnection();

      console.log("");
      console.log("========================================");
      console.log("BASE DE DATOS");
      console.log("Conectado a MongoDB correctamente");
      console.log("========================================");
      console.log("");
    } catch (error) {
      console.error("");
      console.error("========================================");
      console.error("ERROR DE BASE DE DATOS");
      console.error("No se pudo conectar a MongoDB");
      console.error("========================================");
      console.error(error);
      console.error("");
    }
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log("");
      console.log("========================================");
      console.log("         SERVIDOR INICIADO");
      console.log("========================================");
      console.log(`Servidor: http://localhost:${this.port}`);
      console.log("");
      console.log("Rutas disponibles:");
      console.log(`GET  http://localhost:${this.port}/life`);
      console.log(`POST http://localhost:${this.port}/api/usuarios/login`);
      console.log(`POST http://localhost:${this.port}/api/usuarios/register`);
      console.log(`GET  http://localhost:${this.port}/api/cursos`);
      console.log(`GET  http://localhost:${this.port}/api/aprendices`);
      console.log("========================================");
      console.log("");
    });
  }
}

export default Server;

