import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiRequest } from "../config/api";

export default function ListaClases() {
  const [clases, setClases] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [confirmarId, setConfirmarId] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    setCargando(true);
    apiRequest("/clases")
      .then(setClases)
      .finally(() => setCargando(false));
  }, []);

  const eliminarClase = async (id) => {
    await apiRequest(`/clases/${id}`, {
      method: "DELETE",
    });
    setClases(clases.filter(c => c._id !== id));
    setMensaje("Sesión eliminada correctamente");
    setTimeout(() => setMensaje(""), 4000);
  };

  const clasesFiltradas = clases.filter(clase =>
    clase.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-pink-100 to-green-100 py-10 px-2">
      <div className="max-w-4xl mx-auto bg-white bg-opacity-90 rounded-3xl shadow-2xl p-8 border border-indigo-100">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <h2 className="text-3xl font-extrabold text-indigo-700 drop-shadow text-center md:text-left">Todas las Sesiones</h2>
          <Link
            to="/clases/nueva"
            className="bg-green-200 hover:bg-green-300 text-green-800 font-bold py-2 px-6 rounded-xl shadow transition transform hover:scale-105"
          >
            + Nueva Sesión
          </Link>
        </div>
        <input
          type="text"
          placeholder="Buscar por nombre..."
          value={busqueda}
          onChange={e => setBusqueda(e.target.value)}
          className="border border-indigo-300 focus:border-indigo-500 focus:ring-indigo-400 rounded-xl px-4 py-2 mb-8 w-full transition outline-none shadow-sm bg-indigo-50"
        />
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {cargando ? (
            <div className="col-span-2 flex flex-col items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-indigo-600 border-solid"></div>
              <span className="mt-4 text-indigo-700 font-bold">Cargando...</span>
            </div>
          ) : clasesFiltradas.length === 0 ? (
            <div className="col-span-2 text-center text-gray-500">No se encontraron Sesiones.</div>
          ) : null}
          {clasesFiltradas.map(clase => (
            <div
              key={clase._id}
              className="relative block bg-gradient-to-br from-indigo-50 via-pink-50 to-green-50 border border-indigo-200 rounded-2xl shadow hover:shadow-xl hover:border-indigo-400 transition p-6"
            >
              <Link
                to={`/clases/${clase._id}`}
                className="block"
              >
                <h3 className="text-xl font-bold text-indigo-700 mb-2">{clase.nombre}</h3>
                <div className="text-sm text-gray-600 mb-1">
                  <span className="font-semibold">Fecha:</span> {clase.fecha}
                </div>
                <div className="text-gray-700">{clase.descripcion}</div>
              </Link>
              <button
                onClick={() => setConfirmarId(clase._id)}
                className="absolute top-2 right-2 bg-pink-200 hover:bg-pink-300 text-pink-800 rounded-full p-2 text-xs font-bold flex items-center justify-center shadow"
                title="Eliminar sesión"
              >
                {/* Ícono de cesto de basura */}
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7V4a1 1 0 011-1h4a1 1 0 011 1v3m-7 0h10" />
                </svg>
              </button>
            </div>
          ))}
        </div>
        {confirmarId && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-lg p-8 max-w-sm w-full text-center border border-pink-200">
              <h3 className="text-lg font-bold mb-4 text-pink-700">¿Eliminar sesión?</h3>
              <p className="mb-6 text-gray-700">Esta acción no se puede deshacer.</p>
              <div className="flex justify-center gap-4">
                <button
                  onClick={async () => {
                    await eliminarClase(confirmarId);
                    setConfirmarId(null);
                  }}
                  className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded font-bold shadow"
                >
                  Sí, eliminar
                </button>
                <button
                  onClick={() => setConfirmarId(null)}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded font-bold shadow"
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