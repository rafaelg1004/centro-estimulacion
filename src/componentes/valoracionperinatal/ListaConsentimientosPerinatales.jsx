import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Spinner from "../ui/Spinner";

export default function ListaConsentimientosPerinatales() {
  const [consentimientos, setConsentimientos] = useState(null);
  const [busqueda, setBusqueda] = useState("");
  const [cargando, setCargando] = useState(false);
  const [confirmarId, setConfirmarId] = useState(null);
  const [mensaje, setMensaje] = useState("");

  const buscarConsentimientos = async (q = "") => {
    setCargando(true);
    let url = "/api/consentimiento-perinatal";
    if (q.trim() !== "") {
      url += `/buscar?q=${encodeURIComponent(q)}`;
    }
    const res = await fetch(url);
    const data = await res.json();
    setConsentimientos(data);
    setCargando(false);
  };

  useEffect(() => {
    buscarConsentimientos();
  }, []);

  const handleInputChange = (e) => {
    setBusqueda(e.target.value);
    if (e.target.value.trim() === "") {
      buscarConsentimientos("");
    }
  };

  const handleBuscar = (e) => {
    e.preventDefault();
    buscarConsentimientos(busqueda);
  };

  const eliminarConsentimiento = async (id) => {
    try {
      // Eliminar el consentimiento del backend (esto también debería eliminar las imágenes S3)
      const res = await fetch(`/api/consentimiento-perinatal/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("No se pudo eliminar en el backend");
      
      const resultado = await res.json();
      
      setConsentimientos(consentimientos.filter(c => c._id !== id));
      
      // Mostrar mensaje con información de imágenes eliminadas
      const mensajeCompleto = resultado.imagenesEliminadas && resultado.imagenesEliminadas > 0
        ? `Consentimiento eliminado correctamente. ${resultado.imagenesEliminadas} imagen(es) eliminada(s) de S3.`
        : "Consentimiento eliminado correctamente";
        
      setMensaje(mensajeCompleto);
      setTimeout(() => setMensaje(""), 4000);
    } catch (error) {
      console.error('Error al eliminar consentimiento:', error);
      setMensaje("No se pudo eliminar el consentimiento");
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