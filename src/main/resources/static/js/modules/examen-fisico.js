async function buscarExamenFisico() {
  const cedula = validarCedula($("#examCedulaInput").value);
  if (!cedula) return;

  const contenedor = $("#examResultados");
  mostrarSpinner(contenedor, "Buscando exámenes físicos...");

  try {
    const url = `${API.examenFisico.base}${API.examenFisico.buscarCedula}${encodeURIComponent(cedula)}`;
    const datos = await peticionJSON(url);
    const registros = extraerArreglo(datos);

    state.examenFisico = registros;

    if (!registros.length) {
      mostrarEstadoVacio(contenedor, "Sin resultados", `No se encontraron exámenes físicos para la cédula ${cedula}.`, "bi-clipboard2-x");
      return;
    }

    mostrarTablaExamenFisico(registros, contenedor);

  } catch (error) {
    mostrarEstadoVacio(contenedor, "No se pudo consultar el servicio", error.message, "bi-plug");
    mostrarToast("No fue posible conectar con el servicio de examen físico.", "danger");
  }
}

async function cargarExamenesFisicos() {
  const contenedor = $("#examResultados");

  try {
    const datos = await peticionJSON(API.examenFisico.base);
    const registros = extraerArreglo(datos);

    state.examenFisico = registros;

    mostrarTablaExamenFisico(registros, contenedor);

    mostrarToastPendiente();
  } catch (error) {
    mostrarEstadoVacio(contenedor, "Error", error.message, "bi-plug");
  }
}

function mostrarTablaExamenFisico(registros, contenedor) {
  const filas = registros.map((registro, indice) => `
    <tr>
      <td class="text-center">${escapeHtml(valorODefault(registro.numeroHistoriaClinica))}</td>
      <td class="text-center">${escapeHtml(valorODefault(registro.nombrePaciente))}</td>
      <td class="text-center">${escapeHtml(valorODefault(registro.nombreMedico))}</td>
      <td class="text-center">${formatearFecha(registro.fechaRegistro)}</td>
      <td>
          <div class="d-flex justify-content-center">
            <button class="btn btn-info btn-sm" data-accion="ver" data-indice="${indice}" title="Ver detalle" aria-label="Ver detalle">
              <i class="bi bi-eye"></i>
            </button>
            <button class="btn btn-warning btn-sm" data-accion="editar" data-indice="${indice}" title="Editar" aria-label="Editar">
              <i class="bi bi-pencil"></i>
            </button>
            <button class="btn btn-danger btn-sm" data-accion="eliminar" data-indice="${indice}" title="Eliminar" aria-label="Eliminar">
              <i class="bi bi-trash"></i>
            </button>
            <button class="btn btn-primary btn-sm" data-accion="excel" data-indice="${indice}" title="Abrir formulario Excel" aria-label="Abrir formulario Excel">
              <i class="bi bi-file-earmark-spreadsheet"></i>
            </button>
          </div>
        </td>
    </tr>
  `).join("");

  contenedor.innerHTML = `
    <div class="table-responsive">
      <table class="table table-striped table-hover table-bordered align-middle">
        <thead class="thead-light">
          <tr>
            <th class="text-center">N.° Historia Clínica</th>
            <th class="text-center">Paciente</th>
            <th class="text-center">Médico</th>
            <th class="text-center">Fecha Registro</th>
            <th class="text-center">Acción</th>
          </tr>
        </thead>
        <tbody>${filas}</tbody>
      </table>
    </div>
  `;

  contenedor.querySelectorAll("[data-accion]").forEach(boton => {
    boton.addEventListener("click", () => {
      const registro = state.examenFisico[Number(boton.dataset.indice)];
      const accion = boton.dataset.accion;
      if (accion === "ver") {
        abrirPaginaExamenFisico(registro, "ver");
      }
      if (accion === "editar") {
        abrirPaginaExamenFisico(registro, "editar");
      }
      if (accion === "excel") {
          abrirPaginaExamenFisicoExcel(registro);
      }
      if (accion === "eliminar") {
        eliminarExamenFisico(registro);
      }
    });
  });
}

function abrirPaginaExamenFisicoExcel(registro) {
    console.log("ABRIENDO FORMULARIO EXCEL:", registro);

    sessionStorage.setItem(
        "examenFisicoSeleccionado",
        JSON.stringify(registro)
    );

    window.location.href = "/anamnesis-examen-fisico/pdf";
}

function abrirModalVerExamenFisico(registro) {
  const campos = [
    ["Historia Clínica", registro.numeroHistoriaClinica],
    ["Paciente", registro.nombrePaciente],
    ["Cédula", registro.cedulaPaciente],
    ["Médico tratante", registro.nombreMedico],
    ["Fecha de registro", formatearFecha(registro.fechaRegistro)],
    ["Temperatura", registro.temperatura],
    ["Presión arterial", registro.presionArterial],
    ["Pulso", registro.pulso],
    ["Frecuencia respiratoria", registro.frecuenciaRespiratoria],
    ["Peso", registro.peso],
    ["Talla", registro.talla],
    ["IMC", registro.imc],
    ["Pulsioximetría", registro.pulsioximetria]
  ];

  const iconos = {
    "Historia Clínica": "fas fa-file-medical",
    "Paciente": "fas fa-user",
    "Cédula": "fas fa-id-card",
    "Médico tratante": "fas fa-user-md",
    "Fecha de registro": "fas fa-calendar-alt",
    "Temperatura": "fas fa-thermometer-half",
    "Presión arterial": "fas fa-heartbeat",
    "Pulso": "fas fa-wave-square",
    "Frecuencia respiratoria": "fas fa-lungs",
    "Peso": "fas fa-weight",
    "Talla": "fas fa-ruler-vertical",
    "IMC": "fas fa-calculator",
    "Pulsioximetría": "fas fa-lungs"
  };

  document.getElementById("examVerContenido").innerHTML =
    campos.map(([etiqueta, valor]) => `
      <div class="detail-item">
        <div class="detail-label">
          <span class="input-group-text d-inline-flex">
            <i class="${iconos[etiqueta] || 'fas fa-info-circle'}"></i>
          </span>
          <strong class="ml-2">${escapeHtml(etiqueta)}</strong>
        </div>
        <div class="detail-value">${escapeHtml(valorODefault(valor))}</div>
      </div>
    `).join("") +
    `
    <div class="detail-item full-width">
      <div class="detail-label">
        <span class="input-group-text d-inline-flex">
          <i class="fas fa-stethoscope"></i>
        </span>
        <strong class="ml-2">Análisis</strong>
      </div>
      <div class="detail-value">
        ${escapeHtml(valorODefault(registro.analisis, "Sin análisis registrado."))}
      </div>
    </div>

    <div class="detail-item full-width">
      <div class="detail-label">
        <span class="input-group-text d-inline-flex">
          <i class="fas fa-notes-medical"></i>
        </span>
        <strong class="ml-2">Plan de tratamiento</strong>
      </div>
      <div class="detail-value">
        ${escapeHtml(valorODefault(registro.planTratamiento, "Sin plan registrado."))}
      </div>
    </div>
    `;

  abrirModal("modalExamVer");
}

/* ============================================================================
 * EM-01..EM-05 — Widget regional de creación de Examen Físico (tabs 3/4/5 de
 * anamnesis-examen-fisico.html). No modifica listar/buscar/ver de arriba.
 * ==========================================================================*/

const EM_SVG_NS = "http://www.w3.org/2000/svg";

const EM_REGIONES = {
  pielFaneras: { n: "Piel y faneras" }, cabeza: { n: "Cabeza" }, ojos: { n: "Ojos" }, oidos: { n: "Oídos" },
  nariz: { n: "Nariz" }, boca: { n: "Boca" }, orofaringe: { n: "Orofaringe" }, cuello: { n: "Cuello" },
  axilasMamas: { n: "Axilas / Mamas" }, torax: { n: "Tórax" }, abdomen: { n: "Abdomen" },
  columnaVertebral: { n: "Columna vertebral" }, inglePerine: { n: "Ingle / Periné" },
  miembrosSuperiores: { n: "Miembros superiores" }, miembrosInferiores: { n: "Miembros inferiores" },
  organosSentidos: { n: "Órganos de los sentidos", c: "1S" }, respiratorio: { n: "Respiratorio", c: "2S" },
  cardioVascular: { n: "Cardio - Vascular", c: "3S" }, digestivo: { n: "Digestivo", c: "4S" },
  genital: { n: "Genital", c: "5S" }, urinario: { n: "Urinario", c: "6S" },
  musculoEsqueletico: { n: "Músculo - Esquelético", c: "7S" }, endocrino: { n: "Endócrino", c: "8S" },
  hemoLinfatico: { n: "Hemo - Linfático", c: "9S" }, neurologico: { n: "Neurológico", c: "10S" }
};

const EM_GRUPOS = [
  { id: "cabeza", t: "Cabeza", r: ["pielFaneras", "cabeza", "ojos", "oidos", "nariz", "boca", "orofaringe"] },
  { id: "cuello", t: "Cuello", r: ["cuello"] },
  { id: "torax", t: "Tórax", r: ["axilasMamas", "torax"] },
  { id: "abdomen", t: "Abdomen", r: ["abdomen", "columnaVertebral", "inglePerine"] },
  { id: "miembros", t: "Miembros", r: ["miembrosSuperiores", "miembrosInferiores"] },
  { id: "sistemico", t: "Sistémico", r: ["organosSentidos", "respiratorio", "cardioVascular", "digestivo", "genital", "urinario", "musculoEsqueletico", "endocrino", "hemoLinfatico", "neurologico"] }
];

const EM_VIEWBOX = { front: "0 0 200 500", back: "0 0 200 500", left: "0 0 150 500", right: "0 0 150 500" };
const EM_VIEW_LABELS = { front: "Frontal", back: "Posterior", left: "Izquierda", right: "Derecha" };
const EM_ESTADOS = ["normal", "observacion", "patologia"];

const EM_COORDS = {
  front: {
    cabeza: [{ tag: "ellipse", attrs: { cx: 100, cy: 42, rx: 26, ry: 30 } }],
    ojos: [{ tag: "circle", attrs: { cx: 90, cy: 38, r: 3 } }, { tag: "circle", attrs: { cx: 110, cy: 38, r: 3 } }],
    oidos: [{ tag: "ellipse", attrs: { cx: 74, cy: 42, rx: 5, ry: 8 } }, { tag: "ellipse", attrs: { cx: 126, cy: 42, rx: 5, ry: 8 } }],
    nariz: [{ tag: "path", attrs: { d: "M100,40 L95,52 L105,52 Z" } }],
    boca: [{ tag: "rect", attrs: { x: 91, y: 58, width: 18, height: 5, rx: 2.5 } }],
    orofaringe: [{ tag: "circle", attrs: { cx: 100, cy: 66, r: 4 } }],
    cuello: [{ tag: "rect", attrs: { x: 86, y: 70, width: 28, height: 16, rx: 6 } }],
    axilasMamas: [{ tag: "ellipse", attrs: { cx: 66, cy: 100, rx: 9, ry: 13 } }, { tag: "ellipse", attrs: { cx: 134, cy: 100, rx: 9, ry: 13 } }],
    torax: [{ tag: "rect", attrs: { x: 58, y: 88, width: 84, height: 68, rx: 18 } }],
    abdomen: [{ tag: "rect", attrs: { x: 64, y: 156, width: 72, height: 52, rx: 14 } }],
    inglePerine: [{ tag: "rect", attrs: { x: 60, y: 208, width: 80, height: 38, rx: 18 } }],
    miembrosSuperiores: [
      { tag: "rect", attrs: { x: 24, y: 92, width: 28, height: 86, rx: 14 } }, { tag: "rect", attrs: { x: 20, y: 178, width: 26, height: 78, rx: 13 } }, { tag: "ellipse", attrs: { cx: 33, cy: 268, rx: 17, ry: 21 } },
      { tag: "rect", attrs: { x: 148, y: 92, width: 28, height: 86, rx: 14 } }, { tag: "rect", attrs: { x: 154, y: 178, width: 26, height: 78, rx: 13 } }, { tag: "ellipse", attrs: { cx: 167, cy: 268, rx: 17, ry: 21 } }
    ],
    miembrosInferiores: [
      { tag: "rect", attrs: { x: 60, y: 248, width: 36, height: 98, rx: 16 } }, { tag: "rect", attrs: { x: 62, y: 346, width: 32, height: 88, rx: 14 } }, { tag: "ellipse", attrs: { cx: 78, cy: 452, rx: 22, ry: 15 } },
      { tag: "rect", attrs: { x: 104, y: 248, width: 36, height: 98, rx: 16 } }, { tag: "rect", attrs: { x: 106, y: 346, width: 32, height: 88, rx: 14 } }, { tag: "ellipse", attrs: { cx: 122, cy: 452, rx: 22, ry: 15 } }
    ]
  },
  back: {
    cabeza: [{ tag: "ellipse", attrs: { cx: 100, cy: 42, rx: 26, ry: 30 } }],
    cuello: [{ tag: "rect", attrs: { x: 86, y: 70, width: 28, height: 16, rx: 6 } }],
    torax: [{ tag: "rect", attrs: { x: 58, y: 88, width: 84, height: 68, rx: 18 } }],
    abdomen: [{ tag: "rect", attrs: { x: 64, y: 156, width: 72, height: 52, rx: 14 } }],
    inglePerine: [{ tag: "rect", attrs: { x: 60, y: 208, width: 80, height: 38, rx: 18 } }],
    miembrosSuperiores: [
      { tag: "rect", attrs: { x: 148, y: 92, width: 28, height: 86, rx: 14 } }, { tag: "rect", attrs: { x: 154, y: 178, width: 26, height: 78, rx: 13 } }, { tag: "ellipse", attrs: { cx: 167, cy: 268, rx: 17, ry: 21 } },
      { tag: "rect", attrs: { x: 24, y: 92, width: 28, height: 86, rx: 14 } }, { tag: "rect", attrs: { x: 20, y: 178, width: 26, height: 78, rx: 13 } }, { tag: "ellipse", attrs: { cx: 33, cy: 268, rx: 17, ry: 21 } }
    ],
    miembrosInferiores: [
      { tag: "rect", attrs: { x: 104, y: 248, width: 36, height: 98, rx: 16 } }, { tag: "rect", attrs: { x: 106, y: 346, width: 32, height: 88, rx: 14 } }, { tag: "ellipse", attrs: { cx: 122, cy: 452, rx: 22, ry: 15 } },
      { tag: "rect", attrs: { x: 60, y: 248, width: 36, height: 98, rx: 16 } }, { tag: "rect", attrs: { x: 62, y: 346, width: 32, height: 88, rx: 14 } }, { tag: "ellipse", attrs: { cx: 78, cy: 452, rx: 22, ry: 15 } }
    ]
  },
  left: {
    cabeza: [{ tag: "ellipse", attrs: { cx: 88, cy: 42, rx: 24, ry: 28 } }],
    cuello: [{ tag: "rect", attrs: { x: 78, y: 68, width: 20, height: 16, rx: 6 } }],
    torax: [{ tag: "rect", attrs: { x: 58, y: 86, width: 56, height: 68, rx: 18 } }],
    abdomen: [{ tag: "rect", attrs: { x: 60, y: 156, width: 50, height: 52, rx: 14 } }],
    inglePerine: [{ tag: "rect", attrs: { x: 56, y: 208, width: 58, height: 38, rx: 16 } }],
    miembrosSuperiores: [{ tag: "rect", attrs: { x: 36, y: 92, width: 24, height: 86, rx: 12 } }, { tag: "rect", attrs: { x: 32, y: 178, width: 22, height: 78, rx: 11 } }, { tag: "ellipse", attrs: { cx: 43, cy: 268, rx: 15, ry: 19 } }],
    miembrosInferiores: [{ tag: "rect", attrs: { x: 60, y: 248, width: 40, height: 98, rx: 16 } }, { tag: "rect", attrs: { x: 62, y: 346, width: 36, height: 88, rx: 14 } }, { tag: "ellipse", attrs: { cx: 80, cy: 456, rx: 26, ry: 14 } }]
  },
  right: {
    cabeza: [{ tag: "ellipse", attrs: { cx: 62, cy: 42, rx: 24, ry: 28 } }],
    cuello: [{ tag: "rect", attrs: { x: 52, y: 68, width: 20, height: 16, rx: 6 } }],
    torax: [{ tag: "rect", attrs: { x: 36, y: 86, width: 56, height: 68, rx: 18 } }],
    abdomen: [{ tag: "rect", attrs: { x: 40, y: 156, width: 50, height: 52, rx: 14 } }],
    inglePerine: [{ tag: "rect", attrs: { x: 36, y: 208, width: 58, height: 38, rx: 16 } }],
    miembrosSuperiores: [{ tag: "rect", attrs: { x: 90, y: 92, width: 24, height: 86, rx: 12 } }, { tag: "rect", attrs: { x: 96, y: 178, width: 22, height: 78, rx: 11 } }, { tag: "ellipse", attrs: { cx: 107, cy: 268, rx: 15, ry: 19 } }],
    miembrosInferiores: [{ tag: "rect", attrs: { x: 50, y: 248, width: 40, height: 98, rx: 16 } }, { tag: "rect", attrs: { x: 52, y: 346, width: 36, height: 88, rx: 14 } }, { tag: "ellipse", attrs: { cx: 70, cy: 456, rx: 26, ry: 14 } }]
  }
};

let emRegional = {};
let emConstantes = { temperatura: "", presionArterial: "", pulso: "", frecuenciaRespiratoria: "", peso: "", talla: "", imc: "", perimetroCefalico: "", pulsioximetria: "" };
let emDiagnosticos = [];
let emDxAutoId = 0;

function emInitRegional() {
  Object.keys(EM_REGIONES).forEach((id) => { emRegional[id] = { estado: "normal", observacion: "" }; });
}

function emRenderAccordion() {
  const contenedor = $("#examAccordion");
  if (!contenedor) return;
  contenedor.innerHTML = "";
  EM_GRUPOS.forEach((grupo, idx) => {
    const collapseId = "emCollapse-" + grupo.id, headingId = "emHeading-" + grupo.id;
    const card = document.createElement("div");
    card.className = "card mb-1";
    card.innerHTML = `<div class="card-header p-2" id="${headingId}"><h2 class="mb-0"><button class="btn btn-link btn-block text-left p-1${idx === 0 ? "" : " collapsed"}" type="button" data-toggle="collapse" data-target="#${collapseId}" aria-expanded="${idx === 0 ? "true" : "false"}" aria-controls="${collapseId}">${grupo.t}</button></h2></div>`;
    const collapseWrap = document.createElement("div");
    collapseWrap.id = collapseId;
    collapseWrap.className = "collapse" + (idx === 0 ? " show" : "");
    collapseWrap.dataset.parent = "#examAccordion";
    const body = document.createElement("div");
    body.className = "card-body p-2";
    grupo.r.forEach((regionId) => body.appendChild(emBuildRegionRow(regionId)));
    collapseWrap.appendChild(body);
    card.appendChild(collapseWrap);
    contenedor.appendChild(card);
  });
}

function emBuildRegionRow(regionId) {
  const row = document.createElement("label");
  row.className = "region-row mb-0";
  row.dataset.region = regionId;
  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.id = "chkExam-" + regionId;
  checkbox.addEventListener("change", () => emOnCheckboxChange(regionId, checkbox.checked));
  const label = document.createElement("span");
  label.className = "region-row__label";
  const info = EM_REGIONES[regionId];
  label.textContent = info.c ? (info.c + " - " + info.n) : info.n;
  const dot = document.createElement("span");
  dot.className = "region-row__dot";
  dot.dataset.dotFor = regionId;
  row.appendChild(checkbox); row.appendChild(label); row.appendChild(dot);
  return row;
}

function emRenderBody() {
  Object.keys(EM_COORDS).forEach((view) => {
    const container = document.getElementById("examViewport" + view.charAt(0).toUpperCase() + view.slice(1));
    if (!container) return;
    container.innerHTML = "";
    const svg = document.createElementNS(EM_SVG_NS, "svg");
    svg.setAttribute("viewBox", EM_VIEWBOX[view]);
    svg.setAttribute("width", view === "front" || view === "back" ? "260" : "200");
    const regiones = EM_COORDS[view];
    Object.keys(regiones).forEach((regionId) => {
      const g = document.createElementNS(EM_SVG_NS, "g");
      g.setAttribute("class", "region-group");
      g.setAttribute("data-region", regionId);
      g.setAttribute("data-exam-view", view);
      g.setAttribute("tabindex", "0");
      g.setAttribute("role", "button");
      g.setAttribute("aria-label", EM_REGIONES[regionId].n);
      regiones[regionId].forEach((shapeDef) => {
        const shape = document.createElementNS(EM_SVG_NS, shapeDef.tag);
        Object.keys(shapeDef.attrs).forEach((attr) => shape.setAttribute(attr, shapeDef.attrs[attr]));
        shape.setAttribute("class", "region-shape");
        g.appendChild(shape);
      });
      g.addEventListener("click", () => emToggleRegion(regionId));
      g.addEventListener("keydown", (evt) => { if (evt.key === "Enter" || evt.key === " ") { evt.preventDefault(); emToggleRegion(regionId); } });
      g.addEventListener("mouseenter", (evt) => emShowTooltip(evt, EM_REGIONES[regionId].n));
      g.addEventListener("mousemove", emMoveTooltip);
      g.addEventListener("mouseleave", emHideTooltip);
      svg.appendChild(g);
    });
    container.appendChild(svg);
  });
}

function emRenderViewTabs() {
  const tabs = $("#examViewTabs");
  if (!tabs) return;
  tabs.innerHTML = "";
  Object.keys(EM_VIEW_LABELS).forEach((view, idx) => {
    const li = document.createElement("li");
    li.className = "nav-item";
    const a = document.createElement("a");
    a.href = "#";
    a.className = "nav-link py-1 px-2" + (idx === 0 ? " active bg-info" : "");
    a.textContent = EM_VIEW_LABELS[view];
    a.dataset.view = view;
    a.addEventListener("click", (evt) => { evt.preventDefault(); emSetActiveView(view); });
    li.appendChild(a);
    tabs.appendChild(li);
  });
}

function emSetActiveView(view) {
  document.querySelectorAll("#pane-examen-fisico .em-body-view").forEach((v) => { v.hidden = v.dataset.view !== view; });
  document.querySelectorAll("#examViewTabs .nav-link").forEach((t) => {
    t.classList.toggle("active", t.dataset.view === view);
    t.classList.toggle("bg-info", t.dataset.view === view);
  });
}

function emShowTooltip(evt, text) { const t = $("#examTooltip"); if (!t) return; t.textContent = text; t.hidden = false; emMoveTooltip(evt); }
function emMoveTooltip(evt) { const t = $("#examTooltip"); if (!t) return; t.style.left = evt.clientX + "px"; t.style.top = evt.clientY + "px"; }
function emHideTooltip() { const t = $("#examTooltip"); if (t) t.hidden = true; }

function emToggleRegion(regionId) {
  const actual = emRegional[regionId].estado;
  emChangeState(regionId, EM_ESTADOS[(EM_ESTADOS.indexOf(actual) + 1) % EM_ESTADOS.length]);
}

function emChangeState(regionId, nuevoEstado) {
  emRegional[regionId].estado = nuevoEstado;
  emUpdateSVG(regionId); emUpdateCheckbox(regionId); emUpdateDot(regionId); emRenderObservaciones();
}

function emOnCheckboxChange(regionId, checked) {
  if (checked) { if (emRegional[regionId].estado === "normal") emChangeState(regionId, "observacion"); }
  else { emChangeState(regionId, "normal"); emRegional[regionId].observacion = ""; }
}

function emUpdateSVG(regionId) {
  const estado = emRegional[regionId].estado;
  $all('[data-region="' + regionId + '"] .region-shape').forEach((shape) => {
    shape.setAttribute("fill", emColorForEstado(estado));
    shape.setAttribute("stroke", emStrokeForEstado(estado));
  });
}
function emUpdateCheckbox(regionId) { const c = document.getElementById("chkExam-" + regionId); if (c) c.checked = emRegional[regionId].estado !== "normal"; }
function emUpdateDot(regionId) { const d = document.querySelector('[data-dot-for="' + regionId + '"]'); if (d) d.dataset.estado = emRegional[regionId].estado; }
function emColorForEstado(e) { return e === "observacion" ? "#ffc107" : e === "patologia" ? "#dc3545" : "#d7dee6"; }
function emStrokeForEstado(e) { return e === "observacion" ? "#c98d0a" : e === "patologia" ? "#b02a2a" : "#aab6c4"; }

function emRenderObservaciones() {
  const contenedor = $("#examObservaciones");
  if (!contenedor) return;
  const seleccionadas = Object.keys(emRegional).filter((id) => emRegional[id].estado !== "normal");
  contenedor.innerHTML = "";
  if (!seleccionadas.length) { contenedor.innerHTML = '<p class="text-muted small mb-0">Selecciona una región del cuerpo o de la lista regional para registrar una observación.</p>'; return; }
  seleccionadas.forEach((regionId) => {
    const info = EM_REGIONES[regionId];
    const card = document.createElement("div");
    card.className = "em-obs-card";
    const header = document.createElement("div");
    header.className = "em-obs-card__header";
    header.innerHTML = `<span class="region-row__dot" data-estado="${emRegional[regionId].estado}"></span><span>${escapeHtml(info.c ? (info.c + " - " + info.n) : info.n)}</span>`;
    const textarea = document.createElement("textarea");
    textarea.className = "form-control form-control-sm";
    textarea.placeholder = "Describe el hallazgo en " + info.n.toLowerCase() + "...";
    textarea.value = emRegional[regionId].observacion;
    textarea.addEventListener("input", () => { emRegional[regionId].observacion = textarea.value; });
    card.appendChild(header); card.appendChild(textarea);
    contenedor.appendChild(card);
  });
}

function emClearSeleccion() {
  Object.keys(emRegional).forEach((id) => { emRegional[id].estado = "normal"; emRegional[id].observacion = ""; emUpdateSVG(id); emUpdateCheckbox(id); emUpdateDot(id); });
  emRenderObservaciones();
}

/* -- EM-01 Constantes Vitales -- */
function emBindConstantes() {
  const cont = $("#examCvForm");
  if (!cont) return;
  cont.querySelectorAll("[data-field]").forEach((input) => {
    input.addEventListener("input", () => {
      const campo = input.dataset.field;
      if (campo === "imc") return;
      emConstantes[campo] = input.value;
      if (campo === "peso" || campo === "talla") emCalcularIMC();
    });
  });
}

function emCalcularIMC() {
  const peso = parseFloat(emConstantes.peso), tallaCm = parseFloat(emConstantes.talla);
  const imcInput = $("#examCvImc");
  if (!peso || !tallaCm) { emConstantes.imc = ""; if (imcInput) imcInput.value = ""; return; }
  const tallaM = tallaCm / 100;
  emConstantes.imc = (peso / (tallaM * tallaM)).toFixed(2);
  if (imcInput) imcInput.value = emConstantes.imc;
}

/* -- EM-04 Diagnóstico -- */
function emAddDiagnostico() {
  emDiagnosticos.push({ id: "dx-" + (++emDxAutoId), cie: "", descripcion: "", pre: false, def: false });
  emRenderDiagnosticos();
}
function emEliminarDiagnostico(id) { emDiagnosticos = emDiagnosticos.filter((d) => d.id !== id); emRenderDiagnosticos(); }
function emMarcarPreDef(id, campo) {
  const dx = emDiagnosticos.find((d) => d.id === id);
  if (!dx) return;
  dx[campo] = !dx[campo];
  if (campo === "pre" && dx.pre) dx.def = false;
  if (campo === "def" && dx.def) dx.pre = false;
  emRenderDiagnosticos();
}
function emRenderDiagnosticos() {
  const tbody = $("#examDxTableBody");
  if (!tbody) return;
  tbody.innerHTML = "";
  if (!emDiagnosticos.length) { tbody.innerHTML = '<tr><td colspan="5" class="text-muted text-center py-3">Aún no hay diagnósticos registrados. Usa "Agregar diagnóstico".</td></tr>'; return; }
  emDiagnosticos.forEach((dx) => {
    const fila = document.createElement("tr");
    fila.appendChild(emCrearCeldaTextoDx(dx, "cie", "S525"));
    fila.appendChild(emCrearCeldaTextoDx(dx, "descripcion", "Fractura del radio distal"));
    fila.appendChild(emCrearCeldaToggleDx(dx, "pre", "Marcar como presuntivo (PRE)"));
    fila.appendChild(emCrearCeldaToggleDx(dx, "def", "Marcar como definitivo (DEF)"));
    const tdAcciones = document.createElement("td");
    tdAcciones.className = "text-center";
    const btn = document.createElement("button");
    btn.type = "button"; btn.className = "dx-delete"; btn.innerHTML = '<i class="fas fa-trash"></i>';
    btn.addEventListener("click", () => emEliminarDiagnostico(dx.id));
    tdAcciones.appendChild(btn);
    fila.appendChild(tdAcciones);
    tbody.appendChild(fila);
  });
}
function emCrearCeldaTextoDx(dx, campo, placeholder) {
  const td = document.createElement("td");
  const input = document.createElement("input");
  input.type = "text"; input.className = "dx-input"; input.placeholder = placeholder; input.value = dx[campo];
  input.addEventListener("input", () => { dx[campo] = input.value; });
  td.appendChild(input);
  return td;
}
function emCrearCeldaToggleDx(dx, campo, ariaLabel) {
  const td = document.createElement("td");
  td.className = "text-center";
  const btn = document.createElement("button");
  btn.type = "button"; btn.className = "dx-toggle" + (dx[campo] ? " is-active" : ""); btn.textContent = dx[campo] ? "✕" : "";
  btn.setAttribute("aria-label", ariaLabel);
  btn.addEventListener("click", () => emMarcarPreDef(dx.id, campo));
  td.appendChild(btn);
  return td;
}

/* -- Lectura y guardado (EM-01..EM-05) -- */
function leerExamenFisico() {
  const valor = (id) => { const el = document.getElementById(id); return el ? el.value.trim() : ""; };
  const cuerpo = {
    cedulaPaciente: window.datosRegistroClinico?.cedulaPaciente || valor("anCrear_cedulaPaciente"),
    cedulaMedico: window.datosRegistroClinico?.cedulaMedico || valor("anCrear_cedulaMedico"),
    fechaRegistro: window.datosRegistroClinico?.fechaRegistro || valor("anCrear_fechaRegistro"),
    temperatura: emConstantes.temperatura, presionArterial: emConstantes.presionArterial, pulso: emConstantes.pulso,
    frecuenciaRespiratoria: emConstantes.frecuenciaRespiratoria, peso: emConstantes.peso, talla: emConstantes.talla,
    imc: emConstantes.imc, perimetroCefalico: emConstantes.perimetroCefalico, pulsioximetria: emConstantes.pulsioximetria,
    analisis: valor("exam_analisis"),
    planTratamiento: valor("exam_planTratamiento"),
    diagnosticos: emDiagnosticos.map((d) => ({ cie: d.cie, descripcion: d.descripcion, presuntivo: d.pre, definitivo: d.def }))
  };
  Object.keys(EM_REGIONES).forEach((id) => {
    cuerpo[id] = emRegional[id].estado !== "normal";
    cuerpo["descripcion" + id.charAt(0).toUpperCase() + id.slice(1)] = emRegional[id].observacion;
  });
  return cuerpo;
}

// Guarda un nuevo examen físico validando la presencia de la cédula del paciente y del médico, o actualiza uno existente si se cuenta con un ID de edición
// Guarda un nuevo examen físico enviando una petición POST con los datos validados del formulario, o actualiza uno existente si cuenta con un ID de edición
async function guardarExamenFisico() {
  if (window.idExamenEditar) {
    console.log("MODO EDICIÓN EXAMEN FÍSICO. ID:", window.idExamenEditar);
    return await actualizarExamenFisico();
  }

  const cuerpo = leerExamenFisico();

  console.log("=== INICIANDO GUARDADO EXAMEN FÍSICO ===");

  console.log(
    "DATOS REGISTRO CLÍNICO:",
    window.datosRegistroClinico
  );

  console.log(
    "JSON EXAMEN FÍSICO A ENVIAR:",
    JSON.stringify(cuerpo, null, 2)
  );

  if (!cuerpo.cedulaPaciente) {
    console.log(
      "ERROR: CÉDULA PACIENTE VACÍA"
    );

    mostrarToast(
      "Ingresa la cédula del paciente antes de guardar.",
      "warning"
    );

    return false;
  }

  if (!cuerpo.cedulaMedico) {
    console.log(
      "ERROR: CÉDULA MÉDICO VACÍA"
    );

    mostrarToast(
      "Selecciona un médico antes de guardar.",
      "warning"
    );

    return false;
  }

  try {
    console.log(
      "URL EXAMEN FÍSICO:",
      API.examenFisico.base
    );

    console.log(
      "ENVIANDO PETICIÓN POST EXAMEN FÍSICO..."
    );

    const respuesta = await peticionJSON(
      API.examenFisico.base,
      {
        method: "POST",
        body: JSON.stringify(cuerpo)
      }
    );

    console.log(
      "RESPUESTA BACKEND EXAMEN FÍSICO:",
      respuesta
    );

    mostrarToast(
      "El examen físico se registró correctamente.",
      "success"
    );

    console.log(
      "=== EXAMEN FÍSICO GUARDADO CORRECTAMENTE ==="
    );

    return true;

  } catch (error) {
    console.error(
      "ERROR COMPLETO GUARDANDO EXAMEN FÍSICO:",
      error
    );

    mostrarToast(
      "No se pudo registrar el examen físico. " + error.message,
      "danger"
    );

    return false;
  }
}

async function actualizarExamenFisico() {

  const cuerpo = leerExamenFisico();

  try {

    await peticionJSON(
      `${API.examenFisico.base}${API.examenFisico.detalle}${encodeURIComponent(window.idExamenEditar)}`,
      {
        method: "PUT",
        body: JSON.stringify(cuerpo)
      }
    );

    mostrarToast(
      "El examen físico se actualizó correctamente.",
      "success"
    );

    return true;

  } catch (error) {

    console.error(
      "Error actualizando examen físico:",
      error
    );

    mostrarToast(
      "No se pudo actualizar el examen físico.",
      "danger"
    );

    return false;

  }

}

function inicializarExamenFisicoRegional() {
  if (!$("#examAccordion")) return;
  emInitRegional();
    emRenderAccordion();
    emRenderViewTabs();
    emRenderBody();
    emRenderObservaciones();

    emBindConstantes();
    emRenderDiagnosticos();
  const btnAdd = $("#btnAddDiagnosticoExam"); if (btnAdd) btnAdd.addEventListener("click", emAddDiagnostico);
  const btnLimpiar = $("#btnLimpiarExamenFisico"); if (btnLimpiar) btnLimpiar.addEventListener("click", emClearSeleccion);
  const btnGuardar = $("#btnGuardarExamenFisico"); if (btnGuardar) btnGuardar.addEventListener("click", guardarExamenFisico);
}

function abrirPaginaExamenFisico(registro, modo) {
  // console.log("ABRIENDO EXAMEN FISICO:",registro);
  sessionStorage.setItem(
    "examenFisicoSeleccionado",
    JSON.stringify(registro)
  );
  // console.log(
  //   "SESSION GUARDADO:",
  //   sessionStorage.getItem("examenFisicoSeleccionado")
  // );
  window.location.href =
    `/anamnesis-examen-fisico?modulo=examenfisico&modo=${modo}`;
}

function mostrarToastPendiente() {
  const toastPendiente = sessionStorage.getItem("toastPendiente");

  if (!toastPendiente) return;

  sessionStorage.removeItem("toastPendiente");

  try {
    const datos = JSON.parse(toastPendiente);

    mostrarToast(datos.mensaje, datos.tipo);
  } catch (error) {
    console.error("Error mostrando toast pendiente:", error);
  }
}

// document.addEventListener("DOMContentLoaded", () => {
//     const registro = sessionStorage.getItem("examenFisicoSeleccionado");

//     if (!registro) {
//         return;
//     }

//     try {
//         const examen = JSON.parse(registro);

//         if (!examen.id) {
//             return;
//         }

//         setTimeout(async () => {
//             await descargarPDF();
//         }, 800);

//     } catch (error) {
//         console.error(
//             "ERROR AL DESCARGAR PDF AUTOMÁTICAMENTE:",
//             error
//         );
//     }
// });

