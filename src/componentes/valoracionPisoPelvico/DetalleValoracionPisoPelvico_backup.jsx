import React, { useEffect, useState } from "react";
import { apiRequest } from "../../config/api";

import { useParams, Link } from "react-router-dom";
import Spinner from "../ui/Spinner";
import { PencilSquareIcon, ArrowLeftIcon, DocumentArrowDownIcon } from "@heroicons/react/24/solid";
import { Document, Packer, Paragraph, TextRun, AlignmentType, Table, TableRow, TableCell, WidthType, BorderStyle, ImageRun } from "docx";
import { saveAs } from "file-saver";

const Card = ({ title, children }) => (
  <div className="bg-indigo-50 rounded-2xl shadow p-6 mb-8 border border-indigo-100">
    <h3 className="text-lg font-bold text-indigo-700 mb-3 border-b border-indigo-200 pb-1">{title}</h3>
    {children}
  </div>
);

const Field = ({ label, value }) => (
  <div className="mb-2 flex flex-col md:flex-row">
    <span className="font-semibold text-gray-700 md:w-64">{label}:</span>
    <span className="text-gray-900 flex-1">{value || <span className="text-gray-400">Sin dato</span>}</span>
  </div>
);

const renderValue = (value) => {
  // Manejar valores booleanos
  if (typeof value === 'boolean') {
    return value ? "SÃ­" : "No";
  }
  
  if (Array.isArray(value)) {
    // Si el array es de objetos (como hijos), muestra cada uno en una tarjeta vertical y compacta en dos columnas reales
    if (value.length > 0 && typeof value[0] === "object" && value[0] !== null) {
      return (
        <div className="flex flex-col gap-4">
          {value.map((obj, idx) => (
            <div
              key={idx}
              className="bg-white border border-indigo-200 rounded-xl p-4 shadow w-full max-w-md"
              style={{ minWidth: "220px" }}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1">
                {Object.entries(obj).filter(([k]) => k !== "_id").map(([k, v]) => (
                  <div key={k} className="mb-1">
                    <span className="font-semibold">
                      {k === "nombre" ? "Nombre" :
                        k === "fechaNacimiento" ? "Fecha Nacimiento" :
                        k === "peso" ? "Peso" :
                        k === "talla" ? "Talla" :
                        k === "tipoParto" ? "Tipo Parto" :
                        k === "semana" ? "Semana" :
                        k.replace(/([A-Z])/g, " $1").replace(/^./, s => s.toUpperCase())
                      }
                      :
                    </span>{" "}
                    <span>{renderValue(v)}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      );
    }
    // Si es un array simple, lista normal
    return value.length === 0 ? <span className="text-gray-400">Sin dato</span> : (
      <ul className="list-disc ml-6">
        {value.map((v, i) => <li key={i}>{renderValue(v)}</li>)}
      </ul>
    );
  }
  
  if (typeof value === "object" && value !== null) {
    // Si es un objeto paciente con _id, nombres, etc., convertir a string seguro
    if (value._id && value.nombres) {
      return `${value.nombres} ${value.apellidos || ""}`.trim() || value._id;
    }
    
    // Para otros objetos, mostrar propiedades de forma segura
    return (
      <div className="bg-gray-50 rounded p-2 mb-1 border">
        {Object.entries(value).map(([k, v]) => (
          <div key={k}>
            <span className="font-semibold">{k.replace(/([A-Z])/g, " $1").replace(/^./, s => s.toUpperCase())}:</span> {renderValue(v)}
          </div>
        ))}
      </div>
    );
  }
  
  // Para valores primitivos
  return value === "" || value === undefined || value === null
    ? <span className="text-gray-400">Sin dato</span>
    : String(value);
};

export default function DetalleValoracionPisoPelvico() {
  const { id } = useParams();
  const [valoracion, setValoracion] = useState(null);
  const [paciente, setPaciente] = useState(null);
  const [pacienteError, setPacienteError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [exportando, setExportando] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const data = await apiRequest(`/valoracion-piso-pelvico/${id}`);
        console.log('Datos de valoraciÃ³n cargados:', data);
        setValoracion(data);
        
        if (data.paciente) {
          try {
            // Si data.paciente es un objeto, ya tenemos los datos del paciente
            if (typeof data.paciente === 'object' && data.paciente._id) {
              console.log('Paciente ya poblado en valoraciÃ³n:', data.paciente);
              setPaciente(data.paciente);
              setPacienteError(false);
            } else if (typeof data.paciente === 'string') {
              // Si es un string ID, hacer la consulta
              console.log('Cargando paciente por ID:', data.paciente);
              const pacienteData = await apiRequest(`/pacientes-adultos/${data.paciente}`);
              console.log('Datos del paciente cargados:', pacienteData);
              setPaciente(pacienteData);
              setPacienteError(false);
            } else {
              throw new Error('Formato de paciente no vÃ¡lido');
            }
          } catch (error) {
            const pacienteId = typeof data.paciente === 'object' ? data.paciente?._id : data.paciente;
            console.warn(`Paciente con ID ${pacienteId} no encontrado:`, error);
            setPaciente(null);
            setPacienteError(true);
          }
        }
      } catch (error) {
        console.error('Error cargando valoraciÃ³n:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

  const exportarAWord = async () => {
    try {
      setExportando(true);
      
      // Preparar datos para enviar al backend
      const datosParaExportar = {
        // Datos del paciente
        paciente: {
          nombres: paciente?.nombres || valoracion.nombres,
          cedula: paciente?.cedula || valoracion.cedula,
          fechaNacimiento: paciente?.fechaNacimiento || valoracion.fechaNacimiento,
          edad: paciente?.edad || valoracion.edad,
          genero: paciente?.genero || valoracion.genero,
          estadoCivil: paciente?.estadoCivil || valoracion.estadoCivil,
          direccion: paciente?.direccion || valoracion.direccion,
          telefono: paciente?.telefono || valoracion.telefono,
          celular: paciente?.celular || valoracion.celular,
          ocupacion: paciente?.ocupacion || valoracion.ocupacion,
          aseguradora: paciente?.aseguradora || valoracion.aseguradora,
        },
        // Datos de la valoración
        valoracion: {
          ...valoracion,
          // Asegurar que las URLs de firmas estén incluidas
          firmaPaciente: valoracion.firmaPaciente,
          firmaFisioterapeuta: valoracion.firmaFisioterapeuta,
          firmaAutorizacion: valoracion.firmaAutorizacion,
          consentimientoFirma: valoracion.consentimientoFirma,
        },
        tipoDocumento: 'valoracion-piso-pelvico'
      };

      console.log('Enviando datos al backend para exportar...');
      
      // Enviar al backend para generar el documento
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'https://centro-backend-production.up.railway.app'}/api/exportar-word`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(datosParaExportar),
      });

      if (!response.ok) {
        throw new Error(`Error del servidor: ${response.status}`);
      }

      // Descargar el archivo generado
      const blob = await response.blob();
      const nombrePaciente = (paciente?.nombres || valoracion.nombres || 'Sin_nombre').replace(/\s+/g, '_');
      const fecha = new Date().toISOString().split('T')[0];
      
      // Crear enlace de descarga
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `Valoracion_PisoPelvico_${nombrePaciente}_${fecha}.docx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      console.log('Valoración exportada exitosamente desde el backend');
    } catch (error) {
      console.error('Error al exportar la valoración:', error);
      alert('Error al exportar la valoración. Por favor, inténtelo de nuevo.');
    } finally {
      setExportando(false);
    }
  };
        if (!url) return null;
        
        try {
          const response = await fetch(url, {
            mode: 'cors',
            headers: {
              'Accept': 'image/*'
            }
          });
          
          if (!response.ok) {
            throw new Error(`Error al descargar imagen: ${response.status}`);
          }
          
          return await response.arrayBuffer();
        } catch (error) {
          console.error('Error descargando imagen desde URL:', url, error);
          return null;
        }
      };

      // FunciÃ³n para crear imagen de firma desde URL
      const crearImagenFirma = async (firmaUrl, ancho = 150, alto = 75) => {
        if (!firmaUrl) return null;
        
        try {
          const arrayBuffer = await urlToArrayBuffer(firmaUrl);
          if (!arrayBuffer) return null;
          
          return new ImageRun({
            data: arrayBuffer,
            transformation: {
              width: ancho,
              height: alto,
            },
          });
        } catch (error) {
          console.error('Error procesando firma:', error);
          return null;
        }
      };

      // Procesar las firmas (ahora desde URLs)
      console.log('Procesando firmas desde URLs...');
      const imagenFirmaPaciente = await crearImagenFirma(valoracion.firmaPaciente);
      const imagenFirmaFisioterapeuta = await crearImagenFirma(valoracion.firmaFisioterapeuta);
      const imagenFirmaAutorizacion = await crearImagenFirma(valoracion.firmaAutorizacion);
      const imagenConsentimientoFirma = await crearImagenFirma(valoracion.consentimientoFirma);
      
      // FunciÃ³n auxiliar para crear campos de formulario (inline)
      const crearCampoFormulario = (label, value, ancho = 40) => {
        const valorFormateado = value === "" || value === undefined || value === null 
          ? "____________________" 
          : typeof value === 'boolean' 
            ? (value ? "SÃ" : "NO")
            : String(value);
            
        return [
          new TextRun({ text: label + ": ", bold: true, size: 22 }),
          new TextRun({ text: valorFormateado, underline: { type: 'single' }, size: 22 })
        ];
      };

      // FunciÃ³n para crear lÃ­nea con mÃºltiples campos
      const crearLineaCampos = (campos) => {
        const children = [];
        campos.forEach((campo, index) => {
          children.push(...crearCampoFormulario(campo.label, campo.value));
          if (index < campos.length - 1) {
            children.push(new TextRun({ text: "     ", size: 22 })); // Espaciado entre campos
          }
        });
        
        return new Paragraph({
          children,
          spacing: { after: 150 },
        });
      };

      // FunciÃ³n para crear tÃ­tulo de secciÃ³n
      const crearTituloSeccion = (titulo) => {
        return new Paragraph({
          children: [
            new TextRun({ 
              text: titulo, 
              bold: true, 
              size: 26,
              color: "1F4E79"
            })
          ],
          alignment: AlignmentType.LEFT,
          spacing: { before: 300, after: 200 },
          border: {
            bottom: {
              color: "1F4E79",
              space: 1,
              style: BorderStyle.SINGLE,
              size: 6,
            },
          },
        });
      };

      // FunciÃ³n para crear tabla de checkbox/opciones
      const crearTablaOpciones = (titulo, opciones) => {
        return [
          new Paragraph({
            children: [new TextRun({ text: titulo + ":", bold: true, size: 22 })],
            spacing: { after: 100 },
          }),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: opciones.map(opcion => 
                  new TableCell({
                    children: [new Paragraph({
                      children: [
                        new TextRun({ text: "â˜ " + opcion.label, size: 20 }),
                        opcion.checked ? new TextRun({ text: " âœ“", bold: true, color: "1F4E79" }) : new TextRun({ text: "" })
                      ],
                    })],
                    width: { size: 100/opciones.length, type: WidthType.PERCENTAGE },
                    borders: {
                      top: { style: BorderStyle.NONE },
                      bottom: { style: BorderStyle.NONE },
                      left: { style: BorderStyle.NONE },
                      right: { style: BorderStyle.NONE },
                    },
                  })
                ),
              }),
            ],
          })
        ];
      };

      // Crear el documento con el nuevo formato
      const doc = new Document({
        sections: [{
          children: [
            // Header profesional
            new Paragraph({
              children: [
                new TextRun({ 
                  text: "D'MAMITAS & BABIES", 
                  bold: true, 
                  size: 36,
                  color: "1F4E79"
                })
              ],
              alignment: AlignmentType.CENTER,
              spacing: { after: 100 },
            }),
            
            new Paragraph({
              children: [
                new TextRun({ 
                  text: "Centro de EstimulaciÃ³n Temprana y Fisioterapia", 
                  size: 24,
                  color: "4472C4"
                })
              ],
              alignment: AlignmentType.CENTER,
              spacing: { after: 200 },
            }),

            new Paragraph({
              children: [
                new TextRun({ 
                  text: "FORMATO DE VALORACIÃ“N PISO PÃ‰LVICO", 
                  bold: true, 
                  size: 28,
                  color: "1F4E79"
                })
              ],
              alignment: AlignmentType.CENTER,
              spacing: { after: 300 },
              border: {
                top: { color: "1F4E79", space: 1, style: BorderStyle.SINGLE, size: 6 },
                bottom: { color: "1F4E79", space: 1, style: BorderStyle.SINGLE, size: 6 },
              },
            }),

            // InformaciÃ³n bÃ¡sica en formato formulario
            crearTituloSeccion("DATOS GENERALES"),
            
            crearLineaCampos([
              { label: "Nombres", value: paciente?.nombres || valoracion.nombres },
              { label: "CÃ©dula", value: paciente?.cedula || valoracion.cedula }
            ]),
            
            crearLineaCampos([
              { label: "Fecha de nacimiento", value: paciente?.fechaNacimiento || valoracion.fechaNacimiento },
              { label: "Edad", value: paciente?.edad || valoracion.edad },
              { label: "GÃ©nero", value: paciente?.genero || valoracion.genero }
            ]),
            
            crearLineaCampos([
              { label: "Estado civil", value: paciente?.estadoCivil || valoracion.estadoCivil },
              { label: "OcupaciÃ³n", value: paciente?.ocupacion || valoracion.ocupacion }
            ]),
            
            crearLineaCampos([
              { label: "TelÃ©fono", value: paciente?.telefono || valoracion.telefono },
              { label: "Celular", value: paciente?.celular || valoracion.celular }
            ]),
            
            new Paragraph({
              children: crearCampoFormulario("DirecciÃ³n", paciente?.direccion || valoracion.direccion),
              spacing: { after: 150 },
            }),
            
            new Paragraph({
              children: crearCampoFormulario("Aseguradora", paciente?.aseguradora || valoracion.aseguradora),
              spacing: { after: 150 },
            }),
            
            crearLineaCampos([
              { label: "Fecha valoraciÃ³n", value: valoracion.fecha },
              { label: "Hora", value: valoracion.hora }
            ]),
            
            new Paragraph({
              children: crearCampoFormulario("Motivo de consulta", valoracion.motivoConsulta),
              spacing: { after: 300 },
            }),

            // Signos vitales
            crearTituloSeccion("SIGNOS VITALES Y MEDIDAS ANTROPOMÃ‰TRICAS"),
            
            crearLineaCampos([
              { label: "TÂ°", value: valoracion.temperatura },
              { label: "TA", value: valoracion.ta },
              { label: "FR", value: valoracion.fr },
              { label: "FC", value: valoracion.fc }
            ]),
            
            crearLineaCampos([
              { label: "Peso previo", value: valoracion.pesoPrevio },
              { label: "Peso actual", value: valoracion.pesoActual },
              { label: "Talla", value: valoracion.talla },
              { label: "IMC", value: valoracion.imc }
            ]),

            // Antecedentes obstÃ©tricos
            crearTituloSeccion("ANTECEDENTES OBSTÃ‰TRICOS"),
            
            crearLineaCampos([
              { label: "Embarazos", value: valoracion.numEmbarazos },
              { label: "Abortos", value: valoracion.numAbortos },
              { label: "Partos Vaginales", value: valoracion.numPartosVaginales },
              { label: "CesÃ¡reas", value: valoracion.numCesareas }
            ]),

            // SecciÃ³n de checkboxes para sÃ­ntomas
            ...crearTablaOpciones("SÃNTOMAS PRINCIPALES", [
              { label: "Incontinencia urinaria", checked: valoracion.incontinenciaUrinaria },
              { label: "Incontinencia fecal", checked: valoracion.incontinenciaFecal },
              { label: "Gases vaginales", checked: valoracion.gasesVaginales },
              { label: "Bulto vaginal", checked: valoracion.bultoVaginal }
            ]),

            // DinÃ¡mica menstrual
            crearTituloSeccion("DINÃMICA MENSTRUAL"),
            
            crearLineaCampos([
              { label: "Edad Menarquia", value: valoracion.edadMenarquia },
              { label: "Edad Menopausia", value: valoracion.edadMenopausia },
              { label: "DÃ­as menstruaciÃ³n", value: valoracion.diasMenstruacion }
            ]),
            
            new Paragraph({
              children: crearCampoFormulario("CaracterÃ­sticas del sangrado", valoracion.caracSangrado),
              spacing: { after: 150 },
            }),
            
            new Paragraph({
              children: crearCampoFormulario("MÃ©todos anticonceptivos", valoracion.anticonceptivo),
              spacing: { after: 300 },
            }),

            // DinÃ¡mica miccional
            crearTituloSeccion("DINÃMICA MICCIONAL"),
            
            crearLineaCampos([
              { label: "Micciones dÃ­a", value: valoracion.numMiccionesDia },
              { label: "Micciones noche", value: valoracion.numMiccionesNoche },
              { label: "Cada cuÃ¡ntas horas", value: valoracion.cadaCuantasHoras }
            ]),
            
            new Paragraph({
              children: crearCampoFormulario("CaracterÃ­sticas de la micciÃ³n", valoracion.caracMiccion),
              spacing: { after: 150 },
            }),

            ...crearTablaOpciones("CARACTERÃSTICAS MICCIONALES", [
              { label: "Vaciado completo", checked: valoracion.vaciadoCompleto },
              { label: "Vaciado incompleto", checked: valoracion.vaciadoIncompleto },
              { label: "Empujar para comenzar", checked: valoracion.empujarComenzar },
              { label: "Empujar para terminar", checked: valoracion.empujarTerminar }
            ]),

            // EvaluaciÃ³n fisioterapÃ©utica
            crearTituloSeccion("EVALUACIÃ“N FISIOTERAPÃ‰UTICA"),
            
            new Paragraph({
              children: crearCampoFormulario("Marcha", valoracion.marcha),
              spacing: { after: 150 },
            }),
            
            new Paragraph({
              children: crearCampoFormulario("Postura", valoracion.postura),
              spacing: { after: 150 },
            }),
            
            new Paragraph({
              children: crearCampoFormulario("Tipo de Pelvis", valoracion.tipoPelvis),
              spacing: { after: 150 },
            }),
            
            new Paragraph({
              children: crearCampoFormulario("Vulva", valoracion.vulva),
              spacing: { after: 150 },
            }),

            // PalpaciÃ³n interna
            crearTituloSeccion("PALPACIÃ“N INTERNA"),
            
            new Paragraph({
              children: crearCampoFormulario("Tono General", valoracion.tonoGeneral),
              spacing: { after: 150 },
            }),
            
            crearLineaCampos([
              { label: "Oxford Global", value: valoracion.oxfordGlobal },
              { label: "Oxford Derecha", value: valoracion.oxfordDerecha },
              { label: "Oxford Izquierda", value: valoracion.oxfordIzquierda }
            ]),
            
            crearLineaCampos([
              { label: "PERFECT Power", value: valoracion.perfectPower },
              { label: "PERFECT Endurance", value: valoracion.perfectEndurance },
              { label: "PERFECT Repetitions", value: valoracion.perfectRepetitions }
            ]),

            // DiagnÃ³stico y plan
            crearTituloSeccion("DIAGNÃ“STICO Y PLAN DE TRATAMIENTO"),
            
            new Paragraph({
              children: crearCampoFormulario("DiagnÃ³stico fisioterapÃ©utico", valoracion.diagnosticoFisio),
              spacing: { after: 200 },
            }),
            
            new Paragraph({
              children: crearCampoFormulario("Plan de intervenciÃ³n", valoracion.planIntervencion),
              spacing: { after: 400 },
            }),

            // SecciÃ³n de firmas con espacios apropiados
            crearTituloSeccion("FIRMAS Y CONSENTIMIENTOS"),
            
            new Paragraph({
              children: [new TextRun({ text: "", size: 22 })],
              spacing: { after: 600 },
            }),
            
            new Table({
              width: { size: 100, type: WidthType.PERCENTAGE },
              rows: [
                new TableRow({
                  children: [
                    new TableCell({
                      children: [
                        new Paragraph({
                          children: [new TextRun({ text: "FIRMA PACIENTE", bold: true, size: 20 })],
                          alignment: AlignmentType.CENTER,
                        }),
                        new Paragraph({
                          children: [new TextRun({ text: "", size: 22 })],
                          spacing: { after: 200 },
                        }),
                        // Incluir imagen de firma del paciente si existe
                        imagenFirmaPaciente ? new Paragraph({
                          children: [imagenFirmaPaciente],
                          alignment: AlignmentType.CENTER,
                          spacing: { after: 200 },
                        }) : new Paragraph({
                          children: [new TextRun({ text: "_".repeat(30), size: 20 })],
                          alignment: AlignmentType.CENTER,
                          spacing: { after: 200 },
                        }),
                        new Paragraph({
                          children: [new TextRun({ 
                            text: (paciente?.nombres || valoracion.nombres || "NOMBRE DEL PACIENTE"), 
                            size: 18,
                            allCaps: true
                          })],
                          alignment: AlignmentType.CENTER,
                        }),
                        new Paragraph({
                          children: [new TextRun({ 
                            text: "C.C. " + (paciente?.cedula || valoracion.cedula || "_______________"), 
                            size: 18
                          })],
                          alignment: AlignmentType.CENTER,
                        }),
                      ],
                      width: { size: 50, type: WidthType.PERCENTAGE },
                      borders: {
                        top: { style: BorderStyle.NONE },
                        bottom: { style: BorderStyle.NONE },
                        left: { style: BorderStyle.NONE },
                        right: { style: BorderStyle.NONE },
                      },
                    }),
                    new TableCell({
                      children: [
                        new Paragraph({
                          children: [new TextRun({ text: "FIRMA FISIOTERAPEUTA", bold: true, size: 20 })],
                          alignment: AlignmentType.CENTER,
                        }),
                        new Paragraph({
                          children: [new TextRun({ text: "", size: 22 })],
                          spacing: { after: 200 },
                        }),
                        // Incluir imagen de firma del fisioterapeuta si existe
                        imagenFirmaFisioterapeuta ? new Paragraph({
                          children: [imagenFirmaFisioterapeuta],
                          alignment: AlignmentType.CENTER,
                          spacing: { after: 200 },
                        }) : new Paragraph({
                          children: [new TextRun({ text: "_".repeat(30), size: 20 })],
                          alignment: AlignmentType.CENTER,
                          spacing: { after: 200 },
                        }),
                        new Paragraph({
                          children: [new TextRun({ text: "FISIOTERAPEUTA", size: 18, allCaps: true })],
                          alignment: AlignmentType.CENTER,
                        }),
                        new Paragraph({
                          children: [new TextRun({ text: "REG. PROF. _______________", size: 18 })],
                          alignment: AlignmentType.CENTER,
                        }),
                      ],
                      width: { size: 50, type: WidthType.PERCENTAGE },
                      borders: {
                        top: { style: BorderStyle.NONE },
                        bottom: { style: BorderStyle.NONE },
                        left: { style: BorderStyle.NONE },
                        right: { style: BorderStyle.NONE },
                      },
                    }),
                  ],
                }),
              ],
            }),

            // Firma de autorizaciÃ³n de imÃ¡genes
            new Paragraph({
              children: [new TextRun({ text: "", size: 22 })],
              spacing: { after: 300 },
            }),

            new Paragraph({
              children: [new TextRun({ text: "AUTORIZACIÃ“N USO DE IMÃGENES", bold: true, size: 24, color: "1F4E79" })],
              alignment: AlignmentType.CENTER,
              spacing: { after: 200 },
            }),

            new Paragraph({
              children: [
                new TextRun({ 
                  text: "Autorizo a D'Mamitas & Babies para reproducir fotografÃ­as e imÃ¡genes de las actividades en las que participe, para ser utilizadas en sus publicaciones, proyectos, redes sociales y pÃ¡gina web.", 
                  size: 20 
                })
              ],
              alignment: AlignmentType.JUSTIFIED,
              spacing: { after: 300 },
            }),

            new Table({
              width: { size: 100, type: WidthType.PERCENTAGE },
              rows: [
                new TableRow({
                  children: [
                    new TableCell({
                      children: [
                        new Paragraph({
                          children: [new TextRun({ text: "FIRMA AUTORIZACIÃ“N", bold: true, size: 20 })],
                          alignment: AlignmentType.CENTER,
                        }),
                        new Paragraph({
                          children: [new TextRun({ text: "", size: 22 })],
                          spacing: { after: 200 },
                        }),
                        // Incluir imagen de firma de autorizaciÃ³n si existe
                        imagenFirmaAutorizacion ? new Paragraph({
                          children: [imagenFirmaAutorizacion],
                          alignment: AlignmentType.CENTER,
                          spacing: { after: 200 },
                        }) : new Paragraph({
                          children: [new TextRun({ text: "_".repeat(40), size: 20 })],
                          alignment: AlignmentType.CENTER,
                          spacing: { after: 200 },
                        }),
                        new Paragraph({
                          children: [new TextRun({ 
                            text: (paciente?.nombres || valoracion.nombres || "NOMBRE DEL PACIENTE"), 
                            size: 18,
                            allCaps: true
                          })],
                          alignment: AlignmentType.CENTER,
                        }),
                      ],
                      width: { size: 100, type: WidthType.PERCENTAGE },
                      borders: {
                        top: { style: BorderStyle.NONE },
                        bottom: { style: BorderStyle.NONE },
                        left: { style: BorderStyle.NONE },
                        right: { style: BorderStyle.NONE },
                      },
                    }),
                  ],
                }),
              ],
            }),

            // Consentimiento informado
            new Paragraph({
              children: [new TextRun({ text: "", size: 22 })],
              spacing: { after: 400 },
            }),

            new Paragraph({
              children: [new TextRun({ text: "CONSENTIMIENTO INFORMADO", bold: true, size: 24, color: "1F4E79" })],
              alignment: AlignmentType.CENTER,
              spacing: { after: 300 },
            }),

            new Paragraph({
              children: [
                new TextRun({ 
                  text: "El paciente declara haber leÃ­do y entendido el consentimiento informado para evaluaciÃ³n y tratamiento de fisioterapia pÃ©lvica, y da su consentimiento para la evaluaciÃ³n y tratamiento de su piso pÃ©lvico.", 
                  size: 20 
                })
              ],
              alignment: AlignmentType.JUSTIFIED,
              spacing: { after: 200 },
            }),

            // Datos del consentimiento
            crearLineaCampos([
              { label: "Fecha", value: valoracion.consentimientoFecha },
              { label: "Ciudad", value: valoracion.consentimientoCiudad }
            ]),

            crearLineaCampos([
              { label: "Nombre completo", value: valoracion.consentimientoNombre },
              { label: "C.C. No.", value: valoracion.consentimientoCC }
            ]),

            new Paragraph({
              children: [new TextRun({ text: "", size: 22 })],
              spacing: { after: 200 },
            }),

            new Table({
              width: { size: 100, type: WidthType.PERCENTAGE },
              rows: [
                new TableRow({
                  children: [
                    new TableCell({
                      children: [
                        new Paragraph({
                          children: [new TextRun({ text: "FIRMA CONSENTIMIENTO", bold: true, size: 20 })],
                          alignment: AlignmentType.CENTER,
                        }),
                        new Paragraph({
                          children: [new TextRun({ text: "", size: 22 })],
                          spacing: { after: 200 },
                        }),
                        // Incluir imagen de firma del consentimiento si existe
                        imagenConsentimientoFirma ? new Paragraph({
                          children: [imagenConsentimientoFirma],
                          alignment: AlignmentType.CENTER,
                          spacing: { after: 200 },
                        }) : new Paragraph({
                          children: [new TextRun({ text: "_".repeat(40), size: 20 })],
                          alignment: AlignmentType.CENTER,
                          spacing: { after: 200 },
                        }),
                        new Paragraph({
                          children: [new TextRun({ 
                            text: (valoracion.consentimientoNombre || paciente?.nombres || valoracion.nombres || "NOMBRE DEL PACIENTE"), 
                            size: 18,
                            allCaps: true
                          })],
                          alignment: AlignmentType.CENTER,
                        }),
                      ],
                      width: { size: 100, type: WidthType.PERCENTAGE },
                      borders: {
                        top: { style: BorderStyle.NONE },
                        bottom: { style: BorderStyle.NONE },
                        left: { style: BorderStyle.NONE },
                        right: { style: BorderStyle.NONE },
                      },
                    }),
                  ],
                }),
              ],
            }),

            // Pie de pÃ¡gina
            new Paragraph({
              children: [new TextRun({ text: "", size: 22 })],
              spacing: { after: 300 },
            }),
            
            new Paragraph({
              children: [
                new TextRun({ 
                  text: `Fecha: ${valoracion.fecha || new Date().toLocaleDateString('es-ES')} | Ciudad: ${valoracion.consentimientoCiudad || "_____________"}`,
                  size: 20,
                  color: "666666"
                })
              ],
              alignment: AlignmentType.CENTER,
            }),
            
            new Paragraph({
              children: [
                new TextRun({ 
                  text: "Este documento ha sido generado por el sistema de D'Mamitas & Babies",
                  italics: true,
                  size: 18,
                  color: "999999"
                })
              ],
              alignment: AlignmentType.CENTER,
              spacing: { before: 200 },
            }),
          ],
        }],
      });

      // Generar y descargar el archivo
      const blob = await Packer.toBlob(doc);
      const nombrePaciente = (paciente?.nombres || valoracion.nombres || 'Sin_nombre').replace(/\s+/g, '_');
      const fecha = new Date().toISOString().split('T')[0];
      saveAs(blob, `Valoracion_PisoPelvico_${nombrePaciente}_${fecha}.docx`);
      
      console.log('ValoraciÃ³n exportada exitosamente');
    } catch (error) {
      console.error('Error al exportar la valoraciÃ³n:', error);
      alert('Error al exportar la valoraciÃ³n. Por favor, intÃ©ntelo de nuevo.');
    } finally {
      setExportando(false);
    }
  };

  if (loading || !valoracion) return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-green-100">
      <Spinner />
    </div>
  );

  // Paso 1: Datos Generales
  const datosGenerales = [
    { label: "Nombres", value: paciente?.nombres || valoracion.nombres },
    { label: "CÃ©dula", value: paciente?.cedula || valoracion.cedula },
    { label: "Fecha de nacimiento", value: paciente?.fechaNacimiento || valoracion.fechaNacimiento },
    { label: "Edad", value: paciente?.edad || valoracion.edad },
    { label: "GÃ©nero", value: paciente?.genero || valoracion.genero },
    { label: "Lugar de nacimiento", value: paciente?.lugarNacimiento || valoracion.lugarNacimiento },
    { label: "Estado civil", value: paciente?.estadoCivil || valoracion.estadoCivil },
    { label: "DirecciÃ³n", value: paciente?.direccion || valoracion.direccion },
    { label: "TelÃ©fono", value: paciente?.telefono || valoracion.telefono },
    { label: "Celular", value: paciente?.celular || valoracion.celular },
    { label: "OcupaciÃ³n", value: paciente?.ocupacion || valoracion.ocupacion },
    { label: "Nivel educativo", value: paciente?.nivelEducativo || valoracion.nivelEducativo },
    { label: "Aseguradora", value: paciente?.aseguradora || valoracion.aseguradora },
    { label: "MÃ©dico tratante", value: paciente?.medicoTratante || valoracion.medicoTratante },
    { label: "AcompaÃ±ante", value: paciente?.acompanante },
    { label: "TelÃ©fono acompaÃ±ante", value: paciente?.telefonoAcompanante },
    { label: "Nombre bebÃ©", value: paciente?.nombreBebe },
    { label: "Semanas gestaciÃ³n", value: paciente?.semanasGestacion },
    { label: "FUM", value: paciente?.fum },
    { label: "Fecha probable parto", value: paciente?.fechaProbableParto },
    { label: "Fecha valoraciÃ³n", value: valoracion.fecha },
    { label: "Hora valoraciÃ³n", value: valoracion.hora },
    { label: "Motivo de consulta", value: valoracion.motivoConsulta },
  ];

  // Paso 2: Estado de Salud
  const estadoSalud = [
    { label: "Temperatura", value: valoracion.temperatura },
    { label: "TA", value: valoracion.ta },
    { label: "FR", value: valoracion.fr },
    { label: "FC", value: valoracion.fc },
    { label: "Peso previo", value: valoracion.pesoPrevio },
    { label: "Peso actual", value: valoracion.pesoActual },
    { label: "Talla", value: valoracion.talla },
    { label: "IMC", value: valoracion.imc },
    { label: "Deporte actual", value: valoracion.deporteActual },
    { label: "Observaciones AVD/Trabajo", value: valoracion.observacionesAvd },
    { label: "InformaciÃ³n sobre medicaciÃ³n", value: valoracion.infoMedicacion },
    { label: "Otros (FarmacolÃ³gicos)", value: valoracion.farmacoOtros },
    { label: "Alergias", value: valoracion.alergias },
    { label: "Ãšltima analÃ­tica", value: valoracion.ultimaAnalitica },
    { label: "PatologÃ­a cardiaca", value: valoracion.patologiaCardio },
    { label: "PatologÃ­a neurolÃ³gica", value: valoracion.patologiaNeuro },
    { label: "Observaciones (TraumÃ¡ticos)", value: valoracion.observacionesTrauma },
  ];

  // Paso 3: Enfermedad CrÃ³nica
  const enfermedadCronica = [
    { label: "Observaciones (Enfermedad CrÃ³nica)", value: valoracion.observacionesCronica },
    { label: "Enfermedades de transmisiÃ³n sexual", value: valoracion.observacionesETS },
    { label: "Observaciones PsicolÃ³gicas", value: valoracion.observacionesPsico },
    { label: "Observaciones (QuirÃºrgicos)", value: valoracion.observacionesQx },
    { label: "Familiares", value: valoracion.familiares },
    { label: "TÃ³xicos", value: valoracion.toxicos },
  ];

  // Paso 4: DinÃ¡mica ObstÃ©trica / GinecolÃ³gica
  const obstetrica = [
    { label: "No. Embarazos", value: valoracion.numEmbarazos },
    { label: "No. Abortos", value: valoracion.numAbortos },
    { label: "No. Partos Vaginales", value: valoracion.numPartosVaginales },
    { label: "No. CesÃ¡reas", value: valoracion.numCesareas },
    { label: "Hijos", value: valoracion.hijos },
    { label: "Actividad fÃ­sica durante la gestaciÃ³n", value: valoracion.actividadFisicaGestacion },
    { label: "MedicaciÃ³n durante gestaciÃ³n", value: valoracion.medicacionGestacion },
    { label: "Trabajo de parto - dilataciÃ³n", value: valoracion.trabajoPartoDilatacion },
    { label: "Desarrollo del expulsivo", value: valoracion.trabajoPartoExpulsivo },
    { label: "TÃ©cnica de expulsivo", value: valoracion.tecnicaExpulsivo },
    { label: "Observaciones", value: valoracion.observacionesDinamica },
    { label: "Actividad fÃ­sica postparto", value: valoracion.actividadFisicaPostparto },
    { label: "Incontinencia urinaria tras el parto", value: valoracion.incontinenciaUrinaria ? "SÃ­" : "No" },
    { label: "Incontinencia fecal", value: valoracion.incontinenciaFecal ? "SÃ­" : "No" },
    { label: "Gases vaginales", value: valoracion.gasesVaginales ? "SÃ­" : "No" },
    { label: "Bulto vaginal", value: valoracion.bultoVaginal ? "SÃ­" : "No" },
  ];

  // Paso 5: DinÃ¡mica Menstrual
  const menstrual = [
    { label: "Edad Menarquia", value: valoracion.edadMenarquia },
    { label: "Edad Menopausia", value: valoracion.edadMenopausia },
    { label: "DÃ­as de menstruaciÃ³n", value: valoracion.diasMenstruacion },
    { label: "Intervalo entre periodo", value: valoracion.intervaloPeriodo },
    { label: "CaracterÃ­sticas del sangrado", value: valoracion.caracSangrado },
    { label: "Algias durante el periodo", value: valoracion.algiasPeriodo },
    { label: "Observaciones", value: valoracion.observacionesMenstrual },
    { label: "Durante los dÃ­as de sangrado usa", value: valoracion.productoMenstrual },
    { label: "Dolor menstrual", value: valoracion.dolorMenstrual ? "SÃ­" : "No" },
    { label: "UbicaciÃ³n dolor menstrual", value: valoracion.ubicacionDolorMenstrual },
    { label: "Factores perpetuadores", value: valoracion.factoresPerpetuadores },
    { label: "Factores calmantes", value: valoracion.factoresCalmantes },
    { label: "MÃ©todos anticonceptivos", value: valoracion.anticonceptivo },
    { label: "Intentos de embarazo", value: valoracion.intentosEmbarazo },
    { label: "No me quedo embarazada", value: valoracion.noMeQuedoEmbarazada ? "SÃ­" : "No" },
    { label: "FecundaciÃ³n in Vitro", value: valoracion.fecundacionInVitro ? "SÃ­" : "No" },
    { label: "Tratamiento Hormonal", value: valoracion.tratamientoHormonal ? "SÃ­" : "No" },
    { label: "InseminaciÃ³n Artificial", value: valoracion.inseminacionArtificial ? "SÃ­" : "No" },
  ];

  // Paso 6: DinÃ¡mica Miccional
  const miccional = [
    { label: "Protector/Toalla/PaÃ±al", value: valoracion.protectorMiccional },
    { label: "Tipo de ropa interior", value: valoracion.ropaInterior },
    { label: "NÂ° Micciones al dÃ­a", value: valoracion.numMiccionesDia },
    { label: "Cada cuÃ¡ntas horas", value: valoracion.cadaCuantasHoras },
    { label: "NÂ° Micciones en la noche", value: valoracion.numMiccionesNoche },
    { label: "CaracterÃ­sticas de la micciÃ³n", value: valoracion.caracMiccion },
    { label: "Vaciado completo", value: valoracion.vaciadoCompleto ? "SÃ­" : "No" },
    { label: "Vaciado incompleto", value: valoracion.vaciadoIncompleto ? "SÃ­" : "No" },
    { label: "Postura miccional sentado", value: valoracion.posturaSentado ? "SÃ­" : "No" },
    { label: "Postura miccional hiperpresivo", value: valoracion.posturaHiperpresivo ? "SÃ­" : "No" },
    { label: "Forma de micciÃ³n", value: valoracion.formaMiccion },
    { label: "Empujar para comenzar", value: valoracion.empujarComenzar ? "SÃ­" : "No" },
    { label: "Empujar para terminar", value: valoracion.empujarTerminar ? "SÃ­" : "No" },
    { label: "Tipo de incontinencia", value: valoracion.incontinenciaEsfuerzoRie || valoracion.incontinenciaEsfuerzoSalta || valoracion.incontinenciaEsfuerzoCorre || valoracion.incontinenciaUrgencia || valoracion.incontinenciaMixta },
    { label: "Dolor al orinar", value: valoracion.dolorOrinar },
  ];

  // Paso 7: ICIQ-SF
  const iciq = [
    { label: "Frecuencia de pÃ©rdida de orina", value: valoracion.icicq_frecuencia },
    { label: "Cantidad de orina que se escapa", value: valoracion.icicq_cantidad },
    { label: "Impacto en la vida diaria", value: valoracion.icicq_impacto },
    { label: "Â¿CuÃ¡ndo pierde orina?", value: valoracion.icicq_cuando },
  ];

  // Paso 8: DinÃ¡mica Defecatoria y Sexual
  const defecatoria = [
    { label: "No. defecaciones al dÃ­a", value: valoracion.numDefecacionesDia },
    { label: "No. Defecaciones en la noche", value: valoracion.numDefecacionesNoche },
    { label: "No. Defecaciones a la semana", value: valoracion.numDefecacionesSemana },
    { label: "Postura defecatoria", value: valoracion.posturaDefecatoria },
    { label: "Forma de defecaciÃ³n", value: valoracion.formaDefecacion },
    { label: "Dolor (Tipo â€“ localizaciÃ³n)", value: valoracion.dolorDefecacion },
    { label: "Escala de Bristol", value: valoracion.escalaBristol },
    { label: "Gases", value: valoracion.gases },
    { label: "LubricaciÃ³n", value: valoracion.lubricacion },
    { label: "Orgasmos", value: valoracion.orgasmo },
    { label: "DisfunciÃ³n OrgÃ¡smica", value: valoracion.disfuncionOrgasmica },
    { label: "IU Durante la penetraciÃ³n", value: valoracion.iuPenetracion },
    { label: "Tipo de RelaciÃ³n y DinÃ¡mica Sexual", value: valoracion.dinamicaSexual },
    { label: "MasturbaciÃ³n", value: valoracion.masturbacion },
    { label: "Historia Sexual", value: valoracion.historiaSexual },
    { label: "Factores emocionales y dolor", value: valoracion.factorEmocional },
    { label: "Dolor sexual", value: valoracion.dolorSexual },
    { label: "Relaciones Sexuales", value: valoracion.relacionesSexuales },
    { label: "Dolor en el introito", value: valoracion.dolorIntroito },
    { label: "Dolor al Fondo", value: valoracion.dolorFondo },
    { label: "Dolor irradiado a", value: valoracion.dolorIrradiado },
    { label: "Dolor perineal", value: valoracion.dolorPerineal },
  ];

  // Paso 9: EvaluaciÃ³n FisioterapÃ©utica
  const fisioterapeutica = [
    { label: "Marcha", value: valoracion.marcha },
    { label: "Postura (L3- Ombligo)", value: valoracion.postura },
    { label: "Diafragma Orofaringeo", value: valoracion.diafragmaOrofaringeo },
    { label: "Diafragma TorÃ¡cico", value: valoracion.diafragmaToracico },
    { label: "Testing Centro FrÃ©nico", value: valoracion.testingCentroFrenico },
    { label: "Testing de Pilares", value: valoracion.testingPilares },
    { label: "Testing de TraslaciÃ³n Arco Costal", value: valoracion.testingArcoCostal },
    { label: "Diafragma PÃ©lvico", value: valoracion.diafragmaPelvico },
    { label: "Tipo de Pelvis", value: valoracion.tipoPelvis },
    { label: "Abdomen (Test de Tos)", value: valoracion.abdomenTestTos },
    { label: "Diastasis", value: valoracion.diastasis },
    { label: "Supraumbilical", value: valoracion.supraumbilical },
    { label: "Umbilical", value: valoracion.umbilical },
    { label: "Infraumbilical", value: valoracion.infraumbilical },
    { label: "Movilidad", value: valoracion.movilidad },
    { label: "Test DinÃ¡micos", value: valoracion.testDinamicos },
    { label: "Vulva", value: valoracion.vulva },
    { label: "Mucosa", value: valoracion.mucosa },
    { label: "Labios", value: valoracion.labios },
    { label: "LubricaciÃ³n Perineal", value: valoracion.lubricacionPerineal },
    { label: "Flujo Olor â€“ Color", value: valoracion.flujoOlorColor },
    { label: "Ph (Epitelio Vaginal)", value: valoracion.phVaginal },
    { label: "Vagina", value: valoracion.vagina },
    { label: "DiÃ¡metro apertura de la vagina/introito", value: valoracion.diametroIntroito },
    { label: "ClÃ­toris", value: valoracion.clitoris },
    { label: "Destapar CapuchÃ³n (Dolor)", value: valoracion.capuchonDolor },
    { label: "Muevo Vulva Hacia Arriba ClÃ­toris se eleva", value: valoracion.vulvaClitoris },
    { label: "Sensibilidad (Cada Lado)", value: valoracion.sensibilidadLados },
    { label: "Hemorroides â€“ Varices Vulvares", value: valoracion.hemorroidesVarices },
    { label: "Cicatrices", value: valoracion.cicatrices },
    { label: "CirugÃ­as EstÃ©ticas", value: valoracion.cirugiasEsteticas },
    { label: "GlÃ¡ndulas De Skene EyaculaciÃ³n", value: valoracion.glandulasSkene },
    { label: "GlÃ¡ndulas De Bartolini LubricaciÃ³n", value: valoracion.glandulasBartolini },
    { label: "Elasticidad de La Orquilla Vulvar", value: valoracion.elasticidadOrquilla },
    { label: "Uretra â€“ Vagina â€“ Ano", value: valoracion.uretraVaginaAno },
    { label: "Distancia Ano-Vulvar", value: valoracion.distanciaAnoVulvar },
    { label: "DiÃ¡metro Bituberoso", value: valoracion.diametroBituberoso },
    { label: "NÃºcleo Central Del PerinÃ©", value: valoracion.nucleoCentralPerine },
    { label: "ContracciÃ³n y Observar", value: valoracion.contraccionObservar },
    { label: "Reflejo de Tos (Ano Cierra)", value: valoracion.reflejoTosAno ? "SÃ­" : "No" },
    { label: "Prurito", value: valoracion.prurito ? "SÃ­" : "No" },
    { label: "Escozor", value: valoracion.escozor ? "SÃ­" : "No" },
    { label: "ValoraciÃ³n neurolÃ³gica", value: valoracion.valoracionNeuro },
  ];

  // Paso 10: PalpaciÃ³n Interna
  const palpacionInterna = [
    { label: "CÃºpulas", value: valoracion.cupulaDerecha || valoracion.cupulaIzquierda },
    { label: "Tono General", value: valoracion.tonoGeneral },
    { label: "Observaciones sobre el tono", value: valoracion.tonoObservaciones },
    { label: "Capacidad ContrÃ¡ctil General", value: valoracion.capacidadContractil },
    { label: "Fuerza Oxford Global", value: valoracion.oxfordGlobal },
    { label: "Fuerza Oxford Derecha", value: valoracion.oxfordDerecha },
    { label: "Fuerza Oxford Izquierda", value: valoracion.oxfordIzquierda },
    { label: "PERFECT Power", value: valoracion.perfectPower },
    { label: "PERFECT Endurance", value: valoracion.perfectEndurance },
    { label: "PERFECT Repetitions", value: valoracion.perfectRepetitions },
    { label: "PERFECT Fast", value: valoracion.perfectFast },
    { label: "PERFECT ECT", value: valoracion.perfectECT },
  ];

  // Paso 11: EvaluaciÃ³n TRP
  const trp = [
    { label: "Ligamentos/MÃºsculos ExopÃ©lvicos", value: valoracion.ligamentosMusculos },
    { label: "Prolapsos OrganopÃ©lvicos", value: valoracion.prolapsos },
    { label: "Ligamentos/MÃºsculos EndopÃ©lvicos", value: valoracion.ligEndopelvicos },
    { label: "Dolor", value: valoracion.dolorTRP },
    { label: "DiagnÃ³stico fisioterapÃ©utico", value: valoracion.diagnosticoFisio },
    { label: "Plan de intervenciÃ³n", value: valoracion.planIntervencion },
  ];

  // Paso 12: Consentimiento
  const consentimiento = [
    { label: "Fecha consentimiento", value: valoracion.consentimientoFecha },
    { label: "Ciudad", value: valoracion.consentimientoCiudad },
    { label: "Nombre completo", value: valoracion.consentimientoNombre },
    { label: "CC No.", value: valoracion.consentimientoCC },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-purple-100 to-green-100 py-10 px-2">
      <div className="max-w-5xl w-full mx-auto bg-white p-8 rounded-3xl shadow-2xl border border-indigo-100">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4">
          <h2 className="text-3xl font-extrabold text-indigo-800 text-center drop-shadow">
            Detalle ValoraciÃ³n Piso PÃ©lvico
          </h2>
          {paciente && (
            <div className="mt-2 md:mt-0 text-sm text-gray-600 text-center md:text-right">
              <div>
                <span className="font-semibold">Paciente:</span>{" "}
                {paciente.nombres || <span className="text-gray-400">Sin nombre</span>}
              </div>
              <div>
                <span className="font-semibold">CÃ©dula:</span>{" "}
                {paciente.cedula || <span className="text-gray-400">Sin cÃ©dula</span>}
              </div>
            </div>
          )}
        </div>

        {pacienteError && (
          <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6 rounded-r-lg">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">
                  InformaciÃ³n del paciente no disponible
                </h3>
                <div className="mt-2 text-sm text-yellow-700">
                  <p>No se pudo obtener la informaciÃ³n del paciente asociado a esta valoraciÃ³n (ID: {typeof valoracion.paciente === 'object' ? valoracion.paciente?._id || JSON.stringify(valoracion.paciente) : valoracion.paciente}). Es posible que el paciente haya sido eliminado del sistema.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        <Card title="Datos Generales">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-1">
            {datosGenerales.map(({ label, value }) => (
              <Field key={label} label={label} value={renderValue(value)} />
            ))}
          </div>
        </Card>

        <Card title="Estado de Salud">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-1">
            {estadoSalud.map(({ label, value }) => (
              <Field key={label} label={label} value={renderValue(value)} />
            ))}
          </div>
        </Card>

        <Card title="Enfermedad CrÃ³nica y Antecedentes">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-1">
            {enfermedadCronica.map(({ label, value }) => (
              <Field key={label} label={label} value={renderValue(value)} />
            ))}
          </div>
        </Card>

        <Card title="DinÃ¡mica ObstÃ©trica / GinecolÃ³gica">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-1">
            {obstetrica
              .filter(({ label }) => label !== "Hijos")
              .map(({ label, value }) => (
                <Field key={label} label={label} value={renderValue(value)} />
              ))}
          </div>
          {valoracion.hijos && valoracion.hijos.length > 0 && (
            <div className="mt-6">
              <h4 className="font-bold text-indigo-700 mb-2">Hijos</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {valoracion.hijos.map((obj, idx) => (
                  <div
                    key={idx}
                    className="bg-white border border-indigo-200 rounded-xl p-4 shadow w-full"
                  >
                    <div className="grid grid-cols-1 gap-y-1">
                      {Object.entries(obj).filter(([k]) => k !== "_id").map(([k, v]) => (
                        <div key={k} className="mb-1">
                          <span className="font-semibold">
                            {k === "nombre" ? "Nombre" :
                              k === "fechaNacimiento" ? "Fecha Nacimiento" :
                              k === "peso" ? "Peso" :
                              k === "talla" ? "Talla" :
                              k === "tipoParto" ? "Tipo Parto" :
                              k === "semana" ? "Semana" :
                              k.replace(/([A-Z])/g, " $1").replace(/^./, s => s.toUpperCase())
                            }
                            :
                          </span>{" "}
                          <span>{v || <span className="text-gray-400">Sin dato</span>}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Card>

        <Card title="DinÃ¡mica Menstrual">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-1">
            {menstrual.map(({ label, value }) => (
              <Field key={label} label={label} value={renderValue(value)} />
            ))}
          </div>
        </Card>

        <Card title="DinÃ¡mica Miccional">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-1">
            {miccional.map(({ label, value }) => (
              <Field key={label} label={label} value={renderValue(value)} />
            ))}
          </div>
        </Card>

        <Card title="ICIQ-SF - Incontinencia Urinaria">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-1">
            {iciq.map(({ label, value }) => (
              <Field key={label} label={label} value={renderValue(value)} />
            ))}
          </div>
        </Card>

        <Card title="DinÃ¡mica Defecatoria y Sexual">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-1">
            {defecatoria.map(({ label, value }) => (
              <Field key={label} label={label} value={renderValue(value)} />
            ))}
          </div>
        </Card>

        <Card title="EvaluaciÃ³n FisioterapÃ©utica">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-1">
            {fisioterapeutica.map(({ label, value }) => (
              <Field key={label} label={label} value={renderValue(value)} />
            ))}
          </div>
        </Card>

        <Card title="PalpaciÃ³n Interna">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-1">
            {palpacionInterna.map(({ label, value }) => (
              <Field key={label} label={label} value={renderValue(value)} />
            ))}
          </div>
        </Card>

        <Card title="EvaluaciÃ³n TRP">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-1">
            {trp.map(({ label, value }) => (
              <Field key={label} label={label} value={renderValue(value)} />
            ))}
          </div>
        </Card>

       
        {/* Firmas */}
        <Card title="Firmas">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
            <div>
              <strong>Firma paciente:</strong>
              {valoracion.firmaPaciente && (
                <img src={valoracion.firmaPaciente} alt="Firma paciente" className="h-12 mt-1 border" />
              )}
            </div>
            <div>
              <strong>Firma fisioterapeuta:</strong>
              {valoracion.firmaFisioterapeuta && (
                <img src={valoracion.firmaFisioterapeuta} alt="Firma fisioterapeuta" className="h-12 mt-1 border" />
              )}
            </div>
          </div>
        </Card>

        {/* AutorizaciÃ³n imÃ¡genes */}
        <Card title="AutorizaciÃ³n de uso de imÃ¡genes">
          <div className="mb-2 text-gray-700">
            Autorizo a D&#39;Mamitas &amp; Babies para reproducir fotografÃ­as e imÃ¡genes de las actividades en las que participe, para ser utilizadas en sus publicaciones, proyectos, redes sociales y pÃ¡gina web.
          </div>
          <div>
            <strong>Firma autorizaciÃ³n imÃ¡genes:</strong>
            {valoracion.firmaAutorizacion && (
              <img src={valoracion.firmaAutorizacion} alt="Firma autorizaciÃ³n" className="h-12 mt-1 border" />
            )}
          </div>
        </Card>
         {/* Consentimiento Informado */}
        <Card title="Consentimiento Informado">
          <div className="mb-4 bg-gray-50 p-4 rounded text-justify text-sm border max-h-96 overflow-y-auto">
            <p>
              Reconozco y entiendo que me han remitido o que he venido por voluntad propia a fisioterapia pÃ©lvica para que se me realice una evaluaciÃ³n y tratamiento de la(s) disfunciÃ³n(es) de mi piso pÃ©lvico.<br /><br />
              La/el fisioterapeuta pÃ©lvica(o) me ha enseÃ±ado la anatomÃ­a bÃ¡sica del piso pÃ©lvico, sus funciones y la relaciÃ³n con mi disfunciÃ³n(es) actual(es).<br /><br />
              Entiendo que para evaluar y tratar mi condiciÃ³n serÃ¡ necesario, inicial y periÃ³dicamente, que mi fisioterapeuta realice un examen de inspecciÃ³n y palpaciÃ³n detallada del Ã¡rea abdominal, lumbar, pÃ©lvica y genital externa, asÃ­ como la palpaciÃ³n interna especÃ­fica a travÃ©s de la vagina y/o ano segÃºn se requiera y sea posible, para lo cual serÃ¡ necesario que me desvista dejando expuestas estas regiones de mi cuerpo.<br /><br />
              Este examen incluirÃ¡, entre otras cosas, la evaluaciÃ³n del estado de la piel, el tejido erÃ©ctil, los reflejos, la presencia de tensiÃ³n muscular, la estructura y el tono muscular, la fuerza y la resistencia, la movilidad de las cicatrices y la funciÃ³n del piso pÃ©lvico en general.<br /><br />
              Comprendo que durante la evaluaciÃ³n tambiÃ©n se me solicitarÃ¡n actividades como la tos, el pujo y la valsalva mÃ¡xima, ademÃ¡s de diferentes movimientos con los mÃºsculos del piso pÃ©lvico.<br /><br />
              Tengo conciencia de que la evaluaciÃ³n y tratamiento de fisioterapia pÃ©lvica, puede requerir la aplicaciÃ³n de procedimientos o tÃ©cnicas que pueden ser tanto externas a nivel del abdomen, regiÃ³n lumbar, pelvis y zona genital, vulvar y/o anal, como internas en el canal vaginal y/o rectal con el fin de alcanzar los objetivos terapÃ©uticos para mejorar o erradicar los sÃ­ntomas de mi(s) disfunciÃ³n(es).<br /><br />
              Estas tÃ©cnicas pueden incluir pero no estÃ¡n limitadas a: tÃ©cnicas manuales (digitopresiÃ³n, masaje, tracciÃ³n, movilizaciÃ³n, entre otras) o tÃ©cnicas con equipos (electroterapia con electrodo intracavitario o adhesivo, biofeedback con electrodo intracavitario o adhesivo, masajeadores con y sin vibraciÃ³n, masajeadores tÃ©rmicos, paquetes frÃ­os o calientes, bolitas pÃ©lvicas, pesas vaginales, balones vaginales/ rectales, dilatadores vaginales/anales, bombas de vacÃ­o, fotobiomodulaciÃ³n, radiofrecuencia, ecografÃ­a, etc).<br /><br />
              TambiÃ©n soy consciente de que mi tratamiento puede involucrar ejercicios de movilidad pÃ©lvica con o sin balÃ³n, ejercicio de resistencia cardiovascular, de resistencia y fuerza muscular general y de flexibilidad, como tambiÃ©n entrenamiento especÃ­fico del piso pÃ©lvico.<br /><br />
              Entiendo que deberÃ© realizar en casa, una pauta de ejercicios tal y como la fisioterapeuta pÃ©lvica me lo indique, pudiendo ser Ã©sta de ejercicios especÃ­ficos de contracciÃ³n/relajaciÃ³n de la musculatura pÃ©lvica con o sin la aplicaciÃ³n de herramientas terapÃ©uticas, ejercicios funcionales, automasaje manual o instrumentalizado o de flexibilidad muscular.<br /><br />
              <b>Posibles riesgos:</b> reconozco que una evaluaciÃ³n completa del piso pÃ©lvico y/o un tratamiento de fisioterapia pÃ©lvica pueden aumentar mi nivel actual de dolor o malestar, o agravar mi disfunciÃ³n o sÃ­ntomas existentes y que este malestar suele ser temporal. Si no desaparece en 1-3 dÃ­as, acepto ponerme en contacto con mi fisioterapeuta.<br /><br />
              Dentro de los malestares fÃ­sicos temporales, pueden presentarse los siguientes: Dolor, ardor, sensaciÃ³n de calambre, sangrado de la mucosa, ganas de orinar o defecar, escape de gases anales o vaginales, mareo, taquicardia, bradicardia o hipotensiÃ³n momentÃ¡nea.<br /><br />
              Dentro de las incomodidades psicolÃ³gicas o emocionales pueden presentarse: VergÃ¼enza, nerviosismo, ansiedad o temor principalmente en la sesiÃ³n de evaluaciÃ³n por ser la primera vez en fisioterapia pÃ©lvica.<br /><br />
              <b>Posibles beneficios:</b> una evaluaciÃ³n completa del piso pÃ©lvico y/o un tratamiento de fisioterapia pÃ©lvica pueden aliviar mis sÃ­ntomas, mejorando mi calidad de vida y aumentando mi capacidad para realizar mis actividades diarias. Es posible que experimente un aumento de la fuerza, la conciencia, la flexibilidad y la resistencia de los mÃºsculos de mi piso pÃ©lvico e igualmente, puede que note una disminuciÃ³n del dolor o los malestares asociados a la disfunciÃ³n que tengo. TambiÃ©n podrÃ© adquirir un mayor conocimiento sobre mi disfunciÃ³n y serÃ© mÃ¡s consciente de los recursos disponibles para manejar mis sÃ­ntomas y mejorar mi condiciÃ³n.<br /><br />
              <b>No garantÃ­a:</b> comprendo que la/el fisioterapeuta no puede hacer promesas ni garantÃ­as con respecto a la cura o la completa mejora de mi disfunciÃ³n. Entiendo que mi fisioterapeuta compartirÃ¡ su opiniÃ³n profesional conmigo sobre los posibles resultados de la fisioterapia y analizarÃ¡ todas las opciones de tratamiento antes de que yo dÃ© mi consentimiento para el tratamiento, basado en los resultados subjetivos y objetivos de la evaluaciÃ³n.<br /><br />
              Entiendo que tengo el derecho a revocar mi consentimiento en cualquier momento y que mi consentimiento verbal serÃ¡ obtenido continuamente a lo largo de las sesiones. Yo estarÃ© siempre en control de mi propio cuerpo y de las actividades que me sean solicitadas realizar en la consulta con la/el fisioterapeuta.<br /><br />
              Al firmar este documento, acepto que he leÃ­do y entendido el CONSENTIMIENTO INFORMADO PARA EVALUACIÃ“N Y TRATAMIENTO DE FISIOTERAPIA PÃ‰LVICA y que doy mi consentimiento para la evaluaciÃ³n y tratamiento de mi piso pÃ©lvico.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {consentimiento.map(({ label, value }) => (
              <div key={label}>
                <span className="font-semibold">{label}:</span>{" "}
                <span>{value || <span className="text-gray-400">Sin dato</span>}</span>
              </div>
            ))}
          </div>
          <div className="flex flex-col items-center mt-4">
            <label className="font-semibold mb-2">Firma consentimiento:</label>
            {valoracion.consentimientoFirma ? (
              <img src={valoracion.consentimientoFirma} alt="Firma consentimiento" className="h-12 mt-1 border" />
            ) : (
              <div className="w-48 h-12 border border-dashed border-gray-400 rounded flex items-center justify-center text-gray-400">
                Sin firma
              </div>
            )}
          </div>
        </Card>


        {/* Botones de acciÃ³n */}
        <div className="mt-8 text-center flex flex-col sm:flex-row justify-center gap-4">
          <Link
            to={`/valoraciones-piso-pelvico/${valoracion._id}/editar`}
            className="bg-yellow-400 hover:bg-yellow-500 text-white font-bold px-6 py-3 rounded-xl shadow transition flex items-center gap-2 text-lg justify-center"
          >
            <PencilSquareIcon className="h-6 w-6" />
            Editar
          </Link>
          
          <button
            onClick={exportarAWord}
            disabled={exportando}
            className="bg-green-500 hover:bg-green-600 disabled:bg-green-300 text-white font-bold px-6 py-3 rounded-xl shadow transition flex items-center gap-2 text-lg justify-center"
          >
            <DocumentArrowDownIcon className="h-6 w-6" />
            {exportando ? 'Exportando...' : 'Exportar a Word'}
          </button>
          
          <Link
            to="/valoraciones-piso-pelvico"
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold px-6 py-3 rounded-xl shadow transition flex items-center gap-2 text-lg justify-center"
          >
            <ArrowLeftIcon className="h-6 w-6" />
            Volver a la lista
          </Link>
        </div>
      </div>
    </div>
  );
}
