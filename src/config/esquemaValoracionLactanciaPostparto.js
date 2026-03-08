export const ESQUEMA_VALORACION_LACTANCIA_POSTPARTO = {
    titulo: "Historia Clínica - Valoración Programa Lactancia POSTPARTO",
    endpoint: "/valoraciones",
    redireccion: "/valoraciones",
    secciones: [
        {
            titulo: "Información de Consulta e Ingreso",
            siempreVisible: true,
            campos: [
                { nombre: "moduloLactancia.tipoLactancia", tipo: "hidden", valorPorDefecto: "postparto" },
                {
                    nombre: "codConsulta", etiqueta: "Código Consulta (CUPS)", tipo: "select", opciones: [
                        { valor: "890203", etiqueta: "890203 - Control Fisioterapia General" }
                    ], requerido: true, valorPorDefecto: "890203"
                },
                { nombre: "fechaInicioAtencion", etiqueta: "Fecha y Hora Atención", tipo: "datetime-local", requerido: true, autoNow: true },
                {
                    nombre: "finalidadTecnologiaSalud", etiqueta: "Finalidad", tipo: "select", opciones: [
                        { valor: "44", etiqueta: "44 - Rehabilitación funcional" }
                    ], requerido: true, valorPorDefecto: "44"
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
            titulo: "Datos Iniciales",
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
            titulo: "Datos Generales del Bebé",
            campos: [
                { nombre: "moduloLactancia.bebe.nombre", etiqueta: "Nombre del Bebé", tipo: "text", requerido: true },
                { nombre: "moduloLactancia.bebe.fechaNac", etiqueta: "Fecha de Nacimiento", tipo: "date", requerido: true },
                { nombre: "moduloLactancia.bebe.edadActual", etiqueta: "Edad Actual", tipo: "text" },
                {
                    nombre: "moduloLactancia.bebe.tipoParto",
                    etiqueta: "Tipo de Parto",
                    tipo: "select",
                    opciones: ["Vaginal", "Cesárea"]
                },
                { nombre: "moduloLactancia.bebe.pesoNacer", etiqueta: "Peso al nacer (g)", tipo: "text" },
                { nombre: "moduloLactancia.bebe.pesoActual", etiqueta: "Peso actual (g)", tipo: "text" },
                {
                    nombre: "moduloLactancia.bebe.controladoPediatria",
                    etiqueta: "¿Está siendo controlado por pediatría?",
                    tipo: "select",
                    opciones: ["Sí", "No"]
                },
                { nombre: "moduloLactancia.bebe.condicionesMedicas", etiqueta: "¿Condiciones médicas del bebé?", tipo: "text" },
                {
                    nombre: "moduloLactancia.bebe.requiereFormula",
                    etiqueta: "¿Requiere fórmula o suplemento?",
                    tipo: "select",
                    opciones: ["Sí", "No"]
                },
                {
                    nombre: "moduloLactancia.bebe.tipoAlimentacion",
                    etiqueta: "Tipo de alimentación actual",
                    tipo: "select",
                    opciones: ["Lactancia exclusiva", "Mixta", "Fórmula"]
                },
                { nombre: "moduloLactancia.bebe.institucionNacimiento", etiqueta: "Institución", tipo: "text" },
                { nombre: "moduloLactancia.bebe.medicoBebre", etiqueta: "Médico Tratante", tipo: "text" },
                { nombre: "moduloLactancia.infoEmbarazo", etiqueta: "Detalles Embarazo", tipo: "textarea" },
                { nombre: "moduloLactancia.infoParto", etiqueta: "Detalles Parto", tipo: "textarea" }
            ]
        },
        {
            titulo: "Historia de la Lactancia Actual",
            campos: [
                {
                    nombre: "moduloLactancia.lactanciaActual.inicioPrimeraHora",
                    etiqueta: "¿Se inició la lactancia en la primera hora de vida?",
                    tipo: "select",
                    opciones: ["Sí", "No"]
                },
                {
                    nombre: "moduloLactancia.lactanciaActual.pielAPiel",
                    etiqueta: "¿Tuvo contacto piel a piel al nacer?",
                    tipo: "select",
                    opciones: ["Sí", "No"]
                },
                {
                    nombre: "moduloLactancia.lactanciaActual.dolorosa",
                    etiqueta: "¿La lactancia ha sido dolorosa?",
                    tipo: "select",
                    opciones: ["Sí", "No"]
                },
                { nombre: "moduloLactancia.lactanciaActual.localizacionDolor", etiqueta: "Si es sí, ¿dónde se localiza el dolor?", tipo: "text" },
                {
                    nombre: "moduloLactancia.lactanciaActual.grietasHeridas",
                    etiqueta: "¿Presenta grietas o heridas en los pezones?",
                    tipo: "select",
                    opciones: ["Sí", "No"]
                },
                {
                    nombre: "moduloLactancia.lactanciaActual.sienteAgarreCorrecto",
                    etiqueta: "¿Siente que el agarre del bebé es correcto?",
                    tipo: "select",
                    opciones: ["Sí", "No"]
                },
                { nombre: "moduloLactancia.lactanciaActual.frecuenciaAlimentacion", etiqueta: "¿Con qué frecuencia se alimenta el bebé?", tipo: "text" },
                { nombre: "moduloLactancia.lactanciaActual.duracionToma", etiqueta: "¿Cuánto dura cada toma?", tipo: "text" },
                {
                    nombre: "moduloLactancia.lactanciaActual.usoBiberonesChupos",
                    etiqueta: "¿Ha usado biberones o chupos?",
                    tipo: "select",
                    opciones: ["Sí", "No"]
                },
                {
                    nombre: "moduloLactancia.lactanciaActual.orientacionPrevia",
                    etiqueta: "¿Ha recibido orientación previa sobre lactancia?",
                    tipo: "select",
                    opciones: ["Sí", "No"]
                }
            ]
        },
        {
            titulo: "Aspectos Físicos y Técnicos Observados",
            campos: [
                {
                    nombre: "moduloLactancia.observacionToma.seleccion",
                    etiqueta: "Observación de la toma",
                    tipo: "checkbox_group",
                    opciones: [
                        { valor: "buen_agarre", etiqueta: "Buen agarre" },
                        { valor: "posicion_adecuada", etiqueta: "Posición Adecuada" },
                        { valor: "dificultad_succion", etiqueta: "Dificultad en la succión" },
                        { valor: "irritacion_dolor", etiqueta: "Irritación o dolor durante la toma" },
                        { valor: "produccion_adecuada", etiqueta: "Producción de leche adecuada" },
                        { valor: "reflejo_eyeccion", etiqueta: "Reflejo de eyección presente" },
                        { valor: "senales_saciedad", etiqueta: "Señales de saciedad del bebé" },
                        { valor: "madre_relajada", etiqueta: "Madre relajada y comoda" },
                        { valor: "sostiene_segura", etiqueta: "Lo sostiene segura y adecuadamente" },
                        { valor: "bebe_busca", etiqueta: "Bebé busca el pecho" },
                        { valor: "bebe_tranquilo", etiqueta: "Bebé tranquilo y alerta" },
                        { valor: "pezon_redondeado", etiqueta: "Pezón redondeado despues de la toma" },
                        { valor: "piel_sana", etiqueta: "Piel de apariencia sana" }
                    ]
                },
                { nombre: "moduloLactancia.observacionToma.comentarios", etiqueta: "Otros comentarios de la observación", tipo: "textarea" }
            ]
        },
        {
            titulo: "Evaluación Emocional y Apoyo",
            campos: [
                { nombre: "moduloLactancia.evaluacionEmocional.comoSeSiente", etiqueta: "¿Cómo se siente emocionalmente con respecto a la lactancia?", tipo: "textarea" },
                {
                    nombre: "moduloLactancia.evaluacionEmocional.estadoAnimo",
                    etiqueta: "Estado de ánimo predominante",
                    tipo: "checkbox_group",
                    opciones: [
                        { valor: "tranquila", etiqueta: "Tranquila" },
                        { valor: "frustrada", etiqueta: "Frustrada" },
                        { valor: "ansiosa", etiqueta: "Ansiosa" },
                        { valor: "segura", etiqueta: "Segura" }
                    ]
                },
                {
                    nombre: "moduloLactancia.evaluacionEmocional.apoyoEnCasa.tiene",
                    etiqueta: "¿Cuenta con apoyo en casa para el proceso de lactancia?",
                    tipo: "select",
                    opciones: ["Sí", "No"]
                },
                { nombre: "moduloLactancia.evaluacionEmocional.apoyoEnCasa.quien", etiqueta: "Si es sí, ¿Quién?", tipo: "text" },
                {
                    nombre: "moduloLactancia.evaluacionEmocional.necesitaApoyoAdicional",
                    etiqueta: "¿Considera que necesita apoyo emocional adicional?",
                    tipo: "select",
                    opciones: ["Sí", "No"]
                }
            ]
        },
        {
            titulo: "Diagnóstico y Plan de Acción",
            campos: [
                { nombre: "moduloLactancia.planIntervencion", etiqueta: "RECOMENDACIONES Y PLAN DE ACCIÓN", tipo: "textarea", requerido: true },
                { nombre: "diagnosticoFisioterapeutico", etiqueta: "Diagnóstico / Impresión Clínica", tipo: "textarea", requerido: true },
                { nombre: "planTratamiento", etiqueta: "Plan sugerido / Próxima sesión", tipo: "textarea", requerido: true }
            ]
        },
        {
            titulo: "Firmas Legales",
            campos: [
                { nombre: "firmas.pacienteOAcudiente.nombre", etiqueta: "Nombre de la Madre", tipo: "text", requerido: true },
                { nombre: "firmas.pacienteOAcudiente.cedula", etiqueta: "Documento de la Madre", tipo: "text", requerido: true },
                { nombre: "firmas.pacienteOAcudiente.firmaUrl", etiqueta: "Firma de la Madre", tipo: "firma", requerido: true },
                { nombre: "firmas.profesional.nombre", etiqueta: "Nombre del Profesional", tipo: "text", valorPorDefecto: "Ft. Dayan Ivonne Villegas Gamboa", lecsolo: true },
                { nombre: "firmas.profesional.registroMedico", etiqueta: "Registro Profesional", tipo: "text", valorPorDefecto: "52862625 - Reg. Salud Departamental", lecsolo: true },
                { nombre: "firmas.profesional.firmaUrl", etiqueta: "Firma del Profesional", tipo: "firma", requerido: true }
            ]
        }
    ]
};
