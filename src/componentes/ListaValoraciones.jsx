import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import { apiRequest } from "../config/api";

const ListaValoraciones = () => {
  const [valoraciones, setValoraciones] = useState([]);
  const [error, setError] = useState(null);
  const [busqueda, setBusqueda] = useState("");
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [cargando, setCargando] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [confirmarId, setConfirmarId] = useState(null);

  const [paginacion, setPaginacion] = useState({
    pagina: 1,
    limite: 15,
    total: 0,
    totalPaginas: 0,
    tieneSiguiente: false,
    tieneAnterior: false
  });
 

  const buscarValoraciones = async (paginaActual = 1) => {
    setCargando(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (busqueda) {
        params.append("busqueda", busqueda);
      }
      if (fechaInicio) params.append("fechaInicio", fechaInicio);
      if (fechaFin) params.append("fechaFin", fechaFin);
      params.append("pagina", paginaActual.toString());
      params.append("limite", "15");

      console.log('🔍 Buscando valoraciones con parámetros:', {
        busqueda,
        fechaInicio,
        fechaFin,
        pagina: paginaActual,
        url: `/valoraciones?${params.toString()}`
      });

      const response = await apiRequest(`/valoraciones?${params.toString()}`);
      console.log('📋 Respuesta del servidor:', response);
      
      setValoraciones(response.valoraciones || []);
      setPaginacion(response.paginacion || {
        pagina: 1,
        limite: 15,
        total: 0,
        totalPaginas: 0,
        tieneSiguiente: false,
        tieneAnterior: false
      });
    } catch (err) {
      console.error('❌ Error buscando valoraciones:', err);
      setError('No se pudieron cargar las valoraciones.');
      setValoraciones([]);
    }
    setCargando(false);
  };

  const eliminarValoracion = async (id) => {
    try {
      console.log(`Eliminando valoración ${id}...`);
      const resultado = await apiRequest(`/valoraciones/${id}`, {
        method: "DELETE",
      });
      
      console.log('Resultado de eliminación:', resultado);
      
      setValoraciones(valoraciones.filter(v => v._id !== id));
      
      // Mostrar mensaje con información de imágenes eliminadas
      const mensajeCompleto = resultado.imagenesEliminadas > 0 
        ? `Valoración eliminada correctamente (${resultado.imagenesEliminadas} imágenes eliminadas de S3)`
        : "Valoración eliminada correctamente";
        
      setMensaje(mensajeCompleto);
      setTimeout(() => setMensaje(""), 6000);
    } catch (error) {
      console.error('Error eliminando valoración:', error);
      setMensaje("No se pudo eliminar la valoración");
      setTimeout(() => setMensaje(""), 4000);
    }
  };

  // Cargar todas al inicio
  useEffect(() => {
    buscarValoraciones(1);
    // eslint-disable-next-line
  }, []);

  const cambiarPagina = (nuevaPagina) => {
    buscarValoraciones(nuevaPagina);
  };

  if (error) return <p className="text-red-500 text-center">{error}</p>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-pink-100 to-green-100 py-10 px-2">
      <div className="max-w-2xl w-full bg-white bg-opacity-90 p-8 rounded-3xl shadow-2xl border border-indigo-100">
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
        <h2 className="text-2xl font-bold text-indigo-700 mb-6 text-center">Lista de Valoraciones</h2>
        <div className="bg-indigo-50 rounded-xl p-4 mb-6">
          <h4 className="font-semibold text-indigo-700 mb-3">Filtros de búsqueda</h4>
          <div className="flex flex-col gap-3">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Buscar</label>
                <input
                  type="text"
                  placeholder="Buscar por nombre o documento"
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
                 onClick={() => buscarValoraciones(1)}
                 className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-xl shadow transition"
               >
                 Buscar
               </button>
               <button
                 onClick={() => {
                   setBusqueda("");
                   setFechaInicio("");
                   setFechaFin("");
                   
                   setTimeout(() => buscarValoraciones(1), 100);
                 }}
                 className="bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-xl transition"
               >
                 Limpiar
               </button>
             </div>
          </div>
        </div>
        {cargando ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-indigo-600 border-solid"></div>
            <span className="mt-4 text-indigo-700 font-bold">Cargando...</span>
          </div>
        ) : valoraciones.length === 0 ? (
          <p className="text-gray-500 text-center">No hay valoraciones registradas.</p>
        ) : (
          <>
                         <div className="mb-4 text-center">
               <p className="text-sm text-indigo-600 bg-indigo-50 border border-indigo-200 rounded-lg p-2 inline-block">
                 📋 Página {paginacion.pagina} de {paginacion.totalPaginas} - Mostrando {valoraciones.length} de {paginacion.total} valoraciones
               </p>
             </div>
                         <div className="space-y-4">
             {valoraciones.map((valoracion) => (
                <div
                  key={valoracion._id}
                  className="border border-indigo-200 rounded-2xl p-5 flex flex-col md:flex-row md:items-center md:justify-between hover:shadow-xl transition bg-indigo-50"
                >
                  <div>
                    <p className="text-indigo-500 text-sm">
                      Documento:{" "}
                      <span className="font-medium">
                        {valoracion.paciente?.registroCivil || valoracion.registroCivil || "-"}
                      </span>
                    </p>
                    <p className="font-semibold text-lg text-indigo-800">
                      {valoracion.paciente?.nombres || valoracion.nombres || "Sin nombre"}
                    </p>
                    <p className="text-indigo-500 text-sm">
                      Mamá: <span className="font-medium">
                        {valoracion.paciente?.nombreMadre || valoracion.madreNombre || "-"}
                      </span>
                    </p>
                    <p className="text-indigo-500 text-sm">
                      Fecha: <span className="font-medium">{valoracion.fecha}</span>
                    </p>
                  </div>
                  <div className="flex gap-2 mt-3 md:mt-0">
                    <Link
                      to={`/valoraciones/${valoracion._id}`}
                      className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-xl shadow transition"
                    >
                      Ver detalle
                    </Link>
                    <button
                      onClick={() => setConfirmarId(valoracion._id)}
                      className="bg-pink-200 hover:bg-pink-300 text-pink-800 font-bold py-2 px-4 rounded-xl shadow transition"
                      title="Eliminar valoración"
                    >
                      Eliminar
                    </button>
                  </div>
                                 </div>
               ))}
                         </div>
             
             {/* Controles de paginación */}
             {paginacion.totalPaginas > 1 && (
               <div className="mt-6 flex justify-center items-center gap-2">
                 <button
                   onClick={() => cambiarPagina(paginacion.pagina - 1)}
                   disabled={!paginacion.tieneAnterior}
                   className={`px-3 py-2 rounded-lg font-medium transition ${
                     paginacion.tieneAnterior
                       ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
                       : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                   }`}
                 >
                   ← Anterior
                 </button>
                 
                 <span className="px-4 py-2 text-sm text-gray-600">
                   Página {paginacion.pagina} de {paginacion.totalPaginas}
                 </span>
                 
                 <button
                   onClick={() => cambiarPagina(paginacion.pagina + 1)}
                   disabled={!paginacion.tieneSiguiente}
                   className={`px-3 py-2 rounded-lg font-medium transition ${
                     paginacion.tieneSiguiente
                       ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
                       : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                   }`}
                 >
                   Siguiente →
                 </button>
               </div>
             )}
           </>
         )}
        {confirmarId && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-40">
            <div className="bg-white border border-pink-200 text-pink-800 px-6 py-6 rounded-2xl shadow-lg flex flex-col items-center gap-4 max-w-md w-full">
              <div className="text-center">
                <h3 className="font-bold text-lg mb-2">¿Seguro que deseas eliminar esta valoración?</h3>
                <p className="text-sm text-gray-600">
                  Esta acción eliminará permanentemente la valoración y todas las imágenes asociadas de S3.
                  <br />
                  <strong>Esta acción no se puede deshacer.</strong>
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={async () => {
                    await eliminarValoracion(confirmarId);
                    setConfirmarId(null);
                  }}
                  className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-xl font-bold shadow transition"
                >
                  Sí, eliminar todo
                </button>
                <button
                  onClick={() => setConfirmarId(null)}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-xl font-bold shadow transition"
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
};

export default ListaValoraciones;
