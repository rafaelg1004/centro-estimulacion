import React from "react";
import FirmaCanvas from "../valoraciondeingreso/FirmaCanvas";

export default function Paso6ConsentimientoFisicoPerinatal({ formulario, handleChange, setFirma, anterior, onSubmit, siguiente, tipoPrograma, paciente }) {
  // Mostrar Guardar si es fisico o si es ambos en el paso 8 (físico)
  const mostrarGuardar = tipoPrograma === "fisico" || (tipoPrograma === "ambos" && !siguiente);
  const mostrarSiguiente = tipoPrograma === "ambos" && siguiente;
  
  return (
    <div>
      <h3 className="text-lg font-bold text-indigo-700 mb-4 text-center">CONSENTIMIENTO INFORMADO ACONDICIONAMIENTO FISICO</h3>
      <div className="mb-6 bg-indigo-50 rounded p-4 text-gray-700 text-justify">
        Usted va a iniciar un programa de acondicionamiento físico perinatal que consta de 8 sesiones en donde realizaremos; Rumba, balonterapia, yoga, ejercicio con banda elástica, pesas, silla y palo. Estas actividades se llevan a cabo los días martes y jueves a las 7 am, este horario no es modificable. En caso de no poder asistir, por favor avisar el día anterior, de lo contrario la sesión se tomará como realizada. Solo se reponen sesiones en el caso de una incapacidad justificada. Le recomendamos constancia, con el fin de lograr los objetivos esperados como; mejorar su condición física, contribuir en una adecuada postura, mejorar la capacidad respiratoria y la circulación, tratar y/o prevenir dolores musculares, facilitar el parto vaginal y la recuperación durante el postparto, asi como favorecer en su estado emocional. Como toda intervención, tratamiento o procedimiento, existen algunos riesgos como; Dolor o molestia sobre todo al iniciar el programa y mareo, aunque no es muy común. Este programa es semipersonalizado por lo que estaremos muy atentos. Recuerde que su propio cuerpo es el mejor guía, en el caso de que considere que NO debe llevar a cabo alguna actividad o ejercicio esta en la libertad de hacerlo.
      </div>
      <div className="mb-4 text-gray-700">
        Yo <span className="font-semibold underline">{paciente?.nombres || "____________________"}</span> identificada con Cédula de Ciudadanía <span className="font-semibold underline">{paciente?.cedula || "_____________"}</span> he entendido con claridad la explicación que me ha dado la Fisioterapeuta Dayan Ivonne Villegas Gamboa en las líneas anteriores. Por lo cual comprendo los beneficios y riesgos. Así mismo, me considero conforme y satisfecha con la información que se me ha suministrado comprendiendo de manera global todo lo que conlleva hacer parte de este programa. Por lo que a través de la presente, doy mi consentimiento expreso para que el tratamiento sea llevado a cabo. Por favor hágale saber a su médico tratante que está haciendo parte de este programa de acondicionamiento físico.
      </div>
      <div className="mb-8 grid grid-cols-1 sm:grid-cols-2 gap-8">
        <div>
          <FirmaCanvas
            label="Firma de Paciente (Físico)"
            name="firmaPacienteFisico"
            setFormulario={setFirma}
            formulario={formulario}
          />
        </div>
        <div>
          <FirmaCanvas
            label="Firma de Fisioterapeuta (Físico)"
            name="firmaFisioterapeutaFisico"
            setFormulario={setFirma}
            formulario={formulario}
          />
        </div>
      </div>
      <div className="flex justify-between mt-8">
        <button
          type="button"
          onClick={() => {
            if (tipoPrograma === "ambos" && !siguiente) {
              // Si es ambos y no hay botón siguiente (paso 8), volver al paso 7
              anterior(7);
            } else {
              // Si es solo físico o ambos con siguiente (paso 7), volver al paso 6
              anterior(6);
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