import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiRequest } from "../../config/api";
import Swal from "sweetalert2";

/**
 * TablaDinamica: Componente unificado para listar registros con filtros, paginación local o de servidor y acciones integradas.
 * 
 * Props:
 * @param {string} titulo - Título de la tabla.
 * @param {string} endpoint - URL base sugerida para obtener los datos. 
 * @param {Array} columnas - Array de configuraciones de columnas: [{ header: "Nombre", accessor: "nombres", format: (val)=>val }]
 * @param {string} keyGetter - Función opcional para extraer el ID del objeto (default: cb(row) => row._id)
 * @param {Object} acciones - Mapeo de booleanos o URLs { crear: "/registro", ver: "/pacientes/", editar: "/pacientes/editar/", eliminar: true }
 * @param {function} onCargarData - Si se provee, la tabla delega la carga en el padre pasándole {busqueda, filtroExtra}. Si no, la tabla hace el fetch internamente.
 * @param {Object} filtrosExtras - Permite inyectar filtros extra como Selects o inputs de fecha
 */
export default function TablaDinamica({
    titulo,
    endpoint,
    columnas,
    acciones,
    onCargarData,
    filtrosExtras = null,
    keyGetter = (row) => row._id || row.id
}) {
    const navigate = useNavigate();
    const [datos, setDatos] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(null);

    // Estados de Búsqueda y Filtros
    const [busqueda, setBusqueda] = useState("");
    const [filtroExtraValores, setFiltroExtraValores] = useState({});

    // Paginación Básica Local (si el endpoint retorna un arreglo plano)
    const [paginaActiva, setPaginaActiva] = useState(1);
    const itemsPorPagina = 10;

    const cargarDatos = async () => {
        setCargando(true);
        setError(null);
        try {
            if (onCargarData) {
                // Modo delegado: el padre se encarga (ideal para SSR pagination)
                const response = await onCargarData({ busqueda, ...filtroExtraValores });
                setDatos(response);
            } else {
                // Modo interno: asume que es una lista plana
                let targetUrl = `${endpoint}`;
                if (busqueda) {
                    targetUrl = `${endpoint}/buscar?q=${encodeURIComponent(busqueda)}`;
                }
                const data = await apiRequest(targetUrl);
                setDatos(Array.isArray(data) ? data : (data.data || []));
            }
        } catch (err) {
            console.error(err);
            setError("No se pudieron cargar los registros.");
        } finally {
            setCargando(false);
        }
    };

    useEffect(() => {
        cargarDatos();
        // eslint-disable-next-line
    }, [endpoint, filtroExtraValores]);

    const handleEliminar = async (id) => {
        const result = await Swal.fire({
            title: '¿Estás seguro?',
            text: "Esta acción no se puede deshacer",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#9ca3af',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        });

        if (result.isConfirmed) {
            try {
                await apiRequest(`${endpoint}/${id}`, { method: "DELETE" });
                Swal.fire('Eliminado!', 'El registro ha sido eliminado.', 'success');
                cargarDatos();
            } catch (e) {
                Swal.fire('Error', e.message || "No se pudo eliminar el registro", 'error');
            }
        }
    };

    // Lógica de filtrado local si onCargarData no controla la búsqueda
    let datosAMostrar = datos;
    if (!onCargarData && busqueda) {
        datosAMostrar = datosAMostrar.filter(item =>
            JSON.stringify(item).toLowerCase().includes(busqueda.toLowerCase())
        );
    }

    // Lógica de Paginación Local
    const indUltimo = paginaActiva * itemsPorPagina;
    const indPrimero = indUltimo - itemsPorPagina;
    const datosPaginados = onCargarData ? datosAMostrar : datosAMostrar.slice(indPrimero, indUltimo);
    const totalPaginas = Math.ceil(datosAMostrar.length / itemsPorPagina);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-10 px-4">
            <div className="w-full max-w-6xl bg-white rounded-3xl shadow-xl p-8 border border-indigo-100">

                {/* Header y Botón Creación */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4 border-b border-indigo-100 pb-4">
                    <h1 className="text-3xl font-extrabold text-indigo-800 drop-shadow-sm">{titulo}</h1>
                    {acciones?.crear && (
                        <button
                            onClick={() => navigate(acciones.crear)}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-bold shadow-md transition-all flex items-center gap-2"
                        >
                            <span>+ Nuevo Registro</span>
                        </button>
                    )}
                </div>

                {/* Barra de Filtros */}
                <div className="bg-indigo-50/50 p-4 rounded-xl flex flex-wrap items-center gap-4 mb-6 border border-indigo-100 shadow-sm">
                    <div className="flex-1 min-w-[250px] relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-400">🔍</span>
                        <input
                            type="text"
                            placeholder="Buscar (ej. cédula, nombre...)"
                            value={busqueda}
                            onChange={(e) => {
                                setBusqueda(e.target.value);
                                setPaginaActiva(1);
                                if (!onCargarData && e.target.value === "") cargarDatos();
                            }}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') cargarDatos();
                            }}
                            className="w-full pl-10 pr-4 py-2 border border-indigo-200 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 outline-none transition"
                        />
                    </div>

                    {/* Renderizar filtros extras si existen  */}
                    {filtrosExtras && filtrosExtras.map((filtro, i) => (
                        <div key={i} className="flex items-center gap-2">
                            <label className="text-sm font-semibold text-gray-700">{filtro.label}</label>
                            {filtro.type === "select" ? (
                                <select
                                    className="border border-indigo-200 rounded-lg px-3 py-2 bg-white focus:ring-indigo-400 outline-none text-sm"
                                    value={filtroExtraValores[filtro.name] || ""}
                                    onChange={(e) => setFiltroExtraValores({ ...filtroExtraValores, [filtro.name]: e.target.value })}
                                >
                                    <option value="">{filtro.placeholder || "Todos"}</option>
                                    {filtro.options.map(o => <option key={o.valor} value={o.valor}>{o.etiqueta}</option>)}
                                </select>
                            ) : (
                                <input
                                    type={filtro.type}
                                    className="border border-indigo-200 rounded-lg px-3 py-2 bg-white focus:ring-indigo-400 outline-none text-sm"
                                    value={filtroExtraValores[filtro.name] || ""}
                                    onChange={(e) => setFiltroExtraValores({ ...filtroExtraValores, [filtro.name]: e.target.value })}
                                />
                            )}
                        </div>
                    ))}

                    <button onClick={() => cargarDatos()} className="px-4 py-2 bg-white border border-indigo-300 text-indigo-700 font-bold rounded-lg hover:bg-indigo-50 transition shadow-sm text-sm">
                        Buscar
                    </button>
                </div>

                {/* Tabla */}
                <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
                    {cargando ? (
                        <div className="flex flex-col items-center justify-center p-12 text-indigo-600">
                            <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-indigo-600 border-b-4 border-transparent mb-4"></div>
                            <span className="font-bold text-lg animate-pulse">Cargando registros...</span>
                        </div>
                    ) : error ? (
                        <div className="p-10 text-center text-red-500 font-bold bg-red-50">{error}</div>
                    ) : datosPaginados.length === 0 ? (
                        <div className="p-12 text-center text-gray-500 font-medium">No se encontraron registros que coincidan con la búsqueda.</div>
                    ) : (
                        <table className="min-w-full text-sm">
                            <thead className="bg-indigo-600 text-white rounded-t-xl">
                                <tr>
                                    {columnas.map((col, i) => (
                                        <th key={i} className="px-5 py-4 text-left font-bold tracking-wider">{col.header}</th>
                                    ))}
                                    {acciones && (acciones.ver || acciones.editar || acciones.eliminar) && (
                                        <th className="px-5 py-4 text-center font-bold tracking-wider rounded-tr-xl">Acciones</th>
                                    )}
                                </tr>
                            </thead>
                            <tbody className="bg-white text-gray-700">
                                {datosPaginados.map((row, rIdx) => {
                                    const idRow = keyGetter(row);
                                    return (
                                        <tr
                                            key={idRow}
                                            className={`border-b last:border-b-0 hover:bg-indigo-50/50 transition-colors ${rIdx % 2 === 0 ? 'bg-gray-50/30' : ''}`}
                                        >
                                            {columnas.map((col, cIdx) => (
                                                <td key={cIdx} className="px-5 py-4 whitespace-nowrap">
                                                    {col.format ? col.format(row[col.accessor], row) : row[col.accessor]}
                                                </td>
                                            ))}

                                            {acciones && (acciones.ver || acciones.editar || acciones.eliminar) && (
                                                <td className="px-5 py-4 text-center whitespace-nowrap">
                                                    <div className="flex items-center justify-center gap-2">
                                                        {acciones.ver && (
                                                            <button
                                                                onClick={() => navigate(`${acciones.ver}${idRow}`)}
                                                                className="p-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition tooltip-trigger"
                                                                title="Ver Detalles"
                                                            >
                                                                👁️
                                                            </button>
                                                        )}
                                                        {acciones.editar && (
                                                            <button
                                                                onClick={() => navigate(`${acciones.editar}${idRow}`)}
                                                                className="p-2 bg-amber-100 text-amber-700 rounded-lg hover:bg-amber-200 transition"
                                                                title="Editar"
                                                            >
                                                                ✏️
                                                            </button>
                                                        )}
                                                        {acciones.eliminar && (
                                                            <button
                                                                onClick={() => handleEliminar(idRow)}
                                                                className="p-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition"
                                                                title="Eliminar permanentemente"
                                                            >
                                                                🗑️
                                                            </button>
                                                        )}
                                                    </div>
                                                </td>
                                            )}
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    )}
                </div>

                {/* Paginación Local Footer */}
                {!cargando && !onCargarData && totalPaginas > 1 && (
                    <div className="flex items-center justify-between mt-6 bg-white p-4 border border-gray-200 rounded-xl shadow-sm">
                        <span className="text-sm text-gray-500">
                            Mostrando <span className="font-bold text-gray-800">{indPrimero + 1}</span> a <span className="font-bold text-gray-800">{Math.min(indUltimo, datosAMostrar.length)}</span> de <span className="font-bold text-gray-800">{datosAMostrar.length}</span> registros
                        </span>
                        <div className="flex gap-2">
                            <button
                                disabled={paginaActiva === 1}
                                onClick={() => setPaginaActiva(p => p - 1)}
                                className="px-4 py-2 border rounded-lg disabled:opacity-50 disabled:bg-gray-100 hover:bg-indigo-50 font-medium text-gray-700 transition"
                            >
                                Anterior
                            </button>
                            <div className="flex gap-1 items-center px-2">
                                {Array.from({ length: totalPaginas }, (_, i) => i + 1).map(pag => (
                                    <button
                                        key={pag}
                                        onClick={() => setPaginaActiva(pag)}
                                        className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm transition ${paginaActiva === pag ? 'bg-indigo-600 text-white' : 'hover:bg-indigo-100 text-gray-600'}`}
                                    >
                                        {pag}
                                    </button>
                                ))}
                            </div>
                            <button
                                disabled={paginaActiva === totalPaginas}
                                onClick={() => setPaginaActiva(p => p + 1)}
                                className="px-4 py-2 border rounded-lg disabled:opacity-50 disabled:bg-gray-100 hover:bg-indigo-50 font-medium text-gray-700 transition"
                            >
                                Siguiente
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
