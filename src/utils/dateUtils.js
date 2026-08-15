/**
 * Utilidades para el manejo de fechas sin desfasajes de zona horaria (UTC vs Local).
 */

/**
 * Convierte un string de fecha (ej: "1995-05-22" o "1995-05-22T00:00:00.000Z")
 * a un objeto Date en la zona horaria local a las 00:00:00 horas,
 * evitando que la conversión UTC reste horas y cambie el día.
 */
export const parseFechaLocal = (dateVal) => {
  if (!dateVal) return null;
  if (dateVal instanceof Date) return dateVal;
  
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
  const str = String(dateVal).trim();
  return str.split('T')[0];
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
