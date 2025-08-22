import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
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

function calcularFechaProbableParto(fum) {
  if (!fum) return "";
  
  const fechaFUM = new Date(fum);
  const fechaParto = new Date(fechaFUM);
  
  // Regla de Naegele: FUM + 7 días + 9 meses
  fechaParto.setDate(fechaParto.getDate() + 7);
  fechaParto.setMonth(fechaParto.getMonth() + 9);
  
  return fechaParto.toISOString().split('T')[0];
}

function calcularSemanasGestacion(fum) {
  if (!fum) return "";
  
  const fechaFUM = new Date(fum);
  const hoy = new Date();
  const diferenciaTiempo = hoy.getTime() - fechaFUM.getTime();
  const diferenciaDias = Math.ceil(diferenciaTiempo / (1000 * 3600 * 24));
  const semanas = Math.floor(diferenciaDias / 7);
  
  return semanas > 0 ? semanas.toString() : "0";
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
  estadoEmbarazo: "", // "gestacion" o "posparto"
  semanasGestacion: "",
  fum: "",
  fechaProbableParto: "",
};

export default function EditarPacienteAdulto() {
  const { id } = useParams();
  const [formulario, setFormulario] = useState(FORMULARIO_INICIAL);
  const [cargando, setCargando] = useState(true);
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const [mostrarConfirmar, setMostrarConfirmar] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    apiRequest(`/pacientes-adultos/${id}`)
      .then(data => {
        // Para retrocompatibilidad: si no tiene estadoEmbarazo, asignar "gestacion"
        if (!data.estadoEmbarazo) {
          data.estadoEmbarazo = "gestacion";
        }
        setFormulario({
          ...FORMULARIO_INICIAL,
          ...data,
        });
      })
      .catch(() => setError("No se pudo cargar el paciente"))
      .finally(() => setCargando(false));
    // eslint-disable-next-line
  }, [id]);

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
      if (name === "fum") {
        return {
          ...f,
          fum: value,
          fechaProbableParto: calcularFechaProbableParto(value),
          semanasGestacion: calcularSemanasGestacion(value),
        };
      }
      return { ...f, [name]: value };
    });
  };

  const guardarCambios = async () => {
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
        `/pacientes-adultos/${id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formulario),
        }
      );
      setMensaje("Paciente adulto actualizado correctamente");
      setTimeout(() => navigate(`/pacientes-adultos/${id}`), 1500);
    } catch (err) {
      setError("Error al actualizar paciente adulto");
    }
  };

  const handleSubmit = e => {
    e.preventDefault();
    setMostrarConfirmar(true);
  };

  if (cargando)
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-indigo-600 border-solid"></div>
        <span className="ml-4 text-indigo-700 font-bold">Cargando...</span>
      </div>
    );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-purple-100 to-green-100">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-3xl bg-white p-8 rounded-2xl shadow-2xl space-y-8"
      >
        <h2 className="text-3xl font-extrabold text-indigo-700 mb-6 text-center tracking-wide">
          Editar Paciente Adulto
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Reutiliza los mismos campos que en RegistrarPacienteAdulto */}
          {Object.entries(FORMULARIO_INICIAL).map(([key], idx) => {
            if (key === "edad") {
              return (
                <div key={key}>
                  <label className="block text-sm font-semibold mb-1" htmlFor={key}>
                    Edad
                  </label>
                  <input
                    id={key}
                    name={key}
                    type="text"
                    value={formulario[key]}
                    readOnly
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-gray-100 text-base"
                    placeholder="Edad"
                  />
                </div>
              );
            }
            if (key === "genero" || key === "estadoEmbarazo") {
              return (
                <div key={key}>
                  <label className="block text-sm font-semibold mb-1" htmlFor={key}>
                    {key === "genero" ? "Género" : "Estado del embarazo"}
                  </label>
                  <select
                    id={key}
                    name={key}
                    value={formulario[key]}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-400 outline-none text-base bg-white"
                  >
                    <option value="">Seleccione...</option>
                    {key === "genero" ? (
                      <>
                        <option value="Femenino">Femenino</option>
                        <option value="Masculino">Masculino</option>
                        <option value="Otro">Otro</option>
                      </>
                    ) : (
                      <>
                        <option value="gestacion">En gestación</option>
                        <option value="posparto">Posparto</option>
                      </>
                    )}
                  </select>
                </div>
              );
            }
            if (key === "fechaNacimiento") {
              return (
                <div key={key}>
                  <label className="block text-sm font-semibold mb-1" htmlFor={key}>
                    Fecha de Nacimiento
                  </label>
                  <input
                    id={key}
                    name={key}
                    type="date"
                    value={formulario[key]}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border-2 border-indigo-400 focus:ring-2 focus:ring-indigo-600 outline-none text-base"
                  />
                </div>
              );
            }
            
            if (key === "fum") {
              // Solo mostrar FUM si está en gestación
              if (formulario.estadoEmbarazo !== "gestacion" && formulario.estadoEmbarazo !== "") {
                return null;
              }
              return (
                <div key={key}>
                  <label className="block text-sm font-semibold mb-1" htmlFor={key}>
                    FUM (Fecha de Última Menstruación)
                  </label>
                  <div className="flex gap-2">
                    <input
                      id={key}
                      name={key}
                      type="date"
                      value={formulario[key]}
                      onChange={handleChange}
                      required
                      className="flex-1 px-4 py-3 rounded-lg border-2 border-pink-400 focus:ring-2 focus:ring-pink-600 outline-none text-base bg-pink-50"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (formulario.fum) {
                          setFormulario(f => ({
                            ...f,
                            fechaProbableParto: calcularFechaProbableParto(formulario.fum),
                            semanasGestacion: calcularSemanasGestacion(formulario.fum),
                          }));
                        }
                      }}
                      className="px-4 py-3 bg-pink-500 hover:bg-pink-600 text-white rounded-lg font-medium transition-colors shadow-sm"
                      title="Recalcular fechas"
                    >
                      🔄
                    </button>
                  </div>
                </div>
              );
            }
            
            if (key === "fechaProbableParto") {
              // Solo mostrar fecha probable si está en gestación
              if (formulario.estadoEmbarazo !== "gestacion" && formulario.estadoEmbarazo !== "") {
                return null;
              }
              return (
                <div key={key}>
                  <label className="block text-sm font-semibold mb-1" htmlFor={key}>
                    Fecha probable de parto (calculada automáticamente)
                  </label>
                  <input
                    id={key}
                    name={key}
                    type="date"
                    value={formulario[key]}
                    readOnly
                    className="w-full px-4 py-3 rounded-lg border-2 border-pink-400 bg-pink-100 text-base"
                  />
                </div>
              );
            }
            
            // Solo mostrar semanas de gestación si está en gestación
            if (key === "semanasGestacion") {
              if (formulario.estadoEmbarazo !== "gestacion" && formulario.estadoEmbarazo !== "") {
                return null;
              }
              return (
                <div key={key}>
                  <label className="block text-sm font-semibold mb-1" htmlFor={key}>
                    Semanas de gestación (calculadas automáticamente)
                  </label>
                  <input
                    id={key}
                    name={key}
                    value={formulario[key]}
                    readOnly
                    className="w-full px-4 py-3 rounded-lg border border-pink-200 bg-pink-100 text-base"
                    placeholder="Se calcula automáticamente"
                  />
                </div>
              );
            }
            
            return (
              <div key={key}>
                <label className="block text-sm font-semibold mb-1" htmlFor={key}>
                  {key
                    .replace(/([A-Z])/g, " $1")
                    .replace(/^./, str => str.toUpperCase())
                    .replace("Fum", "FUM")
                    .replace("Cedula", "Cédula")
                    .replace("Acompanante", "Acompañante")}
                </label>
                <input
                  id={key}
                  name={key}
                  value={formulario[key]}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-400 outline-none text-base"
                  placeholder={key
                    .replace(/([A-Z])/g, " $1")
                    .replace(/^./, str => str.toUpperCase())}
                />
              </div>
            );
          })}
        </div>
        <div className="flex justify-center gap-4 mt-8">
          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-lg font-bold text-lg shadow-md transition"
          >
            Guardar Cambios
          </button>
          <button
            type="button"
            onClick={() => navigate(`/pacientes-adultos/${id}`)}
            className="bg-gray-300 hover:bg-gray-400 text-black px-8 py-3 rounded-lg font-bold text-lg shadow-md transition"
          >
            Cancelar
          </button>
        </div>
        {/* Modal de confirmación */}
        {mostrarConfirmar && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-40">
            <div className="bg-white border border-indigo-300 text-indigo-800 px-8 py-8 rounded-xl shadow-lg flex flex-col items-center gap-6 max-w-md w-full">
              <span className="font-bold text-lg">¿Deseas guardar los cambios del paciente?</span>
              <div className="flex gap-4">
                <button
                  onClick={() => {
                    setMostrarConfirmar(false);
                    guardarCambios();
                  }}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded font-bold"
                >
                  Sí, guardar
                </button>
                <button
                  onClick={() => setMostrarConfirmar(false)}
                  className="bg-gray-300 hover:bg-gray-400 text-black px-6 py-2 rounded font-bold"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}
        {mensaje && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-40">
            <div className="bg-white border border-green-300 text-green-800 px-6 py-6 rounded-xl shadow-lg flex flex-col items-center gap-4 max-w-md w-full">
              <span className="font-bold text-lg">{mensaje}</span>
            </div>
          </div>
        )}
        {error && <div className="text-red-600 text-center">{error}</div>}
      </form>
    </div>
  );
}