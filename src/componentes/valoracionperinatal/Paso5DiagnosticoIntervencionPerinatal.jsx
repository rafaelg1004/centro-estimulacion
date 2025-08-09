import React, { useRef } from "react";
import FirmaCanvas from "../valoraciondeingreso/FirmaCanvas";

export default function Paso5DiagnosticoIntervencionPerinatal({ formulario, setFirma, handleChange, anterior, siguiente }) {
  // Opciones de programa
  const opcionesPrograma = [
    { value: "fisico", label: "Solo Acondicionamiento Físico" },
    { value: "educacion", label: "Solo Programa de Educación para el Nacimiento" },
    { value: "ambos", label: "Ambos programas (Físico y Educación)" },
    { value: "intensivo", label: "Programa de Educación para el Nacimiento Intensivo" },
  ];

  // Determinar qué firmas mostrar
  const mostrarFirmaAutorizacion = formulario.tipoPrograma === "fisico" || formulario.tipoPrograma === "ambos";

  const selectRef = useRef();

  return (
    <div>
      <h3 className="text-lg font-bold text-indigo-700 mb-4">5. Diagnóstico y Plan de Intervención</h3>

      {/* Selector de tipo de programa */}
      <div className="mb-6">
        <label className="font-semibold block mb-2">Selecciona el tipo de programa:</label>
        <select
          ref={selectRef}
          name="tipoPrograma"
          value={formulario.tipoPrograma || ""}
          onChange={e => handleChange({ tipoPrograma: e.target.value })}
          className="w-full border rounded p-2"
        >
          <option value="">Seleccione una opción</option>
          {opcionesPrograma.map(op => (
            <option key={op.value} value={op.value}>{op.label}</option>
          ))}
        </select>
      </div>

      <div className="mb-6">
        <label className="font-semibold">Diagnóstico Fisioterapéutico:</label>
        <textarea
          name="diagnosticoFisioterapeutico"
          value={formulario.diagnosticoFisioterapeutico || ""}
          onChange={e => handleChange({ diagnosticoFisioterapeutico: e.target.value })}
          className="w-full border rounded p-2"
          rows={3}
        />
      </div>
      <div className="mb-6">
        <label className="font-semibold">Plan de Intervención:</label>
        <textarea
          name="planIntervencion"
          value={formulario.planIntervencion || ""}
          onChange={e => handleChange({ planIntervencion: e.target.value })}
          className="w-full border rounded p-2"
          rows={3}
        />
      </div>
      <div className="mb-6">
        <label className="font-semibold">Visita de Cierre:</label>
        <textarea
          name="visitaCierre"
          value={formulario.visitaCierre || ""}
          onChange={e => handleChange({ visitaCierre: e.target.value })}
          className="w-full border rounded p-2"
          rows={5}
        />
      </div>

      <div className="mb-8 grid grid-cols-1 sm:grid-cols-2 gap-8">
        <div>
          <label className="font-semibold block mb-1">Firma de Paciente:</label>
          <FirmaCanvas
            label="Firma de Paciente"
            name="firmaPaciente"
            setFormulario={setFirma}
            formulario={formulario}
          />
        </div>
        <div>
          <label className="font-semibold block mb-1">Firma del Fisioterapeuta:</label>
          <FirmaCanvas
            label="Firma del Fisioterapeuta"
            name="firmaFisioterapeuta"
            setFormulario={setFirma}
            formulario={formulario}
          />
        </div>
      </div>

      {/* Solo mostrar la autorización si corresponde */}
      {mostrarFirmaAutorizacion && (
        <>
          <div className="mb-6 bg-indigo-50 rounded p-4 text-gray-700">
            <p>
              <span className="font-semibold">Autorización:</span> Autorizo a D&#39;Mamitas &amp; Babies para reproducir fotografías e imágenes de las actividades en las que participe, para ser utilizadas en sus publicaciones, proyectos, redes sociales y página web.
            </p>
          </div>
          <div className="mb-8">
            <FirmaCanvas
              label="Firma de Paciente para Autorización"
              name="firmaAutorizacion"
              setFormulario={setFirma}
              formulario={formulario}
            />
          </div>
        </>
      )}

      <div className="flex justify-between mt-8">
        <button
          type="button"
          onClick={anterior}
          className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-6 rounded transition"
        >
          Anterior
        </button>
        <button
          type="button"
          disabled={!formulario.tipoPrograma}
          onClick={e => {
            // Lee el valor directamente del select
            const tipoProgramaActual = document.querySelector('select[name="tipoPrograma"]').value;
            console.log("Click en Siguiente Paso 5 (directo del DOM)", tipoProgramaActual);
            if (typeof siguiente === "function") {
              siguiente(tipoProgramaActual);
            }
          }}
          className={`bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded transition ${!formulario.tipoPrograma ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          Siguiente
        </button>
      </div>
    </div>
  );
}