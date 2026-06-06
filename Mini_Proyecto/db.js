import pg from "pg";

const { Pool } = pg;

// Coloca aquí la URL de Neon o Render
const connectionString = "postgresql://neondb_owner:npg_xKQCqwVht46m@ep-falling-frog-aqfm6eil.c-8.us-east-1.aws.neon.tech/neondb?sslmode=require";

export const pool = new Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false, // Requerido para conexiones seguras en la nube como Neon o Render
  },
});

// 1. Guardamos la orden SQL en una constante de texto para que el código sea limpio
const crearTablaQuery = `
  CREATE TABLE IF NOT EXISTS tareas (
    id SERIAL PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    completada BOOLEAN DEFAULT FALSE,
    prioridad VARCHAR(20) NOT NULL
    );
`;

// 2. Le entregamos la carta al cartero (pool), para que vaya a la nube a fabricar la tabla tareas
pool
  .query(crearTablaQuery)
  .then(() => {
    console.log("Tabla 'tareas' creada exitosamente en PostgreSQL en la nube.");
  })
  .catch((error) => {
    console.error("Error al crear la tabla 'tareas':", error.stack);
  });

// Prueba rápida de conexión
// pool.query("SELECT NOW()", (err) => {
//   if (err) {
//     console.error("Error de conexión a PostgreSQL:", err.stack);
//   } else {
//     console.log("Conexión exitosa a PostgreSQL en la nube.");
//   }
// });
