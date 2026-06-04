export const validarTareaId = (req, res, next) => {
  const id = parseInt(req.params.id);

  if (isNaN(id) || id <= 0) {
    return res.status(400).json({
      error: "El ID debe ser un número entero positivo válido",
    });
  }
  next();
};

export const validarTareaBody = (req, res, next) => {
  const { titulo, prioridad } = req.body;

  if (!titulo || !prioridad) {
    return res.status(400).json({
      error: "El título y la prioridad son obligatorios.",
    });
  }
  if (typeof titulo !== "string" || typeof prioridad !== "string") {
    return res.status(400).json({
      error: "Los datos ingresados deben ser texto.",
    });
  }
  if (prioridad !== "alta" && prioridad !== "media" && prioridad !== "baja") {
    return res.status(400).json({
      error: "La prioridad no es válida. Debe ser: baja, media o alta.",
    });
  }
  next();
};
