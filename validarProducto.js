export const validarProducto = (req, res, next) => {
  const { nombre, precio } = req.body; //Extraemos el nombre y el precio del cuerpo

  // REGLA DE SEGURIDAD: Si no viene el nombre o no viene el precio...
  if (!nombre || !precio) {
    return res.status(400).json({
      error: "Datos inválidos. El 'nombre' y el 'precio' son obligatorios.",
    });
  } else {
    // SI TODO ESTÁ BIEN: Ejecutamos next() para que pase al controlador
    next();
  }
};
