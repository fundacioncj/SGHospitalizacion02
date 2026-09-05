document.addEventListener("DOMContentLoaded", () => {
  if ($("#hospEditarContenido")) {
    cargarHospitalizacionEditar();
  }
});

async function cargarHospitalizacionEditar() {
  const contenedor = $("#hospEditarContenido");
  const seleccionado = sessionStorage.getItem("hospitalizacionSeleccionada");

  if (!seleccionado) {
    mostrarErrorEditarHospitalizacion("No se seleccionó ninguna hospitalización.");
    return;
  }

  let datosSeleccionados;

  try {
    datosSeleccionados = JSON.parse(seleccionado);
  } catch (error) {
    console.error("Error leyendo hospitalización seleccionada:", error);
    mostrarErrorEditarHospitalizacion("No fue posible identificar la hospitalización.");
    return;
  }

  const id = datosSeleccionados.id;

  if (!id) {
    mostrarErrorEditarHospitalizacion("No se encontró la hospitalización seleccionada.");
    return;
  }

  mostrarCargandoEditarHospitalizacion(contenedor);

  try {
    const url = `${API.hospitalizacion.base}${API.hospitalizacion.detalle}${encodeURIComponent(id)}`;
    const registro = await peticionJSON(url);

    construirFormularioEditarHospitalizacion(registro);
  } catch (error) {
    console.error("Error cargando hospitalización:", error);
    mostrarErrorEditarHospitalizacion(
      error.message || "No fue posible obtener la información."
    );
  }
}

function construirFormularioEditarHospitalizacion(registro) {
  const contenedor = $("#hospEditarContenido");

  contenedor.innerHTML = `
    <div class="card card-info card-outline">
      <div class="card-header">
        <h3 class="card-title">
          <i class="fas fa-edit mr-2"></i>
          Editar datos de la hospitalización
        </h3>
      </div>

      <form id="formHospEditar" autocomplete="off">
        <div class="card-body">

          <div class="row">
            <div class="col-md-4">${crearCampoEditarHospitalizacion("N.° de ingreso", "fas fa-hospital", registro.numeroIngreso, true)}</div>
            <div class="col-md-4">${crearCampoEditarHospitalizacion("Cédula del paciente", "fas fa-id-card", registro.cedulaPaciente, true)}</div>
            <div class="col-md-4">${crearCampoEditarHospitalizacion("Paciente", "fas fa-user", registro.nombrePaciente, true)}</div>
          </div>

          <div class="row">
            <div class="col-md-6">${crearCampoEditarHospitalizacion("Médico tratante", "fas fa-user-md", registro.nombreMedico, true)}</div>
            <div class="col-md-6">${crearSelectEstadoHospitalizacion(registro.estado)}</div>
          </div>

          <div class="row">
            <div class="col-md-6">${crearCampoEditarHospitalizacion("Fecha de ingreso", "fas fa-calendar-alt", registro.fechaIngreso ? registro.fechaIngreso.substring(0, 10) : "", true, "date")}</div>
            <div class="col-md-6">${crearCampoFechaEgreso(registro.fechaEgreso)}</div>
          </div>

          ${crearTextareaEditarHospitalizacion("Sala / habitación", "fas fa-bed", registro.salaHabitacion)}

          ${crearTextareaEditarHospitalizacion("Motivo de ingreso", "fas fa-notes-medical", registro.motivoIngreso, true)}

          ${crearTextareaEditarHospitalizacion("Diagnóstico principal", "fas fa-stethoscope", registro.diagnosticoPrincipal)}

          ${crearTextareaEditarHospitalizacion("Observaciones", "fas fa-sticky-note", registro.observaciones, false, "Sin observaciones registradas.")}

          <input type="hidden" id="hospEditarId" value="${escapeHtml(valorODefault(registro.id, ""))}">

        </div>

        <div class="card-footer text-right">
          <button type="button" class="btn btn-default" onclick="volverHospitalizaciones()">
            <i class="fas fa-arrow-left mr-1"></i>
            Cancelar
          </button>

          <button type="submit" class="btn btn-info">
            <i class="fas fa-save mr-1"></i>
            Guardar cambios
          </button>
        </div>
      </form>
    </div>
  `;

  $("#formHospEditar").addEventListener(
    "submit",
    guardarEdicionHospitalizacion
  );
}

function crearCampoEditarHospitalizacion(label, icono, valor, readonly = false, tipo = "text") {
  return `
    <div class="form-group">
      <label class="form-label-sm">${escapeHtml(label)}</label>
      <div class="input-group">
        <div class="input-group-prepend">
          <span class="input-group-text"><i class="${icono}"></i></span>
        </div>
        <input type="${tipo}" class="form-control form-control-sm" value="${escapeHtml(valorODefault(valor, ""))}" ${readonly ? "readonly" : ""}>
      </div>
    </div>
  `;
}

function crearSelectEstadoHospitalizacion(estado) {
  const estadoActual = valorODefault(estado, "ACTIVO");

  return `
    <div class="form-group">
      <label class="form-label-sm" for="hospEditarEstado">Estado</label>
      <div class="input-group">
        <div class="input-group-prepend">
          <span class="input-group-text"><i class="fas fa-clipboard-check"></i></span>
        </div>
        <select id="hospEditarEstado" class="form-control form-control-sm">
          <option value="ACTIVO" ${estadoActual === "ACTIVO" ? "selected" : ""}>Activo</option>
          <option value="ALTA" ${estadoActual === "Alta" ? "selected" : ""}>Alta</option>
          <option value="TRASLADADO" ${estadoActual === "TRASLADADO" ? "selected" : ""}>Trasladado</option>
          <option value="FALLECIDO" ${estadoActual === "FALLECIDO" ? "selected" : ""}>Fallecido</option>
        </select>
      </div>
    </div>
  `;
}

function crearCampoFechaEgreso(fecha) {
  return `
    <div class="form-group">
      <label class="form-label-sm" for="hospEditarFechaEgreso">Fecha de egreso</label>
      <div class="input-group">
        <div class="input-group-prepend">
          <span class="input-group-text"><i class="fas fa-calendar-check"></i></span>
        </div>
        <input type="date" id="hospEditarFechaEgreso" class="form-control form-control-sm" value="${fecha ? fecha.substring(0, 10) : ""}">
      </div>
    </div>
  `;
}

function crearTextareaEditarHospitalizacion(label, icono, valor, readonly = false, valorDefault = "Sin información") {
  return `
    <div class="form-group">
      <label class="form-label-sm">${escapeHtml(label)}</label>
      <div class="input-group">
        <div class="input-group-prepend">
          <span class="input-group-text"><i class="${icono}"></i></span>
        </div>
        <textarea class="form-control form-control-sm" rows="2" ${readonly ? "readonly" : ""}>${escapeHtml(valorODefault(valor, valorDefault))}</textarea>
      </div>
    </div>
  `;
}

async function guardarEdicionHospitalizacion(evento) {
  evento.preventDefault();

  const id = $("#hospEditarId").value;

  if (!id) {
    mostrarToast("No se encontró el identificador de la hospitalización.", "danger");
    return;
  }

  const campos = $("#formHospEditar").querySelectorAll("input, textarea");

  const obtenerCampo = (label) => {
    const campo = [...campos].find(
      elemento =>
        elemento.closest(".form-group")
          ?.querySelector("label")
          ?.textContent
          .trim() === label
    );

    return campo ? campo.value : "";
  };

  const cuerpo = {
    fechaEgreso: $("#hospEditarFechaEgreso").value || null,
    diagnosticoPrincipal: obtenerCampo("Diagnóstico principal"),
    salaHabitacion: obtenerCampo("Sala / habitación"),
    estado: $("#hospEditarEstado").value,
    observaciones: obtenerCampo("Observaciones")
  };

  console.log("HOSPITALIZACIÓN A ACTUALIZAR:", JSON.stringify(cuerpo, null, 2));

  try {
    const url = `${API.hospitalizacion.base}${API.hospitalizacion.detalle}${encodeURIComponent(id)}`;

    await peticionJSON(url, {
      method: "PUT",
      body: JSON.stringify(cuerpo)
    });

    window.location.href = "/hospitalizacion?actualizado=1";

  } catch (error) {
    console.error("Error actualizando hospitalización:", error);
    mostrarToast("No se pudo actualizar la hospitalización. " + error.message, "danger");
  }
}

function mostrarCargandoEditarHospitalizacion(contenedor) {
  contenedor.innerHTML = `
    <div class="card card-info card-outline">
      <div class="card-body text-center py-5">
        <i class="fas fa-spinner fa-spin fa-2x mb-3"></i>
        <h5>Cargando hospitalización...</h5>
        <p class="text-muted mb-0">Obteniendo información para editar.</p>
      </div>
    </div>
  `;
}

function mostrarErrorEditarHospitalizacion(mensaje) {
  const contenedor = $("#hospEditarContenido");

  contenedor.innerHTML = `
    <div class="card card-danger card-outline">
      <div class="card-body text-center py-5">
        <i class="fas fa-exclamation-triangle fa-2x mb-3"></i>
        <h5>No se pudo cargar la hospitalización</h5>
        <p class="text-muted">${escapeHtml(mensaje)}</p>
        <button type="button" class="btn btn-secondary" onclick="volverHospitalizaciones()">
          <i class="fas fa-arrow-left mr-1"></i>
          Volver
        </button>
      </div>
    </div>
  `;
}

function volverHospitalizaciones() {
  window.location.href = "/hospitalizacion";
}