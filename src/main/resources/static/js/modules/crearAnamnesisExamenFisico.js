/* ============================================================================
crearAnamnesisExamenFisico.js
PUENTE ENTRE:
- anamnesis.js
- examen-fisico.js
Pantalla:
- anamnesis-examen-fisico.html
NO contiene lógica médica.
Solo coordina el guardado completo.
============================================================================ */
document.addEventListener("DOMContentLoaded", () => {
  inicializarPantallaAnamnesisExamenFisico();
});

// Inicializa la pantalla de anamnesis y examen físico, ejecutando funciones de configuración regional, cargando los modos correspondientes y configurando el evento de guardado
function inicializarPantallaAnamnesisExamenFisico() {
  actualizarBreadcrumbModo();

  if (typeof inicializarExamenFisicoRegional === "function") {
    inicializarExamenFisicoRegional();
  }

  cargarExamenFisicoModo();
  cargarAnamnesisModo();

  const btnGuardar = $("#btnGuardarAnamnesisExamenFisico");

  if (btnGuardar && !btnGuardar.dataset.listo) {
    btnGuardar.dataset.listo = "true";

    btnGuardar.addEventListener(
      "click",
      guardarRegistroClinicoCompleto
    );
  }
}


/* ============================================================================
Sincroniza datos comunes entre módulos
============================================================================ */
function sincronizarDatosPaciente() {
  const cedulaPaciente = $("#anCrear_cedulaPaciente")?.value || "";
  const cedulaMedico = $("#anCrear_cedulaMedico")?.value || "";
  const fecha = $("#anCrear_fechaRegistro")?.value || "";

  window.datosRegistroClinico = {
    cedulaPaciente,
    cedulaMedico,
    fechaRegistro: fecha
  };
}
/* ============================================================================
Guardar anamnesis + examen físico
============================================================================ */
async function guardarRegistroClinicoCompleto() {
  try {
    sincronizarDatosPaciente();

    // console.log("MODO EDICION:", window.modoEdicionAnamnesis);
    // console.log("ID ANAMNESIS:", window.idAnamnesisEditar);

    let anamnesisGuardada;

    if (window.idAnamnesisEditar) {
      anamnesisGuardada = await actualizarAnamnesis();
    } else {
      anamnesisGuardada = await crearAnamnesis({
        preventDefault: () => {}
      });
    }

    if (!anamnesisGuardada) {
      return;
    }

    // console.log("=== INICIANDO GUARDADO EXAMEN FÍSICO ===");

    const examenGuardado = await guardarExamenFisico();

    // console.log("RESULTADO GUARDADO EXAMEN FÍSICO:", examenGuardado);

    if (!examenGuardado) {
      console.log("EXAMEN FÍSICO NO GUARDADO");
      return;
    }

    // console.log("EXAMEN FÍSICO GUARDADO CORRECTAMENTE");

    sessionStorage.setItem(
      "toastPendiente",
      JSON.stringify({
        mensaje: "Anamnesis y examen físico guardados correctamente.",
        tipo: "success"
      })
    );

    window.location.href = "/examen-fisico";
  } catch (error) {
    console.error("Error guardando registro clínico completo:", error);

    mostrarToast("No se pudo registrar el registro clínico.", "danger");
  }
}
/* ============================================================================
Cambio manual de pestañas Bootstrap 4
============================================================================ */
function activarTab(tabId) {
  const tab = document.querySelector(tabId);
  if (!tab) return;
  $(tab).tab("show");
}

function llenarExamenFisico(registro) {
  // console.log("DATOS RECIBIDOS PARA LLENAR EXAMEN FÍSICO:");
  // console.log(registro);
  const setValor = (id, valor) => {
    const elemento = document.getElementById(id);
    if (elemento) elemento.value = valor ?? "";
  };
  emConstantes.temperatura = registro.temperatura || "";
  emConstantes.presionArterial = registro.presionArterial || "";
  emConstantes.pulso = registro.pulso || "";
  emConstantes.frecuenciaRespiratoria = registro.frecuenciaRespiratoria || "";
  emConstantes.peso = registro.peso || "";
  emConstantes.talla = registro.talla || "";
  emConstantes.imc = registro.imc || "";
  emConstantes.perimetroCefalico = registro.perimetroCefalico || "";
  emConstantes.pulsioximetria = registro.pulsioximetria || "";
  const camposConstantes = [
    "temperatura",
    "presionArterial",
    "pulso",
    "frecuenciaRespiratoria",
    "peso",
    "talla",
    "perimetroCefalico",
    "pulsioximetria"
  ];
  camposConstantes.forEach((campo) => {
    const input = document.querySelector(`#examCvForm [data-field="${campo}"]`);
    if (input) input.value = registro[campo] ?? "";
  });
  setValor("examCvImc", registro.imc);
  setValor("exam_analisis", registro.analisis);
  setValor("exam_planTratamiento", registro.planTratamiento);
  Object.keys(EM_REGIONES).forEach((id) => {
    const descripcion = registro[
      "descripcion" + id.charAt(0).toUpperCase() + id.slice(1)
    ];
    if (registro[id]) {
      emRegional[id].estado = "observacion";
      emRegional[id].observacion = descripcion || "";
    } else {
      emRegional[id].estado = "normal";
      emRegional[id].observacion = descripcion || "";
    }
    emUpdateSVG(id);
    emUpdateCheckbox(id);
    emUpdateDot(id);
  });
  emRenderObservaciones();
  if (Array.isArray(registro.diagnosticos)) {
    emDiagnosticos = registro.diagnosticos.map((d, index) => ({
      id: "dx-cargado-" + index,
      cie: d.cie || "",
      descripcion: d.descripcion || "",
      pre: d.presuntivo || false,
      def: d.definitivo || false
    }));
    emRenderDiagnosticos();
  }
}
function bloquearExamenFisico() {
  // console.log("Modo VISUALIZAR examen físico");
  const contenedor = document.querySelector("#pane-examen-fisico");
  if (!contenedor) return;
  contenedor.querySelectorAll("input, textarea, select, button")
  .forEach((elemento) => {
    elemento.disabled = true;
  });
}
function habilitarExamenFisico() {
  // console.log("Modo EDITAR examen físico");
  const contenedor = document.querySelector("#pane-examen-fisico");
  if (!contenedor) return;
  contenedor.querySelectorAll("input, textarea, select, button")
  .forEach((elemento) => {
    elemento.disabled = false;
  });
}

// Carga los datos del examen físico desde el sessionStorage si el módulo coincide, llena el formulario, asigna el ID de edición y configura el modo de visualización o edición
function cargarExamenFisicoModo() {
  console.log("ENTRÓ cargarExamenFisicoModo");

  const params = new URLSearchParams(window.location.search);
  const modulo = params.get("modulo");
  const modo = params.get("modo");

  if (modulo !== "examenfisico") return;

  const registro = sessionStorage.getItem("examenFisicoSeleccionado");
  if (!registro) return;

  const datos = JSON.parse(registro);

  llenarExamenFisico(datos);

  window.idExamenEditar = datos.id;

  if (modo === "ver") {
    bloquearExamenFisico();
    document.getElementById("accionesExamenFisico").style.display = "none";
  }

  if (modo === "editar") {
    habilitarExamenFisico();
    window.modoEdicionExamen = true;
    document.getElementById("accionesExamenFisico").style.display = "block";
  }
}

// Carga la anamnesis correspondiente al paciente a través de su cédula cuando el módulo es examen físico, asignando el ID y configurando el modo de visualización o edición
async function cargarAnamnesisModo(){
  // console.log("ENTRÓ cargarAnamnesisModo");
  const params = new URLSearchParams(window.location.search);
  const modulo = params.get("modulo");
  const modo = params.get("modo");
  // console.log("MODULO:", modulo);
  // console.log("MODO:", modo);
  if(modulo !== "examenfisico"){
    return;
  }
  const registroExamen = sessionStorage.getItem("examenFisicoSeleccionado");
  if(!registroExamen){
    // console.log("NO EXISTE EXAMEN FISICO EN SESSION");
    return;
  }
  const examen = JSON.parse(registroExamen);
  // console.log("EXAMEN ACTUAL:", examen);
  const cedula = examen.cedulaPaciente;
  try{
    const url = `${API.anamnesis.base}${API.anamnesis.buscarCedula}${cedula}`;
    // console.log("BUSCANDO ANAMNESIS:", url);
    const respuesta = await peticionJSON(url);
    const registros = extraerArreglo(respuesta);
    // console.log("ANAMNESIS ENCONTRADAS:", registros);
    if(registros.length === 0){
      // console.log("NO EXISTEN ANAMNESIS");
      return;
    }
    const anamnesis = registros[0];
    // console.log(
    //   "ANAMNESIS CARGADA DESDE BD:",
    //   anamnesis
    // );
    llenarAnamnesis(anamnesis);
    // Guarda el id de la anamnesis para usarlo en PUT cuando sea edición
    window.idAnamnesisEditar = anamnesis.id;

    if (modo === "ver") {
      bloquearAnamnesis();
    }

    if (modo === "editar") {
      habilitarAnamnesis();
      window.modoEdicionAnamnesis = true;
    }
  }catch(error){
    console.error(
      "ERROR CARGANDO ANAMNESIS:",
      error
    );
  }
}

// Llena todos los campos del formulario de anamnesis con el registro recibido
function llenarAnamnesis(registro){
  console.log("LLENANDO ANAMNESIS:",registro);
  const setValor=(id,valor)=>{
    const campo=document.getElementById(id);
    if(campo){
      campo.value=valor ?? "";
    }
  };
  const setCheck=(id,valor)=>{
    const campo=document.getElementById(id);
    if(campo){
      campo.checked=Boolean(valor);
    }
  };
  // AN-01
  setValor(
    "anCrear_fechaRegistro",
    registro.fechaRegistro
  );
  setValor(
    "anCrear_cedulaPaciente",
    registro.cedulaPaciente
  );
  // AN-02
  setValor(
    "anCrear_motivoConsulta",
    Array.isArray(registro.motivosConsulta)
    ? registro.motivosConsulta.join(", ")
    : registro.motivosConsulta
  );
  // AN-03
  const personales=[
    "alergiaMedicamentos",
    "otrasAlergias",
    "vacunas",
    "patologiasClinicas",
    "medicacionHabitual",
    "antecedentesQuirurgicos",
    "habitos",
    "condicionSocioeconomica",
    "discapacidad",
    "religion",
    "tipificacionSanguinea"
  ];
  personales.forEach(campo=>{
    setCheck(
      "anCrear_"+campo,
      registro[campo]
    );
  });
  const descripciones=[
    "descripcionAlergias",
    "descripcionVacunas",
    "descripcionPatologiasClinicas",
    "descripcionMedicacionHabitual",
    "descripcionAntecedentesQuirurgicos",
    "descripcionHabitos",
    "descripcionCondicionSocioeconomica",
    "descripcionDiscapacidad",
    "descripcionReligion",
    "descripcionTipificacionSanguinea"
  ];
  descripciones.forEach(desc=>{
    setValor(
      "anCrear_"+desc,
      registro[desc]
    );
  });
  // AN-04
  if(registro.ginecoObstetricosAndrologicos){
    const g=registro.ginecoObstetricosAndrologicos;
    Object.keys(g).forEach(campo=>{
      setValor(
        "anCrear_"+campo,
        g[campo]
      );
    });
  }
  // AN-05
  [
    "familiarCardiopatia",
    "familiarHipertension",
    "familiarEnfermedadCerebroVascular",
    "familiarCancer",
    "familiarTuberculosis",
    "familiarEnfermedadMental",
    "familiarMalformacion",
    "familiarOtro"
  ].forEach(campo=>{
    setCheck(
      "anCrear_"+campo,
      registro[campo]
    );
  });
  setValor(
    "anCrear_familiarOtroDescripcion",
    registro.familiarOtroDescripcion
  );
  // AN-06
  setValor(
    "anCrear_enfermedadActual",
    registro.enfermedadActual
  );
  // AN-07
  [
    "sistemaPielAnexos",
    "sistemaRespiratorio",
    "sistemaCardiovascular",
    "sistemaDigestivo",
    "sistemaNervioso"
  ].forEach(campo=>{
    setCheck(
      "anCrear_"+campo,
      registro[campo]
    );
  });
  [
    "descripcionPielAnexos",
    "descripcionRespiratorio",
    "descripcionCardiovascular",
    "descripcionDigestivo",
    "descripcionNervioso"
  ].forEach(desc=>{
    setValor(
      "anCrear_"+desc,
      registro[desc]
    );
  });
}

// Deshabilita los elementos de los paneles de anamnesis para modo visualización
function bloquearAnamnesis(){
  // console.log("Modo VER anamnesis");
  const contenedor=document.querySelector("#pane-datos-personales");
  if(!contenedor)return;
  document
  .querySelectorAll("#pane-datos-personales input,#pane-datos-personales textarea,#pane-antecedentes input,#pane-antecedentes textarea,#pane-antecedentes select")
  .forEach(elemento=>{
    elemento.disabled=true;
  });
}

// Habilita los elementos de los paneles de anamnesis para modo edición
function habilitarAnamnesis(){
  // console.log("Modo EDITAR anamnesis");
  document
  .querySelectorAll("#pane-datos-personales input,#pane-datos-personales textarea,#pane-antecedentes input,#pane-antecedentes textarea,#pane-antecedentes select")
  .forEach(elemento=>{
    elemento.disabled=false;
  });
}

function actualizarBreadcrumbModo() {
  const breadcrumb = $("#breadcrumbModo");
  if (!breadcrumb) return;

  const params = new URLSearchParams(window.location.search);
  const modo = params.get("modo");

  if (modo === "ver") {
    breadcrumb.textContent = "Ver";
  } else if (modo === "editar") {
    breadcrumb.textContent = "Editar";
  } else {
    breadcrumb.textContent = "Crear";
  }
}