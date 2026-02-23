import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  PlusIcon,
  CalendarIcon,
  UsersIcon,
  TrashIcon,
  MagnifyingGlassIcon,
  ArrowPathIcon,
  LockClosedIcon
} from "@heroicons/react/24/outline";
import { apiRequest } from "../config/api";
import Swal from "sweetalert2";

export default function ListaSesionesMensuales() {
  const [vista, setVista] = useState("resumen"); // "resumen" o "detalle"
  const [resumenMeses, setResumenMeses] = useState([]);
  const [mesSeleccionado, setMesSeleccionado] = useState(null); // formato YYYY-MM

  const [sesiones, setSesiones] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [cargando, setCargando] = useState(true);

  // Paginación
  const [pagina, setPagina] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const limite = 12;

  const navigate = useNavigate();

  const mesesNom = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

  const cargarResumen = async (page = 1) => {
    setCargando(true);
    try {
      const data = await apiRequest(`/sesiones-mensuales/resumen?page=${page}&limit=${limite}`);
      setResumenMeses(data.data || []);
      setTotalPaginas(data.totalPages || 1);
      setTotalItems(data.total || 0);
      setPagina(data.page || 1);
    } catch (error) {
      console.error('Error al cargar resumen:', error);
    }
    setCargando(false);
  };

  const cargarSesiones = async (page = 1, mes = null) => {
    setCargando(true);
    try {
      const params = new URLSearchParams();

      if (mes) {
        // Filtro exacto por el mes seleccionado (YYYY-MM)
        // Usamos una lógica más robusta para el rango de fechas
        const [anio, mesStr] = mes.split("-");
        const ultimoDia = new Date(anio, mesStr, 0).getDate();
        params.append("fechaInicio", `${mes}-01`);
        params.append("fechaFin", `${mes}-${ultimoDia}`);
      } else {
        if (fechaInicio) params.append("fechaInicio", fechaInicio);
        if (fechaFin) params.append("fechaFin", fechaFin);
      }

      if (busqueda) params.append("busqueda", busqueda);
      params.append("page", page);
      params.append("limit", limite);

      const response = await apiRequest(`/sesiones-mensuales?${params.toString()}`);
      setSesiones(response.data || []);
      setTotalPaginas(response.totalPages || 1);
      setTotalItems(response.total || 0);
      setPagina(response.page || 1);
    } catch (error) {
      console.error('Error al cargar sesiones mensuales:', error);
      setSesiones([]);
    }
    setCargando(false);
  };

  useEffect(() => {
    if (vista === "resumen") {
      cargarResumen(pagina);
    } else {
      cargarSesiones(pagina, mesSeleccionado);
    }
  }, [vista, pagina, mesSeleccionado]);

  const eliminarSesion = async (id, e) => {
    e.stopPropagation();
    e.preventDefault();

    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: "Se eliminará permanentemente este reporte de sesión.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      try {
        await apiRequest(`/sesiones-mensuales/${id}`, { method: "DELETE" });
        Swal.fire('¡Eliminado!', 'La sesión ha sido eliminada.', 'success');

        if (sesiones.length === 1 && pagina > 1) {
          setPagina(prev => prev - 1);
        } else {
          cargarSesiones(pagina, mesSeleccionado);
        }
      } catch (error) {
        console.error("Error al eliminar sesión:", error);
        Swal.fire('Error', 'No se pudo eliminar la sesión', 'error');
      }
    }
  };

  const handleBuscar = () => {
    setVista("detalle");
    setMesSeleccionado(null);
    setPagina(1);
    cargarSesiones(1, null);
  };

  const handleLimpiar = () => {
    setBusqueda("");
    setFechaInicio("");
    setFechaFin("");
    setMesSeleccionado(null);
    setPagina(1);
    setVista("resumen");
  };

  const formatearMesAnio = (idMes) => {
    const [anio, mes] = idMes.split("-");
    return `${mesesNom[parseInt(mes) - 1]} ${anio}`;
  };

  const cambiarVistaResumen = () => {
    setVista("resumen");
    setMesSeleccionado(null);
    setPagina(1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 py-10 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Encabezado */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4 bg-white p-6 rounded-3xl shadow-lg border border-purple-100">
          <div>
            <h2 className="text-3xl font-extrabold text-purple-700">Sesiones Mensuales</h2>
            <p className="text-gray-500 font-medium">Gestión de asistencia y reportes de actividades</p>
          </div>
          <div className="flex gap-2">
            {vista === "detalle" && (
              <button
                onClick={cambiarVistaResumen}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-3 px-6 rounded-2xl transition flex items-center gap-2"
              >
                <ArrowPathIcon className="h-5 w-5" /> Ver Meses
              </button>
            )}
            <Link
              to="/sesiones-mensuales/nueva"
              className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-8 rounded-2xl shadow-lg transition flex items-center gap-2 transform hover:scale-105 active:scale-95"
            >
              <PlusIcon className="h-6 w-6" /> Nueva Sesión
            </Link>
          </div>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-3xl shadow-md p-6 mb-8 border border-indigo-50">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-gray-700 mb-2">Buscar Actividad</label>
              <div className="relative">
                <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Ej: Estimulación..."
                  value={busqueda}
                  onChange={e => setBusqueda(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-indigo-100 rounded-2xl focus:ring-2 focus:ring-indigo-100 outline-none transition bg-indigo-50/30"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Desde</label>
              <input
                type="date"
                value={fechaInicio}
                onChange={e => setFechaInicio(e.target.value)}
                className="w-full px-4 py-3 border border-indigo-100 rounded-2xl focus:ring-2 focus:ring-indigo-100 outline-none transition bg-indigo-50/30"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleBuscar}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-2xl shadow transition flex items-center justify-center gap-1"
              >
                Buscar
              </button>
              <button
                onClick={handleLimpiar}
                className="bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold py-3 px-4 rounded-2xl transition flex items-center justify-center"
                title="Limpiar filtros"
              >
                <ArrowPathIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Vista de Resumen (Tarjetas de Meses) */}
        {vista === "resumen" && !cargando && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {resumenMeses.length === 0 ? (
              <div className="col-span-full bg-white text-center py-20 rounded-3xl shadow-md border border-gray-100">
                <CalendarIcon className="h-10 w-10 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-600">No hay datos registrados</h3>
              </div>
            ) : (
              resumenMeses.map((mes) => (
                <div
                  key={mes._id}
                  onClick={() => {
                    setMesSeleccionado(mes._id);
                    setVista("detalle");
                    setPagina(1);
                  }}
                  className="bg-white rounded-3xl p-6 shadow-sm border border-indigo-50 hover:shadow-xl hover:scale-105 transition-all cursor-pointer group"
                >
                  <div className="text-purple-600 font-bold text-xl mb-4 flex justify-between items-center">
                    {formatearMesAnio(mes._id)}
                    <CalendarIcon className="h-6 w-6 opacity-40 group-hover:opacity-100 transition" />
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-gray-600">
                      <span>Total Sesiones:</span>
                      <span className="font-bold text-indigo-700 bg-indigo-50 px-3 py-1 rounded-lg">{mes.totalSesiones}</span>
                    </div>
                    <div className="flex justify-between items-center text-gray-600">
                      <span>Total Asistencias:</span>
                      <span className="font-bold text-purple-700 bg-purple-50 px-3 py-1 rounded-lg">{mes.totalAsistencias}</span>
                    </div>
                  </div>
                  <div className="mt-6 text-indigo-600 font-bold text-sm flex items-center gap-2 group-hover:gap-4 transition-all">
                    Ver detalles &rarr;
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Vista Detallada (Sesiones) */}
        {vista === "detalle" && (
          <div>
            <div className="flex items-center gap-4 mb-6">
              <h3 className="text-2xl font-bold text-indigo-800 bg-white px-6 py-2 rounded-2xl shadow-sm border border-indigo-50">
                {mesSeleccionado ? formatearMesAnio(mesSeleccionado) : "Resultados de búsqueda"}
              </h3>
              <div className="h-px bg-indigo-100 flex-1"></div>
            </div>

            {cargando ? (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="animate-spin rounded-full h-14 w-14 border-t-4 border-purple-600 border-solid"></div>
              </div>
            ) : sesiones.length === 0 ? (
              <div className="bg-white text-center py-20 rounded-3xl shadow-md border border-gray-100">
                <p className="text-gray-500">No se encontraron sesiones para este periodo.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sesiones.map(sesion => (
                  <Link
                    key={sesion._id}
                    to={`/sesiones-mensuales/${sesion._id}`}
                    className="group bg-white rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 border border-purple-50 overflow-hidden flex flex-col"
                  >
                    <div className="p-6 flex-1">
                      <div className="flex justify-between items-start mb-4">
                        <div className="bg-purple-100 p-3 rounded-2xl">
                          <CalendarIcon className="h-6 w-6 text-purple-600" />
                        </div>
                        <button
                          onClick={(e) => eliminarSesion(sesion._id, e)}
                          className="text-gray-300 hover:text-red-500 p-1"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-xl font-bold text-gray-800 truncate">{sesion.nombre}</h3>
                        {sesion.bloqueada && (
                          <LockClosedIcon className="h-5 w-5 text-green-600" title="Registro Protegido" />
                        )}
                      </div>
                      <div className="text-gray-500 text-sm mb-4">{sesion.fecha}</div>
                      <p className="text-gray-600 text-sm line-clamp-2 italic">
                        {sesion.descripcionGeneral || "Sin descripción..."}
                      </p>
                    </div>
                    <div className="bg-purple-50 px-6 py-4 flex items-center justify-between border-t border-purple-100">
                      <div className="flex items-center gap-2 text-purple-700 font-bold">
                        <UsersIcon className="h-5 w-5" />
                        <span>{sesion.asistentes?.length || 0} Niños</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Paginación (visible para ambas vistas si hay más de una página) */}
        {!cargando && totalPaginas > 1 && (
          <div className="mt-12 flex justify-center">
            <div className="flex items-center gap-2 bg-white p-2 rounded-2xl shadow-sm border border-purple-50">
              <button
                onClick={() => setPagina(prev => Math.max(prev - 1, 1))}
                disabled={pagina === 1}
                className="p-2 disabled:opacity-30 hover:bg-purple-50 rounded-xl transition"
              >
                &larr;
              </button>

              <div className="flex gap-1">
                {[...Array(totalPaginas)].map((_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => setPagina(i + 1)}
                    className={`w-10 h-10 rounded-xl font-bold transition ${pagina === i + 1
                      ? 'bg-purple-600 text-white shadow-md'
                      : 'text-purple-600 hover:bg-purple-50'
                      }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setPagina(prev => Math.min(prev + 1, totalPaginas))}
                disabled={pagina === totalPaginas}
                className="p-2 disabled:opacity-30 hover:bg-purple-50 rounded-xl transition"
              >
                &rarr;
              </button>
            </div>
          </div>
        )}

        {cargando && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin rounded-full h-14 w-14 border-t-4 border-purple-600 border-solid"></div>
          </div>
        )}
      </div>
    </div>
  );
}
