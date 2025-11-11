import { Document, Packer, Paragraph, TextRun, AlignmentType } from "docx";
import { saveAs } from "file-saver";

// ================================
// CONSTANTES Y CONFIGURACIÓN
// ================================

const COLORES = {
  PRIMARIO: "6B46C1",        // Morado oscuro (color original)
  SECUNDARIO: "7C3AED",      // Morado (color original)
  TEXTO_PRINCIPAL: "6B46C1", // Morado para texto importante
  TEXTO_SECUNDARIO: "666666", // Gris para texto secundario
  GRIS: "666666",            // Gris medio
  GRIS_CLARO: "999999"       // Gris claro
};

const TAMAÑOS_FUENTE = {
  SECCION: 24,               // Títulos de sección
  NORMAL: 18,                // Texto normal
  PEQUEÑO: 16,               // Texto pequeño
  MINI: 14                   // Para notas muy pequeñas
};

// ================================
// FUNCIONES AUXILIARES
// ================================

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

const crearDato = (etiqueta, valor) => {
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

const crearEspacio = () => {
  return new Paragraph({ 
    children: [new TextRun({ text: "" })],
    spacing: { after: 200 }
  });
};

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

const crearSeccionDatosValoracion = (valoracion, fechaValoracion) => {
  return [
    crearSeccion("2. DATOS DE LA VALORACION"),
    crearDato("Fecha de valoracion", fechaValoracion),
    crearDato("Hora", valoracion.hora),
    crearDato("Motivo de consulta", valoracion.motivoConsulta),
    crearEspacio()
  ];
};

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

const crearFirmaSimple = (titulo, nombre, cedula) => {
  const paragrafos = [];

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
    console.log('🔧 INICIANDO EXPORTACION WORD - VERSION DEPURADA Y COMPATIBLE');
    
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
    console.log('📄 Generando blob...');
    const blob = await Packer.toBlob(doc);
    
    const nombrePacienteArchivo = nombrePaciente.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_]/g, '');
    const fecha = new Date().toISOString().split('T')[0];
    const nombreArchivo = `Valoracion_PisoPelvico_COMPATIBLE_${nombrePacienteArchivo}_${fecha}.docx`;
    
    console.log('💾 Descargando archivo...');
    saveAs(blob, nombreArchivo);
    
    console.log('✅ Documento depurado generado exitosamente');
    alert('✅ VALORACION EXPORTADA EXITOSAMENTE\n\n🔧 Version COMPATIBLE sin errores de Word\n📄 Todas las firmas aparecen como lineas para completar manualmente\n🎨 Diseño purpura mantenido');
    
  } catch (error) {
    console.error('❌ Error en documento:', error);
    alert(`❌ Error: ${error.message}`);
  } finally {
    setExportando(false);
  }
};
