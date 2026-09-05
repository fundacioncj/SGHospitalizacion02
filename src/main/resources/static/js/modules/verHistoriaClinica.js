document.addEventListener("DOMContentLoaded", () => {
  if ($("#hcVerContenido")) cargarHistoriaClinicaVer();
});

async function cargarHistoriaClinicaVer() {
  const params = new URLSearchParams(window.location.search);
  const cedula = params.get("cedula");
  const contenedor = $("#hcVerContenido");

  if (!cedula) {
    mostrarErrorHistoriaClinicaVer("No se recibió la cédula del paciente.");
    return;
  }

  mostrarCargandoHistoriaClinicaVer(contenedor);

  try {
    const url = `${API.historiaClinica.base}${API.historiaClinica.buscarCedula}${encodeURIComponent(cedula)}`;
    const respuesta = await peticionJSON(url);
    const registros = extraerArreglo(respuesta);

    if (!registros.length) {
      throw new Error("No se encontró una historia clínica para este paciente.");
    }

    construirVistaHistoriaClinica(registros[0]);
  } catch (error) {
    console.error("Error cargando historia clínica:", error);
    mostrarErrorHistoriaClinicaVer(error.message || "No fue posible obtener la información.");
  }
}

function construirVistaHistoriaClinica(registro) {
  const contenedor = $("#hcVerContenido");

  contenedor.innerHTML = `
    <div class="card card-info card-outline">
      <div class="card-header">
        <h3 class="card-title">
          <i class="fas fa-notes-medical mr-2"></i>
          Información de la Historia Clínica
        </h3>
      </div>

      <div class="card-body">
        <div class="row">
          <div class="col-md-4">
            ${crearCampoHC("N.° Historia Clínica", "fas fa-file-medical", registro.numeroHistoriaClinica)}
          </div>
          <div class="col-md-4">
            ${crearCampoHC("Paciente", "fas fa-user", registro.nombrePaciente)}
          </div>
          <div class="col-md-4">
            ${crearCampoHC("Cédula", "fas fa-id-card", registro.cedulaPaciente)}
          </div>
        </div>

        <div class="row">
          <div class="col-md-6">
            ${crearCampoHC("Fecha de apertura", "fas fa-calendar-alt", registro.fechaApertura ? formatearFecha(registro.fechaApertura) : "Sin información")}
          </div>
          <div class="col-md-6">
            ${crearCampoHC("Estado", "fas fa-heartbeat", registro.activo ? "Activa" : "Inactiva")}
          </div>
        </div>

        ${crearListaHC("Alergias", "fas fa-allergies", registro.alergias)}
        ${crearListaHC("Antecedentes médicos", "fas fa-notes-medical", registro.antecedentesMedicos)}
        ${crearListaHC("Antecedentes quirúrgicos", "fas fa-procedures", registro.antecedentesQuirurgicos)}
        ${crearListaHC("Antecedentes familiares", "fas fa-users", registro.antecedentesFamiliares)}
        ${crearListaHC("Medicamentos actuales", "fas fa-pills", registro.medicamentosActuales)}

        <div class="form-section-title">
          <i class="fas fa-comment-medical mr-2"></i>
          Observaciones
        </div>

        <div class="form-control mb-3" style="height:auto;min-height:80px;">
          ${escapeHtml(valorODefault(registro.observaciones, "Sin observaciones registradas."))}
        </div>
      </div>

      <div class="card-footer text-right">
        <button type="button" class="btn btn-default" onclick="volverHistoriaClinica()">
          <i class="fas fa-arrow-left mr-1"></i>Volver
        </button>

        <button type="button" class="btn btn-warning"
          onclick="irEditarHistoriaClinica('${escapeHtml(registro.cedulaPaciente)}')">
          <i class="fas fa-edit mr-1"></i>Editar
        </button>
      </div>
    </div>
  `;
}

function crearCampoHC(label, icono, valor) {
  return `
    <div class="form-group">
      <label><i class="${icono} mr-1"></i>${escapeHtml(label)}</label>
      <input type="text" class="form-control"
        value="${escapeHtml(valorODefault(valor, "Sin información"))}" readonly>
    </div>
  `;
}

function crearListaHC(titulo, icono, lista) {
  const elementos = Array.isArray(lista) ? lista : [];

  return `
    <div class="form-section-title">
      <i class="${icono} mr-2"></i>${escapeHtml(titulo)}
    </div>
    ${
      elementos.length
        ? `<ul class="list-group mb-3">
            ${elementos.map(item => `
              <li class="list-group-item">
                ${escapeHtml(item)}
              </li>
            `).join("")}
          </ul>`
        : `<p class="text-muted">Sin registros.</p>`
    }
  `;
}

function mostrarCargandoHistoriaClinicaVer(contenedor) {
  contenedor.innerHTML = `
    <div class="card card-info card-outline">
      <div class="card-body text-center py-5">
        <i class="fas fa-spinner fa-spin fa-2x mb-3"></i>
        <h5>Cargando historia clínica...</h5>
        <p class="text-muted mb-0">Obteniendo información de la base de datos.</p>
      </div>
    </div>
  `;
}

function mostrarErrorHistoriaClinicaVer(mensaje) {
  $("#hcVerContenido").innerHTML = `
    <div class="card card-danger card-outline">
      <div class="card-body text-center">
        <h5>No se pudo cargar la historia clínica</h5>
        <p class="text-muted">${escapeHtml(mensaje)}</p>
        <button type="button" class="btn btn-secondary" onclick="volverHistoriaClinica()">
          <i class="fas fa-arrow-left mr-1"></i>Volver
        </button>
      </div>
    </div>
  `;
}

function irEditarHistoriaClinica(cedula) {
  window.location.href =
    `/historia-clinica/editarHistoriaClinica?cedula=${encodeURIComponent(cedula)}`;
}

function volverHistoriaClinica() {
  window.location.href = "/historia-clinica";
}