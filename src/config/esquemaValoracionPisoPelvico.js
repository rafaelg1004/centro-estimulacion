export const ESQUEMA_VALORACION_PISO_PELVICO = {
    titulo: "Valoración de Piso Pélvico",
    endpoint: "/valoracion-piso-pelvico", // Vía proxy
    redireccion: "/valoraciones-piso-pelvico",
    secciones: [
        {
            titulo: "Información de Consulta e Ingreso",
            campos: [
                {
                    nombre: "codConsulta", etiqueta: "Código Consulta (CUPS)", tipo: "select", opciones: [
                        { valor: "890204", etiqueta: "890204 - Valoración Piso Pélvico Integral" },
                    ], requerido: true, valorPorDefecto: "890204"
                },
                { nombre: "fechaInicioAtencion", etiqueta: "Fecha y Hora Atención", tipo: "datetime-local", requerido: true },
                {
                    nombre: "finalidadTecnologiaSalud", etiqueta: "Finalidad", tipo: "select", opciones: [
                        { valor: "44", etiqueta: "Rehabilitación" },
                        { valor: "10", etiqueta: "Promoción de la Salud" }
                    ], requerido: true, valorPorDefecto: "44"
                },
                {
                    nombre: "causaMotivoAtencion", etiqueta: "Causa Externa", tipo: "select", opciones: [
                        { valor: "21", etiqueta: "Enfermedad general" },
                        { valor: "22", etiqueta: "Complicaciones del embarazo, parto o puerperio" }
                    ], requerido: true
                },
                { nombre: "codDiagnosticoPrincipal", etiqueta: "Código Diagnóstico (CIE-10)", tipo: "text", requerido: true, placeholder: "Ej. N81 - Prolapso genital femenino" }
            ]
        },
        {
            titulo: "Anamnesis y Motivo",
            campos: [
                { nombre: "motivoConsulta", etiqueta: "Motivo de Consulta (Textual)", tipo: "textarea", requerido: true },
                { nombre: "enfermedadActual", etiqueta: "Enfermedad Actual / Evolución", tipo: "textarea", requerido: true },
            ]
        },
        {
            titulo: "Índice de Incontinencia Urinaria (ICICQ)",
            campos: [
                { nombre: "moduloPisoPelvico.icicq_frecuencia", etiqueta: "1. ¿Con qué frecuencia pierde orina?", tipo: "select", opciones: ["Nunca", "Casi Nunca", "De vez en cuando", "Siempre"], requerido: true },
                { nombre: "moduloPisoPelvico.icicq_cantidad", etiqueta: "2. ¿Qué cantidad de orina cree que pierde?", tipo: "select", opciones: ["Ninguna", "Poca", "Moderada", "Mucha"], requerido: true },
                { nombre: "moduloPisoPelvico.icicq_impacto", etiqueta: "3. ¿Cuánto interfiere en su vida diaria? (0 a 10)", tipo: "number", min: "0", paso: "1" },
            ]
        },
        {
            titulo: "Hábitos y Evalución Funcional",
            campos: [
                { nombre: "moduloPisoPelvico.habitos.tipoDieta", etiqueta: "Tipo de alimentación", tipo: "text" },
                { nombre: "moduloPisoPelvico.habitos.ingestaLiquida", etiqueta: "Ingesta de líquidos al día", tipo: "text" },

                { nombre: "moduloPisoPelvico.evaluacionFisica.dolorPerineal", etiqueta: "Dolor Perineal / Episiotomía", tipo: "select", opciones: ["Sí", "No", "Leve", "Severo"] },
                { nombre: "moduloPisoPelvico.evaluacionFisica.oxfordGlobal", etiqueta: "Escala Oxford Modificada (0 - 5)", tipo: "select", opciones: ["0", "1", "2", "3", "4", "5"] },
                { nombre: "moduloPisoPelvico.evaluacionMuscular.prolapso_grado", etiqueta: "Grado de Prolapso", tipo: "select", opciones: ["Grado 0", "Grado 1", "Grado 2", "Grado 3", "Grado 4", "No Evaluado"] },
            ]
        },
        {
            titulo: "Diagnóstico y Plan de Tratamiento",
            campos: [
                { nombre: "examenFisico.tonoMuscular", etiqueta: "Tono Muscular", tipo: "textarea", requerido: true },
                { nombre: "diagnosticoFisioterapeutico", etiqueta: "Diagnóstico / Disfunción Fisioterapéutica", tipo: "textarea", requerido: true },
                { nombre: "planTratamiento", etiqueta: "Plan de Tratamiento y Abordaje", tipo: "textarea", requerido: true },
            ]
        },
        {
            titulo: "Consentimientos y Firmas (Ley 527 de 1999)",
            campos: [
                { nombre: "firmas.pacienteOAcudiente.nombre", etiqueta: "Nombre de la Paciente", tipo: "text", requerido: true },
                { nombre: "firmas.pacienteOAcudiente.cedula", etiqueta: "Nro. Documento", tipo: "text", requerido: true },
                { nombre: "firmas.pacienteOAcudiente.firmaUrl", etiqueta: "Firma de Consentimiento", tipo: "firma", requerido: true },

                { nombre: "firmas.profesional.nombre", etiqueta: "Nombre del Especialista", tipo: "text", requerido: true, valorPorDefecto: "Ft. Dayan Ivonne Villegas Gamboa" },
                { nombre: "firmas.profesional.registroMedico", etiqueta: "Registro Profesional", tipo: "text", requerido: true, valorPorDefecto: "52862625 - Reg. Salud Departamental" },
                { nombre: "firmas.profesional.firmaUrl", etiqueta: "Firma del Profesional", tipo: "firma", requerido: true },
            ]
        }
    ]
};
