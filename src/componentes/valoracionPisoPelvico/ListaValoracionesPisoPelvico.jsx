import React, { useEffect, useState } from "react";
import { apiRequest } from "../../config/api";

import { Link } from "react-router-dom";
import Spinner from "../ui/Spinner";

export default function ListaValoracionesPisoPelvico() {
  const [valoraciones, setValoraciones] = useState(null);
  const [busqueda, setBusqueda] = useState("");
  const [cargando, setCargando] = useState(false);
  const [confirmarId, setConfirmarId] = useState(null);
  const [mensaje, setMensaje] = useState("");
  const [pacientes, setPacientes] = useState({}); // <--- Nuevo estado

  const buscarValoraciones = async (q = "") => {
    setCargando(true);
    let url = "/valoracion-piso-pelvico";
    if (q.trim() !== "") {
      url += `/buscar?q=${encodeURIComponent(q)}`;
    }
    const data = await apiRequest(url);
    setValoraciones(data);
    setCargando(false);

    // Buscar nombres de pacientes adultos
    const ids = Array.isArray(data)
      ? [...new Set(data.map(v => v.paciente).filter(Boolean))]
      : [];
    const nuevosPacientes = {};
    await Promise.all(
      ids.map(async id => {
        if (!pacientes[id]) {
          try {
            const res = await apiRequest(`/pacientes-adultos/${id}`);
            const paciente = await res.json();
            nuevosPacientes[id] = paciente.nombres
              ? `${paciente.nombres} ${paciente.apellidos || ""}`.trim()
              : paciente.nombre || "Sin nombre";
          } catch {
            nuevosPacientes[id] = "Sin nombre";
          }
        }
      })
    );
    setPacientes(prev => ({ ...prev, ...nuevosPacientes }));
  };

  useEffect(() => {
    buscarValoraciones();
    // eslint-disable-next-line
  }, []);

  const handleInputChange = (e) => {
    setBusqueda(e.target.value);
    if (e.target.value.trim() === "") {
      buscarValoraciones("");
    }
  };

  const handleBuscar = (e) => {
    e.preventDefault();
    buscarValoraciones(busqueda);
  };

  const eliminarValoracion = async (id) => {
    try {
      // Eliminar la valoración del backend (esto también debería eliminar las imágenes S3)
      const res = await apiRequest(`/valoracion-piso-pelvico/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("No se pudo eliminar en el backend");
      
      const resultado = await res.json();
      
      setValoraciones(valoraciones.filter(v => v._id !== id));
      
      // Mostrar mensaje con información de imágenes eliminadas
      const mensajeCompleto = resultado.imagenesEliminadas && resultado.imagenesEliminadas > 0
        ? `Valoración eliminada correctamente. ${resultado.imagenesEliminadas} imagen(es) eliminada(s) de S3.`
        : "Valoración eliminada correctamente";
        
      setMensaje(mensajeCompleto);
      setTimeout(() => setMensaje(""), 4000);
    } catch (error) {
      console.error('Error al eliminar valoración:', error);
      setMensaje("No se pudo eliminar la valoración");
      setTimeout(() => setMensaje(""), 4000);
    }
  };

  const lista = Array.isArray(valoraciones) ? valoraciones : [];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-purple-100 to-green-100 py-10 px-2">
      <div className="max-w-4xl w-full bg-white bg-opacity-90 p-8 rounded-3xl shadow-2xl border border-indigo-100">
        {mensaje && (
          <div className="mb-4 flex items-center justify-between bg-green-100 border border-green-300 text-green-800 px-4 py-3 rounded shadow transition">
            <span>{mensaje}</span>
            <button
              onClick={() => setMensaje("")}
              className="ml-4 text-green-700 hover:text-green-900 font-bold"
              title="Cerrar"
            >
              ×
            </button>
          </div>
        )}
        <h2 className="text-3xl font-bold mb-6 text-indigo-700 text-center">Valoraciones Piso Pélvico</h2>
        <form onSubmit={handleBuscar} className="mb-6 flex justify-center gap-2">
          <input
            type="text"
            placeholder="Buscar por nombre o cédula..."
            value={busqueda}
            onChange={handleInputChange}
            className="border border-indigo-200 rounded-xl px-3 py-2 w-72 bg-indigo-50 focus:ring-2 focus:ring-indigo-400 transition"
          />
          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl font-semibold shadow transition"
          >
            Buscar
          </button>
        </form>
        <div className="overflow-x-auto rounded shadow">
          <table className="min-w-full text-base bg-white rounded-xl overflow-hidden">
            <thead>
              <tr className="bg-indigo-600 text-white">
                <th className="px-4 py-3 text-left">Paciente</th>
                <th className="px-4 py-3 text-left">Fecha</th>
                <th className="px-4 py-3 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {cargando ? (
                <tr>
                  <td colSpan={3} className="px-4 py-6 text-center">
                    <Spinner />
                  </td>
                </tr>
              ) : lista.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-4 py-6 text-center text-gray-500">
                    No hay valoraciones registradas.
                  </td>
                </tr>
              ) : (
                lista.map((v, idx) => (
                  <tr
                    key={v._id}
                    className={idx % 2 === 0 ? "bg-indigo-50 hover:bg-indigo-100" : "bg-white hover:bg-indigo-50"}
                  >
                    <td className="px-4 py-2 border-b border-indigo-100 font-medium">
                      {pacientes[v.paciente] || v.paciente || "Sin referencia"}
                    </td>
                    <td className="px-4 py-2 border-b border-indigo-100">
                      {v.fecha || v.fechaValoracion || v.createdAt?.slice(0,10) || "-"}
                    </td>
                    <td className="px-4 py-2 border-b border-indigo-100 text-center">
                      <Link
                        to={`/valoraciones-piso-pelvico/${v._id}`}
                        className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-1 rounded-xl transition font-semibold shadow"
                      >
                        Ver detalle
                      </Link>
                      <button
                        onClick={() => setConfirmarId(v._id)}
                        className="inline-block bg-red-600 hover:bg-red-700 text-white px-4 py-1 rounded-xl ml-2 font-semibold shadow transition"
                        title="Eliminar Valoración"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {/* Modal de confirmación */}
        {confirmarId && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-30">
            <div className="bg-white border border-red-300 text-red-800 px-6 py-6 rounded-2xl shadow-lg flex flex-col items-center gap-4 max-w-md w-full">
              <span className="font-bold text-lg">¿Seguro que deseas eliminar esta valoración?</span>
              <div className="flex gap-2 mt-2">
                <button
                  onClick={async () => {
                    await eliminarValoracion(confirmarId);
                    setConfirmarId(null);
                  }}
                  className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-xl font-bold shadow transition"
                >
                  Sí, eliminar
                </button>
                <button
                  onClick={() => setConfirmarId(null)}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2 rounded-xl font-bold shadow transition"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}