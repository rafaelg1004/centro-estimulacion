function snakeToCamel(str) {
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
}

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
    if (value !== null && typeof value === "object" && !Array.isArray(value)) {
      newObj[camelKey] = convertKeysToCamelCase(value);
    } else {
      newObj[camelKey] = value;
    }
  }
  return newObj;
}

const data = {
  datos_legacy: {
    tipoParto: "Cesárea",
    tiempoGestacion: "39",
    lugarParto: "Casa del Niño",
    motivoDeConsulta: "estimulacion"
  }
};

const converted = convertKeysToCamelCase(data);
console.log(JSON.stringify(converted, null, 2));

const legacy = converted.datosLegacy || converted._datosLegacy;
console.log("legacy exists?", !!legacy);
console.log("tipoParto:", legacy?.tipoParto);
console.log("motivoDeConsulta:", legacy?.motivoDeConsulta);

