async function buscarHospitalizacion() {
  const cedula = validarCedula($("#hospCedulaInput").value);
  if (!cedula) return;

  const contenedor = $("#hospResultados");
  mostrarSpinner(contenedor, "Buscando hospitalizaciones...");

  try {
    const url = `${API.hospitalizacion.base}${API.hospitalizacion.buscarCedula}${encodeURIComponent(cedula)}`;
    const datos = await peticionJSON(url);
    const registros = extraerArreglo(datos);
    state.hospitalizacion = registros;

    if (registros.length === 0) {
      mostrarEstadoVacio(contenedor, "Sin resultados", `No se encontraron hospitalizaciones para la cédula ${cedula}.`, "bi-clipboard2-x");
      return;
    }
    mostrarTablaHospitalizacion(registros, contenedor);
  } catch (error) {
    mostrarEstadoVacio(contenedor, "No se pudo consultar el servicio", error.message, "bi-plug");
    mostrarToast("No fue posible conectar con el servicio de hospitalización.", "danger");
  }
}

function mostrarTablaHospitalizacion(registros, contenedor) {
  const filas = registros.map((registro, indice) => {
    const estadoClase = normalizarEstado(registro.estado).replace(/\s+/g, "-");
    return `
      <tr data-indice="${indice}">
        <td class="patient-id text-center">${escapeHtml(valorODefault(registro.numeroIngreso))}</td>
        
        <td class="text-center">${escapeHtml(valorODefault(registro.nombrePaciente))}</td>
        <td class="text-center">
          ${escapeHtml(valorODefault(registro.nombreMedico))}
        </td>
        <td class="text-center"><span class="badge-estado ${escapeHtml(estadoClase)}">${escapeHtml(valorODefault(registro.estado, "Sin estado"))}</span></td>
        <td class="text-center">${formatearFecha(registro.fechaIngreso)}</td>
        
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
          </div>
        </td>
      </tr>
    `;
  }).join("");

  contenedor.innerHTML = `
    <div class="table-responsive">
      <table class="table table-striped table-hover table-bordered align-middle">
        <thead class="thead-light">
          <tr>
            <th class="text-center">N.° Ingreso</th>
            <th class="text-center">Paciente</th>
            <th class="text-center">Médico</th>
            <th class="text-center">Estado</th>
            <th class="text-center">Fecha ingreso</th>
            <th class="text-center">Acciones</th>
          </tr>
        </thead>
        <tbody>${filas}</tbody>
      </table>
    </div>
  `;

  contenedor.querySelectorAll("[data-accion]").forEach(boton => {
    boton.addEventListener("click", () => {
      const registro = state.hospitalizacion[Number(boton.dataset.indice)];
      const accion = boton.dataset.accion;
      // if (accion === "ver") abrirModalVerHospitalizacion(registro);
      if (accion === "ver") {
        sessionStorage.setItem("hospitalizacionSeleccionada", JSON.stringify(registro));
        window.location.href = "/hospitalizacion/verHospitalizacion";
      }
      // if (accion === "editar") abrirModalEditarHospitalizacion(registro);
      if (accion === "editar") {
        sessionStorage.setItem("hospitalizacionSeleccionada", JSON.stringify(registro));
        window.location.href = "/hospitalizacion/editarHospitalizacion";
      }
      if (accion === "eliminar") solicitarEliminacion("hospitalizacion", registro, boton.closest("tr"), `hospitalización N.° ${registro.numeroIngreso}`);
    });
  });
}

function abrirModalVerHospitalizacion(registro) {
  const campos = [
    ["N.° de ingreso", registro.numeroIngreso],
    ["Paciente", registro.nombrePaciente],
    ["Cédula", registro.cedulaPaciente],
    ["Médico tratante", registro.nombreMedico],
    ["Fecha de ingreso", formatearFecha(registro.fechaIngreso)],
    ["Fecha de egreso", registro.fechaEgreso ? formatearFecha(registro.fechaEgreso) : "En curso"],
    ["Motivo de ingreso", registro.motivoIngreso],
    ["Diagnóstico principal", registro.diagnosticoPrincipal],
    ["Sala / habitación", registro.salaHabitacion],
    ["Estado", registro.estado]
  ];

  const iconos = {
    "N.° de ingreso": "fas fa-hospital",
    "Paciente": "fas fa-user",
    "Cédula": "fas fa-id-card",
    "Médico tratante": "fas fa-user-md",
    "Fecha de ingreso": "fas fa-calendar-alt",
    "Fecha de egreso": "fas fa-calendar-check",
    "Motivo de ingreso": "fas fa-notes-medical",
    "Diagnóstico principal": "fas fa-stethoscope",
    "Sala / habitación": "fas fa-bed",
    "Estado": "fas fa-heartbeat"
  };

  document.getElementById("hospVerContenido").innerHTML =
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
          <i class="fas fa-comment-medical"></i>
        </span>
        <strong class="ml-2">Observaciones</strong>
      </div>
      <div class="detail-value">
        ${escapeHtml(valorODefault(registro.observaciones, "Sin observaciones registradas."))}
      </div>
    </div>
    `;

  abrirModal("modalHospVer");
}

function abrirModalEditarHospitalizacion(registro) {
  $("#hospEditarSubtitle").textContent = `${registro.nombrePaciente || ""} · N.° ${valorODefault(registro.numeroIngreso)}`;
  llenarFormularioHospitalizacion(registro);
  abrirModal("modalHospEditar");
}

function llenarFormularioHospitalizacion(registro) {
  $("#hospEditId").value = valorODefault(registro.id, "");
  $("#hospEditFechaEgreso").value = registro.fechaEgreso ? registro.fechaEgreso.substring(0, 10) : "";
  $("#hospEditEstado").value = registro.estado || "Hospitalizado";
  $("#hospEditSala").value = registro.salaHabitacion || "";
  $("#hospEditDiagnostico").value = registro.diagnosticoPrincipal || "";
  $("#hospEditObservaciones").value = registro.observaciones || "";
}

async function guardarHospitalizacion(evento) {
  evento.preventDefault();
  const id = $("#hospEditId").value;
  const cuerpo = {
    fechaEgreso: $("#hospEditFechaEgreso").value || null,
    diagnosticoPrincipal: $("#hospEditDiagnostico").value,
    salaHabitacion: $("#hospEditSala").value,
    estado: $("#hospEditEstado").value,
    observaciones: $("#hospEditObservaciones").value
  };

  try {
    const url = `${API.hospitalizacion.base}${API.hospitalizacion.detalle}${encodeURIComponent(id)}`;
    await peticionJSON(url, { method: "PUT", body: JSON.stringify(cuerpo) });
    mostrarToast("La hospitalización se actualizó correctamente.", "success");
    cerrarModal("modalHospEditar");
    await cargarHospitalizaciones();
  } catch (error) {
    mostrarToast("No se pudo guardar la actualización. " + error.message, "danger");
  }
}

async function registrarHospitalizacion(evento) {
  evento.preventDefault();

  const cedulaPaciente = validarCedula($("#hospCrearCedulaPaciente").value);
  if (!cedulaPaciente) return;

  const cuerpo = {
    cedulaPaciente,
    cedulaMedico: $("#hospCrearMedico").value || "",
    fechaIngreso: $("#hospCrearFechaIngreso").value,
    motivoIngreso: $("#hospCrearMotivoIngreso").value,
    diagnosticoPrincipal: $("#hospCrearDiagnostico").value,
    salaHabitacion: $("#hospCrearSala").value,
    observaciones: $("#hospCrearObservaciones").value
  };

  try {
    await peticionJSON(API.hospitalizacion.crear, { method: "POST", body: JSON.stringify(cuerpo) });
    mostrarToast("La hospitalización se registró correctamente.", "success");
    $("#formHospCrear").reset();
    consultarPacientePorCedula("", "hospCrearPacienteInfo");
  } catch (error) {
    mostrarToast("No se pudo registrar la hospitalización. " + error.message, "danger");
  }
}

async function cargarHospitalizaciones() {
  const contenedor = $("#hospResultados");

  try {
    const datos = await peticionJSON(API.hospitalizacion.base);
    const registros = extraerArreglo(datos);
    state.hospitalizacion = registros;
    mostrarTablaHospitalizacion(registros, contenedor);

    const params = new URLSearchParams(window.location.search);

    if (params.get("actualizado") === "1") {
      mostrarToast("La hospitalización se actualizó correctamente.", "success");
      window.history.replaceState({}, document.title, "/hospitalizacion");
    }

  } catch (error) {
    mostrarEstadoVacio(contenedor, "Error", error.message, "bi-plug");
  }
}

function mostrarToastActualizacionHospitalizacion() {
  const parametros = new URLSearchParams(window.location.search);

  if (parametros.get("actualizado") !== "1") return;

  mostrarToast(
    "La hospitalización se actualizó correctamente.",
    "success"
  );

  window.history.replaceState(
    {},
    document.title,
    window.location.pathname
  );
}