export const ESQUEMA_VALORACION_PEDIATRIA = {
    titulo: "Historia Clínica Fisioterapia Pediátrica",
    endpoint: "/valoraciones",
    redireccion: "/valoraciones",
    secciones: [
        {
            titulo: "Información de Consulta e Ingreso",
            campos: [
                {
                    nombre: "codConsulta", etiqueta: "Código Consulta (CUPS)", tipo: "select", opciones: [
                        { valor: "890201", etiqueta: "890201 - Consulta de primera vez (Medicina General)" },
                        { valor: "890204", etiqueta: "890204 - Consulta Fisioterapia Pediátrica" },
                    ], requerido: true
                },
                { nombre: "fechaInicioAtencion", etiqueta: "Fecha y Hora Atención", tipo: "datetime-local", requerido: true },
                {
                    nombre: "finalidadTecnologiaSalud", etiqueta: "Finalidad", tipo: "select", opciones: [
                        { valor: "44", etiqueta: "Rehabilitación" },
                        { valor: "10", etiqueta: "Promoción de la Salud" }
                    ], requerido: true
                },
                {
                    nombre: "causaMotivoAtencion", etiqueta: "Causa Externa", tipo: "select", opciones: [
                        { valor: "21", etiqueta: "Enfermedad general" },
                        { valor: "04", etiqueta: "Accidente de trabajo" }
                    ], requerido: true
                },
                { nombre: "codDiagnosticoPrincipal", etiqueta: "Código Diagnóstico (CIE-10)", tipo: "text", requerido: true, placeholder: "Ej. M545" }
            ]
        },
        {
            titulo: "Anamnesis",
            campos: [
                { nombre: "motivoConsulta", etiqueta: "Motivo de Consulta (Textual del paciente)", tipo: "textarea", requerido: true },
                { nombre: "enfermedadActual", etiqueta: "Enfermedad Actual / Evolución", tipo: "textarea", requerido: true },
            ]
        },
        {
            titulo: "Signos Vitales y Antropometría",
            campos: [
                { nombre: "signosVitales.fc", etiqueta: "Frecuencia Cardíaca (lpm)", tipo: "text" },
                { nombre: "signosVitales.fr", etiqueta: "Frecuencia Respiratoria (rpm)", tipo: "text" },
                { nombre: "signosVitales.ta", etiqueta: "Tensión Arterial (mmHg)", tipo: "text" },
                { nombre: "signosVitales.temperatura", etiqueta: "Temperatura (°C)", tipo: "text" },
                { nombre: "signosVitales.pesoActual", etiqueta: "Peso (kg)", tipo: "text" },
                { nombre: "signosVitales.talla", etiqueta: "Talla (cm)", tipo: "text" },
            ]
        },
        {
            titulo: "Hitos del Desarrollo Pediátrico",
            campos: [
                { nombre: "moduloPediatria.desarrolloMotor.sostieneCabeza", etiqueta: "¿Sostiene la cabeza?", tipo: "select", opciones: ["Sí", "No", "En proceso"] },
                { nombre: "moduloPediatria.desarrolloMotor.seSientaSinApoyo", etiqueta: "¿Se sienta sin apoyo?", tipo: "select", opciones: ["Sí", "No", "En proceso"] },
                { nombre: "moduloPediatria.desarrolloMotor.gateo", etiqueta: "¿Gatea?", tipo: "select", opciones: ["Sí", "No", "En proceso"] },
                { nombre: "moduloPediatria.desarrolloMotor.marcha", etiqueta: "¿Camina solo?", tipo: "select", opciones: ["Sí", "No", "En proceso"] },

                { nombre: "moduloPediatria.lenguaje.balbucea", etiqueta: "Balbucea/Vocaliza", tipo: "select", opciones: ["Sí", "No", "En proceso"] },
                { nombre: "moduloPediatria.lenguaje.diceMamaPapa", etiqueta: "Dice Mamá/Papá", tipo: "select", opciones: ["Sí", "No", "En proceso"] },

                { nombre: "moduloPediatria.conclusion.actividadesSugeridasCasa", etiqueta: "Sugerencias de actividades en casa", tipo: "textarea" },
            ]
        },
        {
            titulo: "Diagnóstico y Plan de Tratamiento",
            campos: [
                { nombre: "examenFisico.postura", etiqueta: "Postura", tipo: "textarea", requerido: true },
                { nombre: "examenFisico.tonoMuscular", etiqueta: "Tono Muscular", tipo: "textarea", requerido: true },
                { nombre: "diagnosticoFisioterapeutico", etiqueta: "Diagnóstico Fisioterapéutico", tipo: "textarea", requerido: true },
                { nombre: "planTratamiento", etiqueta: "Plan de Manejo / Tratamiento", tipo: "textarea", requerido: true },
            ]
        },
        {
            titulo: "Firmas Legales y Cierre (Ley 527 de 1999)",
            campos: [
                { nombre: "firmas.pacienteOAcudiente.nombre", etiqueta: "Nombre del Acudiente", tipo: "text", requerido: true },
                { nombre: "firmas.pacienteOAcudiente.cedula", etiqueta: "Documento del Acudiente", tipo: "text", requerido: true },
                { nombre: "firmas.pacienteOAcudiente.firmaUrl", etiqueta: "Firma del Acudiente", tipo: "firma", requerido: true },

                { nombre: "firmas.profesional.nombre", etiqueta: "Nombre del Fisioterapeuta", tipo: "text", requerido: true, valorPorDefecto: "Ft. Dayan Ivonne Villegas Gamboa" },
                { nombre: "firmas.profesional.registroMedico", etiqueta: "Registro Profesional", tipo: "text", requerido: true, valorPorDefecto: "52862625 - Reg. Salud Departamental" },
                { nombre: "firmas.profesional.firmaUrl", etiqueta: "Firma del Profesional", tipo: "firma", requerido: true },
            ]
        }
    ]
};
