import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../config/api";

export default function ListaPacientes({ tipo }) {
  const [pacientes, setPacientes] = useState([]);
  const [error, setError] = useState("");
  const [confirmarId, setConfirmarId] = useState(null);
  const [mensaje, setMensaje] = useState("");
  const [busqueda, setBusqueda] = useState("");
  const [cargando, setCargando] = useState(true);
  const [mostrarSeleccion, setMostrarSeleccion] = useState(false);
  const [tipoBusqueda, setTipoBusqueda] = useState(tipo || "nino"); // "nino", "adulto", "todos"
  const [filaExpandida, setFilaExpandida] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    setCargando(true);
    let url = "";
    if (tipoBusqueda === "nino") url = "/pacientes";
    else if (tipoBusqueda === "adulto") url = "/pacientes-adultos";
    apiRequest(url)
      .then((data) => setPacientes(Array.isArray(data) ? data : []))
      .catch(() => setError("No se pudo cargar la lista de pacientes"))
      .finally(() => setCargando(false));
  }, [tipoBusqueda]);

  const eliminarPaciente = async (id) => {
    try {
      if (tipoBusqueda === "nino") {
        const clases = await apiRequest(`/clases/paciente/${id}`);
        if (clases.length > 0) {
          setError("No puedes eliminar este paciente porque está inscrito en una o más clases.");
          return;
        }
      }
      let url = "";
      if (tipoBusqueda === "nino") {
        url = `/pacientes/${id}`;
      } else if (tipoBusqueda === "adulto") {
        url = `/pacientes-adultos/${id}`;
      }
      await apiRequest(url, { method: "DELETE" });
      setPacientes(pacientes.filter(p => p._id !== id));
      setMensaje("Paciente eliminado correctamente");
    } catch {
      setError("No se pudo eliminar el paciente");
    }
  };

  const buscarPacientes = async (valor) => {
    setBusqueda(valor);
    try {
      let url = "";
      if (!valor) {
        if (tipoBusqueda === "nino") url = "/pacientes";
        else if (tipoBusqueda === "adulto") url = "/pacientes-adultos";
        const data = await apiRequest(url);
        setPacientes(data);
        return;
      }
      if (tipoBusqueda === "nino") url = `/pacientes/buscar?q=${encodeURIComponent(valor)}`;
      else if (tipoBusqueda === "adulto") url = `/pacientes-adultos/buscar?q=${encodeURIComponent(valor)}`;
      const data = await apiRequest(url);
      setPacientes(data);
    } catch {
      setError("No se pudo buscar pacientes");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-100 via-purple-100 to-green-100 py-10 px-2">
      <div className="w-full max-w-5xl bg-white bg-opacity-90 rounded-3xl shadow-2xl p-8 border border-indigo-100">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <h1 className="text-3xl font-extrabold text-indigo-700 drop-shadow text-center md:text-left">Lista de Pacientes</h1>
          <button
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-xl font-bold text-lg shadow transition"
            onClick={() => setMostrarSeleccion(true)}
          >
            + Nuevo
          </button>
        </div>
        <div className="mb-6 flex flex-col md:flex-row items-center gap-2">
          <label className="font-bold text-indigo-700 text-base">Tipo:</label>
          <select
            value={tipoBusqueda}
            onChange={e => setTipoBusqueda(e.target.value)}
            className="border rounded-xl px-3 py-2 text-base bg-indigo-50 focus:border-indigo-500 transition"
          >
            <option value="nino">Niño</option>
            <option value="adulto">Adulto</option>
          </select>
          <input
            type="text"
            placeholder="Buscar..."
            value={busqueda}
            onChange={e => buscarPacientes(e.target.value)}
            className="border rounded-xl px-3 py-2 w-full max-w-xs text-base bg-indigo-50 focus:border-indigo-500 transition"
          />
        </div>
        {cargando ? (
          <div className="flex justify-center items-center min-h-[200px]">
            <div className="animate-spin rounded-full h-8 w-8 border-t-4 border-indigo-600 border-solid"></div>
            <span className="ml-2 text-indigo-700 font-bold text-base">Cargando...</span>
          </div>
        ) : (
          <>
            {/* TABLA EN ESCRITORIO */}
            <div className="hidden md:block">
              <table className="min-w-full text-base rounded-xl overflow-hidden">
                <thead className="bg-indigo-600">
                  <tr>
                    <th className="px-4 py-3 text-left text-white">Nombre</th>
                    <th className="px-4 py-3 text-left text-white">Doc</th>
                    <th className="px-4 py-3 text-left text-white">Edad</th>
                    <th className="px-4 py-3 text-left text-white">Género</th>
                    <th className="px-4 py-3 text-left text-white">Celular</th>
                    <th className="px-4 py-3 text-left text-white">Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {pacientes.map((paciente, idx) => (
                    <tr
                      key={idx}
                      className={`${idx % 2 === 0 ? "bg-gray-50" : ""} cursor-pointer hover:bg-indigo-100 transition`}
                      onClick={() =>
                        navigate(
                          tipoBusqueda === "nino"
                            ? `/pacientes/${paciente._id}`
                            : `/pacientes-adultos/${paciente._id}`
                        )
                      }
                    >
                      <td className="px-4 py-3">{paciente.nombres}</td>
                      <td className="px-4 py-3">
                        {tipoBusqueda === "nino" ? paciente.registroCivil : paciente.cedula}
                      </td>
                      <td className="px-4 py-3">{paciente.edad}</td>
                      <td className="px-4 py-3">{paciente.genero}</td>
                      <td className="px-4 py-3">{paciente.celular}</td>
                      <td className="px-4 py-3">
                        <button
                          onClick={e => {
                            e.stopPropagation();
                            setConfirmarId(paciente._id);
                          }}
                          className="bg-pink-200 hover:bg-pink-300 text-pink-800 px-3 py-1 rounded-xl text-base font-bold shadow transition"
                          title="Eliminar"
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* LISTA EN MOVIL */}
            <div className="block md:hidden">
              {pacientes.map((paciente, idx) => (
                <div
                  key={idx}
                  className="bg-white border-b border-gray-200 px-4 py-3 mb-2 rounded-2xl shadow-sm"
                  onClick={() => setFilaExpandida(filaExpandida === idx ? null : idx)}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-bold text-indigo-700">{paciente.nombres}</div>
                      <div className="text-gray-600 text-sm">
                        {tipoBusqueda === "nino" ? paciente.registroCivil : paciente.cedula}
                      </div>
                    </div>
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        setConfirmarId(paciente._id);
                      }}
                      className="bg-pink-200 hover:bg-pink-300 text-pink-800 px-3 py-1 rounded-xl text-base font-bold shadow transition"
                      title="Eliminar"
                    >
                      Eliminar
                    </button>
                  </div>
                  {filaExpandida === idx && (
                    <div className="mt-2 bg-indigo-50 rounded-xl p-3 text-sm flex flex-col gap-1">
                      <div><span className="font-bold">Edad:</span> {paciente.edad}</div>
                      <div><span className="font-bold">Género:</span> {paciente.genero}</div>
                      <div><span className="font-bold">Celular:</span> {paciente.celular}</div>
                      <button
                        className="mt-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-3 py-1 text-base font-bold shadow transition"
                        onClick={e => {
                          e.stopPropagation();
                          navigate(
                            tipoBusqueda === "nino"
                              ? `/pacientes/${paciente._id}`
                              : `/pacientes-adultos/${paciente._id}`
                          );
                        }}
                      >
                        Ver detalle
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
        {/* MODAL CONFIRMAR ELIMINAR */}
        {confirmarId && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-40">
            <div className="bg-white border border-pink-200 text-pink-800 px-6 py-4 rounded-2xl shadow-lg flex flex-col items-center gap-2 max-w-xs w-full">
              <span className="font-bold text-base">¿Eliminar paciente?</span>
              <div className="flex gap-2">
                <button
                  onClick={async () => {
                    await eliminarPaciente(confirmarId);
                    setConfirmarId(null);
                  }}
                  className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-xl font-bold text-base shadow transition"
                >
                  Sí
                </button>
                <button
                  onClick={() => setConfirmarId(null)}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-xl font-bold text-base shadow transition"
                >
                  No
                </button>
              </div>
            </div>
          </div>
        )}
        {/* MODAL NUEVO PACIENTE */}
        {mostrarSeleccion && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
            <div className="bg-white rounded-2xl shadow-lg p-6 text-center max-w-xs w-full">
              <h2 className="text-base font-bold mb-3">¿Qué tipo de paciente registrar?</h2>
              <div className="flex flex-col gap-2">
                <button
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl font-bold text-base shadow transition"
                  onClick={() => {
                    setMostrarSeleccion(false);
                    navigate("/registrar-paciente-nino");
                  }}
                >
                  Niño
                </button>
                <button
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl font-bold text-base shadow transition"
                  onClick={() => {
                    setMostrarSeleccion(false);
                    navigate("/registrar-paciente-adulto");
                  }}
                >
                  Mamá
                </button>
                <button
                  className="mt-2 text-gray-500 underline text-base"
                  onClick={() => setMostrarSeleccion(false)}
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}
        {error && <div className="text-red-600 text-base mt-2">{error}</div>}
        {mensaje && <div className="text-green-600 text-base mt-2">{mensaje}</div>}
      </div>
    </div>
  );
}