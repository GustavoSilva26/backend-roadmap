let producto = {
  nombre: "Zapatillas",
  precio: 130,
  stock: 30,
};

let productoJSON = JSON.stringify(producto);

console.log(
  "--- Aquí está el archivo enviado como objeto convertido a JSON ---",
);
console.log(productoJSON);
console.log("--------------------------------------------");

let productoFinal = JSON.parse(productoJSON);

console.log(
  "El producto " +
    productoFinal.nombre +
    " cuesta $" +
    productoFinal.precio +
    ".",
);
