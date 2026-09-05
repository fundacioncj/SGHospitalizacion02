function $(selector, scope = document) {
  return scope.querySelector(selector);
}

function $all(selector, scope = document) {
  return Array.from(scope.querySelectorAll(selector));
}

function escapeHtml(value) {
  if (value === null || value === undefined) return "";
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function formatearFecha(valor) {
  if (!valor) return "—";
  const fecha = new Date(valor);
  if (Number.isNaN(fecha.getTime())) return valor;
  return fecha.toLocaleDateString("es-EC", { year: "numeric", month: "short", day: "2-digit" });
}

function valorODefault(valor, porDefecto = "—") {
  if (valor === null || valor === undefined || valor === "") return porDefecto;
  return valor;
}

function normalizarEstado(estado) {
  return (estado || "").toString().trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

/** Extrae un arreglo de la respuesta del backend, tolerando distintos formatos. */
function extraerArreglo(datos) {

  if (!datos) return [];

  // Si ya viene como arreglo
  if (Array.isArray(datos)) return datos;

  // Spring Page
  if (Array.isArray(datos.content)) return datos.content;

  // Otros APIs
  if (Array.isArray(datos.data)) return datos.data;

  // Si viene un único objeto (Historia Clínica)
  if (typeof datos === "object") return [datos];

  return [];
}

async function peticionJSON(url, opciones = {}) {
  //console.log("PETICIÓN:", url);

  const respuesta = await fetch(url, {
    headers: { "Content-Type": "application/json", ...(opciones.headers || {}) },
    ...opciones
  });

  if (!respuesta.ok) {
    throw new Error(`El servidor respondió con estado ${respuesta.status}`);
  }

  const texto = await respuesta.text();
  return texto ? JSON.parse(texto) : null;
}

function obtenerNumero(id) {
  const elemento = document.getElementById(id);
  if (!elemento || elemento.value.trim() === "") return null;
  return Number(elemento.value);
}