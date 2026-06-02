// Función que simula la petición a un servidor que va a fallar tras 1 segundo
function contactarServidorExterno() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      reject(new Error("No hay conexión a internet (Error 404)"));
    }, 3000);
  });
}

async function obtenerDatosDeInternet() {
  try {
    console.log("Intentando conectar al sevidor externo...");
    let respuesta = await contactarServidorExterno();
    console.log("Respuesta del servidor: " + respuesta);
  } catch (error) {
    console.log("Error controlado: " + error.message);
  }
}

obtenerDatosDeInternet();
