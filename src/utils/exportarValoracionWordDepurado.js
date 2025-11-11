import { Document, Packer, Paragraph, TextRun, AlignmentType } from "docx";
import { saveAs } from "file-saver";

// ================================
// CONSTANTES Y CONFIGURACIÓN
// ================================

const COLORES = {
  PRIMARIO: "6B46C1",        // Morado oscuro (color original)
  SECUNDARIO: "7C3AED",      // Morado (color original)
  TERCIARIO: "8B5CF6",       // Morado medio (color original)
  ACENTO: "F39C12",          // Dorado para elementos especiales
  EXITO: "27AE60",           // Verde profesional
  ERROR: "E74C3C",           // Rojo
  ADVERTENCIA: "F39C12",     // Naranja dorado
  GRIS: "666666",            // Gris medio (color original)
  GRIS_CLARO: "999999",      // Gris claro (color original)
  GRIS_LINEA: "A0AEC0",      // Gris para líneas (color original)
  TEXTO_PRINCIPAL: "6B46C1", // Morado para texto importante
  TEXTO_SECUNDARIO: "666666" // Gris para texto secundario
};

const TAMAÑOS_FUENTE = {
  TITULO_PRINCIPAL: 40,      // Título principal muy prominente
  TITULO_CENTRO: 30,         // Subtítulos importantes
  TITULO_DOCUMENTO: 36,      // Título del documento
  SECCION: 24,               // Títulos de sección más destacados
  CONSENTIMIENTO: 20,        // Texto legal legible (aumentado de 18 a 20)
  NORMAL: 18,                // Texto normal más grande y legible (aumentado de 16 a 18)
  PEQUEÑO: 16,               // Texto pequeño pero aún legible (aumentado de 14 a 16)
  MINI: 14                   // Para notas muy pequeñas (aumentado de 12 a 14)
};

// ================================
// FUNCIONES AUXILIARES DE DOCUMENTO
// ================================

/**
 * Crea un párrafo de sección con estilo consistente
 * @param {string} titulo - Título de la sección
 * @returns {Paragraph} Párrafo de sección
 */
const crearSeccion = (titulo) => {
  return new Paragraph({
    children: [
      new TextRun({
        text: titulo,
        bold: true,
        size: TAMAÑOS_FUENTE.SECCION,
        color: COLORES.SECUNDARIO
      })
    ],
    spacing: { before: 600, after: 300 }
  });
};

/**
 * Crea un párrafo de dato con etiqueta y valor
 * @param {string} etiqueta - Etiqueta del dato
 * @param {string|number|boolean} valor - Valor del dato
 * @returns {Paragraph} Párrafo con el dato
 */
const crearDato = (etiqueta, valor) => {
  console.log(`Creando dato: ${etiqueta} = "${valor}" (tipo: ${typeof valor})`);
  const valorTexto = valor === true ? "Si" : 
                    valor === false ? "No" : 
                    String(valor || 'No especificado');

  return new Paragraph({
    children: [
      new TextRun({ 
        text: etiqueta + ": ", 
        bold: true,
        color: COLORES.TEXTO_PRINCIPAL,
        size: TAMAÑOS_FUENTE.NORMAL
      }),
      new TextRun({ 
        text: valorTexto,
        color: COLORES.TEXTO_SECUNDARIO,
        size: TAMAÑOS_FUENTE.NORMAL
      })
    ],
    spacing: { after: 150, before: 50 },
    indent: { left: 200 }
  });
};

/**
 * Crea un párrafo de espacio en blanco
 * @returns {Paragraph} Párrafo vacío
 */
const crearEspacio = () => {
  return new Paragraph({ 
    children: [new TextRun({ text: "" })],
    spacing: { after: 200 }
  });
};

// ================================
// SECCIONES DEL DOCUMENTO
// ================================

/**
 * Crea la sección de datos del paciente
 * @param {Object} valoracion - Datos de la valoración
 * @param {Object} paciente - Datos del paciente
 * @returns {Array<Paragraph>} Array de párrafos de la sección
 */
const crearSeccionDatosPaciente = (valoracion, paciente) => {
  return [
    crearSeccion("1. DATOS DEL PACIENTE"),
    crearDato("Nombre", paciente?.nombres || valoracion.nombres),
    crearDato("Cedula", paciente?.cedula || valoracion.cedula),
    crearDato("Fecha de nacimiento", paciente?.fechaNacimiento || valoracion.fechaNacimiento),
    crearDato("Edad", paciente?.edad || valoracion.edad),
    crearDato("Genero", paciente?.genero || valoracion.genero),
    crearDato("Estado civil", paciente?.estadoCivil || valoracion.estadoCivil),
    crearDato("Direccion", paciente?.direccion || valoracion.direccion),
    crearDato("Telefono", paciente?.telefono || valoracion.telefono),
    crearDato("Celular", paciente?.celular || valoracion.celular),
    crearDato("Ocupacion", paciente?.ocupacion || valoracion.ocupacion),
    crearDato("Aseguradora", paciente?.aseguradora || valoracion.aseguradora),
    crearEspacio()
  ];
};

/**
 * Crea la sección de datos de la valoración
 * @param {Object} valoracion - Datos de la valoración
 * @param {string} fechaValoracion - Fecha formateada de la valoración
 * @returns {Array<Paragraph>} Array de párrafos de la sección
 */
const crearSeccionDatosValoracion = (valoracion, fechaValoracion) => {
  return [
    crearSeccion("2. DATOS DE LA VALORACION"),
    crearDato("Fecha de valoracion", fechaValoracion),
    crearDato("Hora", valoracion.hora),
    crearDato("Motivo de consulta", valoracion.motivoConsulta),
    crearEspacio()
  ];
};

/**
 * Crea la sección de estado de salud
 * @param {Object} valoracion - Datos de la valoración
 * @returns {Array<Paragraph>} Array de párrafos de la sección
 */
const crearSeccionEstadoSalud = (valoracion) => {
  return [
    crearSeccion("3. ESTADO DE SALUD"),
    crearDato("Temperatura", valoracion.temperatura),
    crearDato("TA (Tension Arterial)", valoracion.ta),
    crearDato("FR (Frecuencia Respiratoria)", valoracion.fr),
    crearDato("FC (Frecuencia Cardiaca)", valoracion.fc),
    crearDato("Peso previo", valoracion.pesoPrevio),
    crearDato("Peso actual", valoracion.pesoActual),
    crearDato("Talla", valoracion.talla),
    crearDato("IMC", valoracion.imc),
    crearDato("Deporte actual", valoracion.deporteActual),
    crearDato("Alergias", valoracion.alergias),
    crearDato("Informacion sobre medicacion", valoracion.infoMedicacion),
    crearEspacio()
  ];
};

/**
 * Crea la sección de dinámica obstétrica
 * @param {Object} valoracion - Datos de la valoración
 * @returns {Array<Paragraph>} Array de párrafos de la sección
 */
const crearSeccionDinamicaObstetrica = (valoracion) => {
  return [
    crearSeccion("4. DINAMICA OBSTETRICA/GINECOLOGICA"),
    crearDato("No. Embarazos", valoracion.numEmbarazos),
    crearDato("No. Abortos", valoracion.numAbortos),
    crearDato("No. Partos Vaginales", valoracion.numPartosVaginales),
    crearDato("No. Cesareas", valoracion.numCesareas),
    crearDato("Actividad fisica durante gestacion", valoracion.actividadFisicaGestacion),
    crearDato("Medicacion durante gestacion", valoracion.medicacionGestacion),
    crearDato("Actividad fisica postparto", valoracion.actividadFisicaPostparto),
    crearDato("Incontinencia urinaria tras el parto", valoracion.incontinenciaUrinaria),
    crearDato("Incontinencia fecal", valoracion.incontinenciaFecal),
    crearEspacio()
  ];
};

/**
 * Crea la sección de dinámica menstrual
 * @param {Object} valoracion - Datos de la valoración
 * @returns {Array<Paragraph>} Array de párrafos de la sección
 */
const crearSeccionDinamicaMenstrual = (valoracion) => {
  return [
    crearSeccion("5. DINAMICA MENSTRUAL"),
    crearDato("Edad Menarquia", valoracion.edadMenarquia),
    crearDato("Edad Menopausia", valoracion.edadMenopausia),
    crearDato("Dias de menstruacion", valoracion.diasMenstruacion),
    crearDato("Intervalo entre periodo", valoracion.intervaloPeriodo),
    crearDato("Caracteristicas del sangrado", valoracion.caracSangrado),
    crearDato("Dolor menstrual", valoracion.dolorMenstrual),
    crearDato("Metodos anticonceptivos", valoracion.anticonceptivo),
    crearEspacio()
  ];
};

/**
 * Crea la sección de dinámica miccional
 * @param {Object} valoracion - Datos de la valoración
 * @returns {Array<Paragraph>} Array de párrafos de la sección
 */
const crearSeccionDinamicaMiccional = (valoracion) => {
  return [
    crearSeccion("6. DINAMICA MICCIONAL"),
    crearDato("No. Micciones al dia", valoracion.numMiccionesDia),
    crearDato("No. Micciones en la noche", valoracion.numMiccionesNoche),
    crearDato("Caracteristicas de la miccion", valoracion.caracMiccion),
    crearDato("Vaciado completo", valoracion.vaciadoCompleto),
    crearDato("Vaciado incompleto", valoracion.vaciadoIncompleto),
    crearDato("Dolor al orinar", valoracion.dolorOrinar),
    crearEspacio()
  ];
};

/**
 * Crea la sección de evaluación fisioterapéutica
 * @param {Object} valoracion - Datos de la valoración
 * @returns {Array<Paragraph>} Array de párrafos de la sección
 */
const crearSeccionEvaluacionFisio = (valoracion) => {
  return [
    crearSeccion("7. EVALUACION FISIOTERAPEUTICA"),
    crearDato("Marcha", valoracion.marcha),
    crearDato("Postura", valoracion.postura),
    crearDato("Tipo de Pelvis", valoracion.tipoPelvis),
    crearDato("Diastasis", valoracion.diastasis),
    crearDato("Diagnostico fisioterapeutico", valoracion.diagnosticoFisio),
    crearDato("Plan de intervencion", valoracion.planIntervencion),
    crearEspacio()
  ];
};

/**
 * Crea una firma individual simplificada
 * @param {string} titulo - Título de la firma
 * @param {string} nombre - Nombre completo
 * @param {string} cedula - Cédula o identificación
 * @returns {Array<Paragraph>} Array de párrafos para la firma
 */
const crearFirmaSimple = (titulo, nombre, cedula) => {
  const paragrafos = [];

  // Título
  paragrafos.push(
    new Paragraph({
      children: [
        new TextRun({
          text: titulo,
          bold: true,
          size: TAMAÑOS_FUENTE.NORMAL,
          color: COLORES.PRIMARIO
        })
      ],
      alignment: AlignmentType.CENTER,
      spacing: { before: 300, after: 150 }
    })
  );

  // Nombre
  paragrafos.push(
    new Paragraph({
      children: [
        new TextRun({
          text: nombre || "___________________________",
          size: TAMAÑOS_FUENTE.NORMAL,
          color: COLORES.TEXTO_SECUNDARIO,
          bold: true
        })
      ],
      alignment: AlignmentType.CENTER,
      spacing: { after: 150 }
    })
  );

  // Línea de firma
  paragrafos.push(
    new Paragraph({
      children: [
        new TextRun({
          text: "____________________________________",
          color: COLORES.GRIS,
          size: TAMAÑOS_FUENTE.PEQUEÑO
        })
      ],
      alignment: AlignmentType.CENTER,
      spacing: { before: 100, after: 50 }
    })
  );

  // Etiqueta Firma
  paragrafos.push(
    new Paragraph({
      children: [
        new TextRun({
          text: "Firma",
          size: TAMAÑOS_FUENTE.PEQUEÑO,
          color: COLORES.GRIS
        })
      ],
      alignment: AlignmentType.CENTER,
      spacing: { after: 100 }
    })
  );

  // Cédula
  paragrafos.push(
    new Paragraph({
      children: [
        new TextRun({
          text: cedula || "C.C. _______________",
          size: TAMAÑOS_FUENTE.PEQUEÑO,
          color: COLORES.GRIS
        })
      ],
      alignment: AlignmentType.CENTER,
      spacing: { after: 300 }
    })
  );

  return paragrafos;
};

// ================================
// FUNCIÓN PRINCIPAL DE EXPORTACIÓN
// ================================

/**
 * Exporta una valoración de piso pélvico a Word (versión depurada y compatible)
 * @param {Object} valoracion - Datos de la valoración
 * @param {Object} paciente - Datos del paciente
 * @param {Function} setExportando - Función para controlar estado de carga
 */
export const exportarValoracionPisoPelvicoAWord = async (valoracion, paciente, setExportando) => {
  try {
    setExportando(true);
    console.log('INICIANDO EXPORTACION WORD - VERSION DEPURADA Y COMPATIBLE');
    
    // Preparar datos básicos
    const fechaValoracion = valoracion.fecha || new Date().toLocaleDateString();
    const nombrePaciente = paciente?.nombres || valoracion.nombres || 'Paciente';

    // Construir documento usando solo elementos básicos y compatibles
    const contenido = [
      // Encabezado simple
      new Paragraph({
        children: [
          new TextRun({
            text: "VALORACION DE PISO PELVICO",
            bold: true,
            size: 32,
            color: COLORES.PRIMARIO
          })
        ],
        alignment: AlignmentType.CENTER,
        spacing: { before: 200, after: 200 }
      }),

      new Paragraph({
        children: [
          new TextRun({
            text: "D'Mamitas & Babies | Centro de Estimulacion y Fisioterapia",
            size: TAMAÑOS_FUENTE.NORMAL,
            color: COLORES.GRIS
          })
        ],
        alignment: AlignmentType.CENTER,
        spacing: { after: 400 }
      }),

      ...crearSeccionDatosPaciente(valoracion, paciente),
      ...crearSeccionDatosValoracion(valoracion, fechaValoracion),
      ...crearSeccionEstadoSalud(valoracion),
      ...crearSeccionDinamicaObstetrica(valoracion),
      ...crearSeccionDinamicaMenstrual(valoracion),
      ...crearSeccionDinamicaMiccional(valoracion),
      ...crearSeccionEvaluacionFisio(valoracion),

      // Sección de firmas simplificada
      crearSeccion("8. FIRMAS Y AUTORIZACIONES"),
      
      ...crearFirmaSimple(
        "PACIENTE", 
        valoracion.nombres, 
        "C.C. " + (valoracion.cedula || "_______________")
      ),
      
      ...crearFirmaSimple(
        "FISIOTERAPEUTA", 
        "Ft. " + (valoracion.nombreFisioterapeuta || "___________________________"), 
        "T.P. " + (valoracion.tpFisioterapeuta || "_______________")
      ),

      // Pie de documento
      crearEspacio(),
      
      new Paragraph({
        children: [
          new TextRun({
            text: "D'Mamitas & Babies | Centro de Estimulacion y Fisioterapia",
            bold: true,
            size: TAMAÑOS_FUENTE.PEQUEÑO,
            color: COLORES.PRIMARIO
          })
        ],
        alignment: AlignmentType.CENTER,
        spacing: { before: 400, after: 100 }
      }),
      
      new Paragraph({
        children: [
          new TextRun({
            text: "Documento generado el " + new Date().toLocaleDateString('es-ES'),
            size: TAMAÑOS_FUENTE.MINI,
            color: COLORES.GRIS_CLARO
          })
        ],
        alignment: AlignmentType.CENTER
      })
    ];

    // Crear documento simple sin headers/footers problemáticos
    const doc = new Document({
      sections: [{
        children: contenido
      }]
    });

    // Generar y descargar archivo
    console.log('Generando blob...');
    const blob = await Packer.toBlob(doc);
    
    const nombrePacienteArchivo = nombrePaciente.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_]/g, '');
    const fecha = new Date().toISOString().split('T')[0];
    const nombreArchivo = `Valoracion_PisoPelvico_${nombrePacienteArchivo}_${fecha}.docx`;
    
    console.log('Descargando archivo...');
    saveAs(blob, nombreArchivo);
    
    console.log('Documento depurado generado exitosamente');
    alert('Valoracion exportada exitosamente (version depurada y compatible)');
    
  } catch (error) {
    console.error('Error en documento:', error);
    alert(`Error: ${error.message}`);
  } finally {
    setExportando(false);
  }
};
