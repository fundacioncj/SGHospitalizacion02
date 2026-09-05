/* ============================================================================
verAnamnesisExamenFisico.js
Ficha HCU-003 exclusivamente para VISUALIZACIÓN / IMPRESIÓN.
Los datos se cargan desde BD.
============================================================================ */

const SIN_REGISTRO = "Sin registro";

document.addEventListener("DOMContentLoaded", cargarFicha);

/* ============================================================================
CARGA PRINCIPAL
============================================================================ */

async function cargarFicha() {
    try {
        await cargarDesdeBD();
    } catch (error) {
        console.error("ERROR CARGANDO FICHA:", error);
    }
}

/* ============================================================================
UTILIDADES
============================================================================ */

function setTexto(id, valor) {
    const el = document.getElementById(id);
    if (!el) return;

    const vacio =
        valor === null ||
        valor === undefined ||
        valor === "";

    el.textContent = vacio ? SIN_REGISTRO : String(valor);
    el.classList.toggle("text-muted-empty", vacio);
}

function estaSeleccionado(valor) {
    return (
        valor === true ||
        valor === "true" ||
        valor === "TRUE" ||
        valor === "X" ||
        valor === "x" ||
        valor === 1 ||
        valor === "1"
    );
}

function setCheck(id, valor) {
    const el = document.getElementById(id);
    if (!el) return;

    const marcado = estaSeleccionado(valor);

    el.textContent = marcado ? "X" : "—";
    el.classList.toggle("marcado", marcado);
}

function valorFecha(valor) {
    if (!valor) return SIN_REGISTRO;

    if (
        typeof valor === "string" &&
        valor.includes("T")
    ) {
        return valor.split("T")[0];
    }

    return valor;
}

function capitalizar(valor) {
    if (!valor) return "";

    return (
        valor.charAt(0).toUpperCase() +
        valor.slice(1)
    );
}

function escaparHTML(valor) {
    if (
        valor === null ||
        valor === undefined ||
        valor === ""
    ) {
        return SIN_REGISTRO;
    }

    return String(valor)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

/* ============================================================================
CABECERA PÁGINA 1
============================================================================ */

function llenarFichaCabecera(examen, anamnesis) {
    const registro = examen || anamnesis || {};

    setTexto(
        "vfNumeroHistoriaClinica",
        examen?.numeroHistoriaClinica ||
        anamnesis?.numeroHistoriaClinica
    );

    const nombre =
        examen?.nombrePaciente ||
        anamnesis?.nombrePaciente;

    const cedula =
        examen?.cedulaPaciente ||
        anamnesis?.cedulaPaciente;

    setTexto(
        "vfNombrePaciente",
        nombre
    );

    setTexto(
        "vfCedulaPaciente",
        cedula
    );

    separarNombrePaciente(nombre);

    setTexto(
        "vfFechaRegistro",
        registro.fechaRegistro
    );

    setTexto(
        "vfNombreMedico",
        examen?.nombreMedico
    );

    setTexto(
        "vfCedulaMedico",
        examen?.cedulaMedico ||
        examen?.medicoId
    );

    setTexto(
        "vfProfesionalFecha",
        examen?.fechaRegistro
    );

    setTexto(
        "vfProfesionalNombreMedico",
        examen?.nombreMedico
    );

    setTexto(
        "vfProfesionalCedulaMedico",
        examen?.cedulaMedico ||
        examen?.medicoId
    );

    setTexto(
        "vfTipoSangre",
        anamnesis?.descripcionTipificacionSanguinea
    );

    setTexto(
        "vfUnicodigo",
        registro.unicodigo
    );

    setTexto(
        "vfEstablecimiento",
        registro.establecimiento
    );

    setTexto(
        "vfNumeroArchivo",
        registro.numeroArchivo
    );

    if (registro.edad !== undefined) {
        setTexto(
            "vfEdad",
            registro.edad
        );
    }

    setTexto(
        "vfCondicionEdad",
        registro.condicionEdad ||
        "A — Años"
    );
}

function separarNombrePaciente(nombre) {
    if (!nombre) return;

    const partes = String(nombre)
        .trim()
        .split(/\s+/);

    setTexto(
        "vfPrimerApellido",
        partes[0]
    );

    setTexto(
        "vfSegundoApellido",
        partes[1]
    );

    setTexto(
        "vfPrimerNombre",
        partes[2]
    );

    setTexto(
        "vfSegundoNombre",
        partes.slice(3).join(" ")
    );
}

/* ============================================================================
DATOS DEL USUARIO / PACIENTE — PÁGINA 2
============================================================================ */

function cargarDatosPacientePagina2(examen, anamnesis) {
    // console.log("==========================================");
    // console.log("CARGANDO DATOS DEL PACIENTE — PÁGINA 2");
    // console.log("EXAMEN:", examen);
    // console.log("ANAMNESIS:", anamnesis);
    // console.log("==========================================");

    const poner = (id, valor) => {
        const elemento = document.getElementById(id);

        if (!elemento) {
            console.error(
                "NO EXISTE ELEMENTO DE PÁGINA 2:",
                id
            );
            return;
        }

        const texto =
            valor !== undefined &&
            valor !== null &&
            String(valor).trim() !== ""
                ? String(valor).trim()
                : SIN_REGISTRO;

        elemento.textContent = texto;
    };

    /* ------------------------------------------------------------------------
    PRIMER APELLIDO
    ------------------------------------------------------------------------ */

    const primerApellido =
        document.getElementById(
            "vfPrimerApellido"
        )?.textContent?.trim();

    /* ------------------------------------------------------------------------
    PRIMER NOMBRE
    ------------------------------------------------------------------------ */

    const primerNombre =
        document.getElementById(
            "vfPrimerNombre"
        )?.textContent?.trim();

    /* ------------------------------------------------------------------------
    EDAD
    ------------------------------------------------------------------------ */

    const edad =
        document.getElementById(
            "vfEdad"
        )?.textContent?.trim();

    /* ------------------------------------------------------------------------
    NÚMERO DE HISTORIA CLÍNICA
    ------------------------------------------------------------------------ */

    const numeroHistoriaClinica =
        examen?.numeroHistoriaClinica ||
        examen?.numeroHistoriaClinicaUnica ||
        examen?.numeroHistoria ||
        anamnesis?.numeroHistoriaClinica ||
        anamnesis?.numeroHistoriaClinicaUnica ||
        anamnesis?.numeroHistoria;

    /* ------------------------------------------------------------------------
    NÚMERO DE ARCHIVO
    ------------------------------------------------------------------------ */

    const numeroArchivo =
        examen?.numeroArchivo ||
        examen?.numeroArchivoPaciente ||
        examen?.archivo ||
        anamnesis?.numeroArchivo ||
        anamnesis?.numeroArchivoPaciente ||
        anamnesis?.archivo;

    /* ------------------------------------------------------------------------
    ESCRIBIR EN HTML
    ------------------------------------------------------------------------ */

    poner(
        "vfPagina2PrimerApellido",
        primerApellido
    );

    poner(
        "vfPagina2PrimerNombre",
        primerNombre
    );

    poner(
        "vfPagina2Edad",
        edad
    );

    poner(
        "vfPagina2NumeroHistoriaClinica",
        numeroHistoriaClinica
    );

    poner(
        "vfPagina2NumeroArchivo",
        numeroArchivo
    );

    // console.log(
    //     "DATOS PÁGINA 2:",
    //     {
    //         primerApellido,
    //         primerNombre,
    //         edad,
    //         numeroHistoriaClinica,
    //         numeroArchivo
    //     }
    // );
}

/* ============================================================================
ANAMNESIS
============================================================================ */

function llenarFichaAnamnesis(registro) {
    if (!registro) return;

    // console.log(
    //     "========== ANAMNESIS PARA LLENAR =========="
    // );

    // console.log(
    //     JSON.stringify(
    //         registro,
    //         null,
    //         2
    //     )
    // );

    /* ------------------------------------------------------------------------
    B. MOTIVO DE CONSULTA
    ------------------------------------------------------------------------ */

    const motivos =
        Array.isArray(
            registro.motivosConsulta
        )
            ? registro.motivosConsulta
            : [];

    for (let i = 1; i <= 6; i++) {
        setTexto(
            "vfMotivo" + i,
            motivos[i - 1]
        );
    }

    /* ------------------------------------------------------------------------
    C. ANTECEDENTES PERSONALES
    ------------------------------------------------------------------------ */

    const personales = [
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

    personales.forEach(campo => {
        setCheck(
            "vfAnamnesis" +
            capitalizar(campo),
            registro[campo]
        );
    });

    const descripcionesPersonales = [
        "descripcionAlergias",
        "descripcionOtrasAlergias",
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

    descripcionesPersonales.forEach(campo => {
        setTexto(
            "vfAnamnesis" +
            capitalizar(campo),
            registro[campo]
        );
    });

    setCheck(
        "vfAnamnesisNoRefierePersonal",
        registro.antecedentesPersonalesNoRefiere
    );

    /* ------------------------------------------------------------------------
    AN-04. GINECO / ANDROLÓGICOS
    ------------------------------------------------------------------------ */

    if (
        registro.ginecoObstetricosAndrologicos
    ) {
        const g =
            registro.ginecoObstetricosAndrologicos;

        Object.keys(g).forEach(campo => {
            setTexto(
                "vfGineco" +
                capitalizar(campo),
                valorFecha(
                    g[campo]
                )
            );
        });
    }

    /* ------------------------------------------------------------------------
    D. ANTECEDENTES FAMILIARES
    ------------------------------------------------------------------------ */

    const familiares = [
        "familiarCardiopatia",
        "familiarHipertension",
        "familiarEnfermedadCerebroVascular",
        "familiarEndocrinoMetabolico",
        "familiarCancer",
        "familiarTuberculosis",
        "familiarEnfermedadMental",
        "familiarEnfermedadInfecciosa",
        "familiarMalformacion",
        "familiarOtro"
    ];

    familiares.forEach(campo => {
        setCheck(
            "vfAnamnesis" +
            capitalizar(campo),
            registro[campo]
        );
    });

    setTexto(
        "vfAnamnesisFamiliarOtroDescripcion",
        registro.familiarOtroDescripcion
    );

    setCheck(
        "vfAnamnesisNoRefiereFamiliar",
        registro.antecedentesFamiliaresNoRefiere
    );

    /* ------------------------------------------------------------------------
    E. ENFERMEDAD O PROBLEMA ACTUAL
    ------------------------------------------------------------------------ */

    setTexto(
        "vfAnamnesisEnfermedadActual",
        registro.enfermedadActual
    );

    /* ------------------------------------------------------------------------
    F. REVISIÓN POR SISTEMAS
    ------------------------------------------------------------------------ */

    const sistemas = [
        "sistemaPielAnexos",
        "sistemaOrganosDeLosSentidos",
        "sistemaRespiratorio",
        "sistemaCardiovascular",
        "sistemaDigestivo",
        "sistemaGenitoUrinario",
        "sistemaMusculoEsqueletico",
        "sistemaEndocrino",
        "sistemaHemoLinfatico",
        "sistemaNervioso"
    ];

    sistemas.forEach(campo => {
        setCheck(
            "vfAnamnesis" +
            capitalizar(campo),
            registro[campo]
        );
    });

    const descripcionesSistemas = [
        "descripcionPielAnexos",
        "descripcionOrganosDeLosSentidos",
        "descripcionRespiratorio",
        "descripcionCardiovascular",
        "descripcionDigestivo",
        "descripcionGenitoUrinario",
        "descripcionMusculoEsqueletico",
        "descripcionEndocrino",
        "descripcionHemoLinfatico",
        "descripcionNervioso"
    ];

    descripcionesSistemas.forEach(campo => {
        setTexto(
            "vfAnamnesis" +
            capitalizar(campo),
            registro[campo]
        );
    });
}

/* ============================================================================
EXAMEN FÍSICO
============================================================================ */

function llenarFichaExamenFisico(registro) {
    if (!registro) return;

    /* ------------------------------------------------------------------------
    G. CONSTANTES VITALES
    ------------------------------------------------------------------------ */

    setTexto(
        "vfExamenTemperatura",
        registro.temperatura
    );

    setTexto(
        "vfExamenPresionArterial",
        registro.presionArterial
    );

    setTexto(
        "vfExamenPulso",
        registro.pulso
    );

    setTexto(
        "vfExamenFrecuenciaRespiratoria",
        registro.frecuenciaRespiratoria
    );

    setTexto(
        "vfExamenPeso",
        registro.peso
    );

    setTexto(
        "vfExamenTalla",
        registro.talla
    );

    setTexto(
        "vfExamenImc",
        registro.imc
    );

    setTexto(
        "vfExamenPerimetroCefalico",
        registro.perimetroCefalico
    );

    setTexto(
        "vfExamenPulsioximetria",
        registro.pulsioximetria
    );

    /* ------------------------------------------------------------------------
    H. MARCAR REGIONAL Y SISTÉMICO
    ------------------------------------------------------------------------ */

    marcarExamenFisicoH(
        registro
    );

    /* ------------------------------------------------------------------------
    H. MOSTRAR INFORMACIÓN DE LAS REGIONES SELECCIONADAS
    ------------------------------------------------------------------------ */

    cargarExamenH(
        registro
    );

    /* ------------------------------------------------------------------------
    I. ANÁLISIS
    ------------------------------------------------------------------------ */

    setTexto(
        "vfExamenAnalisis",
        registro.analisis
    );

    /* ------------------------------------------------------------------------
    J. DIAGNÓSTICOS
    ------------------------------------------------------------------------ */

    renderDiagnosticos(
        registro.diagnosticos
    );

    /* ------------------------------------------------------------------------
    K. PLAN DE TRATAMIENTO
    ------------------------------------------------------------------------ */

    setTexto(
        "vfExamenPlanTratamiento",
        registro.planTratamiento
    );
}

/* ============================================================================
H. MAPEO REGIONAL / SISTÉMICO
============================================================================ */

const CAMPOS_EXAMEN_H = {
    "PIEL - FANERAS": "pielFaneras",
    "CABEZA": "cabeza",
    "OJOS": "ojos",
    "OÍDOS": "oidos",
    "NARIZ": "nariz",
    "BOCA": "boca",
    "OROFARINGE": "orofaringe",
    "CUELLO": "cuello",
    "AXILAS - MAMAS": "axilasMamas",
    "TÓRAX": "torax",
    "ABDOMEN": "abdomen",
    "COLUMNA VERTEBRAL": "columnaVertebral",
    "INGLE-PERINÉ": "inglePerine",
    "MIEMBROS SUPERIORES": "miembrosSuperiores",
    "MIEMBROS INFERIORES": "miembrosInferiores",
    "ÓRGANOS DE LOS SENTIDOS": "organosSentidos",
    "RESPIRATORIO": "respiratorio",
    "CARDIO - VASCULAR": "cardioVascular",
    "DIGESTIVO": "digestivo",
    "GENITAL": "genital",
    "URINARIO": "urinario",
    "MÚSCULO - ESQUELÉTICO": "musculoEsqueletico",
    "ENDÓCRINO": "endocrino",
    "HEMO - LINFÁTICO": "hemoLinfatico",
    "NEUROLÓGICO": "neurologico"
};

/* ============================================================================
H. MARCAR LAS X EN EL HTML ESTÁTICO
============================================================================ */

function marcarExamenFisicoH(registro) {
    const celdasNombre =
        document.querySelectorAll(
            "td.col-hdr.text-left"
        );

    if (!celdasNombre.length) {
        console.warn(
            "NO SE ENCONTRARON CELDAS DEL EXAMEN FÍSICO H"
        );
        return;
    }

    celdasNombre.forEach(celda => {
        const nombre =
            normalizarTexto(
                celda.textContent
            );

        const campo =
            Object.keys(
                CAMPOS_EXAMEN_H
            ).find(
                clave =>
                    normalizarTexto(
                        clave
                    ) === nombre
            );

        if (!campo) return;

        const propiedad =
            CAMPOS_EXAMEN_H[
                campo
            ];

        const marcado =
            estaSeleccionado(
                registro[
                    propiedad
                ]
            );

        const celdaX =
            celda.nextElementSibling;

        if (!celdaX) return;

        celdaX.textContent =
            marcado ? "X" : "";

        celdaX.classList.toggle(
            "marcado",
            marcado
        );
    });
}

function normalizarTexto(texto) {
    return String(texto || "")
        .normalize("NFD")
        .replace(
            /[\u0300-\u036f]/g,
            ""
        )
        .replace(
            /\s+/g,
            " "
        )
        .trim()
        .toUpperCase();
}

/* ============================================================================
H. INFORMACIÓN DEL EXAMEN FÍSICO REGIONAL
============================================================================ */

function cargarExamenH(registro) {
    const contenedor =
        document.getElementById(
            "vfExamenH"
        );

    if (!contenedor) return;

    const regiones = [
        ["pielFaneras", "Piel y faneras"],
        ["cabeza", "Cabeza"],
        ["ojos", "Ojos"],
        ["oidos", "Oídos"],
        ["nariz", "Nariz"],
        ["boca", "Boca"],
        ["orofaringe", "Orofaringe"],
        ["cuello", "Cuello"],
        ["axilasMamas", "Axilas / Mamas"],
        ["torax", "Tórax"],
        ["abdomen", "Abdomen"],
        ["columnaVertebral", "Columna vertebral"],
        ["inglePerine", "Ingle / Periné"],
        ["miembrosSuperiores", "Miembros superiores"],
        ["miembrosInferiores", "Miembros inferiores"]
    ];

    const observaciones =
        regiones
            .map(
                ([campo, nombre]) => {
                    if (
                        !estaSeleccionado(
                            registro[campo]
                        )
                    ) {
                        return "";
                    }

                    const campoDescripcion =
                        "descripcion" +
                        capitalizar(
                            campo
                        );

                    const descripcion =
                        registro[
                            campoDescripcion
                        ];

                    if (
                        descripcion === null ||
                        descripcion === undefined ||
                        String(
                            descripcion
                        ).trim() === ""
                    ) {
                        return `
                            <div style="margin-bottom:4px;">
                                <strong>${nombre}:</strong>
                                Sin descripción
                            </div>
                        `;
                    }

                    return `
                        <div style="margin-bottom:4px;">
                            <strong>${nombre}:</strong>
                            ${escaparHTML(
                                String(
                                    descripcion
                                ).trim()
                            )}
                        </div>
                    `;
                }
            )
            .filter(Boolean);

    contenedor.innerHTML =
        observaciones.length
            ? observaciones.join("")
            : "&nbsp;";
}

/* ============================================================================
J. DIAGNÓSTICOS
============================================================================ */

function renderDiagnosticos(diagnosticos) {
    const tbody =
        document.getElementById(
            "vfExamenDiagnosticosTableBody"
        );

    if (!tbody) return;

    tbody.innerHTML = "";

    const lista =
        Array.isArray(
            diagnosticos
        )
            ? diagnosticos
            : [];

    for (
        let fila = 0;
        fila < 3;
        fila++
    ) {
        const izquierda =
            lista[fila] || {};

        const derecha =
            lista[fila + 3] || {};

        const numeroIzq =
            fila + 1;

        const numeroDer =
            fila + 4;

        const tr =
            document.createElement(
                "tr"
            );

        const cieIzq =
            izquierda.cie ||
            izquierda.codigoCie ||
            izquierda.codigo ||
            "";

        const cieDer =
            derecha.cie ||
            derecha.codigoCie ||
            derecha.codigo ||
            "";

        const descripcionIzq =
            izquierda.descripcion ||
            "";

        const descripcionDer =
            derecha.descripcion ||
            "";

        const preIzq =
            estaSeleccionado(
                izquierda.presuntivo
            );

        const defIzq =
            estaSeleccionado(
                izquierda.definitivo
            );

        const preDer =
            estaSeleccionado(
                derecha.presuntivo
            );

        const defDer =
            estaSeleccionado(
                derecha.definitivo
            );

        tr.innerHTML = `
            <td class="col-hdr text-center py-0">
                ${numeroIzq}
            </td>

            <td>
                ${escaparHTML(
                    descripcionIzq
                )}
            </td>

            <td class="text-center">
                ${escaparHTML(
                    cieIzq
                )}
            </td>

            <td class="text-center">
                ${preIzq ? "X" : ""}
            </td>

            <td class="text-center">
                ${defIzq ? "X" : ""}
            </td>

            <td class="col-hdr text-center py-0">
                ${numeroDer}
            </td>

            <td>
                ${escaparHTML(
                    descripcionDer
                )}
            </td>

            <td class="text-center">
                ${escaparHTML(
                    cieDer
                )}
            </td>

            <td class="text-center">
                ${preDer ? "X" : ""}
            </td>

            <td class="text-center">
                ${defDer ? "X" : ""}
            </td>
        `;

        tbody.appendChild(
            tr
        );
    }
}

/* ============================================================================
CARGA DESDE BASE DE DATOS
============================================================================ */

// async function cargarDesdeBD() {
//     const registroExamen = sessionStorage.getItem("examenFisicoSeleccionado");

//     if (!registroExamen) {
//         console.error("NO EXISTE examenFisicoSeleccionado EN SESSIONSTORAGE");
//         return;
//     }

//     let examen;

//     try {
//         examen = JSON.parse(registroExamen);
//     } catch (error) {
//         console.error("ERROR PARSEANDO examenFisicoSeleccionado:", error);
//         return;
//     }

//     renderFiguraExamenFisicoPDF(examen);

//     llenarFichaCabecera(examen, null);
//     llenarFichaExamenFisico(examen);
//     cargarDatosPacientePagina2(examen, null);

//     const cedula = examen.cedulaPaciente;

//     if (!cedula) {
//         llenarFichaCabecera(examen, null);
//         cargarDatosPacientePagina2(examen, null);
//         return;
//     }

//     const url =
//         `${API.anamnesis.base}` +
//         `${API.anamnesis.buscarCedula}` +
//         encodeURIComponent(cedula);

//     const respuesta = await peticionJSON(url);
//     const registros = extraerArreglo(respuesta);

//     if (!registros.length) {
//         llenarFichaCabecera(examen, null);
//         cargarDatosPacientePagina2(examen, null);
//         return;
//     }

//     const anamnesis = registros[0];

//     llenarFichaCabecera(examen, anamnesis);
//     llenarFichaAnamnesis(anamnesis);
//     cargarDatosPacientePagina2(examen, anamnesis);
// }
async function cargarDesdeBD() {
    const registroExamen = sessionStorage.getItem("examenFisicoSeleccionado");

    if (!registroExamen) {
        console.error("NO EXISTE examenFisicoSeleccionado EN SESSIONSTORAGE");
        return;
    }

    let examen;

    try {
        examen = JSON.parse(registroExamen);
    } catch (error) {
        console.error("ERROR PARSEANDO examenFisicoSeleccionado:", error);
        return;
    }

    // console.log("EXAMEN FÍSICO RECIBIDO:", examen);

    /*
     * IMPORTANTE:
     * El examen que llega desde sessionStorage puede estar desactualizado.
     * Primero pintamos con lo que tenemos y después intentamos obtener
     * nuevamente el registro actualizado desde BD.
     */
    renderFiguraExamenFisicoPDF(examen);

    llenarFichaCabecera(examen, null);
    llenarFichaExamenFisico(examen);
    cargarDatosPacientePagina2(examen, null);

    const cedula = examen.cedulaPaciente;

    if (!cedula) {
        console.error("EL EXAMEN FÍSICO NO TIENE CÉDULA DEL PACIENTE");
        return;
    }

    /*
     * Buscar nuevamente los exámenes del paciente.
     * Esto permite obtener los valores modificados directamente
     * desde el backend.
     */
    try {
        const urlExamenes =
            `${API.examenFisico.base}/paciente/cedula/` +
            encodeURIComponent(cedula);

        const respuestaExamenes =
            await peticionJSON(urlExamenes);

        const examenesActualizados =
            extraerArreglo(respuestaExamenes);

        const examenActualizado =
            examenesActualizados.find(
                item => item.id === examen.id
            );

        if (examenActualizado) {
            examen = examenActualizado;

            // console.log(
            //     "EXAMEN FÍSICO ACTUALIZADO DESDE BD:",
            //     examen
            // );

            // console.log(
            //     "REGIONES ACTUALIZADAS:",
            //     {
            //         pielFaneras: examen.pielFaneras,
            //         cabeza: examen.cabeza,
            //         ojos: examen.ojos,
            //         oidos: examen.oidos,
            //         nariz: examen.nariz,
            //         boca: examen.boca,
            //         orofaringe: examen.orofaringe,
            //         cuello: examen.cuello,
            //         axilasMamas: examen.axilasMamas,
            //         torax: examen.torax,
            //         abdomen: examen.abdomen,
            //         columnaVertebral: examen.columnaVertebral,
            //         inglePerine: examen.inglePerine,
            //         miembrosSuperiores: examen.miembrosSuperiores,
            //         miembrosInferiores: examen.miembrosInferiores
            //     }
            // );

            /*
             * AHORA SÍ:
             * pintar nuevamente usando el registro actualizado.
             */
            renderFiguraExamenFisicoPDF(examen);

            llenarFichaCabecera(examen, null);
            llenarFichaExamenFisico(examen);
            cargarDatosPacientePagina2(examen, null);
        } else {
            console.warn(
                "NO SE ENCONTRÓ EL EXAMEN ACTUALIZADO EN BD. ID:",
                examen.id
            );
        }
    } catch (error) {
        console.error(
            "ERROR OBTENIENDO EXAMEN ACTUALIZADO:",
            error
        );
    }

    /*
     * BUSCAR ANAMNESIS
     */
    const url =
        `${API.anamnesis.base}` +
        `${API.anamnesis.buscarCedula}` +
        encodeURIComponent(cedula);

    const respuesta =
        await peticionJSON(url);

    const registros =
        extraerArreglo(respuesta);

    if (!registros.length) {
        console.warn(
            "NO EXISTE ANAMNESIS PARA EL PACIENTE:",
            cedula
        );
        return;
    }

    const anamnesis = registros[0];

    llenarFichaCabecera(
        examen,
        anamnesis
    );

    llenarFichaAnamnesis(
        anamnesis
    );

    cargarDatosPacientePagina2(
        examen,
        anamnesis
    );

    console.log(
        "FICHA HCU-003 CARGADA CORRECTAMENTE"
    );
}

/* ============================================================================
GENERAR PDF DESDE LAS DOS PÁGINAS HTML
============================================================================ */

async function descargarPDF() {
    try {
        const registro = sessionStorage.getItem("examenFisicoSeleccionado");

        if (!registro) {
            mostrarToast("No existe un examen seleccionado.", "warning");
            return;
        }

        const examen = JSON.parse(registro);

        if (!examen.id) {
            mostrarToast("El examen no tiene un ID válido.", "warning");
            return;
        }

        const pagina1 = document.getElementById("pagina1");
        const pagina2 = document.getElementById("pagina2");

        if (!pagina1 || !pagina2) {
            mostrarToast(
                "No se encontraron las dos páginas de la ficha.",
                "danger"
            );
            return;
        }

        mostrarToast("Generando PDF...", "info");

        const capturar = async elemento => {
            return await html2canvas(elemento, {
                scale: 4,
                useCORS: true,
                allowTaint: true,
                backgroundColor: "#ffffff",
                logging: false,
                imageTimeout: 0,
                removeContainer: true
            });
        };

        const canvas1 = await capturar(pagina1);
        const canvas2 = await capturar(pagina2);

        const { jsPDF } = window.jspdf;

        const pdf = new jsPDF({
            orientation: "portrait",
            unit: "mm",
            format: "a4",
            compress: true
        });

        const anchoA4 = 210;
        const altoA4 = 297;

        /*
         * Márgenes pequeños para aprovechar
         * prácticamente toda la hoja.
         */
        const margenX = 3;
        const margenY = 3;

        const anchoDisponible = anchoA4 - (margenX * 2);
        const altoDisponible = altoA4 - (margenY * 2);

        function agregarCanvas(canvas, primera) {

            if (!primera) {
                pdf.addPage();
            }

            const canvasAncho = canvas.width;
            const canvasAlto = canvas.height;

            const proporcion = canvasAlto / canvasAncho;

            /*
             * Utilizamos prácticamente todo
             * el ancho disponible del A4.
             */
            let ancho = anchoDisponible;
            let alto = ancho * proporcion;

            /*
             * Solo reducimos si supera
             * físicamente la altura del A4.
             */
            if (alto > altoDisponible) {
                alto = altoDisponible;
                ancho = alto / proporcion;
            }

            /*
             * Centrado HORIZONTAL.
             */
            const x = (anchoA4 - ancho) / 2;

            /*
             * IMPORTANTE:
             * La página comienza ARRIBA,
             * como estaba originalmente.
             */
            const y = margenY;

            const imagen = canvas.toDataURL(
                "image/jpeg",
                1.0
            );

            pdf.addImage(
                imagen,
                "JPEG",
                x,
                y,
                ancho,
                alto,
                undefined,
                "FAST"
            );
        }

        agregarCanvas(canvas1, true);
        agregarCanvas(canvas2, false);

        pdf.save(`HCU-003-${examen.id}.pdf`);

        mostrarToast(
            "PDF descargado correctamente.",
            "success"
        );

    } catch (error) {

        console.error(
            "ERROR GENERANDO PDF:",
            error
        );

        mostrarToast(
            "No se pudo generar el PDF.",
            "danger"
        );
    }
}

// function renderFiguraExamenFisicoPDF(registro) {

//     const contenedor = document.getElementById("vfExamenFigura");

//     if (!contenedor) {
//         console.error("NO EXISTE #vfExamenFigura");
//         return;
//     }

//     const COLOR_NORMAL = "#d7dee6";
//     const COLOR_MARCADO = "#f4c542";

//     const color = campo =>
//         registro && registro[campo] === true
//             ? COLOR_MARCADO
//             : COLOR_NORMAL;

//     const vistas = {
//         front: {
//             titulo: "Frontal",
//             viewBox: "0 0 200 500",
//             width: 220
//         },
//         back: {
//             titulo: "Posterior",
//             viewBox: "0 0 200 500",
//             width: 220
//         },
//         left: {
//             titulo: "Izquierda",
//             viewBox: "0 0 150 500",
//             width: 200
//         },
//         right: {
//             titulo: "Derecha",
//             viewBox: "0 0 150 500",
//             width: 200
//         }
//     };

//     const crearFigura = (vista) => {

//         const coordenadas = EM_COORDS[vista];

//         let svg = `
//             <svg xmlns="http://www.w3.org/2000/svg"
//                  viewBox="${vistas[vista].viewBox}"
//                  width="${vistas[vista].width}"
//                  height="320"
//                  style="display:block;">
//         `;

//         Object.keys(coordenadas).forEach(regionId => {

//             const figuras = coordenadas[regionId];

//             figuras.forEach(shapeDef => {

//                 const atributos = Object.keys(shapeDef.attrs)
//                     .map(attr => `${attr}="${shapeDef.attrs[attr]}"`)
//                     .join(" ");

//                 svg += `
//                     <${shapeDef.tag}
//                         ${atributos}
//                         fill="${color(regionId)}"
//                         stroke="#555"
//                         stroke-width="2"/>
//                 `;
//             });
//         });

//         svg += `</svg>`;

//         return `
//             <div style="text-align:center;flex:1;">
//                 <div style="font-weight:bold;margin-bottom:5px;">
//                     ${vistas[vista].titulo}
//                 </div>
//                 ${svg}
//             </div>
//         `;
//     };

//     contenedor.innerHTML = `
//         <div style="width:100%;min-height:360px;display:flex;align-items:flex-start;justify-content:center;gap:15px;">
//             ${crearFigura("front")}
//             ${crearFigura("back")}
//             ${crearFigura("left")}
//             ${crearFigura("right")}
//         </div>
//     `;
// }

function renderFiguraExamenFisicoPDF(registro) {
    const contenedor = document.getElementById("vfExamenFigura");

    if (!contenedor) {
        console.error("NO EXISTE #vfExamenFigura");
        return;
    }

    const COLOR_NORMAL = "#d7dee6";
    const COLOR_MARCADO = "#f4c542";

    const color = campo =>
        registro && registro[campo] === true
            ? COLOR_MARCADO
            : COLOR_NORMAL;

    const vistas = ["front", "back", "left", "right"];

    const nombres = {
        front: "Frontal",
        back: "Posterior",
        left: "Izquierda",
        right: "Derecha"
    };

    contenedor.innerHTML = `
        <div style="
            width:100%;
            display:grid;
            grid-template-columns:1fr 1fr;
            grid-template-rows:1fr 1fr;
            gap:8px;
            padding:6px;
            box-sizing:border-box;
        ">
            ${vistas.map(view => `
                <div style="
                    text-align:center;
                    display:flex;
                    flex-direction:column;
                    align-items:center;
                    justify-content:center;
                    min-width:0;
                ">
                    <div style="
                        font-weight:600;
                        font-size:12px;
                        margin-bottom:3px;
                    ">
                        ${nombres[view]}
                    </div>

                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="${EM_VIEWBOX[view]}"
                        width="${view === "front" || view === "back" ? "150" : "115"}"
                        height="220"
                        style="display:block;"
                    >
                        ${
                            Object.keys(EM_COORDS[view]).map(regionId =>
                                EM_COORDS[view][regionId].map(shapeDef => {
                                    const attrs = Object.keys(shapeDef.attrs)
                                        .map(attr => `${attr}="${shapeDef.attrs[attr]}"`)
                                        .join(" ");

                                    return `
                                        <${shapeDef.tag}
                                            ${attrs}
                                            fill="${color(regionId)}"
                                            stroke="#555"
                                            stroke-width="2"
                                        />
                                    `;
                                }).join("")
                            ).join("")
                        }
                    </svg>
                </div>
            `).join("")}
        </div>
    `;
}