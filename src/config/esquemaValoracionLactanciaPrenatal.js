export const ESQUEMA_VALORACION_LACTANCIA_PRENATAL = {
    titulo: "Historia Clínica - Valoración de Ingreso Lactancia PRENATAL",
    endpoint: "/valoraciones",
    redireccion: "/valoraciones",
    secciones: [
        {
            titulo: "Información de Consulta e Ingreso",
            siempreVisible: true,
            campos: [
                { nombre: "moduloLactancia.tipoLactancia", tipo: "hidden", valorPorDefecto: "prenatal" },
                {
                    nombre: "codConsulta", etiqueta: "Código Consulta (CUPS)", tipo: "cups", requerido: true, placeholder: "Buscar procedimiento..."
                },
                { nombre: "fechaInicioAtencion", etiqueta: "Fecha y Hora Atención", tipo: "datetime-local", requerido: true, autoNow: true },
                {
                    nombre: "finalidadTecnologiaSalud", etiqueta: "Finalidad", tipo: "select", opciones: [
                        { valor: "10", etiqueta: "10 - Promoción de la salud" }
                    ], requerido: true, valorPorDefecto: "10"
                },
                {
                    nombre: "causaMotivoAtencion", etiqueta: "Causa Externa", tipo: "select", opciones: [
                        { valor: "21", etiqueta: "21 - Enfermedad general" }
                    ], requerido: true, valorPorDefecto: "21"
                },
                { nombre: "codDiagnosticoPrincipal", etiqueta: "Diagnóstico CIE-10", tipo: "cie10", requerido: true, placeholder: "Ej. Z391" }
            ]
        },
        {
            titulo: "Datos Personales y Motivo",
            campos: [
                { nombre: "moduloLactancia.ocupacion", etiqueta: "Ocupación", tipo: "text" },
                { nombre: "moduloLactancia.nivelEducativo", etiqueta: "Nivel Educativo", tipo: "text" },
                { nombre: "moduloLactancia.medicoTratante", etiqueta: "Médico Tratante", tipo: "text" },
                { nombre: "moduloLactancia.acompanante.nombre", etiqueta: "Acompañante", tipo: "text" },
                { nombre: "moduloLactancia.acompanante.telefono", etiqueta: "Teléfono Acompañante", tipo: "text" },
                { nombre: "motivoConsulta", etiqueta: "Motivo de Consulta (¿En qué te puedo ayudar?)", tipo: "textarea", requerido: true }
            ]
        },
        {
            titulo: "Antecedentes Generales",
            campos: [
                { nombre: "moduloLactancia.antecedentes.hospitalarios", etiqueta: "Hospitalarios", tipo: "text" },
                { nombre: "moduloLactancia.antecedentes.patologicos", etiqueta: "Patológicos", tipo: "text" },
                { nombre: "moduloLactancia.antecedentes.familiares", etiqueta: "Familiares", tipo: "text" },
                { nombre: "moduloLactancia.antecedentes.traumaticos", etiqueta: "Traumáticos", tipo: "text" },
                { nombre: "moduloLactancia.antecedentes.farmacologicos", etiqueta: "Farmacológicos", tipo: "text" },
                { nombre: "moduloLactancia.antecedentes.quirurgicos", etiqueta: "Quirúrgicos", tipo: "text" },
                { nombre: "moduloLactancia.antecedentes.toxicosAlergicos", etiqueta: "Tóxicos / Alérgicos", tipo: "text" }
            ]
        },
        {
            titulo: "Antecedentes Obstétricos y Ginecológicos",
            campos: [
                { nombre: "moduloLactancia.obstetricos.numEmbarazos", etiqueta: "No. Embarazos", tipo: "number" },
                { nombre: "moduloLactancia.obstetricos.numAbortos", etiqueta: "No. Abortos", tipo: "number" },
                { nombre: "moduloLactancia.obstetricos.numPartosVaginales", etiqueta: "No. Partos Vaginales", tipo: "number" },
                { nombre: "moduloLactancia.obstetricos.instrumentado", etiqueta: "¿Instrumentado?", tipo: "text" },
                { nombre: "moduloLactancia.obstetricos.numCesareas", etiqueta: "No. de Cesáreas", tipo: "number" },
                { nombre: "moduloLactancia.obstetricos.ultimoParto.fecha", etiqueta: "Fecha Último Parto", tipo: "date" },
                { nombre: "moduloLactancia.obstetricos.ultimoParto.peso", etiqueta: "Peso", tipo: "text" },
                { nombre: "moduloLactancia.obstetricos.ultimoParto.talla", etiqueta: "Talla", tipo: "text" },
                { nombre: "moduloLactancia.obstetricos.ultimoParto.episiotomia", etiqueta: "Episiotomía", tipo: "text" },
                { nombre: "moduloLactancia.obstetricos.ultimoParto.desgarro", etiqueta: "Desgarro", tipo: "text" },
                { nombre: "moduloLactancia.obstetricos.espacioIntergenesico", etiqueta: "Espacio entre embarazos", tipo: "text" },
                { nombre: "moduloLactancia.obstetricos.actividadFisicaGesta", etiqueta: "Actividad física: antes/durante/después", tipo: "text" },
                { nombre: "moduloLactancia.obstetricos.complicaciones", etiqueta: "Complicaciones", tipo: "textarea" },
                { nombre: "moduloLactancia.ginecologicos.cirugiasPrevias", etiqueta: "Cirugías previas", tipo: "text" },
                { nombre: "moduloLactancia.ginecologicos.prolapsos", etiqueta: "Prolapsos", tipo: "text" },
                { nombre: "moduloLactancia.ginecologicos.hormonales", etiqueta: "Hormonales", tipo: "text" },
                { nombre: "moduloLactancia.ginecologicos.anticonceptivos", etiqueta: "Anticonceptivos", tipo: "text" }
            ]
        },
        {
            titulo: "Historia de Lactancia y Expectativas",
            campos: [
                {
                    nombre: "moduloLactancia.experienciaPrevia",
                    etiqueta: "¿Tiene experiencia previa con lactancia?",
                    tipo: "select",
                    opciones: ["Sí", "No"]
                },
                { nombre: "moduloLactancia.comoFueExperiencia", etiqueta: "¿Cómo fue la experiencia?", tipo: "textarea" },
                { nombre: "moduloLactancia.dificultadesPresentadas", etiqueta: "¿Qué dificultades presentó (si hubo)?", tipo: "textarea" },
                {
                    nombre: "moduloLactancia.conocimientoExpectativa.deseaAmamantar",
                    etiqueta: "¿Deseas amamantar?",
                    tipo: "select",
                    opciones: ["Sí", "No", "No estoy segura"]
                },
                { nombre: "moduloLactancia.conocimientoExpectativa.queEsperasAsesoria", etiqueta: "¿Qué esperas de esta asesoría?", tipo: "textarea" },
                { nombre: "moduloLactancia.conocimientoExpectativa.queSabesLactancia", etiqueta: "¿Qué sabes sobre lactancia materna?", tipo: "textarea" }
            ]
        },
        {
            titulo: "Aspectos Físicos y Factores Influyentes",
            campos: [
                {
                    nombre: "moduloLactancia.aspectosFisicos.pechos",
                    etiqueta: "Pechos",
                    tipo: "checkbox_group",
                    opciones: [
                        { valor: "normales", etiqueta: "Normales" },
                        { valor: "dolorosos", etiqueta: "Dolorosos" },
                        { valor: "secrecion", etiqueta: "Secreción" },
                        { valor: "cirugias", etiqueta: "Cirugías previas" }
                    ]
                },
                {
                    nombre: "moduloLactancia.aspectosFisicos.formaPezon",
                    etiqueta: "Forma del pezón",
                    tipo: "select",
                    opciones: ["Normal", "Plano", "Invertido", "Otro"]
                },
                { nombre: "moduloLactancia.aspectosFisicos.observacionesFisicas", etiqueta: "Observaciones físicas", tipo: "textarea" },
                { nombre: "moduloLactancia.antecedentes.farmacologicosActuales", etiqueta: "Medicamentos actuales", tipo: "text" },
                { nombre: "moduloLactancia.antecedentes.afeccionesMedicas", etiqueta: "Afecciones médicas", tipo: "text" },
                {
                    nombre: "moduloLactancia.apoyoFamiliarLactancia",
                    etiqueta: "Apoyo familiar para la lactancia",
                    tipo: "select",
                    opciones: ["Sí", "No", "Parcial"]
                }
            ]
        },
        {
            titulo: "Plan e Intervención",
            campos: [
                { nombre: "moduloLactancia.planIntervencion", etiqueta: "PLAN DE INTERVENCION", tipo: "textarea", requerido: true },
                { nombre: "moduloLactancia.visitaCierre", etiqueta: "VISITA DE CIERRE", tipo: "textarea" },
                { nombre: "diagnosticoFisioterapeutico", etiqueta: "Diagnóstico Fisioterapéutico", tipo: "textarea", requerido: true },
                { nombre: "planTratamiento", etiqueta: "Plan de Tratamiento / Recomendaciones", tipo: "textarea", requerido: true }
            ]
        },
    ]
};
