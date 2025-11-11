import React, { useEffect, useState } from "react";
import { apiRequest } from "../../config/api";

import { Link } from "react-router-dom";
import Spinner from "../ui/Spinner";

export default function ListaConsentimientosPerinatales() {
  const [consentimientos, setConsentimientos] = useState(null);
  const [busqueda, setBusqueda] = useState("");
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [cargando, setCargando] = useState(false);
  const [confirmarId, setConfirmarId] = useState(null);
  const [mensaje, setMensaje] = useState("");

  const buscarConsentimientos = async () => {
    setCargando(true);
    try {
      const params = new URLSearchParams();
      if (busqueda) params.append("busqueda", busqueda);
      if (fechaInicio) params.append("fechaInicio", fechaInicio);
      if (fechaFin) params.append("fechaFin", fechaFin);

      const data = await apiRequest(`/consentimiento-perinatal?${params.toString()}`);
      setConsentimientos(data);
    } catch (error) {
      console.error('Error al buscar consentimientos:', error);
      setConsentimientos([]);
    }
    setCargando(false);
  };

  useEffect(() => {
    buscarConsentimientos();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);



  const eliminarConsentimiento = async (id) => {
    try {
      // Eliminar el consentimiento del backend (esto también debería eliminar las imágenes S3)
      const res = await apiRequest(`/consentimiento-perinatal/${id}`, {
        method: "DELETE",
      });
      console.log("Respuesta al eliminar:", res); // <-- Log de la respuesta
      // Si el backend retorna un campo 'error', lanzar el error
      if (res && res.error) throw new Error(res.error);
      // Si el backend retorna un mensaje de éxito
      if (res && res.mensaje) {
        setConsentimientos(consentimientos.filter(c => c._id !== id));
        const mensajeCompleto = res.imagenesEliminadas && res.imagenesEliminadas > 0
          ? `Consentimiento eliminado correctamente. ${res.imagenesEliminadas} imagen(es) eliminada(s) de S3.`
          : "Consentimiento eliminado correctamente";
        setMensaje(mensajeCompleto);
        setTimeout(() => setMensaje(""), 4000);
        return;
      }
      // Si no hay mensaje ni error, mostrar mensaje genérico
      throw new Error("No se pudo eliminar en el backend");
    } catch (error) {
      console.error('Error al eliminar consentimiento:', error);
      setMensaje(error.message || "No se pudo eliminar el consentimiento");
      setTimeout(() => setMensaje(""), 4000);
    }
  };

  const lista = Array.isArray(consentimientos) ? consentimientos : [];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-pink-100 to-green-100 py-10 px-2">
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
        <h2 className="text-3xl font-bold mb-6 text-indigo-700 text-center">Consentimientos Perinatales</h2>
        <div className="bg-indigo-50 rounded-xl p-4 mb-6">
          <h4 className="font-semibold text-indigo-700 mb-3">Filtros de búsqueda</h4>
          <div className="flex flex-col gap-3">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Buscar</label>
                <input
                  type="text"
                  placeholder="Buscar por nombre o cédula..."
                  value={busqueda}
                  onChange={e => setBusqueda(e.target.value)}
                  className="w-full border border-indigo-200 rounded-xl px-3 py-2 bg-white focus:ring-2 focus:ring-indigo-400 transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Desde</label>
                <input
                  type="date"
                  value={fechaInicio}
                  onChange={e => setFechaInicio(e.target.value)}
                  className="w-full border border-indigo-200 rounded-xl px-3 py-2 bg-white focus:ring-2 focus:ring-indigo-400 transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Hasta</label>
                <input
                  type="date"
                  value={fechaFin}
                  onChange={e => setFechaFin(e.target.value)}
                  className="w-full border border-indigo-200 rounded-xl px-3 py-2 bg-white focus:ring-2 focus:ring-indigo-400 transition"
                />
              </div>
            </div>
            <div className="flex justify-center gap-2">
              <button
                onClick={buscarConsentimientos}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-xl shadow transition"
              >
                Buscar
              </button>
              <button
                onClick={() => {
                  setBusqueda("");
                  setFechaInicio("");
                  setFechaFin("");
                  setTimeout(() => buscarConsentimientos(), 100);
                }}
                className="bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-xl transition"
              >
                Limpiar
              </button>
            </div>
          </div>
        </div>
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
                    No hay consentimientos registrados.
                  </td>
                </tr>
              ) : (
                lista.map((c, idx) => (
                  <tr
                    key={c._id}
                    className={idx % 2 === 0 ? "bg-indigo-50 hover:bg-indigo-100" : "bg-white hover:bg-indigo-50"}
                  >
                    <td className="px-4 py-2 border-b border-indigo-100 font-medium">
                      {c.paciente?.nombres || "Sin nombre"}
                    </td>
                    <td className="px-4 py-2 border-b border-indigo-100">
                      {c.fecha || "-"}
                    </td>
                    <td className="px-4 py-2 border-b border-indigo-100 text-center">
                      <Link
                        to={`/consentimientos-perinatales/${c._id}`}
                        className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-1 rounded-xl transition font-semibold shadow"
                      >
                        Ver detalle
                      </Link>
                      <button
                        onClick={() => setConfirmarId(c._id)}
                        className="inline-block bg-red-600 hover:bg-red-700 text-white px-4 py-1 rounded-xl ml-2 font-semibold shadow transition"
                        title="Eliminar Valoraciones"
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
              <span className="font-bold text-lg">¿Seguro que deseas eliminar este consentimiento?</span>
              <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4 w-full">
                <p className="font-bold">¡Advertencia!</p>
                <p>Esta acción eliminará permanentemente la valoración y todas las sesiones individuales que aparecen en la lista de sesiones del paciente.</p>
              </div>
              <div className="flex gap-2 mt-2">
                <button
                  onClick={async () => {
                    await eliminarConsentimiento(confirmarId);
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