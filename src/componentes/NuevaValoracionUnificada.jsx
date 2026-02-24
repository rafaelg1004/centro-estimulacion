import React, { useState, useEffect } from "react";
import DynamicFormBuilder from "./ui/DynamicFormBuilder";
import { ESQUEMA_VALORACION_PEDIATRIA } from "../config/esquemaValoracionPediatria";
import { ESQUEMA_VALORACION_LACTANCIA } from "../config/esquemaValoracionLactancia";
import { ESQUEMA_VALORACION_PISO_PELVICO } from "../config/esquemaValoracionPisoPelvico";
import { ESQUEMA_CONSENTIMIENTO_PERINATAL } from "../config/esquemaConsentimientoPerinatal";
import { apiRequest } from "../config/api";
import { useNavigate } from "react-router-dom";

export default function NuevaValoracionUnificada() {
    const [pacienteId, setPacienteId] = useState(null);
    const [pacientes, setPacientes] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [filtro, setFiltro] = useState("");
    const [tipoValoracionAdulto, setTipoValoracionAdulto] = useState(null); // 'lactancia', 'pisopelvico', 'perinatal'
    const navigate = useNavigate();

    // Paso 1: Cargar pacientes
    useEffect(() => {
        Promise.all([
            apiRequest("/pacientes").catch(() => []),
            apiRequest("/pacientes-adultos").catch(() => [])
        ])
            .then(([ninos, adultos]) => {
                const combinados = [
                    ...(Array.isArray(ninos) ? ninos.map(p => ({ ...p, tipoModulo: 'pediatria' })) : []),
                    ...(Array.isArray(adultos) ? adultos.map(p => ({ ...p, tipoModulo: 'adulto' })) : [])
                ];
                combinados.sort((a, b) => (a.nombres || "").localeCompare(b.nombres || ""));
                setPacientes(combinados);
                setCargando(false);
            });
    }, []);

    const pacientesFiltrados = pacientes.filter(p =>
        (p.nombres?.toLowerCase().includes(filtro.toLowerCase())) ||
        (p.cedula?.includes(filtro)) ||
        (p.registroCivil?.includes(filtro))
    );

    // Si ya tenemos seleccionado a un paciente adulto, y aun NO elige el tipo de historia
    const pacienteElegido = pacientes.find(p => p._id === pacienteId);

    if (pacienteId && pacienteElegido?.tipoModulo === 'adulto' && !tipoValoracionAdulto) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 py-10 px-2">
                <div className="w-full max-w-2xl bg-white p-10 rounded-3xl shadow-xl border border-indigo-100 flex flex-col items-center">
                    <button onClick={() => setPacienteId(null)} className="self-start text-indigo-600 mb-6 hover:underline font-bold">← Atrás</button>
                    <h2 className="text-3xl font-extrabold text-pink-700 mb-8 text-center">Tipo de Atención (Materna)</h2>
                    <p className="text-gray-600 mb-8 text-center text-lg">Paciente: <strong>{pacienteElegido.nombres}</strong></p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
                        <button
                            onClick={() => setTipoValoracionAdulto('perinatal')}
                            className="bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 p-6 rounded-2xl shadow-sm hover:shadow transition-all flex flex-col items-center gap-4 text-indigo-800 font-bold"
                        >
                            <span className="text-4xl text-indigo-500">🤰</span>
                            Programa Perinatal
                        </button>
                        <button
                            onClick={() => setTipoValoracionAdulto('lactancia')}
                            className="bg-pink-50 hover:bg-pink-100 border border-pink-200 p-6 rounded-2xl shadow-sm hover:shadow transition-all flex flex-col items-center gap-4 text-pink-800 font-bold"
                        >
                            <span className="text-4xl">🍼</span>
                            Asesoría Lactancia
                        </button>
                        <button
                            onClick={() => setTipoValoracionAdulto('pisopelvico')}
                            className="bg-orange-50 hover:bg-orange-100 border border-orange-200 p-6 rounded-2xl shadow-sm hover:shadow transition-all flex flex-col items-center gap-4 text-orange-800 font-bold text-center"
                        >
                            <span className="text-4xl text-orange-500">🧘‍♀️</span>
                            Valoración Piso Pélvico
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Cuando ya seleccionó paciente Y tipo de historia (o si es niño entra directo a pediatría)
    if (pacienteId && (pacienteElegido?.tipoModulo === 'pediatria' || tipoValoracionAdulto)) {

        let esquemaActivo = ESQUEMA_VALORACION_PEDIATRIA;

        if (pacienteElegido?.tipoModulo === 'adulto') {
            if (tipoValoracionAdulto === 'lactancia') esquemaActivo = ESQUEMA_VALORACION_LACTANCIA;
            if (tipoValoracionAdulto === 'pisopelvico') esquemaActivo = ESQUEMA_VALORACION_PISO_PELVICO;
            if (tipoValoracionAdulto === 'perinatal') esquemaActivo = ESQUEMA_CONSENTIMIENTO_PERINATAL;
        }

        const esquemaConPaciente = {
            ...esquemaActivo,
            titulo: `${esquemaActivo.titulo} - ${pacienteElegido.nombres}`,
            secciones: [
                {
                    titulo: "Asignación de Paciente",
                    campos: [
                        { nombre: "paciente", etiqueta: "ID Interno del Paciente (Auto-asignado)", tipo: "text", lecsolo: true, valorPorDefecto: pacienteId }
                    ]
                },
                ...esquemaActivo.secciones
            ]
        };

        return (
            <div className="relative">
                <button
                    onClick={() => {
                        // Si elije regresar, resetear todo
                        setPacienteId(null);
                        setTipoValoracionAdulto(null);
                    }}
                    className="absolute top-4 left-4 z-10 bg-white bg-opacity-90 hover:bg-opacity-100 text-indigo-700 font-bold py-2 px-4 rounded-xl shadow border border-indigo-200 transition-all hidden md:flex"
                >
                    ← Cambiar Clínico / Paciente
                </button>
                <DynamicFormBuilder isPaginado={true} esquema={esquemaConPaciente} />
            </div>
        );
    }

    // Muestra Inicial: Buscador de Pacientes
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-10 px-4">
            <div className="w-full max-w-3xl bg-white p-8 md:p-12 rounded-3xl shadow-2xl border border-indigo-100">
                <h2 className="text-4xl font-extrabold text-indigo-800 mb-4 text-center">Abrir Historia Clínica</h2>
                <p className="text-slate-500 text-center mb-8 text-lg">Busca el paciente registrado al cual se le abrirá el expediente médico.</p>

                <input
                    type="text"
                    placeholder="🔍 Buscar por nombre, cédula o registro civil..."
                    value={filtro}
                    onChange={(e) => setFiltro(e.target.value)}
                    className="w-full px-6 py-4 rounded-xl border border-indigo-200 focus:ring-4 focus:ring-indigo-200 bg-indigo-50/20 text-lg shadow-sm mb-6 outline-none transition-all placeholder:text-indigo-300 placeholder:italic"
                />

                {cargando ? (
                    <div className="text-center text-indigo-500 font-bold py-10 animate-pulse">Cargando base de datos segura SSL...</div>
                ) : (
                    <div className="flex flex-col gap-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                        {pacientesFiltrados.length === 0 ? (
                            <div className="text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-300">
                                <p className="text-gray-500 mb-4 text-lg">No se encontraron pacientes con esa búsqueda.</p>
                                <button onClick={() => navigate("/registro")} className="text-indigo-600 font-bold hover:underline text-lg">Registrar Nuevo Paciente →</button>
                            </div>
                        ) : (
                            pacientesFiltrados.map(p => (
                                <button
                                    key={p._id}
                                    onClick={() => setPacienteId(p._id)}
                                    className="flex justify-between items-center bg-white border border-gray-100 p-5 rounded-2xl shadow-sm hover:shadow-md hover:border-indigo-300 transition-all text-left group"
                                >
                                    <div>
                                        <div className="font-bold text-gray-800 text-xl mb-1 group-hover:text-indigo-700">{p.nombres}</div>
                                        <div className="text-sm text-gray-500">Nro. Documento: <span className="font-semibold text-gray-700">{p.registroCivil || p.cedula || "N/A"}</span></div>
                                    </div>
                                    <span className={`px-4 py-2 text-sm font-extrabold rounded-full whitespace-nowrap ${p.tipoModulo === 'pediatria' ? 'bg-indigo-100 text-indigo-800' : 'bg-pink-100 text-pink-800'}`}>
                                        {p.tipoModulo === 'pediatria' ? '🧸 PEDIÁTRICO' : '🤰 MATERNA'}
                                    </span>
                                </button>
                            ))
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
