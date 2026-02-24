export const ESQUEMA_CONSENTIMIENTO_PERINATAL = {
    titulo: "Programa Perinatal Integrado",
    endpoint: "/consentimiento-perinatal", // Vía proxy
    redireccion: "/consentimientos-perinatales",
    secciones: [
        {
            titulo: "Información General e Ingreso",
            campos: [
                {
                    nombre: "codConsulta", etiqueta: "Código Consulta (CUPS)", tipo: "select", opciones: [
                        { valor: "890204", etiqueta: "890204 - Consentimiento y Valoración Perinatal" },
                    ], requerido: true, valorPorDefecto: "890204"
                },
                { nombre: "fechaInicioAtencion", etiqueta: "Fecha de Ingreso al Programa", tipo: "datetime-local", requerido: true },
                {
                    nombre: "finalidadTecnologiaSalud", etiqueta: "Finalidad", tipo: "select", opciones: [
                        { valor: "10", etiqueta: "Promoción de la Salud" }
                    ], requerido: true, valorPorDefecto: "10"
                },
                {
                    nombre: "causaMotivoAtencion", etiqueta: "Causa Externa", tipo: "select", opciones: [
                        { valor: "22", etiqueta: "Manejo del embarazo normal / preventivo" }
                    ], requerido: true, valorPorDefecto: "22"
                },
                { nombre: "codDiagnosticoPrincipal", etiqueta: "Código Diagnóstico (CIE-10)", tipo: "text", requerido: true, placeholder: "Ej. Z349 - Supervisión de embarazo normal" }
            ]
        },
        {
            titulo: "Anamnesis del Programa",
            campos: [
                { nombre: "motivoConsulta", etiqueta: "Motivo de participar en el programa", tipo: "textarea", requerido: true },
                { nombre: "enfermedadActual", etiqueta: "Anotaciones Clínicas de Ingreso", tipo: "textarea", requerido: true },
            ]
        },
        {
            titulo: "Condiciones Obstétricas",
            campos: [
                { nombre: "antecedentes.ginecoObstetricos.embarazoAltoRiesgo", etiqueta: "¿Es un embarazo de alto riesgo?", tipo: "select", opciones: ["Sí", "No"], requerido: true },
                { nombre: "antecedentes.ginecoObstetricos.historiaAborto", etiqueta: "Historia de Abortos prevíos", tipo: "text", placeholder: "Ej. Ninguno, 1" },

                { nombre: "antecedentes.patologicos", etiqueta: "Patologías Base (HTA, Diabetes, etc.)", tipo: "textarea", requerido: true },
                { nombre: "antecedentes.farmacologicos", etiqueta: "Medicamentos Actuales", tipo: "textarea" },
            ]
        },
        {
            titulo: "Planes del Programa Perinatal",
            campos: [
                { nombre: "diagnosticoFisioterapeutico", etiqueta: "Condición Inicial (Diagnóstico)", tipo: "textarea", requerido: true, valorPorDefecto: "Condición apta para inicio de programa preventivo perinatal." },
                { nombre: "planTratamiento", etiqueta: "Módulos de Educación y Ejercicios a Desarrollar", tipo: "textarea", requerido: true },
                { nombre: "examenFisico.postura", etiqueta: "Consideraciones Posturales / Ergonómicas", tipo: "textarea" },
            ]
        },
        {
            titulo: "Términos, Condiciones y Firmas Electrónicas",
            campos: [
                { nombre: "terminos_acepto", etiqueta: "Acepto voluntariamente el ingreso al programa de ejercicios perinatales eximiendo de riesgos inherentes al Centro DMamitas.", tipo: "checkbox", requerido: true },
                { nombre: "firmas.pacienteOAcudiente.nombre", etiqueta: "Nombre de la Paciente Maternar", tipo: "text", requerido: true },
                { nombre: "firmas.pacienteOAcudiente.cedula", etiqueta: "Cédula de Ciudadanía", tipo: "text", requerido: true },
                { nombre: "firmas.pacienteOAcudiente.firmaUrl", etiqueta: "Firma de Consentimiento", tipo: "firma", requerido: true },

                { nombre: "firmas.profesional.nombre", etiqueta: "Certificación Fisioterapeuta - Nombre", tipo: "text", requerido: true, valorPorDefecto: "Ft. Dayan Ivonne Villegas Gamboa" },
                { nombre: "firmas.profesional.registroMedico", etiqueta: "Registro Profesional", tipo: "text", requerido: true, valorPorDefecto: "52862625 - Reg. Salud Departamental" },
                { nombre: "firmas.profesional.firmaUrl", etiqueta: "Firma del Profesional Asistente", tipo: "firma", requerido: true },
            ]
        }
    ]
};
