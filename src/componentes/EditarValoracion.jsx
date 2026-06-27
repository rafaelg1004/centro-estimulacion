import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiRequest } from "../config/api";
import DynamicFormBuilder from "./ui/DynamicFormBuilder";
import { ESQUEMA_VALORACION_PEDIATRIA } from "../config/esquemaValoracionPediatria";
import { ESQUEMA_VALORACION_LACTANCIA } from "../config/esquemaValoracionLactancia";
import { ESQUEMA_VALORACION_PISO_PELVICO } from "../config/esquemaValoracionPisoPelvico";
import { ESQUEMA_VALORACION_PERINATAL } from "../config/esquemaValoracionPerinatal";
import Swal from 'sweetalert2';

// Helper: Convertir snake_case a camelCase
function snakeToCamel(str) {
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
}

// Helper: Convertir objeto con snake_case a camelCase recursivamente
// Conserva tanto la clave camelCase como la original snake_case para compatibilidad total.
function convertKeysToCamelCase(obj) {
  if (obj === null || obj === undefined || typeof obj !== "object") {
    return obj;
  }
  if (Array.isArray(obj)) {
    return obj.map((item) => convertKeysToCamelCase(item));
  }
  const newObj = {};
  for (const [key, value] of Object.entries(obj)) {
    const camelKey = snakeToCamel(key);
    const convertedValue = (value !== null && typeof value === "object" && !Array.isArray(value))
      ? convertKeysToCamelCase(value)
      : value;

    newObj[camelKey] = convertedValue;
    if (camelKey !== key) {
      newObj[key] = convertedValue;
    }
  }
  return newObj;
}

// Función para mapear datos legacy (migrados de Mongo) a la estructura moderna de Pediatría y Perinatal
function mapearDatosLegacy(data) {
  const legacy = data.datosLegacy || data._datosLegacy;
  if (!legacy || Object.keys(legacy).length === 0) return data;

  const newData = { ...data };

  const esPediatria = newData.tipoPrograma === "Pediatría" || newData.tipoPrograma === "Pediatria" || (!newData.tipoPrograma && legacy.tipoPrograma === "Pediatría") || String(newData.codConsulta) === "890201";

  if (esPediatria) {
    if (!newData.moduloPediatria) newData.moduloPediatria = {};

    newData.motivoConsulta = newData.motivoConsulta || legacy.motivoDeConsulta || "";

    const TEXTOS_DIAGNOSTICO = {
      "opcion1": "Paciente que presenta desarrollo neuromotor acorde a su edad cronológica, evidenciando habilidades motoras apropiadas para su etapa del desarrollo. Se recomienda inicio de programa de estimulación adecuada, con el objetivo de favorecer, potenciar y acompañar su desarrollo integral, promoviendo la adquisición progresiva de habilidades motoras y la interacción con el entorno.",
      "opcion2": "Paciente que presenta alteraciones en el desarrollo neuromotor, evidenciándose dificultades en la adquisición de habilidades motoras esperadas para su edad. Se recomienda intervención desde fisioterapia, mediante un programa de tratamiento personalizado e individualizado, con el objetivo de favorecer su desarrollo integral, potenciar sus habilidades motoras y mejorar su funcionalidad."
    };

    const TEXTOS_PLAN = {
      "opcion1": "Programa Grupal de Estimulación Adecuada: Se recomienda el ingreso al programa de estimulación adecuada en modalidad grupal, con el objetivo de favorecer y potenciar el desarrollo integral del niño, fortaleciendo habilidades motoras, sensoriales, cognitivas y de interacción con el entorno, mediante actividades acordes a su etapa del desarrollo. Se brindará además orientación a los padres o cuidadores para continuar la estimulación en el hogar.",
      "opcion2": "Fisioterapia Personalizada: Se recomienda inicio de programa de fisioterapia pediátrica en modalidad individualizada, orientado a abordar las alteraciones identificadas en el desarrollo neuromotor. El tratamiento se realizará mediante intervenciones terapéuticas específicas y personalizadas, con el objetivo de favorecer la adquisición de habilidades motoras, mejorar el control postural y promover el desarrollo integral del niño, incluyendo orientación a los padres para apoyo en casa."
    };

    const rawDiagLegacy = legacy.diagnosticoFisioterapeutico || legacy.diagnostico || "";
    const diagLegacy = TEXTOS_DIAGNOSTICO[rawDiagLegacy] || rawDiagLegacy;

    const rawPlanLegacy = legacy.planTratamiento || "";
    const planLegacy = TEXTOS_PLAN[rawPlanLegacy] || rawPlanLegacy;

    const diagModerno = newData.diagnosticoFisioterapeutico;
    const esPlaceholderDiag = diagModerno && diagModerno.includes("Migrado");
    newData.diagnosticoFisioterapeutico = (!esPlaceholderDiag && diagModerno ? diagModerno : null)
      || diagLegacy || diagModerno || "";

    const planModerno = newData.planTratamiento;
    const esPlaceholderPlan = planModerno && planModerno.includes("pendiente de actualizaci");
    newData.planTratamiento = (!esPlaceholderPlan && planModerno ? planModerno : null)
      || planLegacy || planModerno || "";

    newData.moduloPediatria.autorizacionImagen = newData.moduloPediatria.autorizacionImagen ?? (!!legacy.autorizacionNombre);

    if (!newData.moduloPediatria.prenatales) newData.moduloPediatria.prenatales = {};
    const pren = legacy.antecedentesPrenatales || [];
    if (Array.isArray(pren)) {
      const pString = pren.join(" ").toLowerCase();
      newData.moduloPediatria.prenatales.gestacionPlaneada = pString.includes("planeada");
      newData.moduloPediatria.prenatales.gestacionControlada = pString.includes("controlada");
      newData.moduloPediatria.prenatales.metodosAnticonceptivos = pString.includes("anticonceptivos");
      newData.moduloPediatria.prenatales.vomito1erTrim = pString.includes("vómito") || pString.includes("vomito");
      newData.moduloPediatria.prenatales.sustancias = pString.includes("fármacos") || pString.includes("alcohol") || pString.includes("drogas");
      newData.moduloPediatria.prenatales.rayosX = pString.includes("rayos");
      newData.moduloPediatria.prenatales.convulsiones = pString.includes("convulsiones");
      newData.moduloPediatria.prenatales.desnutricion = pString.includes("desnutrición");
      newData.moduloPediatria.prenatales.anemia = pString.includes("anemia");
      newData.moduloPediatria.prenatales.maltrato = pString.includes("maltrato");
      newData.moduloPediatria.prenatales.hipertension = pString.includes("hipertensión") || pString.includes("hipertension");
      newData.moduloPediatria.prenatales.diabetes = pString.includes("diabetes");
    }

    if (!newData.moduloPediatria.perinatales) newData.moduloPediatria.perinatales = {};
    newData.moduloPediatria.perinatales.tipoParto = legacy.tipoParto || "";
    newData.moduloPediatria.perinatales.tiempoGestacion = legacy.tiempoGestacion || "";
    newData.moduloPediatria.perinatales.lugarParto = legacy.lugarParto || "";
    newData.moduloPediatria.perinatales.medicoTratante = legacy.medicoParto || "";
    newData.moduloPediatria.perinatales.pesoAlNacer = legacy.pesoNacimiento || "";
    newData.moduloPediatria.perinatales.tallaAlNacer = legacy.tallaNacimiento || "";
    newData.moduloPediatria.perinatales.recibioCurso = legacy.recibioCurso || "";
    newData.moduloPediatria.perinatales.atendidaOportunamente = legacy.atendida || "";

    if (!newData.moduloPediatria.recienNacido) newData.moduloPediatria.recienNacido = {};
    const rn = legacy.recienNacido || [];
    if (Array.isArray(rn)) {
      const rnStr = rn.join(" ").toLowerCase();
      newData.moduloPediatria.recienNacido.llantoAlNacer = rnStr.includes("llanto");
      newData.moduloPediatria.recienNacido.problemasRespiratorios = rnStr.includes("respiratorios");
      newData.moduloPediatria.recienNacido.incubadora = rnStr.includes("incubadora");
    }
    newData.moduloPediatria.recienNacido.lactanciaMaterna = legacy.lactancia || "";
    newData.moduloPediatria.recienNacido.tiempoLactancia = legacy.tiempoLactancia || "";
    newData.moduloPediatria.recienNacido.hospitalarios = legacy.hospitalarios || "";
    newData.moduloPediatria.recienNacido.patologicos = legacy.patologicos || "";
    newData.moduloPediatria.recienNacido.familiares = legacy.familiares || "";
    newData.moduloPediatria.recienNacido.traumaticos = legacy.traumaticos || "";
    newData.moduloPediatria.recienNacido.farmacologicos = legacy.farmacologicos || "";
    newData.moduloPediatria.recienNacido.quirurgicos = legacy.quirurgicos || "";
    newData.moduloPediatria.recienNacido.toxicosAlergicos = legacy.toxicos || "";

    if (!newData.moduloPediatria.hitos) newData.moduloPediatria.hitos = {};
    const setHito = (sub, legacySiKey, legacyNoKey, legacyObsKey) => {
      if (!newData.moduloPediatria.hitos[sub]) newData.moduloPediatria.hitos[sub] = {};
      if (!newData.moduloPediatria.hitos[sub].si) {
        newData.moduloPediatria.hitos[sub].si = legacy[legacySiKey] ? "SI" : (legacy[legacyNoKey] ? "NO" : "");
      }
      if (!newData.moduloPediatria.hitos[sub].obs && legacyObsKey && legacy[legacyObsKey]) {
        newData.moduloPediatria.hitos[sub].obs = legacy[legacyObsKey];
      }
    };
    setHito("controlCefalico", "sostieneCabeza_si", "sostieneCabeza_no", "sostieneCabeza_observaciones");
    setHito("rolados", "seVoltea_si", "seVoltea_no", "seVoltea_observaciones");
    setHito("sedente", "seSientaSinApoyo_si", "seSientaSinApoyo_no", "seSientaSinApoyo_observaciones");
    setHito("gateo", "gatea_si", "gatea_no", "gatea_observaciones");
    setHito("bipedo", "sePoneDePerApoyado_si", "sePoneDePerApoyado_no", "sePoneDePerApoyado_observaciones");
    setHito("marcha", "caminaSolo_si", "caminaSolo_no", "caminaSolo_observaciones");

    if (!newData.moduloPediatria.habitos) newData.moduloPediatria.habitos = {};
    newData.moduloPediatria.habitos.recomendacionesMedicas = legacy.dieta || "";
    newData.moduloPediatria.habitos.problemasSueno = legacy.problemasSueno || "";
    newData.moduloPediatria.habitos.duermeCon = legacy.duermeCon || "";
    newData.moduloPediatria.habitos.patronSueno = legacy.patronSueno || legacy.siesta || "";
    newData.moduloPediatria.habitos.pesadillas = legacy.pesadillas || "";
    newData.moduloPediatria.habitos.siesta = legacy.siesta || "";
    newData.moduloPediatria.habitos.cambioAlimentacion = legacy.cambioAlimentacion || "";
    newData.moduloPediatria.habitos.problemasComer = legacy.dificultadesComer || "";
    newData.moduloPediatria.habitos.alimentosPreferidos = legacy.alimentosPreferidos || "";
    newData.moduloPediatria.habitos.alimentosNoGustan = legacy.alimentosNoLeGustan || "";

    if (!newData.moduloPediatria.desarrolloSocial) newData.moduloPediatria.desarrolloSocial = {};
    newData.moduloPediatria.desarrolloSocial.viveConPadres = legacy.viveConPadres || "";
    newData.moduloPediatria.desarrolloSocial.permaneceCon = legacy.permaneceCon || "";
    newData.moduloPediatria.desarrolloSocial.prefiereA = legacy.prefiereA || "";
    newData.moduloPediatria.desarrolloSocial.relacionHermanos = legacy.relacionHermanos || "";
    newData.moduloPediatria.desarrolloSocial.emociones = legacy.emociones || "";
    newData.moduloPediatria.desarrolloSocial.juegaCon = legacy.juegaCon || "";
    newData.moduloPediatria.desarrolloSocial.juegosPrefiere = legacy.juegosPreferidos || "";
    newData.moduloPediatria.desarrolloSocial.relacionDesconocidos = legacy.relacionDesconocidos || "";
    newData.moduloPediatria.rutinaDiaria = legacy.rutinaDiaria || "";

    if (!newData.moduloPediatria.examen) newData.moduloPediatria.examen = {};
    newData.moduloPediatria.examen.fc = legacy.frecuenciaCardiaca || "";
    newData.moduloPediatria.examen.fr = legacy.frecuenciaRespiratoria || "";
    newData.moduloPediatria.examen.temperatura = legacy.temperatura || "";
    newData.moduloPediatria.examen.tejidoTegumentario = legacy.tejidoTegumentario || "";
    newData.moduloPediatria.examen.reflejos = legacy.reflejosOsteotendinosos || "";
    newData.moduloPediatria.examen.anormales = legacy.reflejosAnormales || "";
    newData.moduloPediatria.examen.patologicos = legacy.reflejosPatologicos || "";
    newData.moduloPediatria.examen.tonoMuscular = legacy.tonoMuscular || "";
    newData.moduloPediatria.examen.controlMotor = legacy.controlMotor || "";
    newData.moduloPediatria.examen.desplazamientos = legacy.desplazamientos || "";
    newData.moduloPediatria.examen.sensibilidad = legacy.sensibilidad || "";
    newData.moduloPediatria.examen.perfilSensorial = legacy.perfilSensorial || "";
    newData.moduloPediatria.examen.deformidades = legacy.deformidades || "";
    newData.moduloPediatria.examen.aparatosOrtopedicos = legacy.aparatosOrtopedicos || "";
    newData.moduloPediatria.examen.sistemaPulmonar = legacy.sistemaPulmonar || "";
    newData.moduloPediatria.examen.problemasAsociados = legacy.problemasAsociados || "";

    if (!newData.moduloPediatria.lenguaje) newData.moduloPediatria.lenguaje = {};
    if (!newData.moduloPediatria.lenguaje.balbucea) newData.moduloPediatria.lenguaje.balbucea = legacy.balbucea_si ? "SI" : (legacy.balbucea_no ? "NO" : "");
    if (!newData.moduloPediatria.lenguaje.diceMamaPapa) newData.moduloPediatria.lenguaje.diceMamaPapa = legacy.diceMamaPapa_si ? "SI" : (legacy.diceMamaPapa_no ? "NO" : "");
    if (!newData.moduloPediatria.lenguaje.entiendeOrdenes) newData.moduloPediatria.lenguaje.entiendeOrdenes = legacy.entiendeOrdenesSimples_si ? "SI" : (legacy.entiendeOrdenesSimples_no ? "NO" : "");
    if (!newData.moduloPediatria.lenguaje.senalaQueQuiere) newData.moduloPediatria.lenguaje.senalaQueQuiere = legacy.senalaQueQuiere_si ? "SI" : (legacy.senalaQueQuiere_no ? "NO" : "");
    if (!newData.moduloPediatria.lenguaje.usaFrases) newData.moduloPediatria.lenguaje.usaFrases = legacy.usaFrases2Palabras_si ? "SI" : (legacy.usaFrases2Palabras_no ? "NO" : "");

    if (!newData.moduloPediatria.socioemocional) newData.moduloPediatria.socioemocional = {};
    if (!newData.moduloPediatria.socioemocional.sonrieSocialmente) newData.moduloPediatria.socioemocional.sonrieSocialmente = legacy.sonrieSocialmente_si ? "SI" : (legacy.sonrieSocialmente_no ? "NO" : "");
    if (!newData.moduloPediatria.socioemocional.respondeNombre) newData.moduloPediatria.socioemocional.respondeNombre = legacy.respondeNombre_si ? "SI" : (legacy.respondeNombre_no ? "NO" : "");
    if (!newData.moduloPediatria.socioemocional.juegoSimbolico) newData.moduloPediatria.socioemocional.juegoSimbolico = legacy.juegoSimbolico_si ? "SI" : (legacy.juegoSimbolico_no ? "NO" : "");
    if (!newData.moduloPediatria.socioemocional.seDespide) newData.moduloPediatria.socioemocional.seDespide = legacy.seDespideLanzaBesos_si ? "SI" : (legacy.seDespideLanzaBesos_no ? "NO" : "");
    if (!newData.moduloPediatria.socioemocional.interesaOtrosNinos) newData.moduloPediatria.socioemocional.interesaOtrosNinos = legacy.interesaOtrosNinos_si ? "SI" : (legacy.interesaOtrosNinos_no ? "NO" : "");

    if (!newData.moduloPediatria.motricidadFina) newData.moduloPediatria.motricidadFina = {};
    if (!newData.moduloPediatria.motricidadFina.sigueObjetos) newData.moduloPediatria.motricidadFina.sigueObjetos = legacy.sigueObjetosMirada_si ? "SI" : (legacy.sigueObjetosMirada_no ? "NO" : "");
    if (!newData.moduloPediatria.motricidadFina.pinzaSuperior) newData.moduloPediatria.motricidadFina.pinzaSuperior = legacy.pinzaSuperior_si ? "SI" : (legacy.pinzaSuperior_no ? "NO" : "");
    if (!newData.moduloPediatria.motricidadFina.llevaObjetosBoca) newData.moduloPediatria.motricidadFina.llevaObjetosBoca = legacy.llevaObjetosBoca_si ? "SI" : (legacy.llevaObjetosBoca_no ? "NO" : "");
    if (!newData.moduloPediatria.motricidadFina.pasaObjetosEntreManos) newData.moduloPediatria.motricidadFina.pasaObjetosEntreManos = legacy.pasaObjetosEntreManos_si ? "SI" : (legacy.pasaObjetosEntreManos_no ? "NO" : "");
    if (!newData.moduloPediatria.motricidadFina.encajaPiezas) newData.moduloPediatria.motricidadFina.encajaPiezas = legacy.encajaPiezasGrandes_si ? "SI" : (legacy.encajaPiezasGrandes_no ? "NO" : "");
    if (!newData.moduloPediatria.motricidadFina.garabatea) newData.moduloPediatria.motricidadFina.garabatea = legacy.dibujaGarabatos_si ? "SI" : (legacy.dibujaGarabatos_no ? "NO" : "");
  }

  const esPerinatal = newData.tipoPrograma === "Perinatal" || (!newData.tipoPrograma && legacy.tipoPrograma === "Perinatal") || String(newData.codConsulta) === "890211";

  if (esPerinatal) {
    if (!newData.moduloPerinatal) newData.moduloPerinatal = {};
    newData.moduloPerinatal = {
      ...newData.moduloPerinatal,
      patologicos: legacy.patologicos || newData.moduloPerinatal.patologicos || "",
      quirurgicos: legacy.quirurgicos || newData.moduloPerinatal.quirurgicos || "",
      farmacologicos: legacy.farmacologicos || newData.moduloPerinatal.farmacologicos || "",
      traumaticos: legacy.traumaticos || newData.moduloPerinatal.traumaticos || "",
      familiares: legacy.familiares || newData.moduloPerinatal.familiares || "",
      semanasGestacion: legacy.semanasGestacion || newData.moduloPerinatal.semanasGestacion || "",
      fum: legacy.fum || newData.moduloPerinatal.fum || "",
      tipoParto: legacy.tipoParto || newData.moduloPerinatal.tipoParto || ""
    };
  }

  return newData;
}

export default function EditarValoracion() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [valoracion, setValoracion] = useState(null);
  const [esquema, setEsquema] = useState(null);
  const [isProcessing, setIsProcessing] = useState(true);
  const [loadingText, setLoadingText] = useState("Conectando con la base de datos...");
  const [actionsContainer, setActionsContainer] = useState(null);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setLoadingText("Descargando registro clínico...");
        const data = await apiRequest(`/valoraciones/${id}`);

        if (data.bloqueada) {
          Swal.fire("Inmutable", "Esta historia clínica está cerrada y no puede ser editada.", "info");
          navigate(`/valoraciones/${id}`);
          return;
        }

        setLoadingText("Mapeando y configurando esquemas...");

        // Convertir a camelCase para los esquemas del frontend
        let converted = convertKeysToCamelCase(data);
        // Mapear datos legacy si aplica
        converted = mapearDatosLegacy(converted);

        console.log("[EditarValoracion] codConsulta cargado:", converted.codConsulta, "| cod_consulta:", converted.cod_consulta);

        // Convertir fecha_inicio_atencion a formato datetime-local (YYYY-MM-DDTHH:mm) para el input
        // DEBE hacerse antes de setValoracion para que el estado tenga el valor formateado
        if (converted.fecha_inicio_atencion) {
          const d = new Date(converted.fecha_inicio_atencion);
          if (!isNaN(d.getTime())) {
            const formatted = new Date(d.getTime() - d.getTimezoneOffset() * 60000)
              .toISOString().substring(0, 16);
            converted.fecha_inicio_atencion = formatted;
            converted.fechaInicioAtencion = formatted; // también actualizar alias camelCase
          }
        }

        setValoracion(converted);

        // Determinar el esquema usando tipo_programa o cod_consulta
        // Nota: cod_consulta puede traer descripción adjunta (ej. "890211 - CONSULTA..."), usar startsWith
        const tp = data.tipo_programa || '';
        const codConsulta = String(data.cod_consulta || '').split(' ')[0].trim();
        if (tp.includes('Lactancia') || data.modulo_lactancia?.tipo_lactancia || codConsulta === '890203') {
          setEsquema(ESQUEMA_VALORACION_LACTANCIA);
        } else if (tp.includes('Piso') || codConsulta === '890202') {
          setEsquema(ESQUEMA_VALORACION_PISO_PELVICO);
        } else if (tp === 'Perinatal' || codConsulta === '890211') {
          setEsquema(ESQUEMA_VALORACION_PERINATAL);
        } else {
          setEsquema(ESQUEMA_VALORACION_PEDIATRIA);
        }
        setValoracion(converted);

        setLoadingText("Preparando la interfaz de edición...");
        setTimeout(() => {
          setIsProcessing(false);
        }, 800);

      } catch (error) {
        console.error("Error cargando valoración para edición:", error);
        Swal.fire("Error", "No se pudo cargar la valoración", "error");
        setIsProcessing(false);
      }
    };
    cargarDatos();
  }, [id, navigate]);

  const calcularEdad = (fechaNac) => {
    if (!fechaNac) return "N/A";
    const hoy = new Date();
    const cumple = new Date(fechaNac);
    let edadAnos = hoy.getFullYear() - cumple.getFullYear();
    let edadMeses = hoy.getMonth() - cumple.getMonth();
    if (hoy.getDate() < cumple.getDate()) edadMeses--;
    if (edadMeses < 0) { edadAnos--; edadMeses += 12; }
    if (edadAnos < 2) {
      const totalMeses = (edadAnos * 12) + edadMeses;
      return `${edadAnos} años (${totalMeses} meses)`;
    }
    return `${edadAnos} años`;
  };

  if (isProcessing || !valoracion || !esquema)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50/50">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600 z-10 absolute inset-0"></div>
          <div className="rounded-full h-16 w-16 border-4 border-indigo-100"></div>
        </div>
        <p className="mt-6 text-indigo-800 font-semibold text-lg tracking-wide animate-pulse">
          {loadingText}
        </p>
        <p className="text-sm text-gray-500 mt-2">Asegurando la carga de la información clínica...</p>
      </div>
    );

  const paciente = valoracion.paciente || {};
  console.log("[EditarValoracion] paciente:", paciente);
  const isPediatria = !paciente.esAdulto;

  // Fallback robusto: paciente puede llegar en camelCase o snake_case
  const pSemGest = paciente.semanasGestacion || paciente.semanas_gestacion || "";
  const pFum = paciente.fum || "";
  const pTelefono = paciente.datosContacto?.telefono || paciente.datos_contacto?.telefono || paciente.telefono || paciente.celular || "N/A";
  const pNombreMadre = paciente.nombreMadre || paciente.nombre_madre || "";
  const pPediatra = paciente.pediatra || "";

  const esquemaConPaciente = {
    ...esquema,
    secciones: esquema.secciones.map((sec, idx) => {
      if (idx === 0) {
        return {
          ...sec,
          campos: [
            { nombre: "paciente", tipo: "hidden", valorPorDefecto: paciente._id || paciente.id },
            ...sec.campos
          ]
        };
      }
      return sec;
    })
  };

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="sticky top-0 z-[60] bg-white/90 backdrop-blur-md border-b border-indigo-100 shadow-sm px-6 py-3 mb-6">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className={`h-12 w-12 rounded-2xl flex items-center justify-center text-2xl shadow-inner ${isPediatria ? 'bg-indigo-50 text-indigo-500' : 'bg-pink-50 text-pink-500'}`}>
              {isPediatria ? '👶' : '🤰'}
            </div>
            <div>
              <h2 className="text-xl font-black text-gray-800 leading-tight uppercase tracking-tight">
                {paciente.nombres || ""} {paciente.apellidos || ""}
              </h2>
              <p className="text-[11px] font-bold text-indigo-400 tracking-widest uppercase">
                {paciente.tipoDocumentoIdentificacion || paciente.tipo_documento_identificacion || "HC"}: {paciente.numDocumentoIdentificacion || paciente.num_documento_identificacion || "S.D"} • {isPediatria ? 'EDITANDO VALORACIÓN PEDIÁTRICA' : 'EDITANDO VALORACIÓN MATERNA'}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-x-8 gap-y-2 text-xs">
            <div className="flex flex-col">
              <span className="text-gray-400 font-bold uppercase text-[9px]">Edad / Sexo</span>
              <span className="font-bold text-gray-700">{calcularEdad(paciente.fechaNacimiento || paciente.fecha_nacimiento)} • {(paciente.codSexo || paciente.cod_sexo) === 'M' ? 'Masc' : 'Fem'}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-gray-400 font-bold uppercase text-[9px]">Contacto</span>
              <span className="font-bold text-gray-700">📞 {pTelefono}</span>
            </div>
            {isPediatria ? (
              <div className="flex flex-col">
                <span className="text-gray-400 font-bold uppercase text-[9px]">Pediatra / Madre</span>
                <span className="font-bold text-gray-700">{pPediatra || "S.D"} • {pNombreMadre || "S.D"}</span>
              </div>
            ) : (
              <div className="flex flex-col">
                <span className="text-gray-400 font-bold uppercase text-[9px]">Gestación / FUM</span>
                <span className="font-bold text-gray-700">Sem: {pSemGest || "N/A"} • FUM: {pFum || "N/A"}</span>
              </div>
            )}
            <div className="flex flex-col">
              <span className="text-gray-400 font-bold uppercase text-[9px]">Aseguradora</span>
              <span className="font-bold text-indigo-600 underline"> {paciente.aseguradora || "Particular"}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <div ref={setActionsContainer} className="flex items-center gap-2" />
          </div>
        </div>
      </div>

      <div className="px-4 pb-20">
        <DynamicFormBuilder
          esquema={esquemaConPaciente}
          initialData={valoracion}
          isPaginado={true}
          pacienteId={paciente._id || paciente.id}
          pacienteNombre={`${paciente.nombres || ""} ${paciente.apellidos || ""}`}
          actionsPortalTarget={actionsContainer}
          onSubmitSuccess={() => {
            navigate(`/valoraciones/${id}`);
          }}
        />
      </div>
    </div>
  );
}