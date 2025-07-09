import React from "react";

const Paso5Diagnostico = ({
  formulario,
  handleChange,
  setPaso,
}) => {
  const diagnosticoOpciones = {
    opcion1: "Paciente con adecuado desarrollo neuromotor acorde a su edad cronológica, con adquisición oportuna de los hitos del desarrollo en las áreas de motricidad gruesa, motricidad fina, lenguaje y socioemocional.",
    opcion2: "Se evidencia un retraso en el desarrollo neuromotor en relación con la edad cronológica del niño(a), observándose la ausencia o inmadurez en hitos esperados. Este retraso puede estar asociado a falta de estimulación."
  };

  const planTratamientoOpciones = {
    opcion1: "Se propone iniciar un proceso de estimulación adecuada con el objetivo de favorecer el desarrollo integral del niño(a), fortaleciendo áreas como la motricidad, el lenguaje, la interacción social y la exploración sensorial.",
    opcion2: "Se propone iniciar un proceso de estimulación adecuada con el objetivo de favorecer el desarrollo integral del niño(a), fortaleciendo áreas como la motricidad, el lenguaje, la interacción social y la exploración sensorial. Se trabajará con sesiones grupales estructuradas y orientación a la familia, además de sesiones personalizadas."
  };

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-indigo-600 mb-4">
        Paso 5: Diagnóstico Fisioterapéutico y Plan de Tratamiento
      </h3>

      {/* Diagnóstico Fisioterapéutico */}
      <div className="bg-blue-50 p-4 rounded-lg">
        <h4 className="text-lg font-semibold text-blue-800 mb-4">Diagnóstico Fisioterapéutico</h4>
        
        <div className="space-y-4">
          <label className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-blue-100 cursor-pointer">
            <input
              type="radio"
              name="diagnosticoFisioterapeutico"
              value="opcion1"
              checked={formulario.diagnosticoFisioterapeutico === "opcion1"}
              onChange={handleChange}
              className="mt-1 flex-shrink-0"
            />
            <div>
              <span className="font-medium text-blue-900">Opción 1:</span>
              <p className="text-sm text-gray-700 mt-1">{diagnosticoOpciones.opcion1}</p>
            </div>
          </label>

          <label className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-blue-100 cursor-pointer">
            <input
              type="radio"
              name="diagnosticoFisioterapeutico"
              value="opcion2"
              checked={formulario.diagnosticoFisioterapeutico === "opcion2"}
              onChange={handleChange}
              className="mt-1 flex-shrink-0"
            />
            <div>
              <span className="font-medium text-blue-900">Opción 2:</span>
              <p className="text-sm text-gray-700 mt-1">{diagnosticoOpciones.opcion2}</p>
            </div>
          </label>
        </div>
      </div>

      {/* Plan de Tratamiento */}
      <div className="bg-green-50 p-4 rounded-lg">
        <h4 className="text-lg font-semibold text-green-800 mb-4">Plan de Tratamiento</h4>
        
        <div className="space-y-4">
          <label className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-green-100 cursor-pointer">
            <input
              type="radio"
              name="planTratamiento"
              value="opcion1"
              checked={formulario.planTratamiento === "opcion1"}
              onChange={handleChange}
              className="mt-1 flex-shrink-0"
            />
            <div>
              <span className="font-medium text-green-900">Opción 1:</span>
              <p className="text-sm text-gray-700 mt-1">{planTratamientoOpciones.opcion1}</p>
            </div>
          </label>

          <label className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-green-100 cursor-pointer">
            <input
              type="radio"
              name="planTratamiento"
              value="opcion2"
              checked={formulario.planTratamiento === "opcion2"}
              onChange={handleChange}
              className="mt-1 flex-shrink-0"
            />
            <div>
              <span className="font-medium text-green-900">Opción 2:</span>
              <p className="text-sm text-gray-700 mt-1">{planTratamientoOpciones.opcion2}</p>
            </div>
          </label>
        </div>
      </div>

      <div className="flex justify-between pt-6">
        <button
          type="button"
          onClick={() => setPaso(4)}
          className="bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded"
        >
          Anterior
        </button>
        <button
          type="button"
          onClick={() => setPaso(6)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded"
        >
          Siguiente
        </button>
      </div>
    </div>
  );
};

export default Paso5Diagnostico;