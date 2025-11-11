import React, { useEffect, useState } from "react";
import { apiRequest } from "../../config/api";

import { Link } from "react-router-dom";
import Spinner from "../ui/Spinner";

export default function ListaValoracionesPisoPelvico() {
  const [valoraciones, setValoraciones] = useState(null);
  const [busqueda, setBusqueda] = useState("");
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [cargando, setCargando] = useState(false);
  const [confirmarId, setConfirmarId] = useState(null);
  const [mensaje, setMensaje] = useState("");
  const [pacientes, setPacientes] = useState({}); // <--- Nuevo estado

  const [paginacion, setPaginacion] = useState({
    pagina: 1,
    limite: 15,
    total: 0,
    totalPaginas: 0,
    tieneSiguiente: false,
    tieneAnterior: false
  });

  // Función helper para obtener el nombre del paciente de forma segura
  const obtenerNombrePaciente = (paciente) => {
    if (!paciente) return "Sin referencia";
    
    // Si es un objeto poblado
    if (typeof paciente === 'object' && paciente !== null) {
      // Intentar obtener nombres + apellidos
      if (paciente.nombres) {
        const apellidos = paciente.apellidos || "";
        return `${paciente.nombres} ${apellidos}`.trim();
      }
      // Intentar obtener nombre
      if (paciente.nombre) {
        return String(paciente.nombre);
      }
      // Si es un objeto pero sin nombres útiles, intentar obtener el ID
      if (paciente._id) {
        const nombreCache = pacientes[paciente._id];
        return nombreCache || `ID: ${paciente._id}`;
      }
      // Último recurso: convertir a string
      return "Paciente sin nombre";
    }
    
    // Si es un string (ID), usar el cache de pacientes
    if (typeof paciente === 'string') {
      const nombreCache = pacientes[paciente];
      return nombreCache || `ID: ${paciente}`;
    }
    
    // Para cualquier otro tipo, convertir a string de forma segura
    return "Sin referencia";
  };

  // Función helper para obtener la fecha de forma segura
  const obtenerFechaSegura = (valoracion) => {
    if (valoracion.fecha) return String(valoracion.fecha);
    if (valoracion.fechaValoracion) return String(valoracion.fechaValoracion);
    if (valoracion.createdAt) return String(valoracion.createdAt).slice(0, 10);
    return "-";
  };

  // Función helper para obtener el motivo de consulta de forma segura
  const obtenerMotivoConsultaSeguro = (motivoConsulta) => {
    if (!motivoConsulta) return "Sin motivo especificado";
    
    const motivo = String(motivoConsulta);
    return motivo.length > 50 ? `${motivo.substring(0, 50)}...` : motivo;
  };

  // Función de validación para evitar renderizar objetos
  const validarDatosRenderizado = (valoracion) => {
    // Validar que todos los campos que se van a renderizar sean primitivos
    const camposParaRenderizar = {
      paciente: obtenerNombrePaciente(valoracion.paciente),
      fecha: obtenerFechaSegura(valoracion),
      motivoConsulta: obtenerMotivoConsultaSeguro(valoracion.motivoConsulta)
    };

    // Asegurar que todos los valores sean strings
    Object.keys(camposParaRenderizar).forEach(key => {
      if (typeof camposParaRenderizar[key] === 'object') {
        console.error(`⚠️ Campo ${key} es un objeto:`, camposParaRenderizar[key]);
        camposParaRenderizar[key] = `Error: objeto detectado (${key})`;
      }
    });

    return camposParaRenderizar;
  };

  const buscarValoraciones = async (paginaActual = 1) => {
    setCargando(true);
    try {
      const params = new URLSearchParams();
      if (busqueda) params.append("busqueda", busqueda);
      if (fechaInicio) params.append("fechaInicio", fechaInicio);
      if (fechaFin) params.append("fechaFin", fechaFin);
      params.append("pagina", paginaActual.toString());
      params.append("limite", "15");

      const response = await apiRequest(`/valoracion-piso-pelvico?${params.toString()}`);
      setValoraciones(response.valoraciones || []);
      setPaginacion(response.paginacion || {
        pagina: 1,
        limite: 15,
        total: 0,
        totalPaginas: 0,
        tieneSiguiente: false,
        tieneAnterior: false
      });
    } catch (error) {
      console.error('Error al buscar valoraciones:', error);
      setValoraciones([]);
    }
    setCargando(false);

    // Buscar nombres de pacientes adultos (solo si no están poblados)
    const ids = Array.isArray(valoraciones)
      ? [...new Set(valoraciones
          .map(v => v.paciente)
          .filter(p => p && typeof p === 'string') // Solo IDs string, no objetos poblados
        )]
      : [];
    const nuevosPacientes = {};
    await Promise.all(
      ids.map(async id => {
        if (!pacientes[id]) {
          try {
            const paciente = await apiRequest(`/pacientes-adultos/${id}`);
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
    buscarValoraciones(1);
    // eslint-disable-next-line
  }, []);

  const cambiarPagina = (nuevaPagina) => {
    buscarValoraciones(nuevaPagina);
  };



  const eliminarValoracion = async (id) => {
    try {
      console.log('Intentando eliminar valoración con ID:', id);
      
      // Verificar que el ID esté en la lista actual
      const valoracionExiste = valoraciones.find(v => v._id === id);
      if (!valoracionExiste) {
        setMensaje("La valoración no existe en la lista actual. Actualizando lista...");
        buscarValoraciones(); // Refrescar la lista
        setTimeout(() => setMensaje(""), 4000);
        return;
      }
      
      // Eliminar la valoración del backend (esto también debería eliminar las imágenes S3)
      const resultado = await apiRequest(`/valoracion-piso-pelvico/${id}`, {
        method: "DELETE",
      });
      
      // Actualizar la lista local inmediatamente
      setValoraciones(valoraciones.filter(v => v._id !== id));
      
      // Mostrar mensaje con información de imágenes eliminadas
      const mensajeCompleto = resultado.imagenesEliminadas && resultado.imagenesEliminadas > 0
        ? `Valoración eliminada correctamente. ${resultado.imagenesEliminadas} imagen(es) eliminada(s) de S3.`
        : "Valoración eliminada correctamente";
        
      setMensaje(mensajeCompleto);
      setTimeout(() => setMensaje(""), 4000);
      
      // Refrescar la lista desde el servidor para asegurar sincronización
      setTimeout(() => {
        buscarValoraciones();
      }, 1000);
      
    } catch (error) {
      console.error('Error al eliminar valoración:', error);
      let mensajeError = "No se pudo eliminar la valoración";
      
      if (error.message.includes('404')) {
        mensajeError = "La valoración no existe o ya fue eliminada. Actualizando lista...";
        // Refrescar la lista cuando hay un 404
        setTimeout(() => {
          buscarValoraciones();
        }, 1000);
      } else if (error.message.includes('500')) {
        mensajeError = "Error del servidor al eliminar la valoración";
      }
      
      setMensaje(mensajeError);
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
        
        <div className="mb-4 text-center">
          <p className="text-sm text-gray-600 bg-blue-50 border border-blue-200 rounded-lg p-3 inline-block">
            💡 <strong>Nota:</strong> Las valoraciones de piso pélvico se crean desde la ficha de cada paciente adulto.
          </p>
        </div>
        
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
        <div className="overflow-x-auto rounded shadow">
          <table className="min-w-full text-base bg-white rounded-xl overflow-hidden">
            <thead>
              <tr className="bg-indigo-600 text-white">
                <th className="px-4 py-3 text-left">Paciente</th>
                <th className="px-4 py-3 text-left">Fecha</th>
                <th className="px-4 py-3 text-left">Motivo Consulta</th>
                <th className="px-4 py-3 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {cargando ? (
                <tr>
                  <td colSpan={4} className="px-4 py-6 text-center">
                    <Spinner />
                  </td>
                </tr>
                             ) : lista.length === 0 ? (
                 <tr>
                   <td colSpan={4} className="px-4 py-6 text-center text-gray-500">
                     No hay valoraciones registradas.
                   </td>
                 </tr>
               ) : (
                 <>
                   <tr>
                     <td colSpan={4} className="px-4 py-3 text-center">
                                            <p className="text-sm text-indigo-600 bg-indigo-50 border border-indigo-200 rounded-lg p-2 inline-block">
                       📋 Página {paginacion.pagina} de {paginacion.totalPaginas} - Mostrando {lista.length} de {paginacion.total} valoraciones
                     </p>
                     </td>
                   </tr>
                                       {lista.map((v, idx) => {
                  // Validar datos antes de renderizar
                  const { paciente, fecha, motivoConsulta } = validarDatosRenderizado(v);
                  
                  return (
                    <tr
                      key={v._id}
                      className={idx % 2 === 0 ? "bg-indigo-50 hover:bg-indigo-100" : "bg-white hover:bg-indigo-50"}
                    >
                      <td className="px-4 py-2 border-b border-indigo-100 font-medium">
                        {paciente}
                      </td>
                      <td className="px-4 py-2 border-b border-indigo-100">
                        {fecha}
                      </td>
                      <td className="px-4 py-2 border-b border-indigo-100">
                        <span className="text-sm text-gray-700">
                          {motivoConsulta}
                        </span>
                      </td>
                      <td className="px-4 py-2 border-b border-indigo-100 text-center">
                        <Link
                          to={`/valoraciones-piso-pelvico/${v._id}`}
                          className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded-xl transition font-semibold shadow mr-1 text-sm"
                        >
                          Ver
                        </Link>
                        <Link
                          to={`/valoraciones-piso-pelvico/${v._id}/editar`}
                          className="inline-block bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-xl transition font-semibold shadow mr-1 text-sm"
                        >
                          Editar
                        </Link>
                        <button
                          onClick={() => setConfirmarId(v._id)}
                          className="inline-block bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-xl font-semibold shadow transition text-sm"
                          title="Eliminar Valoración"
                        >
                          Eliminar
                        </button>
                                           </td>
                   </tr>
                 );
               })}
               </>
             )}
            </tbody>
                     </table>
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