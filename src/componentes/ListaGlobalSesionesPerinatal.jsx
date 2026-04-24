import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiRequest } from "../config/api";
import {
  UsersIcon,
  MagnifyingGlassIcon,
  ArrowPathIcon,
  CalendarDaysIcon,
  PresentationChartLineIcon,
  CheckBadgeIcon,
} from "@heroicons/react/24/outline";

export default function ListaGlobalSesionesPerinatal() {
  const [pacientes, setPacientes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [filtro, setFiltro] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    setCargando(true);
    try {
      // Carga unificada de valoraciones perinatales (CUPS 890204)
      const response = await apiRequest("/valoraciones?modulo=perinatal");
      const data = response.valoraciones || [];

      // Agrupar por paciente para que cada mamá aparezca una sola vez (la más reciente)
      const agrupados = data.reduce((acc, item) => {
        const pacienteId = item.paciente?._id || item.paciente;
        if (!pacienteId) return acc;

        if (
          !acc[pacienteId] ||
          new Date(item.createdAt) > new Date(acc[pacienteId].createdAt)
        ) {
          acc[pacienteId] = item;
        }
        return acc;
      }, {});

      setPacientes(Object.values(agrupados));
    } catch (error) {
      console.error("Error cargando programas perinatales unificados:", error);
    }
    setCargando(false);
  };

  const pacientesFiltrados = pacientes.filter((p) => {
    const nombreCompleto =
      `${p.paciente?.nombres} ${p.paciente?.apellidos}`.toLowerCase();
    const documento = (
      p.paciente?.numDocumentoIdentificacion || ""
    ).toLowerCase();
    const busqueda = filtro.toLowerCase();
    return nombreCompleto.includes(busqueda) || documento.includes(busqueda);
  });

  const calcularProgreso = (sesiones = [], sesionesExtra = []) => {
    const total = sesiones.length + sesionesExtra.length;
    if (total === 0) return 0;
    const completadas = [...sesiones, ...sesionesExtra].filter(
      (s) => s.firmaPaciente && s.fecha,
    ).length;
    return Math.round((completadas / total) * 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-pink-100 to-green-100 py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-3xl shadow-2xl p-8 border border-indigo-100 overflow-hidden relative">
          {/* Background decorativo */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full -mr-32 -mt-32 opacity-50"></div>

          <div className="relative z-10">
            <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
              <div>
                <h1 className="text-4xl font-black text-indigo-700 tracking-tighter">
                  PROGRAMAS PERINATALES
                </h1>
                <p className="text-gray-500 font-bold uppercase text-[10px] tracking-widest mt-1">
                  Seguimiento de Sesiones y Evolución Materna
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={cargarDatos}
                  className="p-4 bg-gray-50 text-indigo-600 rounded-2xl hover:bg-indigo-50 transition-colors shadow-sm"
                  title="Actualizar lista"
                >
                  <ArrowPathIcon
                    className={`h-6 w-6 ${cargando ? "animate-spin" : ""}`}
                  />
                </button>
                <button
                  onClick={() => navigate("/valoracion?tipo=perinatal")}
                  className="px-8 py-4 bg-indigo-600 text-white font-black rounded-2xl shadow-lg hover:bg-indigo-700 transition-all flex items-center gap-2 transform hover:scale-105 active:scale-95"
                >
                  <PresentationChartLineIcon className="h-6 w-6" />
                  NUEVA VALORACIÓN
                </button>
              </div>
            </div>

            {/* Buscador */}
            <div className="relative mb-8">
              <MagnifyingGlassIcon className="h-6 w-6 absolute left-5 top-1/2 transform -translate-y-1/2 text-indigo-300" />
              <input
                type="text"
                placeholder="Buscar por nombre de mamá o documento..."
                value={filtro}
                onChange={(e) => setFiltro(e.target.value)}
                className="w-full pl-14 pr-6 py-5 rounded-[2rem] border-2 border-indigo-50 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 bg-indigo-50/20 text-lg shadow-inner outline-none transition-all placeholder:text-indigo-200"
              />
            </div>

            {cargando ? (
              <div className="flex flex-col items-center py-20">
                <div className="h-16 w-16 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
                <span className="mt-4 text-indigo-400 font-black tracking-widest text-xs uppercase animate-pulse">
                  Cargando Programas...
                </span>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pacientesFiltrados.map((item) => {
                  const progreso = calcularProgreso(
                    item.sesiones,
                    item.sesionesIntensivo,
                  );
                  return (
                    <div
                      key={item._id}
                      className="group bg-white rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden relative"
                    >
                      <div className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="h-14 w-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform shadow-inner">
                            🤰
                          </div>
                          <div
                            className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-tighter ${
                              progreso === 100
                                ? "bg-green-100 text-green-600"
                                : "bg-orange-100 text-orange-600"
                            }`}
                          >
                            {progreso === 100
                              ? "Programa Finalizado"
                              : "En Curso"}
                          </div>
                        </div>

                        <h3 className="text-xl font-black text-gray-800 uppercase tracking-tighter leading-tight mb-1 group-hover:text-indigo-600 transition-colors">
                          {item.paciente?.nombres} {item.paciente?.apellidos}
                        </h3>
                        <p className="text-xs font-bold text-gray-400 mb-4 tracking-widest">
                          ID:{" "}
                          {item.paciente?.numDocumentoIdentificacion || "N/A"}
                        </p>

                        <div className="space-y-4 mb-6">
                          <div className="flex items-center gap-3">
                            <div className="bg-pink-50 p-2 rounded-lg">
                              <CalendarDaysIcon className="h-4 w-4 text-pink-500" />
                            </div>
                            <div className="flex-1">
                              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                                Plan Activo
                              </p>
                              <p className="text-xs font-bold text-gray-700 capitalize">
                                {item.tipoPrograma ||
                                  item._datosLegacy?.tipoPrograma ||
                                  "No especificado"}
                              </p>
                            </div>
                          </div>

                          <div>
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                                Progreso del Programa
                              </span>
                              <span className="text-xs font-black text-indigo-600">
                                {progreso}%
                              </span>
                            </div>
                            <div className="h-2 bg-gray-100 rounded-full overflow-hidden shadow-inner">
                              <div
                                className="h-full bg-gradient-to-r from-indigo-500 to-pink-500 transition-all duration-1000"
                                style={{ width: `${progreso}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Link
                            to={`/pacientes/${item.paciente?._id}/sesiones-perinatal`}
                            className="flex-1 bg-indigo-50 hover:bg-indigo-600 text-indigo-600 hover:text-white py-3 px-4 rounded-2xl text-[11px] font-black uppercase tracking-tighter transition-all text-center shadow-sm"
                          >
                            Gestionar Sesiones
                          </Link>
                          <Link
                            to={`/valoraciones/${item._id}`}
                            className="bg-gray-50 hover:bg-gray-200 text-gray-400 hover:text-gray-600 py-3 px-4 rounded-2xl transition-all shadow-sm"
                            title="Ver Valoración de Ingreso"
                          >
                            <CheckBadgeIcon className="h-5 w-5" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {pacientesFiltrados.length === 0 && !cargando && (
                  <div className="col-span-full py-20 text-center bg-white rounded-[3rem] border-2 border-dashed border-indigo-100">
                    <UsersIcon className="h-16 w-16 text-indigo-100 mx-auto mb-4" />
                    <h3 className="text-xl font-black text-indigo-200 uppercase tracking-tighter">
                      No hay programas perinatales activos
                    </h3>
                    <p className="text-gray-400 text-sm mt-2">
                      Inicia una nueva valoración para registrar a una paciente.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
