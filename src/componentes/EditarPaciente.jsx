import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { apiRequest } from "../config/api";

const EPS_LIST = [
  "Nueva EPS", "Sanitas EPS", "Sura EPS", "Famisanar EPS", "Aliansalud EPS: MinTrabajo",
  "Comfenalco Valle", "Salud Total EPS", "Capital Salud: MinTrabajo", "Compesar EPS: MinTrabajo",
  "EPS y Medicina Prepagada Suramericana S.A.: MinTrabajo", "EPS Servicio Occidental de Salud S.A.: MinTrabajo",
  "Comfenalco Antioquia", "Asfamilias", "Cafam", "Mutual Ser Eps", "Coosalud EPS: consultorsalud",
  "Saludcoop: Ministerio de Salud y Protección Social", "Coomeva EPS", "Salud Colpatria",
  "EPS Servicio Occidental de Salud (SOS)", "EPS Familiar de Colombia", "EPM Salud"
];

export default function EditarPaciente() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [paciente, setPaciente] = useState(null);
  const [mostrarConfirmar, setMostrarConfirmar] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    apiRequest(`/pacientes/${id}`)
      .then(setPaciente);
  }, [id]);

  const handleChange = e => {
    const { name, value } = e.target;
    let nuevosDatos = { ...paciente, [name]: value };

    // Calcular edad en meses automáticamente al cambiar la fecha de nacimiento
    if (name === "fechaNacimiento" && value) {
      const fechaNac = new Date(value);
      const hoy = new Date();
      let meses =
        (hoy.getFullYear() - fechaNac.getFullYear()) * 12 +
        (hoy.getMonth() - fechaNac.getMonth());
      if (hoy.getDate() < fechaNac.getDate()) {
        meses -= 1;
      }
      nuevosDatos.edad = meses >= 0 ? meses.toString() : "";
    }

    setPaciente(nuevosDatos);
  };

  const handleGuardar = async () => {
    setError("");
    // Validar que todos los campos estén llenos
    for (const key in paciente) {
      if (
        paciente.hasOwnProperty(key) &&
        (paciente[key] === undefined ||
          paciente[key] === null ||
          (typeof paciente[key] === "string" && paciente[key].trim() === ""))
      ) {
        setError("Por favor, complete todos los campos.");
        return;
      }
    }
    try {
      await apiRequest(`/pacientes/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(paciente),
      });
      await Swal.fire({
        icon: "success",
        title: "¡Actualizado!",
        text: "El paciente fue actualizado correctamente.",
        confirmButtonColor: "#6366f1"
      });
      navigate(`/pacientes/${id}`);
    } catch (err) {
      setError(err.message);
    }
  };

  if (!paciente) return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-purple-100 to-green-100">
      <div className="flex flex-col items-center">
        <div className="w-16 h-16 border-4 border-indigo-400 border-t-transparent rounded-full animate-spin mb-4"></div>
        <span className="text-indigo-700 font-bold text-lg">Cargando información...</span>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-purple-100 to-green-100 py-10 px-2">
      <form
        onSubmit={e => e.preventDefault()}
        className="w-full max-w-3xl bg-white bg-opacity-90 p-10 rounded-3xl shadow-2xl border border-indigo-100 space-y-8"
      >
        <h2 className="text-3xl font-extrabold text-indigo-700 mb-6 text-center drop-shadow tracking-wide">
          Editar Paciente Niño
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
                className="w-full px-4 py-3 rounded-xl border border-indigo-200 focus:ring-2 focus:ring-indigo-400 outline-none text-base bg-indigo-50 shadow-sm"
                id="nombres"
                name="nombres"
                value={paciente.nombres || ""}
                onChange={handleChange}
                placeholder="Nombres y Apellidos"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1" htmlFor="registroCivil">
                Registro Civil
              </label>
              <input
                className="w-full px-4 py-3 rounded-xl border border-indigo-200 focus:ring-2 focus:ring-indigo-400 outline-none text-base bg-indigo-50 shadow-sm"
                id="registroCivil"
                name="registroCivil"
                value={paciente.registroCivil || ""}
                onChange={handleChange}
                placeholder="Registro Civil"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1" htmlFor="genero">
                Género
              </label>
              <select
                className="w-full px-4 py-3 rounded-xl border border-indigo-200 focus:ring-2 focus:ring-indigo-400 outline-none text-base bg-indigo-50 shadow-sm"
                id="genero"
                name="genero"
                value={paciente.genero || ""}
                onChange={handleChange}
                required
              >
                <option value="">Seleccione</option>
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
                className="w-full px-4 py-3 rounded-xl border border-indigo-200 focus:ring-2 focus:ring-indigo-400 outline-none text-base bg-indigo-50 shadow-sm"
                id="lugarNacimiento"
                name="lugarNacimiento"
                value={paciente.lugarNacimiento || ""}
                onChange={handleChange}
                placeholder="Lugar de Nacimiento"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1" htmlFor="fechaNacimiento">
                Fecha de Nacimiento
              </label>
              <input
                className="w-full px-4 py-3 rounded-xl border border-indigo-200 focus:ring-2 focus:ring-indigo-400 outline-none text-base bg-indigo-50 shadow-sm"
                id="fechaNacimiento"
                name="fechaNacimiento"
                type="date"
                value={paciente.fechaNacimiento || ""}
                onChange={handleChange}
                placeholder="Fecha de Nacimiento"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1" htmlFor="edad">
                Edad (en meses)
              </label>
              <input
                className="w-full px-4 py-3 rounded-xl border border-indigo-200 focus:ring-2 focus:ring-indigo-400 outline-none text-base bg-indigo-50 shadow-sm"
                id="edad"
                name="edad"
                value={paciente.edad || ""}
                onChange={handleChange}
                placeholder="Edad"
                type="number"
                readOnly
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1" htmlFor="peso">
                Peso <span className="text-gray-500 text-xs">(kg)</span>
              </label>
              <input
                className="w-full px-4 py-3 rounded-xl border border-indigo-200 focus:ring-2 focus:ring-indigo-400 outline-none text-base bg-indigo-50 shadow-sm"
                id="peso"
                name="peso"
                value={paciente.peso || ""}
                onChange={handleChange}
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
                className="w-full px-4 py-3 rounded-xl border border-indigo-200 focus:ring-2 focus:ring-indigo-400 outline-none text-base bg-indigo-50 shadow-sm"
                id="talla"
                name="talla"
                value={paciente.talla || ""}
                onChange={handleChange}
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
                className="w-full px-4 py-3 rounded-xl border border-indigo-200 focus:ring-2 focus:ring-indigo-400 outline-none text-base bg-indigo-50 shadow-sm"
                id="direccion"
                name="direccion"
                value={paciente.direccion || ""}
                onChange={handleChange}
                placeholder="Dirección"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1" htmlFor="telefono">
                Teléfono
              </label>
              <input
                className="w-full px-4 py-3 rounded-xl border border-indigo-200 focus:ring-2 focus:ring-indigo-400 outline-none text-base bg-indigo-50 shadow-sm"
                id="telefono"
                name="telefono"
                value={paciente.telefono || ""}
                onChange={handleChange}
                placeholder="Teléfono"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1" htmlFor="celular">
                Celular
              </label>
              <input
                className="w-full px-4 py-3 rounded-xl border border-indigo-200 focus:ring-2 focus:ring-indigo-400 outline-none text-base bg-indigo-50 shadow-sm"
                id="celular"
                name="celular"
                value={paciente.celular || ""}
                onChange={handleChange}
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
                className="w-full px-4 py-3 rounded-xl border border-indigo-200 focus:ring-2 focus:ring-indigo-400 outline-none text-base bg-indigo-50 shadow-sm"
                id="pediatra"
                name="pediatra"
                value={paciente.pediatra || ""}
                onChange={handleChange}
                placeholder="Pediatra"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1" htmlFor="aseguradora">
                Aseguradora
              </label>
              <input
                className="w-full px-4 py-3 rounded-xl border border-indigo-200 focus:ring-2 focus:ring-indigo-400 outline-none text-base bg-indigo-50 shadow-sm"
                id="aseguradora"
                name="aseguradora"
                value={paciente.aseguradora || ""}
                onChange={handleChange}
                placeholder="Aseguradora"
                list="aseguradora-list"
                autoComplete="off"
              />
              <datalist id="aseguradora-list">
                {EPS_LIST.map(eps => (
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
                className="w-full px-4 py-3 rounded-xl border border-indigo-200 focus:ring-2 focus:ring-indigo-400 outline-none text-base bg-indigo-50 shadow-sm"
                id="nombreMadre"
                name="nombreMadre"
                value={paciente.nombreMadre || ""}
                onChange={handleChange}
                placeholder="Nombre de la Madre"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1" htmlFor="edadMadre">
                Edad de la Madre
              </label>
              <input
                className="w-full px-4 py-3 rounded-xl border border-indigo-200 focus:ring-2 focus:ring-indigo-400 outline-none text-base bg-indigo-50 shadow-sm"
                id="edadMadre"
                name="edadMadre"
                value={paciente.edadMadre || ""}
                onChange={handleChange}
                placeholder="Edad de la Madre"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1" htmlFor="ocupacionMadre">
                Ocupación de la Madre
              </label>
              <input
                className="w-full px-4 py-3 rounded-xl border border-indigo-200 focus:ring-2 focus:ring-indigo-400 outline-none text-base bg-indigo-50 shadow-sm"
                id="ocupacionMadre"
                name="ocupacionMadre"
                value={paciente.ocupacionMadre || ""}
                onChange={handleChange}
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
                className="w-full px-4 py-3 rounded-xl border border-indigo-200 focus:ring-2 focus:ring-indigo-400 outline-none text-base bg-indigo-50 shadow-sm"
                id="nombrePadre"
                name="nombrePadre"
                value={paciente.nombrePadre || ""}
                onChange={handleChange}
                placeholder="Nombre del Padre"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1" htmlFor="edadPadre">
                Edad del Padre
              </label>
              <input
                className="w-full px-4 py-3 rounded-xl border border-indigo-200 focus:ring-2 focus:ring-indigo-400 outline-none text-base bg-indigo-50 shadow-sm"
                id="edadPadre"
                name="edadPadre"
                value={paciente.edadPadre || ""}
                onChange={handleChange}
                placeholder="Edad del Padre"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1" htmlFor="ocupacionPadre">
                Ocupación del Padre
              </label>
              <input
                className="w-full px-4 py-3 rounded-xl border border-indigo-200 focus:ring-2 focus:ring-indigo-400 outline-none text-base bg-indigo-50 shadow-sm"
                id="ocupacionPadre"
                name="ocupacionPadre"
                value={paciente.ocupacionPadre || ""}
                onChange={handleChange}
                placeholder="Ocupación del Padre"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-center gap-4 mt-8">
          <button
            type="button"
            className="bg-green-600 text-white px-8 py-3 rounded-xl font-bold text-lg shadow-md transition hover:bg-green-700"
            onClick={() => setMostrarConfirmar(true)}
          >
            Guardar cambios
          </button>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="bg-gray-300 hover:bg-gray-400 text-black px-8 py-3 rounded-xl font-bold text-lg shadow-md transition"
          >
            Cancelar
          </button>
        </div>
        {error && <div className="text-red-600 text-center">{error}</div>}

        {/* Modal de confirmación */}
        {mostrarConfirmar && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
            <div className="bg-white border border-indigo-300 text-indigo-800 px-8 py-8 rounded-2xl shadow-lg flex flex-col items-center gap-6 max-w-md w-full">
              <span className="font-bold text-lg">
                ¿Deseas guardar los cambios del paciente niño?
              </span>
              <div className="flex gap-4">
                <button
                  onClick={() => {
                    setMostrarConfirmar(false);
                    handleGuardar();
                  }}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-xl font-bold"
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