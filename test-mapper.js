function mapearDatosLegacy(data) {
  const legacy = data.datosLegacy || data._datosLegacy;
  if (!legacy || Object.keys(legacy).length === 0) return data;

  const newData = { ...data };
  
  const esPediatria = newData.tipoPrograma === "Pediatría" || newData.tipoPrograma === "Pediatria" || (!newData.tipoPrograma && legacy.tipoPrograma === "Pediatría") || String(newData.codConsulta) === "890201";
  
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
    }

    // Perinatales
    if (!newData.moduloPediatria.perinatales) newData.moduloPediatria.perinatales = {};
    newData.moduloPediatria.perinatales.tipoParto = legacy.tipoParto || "";
    newData.moduloPediatria.perinatales.tiempoGestacion = legacy.tiempoGestacion || "";
  }
  return newData;
}

const mockData = {
  codConsulta: "890201",
  tipoPrograma: "Pediatría",
  datosLegacy: {
    tipoParto: "Cesárea",
    tiempoGestacion: "39",
    motivoDeConsulta: "estimulacion"
  }
};

const mapped = mapearDatosLegacy(mockData);
console.log(JSON.stringify(mapped, null, 2));

