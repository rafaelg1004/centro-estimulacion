export const ESQUEMA_CONSENTIMIENTO_PERINATAL = {
    titulo: "Programa Perinatal Integrado",
    endpoint: "/valoraciones",
    redireccion: "/valoraciones",
    secciones: [
        {
            titulo: "Información de Consulta e Ingreso",
            siempreVisible: true,
            campos: [
                {
                    nombre: "codConsulta", etiqueta: "Código Consulta (CUPS)", tipo: "cups", requerido: true, placeholder: "Buscar procedimiento..."
                },
                { nombre: "fechaInicioAtencion", etiqueta: "Fecha de Ingreso al Programa", tipo: "datetime-local", requerido: true, autoNow: true },
                {
                    nombre: "finalidadTecnologiaSalud", etiqueta: "Finalidad", tipo: "select", opciones: [
                        { valor: "10", etiqueta: "Promoción de la Salud" },
                        { valor: "44", etiqueta: "Rehabilitación" }
                    ], requerido: true, valorPorDefecto: "10"
                },
                {
                    nombre: "causaMotivoAtencion", etiqueta: "Causa Externa", tipo: "select", opciones: [
                        { valor: "22", etiqueta: "Manejo del embarazo normal / preventivo" },
                        { valor: "21", etiqueta: "Enfermedad general" }
                    ], requerido: true, valorPorDefecto: "22"
                },
                { nombre: "codDiagnosticoPrincipal", etiqueta: "Código Diagnóstico (CIE-10)", tipo: "cie10", requerido: true, placeholder: "Ej. Z349 - Supervisión de embarazo normal" }
            ]
        },
        {
            titulo: "Anamnesis del Programa",
            campos: [
                { nombre: "motivoConsulta", etiqueta: "Motivo de participar en el programa", tipo: "textarea", requerido: true },
                { nombre: "enfermedadActual", etiqueta: "Anotaciones Clínicas de Ingreso", tipo: "textarea" },
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
                { nombre: "signosVitales.imc", etiqueta: "IMC", tipo: "text", lecsolo: true, autoCalc: { formula: "imc", peso: "signosVitales.pesoActual", talla: "signosVitales.talla" } },
            ]
        },
        {
            titulo: "Antecedentes Generales",
            campos: [
                { nombre: "antecedentes.patologicos", etiqueta: "Patologías Base (HTA, Diabetes, etc.)", tipo: "textarea" },
                { nombre: "antecedentes.quirurgicos", etiqueta: "Quirúrgicos", tipo: "textarea" },
                { nombre: "antecedentes.farmacologicos", etiqueta: "Medicamentos Actuales", tipo: "textarea" },
                { nombre: "antecedentes.traumaticos", etiqueta: "Traumáticos", tipo: "textarea" },
                { nombre: "antecedentes.familiares", etiqueta: "Antecedentes Familiares", tipo: "textarea" },
            ]
        },
        {
            titulo: "Condiciones Obstétricas",
            campos: [
                { nombre: "antecedentes.ginecoObstetricos.embarazoAltoRiesgo", etiqueta: "¿Es un embarazo de alto riesgo?", tipo: "select", opciones: ["Sí", "No"] },
                { nombre: "antecedentes.ginecoObstetricos.diabetesNoControlada", etiqueta: "Diabetes No Controlada", tipo: "select", opciones: ["Sí", "No"] },
                { nombre: "antecedentes.ginecoObstetricos.historiaAborto", etiqueta: "Historia de Abortos previos", tipo: "text", placeholder: "Ej. Ninguno, 1" },
                { nombre: "antecedentes.ginecoObstetricos.semanasGestacion", etiqueta: "Semanas de Gestación", tipo: "text" },
                { nombre: "antecedentes.ginecoObstetricos.fum", etiqueta: "Fecha Última Menstruación (FUM)", tipo: "text" },
                { nombre: "antecedentes.ginecoObstetricos.tipoParto", etiqueta: "Tipo de Parto Previo", tipo: "text" },
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
            titulo: "Términos y Condiciones",
            campos: [
                { nombre: "terminos_acepto", etiqueta: "Acepto voluntariamente el ingreso al programa de ejercicios perinatales eximiendo de riesgos inherentes al Centro DMamitas.", tipo: "checkbox" },
            ]
        }
    ]
};
