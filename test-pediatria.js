const newData = {
  codConsulta: 890201,
  tipoPrograma: null
};

const legacy = {};

const esPediatria1 = newData.tipoPrograma === "Pediatría" || newData.tipoPrograma === "Pediatria" || (!newData.tipoPrograma && legacy.tipoPrograma === "Pediatría") || newData.codConsulta === "890201";

const esPediatria2 = newData.tipoPrograma === "Pediatría" || newData.tipoPrograma === "Pediatria" || (!newData.tipoPrograma && legacy.tipoPrograma === "Pediatría") || String(newData.codConsulta) === "890201";

console.log("Strict === string:", esPediatria1);
console.log("String():", esPediatria2);

