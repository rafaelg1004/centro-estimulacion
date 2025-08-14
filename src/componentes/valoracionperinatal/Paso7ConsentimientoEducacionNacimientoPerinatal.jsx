import React from "react";
import FirmaCanvas from "../valoraciondeingreso/FirmaCanvas";

export default function Paso7ConsentimientoEducacionNacimientoPerinatal({ formulario, handleChange, setFirma, anterior, onSubmit, siguiente, tipoPrograma, paciente }) {
  // Depuración
  console.log("Renderizando Paso 7", { paciente, formulario, tipoPrograma });
  // Mostrar Guardar solo si es educacion (no ambos)
  const mostrarGuardar = tipoPrograma === "educacion";
  // Mostrar Siguiente solo si es ambos
  const mostrarSiguiente = tipoPrograma === "ambos";
  // Si es ambos, este es el último paso de consentimiento
  return (
    <div>
      <div style={{background: '#fffae6', color: '#b45309', padding: 8, marginBottom: 8, borderRadius: 4}}>PRUEBA: Este es el Paso 7 (Consentimiento Educación)</div>
      <h3 className="text-lg font-bold text-indigo-700 mb-4 text-center">CONSENTIMIENTO INFORMADO PROGRAMA DE EDUCACION PARA EL NACIMIENTO</h3>
      <div className="mb-6 bg-indigo-50 rounded p-4 text-gray-700 text-justify">
        Usted va a iniciar nuestro Programa de Educacion para el Nacimiento consta de 7 sesiones Teórico -prácticas para los padres, 1 sesión para los abuelos, descritas a continuación.
        <br /><br />
        De igual manera incluye una visita postparto inmediato en clínica (según disponibilidad) y otra visita durante los siguientes 15 días de postparto, la pareja decide en qué momento programarla y se lleva a cabo según disponibilidad.
        <br /><br />
        <strong>Nota:</strong> Luego de estas visitas podrán tener acceso a nuevas asesorías con un valor especial de $60.000 cada una. Estas asesorías pueden ser acerca de banco de leche, extracción y conservación, obstrucciones, mastitis, brotes de crecimiento entre otras.
        <br /><br />
        Estas sesiones teórico-practicas, se llevan a cabo los días miércoles 6 pm, con disponibilidad de dos horas. Se estará enviando mensaje de confirmación, asi que agradecemos su oportuna respuesta.
      </div>
      <div className="mb-4 text-gray-700">
        Yo <span className="font-semibold underline">{paciente?.nombres || "____________________"}</span> identificada con Cédula de Ciudadanía <span className="font-semibold underline">{paciente?.cedula || "_____________"}</span> he entendido con claridad la explicación que me ha dado la Fisioterapeuta Dayan Ivonne Villegas Gamboa en las líneas anteriores. Por lo cual comprendo los beneficios y riesgos. Así mismo, me considero conforme y satisfecha con la información que se me ha suministrado comprendiendo de manera global todo lo que conlleva hacer parte de este programa.
      </div>
      {process.env.NODE_ENV === 'development' && (
        <div className="mb-4 p-2 bg-yellow-100 text-xs">
          Debug Paso 7 - firmaPacienteGeneral: {formulario.firmaPacienteGeneral ? 'TIENE FIRMA' : 'VACIO'}
        </div>
      )}
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
            label="Firma del Fisioterapeuta (General)"
            name="firmaFisioterapeutaGeneral"
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