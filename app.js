function CalcularTotal(precio, cantidad) {
  let total = precio * cantidad * 1.18;
  return total;
}

console.log(CalcularTotal(100, 3));
