import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

function calcularEdadEnMeses(fechaNacimiento) {
  if (!fechaNacimiento) return "";
  const hoy = new Date();
  const nacimiento = new Date(fechaNacimiento);
  let meses = (hoy.getFullYear() - nacimiento.getFullYear()) * 12;
  meses += hoy.getMonth() - nacimiento.getMonth();
  if (hoy.getDate() < nacimiento.getDate()) {
    meses--;
  }
  return meses >= 0 ? meses : "";
}

const FORMULARIO_INICIAL = {
  nombres: "",
  registroCivil: "",
  genero: "",
  lugarNacimiento: "",
  fechaNacimiento: "",
  edad: "",
  peso: "",
  talla: "",
  direccion: "",
  telefono: "",
  celular: "",
  pediatra: "",
  aseguradora: "",
  nombreMadre: "",
  edadMadre: "",
  ocupacionMadre: "",
  nombrePadre: "",
  edadPadre: "",
  ocupacionPadre: "",
};

const EPS_LIST = [
  "Nueva EPS", "Sanitas EPS", "Sura EPS", "Famisanar EPS", "Aliansalud EPS: MinTrabajo",
  "Comfenalco Valle", "Salud Total EPS", "Capital Salud: MinTrabajo", "Compesar EPS: MinTrabajo",
  "EPS y Medicina Prepagada Suramericana S.A.: MinTrabajo", "EPS Servicio Occidental de Salud S.A.: MinTrabajo",
  "Comfenalco Antioquia", "Asfamilias", "Cafam", "Mutual Ser Eps", "Coosalud EPS: consultorsalud",
  "Saludcoop: Ministerio de Salud y Protección Social", "Coomeva EPS", "Salud Colpatria",
  "EPS Servicio Occidental de Salud (SOS)", "EPS Familiar de Colombia", "EPM Salud"
];

export default function RegistroPaciente() {
  const [formulario, setFormulario] = useState(FORMULARIO_INICIAL);
  const [error, setError] = useState("");
  const [mostrarConfirmar, setMostrarConfirmar] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormulario((f) => {
      if (name === "fechaNacimiento") {
        return {
          ...f,
          fechaNacimiento: value,
          edad: calcularEdadEnMeses(value).toString(),
        };
      }
      return { ...f, [name]: value };
    });
  };

  const guardarPaciente = async () => {
    setError("");
    for (const key in FORMULARIO_INICIAL) {
      if (
        !formulario[key] ||
        (typeof formulario[key] === "string" && formulario[key].trim() === "")
      ) {
        setError("Por favor, complete todos los campos.");
        return;
      }
    }
    try {
      const res = await fetch(
        "/api/pacientes",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formulario),
        }
      );
      if (!res.ok) throw new Error("Error al registrar paciente niño");
      await Swal.fire({
        icon: "success",
        title: "¡Guardado!",
        text: "El paciente niño fue registrado correctamente.",
        confirmButtonColor: "#6366f1"
      });
      navigate("/pacientes");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-pink-100 to-green-100 py-10 px-2">
      <form
        onSubmit={(e) => e.preventDefault()}
        className="w-full max-w-3xl bg-white bg-opacity-90 p-10 rounded-3xl shadow-2xl border border-indigo-100 space-y-8"
      >
        <h2 className="text-3xl font-extrabold text-indigo-700 mb-6 text-center drop-shadow tracking-wide">
          Registrar Paciente Niño
        </h2>

        {/* DATOS DEL NIÑO */}
        <div>
          <h3 className="text-lg font-bold text-indigo-600 mb-2">Datos del niño</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              <label className="block text-sm font-semibold mb-1" htmlFor="registroCivil">
                Registro Civil
              </label>
              <input
                id="registroCivil"
                name="registroCivil"
                value={formulario.registroCivil}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-xl border border-indigo-200 focus:ring-2 focus:ring-indigo-400 outline-none text-base bg-indigo-50 shadow-sm"
                placeholder="Registro Civil"
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
                <option value="">Seleccione</option>
                <option value="Masculino">Masculino</option>
                <option value="Femenino">Femenino</option>
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
                className="w-full px-4 py-3 rounded-xl border border-indigo-200 focus:ring-2 focus:ring-indigo-400 outline-none text-base bg-indigo-50 shadow-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1" htmlFor="edad">
                Edad (en meses)
              </label>
              <input
                id="edad"
                name="edad"
                value={formulario.edad}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-xl border border-indigo-200 focus:ring-2 focus:ring-indigo-400 outline-none text-base bg-indigo-50 shadow-sm"
                placeholder="Edad en meses"
                type="number"
                readOnly
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1" htmlFor="peso">
                Peso <span className="text-gray-500 text-xs">(kg)</span>
              </label>
              <input
                id="peso"
                name="peso"
                value={formulario.peso}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-xl border border-indigo-200 focus:ring-2 focus:ring-indigo-400 outline-none text-base bg-indigo-50 shadow-sm"
                placeholder="Peso en kg"
                type="number"
                min="0"
                step="0.01"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1" htmlFor="talla">
                Talla <span className="text-gray-500 text-xs">(cm)</span>
              </label>
              <input
                id="talla"
                name="talla"
                value={formulario.talla}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-xl border border-indigo-200 focus:ring-2 focus:ring-indigo-400 outline-none text-base bg-indigo-50 shadow-sm"
                placeholder="Talla en cm"
                type="number"
                min="0"
                step="0.1"
              />
            </div>
          </div>
        </div>

        {/* DATOS DE CONTACTO */}
        <div>
          <h3 className="text-lg font-bold text-indigo-600 mb-2 mt-6">Datos de contacto</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold mb-1" htmlFor="direccion">
                Dirección
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
          </div>
        </div>

        {/* DATOS DE PEDIATRA Y ASEGURADORA */}
        <div>
          <h3 className="text-lg font-bold text-indigo-600 mb-2 mt-6">Pediatra y aseguradora</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold mb-1" htmlFor="pediatra">
                Pediatra
              </label>
              <input
                id="pediatra"
                name="pediatra"
                value={formulario.pediatra}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-xl border border-indigo-200 focus:ring-2 focus:ring-indigo-400 outline-none text-base bg-indigo-50 shadow-sm"
                placeholder="Pediatra"
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
                list="aseguradora-list"
                autoComplete="off"
              />
              <datalist id="aseguradora-list">
                {EPS_LIST.map((eps) => (
                  <option key={eps} value={eps} />
                ))}
              </datalist>
            </div>
          </div>
        </div>

        {/* DATOS DE LA MADRE */}
        <div>
          <h3 className="text-lg font-bold text-indigo-600 mb-2 mt-6">Datos de la madre</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold mb-1" htmlFor="nombreMadre">
                Nombre de la Madre
              </label>
              <input
                id="nombreMadre"
                name="nombreMadre"
                value={formulario.nombreMadre}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-xl border border-indigo-200 focus:ring-2 focus:ring-indigo-400 outline-none text-base bg-indigo-50 shadow-sm"
                placeholder="Nombre de la Madre"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1" htmlFor="edadMadre">
                Edad de la Madre
              </label>
              <input
                id="edadMadre"
                name="edadMadre"
                value={formulario.edadMadre}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-xl border border-indigo-200 focus:ring-2 focus:ring-indigo-400 outline-none text-base bg-indigo-50 shadow-sm"
                placeholder="Edad de la Madre"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1" htmlFor="ocupacionMadre">
                Ocupación de la Madre
              </label>
              <input
                id="ocupacionMadre"
                name="ocupacionMadre"
                value={formulario.ocupacionMadre}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-xl border border-indigo-200 focus:ring-2 focus:ring-indigo-400 outline-none text-base bg-indigo-50 shadow-sm"
                placeholder="Ocupación de la Madre"
              />
            </div>
          </div>
        </div>

        {/* DATOS DEL PADRE */}
        <div>
          <h3 className="text-lg font-bold text-indigo-600 mb-2 mt-6">Datos del padre</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold mb-1" htmlFor="nombrePadre">
                Nombre del Padre
              </label>
              <input
                id="nombrePadre"
                name="nombrePadre"
                value={formulario.nombrePadre}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-xl border border-indigo-200 focus:ring-2 focus:ring-indigo-400 outline-none text-base bg-indigo-50 shadow-sm"
                placeholder="Nombre del Padre"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1" htmlFor="edadPadre">
                Edad del Padre
              </label>
              <input
                id="edadPadre"
                name="edadPadre"
                value={formulario.edadPadre}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-xl border border-indigo-200 focus:ring-2 focus:ring-indigo-400 outline-none text-base bg-indigo-50 shadow-sm"
                placeholder="Edad del Padre"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1" htmlFor="ocupacionPadre">
                Ocupación del Padre
              </label>
              <input
                id="ocupacionPadre"
                name="ocupacionPadre"
                value={formulario.ocupacionPadre}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-xl border border-indigo-200 focus:ring-2 focus:ring-indigo-400 outline-none text-base bg-indigo-50 shadow-sm"
                placeholder="Ocupación del Padre"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-center gap-4 mt-8">
          <button
            type="button"
            onClick={() => setMostrarConfirmar(true)}
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
        {error && <div className="text-red-600 text-center">{error}</div>}

        {/* Modal de confirmación */}
        {mostrarConfirmar && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-40">
            <div className="bg-white border border-indigo-300 text-indigo-800 px-8 py-8 rounded-2xl shadow-lg flex flex-col items-center gap-6 max-w-md w-full">
              <span className="font-bold text-lg">
                ¿Deseas guardar los datos del paciente niño?
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
      </form>
    </div>
  );
}
