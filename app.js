import { formatearUsuario } from "./procesador.js";

let clienteNuevo = {
  nombre: "gustavo",
  correo: "gustavo@gmail.com",
};

let clienteListo = formatearUsuario(clienteNuevo);

console.log(clienteListo);
