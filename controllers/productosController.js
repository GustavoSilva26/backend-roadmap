// Simulamos que seguimos teniendo acceso al array de productos (luego resolvemos dónde ponerlo)
let productos = [
  { id: 1, nombre: "Teclado Mecánico", precio: 80 },
  { id: 2, nombre: "Mouse Gamer", precio: 40 },
  { id: 3, nombre: "Monitor 4k", precio: 300 },
];

// Controlador para listar todos los productos
export const obtenerProductos = (req, res) => {
  res.status(200).json(productos);
};

// Controlador para crear un producto
export const crearProducto = (req, res) => {
  const nuevoProducto = {
    id: productos.length + 1,
    nombre: req.body.nombre,
    precio: req.body.precio,
  };

  productos.push(nuevoProducto);

  res.status(201).json(nuevoProducto);
};

// Controlador para listar los productos baratos
export const obtenerProductosBaratos = (req, res) => {
  const productosBaratos = productos.filter((p) => p.precio <= 50);
  res.status(200).json(productosBaratos);
};

// Controlador para buscar un producto por su ID
export const obtenerProductoPorId = (req, res) => {
  const id = parseInt(req.params.id);

  const productoEncontrado = productos.find((p) => id === p.id);
  if (!productoEncontrado) {
    return res.status(404).json({ error: "Producto no encontrado" });
  } else {
    res.status(200).json(productoEncontrado);
  }
};
