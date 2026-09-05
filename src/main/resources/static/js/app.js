document.addEventListener("DOMContentLoaded", () => {

  // cargarUsuarioLogueado();

  inicializarNavegacionModulos();
  inicializarRelojEncabezado();
  inicializarBotonesAgregarItem();
  construirFormularioAnamnesis();
  configurarSexoAnamnesis();
  configurarSexoAnamnesisEditar();
  activarTogglesFormularioAnamnesisCrear();
  inicializarBusquedaPaciente();
  cargarMedicos();
  cargarMedicosAnamnesis();
  inicializarExamenFisicoRegional();
  cargarExamenFisicoModo();
  cargarAnamnesisModo();
  // if ($("#hospResultados")) cargarHospitalizaciones();
  if ($("#hospResultados")) {
    cargarHospitalizaciones();
    mostrarToastActualizacionHospitalizacion();
  }
  if ($("#hcResultados")) cargarHistoriasClinicas();
  if ($("#anResultados")) cargarAnamnesis();
  if ($("#examResultados")) cargarExamenesFisicos();
  // Búsquedas
  [
    ["hospBuscarBtn", buscarHospitalizacion],
    ["hcBuscarBtn", buscarHistoriaClinica],
    ["anBuscarBtn", buscarAnamnesis],
    ["examBuscarBtn", buscarExamenFisico]
  ].forEach(([id, accion]) => {
    const boton = $("#" + id);
    if (boton) boton.addEventListener("click", accion);
  });
  [
    ["hospCedulaInput", buscarHospitalizacion],
    ["hcCedulaInput", buscarHistoriaClinica],
    ["anCedulaInput", buscarAnamnesis],
    ["examCedulaInput", buscarExamenFisico]
  ].forEach(([id, accion]) => {
    const input = $("#" + id);
    if (!input) return;
    input.addEventListener("keydown", (evento) => {
      if (evento.key === "Enter") accion();
    });
  });
  // Formularios
  [
    ["formHospCrear", registrarHospitalizacion],
    // ["formHospEditar", guardarHospitalizacion],
    ["formHcEditar", guardarHistoriaClinica],
    ["formAnEditar", guardarAnamnesis]
  ].forEach(([id, accion]) => {
    const formulario = $("#" + id);
    if (formulario) {
      formulario.addEventListener("submit", accion);
    }
  });
  const formHcCrear = $("#formHcCrear");
  if (formHcCrear) {
    formHcCrear.addEventListener("submit", abrirHistoriaClinicaPorCedula);
  }
  const btn = $("#btnNuevaAnamnesis");
  if (btn) {
    btn.addEventListener("click", abrirModalCrearAnamnesis);
  }
  const formularioCrear = $("#formAnCrear");
  if (formularioCrear) {
    formularioCrear.addEventListener("submit", crearAnamnesis);
  }
  const btnConfirmarEliminar = $("#btnConfirmarEliminar");
  if (btnConfirmarEliminar) {
    btnConfirmarEliminar.addEventListener("click", simularEliminar);
  }
});

// async function cargarUsuarioLogueado() {
//   try {
//     const response = await fetch("/api/v1/security/usuario", {
//       method: "GET",
//       headers: {
//         "Authorization": "Bearer " + sessionStorage.getItem("token")
//       }
//     });

//     if (!response.ok) {
//       console.error("No se pudo obtener el usuario:", response.status);
//       return;
//     }

//     const datos = await response.json();

//     const elemento = document.getElementById("usuarioLogueado");

//     if (elemento) {
//       elemento.textContent = datos.username;
//     }

//   } catch (error) {
//     console.error("Error cargando usuario logueado:", error);
//   }
// }