import jwt from "jsonwebtoken";

export const verificarToken = (req, res, next) => {
  try {
    // 1. EXTRAER EL TOKEN DE LAS CABECERAS (HEADERS)
    // En el mundo real, los tokens se envían en una cabecera llamada 'Authorization'
    const tokenHeader = req.headers["authorization"];

    if (!tokenHeader) return res.status(401).json({ error: "Acceso denegado. No se proporcionó un token." });

    // El estándar de la industria dicta que los tokens se envían como: "Bearer eyJhbGci..."
    // Así que dividimos el texto por el espacio y agarramos solo la segunda parte (el token puro)
    const token = tokenHeader.split(" ")[1];

    if (!token) return res.status(401).json({ error: "Formato de token inválido." });

    // 2. VERIFICAR LA AUTENTICIDAD DEL TOKEN
    // jwt.verify toma el token y tu palabra secreta del .env y comprueba que la firma no esté rota
    const datosDecodificados = jwt.verify(token, process.env.JWT_SECRET);

    // 3. LA MAGIA: Inyectamos los datos del usuario dentro del objeto 'req'
    // Al hacer esto, cualquier controlador que venga después podrá saber quién es el usuario haciendo 'req.usuario'
    req.usuario = datosDecodificados;

    // 4. ¡AVANZAR! Le damos el pase al controlador final
    next();
  } catch (error) {
    console.error("Error al verificar el token", error.stack);
    res.status(401).json({ error: "Acceso denegado. Token inválido." });
  }
};
