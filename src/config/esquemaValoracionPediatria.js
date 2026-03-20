export const ESQUEMA_VALORACION_PEDIATRIA = {
    titulo: "Historia Clínica Fisioterapia Pediátrica",
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
                        { valor: "44", etiqueta: "44 - Rehabilitación funcional" },
                        { valor: "10", etiqueta: "10 - Promoción de la salud / Estimulación temprana" },
                        { valor: "27", etiqueta: "27 - Diagnóstico (valoración inicial)" },
                        { valor: "12", etiqueta: "12 - Prevención / Educación terapéutica" },
                    ], requerido: true, valorPorDefecto: "44"
                },
                {
                    nombre: "causaMotivoAtencion", etiqueta: "Causa Externa", tipo: "select", opciones: [
                        { valor: "21", etiqueta: "21 - Enfermedad general (desarrollo neuromotor)" },
                        { valor: "24", etiqueta: "24 - Enfermedad congénita o perinatal" },
                        { valor: "29", etiqueta: "29 - Consulta de seguimiento (control)" },
                        { valor: "10", etiqueta: "10 - Lesión accidental" },
                        { valor: "30", etiqueta: "30 - Prematurez / bajo peso al nacer" },
                    ], requerido: true, valorPorDefecto: "21"
                },
                { nombre: "codDiagnosticoPrincipal", etiqueta: "Diagnóstico CIE-10", tipo: "cie10", requerido: true, placeholder: "Buscar diagnóstico..." }
            ]
        },
        {
            titulo: "Motivo de Consulta",
            campos: [
                { nombre: "motivoConsulta", etiqueta: "Motivo de Consulta", tipo: "textarea", requerido: true, presets: [
                    { etiqueta: "Opción 1 — Estimulación", texto: "Acude a consulta para realizar valoración del desarrollo con el fin de iniciar programa de estimulación adecuada, orientado a favorecer y potenciar el desarrollo integral del bebé de acuerdo con su etapa del desarrollo." },
                    { etiqueta: "Opción 2 — Fisioterapia", texto: "Acude a consulta para valoración por fisioterapia con el objetivo de determinar el estado del neurodesarrollo del bebé y orientar manejo o intervención según los hallazgos encontrados." }
                ]},
            ]
        },
        {
            titulo: "Antecedentes Prenatales",
            campos: [
                { nombre: "moduloPediatria.prenatales.gestacionPlaneada", etiqueta: "Gestación Planeada", tipo: "checkbox" },
                { nombre: "moduloPediatria.prenatales.gestacionControlada", etiqueta: "Gestación Controlada", tipo: "checkbox" },
                { nombre: "moduloPediatria.prenatales.metodosAnticonceptivos", etiqueta: "Gestación con métodos anticonceptivos", tipo: "checkbox" },
                { nombre: "moduloPediatria.prenatales.intentoAborto", etiqueta: "Intento de aborto", tipo: "checkbox" },
                { nombre: "moduloPediatria.prenatales.vomito1erTrim", etiqueta: "Vómito Primer Trimestre", tipo: "checkbox" },
                { nombre: "moduloPediatria.prenatales.sustancias", etiqueta: "Ingesta de fármacos, alcohol, drogas o cigarrillo", tipo: "checkbox" },
                { nombre: "moduloPediatria.prenatales.rayosX", etiqueta: "Exposición Rayos X", tipo: "checkbox" },
                { nombre: "moduloPediatria.prenatales.convulsiones", etiqueta: "Convulsiones", tipo: "checkbox" },
                { nombre: "moduloPediatria.prenatales.desnutricion", etiqueta: "Desnutrición", tipo: "checkbox" },
                { nombre: "moduloPediatria.prenatales.anemia", etiqueta: "Anemia", tipo: "checkbox" },
                { nombre: "moduloPediatria.prenatales.maltrato", etiqueta: "Maltrato", tipo: "checkbox" },
                { nombre: "moduloPediatria.prenatales.hipertension", etiqueta: "Hipertensión", tipo: "checkbox" },
                { nombre: "moduloPediatria.prenatales.diabetes", etiqueta: "Diabetes", tipo: "checkbox" },
            ]
        },
        {
            titulo: "Antecedentes Perinatales",
            campos: [
                { nombre: "moduloPediatria.perinatales.tipoParto", etiqueta: "Parto / Cesárea", tipo: "select", opciones: ["Parto", "Cesárea"] },
                { nombre: "moduloPediatria.perinatales.formaParto", etiqueta: "Forma de Parto", tipo: "select", opciones: ["Espontáneo", "Inducido", "Programado"] },
                { nombre: "moduloPediatria.perinatales.tiempoGestacion", etiqueta: "Tiempo de gestación", tipo: "text" },
                { nombre: "moduloPediatria.perinatales.lugarParto", etiqueta: "Lugar de Parto", tipo: "text" },
                { nombre: "moduloPediatria.perinatales.atendidaOportunamente", etiqueta: "Atendida Oportunamente", tipo: "select", opciones: ["Sí", "No"] },
                { nombre: "moduloPediatria.perinatales.medicoTratante", etiqueta: "Médico Tratante", tipo: "text" },
                { nombre: "moduloPediatria.perinatales.pesoAlNacer", etiqueta: "Peso al nacer", tipo: "text" },
                { nombre: "moduloPediatria.perinatales.tallaAlNacer", etiqueta: "Talla al nacer", tipo: "text" },
                { nombre: "moduloPediatria.perinatales.recibioCurso", etiqueta: "Recibió Curso Psicoprofiláctico", tipo: "select", opciones: ["Sí", "No"] },
            ]
        },
        {
            titulo: "Antecedentes Recién Nacido",
            campos: [
                { nombre: "moduloPediatria.recienNacido.llantoAlNacer", etiqueta: "Llanto al nacer", tipo: "checkbox" },
                { nombre: "moduloPediatria.recienNacido.problemasRespiratorios", etiqueta: "Problemas Respiratorios", tipo: "checkbox" },
                { nombre: "moduloPediatria.recienNacido.incubadora", etiqueta: "Incubadora", tipo: "checkbox" },
                { nombre: "moduloPediatria.recienNacido.lactanciaMaterna", etiqueta: "Lactancia Materna", tipo: "select", opciones: ["Sí", "No"] },
                { nombre: "moduloPediatria.recienNacido.tiempoLactancia", etiqueta: "Tiempo de Lactancia", tipo: "text" },
                { nombre: "moduloPediatria.recienNacido.hospitalarios", etiqueta: "Hospitalarios", tipo: "textarea" },
                { nombre: "moduloPediatria.recienNacido.patologicos", etiqueta: "Patológicos", tipo: "textarea" },
                { nombre: "moduloPediatria.recienNacido.familiares", etiqueta: "Familiares", tipo: "textarea" },
                { nombre: "moduloPediatria.recienNacido.traumaticos", etiqueta: "Traumáticos", tipo: "textarea" },
                { nombre: "moduloPediatria.recienNacido.farmacologicos", etiqueta: "Farmacológicos", tipo: "textarea" },
                { nombre: "moduloPediatria.recienNacido.quirurgicos", etiqueta: "Quirúrgicos", tipo: "textarea" },
                { nombre: "moduloPediatria.recienNacido.toxicosAlergicos", etiqueta: "Tóxico/alérgicos", tipo: "textarea" },
            ]
        },
        {
            titulo: "Hábitos y Estilo de Vida",
            campos: [
                { nombre: "moduloPediatria.habitos.recomendacionesMedicas", etiqueta: "Recomendaciones Médicas o dieta especial", tipo: "textarea" },
                { nombre: "moduloPediatria.habitos.problemasSueno", etiqueta: "Tiene problemas antes/durante/después de dormir", tipo: "textarea" },
                { nombre: "moduloPediatria.habitos.duermeCon", etiqueta: "Duerme con", tipo: "select", opciones: ["Mamá", "Papá", "Hermanos", "Solo", "Otros"] },
                { nombre: "moduloPediatria.habitos.patronSueno", etiqueta: "Patrón de sueño", tipo: "textarea" },
                { nombre: "moduloPediatria.habitos.pesadillas", etiqueta: "¿Se despierta con pesadillas?", tipo: "select", opciones: ["Sí", "No"] },
                { nombre: "moduloPediatria.habitos.siesta", etiqueta: "¿Suele dormir siesta?", tipo: "text" },
                { nombre: "moduloPediatria.habitos.miedos", etiqueta: "¿Tiene miedos?", tipo: "textarea", placeholder: "¿A qué?" },
                { nombre: "moduloPediatria.habitos.cambioAlimentacion", etiqueta: "¿Le costó pasar de alimentación líquida a sólida?", tipo: "textarea", placeholder: "¿Por qué?" },
                { nombre: "moduloPediatria.habitos.problemasSuccion", etiqueta: "Problemas de Succión", tipo: "checkbox" },
                { nombre: "moduloPediatria.habitos.problemasMasticacion", etiqueta: "Problemas de Masticación", tipo: "checkbox" },
                { nombre: "moduloPediatria.habitos.problemasDeglucion", etiqueta: "Problemas de Deglución", tipo: "checkbox" },
                { nombre: "moduloPediatria.habitos.problemasComer", etiqueta: "¿Presenta problemas al comer?", tipo: "textarea", placeholder: "¿Cuáles?" },
                { nombre: "moduloPediatria.habitos.alimentosPreferidos", etiqueta: "Alimentos preferidos", tipo: "textarea" },
                { nombre: "moduloPediatria.habitos.alimentosNoGustan", etiqueta: "Alimentos que no le gustan", tipo: "textarea" },
            ]
        },
        {
            titulo: "Desarrollo Personal y Social",
            campos: [
                { nombre: "moduloPediatria.desarrolloSocial.viveConPadres", etiqueta: "¿Vive el niño con sus padres?", tipo: "text" },
                { nombre: "moduloPediatria.desarrolloSocial.permaneceCon", etiqueta: "¿Con quién permanece el niño?", tipo: "text" },
                { nombre: "moduloPediatria.desarrolloSocial.prefiereA", etiqueta: "¿A quién prefiere?", tipo: "text" },
                { nombre: "moduloPediatria.desarrolloSocial.relacionHermanos", etiqueta: "¿Cómo es la relación con los hermanos?", tipo: "textarea" },
                { nombre: "moduloPediatria.desarrolloSocial.emociones", etiqueta: "¿Cuáles son los sentimientos y emociones que más expresa?", tipo: "textarea" },
                { nombre: "moduloPediatria.desarrolloSocial.juegaCon", etiqueta: "¿Con quién juega?", tipo: "text" },
                { nombre: "moduloPediatria.desarrolloSocial.juegosPrefiere", etiqueta: "¿Qué juegos prefiere?", tipo: "textarea" },
                { nombre: "moduloPediatria.desarrolloSocial.relacionDesconocidos", etiqueta: "¿Cómo se relaciona con desconocidos?", tipo: "textarea" },
                { nombre: "moduloPediatria.rutinaDiaria", etiqueta: "Describa la rutina diaria de su hijo", tipo: "textarea" },
            ]
        },
        {
            titulo: "Desarrollo Ontológico (Hitos)",
            campos: [
                { nombre: "moduloPediatria.hitos.controlCefalico.si", etiqueta: "Control Cefálico (SI/NO)", tipo: "select", opciones: ["Sí", "No"] },
                { nombre: "moduloPediatria.hitos.controlCefalico.tiempo", etiqueta: "Control Cefálico (Tiempo)", tipo: "text" },
                { nombre: "moduloPediatria.hitos.controlCefalico.obs", etiqueta: "Control Cefálico (Observaciones)", tipo: "text" },

                { nombre: "moduloPediatria.hitos.rolados.si", etiqueta: "Rolados (SI/NO)", tipo: "select", opciones: ["Sí", "No"] },
                { nombre: "moduloPediatria.hitos.rolados.tiempo", etiqueta: "Rolados (Tiempo)", tipo: "text" },
                { nombre: "moduloPediatria.hitos.rolados.obs", etiqueta: "Rolados (Observaciones)", tipo: "text" },

                { nombre: "moduloPediatria.hitos.sedente.si", etiqueta: "Sedente (SI/NO)", tipo: "select", opciones: ["Sí", "No"] },
                { nombre: "moduloPediatria.hitos.sedente.tiempo", etiqueta: "Sedente (Tiempo)", tipo: "text" },
                { nombre: "moduloPediatria.hitos.sedente.obs", etiqueta: "Sedente (Observaciones)", tipo: "text" },

                { nombre: "moduloPediatria.hitos.gateo.si", etiqueta: "Gateo (SI/NO)", tipo: "select", opciones: ["Sí", "No"] },
                { nombre: "moduloPediatria.hitos.gateo.tiempo", etiqueta: "Gateo (Tiempo)", tipo: "text" },
                { nombre: "moduloPediatria.hitos.gateo.obs", etiqueta: "Gateo (Observaciones)", tipo: "text" },

                { nombre: "moduloPediatria.hitos.bipedo.si", etiqueta: "Bípedo (SI/NO)", tipo: "select", opciones: ["Sí", "No"] },
                { nombre: "moduloPediatria.hitos.bipedo.tiempo", etiqueta: "Bípedo (Tiempo)", tipo: "text" },
                { nombre: "moduloPediatria.hitos.bipedo.obs", etiqueta: "Bípedo (Observaciones)", tipo: "text" },

                { nombre: "moduloPediatria.hitos.marcha.si", etiqueta: "Marcha (SI/NO)", tipo: "select", opciones: ["Sí", "No"] },
                { nombre: "moduloPediatria.hitos.marcha.tiempo", etiqueta: "Marcha (Tiempo)", tipo: "text" },
                { nombre: "moduloPediatria.hitos.marcha.obs", etiqueta: "Marcha (Observaciones)", tipo: "text" },
            ]
        },
        {
            titulo: "Observación General y Examen Físico",
            campos: [
                { nombre: "moduloPediatria.examen.fc", etiqueta: "Frecuencia Cardíaca (80-160ppm)", tipo: "text" },
                { nombre: "moduloPediatria.examen.fr", etiqueta: "Frecuencia Respiratoria (30+-5)", tipo: "text" },
                { nombre: "moduloPediatria.examen.temperatura", etiqueta: "Temperatura", tipo: "text" },
                { nombre: "moduloPediatria.examen.tejidoTegumentario", etiqueta: "Tejido Tegumentario", tipo: "textarea" },
                { nombre: "moduloPediatria.examen.reflejos", etiqueta: "Reflejos Osteotendinosos", tipo: "textarea" },
                { nombre: "moduloPediatria.examen.anormales", etiqueta: "Anormales", tipo: "text" },
                { nombre: "moduloPediatria.examen.patologicos", etiqueta: "Patológicos", tipo: "text" },
                { nombre: "moduloPediatria.examen.tonoMuscular", etiqueta: "Tono Muscular", tipo: "textarea" },
                { nombre: "moduloPediatria.examen.controlMotor", etiqueta: "Control Motor", tipo: "textarea" },
                { nombre: "moduloPediatria.examen.desplazamientos", etiqueta: "Desplazamientos", tipo: "textarea" },
                { nombre: "moduloPediatria.examen.sensibilidad", etiqueta: "Sensibilidad", tipo: "textarea" },
                { nombre: "moduloPediatria.examen.perfilSensorial", etiqueta: "Perfil Sensorial", tipo: "textarea" },
                { nombre: "moduloPediatria.examen.deformidades", etiqueta: "Deformidades o Contracturas", tipo: "textarea" },
                { nombre: "moduloPediatria.examen.aparatosOrtopedicos", etiqueta: "Aparatos Ortopédicos", tipo: "textarea" },
                { nombre: "moduloPediatria.examen.sistemaPulmonar", etiqueta: "Sistema Pulmonar (Simetría, patrón, expansión, auscultación...)", tipo: "textarea" },
                { nombre: "moduloPediatria.examen.problemasAsociados", etiqueta: "Problemas Asociados", tipo: "textarea" },
            ]
        },
        {
            titulo: "Observación de la Sesión",
            siempreVisible: true,
            campos: [
                {
                    nombre: "moduloPediatria.emocionesExpresadas", etiqueta: "Sentimientos y emociones que el niño expresa", tipo: "checkbox_group",
                    opciones: [
                        { valor: "Alegría", etiqueta: "Alegría" },
                        { valor: "Tranquilidad", etiqueta: "Tranquilidad" },
                        { valor: "Inseguridad", etiqueta: "Inseguridad" },
                        { valor: "Timidez", etiqueta: "Timidez" },
                        { valor: "Frustración", etiqueta: "Frustración" },
                        { valor: "Enojo", etiqueta: "Enojo" },
                        { valor: "Ansiedad", etiqueta: "Ansiedad" },
                        { valor: "Cansancio", etiqueta: "Cansancio" },
                    ]
                },
                {
                    nombre: "moduloPediatria.relacionEntorno", etiqueta: "Cómo se relaciona el niño con el entorno", tipo: "select",
                    opciones: [
                        { valor: "Adecuada", etiqueta: "Adecuada — Se integra fácilmente al ambiente terapéutico, responde positivamente a las actividades y muestra comodidad e iniciativa en la interacción con el entorno y con el terapeuta." },
                        { valor: "Con apoyo inicial", etiqueta: "Con apoyo inicial — Requiere un período de adaptación antes de integrarse al entorno terapéutico; con acompañamiento y orientación se logra una participación activa en las actividades." },
                        { valor: "Dificultad para adaptarse", etiqueta: "Dificultad para adaptarse — Presenta resistencia o dificultad significativa para integrarse al entorno terapéutico, mostrando conductas de evitación, llanto persistente o baja tolerancia a las actividades propuestas." },
                    ]
                },
            ]
        },
        {
            titulo: "Diagnóstico y Plan",
            campos: [
                { nombre: "diagnosticoFisioterapeutico", etiqueta: "Diagnóstico Fisioterapéutico", tipo: "textarea", requerido: true, presets: [
                    { etiqueta: "Opción 1 — Desarrollo acorde", texto: "Paciente que presenta desarrollo neuromotor acorde a su edad cronológica, evidenciando habilidades motoras apropiadas para su etapa del desarrollo. Se recomienda inicio de programa de estimulación adecuada, con el objetivo de favorecer, potenciar y acompañar su desarrollo integral, promoviendo la adquisición progresiva de habilidades motoras y la interacción con el entorno." },
                    { etiqueta: "Opción 2 — Alteraciones del desarrollo", texto: "Paciente que presenta alteraciones en el desarrollo neuromotor, evidenciándose dificultades en la adquisición de habilidades motoras esperadas para su edad. Se recomienda intervención desde fisioterapia, mediante un programa de tratamiento personalizado e individualizado, con el objetivo de favorecer su desarrollo integral, potenciar sus habilidades motoras y mejorar su funcionalidad." }
                ]},
                { nombre: "planTratamiento", etiqueta: "Plan de Tratamiento", tipo: "textarea", requerido: true, presets: [
                    { etiqueta: "Opción 1 — Estimulación grupal", texto: "Programa Grupal de Estimulación Adecuada: Se recomienda el ingreso al programa de estimulación adecuada en modalidad grupal, con el objetivo de favorecer y potenciar el desarrollo integral del niño, fortaleciendo habilidades motoras, sensoriales, cognitivas y de interacción con el entorno, mediante actividades acordes a su etapa del desarrollo. Se brindará además orientación a los padres o cuidadores para continuar la estimulación en el hogar." },
                    { etiqueta: "Opción 2 — Fisioterapia personalizada", texto: "Fisioterapia Personalizada: Se recomienda inicio de programa de fisioterapia pediátrica en modalidad individualizada, orientado a abordar las alteraciones identificadas en el desarrollo neuromotor. El tratamiento se realizará mediante intervenciones terapéuticas específicas y personalizadas, con el objetivo de favorecer la adquisición de habilidades motoras, mejorar el control postural y promover el desarrollo integral del niño, incluyendo orientación a los padres para apoyo en casa." }
                ]},
            ]
        },
        {
            titulo: "Autorización y Firmas",
            campos: [
                { nombre: "moduloPediatria.autorizacionImagen", etiqueta: "Autorizo el uso de imagen para fines educativos y redes sociales", tipo: "checkbox", valorPorDefecto: false },
                { nombre: "firmas.pacienteOAcudiente.nombre", etiqueta: "Nombre del Acudiente / Representante", tipo: "text", requerido: true },
                { nombre: "firmas.pacienteOAcudiente.cedula", etiqueta: "C.C. del Acudiente", tipo: "text", requerido: true },
                { nombre: "firmas.pacienteOAcudiente.firmaUrl", etiqueta: "Firma del Acudiente", tipo: "firma", requerido: true },
                { nombre: "firmas.profesional.nombre", etiqueta: "Firma del Fisioterapeuta", tipo: "text", valorPorDefecto: "Ft. Dayan Ivonne Villegas Gamboa", lecsolo: true },
                { nombre: "firmas.profesional.registroMedico", etiqueta: "Registro Profesional", tipo: "text", valorPorDefecto: "52862625 - Reg. Salud Departamental", lecsolo: true },
                { nombre: "firmas.profesional.firmaUrl", etiqueta: "Firma del Profesional", tipo: "firma", requerido: true },
            ]
        }
    ]
};
