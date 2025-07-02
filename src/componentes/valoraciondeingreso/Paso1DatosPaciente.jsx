import React from "react";

const Paso1DatosPaciente = ({
  formulario,
  handleChange,
  touched,
  camposObligatorios,
  pasoCompleto,
  siguiente,
  InputField,
}) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <InputField
      label="Fecha"
      name="fecha"
      type="date"
      value={formulario.fecha}
      onChange={handleChange}
      touched={touched.fecha}
      required={camposObligatorios.includes("fecha")}
    />
    <InputField
      label="Hora"
      name="hora"
      type="time"
      value={formulario.hora}
      onChange={handleChange}
      touched={touched.hora}
      required={camposObligatorios.includes("hora")}
    />
    <InputField
      label="Nombres y Apellidos"
      name="nombres"
      value={formulario.nombres}
      onChange={handleChange}
      touched={touched.nombres}
      required={camposObligatorios.includes("nombres")}
      disabled
    />
    <InputField
      label="Registro Civil"
      name="registroCivil"
      value={formulario.registroCivil}
      onChange={handleChange}
      touched={touched.registroCivil}
      required={camposObligatorios.includes("registroCivil")}
      disabled
    />
    <InputField
      label="Género"
      name="genero"
      value={formulario.genero}
      onChange={handleChange}
      touched={touched.genero}
      required={camposObligatorios.includes("genero")}
      disabled
    />
    <InputField
      label="Lugar y Fecha de Nacimiento"
      name="nacimiento"
      value={formulario.nacimiento}
      onChange={handleChange}
      touched={touched.nacimiento}
      required={camposObligatorios.includes("nacimiento")}
      disabled
    />
    <InputField
      label="Edad"
      name="edad"
      value={formulario.edad}
      onChange={handleChange}
      touched={touched.edad}
      required={camposObligatorios.includes("edad")}
      disabled
    />
    <InputField
      label="Peso"
      name="peso"
      value={formulario.peso}
      onChange={handleChange}
      touched={touched.peso}
      required={camposObligatorios.includes("peso")}
      disabled
    />
    <InputField
      label="Talla"
      name="talla"
      value={formulario.talla}
      onChange={handleChange}
      touched={touched.talla}
      required={camposObligatorios.includes("talla")}
      disabled
    />
    <InputField
      label="Dirección"
      name="direccion"
      value={formulario.direccion}
      onChange={handleChange}
      touched={touched.direccion}
      required={camposObligatorios.includes("direccion")}
      disabled
    />
    <InputField
      label="Teléfono"
      name="telefono"
      value={formulario.telefono}
      onChange={handleChange}
      touched={touched.telefono}
      required={camposObligatorios.includes("telefono")}
      disabled
    />
    <InputField
      label="Celular"
      name="celular"
      value={formulario.celular}
      onChange={handleChange}
      touched={touched.celular}
      required={camposObligatorios.includes("celular")}
      disabled
    />
    <InputField
      label="Pediatra tratante"
      name="pediatra"
      value={formulario.pediatra}
      onChange={handleChange}
      touched={touched.pediatra}
      required={camposObligatorios.includes("pediatra")}
      disabled
    />
    <InputField
      label="Aseguradora"
      name="aseguradora"
      value={formulario.aseguradora}
      onChange={handleChange}
      touched={touched.aseguradora}
      required={camposObligatorios.includes("aseguradora")}
      disabled
    />

    <div className="md:col-span-2 border-t pt-4 mt-4">
      <h4 className="text-lg font-semibold text-gray-700 mb-2">
        Datos Familiares
      </h4>
    </div>

    <InputField
      label="Nombre de la madre"
      name="madreNombre"
      value={formulario.madreNombre}
      onChange={handleChange}
      touched={touched.madreNombre}
      required={camposObligatorios.includes("madreNombre")}
      disabled
    />
    <InputField
      label="Edad de la madre"
      name="madreEdad"
      value={formulario.madreEdad}
      onChange={handleChange}
      touched={touched.madreEdad}
      required={camposObligatorios.includes("madreEdad")}
      disabled
    />
    <InputField
      label="Ocupación de la madre"
      name="madreOcupacion"
      value={formulario.madreOcupacion}
      onChange={handleChange}
      touched={touched.madreOcupacion}
      required={camposObligatorios.includes("madreOcupacion")}
      disabled
    />
    <InputField
      label="Nombre del padre"
      name="padreNombre"
      value={formulario.padreNombre}
      onChange={handleChange}
      touched={touched.padreNombre}
      required={camposObligatorios.includes("padreNombre")}
      disabled
    />
    <InputField
      label="Edad del padre"
      name="padreEdad"
      value={formulario.padreEdad}
      onChange={handleChange}
      touched={touched.padreEdad}
      required={camposObligatorios.includes("padreEdad")}
      disabled
    />
    <InputField
      label="Ocupación del padre"
      name="padreOcupacion"
      value={formulario.padreOcupacion}
      onChange={handleChange}
      touched={touched.padreOcupacion}
      required={camposObligatorios.includes("padreOcupacion")}
      disabled
    />

    {/* Motivo de consulta */}
    <div className="md:col-span-2">
      <label htmlFor="motivoDeConsulta" className="block font-semibold mb-1">
        Motivo de consulta
      </label>
      <select
        id="motivoDeConsulta"
        name="motivoDeConsulta"
        value={formulario.motivoDeConsulta}
        onChange={handleChange}
        className="w-full border rounded-md p-2 mb-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        required={camposObligatorios.includes("motivoDeConsulta")}
      >
        <option value="">Seleccione una opción...</option>
        <option value="Iniciar programa de estimulación adecuada">
          Iniciar programa de estimulación adecuada
        </option>
        <option value="Iniciar sesiones de fisioterapia pediátrica">
          Iniciar sesiones de fisioterapia pediátrica
        </option>
        <option value="Otro">Otro (escriba abajo)</option>
      </select>
      {formulario.motivoDeConsulta === "Otro" && (
        <textarea
          id="motivoDeConsultaOtro"
          name="motivoDeConsulta"
          value={formulario.motivoDeConsultaOtro || ""}
          onChange={handleChange}
          rows={2}
          className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          placeholder="Describa el motivo de la consulta..."
        />
      )}
      {touched.motivoDeConsulta && camposObligatorios.includes("motivoDeConsulta") && (!formulario.motivoDeConsulta || formulario.motivoDeConsulta.trim() === "") && (
        <span className="text-red-500 text-xs">Este campo es obligatorio</span>
      )}
    </div>
    <div className="md:col-span-2 flex justify-end mt-6">
      <button
        type="button"
        onClick={siguiente}
        className={`font-bold py-2 px-4 rounded 
          ${pasoCompleto ? "bg-indigo-600 hover:bg-indigo-700 text-white" : "bg-gray-400 text-white cursor-not-allowed"}`}
        disabled={!pasoCompleto}
      >
        Siguiente
      </button>
    </div>
  </div>
);

export default Paso1DatosPaciente;