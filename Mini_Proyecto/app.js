import express from "express";
import * as tareasController from "./controllers/tareasController.js";
import * as validarDatosTarea from "./middlewares/validarDatosTarea.js";

const app = express();
const PORT = 3000;

app.use(express.json());

app.get("/", (req, res) => {
  res.json("Bienvenido al Gestor de Tareas");
});

app.get("/tareas", tareasController.obtenerTareas);

app.get("/tareas/urgentes", tareasController.obtenerTareasUrgentes);

app.get("/tareas/pendientes", tareasController.obtenerTareasPendientes);

app.get(
  "/tareas/:id",
  validarDatosTarea.validarTareaId,
  tareasController.obtenerTareaPorId,
);

app.post(
  "/tareas",
  validarDatosTarea.validarTareaBody,
  tareasController.crearTarea,
);

// app.put("/tareas/:id", tareasController.actualizarTarea);

// app.delete("/tareas/:id", tareasController.eliminarTarea);

app.listen(PORT, () => {
  console.log(`Servidor escuchando a http://localhost:${PORT}`);
});
