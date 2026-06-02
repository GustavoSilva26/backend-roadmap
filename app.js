// Creamos una función que simula traer datos desde internet (tarda 2 segundos)
function procesarPagoBanco() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ estado: "Aprobado", transaccionId: 98765 });
    }, 3000);
  });
}

// Para usar 'await' (esperar), la función que la contiene debe tener la palabra 'async'
async function ejecutarServidor() {
  console.log("1. Iniciando transacción...");

  // Con 'await' le decimos: "Espera a que termine esta función antes de pasar a la siguiente línea"
  let datosPago = await procesarPagoBanco();

  console.log("2. ¡Datos recibidos con éxito!");
  console.log(
    "Pago " +
      datosPago.estado +
      ". Número de transacción: " +
      datosPago.transaccionId +
      ".",
  );
}

ejecutarServidor();
console.log("3. Esperando la confirmación del banco...");
