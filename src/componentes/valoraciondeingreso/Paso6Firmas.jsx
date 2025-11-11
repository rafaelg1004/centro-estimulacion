import React from "react";
import FirmaCanvas from "./FirmaCanvas";

const Paso6Firmas = ({
  formulario,
  handleChange,
  setFormulario,
  setPaso,
  InputField,
  onFirmaChange,
}) => (
  <div className="space-y-4">
    <h3 className="text-xl font-bold text-indigo-600 mb-2">
      Paso 6: Firma del Profesional y Representante
    </h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="space-y-2 border rounded-md p-4 shadow-sm">
        <h4 className="font-semibold text-indigo-700 mb-2">Profesional</h4>
        <InputField
          label="Nombre del Profesional"
          name="nombreFisioterapeuta"
          value={formulario.nombreFisioterapeuta || ""}
          onChange={handleChange}
          required
          disabled
        />
        <InputField
          label="Cédula del Profesional"
          name="cedulaFisioterapeuta"
          value={formulario.cedulaFisioterapeuta || ""}
          onChange={handleChange}
          required
          disabled
        />
        <FirmaCanvas
          label="Firma del Profesional"
          name="firmaProfesional"
          setFormulario={onFirmaChange}
          formulario={formulario}
        />
      </div>
      <div className="space-y-2 border rounded-md p-4 shadow-sm">
        <h4 className="font-semibold text-indigo-700 mb-2">Representante</h4>
        <InputField
          label="Nombre del Acudiente"
          name="nombreAcudiente"
          value={formulario.nombreAcudiente || ""}
          onChange={handleChange}
        />
        <InputField
          label="Cédula del Representante"
          name="cedulaAcudiente"
          value={formulario.cedulaAcudiente || ""}
          onChange={handleChange}
        />
        <FirmaCanvas
          label="Firma del Representante"
          name="firmaRepresentante"
          setFormulario={onFirmaChange}
          formulario={formulario}
        />
      </div>
    </div>
    <div className="flex justify-between pt-6">
      <button
        type="button"
        onClick={() => setPaso(5)}
        className="bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded"
      >
        Anterior
      </button>
      <button
        type="button"
        onClick={() => setPaso(7)}
        className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded"
      >
        Siguiente
      </button>
    </div>
  </div>
);

export default Paso6Firmas;