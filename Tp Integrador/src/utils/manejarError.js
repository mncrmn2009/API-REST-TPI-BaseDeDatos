export const manejarError = (error, mensajeBase) => {
  if (error.name === "ValidationError" || error.code === 11000) {
    error.status = 400;
    error.message = "Datos inválidos o duplicados";
  } else if (error.name === "CastError") {
    error.status = 400;
    error.message = "El ID proporcionado no es válido";
  } else {
    error.status = 500;
    error.message = mensajeBase;
  }
  return error;
};