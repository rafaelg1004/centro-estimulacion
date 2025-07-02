import React from "react";
import FirmaCanvas from "../valoraciondeingreso/FirmaCanvas";

const sesiones = [
  "Sesión No. 1: Introducción y Autocuidado",
  "Sesión No. 2: Parto Vaginal",
  "Sesión No. 3: Cesárea y Postparto",
  "Sesión No. 4: Lactancia",
  "Sesión No. 5: Cuidados del Recién Nacido",
  "Sesión No. 6: Técnicas de Confort",
  "Sesión No. 7: Estimulación Prenatal",
  "Sesión No. 8: Abuelos",
  "Visita en Clínica",
  "Visita de Cierre",
];

export default function Paso7ConsentimientoEducacionNacimientoPerinatal({
  formulario,
  handleChange,
  setFirma,
  anterior,
  onSubmit,
  paciente,
}) {
  return (
    <div>
      <h3 className="text-lg font-bold text-indigo-700 mb-4">
        7. Consentimiento Informado Programa de Educación para el Nacimiento
      </h3>
      <div className="mb-6 bg-indigo-50 rounded p-4 text-gray-700 text-justify">
        Usted va a iniciar nuestro Programa de Educación para el Nacimiento que
        consta de 7 sesiones teórico-prácticas para los padres y 1 sesión para
        los abuelos, descritas a continuación. De igual manera incluye una visita
        postparto inmediato en clínica (según disponibilidad) y otra visita
        durante los siguientes 15 días de postparto, la pareja decide en qué
        momento programarla y se lleva a cabo según disponibilidad.
        <br />
        <br />
        <strong>Nota:</strong> Luego de estas visitas podrán tener acceso a nuevas
        asesorías con un valor especial de $60.000 cada una. Estas asesorías
        pueden ser acerca de banco de leche, extracción y conservación,
        obstrucciones, mastitis, brotes de crecimiento entre otras.
        <br />
        <br />
        {/* Aquí va la tabla/lista de sesiones con fecha y firma */}
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
              {sesiones.map((sesion, idx) => (
                <tr key={idx}>
                  <td className="px-2 py-1 border">{sesion}</td>
                  <td className="px-2 py-1 border">
                    <input
                      type="date"
                      name={`fechaSesion${idx + 1}`}
                      value={formulario[`fechaSesion${idx + 1}`] || ""}
                      onChange={e => handleChange({ [`fechaSesion${idx + 1}`]: e.target.value })}
                      className="border rounded p-1"
                    />
                  </td>
                  <td className="px-2 py-1 border">
                    <FirmaCanvas
                      label=""
                      name={`firmaPacienteSesion${idx + 1}`}
                      setFormulario={setFirma}
                      formulario={formulario}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        Estas sesiones teórico-prácticas se llevan a cabo los días miércoles 6
        pm, con disponibilidad de dos horas. Se estará enviando mensaje de
        confirmación, así que agradecemos su oportuna respuesta.
        <br />
        <br />
        Yo{" "}
        <span className="font-semibold underline">
          {paciente?.nombres || "____________________"}
        </span>{" "}
        identificada con Cédula de Ciudadanía{" "}
        <span className="font-semibold underline">
          {paciente?.cedula || "_____________"}
        </span>{" "}
        he entendido con claridad la explicación que me ha dado la Fisioterapeuta
        Dayan Ivonne Villegas Gamboa en las líneas anteriores. Por lo cual
        comprendo los beneficios y riesgos. Así mismo, me considero conforme y
        satisfecha con la información que se me ha suministrado comprendiendo de
        manera global todo lo que conlleva hacer parte de este programa. Por lo
        que a través de la presente, doy mi consentimiento expreso para que el
        tratamiento sea llevado a cabo.
      </div>

      {/* Firmas generales al final */}
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
            label="Firma del Fisioterapeuta"
            name="firmaFisioterapeutaGeneral"
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
          type="submit"
          onClick={e => {
            e.preventDefault();
            if (!formulario.firmaPacienteGeneral) {
              alert("Por favor, firma antes de continuar.");
              return;
            }
            onSubmit();
          }}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded transition"
        >
          Siguiente
        </button>
      </div>
    </div>
  );
}