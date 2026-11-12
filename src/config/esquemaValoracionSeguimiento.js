export const ESQUEMAS_SEGUIMIENTO = {
  PEDIATRIA: {
    titulo: "Seguimiento - Fisioterapia Pediátrica",
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
        titulo: "Evolución y Plan de Seguimiento",
        siempreVisible: true,
        campos: [
          {
            nombre: "motivoConsulta",
            etiqueta: "Evolución de la Sesión / Progreso",
            tipo: "textarea",
            requerido: true,
            placeholder: "Describa brevemente la evolución del paciente, avances y respuesta al tratamiento...",
            presets: [
              {
                etiqueta: "Control Estimulación",
                texto: "Acude a control y seguimiento para reevaluación del desarrollo neuromotor y ajuste del plan terapéutico según evolución.",
              },
              {
                etiqueta: "Control Fisioterapia",
                texto: "Control por fisioterapia pediátrica. Se evalúa respuesta al tratamiento, ganancias funcionales y progresión de hitos.",
              },
            ],
          },
          {
            nombre: "planTratamiento",
            etiqueta: "Concepto y Plan a Seguir",
            tipo: "textarea",
            placeholder: "Indicaciones, pautas en casa o continuidad de sesiones...",
          },
        ],
      },
      {
        titulo: "Preguntas y Tablas de Seguimiento",
        siempreVisible: true,
        campos: [
          {
            nombre: "moduloPediatria.bloquesSeguimiento",
            etiqueta: "Controles y Preguntas Personalizadas",
            tipo: "bloques_dinamicos",
          },
        ],
      },
    ],
  },

  PISO_PELVICO: {
    titulo: "Seguimiento - Piso Pélvico",
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
              { valor: "11", etiqueta: "11 - Atención del parto / puerperio" },
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
              { valor: "21", etiqueta: "21 - Enfermedad general (disfunción pélvica)" },
            ],
            requerido: true,
            valorPorDefecto: "29",
          },
          {
            nombre: "codDiagnosticoPrincipal",
            etiqueta: "Diagnóstico CIE-10",
            tipo: "cie10",
            requerido: true,
          },
        ],
      },
      {
        titulo: "Evolución y Plan de Seguimiento",
        siempreVisible: true,
        campos: [
          {
            nombre: "motivoConsulta",
            etiqueta: "Evolución de la Sesión / Síntomas",
            tipo: "textarea",
            requerido: true,
            placeholder: "Evolución de síntomas, control urinario/dolor y respuesta a los ejercicios...",
            presets: [
              {
                etiqueta: "Control Piso Pélvico",
                texto: "Sesión de control y seguimiento de piso pélvico. Se evalúa evolución clínica de síntomas, adherencia a ejercicios y técnica perineal.",
              },
            ],
          },
          {
            nombre: "planTratamiento",
            etiqueta: "Concepto y Plan a Seguir",
            tipo: "textarea",
            placeholder: "Ajustes de rutina en casa, progresión de cargas o próximas sesiones...",
          },
        ],
      },
      {
        titulo: "Preguntas y Tablas de Seguimiento",
        siempreVisible: true,
        campos: [
          {
            nombre: "moduloPisoPelvico.bloquesSeguimiento",
            etiqueta: "Controles y Preguntas Personalizadas",
            tipo: "bloques_dinamicos",
          },
        ],
      },
    ],
  },

  LACTANCIA: {
    titulo: "Seguimiento - Asesoría de Lactancia",
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
            valorPorDefecto: "890301 - CONSULTA DE CONTROL O DE SEGUIMIENTO POR MEDICINA GENERAL",
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
              { valor: "10", etiqueta: "10 - Promoción de la salud / Lactancia materna" },
              { valor: "12", etiqueta: "12 - Prevención / Educación materna" },
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
          },
        ],
      },
      {
        titulo: "Evolución y Plan de Seguimiento",
        siempreVisible: true,
        campos: [
          {
            nombre: "motivoConsulta",
            etiqueta: "Evolución de la Lactancia / Control",
            tipo: "textarea",
            requerido: true,
            placeholder: "Evolución del agarre, comodidad materna, producción y progreso del bebé...",
            presets: [
              {
                etiqueta: "Control Lactancia",
                texto: "Acude a control de asesoría en lactancia materna para seguimiento de técnica de agarre, comodidad durante la toma y evolución general.",
              },
            ],
          },
          {
            nombre: "planTratamiento",
            etiqueta: "Concepto y Recomendaciones",
            tipo: "textarea",
            placeholder: "Indicaciones de postura, extracción o próximo control...",
          },
        ],
      },
      {
        titulo: "Preguntas y Tablas de Seguimiento",
        siempreVisible: true,
        campos: [
          {
            nombre: "moduloLactancia.bloquesSeguimiento",
            etiqueta: "Controles y Preguntas Personalizadas",
            tipo: "bloques_dinamicos",
          },
        ],
      },
    ],
  },

  PERINATAL: {
    titulo: "Seguimiento - Programa Perinatal",
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
              { valor: "11", etiqueta: "11 - Atención del parto / puerperio / prenatal" },
              { valor: "10", etiqueta: "10 - Promoción de la salud" },
              { valor: "44", etiqueta: "44 - Rehabilitación funcional" },
            ],
            requerido: true,
            valorPorDefecto: "11",
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
          },
        ],
      },
      {
        titulo: "Evolución y Plan de Seguimiento",
        siempreVisible: true,
        campos: [
          {
            nombre: "motivoConsulta",
            etiqueta: "Evolución Gestacional / Postparto",
            tipo: "textarea",
            requerido: true,
            placeholder: "Cómo se ha sentido la gestante/mamá, molestias o avances...",
            presets: [
              {
                etiqueta: "Control Perinatal",
                texto: "Control de seguimiento perinatal para evaluar evolución física, comodidad gestacional y respuesta al plan de acondicionamiento.",
              },
            ],
          },
          {
            nombre: "planTratamiento",
            etiqueta: "Concepto y Plan a Seguir",
            tipo: "textarea",
            placeholder: "Recomendaciones posturales, ejercicios y continuidad...",
          },
        ],
      },
      {
        titulo: "Preguntas y Tablas de Seguimiento",
        siempreVisible: true,
        campos: [
          {
            nombre: "moduloPerinatal.bloquesSeguimiento",
            etiqueta: "Controles y Preguntas Personalizadas",
            tipo: "bloques_dinamicos",
          },
        ],
      },
    ],
  },
};
