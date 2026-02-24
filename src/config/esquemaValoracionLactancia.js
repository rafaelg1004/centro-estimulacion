export const ESQUEMA_VALORACION_LACTANCIA = {
    titulo: "Valoración de Lactancia Materna",
    endpoint: "/valoracion-ingreso-adultos-lactancia", // Ruta proxy para retrocompatibilidad
    redireccion: "/valoraciones-adultos-lactancia",
    secciones: [
        {
            titulo: "Información de Consulta e Ingreso",
            campos: [
                {
                    nombre: "codConsulta", etiqueta: "Código Consulta (CUPS)", tipo: "select", opciones: [
                        { valor: "890201", etiqueta: "890201 - Consulta de primera vez" },
                        { valor: "890204", etiqueta: "890204 - Asesoría en lactancia materna" },
                    ], requerido: true
                },
                { nombre: "fechaInicioAtencion", etiqueta: "Fecha y Hora Atención", tipo: "datetime-local", requerido: true },
                {
                    nombre: "finalidadTecnologiaSalud", etiqueta: "Finalidad", tipo: "select", opciones: [
                        { valor: "10", etiqueta: "Promoción de la Salud" },
                        { valor: "44", etiqueta: "Rehabilitación" }
                    ], requerido: true
                },
                {
                    nombre: "causaMotivoAtencion", etiqueta: "Causa Externa", tipo: "select", opciones: [
                        { valor: "21", etiqueta: "Enfermedad general" },
                        { valor: "22", etiqueta: "Complicaciones del embarazo, parto o puerperio" }
                    ], requerido: true
                },
                { nombre: "codDiagnosticoPrincipal", etiqueta: "Código Diagnóstico (CIE-10)", tipo: "text", requerido: true, placeholder: "Ej. O927 - Otros trastornos de la lactancia" }
            ]
        },
        {
            titulo: "Anamnesis y Antecedentes",
            campos: [
                { nombre: "motivoConsulta", etiqueta: "Motivo de Consulta", tipo: "textarea", requerido: true },
                { nombre: "enfermedadActual", etiqueta: "Enfermedad Actual / Evolución", tipo: "textarea", requerido: true },
                { nombre: "antecedentes.ginecoObstetricos.semanasGestacion", etiqueta: "Semanas de Gestación al Nacer", tipo: "text" },
                { nombre: "antecedentes.ginecoObstetricos.tipoParto", etiqueta: "Tipo de Parto", tipo: "select", opciones: ["Vaginal", "Cesárea", "Instrumentado"] },
            ]
        },
        {
            titulo: "Signos Vitales y Antropometría Materna",
            campos: [
                { nombre: "signosVitales.fc", etiqueta: "Frecuencia Cardíaca (lpm)", tipo: "text" },
                { nombre: "signosVitales.fr", etiqueta: "Frecuencia Respiratoria (rpm)", tipo: "text" },
                { nombre: "signosVitales.ta", etiqueta: "Tensión Arterial (mmHg)", tipo: "text" },
                { nombre: "signosVitales.pesoActual", etiqueta: "Peso Madre (kg)", tipo: "text" },
            ]
        },
        {
            titulo: "Evaluación de Lactancia Materna",
            campos: [
                { nombre: "moduloLactancia.experienciaLactancia", etiqueta: "Experiencias previas de lactancia", tipo: "textarea" },
                { nombre: "moduloLactancia.deseaAmamantar", etiqueta: "¿Desea amamantar?", tipo: "select", opciones: ["Sí", "No", "Indecisa"] },
                { nombre: "moduloLactancia.formaPezon", etiqueta: "Forma y estado del Pezón (Izq/Der)", tipo: "text", placeholder: "Ej. Protruido der, Plano izq" },
                { nombre: "moduloLactancia.pechosNormales", etiqueta: "Pechos de aspecto normal", tipo: "checkbox" },
                { nombre: "moduloLactancia.pechosDolorosos", etiqueta: "Presencia de dolor al amamantar", tipo: "checkbox" },
                { nombre: "moduloLactancia.pechosSecrecion", etiqueta: "Tiene secreción/calostro", tipo: "checkbox" },
                { nombre: "moduloLactancia.dificultadesLactancia", etiqueta: "Dificultades actuales (Agarre, grietas, mastitis...)", tipo: "textarea" },
            ]
        },
        {
            titulo: "Diagnóstico y Plan de Tratamiento",
            campos: [
                { nombre: "examenFisico.postura", etiqueta: "Postura", tipo: "textarea", requerido: true },
                { nombre: "diagnosticoFisioterapeutico", etiqueta: "Diagnóstico / Conclusión", tipo: "textarea", requerido: true },
                { nombre: "planTratamiento", etiqueta: "Plan de Manejo / Recomendaciones", tipo: "textarea", requerido: true },
            ]
        },
        {
            titulo: "Firmas Legales y Cierre (Ley 527 de 1999)",
            campos: [
                { nombre: "firmas.pacienteOAcudiente.nombre", etiqueta: "Nombre de la Madre", tipo: "text", requerido: true },
                { nombre: "firmas.pacienteOAcudiente.cedula", etiqueta: "Documento de la Madre", tipo: "text", requerido: true },
                { nombre: "firmas.pacienteOAcudiente.firmaUrl", etiqueta: "Firma de la Paciente", tipo: "firma", requerido: true },

                { nombre: "firmas.profesional.nombre", etiqueta: "Nombre del Profesional Asesor", tipo: "text", requerido: true, valorPorDefecto: "Ft. Dayan Ivonne Villegas Gamboa" },
                { nombre: "firmas.profesional.registroMedico", etiqueta: "Registro Profesional", tipo: "text", requerido: true, valorPorDefecto: "52862625 - Reg. Salud Departamental" },
                { nombre: "firmas.profesional.firmaUrl", etiqueta: "Firma del Profesional", tipo: "firma", requerido: true },
            ]
        }
    ]
};
