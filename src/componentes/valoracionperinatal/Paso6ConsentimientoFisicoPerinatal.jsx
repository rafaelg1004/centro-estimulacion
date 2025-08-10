import React from "react";
import FirmaCanvas from "../valoraciondeingreso/FirmaCanvas";

export default function Paso6ConsentimientoFisicoPerinatal({ formulario, handleChange, setFirma, anterior, onSubmit, siguiente, tipoPrograma, paciente }) {
  // Mostrar Guardar solo si es fisico, Siguiente solo si es ambos
  const mostrarGuardar = tipoPrograma === "fisico";
  const mostrarSiguiente = tipoPrograma === "ambos";
  
  return (
    <div>
      <h3 className="text-lg font-bold text-indigo-700 mb-4">6. Consentimiento Informado Programa de Acondicionamiento Físico</h3>
      <div className="mb-4 text-gray-700">
        Yo <span className="font-semibold underline">{paciente?.nombres || "____________________"}</span> identificada con Cédula de Ciudadanía <span className="font-semibold underline">{paciente?.cedula || "_____________"}</span> he entendido con claridad la explicación que me ha dado la Fisioterapeuta Dayan Ivonne Villegas Gamboa en las líneas anteriores. Por lo cual comprendo los beneficios y riesgos. Así mismo, me considero conforme y satisfecha con la información que se me ha suministrado comprendiendo de manera global todo lo que conlleva hacer parte de este programa. Por favor hágale saber a su médico tratante que está haciendo parte de este programa de acondicionamiento físico.
      </div>
      <div className="mb-8 grid grid-cols-1 sm:grid-cols-2 gap-8">
        <div>
          <FirmaCanvas
            label="Firma de Paciente (General)"
            name="firmaPacienteGeneral"
            setFormulario={setFirma}
            formulario={formulario}
          />
        </div>
        <div>
          <FirmaCanvas
            label="Firma de Fisioterapeuta (Consentimiento)"
            name="firmaFisioterapeutaConsentimiento"
            setFormulario={setFirma}
            formulario={formulario}
          />
        </div>
      </div>
      <div className="flex justify-between mt-8">
        <button
          type="button"
          onClick={() => {
            if (tipoPrograma === "fisico") {
              anterior();
            } else {
              anterior();
            }
          }}
          className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-6 rounded transition"
        >
          Anterior
        </button>
        {mostrarSiguiente && (
          <button
            type="button"
            onClick={siguiente}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded transition"
          >
            Siguiente
          </button>
        )}
        {mostrarGuardar && (
          <button
            type="button"
            onClick={onSubmit}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded transition"
          >
            Guardar
          </button>
        )}
      </div>
    </div>
  );
}