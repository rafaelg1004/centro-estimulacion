export const ESQUEMA_VALORACION_PISO_PELVICO = {
    titulo: "Historia Clínica - Fisioterapia de Piso Pélvico Postparto",
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
                        { valor: "10", etiqueta: "10 - Promoción de la salud" }
                    ], requerido: true, valorPorDefecto: "44"
                },
                {
                    nombre: "causaMotivoAtencion", etiqueta: "Causa Externa", tipo: "select", opciones: [
                        { valor: "21", etiqueta: "21 - Enfermedad general" },
                        { valor: "24", etiqueta: "24 - Enfermedad congénita" }
                    ], requerido: true, valorPorDefecto: "21"
                },
                { nombre: "codDiagnosticoPrincipal", etiqueta: "Diagnóstico CIE-10", tipo: "cie10", requerido: true, placeholder: "Buscar diagnóstico..." }
            ]
        },
        {
            titulo: "Motivo de Consulta y Signos Vitales",
            campos: [
                { nombre: "motivoConsulta", etiqueta: "Motivo de consulta (¿En qué te puedo ayudar?)", tipo: "textarea", requerido: true },
                { nombre: "signosVitales.temperatura", etiqueta: "Temperatura (°C)", tipo: "text" },
                { nombre: "signosVitales.ta", etiqueta: "Tensión Arterial (TA)", tipo: "text" },
                { nombre: "signosVitales.fr", etiqueta: "Frecuencia Respiratoria (FR)", tipo: "text" },
                { nombre: "signosVitales.fc", etiqueta: "Frecuencia Cardíaca (FC)", tipo: "text" },
                { nombre: "signosVitales.pesoPrevio", etiqueta: "Peso Previo (kg)", tipo: "text" },
                { nombre: "signosVitales.pesoActual", etiqueta: "Peso Actual (kg)", tipo: "text" },
                { nombre: "signosVitales.talla", etiqueta: "Talla (cm)", tipo: "text" },
                { nombre: "signosVitales.imc", etiqueta: "IMC", tipo: "text", lecsolo: true, autoCalc: { formula: "imc", peso: "signosVitales.pesoActual", talla: "signosVitales.talla" } },
            ]
        },
        {
            titulo: "Antecedentes y Estilo de Vida",
            campos: [
                { nombre: "moduloPisoPelvico.deporteActualidad", etiqueta: "Deporte en la actualidad (Tipo/ Intensidad/ Duración / Frecuencia)", tipo: "textarea" },
                {
                    nombre: "moduloPisoPelvico.avdTrabajo", etiqueta: "Actividades Diarias / Trabajo", tipo: "checkbox_group", opciones: [
                        { valor: "Bipedestación", etiqueta: "Bipedestación" },
                        { valor: "Sedestación", etiqueta: "Sedestación" },
                        { valor: "Cargas", etiqueta: "Cargas" },
                        { valor: "Conducción", etiqueta: "Conducción" },
                        { valor: "Marcha", etiqueta: "Marcha" },
                        { valor: "Oficina", etiqueta: "Oficina" },
                        { valor: "Homeworking", etiqueta: "Homeworking" }
                    ]
                },
                { nombre: "moduloPisoPelvico.avdObservaciones", etiqueta: "Observaciones AVD", tipo: "textarea" },
                {
                    nombre: "moduloPisoPelvico.farmacologicos.seleccion", etiqueta: "Antecedentes Farmacológicos", tipo: "checkbox_group", opciones: [
                        { valor: "Antihipertensivo", etiqueta: "Antihipertensivo" },
                        { valor: "Antidepresivo", etiqueta: "Antidepresivo" },
                        { valor: "Ansiolítico", etiqueta: "Ansiolítico" },
                        { valor: "Antibiótico", etiqueta: "Antibiótico" },
                        { valor: "Vitaminas", etiqueta: "Vitaminas" },
                        { valor: "Antioxidantes", etiqueta: "Antioxidantes" },
                        { valor: "Complementación natural", etiqueta: "Complementación natural" }
                    ]
                },
                { nombre: "moduloPisoPelvico.farmacologicos.otros", etiqueta: "Otros Farmacológicos", tipo: "text" },
                { nombre: "moduloPisoPelvico.farmacologicos.infoMedicacion", etiqueta: "Información sobre medicación", tipo: "textarea" },
                { nombre: "moduloPisoPelvico.alergias", etiqueta: "Alergias dérmicas / alimentarias", tipo: "textarea" },
                { nombre: "moduloPisoPelvico.analiticaReciente", etiqueta: "Última analítica (sangre / orina / heces / citología)", tipo: "textarea" },
                { nombre: "moduloPisoPelvico.patologiaCardiorrespiratoria", etiqueta: "Patología cardiaca, pulmonar o cardiorrespiratoria", tipo: "textarea" },
                { nombre: "moduloPisoPelvico.patologiaNeurologica", etiqueta: "Patología Neurológica", tipo: "textarea" },
                {
                    nombre: "moduloPisoPelvico.traumaticos", etiqueta: "Antecedentes Traumáticos", tipo: "checkbox_group", opciones: [
                        { valor: "Accidente de tráfico", etiqueta: "Accidente de tráfico" },
                        { valor: "Caída sobre coxis", etiqueta: "Caída sobre coxis" },
                        { valor: "Caída sobre espalda", etiqueta: "Caída sobre espalda" },
                        { valor: "Golpe abdominal", etiqueta: "Golpe abdominal" },
                        { valor: "Golpe en la cabeza", etiqueta: "Golpe en la cabeza" }
                    ]
                },
                {
                    nombre: "moduloPisoPelvico.enfCronica.seleccion", etiqueta: "Enfermedades Crónicas", tipo: "checkbox_group", opciones: [
                        { valor: "Diabetes", etiqueta: "Diabetes" },
                        { valor: "Hipotiroidismo", etiqueta: "Hipotiroidismo" },
                        { valor: "Hipertiroidismo", etiqueta: "Hipertiroidismo" },
                        { valor: "Hipertenso", etiqueta: "Hipertenso" },
                        { valor: "Hipercolesterolemia", etiqueta: "Hipercolesterolemia" },
                        { valor: "Asma", etiqueta: "Asma" },
                        { valor: "Artrosis", etiqueta: "Artrosis" },
                        { valor: "Osteoporosis", etiqueta: "Osteoporosis" },
                        { valor: "Hernia cervical", etiqueta: "Hernia cervical" },
                        { valor: "Hernia dorsal", etiqueta: "Hernia dorsal" },
                        { valor: "Hernia lumbar", etiqueta: "Hernia lumbar" },
                        { valor: "Hernia abdominal", etiqueta: "Hernia abdominal" },
                        { valor: "Hernia inguinal", etiqueta: "Hernia inguinal" }
                    ]
                },
                { nombre: "moduloPisoPelvico.enfCronica.observaciones", etiqueta: "Observaciones Enfermedad Crónica", tipo: "textarea" },
                { nombre: "moduloPisoPelvico.ets.presente", etiqueta: "¿Presenta Enfermedades de Transmisión Sexual?", tipo: "select", opciones: ["Sí", "No"] },
                { nombre: "moduloPisoPelvico.ets.observaciones", etiqueta: "Observaciones ETS", tipo: "textarea" },
                {
                    nombre: "moduloPisoPelvico.psicologicos.seleccion", etiqueta: "Antecedentes Psicológicos", tipo: "checkbox_group", opciones: [
                        { valor: "Duelos", etiqueta: "Duelos" },
                        { valor: "Ruptura relación", etiqueta: "Ruptura relación" }
                    ]
                },
                { nombre: "moduloPisoPelvico.psicologicos.observaciones", etiqueta: "Observaciones Psicológicos", tipo: "textarea" },
                {
                    nombre: "moduloPisoPelvico.quirurgicos.seleccion", etiqueta: "Antecedentes Quirúrgicos", tipo: "checkbox_group", opciones: [
                        { valor: "Cirugía torácica", etiqueta: "Cirugía torácica" },
                        { valor: "Cirugía abdominal", etiqueta: "Cirugía abdominal" },
                        { valor: "Cirugía pélvica", etiqueta: "Cirugía pélvica" },
                        { valor: "Cirugía hernia", etiqueta: "Cirugía hernia" },
                        { valor: "Proceso oncológico", etiqueta: "Proceso oncológico" }
                    ]
                },
                { nombre: "moduloPisoPelvico.quirurgicos.observaciones", etiqueta: "Observaciones Quirúrgicos", tipo: "textarea" },
                { nombre: "moduloPisoPelvico.familiares", etiqueta: "Antecedentes Familiares", tipo: "textarea" },
                { nombre: "moduloPisoPelvico.toxicos", etiqueta: "Antecedentes Tóxicos", tipo: "textarea" },
            ]
        },
        {
            titulo: "Dinámica Obstétrica y Ginecológica",
            campos: [
                { nombre: "moduloPisoPelvico.obstetrica.numEmbarazos", etiqueta: "No. Embarazos", tipo: "number" },
                { nombre: "moduloPisoPelvico.obstetrica.numAbortos", etiqueta: "No. Abortos", tipo: "number" },
                { nombre: "moduloPisoPelvico.obstetrica.numPartosVaginales", etiqueta: "No. Partos Vaginales", tipo: "number" },
                { nombre: "moduloPisoPelvico.obstetrica.numCesareas", etiqueta: "No. de Cesáreas", tipo: "number" },

                // Repetible para hijos (Simulación manual para 3 hijos como el PDF suele pedir)
                { nombre: "moduloPisoPelvico.obstetrica.hijo1", etiqueta: "Hijo 1: Nombre, Peso, Talla, Parto/Cesárea, F.Nac, Sem Gestación", tipo: "textarea" },
                { nombre: "moduloPisoPelvico.obstetrica.hijo2", etiqueta: "Hijo 2: Nombre, Peso, Talla, Parto/Cesárea, F.Nac, Sem Gestación", tipo: "textarea" },
                { nombre: "moduloPisoPelvico.obstetrica.hijo3", etiqueta: "Hijo 3: Nombre, Peso, Talla, Parto/Cesárea, F.Nac, Sem Gestación", tipo: "textarea" },

                { nombre: "moduloPisoPelvico.actividadFisicaGestacion", etiqueta: "Actividad física durante la gestación (Tipo, Intensidad, Frecuencia)", tipo: "textarea" },
                { nombre: "moduloPisoPelvico.medicacionGestacion", etiqueta: "Medicación (Progesterona / Ácido Fólico/ antibiótico / Multivitamínico)", tipo: "textarea" },
                { nombre: "moduloPisoPelvico.trabajoParto.dilatacion", etiqueta: "Desarrollo de la Dilatación (activo/pasivo- Posición -duración)", tipo: "textarea" },
                { nombre: "moduloPisoPelvico.trabajoParto.expulsivo", etiqueta: "Desarrollo del Expulsivo (activo/pasivo- Posición -duración)", tipo: "textarea" },
                {
                    nombre: "moduloPisoPelvico.trabajoParto.tecnicaExpulsivo", etiqueta: "Técnica de Expulsivo", tipo: "checkbox_group", opciones: [
                        { valor: "Kristeller", etiqueta: "Kristeller" },
                        { valor: "Episiotomía sin desgarro", etiqueta: "Episiotomía sin desgarro" },
                        { valor: "Episiotomía con desgarro", etiqueta: "Episiotomía con desgarro" },
                        { valor: "Vacuum", etiqueta: "Vacuum" },
                        { valor: "Fórceps", etiqueta: "Fórceps" },
                        { valor: "Espátulas", etiqueta: "Espátulas" },
                        { valor: "Respetado", etiqueta: "Respetado" },
                        { valor: "Eutócico", etiqueta: "Eutócico" },
                        { valor: "Natural", etiqueta: "Natural" },
                        { valor: "Hipopresivo", etiqueta: "Hipopresivo con grupo sinergistas" },
                        { valor: "Desgarro sin episiotomía", etiqueta: "Desgarro sin episiotomía" }
                    ]
                },
                { nombre: "moduloPisoPelvico.trabajoParto.observaciones", etiqueta: "Observaciones Parto", tipo: "textarea" },
                { nombre: "moduloPisoPelvico.actividadFisicaPostparto", etiqueta: "Actividad física durante el postparto (Tipo, Intensidad, Frecuencia)", tipo: "textarea" },
            ]
        },
        {
            titulo: "Síntomas y Dinámica Menstrual",
            campos: [
                { nombre: "moduloPisoPelvico.episodiosIncontinencia.urinariaTrasParto", etiqueta: "Episodios de incontinencia Urinaria tras el parto", tipo: "select", opciones: ["Sí", "No"] },
                { nombre: "moduloPisoPelvico.episodiosIncontinencia.fecalTrasParto", etiqueta: "Episodios de incontinencia Fecal", tipo: "select", opciones: ["Sí", "No"] },
                { nombre: "moduloPisoPelvico.episodiosIncontinencia.gasesVaginales", etiqueta: "Gases vaginales", tipo: "select", opciones: ["Sí", "No"] },
                { nombre: "moduloPisoPelvico.episodiosIncontinencia.bultoVaginal", etiqueta: "¿Siente o presenta algún tipo de bulto a nivel vaginal?", tipo: "select", opciones: ["Sí", "No"] },

                { nombre: "moduloPisoPelvico.dinamicaMenstrual.menarquia", etiqueta: "Edad Menarquia", tipo: "text" },
                { nombre: "moduloPisoPelvico.dinamicaMenstrual.menopausia", etiqueta: "Edad Menopausia", tipo: "text" },
                { nombre: "moduloPisoPelvico.dinamicaMenstrual.diasMenstruacion", etiqueta: "Días de Menstruación", tipo: "text" },
                { nombre: "moduloPisoPelvico.dinamicaMenstrual.intervaloPeriodo", etiqueta: "Intervalo entre periodo", tipo: "text" },
                {
                    nombre: "moduloPisoPelvico.dinamicaMenstrual.caracteristicasSangrado", etiqueta: "Características del Sangrado", tipo: "checkbox_group", opciones: [
                        { valor: "Fluido", etiqueta: "Fluido" }, { valor: "Espeso", etiqueta: "Espeso" },
                        { valor: "Entrecortado", etiqueta: "Entrecortado" }, { valor: "Coágulos", etiqueta: "Coágulos" },
                        { valor: "Oxidado", etiqueta: "Oxidado" }, { valor: "Olor sangre", etiqueta: "Olor sangre" },
                        { valor: "Olor lubricación", etiqueta: "Olor lubricación" }
                    ]
                },
                {
                    nombre: "moduloPisoPelvico.dinamicaMenstrual.algias", etiqueta: "Algias durante el periodo menstrual", tipo: "checkbox_group", opciones: [
                        { valor: "Todos los días", etiqueta: "Todos los días" },
                        { valor: "Síndrome Ovulatorio", etiqueta: "Síndrome Ovulatorio" },
                        { valor: "Síndrome Premenstrual", etiqueta: "Síndrome Premenstrual" }
                    ]
                },
                { nombre: "moduloPisoPelvico.dinamicaMenstrual.observaciones", etiqueta: "Observaciones Menstruación", tipo: "textarea" },
                {
                    nombre: "moduloPisoPelvico.dinamicaMenstrual.usoDuranteSangrado", etiqueta: "Durante los días de sangrado usa:", tipo: "checkbox_group", opciones: [
                        { valor: "Copa menstrual", etiqueta: "Copa menstrual" }, { valor: "Tampones", etiqueta: "Tampones" },
                        { valor: "Compresa desechable", etiqueta: "Compresa desechable" }, { valor: "Compresa reutilizable", etiqueta: "Compresa reutilizable" },
                        { valor: "Bragas menstruales", etiqueta: "Bragas menstruales" }, { valor: "Anillo vaginal", etiqueta: "Anillo vaginal" }
                    ]
                },
                { nombre: "moduloPisoPelvico.dolor.siente", etiqueta: "¿Siente dolor?", tipo: "select", opciones: ["Sí", "No"] },
                { nombre: "moduloPisoPelvico.dolor.ubicacion", etiqueta: "Ubicación del Dolor", tipo: "text" },
                { nombre: "moduloPisoPelvico.dolor.perpetuadores", etiqueta: "Factores perpetuadores", tipo: "text" },
                { nombre: "moduloPisoPelvico.dolor.calmantes", etiqueta: "Factores calmantes", tipo: "text" },
                {
                    nombre: "moduloPisoPelvico.anticonceptivo.tipo", etiqueta: "Tipo de anticonceptivo", tipo: "checkbox_group", opciones: [
                        { valor: "Píldora", etiqueta: "Píldora" }, { valor: "DIU", etiqueta: "DIU" },
                        { valor: "Preservativo", etiqueta: "Preservativo" }, { valor: "Parches", etiqueta: "Parches" },
                        { valor: "Diafragma", etiqueta: "Diafragma" }, { valor: "Anillo vaginal", etiqueta: "Anillo vaginal" }
                    ]
                },
                { nombre: "moduloPisoPelvico.anticonceptivo.intentosEmbarazo", etiqueta: "Intentos de Embarazo", tipo: "text" },
                { nombre: "moduloPisoPelvico.anticonceptivo.dificultadesFecundacion", etiqueta: "Dificultades (FIV, Hormonal, Inseminación...)", tipo: "textarea" },
            ]
        },
        {
            titulo: "Dinámica Miccional y Cuestionario ICIQ",
            campos: [
                { nombre: "moduloPisoPelvico.dinamicaMiccional.usaProtector", etiqueta: "Usa de protector/Toalla/Pañal", tipo: "text" },
                { nombre: "moduloPisoPelvico.dinamicaMiccional.ropaInterior", etiqueta: "Tipo de Ropa Interior: Material / Tipo", tipo: "text" },
                { nombre: "moduloPisoPelvico.dinamicaMiccional.numMiccionesDia", etiqueta: "Número de Micciones al día", tipo: "text" },
                { nombre: "moduloPisoPelvico.dinamicaMiccional.numMiccionesNoche", etiqueta: "Numero de Micciones en la noche", tipo: "text" },
                { nombre: "moduloPisoPelvico.dinamicaMiccional.cadaCuantasHoras", etiqueta: "Cada cuantas horas", tipo: "text" },
                { nombre: "moduloPisoPelvico.dinamicaMiccional.deseoMiccional", etiqueta: "Deseo miccional", tipo: "select", opciones: ["Normal", "Irritativo", "Urgente", "Doloroso"] },
                { nombre: "moduloPisoPelvico.dinamicaMiccional.sensacionVaciado", etiqueta: "Sensación de vaciado", tipo: "select", opciones: ["Completo", "Incompleto"] },
                { nombre: "moduloPisoPelvico.dinamicaMiccional.posturaMiccional", etiqueta: "Postura miccional", tipo: "select", opciones: ["Sentado", "Hiperpresivo"] },
                {
                    nombre: "moduloPisoPelvico.dinamicaMiccional.formaMiccion", etiqueta: "Forma de micción", tipo: "checkbox_group", opciones: [
                        { valor: "Constante", etiqueta: "Constante" }, { valor: "Cortada", etiqueta: "Cortada" },
                        { valor: "Lateralizada", etiqueta: "Lateralizada" }, { valor: "Inclinada anterior", etiqueta: "Inclinada anterior" },
                        { valor: "Explosiva", etiqueta: "Explosiva" }, { valor: "Aspersor", etiqueta: "Aspersor" },
                        { valor: "Bifurcada", etiqueta: "Bifurcada" }
                    ]
                },
                { nombre: "moduloPisoPelvico.dinamicaMiccional.empuje.comenzar", etiqueta: "Necesita empujar para comenzar", tipo: "checkbox" },
                { nombre: "moduloPisoPelvico.dinamicaMiccional.empuje.terminar", etiqueta: "Necesita empujar para terminar", tipo: "checkbox" },
                {
                    nombre: "moduloPisoPelvico.dinamicaMiccional.tipoIncontinencia.esfuerzo", etiqueta: "Incontinencia de esfuerzo", tipo: "checkbox_group", opciones: [
                        { valor: "Ríe", etiqueta: "Ríe" }, { valor: "Salta", etiqueta: "Salta" }, { valor: "Corre", etiqueta: "Corre" }
                    ]
                },
                { nombre: "moduloPisoPelvico.dinamicaMiccional.tipoIncontinencia.urgencia", etiqueta: "Incontinencia de Urgencia", tipo: "checkbox" },
                { nombre: "moduloPisoPelvico.dinamicaMiccional.tipoIncontinencia.mixta", etiqueta: "Incontinencia Mixta", tipo: "checkbox" },
                { nombre: "moduloPisoPelvico.dinamicaMiccional.dolorAlOrinar", etiqueta: "Dolor al orinar", tipo: "text" },

                {
                    nombre: "moduloPisoPelvico.icicq_frecuencia", etiqueta: "ICIQ: ¿Con qué frecuencia pierde orina?", tipo: "select", opciones: [
                        { valor: "0", etiqueta: "0 - Nunca" },
                        { valor: "1", etiqueta: "1 - Una vez a la semana" },
                        { valor: "2", etiqueta: "2 - 2-3 veces/semana" },
                        { valor: "3", etiqueta: "3 - Una vez al día" },
                        { valor: "4", etiqueta: "4 - Varias veces al día" },
                        { valor: "5", etiqueta: "5 - Continuamente" }
                    ]
                },
                {
                    nombre: "moduloPisoPelvico.icicq_cantidad", etiqueta: "ICIQ: ¿Qué cantidad cree que se le escapa?", tipo: "select", opciones: [
                        { valor: "0", etiqueta: "0 - Nada" },
                        { valor: "2", etiqueta: "2 - Muy poca" },
                        { valor: "4", etiqueta: "4 - Moderada" },
                        { valor: "6", etiqueta: "6 - Mucha" }
                    ]
                },
                { nombre: "moduloPisoPelvico.icicq_impacto", etiqueta: "ICIQ: ¿Cuánto afecta a su vida diaria? (0-10)", tipo: "text" },
                {
                    nombre: "moduloPisoPelvico.icicq_cuandoPierde", etiqueta: "¿Cuándo pierde orina? (Marque todo lo que aplique)", tipo: "checkbox_group", opciones: [
                        { valor: "Nunca", etiqueta: "Nunca" },
                        { valor: "Antes de llegar al servicio", etiqueta: "Antes de llegar al servicio" },
                        { valor: "Al toser o estornudar", etiqueta: "Al toser o estornudar" },
                        { valor: "Mientras duerme", etiqueta: "Mientras duerme" },
                        { valor: "Al realizar esfuerzos físicos", etiqueta: "Al realizar esfuerzos físicos" },
                        { valor: "Al terminar de orinar", etiqueta: "Al terminar de orinar" },
                        { valor: "Sin motivo evidente", etiqueta: "Sin motivo evidente" },
                        { valor: "De forma continua", etiqueta: "De forma continua" }
                    ]
                }
            ]
        },
        {
            titulo: "Dinámica Defecatoria y Sexual",
            campos: [
                { nombre: "moduloPisoPelvico.dinamicaDefecatoria.frecuencia.dia", etiqueta: "No. defecaciones al día", tipo: "text" },
                { nombre: "moduloPisoPelvico.dinamicaDefecatoria.frecuencia.noche", etiqueta: "No. defecaciones en la noche", tipo: "text" },
                { nombre: "moduloPisoPelvico.dinamicaDefecatoria.frecuencia.semana", etiqueta: "No. defecaciones a la semana", tipo: "text" },
                { nombre: "moduloPisoPelvico.dinamicaDefecatoria.postura", etiqueta: "Postura defecatoria", tipo: "select", opciones: ["Sedestación Vertical", "Inclinado hacia delante", "Cuclillas"] },
                {
                    nombre: "moduloPisoPelvico.dinamicaDefecatoria.forma", etiqueta: "Forma de defecación", tipo: "checkbox_group", opciones: [
                        { valor: "Normal", etiqueta: "Normal" }, { valor: "Hiperpresivo", etiqueta: "Hiperpresivo" },
                        { valor: "Dolorosa", etiqueta: "Dolorosa" }, { valor: "Cortada", etiqueta: "Cortada" },
                        { valor: "Sensación vaciado incompleto", etiqueta: "Sensación vaciado incompleto" }
                    ]
                },
                { nombre: "moduloPisoPelvico.dinamicaDefecatoria.cierrePrecoz", etiqueta: "Cierre de ano antes de completar vaciado", tipo: "select", opciones: ["Sí", "No"] },
                { nombre: "moduloPisoPelvico.dinamicaDefecatoria.dolor", etiqueta: "Dolor Defecatorio (Tipo – localización)", tipo: "textarea" },
                { nombre: "moduloPisoPelvico.dinamicaDefecatoria.bristol", etiqueta: "Escala de Bristol (Tipo 1 al 7)", tipo: "select", opciones: ["1", "2", "3", "4", "5", "6", "7"] },
                { nombre: "moduloPisoPelvico.dinamicaDefecatoria.gases", etiqueta: "Gases: control – continencia – exceso", tipo: "select", opciones: ["Ausentes", "Pocos", "Esporádicos", "Frecuentes", "Diarios", "Constantes"] },

                { nombre: "moduloPisoPelvico.dinamicaSexual.lubricacion", etiqueta: "Lubricación Sexual", tipo: "select", opciones: ["Liquida blanquecina", "Densa Granulada", "Mal olor", "Ausente"] },
                { nombre: "moduloPisoPelvico.dinamicaSexual.orgasmos", etiqueta: "Orgasmos", tipo: "select", opciones: ["Ausente", "Único", "Múltiple", "Corto", "Doloroso"] },
                { nombre: "moduloPisoPelvico.dinamicaSexual.disfuncion", etiqueta: "Disfunción Orgásmica", tipo: "select", opciones: ["No siente", "Dolor que inhibe", "No logra Clímax", "No excitación", "Frigidez"] },
                { nombre: "moduloPisoPelvico.dinamicaSexual.iuPenetracion", etiqueta: "IU Durante la penetración", tipo: "checkbox" },
                { nombre: "moduloPisoPelvico.dinamicaSexual.resolucionOrgasmo", etiqueta: "Resolución del Orgasmo / Squirting / Eyaculación", tipo: "text" },
                { nombre: "moduloPisoPelvico.dinamicaSexual.tipoRelacion", etiqueta: "Tipo de Relación (Pareja, Libido, etc.)", tipo: "textarea" },
                { nombre: "moduloPisoPelvico.dinamicaSexual.masturbacion", etiqueta: "Masturbación (Frecuencia, técnica)", tipo: "text" },
                { nombre: "moduloPisoPelvico.dinamicaSexual.historiaSexual", etiqueta: "Historia Sexual: Infancia – Parejas anteriores", tipo: "textarea" },
                {
                    nombre: "moduloPisoPelvico.dinamicaSexual.conflictos", etiqueta: "Conflictos / Miedos / Tabús", tipo: "checkbox_group", opciones: [
                        { valor: "Conflicto Familiar", etiqueta: "Conflicto Familiar" }, { valor: "Conflicto Pareja", etiqueta: "Conflicto Pareja" },
                        { valor: "Abuso", etiqueta: "Abuso" }, { valor: "Maltrato", etiqueta: "Maltrato" },
                        { valor: "Miedo", etiqueta: "Miedo" }, { valor: "Tabú cultural", etiqueta: "Tabú cultural" },
                        { valor: "Tabú Religioso", etiqueta: "Tabú Religioso" }, { valor: "Miedo autoconocimiento", etiqueta: "Miedo autoconocimiento" }
                    ]
                },
                {
                    nombre: "moduloPisoPelvico.dinamicaSexual.relacionesDolor", etiqueta: "Dolor en Relaciones", tipo: "checkbox_group", opciones: [
                        { valor: "Dispareunia", etiqueta: "Dispareunia" }, { valor: "Alodinia", etiqueta: "Alodinia" },
                        { valor: "Hiperalgesia", etiqueta: "Hiperalgesia" }, { valor: "Ardor", etiqueta: "Ardor" },
                        { valor: "Picazón", etiqueta: "Picazón" }
                    ]
                },
                { nombre: "moduloPisoPelvico.dinamicaSexual.dolorLocalizacion.introito", etiqueta: "Dolor Introito (Penetración)", tipo: "text" },
                { nombre: "moduloPisoPelvico.dinamicaSexual.dolorLocalizacion.fondo", etiqueta: "Dolor Fondo (Profunda, Abdominal...)", tipo: "text" },
                { nombre: "moduloPisoPelvico.dinamicaSexual.dolorLocalizacion.irradiado", etiqueta: "Dolor Irradiado (Vejiga, Vulva...)", tipo: "text" },
                { nombre: "moduloPisoPelvico.dinamicaSexual.dolorLocalizacion.perineal", etiqueta: "Dolor Perineal", tipo: "text" },
            ]
        },
        {
            titulo: "Evaluación Fisioterapéutica (Examen Físico)",
            campos: [
                { nombre: "moduloPisoPelvico.evaluacionFisica.marcha", etiqueta: "Evaluación de la Marcha", tipo: "textarea" },
                { nombre: "moduloPisoPelvico.evaluacionFisica.postura", etiqueta: "Postura (L3-OMBLIGO)", tipo: "textarea" },
                { nombre: "moduloPisoPelvico.evaluacionFisica.diafragmaOrofaringeo", etiqueta: "Diafragma Orofaringeo: ATM, MORDIDA, MASTICACION, etc.", tipo: "textarea" },
                { nombre: "moduloPisoPelvico.evaluacionFisica.diafragmaToracico", etiqueta: "Diafragma Torácico (Observaciones)", tipo: "textarea" },
                { nombre: "moduloPisoPelvico.evaluacionFisica.testingCentroFrenico", etiqueta: "Testing Centro Frénico (Pilares, Arco Costal)", tipo: "text" },
                { nombre: "moduloPisoPelvico.evaluacionFisica.diafragmaPelvico", etiqueta: "Diafragma Pélvico (Tipo de Pelvis)", tipo: "select", opciones: ["GINECOIDE", "PLATIPELOIDE", "ANDROIDE", "ANTROPOIDE"] },
                { nombre: "moduloPisoPelvico.evaluacionFisica.abdomenTos", etiqueta: "Abdomen (TEST DE TOS)", tipo: "text" },
                { nombre: "moduloPisoPelvico.evaluacionFisica.diastasis.supra", etiqueta: "Diastasis Supraumbilical (cm)", tipo: "text" },
                { nombre: "moduloPisoPelvico.evaluacionFisica.diastasis.umbi", etiqueta: "Diastasis Umbilical (cm)", tipo: "text" },
                { nombre: "moduloPisoPelvico.evaluacionFisica.diastasis.infra", etiqueta: "Diastasis Infraumbilical (cm)", tipo: "text" },
                { nombre: "moduloPisoPelvico.evaluacionFisica.movilidad", etiqueta: "Movilidad Lumbo-Pélvica", tipo: "textarea" },
                { nombre: "moduloPisoPelvico.evaluacionFisica.psoasAductorPiramidal", etiqueta: "Psoas – aductor- piramidal- etc.", tipo: "textarea" },
                { nombre: "moduloPisoPelvico.evaluacionFisica.testDinamicos", etiqueta: "Test Dinámicos (SI - Sínfisis, Piedallu, etc.)", tipo: "textarea" },
                { nombre: "moduloPisoPelvico.evaluacionFisica.palpacion", etiqueta: "Palpación (Sacroilíaca, coxofemoral...)", tipo: "textarea" },
                { nombre: "moduloPisoPelvico.evaluacionFisica.pielCicatriz", etiqueta: "Piel (Cicatriz, estrías)", tipo: "textarea" },
            ]
        },
        {
            titulo: "Valoración Perineal y Endopélvica",
            campos: [
                { nombre: "moduloPisoPelvico.evaluacionPerinealExterna.clitoris", etiqueta: "Evaluación Clítoris, Vulva, Mucosa", tipo: "textarea" },
                { nombre: "moduloPisoPelvico.evaluacionPerinealExterna.ph", etiqueta: "pH (Epitelio Vaginal)", tipo: "text" },
                { nombre: "moduloPisoPelvico.evaluacionPerinealExterna.sensibilidad", etiqueta: "Sensibilidad (Lados, Ilioinginal...)", tipo: "text" },
                { nombre: "moduloPisoPelvico.evaluacionPerinealExterna.cicatrices", etiqueta: "Cicatrices: Episiotomía- Desgarro", tipo: "text" },
                { nombre: "moduloPisoPelvico.evaluacionPerinealExterna.distancias", etiqueta: "Distancia Ano-Vulvar / Diámetro Bituberoso", tipo: "text" },
                {
                    nombre: "moduloPisoPelvico.evaluacionPerinealExterna.reflejos", etiqueta: "Reflejos", tipo: "checkbox_group", opciones: [
                        { valor: "clitorideo", etiqueta: "Reflejo Clitorideo" }, { valor: "bulvocavernoso", etiqueta: "Reflejo Bulvocavernoso" },
                        { valor: "anal", etiqueta: "Reflejo Anal" }, { valor: "rolling", etiqueta: "Rolling Test" },
                        { valor: "valsalva", etiqueta: "Maniobra de Valsalva" }, { valor: "Sensibilidad cutánea", etiqueta: "Sensibilidad cutánea" }
                    ]
                },
                { nombre: "moduloPisoPelvico.evaluacionInterna.cupulas", etiqueta: "Palpación Interna (Cúpulas, Tono)", tipo: "textarea" },
                { nombre: "moduloPisoPelvico.evaluacionInterna.fuerzaOxford.global", etiqueta: "Oxford Global (0-5)", tipo: "select", opciones: ["0", "1", "2", "3", "4", "5"] },
                { nombre: "moduloPisoPelvico.evaluacionInterna.fuerzaOxford.derecha", etiqueta: "Oxford Derecha", tipo: "select", opciones: ["0", "1", "2", "3", "4", "5"] },
                { nombre: "moduloPisoPelvico.evaluacionInterna.fuerzaOxford.izquierda", etiqueta: "Oxford Izquierda", tipo: "select", opciones: ["0", "1", "2", "3", "4", "5"] },
                { nombre: "moduloPisoPelvico.evaluacionInterna.perfect.power", etiqueta: "PERFECT Power (0-5)", tipo: "text" },
                { nombre: "moduloPisoPelvico.evaluacionInterna.perfect.endurance", etiqueta: "PERFECT Endurance (Fuerza resistencia, s)", tipo: "text" },
                { nombre: "moduloPisoPelvico.evaluacionInterna.perfect.repetitions", etiqueta: "PERFECT Repetitions", tipo: "text" },
                { nombre: "moduloPisoPelvico.evaluacionInterna.perfect.fast", etiqueta: "PERFECT Fast (Rápidas)", tipo: "text" },

                {
                    nombre: "moduloPisoPelvico.prolapso.vesicocele", etiqueta: "Vesicocele (Grado)", tipo: "select", opciones: ["Grado 0", "Grado I", "Grado II", "Grado III", "Grado IV"]
                },
                {
                    nombre: "moduloPisoPelvico.prolapso.rectocele", etiqueta: "Rectocele (Grado)", tipo: "select", opciones: ["Grado 0", "Grado I", "Grado II", "Grado III", "Grado IV"]
                },
                { nombre: "moduloPisoPelvico.trpEndopelvicos", etiqueta: "TRP Endopélvicos (Ligamentos: Redondo, Ancho, Cardinal, etc.)", tipo: "textarea" },
            ]
        },
        {
            titulo: "Diagnóstico y Plan",
            campos: [
                { nombre: "diagnosticoFisioterapeutico", etiqueta: "DIAGNÓSTICO FISIOTERAPÉUTICO", tipo: "textarea", requerido: true },
                { nombre: "planTratamiento", etiqueta: "PLAN DE INTERVENCIÓN", tipo: "textarea", requerido: true },
            ]
        },
        {
            titulo: "Firmas y Autorizaciones",
            campos: [
                { nombre: "moduloPediatria.autorizacionImagen", etiqueta: "Autorizo el uso de imagen corporativa para fines educativos y redes sociales", tipo: "checkbox" },
                { nombre: "firmas.pacienteOAcudiente.nombre", etiqueta: "Firma de Paciente - Nombre", tipo: "text", requerido: true },
                { nombre: "firmas.pacienteOAcudiente.cedula", etiqueta: "Cédula de Ciudadanía", tipo: "text", requerido: true },
                { nombre: "firmas.pacienteOAcudiente.firmaUrl", etiqueta: "Firma Digital Paciente", tipo: "firma", requerido: true },
            ]
        }
    ]
};
