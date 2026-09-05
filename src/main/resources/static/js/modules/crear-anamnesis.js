/* ============================================================================
 * crearAnamnesis.js
 * Módulo EXCLUSIVO para el registro de una nueva Anamnesis desde
 * anamnesis-examen-fisico.html (pestaña "Datos Personales" + "Antecedentes").
 * NO toca Examen Físico, Constantes Vitales ni Diagnóstico y Tratamiento.
 * NO reemplaza ni modifica el módulo existente anamnesis.js.
 * ==========================================================================*/

const ANEF_TOGGLES_PERSONALES = [
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

const ANEF_FAMILIARES = [
  "familiarCardiopatia", "familiarHipertension", "familiarEnfermedadCerebroVascular",
  "familiarCancer", "familiarTuberculosis", "familiarEnfermedadMental", "familiarMalformacion"
  // familiarOtro se maneja aparte porque trae familiarOtroDescripcion
];

const ANEF_SISTEMAS = [
  ["sistemaPielAnexos", "descripcionPielAnexos"],
  ["sistemaRespiratorio", "descripcionRespiratorio"],
  ["sistemaCardiovascular", "descripcionCardiovascular"],
  ["sistemaDigestivo", "descripcionDigestivo"],
  ["sistemaNervioso", "descripcionNervioso"]
];

/** Recolecta únicamente los campos de Anamnesis presentes en anamnesis-examen-fisico.html. */
function leerFormularioAnamnesisExamenFisico() {
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
    motivoConsulta: valorTexto("anCrear_motivoConsulta"),

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

  ANEF_TOGGLES_PERSONALES.forEach(([campoBool, campoDesc]) => {
    cuerpo[campoBool] = valorChecked("anCrear_" + campoBool);
    cuerpo[campoDesc] = cuerpo[campoBool] ? valorTexto("anCrear_" + campoDesc) : "";
  });

  ANEF_FAMILIARES.forEach((campo) => {
    cuerpo[campo] = valorChecked("anCrear_" + campo);
  });

  ANEF_SISTEMAS.forEach(([campoBool, campoDesc]) => {
    cuerpo[campoBool] = valorChecked("anCrear_" + campoBool);
    cuerpo[campoDesc] = cuerpo[campoBool] ? valorTexto("anCrear_" + campoDesc) : "";
  });

  return cuerpo;
}

/** Envía la nueva anamnesis al backend. Solo se usa desde el botón "Guardar Anamnesis". */
async function guardarAnamnesisExamenFisico() {
  const cuerpo = leerFormularioAnamnesisExamenFisico();

  if (!cuerpo.cedulaPaciente) {
    mostrarToast("Ingresa la cédula del paciente antes de guardar.", "warning");
    return;
  }
  if (!cuerpo.cedulaMedico) {
    mostrarToast("Selecciona un médico antes de guardar.", "warning");
    return;
  }

  try {
    await peticionJSON(API.anamnesis.base, { method: "POST", body: JSON.stringify(cuerpo) });
    mostrarToast("La anamnesis se registró correctamente.", "success");
    limpiarFormularioAnamnesisExamenFisico();
  } catch (error) {
    mostrarToast("No se pudo registrar la anamnesis. " + error.message, "danger");
  }
}

/** Limpia el formulario tras un guardado exitoso (reset + reactivar toggles apagados). */
function limpiarFormularioAnamnesisExamenFisico() {
  const formulario = $("#formAnCrear");
  if (!formulario) return;
  formulario.reset();
  $all(".toggle-check", formulario).forEach((checkbox) => {
    const descripcion = document.getElementById(checkbox.dataset.target);
    if (descripcion) {
      descripcion.disabled = true;
      descripcion.value = "";
    }
  });
  const campoFecha = $("#anCrear_fechaRegistro");
  if (campoFecha) campoFecha.value = new Date().toISOString().substring(0, 10);
}

/** Activa el botón "Guardar Anamnesis" (type="button", sin evento nativo). */
// function inicializarBotonGuardarAnamnesisExamenFisico() {
//   const boton = $("#btnGuardarAnamnesis");
//   if (!boton || boton.dataset.listo) return;
//   boton.dataset.listo = "true";
//   boton.addEventListener("click", guardarAnamnesisExamenFisico);
// }

function inicializarBotonGuardarExamenFisico(){
    const boton = $("#guardarExamenFisico");
    if(boton){
      boton.addEventListener("click", guardarExamenFisico);
    }
}