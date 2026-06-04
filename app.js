import express from "express";
import {
  obtenerProductos,
  crearProducto,
  obtenerProductosBaratos,
  obtenerProductoPorId,
} from "./controllers/productosController.js";

// Importamos nuestro middleware
import { validarProductoBody, validarProductoId } from "./validarProducto.js";

const app = express();
app.use(express.json());
const PORT = 3000;

// Aquí irán nuestras rutas más adelante...

app.get("/", (req, res) => {
  res.json("Bienvenido a mi tienda");
});

app.get("/productos/baratos", obtenerProductosBaratos);

app.get("/productos", obtenerProductos);

app.get("/productos/:id", validarProductoId, obtenerProductoPorId);

// 2. ¡LA MAGIA! Ponemos al guardia justo antes de crear el producto
// Express ejecutará primero 'validarDatosProducto', y si este da luz verde (next), pasará a 'crearProducto'
app.post("/productos", validarProductoBody, crearProducto);

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
