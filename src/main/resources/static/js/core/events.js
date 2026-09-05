function inicializarNavegacionModulos() {
  const tarjetas = $all(".module-card");
  // AJUSTE MÍNIMO: en la versión de 3 páginas independientes no existen
  // ni .module-card ni los paneles; esta función sencillamente no aplica.
  if (tarjetas.length === 0) return;
  const paneles = {
    hospitalizacion: $("#panel-hospitalizacion"),
    historiaClinica: $("#panel-historiaClinica"),
    anamnesis: $("#panel-anamnesis")
  };

  function abrirModulo(nombre) {
    tarjetas.forEach(t => {
      const activa = t.dataset.module === nombre;
      t.classList.toggle("active", activa);
      t.setAttribute("aria-pressed", String(activa));
    });
    Object.entries(paneles).forEach(([clave, panel]) => {
      panel.classList.toggle("show", clave === nombre);
    });
    paneles[nombre].scrollIntoView({ behavior: "smooth", block: "start" });
  }

  tarjetas.forEach(tarjeta => {
    tarjeta.addEventListener("click", () => abrirModulo(tarjeta.dataset.module));
    tarjeta.addEventListener("keydown", (evento) => {
      if (evento.key === "Enter" || evento.key === " ") {
        evento.preventDefault();
        abrirModulo(tarjeta.dataset.module);
      }
    });
  });

  // Abre Hospitalización por defecto
  abrirModulo("hospitalizacion");
}