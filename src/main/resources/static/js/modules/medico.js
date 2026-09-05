async function cargarMedicos() { // FUNCION PARA EL LIST DEL HTML
  const select = $("#hospCrearMedico");
  if (!select) return;

  try {
    const medicos = await peticionJSON(API.medico.base);

    select.innerHTML = '<option value="">Seleccione un médico</option>';

    medicos.filter(medico => medico.activo !== false).forEach(medico => {
        const option = document.createElement("option");

        option.value = medico.cedula;
        option.textContent =`${medico.nombreCompleto} - ${medico.especialidad}`;

        select.appendChild(option);
      });

  } catch (error) {
    console.error("Error cargando médicos:", error);
    select.innerHTML ='<option value="">No se pudieron cargar los médicos D:</option>';
  }
}

async function cargarMedicosAnamnesis() {
  const select = $("#anCrear_cedulaMedico");
  if (!select) return;

  try {
    const medicos = await peticionJSON(API.medico.base);

    select.innerHTML = '<option value="">Seleccione un médico</option>';

    medicos.filter(medico => medico.activo !== false).forEach(medico => {
      const option = document.createElement("option");
      option.value = medico.cedula;
      option.textContent = `${medico.nombreCompleto} - ${medico.especialidad}`;
      select.appendChild(option);
    });

  } catch (error) {
    console.error("Error cargando médicos de anamnesis:", error);
    select.innerHTML = '<option value="">No se pudieron cargar los médicos D:</option>';
  }
}