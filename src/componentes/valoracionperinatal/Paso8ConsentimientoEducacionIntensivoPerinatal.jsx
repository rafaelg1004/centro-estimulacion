import React from "react";
import FirmaCanvas from "../valoraciondeingreso/FirmaCanvas";
import Swal from "sweetalert2";

export default function Paso8ConsentimientoEducacionIntensivoPerinatal({ formulario, handleChange, setFirma, anterior, onSubmit, tipoPrograma, paciente }) {
  const mostrarGuardar = tipoPrograma === "intensivo";
  const handleGuardar = async (e) => {
    e.preventDefault();
    const result = await Swal.fire({
      title: "¿Deseas guardar el consentimiento?",
      text: "Confirma que quieres guardar este registro.",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#6366f1",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, guardar",
      cancelButtonText: "Cancelar",
    });
    if (result.isConfirmed) {
      onSubmit();
    }
  };
  return (
    <div>
      <h3 className="text-lg font-bold text-indigo-700 mb-4">8. Consentimiento Informado Programa de Educación para el Nacimiento Intensivo</h3>
      <div className="mb-4 text-gray-700">
        Yo <span className="font-semibold underline">{paciente?.nombres || "____________________"}</span> identificada con Cédula de Ciudadanía <span className="font-semibold underline">{paciente?.cedula || "_____________"}</span> he entendido con claridad la explicación que me ha dado la Fisioterapeuta Dayan Ivonne Villegas Gamboa en las líneas anteriores. Por lo cual comprendo los beneficios y riesgos. Así mismo, me considero conforme y satisfecha con la información que se me ha suministrado comprendiendo de manera global todo lo que conlleva hacer parte de este programa.
      </div>
      <div className="mb-8 grid grid-cols-1 sm:grid-cols-2 gap-8">
        <div>
          <FirmaCanvas
            label="Firma de Paciente (General Intensivo)"
            name="firmaPacienteGeneralIntensivo"
            setFormulario={setFirma}
            formulario={formulario}
          />
        </div>
        <div>
          <FirmaCanvas
            label="Firma del Fisioterapeuta (General Intensivo)"
            name="firmaFisioterapeutaGeneralIntensivo"
            setFormulario={setFirma}
            formulario={formulario}
          />
        </div>
      </div>
      <div className="flex justify-between mt-8">
        <button
          type="button"
          onClick={() => {
            if (tipoPrograma === "intensivo") {
              anterior(5); // Forzar volver al paso 5
            } else {
              anterior();
            }
          }}
          className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-6 rounded transition"
        >
          Anterior
        </button>
        {mostrarGuardar && (
          <button
            type="button"
            onClick={handleGuardar}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded transition"
          >
            Guardar
          </button>
        )}
      </div>
    </div>
  );
}