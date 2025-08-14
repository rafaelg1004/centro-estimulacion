import React from "react";
import FirmaCanvas from "../valoraciondeingreso/FirmaCanvas";
import Swal from "sweetalert2";

export default function Paso8ConsentimientoEducacionIntensivoPerinatal({ formulario, handleChange, setFirma, anterior, onSubmit, tipoPrograma, paciente }) {
  const mostrarGuardar = tipoPrograma === "intensivo" || tipoPrograma === "ambos";
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
      <h3 className="text-lg font-bold text-indigo-700 mb-4 text-center">CONSENTIMIENTO INFORMADO PROGRAMA DE EDUCACION PARA EL NACIMIENTO</h3>
      <div className="mb-6 bg-indigo-50 rounded p-4 text-gray-700 text-justify">
        Usted va a iniciar nuestro Programa de Educacion para el Nacimiento Intensivo consta de 3 sesiones Teórico -prácticas para los padres, descritas a continuación.
      </div>
      <div className="mb-4 text-gray-700">
        Yo <span className="font-semibold underline">{paciente?.nombres || "____________________"}</span> identificada con Cédula de Ciudadanía <span className="font-semibold underline">{paciente?.cedula || "_____________"}</span> he entendido con claridad la explicación que me ha dado la Fisioterapeuta Dayan Ivonne Villegas Gamboa en las líneas anteriores. Por lo cual comprendo los beneficios y riesgos. Así mismo, me considero conforme y satisfecha con la información que se me ha suministrado comprendiendo de manera global todo lo que conlleva hacer parte de este programa. Por lo que a través de la presente, doy mi consentimiento expreso para que el tratamiento sea llevado a cabo. Adicional a este servicio manejamos asesoría en Lactancia la cual consiste en dos visitas en clínica y en casa, después del nacimiento del bebé. Este servicio tienes costo de $120.000= se programa idealmente con tiempo para contar con la disponibilidad.
      </div>
      {process.env.NODE_ENV === 'development' && (
        <div className="mb-4 p-2 bg-red-100 text-xs">
          Debug Paso 8 - firmaPacienteEducacion: {formulario.firmaPacienteEducacion ? 'TIENE FIRMA' : 'VACIO'}<br/>
          Valor real: {formulario.firmaPacienteEducacion || 'undefined/null/empty'}<br/>
          firmaPacienteGeneral: {formulario.firmaPacienteGeneral ? 'TIENE FIRMA' : 'VACIO'}
        </div>
      )}
      <div className="mb-8 grid grid-cols-1 sm:grid-cols-2 gap-8">
        <div>
          <FirmaCanvas
            label="Firma de Paciente (Educación)"
            name="firmaPacienteEducacion"
            setFormulario={setFirma}
            formulario={formulario}
          />
        </div>
        <div>
          <FirmaCanvas
            label="Firma del Fisioterapeuta (Educación)"
            name="firmaFisioterapeutaEducacion"
            setFormulario={setFirma}
            formulario={formulario}
          />
        </div>
      </div>
      <div className="flex justify-between mt-8">
        <button
          type="button"
          onClick={() => anterior(6)}
          className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-6 rounded transition"
        >
          Anterior
        </button>
        {mostrarGuardar && (
          <button
            type="button"
            onClick={tipoPrograma === "intensivo" ? handleGuardar : onSubmit}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded transition"
          >
            Guardar
          </button>
        )}
      </div>
    </div>
  );
}