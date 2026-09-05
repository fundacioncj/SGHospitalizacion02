function validarCedula(cedula) {
  const limpia = (cedula || "").trim();
  if (!limpia) {
    mostrarToast("Ingresa un número de cédula para buscar.", "danger", "Campo requerido");
    return null;
  }
  return limpia;
}