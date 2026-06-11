import { pool } from "../db.js"; // Asegúrate de ajustar la ruta a tu db.js

// 1. OBTENER TAREAS CON LOS DATOS DE SU DUEÑO (INNER JOIN)
export const obtenerTareasConDueño = async (req, res) => {
  try {
    // Traemos columnas específicas para que el resultado sea limpio y ordenado
    const query = `
      SELECT 
        tareas.id, 
        tareas.titulo, 
        tareas.prioridad, 
        tareas.completada,
        usuarios.nombre AS nombre_usuario,
        usuarios.email AS email_usuario
      FROM tareas
      INNER JOIN usuarios ON tareas.usuario_id = usuarios.id;
    `;

    const resultado = await pool.query(query);
    res.status(200).json(resultado.rows);
  } catch (error) {
    console.error("❌ Error en informe de dueños:", error.stack);
    res.status(500).json({ error: "Error al generar el informe en la base de datos" });
  }
};

// 2. CONTEO Y ESTADÍSTICAS POR PRIORIDAD (COUNT + GROUP BY)
export const obtenerEstadisticasPrioridad = async (req, res) => {
  try {
    // Le pedimos a Postgres que agrupe por prioridad y cuente cuántas tareas hay en cada una
    const query = `
      SELECT prioridad, COUNT(*) AS total_tareas
      FROM tareas
      GROUP BY prioridad;
    `;

    const resultado = await pool.query(query);
    res.status(200).json(resultado.rows);
  } catch (error) {
    console.error("❌ Error en informe estadístico:", error.stack);
    res.status(500).json({ error: "Error al generar las estadísticas" });
  }
};

