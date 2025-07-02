import React from "react";
import FirmaCanvas from "./FirmaCanvas";

const SoloFirmas = ({ formulario, setFormulario }) => (
  <div className="space-y-4">
    <h3 className="text-xl font-bold text-indigo-600 mb-2">
      Firmas
    </h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Profesional */}
      <div className="space-y-2 border rounded-md p-4 shadow-sm">
        <h4 className="font-semibold text-indigo-700 mb-2">Profesional</h4>
        <FirmaCanvas
          label="Firma del Profesional"
          name="firmaProfesional"
          setFormulario={setFormulario}
          formulario={formulario}
        />
      </div>
      {/* Representante */}
      <div className="space-y-2 border rounded-md p-4 shadow-sm">
        <h4 className="font-semibold text-indigo-700 mb-2">Representante</h4>
        <FirmaCanvas
          label="Firma del Representante"
          name="firmaRepresentante"
          setFormulario={setFormulario}
          formulario={formulario}
        />
      </div>
    </div>
  </div>
);

export default SoloFirmas;