import React from "react";
import FirmaCanvas from "../valoraciondeingreso/FirmaCanvas";
import Swal from "sweetalert2";

const sesionesIntensivo = [
  "Sesión No. 1: Introducción y Autocuidado, Cuidados del Recién Nacido, Estimulación Prenatal",
  "Sesión No. 2: Trabajo de Parto, Cesárea",
  "Sesión No. 3: Lactancia, Postparto",
];

export default function Paso8ConsentimientoEducacionIntensivoPerinatal({
  formulario,
  handleChange,
  setFirma,
  anterior,
  onSubmit,
  paciente,
}) {
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
      <h3 className="text-lg font-bold text-indigo-700 mb-4">
        8. Consentimiento Informado Programa de Educación para el Nacimiento Intensivo
      </h3>
      <div className="mb-6 bg-indigo-50 rounded p-4 text-gray-700 text-justify">
        Usted va a iniciar nuestro Programa de Educación para el Nacimiento Intensivo que consta de 3 sesiones teórico-prácticas para los padres, descritas a continuación.
        <br /><br />
        <strong>Nota:</strong> Adicional a este servicio manejamos asesoría en Lactancia la cual consiste en dos visitas en clínica y en casa, después del nacimiento del bebé. Este servicio tiene costo de $120.000 y se programa idealmente con tiempo para contar con la disponibilidad.
        <br /><br />
        {/* Tabla de sesiones con fecha y firma */}
        <div className="overflow-x-auto">
          <table className="min-w-full border text-sm mb-4">
            <thead>
              <tr className="bg-indigo-100">
                <th className="px-2 py-1 border">Sesión</th>
                <th className="px-2 py-1 border">Fecha</th>
                <th className="px-2 py-1 border">Firma Paciente</th>
              </tr>
            </thead>
            <tbody>
              {sesionesIntensivo.map((sesion, idx) => (
                <tr key={idx}>
                  <td className="px-2 py-1 border">{sesion}</td>
                  <td className="px-2 py-1 border">
                    <input
                      type="date"
                      name={`fechaSesionIntensivo${idx + 1}`}
                      value={formulario[`fechaSesionIntensivo${idx + 1}`] || ""}
                      onChange={e => {
                        const fieldName = `fechaSesionIntensivo${idx + 1}`;
                        handleChange({ [fieldName]: e.target.value });
                      }}
                      className="border rounded p-1"
                    />
                  </td>
                  <td className="px-2 py-1 border">
                    <FirmaCanvas
                      label=""
                      name={`firmaPacienteSesionIntensivo${idx + 1}`}
                      setFormulario={setFirma}
                      formulario={formulario}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        Estas sesiones teórico-prácticas se llevan a cabo según programación y disponibilidad.
        <br /><br />
        Yo{" "}
        <span className="font-semibold underline">
          {paciente?.nombres || "____________________"}
        </span>{" "}
        identificada con Cédula de Ciudadanía{" "}
        <span className="font-semibold underline">
          {paciente?.cedula || "_____________"}
        </span>{" "}
        he entendido con claridad la explicación que me ha dado la Fisioterapeuta Dayan Ivonne Villegas Gamboa en las líneas anteriores. Por lo cual comprendo los beneficios y riesgos. Así mismo, me considero conforme y satisfecha con la información que se me ha suministrado comprendiendo de manera global todo lo que conlleva hacer parte de este programa. Por lo que a través de la presente, doy mi consentimiento expreso para que el tratamiento sea llevado a cabo.
      </div>

      {/* Firmas generales al final */}
      <div className="mb-8 grid grid-cols-1 sm:grid-cols-2 gap-8">
        <div>
          <FirmaCanvas
            label="Firma de Paciente (General)"
            name="firmaPacienteGeneralIntensivo"
            setFormulario={setFirma}
            formulario={formulario}
          />
        </div>
        <div>
          <FirmaCanvas
            label="Firma del Fisioterapeuta"
            name="firmaFisioterapeutaGeneralIntensivo"
            setFormulario={setFirma}
            formulario={formulario}
          />
        </div>
      </div>

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
          onClick={handleGuardar}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded transition"
        >
          Guardar
        </button>
      </div>
    </div>
  );
}