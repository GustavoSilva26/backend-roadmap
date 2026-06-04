export const validarProductoBody = (req, res, next) => {
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

export const validarProductoId = (req, res, next) => {
  const id = parseInt(req.params.id);

  if (isNaN(id) || id <= 0) {
    return res.status(400).json({ error: "ID inválido" });
  } else {
    next();
  }
};
