import React from "react";

// Función helper para obtener datos del paciente (maneja nuevas valoraciones y valoraciones existentes)
const obtenerDatoPaciente = (formulario, campo) => {
  // Para nuevas valoraciones, los datos están directamente en formulario
  if (formulario[campo] !== undefined && formulario[campo] !== null) {
    return formulario[campo];
  }
  
  // Para valoraciones existentes, intentar con el modelo nuevo (formulario.paciente)
  if (formulario.paciente && formulario.paciente[campo] !== undefined && formulario.paciente[campo] !== null) {
    return formulario.paciente[campo];
  }
  
  // Casos especiales para compatibilidad con modelos antiguos
  if (campo === 'nacimiento' && formulario.fechaNacimiento) {
    return formulario.fechaNacimiento;
  }
  
  if (campo === 'fechaNacimiento' && formulario.nacimiento) {
    return formulario.nacimiento;
  }
  
  // Si no existe en ninguno, devolver cadena vacía
  return '';
};

const Paso1DatosPaciente = ({ 
  formulario, 
  handleChange, 
  touched, 
  siguiente, 
  InputField,
  pacienteCargado = false // Nueva prop para saber si el paciente fue cargado desde la base de datos
}) => {
  return (
    <div className="bg-white rounded-xl p-6 shadow-lg border border-indigo-100">
      <h3 className="text-xl font-bold text-indigo-700 mb-6 text-center">
        Paso 1: Datos del Paciente
      </h3>

      {pacienteCargado && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-blue-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <p className="text-blue-800 text-sm">
              <strong>Información del paciente cargada:</strong> Los datos del paciente están bloqueados para edición ya que fueron cargados desde el registro existente. Solo puedes modificar el motivo de consulta.
            </p>
          </div>
        </div>
      )}

      {/* INFORMACIÓN DE LA VALORACIÓN */}
      <section className="mb-8">
        <h4 className="text-lg font-semibold text-purple-600 border-b border-purple-200 pb-2 mb-4">
          Información de la Valoración
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField
            label="Fecha de la Valoración"
            name="fecha"
            type="date"
            value={obtenerDatoPaciente(formulario, 'fecha')}
            onChange={handleChange}
            touched={touched.fecha}
            required
          />
          <InputField
            label="Hora de la Valoración"
            name="hora"
            type="time"
            value={obtenerDatoPaciente(formulario, 'hora')}
            onChange={handleChange}
            touched={touched.hora}
            required
          />
        </div>
      </section>

      {/* DATOS GENERALES */}
      <section className="mb-8">
        <h4 className="text-lg font-semibold text-indigo-600 border-b border-indigo-200 pb-2 mb-4">
          Datos Generales
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField
            label="Nombres"
            name="nombres"
            value={obtenerDatoPaciente(formulario, 'nombres')}
            onChange={handleChange}
            touched={touched.nombres}
            readOnly={pacienteCargado}
            className={pacienteCargado ? "bg-gray-100 cursor-not-allowed" : ""}
          />
          <InputField
            label="Registro Civil"
            name="registroCivil"
            value={obtenerDatoPaciente(formulario, 'registroCivil')}
            onChange={handleChange}
            touched={touched.registroCivil}
            readOnly={pacienteCargado}
            className={pacienteCargado ? "bg-gray-100 cursor-not-allowed" : ""}
          />
          <InputField
            label="Género"
            name="genero"
            value={obtenerDatoPaciente(formulario, 'genero')}
            onChange={handleChange}
            touched={touched.genero}
            readOnly={pacienteCargado}
            className={pacienteCargado ? "bg-gray-100 cursor-not-allowed" : ""}
          />
          <InputField
            label="Lugar de Nacimiento"
            name="lugarNacimiento"
            value={obtenerDatoPaciente(formulario, 'lugarNacimiento')}
            onChange={handleChange}
            touched={touched.lugarNacimiento}
            readOnly={pacienteCargado}
            className={pacienteCargado ? "bg-gray-100 cursor-not-allowed" : ""}
          />
          <InputField
            label="Fecha de Nacimiento"
            name="nacimiento"
            type="date"
            value={obtenerDatoPaciente(formulario, 'nacimiento')}
            onChange={handleChange}
            touched={touched.nacimiento}
            readOnly={pacienteCargado}
            className={pacienteCargado ? "bg-gray-100 cursor-not-allowed" : ""}
          />
          <InputField
            label="Edad"
            name="edad"
            value={obtenerDatoPaciente(formulario, 'edad')}
            onChange={handleChange}
            touched={touched.edad}
            readOnly={pacienteCargado}
            className={pacienteCargado ? "bg-gray-100 cursor-not-allowed" : ""}
          />
          <InputField
            label="Peso (kg)"
            name="peso"
            type="number"
            value={obtenerDatoPaciente(formulario, 'peso')}
            onChange={handleChange}
            touched={touched.peso}
            readOnly={pacienteCargado}
            className={pacienteCargado ? "bg-gray-100 cursor-not-allowed" : ""}
          />
          <InputField
            label="Talla (cm)"
            name="talla"
            type="number"
            value={obtenerDatoPaciente(formulario, 'talla')}
            onChange={handleChange}
            touched={touched.talla}
            readOnly={pacienteCargado}
            className={pacienteCargado ? "bg-gray-100 cursor-not-allowed" : ""}
          />
        </div>
      </section>

      {/* CONTACTO Y SALUD */}
      <section className="mb-8">
        <h4 className="text-lg font-semibold text-green-600 border-b border-green-200 pb-2 mb-4">
          Contacto y Salud
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <InputField
              label="Dirección"
              name="direccion"
              value={obtenerDatoPaciente(formulario, 'direccion')}
              onChange={handleChange}
              touched={touched.direccion}
              readOnly={pacienteCargado}
              className={pacienteCargado ? "bg-gray-100 cursor-not-allowed" : ""}
            />
          </div>
          <InputField
            label="Teléfono"
            name="telefono"
            value={obtenerDatoPaciente(formulario, 'telefono')}
            onChange={handleChange}
            touched={touched.telefono}
            readOnly={pacienteCargado}
            className={pacienteCargado ? "bg-gray-100 cursor-not-allowed" : ""}
          />
          <InputField
            label="Celular"
            name="celular"
            value={obtenerDatoPaciente(formulario, 'celular')}
            onChange={handleChange}
            touched={touched.celular}
            readOnly={pacienteCargado}
            className={pacienteCargado ? "bg-gray-100 cursor-not-allowed" : ""}
          />
          <InputField
            label="Pediatra"
            name="pediatra"
            value={obtenerDatoPaciente(formulario, 'pediatra')}
            onChange={handleChange}
            touched={touched.pediatra}
            readOnly={pacienteCargado}
            className={pacienteCargado ? "bg-gray-100 cursor-not-allowed" : ""}
          />
          <InputField
            label="Aseguradora"
            name="aseguradora"
            value={obtenerDatoPaciente(formulario, 'aseguradora')}
            onChange={handleChange}
            touched={touched.aseguradora}
            readOnly={pacienteCargado}
            className={pacienteCargado ? "bg-gray-100 cursor-not-allowed" : ""}
          />
        </div>
      </section>

      {/* DATOS FAMILIARES */}
      <section className="mb-8">
        <h4 className="text-lg font-semibold text-pink-600 border-b border-pink-200 pb-2 mb-4">
          Datos Familiares
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField
            label="Nombre de la Madre"
            name="nombreMadre"
            value={obtenerDatoPaciente(formulario, 'nombreMadre')}
            onChange={handleChange}
            touched={touched.nombreMadre}
            readOnly={pacienteCargado}
            className={pacienteCargado ? "bg-gray-100 cursor-not-allowed" : ""}
          />
          <InputField
            label="Edad de la Madre"
            name="edadMadre"
            type="number"
            value={obtenerDatoPaciente(formulario, 'edadMadre')}
            onChange={handleChange}
            touched={touched.edadMadre}
            readOnly={pacienteCargado}
            className={pacienteCargado ? "bg-gray-100 cursor-not-allowed" : ""}
          />
          <InputField
            label="Ocupación de la Madre"
            name="ocupacionMadre"
            value={obtenerDatoPaciente(formulario, 'ocupacionMadre')}
            onChange={handleChange}
            touched={touched.ocupacionMadre}
            readOnly={pacienteCargado}
            className={pacienteCargado ? "bg-gray-100 cursor-not-allowed" : ""}
          />
          <InputField
            label="Nombre del Padre"
            name="nombrePadre"
            value={obtenerDatoPaciente(formulario, 'nombrePadre')}
            onChange={handleChange}
            touched={touched.nombrePadre}
            readOnly={pacienteCargado}
            className={pacienteCargado ? "bg-gray-100 cursor-not-allowed" : ""}
          />
          <InputField
            label="Edad del Padre"
            name="edadPadre"
            type="number"
            value={obtenerDatoPaciente(formulario, 'edadPadre')}
            onChange={handleChange}
            touched={touched.edadPadre}
            readOnly={pacienteCargado}
            className={pacienteCargado ? "bg-gray-100 cursor-not-allowed" : ""}
          />
          <InputField
            label="Ocupación del Padre"
            name="ocupacionPadre"
            value={obtenerDatoPaciente(formulario, 'ocupacionPadre')}
            onChange={handleChange}
            touched={touched.ocupacionPadre}
            readOnly={pacienteCargado}
            className={pacienteCargado ? "bg-gray-100 cursor-not-allowed" : ""}
          />
        </div>
      </section>

      {/* MOTIVO DE CONSULTA */}
      <section className="mb-8">
        <h4 className="text-lg font-semibold text-indigo-600 border-b border-indigo-200 pb-2 mb-4">
          Motivo de Consulta
        </h4>
        <div>
          <label htmlFor="motivoDeConsulta" className="block font-semibold mb-1">
            Motivo de Consulta
          </label>
          <select
            id="motivoDeConsulta"
            name="motivoDeConsulta"
            value={obtenerDatoPaciente(formulario, 'motivoDeConsulta')}
            onChange={handleChange}
            className="w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-base bg-indigo-50 shadow-sm border-indigo-200"
          >
            <option value="">Seleccione el motivo de consulta</option>
            <option value="estimulacion">Iniciar programa de estimulación adecuada</option>
            <option value="fisioterapia">Iniciar sesiones de fisioterapia pediátrica</option>
          </select>
        </div>
      </section>

      {/* BOTÓN SIGUIENTE */}
      <div className="flex justify-end">
        <button
          type="button"
          onClick={siguiente}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-3 rounded-xl shadow transition flex items-center gap-2"
        >
          Siguiente Paso
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Paso1DatosPaciente;