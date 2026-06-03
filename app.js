import express from "express";

const app = express();
app.use(express.json());
const PORT = 3000;

// Nuestra "Base de Datos" temporal de la tienda
let productos = [
  { id: 1, nombre: "Teclado Mecánico", precio: 80 },
  { id: 2, nombre: "Mouse Gamer", precio: 40 },
  { id: 3, nombre: "Monitor 4k", precio: 300 },
];

// Aquí irán nuestras rutas más adelante...

app.get("/", (req, res) => {
  res.json("Bienvenido a mi tienda");
});

app.get("/productos", (req, res) => {
  res.json(productos);
});

app.post("/productos", (req, res) => {
  // Los datos enviados por el cliente llegan dentro de 'req.body'
  const nuevoProducto = {
    id: productos.length + 1,
    nombre: req.body.nombre,
    precio: req.body.precio,
  };

  // Agregamos el nuevo producto al array
  productos.push(nuevoProducto);

  // Respondemos al cliente con el producto creado y un estado exitoso
  res.status(201).json(nuevoProducto);
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
