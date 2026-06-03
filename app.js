import express from "express";
import {
  obtenerProductos,
  crearProducto,
  obtenerProductosBaratos,
  obtenerProductoPorId,
} from "./controllers/productosController.js";

const app = express();
app.use(express.json());
const PORT = 3000;

// Aquí irán nuestras rutas más adelante...

app.get("/", (req, res) => {
  res.json("Bienvenido a mi tienda");
});

app.get("/productos/baratos", obtenerProductosBaratos);

app.get("/productos", obtenerProductos);

app.get("/productos/:id", obtenerProductoPorId);

app.post("/productos", crearProducto);

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
