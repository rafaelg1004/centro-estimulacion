import { apiRequest } from "../config/api";
import { ESQUEMA_VALORACION_PEDIATRIA } from "../config/esquemaValoracionPediatria";
import { ESQUEMA_VALORACION_LACTANCIA } from "../config/esquemaValoracionLactancia";
import { ESQUEMA_VALORACION_PISO_PELVICO } from "../config/esquemaValoracionPisoPelvico";
import { ESQUEMA_VALORACION_PERINATAL } from "../config/esquemaValoracionPerinatal";
import { ESQUEMAS_SEGUIMIENTO } from "../config/esquemaValoracionSeguimiento";

/**
 * Obtiene el esquema de Pediatría Inicial desde la base de datos (/api/plantillas),
 * con respaldo automático al esquema local si la API no está disponible.
 */
export async function obtenerEsquemaPediatria() {
  try {
    const esq = await apiRequest("/plantillas/PEDIATRIA_INICIAL/esquema");
    if (esq && Array.isArray(esq.secciones) && esq.secciones.length > 0) {
      return esq;
    }
  } catch (e) {
    console.log("ℹ️ Usando esquema local de Pediatría como respaldo:", e?.message);
  }
  return ESQUEMA_VALORACION_PEDIATRIA;
}

/**
 * Determina el esquema correspondiente para ver o editar una valoración existente.
 */
export async function seleccionarEsquemaValoracion(data) {
  const codConsulta = String(data?.cod_consulta || "").split(" ")[0].trim();
  const tp = data?.tipo_programa || "";

  const esSeguimiento =
    tp.toLowerCase().includes("seguimiento") ||
    codConsulta === "890311" ||
    data?.modulo_pediatria?.esSeguimiento ||
    data?.modulo_piso_pelvico?.esSeguimiento ||
    data?.modulo_lactancia?.esSeguimiento ||
    data?.modulo_perinatal?.esSeguimiento ||
    data?.examen_fisico?.esSeguimiento;

  if (esSeguimiento) {
    if (tp.includes("Perinatal") || data?.modulo_perinatal) {
      return ESQUEMAS_SEGUIMIENTO.PERINATAL;
    }
    if (tp.includes("Piso") || data?.modulo_piso_pelvico) {
      return ESQUEMAS_SEGUIMIENTO.PISO_PELVICO;
    }
    if (tp.includes("Lactancia") || data?.modulo_lactancia) {
      return ESQUEMAS_SEGUIMIENTO.LACTANCIA;
    }
    return ESQUEMAS_SEGUIMIENTO.PEDIATRIA;
  }

  if (tp === "Pediatría" || tp === "Pediatria") {
    return await obtenerEsquemaPediatria();
  }
  if (tp === "Perinatal") {
    return ESQUEMA_VALORACION_PERINATAL;
  }
  if (tp.includes("Piso")) {
    return ESQUEMA_VALORACION_PISO_PELVICO;
  }
  if (tp.includes("Lactancia") || data?.modulo_lactancia?.tipo_lactancia) {
    return ESQUEMA_VALORACION_LACTANCIA;
  }

  if (codConsulta === "890211") return ESQUEMA_VALORACION_PERINATAL;
  if (codConsulta === "890202") return ESQUEMA_VALORACION_PISO_PELVICO;
  if (codConsulta === "890201") return await obtenerEsquemaPediatria();
  if (codConsulta === "890203") return ESQUEMA_VALORACION_LACTANCIA;

  if (data?.modulo_perinatal && Object.keys(data.modulo_perinatal).length > 0) {
    return ESQUEMA_VALORACION_PERINATAL;
  }
  if (data?.modulo_pediatria && Object.keys(data.modulo_pediatria).length > 0) {
    return await obtenerEsquemaPediatria();
  }
  if (data?.modulo_piso_pelvico && Object.keys(data.modulo_piso_pelvico).length > 0) {
    return ESQUEMA_VALORACION_PISO_PELVICO;
  }

  return await obtenerEsquemaPediatria();
}

