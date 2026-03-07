export const ESQUEMA_VALORACION_PISO_PELVICO = {
    titulo: "Historia Clínica - Fisioterapia de Piso Pélvico",
    endpoint: "/valoraciones",
    redireccion: "/valoraciones",
    secciones: [
        {
            titulo: "Información General",
            campos: [
                {
                    nombre: "codConsulta", etiqueta: "Código Consulta (CUPS)", tipo: "select", opciones: [
                        { valor: "890202", etiqueta: "890202 - Consulta Fisioterapia Piso Pélvico" },
                    ], requerido: true, valorPorDefecto: "890202"
                },
                { nombre: "fechaInicioAtencion", etiqueta: "Fecha de Consulta", tipo: "datetime-local", requerido: true },
                { nombre: "codDiagnosticoPrincipal", etiqueta: "Diagnóstico CIE-10", tipo: "text", requerido: true, placeholder: "Ej. N393" }
            ]
        },
        {
            titulo: "Signos Vitales",
            campos: [
                { nombre: "signosVitales.ta", etiqueta: "Tensión Arterial (mmHg)", tipo: "text" },
                { nombre: "signosVitales.fr", etiqueta: "Frecuencia Respiratoria", tipo: "text" },
                { nombre: "signosVitales.fc", etiqueta: "Frecuencia Cardíaca", tipo: "text" },
                { nombre: "signosVitales.temperatura", etiqueta: "Temperatura (°C)", tipo: "text" },
                { nombre: "signosVitales.pesoPrevio", etiqueta: "Peso Previo (kg)", tipo: "text" },
                { nombre: "signosVitales.pesoActual", etiqueta: "Peso Actual (kg)", tipo: "text" },
                { nombre: "signosVitales.talla", etiqueta: "Talla (cm)", tipo: "text" },
                { nombre: "signosVitales.imc", etiqueta: "IMC", tipo: "text" },
            ]
        },
        {
            titulo: "Anamnesis y Síntomas",
            campos: [
                { nombre: "motivoConsulta", etiqueta: "Motivo de Consulta", tipo: "textarea", requerido: true },
                { nombre: "enfermedadActual", etiqueta: "Enfermedad Actual", tipo: "textarea" },
            ]
        },
        {
            titulo: "Antecedentes",
            campos: [
                { nombre: "antecedentes.quirurgicos", etiqueta: "Quirúrgicos", tipo: "textarea" },
                { nombre: "antecedentes.farmacologicos", etiqueta: "Farmacológicos", tipo: "textarea" },
                { nombre: "antecedentes.alergias", etiqueta: "Alergias", tipo: "textarea" },
                { nombre: "antecedentes.traumaticos", etiqueta: "Traumáticos", tipo: "textarea" },
                { nombre: "antecedentes.familiares", etiqueta: "Familiares", tipo: "textarea" },
            ]
        },
        {
            titulo: "Cuestionario ICIQ (Incontinencia)",
            campos: [
                { nombre: "moduloPisoPelvico.icicq_frecuencia", etiqueta: "¿Con qué frecuencia pierde orina? (0-5)", tipo: "text" },
                { nombre: "moduloPisoPelvico.icicq_cantidad", etiqueta: "¿Qué cantidad de orina pierde? (0-6)", tipo: "text" },
                { nombre: "moduloPisoPelvico.icicq_impacto", etiqueta: "¿Cuánto afecta a su vida? (0-10)", tipo: "text" },
            ]
        },
        {
            titulo: "Hábitos",
            campos: [
                { nombre: "moduloPisoPelvico.habitos.tipoDieta", etiqueta: "Tipo de Dieta", tipo: "text" },
                { nombre: "moduloPisoPelvico.habitos.ingestaLiquida", etiqueta: "Ingesta de líquidos diaria", tipo: "text" },
                { nombre: "moduloPisoPelvico.habitos.horarioSueno", etiqueta: "Horario de Sueño", tipo: "text" },
            ]
        },
        {
            titulo: "Evaluación Física del Piso Pélvico",
            campos: [
                { nombre: "moduloPisoPelvico.evaluacionFisica.dolorPerineal", etiqueta: "Dolor Perineal", tipo: "text" },
                { nombre: "moduloPisoPelvico.evaluacionFisica.diafragmaToracico", etiqueta: "Diafragma Torácico", tipo: "text" },
                { nombre: "moduloPisoPelvico.evaluacionFisica.cupulaDerecha", etiqueta: "Cúpula Derecha", tipo: "checkbox" },
                { nombre: "moduloPisoPelvico.evaluacionFisica.cupulaIzquierda", etiqueta: "Cúpula Izquierda", tipo: "checkbox" },
                { nombre: "moduloPisoPelvico.evaluacionFisica.oxfordGlobal", etiqueta: "Escala de Oxford (Fuerza 0-5)", tipo: "select", opciones: ["0", "1", "2", "3", "4", "5"] },
                { nombre: "moduloPisoPelvico.evaluacionFisica.perfectPower", etiqueta: "PERFECT Power", tipo: "text" },
            ]
        },
        {
            titulo: "Evaluación Muscular",
            campos: [
                { nombre: "moduloPisoPelvico.evaluacionMuscular.prolapso_grado", etiqueta: "Grado de Prolapso", tipo: "text" },
                { nombre: "moduloPisoPelvico.evaluacionMuscular.endo_presente", etiqueta: "Endometriosis Presente", tipo: "checkbox" },
            ]
        },
        {
            titulo: "Diagnóstico y Plan",
            campos: [
                { nombre: "diagnosticoFisioterapeutico", etiqueta: "Diagnóstico Fisioterapéutico", tipo: "textarea", requerido: true },
                { nombre: "planTratamiento", etiqueta: "Plan de Manejo", tipo: "textarea", requerido: true },
            ]
        },
        {
            titulo: "Firmas",
            campos: [
                { nombre: "firmas.pacienteOAcudiente.nombre", etiqueta: "Nombre del Paciente", tipo: "text" },
                { nombre: "firmas.pacienteOAcudiente.cedula", etiqueta: "Documento del Paciente", tipo: "text" },
                { nombre: "firmas.pacienteOAcudiente.firmaUrl", etiqueta: "Firma Paciente", tipo: "firma" },
                { nombre: "firmas.profesional.nombre", etiqueta: "Nombre del Profesional", tipo: "text" },
                { nombre: "firmas.profesional.registroMedico", etiqueta: "Registro Profesional", tipo: "text" },
                { nombre: "firmas.profesional.firmaUrl", etiqueta: "Firma Profesional", tipo: "firma" },
            ]
        }
    ]
};
