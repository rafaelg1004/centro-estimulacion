import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiRequest } from "../config/api";

export default function ListaClases() {
  const [clases, setClases] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [confirmarId, setConfirmarId] = useState(null);
  const [cargando, setCargando] = useState(true);
  
  // Paginación
  const [pagina, setPagina] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const limite = 10;

  const buscarClases = async (page = 1) => {
    setCargando(true);
    try {
      const params = new URLSearchParams();
      if (fechaInicio) params.append("fechaInicio", fechaInicio);
      if (fechaFin) params.append("fechaFin", fechaFin);
      if (busqueda) params.append("busqueda", busqueda);
      params.append("page", page);
      params.append("limit", limite);

      const response = await apiRequest(`/clases?${params.toString()}`);
      // La respuesta ahora es un objeto { data, total, page, totalPages }
      setClases(response.data || []);
      setTotalPaginas(response.totalPages || 1);
      setTotalItems(response.total || 0);
      setPagina(response.page || 1);
    } catch (error) {
      console.error('Error al cargar clases:', error);
      setClases([]);
    }
    setCargando(false);
  };

  useEffect(() => {
    buscarClases(pagina);
    // eslint-disable-next-line
  }, [pagina]);

  const eliminarClase = async (id) => {
    try {
      await apiRequest(`/clases/${id}`, {
        method: "DELETE",
      });
      setClases(clases.filter(c => c._id !== id));
      setMensaje("Sesión eliminada correctamente");
      setTimeout(() => setMensaje(""), 4000);
      
      // Si la página se queda vacía, volver a la anterior si existe
      if (clases.length === 1 && pagina > 1) {
        setPagina(prev => prev - 1);
      } else {
        buscarClases(pagina);
      }
    } catch (error) {
      console.error("Error al eliminar clase:", error);
    }
  };

  // El filtrado ya se hace en el servidor para mayor eficiencia
  const clasesAMostrar = clases;

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
        <div className="bg-indigo-50 rounded-xl p-4 mb-6">
          <h4 className="font-semibold text-indigo-700 mb-3">Filtros de búsqueda</h4>
          <div className="flex flex-col gap-3">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Buscar</label>
                <input
                  type="text"
                  placeholder="Buscar por nombre..."
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
                onClick={() => {
                  setPagina(1);
                  buscarClases(1);
                }}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-xl shadow transition"
              >
                Buscar
              </button>
              <button
                onClick={() => {
                  setBusqueda("");
                  setFechaInicio("");
                  setFechaFin("");
                  setPagina(1);
                  setTimeout(() => buscarClases(1), 100);
                }}
                className="bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-xl transition"
              >
                Limpiar
              </button>
            </div>
          </div>
        </div>
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
          ) : clasesAMostrar.length === 0 ? (
            <div className="col-span-2 text-center text-gray-500 py-12">
              <p className="text-xl">No se encontraron Sesiones.</p>
              {busqueda && <p className="mt-2">Intenta con otros términos de búsqueda.</p>}
            </div>
          ) : null}
          {!cargando && clasesAMostrar.map(clase => {
            // Contar niños sin paquete
            const ninosSinPaquete = clase.ninos ? clase.ninos.filter(n => !n.numeroFactura || n.numeroFactura.trim() === '').length : 0;
            
            return (
              <div
                key={clase._id}
                className={`relative block bg-gradient-to-br from-indigo-50 via-pink-50 to-green-50 border rounded-2xl shadow hover:shadow-xl hover:border-indigo-400 transition p-6 ${
                  ninosSinPaquete > 0 ? 'border-red-300 bg-gradient-to-br from-red-50 via-pink-50 to-orange-50' : 'border-indigo-200'
                }`}
              >
                <Link
                  to={`/clases/${clase._id}`}
                  className="block"
                >
                  <h3 className="text-xl font-bold text-indigo-700 mb-2">{clase.nombre}</h3>
                  {ninosSinPaquete > 0 && (
                    <div className="mb-2">
                      <span className="bg-red-100 text-red-700 text-sm font-bold px-3 py-1 rounded-full border border-red-300 inline-block">
                        ⚠️ {ninosSinPaquete} sin paquete
                      </span>
                    </div>
                  )}
                  <div className="text-sm text-gray-600 mb-1">
                    <span className="font-semibold">Fecha:</span> {clase.fecha}
                  </div>
                  <div className="text-gray-700">{clase.descripcion}</div>
                  {clase.ninos && clase.ninos.length > 0 && (
                    <div className="text-sm text-gray-600 mt-2">
                      <span className="font-semibold">Inscritos:</span> {clase.ninos.length} niño(s)
                    </div>
                  )}
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
            );
          })}
        </div>

        {/* Paginación */}
        {!cargando && totalPaginas > 1 && (
          <div className="mt-10 flex flex-col items-center gap-4">
            <div className="text-sm text-gray-600">
              Mostrando <span className="font-semibold">{clasesAMostrar.length}</span> de <span className="font-semibold">{totalItems}</span> sesiones
            </div>
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={() => setPagina(prev => Math.max(prev - 1, 1))}
                disabled={pagina === 1}
                className={`px-4 py-2 rounded-xl font-bold transition ${
                  pagina === 1 
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                    : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200 shadow-sm'
                }`}
              >
                &larr; Anterior
              </button>
              
              <div className="flex items-center gap-1">
                {[...Array(totalPaginas)].map((_, i) => {
                  const p = i + 1;
                  // Mostrar solo algunas páginas si hay demasiadas
                  if (
                    totalPaginas <= 7 || 
                    p === 1 || 
                    p === totalPaginas || 
                    (p >= pagina - 1 && p <= pagina + 1)
                  ) {
                    return (
                      <button
                        key={p}
                        onClick={() => setPagina(p)}
                        className={`w-10 h-10 rounded-xl font-bold transition ${
                          pagina === p
                            ? 'bg-indigo-600 text-white shadow-md scale-110'
                            : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100'
                        }`}
                      >
                        {p}
                      </button>
                    );
                  } else if (
                    (p === 2 && pagina > 3) || 
                    (p === totalPaginas - 1 && pagina < totalPaginas - 2)
                  ) {
                    return <span key={p} className="px-1 text-gray-400">...</span>;
                  }
                  return null;
                })}
              </div>

              <button
                onClick={() => setPagina(prev => Math.min(prev + 1, totalPaginas))}
                disabled={pagina === totalPaginas}
                className={`px-4 py-2 rounded-xl font-bold transition ${
                  pagina === totalPaginas 
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                    : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200 shadow-sm'
                }`}
              >
                Siguiente &rarr;
              </button>
            </div>
          </div>
        )}
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