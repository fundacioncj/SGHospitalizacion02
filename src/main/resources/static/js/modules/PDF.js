/* ============================================================================
verAnamnesisExamenFisico.js
Llena la ficha de solo lectura (verAnamnesisExamenFisico.html) a partir de:
- registro de Examen Físico  -> sessionStorage "examenFisicoSeleccionado"
  (mismo item ya usado por crearAnamnesisExamenFisico.js)
- registro de Anamnesis del mismo paciente -> API.anamnesis.buscarCedula
  (mismo endpoint ya usado por cargarAnamnesisModo en crearAnamnesisExamenFisico.js)

NOTA: no existe en los archivos revisados un endpoint combinado "ver ficha".
Si el backend llega a exponer uno (ej. GET /api/anamnesis-examen-fisico/{id}),
reemplazar cargarDatosFicha() por una sola llamada a ese endpoint.
============================================================================ */
document.addEventListener("DOMContentLoaded", () => {
  cargarDatosFicha();
});

const SIN_REGISTRO = "Sin registro";

function setTexto(id, valor) {
  const el = document.getElementById(id);
  if (!el) return;
  const esVacio = valor === null || valor === undefined || valor === "";
  el.textContent = esVacio ? SIN_REGISTRO : String(valor);
  el.classList.toggle("text-muted-empty", esVacio);
}

function setCheck(id, valor) {
  const el = document.getElementById(id);
  if (!el) return;
  const marcado = valor === true;
  el.textContent = marcado ? "X" : "—";
  el.classList.toggle("is-marcado", marcado);
}

async function cargarDatosFicha() {
  const registroExamen = sessionStorage.getItem("examenFisicoSeleccionado");
  if (!registroExamen) {
    console.log("NO EXISTE EXAMEN FÍSICO EN SESSION");
    return;
  }

  const examen = JSON.parse(registroExamen);
  llenarFichaExamenFisico(examen);
  llenarFichaCabecera(examen);

  const cedula = examen.cedulaPaciente;
  if (!cedula) return;

  try {
    const url = `${API.anamnesis.base}${API.anamnesis.buscarCedula}${cedula}`;
    const respuesta = await peticionJSON(url);
    const registros = extraerArreglo(respuesta);
    if (registros.length === 0) {
      console.log("NO EXISTEN ANAMNESIS PARA ESTE PACIENTE");
      return;
    }
    llenarFichaAnamnesis(registros[0]);
  } catch (error) {
    console.error("ERROR CARGANDO ANAMNESIS:", error);
  }
}

/* ============================================================================
Cabecera (A. y L.) — combina datos de ambos registros
============================================================================ */
function llenarFichaCabecera(examen) {
  setTexto("vfNumeroHistoriaClinica", examen.numeroHistoriaClinica);
  setTexto("vfNombrePaciente", examen.nombrePaciente);
  setTexto("vfCedulaPaciente", examen.cedulaPaciente);
  setTexto("vfFechaRegistro", examen.fechaRegistro);
  setTexto("vfNombreMedico", examen.nombreMedico);
  setTexto("vfCedulaMedico", examen.medicoId);

  setTexto("vfProfesionalFecha", examen.fechaRegistro);
  setTexto("vfProfesionalNombreMedico", examen.nombreMedico);
  setTexto("vfProfesionalCedulaMedico", examen.medicoId);
}

/* ============================================================================
G, H, I, J, K — Examen Físico (ExamenMedicoResponseDTO)
============================================================================ */
function llenarFichaExamenFisico(registro) {
  // G. Constantes vitales
  setTexto("vfExamenTemperatura", registro.temperatura);
  setTexto("vfExamenPresionArterial", registro.presionArterial);
  setTexto("vfExamenPulso", registro.pulso);
  setTexto("vfExamenFrecuenciaRespiratoria", registro.frecuenciaRespiratoria);
  setTexto("vfExamenPeso", registro.peso);
  setTexto("vfExamenTalla", registro.talla);
  setTexto("vfExamenImc", registro.imc);
  setTexto("vfExamenPerimetroCefalico", registro.perimetroCefalico);
  setTexto("vfExamenPulsioximetria", registro.pulsioximetria);

  // H. Regional
  const regional = [
    "pielFaneras", "cabeza", "ojos", "oidos", "nariz", "boca", "orofaringe",
    "cuello", "axilasMamas", "torax", "abdomen", "columnaVertebral",
    "inglePerine", "miembrosSuperiores", "miembrosInferiores"
  ];
  regional.forEach((campo) => {
    const idBase = "vfExamen" + campo.charAt(0).toUpperCase() + campo.slice(1);
    setCheck(idBase, registro[campo]);
    setTexto(
      idBase.replace("vfExamen", "vfExamenDescripcion"),
      registro["descripcion" + campo.charAt(0).toUpperCase() + campo.slice(1)]
    );
  });

  // H. Sistémico
  const sistemico = [
    "organosSentidos", "respiratorio", "cardioVascular", "digestivo",
    "genital", "urinario", "musculoEsqueletico", "endocrino",
    "hemoLinfatico", "neurologico"
  ];
  sistemico.forEach((campo) => {
    const idBase = "vfExamen" + campo.charAt(0).toUpperCase() + campo.slice(1);
    setCheck(idBase, registro[campo]);
    setTexto(
      idBase.replace("vfExamen", "vfExamenDescripcion"),
      registro["descripcion" + campo.charAt(0).toUpperCase() + campo.slice(1)]
    );
  });

  // I. Análisis
  setTexto("vfExamenAnalisis", registro.analisis);

  // J. Diagnóstico
  const tbody = document.getElementById("vfExamenDiagnosticosTableBody");
  if (tbody) {
    const diagnosticos = Array.isArray(registro.diagnosticos) ? registro.diagnosticos : [];
    if (diagnosticos.length === 0) {
      tbody.innerHTML = `<tr><td colspan="4" class="text-center text-muted">${SIN_REGISTRO}</td></tr>`;
    } else {
      tbody.innerHTML = diagnosticos.map((d) => `
        <tr>
          <td>${d.cie || SIN_REGISTRO}</td>
          <td>${d.descripcion || SIN_REGISTRO}</td>
          <td class="text-center">${d.presuntivo ? "X" : ""}</td>
          <td class="text-center">${d.definitivo ? "X" : ""}</td>
        </tr>
      `).join("");
    }
  }

  // K. Plan de tratamiento
  setTexto("vfExamenPlanTratamiento", registro.planTratamiento);
}

/* ============================================================================
B, C, D, E, F — Anamnesis (AnamnesisResponseDTO)
============================================================================ */
function llenarFichaAnamnesis(registro) {
  // B. Motivo de consulta
  const lista = document.getElementById("vfAnamnesisMotivosConsulta");
  if (lista) {
    const motivos = Array.isArray(registro.motivosConsulta) ? registro.motivosConsulta : [];
    lista.innerHTML = motivos.length
      ? motivos.map((m) => `<li>${m}</li>`).join("")
      : `<li class="text-muted-empty text-muted">${SIN_REGISTRO}</li>`;
  }

  // C. Antecedentes patológicos personales
  const personales = [
    "alergiaMedicamentos", "otrasAlergias", "vacunas", "patologiasClinicas",
    "medicacionHabitual", "antecedentesQuirurgicos", "habitos",
    "condicionSocioeconomica", "discapacidad", "religion", "tipificacionSanguinea"
  ];
  personales.forEach((campo) => {
    setCheck("vfAnamnesis" + campo.charAt(0).toUpperCase() + campo.slice(1), registro[campo]);
  });

  const descripcionesPersonales = [
    ["descripcionAlergias", "vfAnamnesisDescripcionAlergias"],
    ["descripcionVacunas", "vfAnamnesisDescripcionVacunas"],
    ["descripcionPatologiasClinicas", "vfAnamnesisDescripcionPatologiasClinicas"],
    ["descripcionMedicacionHabitual", "vfAnamnesisDescripcionMedicacionHabitual"],
    ["descripcionAntecedentesQuirurgicos", "vfAnamnesisDescripcionAntecedentesQuirurgicos"],
    ["descripcionHabitos", "vfAnamnesisDescripcionHabitos"],
    ["descripcionCondicionSocioeconomica", "vfAnamnesisDescripcionCondicionSocioeconomica"],
    ["descripcionDiscapacidad", "vfAnamnesisDescripcionDiscapacidad"],
    ["descripcionReligion", "vfAnamnesisDescripcionReligion"],
    ["descripcionTipificacionSanguinea", "vfAnamnesisDescripcionTipificacionSanguinea"]
  ];
  descripcionesPersonales.forEach(([campo, id]) => setTexto(id, registro[campo]));

  setCheck("vfAnamnesisNoRefierePersonal", registro.antecedentesPersonalesNoRefiere);

  // 12. Gineco-obstétricos / andrológicos
  if (registro.ginecoObstetricosAndrologicos) {
    const g = registro.ginecoObstetricosAndrologicos;
    Object.keys(g).forEach((campo) => {
      const id = "vfGineco" + campo.charAt(0).toUpperCase() + campo.slice(1);
      setTexto(id, g[campo]);
    });
  }

  // D. Antecedentes familiares
  const familiares = [
    "familiarCardiopatia", "familiarHipertension", "familiarEnfermedadCerebroVascular",
    "familiarEndocrinoMetabolico", "familiarCancer", "familiarTuberculosis",
    "familiarEnfermedadMental", "familiarEnfermedadInfecciosa", "familiarMalformacion",
    "familiarOtro"
  ];
  familiares.forEach((campo) => {
    setCheck("vfAnamnesis" + campo.charAt(0).toUpperCase() + campo.slice(1), registro[campo]);
  });
  setTexto("vfAnamnesisFamiliarOtroDescripcion", registro.familiarOtroDescripcion);
  setCheck("vfAnamnesisNoRefiereFamiliar", registro.antecedentesFamiliaresNoRefiere);

  // E. Enfermedad actual
  setTexto("vfAnamnesisEnfermedadActual", registro.enfermedadActual);

  // F. Revisión por sistemas
  const sistemas = [
    "sistemaPielAnexos", "sistemaOrganosDeLosSentidos", "sistemaRespiratorio",
    "sistemaCardiovascular", "sistemaDigestivo", "sistemaGenitoUrinario",
    "sistemaMusculoEsqueletico", "sistemaEndocrino", "sistemaHemoLinfatico",
    "sistemaNervioso"
  ];
  sistemas.forEach((campo) => {
    setCheck("vfAnamnesis" + campo.charAt(0).toUpperCase() + campo.slice(1), registro[campo]);
  });

  const descripcionesSistemas = [
    ["descripcionPielAnexos", "vfAnamnesisDescripcionPielAnexos"],
    ["descripcionOrganosDeLosSentidos", "vfAnamnesisDescripcionOrganosDeLosSentidos"],
    ["descripcionRespiratorio", "vfAnamnesisDescripcionRespiratorio"],
    ["descripcionCardiovascular", "vfAnamnesisDescripcionCardiovascular"],
    ["descripcionDigestivo", "vfAnamnesisDescripcionDigestivo"],
    ["descripcionGenitoUrinario", "vfAnamnesisDescripcionGenitoUrinario"],
    ["descripcionMusculoEsqueletico", "vfAnamnesisDescripcionMusculoEsqueletico"],
    ["descripcionEndocrino", "vfAnamnesisDescripcionEndocrino"],
    ["descripcionHemoLinfatico", "vfAnamnesisDescripcionHemoLinfatico"],
    ["descripcionNervioso", "vfAnamnesisDescripcionNervioso"]
  ];
  descripcionesSistemas.forEach(([campo, id]) => setTexto(id, registro[campo]));
}