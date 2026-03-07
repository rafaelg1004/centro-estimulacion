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
                { nombre: "motivoConsulta", etiqueta: "Motivo de Consulta", tipo: "textarea", requerido: true },
                { nombre: "enfermedadActual", etiqueta: "Enfermedad Actual / Evolución", tipo: "textarea" },
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
            titulo: "Antecedentes",
            campos: [
                { nombre: "antecedentes.prenatales", etiqueta: "Antecedentes Prenatales", tipo: "textarea" },
                { nombre: "antecedentes.tipoParto", etiqueta: "Tipo de Parto", tipo: "text" },
                { nombre: "antecedentes.tiempoGestacion", etiqueta: "Tiempo de Gestación", tipo: "text" },
                { nombre: "antecedentes.lactancia", etiqueta: "Lactancia", tipo: "text" },
                { nombre: "antecedentes.patologicos", etiqueta: "Patológicos", tipo: "textarea" },
                { nombre: "antecedentes.quirurgicos", etiqueta: "Quirúrgicos", tipo: "textarea" },
                { nombre: "antecedentes.farmacologicos", etiqueta: "Farmacológicos", tipo: "textarea" },
                { nombre: "antecedentes.traumaticos", etiqueta: "Traumáticos", tipo: "textarea" },
                { nombre: "antecedentes.familiares", etiqueta: "Familiares", tipo: "textarea" },
            ]
        },
        {
            titulo: "Desarrollo Motor",
            campos: [
                { nombre: "moduloPediatria.desarrolloMotor.sostieneCabeza", etiqueta: "Control Cefálico", tipo: "text" },
                { nombre: "moduloPediatria.desarrolloMotor.seVoltea", etiqueta: "Rolados", tipo: "text" },
                { nombre: "moduloPediatria.desarrolloMotor.seSientaSinApoyo", etiqueta: "Sedestación", tipo: "text" },
                { nombre: "moduloPediatria.desarrolloMotor.gateo", etiqueta: "Gateo", tipo: "text" },
                { nombre: "moduloPediatria.desarrolloMotor.sePoneDePie", etiqueta: "Bipedestación", tipo: "text" },
                { nombre: "moduloPediatria.desarrolloMotor.marcha", etiqueta: "Marcha", tipo: "text" },
                { nombre: "moduloPediatria.desarrolloMotor.correSalta", etiqueta: "Corre/Salta", tipo: "text" },
            ]
        },
        {
            titulo: "Examen Físico",
            campos: [
                { nombre: "examenFisico.postura", etiqueta: "Postura", tipo: "textarea" },
                { nombre: "examenFisico.marcha", etiqueta: "Desplazamientos", tipo: "textarea" },
                { nombre: "examenFisico.tonoMuscular", etiqueta: "Tono Muscular", tipo: "textarea" },
                { nombre: "examenFisico.controlMotor", etiqueta: "Control Motor", tipo: "textarea" },
                { nombre: "examenFisico.perfilSensorial", etiqueta: "Perfil Sensorial", tipo: "textarea" },
                { nombre: "examenFisico.tejidoTegumentario", etiqueta: "Tejido Tegumentario", tipo: "textarea" },
                { nombre: "examenFisico.reflejos", etiqueta: "Reflejos", tipo: "textarea" },
            ]
        },
        {
            titulo: "Diagnóstico y Plan de Tratamiento",
            campos: [
                { nombre: "diagnosticoFisioterapeutico", etiqueta: "Diagnóstico Fisioterapéutico", tipo: "textarea", requerido: true },
                { nombre: "planTratamiento", etiqueta: "Plan de Manejo / Tratamiento", tipo: "textarea", requerido: true },
            ]
        },
        {
            titulo: "Firmas Legales",
            campos: [
                { nombre: "firmas.pacienteOAcudiente.nombre", etiqueta: "Nombre del Acudiente", tipo: "text" },
                { nombre: "firmas.pacienteOAcudiente.cedula", etiqueta: "Documento del Acudiente", tipo: "text" },
                { nombre: "firmas.pacienteOAcudiente.firmaUrl", etiqueta: "Firma del Acudiente", tipo: "firma" },
                { nombre: "firmas.profesional.nombre", etiqueta: "Nombre del Fisioterapeuta", tipo: "text" },
                { nombre: "firmas.profesional.registroMedico", etiqueta: "Registro Profesional", tipo: "text" },
                { nombre: "firmas.profesional.firmaUrl", etiqueta: "Firma del Profesional", tipo: "firma" },
            ]
        }
    ]
};
