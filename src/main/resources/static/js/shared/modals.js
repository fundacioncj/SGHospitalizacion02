function abrirModal(id) {
  const modal = document.getElementById(id);
  jQuery(modal).modal("show");
}

function cerrarModal(id) {
  const modal = document.getElementById(id);
  jQuery(modal).modal("hide");
}

function solicitarEliminacion(tipo, registro, filaElemento, descripcion) {
  state.eliminarPendiente = { tipo, registro, filaElemento };
  $("#confirmarEliminarTexto").textContent = `¿Deseas eliminar la ${descripcion}? Esta acción no se puede deshacer.`;
  abrirModal("modalConfirmarEliminar");
}

function simularEliminar() {
  if (!state.eliminarPendiente) return;
  const { tipo, filaElemento } = state.eliminarPendiente;

  if (filaElemento) {
    filaElemento.style.transition = "opacity 0.25s ease";
    filaElemento.style.opacity = "0";
    setTimeout(() => filaElemento.remove(), 220);
  }

  cerrarModal("modalConfirmarEliminar");
  mostrarToast("El registro fue eliminado (simulación local).", "success", "Registro eliminado");
  state.eliminarPendiente = null;
}