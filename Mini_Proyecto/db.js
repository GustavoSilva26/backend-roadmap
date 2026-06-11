import pg from "pg";

const { Pool } = pg;

// Coloca aquí la URL de Neon o Render
const connectionString = process.env.DATABASE_URL;

export const pool = new Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: true, // Requerido para conexiones seguras en la nube como Neon o Render
  },
});

// Función interna para meter datos de prueba y practicar SQL
const poblarBaseDeDatos = async () => {
  try {
    // 1. Verificamos si ya hay usuarios para no duplicar datos cada vez que se reinicie el servidor
    const conteoUsuarios = await pool.query("SELECT COUNT(*) FROM usuarios");

    if (parseInt(conteoUsuarios.rows[0].count) === 0) {
      console.log("Insertando datos de prueba para el laboratorio de SQL...");

      // 2. Insertamos dos usuarios y usamos RETURNING id para saber qué números les tocó
      const usuario1 = await pool.query("INSERT INTO usuarios (nombre, email) VALUES ('Alexis Backend', 'alex@gmail.com') RETURNING id;");
      const usuario2 = await pool.query("INSERT INTO usuarios (nombre, email) VALUES ('Maria Frontend', 'maria@gmail.com') RETURNING id;");

      const idAlex = usuario1.rows[0].id;
      const idMaria = usuario2.rows[0].id;

      // 3. Insertamos tareas amarradas a los IDs reales de Alex y Maria
      // Tareas de Alex (idAlex)
      await pool.query("INSERT INTO tareas (titulo, completada, prioridad, usuario_id) VALUES ($1, $2, $3, $4);", ["Configurar Express con Postgres", false, "alta", idAlex]);
      await pool.query("INSERT INTO tareas (titulo, completada, prioridad, usuario_id) VALUES ($1, $2, $3, $4);", ["Diseñar arquitectura limpia", true, "alta", idAlex]);

      // Tareas de Maria (idMaria)
      await pool.query("INSERT INTO tareas (titulo, completada, prioridad, usuario_id) VALUES ($1, $2, $3, $4);", ["Crear interfaz con React", false, "media", idMaria]);
      await pool.query("INSERT INTO tareas (titulo, completada, prioridad, usuario_id) VALUES ($1, $2, $3, $4);", ["Maquetar estilos CSS", false, "baja", idMaria]);

      console.log("Datos de prueba insertados con éxito.");
    } else {
      console.log("La base de datos ya contiene información. Lista para las consultas SQL.");
    }
  } catch (error) {
    console.error("Error al poblar la base de datos:", error.stack);
  }
};

// Ejecutamos la función en cuanto se conecte el archivo
// poblarBaseDeDatos();

// 1. Guardamos la orden SQL en una constante de texto para que el código sea limpio
const crearTablaQuery = `
  CREATE TABLE IF NOT EXISTS usuarios(
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    contrasena VARCHAR(255) NOT NULL
    );

  CREATE TABLE IF NOT EXISTS tareas (
    id SERIAL PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    completada BOOLEAN DEFAULT FALSE,
    prioridad VARCHAR(20) NOT NULL,
    usuario_id INT REFERENCES usuarios(id) ON DELETE CASCADE
    );
`;

// 2. Le entregamos la carta al cartero (pool), para que vaya a la nube a fabricar la tabla tareas
pool
  .query(crearTablaQuery)
  .then(() => {
    console.log("Tabla 'usuarios' y 'tareas' creadas con relaciones en PostgreSQL.");
  })
  .catch((error) => {
    console.error("Error al crear las tablas:", error.stack);
  });

// Prueba rápida de conexión
// pool.query("SELECT NOW()", (err) => {
//   if (err) {
//     console.error("Error de conexión a PostgreSQL:", err.stack);
//   } else {
//     console.log("Conexión exitosa a PostgreSQL en la nube.");
//   }
// });
