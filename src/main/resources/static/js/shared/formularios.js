function crearItemLista(valor = "", placeholder = "") {
  const item = document.createElement("div");
  item.className = "dynamic-list-item";
  item.innerHTML = `
    <input type="text" value="${escapeHtml(valor)}" placeholder="${escapeHtml(placeholder)}">
    <button type="button" class="btn-icon danger btn-remove-item" title="Eliminar" aria-label="Eliminar elemento">
      <i class="bi bi-x-lg"></i>
    </button>
  `;
  item.querySelector(".btn-remove-item").addEventListener("click", () => {
    const contenedor = item.parentElement;
    item.remove();
    mostrarVacioSiCorresponde(contenedor);
  });
  return item;
}

function mostrarVacioSiCorresponde(contenedor) {
  const yaTieneAviso = contenedor.querySelector(".dynamic-list-empty");
  if (contenedor.children.length === 0 && !yaTieneAviso) {
    const aviso = document.createElement("p");
    aviso.className = "dynamic-list-empty";
    aviso.textContent = "No se han agregado elementos todavía.";
    contenedor.appendChild(aviso);
  }
}

function llenarListaDinamica(idContenedor, valores, placeholder) {
  const contenedor = $("#" + idContenedor);
  contenedor.innerHTML = "";
  const lista = Array.isArray(valores) ? valores : [];
  if (lista.length === 0) {
    mostrarVacioSiCorresponde(contenedor);
    return;
  }
  lista.forEach(valor => contenedor.appendChild(crearItemLista(valor, placeholder)));
}

function leerListaDinamica(idContenedor) {
  return $all("#" + idContenedor + " input[type='text']")
    .map(input => input.value.trim())
    .filter(valor => valor.length > 0);
}

function inicializarBotonesAgregarItem() {
  $all(".btn-add-item").forEach(boton => {
    boton.addEventListener("click", () => {
      const contenedor = $("#" + boton.dataset.addTarget);
      const aviso = contenedor.querySelector(".dynamic-list-empty");
      if (aviso) aviso.remove();
      const nuevoItem = crearItemLista("", boton.dataset.placeholder || "");
      contenedor.appendChild(nuevoItem);
      nuevoItem.querySelector("input").focus();
    });
  });
}