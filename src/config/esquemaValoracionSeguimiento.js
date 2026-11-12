export const ESQUEMAS_SEGUIMIENTO = {
  PEDIATRIA: {
    titulo: "Valoración de Seguimiento y Progreso - Fisioterapia Pediátrica",
    endpoint: "/valoraciones",
    redireccion: "/valoraciones",
    secciones: [
      {
        titulo: "Información de Consulta de Control (RIPS)",
        siempreVisible: true,
        campos: [
          {
            nombre: "codConsulta",
            etiqueta: "Código Consulta (CUPS)",
            tipo: "cups",
            requerido: true,
            placeholder: "Buscar procedimiento...",
            valorPorDefecto: "890311 - CONSULTA DE CONTROL O DE SEGUIMIENTO POR FISIOTERAPIA",
          },
          {
            nombre: "fechaInicioAtencion",
            etiqueta: "Fecha y Hora Atención",
            tipo: "datetime-local",
            requerido: true,
            autoNow: true,
          },
          {
            nombre: "finalidadTecnologiaSalud",
            etiqueta: "Finalidad",
            tipo: "select",
            opciones: [
              { valor: "44", etiqueta: "44 - Rehabilitación funcional" },
              { valor: "10", etiqueta: "10 - Promoción de la salud / Estimulación temprana" },
              { valor: "12", etiqueta: "12 - Prevención / Educación terapéutica" },
            ],
            requerido: true,
            valorPorDefecto: "44",
          },
          {
            nombre: "causaMotivoAtencion",
            etiqueta: "Causa Externa",
            tipo: "select",
            opciones: [
              { valor: "29", etiqueta: "29 - Consulta de seguimiento (control)" },
              { valor: "21", etiqueta: "21 - Enfermedad general (desarrollo neuromotor)" },
              { valor: "24", etiqueta: "24 - Enfermedad congénita o perinatal" },
              { valor: "30", etiqueta: "30 - Prematurez / bajo peso al nacer" },
            ],
            requerido: true,
            valorPorDefecto: "29",
          },
          {
            nombre: "codDiagnosticoPrincipal",
            etiqueta: "Diagnóstico CIE-10",
            tipo: "cie10",
            requerido: true,
            placeholder: "Buscar diagnóstico...",
          },
        ],
      },
      {
        titulo: "Evolución y Progreso Actual",
        campos: [
          {
            nombre: "motivoConsulta",
            etiqueta: "Motivo del Control / Evolución Subjetiva",
            tipo: "textarea",
            requerido: true,
            placeholder: "Describa el motivo del control, cómo ha respondido el niño a las sesiones o pautas previas...",
            presets: [
              {
                etiqueta: "Control Estimulación",
                texto: "Acude a valoración de control y seguimiento para reevaluación del desarrollo neuromotor, seguimiento a los objetivos del programa de estimulación y ajuste de plan terapéutico según evolución en casa y sesiones previas.",
              },
              {
                etiqueta: "Control Fisioterapia",
                texto: "Control y seguimiento por fisioterapia pediátrica para evaluar respuesta al tratamiento, ganancias funcionales, tono, patrones de movimiento y progresión de hitos motores.",
              },
            ],
          },
          {
            nombre: "moduloPediatria.avancesObservados",
            etiqueta: "Avances Observados por Padres / Cuidador",
            tipo: "textarea",
            placeholder: "Nuevas habilidades adquiridas, cambios en comportamiento, respuesta en casa...",
          },
          {
            nombre: "moduloPediatria.adherenciaCasa",
            etiqueta: "Adherencia a Recomendaciones y Ejercicios en Casa",
            tipo: "select",
            opciones: [
              "Excelente (Diaria y constante)",
              "Buena (Frecuente con apoyo)",
              "Regular (Ocasional)",
              "Baja (No se realizaron actividades)",
            ],
          },
        ],
      },
      {
        titulo: "Reevaluación de Signos Vitales y Medidas",
        campos: [
          { nombre: "moduloPediatria.examen.fc", etiqueta: "Frecuencia Cardíaca (ppm)", tipo: "text" },
          { nombre: "moduloPediatria.examen.fr", etiqueta: "Frecuencia Respiratoria (rpm)", tipo: "text" },
          { nombre: "moduloPediatria.examen.temperatura", etiqueta: "Temperatura (°C)", tipo: "text" },
          { nombre: "signosVitales.pesoActual", etiqueta: "Peso Actual (kg)", tipo: "text" },
          { nombre: "signosVitales.talla", etiqueta: "Talla Actual (cm)", tipo: "text" },
        ],
      },
      {
        titulo: "Reevaluación de Hitos Motores y Tono",
        campos: [
          {
            nombre: "moduloPediatria.hitos.controlCefalico.si",
            etiqueta: "Control Cefálico",
            tipo: "select",
            opciones: ["Sí", "En proceso", "No"],
          },
          {
            nombre: "moduloPediatria.hitos.rolados.si",
            etiqueta: "Rolados / Giros",
            tipo: "select",
            opciones: ["Sí", "En proceso", "No"],
          },
          {
            nombre: "moduloPediatria.hitos.sedente.si",
            etiqueta: "Sedestación / Se Sienta",
            tipo: "select",
            opciones: ["Sí", "En proceso", "No"],
          },
          {
            nombre: "moduloPediatria.hitos.gateo.si",
            etiqueta: "Gateo / Desplazamiento",
            tipo: "select",
            opciones: ["Sí", "En proceso", "No"],
          },
          {
            nombre: "moduloPediatria.hitos.bipedo.si",
            etiqueta: "Bipedestación / De Pie",
            tipo: "select",
            opciones: ["Sí", "En proceso", "No"],
          },
          {
            nombre: "moduloPediatria.hitos.marcha.si",
            etiqueta: "Marcha / Camina",
            tipo: "select",
            opciones: ["Sí", "En proceso", "No"],
          },
          {
            nombre: "moduloPediatria.examen.tonoMuscular",
            etiqueta: "Tono Muscular Actual y Control Postural",
            tipo: "textarea",
            placeholder: "Normotono, hipotonía, hipertonía, simetría postural, reacciones de enderezamiento...",
          },
          {
            nombre: "moduloPediatria.examen.controlMotor",
            etiqueta: "Calidad del Movimiento y Transiciones",
            tipo: "textarea",
          },
        ],
      },
      {
        titulo: "Preguntas y Tablas Adicionales de Progreso",
        campos: [
          {
            nombre: "moduloPediatria.bloquesSeguimiento",
            etiqueta: "Información Complementaria de Progreso",
            tipo: "bloques_dinamicos",
            descripcion: "Agregue preguntas libres o tablas de control personalizadas para registrar cualquier escala, medición o progreso específico.",
          },
        ],
      },
      {
        titulo: "Diagnóstico de Seguimiento y Ajustes al Plan",
        campos: [
          {
            nombre: "diagnosticoFisioterapeutico",
            etiqueta: "Concepto / Diagnóstico Fisioterapéutico de Seguimiento",
            tipo: "textarea",
            requerido: true,
            presets: [
              {
                etiqueta: "Evolución Favorable",
                texto: "Paciente pediátrico con evolución neuromotora favorable, evidencia ganancia en habilidades funcionales acorde a objetivos terapéuticos. Se continúa plan de estímulo y consolidación.",
              },
              {
                etiqueta: "Ajuste de Objetivos",
                texto: "Paciente con evolución parcial; se requiere reorientar metas terapéuticas hacia mayor control postural, inhibición de compensaciones y fortalecimiento funcional.",
              },
            ],
          },
          {
            nombre: "planTratamiento",
            etiqueta: "Ajustes al Plan de Tratamiento y Recomendaciones",
            tipo: "textarea",
            requerido: true,
            placeholder: "Continuación de sesiones, nuevos ejercicios para casa, derivación a interconsulta si aplica...",
          },
        ],
      },
    ],
  },

  PISO_PELVICO: {
    titulo: "Valoración de Seguimiento y Progreso - Piso Pélvico",
    endpoint: "/valoraciones",
    redireccion: "/valoraciones",
    secciones: [
      {
        titulo: "Información de Consulta de Control (RIPS)",
        siempreVisible: true,
        campos: [
          {
            nombre: "codConsulta",
            etiqueta: "Código Consulta (CUPS)",
            tipo: "cups",
            requerido: true,
            placeholder: "Buscar procedimiento...",
            valorPorDefecto: "890311 - CONSULTA DE CONTROL O DE SEGUIMIENTO POR FISIOTERAPIA",
          },
          {
            nombre: "fechaInicioAtencion",
            etiqueta: "Fecha y Hora Atención",
            tipo: "datetime-local",
            requerido: true,
            autoNow: true,
          },
          {
            nombre: "finalidadTecnologiaSalud",
            etiqueta: "Finalidad",
            tipo: "select",
            opciones: [
              { valor: "44", etiqueta: "44 - Rehabilitación funcional" },
              { valor: "10", etiqueta: "10 - Promoción de la salud" },
            ],
            requerido: true,
            valorPorDefecto: "44",
          },
          {
            nombre: "causaMotivoAtencion",
            etiqueta: "Causa Externa",
            tipo: "select",
            opciones: [
              { valor: "29", etiqueta: "29 - Consulta de seguimiento (control)" },
              { valor: "21", etiqueta: "21 - Enfermedad general" },
            ],
            requerido: true,
            valorPorDefecto: "29",
          },
          {
            nombre: "codDiagnosticoPrincipal",
            etiqueta: "Diagnóstico CIE-10",
            tipo: "cie10",
            requerido: true,
            placeholder: "Buscar diagnóstico...",
          },
        ],
      },
      {
        titulo: "Evolución de Síntomas",
        campos: [
          {
            nombre: "motivoConsulta",
            etiqueta: "Evolución Subjetiva / Motivo del Control",
            tipo: "textarea",
            requerido: true,
            placeholder: "Cambios en síntomas desde la última sesión (incontinencia, pesadez, dolor, actividad física)...",
          },
          {
            nombre: "moduloPisoPelvico.evolucionSintomasUrinarios",
            etiqueta: "Evolución Síntomas Urinarios (Escapes, urgencia, frecuencia)",
            tipo: "textarea",
          },
          {
            nombre: "moduloPisoPelvico.evolucionSintomasDefecatorios",
            etiqueta: "Evolución Síntomas Defecatorios / Bristol",
            tipo: "textarea",
          },
          {
            nombre: "moduloPisoPelvico.evolucionDolor",
            etiqueta: "Evolución de Dolor (EVA / Localización)",
            tipo: "text",
            placeholder: "Ej: EVA disminuyó de 7/10 a 2/10 en cicatriz...",
          },
        ],
      },
      {
        titulo: "Reevaluación Funcional y Examen Físico",
        campos: [
          {
            nombre: "moduloPisoPelvico.evaluacionInterna.fuerzaOxford.global",
            etiqueta: "Oxford Global Actual (0-5)",
            tipo: "select",
            opciones: ["0", "1", "2", "3", "4", "5"],
          },
          {
            nombre: "moduloPisoPelvico.evaluacionInterna.perfect.endurance",
            etiqueta: "PERFECT Endurance Actual (segundos)",
            tipo: "text",
          },
          {
            nombre: "moduloPisoPelvico.evaluacionInterna.perfect.repetitions",
            etiqueta: "PERFECT Repetitions Actuales",
            tipo: "text",
          },
          {
            nombre: "moduloPisoPelvico.evaluacionFisica.diastasis.umbi",
            etiqueta: "Diástasis Umbilical Actual (cm / dedos)",
            tipo: "text",
          },
          {
            nombre: "moduloPisoPelvico.evaluacionFisica.abdomenTos",
            etiqueta: "Competencia Abdominal (Test de tos / esfuerzo)",
            tipo: "text",
          },
        ],
      },
      {
        titulo: "Preguntas y Tablas Adicionales de Progreso",
        campos: [
          {
            nombre: "moduloPisoPelvico.bloquesSeguimiento",
            etiqueta: "Información Complementaria de Progreso",
            tipo: "bloques_dinamicos",
            descripcion: "Agregue preguntas o tablas adicionales (ej. registro semanal de escapes, evolución de diástasis, etc.).",
          },
        ],
      },
      {
        titulo: "Diagnóstico y Ajustes al Plan",
        campos: [
          {
            nombre: "diagnosticoFisioterapeutico",
            etiqueta: "Concepto / Diagnóstico Fisioterapéutico de Seguimiento",
            tipo: "textarea",
            requerido: true,
          },
          {
            nombre: "planTratamiento",
            etiqueta: "Plan de Intervención / Progresión de Ejercicios",
            tipo: "textarea",
            requerido: true,
          },
        ],
      },
    ],
  },

  LACTANCIA: {
    titulo: "Valoración de Seguimiento y Progreso - Asesoría de Lactancia",
    endpoint: "/valoraciones",
    redireccion: "/valoraciones",
    secciones: [
      {
        titulo: "Información de Consulta de Control (RIPS)",
        siempreVisible: true,
        campos: [
          {
            nombre: "codConsulta",
            etiqueta: "Código Consulta (CUPS)",
            tipo: "cups",
            requerido: true,
            placeholder: "Buscar procedimiento...",
            valorPorDefecto: "890311 - CONSULTA DE CONTROL O DE SEGUIMIENTO POR FISIOTERAPIA",
          },
          {
            nombre: "fechaInicioAtencion",
            etiqueta: "Fecha y Hora Atención",
            tipo: "datetime-local",
            requerido: true,
            autoNow: true,
          },
          {
            nombre: "finalidadTecnologiaSalud",
            etiqueta: "Finalidad",
            tipo: "select",
            opciones: [
              { valor: "10", etiqueta: "10 - Promoción de la salud" },
              { valor: "44", etiqueta: "44 - Rehabilitación" },
            ],
            requerido: true,
            valorPorDefecto: "10",
          },
          {
            nombre: "causaMotivoAtencion",
            etiqueta: "Causa Externa",
            tipo: "select",
            opciones: [
              { valor: "29", etiqueta: "29 - Consulta de seguimiento (control)" },
              { valor: "21", etiqueta: "21 - Enfermedad general" },
            ],
            requerido: true,
            valorPorDefecto: "29",
          },
          {
            nombre: "codDiagnosticoPrincipal",
            etiqueta: "Diagnóstico CIE-10",
            tipo: "cie10",
            requerido: true,
            placeholder: "Buscar diagnóstico...",
          },
        ],
      },
      {
        titulo: "Evolución de la Lactancia",
        campos: [
          {
            nombre: "motivoConsulta",
            etiqueta: "Evolución y Motivo del Control",
            tipo: "textarea",
            requerido: true,
            placeholder: "Evolución del agarre, dolor, tomas, suplementación...",
          },
          {
            nombre: "moduloLactancia.pesoActualBebe",
            etiqueta: "Peso Actual del Bebé (g / kg)",
            tipo: "text",
          },
          {
            nombre: "moduloLactancia.gananciaPesoDiaria",
            etiqueta: "Ganancia Ponderal Estimada (g/día)",
            tipo: "text",
          },
          {
            nombre: "moduloLactancia.estadoPezonesMamas",
            etiqueta: "Estado Actual de Pezones y Mamas (Grietas, congestión, dolor)",
            tipo: "textarea",
          },
          {
            nombre: "moduloLactancia.tipoAlimentacionActual",
            etiqueta: "Tipo de Alimentación Actual",
            tipo: "select",
            opciones: [
              "Lactancia Materna Exclusiva (LME)",
              "Lactancia Mixta / Suplementada",
              "Lactancia con Leche Materna Extraída",
              "Fórmula Infantil",
            ],
          },
        ],
      },
      {
        titulo: "Preguntas y Tablas Adicionales de Progreso",
        campos: [
          {
            nombre: "moduloLactancia.bloquesSeguimiento",
            etiqueta: "Información Complementaria de Progreso",
            tipo: "bloques_dinamicos",
            descripcion: "Agregue preguntas o tablas de control (ej. registro de tomas, control de peso por fecha, etc.).",
          },
        ],
      },
      {
        titulo: "Concepto y Plan",
        campos: [
          {
            nombre: "diagnosticoFisioterapeutico",
            etiqueta: "Diagnóstico / Impresión Clínica de Seguimiento",
            tipo: "textarea",
            requerido: true,
          },
          {
            nombre: "planTratamiento",
            etiqueta: "Plan y Recomendaciones de Lactancia",
            tipo: "textarea",
            requerido: true,
          },
        ],
      },
    ],
  },

  PERINATAL: {
    titulo: "Valoración de Seguimiento y Progreso - Programa Perinatal",
    endpoint: "/valoraciones",
    redireccion: "/valoraciones",
    secciones: [
      {
        titulo: "Información de Consulta de Control (RIPS)",
        siempreVisible: true,
        campos: [
          {
            nombre: "codConsulta",
            etiqueta: "Código Consulta (CUPS)",
            tipo: "cups",
            requerido: true,
            placeholder: "Buscar procedimiento...",
            valorPorDefecto: "890311 - CONSULTA DE CONTROL O DE SEGUIMIENTO POR FISIOTERAPIA",
          },
          {
            nombre: "fechaInicioAtencion",
            etiqueta: "Fecha y Hora Atención",
            tipo: "datetime-local",
            requerido: true,
            autoNow: true,
          },
          {
            nombre: "finalidadTecnologiaSalud",
            etiqueta: "Finalidad",
            tipo: "select",
            opciones: [
              { valor: "10", etiqueta: "10 - Promoción de la Salud / Preventivo" },
              { valor: "44", etiqueta: "44 - Rehabilitación" },
            ],
            requerido: true,
            valorPorDefecto: "10",
          },
          {
            nombre: "causaMotivoAtencion",
            etiqueta: "Causa Externa",
            tipo: "select",
            opciones: [
              { valor: "29", etiqueta: "29 - Consulta de seguimiento (control)" },
              { valor: "22", etiqueta: "22 - Manejo del embarazo normal" },
              { valor: "21", etiqueta: "21 - Enfermedad general" },
            ],
            requerido: true,
            valorPorDefecto: "29",
          },
          {
            nombre: "codDiagnosticoPrincipal",
            etiqueta: "Diagnóstico CIE-10",
            tipo: "cie10",
            requerido: true,
            placeholder: "Ej. Z349 - Supervisión de embarazo normal",
          },
        ],
      },
      {
        titulo: "Evolución Gestacional y Síntomas",
        campos: [
          {
            nombre: "motivoConsulta",
            etiqueta: "Evolución y Motivo del Control",
            tipo: "textarea",
            requerido: true,
            placeholder: "Evolución del bienestar materno, tolerancia al ejercicio, síntomas...",
          },
          {
            nombre: "moduloPerinatal.semanasGestacionActual",
            etiqueta: "Semanas de Gestación Actuales",
            tipo: "number",
          },
          {
            nombre: "moduloPerinatal.evolucionSintomas",
            etiqueta: "Síntomas Musculoesqueléticos / Dolor Pélvico / Lumbar",
            tipo: "textarea",
          },
        ],
      },
      {
        titulo: "Signos Vitales y Estado Físico",
        campos: [
          { nombre: "signosVitales.ta", etiqueta: "Tensión Arterial (mmHg)", tipo: "text" },
          { nombre: "signosVitales.fc", etiqueta: "Frecuencia Cardíaca (lpm)", tipo: "text" },
          { nombre: "signosVitales.fr", etiqueta: "Frecuencia Respiratoria (rpm)", tipo: "text" },
          { nombre: "signosVitales.pesoActual", etiqueta: "Peso Actual (kg)", tipo: "text" },
        ],
      },
      {
        titulo: "Preguntas y Tablas Adicionales de Progreso",
        campos: [
          {
            nombre: "moduloPerinatal.bloquesSeguimiento",
            etiqueta: "Información Complementaria de Progreso",
            tipo: "bloques_dinamicos",
            descripcion: "Agregue preguntas libres o tablas de progreso personalizadas.",
          },
        ],
      },
      {
        titulo: "Concepto y Ajustes al Plan",
        campos: [
          {
            nombre: "diagnosticoFisioterapeutico",
            etiqueta: "Diagnóstico / Impresión Clínica de Seguimiento",
            tipo: "textarea",
            requerido: true,
          },
          {
            nombre: "planTratamiento",
            etiqueta: "Ajuste al Plan y Recomendaciones",
            tipo: "textarea",
            requerido: true,
          },
        ],
      },
    ],
  },
};

