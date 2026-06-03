export const validarProducto = (req, res, next) => {
  const { nombre, precio } = req.body; //Extraemos el nombre y el precio del cuerpo

  // REGLA DE SEGURIDAD: Si no viene el nombre o no viene el precio...
  if (!nombre || !precio) {
    return res.status(400).json({
      error: "Datos inválidos. El 'nombre' y el 'precio' son obligatorios.",
    });
  }
  if (typeof nombre !== "string" || typeof precio !== "number" || precio <= 0) {
    return res.status(400).json({
      error: "Los datos ingresados son inválidos.",
    });
  } else {
    // SI TODO ESTÁ BIEN: Ejecutamos next() para que pase al controlador
    next();
  }
};
