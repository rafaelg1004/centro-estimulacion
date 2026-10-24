import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Link } from "react-router-dom";
import { apiRequest } from "../config/api";
import {
  MagnifyingGlassIcon,
  PhoneIcon,
  ChatBubbleLeftRightIcon,
  UserIcon,
  ArrowPathIcon,
  CalendarIcon,
  SparklesIcon,
} from "@heroicons/react/24/solid";

export default function Cumpleanos() {
  const [pacientes, setPacientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filtros
  const [diasFiltro, setDiasFiltro] = useState(30);
  const [mesFiltro, setMesFiltro] = useState("");
  const [tipoFiltro, setTipoFiltro] = useState("todos"); // 'todos', 'ninos', 'adultos'
  const [busqueda, setBusqueda] = useState("");

  // Métricas
  const [resumen, setResumen] = useState({
    hoy: 0,
    esta_semana: 0,
    este_mes: 0,
    total_en_rango: 0,
  });

  const cargarCumpleanos = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (diasFiltro) params.append("dias", diasFiltro);
      if (mesFiltro) params.append("mes", mesFiltro);
      if (tipoFiltro === "adultos") params.append("adulto", "true");
      if (tipoFiltro === "ninos") params.append("adulto", "false");
      params.append("limit", "200");

      const res = await apiRequest(`/cumpleanos/proximos?${params.toString()}`);
      if (res && res.success) {
        setPacientes(res.data || []);
        if (res.resumen) {
          setResumen(res.resumen);
        }
      } else {
        setPacientes([]);
      }
    } catch (err) {
      console.error("Error al cargar próximos cumpleaños:", err);
      setError("No se pudieron cargar los datos de cumpleaños. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  }, [diasFiltro, mesFiltro, tipoFiltro]);

  useEffect(() => {
    cargarCumpleanos();
  }, [cargarCumpleanos]);

  // Filtrado local por búsqueda (nombre o documento)
  const pacientesFiltrados = useMemo(() => {
    if (!busqueda.trim()) return pacientes;
    const term = busqueda.toLowerCase().trim();
    return pacientes.filter((p) => {
      const nombre = (p.nombre_completo || "").toLowerCase();
      const doc = (p.num_documento_identificacion || "").toLowerCase();
      return nombre.includes(term) || doc.includes(term);
    });
  }, [pacientes, busqueda]);

  // Limpiar número para WhatsApp
  const limpiarTelefonoWhatsApp = (tel) => {
    if (!tel) return "";
    let clean = tel.replace(/\D/g, "");
    if (clean.length === 10) {
      clean = "57" + clean; // Código país Colombia
    }
    return clean;
  };

  // Mensaje predeterminado de felicitación
  const generarUrlWhatsApp = (paciente) => {
    const telefono = limpiarTelefonoWhatsApp(paciente.telefono);
    if (!telefono) return null;
    const primerNombre = (paciente.nombres || "").split(" ")[0] || "estimado/a paciente";
    const mensaje = `¡Hola ${primerNombre}! 🎂🎉 Desde *D'Mamitas & Babies* queremos desearte un muy feliz cumpleaños. ¡Esperamos que disfrutes mucho este día tan especial! ✨💖`;
    return `https://wa.me/${telefono}?text=${encodeURIComponent(mensaje)}`;
  };

  const meses = [
    { num: 1, nombre: "Enero" },
    { num: 2, nombre: "Febrero" },
    { num: 3, nombre: "Marzo" },
    { num: 4, nombre: "Abril" },
    { num: 5, nombre: "Mayo" },
    { num: 6, nombre: "Junio" },
    { num: 7, nombre: "Julio" },
    { num: 8, nombre: "Agosto" },
    { num: 9, nombre: "Septiembre" },
    { num: 10, nombre: "Octubre" },
    { num: 11, nombre: "Noviembre" },
    { num: 12, nombre: "Diciembre" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Encabezado */}
        <div className="flex flex-col sm:flex-row items-center justify-between mb-8 pb-4 border-b border-indigo-100 gap-4">
          <div className="text-center sm:text-left">
            <h1 className="text-3xl font-extrabold text-indigo-900 flex items-center justify-center sm:justify-start gap-3">
              <span className="text-3xl">🎂</span> Módulo de Cumpleaños
            </h1>
            <p className="text-sm text-indigo-600 mt-1">
              Consulta próximos cumpleaños de pacientes, gestiona felicitaciones y mantén el contacto cercano.
            </p>
          </div>
          <button
            onClick={cargarCumpleanos}
            disabled={loading}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-xl shadow transition transform hover:scale-105 disabled:opacity-50 text-sm"
          >
            <ArrowPathIcon className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Actualizar
          </button>
        </div>

        {/* Tarjetas de Métricas Rápidas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Cumpleaños Hoy */}
          <div
            onClick={() => {
              setDiasFiltro(0);
              setMesFiltro("");
            }}
            className={`cursor-pointer p-5 rounded-2xl shadow transition transform hover:scale-105 border ${
              diasFiltro === 0
                ? "bg-gradient-to-r from-emerald-500 to-green-600 text-white border-green-700 ring-2 ring-green-400"
                : "bg-white text-gray-800 border-green-200 hover:border-green-400"
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-xs font-bold uppercase tracking-wider ${diasFiltro === 0 ? "text-green-100" : "text-green-600"}`}>
                  Cumpleaños Hoy
                </p>
                <p className="text-3xl font-black mt-1">{resumen.hoy}</p>
              </div>
              <div className={`p-3 rounded-xl ${diasFiltro === 0 ? "bg-white bg-opacity-20" : "bg-green-100 text-green-700"}`}>
                <SparklesIcon className="h-7 w-7" />
              </div>
            </div>
            <p className={`text-xs mt-2 ${diasFiltro === 0 ? "text-green-100" : "text-gray-500"}`}>
              {resumen.hoy === 1 ? "1 paciente cumple hoy" : `${resumen.hoy} pacientes cumplen hoy`}
            </p>
          </div>

          {/* Próximos 7 días */}
          <div
            onClick={() => {
              setDiasFiltro(7);
              setMesFiltro("");
            }}
            className={`cursor-pointer p-5 rounded-2xl shadow transition transform hover:scale-105 border ${
              diasFiltro === 7
                ? "bg-gradient-to-r from-amber-500 to-yellow-600 text-white border-amber-700 ring-2 ring-amber-400"
                : "bg-white text-gray-800 border-amber-200 hover:border-amber-400"
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-xs font-bold uppercase tracking-wider ${diasFiltro === 7 ? "text-amber-100" : "text-amber-600"}`}>
                  Esta Semana (7 días)
                </p>
                <p className="text-3xl font-black mt-1">{resumen.esta_semana}</p>
              </div>
              <div className={`p-3 rounded-xl ${diasFiltro === 7 ? "bg-white bg-opacity-20" : "bg-amber-100 text-amber-700"}`}>
                <CalendarIcon className="h-7 w-7" />
              </div>
            </div>
            <p className={`text-xs mt-2 ${diasFiltro === 7 ? "text-amber-100" : "text-gray-500"}`}>
              Cumpleaños dentro de 7 días
            </p>
          </div>

          {/* Próximos 30 días */}
          <div
            onClick={() => {
              setDiasFiltro(30);
              setMesFiltro("");
            }}
            className={`cursor-pointer p-5 rounded-2xl shadow transition transform hover:scale-105 border ${
              diasFiltro === 30 && !mesFiltro
                ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white border-indigo-700 ring-2 ring-indigo-400"
                : "bg-white text-gray-800 border-indigo-200 hover:border-indigo-400"
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-xs font-bold uppercase tracking-wider ${diasFiltro === 30 && !mesFiltro ? "text-indigo-100" : "text-indigo-600"}`}>
                  Próximos 30 días
                </p>
                <p className="text-3xl font-black mt-1">{resumen.este_mes}</p>
              </div>
              <div className={`p-3 rounded-xl ${diasFiltro === 30 && !mesFiltro ? "bg-white bg-opacity-20" : "bg-indigo-100 text-indigo-700"}`}>
                <CalendarIcon className="h-7 w-7" />
              </div>
            </div>
            <p className={`text-xs mt-2 ${diasFiltro === 30 && !mesFiltro ? "text-indigo-100" : "text-gray-500"}`}>
              Cumpleaños en los próximos 30 días
            </p>
          </div>

          {/* Total consultado */}
          <div
            onClick={() => {
              setDiasFiltro(365);
              setMesFiltro("");
            }}
            className={`cursor-pointer p-5 rounded-2xl shadow transition transform hover:scale-105 border ${
              diasFiltro === 365
                ? "bg-gradient-to-r from-pink-500 to-rose-600 text-white border-pink-700 ring-2 ring-pink-400"
                : "bg-white text-gray-800 border-pink-200 hover:border-pink-400"
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-xs font-bold uppercase tracking-wider ${diasFiltro === 365 ? "text-pink-100" : "text-pink-600"}`}>
                  Todo el Año
                </p>
                <p className="text-3xl font-black mt-1">{resumen.total_en_rango}</p>
              </div>
              <div className={`p-3 rounded-xl ${diasFiltro === 365 ? "bg-white bg-opacity-20" : "bg-pink-100 text-pink-700"}`}>
                <UserIcon className="h-7 w-7" />
              </div>
            </div>
            <p className={`text-xs mt-2 ${diasFiltro === 365 ? "text-pink-100" : "text-gray-500"}`}>
              Ver todos los registrados
            </p>
          </div>
        </div>

        {/* Barra de Filtros y Búsqueda */}
        <div className="bg-white rounded-2xl shadow p-5 mb-8 border border-gray-100 flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Input de Búsqueda */}
          <div className="relative w-full md:w-80">
            <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por nombre o documento..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
            />
          </div>

          {/* Filtros de Rango, Mes y Tipo */}
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            {/* Rango de Días */}
            <select
              value={diasFiltro}
              onChange={(e) => {
                setDiasFiltro(Number(e.target.value));
                setMesFiltro("");
              }}
              className="bg-gray-50 border border-gray-300 rounded-xl py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-700"
            >
              <option value="0">Cumpleaños Hoy</option>
              <option value="7">Próximos 7 días</option>
              <option value="15">Próximos 15 días</option>
              <option value="30">Próximos 30 días</option>
              <option value="60">Próximos 60 días</option>
              <option value="365">Todo el año</option>
            </select>

            {/* Filtro por Mes Específico */}
            <select
              value={mesFiltro}
              onChange={(e) => {
                setMesFiltro(e.target.value);
                setDiasFiltro(365);
              }}
              className="bg-gray-50 border border-gray-300 rounded-xl py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-700"
            >
              <option value="">Filtrar por Mes...</option>
              {meses.map((m) => (
                <option key={m.num} value={m.num}>
                  {m.nombre}
                </option>
              ))}
            </select>

            {/* Filtro Tipo Paciente */}
            <select
              value={tipoFiltro}
              onChange={(e) => setTipoFiltro(e.target.value)}
              className="bg-gray-50 border border-gray-300 rounded-xl py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-700"
            >
              <option value="todos">Todos los pacientes</option>
              <option value="ninos">👶 Niños / Pediátricos</option>
              <option value="adultos">🤰 Adultos / Maternas</option>
            </select>
          </div>
        </div>

        {/* Mensaje de Error */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-xl mb-6 shadow-sm">
            <p className="font-bold text-sm">Error</p>
            <p className="text-xs">{error}</p>
          </div>
        )}

        {/* Listado de Pacientes */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <ArrowPathIcon className="h-10 w-10 text-indigo-500 animate-spin mb-4" />
            <p className="text-indigo-600 font-medium">Cargando próximos cumpleaños...</p>
          </div>
        ) : pacientesFiltrados.length === 0 ? (
          <div className="bg-white rounded-2xl shadow p-12 text-center border border-gray-100 max-w-lg mx-auto">
            <span className="text-5xl block mb-4">🎈</span>
            <h3 className="text-lg font-bold text-gray-800 mb-2">No se encontraron cumpleaños</h3>
            <p className="text-sm text-gray-500 mb-6">
              No hay pacientes con cumpleaños en el rango o filtros seleccionados.
            </p>
            <button
              onClick={() => {
                setDiasFiltro(30);
                setMesFiltro("");
                setTipoFiltro("todos");
                setBusqueda("");
              }}
              className="bg-indigo-600 text-white font-semibold py-2 px-6 rounded-xl hover:bg-indigo-700 text-sm shadow transition"
            >
              Restablecer filtros
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pacientesFiltrados.map((paciente) => {
              const esHoy = paciente.dias_faltantes === 0;
              const esSemana = paciente.dias_faltantes > 0 && paciente.dias_faltantes <= 7;
              const urlWhatsApp = generarUrlWhatsApp(paciente);

              return (
                <div
                  key={paciente.paciente_id}
                  className={`bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-200 border flex flex-col justify-between overflow-hidden ${
                    esHoy
                      ? "border-green-400 ring-2 ring-green-300 bg-gradient-to-br from-green-50 via-white to-emerald-50"
                      : esSemana
                      ? "border-amber-300"
                      : "border-gray-200"
                  }`}
                >
                  <div className="p-6">
                    {/* Badge Días Faltantes */}
                    <div className="flex items-center justify-between mb-3">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                          esHoy
                            ? "bg-green-500 text-white animate-pulse"
                            : esSemana
                            ? "bg-amber-100 text-amber-800 border border-amber-300"
                            : "bg-indigo-50 text-indigo-700 border border-indigo-200"
                        }`}
                      >
                        {esHoy ? "🎉 ¡CUMPLEAÑOS HOY!" : paciente.dias_faltantes === 1 ? "⏳ Mañana" : `🗓️ En ${paciente.dias_faltantes} días`}
                      </span>

                      <span className="text-xs px-2 py-0.5 rounded-md font-semibold bg-gray-100 text-gray-600">
                        {paciente.es_adulto ? "Adulto / Materna" : "Pediátrico"}
                      </span>
                    </div>

                    {/* Nombre y Documento */}
                    <h3 className="text-lg font-bold text-gray-900 leading-snug mb-1">
                      {paciente.nombre_completo}
                    </h3>
                    <p className="text-xs text-gray-500 mb-4">
                      {paciente.tipo_documento_identificacion || "DOC"}: {paciente.num_documento_identificacion || "No registrado"}
                    </p>

                    {/* Detalle de Edad y Próxima Fecha */}
                    <div className="bg-indigo-50/60 rounded-xl p-3 space-y-1.5 text-xs text-gray-700 mb-4 border border-indigo-100">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-500">Fecha Nacimiento:</span>
                        <span className="font-semibold text-gray-800">{paciente.fecha_nacimiento}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-500">Próximo Cumpleaños:</span>
                        <span className="font-bold text-indigo-800">{paciente.proximo_cumpleanos}</span>
                      </div>
                      <div className="flex justify-between items-center pt-1 border-t border-indigo-100">
                        <span className="text-gray-500">Edad que Cumple:</span>
                        <span className="font-extrabold text-indigo-600 text-sm">
                          {paciente.edad_a_cumplir} {paciente.edad_a_cumplir === 1 ? "año" : "años"}
                          <span className="text-xs font-normal text-gray-500 ml-1">
                            (tiene {paciente.edad_actual})
                          </span>
                        </span>
                      </div>
                    </div>

                    {/* Teléfono / Acompañante */}
                    <div className="text-xs text-gray-600 space-y-1">
                      {paciente.telefono && (
                        <p className="flex items-center gap-1.5 font-medium">
                          <PhoneIcon className="h-3.5 w-3.5 text-gray-400" />
                          {paciente.telefono}
                        </p>
                      )}
                      {paciente.nombre_acompanante && (
                        <p className="text-gray-500">
                          <span className="font-medium">Acompañante:</span> {paciente.nombre_acompanante}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Acciones */}
                  <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between gap-2">
                    <Link
                      to={`/pacientes/${paciente.paciente_id}`}
                      className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 hover:underline"
                    >
                      Ver Paciente
                    </Link>

                    <div className="flex items-center gap-2">
                      {paciente.telefono && (
                        <a
                          href={`tel:${paciente.telefono}`}
                          title="Llamar al paciente"
                          className="p-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition"
                        >
                          <PhoneIcon className="h-4 w-4" />
                        </a>
                      )}

                      {urlWhatsApp ? (
                        <a
                          href={urlWhatsApp}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="Felicitar por WhatsApp"
                          className="flex items-center gap-1.5 bg-green-500 hover:bg-green-600 text-white font-bold text-xs py-2 px-3 rounded-lg shadow transition transform hover:scale-105"
                        >
                          <ChatBubbleLeftRightIcon className="h-4 w-4" />
                          <span>Felicitar</span>
                        </a>
                      ) : (
                        <span className="text-[11px] text-gray-400 italic">Sin teléfono</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
