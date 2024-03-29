const express = require("express");
const cors = require("cors");
const { dbConnection } = require("../database/config");

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT;
    this.usuariosPath = "/api/usuarios";
    this.authPath = "/api/auth";
    this.registroMedicoPath = "/api/registroMedico";
    this.registroGeneralPath = "/api/registroGeneral";
    // Conectar a base de datos para
    this.conectarDB();
    // Middlewares
    this.middlewares();
    // Rutas de mi app
    this.routes();
  }

  async conectarDB() {
    await dbConnection();
  }

  middlewares() {
    //   CORS
    this.app.use(cors());
    // Lectura y parseo del Body
    this.app.use(express.json());
    //   directorio publico
    this.app.use(express.static("public"));
  }

  routes() {
    this.app.use(this.authPath, require("../routes/auth"));
    this.app.use(this.usuariosPath, require("../routes/usuarios"));
    this.app.use(this.registroMedicoPath, require("../routes/registroMedico"));
    this.app.use(this.registroGeneralPath, require("../routes/registroGeneral"));
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log("servidor corriendo en puerto", this.port);
    });
  }
}

module.exports = Server;
