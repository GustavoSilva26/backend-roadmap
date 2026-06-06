const esTextoInvalido = (campo) => campo !== undefined && typeof campo !== "string";
const esPrioridadInvalida = (prioridad) => prioridad !== undefined && !["alta", "media", "baja"].includes(prioridad);
const esBooleanoInvalido = (campo) => campo !== undefined && typeof campo !== "boolean";

// 1. Validar ID (Muta el parámetro a número de una vez)
export const validarTareaId = (req, res, next) => {
  const id = parseInt(req.params.id);
  if (isNaN(id) || id <= 0) {
    return res.status(400).json({ error: "El ID debe ser un número entero positivo válido" });
  }
  next();
};

// 2. Middleware base que valida los TIPOS de datos si es que vienen en el body
export const validarCamposTipos = (req, res, next) => {
  const { titulo, prioridad, completada } = req.body;

  if (esTextoInvalido(titulo) || esTextoInvalido(prioridad)) {
    return res.status(400).json({ error: "Los datos ingresados de título y prioridad deben ser texto." });
  }
  if (esPrioridadInvalida(prioridad)) {
    return res.status(400).json({ error: "La prioridad no es válida. Debe ser: baja, media o alta." });
  }
  if (esBooleanoInvalido(completada)) {
    return res.status(400).json({ error: "El campo completada debe ser un booleano." });
  }
  next();
};

// 3. Middleware específico para CREAR (Solo añade la regla de obligatoriedad)
export const validarTareaCreada = [
  (req, res, next) => {
    if (!req.body.titulo || !req.body.prioridad) {
      return res.status(400).json({ error: "El título y la prioridad son obligatorios." });
    }
    next();
  },
  validarCamposTipos, // Luego corre las validaciones de tipo
];

// 4. Middleware específico para ACTUALIZAR
export const validarTareaActualizada = [
  validarTareaId,
  validarCamposTipos, // No exige obligatoriedad, permitiendo actualizaciones parciales (PATCH/PUT)
];
