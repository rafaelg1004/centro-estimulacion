import React from "react";

export default function Paso1DatosPersonales({
  formulario,
  handleChange,
  touched,
  pasoCompleto,
  siguiente,
  InputField,
}) {
  return (
    <div>
      {/* Fecha y hora arriba */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <InputField
          label="Fecha"
          name="fecha"
          type="date"
          value={formulario.fecha}
          onChange={handleChange}
          touched={touched.fecha}
          required={true}
        />
        <InputField
          label="Hora"
          name="hora"
          type="time"
          value={formulario.hora}
          onChange={handleChange}
          touched={touched.hora}
          required={true}
        />
      </div>
      {/* Datos personales */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <InputField
          label="Nombres y Apellidos"
          name="nombres"
          value={formulario.nombres}
          onChange={handleChange}
          touched={touched.nombres}
          required={true}
          disabled={true}
        />
        <InputField
          label="Cédula"
          name="cedula"
          value={formulario.cedula}
          onChange={handleChange}
          touched={touched.cedula}
          required={true}
          disabled={true}
        />
        <InputField
          label="Género"
          name="genero"
          value={formulario.genero}
          onChange={handleChange}
          touched={touched.genero}
          required={false}
          disabled={true}
        />
        <InputField
          label="Lugar de Nacimiento"
          name="lugarNacimiento"
          value={formulario.lugarNacimiento}
          onChange={handleChange}
          touched={touched.lugarNacimiento}
          required={false}
          disabled={true}
        />
        <InputField
          label="Fecha de Nacimiento"
          name="fechaNacimiento"
          type="date"
          value={formulario.fechaNacimiento}
          onChange={handleChange}
          touched={touched.fechaNacimiento}
          required={false}
          disabled={true}
        />
        <InputField
          label="Edad"
          name="edad"
          value={formulario.edad}
          onChange={handleChange}
          touched={touched.edad}
          required={false}
          disabled={true}
        />
        <InputField
          label="Estado Civil"
          name="estadoCivil"
          value={formulario.estadoCivil}
          onChange={handleChange}
          touched={touched.estadoCivil}
          required={false}
          disabled={true}
        />
        <InputField
          label="Dirección"
          name="direccion"
          value={formulario.direccion}
          onChange={handleChange}
          touched={touched.direccion}
          required={false}
          disabled={true}
        />
        <InputField
          label="Teléfono"
          name="telefono"
          value={formulario.telefono}
          onChange={handleChange}
          touched={touched.telefono}
          required={true}
          disabled={true}
        />
        <InputField
          label="Celular"
          name="celular"
          value={formulario.celular}
          onChange={handleChange}
          touched={touched.celular}
          required={false}
          disabled={true}
        />
        <InputField
          label="Correo electrónico"
          name="correo"
          value={formulario.correo}
          onChange={handleChange}
          touched={touched.correo}
          required={true}
          disabled={true}
        />
        <InputField
          label="Ocupación"
          name="ocupacion"
          value={formulario.ocupacion}
          onChange={handleChange}
          touched={touched.ocupacion}
          required={false}
          disabled={true}
        />
        <InputField
          label="Nivel Educativo"
          name="nivelEducativo"
          value={formulario.nivelEducativo}
          onChange={handleChange}
          touched={touched.nivelEducativo}
          required={false}
          disabled={true}
        />
        <InputField
          label="Médico Tratante"
          name="medicoTratante"
          value={formulario.medicoTratante}
          onChange={handleChange}
          touched={touched.medicoTratante}
          required={false}
          disabled={true}
        />
        <InputField
          label="Aseguradora"
          name="aseguradora"
          value={formulario.aseguradora}
          onChange={handleChange}
          touched={touched.aseguradora}
          required={false}
          disabled={true}
        />
        <InputField
          label="Acompañante"
          name="acompanante"
          value={formulario.acompanante}
          onChange={handleChange}
          touched={touched.acompanante}
          required={false}
          disabled={true}
        />
        <InputField
          label="Teléfono Acompañante"
          name="telefonoAcompanante"
          value={formulario.telefonoAcompanante}
          onChange={handleChange}
          touched={touched.telefonoAcompanante}
          required={false}
          disabled={true}
        />
        <InputField
          label="Nombre del bebé"
          name="nombreBebe"
          value={formulario.nombreBebe}
          onChange={handleChange}
          touched={touched.nombreBebe}
          required={false}
          disabled={true}
        />
        <InputField
          label="Semanas de gestación"
          name="semanasGestacion"
          value={formulario.semanasGestacion}
          onChange={handleChange}
          touched={touched.semanasGestacion}
          required={false}
          disabled={true}
        />
        <InputField
          label="FUM"
          name="fum"
          value={formulario.fum}
          onChange={handleChange}
          touched={touched.fum}
          required={false}
          disabled={true}
        />
        <InputField
          label="Fecha probable de parto"
          name="fechaProbableParto"
          value={formulario.fechaProbableParto}
          onChange={handleChange}
          touched={touched.fechaProbableParto}
          required={false}
          disabled={true}
        />
      </div>
      {/* Motivo de consulta como textarea */}
      <div className="mb-4">
        <label htmlFor="motivoConsulta" className="block font-semibold mb-1">
          Motivo de la consulta <span className="text-red-500">*</span>
        </label>
        <textarea
          id="motivoConsulta"
          name="motivoConsulta"
          value={formulario.motivoConsulta}
          onChange={handleChange}
          className={`w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-400
            ${
              touched.motivoConsulta &&
              (!formulario.motivoConsulta ||
                formulario.motivoConsulta.trim() === "")
                ? "border-red-500"
                : "border-gray-300"
            }`}
          rows={3}
          required
        />
        {touched.motivoConsulta &&
          (!formulario.motivoConsulta ||
            formulario.motivoConsulta.trim() === "") && (
            <span className="text-red-500 text-xs">
              Este campo es obligatorio
            </span>
          )}
      </div>
      <div className="flex justify-end">
        <button
          type="button"
          className={`px-6 py-2 rounded-md text-white font-semibold bg-indigo-600 hover:bg-indigo-700 transition
            ${!pasoCompleto ? "opacity-50 cursor-not-allowed" : ""}`}
          onClick={siguiente}
        >
          Siguiente
        </button>
      </div>
    </div>
  );
}