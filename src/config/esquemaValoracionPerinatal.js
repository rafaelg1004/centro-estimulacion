export const ESQUEMA_VALORACION_PERINATAL = {
    titulo: "Valoración de Ingreso - Programa Perinatal",
    endpoint: "/valoraciones",
    redireccion: "/valoraciones",
    secciones: [
        {
            titulo: "Información de Consulta (RIPS)",
            siempreVisible: true,
            campos: [
                {
                    nombre: "codConsulta", etiqueta: "Código Consulta (CUPS)", tipo: "cups", requerido: true, placeholder: "Buscar procedimiento..."
                },
                { nombre: "fechaInicioAtencion", etiqueta: "Fecha de Consulta", tipo: "datetime-local", requerido: true, autoNow: true },
                {
                    nombre: "finalidadTecnologiaSalud", etiqueta: "Finalidad", tipo: "select", opciones: [
                        { valor: "10", etiqueta: "Promoción de la Salud / Preventivo" },
                        { valor: "44", etiqueta: "Rehabilitación" }
                    ], requerido: true, valorPorDefecto: "10"
                },
                {
                    nombre: "causaMotivoAtencion", etiqueta: "Causa Externa", tipo: "select", opciones: [
                        { valor: "22", etiqueta: "Manejo del embarazo normal" },
                        { valor: "21", etiqueta: "Enfermedad general" }
                    ], requerido: true, valorPorDefecto: "22"
                },
                { nombre: "codDiagnosticoPrincipal", etiqueta: "Diagnóstico CIE-10", tipo: "cie10", requerido: true, placeholder: "Ej. Z349 - Supervisión de embarazo normal" },
            ]
        },
        {
            titulo: "Motivo de Consulta",
            campos: [
                { nombre: "motivoConsulta", etiqueta: "Motivo de Consulta", tipo: "textarea", requerido: true }
            ]
        },
        {
            titulo: "Información de la Gestación y Acompañante",
            campos: [
                { nombre: "moduloPerinatal.nombreBebe", etiqueta: "Nombre del Bebé", tipo: "text" },
                { nombre: "moduloPerinatal.semanasGestacion", etiqueta: "Semanas de Gestación", tipo: "number" },
                { nombre: "moduloPerinatal.fum", etiqueta: "FUM (Fecha Última Menstruación)", tipo: "date" },
                { nombre: "moduloPerinatal.fpp", etiqueta: "Fecha Probable de Parto (FPP)", tipo: "date" },
                { nombre: "moduloPerinatal.acompananteNombre", etiqueta: "Nombre del Acompañante", tipo: "text" },
                { nombre: "moduloPerinatal.acompananteTelefono", etiqueta: "Teléfono Acompañante", tipo: "text" },
            ]
        },
        {
            titulo: "Antecedentes Generales",
            campos: [
                { nombre: "moduloPerinatal.hospitalarios", etiqueta: "Hospitalarios", tipo: "text" },
                { nombre: "moduloPerinatal.patologicos", etiqueta: "Patológicos", tipo: "text" },
                { nombre: "moduloPerinatal.familiares", etiqueta: "Familiares", tipo: "text" },
                { nombre: "moduloPerinatal.traumaticos", etiqueta: "Traumáticos", tipo: "text" },
                { nombre: "moduloPerinatal.farmacologicos", etiqueta: "Farmacológicos", tipo: "text" },
                { nombre: "moduloPerinatal.quirurgicos", etiqueta: "Quirúrgicos", tipo: "text" },
                { nombre: "moduloPerinatal.toxicoAlergicos", etiqueta: "Tóxicos / Alérgicos", tipo: "text" },
            ]
        },
        {
            titulo: "Antecedentes Obstétricos",
            campos: [
                { nombre: "moduloPerinatal.haTenidoEmbarazos", etiqueta: "¿Ha tenido embarazos previos?", tipo: "select", opciones: ["SI", "NO"] },
                { nombre: "moduloPerinatal.numEmbarazos", etiqueta: "Número de Embarazos", tipo: "number", condicion: { campo: "moduloPerinatal.haTenidoEmbarazos", valor: "SI" } },
                { nombre: "moduloPerinatal.numAbortos", etiqueta: "Número de Abortos", tipo: "number", condicion: { campo: "moduloPerinatal.haTenidoEmbarazos", valor: "SI" } },
                { nombre: "moduloPerinatal.numPartosVaginales", etiqueta: "Partos Vaginales", tipo: "number", condicion: { campo: "moduloPerinatal.haTenidoEmbarazos", valor: "SI" } },
                { nombre: "moduloPerinatal.numCesareas", etiqueta: "Cesáreas", tipo: "number", condicion: { campo: "moduloPerinatal.haTenidoEmbarazos", valor: "SI" } },
                { nombre: "moduloPerinatal.instrumentado", etiqueta: "¿Fue instrumentado?", tipo: "text", condicion: { campo: "moduloPerinatal.haTenidoEmbarazos", valor: "SI" } },
                { nombre: "moduloPerinatal.fechaObstetrico", etiqueta: "Fecha del último evento", tipo: "date", condicion: { campo: "moduloPerinatal.haTenidoEmbarazos", valor: "SI" } },
                { nombre: "moduloPerinatal.pesoObstetrico", etiqueta: "Peso del último bebé", tipo: "text", condicion: { campo: "moduloPerinatal.haTenidoEmbarazos", valor: "SI" } },
                { nombre: "moduloPerinatal.tallaObstetrico", etiqueta: "Talla del último bebé", tipo: "text", condicion: { campo: "moduloPerinatal.haTenidoEmbarazos", valor: "SI" } },
                { nombre: "moduloPerinatal.episiotomia", etiqueta: "¿Episiotomía?", tipo: "text", condicion: { campo: "moduloPerinatal.haTenidoEmbarazos", valor: "SI" } },
                { nombre: "moduloPerinatal.desgarro", etiqueta: "¿Desgarro?", tipo: "text", condicion: { campo: "moduloPerinatal.haTenidoEmbarazos", valor: "SI" } },
                { nombre: "moduloPerinatal.espacioEntreEmbarazos", etiqueta: "Espacio entre embarazos", tipo: "text", condicion: { campo: "moduloPerinatal.haTenidoEmbarazos", valor: "SI" } },
                { nombre: "moduloPerinatal.complicacionesPrevias", etiqueta: "Complicaciones en embarazos/partos anteriores", tipo: "textarea", condicion: { campo: "moduloPerinatal.haTenidoEmbarazos", valor: "SI" } }
            ]
        },
        {
            titulo: "Ginecológicos y Estilo de Vida",
            campos: [
                { nombre: "moduloPerinatal.cirugiasPreviasGine", etiqueta: "Cirugías previas ginecológicas", tipo: "text" },
                { nombre: "moduloPerinatal.prolapsos", etiqueta: "Historia de prolapsos", tipo: "text" },
                { nombre: "moduloPerinatal.hormonales", etiqueta: "Antecedentes Hormonales", tipo: "text" },
                { nombre: "moduloPerinatal.anticonceptivos", etiqueta: "Uso de anticonceptivos previos", tipo: "text" },
                { nombre: "moduloPerinatal.actividadFisicaPrevia", etiqueta: "Actividad física (Antes / Durante)", tipo: "text" }
            ]
        },
        {
            titulo: "Estado de Salud Actual (Signos y PARMED-X)",
            campos: [
                { nombre: "signosVitales.ta", etiqueta: "Tensión Arterial (mmHg)", tipo: "text" },
                { nombre: "signosVitales.fc", etiqueta: "Frecuencia Cardíaca", tipo: "text" },
                { nombre: "signosVitales.fr", etiqueta: "Frecuencia Respiratoria", tipo: "text" },
                { nombre: "signosVitales.temperatura", etiqueta: "Temperatura (°C)", tipo: "text" },
                { nombre: "moduloPerinatal.pesoPrevio", etiqueta: "Peso Previo (kg)", tipo: "text" },
                { nombre: "signosVitales.pesoActual", etiqueta: "Peso Actual (kg)", tipo: "text" },
                { nombre: "signosVitales.talla", etiqueta: "Talla (cm)", tipo: "text" },
                { nombre: "signosVitales.imc", etiqueta: "IMC", tipo: "text", lecsolo: true },
                { nombre: "moduloPerinatal.otrasComplicacionesGesta", etiqueta: "¿Complicaciones en la gestación actual?", tipo: "select", opciones: ["si", "no"] },
                { nombre: "moduloPerinatal.explicacionComplicaciones", etiqueta: "Explique complicaciones", tipo: "textarea", condicion: { campo: "moduloPerinatal.otrasComplicacionesGesta", valor: "si" } }
            ]
        },
        {
            titulo: "PARMED-X: Condición de la Gestación Actual",
            campos: [
                { nombre: "moduloPerinatal.condicionActual.fatigaMarcada", etiqueta: "¿Fatiga marcada?", tipo: "select", opciones: ["si", "no"] },
                { nombre: "moduloPerinatal.condicionActual.sangradoVaginal", etiqueta: "¿Sangrado vaginal / manchado?", tipo: "select", opciones: ["si", "no"] },
                { nombre: "moduloPerinatal.condicionActual.debilidadMareo", etiqueta: "¿Debilidad o mareo sin explicación?", tipo: "select", opciones: ["si", "no"] },
                { nombre: "moduloPerinatal.condicionActual.dolorAbdominal", etiqueta: "¿Dolor abdominal sin explicación?", tipo: "select", opciones: ["si", "no"] },
                { nombre: "moduloPerinatal.condicionActual.sudoracionExtremidades", etiqueta: "¿Sudoración espontánea en tobillos, manos o cara?", tipo: "select", opciones: ["si", "no"] },
                { nombre: "moduloPerinatal.condicionActual.doloresCabeza", etiqueta: "¿Dolores de cabeza persistentes?", tipo: "select", opciones: ["si", "no"] },
                { nombre: "moduloPerinatal.condicionActual.dolorPantorrilla", etiqueta: "¿Sudoración, dolor o enrojecimiento en pantorrilla?", tipo: "select", opciones: ["si", "no"] },
                { nombre: "moduloPerinatal.condicionActual.ausenciaMovFetales", etiqueta: "¿Ausencia de movimientos fetales (luego del 6to mes)?", tipo: "select", opciones: ["si", "no"] },
                { nombre: "moduloPerinatal.condicionActual.dejarGarantPeso", etiqueta: "¿Dejar de ganar peso (después del 5to mes)?", tipo: "select", opciones: ["si", "no"] },
                { nombre: "moduloPerinatal.condicionActual.explicacion", etiqueta: "Si respondió SI a alguna, por favor explique:", tipo: "textarea" }
            ]
        },
        {
            titulo: "Actividad Física y Contraindicaciones",
            campos: [
                { nombre: "moduloPerinatal.actividadDiaria.levantarPesos", etiqueta: "¿Levanta objetos pesados?", tipo: "select", opciones: ["si", "no"] },
                { nombre: "moduloPerinatal.actividadDiaria.subirEscaleras", etiqueta: "¿Sube escaleras frecuentemente?", tipo: "select", opciones: ["si", "no"] },
                { nombre: "moduloPerinatal.actividadDiaria.caminarOcasional", etiqueta: "¿Camina ocasionalmente (+1 vez/hora)?", tipo: "select", opciones: ["si", "no"] },
                { nombre: "moduloPerinatal.actividadDiaria.bipedestacion", etiqueta: "¿Bipedestación prolongada?", tipo: "select", opciones: ["si", "no"] },
                { nombre: "moduloPerinatal.actividadDiaria.sentada", etiqueta: "¿Mantiene sentada?", tipo: "select", opciones: ["si", "no"] },
                { nombre: "moduloPerinatal.contraindicacionesRelativas", etiqueta: "Contraindicaciones Relativas (Ej. Preeclampsia, Cérvix incompetente, etc.)", tipo: "textarea" },
                { nombre: "moduloPerinatal.contraindicacionesAbsolutas", etiqueta: "Contraindicaciones Absolutas (Ej. Placenta previa, Ruptura membranas, etc.)", tipo: "textarea" },
                { nombre: "moduloPerinatal.actividadAprobada", etiqueta: "Actividad Física", tipo: "select", opciones: ["Aprobada / Recomendada", "Contraindicada"] }
            ]
        },
        {
            titulo: "Evaluación Fisioterapéutica Física",
            campos: [
                { nombre: "moduloPerinatal.postura", etiqueta: "Postura (Ombligo L3 / Curvaturas)", tipo: "text" },
                { nombre: "moduloPerinatal.abdomen", etiqueta: "Valoración Abdominal (TOS / Diástasis / Tono)", tipo: "text" },
                { nombre: "moduloPerinatal.patronRespiratorio", etiqueta: "Patrón Respiratorio", tipo: "text" },
                { nombre: "moduloPerinatal.diafragma", etiqueta: "Estado del Diafragma (Cúpulas/Traslación)", tipo: "text" },
                { nombre: "moduloPerinatal.piel", etiqueta: "Estado de la Piel", tipo: "text" },
                { nombre: "moduloPerinatal.movilidad", etiqueta: "Movilidad Articular (Pelvis / MMII / Sacroilíaca)", tipo: "text" },
                { nombre: "moduloPerinatal.evaluacionPsoas", etiqueta: "Evaluación Psoas / Aductor / Piramidal", tipo: "text" },
                { nombre: "moduloPerinatal.dolor", etiqueta: "Ubicación del Dolor / Palpación Abdomen Bajo", tipo: "text" }
            ]
        },
        {
            titulo: "Evaluación Piso Pélvico Perinatal",
            campos: [
                { nombre: "moduloPerinatal.observacionPisoPelvico", etiqueta: "Inspección Visual (Cicatrices/Hemorroides)", tipo: "text" },
                { nombre: "moduloPerinatal.sensibilidadPisoPelvico", etiqueta: "Sensibilidad", tipo: "text" },
                { nombre: "moduloPerinatal.reflejosPisoPelvico", etiqueta: "Reflejos (Anal/Tusígeno)", tipo: "text" },
                { nombre: "moduloPerinatal.compartimentoAnterior", etiqueta: "Compartimento Anterior", tipo: "text" },
                { nombre: "moduloPerinatal.compartimentoMedio", etiqueta: "Compartimento Medio", tipo: "text" },
                { nombre: "moduloPerinatal.compartimentoPosterior", etiqueta: "Compartimento Posterior", tipo: "text" },
                { nombre: "moduloPerinatal.dinamicasPisoPelvico", etiqueta: "Dinámicas (Tos/Valsalva)", tipo: "text" },
                { nombre: "moduloPerinatal.fuerzaPisoPelvico", etiqueta: "Fuerza / Tono (Oxford)", tipo: "text" },
            ]
        },
        {
            titulo: "Diagnóstico, Plan y Cierre",
            campos: [
                { nombre: "diagnosticoFisioterapeutico", etiqueta: "Diagnóstico Fisioterapéutico", tipo: "textarea", requerido: true },
                { nombre: "planTratamiento", etiqueta: "Plan de Intervención / Objetivos", tipo: "textarea", requerido: true },
                { nombre: "moduloPerinatal.visitaCierre", etiqueta: "Anotaciones de Visita de Cierre", tipo: "textarea" },
                {
                    nombre: "moduloPerinatal.planElegido",
                    etiqueta: "PROGRAMA A INGRESAR (Plan Elegido)",
                    tipo: "select",
                    opciones: [
                        { valor: "educacion", etiqueta: "📖 Educación para el Nacimiento (10 Sesiones)" },
                        { valor: "fisico", etiqueta: "💪 Acondicionamiento Físico (8 Sesiones)" },
                        { valor: "ambos", etiqueta: "🌟 Educación + Físico (Programa Integral)" },
                        { valor: "intensivo", etiqueta: "⚡ Programa Intensivo (3 Sesiones)" }
                    ],
                    requerido: true
                }
            ]
        },
        {
            titulo: "Firmas y Autorizaciones",
            campos: [
                { nombre: "firmas.pacienteOAcudiente.nombre", etiqueta: "Nombre de la Paciente", tipo: "text", lecsolo: true },
                { nombre: "firmas.pacienteOAcudiente.cedula", etiqueta: "Documento de Identidad", tipo: "text", lecsolo: true },
                { nombre: "firmas.pacienteOAcudiente.firmaUrl", etiqueta: "Firma de la Paciente", tipo: "firma", requerido: true },
                {
                    nombre: "moduloPerinatal.autorizaImagenes",
                    etiqueta: "Autorizo a D'Mamitas & Babies para reproducir fotografías e imágenes de las actividades para redes sociales y web.",
                    tipo: "select",
                    opciones: ["SI", "NO"],
                    requerido: true
                },
                { nombre: "firmas.profesional.nombre", etiqueta: "Fisioterapeuta", tipo: "text", valorPorDefecto: "Ft. Dayan Ivonne Villegas Gamboa", lecsolo: true },
                { nombre: "firmas.profesional.registroMedico", etiqueta: "Registro Profesional", tipo: "text", valorPorDefecto: "52862625", lecsolo: true },
                { nombre: "firmas.profesional.firmaUrl", etiqueta: "Firma del Profesional", tipo: "firma", requerido: true }
            ]
        }
    ]
};
