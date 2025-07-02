import React from "react";

export default function Paso1DatosGenerales({ formulario, setFormulario, siguientePaso }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormulario((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-100 via-purple-100 to-green-100">
      <div className="bg-white bg-opacity-90 p-10 rounded-3xl shadow-2xl flex flex-col gap-8 w-full max-w-2xl border border-indigo-100">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4 gap-4">
          <div>
            <label className="font-semibold mr-2">Fecha valoración:</label>
            <input
              type="date"
              name="fecha"
              value={formulario.fecha}
              onChange={handleChange}
              required
              className="input input-bordered"
            />
          </div>
          <div>
            <label className="font-semibold mr-2">Hora valoración:</label>
            <input
              type="time"
              name="hora"
              value={formulario.hora}
              onChange={handleChange}
              required
              className="input input-bordered"
            />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-indigo-700 mb-4 text-center">
          Paso 1: Datos Generales
        </h2>
        <form
          onSubmit={e => {
            e.preventDefault();
            siguientePaso();
          }}
          className="space-y-6"
        >
          {/* Agrupación: Datos personales */}
          <div>
            <h3 className="font-semibold text-indigo-600 mb-2">Datos personales</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input name="nombres" value={formulario.nombres} onChange={handleChange} placeholder="Nombres y Apellidos" required className="input input-bordered" />
              <input name="cedula" value={formulario.cedula} onChange={handleChange} placeholder="Cédula" required className="input input-bordered" />
              <select name="genero" value={formulario.genero} onChange={handleChange} required className="input input-bordered">
                <option value="">Género</option>
                <option value="Femenino">Femenino</option>
                <option value="Masculino">Masculino</option>
                <option value="Otro">Otro</option>
              </select>
              <input name="lugarNacimiento" value={formulario.lugarNacimiento} onChange={handleChange} placeholder="Lugar de Nacimiento" className="input input-bordered" />
              <input type="date" name="fechaNacimiento" value={formulario.fechaNacimiento} onChange={handleChange} placeholder="Fecha de Nacimiento" required className="input input-bordered" />
              <input name="edad" value={formulario.edad} onChange={handleChange} placeholder="Edad" required className="input input-bordered" />
              <input name="estadoCivil" value={formulario.estadoCivil} onChange={handleChange} placeholder="Estado Civil" className="input input-bordered" />
              <input name="direccion" value={formulario.direccion} onChange={handleChange} placeholder="Dirección" className="input input-bordered" />
              <input name="telefono" value={formulario.telefono} onChange={handleChange} placeholder="Teléfono" className="input input-bordered" />
              <input name="celular" value={formulario.celular} onChange={handleChange} placeholder="Celular" className="input input-bordered" />
              <input name="ocupacion" value={formulario.ocupacion} onChange={handleChange} placeholder="Ocupación" className="input input-bordered" />
              <input name="nivelEducativo" value={formulario.nivelEducativo} onChange={handleChange} placeholder="Nivel Educativo" className="input input-bordered" />
            </div>
          </div>
          {/* Agrupación: Información médica */}
          <div>
            <h3 className="font-semibold text-indigo-600 mb-2">Información médica</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input name="medicoTratante" value={formulario.medicoTratante} onChange={handleChange} placeholder="Médico Tratante" className="input input-bordered" />
              <input name="aseguradora" value={formulario.aseguradora} onChange={handleChange} placeholder="Aseguradora" className="input input-bordered" />
            </div>
          </div>
          {/* Agrupación: Información de acompañante */}
          <div>
            <h3 className="font-semibold text-indigo-600 mb-2">Acompañante</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input name="acompanante" value={formulario.acompanante} onChange={handleChange} placeholder="Acompañante" className="input input-bordered" />
              <input name="telefonoAcompanante" value={formulario.telefonoAcompanante} onChange={handleChange} placeholder="Teléfono del Acompañante" className="input input-bordered" />
            </div>
          </div>
          {/* Agrupación: Embarazo */}
          <div>
            <h3 className="font-semibold text-indigo-600 mb-2">Datos de embarazo (si aplica)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input name="nombreBebe" value={formulario.nombreBebe} onChange={handleChange} placeholder="Nombre del Bebé" className="input input-bordered" />
              <input name="semanasGestacion" value={formulario.semanasGestacion} onChange={handleChange} placeholder="Semanas de Gestación" className="input input-bordered" />
              <input type="date" name="fum" value={formulario.fum} onChange={handleChange} placeholder="FUM" className="input input-bordered" />
              <input type="date" name="fechaProbableParto" value={formulario.fechaProbableParto} onChange={handleChange} placeholder="Fecha Probable de Parto" className="input input-bordered" />
            </div>
          </div>
          {/* Motivo de consulta */}
          <div>
            <label className="font-semibold">Motivo de consulta</label>
            <textarea
              name="motivoConsulta"
              value={formulario.motivoConsulta}
              onChange={handleChange}
              placeholder="Motivo de consulta"
              required
              className="input input-bordered w-full min-h-[60px]"
            />
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded transition"
            >
              Siguiente
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}