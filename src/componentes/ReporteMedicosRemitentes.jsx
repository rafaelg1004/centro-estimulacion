import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../config/api";
import * as XLSX from "xlsx";
import {
  DocumentArrowDownIcon,
  EyeIcon,
  UserGroupIcon,
  AcademicCapIcon,
  ChartBarIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/solid";

const VALORES_VACIOS = new Set([
  "",
  "N/A",
  "NA",
  "S.D",
  "SD",
  "S/D",
  "SIN DATO",
  "SIN DATOS",
  "NO",
  "NINGUNO",
  "NINGUNA",
  "NO APLICA",
  "NO ESPECIFICADO",
  "PARTICULAR",
  "-",
  ".",
]);

function normalizarClaveMedico(nombreRaw) {
  if (!nombreRaw) return "";
  const limpio = String(nombreRaw)
    .trim()
    .replace(/\s+/g, " ")
    .replace(/^(DR\.?|DRA\.?|DOCTOR|DOCTORA|PEDIATRA|MEDICO|MÉDICO)\s+/i, "")
    .trim();
  const upper = limpio
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^A-Z0-9\s]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .toUpperCase();
  if (VALORES_VACIOS.has(upper)) return "";
  return upper;
}

function formatearNombreMedico(nombreRaw) {
  const limpio = String(nombreRaw || "")
    .trim()
    .replace(/\s+/g, " ")
    .replace(/^(DR\.?|DRA\.?|DOCTOR|DOCTORA)\s+/i, "")
    .trim();
  if (!limpio) return "SIN MÉDICO ESPECIFICADO";
  return limpio.toUpperCase();
}

export default function ReporteMedicosRemitentes() {
  const [pacientes, setPacientes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [busqueda, setBusqueda] = useState("");
  const [filtroTipo, setFiltroTipo] = useState("con_medico"); // "con_medico" | "pediatria" | "adulto" | "todos" | "sin_medico"
  const [mesSeleccionado, setMesSeleccionado] = useState("todos");
  const [medicoExpandido, setMedicoExpandido] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    cargarPacientes();
  }, []);

  const cargarPacientes = async () => {
    try {
      setCargando(true);
      setError("");
      const data = await apiRequest("/pacientes?limite=2000");
      setPacientes(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error al cargar pacientes para reporte de médicos:", err);
      setError("No se pudo cargar la lista de pacientes y médicos.");
    } finally {
      setCargando(false);
    }
  };

  // Obtener meses disponibles de registro de pacientes
  const mesesDisponibles = useMemo(() => {
    const mesesMap = new Map();
    pacientes.forEach((p) => {
      const fechaRaw = p.created_at || p.createdAt;
      if (!fechaRaw) return;
      const fecha = new Date(fechaRaw);
      if (isNaN(fecha.getTime())) return;
      const key = `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, "0")}`;
      const label = fecha.toLocaleDateString("es-CO", { year: "numeric", month: "long" });
      mesesMap.set(key, { key, label });
    });
    return Array.from(mesesMap.values()).sort((a, b) => b.key.localeCompare(a.key));
  }, [pacientes]);

  // Agrupar pacientes por médico (pediatra en niños, medico_tratante en adultos)
  const { gruposMedicos, estadisticas } = useMemo(() => {
    const mapa = new Map();
    let totalConMedico = 0;
    let totalSinMedico = 0;
    let totalPediatriaConMedico = 0;
    let totalAdultoConMedico = 0;

    const pacientesPorMes =
      mesSeleccionado === "todos"
        ? pacientes
        : pacientes.filter((p) => {
            const fechaRaw = p.created_at || p.createdAt;
            if (!fechaRaw) return false;
            const fecha = new Date(fechaRaw);
            if (isNaN(fecha.getTime())) return false;
            const key = `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, "0")}`;
            return key === mesSeleccionado;
          });

    pacientesPorMes.forEach((p) => {
      const esAdulto = Boolean(p.es_adulto || p.esAdulto);
      const rawMedico = esAdulto
        ? p.medico_tratante || p.medicoTratante || p.pediatra || ""
        : p.pediatra || p.medico_tratante || p.medicoTratante || "";

      const clave = normalizarClaveMedico(rawMedico);
      const tieneMedico = clave !== "";

      if (tieneMedico) {
        totalConMedico++;
        if (esAdulto) totalAdultoConMedico++;
        else totalPediatriaConMedico++;
      } else {
        totalSinMedico++;
      }

      const groupKey = tieneMedico ? clave : "__SIN_MEDICO__";
      if (!mapa.has(groupKey)) {
        mapa.set(groupKey, {
          clave: groupKey,
          nombre: tieneMedico ? formatearNombreMedico(rawMedico) : "SIN MÉDICO / NO REGISTRADO",
          tieneMedico,
          cantidadTotal: 0,
          cantidadNinos: 0,
          cantidadAdultos: 0,
          aseguradorasSet: new Set(),
          ultimoRegistro: null,
          pacientes: [],
        });
      }

      const grupo = mapa.get(groupKey);
      grupo.cantidadTotal++;
      if (esAdulto) grupo.cantidadAdultos++;
      else grupo.cantidadNinos++;

      if (p.aseguradora && p.aseguradora.trim()) {
        grupo.aseguradorasSet.add(p.aseguradora.trim().toUpperCase());
      }

      const fechaReg = p.created_at || p.createdAt || null;
      if (fechaReg && (!grupo.ultimoRegistro || new Date(fechaReg) > new Date(grupo.ultimoRegistro))) {
        grupo.ultimoRegistro = fechaReg;
      }

      const contacto = p.datos_contacto || p.datosContacto || {};
      grupo.pacientes.push({
        id: p.id || p._id,
        nombreCompleto: `${p.nombres || ""} ${p.apellidos || ""}`.trim(),
        documento:
          p.num_documento_identificacion ||
          p.numDocumentoIdentificacion ||
          p.registroCivil ||
          "N/A",
        tipoDocumento: p.tipo_documento_identificacion || p.tipoDocumentoIdentificacion || "",
        esAdulto,
        modulo: esAdulto ? "Materno / Adulto" : "Pediatría (Niño)",
        medicoOriginal: rawMedico || "No especificado",
        telefono: contacto.telefono || contacto.celular || p.celular || p.telefono || "N/A",
        aseguradora: p.aseguradora || "Particular",
        madre: p.nombre_madre || p.nombreMadre || "",
        fechaRegistro: fechaReg,
      });
    });

    const listaGrupos = Array.from(mapa.values())
      .map((g) => ({
        ...g,
        aseguradoras: Array.from(g.aseguradorasSet),
        tipoPrincipal:
          !g.tieneMedico
            ? "Sin especificar"
            : g.cantidadNinos >= g.cantidadAdultos
              ? "Pediatra"
              : "Médico Tratante",
        porcentaje:
          totalConMedico > 0 && g.tieneMedico
            ? Math.round((g.cantidadTotal / totalConMedico) * 100)
            : 0,
      }))
      .sort((a, b) => {
        if (a.tieneMedico !== b.tieneMedico) return a.tieneMedico ? -1 : 1;
        return b.cantidadTotal - a.cantidadTotal;
      });

    const soloConMedico = listaGrupos.filter((g) => g.tieneMedico);
    const topMedico = soloConMedico.length > 0 ? soloConMedico[0] : null;

    return {
      gruposMedicos: listaGrupos,
      estadisticas: {
        totalMedicos: soloConMedico.length,
        totalPacientes: pacientesPorMes.length,
        totalConMedico,
        totalSinMedico,
        totalPediatriaConMedico,
        totalAdultoConMedico,
        topMedicoNombre: topMedico ? topMedico.nombre : "N/A",
        topMedicoCantidad: topMedico ? topMedico.cantidadTotal : 0,
      },
    };
  }, [pacientes, mesSeleccionado]);

  // Filtrar grupos según búsqueda y selector
  const gruposFiltrados = useMemo(() => {
    const termino = busqueda.toLowerCase().trim();

    return gruposMedicos
      .filter((g) => {
        if (filtroTipo === "con_medico" && !g.tieneMedico) return false;
        if (filtroTipo === "sin_medico" && g.tieneMedico) return false;
        if (filtroTipo === "pediatria" && (!g.tieneMedico || g.cantidadNinos === 0)) return false;
        if (filtroTipo === "adulto" && (!g.tieneMedico || g.cantidadAdultos === 0)) return false;

        if (!termino) return true;
        const coincideMedico = g.nombre.toLowerCase().includes(termino);
        const coincidePaciente = g.pacientes.some(
          (p) =>
            p.nombreCompleto.toLowerCase().includes(termino) ||
            p.documento.toLowerCase().includes(termino) ||
            p.aseguradora.toLowerCase().includes(termino)
        );
        return coincideMedico || coincidePaciente;
      });
  }, [gruposMedicos, busqueda, filtroTipo]);

  const exportarAExcel = () => {
    try {
      const hojaResumen = gruposFiltrados.map((g, idx) => ({
        "#": idx + 1,
        "Médico / Pediatra": g.nombre,
        Categoría: g.tipoPrincipal,
        "Total Pacientes Enviados": g.cantidadTotal,
        "Niños (Pediatría)": g.cantidadNinos,
        "Adultos (Materno)": g.cantidadAdultos,
        "% de Remisiones": `${g.porcentaje}%`,
        Aseguradoras: g.aseguradoras.join(", ") || "Particular",
        "Último Registro": g.ultimoRegistro
          ? new Date(g.ultimoRegistro).toLocaleDateString("es-CO")
          : "N/A",
      }));

      const hojaDetalle = [];
      gruposFiltrados.forEach((g) => {
        g.pacientes.forEach((p) => {
          hojaDetalle.push({
            "Médico / Pediatra": g.nombre,
            Categoría: g.tipoPrincipal,
            Paciente: p.nombreCompleto,
            Documento: `${p.tipoDocumento ? p.tipoDocumento + " " : ""}${p.documento}`,
            Módulo: p.modulo,
            Teléfono: p.telefono,
            "Madre / Acudiente": p.madre || "N/A",
            Aseguradora: p.aseguradora,
            "Fecha Registro": p.fechaRegistro
              ? new Date(p.fechaRegistro).toLocaleDateString("es-CO")
              : "N/A",
          });
        });
      });

      const libro = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(
        libro,
        XLSX.utils.json_to_sheet(hojaResumen),
        "Resumen por Medico"
      );
      XLSX.utils.book_append_sheet(
        libro,
        XLSX.utils.json_to_sheet(hojaDetalle),
        "Pacientes por Medico"
      );

      const fecha = new Date().toISOString().split("T")[0];
      const nombreArchivo = `reporte_medicos_remitentes_${fecha}.xlsx`;
      XLSX.writeFile(libro, nombreArchivo);
    } catch (err) {
      console.error("Error exportando reporte de médicos:", err);
      alert("Error al exportar el archivo Excel");
    }
  };

  if (cargando) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-indigo-600 border-solid"></div>
        <span className="mt-4 text-indigo-700 font-bold">
          Extrayendo listado de médicos y pediatras...
        </span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-3xl shadow-xl p-8 text-center">
        <p className="text-red-600 font-bold mb-3">{error}</p>
        <button
          onClick={cargarPacientes}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-xl font-bold"
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Tarjetas de Estadísticas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 shadow-lg border border-indigo-100 text-center">
          <AcademicCapIcon className="h-8 w-8 text-indigo-600 mx-auto mb-2" />
          <div className="text-2xl font-extrabold text-indigo-700">
            {estadisticas.totalMedicos}
          </div>
          <div className="text-xs md:text-sm text-gray-600">
            Médicos / Pediatras Distintos
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-lg border border-green-100 text-center">
          <UserGroupIcon className="h-8 w-8 text-green-600 mx-auto mb-2" />
          <div className="text-2xl font-extrabold text-green-700">
            {estadisticas.totalConMedico}
          </div>
          <div className="text-xs md:text-sm text-gray-600">
            Pacientes Enviados por Médico
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-lg border border-pink-100 text-center">
          <ChartBarIcon className="h-8 w-8 text-pink-600 mx-auto mb-2" />
          <div className="text-sm md:text-base font-extrabold text-pink-700 truncate" title={estadisticas.topMedicoNombre}>
            {estadisticas.topMedicoNombre}
          </div>
          <div className="text-xs md:text-sm text-gray-600 mt-1">
            Médico Top ({estadisticas.topMedicoCantidad} pacientes)
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-lg border border-blue-100 text-center">
          <div className="text-2xl font-extrabold text-blue-700">
            {estadisticas.totalPediatriaConMedico} / {estadisticas.totalAdultoConMedico}
          </div>
          <div className="text-xs md:text-sm text-gray-600 mt-2">
            Niños (Pediatra) / Materno
          </div>
        </div>
      </div>

      {/* Filtros y botón Exportar */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-indigo-100">
        <div className="flex flex-col md:flex-row items-end gap-4">
          <div className="flex-1 w-full">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Buscar por nombre del pediatra/médico, paciente o aseguradora
            </label>
            <div className="relative">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3.5 top-2.5" />
              <input
                type="text"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                placeholder="Ej: Victor Yepez, nombre del niño o documento..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
          </div>

          <div className="w-full md:w-auto">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filtrar por categoría
            </label>
            <select
              value={filtroTipo}
              onChange={(e) => setFiltroTipo(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
            >
              <option value="con_medico">
                Con Médico / Pediatra ({estadisticas.totalMedicos})
              </option>
              <option value="pediatria">Solo Pediatras (Niños)</option>
              <option value="adulto">Solo Médicos Tratantes (Materno)</option>
              <option value="todos">Todos (incluyendo sin médico)</option>
              <option value="sin_medico">
                Sin médico registrado ({estadisticas.totalSinMedico} pac.)
              </option>
            </select>
          </div>

          <div className="w-full md:w-auto">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mes de registro
            </label>
            <select
              value={mesSeleccionado}
              onChange={(e) => setMesSeleccionado(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
            >
              <option value="todos">Todos los meses</option>
              {mesesDisponibles.map((mes) => (
                <option key={mes.key} value={mes.key}>
                  {mes.label}
                </option>
              ))}
            </select>
          </div>

          <button
            type="button"
            onClick={exportarAExcel}
            disabled={gruposFiltrados.length === 0}
            className="w-full md:w-auto bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white px-6 py-2.5 rounded-xl font-bold shadow transition flex items-center justify-center gap-2"
          >
            <DocumentArrowDownIcon className="h-5 w-5" />
            Exportar Excel
          </button>
        </div>
      </div>

      {/* Tabla agrupada por Médico / Pediatra */}
      <div className="bg-white rounded-2xl shadow-lg border border-indigo-100 overflow-hidden">
        {gruposFiltrados.length === 0 ? (
          <div className="text-center py-16 px-4">
            <AcademicCapIcon className="h-14 w-14 text-gray-300 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-gray-700">
              No se encontraron médicos con ese criterio
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              Prueba cambiando el filtro o el texto de búsqueda.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-indigo-50">
                <tr>
                  <th className="px-4 py-3 text-left font-bold text-indigo-700 uppercase w-14">
                    #
                  </th>
                  <th className="px-4 py-3 text-left font-bold text-indigo-700 uppercase">
                    Médico / Pediatra
                  </th>
                  <th className="px-4 py-3 text-center font-bold text-indigo-700 uppercase">
                    Especialidad
                  </th>
                  <th className="px-4 py-3 text-center font-bold text-indigo-700 uppercase">
                    Pacientes Enviados
                  </th>
                  <th className="px-4 py-3 text-center font-bold text-indigo-700 uppercase">
                    % Participación
                  </th>
                  <th className="px-4 py-3 text-left font-bold text-indigo-700 uppercase">
                    Aseguradoras
                  </th>
                  <th className="px-4 py-3 text-center font-bold text-indigo-700 uppercase">
                    Pacientes
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {gruposFiltrados.map((grupo, idx) => {
                  const abierto = medicoExpandido === grupo.clave;
                  return (
                    <React.Fragment key={grupo.clave}>
                      <tr
                        className={`hover:bg-indigo-50/40 transition-colors cursor-pointer ${
                          abierto ? "bg-indigo-50/60" : ""
                        }`}
                        onClick={() =>
                          setMedicoExpandido(abierto ? null : grupo.clave)
                        }
                      >
                        <td className="px-4 py-3.5 font-bold text-gray-500">
                          {idx + 1}
                        </td>
                        <td className="px-4 py-3.5">
                          <div className="font-extrabold text-gray-900 text-sm flex items-center gap-2">
                            <span>🩺</span>
                            <span>{grupo.nombre}</span>
                          </div>
                          {grupo.ultimoRegistro && (
                            <div className="text-xs text-gray-400 mt-0.5">
                              Último envío:{" "}
                              {new Date(grupo.ultimoRegistro).toLocaleDateString("es-CO")}
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-3.5 text-center">
                          <span
                            className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                              grupo.tipoPrincipal === "Pediatra"
                                ? "bg-indigo-100 text-indigo-800"
                                : grupo.tipoPrincipal === "Médico Tratante"
                                  ? "bg-pink-100 text-pink-800"
                                  : "bg-gray-100 text-gray-600"
                            }`}
                          >
                            {grupo.tipoPrincipal}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 text-center">
                          <span className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-sm font-extrabold">
                            {grupo.cantidadTotal}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 text-center w-44">
                          {grupo.tieneMedico ? (
                            <div className="flex flex-col items-center">
                              <span className="text-xs font-bold text-gray-700">
                                {grupo.porcentaje}%
                              </span>
                              <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                                <div
                                  className="h-2 rounded-full bg-indigo-600"
                                  style={{ width: `${Math.max(grupo.porcentaje, 4)}%` }}
                                />
                              </div>
                            </div>
                          ) : (
                            <span className="text-xs text-gray-400">-</span>
                          )}
                        </td>
                        <td className="px-4 py-3.5 text-xs text-gray-600 max-w-xs truncate">
                          {grupo.aseguradoras.slice(0, 3).join(", ") || "Particular"}
                          {grupo.aseguradoras.length > 3 && ` (+${grupo.aseguradoras.length - 3})`}
                        </td>
                        <td className="px-4 py-3.5 text-center">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setMedicoExpandido(abierto ? null : grupo.clave);
                            }}
                            className="inline-flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition"
                          >
                            {abierto ? (
                              <>
                                Ocultar <ChevronUpIcon className="h-3.5 w-3.5" />
                              </>
                            ) : (
                              <>
                                Ver ({grupo.cantidadTotal}) <ChevronDownIcon className="h-3.5 w-3.5" />
                              </>
                            )}
                          </button>
                        </td>
                      </tr>

                      {/* Sub-tabla desplegable con los pacientes de este médico */}
                      {abierto && (
                        <tr>
                          <td colSpan={7} className="bg-indigo-50/30 px-6 py-4 border-b border-indigo-100">
                            <div className="bg-white rounded-xl border border-indigo-100 shadow-sm overflow-hidden">
                              <div className="bg-indigo-100/60 px-4 py-2.5 flex items-center justify-between">
                                <span className="text-xs font-extrabold text-indigo-900 uppercase">
                                  Pacientes enviados por {grupo.nombre} ({grupo.pacientes.length})
                                </span>
                              </div>
                              <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-100 text-xs">
                                  <thead className="bg-gray-50">
                                    <tr>
                                      <th className="px-3 py-2 text-left font-bold text-gray-600">
                                        Paciente
                                      </th>
                                      <th className="px-3 py-2 text-left font-bold text-gray-600">
                                        Documento
                                      </th>
                                      <th className="px-3 py-2 text-left font-bold text-gray-600">
                                        Módulo
                                      </th>
                                      <th className="px-3 py-2 text-left font-bold text-gray-600">
                                        Madre / Contacto
                                      </th>
                                      <th className="px-3 py-2 text-left font-bold text-gray-600">
                                        Teléfono
                                      </th>
                                      <th className="px-3 py-2 text-left font-bold text-gray-600">
                                        Aseguradora
                                      </th>
                                      <th className="px-3 py-2 text-center font-bold text-gray-600">
                                        Ficha
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-gray-100">
                                    {grupo.pacientes.map((pac) => (
                                      <tr key={pac.id} className="hover:bg-gray-50">
                                        <td className="px-3 py-2 font-bold text-gray-800">
                                          {pac.nombreCompleto}
                                        </td>
                                        <td className="px-3 py-2 font-mono text-gray-600">
                                          {pac.tipoDocumento} {pac.documento}
                                        </td>
                                        <td className="px-3 py-2 text-gray-600">
                                          {pac.modulo}
                                        </td>
                                        <td className="px-3 py-2 text-gray-600">
                                          {pac.madre || "-"}
                                        </td>
                                        <td className="px-3 py-2 text-gray-600">
                                          {pac.telefono}
                                        </td>
                                        <td className="px-3 py-2 text-indigo-700 font-semibold">
                                          {pac.aseguradora}
                                        </td>
                                        <td className="px-3 py-2 text-center">
                                          <button
                                            type="button"
                                            onClick={() => navigate(`/pacientes/${pac.id}`)}
                                            className="inline-flex items-center gap-1 bg-indigo-600 hover:bg-indigo-700 text-white px-2.5 py-1 rounded text-xs font-bold"
                                          >
                                            <EyeIcon className="h-3.5 w-3.5" />
                                            Ver
                                          </button>
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Footer con resumen */}
      <div className="text-center text-gray-500 text-sm">
        Mostrando {gruposFiltrados.length} grupos de médicos ({gruposFiltrados.reduce((acc, g) => acc + g.cantidadTotal, 0)} pacientes)
        {mesSeleccionado !== "todos" && (
          <span className="ml-1 font-medium text-indigo-600">
            ({mesesDisponibles.find((m) => m.key === mesSeleccionado)?.label || mesSeleccionado})
          </span>
        )}
      </div>
    </div>
  );
}
