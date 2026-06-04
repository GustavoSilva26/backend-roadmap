import fs from "fs/promises";

const ARCHIVO_PATH = "./tareas.json";

const leerBD = async () => {
  try {
    return JSON.parse(await fs.readFile(ARCHIVO_PATH, "utf8"));
  } catch (error) {
    return [];
  }
};

const escribirBD = async (datos) => {
  await fs.writeFile(ARCHIVO_PATH, JSON.stringify(datos, null, 2), "utf8");
};

export const obtenerTareas = async (req, res) => {
  try {
    res.status(200).json(await leerBD());
  } catch (error) {
    res.status(500).json({ error: "Error al leer la base de datos" });
  }
};

export const obtenerTareasUrgentes = async (req, res) => {
  try {
    const tareas = await leerBD();

    const tareasUrgentes = tareas.filter(
      (tarea) => tarea.prioridad === "alta" && tarea.completada === false,
    );

    res.status(200).json(tareasUrgentes);
  } catch (error) {
    res.status(500).json({ error: "Error al leer la base de datos" });
  }
};

export const obtenerTareasPendientes = async (req, res) => {
  try {
    const tareas = await leerBD();

    const tareasPedientes = tareas.filter(
      (tarea) => tarea.completada === false,
    );

    res.status(200).json(tareasPedientes);
  } catch (error) {
    res.status(500).json({ error: "Error al leer la base de datos" });
  }
};

export const obtenerTareaPorId = async (req, res) => {
  try {
    const tareas = await leerBD();
    const id = Number(req.params.id);

    const tareaPorId = tareas.find((tarea) => tarea.id === id);

    if (!tareaPorId) {
      return res.status(404).json({ error: "Tarea no encontrada" });
    }

    res.status(200).json(tareaPorId);
  } catch (error) {
    res.status(500).json({ error: "Error al leer la base de datos" });
  }
};

export const crearTarea = async (req, res) => {
  try {
    const tareas = await leerBD();
    const idNuevo = tareas.length > 0 ? tareas[tareas.length - 1].id + 1 : 1;

    const nuevaTarea = {
      id: idNuevo,
      titulo: req.body.titulo,
      completada: false,
      prioridad: req.body.prioridad,
    };

    tareas.push(nuevaTarea);

    await escribirBD(tareas);
    res.status(201).json(nuevaTarea);
  } catch (error) {
    res.status(500).json({ error: "Error al leer la base de datos" });
  }
};

export const actualizarTarea = async (req, res) => {
  try {
    const tareas = await leerBD();
    const id = Number(req.params.id);

    const tareaIndex = tareas.findIndex((t) => t.id === id);

    if (tareaIndex === -1) {
      return res.status(404).json({ error: "Tarea no encontrada." });
    }

    const tareaActualizada = {
      id: id,
      titulo: req.body.titulo,
      completada: req.body.completada,
      prioridad: req.body.prioridad,
    };

    tareas[tareaIndex] = tareaActualizada;

    await escribirBD(tareas);

    res.status(200).json(tareaActualizada);
  } catch (error) {
    res.status(500).json({
      error: "Error al leer la base de datos. La tarea no se pudo actualizar.",
    });
  }
};

export const eliminarTarea = async (req, res) => {
  try {
    const tareas = await leerBD();
    const id = Number(req.params.id);

    const tareaFind = tareas.find((t) => t.id === id);

    if (!tareaFind) {
      return res.status(404).json({
        error: "La Tarea que desea eliminar no existe.",
      });
    }

    const tareaFiltrada = tareas.filter((t) => t.id !== id);

    await escribirBD(tareaFiltrada);
    res.status(200).json({ mensaje: "Tarea eliminada correctamente" });
  } catch (error) {
    res.status(500).json({
      error: "Error al leer la base de datos. La tarea no se pudo eliminar",
    });
  }
};
