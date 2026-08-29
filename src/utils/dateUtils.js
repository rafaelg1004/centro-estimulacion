/**
 * Utilidades para el manejo de fechas sin desfasajes de zona horaria (UTC vs Local).
 */

/**
 * Convierte un string de fecha (ej: "1995-05-22" o "1995-05-22T00:00:00.000Z" o un objeto Date)
 * a un objeto Date en la zona horaria local a las 00:00:00 horas,
 * evitando que la conversión UTC reste horas y cambie el día en zonas horarias negativas.
 */
export const parseFechaLocal = (dateVal) => {
  if (!dateVal) return null;

  if (dateVal instanceof Date) {
    if (isNaN(dateVal.getTime())) return null;
    // Si fue creado con UTC medianoche (ej: new Date("YYYY-MM-DD"))
    if (dateVal.getUTCHours() === 0 && dateVal.getUTCMinutes() === 0 && dateVal.getUTCSeconds() === 0) {
      return new Date(dateVal.getUTCFullYear(), dateVal.getUTCMonth(), dateVal.getUTCDate());
    }
    return new Date(dateVal.getFullYear(), dateVal.getMonth(), dateVal.getDate());
  }

  const str = String(dateVal).trim();
  const soloFecha = str.split('T')[0];
  const partes = soloFecha.split('-');

  if (partes.length === 3) {
    const [year, month, day] = partes.map(Number);
    if (!isNaN(year) && !isNaN(month) && !isNaN(day)) {
      return new Date(year, month - 1, day);
    }
  }

  return new Date(dateVal);
};

/**
 * Formatea una fecha como string en formato legible (ej: "22 de mayo de 1995" o "22/05/1995")
 * sin sufrir desfasajes de un día atrás por zona horaria.
 */
export const formatearFecha = (dateVal, options = { year: 'numeric', month: 'long', day: 'numeric' }) => {
  if (!dateVal) return "No registrado";
  const d = parseFechaLocal(dateVal);
  if (!d || isNaN(d.getTime())) return "Fecha inválida";
  return d.toLocaleDateString("es-CO", options);
};

/**
 * Retorna la fecha corta en formato YYYY-MM-DD para usar en inputs tipo date.
 */
export const obtenerFechaInput = (dateVal) => {
  if (!dateVal) return "";
  const d = parseFechaLocal(dateVal);
  if (!d || isNaN(d.getTime())) return "";
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Calcula la edad (en meses si es niño, en años si es adulto) garantizando
 * que la fecha de nacimiento no se desfase un día por la zona horaria.
 */
export const calcularEdadSegura = (fechaNac, isNino = false) => {
  if (!fechaNac) return "";
  const nacimiento = parseFechaLocal(fechaNac);
  if (!nacimiento || isNaN(nacimiento.getTime())) return "";

  const hoy = new Date();

  if (isNino) {
    const meses = (hoy.getFullYear() - nacimiento.getFullYear()) * 12 + (hoy.getMonth() - nacimiento.getMonth());
    return meses >= 0 ? meses : 0;
  } else {
    let edadAnos = hoy.getFullYear() - nacimiento.getFullYear();
    if (
      hoy.getMonth() < nacimiento.getMonth() ||
      (hoy.getMonth() === nacimiento.getMonth() && hoy.getDate() < nacimiento.getDate())
    ) {
      edadAnos--;
    }
    return edadAnos >= 0 ? edadAnos : 0;
  }
};

/**
 * Formatea una fecha en texto completo en español (ej: "26 de octubre de 2026")
 * garantizando cero desfasaje de zona horaria.
 */
export const formatearFechaEspanol = (dateVal) => {
  if (!dateVal) return "No registrada";
  const d = parseFechaLocal(dateVal);
  if (!d || isNaN(d.getTime())) return "Fecha inválida";

  const meses = [
    "enero", "febrero", "marzo", "abril", "mayo", "junio",
    "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"
  ];
  const dia = d.getDate();
  const mes = meses[d.getMonth()];
  const anio = d.getFullYear();

  return `${dia} de ${mes} de ${anio}`;
};

/**
 * Calcula la fecha del próximo cumpleaños y los días faltantes.
 */
export const calcularProximoCumpleanos = (fechaNac) => {
  if (!fechaNac) return null;
  const nacimiento = parseFechaLocal(fechaNac);
  if (!nacimiento || isNaN(nacimiento.getTime())) return null;

  const hoy = new Date();
  const hoySinHora = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());

  let anioCumple = hoy.getFullYear();
  let proximoCumple = new Date(anioCumple, nacimiento.getMonth(), nacimiento.getDate());

  // Si el cumpleaños de este año ya pasó (es anterior a hoy)
  if (proximoCumple.getTime() < hoySinHora.getTime()) {
    anioCumple++;
    proximoCumple = new Date(anioCumple, nacimiento.getMonth(), nacimiento.getDate());
  }

  const diffMs = proximoCumple.getTime() - hoySinHora.getTime();
  const diasFaltantes = Math.round(diffMs / (1000 * 60 * 60 * 24));
  const edadACumplir = anioCumple - nacimiento.getFullYear();

  let textoFaltante = "";
  if (diasFaltantes === 0) {
    textoFaltante = "¡Hoy es su cumpleaños! 🎉";
  } else if (diasFaltantes === 1) {
    textoFaltante = "Mañana";
  } else {
    textoFaltante = `Faltan ${diasFaltantes} días`;
  }

  return {
    fecha: proximoCumple,
    fechaFormateada: formatearFechaEspanol(proximoCumple),
    diasFaltantes,
    textoFaltante,
    edadACumplir
  };
};
