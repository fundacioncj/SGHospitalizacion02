document.addEventListener("DOMContentLoaded", () => {
  if ($("#hospVerContenido")) cargarHospitalizacionDetalle();
});

async function cargarHospitalizacionDetalle() {
  const contenedor = $("#hospVerContenido");
  const seleccionado = sessionStorage.getItem("hospitalizacionSeleccionada");

  if (!seleccionado) {
    mostrarErrorHospitalizacion("No se seleccionó ninguna hospitalización.");
    return;
  }

  mostrarCargandoHospitalizacion(contenedor);

  try {
    const datos = JSON.parse(seleccionado);
    const id = datos.id;

    if (!id) {
      throw new Error("No se encontró el registro seleccionado.");
    }

    const url = `${API.hospitalizacion.base}${API.hospitalizacion.detalle}${encodeURIComponent(id)}`;
    const registro = await peticionJSON(url);

    construirVistaHospitalizacion(registro);
  } catch (error) {
    console.error("Error cargando hospitalización:", error);
    mostrarErrorHospitalizacion(error.message || "No fue posible obtener la información.");
  }
}

function construirVistaHospitalizacion(registro) {
  const contenedor = $("#hospVerContenido");

  contenedor.innerHTML = `
    <div class="card card-info card-outline">
      <div class="card-header">
        <h3 class="card-title">
          <i class="fas fa-hospital mr-2"></i>
          Información de la hospitalización
        </h3>
      </div>

      <div class="card-body">
        <div class="row">
          <div class="col-md-4">
            ${crearCampoHospitalizacion("N.° de ingreso", "fas fa-hospital", registro.numeroIngreso)}
          </div>
          <div class="col-md-4">
            ${crearCampoHospitalizacion("Cédula del paciente", "fas fa-id-card", registro.cedulaPaciente)}
          </div>
          <div class="col-md-4">
            ${crearCampoHospitalizacion("Paciente", "fas fa-user", registro.nombrePaciente)}
          </div>
        </div>

        <div class="row">
          <div class="col-md-6">
            ${crearCampoHospitalizacion("Médico tratante", "fas fa-user-md", registro.nombreMedico)}
          </div>
          <div class="col-md-6">
            ${crearCampoHospitalizacion("Estado", "fas fa-heartbeat", registro.estado)}
          </div>
        </div>

        <div class="row">
          <div class="col-md-6">
            ${crearCampoHospitalizacion(
              "Fecha de ingreso",
              "fas fa-calendar-alt",
              registro.fechaIngreso ? formatearFecha(registro.fechaIngreso) : "Sin información"
            )}
          </div>
          <div class="col-md-6">
            ${crearCampoHospitalizacion(
              "Fecha de egreso",
              "fas fa-calendar-check",
              registro.fechaEgreso ? formatearFecha(registro.fechaEgreso) : "En curso"
            )}
          </div>
        </div>

        ${crearCampoHospitalizacion("Sala / habitación", "fas fa-bed", registro.salaHabitacion)}

        ${crearTextareaHospitalizacion(
          "Motivo de ingreso",
          "fas fa-notes-medical",
          registro.motivoIngreso
        )}

        ${crearTextareaHospitalizacion(
          "Diagnóstico principal",
          "fas fa-stethoscope",
          registro.diagnosticoPrincipal
        )}

        ${crearTextareaHospitalizacion(
          "Observaciones",
          "fas fa-sticky-note",
          registro.observaciones,
          "Sin observaciones registradas."
        )}
      </div>

      <div class="card-footer text-right">
        <button type="button" class="btn btn-default" onclick="volverHospitalizaciones()">
          <i class="fas fa-arrow-left mr-1"></i>
          Volver
        </button>

        <button type="button" class="btn btn-warning" onclick="editarHospitalizacion()">
          <i class="fas fa-edit mr-1"></i>
          Editar
        </button>
      </div>
    </div>
  `;
}

function crearCampoHospitalizacion(label, icono, valor, valorDefault = "Sin información") {
  return `
    <div class="form-group">
      <label class="form-label-sm">${escapeHtml(label)}</label>
      <div class="input-group">
        <div class="input-group-prepend">
          <span class="input-group-text">
            <i class="${icono}"></i>
          </span>
        </div>
        <input
          type="text"
          class="form-control"
          value="${escapeHtml(valorODefault(valor, valorDefault))}"
          readonly
        >
      </div>
    </div>
  `;
}

function crearTextareaHospitalizacion(label, icono, valor, valorDefault = "Sin información") {
  return `
    <div class="form-group">
      <label class="form-label-sm">${escapeHtml(label)}</label>
      <div class="input-group">
        <div class="input-group-prepend">
          <span class="input-group-text">
            <i class="${icono}"></i>
          </span>
        </div>
        <textarea class="form-control" rows="2" readonly>${escapeHtml(
          valorODefault(valor, valorDefault)
        )}</textarea>
      </div>
    </div>
  `;
}

function mostrarCargandoHospitalizacion(contenedor) {
  contenedor.innerHTML = `
    <div class="card card-info card-outline">
      <div class="card-body text-center py-5">
        <i class="fas fa-spinner fa-spin fa-2x mb-3"></i>
        <h5>Cargando hospitalización...</h5>
        <p class="text-muted mb-0">Obteniendo información del registro.</p>
      </div>
    </div>
  `;
}

function mostrarErrorHospitalizacion(mensaje) {
  const contenedor = $("#hospVerContenido");

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

function editarHospitalizacion() {
  window.location.href = "/hospitalizacion/editarHospitalizacion";
}