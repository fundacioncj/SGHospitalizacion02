async function buscarHistoriaClinica() {
  const cedula = validarCedula($("#hcCedulaInput").value);
  if (!cedula) return;

  const contenedor = $("#hcResultados");
  mostrarSpinner(contenedor, "Buscando historias clínicas...");

  try {
    const url = `${API.historiaClinica.base}${API.historiaClinica.buscarCedula}${encodeURIComponent(cedula)}`;
    const datos = await peticionJSON(url);
    const registros = extraerArreglo(datos);

    state.historiaClinica = registros;

    if (registros.length === 0) {
      mostrarEstadoVacio(
        contenedor,
        "Sin resultados",
        `No se encontraron historias clínicas para la cédula ${cedula}.`,
        "bi-clipboard2-x"
      );
      return;
    }

    mostrarTablaHistoriaClinica(registros, contenedor);

  } catch (error) {
    mostrarEstadoVacio(
      contenedor,
      "No se pudo consultar el servicio",
      error.message,
      "bi-plug"
    );

    mostrarToast(
      "No fue posible conectar con el servicio de historia clínica.",
      "danger"
    );
  }
}


function mostrarTablaHistoriaClinica(registros, contenedor) {
  const filas = registros.map((registro, indice) => `
    <tr>
      <td class="patient-id text-center">
        ${escapeHtml(valorODefault(registro.numeroHistoriaClinica))}
      </td>

      <td class="text-center">
        ${escapeHtml(valorODefault(registro.nombrePaciente))}
      </td>

      <td class="text-center">
        ${escapeHtml(valorODefault(registro.cedulaPaciente))}
      </td>

      <td class="text-center">
        ${formatearFecha(registro.fechaApertura)}
      </td>

      <td class="text-center">
        <span class="badge-estado text-center ${registro.activo ? "activo" : "alta"}">
          ${registro.activo ? "Activa" : "Inactiva"}
        </span>
      </td>

      <td>
        <div class="d-flex justify-content-center">
          <div class="btn-group" role="group" aria-label="Acciones">

            <button
              class="btn btn-info btn-sm"
              data-accion="ver"
              data-indice="${indice}">
              <i class="fas fa-eye"></i>
            </button>

            <button
              class="btn btn-warning btn-sm"
              data-accion="editar"
              data-indice="${indice}">
              <i class="fas fa-pencil-alt"></i>
            </button>

            <button
              class="btn btn-danger btn-sm"
              data-accion="eliminar"
              data-indice="${indice}">
              <i class="fas fa-trash-alt"></i>
            </button>

          </div>
        </div>
      </td>
    </tr>
  `).join("");

  contenedor.innerHTML = `
    <div class="table-responsive">
      <table class="table table-striped table-hover table-bordered align-middle">

        <thead class="thead-light">
          <tr>
            <th class="text-center">N.° Historia</th>
            <th class="text-center">Paciente</th>
            <th class="text-center">Cédula</th>
            <th class="text-center">Fecha apertura</th>
            <th class="text-center">Estado</th>
            <th class="text-center">Acciones</th>
          </tr>
        </thead>

        <tbody>
          ${filas}
        </tbody>

      </table>
    </div>
  `;

  contenedor.querySelectorAll("[data-accion]").forEach(boton => {
    boton.addEventListener("click", () => {
      const registro =
        state.historiaClinica[Number(boton.dataset.indice)];

      const accion = boton.dataset.accion;

      if (accion === "ver") {
        window.location.href =
          `/historia-clinica/verHistoriaClinica?cedula=${encodeURIComponent(registro.cedulaPaciente)}`;
      }

      if (accion === "editar") {
        window.location.href =
          `/historia-clinica/editarHistoriaClinica?cedula=${encodeURIComponent(registro.cedulaPaciente)}`;
      }

      if (accion === "eliminar") {
        solicitarEliminacion(
          "historiaClinica",
          registro,
          boton.closest("tr"),
          `historia clínica N.° ${registro.numeroHistoriaClinica}`
        );
      }
    });
  });
}


function abrirModalVerHistoriaClinica(registro) {
  const iconos = {
    "N.° historia clínica": "fas fa-file-medical",
    "Fecha de apertura": "fas fa-calendar-alt",
    "Estado": "fas fa-heartbeat",
    "Alergias": "fas fa-allergies",
    "Antecedentes médicos": "fas fa-notes-medical",
    "Antecedentes quirúrgicos": "fas fa-procedures",
    "Antecedentes familiares": "fas fa-users",
    "Medicamentos actuales": "fas fa-pills",
    "Observaciones": "fas fa-comment-medical"
  };

  $("#hcVerSubtitle").textContent =
    `N.° ${valorODefault(registro.numeroHistoriaClinica)}`;

  $("#hcVerContenido").innerHTML = `
    <div class="row mb-3">

      <div class="col-md-4">
        <div class="detail-item">
          <div class="detail-label">
            <span class="input-group-text input-custom-text d-inline-flex me-2">
              <i class="${iconos["N.° historia clínica"]}"></i>
            </span>
            <strong>N.° historia clínica</strong>
          </div>

          <div class="detail-value">
            ${escapeHtml(valorODefault(registro.numeroHistoriaClinica))}
          </div>
        </div>
      </div>

      <div class="col-md-4">
        <div class="detail-item">
          <div class="detail-label">
            <span class="input-group-text input-custom-text d-inline-flex me-2">
              <i class="${iconos["Fecha de apertura"]}"></i>
            </span>
            <strong>Fecha de apertura</strong>
          </div>

          <div class="detail-value">
            ${formatearFecha(registro.fechaApertura)}
          </div>
        </div>
      </div>

      <div class="col-md-4">
        <div class="detail-item">
          <div class="detail-label">
            <span class="input-group-text input-custom-text d-inline-flex me-2">
              <i class="${iconos["Estado"]}"></i>
            </span>
            <strong>Estado</strong>
          </div>

          <div class="detail-value">
            ${registro.activo ? "Activa" : "Inactiva"}
          </div>
        </div>
      </div>

    </div>

    <div class="form-section-title">
      <span class="input-group-text input-custom-text d-inline-flex me-2">
        <i class="${iconos["Alergias"]}"></i>
      </span>
      <strong>Alergias</strong>
    </div>

    ${listaComoHtml(registro.alergias)}

    <div class="form-section-title">
      <span class="input-group-text input-custom-text d-inline-flex me-2">
        <i class="${iconos["Antecedentes médicos"]}"></i>
      </span>
      <strong>Antecedentes médicos</strong>
    </div>

    ${listaComoHtml(registro.antecedentesMedicos)}

    <div class="form-section-title">
      <span class="input-group-text input-custom-text d-inline-flex me-2">
        <i class="${iconos["Antecedentes quirúrgicos"]}"></i>
      </span>
      <strong>Antecedentes quirúrgicos</strong>
    </div>

    ${listaComoHtml(registro.antecedentesQuirurgicos)}

    <div class="form-section-title">
      <span class="input-group-text input-custom-text d-inline-flex me-2">
        <i class="${iconos["Antecedentes familiares"]}"></i>
      </span>
      <strong>Antecedentes familiares</strong>
    </div>

    ${listaComoHtml(registro.antecedentesFamiliares)}

    <div class="form-section-title">
      <span class="input-group-text input-custom-text d-inline-flex me-2">
        <i class="${iconos["Medicamentos actuales"]}"></i>
      </span>
      <strong>Medicamentos actuales</strong>
    </div>

    ${listaComoHtml(registro.medicamentosActuales)}

    <div class="form-section-title">
      <span class="input-group-text input-custom-text d-inline-flex me-2">
        <i class="${iconos["Observaciones"]}"></i>
      </span>
      <strong>Observaciones</strong>
    </div>

    <p>
      ${escapeHtml(
        valorODefault(
          registro.observaciones,
          "Sin observaciones registradas."
        )
      )}
    </p>
  `;

  abrirModal("modalHcVer");
}


function abrirModalEditarHistoriaClinica(registro) {
  $("#hcEditarSubtitle").textContent =
    `N.° ${valorODefault(registro.numeroHistoriaClinica)}`;

  llenarFormularioHistoriaClinica(registro);

  abrirModal("modalHcEditar");
}


function llenarFormularioHistoriaClinica(registro) {
  $("#hcEditId").value =
    valorODefault(registro.id, "");

  $("#hcEditNumero").value =
    valorODefault(registro.numeroHistoriaClinica, "");

  $("#hcEditFechaApertura").value =
    registro.fechaApertura
      ? registro.fechaApertura.substring(0, 10)
      : "";

  $("#hcEditActivo").checked =
    Boolean(registro.activo);

  $("#hcEditObservaciones").value =
    registro.observaciones || "";

  llenarListaDinamica(
    "hcEditAlergias",
    registro.alergias,
    "Ej. Penicilina"
  );

  llenarListaDinamica(
    "hcEditAntMedicos",
    registro.antecedentesMedicos,
    "Ej. Hipertensión arterial"
  );

  llenarListaDinamica(
    "hcEditAntQuirurgicos",
    registro.antecedentesQuirurgicos,
    "Ej. Apendicectomía 2019"
  );

  llenarListaDinamica(
    "hcEditAntFamiliares",
    registro.antecedentesFamiliares,
    "Ej. Diabetes tipo II (madre)"
  );

  llenarListaDinamica(
    "hcEditMedicamentos",
    registro.medicamentosActuales,
    "Ej. Losartán 50mg cada 24h"
  );
}


async function guardarHistoriaClinica(evento) {
  evento.preventDefault();

  const id = $("#hcEditId").value;

  if (!id) {
    mostrarToast(
      "No se encontró el identificador de la historia clínica.",
      "warning"
    );

    return;
  }

  const cuerpo = {
    activo: $("#hcEditActivo").checked,

    observaciones:
      $("#hcEditObservaciones").value.trim(),

    alergias:
      leerListaDinamica("hcEditAlergias"),

    antecedentesMedicos:
      leerListaDinamica("hcEditAntMedicos"),

    antecedentesQuirurgicos:
      leerListaDinamica("hcEditAntQuirurgicos"),

    antecedentesFamiliares:
      leerListaDinamica("hcEditAntFamiliares"),

    medicamentosActuales:
      leerListaDinamica("hcEditMedicamentos")
  };

  try {
    const url =
      `${API.historiaClinica.base}${API.historiaClinica.detalle}${encodeURIComponent(id)}`;

    await peticionJSON(url, {
      method: "PUT",
      body: JSON.stringify(cuerpo)
    });

    sessionStorage.setItem(
      "hcToast",
      JSON.stringify({
        mensaje:
          "La historia clínica se actualizó correctamente.",
        tipo: "success"
      })
    );

    window.location.href =
      "/historia-clinica";

  } catch (error) {
    console.error(
      "Error actualizando historia clínica:",
      error
    );

    mostrarToast(
      "No se pudo guardar la actualización. " +
      error.message,
      "danger"
    );
  }
}


async function abrirHistoriaClinicaPorCedula(evento) {
  evento.preventDefault();

  const cedula =
    validarCedula($("#hcCrearCedula").value);

  if (!cedula) return;

  const boton =
    evento.submitter;

  if (boton) {
    boton.disabled = true;
  }

  try {
    const url =
      `${API.historiaClinica.base}${API.historiaClinica.abrirPorCedula}${encodeURIComponent(cedula)}`;

    const historiaCreada =
      await peticionJSON(url, {
        method: "POST"
      });

    const cedulaCreada =
      historiaCreada.cedulaPaciente || cedula;

    sessionStorage.setItem(
      "hcToast",
      JSON.stringify({
        mensaje:
          "Historia clínica creada correctamente. Complete la información adicional.",
        tipo: "success"
      })
    );

    window.location.href =
      `/historia-clinica/editarHistoriaClinica?cedula=${encodeURIComponent(cedulaCreada)}`;

  } catch (error) {
    console.error(
      "Error creando historia clínica:",
      error
    );

    mostrarToast(
      "No se pudo crear la historia clínica. " +
      error.message,
      "danger"
    );

    if (boton) {
      boton.disabled = false;
    }
  }
}


async function cargarHistoriasClinicas() {
  const contenedor =
    $("#hcResultados");

  try {
    const datos =
      await peticionJSON(
        API.historiaClinica.base
      );

    const registros =
      extraerArreglo(datos);

    state.historiaClinica =
      registros;

    mostrarTablaHistoriaClinica(
      registros,
      contenedor
    );

  } catch (error) {
    mostrarEstadoVacio(
      contenedor,
      "Error",
      error.message,
      "bi-plug"
    );
  }
}


document.addEventListener("DOMContentLoaded", () => {
  const formCrear =
    $("#formHcCrear");

  if (formCrear) {
    formCrear.addEventListener(
      "submit",
      abrirHistoriaClinicaPorCedula
    );
  }

  const formEditar =
    $("#formHcEditar");

  if (formEditar) {
    formEditar.addEventListener(
      "submit",
      guardarHistoriaClinica
    );
  }


  document.addEventListener("click", evento => {
    const botonAgregar =
      evento.target.closest(".btn-add-item");

    if (botonAgregar) {
      const targetId =
        botonAgregar.dataset.addTarget;

      const placeholder =
        botonAgregar.dataset.placeholder ||
        "Ingrese un valor";

      const contenedor =
        document.getElementById(targetId);

      if (!contenedor) {
        console.error(
          `No existe el contenedor: ${targetId}`
        );

        return;
      }

      const item =
        document.createElement("div");

      item.className =
        "input-group mb-2";

      item.innerHTML = `
        <input
          type="text"
          class="form-control"
          placeholder="${escapeHtml(placeholder)}">

        <div class="input-group-append">
          <button
            type="button"
            class="btn btn-outline-danger btn-remove-item">
            <i class="fas fa-times"></i>
          </button>
        </div>
      `;

      contenedor.appendChild(item);

      const input =
        item.querySelector("input");

      if (input) {
        input.focus();
      }

      return;
    }


    const botonEliminar =
      evento.target.closest(".btn-remove-item");

    if (botonEliminar) {
      const item =
        botonEliminar.closest(".input-group");

      if (item) {
        item.remove();
      }
    }
  });


  const hcToast =
    sessionStorage.getItem("hcToast");

  if (hcToast) {
    try {
      const datosToast =
        JSON.parse(hcToast);

      sessionStorage.removeItem(
        "hcToast"
      );

      setTimeout(() => {
        mostrarToast(
          datosToast.mensaje,
          datosToast.tipo
        );
      }, 100);

    } catch (error) {
      console.error(
        "Error leyendo hcToast:",
        error
      );

      sessionStorage.removeItem(
        "hcToast"
      );
    }
  }
});