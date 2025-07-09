import React, { useState, useEffect } from "react";
import { apiRequest, API_CONFIG } from "../../config/api";

import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Paso1DatosGenerales from "./Paso1DatosGenerales";
import Paso2EstadoSalud from "./Paso2EstadoSalud";
import Paso3EnfermedadCronica from "./Paso3EnfermedadCronica";
import Paso4DinamicaObstetrica from "./Paso4DinamicaObstetrica";
import Paso5DinamicaMenstrual from "./Paso5DinamicaMenstrual";
import Paso6DinamicaMiccional from "./Paso6DinamicaMiccional";
import Paso7ICIQSF from "./Paso7ICIQSF";
import Paso8DinamicaDefecatoria from "./Paso8DinamicaDefecatoria";
import Paso9EvaluacionFisioterapeutica from "./Paso9EvaluacionFisioterapeutica";
import Paso10PalpacionInterna from "./Paso10PalpacionInterna";
import Paso11EvaluacionTRP from "./Paso11EvaluacionTRP";
import Paso12Consentimiento from "./Paso12Consentimiento";

// Funciones de utilidad para S3
async function subirFirmaAS3(firmaBase64) {
  function dataURLtoFile(dataurl, filename) {
    const arr = dataurl.split(",");
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  }
  const file = dataURLtoFile(firmaBase64, 'firma.png');
  const formData = new FormData();
  formData.append('imagen', file);

  const res = await fetch(`${API_CONFIG.BASE_URL}/api/upload`, {
    method: 'POST',
    body: formData,
  });
  const data = await res.json();
  return data.url; // URL pública de S3
}

async function eliminarImagenDeS3(imageUrl) {
  try {
    console.log(`Intentando eliminar imagen de S3: ${imageUrl}`);
    
    const res = await fetch(`${API_CONFIG.BASE_URL}/api/delete-image`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ imageUrl }),
    });
    
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(`Error al eliminar imagen: ${errorData.error || res.statusText}`);
    }
    
    const data = await res.json();
    console.log(`✓ Imagen eliminada exitosamente:`, data);
    return data;
  } catch (error) {
    console.error('Error eliminando imagen de S3:', error);
    return { error: error.message };
  }
}

const FORMULARIO_INICIAL = {
  // Paso 1: Datos Generales
  nombres: "",
  cedula: "",
  genero: "",
  lugarNacimiento: "",
  fechaNacimiento: "",
  edad: "",
  estadoCivil: "",
  direccion: "",
  telefono: "",
  celular: "",
  ocupacion: "",
  nivelEducativo: "",
  medicoTratante: "",
  aseguradora: "",
  acompanante: "",
  telefonoAcompanante: "",
  nombreBebe: "",
  semanasGestacion: "",
  fum: "",
  fechaProbableParto: "",
  fecha: "",
  hora: "",
  motivoConsulta: "",

  // Paso 2: Estado de Salud
  temperatura: "",
  ta: "",
  fr: "",
  fc: "",
  pesoPrevio: "",
  pesoActual: "",
  talla: "",
  imc: "",
  deporteActual: "",
  observacionesAvd: "",
  infoMedicacion: "",
  farmacoOtros: "",
  alergias: "",
  ultimaAnalitica: "",
  patologiaCardio: "",
  patologiaNeuro: "",
  observacionesTrauma: "",
  // AVD/Trabajo
  avd_bipedestación: false,
  avd_sedestación: false,
  avd_cargas: false,
  avd_conducción: false,
  avd_marcha: false,
  avd_oficina: false,
  avd_homeworking: false,
  // Farmacológicos
  farmaco_antihipertensivo: false,
  farmaco_antidepresivo: false,
  farmaco_ansiolítico: false,
  farmaco_antibiótico: false,
  farmaco_vitaminas: false,
  farmaco_antioxidantes: false,
  farmaco_complementación_natural: false,
  // Traumáticos
  trauma_accidente_de_tráfico: false,
  trauma_caída_sobre_coxis: false,
  trauma_caída_sobre_espalda: false,
  trauma_golpe_abdominal: false,
  trauma_golpe_en_la_cabeza: false,

  // Paso 3: Enfermedad Crónica
  cronica_diabetes: false,
  cronica_hipotiroidismo: false,
  cronica_hipertiroidismo: false,
  cronica_hipertenso: false,
  cronica_hipercolesterolemia: false,
  cronica_asma: false,
  cronica_artrosis: false,
  cronica_osteoporosis: false,
  cronica_hernia_cervical: false,
  cronica_hernia_dorsal: false,
  cronica_hernia_lumbar: false,
  cronica_hernia_abdominal: false,
  cronica_hernia_inguinal: false,
  observacionesCronica: "",
  observacionesETS: "",
  psico_duelos: false,
  psico_ruptura_relación: false,
  observacionesPsico: "",
  qx_cirugía_torácica: false,
  qx_cirugía_abdominal: false,
  qx_cirugía_pélvica: false,
  qx_cirugía_hernia: false,
  qx_proceso_oncológico: false,
  observacionesQx: "",
  familiares: "",
  toxicos: "",

  // Paso 4: Dinámica Obstétrica/Ginecológica
  numEmbarazos: "",
  numAbortos: "",
  numPartosVaginales: "",
  numCesareas: "",
  hijos: [
    { nombre: "", fechaNacimiento: "", peso: "", talla: "", tipoParto: "", semana: "" }
  ],
  actividadFisicaGestacion: "",
  medicacionGestacion: "",
  trabajoPartoDilatacion: "",
  trabajoPartoExpulsivo: "",
  tecnicaExpulsivo_kristeller: false,
  tecnicaExpulsivo_episiotomía_sin_desgarro: false,
  tecnicaExpulsivo_episiotomía_con_desgarro: false,
  tecnicaExpulsivo_vacuum: false,
  tecnicaExpulsivo_fórceps: false,
  tecnicaExpulsivo_espátulas: false,
  tecnicaExpulsivo_respetado: false,
  tecnicaExpulsivo_eutócico: false,
  tecnicaExpulsivo_natural: false,
  tecnicaExpulsivo_hipopresivo_con_grupo_sinergistas: false,
  tecnicaExpulsivo_desgarro_sin_episiotomía: false,
  observacionesDinamica: "",
  actividadFisicaPostparto: "",
  incontinenciaUrinaria: false,
  incontinenciaFecal: false,
  gasesVaginales: false,
  bultoVaginal: false,

  // Paso 5: Dinámica Menstrual
  edadMenarquia: "",
  edadMenopausia: "",
  diasMenstruacion: "",
  intervaloPeriodo: "",
  caracSangrado_fluido: false,
  caracSangrado_espeso: false,
  caracSangrado_entrecortado: false,
  caracSangrado_coágulos: false,
  caracSangrado_oxidado: false,
  caracSangrado_olor_sangre: false,
  caracSangrado_olor_lubricación: false,
  sintomaMenstrual_todos_los_días: false,
  sintomaMenstrual_síndrome_ovulatorio: false,
  sintomaMenstrual_síndrome_premenstrual: false,
  algiasPeriodo: "",
  observacionesMenstrual: "",
  productoMenstrual_copa_menstrual: false,
  productoMenstrual_tampones: false,
  productoMenstrual_compresa_desechable: false,
  productoMenstrual_compresa_reutilizable: false,
  productoMenstrual_bragas_menstruales: false,
  productoMenstrual_anillo_vaginal: false,
  dolorMenstrual: false,
  ubicacionDolorMenstrual: "",
  factoresPerpetuadores: "",
  factoresCalmantes: "",
  anticonceptivo_píldora: false,
  anticonceptivo_diu: false,
  anticonceptivo_preservativo: false,
  anticonceptivo_parches: false,
  anticonceptivo_diafragma: false,
  anticonceptivo_anillo_vaginal: false,
  tipoAnticonceptivo: "",
  intentosEmbarazo: "",
  noMeQuedoEmbarazada: false,
  fecundacionInVitro: false,
  tratamientoHormonal: false,
  inseminacionArtificial: false,

  // Paso 6: Dinámica Miccional
  protectorMiccional: "",
  ropaInterior: "",
  numMiccionesDia: "",
  cadaCuantasHoras: "",
  numMiccionesNoche: "",
  caracMiccion_normal: false,
  caracMiccion_irritativo: false,
  caracMiccion_urgente: false,
  caracMiccion_doloroso: false,
  deseoMiccional: "",
  vaciadoCompleto: false,
  vaciadoIncompleto: false,
  posturaSentado: false,
  posturaHiperpresivo: false,
  formaMiccion_constante: false,
  formaMiccion_cortada: false,
  formaMiccion_lateralizada: false,
  formaMiccion_inclinada_anterior: false,
  formaMiccion_explosiva: false,
  formaMiccion_aspersor: false,
  formaMiccion_bifurcada: false,
  formaMiccion_débil: false,
  empujarComenzar: false,
  empujarTerminar: false,
  incontinenciaEsfuerzoRie: false,
  incontinenciaEsfuerzoSalta: false,
  incontinenciaEsfuerzoCorre: false,
  incontinenciaEsfuerzoOtros: "",
  incontinenciaUrgencia: false,
  incontinenciaMixta: false,
  dolorOrinar: "",

  // Paso 7: ICIQ-SF
  icicq_frecuencia: "",
  icicq_cantidad: "",
  icicq_impacto: "",
  icicq_cuando_nunca: false,
  icicq_cuando_antes_de_llegar_al_servicio: false,
  icicq_cuando_al_toser_o_estornudar: false,
  icicq_cuando_mientras_duerme: false,
  icicq_cuando_al_realizar_esfuerzos_físicos_ejercicio: false,
  icicq_cuando_cuando_termina_de_orinar_y_ya_se_ha_vestido: false,
  icicq_cuando_sin_motivo_evidente: false,
  icicq_cuando_de_forma_continua: false,

  // Paso 8: Dinámica Defecatoria, Sexual, Nutricional, Sueño, Dolor, Exámenes
  numDefecacionesDia: "",
  numDefecacionesNoche: "",
  numDefecacionesSemana: "",
  posturaDefecatoria_sedestación_vertical: false,
  posturaDefecatoria_inclinado_hacia_delante: false,
  posturaDefecatoria_cuclillas: false,
  formaDefecacion_normal: false,
  formaDefecacion_hiperpresivo: false,
  formaDefecacion_dolorosa: false,
  formaDefecacion_cortada: false,
  formaDefecacion_sensación_vaciado_incompleto: false,
  formaDefecacion_cierre_de_ano_antes_de_completar_vaciado: false,
  dolorDefecacion: "",
  escalaBristol: "",
  gases_ausentes: false,
  gases_pocos: false,
  gases_esporádicos: false,
  gases_frecuentes: false,
  gases_diarios: false,
  gases_constantes: false,
  lubricacion_liquida_blanquecina: false,
  lubricacion_densa_granulada: false,
  lubricacion_mal_olor: false,
  lubricacion_ausente: false,
  orgasmo_ausente: false,
  orgasmo_orgasmo_único: false,
  orgasmo_orgasmo_múltiple: false,
  orgasmo_orgasmo_corto: false,
  orgasmo_orgasmo_doloroso: false,
  disfuncionOrgasmica_no_siente: false,
  disfuncionOrgasmica_dolor_que_inhibe_el_orgasmo: false,
  disfuncionOrgasmica_no_logra_clímax: false,
  disfuncionOrgasmica_no_excitación_y_no_resolución: false,
  disfuncionOrgasmica_frigidez: false,
  iuPenetracion: "",
  dinamicaSexual_conflicto: false,
  dinamicaSexual_ausencia_libido: false,
  dinamicaSexual_promiscuo: false,
  dinamicaSexual_no_tiene_pareja: false,
  dinamicaSexual_a_distancia: false,
  masturbacion: "",
  historiaSexual: "",
  factorEmocional_conflicto_familiar: false,
  factorEmocional_conflicto_pareja_anterior: false,
  factorEmocional_abuso: false,
  factorEmocional_maltrato: false,
  factorEmocional_miedo: false,
  factorEmocional_tabú_cultural: false,
  factorEmocional_tabú_religioso: false,
  factorEmocional_autoconocimiento: false,
  dolorSexual_dispareunia: false,
  dolorSexual_alodinia: false,
  dolorSexual_hiperalgesia: false,
  dolorSexual_ardor: false,
  dolorSexual_picazón: false,
  relacionesSexuales: "",
  dolorIntroito: "",
  dolorFondo: "",
  dolorIrradiado: "",
  dolorPerineal: "",
  ingestaLiquida: "",
  tiposLiquidos: "",
  ingestasSolidas: "",
  tipoDieta: "",
  horarioSueno: "",
  horasSueno: "",
  suenoContinuo: "",
  suenoInterrumpido: "",
  inicioDolor: "",
  localizacionDolor: "",
  tipoDolor: "",
  intensidadDolor: "",
  aumentaCon: "",
  disminuyeCon: "",
  examenesPaciente: "",

  // Paso 9: Evaluación Fisioterapéutica
  marcha: "",
  postura: "",
  diafragmaOrofaringeo: "",
  diafragmaToracico: "",
  testingCentroFrenico_8: false,
  testingCentroFrenico_9: false,
  testingCentroFrenico_10: false,
  testingCentroFrenico_11: false,
  testingCentroFrenico_12: false,
  testingCentroFrenico_1: false,
  testingCentroFrenico_2: false,
  testingCentroFrenico_3: false,
  testingCentroFrenico_4: false,
  testingPilares: "",
  testingArcoCostal: "",
  diafragmaPelvico: "",
  tipoPelvis: "",
  abdomenTestTos: "",
  diastasis: "",
  supraumbilical: "",
  umbilical: "",
  infraumbilical: "",
  movilidad: "",
  testDinamicos: "",
  vulva: "",
  mucosa: "",
  labios: "",
  lubricacionPerineal: "",
  flujoOlorColor: "",
  phVaginal: "",
  vagina: "",
  diametroIntroito: "",
  clitoris: "",
  capuchonDolor: "",
  vulvaClitoris: "",
  sensibilidadLados: "",
  hemorroidesVarices: "",
  cicatrices: "",
  cirugiasEsteticas: "",
  glandulasSkene: "",
  glandulasBartolini: "",
  elasticidadOrquilla: "",
  uretraVaginaAno: "",
  distanciaAnoVulvar: "",
  diametroBituberoso: "",
  nucleoCentralPerine: "",
  contraccionObservar: "",
  reflejoTosAno: false,
  prurito: false,
  escozor: false,
  valoracionNeuro_reflejo_clitorideo: false,
  valoracionNeuro_reflejo_bulvocavernoso: false,
  valoracionNeuro_reflejo_anal: false,
  valoracionNeuro_rolling_test: false,
  valoracionNeuro_maniobra_de_valsalva: false,
  valoracionNeuro_sensibilidad_cutánea: false,
  valoracionNeuro_signo_de_tinel_internoexterno: false,

  // Paso 10: Palpación Interna y PERFECT
  cupulaDerecha: false,
  cupulaIzquierda: false,
  tonoGeneral: "",
  tonoObservaciones: "",
  capacidadContractil: "",
  oxfordGlobal: "",
  oxfordDerecha: "",
  oxfordIzquierda: "",
  perfectPower: "",
  perfectEndurance: "",
  perfectRepetitions: "",
  perfectFast: "",
  perfectECT: "",

  // Paso 11: Evaluación TRP Exopélvicos, Prolapso, Endopélvicos
  // Exopélvicos
  ...Object.fromEntries(
    [
      "LIGAMENTO ILIO LUMBAR LIL",
      "LIGAMENTO SACRO ILIACO LSI",
      "LIGAMENTO SACROCIATICO LSC",
      "LIGAMENTO SACROTUBEROSO LST",
      "LIGAMENTO SACROCOCCIGEO LSC",
      "DXTORACICO DXOG",
      "RECTO ABDOMINAL",
      "OBLICUO EXTERNO",
      "OBLICUO INTERNO",
      "PSOAS ILIACO",
      "ERECTORES",
      "CUADRADO LUMBAR",
      "GLUTEO MAYOR",
      "GLUTEO MENOR",
      "ISQUIOTIBIALES",
      "PIRAMIDAL",
      "GLUTEO MEDIO",
      "SARTORIO",
      "PELVITROCANTEREOS",
      "CUADRADO CRURAL",
      "ADUCTORES",
      "CINTURA ESCAPULAR",
      "CUELLO/HOMBRO",
      "INTERESCAPULARES",
      "OTRO MUSCULO"
    ].flatMap(nombre => [
      [`exo_${nombre}_izq_activo`, false],
      [`exo_${nombre}_izq_latente`, false],
      [`exo_${nombre}_der_activo`, false],
      [`exo_${nombre}_der_latente`, false],
    ])
  ),
  // Prolapso
  prolapso_VESICOCELE_grado: "",
  prolapso_URETROCELE_grado: "",
  prolapso_UTEROCELE_grado: "",
  prolapso_RECTOCELE_grado: "",
  prolapso_PROCTOCELE_grado: "",
  prolapso_ELITROCELE___ENTEROCELE_grado: "",
  prolapso_SINDROME_PERINEO_DESCENDENTE_grado: "",
  // Endopélvicos
  ...Object.fromEntries(
    [
      "LIG. URACO 12",
      "LIG. REDONDO",
      "LIG. ANCHO 3-9",
      "LIG. CARDINAL 4-8",
      "LIG. UTEROSACRO 5-7 RODEA AMPOLLA RECTAL",
      "LIG ANOCOCCIGEO /SACROCOGCIGEO",
      "NUCLEO FIBROSO CENTRAL PERINEAL",
      "TRANSVERSO SUPERFICIAL/ PROF",
      "BULBO CAVERNOSO",
      "ISQUICAVERNOSO",
      "DUG ESFINTER URETRALEXTERNO/COMPRESOR URETRAL /URETROVAGINAL",
      "PUBOURETRAL PU",
      "PUBOVAGINAL PV",
      "ESFINTER ANAL /PUBORECTAL EAE",
      "PUBOCOCCIGEO PC",
      "OBTURATOR INTERNO/ PIRAMIDAL OI",
      "ILIOCOCCIGEO IL",
      "COCCIGEO"
    ].map(nombre => [`endo_${nombre}_presente`, false])
  ),
  dolorTRP: "",
  diagnosticoFisio: "",
  planIntervencion: "",
  firmaPaciente: "",
  firmaFisioterapeuta: "",
  firmaAutorizacion: "",

  // Paso 12: Consentimiento
  consentimientoFecha: "",
  consentimientoCiudad: "Montería",
  consentimientoNombre: "",
  consentimientoCC: "",
  consentimientoFirma: "",
};

export default function EditarValoracionPisoPelvico() {
  const { id } = useParams(); // id de la valoración
  const navigate = useNavigate();
  const [formulario, setFormulario] = useState(FORMULARIO_INICIAL);
  const [paciente, setPaciente] = useState(null);
  const [paso, setPaso] = useState(1);

  useEffect(() => {
    apiRequest(`/valoracion-piso-pelvico/${id}`)
      .then(res => res.json())
      .then(async data => {
        // Si data.paciente es un ID, trae los datos completos del paciente adulto
        if (data.paciente && typeof data.paciente === "string") {
          const resPaciente = await apiRequest(`/pacientes-adultos/${data.paciente}`);
          const datosPaciente = await resPaciente.json();
          setPaciente(datosPaciente);
          // Mezcla SOLO los campos que existen en FORMULARIO_INICIAL
          setFormulario(prev => ({
            ...prev,
            ...Object.keys(FORMULARIO_INICIAL).reduce((acc, key) => {
              if (datosPaciente[key] !== undefined) acc[key] = datosPaciente[key];
              return acc;
            }, {}),
            ...data // Sobrescribe con los datos de la valoración
          }));
        } else if (data.paciente && typeof data.paciente === "object") {
          setPaciente(data.paciente);
          setFormulario(prev => ({
            ...prev,
            ...Object.keys(FORMULARIO_INICIAL).reduce((acc, key) => {
              if (data.paciente[key] !== undefined) acc[key] = data.paciente[key];
              return acc;
            }, {}),
            ...data
          }));
        } else {
          setFormulario({ ...FORMULARIO_INICIAL, ...data });
        }
      });
  }, [id]);

  const siguientePaso = () => setPaso((p) => p + 1);
  const pasoAnterior = () => setPaso((p) => p - 1);

  const actualizarValoracion = async () => {
    try {
      console.log('Procesando formulario antes de actualizar...');
      const dataToSend = { ...formulario };
      
      // Lista de campos que pueden contener firmas/imágenes
      const camposFirmas = [
        'firmaPaciente',
        'firmaFisioterapeuta', 
        'firmaAutorizacion',
        'consentimientoFirma'
      ];

      // Obtener valoración actual para comparar firmas existentes
      let valoracionActual = {};
      try {
        const resActual = await apiRequest(`/valoracion-piso-pelvico/${id}`);
        if (resActual.ok) {
          valoracionActual = await resActual.json();
        }
      } catch (error) {
        console.log('No se pudo obtener valoración actual:', error);
      }

      // Procesar cada campo de firma
      for (const campo of camposFirmas) {
        if (dataToSend[campo] && typeof dataToSend[campo] === 'string') {
          // Si es base64 (data:image), subirla a S3
          if (dataToSend[campo].startsWith('data:image')) {
            console.log(`Subiendo ${campo} a S3...`);
            
            // Eliminar firma anterior si existe y es URL de S3
            if (valoracionActual[campo] && valoracionActual[campo].includes('amazonaws.com')) {
              console.log(`Eliminando ${campo} anterior de S3: ${valoracionActual[campo]}`);
              await eliminarImagenDeS3(valoracionActual[campo]);
            }
            
            // Subir nueva firma
            dataToSend[campo] = await subirFirmaAS3(dataToSend[campo]);
            console.log(`✓ ${campo} subida a S3: ${dataToSend[campo]}`);
          }
          // Si ya es URL de S3, mantenerla como está
          else if (dataToSend[campo].includes('amazonaws.com')) {
            console.log(`✓ ${campo} ya es URL de S3, manteniéndola: ${dataToSend[campo]}`);
          }
        }
      }

      const response = await fetch(
        `/api/valoracion-piso-pelvico/${id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(dataToSend),
        }
      );
      if (response.ok) {
        await Swal.fire("¡Actualizado!", "La valoración fue actualizada exitosamente.", "success");
        navigate(`/valoraciones-piso-pelvico/${id}`);
      } else {
        await Swal.fire("Error", "No se pudo actualizar la valoración.", "error");
      }
    } catch (error) {
      console.error('Error al actualizar valoración:', error);
      await Swal.fire("Error", "Ocurrió un error al actualizar.", "error");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow">
      <h2 className="text-2xl font-bold mb-4 text-indigo-700">
        Editar Valoración Fisioterapia de Piso Pélvico
      </h2>
      {paso === 1 && (
        <Paso1DatosGenerales
          formulario={formulario}
          setFormulario={setFormulario}
          paciente={paciente}
          siguientePaso={siguientePaso}
        />
      )}
      {paso === 2 && (
        <Paso2EstadoSalud
          formulario={formulario}
          setFormulario={setFormulario}
          siguientePaso={siguientePaso}
          pasoAnterior={pasoAnterior}
        />
      )}
      {paso === 3 && (
        <Paso3EnfermedadCronica
          formulario={formulario}
          setFormulario={setFormulario}
          siguientePaso={siguientePaso}
          pasoAnterior={pasoAnterior}
        />
      )}
      {paso === 4 && (
        <Paso4DinamicaObstetrica
          formulario={formulario}
          setFormulario={setFormulario}
          siguientePaso={siguientePaso}
          pasoAnterior={pasoAnterior}
        />
      )}
      {paso === 5 && (
        <Paso5DinamicaMenstrual
          formulario={formulario}
          setFormulario={setFormulario}
          siguientePaso={siguientePaso}
          pasoAnterior={pasoAnterior}
        />
      )}
      {paso === 6 && (
        <Paso6DinamicaMiccional
          formulario={formulario}
          setFormulario={setFormulario}
          siguientePaso={siguientePaso}
          pasoAnterior={pasoAnterior}
        />
      )}
      {paso === 7 && (
        <Paso7ICIQSF
          formulario={formulario}
          setFormulario={setFormulario}
          siguientePaso={siguientePaso}
          pasoAnterior={pasoAnterior}
        />
      )}
      {paso === 8 && (
        <Paso8DinamicaDefecatoria
          formulario={formulario}
          setFormulario={setFormulario}
          siguientePaso={siguientePaso}
          pasoAnterior={pasoAnterior}
        />
      )}
      {paso === 9 && (
        <Paso9EvaluacionFisioterapeutica
          formulario={formulario}
          setFormulario={setFormulario}
          siguientePaso={siguientePaso}
          pasoAnterior={pasoAnterior}
        />
      )}
      {paso === 10 && (
        <Paso10PalpacionInterna
          formulario={formulario}
          setFormulario={setFormulario}
          siguientePaso={siguientePaso}
          pasoAnterior={pasoAnterior}
        />
      )}
      {paso === 11 && (
        <Paso11EvaluacionTRP
          formulario={formulario}
          setFormulario={setFormulario}
          siguientePaso={siguientePaso}
          pasoAnterior={pasoAnterior}
        />
      )}
      {paso === 12 && (
        <Paso12Consentimiento
          formulario={formulario}
          setFormulario={setFormulario}
          siguientePaso={actualizarValoracion}
          pasoAnterior={pasoAnterior}
        />
      )}
      <div className="flex justify-end mt-8">
        <button
          onClick={() => navigate(-1)}
          className="bg-gray-300 hover:bg-gray-400 text-black px-6 py-2 rounded font-bold"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}