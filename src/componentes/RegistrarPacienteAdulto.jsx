import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../config/api";

function calcularEdad(fechaNacimiento) {
  if (!fechaNacimiento) return "";
  const hoy = new Date();
  const nacimiento = new Date(fechaNacimiento);
  let edad = hoy.getFullYear() - nacimiento.getFullYear();
  const m = hoy.getMonth() - nacimiento.getMonth();
  if (m < 0 || (m === 0 && hoy.getDate() < nacimiento.getDate())) {
    edad--;
  }
  return edad;
}

const FORMULARIO_INICIAL = {
  nombres: "",
  cedula: "",
  genero: "",
  lugarNacimiento: "",
  fechaNacimiento: "",
  edad: "",
  estadoCivil: "",
  direccion: "",
  telefono: "",
  celular: "",
  ocupacion: "",
  nivelEducativo: "",
  medicoTratante: "",
  aseguradora: "",
  acompanante: "",
  telefonoAcompanante: "",
  nombreBebe: "",
  semanasGestacion: "",
  fum: "",
  fechaProbableParto: "",
};

export default function RegistrarPacienteAdulto() {
  const [formulario, setFormulario] = useState(FORMULARIO_INICIAL);
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const [mostrarConfirmar, setMostrarConfirmar] = useState(false);
  const navigate = useNavigate();

  const handleChange = e => {
    const { name, value } = e.target;
    setFormulario(f => {
      if (name === "fechaNacimiento") {
        return {
          ...f,
          fechaNacimiento: value,
          edad: calcularEdad(value).toString(),
        };
      }
      return { ...f, [name]: value };
    });
  };

  const guardarPaciente = async () => {
    setMensaje("");
    setError("");
    for (const key in FORMULARIO_INICIAL) {
      if (!formulario[key]) {
        setError("Por favor, complete todos los campos.");
        return;
      }
    }
    try {
      await apiRequest(
        "/pacientes-adultos",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formulario),
        }
      );
      setMensaje("Paciente adulto registrado correctamente");
      setFormulario(FORMULARIO_INICIAL);
    } catch (err) {
      setError("Error al registrar paciente adulto");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-pink-100 to-green-100 py-10 px-2">
      <form
        onSubmit={e => {
          e.preventDefault();
          setMostrarConfirmar(true);
        }}
        className="w-full max-w-3xl bg-white bg-opacity-90 p-10 rounded-3xl shadow-2xl border border-indigo-100 space-y-8"
      >
        <h2 className="text-3xl font-extrabold text-indigo-700 mb-6 text-center drop-shadow tracking-wide">
          Registrar Paciente Adulto
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Cambia la clase de todos los inputs/selects para estilo pastel */}
          <div>
            <label className="block text-sm font-semibold mb-1" htmlFor="nombres">
              Nombres y Apellidos
            </label>
            <input
              id="nombres"
              name="nombres"
              value={formulario.nombres}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-xl border border-indigo-200 focus:ring-2 focus:ring-indigo-400 outline-none text-base bg-indigo-50 shadow-sm"
              placeholder="Nombres y Apellidos"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1" htmlFor="cedula">
              Cédula de Ciudadanía
            </label>
            <input
              id="cedula"
              name="cedula"
              value={formulario.cedula}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-xl border border-indigo-200 focus:ring-2 focus:ring-indigo-400 outline-none text-base bg-indigo-50 shadow-sm"
              placeholder="Cédula"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1" htmlFor="genero">
              Género
            </label>
            <select
              id="genero"
              name="genero"
              value={formulario.genero}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-xl border border-indigo-200 focus:ring-2 focus:ring-indigo-400 outline-none text-base bg-indigo-50 shadow-sm"
            >
              <option value="">Seleccione...</option>
              <option value="Femenino">Femenino</option>
              <option value="Masculino">Masculino</option>
              <option value="Otro">Otro</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1" htmlFor="lugarNacimiento">
              Lugar de Nacimiento
            </label>
            <input
              id="lugarNacimiento"
              name="lugarNacimiento"
              value={formulario.lugarNacimiento}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-xl border border-indigo-200 focus:ring-2 focus:ring-indigo-400 outline-none text-base bg-indigo-50 shadow-sm"
              placeholder="Lugar de Nacimiento"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1" htmlFor="fechaNacimiento">
              Fecha de Nacimiento
            </label>
            <input
              id="fechaNacimiento"
              name="fechaNacimiento"
              type="date"
              value={formulario.fechaNacimiento}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-xl border-2 border-indigo-400 focus:ring-2 focus:ring-indigo-600 outline-none text-base bg-indigo-50 shadow-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1" htmlFor="edad">
              Edad
            </label>
            <input
              id="edad"
              name="edad"
              type="text"
              value={formulario.edad}
              readOnly
              className="w-full px-4 py-3 rounded-xl border border-indigo-200 bg-gray-100 text-base shadow-sm"
              placeholder="Edad"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1" htmlFor="estadoCivil">
              Estado civil
            </label>
            <input
              id="estadoCivil"
              name="estadoCivil"
              value={formulario.estadoCivil}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-xl border border-indigo-200 focus:ring-2 focus:ring-indigo-400 outline-none text-base bg-indigo-50 shadow-sm"
              placeholder="Estado civil"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1" htmlFor="direccion">
              Dirección de Domicilio
            </label>
            <input
              id="direccion"
              name="direccion"
              value={formulario.direccion}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-xl border border-indigo-200 focus:ring-2 focus:ring-indigo-400 outline-none text-base bg-indigo-50 shadow-sm"
              placeholder="Dirección"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1" htmlFor="telefono">
              Teléfono
            </label>
            <input
              id="telefono"
              name="telefono"
              value={formulario.telefono}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-xl border border-indigo-200 focus:ring-2 focus:ring-indigo-400 outline-none text-base bg-indigo-50 shadow-sm"
              placeholder="Teléfono"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1" htmlFor="celular">
              Celular
            </label>
            <input
              id="celular"
              name="celular"
              value={formulario.celular}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-xl border border-indigo-200 focus:ring-2 focus:ring-indigo-400 outline-none text-base bg-indigo-50 shadow-sm"
              placeholder="Celular"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1" htmlFor="ocupacion">
              Ocupación
            </label>
            <input
              id="ocupacion"
              name="ocupacion"
              value={formulario.ocupacion}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-xl border border-indigo-200 focus:ring-2 focus:ring-indigo-400 outline-none text-base bg-indigo-50 shadow-sm"
              placeholder="Ocupación"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1" htmlFor="nivelEducativo">
              Nivel Educativo
            </label>
            <input
              id="nivelEducativo"
              name="nivelEducativo"
              value={formulario.nivelEducativo}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-xl border border-indigo-200 focus:ring-2 focus:ring-indigo-400 outline-none text-base bg-indigo-50 shadow-sm"
              placeholder="Nivel Educativo"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1" htmlFor="medicoTratante">
              Médico Tratante
            </label>
            <input
              id="medicoTratante"
              name="medicoTratante"
              value={formulario.medicoTratante}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-xl border border-indigo-200 focus:ring-2 focus:ring-indigo-400 outline-none text-base bg-indigo-50 shadow-sm"
              placeholder="Médico Tratante"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1" htmlFor="aseguradora">
              Aseguradora
            </label>
            <input
              id="aseguradora"
              name="aseguradora"
              value={formulario.aseguradora}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-xl border border-indigo-200 focus:ring-2 focus:ring-indigo-400 outline-none text-base bg-indigo-50 shadow-sm"
              placeholder="Aseguradora"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1" htmlFor="acompanante">
              Acompañante
            </label>
            <input
              id="acompanante"
              name="acompanante"
              value={formulario.acompanante}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-xl border border-indigo-200 focus:ring-2 focus:ring-indigo-400 outline-none text-base bg-indigo-50 shadow-sm"
              placeholder="Acompañante"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1" htmlFor="telefonoAcompanante">
              Teléfono del acompañante
            </label>
            <input
              id="telefonoAcompanante"
              name="telefonoAcompanante"
              value={formulario.telefonoAcompanante}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-xl border border-indigo-200 focus:ring-2 focus:ring-indigo-400 outline-none text-base bg-indigo-50 shadow-sm"
              placeholder="Teléfono del acompañante"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1" htmlFor="nombreBebe">
              Nombre del bebé
            </label>
            <input
              id="nombreBebe"
              name="nombreBebe"
              value={formulario.nombreBebe}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-xl border border-indigo-200 focus:ring-2 focus:ring-indigo-400 outline-none text-base bg-indigo-50 shadow-sm"
              placeholder="Nombre del bebé"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1" htmlFor="semanasGestacion">
              Semanas de gestación
            </label>
            <input
              id="semanasGestacion"
              name="semanasGestacion"
              value={formulario.semanasGestacion}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-xl border border-indigo-200 focus:ring-2 focus:ring-indigo-400 outline-none text-base bg-indigo-50 shadow-sm"
              placeholder="Semanas de gestación"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1" htmlFor="fum">
              FUM (Fecha de Última Menstruación)
            </label>
            <input
              id="fum"
              name="fum"
              type="date"
              value={formulario.fum}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-xl border-2 border-indigo-400 focus:ring-2 focus:ring-indigo-600 outline-none text-base bg-indigo-50 shadow-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1" htmlFor="fechaProbableParto">
              Fecha probable de parto
            </label>
            <input
              id="fechaProbableParto"
              name="fechaProbableParto"
              type="date"
              value={formulario.fechaProbableParto}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-xl border-2 border-indigo-400 focus:ring-2 focus:ring-indigo-600 outline-none text-base bg-indigo-50 shadow-sm"
            />
          </div>
        </div>
        <div className="flex justify-center gap-4 mt-8">
          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl font-bold text-lg shadow-md transition"
          >
            Registrar
          </button>
          <button
            type="button"
            onClick={() => navigate("/pacientes")}
            className="bg-gray-300 hover:bg-gray-400 text-black px-8 py-3 rounded-xl font-bold text-lg shadow-md transition"
          >
            Cancelar
          </button>
        </div>
        {mensaje && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-40">
            <div className="bg-white border border-green-300 text-green-800 px-6 py-6 rounded-xl shadow-lg flex flex-col items-center gap-4 max-w-md w-full">
              <span className="font-bold text-lg">{mensaje}</span>
              <button
                onClick={() => navigate("/pacientes")}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded font-bold"
              >
                Aceptar
              </button>
            </div>
          </div>
        )}
        {mostrarConfirmar && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-40">
            <div className="bg-white border border-indigo-300 text-indigo-800 px-8 py-8 rounded-2xl shadow-lg flex flex-col items-center gap-6 max-w-md w-full">
              <span className="font-bold text-lg">
                ¿Deseas guardar los datos del paciente?
              </span>
              <div className="flex gap-4">
                <button
                  onClick={() => {
                    setMostrarConfirmar(false);
                    guardarPaciente();
                  }}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-xl font-bold"
                >
                  Sí, guardar
                </button>
                <button
                  onClick={() => setMostrarConfirmar(false)}
                  className="bg-gray-300 hover:bg-gray-400 text-black px-6 py-2 rounded-xl font-bold"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}
        {error && <div className="text-red-600 text-center">{error}</div>}
      </form>
    </div>
  );
}