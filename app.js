let usuariosDB = [
  { nombre: "Ana", correo: "ana@mail.com", estaActivo: true },
  { nombre: "Pedro", correo: "pedro@mail.com", estaActivo: false },
  { nombre: "Juan", correo: "juan@mail.com", estaActivo: true },
  { nombre: "Maria", correo: "maria@mail.com", estaActivo: false },
];

let correosActivos = usuariosDB.filter(
  (usuario) => usuario.estaActivo === true,
);

console.log("--- Los correos de los usuarios con suscripción activa son: ---");
console.log(correosActivos.map((usuario) => usuario.correo));
