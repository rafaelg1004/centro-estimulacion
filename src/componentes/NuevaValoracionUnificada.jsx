import React, { useState, useEffect } from "react";
import DynamicFormBuilder from "./ui/DynamicFormBuilder";
import { ESQUEMA_VALORACION_PEDIATRIA } from "../config/esquemaValoracionPediatria";
import { ESQUEMA_VALORACION_LACTANCIA_PRENATAL } from "../config/esquemaValoracionLactanciaPrenatal";
import { ESQUEMA_VALORACION_LACTANCIA_POSTPARTO } from "../config/esquemaValoracionLactanciaPostparto";
import { ESQUEMA_VALORACION_PISO_PELVICO } from "../config/esquemaValoracionPisoPelvico";
import { ESQUEMA_VALORACION_PERINATAL } from "../config/esquemaValoracionPerinatal";
import { apiRequest } from "../config/api";
import { useNavigate, useLocation } from "react-router-dom";

export default function NuevaValoracionUnificada() {
    const { search } = useLocation();
    const query = new URLSearchParams(search);
    const paramPacienteId = query.get("paciente");
    const paramTipo = query.get("tipo");

    const [pacienteId, setPacienteId] = useState(paramPacienteId || null);
    const [pacientes, setPacientes] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [filtro, setFiltro] = useState("");
    const [tipoValoracionAdulto, setTipoValoracionAdulto] = useState(paramTipo || null); // 'lactancia', 'pisopelvico', 'perinatal'
    const [subTipoLactancia, setSubTipoLactancia] = useState(null); // 'prenatal', 'postparto'
    const navigate = useNavigate();

    // Paso 1: Cargar pacientes
    useEffect(() => {
        apiRequest("/pacientes")
            .then((data) => {
                const combinados = Array.isArray(data) ? data.map(p => ({
                    ...p,
                    tipoModulo: p.esAdulto ? 'adulto' : 'pediatria'
                })) : [];
                combinados.sort((a, b) => (a.nombres || "").localeCompare(b.nombres || ""));
                setPacientes(combinados);
                setCargando(false);
            })
            .catch(err => {
                console.error("Error cargando pacientes:", err);
                setCargando(false);
            });
    }, []);

    const calcularEdad = (fechaNac) => {
        if (!fechaNac) return "N/A";
        const hoy = new Date();
        const cumple = new Date(fechaNac);

        let edadAnos = hoy.getFullYear() - cumple.getFullYear();
        let edadMeses = hoy.getMonth() - cumple.getMonth();

        if (hoy.getDate() < cumple.getDate()) {
            edadMeses--;
        }

        if (edadMeses < 0) {
            edadAnos--;
            edadMeses += 12;
        }

        if (edadAnos < 2) {
            const totalMeses = (edadAnos * 12) + edadMeses;
            return `${edadAnos} años (${totalMeses} meses)`;
        }

        return `${edadAnos} años`;
    };

    const pacientesFiltrados = pacientes.filter(p =>
        (p.nombres?.toLowerCase().includes(filtro.toLowerCase())) ||
        (p.apellidos?.toLowerCase().includes(filtro.toLowerCase())) ||
        (p.numDocumentoIdentificacion?.includes(filtro))
    );

    const pacienteElegido = pacientes.find(p => p._id === pacienteId);

    // Pantalla de carga
    if (pacienteId && cargando) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 py-10">
                <div className="text-center text-indigo-500 font-bold animate-pulse text-xl">
                    🔄 Sincronizando expediente médico...
                </div>
            </div>
        );
    }

    // Selección de tipo de valoración para adultos
    if (pacienteId && pacienteElegido && pacienteElegido.tipoModulo === 'adulto' && !tipoValoracionAdulto) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 py-10 px-2">
                <div className="w-full max-w-2xl bg-white p-10 rounded-3xl shadow-xl border border-indigo-100 flex flex-col items-center">
                    <button onClick={() => setPacienteId(null)} className="self-start text-indigo-600 mb-6 hover:underline font-bold">← Atrás</button>
                    <h2 className="text-3xl font-extrabold text-pink-700 mb-8 text-center uppercase tracking-tighter">Tipo de Atención (Materna)</h2>
                    <p className="text-gray-600 mb-8 text-center text-lg">Paciente: <strong>{pacienteElegido.nombres} {pacienteElegido.apellidos}</strong></p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
                        <button
                            onClick={() => setTipoValoracionAdulto('perinatal')}
                            className="bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 p-6 rounded-2xl shadow-sm hover:shadow transition-all flex flex-col items-center gap-4 text-indigo-800 font-bold"
                        >
                            <span className="text-4xl text-indigo-500">🤰</span>
                            Perinatal
                        </button>
                        <button
                            onClick={() => setTipoValoracionAdulto('lactancia')}
                            className="bg-pink-50 hover:bg-pink-100 border border-pink-200 p-6 rounded-2xl shadow-sm hover:shadow transition-all flex flex-col items-center gap-4 text-pink-800 font-bold"
                        >
                            <span className="text-4xl">🍼</span>
                            Lactancia
                        </button>
                        <button
                            onClick={() => setTipoValoracionAdulto('pisopelvico')}
                            className="bg-orange-50 hover:bg-orange-100 border border-orange-200 p-6 rounded-2xl shadow-sm hover:shadow transition-all flex flex-col items-center gap-4 text-orange-800 font-bold text-center"
                        >
                            <span className="text-4xl text-orange-500">🧘‍♀️</span>
                            Piso Pélvico
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Sub-paso Lactancia: Elegir entre Prenatal y Postparto
    if (pacienteId && pacienteElegido?.tipoModulo === 'adulto' && tipoValoracionAdulto === 'lactancia' && !subTipoLactancia) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 py-10 px-4">
                <div className="w-full max-w-4xl bg-white p-8 md:p-12 rounded-[3rem] shadow-2xl border border-indigo-50">
                    <div className="text-center mb-10">
                        <span className="bg-indigo-100 text-indigo-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest mb-4 inline-block">Asesoría Profesional</span>
                        <h2 className="text-4xl font-extrabold text-indigo-900 tracking-tighter">Programa de Lactancia</h2>
                        <p className="text-slate-400 mt-2 font-medium">Selecciona la etapa de la valoración para cargar el formulario correcto.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
                        <button
                            onClick={() => setSubTipoLactancia('prenatal')}
                            className="bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 p-8 rounded-3xl shadow-sm hover:shadow-xl transition-all flex flex-col items-center gap-4 text-indigo-800 font-bold group"
                        >
                            <span className="text-5xl group-hover:scale-110 transition-transform">🤰</span>
                            <div className="text-center">
                                <div className="text-lg">Ingreso / Prenatal</div>
                                <div className="text-[10px] text-indigo-400 uppercase tracking-widest font-black mt-1">Antes del nacimiento</div>
                            </div>
                        </button>
                        <button
                            onClick={() => setSubTipoLactancia('postparto')}
                            className="bg-pink-50 hover:bg-pink-100 border border-pink-200 p-8 rounded-3xl shadow-sm hover:shadow-xl transition-all flex flex-col items-center gap-4 text-pink-800 font-bold group"
                        >
                            <span className="text-5xl group-hover:scale-110 transition-transform">👶🍼</span>
                            <div className="text-center">
                                <div className="text-lg">Control / Postparto</div>
                                <div className="text-[10px] text-pink-400 uppercase tracking-widest font-black mt-1">Lactancia en curso</div>
                            </div>
                        </button>
                    </div>

                    <div className="mt-8 flex justify-center">
                        <button
                            onClick={() => { setTipoValoracionAdulto(null); setSubTipoLactancia(null); }}
                            className="text-gray-400 font-black text-[10px] uppercase tracking-widest hover:text-indigo-600 transition-colors"
                        >
                            ← Volver a servicios
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Formulario de Valoración (Header Fijo + Form Builder)
    if (pacienteId && pacienteElegido && (pacienteElegido.tipoModulo === 'pediatria' || (tipoValoracionAdulto && (tipoValoracionAdulto !== 'lactancia' || subTipoLactancia)))) {

        let esquemaActivo = ESQUEMA_VALORACION_PEDIATRIA;
        if (pacienteElegido?.tipoModulo === 'adulto') {
            if (tipoValoracionAdulto === 'lactancia') {
                esquemaActivo = subTipoLactancia === 'prenatal' ? ESQUEMA_VALORACION_LACTANCIA_PRENATAL : ESQUEMA_VALORACION_LACTANCIA_POSTPARTO;
            }
            if (tipoValoracionAdulto === 'pisopelvico') esquemaActivo = ESQUEMA_VALORACION_PISO_PELVICO;
            if (tipoValoracionAdulto === 'perinatal') esquemaActivo = ESQUEMA_VALORACION_PERINATAL;
        }

        let tipoProgramaStr = "Pediatría";
        if (pacienteElegido?.tipoModulo === 'adulto') {
            if (tipoValoracionAdulto === 'lactancia') tipoProgramaStr = subTipoLactancia === 'prenatal' ? "Lactancia (Prenatal)" : "Lactancia (Postparto)";
            if (tipoValoracionAdulto === 'pisopelvico') tipoProgramaStr = "Piso Pélvico";
            if (tipoValoracionAdulto === 'perinatal') tipoProgramaStr = "Perinatal";
        }

        const esquemaConPaciente = {
            ...esquemaActivo,
            secciones: esquemaActivo.secciones.map((sec, idx) => {
                if (idx === 0) {
                    return {
                        ...sec,
                        campos: [
                            { nombre: "paciente", tipo: "hidden", valorPorDefecto: pacienteId },
                            { nombre: "tipoPrograma", tipo: "hidden", valorPorDefecto: tipoProgramaStr },
                            ...sec.campos
                        ]
                    };
                }

                if (sec.titulo.includes("Firmas") || sec.titulo.includes("Consentimiento")) {
                    return {
                        ...sec,
                        campos: sec.campos.map(campo => {
                            if (campo.nombre === "firmas.pacienteOAcudiente.nombre") {
                                return { ...campo, valorPorDefecto: `${pacienteElegido.nombres} ${pacienteElegido.apellidos}` };
                            }
                            if (campo.nombre === "firmas.pacienteOAcudiente.cedula") {
                                return { ...campo, valorPorDefecto: pacienteElegido.numDocumentoIdentificacion };
                            }
                            return campo;
                        })
                    };
                }

                return sec;
            })
        };

        return (
            <div className="min-h-screen bg-gray-50/50">
                <div className="sticky top-0 z-[60] bg-white/90 backdrop-blur-md border-b border-indigo-100 shadow-sm px-6 py-3 mb-6">
                    <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className={`h-12 w-12 rounded-2xl flex items-center justify-center text-2xl shadow-inner ${pacienteElegido.tipoModulo === 'pediatria' ? 'bg-indigo-50 text-indigo-500' : 'bg-pink-50 text-pink-500'}`}>
                                {pacienteElegido.tipoModulo === 'pediatria' ? '👶' : '🤰'}
                            </div>
                            <div>
                                <h2 className="text-xl font-black text-gray-800 leading-tight uppercase tracking-tight">
                                    {pacienteElegido.nombres} {pacienteElegido.apellidos}
                                </h2>
                                <p className="text-[11px] font-bold text-indigo-400 tracking-widest uppercase">
                                    {pacienteElegido.tipoDocumentoIdentificacion || "HC"}: {pacienteElegido.numDocumentoIdentificacion} • {pacienteElegido.tipoModulo === 'pediatria' ? 'PROGRAMA PEDIÁTRICO' : 'PROGRAMA MATERNO'}
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-x-8 gap-y-2 text-xs">
                            <div className="flex flex-col">
                                <span className="text-gray-400 font-bold uppercase text-[9px]">Edad / Sexo</span>
                                <span className="font-bold text-gray-700">{calcularEdad(pacienteElegido.fechaNacimiento)} • {pacienteElegido.codSexo === 'M' ? 'Masc' : 'Fem'}</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-gray-400 font-bold uppercase text-[9px]">Contacto</span>
                                <span className="font-bold text-gray-700">📞 {pacienteElegido.datosContacto?.telefono || "N/A"}</span>
                            </div>
                            {pacienteElegido.tipoModulo === 'pediatria' ? (
                                <div className="flex flex-col">
                                    <span className="text-gray-400 font-bold uppercase text-[9px]">Pediatra / Madre</span>
                                    <span className="font-bold text-gray-700">{pacienteElegido.pediatra || "S.D"} • {pacienteElegido.nombreMadre || "S.D"}</span>
                                </div>
                            ) : (
                                <div className="flex flex-col">
                                    <span className="text-gray-400 font-bold uppercase text-[9px]">Gestación / FUM</span>
                                    <span className="font-bold text-gray-700">Sem: {pacienteElegido.semanasGestacion || "N/A"} • FUM: {pacienteElegido.fum || "N/A"}</span>
                                </div>
                            )}
                            <div className="flex flex-col">
                                <span className="text-gray-400 font-bold uppercase text-[9px]">Aseguradora</span>
                                <span className="font-bold text-indigo-600 underline"> {pacienteElegido.aseguradora || "Particular"}</span>
                            </div>
                        </div>

                        <button
                            onClick={() => { setPacienteId(null); setTipoValoracionAdulto(null); setSubTipoLactancia(null); }}
                            className="bg-white border border-gray-200 text-gray-500 hover:text-indigo-600 px-3 py-1.5 rounded-xl text-[10px] font-black shadow-sm transition-all hover:border-indigo-200 uppercase tracking-tighter"
                        >
                            Cambiar Paciente
                        </button>
                    </div>
                </div>

                <div className="px-4 pb-20">
                    <DynamicFormBuilder
                        esquema={esquemaConPaciente}
                        pacienteId={pacienteId}
                        onSubmitSuccess={() => {
                            if (tipoValoracionAdulto === 'perinatal') {
                                navigate(`/pacientes/${pacienteId}/sesiones-perinatal`);
                            } else {
                                navigate(esquemaConPaciente.redireccion || "/valoraciones");
                            }
                        }}
                    />
                </div>
            </div>
        );
    }

    // Vista Inicial: Buscador de Pacientes
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-10 px-4">
            <div className="w-full max-w-3xl bg-white p-8 md:p-12 rounded-3xl shadow-2xl border border-indigo-100">
                <h2 className="text-4xl font-extrabold text-indigo-800 mb-4 text-center tracking-tight">Historia Clínica Digital</h2>
                <p className="text-slate-500 text-center mb-8 text-lg">Busca el paciente registrado al cual se le abrirá el expediente médico.</p>

                <div className="relative mb-8">
                    <input
                        type="text"
                        placeholder="🔍 Buscar por nombre o identificación..."
                        value={filtro}
                        onChange={(e) => setFiltro(e.target.value)}
                        className="w-full px-8 py-5 rounded-[2rem] border-2 border-indigo-50 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 bg-indigo-50/10 text-xl shadow-inner outline-none transition-all placeholder:text-indigo-200 font-medium"
                    />
                </div>

                {cargando ? (
                    <div className="flex flex-col items-center gap-4 py-12">
                        <div className="h-12 w-12 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
                        <div className="text-indigo-400 font-black tracking-widest text-xs uppercase animate-pulse text-center">Sincronizando Base de Datos...</div>
                    </div>
                ) : (
                    <div className="flex flex-col gap-4 max-h-[500px] overflow-y-auto pr-3 custom-scrollbar">
                        {pacientesFiltrados.length === 0 ? (
                            <div className="text-center py-16 bg-gray-50 text-gray-400 rounded-3xl border-2 border-dashed">
                                No se encontraron pacientes registrados.
                            </div>
                        ) : (
                            pacientesFiltrados.map(p => (
                                <button
                                    key={p._id}
                                    onClick={() => setPacienteId(p._id)}
                                    className="flex justify-between items-center bg-white border border-gray-100 p-6 rounded-[2rem] shadow-sm hover:shadow-xl hover:border-indigo-400 transition-all text-left group relative overflow-hidden"
                                >
                                    <div className="absolute top-0 left-0 w-2 h-full bg-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                    <div>
                                        <div className="font-black text-gray-800 text-2xl mb-1 group-hover:text-indigo-700 tracking-tighter uppercase">{p.nombres} {p.apellidos}</div>
                                        <div className="text-xs font-bold text-gray-400 tracking-widest uppercase">
                                            ID: <span className="text-gray-500">{p.numDocumentoIdentificacion || "N/A"}</span> •
                                            EDAD: <span className="text-gray-500">{calcularEdad(p.fechaNacimiento)}</span>
                                        </div>
                                    </div>
                                    <div className={`p-4 rounded-2xl font-black text-[10px] tracking-widest uppercase shadow-inner ${p.tipoModulo === 'pediatria' ? 'bg-indigo-50 text-indigo-500' : 'bg-pink-50 text-pink-500'}`}>
                                        {p.tipoModulo === 'pediatria' ? '🧸 Niño' : '🤰 Madre'}
                                    </div>
                                </button>
                            ))
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
