import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../config/api";
import * as XLSX from 'xlsx';
import { 
  ArrowLeftIcon, 
  DocumentArrowDownIcon, 
  EyeIcon, 
  ChartBarIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  CreditCardIcon,
  PlayIcon,
} from "@heroicons/react/24/solid";

export default function ReportePaquetes() {
  const [paquetes, setPaquetes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [filtro, setFiltro] = useState("todos");
  const [busqueda, setBusqueda] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    cargarReportePaquetes();
  }, []);

  const cargarReportePaquetes = async () => {
    try {
      setCargando(true);
      const data = await apiRequest("/pagoPaquete/reporte");
      setPaquetes(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error al cargar reporte de paquetes:", error);
      setError("Error al cargar el reporte de paquetes");
    } finally {
      setCargando(false);
    }
  };

  const exportarAExcel = () => {
    try {
      const datosExcel = paquetesFiltrados.map(paquete => ({
        'Paciente': paquete.paciente.nombres,
        'Registro Civil': paquete.paciente.registroCivil,
        'Género': paquete.paciente.genero,
        'Edad': paquete.paciente.edad + ' meses',
        'Celular': paquete.paciente.celular,
        'N° Factura': paquete.numeroFactura,
        'Clases Pagadas': paquete.clasesPagadas,
        'Clases Usadas': paquete.clasesUsadas,
        'Clases Disponibles': paquete.clasesDisponibles,
        'Porcentaje Uso': paquete.porcentajeUso + '%',
        'Estado': paquete.estado,
        'Fecha Pago': new Date(paquete.fechaPago).toLocaleDateString('es-CO')
      }));

      const libro = XLSX.utils.book_new();
      const hoja = XLSX.utils.json_to_sheet(datosExcel);
      XLSX.utils.book_append_sheet(libro, hoja, "Reporte Paquetes");
      
      const fecha = new Date().toISOString().split('T')[0];
      const nombreArchivo = `reporte_paquetes_${fecha}.xlsx`;
      XLSX.writeFile(libro, nombreArchivo);
      
      alert(`✅ Reporte exportado exitosamente como: ${nombreArchivo}`);
    } catch (error) {
      console.error('Error al exportar a Excel:', error);
      alert('❌ Error al exportar el archivo Excel');
    }
  };

  // Filtrar paquetes según criterios
  const paquetesFiltrados = paquetes.filter(paquete => {
    const cumpleFiltro = filtro === "todos" || 
                        (filtro === "activos" && paquete.estado === "Activo") ||
                        (filtro === "agotados" && paquete.estado === "Agotado");
    
    const cumpleBusqueda = busqueda === "" || 
                          paquete.paciente.nombres.toLowerCase().includes(busqueda.toLowerCase()) ||
                          paquete.paciente.registroCivil.toLowerCase().includes(busqueda.toLowerCase()) ||
                          paquete.numeroFactura.toLowerCase().includes(busqueda.toLowerCase());
    
    return cumpleFiltro && cumpleBusqueda;
  });

  // Estadísticas
  const estadisticas = {
    total: paquetes.length,
    activos: paquetes.filter(p => p.estado === "Activo").length,
    agotados: paquetes.filter(p => p.estado === "Agotado").length,
    totalClasesPagadas: paquetes.reduce((sum, p) => sum + p.clasesPagadas, 0),
    totalClasesUsadas: paquetes.reduce((sum, p) => sum + p.clasesUsadas, 0)
  };

  if (cargando) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] bg-gradient-to-br from-indigo-100 via-pink-100 to-green-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-indigo-600 border-solid"></div>
        <span className="mt-4 text-indigo-700 font-bold">Cargando reporte...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-pink-100 to-green-100">
        <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md text-center">
          <h2 className="text-xl font-bold text-red-700 mb-2">Error</h2>
          <p className="text-gray-600">{error}</p>
          <button
            onClick={() => navigate("/")}
            className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-xl transition"
          >
            Volver al Inicio
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-pink-100 to-green-100 py-10 px-2">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 mb-6 border border-indigo-100">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-4">
            <div>
              <h1 className="text-3xl font-extrabold text-indigo-700 drop-shadow mb-2">
                📊 Reporte de Paquetes
              </h1>
              <p className="text-gray-600">
                Seguimiento de paquetes de clases comprados por los pacientes
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={exportarAExcel}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-bold shadow transition flex items-center gap-2"
                disabled={paquetesFiltrados.length === 0}
              >
                <DocumentArrowDownIcon className="h-5 w-5" />
                Exportar Excel
              </button>
              <button
                onClick={() => navigate("/")}
                className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-xl font-bold shadow transition flex items-center gap-2"
              >
                <ArrowLeftIcon className="h-5 w-5" />
                Volver
              </button>
            </div>
          </div>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4 mb-6">
          <div className="bg-white rounded-2xl p-3 md:p-6 shadow-lg border border-indigo-100 text-center">
            <ChartBarIcon className="h-8 w-8 text-indigo-600 mx-auto mb-2" />
            <div className="text-xl md:text-2xl font-bold text-indigo-700">{estadisticas.total}</div>
            <div className="text-xs md:text-sm text-gray-600">Total Paquetes</div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-green-100 text-center">
            <CheckCircleIcon className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <div className="text-xl md:text-2xl font-bold text-green-700">{estadisticas.activos}</div>
            <div className="text-xs md:text-sm text-gray-600">Paquetes Activos</div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-red-100 text-center">
            <ExclamationTriangleIcon className="h-8 w-8 text-red-600 mx-auto mb-2" />
            <div className="text-xl md:text-2xl font-bold text-red-700">{estadisticas.agotados}</div>
            <div className="text-xs md:text-sm text-gray-600">Paquetes Agotados</div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-blue-100 text-center">
            <CreditCardIcon className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <div className="text-xl md:text-2xl font-bold text-blue-700">{estadisticas.totalClasesPagadas}</div>
            <div className="text-xs md:text-sm text-gray-600">Clases Pagadas</div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-purple-100 text-center">
            <PlayIcon className="h-8 w-8 text-purple-600 mx-auto mb-2" />
            <div className="text-xl md:text-2xl font-bold text-purple-700">{estadisticas.totalClasesUsadas}</div>
            <div className="text-xs md:text-sm text-gray-600">Clases Usadas</div>
          </div>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-indigo-100">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Buscar por paciente, registro civil o factura
              </label>
              <input
                type="text"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                placeholder="Escribir para buscar..."
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filtrar por estado
              </label>
              <select
                value={filtro}
                onChange={(e) => setFiltro(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="todos">Todos ({paquetes.length})</option>
                <option value="activos">Activos ({estadisticas.activos})</option>
                <option value="agotados">Agotados ({estadisticas.agotados})</option>
              </select>
            </div>
          </div>
        </div>

        {/* Tabla de paquetes */}
        <div className="bg-white rounded-2xl shadow-lg border border-indigo-100 overflow-hidden">
          {paquetesFiltrados.length === 0 ? (
            <div className="text-center py-16">
              <ChartBarIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-700 mb-2">
                {busqueda || filtro !== "todos" ? "No se encontraron resultados" : "No hay paquetes registrados"}
              </h3>
              <p className="text-gray-500">
                {busqueda || filtro !== "todos" 
                  ? "Intenta cambiar los filtros de búsqueda" 
                  : "Los paquetes comprados aparecerán aquí"
                }
              </p>
            </div>
          ) : (
            <>
              {/* Vista de tabla para desktop */}
              <div className="hidden lg:block overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-indigo-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-indigo-700 uppercase tracking-wider">Paciente</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-indigo-700 uppercase tracking-wider">Registro Civil</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-indigo-700 uppercase tracking-wider">Factura</th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-indigo-700 uppercase tracking-wider">Pagadas</th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-indigo-700 uppercase tracking-wider">Usadas</th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-indigo-700 uppercase tracking-wider">Disponibles</th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-indigo-700 uppercase tracking-wider">% Uso</th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-indigo-700 uppercase tracking-wider">Estado</th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-indigo-700 uppercase tracking-wider">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {paquetesFiltrados.map((paquete) => (
                      <tr key={paquete._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-semibold text-gray-900">{paquete.paciente.nombres}</div>
                          <div className="text-sm text-gray-500">{paquete.paciente.genero} • {paquete.paciente.edad} meses</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                          {paquete.paciente.registroCivil}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-800">
                          {paquete.numeroFactura}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm font-semibold">
                            {paquete.clasesPagadas}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-sm font-semibold">
                            {paquete.clasesUsadas}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <span className={`px-2 py-1 rounded-full text-sm font-semibold ${
                            paquete.clasesDisponibles > 0 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {paquete.clasesDisponibles}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <div className="flex flex-col items-center">
                            <span className="text-sm font-semibold text-gray-700">{paquete.porcentajeUso}%</span>
                            <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                              <div 
                                className={`h-2 rounded-full ${
                                  paquete.porcentajeUso === 100 ? 'bg-red-500' : 
                                  paquete.porcentajeUso >= 80 ? 'bg-yellow-500' : 'bg-green-500'
                                }`}
                                style={{ width: `${paquete.porcentajeUso}%` }}
                              ></div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                            paquete.estado === 'Activo' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {paquete.estado}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <button
                            onClick={() => navigate(`/pacientes/${paquete.paciente._id}`)}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded-lg text-sm font-medium transition flex items-center gap-1 mx-auto"
                          >
                            <EyeIcon className="h-4 w-4" />
                            Ver
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {/* Vista de tarjetas para móvil y tablet */}
              <div className="lg:hidden space-y-4 p-4">
                {paquetesFiltrados.map((paquete) => (
                  <div key={paquete._id} className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 text-lg">{paquete.paciente.nombres}</h3>
                        <p className="text-sm text-gray-600">{paquete.paciente.genero} • {paquete.paciente.edad} meses</p>
                        <p className="text-sm text-gray-600">RC: {paquete.paciente.registroCivil}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                        paquete.estado === 'Activo' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {paquete.estado}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <div className="text-center">
                        <p className="text-xs text-gray-500 mb-1">Factura</p>
                        <p className="font-mono text-sm font-semibold">{paquete.numeroFactura}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-gray-500 mb-1">% Uso</p>
                        <p className="text-sm font-semibold">{paquete.porcentajeUso}%</p>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center mb-3">
                      <div className="flex space-x-4">
                        <div className="text-center">
                          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-semibold">
                            {paquete.clasesPagadas}
                          </span>
                          <p className="text-xs text-gray-500 mt-1">Pagadas</p>
                        </div>
                        <div className="text-center">
                          <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs font-semibold">
                            {paquete.clasesUsadas}
                          </span>
                          <p className="text-xs text-gray-500 mt-1">Usadas</p>
                        </div>
                        <div className="text-center">
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            paquete.clasesDisponibles > 0 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {paquete.clasesDisponibles}
                          </span>
                          <p className="text-xs text-gray-500 mt-1">Disponibles</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mb-3">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            paquete.porcentajeUso === 100 ? 'bg-red-500' : 
                            paquete.porcentajeUso >= 80 ? 'bg-yellow-500' : 'bg-green-500'
                          }`}
                          style={{ width: `${paquete.porcentajeUso}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => navigate(`/pacientes/${paquete.paciente._id}`)}
                      className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg font-medium transition flex items-center justify-center gap-2"
                    >
                      <EyeIcon className="h-4 w-4" />
                      Ver Paciente
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Footer con información */}
        <div className="mt-6 text-center text-gray-500 text-sm">
          Mostrando {paquetesFiltrados.length} de {paquetes.length} paquetes
        </div>
      </div>
    </div>
  );
}