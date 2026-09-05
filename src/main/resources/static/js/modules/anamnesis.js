const ANAMNESIS_SCHEMA = {

  datosGenerales: {
    contenedor: "anFieldsDatosGenerales",
    titulo: "AN-01 Datos Generales",
    campos: [
      { key:"fechaRegistro", label:"Fecha de registro", type:"date" },
      { key:"nombrePaciente", label:"Paciente", type:"text", disabled:true },
      { key:"cedulaPaciente", label:"Cédula paciente", type:"text", disabled:true },
      { key:"nombreMedico", label:"Médico responsable", type:"text", disabled:true },
      { key:"motivosConsulta", label:"Motivos de consulta", type:"textarea", full:true }
    ]
  },


  motivoConsulta: {
    contenedor:"anFieldsMotivoConsulta",
    titulo:"AN-02 Motivo de Consulta",
    campos:[
      {
        key:"motivosConsulta",
        label:"Motivo de consulta",
        type:"textarea",
        full:true
      }
    ]
  },


  antecedentesPersonales: {
    contenedor:"anFieldsAntecedentesPersonales",
    titulo:"AN-03 Antecedentes Personales",
    campos:[
      {
        key:"alergiaMedicamentos",
        label:"Alergia a medicamentos",
        type:"toggle",
        descripcion:"descripcionAlergias"
      },
      {
        key:"otrasAlergias",
        label:"Otras alergias",
        type:"toggle"
      },
      {
        key:"vacunas",
        label:"Vacunas",
        type:"toggle",
        descripcion:"descripcionVacunas"
      },
      {
        key:"patologiasClinicas",
        label:"Patologías clínicas",
        type:"toggle",
        descripcion:"descripcionPatologiasClinicas"
      },
      {
        key:"medicacionHabitual",
        label:"Medicación habitual",
        type:"toggle",
        descripcion:"descripcionMedicacionHabitual"
      },
      {
        key:"antecedentesQuirurgicos",
        label:"Antecedentes quirúrgicos",
        type:"toggle",
        descripcion:"descripcionAntecedentesQuirurgicos"
      },
      {
        key:"habitos",
        label:"Hábitos",
        type:"toggle",
        descripcion:"descripcionHabitos"
      },
      {
        key:"condicionSocioeconomica",
        label:"Condición socioeconómica",
        type:"toggle",
        descripcion:"descripcionCondicionSocioeconomica"
      },
      {
        key:"discapacidad",
        label:"Discapacidad",
        type:"toggle",
        descripcion:"descripcionDiscapacidad"
      },
      {
        key:"religion",
        label:"Religión",
        type:"toggle",
        descripcion:"descripcionReligion"
      },
      {
        key:"tipificacionSanguinea",
        label:"Tipificación sanguínea",
        type:"toggle",
        descripcion:"descripcionTipificacionSanguinea"
      }
    ]
  },


  gineco: {
    contenedor:"anFieldsGineco",
    titulo:"AN-04 Gineco-obstétricos / Andrológicos",
    campos:[
      {key:"ginecoObstetricosAndrologicos", label:"Información gineco-obstétrica / andrológica", type:"gineco"}
    ]
  },


  antecedentesFamiliares:{
    contenedor:"anFieldsAntecedentesFamiliares",
    titulo:"AN-05 Antecedentes Familiares",
    campos:[
      {key:"familiarCardiopatia",label:"Cardiopatía",type:"toggle"},
      {key:"familiarHipertension",label:"Hipertensión arterial",type:"toggle"},
      {key:"familiarEnfermedadCerebroVascular",label:"Enfermedad cerebrovascular",type:"toggle"},
      {key:"familiarEndocrinoMetabolico",label:"Endocrino metabólico",type:"toggle"},
      {key:"familiarCancer",label:"Cáncer",type:"toggle"},
      {key:"familiarTuberculosis",label:"Tuberculosis",type:"toggle"},
      {key:"familiarEnfermedadMental",label:"Enfermedad mental",type:"toggle"},
      {key:"familiarEnfermedadInfecciosa",label:"Enfermedades infecciosas",type:"toggle"},
      {key:"familiarMalformacion",label:"Malformaciones",type:"toggle"},
      {key:"familiarOtro",label:"Otros antecedentes familiares",type:"toggle"}
    ]
  },


  enfermedadActual:{
    contenedor:"anFieldsEnfermedadActual",
    titulo:"AN-06 Enfermedad Actual",
    campos:[
      {
        key:"enfermedadActual",
        label:"Descripción de enfermedad actual",
        type:"textarea",
        full:true
      }
    ]
  },


  revisionSistemas:{
    contenedor:"anFieldsRevisionSistemas",
    titulo:"AN-07 Revisión por Sistemas",
    campos:[
      {key:"sistemaPielAnexos",label:"Piel y anexos",type:"toggle",descripcion:"descripcionPielAnexos"},
      {key:"sistemaOrganosDeLosSentidos",label:"Órganos de los sentidos",type:"toggle",descripcion:"descripcionOrganosDeLosSentidos"},
      {key:"sistemaRespiratorio",label:"Sistema respiratorio",type:"toggle",descripcion:"descripcionRespiratorio"},
      {key:"sistemaCardiovascular",label:"Sistema cardiovascular",type:"toggle",descripcion:"descripcionCardiovascular"},
      {key:"sistemaDigestivo",label:"Sistema digestivo",type:"toggle",descripcion:"descripcionDigestivo"},
      {key:"sistemaGenitoUrinario",label:"Sistema genito urinario",type:"toggle",descripcion:"descripcionGenitoUrinario"},
      {key:"sistemaMusculoEsqueletico",label:"Sistema musculoesquelético",type:"toggle",descripcion:"descripcionMusculoEsqueletico"},
      {key:"sistemaEndocrino",label:"Sistema endocrino",type:"toggle",descripcion:"descripcionEndocrino"},
      {key:"sistemaHemoLinfatico",label:"Sistema hematológico",type:"toggle",descripcion:"descripcionHemoLinfatico"},
      {key:"sistemaNervioso",label:"Sistema nervioso",type:"toggle",descripcion:"descripcionNervioso"}
    ]
  }

};

/** Construye un id de DOM único y estable para un campo del esquema. */
function idCampoAnamnesis(clave) {
  return "an_" + clave;
}

function crearCampoTexto(campo) {
  const wrapper = document.createElement("div");
  if (campo.full) wrapper.className = "detail-item full-width";
  const tipoInput = campo.type === "number" ? "number" : campo.type === "date" ? "date" : "text";
  wrapper.innerHTML = `
    <label class="form-label" for="${idCampoAnamnesis(campo.key)}">${escapeHtml(campo.label)}</label>
    <input type="${tipoInput}" class="form-control" id="${idCampoAnamnesis(campo.key)}"
      placeholder="${escapeHtml(campo.placeholder || "")}" ${campo.disabled ? "disabled" : ""}>
  `;
  return wrapper;
}

function crearCampoSelect(campo) {
  const wrapper = document.createElement("div");
  const opciones = campo.options.map(op => `<option value="${escapeHtml(op)}">${escapeHtml(op)}</option>`).join("");
  wrapper.innerHTML = `
    <div class="form-group mb-3">
      <label class="form-labels" for="${idCampoAnamnesis(campo.key)}">
        ${escapeHtml(campo.label)}
      </label>

      <select class="form-control" id="${idCampoAnamnesis(campo.key)}">
        <option value="">Seleccionar...</option>
        ${opciones}
      </select>
    </div>
  `;
  return wrapper;
}

function crearCampoTextarea(campo) {
  const wrapper = document.createElement("div");
  if (campo.full) wrapper.className = "detail-item full-width";
  wrapper.innerHTML = `
    <label class="form-label" for="${idCampoAnamnesis(campo.key)}">${escapeHtml(campo.label)}</label>
    <textarea class="form-control" id="${idCampoAnamnesis(campo.key)}" rows="3"
      placeholder="${escapeHtml(campo.placeholder || "")}"></textarea>
  `;
  return wrapper;
}

/**
 * Campo tipo "toggle": checkbox booleano + textarea de descripción.
 * El textarea permanece deshabilitado hasta que el checkbox se marca
 * (requisito explícito para alergias, antecedentes, hábitos y
 * revisión por sistemas). Ver activarCheckboxes().
 */
function crearCampoToggle(campo) {
  const idCheckbox = idCampoAnamnesis(campo.key);
  const idDescripcion = idCampoAnamnesis(campo.key) + "_desc";
  const wrapper = document.createElement("div");
  wrapper.className = "toggle-field";
  wrapper.innerHTML = `
    <div class="form-check">
      <input class="form-check-input toggle-check" type="checkbox" id="${idCheckbox}" data-target="${idDescripcion}">
      <label class="form-check-label" for="${idCheckbox}">${escapeHtml(campo.label)}</label>
    </div>
    <textarea class="form-control" id="${idDescripcion}" rows="2" disabled
      placeholder="Describe detalles, fechas o particularidades..."></textarea>
  `;
  return wrapper;
}

function crearCamposGinecoEditar() {
  const wrapper = document.createElement("div");
  wrapper.innerHTML = `
    <div class="form-group">
      <label>Sexo</label>
      <div class="custom-control custom-radio custom-control-inline">
        <input type="radio" class="custom-control-input" id="anEdit_sexoMujer" name="anEdit_sexo" value="MUJER">
        <label class="custom-control-label" for="anEdit_sexoMujer">Mujer</label>
      </div>
      <div class="custom-control custom-radio custom-control-inline">
        <input type="radio" class="custom-control-input" id="anEdit_sexoHombre" name="anEdit_sexo" value="HOMBRE">
        <label class="custom-control-label" for="anEdit_sexoHombre">Hombre</label>
      </div>
    </div>

    <div id="anEdit_ginecologico" style="display:none;">
      <h6 class="font-weight-bold border-bottom pb-2">Datos ginecológicos</h6>
      <div class="form-row">
        <div class="form-group col-md-3"><label>Edad de menarquia</label><input type="number" class="form-control" id="anEdit_edadMenarquia"></div>
        <div class="form-group col-md-3"><label>Edad de menopausia</label><input type="number" class="form-control" id="anEdit_edadMenopausia"></div>
        <div class="form-group col-md-6"><label>Ciclos</label><input type="text" class="form-control" id="anEdit_ciclos"></div>
        <div class="form-group col-md-3"><label>Edad inicio vida sexual</label><input type="number" class="form-control" id="anEdit_edadInicioVidaSexual"></div>
        <div class="form-group col-md-2"><label>Gestas</label><input type="number" class="form-control" id="anEdit_numeroGestas"></div>
        <div class="form-group col-md-2"><label>Partos</label><input type="number" class="form-control" id="anEdit_numeroPartos"></div>
        <div class="form-group col-md-2"><label>Abortos</label><input type="number" class="form-control" id="anEdit_numeroAbortos"></div>
        <div class="form-group col-md-2"><label>Cesáreas</label><input type="number" class="form-control" id="anEdit_numeroCesareas"></div>
        <div class="form-group col-md-3"><label>Hijos vivos</label><input type="number" class="form-control" id="anEdit_numeroHijosVivos"></div>
        <div class="form-group col-md-4"><label>Última menstruación</label><input type="date" class="form-control" id="anEdit_fechaUltimaMenstruacion"></div>
        <div class="form-group col-md-4"><label>Último parto</label><input type="date" class="form-control" id="anEdit_fechaUltimoParto"></div>
        <div class="form-group col-md-4"><label>Última citología cervical</label><input type="date" class="form-control" id="anEdit_fechaUltimaCitologiaCervical"></div>
        <div class="form-group col-md-4"><label>Última colposcopia</label><input type="date" class="form-control" id="anEdit_fechaUltimaColposcopia"></div>
        <div class="form-group col-md-4"><label>Última mamografía</label><input type="date" class="form-control" id="anEdit_fechaUltimaMamografia"></div>
        <div class="form-group col-md-6"><label>Método de planificación familiar</label><input type="text" class="form-control" id="anEdit_metodoPlanificacionFamiliar"></div>
        <div class="form-group col-md-6"><label>Terapia hormonal</label><input type="text" class="form-control" id="anEdit_terapiaHormonal"></div>
      </div>
    </div>

    <div id="anEdit_andrologico" style="display:none;">
      <h6 class="font-weight-bold border-bottom pb-2">Datos andrológicos</h6>
      <div class="form-row">
        <div class="form-group col-md-6"><label>Último antígeno prostático</label><input type="date" class="form-control" id="anEdit_fechaUltimoAntigenoProstatico"></div>
        <div class="form-group col-md-6"><label>Último eco prostático</label><input type="date" class="form-control" id="anEdit_fechaUltimoEcoProstatico"></div>
      </div>
    </div>
  `;
  setTimeout(configurarSexoAnamnesisEditar, 0);
  return wrapper;
}

function crearCampoAnamnesis(campo) {
  switch (campo.type) {
    case "select": return crearCampoSelect(campo);
    case "textarea": return crearCampoTextarea(campo);
    case "toggle": return crearCampoToggle(campo);
    case "gineco": return crearCamposGinecoEditar();
    default: return crearCampoTexto(campo);
  }
}

/** Renderiza todas las secciones del esquema dentro del modal de edición. */
function construirFormularioAnamnesis() {
  Object.values(ANAMNESIS_SCHEMA).forEach(seccion => {
    const contenedor = $("#" + seccion.contenedor);
    if (!contenedor) return;
    contenedor.innerHTML = "";
    seccion.campos.forEach(campo => contenedor.appendChild(crearCampoAnamnesis(campo)));
  });
  activarCheckboxes();
}

/**
 * activarCheckboxes()
 * Habilita/deshabilita el textarea asociado a cada checkbox
 * ".toggle-check" del formulario de anamnesis. Usa delegación de
 * eventos sobre el formulario, por lo que funciona también con
 * campos agregados dinámicamente.
 */
function activarCheckboxes() {
  const formulario = $("#formAnEditar");
  if (!formulario || formulario.dataset.toggleListo) return;
  formulario.dataset.toggleListo = "true";

  formulario.addEventListener("change", (evento) => {
    const checkbox = evento.target;
    if (!checkbox.classList.contains("toggle-check")) return;
    const descripcion = document.getElementById(checkbox.dataset.target);
    if (!descripcion) return;
    descripcion.disabled = !checkbox.checked;
    checkbox.closest(".toggle-field").classList.toggle("is-checked", checkbox.checked);
    if (checkbox.checked) {
      descripcion.focus();
    } else {
      descripcion.value = "";
    }
  });
}

/** Recorre el esquema y llena cada campo con el valor correspondiente del registro. */
function llenarFormularioAnamnesis(registro) {
  $("#anEditId").value = valorODefault(registro.id, "");

  Object.values(ANAMNESIS_SCHEMA).forEach(seccion => {
    seccion.campos.forEach(campo => {
      const idBase = idCampoAnamnesis(campo.key);
      if (campo.type === "toggle") {
        const checkbox = document.getElementById(idBase);
        const descripcion = document.getElementById(idBase + "_desc");
        const activo = Boolean(registro[campo.key]);
        checkbox.checked = activo;
        descripcion.disabled = !activo;
        descripcion.value = registro[campo.key + "Detalle"] || (typeof registro[campo.key] === "string" ? registro[campo.key] : "") || "";
        checkbox.closest(".toggle-field").classList.toggle("is-checked", activo);
      } else {
        const input = document.getElementById(idBase);
        if (!input) return;
        let valor = registro[campo.key];
        if (campo.type === "date" && valor) valor = String(valor).substring(0, 10);
        input.value = valor ?? "";
      }
    });
  });
}

/** Recolecta el estado actual del formulario de anamnesis como objeto plano. */
function leerFormularioAnamnesis() {
  const resultado = { id: $("#anEditId").value || undefined };

  Object.values(ANAMNESIS_SCHEMA).forEach(seccion => {
    seccion.campos.forEach(campo => {
      const idBase = idCampoAnamnesis(campo.key);

      if (campo.type === "toggle") {
        const checkbox = document.getElementById(idBase);
        const descripcion = document.getElementById(idBase + "_desc");

        resultado[campo.key] = checkbox?.checked || false;
        resultado[campo.key + "Detalle"] =
          checkbox?.checked ? descripcion?.value.trim() || "" : "";

      } else if (campo.key === "ginecoObstetricosAndrologicos") {
        resultado[campo.key] = {
          edadMenarquia: obtenerNumero("anEdit_edadMenarquia"),
          edadMenopausia: obtenerNumero("anEdit_edadMenopausia"),
          ciclos: $("#anEdit_ciclos")?.value.trim() || "",
          edadInicioVidaSexual: obtenerNumero("anEdit_edadInicioVidaSexual"),
          numeroGestas: obtenerNumero("anEdit_numeroGestas"),
          numeroPartos: obtenerNumero("anEdit_numeroPartos"),
          numeroAbortos: obtenerNumero("anEdit_numeroAbortos"),
          numeroCesareas: obtenerNumero("anEdit_numeroCesareas"),
          numeroHijosVivos: obtenerNumero("anEdit_numeroHijosVivos"),
          fechaUltimaMenstruacion: $("#anEdit_fechaUltimaMenstruacion")?.value || null,
          fechaUltimoParto: $("#anEdit_fechaUltimoParto")?.value || null,
          fechaUltimaCitologiaCervical: $("#anEdit_fechaUltimaCitologiaCervical")?.value || null,
          fechaUltimaColposcopia: $("#anEdit_fechaUltimaColposcopia")?.value || null,
          fechaUltimaMamografia: $("#anEdit_fechaUltimaMamografia")?.value || null,
          metodoPlanificacionFamiliar: $("#anEdit_metodoPlanificacionFamiliar")?.value.trim() || "",
          terapiaHormonal: $("#anEdit_terapiaHormonal")?.value.trim() || "",
          fechaUltimoAntigenoProstatico: $("#anEdit_fechaUltimoAntigenoProstatico")?.value || null,
          fechaUltimoEcoProstatico: $("#anEdit_fechaUltimoEcoProstatico")?.value || null
        };

      } else {
        const input = document.getElementById(idBase);
        if (!input) return;

        const valor = input.value.trim();

        if (campo.key === "motivosConsulta") {
          resultado[campo.key] = valor ? [valor] : [];
          return;
        }

        resultado[campo.key] =
          campo.type === "number"
            ? (valor === "" ? null : Number(valor))
            : valor;
      }
    });
  });

  return resultado;
}

function configurarSexoAnamnesis() {
  const mujer = $("#anCrear_sexoMujer");
  const hombre = $("#anCrear_sexoHombre");
  const ginecologico = $("#anCrear_ginecologico");
  const andrologico = $("#anCrear_andrologico");

  if (!mujer || !hombre || !ginecologico || !andrologico) return;

  function actualizar() {
    ginecologico.style.display = mujer.checked ? "block" : "none";
    andrologico.style.display = hombre.checked ? "block" : "none";
  }

  mujer.addEventListener("change", actualizar);
  hombre.addEventListener("change", actualizar);

  actualizar();
}

function configurarSexoAnamnesisEditar() {
  const mujer = $("#anEdit_sexoMujer");
  const hombre = $("#anEdit_sexoHombre");
  const ginecologico = $("#anEdit_ginecologico");
  const andrologico = $("#anEdit_andrologico");

  if (!mujer || !hombre || !ginecologico || !andrologico) return;

  function actualizar() {
    ginecologico.style.display = mujer.checked ? "block" : "none";
    andrologico.style.display = hombre.checked ? "block" : "none";
  }

  mujer.addEventListener("change", actualizar);
  hombre.addEventListener("change", actualizar);
  actualizar();
}

const iconos = {
  "Fecha de registro": "far fa-calendar-alt",
  "Paciente": "fas fa-user",
  "Cédula paciente": "far fa-id-card",
  "Médico responsable": "fas fa-user-md",
  "Motivos de consulta": "fas fa-comment-medical",
  "Motivo de consulta": "fas fa-comment-medical",
  "Descripción de enfermedad actual": "fas fa-notes-medical",
  "Información gineco-obstétrica / andrológica": "fas fa-venus-mars"
};

/** Genera el acordeón de sólo lectura para el modal "Ver" de anamnesis. */
function construirVistaAnamnesis(registro) {
  const secciones = [
    ["AN-01", "Datos Generales", ANAMNESIS_SCHEMA.datosGenerales.campos],
    ["AN-02", "Motivo de Consulta", ANAMNESIS_SCHEMA.motivoConsulta.campos],
    ["AN-03", "Antecedentes Personales", ANAMNESIS_SCHEMA.antecedentesPersonales.campos],
    ["AN-04", "Gineco-obstétricos / Andrológicos", ANAMNESIS_SCHEMA.gineco.campos],
    ["AN-05", "Antecedentes Familiares", ANAMNESIS_SCHEMA.antecedentesFamiliares.campos],
    ["AN-06", "Enfermedad Actual", ANAMNESIS_SCHEMA.enfermedadActual.campos],
    ["AN-07", "Revisión por Sistemas", ANAMNESIS_SCHEMA.revisionSistemas.campos]
  ];

  const html = secciones.map(([codigo, titulo, campos], indice) => {
    const idColapso = `anVer_${indice}`;
    const filas = campos.map(campo => {
      let valorTexto;
      if (campo.type === "toggle") {
        const activo = Boolean(registro[campo.key]);
        const detalle = registro[campo.key + "Detalle"];
        valorTexto = activo ? `Sí${detalle ? " — " + escapeHtml(detalle) : ""}` : "No";
      } else if (campo.key === "ginecoObstetricosAndrologicos") {
        const datos = registro[campo.key];

        if (!datos) {
          valorTexto = "Sin información";
        } else {
          const filas = [
            ["Edad de menarquia", datos.edadMenarquia],
            ["Edad de menopausia", datos.edadMenopausia],
            ["Ciclos", datos.ciclos],
            ["Edad inicio vida sexual", datos.edadInicioVidaSexual],
            ["Gestas", datos.numeroGestas],
            ["Partos", datos.numeroPartos],
            ["Abortos", datos.numeroAbortos],
            ["Cesáreas", datos.numeroCesareas],
            ["Hijos vivos", datos.numeroHijosVivos],
            ["Última menstruación", datos.fechaUltimaMenstruacion],
            ["Último parto", datos.fechaUltimoParto],
            ["Última citología cervical", datos.fechaUltimaCitologiaCervical],
            ["Última colposcopia", datos.fechaUltimaColposcopia],
            ["Última mamografía", datos.fechaUltimaMamografia],
            ["Método de planificación familiar", datos.metodoPlanificacionFamiliar],
            ["Terapia hormonal", datos.terapiaHormonal],
            ["Último antígeno prostático", datos.fechaUltimoAntigenoProstatico],
            ["Último eco prostático", datos.fechaUltimoEcoProstatico]
          ];

          valorTexto = filas
            .filter(([, valor]) => valor !== null && valor !== undefined && valor !== "")
            .map(([label, valor]) => {
              const texto = String(label).startsWith("Última") || String(label).startsWith("Último")
                ? formatearFecha(valor)
                : valor;
              return `<strong>${escapeHtml(label)}:</strong> ${escapeHtml(String(texto))}`;
            })
            .join("<br>");
        }
      } else {
        valorTexto = escapeHtml(
          valorODefault(
            campo.type === "date"
              ? formatearFecha(registro[campo.key])
              : registro[campo.key]
          )
        );
      }
      return `
        <div class="detail-item ${campo.full ? "full-width" : ""}">
          <div class="detail-label">${iconos[campo.label] ? `<i class="${iconos[campo.label]} mr-2 text-info"></i>` : ""}
            <strong>${escapeHtml(campo.label)}</strong></div>
          <div class="detail-value">${valorTexto}</div>
        </div>
      `;
    }).join("");

    return `
      <div class="accordion-item mb-3">
        <h2 class="accordion-header">
          <button class="btn btn-link accordion-button ${indice === 0 ? "" : "collapsed"} fw-bold" 
                type="button" 
                data-toggle="collapse" 
                data-target="#${idColapso}">
            <span class="section-code mr-2">${codigo}</span>${escapeHtml(titulo)}
          </button>
        </h2>
        <div id="${idColapso}" class="collapse ${indice === 0 ? "show" : ""}" data-parent="#anVerAccordion">
          <div class="accordion-body"><div class="detail-grid">${filas}</div></div>
        </div>
      </div>
    `;
  }).join("");

  $("#anVerAccordion").innerHTML = html;
}

async function buscarAnamnesis() {
  const cedula = validarCedula($("#anCedulaInput").value);
  if (!cedula) return;

  const contenedor = $("#anResultados");
  mostrarSpinner(contenedor, "Buscando registros de anamnesis...");

  try {
    const url = `${API.anamnesis.base}${API.anamnesis.buscarCedula}${encodeURIComponent(cedula)}`;
    const datos = await peticionJSON(url);
    const registros = extraerArreglo(datos);
    state.anamnesis = registros;

    if (registros.length === 0) {
      mostrarEstadoVacio(contenedor, "Sin resultados", `No se encontraron registros de anamnesis para la cédula ${cedula}.`, "bi-clipboard2-x");
      return;
    }
    mostrarTablaAnamnesis(registros, contenedor);
  } catch (error) {
    mostrarEstadoVacio(contenedor, "No se pudo consultar el servicio", error.message, "bi-plug");
    mostrarToast("No fue posible conectar con el servicio de anamnesis.", "danger");
  }
}

function mostrarTablaAnamnesis(registros, contenedor) {
  const filas = registros.map((registro, indice) => `
    <tr data-indice="${indice}">
      <td class="patient-id text-center">${escapeHtml(valorODefault(registro.nombrePaciente))}</td>
      <td class="patient-name text-center">${escapeHtml(valorODefault(registro.nombreMedico))}</td>
      <td class="text-center">${escapeHtml(valorODefault(registro.motivosConsulta))}</td>
      <td class="text-center">${formatearFecha(registro.fechaRegistro)}</td>
      <td>
        <div class="d-flex justify-content-center">
          <div class="btn-group" role="group" aria-label="Acciones">

                <button class="btn btn-info btn-sm" data-accion="ver" data-indice="${indice}">
                    <i class="fas fa-eye"></i>
                </button>

                <button class="btn btn-warning btn-sm" data-accion="editar" data-indice="${indice}">
                    <i class="fas fa-pencil-alt"></i>
                </button>

                <button class="btn btn-danger btn-sm" data-accion="eliminar" data-indice="${indice}">
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
            <th class="text-center">Nombre paciente</th>
            <th class="text-center">Médico responsable</th>
            <th class="text-center">Motivo de la consulta</th>
            <th class="text-center">Fecha</th>
            <th class="text-center">Acciones</th>
          </tr>
        </thead>
        <tbody>${filas}</tbody>
      </table>
    </div>
  `;

  // Asigna eventos de clic a los botones de acción para ver, editar o eliminar registros de anamnesis
  contenedor.querySelectorAll("[data-accion]").forEach(boton => {
    boton.addEventListener("click", () => {
      // console.log("CLICK BOTON ANAMNESIS");
      const registro = state.anamnesis[Number(boton.dataset.indice)];
      // console.log("STATE ANAMNESIS:", state.anamnesis);
      // console.log("REGISTRO OBTENIDO:", registro);
      const accion = boton.dataset.accion;
      // if (accion === "ver") {
      //   $("#anVerSubtitle").textContent = `N.° ${valorODefault(registro.numeroAnamnesis)}`;
      //   construirVistaAnamnesis(registro);
      //   abrirModal("modalAnVer");
      // }
      // if (accion === "editar") {
      //   $("#anEditarSubtitle").textContent = `N.° ${valorODefault(registro.numeroAnamnesis)}`;
      //   llenarFormularioAnamnesis(registro);
      //   abrirModal("modalAnEditar");
      // }
      if (accion === "ver") {
        // console.log("ENTRANDO A VER ANAMNESIS");
        abrirPaginaAnamnesis(
          registro,
          "ver"
        );
      }
      if (accion === "editar") {
        // console.log("ENTRANDO A EDITAR ANAMNESIS");
        abrirPaginaAnamnesis(
          registro,
          "editar"
        );
      }
      if (accion === "eliminar") {
        solicitarEliminacion(
          "anamnesis",
          registro,
          boton.closest("tr"),
          `anamnesis N.° ${registro.numeroAnamnesis}`
        );
      }
    });
  });
}

// Guarda el registro de anamnesis en el almacenamiento de sesión y redirige a la página principal de anamnesis y examen físico
function abrirPaginaAnamnesis(registro, modo){
  // console.log("ABRIENDO ANAMNESIS:", registro);
  sessionStorage.setItem(
    "anamnesisSeleccionada",
    JSON.stringify(registro)
  );
  window.location.href =`/anamnesis-examen-fisico?modulo=examenfisico&modo=${modo}`;
}

// Guarda los datos del examen físico en el sessionStorage y redirige a la página correspondiente con su respectivo modo
function abrirPaginaExamenFisico(registro, modo) {
  // console.log("ABRIENDO EXAMEN FISICO:", registro);
  sessionStorage.setItem(
    "examenFisicoSeleccionado",
    JSON.stringify(registro)
  );
  window.location.href =
    `/anamnesis-examen-fisico?modulo=examenfisico&modo=${modo}`;
}

async function guardarAnamnesis(evento) {
  evento.preventDefault();
  const cuerpo = leerFormularioAnamnesis();
  const id = cuerpo.id;

  try {
    const url = `${API.anamnesis.base}${API.anamnesis.detalle}${encodeURIComponent(id)}`;
    await peticionJSON(url, { method: "PUT", body: JSON.stringify(cuerpo) });
    mostrarToast("La anamnesis se guardó correctamente.", "success");
    cerrarModal("modalAnEditar");
    await cargarAnamnesis();
  } catch (error) {
    mostrarToast("No se pudo guardar la anamnesis. " + error.message, "danger");
  }
}

/* ============================================================
  15. ANAMNESIS — REGISTRO (nuevo: crear-anamnesis.html)
   ============================================================ */

const ANAMNESIS_CREAR_TOGGLES_PERSONALES = [
  ["alergiaMedicamentos", "descripcionAlergias"],
  ["vacunas", "descripcionVacunas"],
  ["patologiasClinicas", "descripcionPatologiasClinicas"],
  ["medicacionHabitual", "descripcionMedicacionHabitual"],
  ["antecedentesQuirurgicos", "descripcionAntecedentesQuirurgicos"],
  ["habitos", "descripcionHabitos"],
  ["condicionSocioeconomica", "descripcionCondicionSocioeconomica"],
  ["discapacidad", "descripcionDiscapacidad"],
  ["religion", "descripcionReligion"],
  ["tipificacionSanguinea", "descripcionTipificacionSanguinea"]
];

const ANAMNESIS_CREAR_FAMILIARES = [
  "familiarCardiopatia", "familiarHipertension", "familiarEnfermedadCerebroVascular",
  "familiarEndocrinoMetabolico", "familiarCancer", "familiarTuberculosis",
  "familiarEnfermedadMental", "familiarEnfermedadInfecciosa", "familiarMalformacion"
  // familiarOtro se maneja aparte porque trae familiarOtroDescripcion
];

const ANAMNESIS_CREAR_SISTEMAS = [
  ["sistemaPielAnexos", "descripcionPielAnexos"],
  ["sistemaOrganosDeLosSentidos", "descripcionOrganosDeLosSentidos"],
  ["sistemaRespiratorio", "descripcionRespiratorio"],
  ["sistemaCardiovascular", "descripcionCardiovascular"],
  ["sistemaDigestivo", "descripcionDigestivo"],
  ["sistemaGenitoUrinario", "descripcionGenitoUrinario"],
  ["sistemaMusculoEsqueletico", "descripcionMusculoEsqueletico"],
  ["sistemaEndocrino", "descripcionEndocrino"],
  ["sistemaHemoLinfatico", "descripcionHemoLinfatico"],
  ["sistemaNervioso", "descripcionNervioso"]
];

function activarTogglesFormularioAnamnesisCrear() {
  const formulario = $("#formAnCrear");
  if (!formulario || formulario.dataset.toggleListo) return;
  formulario.dataset.toggleListo = "true";

  formulario.addEventListener("change", (evento) => {
    const checkbox = evento.target;
    if (!checkbox.classList.contains("toggle-check")) return;
    const descripcion = document.getElementById(checkbox.dataset.target);
    if (!descripcion) return;
    descripcion.disabled = !checkbox.checked;
    checkbox.closest(".toggle-field").classList.toggle("is-checked", checkbox.checked);
    if (checkbox.checked) {
      descripcion.focus();
    } else {
      descripcion.value = "";
    }
  });
}

function limpiarFormularioAnamnesis() {
  const formulario = $("#formAnCrear");
  if (!formulario) return;

  formulario.reset();

  $all(".toggle-check", formulario).forEach(checkbox => {
    const descripcion = document.getElementById(checkbox.dataset.target);
    if (descripcion) {
      descripcion.disabled = true;
      descripcion.value = "";
    }

    const campo = checkbox.closest(".toggle-field");
    if (campo) {
      campo.classList.remove("is-checked");
    }
  });

  const campoFamiliarOtroDesc = $("#anCrear_familiarOtroDescripcion");
  if (campoFamiliarOtroDesc) {
    campoFamiliarOtroDesc.disabled = true;
  }

  const campoFecha = $("#anCrear_fechaRegistro");
  if (campoFecha) {
    campoFecha.value = new Date().toISOString().substring(0, 10);
  }
}

/** Abre el modal de creación con el formulario ya limpio. */
function abrirModalCrearAnamnesis() {
  limpiarFormularioAnamnesis();
  cargarMedicosAnamnesis();
  abrirModal("modalCrearAnamnesis");
}

/** Recolecta el formulario de creación como un objeto que respeta el DTO real. */
function leerFormularioCrearAnamnesis() {
  const valorTexto = (id) => ($("#" + id) ? $("#" + id).value.trim() : "");
  const valorChecked = (id) => Boolean($("#" + id) && $("#" + id).checked);
  const valorNumero = (id) => {
    const valor = valorTexto(id);
    return valor === "" ? null : Number(valor);
  };
  const valorFecha = (id) => valorTexto(id) || null;

  const mujer = valorChecked("anCrear_sexoMujer");
  const hombre = valorChecked("anCrear_sexoHombre");

  const cuerpo = {
    cedulaPaciente: valorTexto("anCrear_cedulaPaciente"),
    cedulaMedico: valorTexto("anCrear_cedulaMedico"),
    fechaRegistro: valorTexto("anCrear_fechaRegistro"),
    motivosConsulta: valorTexto("anCrear_motivoConsulta") 
          ? [valorTexto("anCrear_motivoConsulta")]
          : [],

    otrasAlergias: valorChecked("anCrear_otrasAlergias"),

    ginecoObstetricosAndrologicos: {
      edadMenarquia: mujer ? valorNumero("anCrear_edadMenarquia") : null,
      edadMenopausia: mujer ? valorNumero("anCrear_edadMenopausia") : null,
      ciclos: mujer ? valorTexto("anCrear_ciclos") : "",
      edadInicioVidaSexual: mujer ? valorNumero("anCrear_edadInicioVidaSexual") : null,
      numeroGestas: mujer ? valorNumero("anCrear_numeroGestas") : null,
      numeroPartos: mujer ? valorNumero("anCrear_numeroPartos") : null,
      numeroAbortos: mujer ? valorNumero("anCrear_numeroAbortos") : null,
      numeroCesareas: mujer ? valorNumero("anCrear_numeroCesareas") : null,
      numeroHijosVivos: mujer ? valorNumero("anCrear_numeroHijosVivos") : null,
      fechaUltimaMenstruacion: mujer ? valorFecha("anCrear_fechaUltimaMenstruacion") : null,
      fechaUltimoParto: mujer ? valorFecha("anCrear_fechaUltimoParto") : null,
      fechaUltimaCitologiaCervical: mujer ? valorFecha("anCrear_fechaUltimaCitologiaCervical") : null,
      fechaUltimaColposcopia: mujer ? valorFecha("anCrear_fechaUltimaColposcopia") : null,
      fechaUltimaMamografia: mujer ? valorFecha("anCrear_fechaUltimaMamografia") : null,
      metodoPlanificacionFamiliar: mujer ? valorTexto("anCrear_metodoPlanificacionFamiliar") : "",
      terapiaHormonal: mujer ? valorTexto("anCrear_terapiaHormonal") : "",
      fechaUltimoAntigenoProstatico: hombre ? valorFecha("anCrear_fechaUltimoAntigenoProstatico") : null,
      fechaUltimoEcoProstatico: hombre ? valorFecha("anCrear_fechaUltimoEcoProstatico") : null
    },

    familiarOtro: valorChecked("anCrear_familiarOtro"),
    familiarOtroDescripcion: valorChecked("anCrear_familiarOtro")
      ? valorTexto("anCrear_familiarOtroDescripcion")
      : "",

    enfermedadActual: valorTexto("anCrear_enfermedadActual")
  };

  ANAMNESIS_CREAR_TOGGLES_PERSONALES.forEach(([campoBool, campoDesc]) => {
    cuerpo[campoBool] = valorChecked("anCrear_" + campoBool);
    cuerpo[campoDesc] = cuerpo[campoBool]
      ? valorTexto("anCrear_" + campoDesc)
      : "";
  });

  ANAMNESIS_CREAR_FAMILIARES.forEach((campo) => {
    cuerpo[campo] = valorChecked("anCrear_" + campo);
  });

  ANAMNESIS_CREAR_SISTEMAS.forEach(([campoBool, campoDesc]) => {
    cuerpo[campoBool] = valorChecked("anCrear_" + campoBool);
    cuerpo[campoDesc] = cuerpo[campoBool]
      ? valorTexto("anCrear_" + campoDesc)
      : "";
  });

  return cuerpo;
}

/** Envía la anamnesis nueva. Nombrada crearAnamnesis(): ver aviso arriba. */
async function crearAnamnesis(evento) {
  evento.preventDefault();

  const cuerpo = leerFormularioCrearAnamnesis();

  // console.log("JSON ANAMNESIS A ENVIAR:", JSON.stringify(cuerpo, null, 2));

  if (!cuerpo.cedulaPaciente) {
    mostrarToast("Ingresa la cédula del paciente antes de guardar.", "warning");
    return;
  }

  if (!cuerpo.cedulaMedico) {
    mostrarToast("Selecciona un médico antes de guardar.", "warning");
    return;
  }

  try {
    await peticionJSON(API.anamnesis.crear, { method:"POST", body:JSON.stringify(cuerpo) });

    mostrarToast("La anamnesis se registró correctamente.", "success");
    cerrarModal("modalCrearAnamnesis");
    limpiarFormularioAnamnesis();

  } catch(error) {
    mostrarToast("No se pudo registrar la anamnesis. " + error.message, "danger");
  }
}

async function crearAnamnesis(evento) {
  evento.preventDefault();

  const cuerpo = leerFormularioCrearAnamnesis();

  // console.log("JSON ANAMNESIS A ENVIAR:", JSON.stringify(cuerpo, null, 2));

  if (!cuerpo.cedulaPaciente) {
    mostrarToast("Ingresa la cédula del paciente antes de guardar.", "warning");
    return false;
  }

  if (!cuerpo.cedulaMedico) {
    mostrarToast("Selecciona un médico antes de guardar.", "warning");
    return false;
  }

  try {
    await peticionJSON(API.anamnesis.crear, {
      method:"POST",
      body: JSON.stringify(cuerpo)
    });

    mostrarToast("La anamnesis se registró correctamente.", "success");
    cerrarModal("modalCrearAnamnesis");
    limpiarFormularioAnamnesis();

    return true;

  } catch(error) {
    mostrarToast(
      "No se pudo registrar la anamnesis. " + error.message,
      "danger"
    );
    return false;
  }
}

// Actualiza una anamnesis existente utilizando el mismo formulario de creación
async function actualizarAnamnesis() {
  const cuerpo = leerFormularioCrearAnamnesis();

  try {
    const url = `${API.anamnesis.base}${API.anamnesis.detalle}${encodeURIComponent(window.idAnamnesisEditar)}`;

    // console.log("URL PUT:", url);
    // console.log("ID ANAMNESIS EDITAR:", window.idAnamnesisEditar);

    await peticionJSON(url, {
      method: "PUT",
      body: JSON.stringify(cuerpo)
    });

    mostrarToast(
      "La anamnesis se actualizó correctamente.",
      "success"
    );

    return true;

  } catch (error) {
    console.error(
      "Error actualizando anamnesis:",
      error
    );

    mostrarToast(
      "No se pudo actualizar la anamnesis.",
      "danger"
    );

    return false;
  }
}