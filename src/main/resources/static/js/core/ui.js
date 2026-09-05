/**
 * ============================================================
 * UI - UTILIDADES VISUALES
 * ============================================================
 */

/**
 * mostrarToast(mensaje, tipo, titulo)
 * tipo: "success" | "danger" | "info"
 */
/**
 * mostrarToast(mensaje, tipo)
 * tipo: "success" | "danger" | "info"
 */
function mostrarToast(mensaje, tipo = "info", titulo = null) {
  const iconos = {
    success: "bi-check-circle-fill",
    danger: "bi-x-circle-fill",
    info: "bi-info-circle-fill"
  };

  const titulos = {
    success: titulo || "Operación exitosa",
    danger: titulo || "Ocurrió un error",
    info: titulo || "Información"
  };

  let contenedor = $("#toastContainer");

  // Si la página no tiene el contenedor, lo crea sin afectar las demás páginas
  if (!contenedor) {
    contenedor = document.createElement("div");
    contenedor.id = "toastContainer";
    contenedor.className = "toast-container position-fixed top-0 end-0 p-3";
    contenedor.style.zIndex = "9999";
    document.body.appendChild(contenedor);
  }

  const toastEl = document.createElement("div");
  toastEl.className = `toast toast-clinical ${tipo}`;
  toastEl.setAttribute("role", "alert");
  toastEl.setAttribute("aria-live", "assertive");
  toastEl.setAttribute("aria-atomic", "true");

  toastEl.innerHTML = `
    <div class="toast-header">
      <i class="bi ${iconos[tipo] || iconos.info} me-2"></i>
      <strong class="me-auto">${escapeHtml(titulos[tipo])}</strong>
      <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Cerrar"></button>
    </div>
    <div class="toast-body">${escapeHtml(mensaje)}</div>
  `;

  contenedor.appendChild(toastEl);

  // Bootstrap 5
  if (typeof bootstrap !== "undefined" && bootstrap.Toast) {
    const toast = new bootstrap.Toast(toastEl, { delay: 4200 });
    toast.show();

    toastEl.addEventListener("hidden.bs.toast", () => {
      toastEl.remove();
    });

    return;
  }

  // Respaldo por si alguna página no tiene Bootstrap JS disponible
  toastEl.classList.add("show");
  setTimeout(() => {
    toastEl.remove();
  }, 4200);
}

function mostrarSpinner(contenedor, mensaje = "Consultando información...") {
  if (!contenedor) return;

  contenedor.innerHTML = `
    <div class="spinner-wrap">
      <div class="spinner-clinical" role="status" aria-label="Cargando"></div>
      <span>${escapeHtml(mensaje)}</span>
    </div>
  `;
}

function mostrarEstadoVacio(contenedor, titulo, descripcion, icono = "bi-inbox") {
  if (!contenedor) return;

  contenedor.innerHTML = `
    <div class="empty-state">
      <i class="bi ${icono}"></i>
      <h4>${escapeHtml(titulo)}</h4>
      <p>${escapeHtml(descripcion)}</p>
    </div>
  `;
}

function listaComoHtml(lista, vacio = "No registra elementos.") {
  if (!Array.isArray(lista) || lista.length === 0) {
    return `<span class="text-muted fst-italic">${escapeHtml(vacio)}</span>`;
  }

  return `<ul class="mb-0 ps-3">${lista.map(item => `${escapeHtml(item)}`).join("")}</ul>`;
}

function inicializarRelojEncabezado() {
  const elemento = $("#navClockReadout");

  // Algunas páginas pueden no tener reloj en el encabezado
  if (!elemento) return;

  function actualizar() {
    const ahora = new Date();

    elemento.textContent = ahora.toLocaleTimeString("es-EC", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
    });
  }

  actualizar();
  setInterval(actualizar, 1000);
}

/**
 * Spinner de carga
 */
function mostrarSpinner(contenedor, mensaje = "Consultando información...") {
  if (!contenedor) return;

  contenedor.innerHTML = `
    <div class="spinner-wrap">
      <div class="spinner-clinical" role="status" aria-label="Cargando"></div>
      <span>${escapeHtml(mensaje)}</span>
    </div>
  `;
}

/**
 * Estado vacío
 */
function mostrarEstadoVacio(
  contenedor,
  titulo,
  descripcion,
  icono = "bi-inbox"
) {
  if (!contenedor) return;

  contenedor.innerHTML = `
    <div class="empty-state">
      <i class="bi ${icono}"></i>
      <h4>${escapeHtml(titulo)}</h4>
      <p>${escapeHtml(descripcion)}</p>
    </div>
  `;
}

/**
 * Convierte una lista a HTML
 */
function listaComoHtml(lista, vacio = "No registra elementos.") {
  if (!Array.isArray(lista) || lista.length === 0) {
    return `<span class="text-muted fst-italic">${escapeHtml(vacio)}</span>`;
  }

  return `
    <ul class="mb-0 ps-3">
      ${lista.map(item => `${escapeHtml(item)}`).join("")}
    </ul>
  `;
}

/**
 * ============================================================
 * RELOJ DEL ENCABEZADO
 * ============================================================
 */
function inicializarRelojEncabezado() {
  const elemento = $("#navClockReadout");

  // Algunas páginas pueden no tener reloj.
  // En ese caso no hacemos nada.
  if (!elemento) return;

  function actualizar() {
    const ahora = new Date();

    elemento.textContent = ahora.toLocaleTimeString("es-EC", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
    });
  }

  actualizar();
  setInterval(actualizar, 1000);
}