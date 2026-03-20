export const ESQUEMA_VALORACION_LACTANCIA = {
    titulo: "Historia Clínica - Asesoría de Lactancia Materna",
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
                { nombre: "fechaInicioAtencion", etiqueta: "Fecha y Hora Atención", tipo: "datetime-local", requerido: true, autoNow: true },
                {
                    nombre: "finalidadTecnologiaSalud", etiqueta: "Finalidad", tipo: "select", opciones: [
                        { valor: "44", etiqueta: "Rehabilitación" },
                        { valor: "10", etiqueta: "Promoción de la Salud" }
                    ], requerido: true, valorPorDefecto: "10"
                },
                {
                    nombre: "causaMotivoAtencion", etiqueta: "Causa Externa", tipo: "select", opciones: [
                        { valor: "21", etiqueta: "Enfermedad general" }
                    ], requerido: true, valorPorDefecto: "21"
                },
                { nombre: "codDiagnosticoPrincipal", etiqueta: "Diagnóstico CIE-10", tipo: "cie10", requerido: true, placeholder: "Ej. Z391" }
            ]
        },
        {
            titulo: "Anamnesis y Lactancia",
            campos: [
                { nombre: "motivoConsulta", etiqueta: "Motivo de Consulta", tipo: "textarea", requerido: true },
                { nombre: "moduloLactancia.experienciaLactancia", etiqueta: "¿Ha tenido experiencia previa en lactancia?", tipo: "select", opciones: ["Sí", "No"], requerido: true },
                { nombre: "moduloLactancia.comoFueExperiencia", etiqueta: "¿Cómo fue esa experiencia?", tipo: "textarea" },
                { nombre: "moduloLactancia.dificultadesLactancia", etiqueta: "Dificultades actuales", tipo: "textarea" },
                { nombre: "moduloLactancia.deseaAmamantar", etiqueta: "¿Desea amamantar a su bebé?", tipo: "select", opciones: ["Sí", "No", "Duda"], requerido: true },
            ]
        },
        {
            titulo: "Examen Físico - Pechos",
            campos: [
                { nombre: "moduloLactancia.pechosNormales", etiqueta: "Pechos de aspecto normal", tipo: "checkbox" },
                { nombre: "moduloLactancia.pechosDolorosos", etiqueta: "Pechos dolorosos al tacto", tipo: "checkbox" },
                { nombre: "moduloLactancia.pechosSecrecion", etiqueta: "Presencia de secreciones/grietas", tipo: "checkbox" },
                { nombre: "moduloLactancia.formaPezon", etiqueta: "Forma del Pezón", tipo: "select", opciones: ["Normal", "Plano", "Invertido", "Otro"] },
            ]
        },
        {
            titulo: "Diagnóstico y Plan",
            campos: [
                { nombre: "diagnosticoFisioterapeutico", etiqueta: "Diagnóstico / Impresión Clínica", tipo: "textarea", requerido: true },
                { nombre: "planTratamiento", etiqueta: "Plan de Intervención / Recomendaciones", tipo: "textarea", requerido: true },
            ]
        },
        {
            titulo: "Firmas Legales",
            campos: [
                { nombre: "firmas.pacienteOAcudiente.nombre", etiqueta: "Nombre de la Madre", tipo: "text", requerido: true },
                { nombre: "firmas.pacienteOAcudiente.cedula", etiqueta: "Documento de la Madre", tipo: "text", requerido: true },
                { nombre: "firmas.pacienteOAcudiente.firmaUrl", etiqueta: "Firma de la Madre", tipo: "firma", requerido: true },
            ]
        }
    ]
};
