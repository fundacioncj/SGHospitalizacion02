document.addEventListener("DOMContentLoaded", () => {
  if ($("#hcEditarContenido")) cargarHistoriaClinicaEditar();
});

async function cargarHistoriaClinicaEditar() {
  const params = new URLSearchParams(window.location.search);
  const cedula = params.get("cedula");
  const contenedor = $("#hcEditarContenido");

  if (!cedula) {
    mostrarErrorHistoriaClinicaEditar("No se recibió la cédula del paciente.");
    return;
  }

  mostrarCargandoHistoriaClinicaEditar(contenedor);

  try {
    const url = `${API.historiaClinica.base}${API.historiaClinica.buscarCedula}${encodeURIComponent(cedula)}`;
    const respuesta = await peticionJSON(url);
    const registros = extraerArreglo(respuesta);

    if (!registros.length) {
      throw new Error("No se encontró una historia clínica para este paciente.");
    }

    construirFormularioEditarHistoriaClinica(registros[0]);
  } catch (error) {
    console.error("Error cargando historia clínica:", error);
    mostrarErrorHistoriaClinicaEditar(error.message || "No fue posible obtener la información.");
  }
}

function construirFormularioEditarHistoriaClinica(registro) {
  const contenedor = $("#hcEditarContenido");

  contenedor.innerHTML = `
    <div class="card card-info card-outline">
      <div class="card-header">
        <h3 class="card-title">
          <i class="fas fa-edit mr-2"></i>Editar Historia Clínica
        </h3>
      </div>

      <form id="formHistoriaClinicaEditar">
        <div class="card-body">

          <div class="row">
            <div class="col-md-4">
              ${crearCampoHCEditar("N.° Historia Clínica", registro.numeroHistoriaClinica, true)}
            </div>

            <div class="col-md-4">
              ${crearCampoHCEditar("Paciente", registro.nombrePaciente, true)}
            </div>

            <div class="col-md-4">
              ${crearCampoHCEditar("Cédula", registro.cedulaPaciente, true)}
            </div>
          </div>

          <div class="row">
            <div class="col-md-6">
              ${crearCampoHCEditar(
                "Fecha de apertura",
                registro.fechaApertura ? registro.fechaApertura.substring(0, 10) : "",
                true,
                "date"
              )}
            </div>

            <div class="col-md-6">
              <div class="form-group">
                <label>Estado</label>
                <div class="custom-control custom-switch mt-2">
                  <input type="checkbox"
                    class="custom-control-input"
                    id="hcEditarActivo"
                    ${registro.activo ? "checked" : ""}>
                  <label class="custom-control-label" for="hcEditarActivo">
                    Historia clínica activa
                  </label>
                </div>
              </div>
            </div>
          </div>

          ${crearListaEditableHC("Alergias", "hcEditarAlergias", registro.alergias, "Ej. Penicilina")}
          ${crearListaEditableHC("Antecedentes médicos", "hcEditarAntMedicos", registro.antecedentesMedicos, "Ej. Hipertensión arterial")}
          ${crearListaEditableHC("Antecedentes quirúrgicos", "hcEditarAntQuirurgicos", registro.antecedentesQuirurgicos, "Ej. Apendicectomía 2019")}
          ${crearListaEditableHC("Antecedentes familiares", "hcEditarAntFamiliares", registro.antecedentesFamiliares, "Ej. Diabetes tipo II")}
          ${crearListaEditableHC("Medicamentos actuales", "hcEditarMedicamentos", registro.medicamentosActuales, "Ej. Losartán 50mg")}

          <div class="form-group mt-4">
            <label for="hcEditarObservaciones">Observaciones</label>
            <textarea id="hcEditarObservaciones" class="form-control" rows="4">${escapeHtml(registro.observaciones || "")}</textarea>
          </div>

        </div>

        <div class="card-footer text-right">
          <button type="button" class="btn btn-default" onclick="volverHistoriaClinica()">
            <i class="fas fa-arrow-left mr-1"></i>Cancelar
          </button>

          <button type="submit" class="btn btn-info">
            <i class="fas fa-save mr-1"></i>Guardar cambios
          </button>
        </div>
      </form>
    </div>
  `;

  $("#formHistoriaClinicaEditar").addEventListener("submit", async evento => {
    evento.preventDefault();
    await guardarEdicionHistoriaClinica(registro);
  });
}

function crearCampoHCEditar(label, valor, disabled = false, tipo = "text") {
  return `
    <div class="form-group">
      <label>${escapeHtml(label)}</label>
      <input type="${tipo}"
        class="form-control"
        value="${escapeHtml(valorODefault(valor, ""))}"
        ${disabled ? "disabled" : ""}>
    </div>
  `;
}

function crearListaEditableHC(titulo, id, lista, placeholder) {
  const elementos = Array.isArray(lista) ? lista : [];

  return `
    <div class="form-section-title mt-4">
      <i class="fas fa-list mr-2"></i>${escapeHtml(titulo)}
    </div>

    <div id="${id}" class="dynamic-list mb-2">
      ${elementos.map(item => `
        <div class="input-group mb-2">
          <input type="text" class="form-control"
            value="${escapeHtml(item)}"
            placeholder="${escapeHtml(placeholder)}">
          <div class="input-group-append">
            <button type="button" class="btn btn-danger btn-remove-item">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </div>
      `).join("")}
    </div>

    <button type="button"
      class="btn btn-sm btn-outline-primary btn-add-item"
      data-add-target="${id}"
      data-placeholder="${escapeHtml(placeholder)}">
      <i class="fas fa-plus mr-1"></i>Agregar
    </button>
  `;
}

async function guardarEdicionHistoriaClinica(registro) {
  const cuerpo = {
    activo: $("#hcEditarActivo").checked,
    observaciones: $("#hcEditarObservaciones").value,
    alergias: leerListaDinamica("hcEditarAlergias"),
    antecedentesMedicos: leerListaDinamica("hcEditarAntMedicos"),
    antecedentesQuirurgicos: leerListaDinamica("hcEditarAntQuirurgicos"),
    antecedentesFamiliares: leerListaDinamica("hcEditarAntFamiliares"),
    medicamentosActuales: leerListaDinamica("hcEditarMedicamentos")
  };

  try {
    const url = `${API.historiaClinica.base}${API.historiaClinica.detalle}${encodeURIComponent(registro.id)}`;

    await peticionJSON(url, {
      method: "PUT",
      body: JSON.stringify(cuerpo)
    });

    sessionStorage.setItem("hcToast", JSON.stringify({
      mensaje: "La historia clínica se actualizó correctamente.",
      tipo: "success"
    }));

    window.location.href = "/historia-clinica";

  } catch (error) {
    console.error("Error actualizando historia clínica:", error);
    mostrarToast(
      "No se pudo actualizar la historia clínica. " + error.message,
      "danger"
    );
  }
}

function mostrarCargandoHistoriaClinicaEditar(contenedor) {
  contenedor.innerHTML = `
    <div class="card card-info card-outline">
      <div class="card-body text-center py-5">
        <i class="fas fa-spinner fa-spin fa-2x mb-3"></i>
        <h5>Cargando historia clínica...</h5>
      </div>
    </div>
  `;
}

function mostrarErrorHistoriaClinicaEditar(mensaje) {
  $("#hcEditarContenido").innerHTML = `
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

function volverHistoriaClinica() {
  window.location.href = "/historia-clinica";
}