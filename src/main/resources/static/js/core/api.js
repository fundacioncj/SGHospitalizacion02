const API = {
  hospitalizacion: {
    base: "/api/hospitalizaciones",
    crear: "/api/hospitalizaciones",
    buscarCedula: "/paciente/cedula/",
    detalle: "/"
  },
  historiaClinica: {
    base: "/api/historias-clinicas",
    abrirPorCedula: "/abrir/cedula/",
    buscarCedula: "/paciente/cedula/",
    detalle: "/"
  },
  anamnesis: {
    base: "/api/anamnesis",
    crear: "/api/anamnesis",
    buscarCedula: "/paciente/cedula/",
    detalle: "/"
  },
  examenFisico: {
  base: "/api/examenes-medicos",
  buscarCedula: "/paciente/cedula/",
  detalle: "/"
  },
  paciente: {
    base: "/api/pacientes",
    buscarCedula: "/cedula/"
  },
  medico: {
    base: "/api/medicos"
  }
};

const state = {
  hospitalizacion: [],
  historiaClinica: [],
  anamnesis: [],
  eliminarPendiente: null // { tipo, id, elementoFila }
};