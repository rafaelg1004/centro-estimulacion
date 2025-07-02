import React from "react";

const Paso5Diagnostico = ({
  formulario,
  handleChange,
  setPaso,
}) => (
  <div className="space-y-4">
    <h3 className="text-xl font-bold text-indigo-600 mb-2">
      Paso 5: Diagnóstico Fisioterapéutico y Plan de Tratamiento
    </h3>

    <div>
      <label htmlFor="diagnostico" className="block font-semibold mb-1">
        Diagnóstico Fisioterapéutico
      </label>
      <textarea
        id="diagnostico"
        name="diagnostico"
        value={formulario.diagnostico || ""}
        onChange={handleChange}
        rows={4}
        className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
      />
    </div>

    <div>
      <label htmlFor="planTratamiento" className="block font-semibold mb-1">
        Plan de Tratamiento
      </label>
      <textarea
        id="planTratamiento"
        name="planTratamiento"
        value={formulario.planTratamiento || ""}
        onChange={handleChange}
        rows={4}
        className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
      />
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

export default Paso5Diagnostico;