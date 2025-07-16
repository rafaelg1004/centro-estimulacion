import { Document, Packer, Paragraph, TextRun, AlignmentType, ImageRun, Header, Footer } from "docx";
import { saveAs } from "file-saver";

// ================================
// CONSTANTES BÁSICAS
// ================================

const COLORES = {
  PRIMARIO: "6B46C1",
  SECUNDARIO: "7C3AED",
  GRIS: "666666"
};

const TAMAÑOS_FUENTE = {
  TITULO: 24,
  NORMAL: 18,
  PEQUEÑO: 14
};

// ================================
// FUNCIONES AUXILIARES BÁSICAS
// ================================

const crearSeccion = (titulo) => {
  return new Paragraph({
    children: [
      new TextRun({
        text: titulo,
        bold: true,
        size: TAMAÑOS_FUENTE.TITULO,
        color: COLORES.PRIMARIO
      })
    ],
    spacing: { before: 400, after: 200 }
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
        color: COLORES.PRIMARIO,
        size: TAMAÑOS_FUENTE.NORMAL
      }),
      new TextRun({ 
        text: valorTexto,
        color: COLORES.GRIS,
        size: TAMAÑOS_FUENTE.NORMAL
      })
    ],
    spacing: { after: 100 }
  });
};

const crearEspacio = () => {
  return new Paragraph({ 
    children: [new TextRun({ text: " " })],
    spacing: { after: 200 }
  });
};

// ================================
// FUNCIONES DE FIRMAS SIMPLIFICADAS
// ================================

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
          color: COLORES.GRIS,
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
// SECCIONES DEL DOCUMENTO
// ================================

const crearEncabezado = () => {
  return [
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
      spacing: { before: 200, after: 300 }
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
    })
  ];
};

const crearSeccionDatosPaciente = (valoracion, paciente) => {
  return [
    crearSeccion("1. DATOS DEL PACIENTE"),
    crearDato("Nombre", paciente?.nombres || valoracion.nombres),
    crearDato("Cedula", paciente?.cedula || valoracion.cedula),
    crearDato("Fecha de nacimiento", paciente?.fechaNacimiento || valoracion.fechaNacimiento),
    crearDato("Edad", paciente?.edad || valoracion.edad),
    crearDato("Genero", paciente?.genero || valoracion.genero),
    crearDato("Telefono", paciente?.telefono || valoracion.telefono),
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

const crearSeccionFirmas = (valoracion) => {
  const paragrafos = [
    crearSeccion("3. FIRMAS")
  ];

  const nombrePaciente = valoracion.nombres || "Paciente";
  const cedulaPaciente = "C.C. " + (valoracion.cedula || "_______________");
  const nombreFisioterapeuta = "Ft. " + (valoracion.nombreFisioterapeuta || "Fisioterapeuta");
  const cedulaFisioterapeuta = "T.P. " + (valoracion.tpFisioterapeuta || "_______________");

  // Firma del paciente
  paragrafos.push(...crearFirmaSimple("PACIENTE", nombrePaciente, cedulaPaciente));
  
  // Firma del fisioterapeuta
  paragrafos.push(...crearFirmaSimple("FISIOTERAPEUTA", nombreFisioterapeuta, cedulaFisioterapeuta));

  return paragrafos;
};

// ================================
// FUNCIÓN PRINCIPAL SIMPLIFICADA
// ================================

export const exportarValoracionPisoPelvicoAWordSimple = async (valoracion, paciente, setExportando) => {
  try {
    setExportando(true);
    console.log('Iniciando exportacion Word simplificada...');
    
    const fechaValoracion = valoracion.fecha || new Date().toLocaleDateString();
    const nombrePaciente = paciente?.nombres || valoracion.nombres || 'Paciente';

    // Construir documento básico
    const contenido = [
      ...crearEncabezado(),
      ...crearSeccionDatosPaciente(valoracion, paciente),
      ...crearSeccionDatosValoracion(valoracion, fechaValoracion),
      ...crearSeccionFirmas(valoracion)
    ];

    // Crear documento sin headers/footers complejos
    const doc = new Document({
      sections: [{
        children: contenido
      }]
    });

    // Generar y descargar
    const blob = await Packer.toBlob(doc);
    const nombreArchivo = `Valoracion_Simple_${nombrePaciente.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.docx`;
    
    saveAs(blob, nombreArchivo);
    console.log('Documento simplificado generado exitosamente');
    alert('Valoracion exportada exitosamente (version simplificada)');
    
  } catch (error) {
    console.error('Error en documento simplificado:', error);
    alert(`Error: ${error.message}`);
  } finally {
    setExportando(false);
  }
};
