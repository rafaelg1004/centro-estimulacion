import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiRequest, apiDownload } from "../config/api";
import DynamicDetailBuilder from "./ui/DynamicDetailBuilder";
import { ESQUEMA_VALORACION_PEDIATRIA } from "../config/esquemaValoracionPediatria";
import { ESQUEMA_VALORACION_LACTANCIA } from "../config/esquemaValoracionLactancia";
import { ESQUEMA_VALORACION_PISO_PELVICO } from "../config/esquemaValoracionPisoPelvico";
import { ESQUEMA_CONSENTIMIENTO_PERINATAL } from "../config/esquemaConsentimientoPerinatal";
import Swal from "sweetalert2";

// Helper: Convertir snake_case a camelCase
function snakeToCamel(str) {
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
}

// Helper: Convertir objeto con snake_case a camelCase recursivamente
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
    // Si el valor es un objeto plano (no array), convertir recursivamente
    if (value !== null && typeof value === "object" && !Array.isArray(value)) {
      newObj[camelKey] = convertKeysToCamelCase(value);
    } else {
      newObj[camelKey] = value;
    }
  }
  return newObj;
}

// Función para mapear datos de modulo_perinatal a estructura esperada por el esquema
function mapearDatosPerinatal(data) {
  console.log(
    "[DEBUG] mapearDatosPerinatal - data.moduloPerinatal:",
    data.moduloPerinatal,
  );
  console.log(
    "[DEBUG] mapearDatosPerinatal - data.modulo_perinatal:",
    data.modulo_perinatal,
  );

  if (!data.moduloPerinatal && !data.modulo_perinatal) {
    console.log("[DEBUG] mapearDatosPerinatal: No hay modulo perinatal");
    return data;
  }

  const modulo = data.moduloPerinatal || data.modulo_perinatal || {};
  console.log(
    "[DEBUG] mapearDatosPerinatal - modulo keys:",
    Object.keys(modulo),
  );
  console.log(
    "[DEBUG] mapearDatosPerinatal - patologicos:",
    modulo.patologicos,
  );
  console.log("[DEBUG] mapearDatosPerinatal - familiares:", modulo.familiares);

  const newData = { ...data };

  // Mapear antecedentes
  newData.antecedentes = {
    patologicos: modulo.patologicos || modulo.patologicosBase || "",
    quirurgicos: modulo.quirurgicos || "",
    farmacologicos: modulo.farmacologicos || modulo.medicamentosActuales || "",
    traumaticos: modulo.traumaticos || "",
    familiares: modulo.familiares || "",
    ginecoObstetricos: {
      embarazoAltoRiesgo:
        modulo.condicionActual?.fatigaMarcada === "si"
          ? "Sí"
          : modulo.embarazoAltoRiesgo || "",
      diabetesNoControlada:
        modulo.condicionActual?.diabetes || modulo.diabetesNoControlada || "",
      historiaAborto:
        modulo.historiaAborto || modulo.numAbortos?.toString() || "",
      semanasGestacion: modulo.semanasGestacion || "",
      fum: modulo.fum || "",
      tipoParto: modulo.tipoParto || "",
    },
  };

  // Mapear signos vitales adicionales desde el módulo
  if (!newData.signosVitales) newData.signosVitales = {};
  newData.signosVitales.pesoPrevio =
    newData.signosVitales.pesoPrevio || modulo.pesoPrevio || "";

  // Mapear examen físico / postura desde el módulo
  if (!newData.examenFisico) newData.examenFisico = {};
  newData.examenFisico.postura = modulo.postura || "";

  // Mapear términos y condiciones - buscar en múltiples campos posibles
  newData.terminos_acepto =
    modulo.terminosAcepto ||
    modulo.acepto ||
    modulo.autorizaImagenes === "SI" ||
    false;

  console.log(
    "[DEBUG] mapearDatosPerinatal - newData.antecedentes:",
    newData.antecedentes,
  );

  return newData;
}

// Función para mapear datos legacy (migrados de Mongo) a la estructura moderna de Pediatría
function mapearDatosLegacy(data) {
  const legacy = data.datosLegacy || data._datosLegacy;
  if (!legacy || Object.keys(legacy).length === 0) return data;

  const newData = { ...data };
  
  const esPediatria = newData.tipoPrograma === "Pediatría" || newData.tipoPrograma === "Pediatria" || (!newData.tipoPrograma && legacy.tipoPrograma === "Pediatría") || newData.codConsulta === "890201";
  
  // Si es programa de Pediatría, mapeamos al esquema de Pediatría
  if (esPediatria) {
    if (!newData.moduloPediatria) newData.moduloPediatria = {};

    newData.motivoConsulta = newData.motivoConsulta || legacy.motivoDeConsulta || "";
    newData.diagnosticoFisioterapeutico = newData.diagnosticoFisioterapeutico || legacy.diagnosticoFisioterapeutico || legacy.diagnostico || "";
    newData.planTratamiento = newData.planTratamiento || legacy.planTratamiento || "";

    // Antecedentes prenatales
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

    // Perinatales
    if (!newData.moduloPediatria.perinatales) newData.moduloPediatria.perinatales = {};
    newData.moduloPediatria.perinatales.tipoParto = legacy.tipoParto || "";
    newData.moduloPediatria.perinatales.tiempoGestacion = legacy.tiempoGestacion || "";
    newData.moduloPediatria.perinatales.lugarParto = legacy.lugarParto || "";
    newData.moduloPediatria.perinatales.medicoTratante = legacy.medicoParto || "";
    newData.moduloPediatria.perinatales.pesoAlNacer = legacy.pesoNacimiento || "";
    newData.moduloPediatria.perinatales.tallaAlNacer = legacy.tallaNacimiento || "";
    newData.moduloPediatria.perinatales.recibioCurso = legacy.recibioCurso || "";
    newData.moduloPediatria.perinatales.atendidaOportunamente = legacy.atendida || "";

    // Recién nacido
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

    // Hábitos
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

    // Desarrollo social
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

    // Examen Físico
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
  }

  const esPerinatal = newData.tipoPrograma === "Perinatal" || (!newData.tipoPrograma && legacy.tipoPrograma === "Perinatal") || newData.codConsulta === "890204";

  // Si es programa Perinatal
  if (esPerinatal) {
    if (!newData.moduloPerinatal) newData.moduloPerinatal = {};
    newData.antecedentes = {
      patologicos: legacy.patologicos || "",
      quirurgicos: legacy.quirurgicos || "",
      farmacologicos: legacy.farmacologicos || "",
      traumaticos: legacy.traumaticos || "",
      familiares: legacy.familiares || "",
      ginecoObstetricos: {
        embarazoAltoRiesgo: legacy.embarazoAltoRiesgo || "",
        diabetesNoControlada: legacy.diabetesNoControlada || "",
        historiaAborto: legacy.historiaAborto || "",
        semanasGestacion: legacy.semanasGestacion || "",
        fum: legacy.fum || "",
        tipoParto: legacy.tipoParto || ""
      }
    };
  }

  return newData;
}

// Función para convertir objeto anidado a campos planos legibles
function flattenObject(obj, prefix = "") {
  let result = [];

  console.log(
    "[DEBUG] flattenObject called with prefix:",
    prefix,
    "keys:",
    Object.keys(obj),
  );

  for (const [key, value] of Object.entries(obj)) {
    const formattedKey = key
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (str) => str.toUpperCase());
    const fullLabel = prefix ? `${prefix} - ${formattedKey}` : formattedKey;

    if (value === null || value === undefined || value === "") continue;
    if (Array.isArray(value) && value.length === 0) continue;
    if (
      typeof value === "object" &&
      !Array.isArray(value) &&
      Object.keys(value).length === 0
    )
      continue;

    if (typeof value === "object" && !Array.isArray(value)) {
      // Si es un objeto anidado, expandirlo recursivamente
      console.log("[DEBUG] Expanding nested object:", key);
      const nested = flattenObject(value, fullLabel);
      result = result.concat(nested);
    } else if (Array.isArray(value)) {
      // Si es un array, mostrarlo como lista
      const arrayStr = value.filter((v) => v && v !== "").join(", ");
      if (arrayStr) {
        result.push({ nombre: key, etiqueta: fullLabel, valor: arrayStr });
      }
    } else {
      // Valor simple
      console.log("[DEBUG] Adding simple field:", fullLabel, "=", value);
      result.push({ nombre: key, etiqueta: fullLabel, valor: String(value) });
    }
  }

  return result;
}

// Función genérica para crear sección dinámica con TODOS los campos de un módulo
function crearModuloCompleto(data, nombreModulo, nombrePropiedadSalida) {
  const modulo = data[nombreModulo];
  console.log(
    "[DEBUG] crearModuloCompleto - modulo:",
    nombreModulo,
    "exists:",
    !!modulo,
    "keys:",
    modulo ? Object.keys(modulo) : "N/A",
  );

  if (!modulo || typeof modulo !== "object") {
    console.log("[DEBUG] No modulo found for", nombreModulo);
    return data;
  }

  const newData = { ...data };

  // Crear array con todos los campos del módulo, expandiendo objetos anidados
  const campos = [];

  for (const [key, value] of Object.entries(modulo)) {
    const formattedKey = key
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (str) => str.toUpperCase());

    if (value === null || value === undefined || value === "") continue;
    if (Array.isArray(value) && value.length === 0) continue;
    if (
      typeof value === "object" &&
      !Array.isArray(value) &&
      Object.keys(value).length === 0
    )
      continue;

    if (typeof value === "object" && !Array.isArray(value)) {
      // Expandir objeto anidado en campos individuales
      console.log(
        "[DEBUG] Processing nested object:",
        key,
        "with",
        Object.keys(value).length,
        "keys",
      );
      const nestedFields = flattenObject(value, formattedKey);
      console.log("[DEBUG] Nested fields expanded:", nestedFields.length);
      campos.push(...nestedFields);
    } else if (Array.isArray(value)) {
      const arrayStr = value.filter((v) => v && v !== "").join(", ");
      if (arrayStr) {
        campos.push({
          nombre: `${nombreModulo}.${key}`,
          etiqueta: formattedKey,
          valor: arrayStr,
        });
      }
    } else {
      campos.push({
        nombre: `${nombreModulo}.${key}`,
        etiqueta: formattedKey,
        valor: String(value),
      });
    }
  }

  console.log(
    "[DEBUG] Total campos created for",
    nombrePropiedadSalida,
    ":",
    campos.length,
  );
  newData[nombrePropiedadSalida] = campos;

  return newData;
}

export default function DetalleValoracion() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [valoracion, setValoracion] = useState(null);
  const [valoracionRaw, setValoracionRaw] = useState(null);
  const [esquema, setEsquema] = useState(null);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const data = await apiRequest(`/valoraciones/${id}`);
        console.log("[DEBUG] Datos crudos de valoración:", data);
        console.log("[DEBUG] Paciente en datos crudos:", data.paciente);
        setValoracionRaw(data);

        // Determinar el esquema usando campos snake_case de PostgreSQL
        // Priorizar cod_consulta sobre tipo_programa para mayor precisión
        const codConsulta = data.cod_consulta || "";
        const tp = data.tipo_programa || "";

        if (codConsulta === "890204") {
          setEsquema(ESQUEMA_CONSENTIMIENTO_PERINATAL);
        } else if (codConsulta === "890202") {
          setEsquema(ESQUEMA_VALORACION_PISO_PELVICO);
        } else if (codConsulta === "890201") {
          setEsquema(ESQUEMA_VALORACION_PEDIATRIA);
        } else if (
          tp.includes("Lactancia") ||
          data.modulo_lactancia?.tipo_lactancia ||
          codConsulta === "890203"
        ) {
          setEsquema(ESQUEMA_VALORACION_LACTANCIA);
        } else if (tp.includes("Piso")) {
          setEsquema(ESQUEMA_VALORACION_PISO_PELVICO);
        } else if (tp === "Perinatal") {
          setEsquema(ESQUEMA_CONSENTIMIENTO_PERINATAL);
        } else if (tp === "Pediatría") {
          setEsquema(ESQUEMA_VALORACION_PEDIATRIA);
        } else {
          // Default según módulos poblados
          if (
            data.modulo_perinatal &&
            Object.keys(data.modulo_perinatal).length > 0
          ) {
            setEsquema(ESQUEMA_CONSENTIMIENTO_PERINATAL);
          } else if (
            data.modulo_pediatria &&
            Object.keys(data.modulo_pediatria).length > 0
          ) {
            setEsquema(ESQUEMA_VALORACION_PEDIATRIA);
          } else if (
            data.modulo_piso_pelvico &&
            Object.keys(data.modulo_piso_pelvico).length > 0
          ) {
            setEsquema(ESQUEMA_VALORACION_PISO_PELVICO);
          } else {
            setEsquema(ESQUEMA_VALORACION_PEDIATRIA);
          }
        }

        // Convertir a camelCase para los esquemas del frontend
        let converted = convertKeysToCamelCase(data);
        // Mapear datos legacy a la estructura moderna para que se vean en el formulario
        converted = mapearDatosLegacy(converted);
        // Aplicar mapeo específico para perinatal
        converted = mapearDatosPerinatal(converted);
        // Crear secciones dinámicas con TODA la información de cada módulo
        converted = crearModuloCompleto(
          converted,
          "moduloPerinatal",
          "moduloPerinatalCompleto",
        );
        converted = crearModuloCompleto(
          converted,
          "moduloLactancia",
          "moduloLactanciaCompleto",
        );
        converted = crearModuloCompleto(
          converted,
          "moduloPisoPelvico",
          "moduloPisoPelvicoCompleto",
        );
        converted = crearModuloCompleto(
          converted,
          "moduloPediatria",
          "moduloPediatriaCompleto",
        );
        console.log(
          "[DEBUG] Esquema seleccionado:",
          esquema?.nombre || esquema,
        );
        console.log(
          "[DEBUG] Datos convertidos - moduloLactancia:",
          converted.moduloLactancia,
        );
        console.log(
          "[DEBUG] Datos convertidos - antecedentes:",
          converted.antecedentes,
        );
        console.log(
          "[DEBUG] Datos convertidos - motivoConsulta:",
          converted.motivoConsulta,
        );
        setValoracion(converted);
      } catch (err) {
        console.error("Error al cargar valoración:", err);
        Swal.fire("Error", "No se pudo cargar la valoración", "error");
      }
    };
    cargarDatos();
  }, [id]);

  const handleExportPDF = async () => {
    try {
      Swal.fire({
        title: "Generando PDF...",
        text: "Preparando el informe con firmas desde el servidor",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });

      const tp = valoracionRaw.tipo_programa || "";
      let type = "nino";
      if (
        tp.includes("Lactancia") ||
        valoracionRaw.modulo_lactancia?.tipo_lactancia
      )
        type = "lactancia";
      else if (tp.includes("Piso") || valoracionRaw.cod_consulta === "890202")
        type = "adulto";
      else if (tp === "Perinatal" || valoracionRaw.cod_consulta === "890204")
        type = "perinatal";
      const blob = await apiDownload(
        `/valoraciones/reporte/exportar-pdf/${id}?type=${type}`,
      );

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `HC_${valoracionRaw.paciente?.num_documento_identificacion || id}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      Swal.close();
    } catch (error) {
      console.error("Error exportando PDF:", error);
      Swal.fire("Error", "No se pudo generar el reporte PDF.", "error");
    }
  };

  const handleLock = async () => {
    const result = await Swal.fire({
      title: "¿Cerrar Historia Clínica?",
      text: "Una vez bloqueada, la historia clínica será inmutable y no podrá ser editada, cumpliendo con la normativa vigente.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, cerrar permanentemente",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      try {
        await apiRequest(`/valoraciones/${id}`, {
          method: "PUT",
          body: JSON.stringify({ bloqueada: true }),
        });
        // Recargar
        const updated = await apiRequest(`/valoraciones/${id}`);
        setValoracionRaw(updated);
        setValoracion(convertKeysToCamelCase(updated));
        Swal.fire("Bloqueada", "El registro ahora es inmutable.", "success");
      } catch (error) {
        Swal.fire(
          "Error",
          "No se pudo cerrar la historia: " + error.message,
          "error",
        );
      }
    }
  };

  if (!valoracion || !esquema || !valoracionRaw)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-indigo-600"></div>
        <p className="mt-4 text-indigo-700 font-bold">
          Cargando Historia Clínica...
        </p>
      </div>
    );

  return (
    <DynamicDetailBuilder
      esquema={esquema}
      data={valoracion}
      onBack={() => navigate("/valoraciones")}
      onEdit={() => navigate(`/valoraciones/editar/${id}`)}
      onExportPDF={handleExportPDF}
      onLock={handleLock}
    />
  );
}
