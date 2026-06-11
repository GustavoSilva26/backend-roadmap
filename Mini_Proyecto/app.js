import "dotenv/config";
import "./db.js";
import express from "express";
import { obtenerTareasConDueño, obtenerEstadisticasPrioridad } from "./controllers/informeController.js";
import * as tareasController from "./controllers/tareasController.js";
import * as authController from "./controllers/authController.js";
import * as validarDatosTarea from "./middlewares/validarDatosTarea.js";
import { verificarToken } from "./middlewares/authMiddleware.js";

const app = express();
const PORT = process.env.PORT;

app.use(express.json());

app.get("/", (req, res) => {
  res.json("Bienvenido al Gestor de Tareas");
});

app.get("/tareas", verificarToken, tareasController.obtenerTareas);

app.get("/tareas/urgentes", tareasController.obtenerTareasUrgentes);

app.get("/tareas/pendientes", tareasController.obtenerTareasPendientes);

app.get("/informes/tareas-duenos", obtenerTareasConDueño);

app.get("/informes/estadisticas", obtenerEstadisticasPrioridad);

app.get("/tareas/:id", validarDatosTarea.validarTareaId, tareasController.obtenerTareaPorId);

app.post("/tareas", validarDatosTarea.validarTareaCreada, tareasController.crearTarea);

app.post("/auth/register", authController.registrarUsuario);

app.post("/auth/login", authController.iniciarSesion);

app.put("/tareas/:id", validarDatosTarea.validarTareaActualizada, tareasController.actualizarTarea);

app.delete("/tareas/:id", validarDatosTarea.validarTareaId, tareasController.eliminarTarea);

app.listen(PORT, () => {
  console.log(`Servidor escuchando a http://localhost:${PORT}`);
});
