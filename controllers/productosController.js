import fs from "fs/promises";

// Definimos la ruta hacia nuestro archivo "base de datos"
const ARCHIVO_PATH = "./productos.json";

const leerBD = async () => JSON.parse(await fs.readFile(ARCHIVO_PATH, "utf8"));
const escribirBD = async (datos) =>
  await fs.writeFile(ARCHIVO_PATH, JSON.stringify(datos, null, 2), "utf8");

// Controlador para listar todos los productos
// Agregamos 'async' antes de los parámetros para habilitar el uso de 'await'
export const obtenerProductos = async (req, res) => {
  try {
    // 2. Leemos el archivo del disco duro de forma asícrona (no bloqueada)
    // El 'uft8' le dice a Node que interprete el archivo como texto legible

    res.status(200).json(await leerBD());
  } catch (error) {
    res.status(500).json({ error: "Error al leer la base de datos" });
  }
};

// // Controlador para crear un producto
// export const crearProducto = (req, res) => {
//   const nuevoProducto = {
//     id: productos.length + 1,
//     nombre: req.body.nombre,
//     precio: req.body.precio,
//   };

//   productos.push(nuevoProducto);

//   res.status(201).json(nuevoProducto);
// };

// Controlador para crear un producto actualizado
export const crearProducto = async (req, res) => {
  try {
    const productos = await leerBD();

    const nuevoProducto = {
      id: productos.length + 1,
      nombre: req.body.nombre,
      precio: req.body.precio,
    };

    productos.push(nuevoProducto);

    await escribirBD(productos);

    res.status(201).json(nuevoProducto);
  } catch (error) {
    res.status(500).json({ error: "Error al leer la base de datos" });
  }
};

// Controlador para listar los productos baratos
export const obtenerProductosBaratos = async (req, res) => {
  try {
    const productos = await leerBD();

    const productosBaratos = productos.filter((p) => p.precio <= 50);
    res.status(200).json(productosBaratos);
  } catch (error) {
    res.status(500).json({ error: "Error al leer la base de datos" });
  }
};

// Controlador para buscar un producto por su ID
export const obtenerProductoPorId = async (req, res) => {
  try {
    const productos = await leerBD();

    const id = parseInt(req.params.id);

    const productoEncontrado = productos.find((p) => id === p.id);
    if (!productoEncontrado) {
      return res.status(404).json({ error: "Producto no encontrado" });
    } else {
      res.status(200).json(productoEncontrado);
    }
  } catch (error) {
    res.status(500).json({ error: "Error al leer la base de datos" });
  }
};
