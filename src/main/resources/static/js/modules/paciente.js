function inicializarBusquedaPaciente(){
  const btn=$("#hospCrearVerificarPacienteBtn");
  if(!btn)return;

  btn.addEventListener("click",()=>{
    consultarPacientePorCedula($("#hospCrearCedulaPaciente").value.trim());
  });
}

async function consultarPacientePorCedula(cedula){
  const input=$("#hospCrearPacienteNombre");

  if(!cedula){
    input.value="";
    return;
  }

  try{
    const paciente=await peticionJSON(
      `${API.paciente.base}${API.paciente.buscarCedula}${encodeURIComponent(cedula)}`
    );

    input.value=paciente.nombreCompleto;

  }catch(e){
    input.value="Paciente no encontrado";
  }
}