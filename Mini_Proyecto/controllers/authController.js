import { pool } from "../db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const registrarUsuario = async (req, res) => {
  try {
    const { nombre, email, contrasena } = req.body;

    // 1. VALIDACIÓN DE SEGURIDAD INTERNA: ¿El usuario ya existe?
    // Como pusimos que el email es UNIQUE en la base de datos, si intentamos registrar el mismo email, Postgres fallará.
    // Es mejor adelantarnos nosotros con una consulta rápida
    const usuarioExistente = await pool.query("SELECT * FROM usuarios WHERE email = $1", [email]);

    if (usuarioExistente.rows.length > 0) return res.status(400).json({ error: "El correo electrónico ya está registrado" });

    // 2. ENCRIPTACIÓN (HASHING): Deformamos la contraseña digital
    // Pasamos la contraseña del req.body y le aplicamos las 10 rondas de seguridad.
    const contrasenaEncriptada = await bcrypt.hash(contrasena, 10);

    // 3. INSERCIÓN SEGURA: Guardamos los datos en Postgres usando la versión encriptada
    const query = `INSERT INTO usuarios (nombre, email, contrasena) 
    VALUES ($1, $2, $3) 
    RETURNING id, nombre, email;
    `;

    // ¡Ojo! Enviamos constrasenaEncriptada, NUNCA la contraseña que venía en texto plano.
    const valores = [nombre, email, contrasenaEncriptada];
    const resultado = await pool.query(query, valores);
    const nuevoUsuario = resultado.rows[0];

    // 4. RESPUESTA EXITOSA: Devolvemos el usuario creado (pero sin mostrar la constraseña encriptada)
    res.status(201).json({
      mensaje: "Usuario registado con éxito.",
      usuario: nuevoUsuario,
    });
  } catch (error) {
    console.error("Error en el registro de usuario", error.stack);
    res.status(500).json({ error: "Error en el registro de usuario" });
  }
};

export const iniciarSesion = async (req, res) => {
  try {
    const { email, contrasena } = req.body;

    // 1. BUSCAR AL USUARIO: Validamos si el correo existe
    // Aquí sí necesitamos traer la columna contrasena para poder compararla
    const query = "SELECT * FROM usuarios WHERE email = $1";
    const resultado = await pool.query(query, [email]);

    // Si no encuentra filas, significa que ese correo no existe
    if (resultado.rows.length === 0) return res.status(401).json({ error: "Credenciales incorrectas" });

    const usuario = resultado.rows[0];

    // 2. COMPARAR CONTRASEÑAS: El método mágico de bcrypt
    // Compara la contraseña limpia del body con la encriptada que trajimos de Postgres

    const contrasenaValida = await bcrypt.compare(contrasena, usuario.contrasena);

    // Si no coninciden, bloqueamos el acceso
    if (!contrasenaValida) return res.status(401).json({ error: "Credenciales incorrectas" });

    // 3. Fabricar el JWT (El boleto de cine)
    // El primer objeto es el Payload (datos que viajan dentro del token)
    const payload = {
      id: usuario.id,
      nombre: usuario.nombre,
    };

    // Firmamos el token usando nuestra palabra secreta del .env
    // 'expiresIn: "1h"' significa que el boleto vence automáticamente en 1 hora por seguridad
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });

    // 4. ACCESO CONCEDIDO: Devolvemos éxito (por ahora un mensaje, luego usaremos Tokens)
    res.status(200).json({
      mensaje: "¡Inicio de sesión exitoso!",
      token: token,
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
      },
    });
  } catch (error) {
    console.error("Error en el inicio de sesión", error.stack);
    res.status(500).json({ error: "Error en el inicio de sesión" });
  }
};
