import React from "react";
import FirmaCanvas from "../valoraciondeingreso/FirmaCanvas";

export default function Paso4PlanIntervencion({
  formulario,
  setFirma,
  siguiente,
  anterior,
}) {
  return (
    <div>
      <h3 className="text-lg font-bold mb-4 text-indigo-700">
        Plan de Intervención y Visita de Cierre
      </h3>
      <div className="mb-6">
        <label htmlFor="planIntervencion" className="block font-semibold mb-1">
          Plan de intervención
        </label>
        <textarea
          id="planIntervencion"
          name="planIntervencion"
          value={formulario.planIntervencion || ""}
          onChange={e => setFirma("planIntervencion", e.target.value)}
          className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 border-gray-300"
          rows={3}
        />
      </div>
      <div className="mb-6">
        <label htmlFor="visitaCierre" className="block font-semibold mb-1">
          Visita de cierre
        </label>
        <textarea
          id="visitaCierre"
          name="visitaCierre"
          value={formulario.visitaCierre || ""}
          onChange={e => setFirma("visitaCierre", e.target.value)}
          className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 border-gray-300"
          rows={3}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <FirmaCanvas
            label="Firma del paciente"
            name="firmaPaciente"
            setFormulario={setFirma}
            formulario={formulario}
          />
        </div>
        <div>
          <FirmaCanvas
            label="Firma del fisioterapeuta"
            name="firmaFisioterapeutaPlanIntervencion"
            setFormulario={setFirma}
            formulario={formulario}
          />
        </div>
      </div>
      <div className="flex justify-between">
        <button
          type="button"
          className="px-6 py-2 rounded-md text-white font-semibold bg-gray-400 hover:bg-gray-500 transition"
          onClick={anterior}
        >
          Anterior
        </button>
        <button
          type="button"
          className="px-6 py-2 rounded-md text-white font-semibold bg-indigo-600 hover:bg-indigo-700 transition"
          onClick={siguiente}
        >
          Siguiente
        </button>
      </div>
    </div>
  );
}