import { Document, Packer, Paragraph, TextRun, ImageRun, AlignmentType, Table, TableRow, TableCell, WidthType, BorderStyle, PageBreak, ShadingType } from "docx";
import { saveAs } from "file-saver";
import { API_CONFIG } from '../config/api';

/**
 * Utilidad para exportar valoraciones a documentos Word
 * Puede ser reutilizada para diferentes tipos de valoraciones
 */

// Función auxiliar para crear subtítulos consistentes
const createSubtitle = (text) => {
  return new Paragraph({
    children: [
      new TextRun({
        text: text,
        bold: true,
        size: 22,
        color: "FFFFFF"
      })
    ],
    alignment: AlignmentType.LEFT,
    spacing: { before: 300, after: 200 },
    shading: {
      type: ShadingType.SOLID,
      color: "8B5CF6"
    }
  });
};

// Función auxiliar para crear tabla de datos (versión simplificada)
const createDataTable = (data) => {
  // Filtrar datos válidos
  const validData = data.filter(item => item && item.label);
  
  // Crear párrafos simples en lugar de tabla compleja
  const paragraphs = [];
  
  for (let i = 0; i < validData.length; i += 2) {
    const leftItem = validData[i];
    const rightItem = validData[i + 1];
    
    if (rightItem) {
      // Dos columnas
      paragraphs.push(
        new Table({
          rows: [
            new TableRow({
              children: [
                new TableCell({
                  children: [
                    new Paragraph({
                      children: [
                        new TextRun({ text: leftItem.label + ": ", bold: true, color: "7C3AED" }),
                        new TextRun({ text: String(leftItem.value || 'No especificado'), color: "000000" }),
                      ],
                      spacing: { after: 100 }
                    })
                  ],
                  width: { size: 50, type: WidthType.PERCENTAGE }
                }),
                new TableCell({
                  children: [
                    new Paragraph({
                      children: [
                        new TextRun({ text: rightItem.label + ": ", bold: true, color: "7C3AED" }),
                        new TextRun({ text: String(rightItem.value || 'No especificado'), color: "000000" }),
                      ],
                      spacing: { after: 100 }
                    })
                  ],
                  width: { size: 50, type: WidthType.PERCENTAGE }
                })
              ]
            })
          ],
          width: { size: 100, type: WidthType.PERCENTAGE },
          borders: {
            top: { style: BorderStyle.NONE },
            bottom: { style: BorderStyle.NONE },
            left: { style: BorderStyle.NONE },
            right: { style: BorderStyle.NONE },
            insideHorizontal: { style: BorderStyle.NONE },
            insideVertical: { style: BorderStyle.NONE },
          }
        })
      );
    } else {
      // Una sola columna
      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun({ text: leftItem.label + ": ", bold: true, color: "7C3AED" }),
            new TextRun({ text: String(leftItem.value || 'No especificado'), color: "000000" }),
          ],
          spacing: { after: 100 }
        })
      );
    }
  }
  
  return paragraphs;
};

// Función auxiliar para descargar imagen via proxy del backend
const downloadImageAsBase64 = async (url) => {
  if (!url || typeof url !== 'string') return null;
  
  try {
    const response = await fetch(`${API_CONFIG.BASE_URL || 'http://localhost:5000'}/api/proxy-image?url=${encodeURIComponent(url)}`);
    if (!response.ok) {
      console.warn('No se pudo descargar la imagen:', url);
      return null;
    }
    
    const data = await response.json();
    if (data.success) {
      // Convertir data URL a Uint8Array para docx (compatible con navegador)
      const base64Data = data.dataUrl.split(',')[1];
      const binaryString = atob(base64Data);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      return bytes;
    }
    return null;
  } catch (error) {
    console.warn('Error descargando imagen:', error);
    return null;
  }
};

/**
 * Exporta una valoración de piso pélvico a Word
 * @param {Object} valoracion - Datos de la valoración
 * @param {Object} paciente - Datos del paciente (opcional)
 * @param {Object} config - Configuración adicional
 * @returns {Promise<void>}
 */
export const exportarValoracionPisoPelvicoAWord = async (valoracion, paciente = null, config = {}) => {
  try {
    console.log('⚠️ CUIDADO - EJECUTÁNDOSE ARCHIVO VIEJO wordExporter.js');
    
    // Preparar datos del paciente y valoración
    const nombrePaciente = paciente?.nombres || valoracion.nombres || 'Paciente';
    const cedulaPaciente = paciente?.cedula || valoracion.cedula || '';
    const fechaValoracion = valoracion.fecha || new Date().toLocaleDateString();

    // Descargar las firmas como imágenes
    console.log('Descargando firmas...');
    console.log('URLs de firmas:', {
      firmaPaciente: valoracion.firmaPaciente,
      firmaFisioterapeuta: valoracion.firmaFisioterapeuta,
      firmaAutorizacion: valoracion.firmaAutorizacion,
      consentimientoFirma: valoracion.consentimientoFirma
    });
    
    const firmaPacienteBuffer = await downloadImageAsBase64(valoracion.firmaPaciente);
    const firmaFisioterapeutaBuffer = await downloadImageAsBase64(valoracion.firmaFisioterapeuta);
    const firmaAutorizacionBuffer = await downloadImageAsBase64(valoracion.firmaAutorizacion);
    const consentimientoFirmaBuffer = await downloadImageAsBase64(valoracion.consentimientoFirma);
    
    console.log('Resultados de descarga de firmas:', {
      firmaPaciente: !!firmaPacienteBuffer,
      firmaFisioterapeuta: !!firmaFisioterapeutaBuffer,
      firmaAutorizacion: !!firmaAutorizacionBuffer,
      consentimientoFirma: !!consentimientoFirmaBuffer
    });

    // Preparar datos para las tablas
    const datosBasicos = [
      { label: "Nombres", value: nombrePaciente },
      { label: "Cédula", value: cedulaPaciente },
      { label: "Fecha de nacimiento", value: paciente?.fechaNacimiento || valoracion.fechaNacimiento },
      { label: "Edad", value: paciente?.edad || valoracion.edad },
      { label: "Género", value: paciente?.genero || valoracion.genero },
      { label: "Estado civil", value: paciente?.estadoCivil || valoracion.estadoCivil },
      { label: "Ocupación", value: paciente?.ocupacion || valoracion.ocupacion },
      { label: "Teléfono", value: paciente?.telefono || valoracion.telefono },
      { label: "Celular", value: paciente?.celular || valoracion.celular },
      { label: "Dirección", value: paciente?.direccion || valoracion.direccion },
      { label: "Aseguradora", value: paciente?.aseguradora || valoracion.aseguradora },
      { label: "Fecha valoración", value: fechaValoracion },
      { label: "Hora valoración", value: valoracion.hora },
      { label: "Motivo de consulta", value: valoracion.motivoConsulta },
    ];

    const estadoSaludData = [
      { label: "Temperatura", value: valoracion.temperatura },
      { label: "TA", value: valoracion.ta },
      { label: "FR", value: valoracion.fr },
      { label: "FC", value: valoracion.fc },
      { label: "Peso previo", value: valoracion.pesoPrevio },
      { label: "Peso actual", value: valoracion.pesoActual },
      { label: "Talla", value: valoracion.talla },
      { label: "IMC", value: valoracion.imc },
      { label: "Deporte actual", value: valoracion.deporteActual },
      { label: "Alergias", value: valoracion.alergias },
      { label: "Información medicación", value: valoracion.infoMedicacion },
      { label: "Otros farmacológicos", value: valoracion.farmacoOtros },
    ];

    const dinamicaMiccionalData = [
      { label: "Protector/Toalla/Pañal", value: valoracion.protectorMiccional },
      { label: "Tipo de ropa interior", value: valoracion.ropaInterior },
      { label: "N° Micciones al día", value: valoracion.numMiccionesDia },
      { label: "Cada cuántas horas", value: valoracion.cadaCuantasHoras },
      { label: "N° Micciones noche", value: valoracion.numMiccionesNoche },
      { label: "Características micción", value: valoracion.caracMiccion },
      { label: "Vaciado completo", value: valoracion.vaciadoCompleto ? "Sí" : "No" },
      { label: "Vaciado incompleto", value: valoracion.vaciadoIncompleto ? "Sí" : "No" },
      { label: "Forma de micción", value: valoracion.formaMiccion },
      { label: "Dolor al orinar", value: valoracion.dolorOrinar },
    ];

    const evaluacionFisioData = [
      { label: "Marcha", value: valoracion.marcha },
      { label: "Postura (L3-Ombligo)", value: valoracion.postura },
      { label: "Diafragma Orofaríngeo", value: valoracion.diafragmaOrofaringeo },
      { label: "Diafragma Toráxico", value: valoracion.diafragmaToracico },
      { label: "Testing Centro Frénico", value: valoracion.testingCentroFrenico },
      { label: "Testing de Pilares", value: valoracion.testingPilares },
      { label: "Testing de Traslación Arco Costal", value: valoracion.testingArcoCostal },
      { label: "Diafragma Pélvico", value: valoracion.diafragmaPelvico },
      { label: "Tipo de Pelvis", value: valoracion.tipoPelvis },
      { label: "Abdomen (Test Tos)", value: valoracion.abdomenTestTos },
      { label: "Diastasis", value: valoracion.diastasis },
      { label: "Supraumbilical", value: valoracion.supraumbilical },
      { label: "Umbilical", value: valoracion.umbilical },
      { label: "Infraumbilical", value: valoracion.infraumbilical },
      { label: "Movilidad", value: valoracion.movilidad },
      { label: "Test Dinámicos", value: valoracion.testDinamicos },
      { label: "Vulva", value: valoracion.vulva },
      { label: "Mucosa", value: valoracion.mucosa },
      { label: "Labios", value: valoracion.labios },
      { label: "Lubricación Perineal", value: valoracion.lubricacionPerineal },
      { label: "Flujo Olor - Color", value: valoracion.flujoOlorColor },
      { label: "Ph Vaginal", value: valoracion.phVaginal },
      { label: "Vagina", value: valoracion.vagina },
      { label: "Diámetro apertura vagina/introito", value: valoracion.diametroIntroito },
      { label: "Clítoris", value: valoracion.clitoris },
      { label: "Destapar Capuchón (Dolor)", value: valoracion.capuchonDolor },
      { label: "Muevo Vulva Hacia Arriba Clítoris se eleva", value: valoracion.vulvaClitoris },
      { label: "Sensibilidad (Cada Lado)", value: valoracion.sensibilidadLados },
      { label: "Hemorroides - Varices Vulvares", value: valoracion.hemorroidesVarices },
      { label: "Cicatrices", value: valoracion.cicatrices },
      { label: "Cirugías Estéticas", value: valoracion.cirugiasEsteticas },
      { label: "Glándulas De Skene Eyaculación", value: valoracion.glandulasSkene },
      { label: "Glándulas De Bartolini Lubricación", value: valoracion.glandulasBartolini },
      { label: "Elasticidad de La Orquilla Vulvar", value: valoracion.elasticidadOrquilla },
      { label: "Uretra - Vagina - Ano", value: valoracion.uretraVaginaAno },
      { label: "Distancia Ano-Vulvar", value: valoracion.distanciaAnoVulvar },
      { label: "Diámetro Bituberoso", value: valoracion.diametroBituberoso },
      { label: "Núcleo Central Del Periné", value: valoracion.nucleoCentralPerine },
      { label: "Contracción y Observar", value: valoracion.contraccionObservar },
      { label: "Reflejo de Tos (Ano Cierra)", value: valoracion.reflejoTosAno ? "Sí" : "No" },
      { label: "Prurito", value: valoracion.prurito ? "Sí" : "No" },
      { label: "Escozor", value: valoracion.escozor ? "Sí" : "No" },
      { label: "Valoración neurológica", value: valoracion.valoracionNeuro },
      { label: "Diagnóstico fisioterapéutico", value: valoracion.diagnosticoFisio },
      { label: "Plan de intervención", value: valoracion.planIntervencion },
    ];

    const dinamicaMenstrualData = [
      { label: "Edad Menarquia", value: valoracion.edadMenarquia },
      { label: "Edad Menopausia", value: valoracion.edadMenopausia },
      { label: "Días de menstruación", value: valoracion.diasMenstruacion },
      { label: "Intervalo entre periodo", value: valoracion.intervaloPeriodo },
      { label: "Características del sangrado", value: valoracion.caracSangrado },
      { label: "Algias durante el periodo", value: valoracion.algiasPeriodo },
      { label: "Observaciones", value: valoracion.observacionesMenstrual },
      { label: "Durante los días de sangrado usa", value: valoracion.productoMenstrual },
      { label: "Dolor menstrual", value: valoracion.dolorMenstrual ? "Sí" : "No" },
      { label: "Ubicación dolor menstrual", value: valoracion.ubicacionDolorMenstrual },
      { label: "Factores perpetuadores", value: valoracion.factoresPerpetuadores },
      { label: "Factores calmantes", value: valoracion.factoresCalmantes },
      { label: "Métodos anticonceptivos", value: valoracion.anticonceptivo },
      { label: "Intentos de embarazo", value: valoracion.intentosEmbarazo },
      { label: "No me quedo embarazada", value: valoracion.noMeQuedoEmbarazada ? "Sí" : "No" },
      { label: "Fecundación in Vitro", value: valoracion.fecundacionInVitro ? "Sí" : "No" },
      { label: "Tratamiento Hormonal", value: valoracion.tratamientoHormonal ? "Sí" : "No" },
      { label: "Inseminación Artificial", value: valoracion.inseminacionArtificial ? "Sí" : "No" },
    ];

    const palpacionInternaData = [
      { label: "Cúpulas Derecha", value: valoracion.cupulaDerecha },
      { label: "Cúpulas Izquierda", value: valoracion.cupulaIzquierda },
      { label: "Tono General", value: valoracion.tonoGeneral },
      { label: "Observaciones sobre el tono", value: valoracion.tonoObservaciones },
      { label: "Capacidad Contráctil General", value: valoracion.capacidadContractil },
      { label: "Fuerza Oxford Global", value: valoracion.oxfordGlobal },
      { label: "Fuerza Oxford Derecha", value: valoracion.oxfordDerecha },
      { label: "Fuerza Oxford Izquierda", value: valoracion.oxfordIzquierda },
      { label: "PERFECT Power", value: valoracion.perfectPower },
      { label: "PERFECT Endurance", value: valoracion.perfectEndurance },
      { label: "PERFECT Repetitions", value: valoracion.perfectRepetitions },
      { label: "PERFECT Fast", value: valoracion.perfectFast },
      { label: "PERFECT ECT", value: valoracion.perfectECT },
    ];

    const iciqData = [
      { label: "Frecuencia de pérdida de orina", value: valoracion.icicq_frecuencia },
      { label: "Cantidad de orina que se escapa", value: valoracion.icicq_cantidad },
      { label: "Impacto en la vida diaria", value: valoracion.icicq_impacto },
      { label: "¿Cuándo pierde orina?", value: valoracion.icicq_cuando },
    ];

    const dinamicaDefecatoriaData = [
      { label: "No. defecaciones al día", value: valoracion.numDefecacionesDia },
      { label: "No. Defecaciones en la noche", value: valoracion.numDefecacionesNoche },
      { label: "No. Defecaciones a la semana", value: valoracion.numDefecacionesSemana },
      { label: "Postura defecatoria", value: valoracion.posturaDefecatoria },
      { label: "Forma de defecación", value: valoracion.formaDefecacion },
      { label: "Dolor (Tipo – localización)", value: valoracion.dolorDefecacion },
      { label: "Escala de Bristol", value: valoracion.escalaBristol },
      { label: "Gases", value: valoracion.gases },
      { label: "Lubricación", value: valoracion.lubricacion },
      { label: "Orgasmos", value: valoracion.orgasmo },
      { label: "Disfunción Orgásmica", value: valoracion.disfuncionOrgasmica },
      { label: "IU Durante la penetración", value: valoracion.iuPenetracion },
      { label: "Tipo de Relación y Dinámica Sexual", value: valoracion.dinamicaSexual },
      { label: "Masturbación", value: valoracion.masturbacion },
      { label: "Historia Sexual", value: valoracion.historiaSexual },
      { label: "Factores emocionales y dolor", value: valoracion.factorEmocional },
      { label: "Dolor sexual", value: valoracion.dolorSexual },
      { label: "Relaciones Sexuales", value: valoracion.relacionesSexuales },
      { label: "Dolor en el introito", value: valoracion.dolorIntroito },
      { label: "Dolor al Fondo", value: valoracion.dolorFondo },
      { label: "Dolor irradiado a", value: valoracion.dolorIrradiado },
      { label: "Dolor perineal", value: valoracion.dolorPerineal },
    ];

    // Crear el documento con configuración simplificada
    const doc = new Document({
      sections: [
        {
          properties: {
            page: {
              margin: {
                top: 1440,
                right: 1440,
                bottom: 1440,
                left: 1440,
              },
            },
          },
          children: [
            // Encabezado institucional
            new Paragraph({
              children: [
                new TextRun({
                  text: "D'MAMITAS & BABIES",
                  bold: true,
                  size: 28,
                  color: "FFFFFF"
                })
              ],
              alignment: AlignmentType.CENTER,
              spacing: { after: 200 },
              shading: {
                type: ShadingType.SOLID,
                color: "7C3AED"
              }
            }),

            new Paragraph({
              children: [
                new TextRun({
                  text: "Centro de Estimulación y Fisioterapia",
                  size: 18,
                  color: "666666"
                })
              ],
              alignment: AlignmentType.CENTER,
              spacing: { after: 200 }
            }),

            // Título principal
            new Paragraph({
              children: [
                new TextRun({
                  text: "VALORACIÓN DE PISO PÉLVICO",
                  bold: true,
                  size: 32,
                  color: "FFFFFF"
                })
              ],
              alignment: AlignmentType.CENTER,
              spacing: { after: 300 },
              shading: {
                type: ShadingType.SOLID,
                color: "6B46C1"
              }
            }),

            // Línea separadora
            new Paragraph({
              children: [
                new TextRun({
                  text: "____________________________________________________________________________________________________",
                  color: "A0AEC0"
                })
              ],
              alignment: AlignmentType.CENTER,
              spacing: { after: 300 }
            }),

            // Información del paciente
            createSubtitle("1. DATOS GENERALES DEL PACIENTE"),

            ...createDataTable(datosBasicos),

            new Paragraph({ text: "", spacing: { after: 300 } }),

            // Estado de salud
            createSubtitle("2. ESTADO DE SALUD"),

            ...createDataTable(estadoSaludData),

            new Paragraph({ text: "", spacing: { after: 300 } }),

            // Dinámica Menstrual
            createSubtitle("3. DINÁMICA MENSTRUAL"),

            ...createDataTable(dinamicaMenstrualData),

            new Paragraph({ text: "", spacing: { after: 300 } }),

            // Dinámica Miccional
            createSubtitle("4. DINÁMICA MICCIONAL"),

            ...createDataTable(dinamicaMiccionalData),

            new Paragraph({ text: "", spacing: { after: 300 } }),

            // ICIQ-SF
            createSubtitle("5. ICIQ-SF - INCONTINENCIA URINARIA"),

            ...createDataTable(iciqData),

            new Paragraph({ text: "", spacing: { after: 300 } }),

            // Dinámica Defecatoria y Sexual
            createSubtitle("6. DINÁMICA DEFECATORIA Y SEXUAL"),

            ...createDataTable(dinamicaDefecatoriaData),

            new Paragraph({ text: "", spacing: { after: 300 } }),

            // Evaluación Fisioterapéutica
            createSubtitle("7. EVALUACIÓN FISIOTERAPÉUTICA"),

            ...createDataTable(evaluacionFisioData),

            new Paragraph({ text: "", spacing: { after: 300 } }),

            // Palpación Interna
            createSubtitle("8. PALPACIÓN INTERNA"),

            ...createDataTable(palpacionInternaData),

            new Paragraph({ text: "", spacing: { after: 300 } }),

            // Firmas y Autorizaciones
            createSubtitle("9. FIRMAS Y AUTORIZACIONES"),

            // Firma del Paciente
            new Paragraph({
              children: [
                new TextRun({ text: "Firma del Paciente:", bold: true, color: "7C3AED", size: 16 }),
              ],
              spacing: { before: 200, after: 100 }
            }),

            ...(firmaPacienteBuffer ? [
              new Paragraph({
                children: [
                  new ImageRun({
                    data: firmaPacienteBuffer,
                    transformation: {
                      width: 200,
                      height: 60,
                    },
                  }),
                ],
                spacing: { after: 200 }
              })
            ] : [
              new Paragraph({
                children: [
                  new TextRun({ text: "Sin firma registrada", color: "999999", italics: true }),
                ],
                spacing: { after: 200 }
              })
            ]),

            // Firma del Fisioterapeuta
            new Paragraph({
              children: [
                new TextRun({ text: "Firma del Fisioterapeuta:", bold: true, color: "7C3AED", size: 16 }),
              ],
              spacing: { after: 100 }
            }),

            ...(firmaFisioterapeutaBuffer ? [
              new Paragraph({
                children: [
                  new ImageRun({
                    data: firmaFisioterapeutaBuffer,
                    transformation: {
                      width: 200,
                      height: 60,
                    },
                  }),
                ],
                spacing: { after: 300 }
              })
            ] : [
              new Paragraph({
                children: [
                  new TextRun({ text: "Sin firma registrada", color: "999999", italics: true }),
                ],
                spacing: { after: 300 }
              })
            ]),

            // Autorización de imágenes (con salto de página)
            new PageBreak(),
            new Paragraph({
              children: [
                new TextRun({ text: "AUTORIZACIÓN DE USO DE IMÁGENES", bold: true, color: "6B46C1", size: 18 }),
              ],
              alignment: AlignmentType.CENTER,
              spacing: { after: 200 }
            }),

            new Paragraph({
              children: [
                new TextRun({
                  text: "Autorizo a D'Mamitas & Babies para reproducir fotografías e imágenes de las actividades en las que participe, para ser utilizadas en sus publicaciones, proyectos, redes sociales y página web con fines educativos, promocionales y de divulgación científica.",
                  color: "000000"
                }),
              ],
              spacing: { after: 200 },
              alignment: AlignmentType.JUSTIFIED
            }),

            new Paragraph({
              children: [
                new TextRun({ text: "Firma de Autorización:", bold: true, color: "7C3AED", size: 16 }),
              ],
              spacing: { after: 100 }
            }),

            ...(firmaAutorizacionBuffer ? [
              new Paragraph({
                children: [
                  new ImageRun({
                    data: firmaAutorizacionBuffer,
                    transformation: {
                      width: 200,
                      height: 60,
                    },
                  }),
                ],
                spacing: { after: 400 }
              })
            ] : [
              new Paragraph({
                children: [
                  new TextRun({ text: "Sin firma registrada", color: "999999", italics: true }),
                ],
                spacing: { after: 400 }
              })
            ]),

            // Consentimiento Informado en nueva página
            new PageBreak(),
            new Paragraph({
              children: [
                new TextRun({ text: "CONSENTIMIENTO INFORMADO", bold: true, color: "6B46C1", size: 18 }),
              ],
              alignment: AlignmentType.CENTER,
              spacing: { after: 300 }
            }),

            new Paragraph({
              children: [
                new TextRun({ text: "PARA EVALUACIÓN Y TRATAMIENTO DE FISIOTERAPIA PÉLVICA", bold: true, color: "7C3AED", size: 14 }),
              ],
              alignment: AlignmentType.CENTER,
              spacing: { after: 400 }
            }),

            new Paragraph({
              children: [
                new TextRun({
                  text: "Reconozco y entiendo que me han remitido o que he venido por voluntad propia a fisioterapia pélvica para que se me realice una evaluación y tratamiento de la(s) disfunción(es) de mi piso pélvico.",
                  color: "000000"
                }),
              ],
              spacing: { after: 200 },
              alignment: AlignmentType.JUSTIFIED
            }),

            new Paragraph({
              children: [
                new TextRun({
                  text: "La/el fisioterapeuta pélvica(o) me ha enseñado la anatomía básica del piso pélvico, sus funciones y la relación con mi disfunción(es) actual(es).",
                  color: "000000"
                }),
              ],
              spacing: { after: 200 },
              alignment: AlignmentType.JUSTIFIED
            }),

            new Paragraph({
              children: [
                new TextRun({
                  text: "Entiendo que para evaluar y tratar mi condición será necesario, inicial y periódicamente, que mi fisioterapeuta realice un examen de inspección y palpación detallada del área abdominal, lumbar, pélvica y genital externa, así como la palpación interna específica a través de la vagina y/o ano según se requiera y sea posible, para lo cual será necesario que me desvista dejando expuestas estas regiones de mi cuerpo.",
                  color: "000000"
                }),
              ],
              spacing: { after: 200 },
              alignment: AlignmentType.JUSTIFIED
            }),

            new Paragraph({
              children: [
                new TextRun({
                  text: "Este examen incluirá, entre otras cosas, la evaluación del estado de la piel, el tejido eréctil, los reflejos, la presencia de tensión muscular, la estructura y el tono muscular, la fuerza y la resistencia, la movilidad de las cicatrices y la función del piso pélvico en general.",
                  color: "000000"
                }),
              ],
              spacing: { after: 200 },
              alignment: AlignmentType.JUSTIFIED
            }),

            new Paragraph({
              children: [
                new TextRun({
                  text: "Comprendo que durante la evaluación también se me solicitarán actividades como la tos, el pujo y la valsalva máxima, además de diferentes movimientos con los músculos del piso pélvico.",
                  color: "000000"
                }),
              ],
              spacing: { after: 200 },
              alignment: AlignmentType.JUSTIFIED
            }),

            new Paragraph({
              children: [
                new TextRun({
                  text: "Tengo conciencia de que la evaluación y tratamiento de fisioterapia pélvica, puede requerir la aplicación de procedimientos o técnicas que pueden ser tanto externas a nivel del abdomen, región lumbar, pelvis y zona genital, vulvar y/o anal, como internas en el canal vaginal y/o rectal con el fin de alcanzar los objetivos terapéuticos para mejorar o erradicar los síntomas de mi(s) disfunción(es).",
                  color: "000000"
                }),
              ],
              spacing: { after: 200 },
              alignment: AlignmentType.JUSTIFIED
            }),

            new Paragraph({
              children: [
                new TextRun({
                  text: "Estas técnicas pueden incluir pero no están limitadas a: técnicas manuales (digitopresión, masaje, tracción, movilización, entre otras) o técnicas con equipos (electroterapia con electrodo intracavitario o adhesivo, biofeedback con electrodo intracavitario o adhesivo, masajeadores con y sin vibración, masajeadores térmicos, paquetes fríos o calientes, bolitas pélvicas, pesas vaginales, balones vaginales/ rectales, dilatadores vaginales/anales, bombas de vacío, fotobiomodulación, radiofrecuencia, ecografía, etc).",
                  color: "000000"
                }),
              ],
              spacing: { after: 200 },
              alignment: AlignmentType.JUSTIFIED
            }),

            new Paragraph({
              children: [
                new TextRun({
                  text: "También soy consciente de que mi tratamiento puede involucrar ejercicios de movilidad pélvica con o sin balón, ejercicio de resistencia cardiovascular, de resistencia y fuerza muscular general y de flexibilidad, como también entrenamiento específico del piso pélvico.",
                  color: "000000"
                }),
              ],
              spacing: { after: 200 },
              alignment: AlignmentType.JUSTIFIED
            }),

            new Paragraph({
              children: [
                new TextRun({
                  text: "Entiendo que deberé realizar en casa, una pauta de ejercicios tal y como la fisioterapeuta pélvica me lo indique, pudiendo ser ésta de ejercicios específicos de contracción/relajación de la musculatura pélvica con o sin la aplicación de herramientas terapéuticas, ejercicios funcionales, automasaje manual o instrumentalizado o de flexibilidad muscular.",
                  color: "000000"
                }),
              ],
              spacing: { after: 300 },
              alignment: AlignmentType.JUSTIFIED
            }),

            new Paragraph({
              children: [
                new TextRun({ text: "Posibles riesgos: ", bold: true, color: "7C3AED" }),
                new TextRun({
                  text: "reconozco que una evaluación completa del piso pélvico y/o un tratamiento de fisioterapia pélvica pueden aumentar mi nivel actual de dolor o malestar, o agravar mi disfunción o síntomas existentes y que este malestar suele ser temporal. Si no desaparece en 1-3 días, acepto ponerme en contacto con mi fisioterapeuta.",
                  color: "000000"
                }),
              ],
              spacing: { after: 200 },
              alignment: AlignmentType.JUSTIFIED
            }),

            new Paragraph({
              children: [
                new TextRun({
                  text: "Dentro de los malestares físicos temporales, pueden presentarse los siguientes: Dolor, ardor, sensación de calambre, sangrado de la mucosa, ganas de orinar o defecar, escape de gases anales o vaginales, mareo, taquicardia, bradicardia o hipotensión momentánea.",
                  color: "000000"
                }),
              ],
              spacing: { after: 200 },
              alignment: AlignmentType.JUSTIFIED
            }),

            new Paragraph({
              children: [
                new TextRun({
                  text: "Dentro de las incomodidades psicológicas o emocionales pueden presentarse: Vergüenza, nerviosismo, ansiedad o temor principalmente en la sesión de evaluación por ser la primera vez en fisioterapia pélvica.",
                  color: "000000"
                }),
              ],
              spacing: { after: 300 },
              alignment: AlignmentType.JUSTIFIED
            }),

            new Paragraph({
              children: [
                new TextRun({ text: "Posibles beneficios: ", bold: true, color: "7C3AED" }),
                new TextRun({
                  text: "una evaluación completa del piso pélvico y/o un tratamiento de fisioterapia pélvica pueden aliviar mis síntomas, mejorando mi calidad de vida y aumentando mi capacidad para realizar mis actividades diarias. Es posible que experimente un aumento de la fuerza, la conciencia, la flexibilidad y la resistencia de los músculos de mi piso pélvico e igualmente, puede que note una disminución del dolor o los malestares asociados a la disfunción que tengo. También podré adquirir un mayor conocimiento sobre mi disfunción y seré más consciente de los recursos disponibles para manejar mis síntomas y mejorar mi condición.",
                  color: "000000"
                }),
              ],
              spacing: { after: 300 },
              alignment: AlignmentType.JUSTIFIED
            }),

            new Paragraph({
              children: [
                new TextRun({ text: "No garantía: ", bold: true, color: "7C3AED" }),
                new TextRun({
                  text: "comprendo que la/el fisioterapeuta no puede hacer promesas ni garantías con respecto a la cura o la completa mejoría de mi disfunción. Entiendo que mi fisioterapeuta compartirá su opinión profesional conmigo sobre los posibles resultados de la fisioterapia y analizará todas las opciones de tratamiento antes de que yo dé mi consentimiento para el tratamiento, basado en los resultados subjetivos y objetivos de la evaluación.",
                  color: "000000"
                }),
              ],
              spacing: { after: 200 },
              alignment: AlignmentType.JUSTIFIED
            }),

            new Paragraph({
              children: [
                new TextRun({
                  text: "Entiendo que tengo el derecho a revocar mi consentimiento en cualquier momento y que mi consentimiento verbal será obtenido continuamente a lo largo de las sesiones. Yo estaré siempre en control de mi propio cuerpo y de las actividades que me sean solicitadas realizar en la consulta con la/el fisioterapeuta.",
                  color: "000000"
                }),
              ],
              spacing: { after: 200 },
              alignment: AlignmentType.JUSTIFIED
            }),

            new Paragraph({
              children: [
                new TextRun({
                  text: "Al firmar este documento, acepto que he leído y entendido el CONSENTIMIENTO INFORMADO PARA EVALUACIÓN Y TRATAMIENTO DE FISIOTERAPIA PÉLVICA y que doy mi consentimiento para la evaluación y tratamiento de mi piso pélvico.",
                  color: "000000",
                  bold: true
                }),
              ],
              spacing: { after: 400 },
              alignment: AlignmentType.JUSTIFIED
            }),

            // Datos del consentimiento
            new Paragraph({
              children: [
                new TextRun({ text: "Fecha: ", bold: true, color: "7C3AED" }),
                new TextRun({ text: valoracion.consentimientoFecha || '_________________', color: "000000" }),
                new TextRun({ text: "     Ciudad: ", bold: true, color: "7C3AED" }),
                new TextRun({ text: valoracion.consentimientoCiudad || '_________________', color: "000000" }),
              ],
              spacing: { after: 200 }
            }),

            new Paragraph({
              children: [
                new TextRun({ text: "Nombre completo: ", bold: true, color: "7C3AED" }),
                new TextRun({ text: valoracion.consentimientoNombre || '_________________________________', color: "000000" }),
              ],
              spacing: { after: 200 }
            }),

            new Paragraph({
              children: [
                new TextRun({ text: "CC No.: ", bold: true, color: "7C3AED" }),
                new TextRun({ text: valoracion.consentimientoCC || '_________________________________', color: "000000" }),
              ],
              spacing: { after: 300 }
            }),

            // Firma del consentimiento
            new Paragraph({
              children: [
                new TextRun({ text: "Firma del Consentimiento:", bold: true, color: "7C3AED", size: 16 }),
              ],
              spacing: { after: 100 }
            }),

            ...(consentimientoFirmaBuffer ? [
              new Paragraph({
                children: [
                  new ImageRun({
                    data: consentimientoFirmaBuffer,
                    transformation: {
                      width: 200,
                      height: 60,
                    },
                  }),
                ],
                spacing: { before: 300 }
              })
            ] : [
              new Paragraph({
                children: [
                  new TextRun({ text: "Sin firma registrada", color: "999999", italics: true }),
                ],
                spacing: { before: 300 }
              })
            ]),
          ],
        },
      ],
    });

    // Generar y descargar el documento
    console.log('Generando documento Word...');
    const blob = await Packer.toBlob(doc);
    
    const nombrePacienteArchivo = nombrePaciente.replace(/\s+/g, '_');
    const fecha = new Date().toISOString().split('T')[0];
    const nombreArchivo = config.nombreArchivo || `Valoracion_PisoPelvico_${nombrePacienteArchivo}_${fecha}.docx`;
    
    saveAs(blob, nombreArchivo);
    
    console.log('Documento Word generado y descargado exitosamente');
    return { success: true, message: '¡Valoración exportada exitosamente como Word!' };
    
  } catch (error) {
    console.error('Error detallado al exportar la valoración:', error);
    throw new Error(`Error al exportar la valoración: ${error.message}`);
  }
};

/**
 * Función genérica para exportar cualquier tipo de valoración
 * @param {Object} valoracion - Datos de la valoración
 * @param {Object} paciente - Datos del paciente
 * @param {string} tipoValoracion - Tipo de valoración ('piso-pelvico', 'adultos-lactancia', etc.)
 * @param {Object} config - Configuración adicional
 */
export const exportarValoracionAWord = async (valoracion, paciente, tipoValoracion = 'piso-pelvico', config = {}) => {
  switch (tipoValoracion) {
    case 'piso-pelvico':
      return await exportarValoracionPisoPelvicoAWord(valoracion, paciente, config);
    default:
      throw new Error(`Tipo de valoración no soportado: ${tipoValoracion}`);
  }
};
