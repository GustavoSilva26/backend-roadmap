// Importamos el puente de conexión a la base de datos
import { pool } from "../db.js";

export const obtenerTareas = async (req, res) => {
  try {
    // 1. Le enviamos la orden SQL a PostgelSQL usando await
    const resultado = await pool.query("SELECT * FROM tareas");

    // 2. Extraemos únicamente el array de filas (.rows) y respondemos al cliente
    res.status(200).json(resultado.rows);
  } catch (error) {
    res.status(500).json({ error: "Error al leer la base de datos" });
  }
};

export const obtenerTareasUrgentes = async (req, res) => {
  try {
    const tareasUrgentes = await pool.query("SELECT * FROM tareas WHERE prioridad = 'alta' AND completada = false");

    res.status(200).json(tareasUrgentes.rows);
  } catch (error) {
    res.status(500).json({ error: "Error al leer la base de datos" });
  }
};

export const obtenerTareasPendientes = async (req, res) => {
  try {
    const tareasPedientes = await pool.query("SELECT * FROM tareas WHERE completada = false");

    res.status(200).json(tareasPedientes.rows);
  } catch (error) {
    res.status(500).json({ error: "Error al leer la base de datos" });
  }
};

export const obtenerTareaPorId = async (req, res) => {
  try {
    const id = [req.params.id];
    const query = "SELECT * FROM tareas WHERE id = $1";
    // const valores = [id];

    const resultado = await pool.query(query, id);

    if (resultado.rows[0] === undefined) {
      return res.status(404).json({ error: "Tarea no encontrada" });
    }

    res.status(200).json(resultado.rows[0]);
  } catch (error) {
    res.status(500).json({ error: "Error al leer la base de datos" });
  }
};

export const crearTarea = async (req, res) => {
  try {
    const { titulo, prioridad } = req.body;

    const query = "INSERT INTO tareas (titulo, prioridad) VALUES ($1, $2) RETURNING *";
    const valores = [titulo, prioridad];
    const resultado = await pool.query(query, valores);

    const nuevaTarea = resultado.rows[0];

    res.status(201).json(nuevaTarea);
  } catch (error) {
    console.error("Error al insertar la tarea en Postgres:", error.stack);
    res.status(500).json({
      error: "Error interno al guardar en la base de datos.",
    });
  }
};

export const actualizarTarea = async (req, res) => {
  try {
    const id = req.params.id;
    const { titulo, prioridad, completada } = req.body;

    const query = "UPDATE tareas SET titulo = $1, prioridad = $2, completada = $3 WHERE id = $4 RETURNING *";
    const valores = [titulo, prioridad, completada, id];

    const resultado = await pool.query(query, valores);

    if (resultado.rows[0] === undefined) {
      res.status(404).json({ error: "Tarea no encontrada" });
    } else {
      res.status(200).json(resultado.rows[0]);
    }
  } catch (error) {
    console.error("Error al actualizar la tarea en Postgres:", error.stack);
    res.status(500).json({
      error: "Error al leer la base de datos. La tarea no se pudo actualizar.",
    });
  }
};

export const eliminarTarea = async (req, res) => {
  try {
    const id = [req.params.id];
    const query = "DELETE FROM tareas WHERE id = $1 RETURNING *";

    const resultado = await pool.query(query, id);

    if (resultado.rows.length > 0) {
      res.status(200).json({ mensaje: "Tarea eliminada correctamente" });
    } else {
      res.status(404).json({ error: "Tarea no encontrada" });
    }
  } catch (error) {
    res.status(500).json({
      error: "Error al leer la base de datos. La tarea no se pudo eliminar",
    });
  }
};
