import React, { useState, useEffect, useRef } from "react";
import Swal from "sweetalert2";
import { apiRequest, API_CONFIG } from "../../config/api";
import { useNavigate } from "react-router-dom";
import SignaturePad from "react-signature-canvas";

// Sugerencias CIE-10 de fisioterapia que aparecen al enfocar el campo (sin escribir)
const CIE10_FISIO_SUGERENCIAS = [
    { codigo: "G809", descripcion: "PARALISIS CEREBRAL, NO ESPECIFICADA" },
    { codigo: "G800", descripcion: "PARALISIS CEREBRAL ESPASTICA" },
    { codigo: "G801", descripcion: "DIPLEJIA ESPASTICA" },
    { codigo: "G802", descripcion: "HEMIPLEJIA INFANTIL" },
    { codigo: "R627", descripcion: "RETRASO DEL DESARROLLO" },
    { codigo: "F840", descripcion: "AUTISMO EN LA NINEZ" },
    { codigo: "F900", descripcion: "PERTURBACION DE ACTIVIDAD Y ATENCION (TDAH)" },
    { codigo: "F82", descripcion: "TRASTORNO DEL DESARROLLO DE LA FUNCION MOTRIZ" },
    { codigo: "Q906", descripcion: "SINDROME DE DOWN, NO ESPECIFICADO" },
    { codigo: "Q650", descripcion: "LUXACION CONGENITA DE LA CADERA" },
    { codigo: "Q670", descripcion: "TORTICOLIS MUSCULAR CONGENITA" },
    { codigo: "Q660", descripcion: "PIE EQUINO VARO CONGENITO" },
    { codigo: "G710", descripcion: "DISTROFIA MUSCULAR" },
    { codigo: "G120", descripcion: "ATROFIA MUSCULAR ESPINAL INFANTIL" },
    { codigo: "M621", descripcion: "HIPOTONIA MUSCULAR" },
    { codigo: "P073", descripcion: "PREMATURO, NO ESPECIFICADO" },
    { codigo: "P219", descripcion: "ASFIXIA AL NACIMIENTO, NO ESPECIFICADA" },
    { codigo: "Z501", descripcion: "OTRO FISIOTERAPIA" },
    { codigo: "Z509", descripcion: "REHABILITACION, NO ESPECIFICADA" },
];


export default function DynamicFormBuilder({ esquema, onSubmitSuccess, onCancel, isPaginado = false, initialData = null, isModalLayout = false }) {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({});
    const [errores, setErrores] = useState("");
    const [guardando, setGuardando] = useState(false);
    const [pasoActual, setPasoActual] = useState(0);
    const [submitLocked, setSubmitLocked] = useState(false);
    const [cie10Search, setCie10Search] = useState({});
    const [cie10Open, setCie10Open] = useState({});
    const [cie10Results, setCie10Results] = useState({});
    const [cie10Loading, setCie10Loading] = useState({});
    const [cie10DropUp, setCie10DropUp] = useState({});
    const cie10Timers = useRef({});


    const isEdit = !!initialData;

    // Referencias para las firmas (Canvas)
    const signatureRefs = useRef({});

    // Cargar datos (initial o default)
    useEffect(() => {
        if (isEdit) {
            // Cuando editamos, intentamos aplanar los datos anidados para el formulario
            const flatData = {};
            const flatten = (obj, prefix = '') => {
                if (!obj) return;
                Object.keys(obj).forEach(key => {
                    const value = obj[key];
                    const fullKey = prefix ? `${prefix}.${key}` : key;
                    if (value && typeof value === 'object' && !Array.isArray(value) && !(value instanceof Date) && !String(value).startsWith('data:image') && !String(value).startsWith('http')) {
                        flatten(value, fullKey);
                    } else {
                        flatData[fullKey] = value;
                    }
                });
            };
            flatten(initialData);
            // Aplicar valorPorDefecto como fallback para campos no presentes en initialData (ej. campos de visualización del paciente)
            esquema.secciones.forEach(sec => {
                sec.campos.forEach(campo => {
                    if (flatData[campo.nombre] === undefined && campo.valorPorDefecto !== undefined) {
                        flatData[campo.nombre] = campo.valorPorDefecto;
                    }
                });
            });
            setFormData(flatData);
        } else {
            const defaultData = {};
            const nowLocal = new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000)
                .toISOString().substring(0, 16);

            esquema.secciones.forEach((seccion) => {
                seccion.campos.forEach((campo) => {
                    if (campo.autoNow && campo.tipo === 'datetime-local') {
                        defaultData[campo.nombre] = nowLocal;
                    } else if (campo.tipo === "checkbox") {
                        defaultData[campo.nombre] = campo.valorPorDefecto ?? false;
                    } else {
                        defaultData[campo.nombre] = campo.valorPorDefecto !== undefined ? campo.valorPorDefecto : "";
                    }
                    if (campo.tipo === "firma") {
                        signatureRefs.current[campo.nombre] = React.createRef();
                    }
                });
            });
            setFormData(defaultData);
        }
    }, [esquema, initialData, isEdit]);

    // Efecto para autocompletar descripciones CIE-10 que solo traen el código (retrocompatibilidad)
    useEffect(() => {
        const checkCie10Descriptions = async () => {
            const updates = {};
            let hasNew = false;

            for (const seccion of esquema.secciones) {
                for (const campo of seccion.campos) {
                    if (campo.tipo === "cie10") {
                        const val = formData[campo.nombre];
                        // Si tenemos algo pero no tiene el formato "COD - Desc" y no lo hemos buscado ya en este efecto
                        if (val && typeof val === 'string' && val.length > 0 && !val.includes(" - ") && !cie10Search[campo.nombre]) {
                            try {
                                const data = await apiRequest(`/cie10?q=${val}&limit=1`);
                                if (data && data.length > 0 && data[0].codigo.toUpperCase() === val.toUpperCase()) {
                                    const fullValue = `${data[0].codigo} - ${data[0].descripcion}`;
                                    updates[campo.nombre] = fullValue;
                                    hasNew = true;
                                }
                            } catch (e) {
                                console.warn("No se pudo obtener descripción para", val);
                            }
                        }
                    }
                }
            }

            if (hasNew) {
                setCie10Search(prev => ({ ...prev, ...updates }));
                setFormData(prev => ({ ...prev, ...updates }));
            }
        };

        if (Object.keys(formData).length > 0) {
            checkCie10Descriptions();
        }
    }, [formData, esquema]);

    // Auto-calcular IMC cuando cambian peso o talla
    useEffect(() => {
        if (Object.keys(formData).length === 0) return;
        const updates = {};
        esquema.secciones.forEach(sec => {
            sec.campos.forEach(campo => {
                if (campo.autoCalc?.formula === 'imc') {
                    const peso = parseFloat(formData[campo.autoCalc.peso]);
                    const talla = parseFloat(formData[campo.autoCalc.talla]);
                    const newVal = (peso > 0 && talla > 0)
                        ? (peso / Math.pow(talla / 100, 2)).toFixed(1)
                        : '';
                    if (formData[campo.nombre] !== newVal) {
                        updates[campo.nombre] = newVal;
                    }
                }
            });
        });
        if (Object.keys(updates).length > 0) {
            setFormData(prev => ({ ...prev, ...updates }));
        }
    }, [formData, esquema]);


    const calcularIMC = (nombre, valor, prevData) => {
        const updates = {};
        esquema.secciones.forEach(sec => {
            sec.campos.forEach(campo => {
                if (campo.autoCalc?.formula === 'imc' &&
                    (campo.autoCalc.peso === nombre || campo.autoCalc.talla === nombre)) {
                    const peso = parseFloat(campo.autoCalc.peso === nombre ? valor : prevData[campo.autoCalc.peso]);
                    const talla = parseFloat(campo.autoCalc.talla === nombre ? valor : prevData[campo.autoCalc.talla]);
                    updates[campo.nombre] = (peso > 0 && talla > 0)
                        ? (peso / Math.pow(talla / 100, 2)).toFixed(1)
                        : '';
                }
            });
        });
        return updates;
    };

    const handleChange = (e) => {
        const { name, type, checked, value } = e.target;
        const finalValue = type === "checkbox" ? checked : value;
        setFormData((prev) => {
            const imcUpdates = calcularIMC(name, finalValue, prev);
            return { ...prev, [name]: finalValue, ...imcUpdates };
        });
    };

    const handleCheckboxGroupChange = (nombreCampo, valor, checked) => {
        setFormData(prev => {
            const actual = prev[nombreCampo] || [];
            if (checked) {
                return { ...prev, [nombreCampo]: [...actual, valor] };
            } else {
                return { ...prev, [nombreCampo]: actual.filter(v => v !== valor) };
            }
        });
    };

    const handleClearSignature = (nombre) => {
        const sigPad = signatureRefs.current[nombre]?.current;
        if (sigPad) {
            sigPad.clear();
            setFormData(prev => ({ ...prev, [nombre]: "" }));
        }
    };

    const handleEndSignature = (nombre) => {
        const sigPad = signatureRefs.current[nombre]?.current;
        if (sigPad) {
            setFormData(prev => ({ ...prev, [nombre]: sigPad.toDataURL() }));
        }
    };

    const validarPasoActual = (validarTodo = false) => {
        let camposFaltantes = [];

        // Determinar qué secciones validar: solo el paso actual o todo el esquema
        const seccionesAValidar = validarTodo
            ? esquema.secciones
            : [esquema.secciones.filter(s => !s.siempreVisible)[pasoActual]].filter(Boolean);

        // También incluir siempre las secciones fijas (siempreVisible) si estamos validando por pasos
        const seccionesFijas = esquema.secciones.filter(s => s.siempreVisible);
        const setFinal = validarTodo ? seccionesAValidar : [...seccionesFijas, ...seccionesAValidar];

        setFinal.forEach((seccion) => {
            seccion.campos.forEach((campo) => {
                let visible = true;
                if (campo.dependeDe) {
                    visible = formData[campo.dependeDe.campo] === campo.dependeDe.valor;
                }
                if (visible && campo.requerido && !formData[campo.nombre]) {
                    camposFaltantes.push(campo.etiqueta);
                }
            });
        });

        if (camposFaltantes.length > 0) {
            setErrores(`Faltan campos obligatorios: ${camposFaltantes.join(", ")}`);
            return false;
        }
        setErrores("");
        return true;
    };

    const siguientePaso = () => {
        if (validarPasoActual()) {
            setPasoActual(p => Math.min(esquema.secciones.length - 1, p + 1));
            setSubmitLocked(true);
            setTimeout(() => setSubmitLocked(false), 500); // Bloqueo anti doble click
        }
    };

    const anteriorPaso = () => {
        setPasoActual(p => Math.max(0, p - 1));
    };

    const handleSubmit = async (e) => {
        if (e) e.preventDefault();
        if (guardando || submitLocked) return;

        // Al enviar, validamos TODO el formulario (todos los pasos + sidebar)
        if (!validarPasoActual(true)) return;

        try {
            console.log("🛠️ INICIANDO GUARDADO DE FORMULARIO DYNAMIC");
            setGuardando(true);

            // 1. Convertir y subir cualquier imagen base64 a S3
            const finalFormData = { ...formData };
            for (const key in finalFormData) {
                console.log(`🔎 Revisando campo: ${key}`);
                if (typeof finalFormData[key] === 'string' && finalFormData[key].startsWith('data:image')) {
                    console.log(`⚠️ Firma Base64 detectada en el campo: ${key}. Iniciando subida a S3...`);
                    try {
                        const base64Data = finalFormData[key];
                        const blob = await fetch(base64Data).then(r => r.blob());
                        const formDataUpload = new FormData();
                        formDataUpload.append('imagen', blob, `firma-${Date.now()}.png`);

                        const token = sessionStorage.getItem("token");
                        const uploadResponse = await fetch(`${API_CONFIG.BASE_URL}/api/upload`, {
                            method: 'POST',
                            headers: token ? { 'Authorization': `Bearer ${token}` } : {},
                            body: formDataUpload
                        });

                        console.log(`📥 Respuesta de subida para ${key}: status ${uploadResponse.status}`);

                        if (!uploadResponse.ok) {
                            const errResp = await uploadResponse.text();
                            console.error(`❌ Error en respuesta de S3:`, errResp);
                            throw new Error("Error al subir imagen");
                        }

                        const uploadData = await uploadResponse.json();
                        console.log(`✅ Firma subida a S3 correctamente, URL obtenida:`, uploadData.url);
                        finalFormData[key] = uploadData.url; // Reemplazar base64 con URL S3
                    } catch (uploadReqErr) {
                        console.error("❌ Fallo subida firma:", uploadReqErr);
                        Swal.fire("Error", "No se pudo subir una de las firmas. Intente de nuevo.", "error");
                        setGuardando(false);
                        return;
                    }
                }
            }
            console.log("🏁 Proceso de escaneo de firmas Base64 terminado.");

            // "Unflatten" dot notation keys into nested objects for the backend
            const unflattenedData = {};
            Object.keys(finalFormData).forEach(key => {
                const parts = key.split('.');
                let current = unflattenedData;
                for (let i = 0; i < parts.length; i++) {
                    const part = parts[i];
                    if (i === parts.length - 1) {
                        current[part] = finalFormData[key];
                    } else {
                        current[part] = current[part] || {};
                        current = current[part];
                    }
                }
            });

            const method = isEdit ? "PUT" : "POST";
            const endpoint = isEdit ? `${esquema.endpoint}/${initialData._id}` : esquema.endpoint;

            await apiRequest(endpoint, {
                method,
                body: JSON.stringify({ ...unflattenedData, permitirDuplicado: true })
            });

            Swal.fire("¡Éxito!", `${esquema.titulo} ${isEdit ? 'actualizado' : 'guardado'} correctamente.`, "success");
            if (onSubmitSuccess) {
                onSubmitSuccess();
            } else if (esquema.redireccion) {
                navigate(esquema.redireccion);
            }
        } catch (err) {
            setErrores(`Error: ${err.message}`);
        } finally {
            setGuardando(false);
        }
    };

    const renderCampo = (campo) => {
        let visible = true;
        if (campo.dependeDe) {
            visible = formData[campo.dependeDe.campo] === campo.dependeDe.valor;
        }
        if (!visible) return null;

        // Campo CIE-10 buscable (desde API MongoDB)
        if (campo.tipo === "cie10") {
            const query = cie10Search[campo.nombre] ?? (formData[campo.nombre] || "");
            const isOpen = cie10Open[campo.nombre];
            const results = cie10Results[campo.nombre] || [];
            const isLoading = cie10Loading[campo.nombre];

            const isDropUp = cie10DropUp[campo.nombre];

            const handleCie10Focus = async (e) => {
                setCie10Open(p => ({ ...p, [campo.nombre]: true }));

                // Determinar dirección si hay poco espacio abajo (250px es la altura max de la lista)
                if (e && e.target) {
                    const rect = e.target.getBoundingClientRect();
                    const spaceBelow = window.innerHeight - rect.bottom;
                    setCie10DropUp(p => ({ ...p, [campo.nombre]: spaceBelow < 250 }));
                }

                // Si no hay texto escrito ni resultados, cargar sugerencias de fisioterapia
                const currentQuery = cie10Search[campo.nombre];
                if (!currentQuery && (!cie10Results[campo.nombre] || cie10Results[campo.nombre].length === 0)) {
                    setCie10Results(p => ({ ...p, [campo.nombre]: CIE10_FISIO_SUGERENCIAS }));
                }
            };

            const handleCie10Change = (e) => {
                const val = e.target.value;
                setCie10Search(p => ({ ...p, [campo.nombre]: val }));
                setCie10Open(p => ({ ...p, [campo.nombre]: true }));
                if (!val) {
                    setFormData(prev => ({ ...prev, [campo.nombre]: "" }));
                    // Volver a mostrar sugerencias de fisio al borrar
                    setCie10Results(p => ({ ...p, [campo.nombre]: CIE10_FISIO_SUGERENCIAS }));
                    return;
                }
                // Debounce 300ms para buscar en API
                clearTimeout(cie10Timers.current[campo.nombre]);
                cie10Timers.current[campo.nombre] = setTimeout(async () => {
                    setCie10Loading(p => ({ ...p, [campo.nombre]: true }));
                    try {
                        const data = await apiRequest(`/cie10?q=${encodeURIComponent(val)}&limit=15`);
                        setCie10Results(p => ({ ...p, [campo.nombre]: data }));
                    } catch { /* silenciar */ }
                    setCie10Loading(p => ({ ...p, [campo.nombre]: false }));
                }, 300);
            };

            return (
                <div className="flex flex-col gap-1 relative">
                    <label className="text-sm font-semibold text-gray-700" htmlFor={campo.nombre}>
                        {campo.etiqueta} {campo.requerido && <span className="text-pink-600">*</span>}
                    </label>
                    <div className="relative">
                        <input
                            id={campo.nombre}
                            type="text"
                            placeholder={campo.placeholder || "Buscar código o descripción..."}
                            value={query}
                            onFocus={handleCie10Focus}
                            onBlur={() => setTimeout(() => setCie10Open(p => ({ ...p, [campo.nombre]: false })), 200)}
                            onChange={handleCie10Change}
                            className="px-4 py-3 rounded-xl border border-indigo-200 focus:ring-2 focus:ring-indigo-300 w-full"
                            autoComplete="off"
                        />
                        {isLoading && (
                            <span className="absolute right-3 top-3 text-indigo-400 text-xs">Buscando...</span>
                        )}
                    </div>
                    {formData[campo.nombre] && (
                        <span className="text-xs text-indigo-600 font-semibold">
                            ✓ <strong>{formData[campo.nombre]}</strong>
                        </span>
                    )}
                    {isOpen && results.length > 0 && (
                        <ul className={`absolute left-0 right-0 z-50 bg-white border border-indigo-200 rounded-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.2)] max-h-56 overflow-y-auto ${isDropUp ? 'bottom-full mb-1 shadow-[0_-10px_40px_-10px_rgba(0,0,0,0.2)]' : 'top-full mt-1'}`}>
                            {results.map(d => (
                                <li
                                    key={d.codigo}
                                    className="px-4 py-2 hover:bg-indigo-50 cursor-pointer text-sm border-b border-gray-100 last:border-0"
                                    onMouseDown={(e) => {
                                        e.preventDefault();
                                        const fullValue = `${d.codigo} - ${d.descripcion}`;
                                        setFormData(prev => ({ ...prev, [campo.nombre]: fullValue }));
                                        setCie10Search(p => ({ ...p, [campo.nombre]: fullValue }));
                                        setCie10Open(p => ({ ...p, [campo.nombre]: false }));
                                    }}
                                >
                                    <span className="font-bold text-indigo-700 mr-2">{d.codigo}</span>
                                    <span className="text-gray-600 text-xs">{d.descripcion}</span>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            );
        }

        // Campo CUPS buscable (Procedimientos, Consulta desde API Mongoose en Excel)
        if (campo.tipo === "cups") {
            const query = cie10Search[campo.nombre] ?? (formData[campo.nombre] || "");
            const isOpen = cie10Open[campo.nombre];
            const results = cie10Results[campo.nombre] || [];
            const isLoading = cie10Loading[campo.nombre];

            const isDropUp = cie10DropUp[campo.nombre];

            const handleCupsFocus = async (e) => {
                setCie10Open(p => ({ ...p, [campo.nombre]: true }));

                // Determinar dirección si hay poco espacio abajo (250px es la altura max de la lista)
                if (e && e.target) {
                    const rect = e.target.getBoundingClientRect();
                    const spaceBelow = window.innerHeight - rect.bottom;
                    setCie10DropUp(p => ({ ...p, [campo.nombre]: spaceBelow < 250 }));
                }

                // Sugerencia default (Consulta Fisiatria Primera Vez)
                const currentQuery = cie10Search[campo.nombre];
                if (!currentQuery && (!cie10Results[campo.nombre] || cie10Results[campo.nombre].length === 0)) {
                    setCie10Results(p => ({ ...p, [campo.nombre]: [{ codigo: "890264", descripcion: "CONSULTA DE PRIMERA VEZ POR ESPECIALISTA EN MEDICINA FISICA Y REHABILITACION" }] }));
                }
            };

            const handleCupsChange = (e) => {
                const val = e.target.value;
                setCie10Search(p => ({ ...p, [campo.nombre]: val }));
                setCie10Open(p => ({ ...p, [campo.nombre]: true }));
                if (!val) {
                    setFormData(prev => ({ ...prev, [campo.nombre]: "" }));
                    setCie10Results(p => ({ ...p, [campo.nombre]: [{ codigo: "890264", descripcion: "CONSULTA DE PRIMERA VEZ POR ESPECIALISTA EN MEDICINA FISICA Y REHABILITACION" }] }));
                    return;
                }

                clearTimeout(cie10Timers.current[campo.nombre]);
                cie10Timers.current[campo.nombre] = setTimeout(async () => {
                    setCie10Loading(p => ({ ...p, [campo.nombre]: true }));
                    try {
                        const data = await apiRequest(`/cups-catalogo?q=${encodeURIComponent(val)}&limit=15`);
                        setCie10Results(p => ({ ...p, [campo.nombre]: data }));
                    } catch { /* silenciar */ }
                    setCie10Loading(p => ({ ...p, [campo.nombre]: false }));
                }, 300);
            };

            return (
                <div className="flex flex-col gap-1 relative">
                    <label className="text-sm font-semibold text-gray-700" htmlFor={campo.nombre}>
                        {campo.etiqueta} {campo.requerido && <span className="text-pink-600">*</span>}
                    </label>
                    <div className="relative">
                        <input
                            id={campo.nombre}
                            type="text"
                            placeholder={campo.placeholder || "Buscar por CUPS o descripción..."}
                            value={query}
                            onFocus={handleCupsFocus}
                            onBlur={() => setTimeout(() => setCie10Open(p => ({ ...p, [campo.nombre]: false })), 200)}
                            onChange={handleCupsChange}
                            className="px-4 py-3 rounded-xl border border-blue-200 focus:ring-2 focus:ring-blue-300 w-full"
                            autoComplete="off"
                        />
                        {isLoading && (
                            <span className="absolute right-3 top-3 text-blue-400 text-xs">Buscando...</span>
                        )}
                    </div>
                    {formData[campo.nombre] && (
                        <span className="text-xs text-blue-600 font-semibold">
                            ✓ <strong>{formData[campo.nombre]}</strong>
                        </span>
                    )}
                    {isOpen && results.length > 0 && (
                        <ul className={`absolute left-0 right-0 z-50 bg-white border border-blue-200 rounded-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.2)] max-h-56 overflow-y-auto ${isDropUp ? 'bottom-full mb-1 shadow-[0_-10px_40px_-10px_rgba(0,0,0,0.2)]' : 'top-full mt-1'}`}>
                            {results.map(d => (
                                <li
                                    key={d.codigo}
                                    className="px-4 py-2 hover:bg-blue-50 cursor-pointer text-sm border-b border-gray-100 last:border-0"
                                    onMouseDown={(e) => {
                                        e.preventDefault();
                                        const fullValue = `${d.codigo} - ${d.nombre || d.descripcion}`;
                                        setFormData(prev => ({ ...prev, [campo.nombre]: fullValue }));
                                        setCie10Search(p => ({ ...p, [campo.nombre]: fullValue }));
                                        setCie10Open(p => ({ ...p, [campo.nombre]: false }));
                                    }}
                                >
                                    <span className="font-bold text-blue-700 mr-2">{d.codigo}</span>
                                    <span className="text-gray-600 text-xs">{d.nombre || d.descripcion}</span>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            );
        }


        if (campo.tipo === "firma") {
            return (
                <div className="flex flex-col gap-2 md:col-span-2">
                    <label className="text-sm font-semibold text-gray-700">{campo.etiqueta} {campo.requerido && <span className="text-pink-600">*</span>}</label>
                    <div className="border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 aspect-[21/9]">
                        <SignaturePad
                            ref={signatureRefs.current[campo.nombre]}
                            onEnd={() => handleEndSignature(campo.nombre)}
                            canvasProps={{ className: "w-full h-full rounded-xl" }}
                        />
                    </div>
                    <button type="button" onClick={() => handleClearSignature(campo.nombre)} className="text-sm text-pink-600 self-end hover:underline">
                        Limpiar Firma
                    </button>
                </div>
            );
        }

        if (campo.tipo === "checkbox") {
            return (
                <div className="flex items-start gap-4 md:col-span-2 p-5 bg-indigo-50/20 rounded-2xl border border-indigo-100 transition-all hover:bg-white hover:shadow-md group">
                    <div className="flex items-center h-6">
                        <input
                            type="checkbox"
                            id={campo.nombre}
                            name={campo.nombre}
                            checked={formData[campo.nombre] || false}
                            onChange={handleChange}
                            className="w-5 h-5 text-indigo-600 rounded border-indigo-300 focus:ring-indigo-500 cursor-pointer"
                        />
                    </div>
                    <label className="text-gray-700 font-bold text-sm cursor-pointer group-hover:text-indigo-900" htmlFor={campo.nombre}>
                        {campo.etiqueta}
                    </label>
                </div>
            );
        }

        if (campo.tipo === "textarea") {
            return (
                <div className="flex flex-col gap-1 md:col-span-2">
                    <label className="text-sm font-semibold text-gray-700" htmlFor={campo.nombre}>{campo.etiqueta}</label>
                    {campo.presets && campo.presets.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-1">
                            {campo.presets.map((preset, idx) => (
                                <button
                                    key={idx}
                                    type="button"
                                    onClick={() => setFormData(prev => ({ ...prev, [campo.nombre]: preset.texto }))}
                                    className="text-[10px] font-bold uppercase tracking-wide px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 transition-colors"
                                >
                                    {preset.etiqueta}
                                </button>
                            ))}
                        </div>
                    )}
                    <textarea
                        id={campo.nombre}
                        name={campo.nombre}
                        value={formData[campo.nombre] || ""}
                        onChange={handleChange}
                        required={campo.requerido}
                        rows={4}
                        placeholder={campo.placeholder}
                        className="px-4 py-3 rounded-xl border border-indigo-200 focus:ring-2 focus:ring-indigo-300 outline-none w-full"
                    />
                </div>
            )
        }

        if (campo.tipo === "checkbox_group") {
            const valoresActuales = formData[campo.nombre] || [];
            return (
                <div className="flex flex-col gap-2 md:col-span-2 mb-4">
                    <label className="text-[11px] font-black text-indigo-400 uppercase tracking-widest mb-1">{campo.etiqueta}</label>
                    <div className="flex flex-row flex-wrap gap-4">
                        {campo.opciones.map(opt => (
                            <label key={opt.valor} className={`flex items-center gap-3 cursor-pointer p-4 rounded-2xl border-2 transition-all shrink-0 ${valoresActuales.includes(opt.valor) ? 'bg-indigo-50 border-indigo-500 text-indigo-900 shadow-sm' : 'bg-white border-gray-100 text-gray-400 hover:border-indigo-200 shadow-sm'}`}>
                                <div className={`flex-shrink-0 w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${valoresActuales.includes(opt.valor) ? 'bg-indigo-600 border-indigo-600' : 'bg-white border-gray-200'}`}>
                                    {valoresActuales.includes(opt.valor) && <span className="text-white text-[10px] font-bold">✓</span>}
                                    <input
                                        type="checkbox"
                                        checked={valoresActuales.includes(opt.valor)}
                                        onChange={(e) => handleCheckboxGroupChange(campo.nombre, opt.valor, e.target.checked)}
                                        className="hidden"
                                    />
                                </div>
                                <span className="text-sm font-black uppercase tracking-tight whitespace-nowrap">{opt.etiqueta}</span>
                            </label>
                        ))}
                    </div>
                </div>
            );
        }

        if (campo.tipo === "hidden") {
            return (
                <input
                    key={campo.nombre}
                    type="hidden"
                    name={campo.nombre}
                    value={formData[campo.nombre] ?? (campo.valorPorDefecto !== undefined ? campo.valorPorDefecto : "")}
                />
            );
        }

        return (
            <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold text-gray-700" htmlFor={campo.nombre}>
                    {campo.etiqueta} {campo.requerido && <span className="text-pink-600">*</span>}
                </label>
                {campo.tipo === "select" ? (
                    <select
                        id={campo.nombre}
                        name={campo.nombre}
                        value={formData[campo.nombre] || ""}
                        onChange={handleChange}
                        required={campo.requerido}
                        className="px-4 py-3 rounded-xl border border-indigo-200 focus:ring-2 focus:ring-indigo-300 w-full"
                    >
                        <option value="">Seleccione...</option>
                        {campo.opciones.map(op => (
                            <option key={op.valor || op} value={op.valor || op}>{op.etiqueta || op}</option>
                        ))}
                    </select>
                ) : (
                    <input
                        id={campo.nombre}
                        name={campo.nombre}
                        type={campo.tipo}
                        value={
                            campo.tipo === 'datetime-local' && formData[campo.nombre]
                                ? String(formData[campo.nombre]).substring(0, 16)
                                : (formData[campo.nombre] ?? "")
                        }
                        onChange={handleChange}
                        required={campo.requerido}
                        readOnly={campo.lecsolo}
                        onKeyDown={(e) => { if (e.key === 'Enter') e.preventDefault(); }}
                        className={`px-4 py-3 rounded-xl border ${campo.lecsolo ? 'bg-gray-100' : 'bg-white'} border-indigo-200 focus:ring-2 focus:ring-indigo-300 w-full`}
                        placeholder={campo.placeholder}
                    />
                )}
            </div>
        );
    };

    // Wrapper con estilo visual diferente para req vs opcional y más compacto si es sidebar
    // Wrapper con estilo visual diferente para req vs opcional
    const renderCampoConEstilo = (campo, esRequerido, isSidebar = false) => {
        const contenido = renderCampo(campo);
        if (!contenido) return null;
        return (
            <div className={`rounded-xl p-3 border ${esRequerido
                ? 'border-indigo-200 bg-indigo-50/40'
                : 'border-gray-100 bg-gray-50/50'
                }`}>
                {contenido}
            </div>
        );
    };

    const seccionesAlwaysOn = esquema.secciones.filter(s => s.siempreVisible);
    const seccionesPaginadas = esquema.secciones.filter(s => !s.siempreVisible);
    // Si hay paginación, el paso actual se calcula sobre las secciones NO siempreVisible
    const seccionesARenderizar = isPaginado
        ? [seccionesPaginadas[pasoActual]].filter(Boolean)
        : seccionesPaginadas;
    const totalPasos = seccionesPaginadas.length;

    // Helper: renderizar una sección completa
    const renderSeccion = (seccion, idxSec, isSidebar = false) => {
        if (!seccion) return null;
        const camposReq = seccion.campos.filter(c => c.requerido && !c.oculto && c.tipo !== 'firma' && c.tipo !== 'checkbox');
        const camposOpc = seccion.campos.filter(c => !c.requerido && !c.oculto && c.tipo !== 'firma' && c.tipo !== 'checkbox' && c.tipo !== 'textarea');
        const camposTexarea = seccion.campos.filter(c => !c.oculto && (c.tipo === 'textarea' || c.tipo === 'firma' || c.tipo === 'checkbox' || c.tipo === 'checkbox_group'));
        const camposOcultos = seccion.campos.filter(c => c.tipo === 'hidden' || c.oculto);
        const tieneOpcionales = camposOpc.length > 0;

        return (
            <div key={idxSec} className={`rounded-2xl border border-indigo-100 ${isSidebar ? 'shadow-sm' : ''}`}>
                <h3 className="text-sm font-bold text-white bg-indigo-600 px-4 py-2 flex items-center gap-2 rounded-t-xl">
                    📋 {seccion.titulo}
                </h3>
                <div className="p-4 bg-white rounded-b-xl">
                    {isSidebar ? (
                        // MODO SIDEBAR: Una sola columna, más compacto
                        <div className="flex flex-col gap-3">
                            {camposReq.map((c, i) => <React.Fragment key={`req-${i}`}>{renderCampoConEstilo(c, true, true)}</React.Fragment>)}
                            {camposOpc.length > 0 && (
                                <div className="border-t border-gray-100 my-1 pt-2">
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Opcionales</p>
                                </div>
                            )}
                            {camposOpc.map((c, i) => <React.Fragment key={`opc-${i}`}>{renderCampoConEstilo(c, false, true)}</React.Fragment>)}
                        </div>
                    ) : (
                        // MODO FORMULARIO PRINCIPAL: Layout grid normal ordenado sin separar obligatorios/opcionales
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-left">
                            {seccion.campos.filter(c => !c.oculto && c.tipo !== 'firma' && c.tipo !== 'checkbox' && c.tipo !== 'textarea' && c.tipo !== 'checkbox_group').map((c, i) => (
                                <React.Fragment key={i}>{renderCampoConEstilo(c, c.requerido, false)}</React.Fragment>
                            ))}
                        </div>
                    )}

                    {camposTexarea.length > 0 && (
                        <div className="space-y-4 mt-4 pt-4 border-t border-indigo-50">
                            {camposTexarea.map((c, i) => <React.Fragment key={i}>{renderCampo(c)}</React.Fragment>)}
                        </div>
                    )}
                    {/* Campos ocultos o hidden que no deben ocupar espacio */}
                    {camposOcultos.map((c, i) => <React.Fragment key={i}>{renderCampo(c)}</React.Fragment>)}
                </div>
            </div>
        );
    };

    return (
        <div className={isModalLayout ? "flex-1 w-full bg-white flex flex-col min-h-0" : "w-full h-full flex items-center justify-center p-4"}>
            <form
                onSubmit={(e) => { e.preventDefault(); if (!isPaginado || pasoActual === totalPasos - 1) handleSubmit(e); }}
                className={isModalLayout ? "flex-1 flex flex-col w-full min-h-0 h-full" : "w-full max-w-7xl mx-auto"}
            >
                {/* Cabeceras, alertas y layout */}
                <div className={isModalLayout ? "flex-1 overflow-y-auto px-6 py-6" : ""}>
                    {/* Título */}
                    {!isModalLayout && <h2 className="text-2xl font-extrabold text-indigo-700 mb-5 text-center">{esquema.titulo}</h2>}

                {/* Barra de progreso */}
                {isPaginado && (
                    <div className="flex justify-between items-center mb-5 bg-white rounded-2xl px-6 py-3 shadow-sm border border-indigo-100">
                        <span className="text-sm font-bold text-gray-500">
                            Paso {pasoActual + 1} de {totalPasos}
                        </span>
                        <div className="flex-1 mx-4 bg-gray-200 h-2 rounded-full overflow-hidden">
                            <div className="bg-indigo-600 h-full transition-all" style={{ width: `${((pasoActual + 1) / totalPasos) * 100}%` }}></div>
                        </div>
                        <span className="text-sm font-bold text-indigo-600 truncate max-w-[200px]">
                            {seccionesPaginadas[pasoActual]?.titulo || ''}
                        </span>
                    </div>
                )}

                {errores && <div className="mb-4 p-4 bg-red-100 text-red-700 font-semibold rounded-xl">{errores}</div>}

                {/* Layout principal: sidebar izquierdo fijo + paso actual derecho */}
                <div className={`flex flex-col w-full ${seccionesAlwaysOn.length > 0 ? 'lg:flex-row items-start' : 'max-w-5xl mx-auto'} gap-6`}>

                    {/* PANEL IZQUIERDO: secciones siempreVisible — siempre visibles en todos los pasos */}
                    {seccionesAlwaysOn.length > 0 && (
                        <div className="w-full lg:w-[420px] lg:sticky lg:top-4 flex-shrink-0 space-y-4 pr-1 pb-4 z-20">
                            <div className="bg-indigo-700 rounded-2xl px-4 py-3 shadow-md flex items-center gap-2">
                                <div className="bg-white/20 p-2 rounded-lg">📌</div>
                                <div>
                                    <h4 className="text-white text-sm font-bold leading-tight">Datos de Consulta</h4>
                                    <p className="text-indigo-200 text-xs tracking-widest">Siempre Visibles</p>
                                </div>
                            </div>
                            {seccionesAlwaysOn.map((s, i) => renderSeccion(s, i, true))}
                        </div>
                    )}

                    {/* PANEL DERECHO: pasos del formulario */}
                    <div className="flex-1 min-w-0 space-y-5 lg:pl-2 pb-8">
                        {seccionesARenderizar.map((s, i) => renderSeccion(s, i, false))}
                    </div>
                </div>
                </div>

                {/* Botones de navegación - AHORA FIJOS AL FONDO o FLAT en Modal, adaptados para mobile */}
                <div className={isModalLayout 
                    ? "shrink-0 border-t border-gray-200 bg-gray-50 px-4 py-4 flex flex-col sm:flex-row justify-end items-center gap-3" 
                    : "static lg:sticky lg:bottom-4 z-50 flex flex-col sm:flex-row justify-between items-center bg-white/90 backdrop-blur-md border border-indigo-100 rounded-3xl px-4 py-4 sm:px-8 sm:py-5 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)] mt-8 gap-4 w-full"}>
                            {isPaginado ? (
                                <>
                                    <button type="button"
                                        onClick={pasoActual === 0 ? () => (onCancel ? onCancel() : navigate(esquema.redireccion)) : anteriorPaso}
                                        className="w-full sm:w-auto px-8 py-3 bg-slate-100 text-slate-600 rounded-2xl font-black uppercase tracking-wider hover:bg-slate-200 transition-all text-xs border border-slate-200 order-2 sm:order-1 mt-2 sm:mt-0">
                                        {pasoActual === 0 ? '✕ Cancelar' : '← Anterior'}
                                    </button>
                                    <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto order-1 sm:order-2">
                                        {pasoActual < totalPasos - 1 ? (
                                            <button type="button" onClick={siguientePaso}
                                                className="w-full sm:w-auto px-8 py-3 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-wider hover:bg-indigo-700 transition-all text-xs shadow-lg shadow-indigo-200">
                                                Siguiente Paso →
                                            </button>
                                        ) : (
                                            <button type="submit" disabled={guardando || submitLocked}
                                                className="w-full sm:w-auto px-8 py-3 bg-pink-600 text-white rounded-2xl font-black uppercase tracking-wider hover:bg-pink-700 transition-all text-xs shadow-lg shadow-pink-200 disabled:opacity-50">
                                                {guardando ? 'Guardando...' : '✓ Terminar y Guardar'}
                                            </button>
                                        )}
                                    </div>
                                </>
                            ) : (
                                <div className={isModalLayout ? "flex flex-col-reverse sm:flex-row gap-3 w-full justify-end" : "flex flex-col-reverse sm:flex-row gap-4 w-full justify-center"}>
                                    <button type="button" onClick={() => (onCancel ? onCancel() : navigate(esquema.redireccion))}
                                        className={isModalLayout ? "w-full sm:w-auto px-6 py-2.5 font-bold text-gray-600 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors" : "w-full sm:w-auto px-10 py-4 bg-slate-100 text-slate-600 rounded-2xl font-black uppercase tracking-wider hover:bg-slate-200 transition-all text-xs border border-slate-200"}>✕ Cancelar</button>
                                    <button type="submit" disabled={guardando || submitLocked}
                                        className={isModalLayout ? "w-full sm:w-auto px-6 py-2.5 font-bold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 transition-colors shadow-sm disabled:opacity-50" : "w-full sm:w-auto px-10 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black uppercase tracking-wider text-xs transition-all shadow-lg shadow-indigo-200 disabled:opacity-50"}>
                                        {guardando ? 'Guardando...' : '✓ Guardar Valoración'}
                                    </button>
                                </div>
                            )}
                </div>
            </form>
            {/* Espaciador final solo si NO es modal */}
            {!isModalLayout && <div className="h-20"></div>}
        </div>
    );
}
