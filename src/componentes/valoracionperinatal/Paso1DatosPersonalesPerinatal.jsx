import React, { useState } from "react";

export default function Paso1DatosPersonalesPerinatal({ formulario, handleChange, siguiente, paciente }) {
  const [otroMotivo, setOtroMotivo] = useState(
    formulario.motivoConsulta !== "INICIAR PROGRAMA PARA EDUCACION DEL NACIMIENTO" &&
    formulario.motivoConsulta !== "INICIAR PROGRAMA DE ACONDICIONAMIENTO FISICO"
      ? formulario.motivoConsulta || ""
      : ""
  );

  const handleMotivoChange = e => {
    const value = e.target.value;
    if (value === "OTRO") {
      handleChange({ motivoConsulta: otroMotivo });
    } else {
      handleChange({ motivoConsulta: value });
      setOtroMotivo("");
    }
  };

  const handleOtroChange = e => {
    setOtroMotivo(e.target.value);
    handleChange({ motivoConsulta: e.target.value });
  };

  return (
    <div>
      {/* Fecha y hora arriba */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 mb-6">
        <div>
          <label className="block font-semibold mb-1" htmlFor="fecha">
            Fecha <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            id="fecha"
            name="fecha"
            value={formulario.fecha || ""}
            onChange={e => handleChange({ fecha: e.target.value })}
            className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            required
          />
        </div>
        <div>
          <label className="block font-semibold mb-1" htmlFor="hora">
            Hora <span className="text-red-500">*</span>
          </label>
          <input
            type="time"
            id="hora"
            name="hora"
            value={formulario.hora || ""}
            onChange={e => handleChange({ hora: e.target.value })}
            className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            required
          />
        </div>
      </div>

      {/* Datos del paciente adulto en solo lectura, divididos en secciones */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Sección: Datos Generales */}
        <div className="bg-indigo-50 rounded-lg p-4 shadow-sm">
          <h3 className="font-semibold text-indigo-600 mb-2">Datos Generales</h3>
          <div className="mb-1"><span className="font-bold">Nombres:</span> {paciente?.nombres}</div>
          <div className="mb-1"><span className="font-bold">Cédula:</span> {paciente?.cedula}</div>
          <div className="mb-1"><span className="font-bold">Género:</span> {paciente?.genero}</div>
          <div className="mb-1"><span className="font-bold">Lugar de Nacimiento:</span> {paciente?.lugarNacimiento}</div>
          <div className="mb-1"><span className="font-bold">Fecha de Nacimiento:</span> {paciente?.fechaNacimiento}</div>
          <div className="mb-1"><span className="font-bold">Edad:</span> {paciente?.edad}</div>
          <div className="mb-1"><span className="font-bold">Estado Civil:</span> {paciente?.estadoCivil}</div>
        </div>
        {/* Sección: Contacto y Salud */}
        <div className="bg-indigo-50 rounded-lg p-4 shadow-sm">
          <h3 className="font-semibold text-indigo-600 mb-2">Contacto y Salud</h3>
          <div className="mb-1"><span className="font-bold">Dirección:</span> {paciente?.direccion}</div>
          <div className="mb-1"><span className="font-bold">Teléfono:</span> {paciente?.telefono}</div>
          <div className="mb-1"><span className="font-bold">Celular:</span> {paciente?.celular}</div>
          <div className="mb-1"><span className="font-bold">Ocupación:</span> {paciente?.ocupacion}</div>
          <div className="mb-1"><span className="font-bold">Nivel Educativo:</span> {paciente?.nivelEducativo}</div>
          <div className="mb-1"><span className="font-bold">Médico Tratante:</span> {paciente?.medicoTratante}</div>
          <div className="mb-1"><span className="font-bold">Aseguradora:</span> {paciente?.aseguradora}</div>
        </div>
        {/* Sección: Datos Familiares y Gestación */}
        <div className="bg-indigo-50 rounded-lg p-4 shadow-sm md:col-span-2">
          <h3 className="font-semibold text-indigo-600 mb-2">Datos Familiares y Gestación</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="mb-1"><span className="font-bold">Acompañante:</span> {paciente?.acompanante}</div>
              <div className="mb-1"><span className="font-bold">Teléfono Acompañante:</span> {paciente?.telefonoAcompanante}</div>
              <div className="mb-1"><span className="font-bold">Nombre del bebé:</span> {paciente?.nombreBebe}</div>
            </div>
            <div>
              <div className="mb-1"><span className="font-bold">Semanas de gestación:</span> {paciente?.semanasGestacion}</div>
              <div className="mb-1"><span className="font-bold">FUM:</span> {paciente?.fum}</div>
              <div className="mb-1"><span className="font-bold">Fecha probable de parto:</span> {paciente?.fechaProbableParto}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Motivo de consulta abajo */}
      <div className="mb-6">
        <label className="block font-semibold mb-1" htmlFor="motivoConsulta">
          Motivo de consulta <span className="text-red-500">*</span>
        </label>
        <select
          id="motivoConsulta"
          name="motivoConsulta"
          className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 mb-2"
          value={
            formulario.motivoConsulta === "INICIAR PROGRAMA PARA EDUCACION DEL NACIMIENTO" ||
            formulario.motivoConsulta === "INICIAR PROGRAMA DE ACONDICIONAMIENTO FISICO"
              ? formulario.motivoConsulta
              : "OTRO"
          }
          onChange={handleMotivoChange}
          required
        >
          <option value="">Seleccione una opción</option>
          <option value="INICIAR PROGRAMA PARA EDUCACION DEL NACIMIENTO">
            Iniciar programa para educación del nacimiento
          </option>
          <option value="INICIAR PROGRAMA DE ACONDICIONAMIENTO FISICO">
            Iniciar programa de acondicionamiento físico
          </option>
          <option value="OTRO">Otro</option>
        </select>
        {(
          formulario.motivoConsulta !== "INICIAR PROGRAMA PARA EDUCACION DEL NACIMIENTO" &&
          formulario.motivoConsulta !== "INICIAR PROGRAMA DE ACONDICIONAMIENTO FISICO"
        ) && (
          <input
            type="text"
            className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            placeholder="Especifique otro motivo"
            value={otroMotivo}
            onChange={handleOtroChange}
            required
          />
        )}
      </div>
      <div className="flex justify-end">
        <button
          type="button"
          onClick={siguiente}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded transition"
        >
          Siguiente
        </button>
      </div>
    </div>
  );
}