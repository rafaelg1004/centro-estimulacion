import React, { useState, useEffect, useRef } from "react";
import Swal from "sweetalert2";
import { apiRequest } from "../../config/api";
import { useNavigate } from "react-router-dom";
import SignaturePad from "react-signature-canvas";

export default function DynamicFormBuilder({ esquema, onSubmitSuccess, isPaginado = false }) {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({});
    const [errores, setErrores] = useState("");
    const [guardando, setGuardando] = useState(false);
    const [pasoActual, setPasoActual] = useState(0);

    // Referencias para las firmas (Canvas)
    const signatureRefs = useRef({});

    // Inicializar estado según el esquema (recorriendo todas las secciones)
    useEffect(() => {
        const defaultData = {};
        esquema.secciones.forEach((seccion) => {
            seccion.campos.forEach((campo) => {
                defaultData[campo.nombre] = campo.valorPorDefecto || (campo.tipo === "select" && campo.opciones.length ? "" : "");
                // Agrupar firmas
                if (campo.tipo === "firma") {
                    signatureRefs.current[campo.nombre] = React.createRef();
                }
            });
        });
        setFormData(defaultData);
    }, [esquema]);

    const handleChange = (e, autoCalcula) => {
        const { name, type, checked, value } = e.target;
        const finalValue = type === "checkbox" ? checked : value;

        setFormData((prev) => {
            let newState = { ...prev, [name]: finalValue };
            // Aquí podrías procesar `autoCalcula` si hiciera falta
            return newState;
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

    const validarPasoActual = () => {
        let camposFaltantes = [];
        const seccion = esquema.secciones[pasoActual];

        seccion.campos.forEach((campo) => {
            let visible = true;
            if (campo.dependeDe) {
                visible = formData[campo.dependeDe.campo] === campo.dependeDe.valor;
            }
            if (visible && campo.requerido && !formData[campo.nombre]) {
                camposFaltantes.push(campo.etiqueta);
            }
        });

        if (camposFaltantes.length > 0) {
            setErrores(`Faltan campos: ${camposFaltantes.join(", ")}`);
            return false;
        }
        setErrores("");
        return true;
    };

    const siguientePaso = () => {
        if (validarPasoActual()) setPasoActual(p => Math.min(esquema.secciones.length - 1, p + 1));
    };

    const anteriorPaso = () => {
        setPasoActual(p => Math.max(0, p - 1));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isPaginado && !validarPasoActual()) return;

        try {
            setGuardando(true);
            // Extraemos el paciente seleccionado si el componente anfitrión lo inyectó, o lo enviamos directo.
            await apiRequest(esquema.endpoint, {
                method: "POST",
                body: JSON.stringify(formData)
            });

            Swal.fire("¡Guardado!", `${esquema.titulo} guardado con éxito.`, "success");
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
                <div className="flex items-center gap-3 md:col-span-2 p-3 bg-white rounded-xl border border-indigo-100 shadow-sm">
                    <input
                        type="checkbox"
                        id={campo.nombre}
                        name={campo.nombre}
                        checked={formData[campo.nombre] || false}
                        onChange={handleChange}
                        className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500"
                    />
                    <label className="text-gray-700 font-medium" htmlFor={campo.nombre}>{campo.etiqueta}</label>
                </div>
            );
        }

        if (campo.tipo === "textarea") {
            return (
                <div className="flex flex-col gap-1 md:col-span-2">
                    <label className="text-sm font-semibold text-gray-700" htmlFor={campo.nombre}>{campo.etiqueta}</label>
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
                        value={formData[campo.nombre] || ""}
                        onChange={handleChange}
                        required={campo.requerido}
                        readOnly={campo.lecsolo}
                        className={`px-4 py-3 rounded-xl border ${campo.lecsolo ? 'bg-gray-100' : 'bg-white'} border-indigo-200 focus:ring-2 focus:ring-indigo-300 w-full`}
                        placeholder={campo.placeholder}
                    />
                )}
            </div>
        );
    };

    const seccionesARenderizar = isPaginado ? [esquema.secciones[pasoActual]] : esquema.secciones;

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-10 px-2">
            <form onSubmit={(e) => { e.preventDefault(); if (!isPaginado || pasoActual === esquema.secciones.length - 1) handleSubmit(e); }} className="w-full max-w-4xl bg-white p-8 rounded-3xl shadow-xl border border-indigo-100">
                <h2 className="text-3xl font-extrabold text-indigo-700 mb-8 text-center">{esquema.titulo}</h2>

                {isPaginado && (
                    <div className="flex justify-between items-center mb-6">
                        <span className="text-sm font-bold text-gray-500">Paso {pasoActual + 1} de {esquema.secciones.length}</span>
                        <div className="flex-1 mx-4 bg-gray-200 h-2 rounded-full overflow-hidden">
                            <div className="bg-indigo-600 h-full" style={{ width: `${((pasoActual + 1) / esquema.secciones.length) * 100}%` }}></div>
                        </div>
                    </div>
                )}

                {errores && <div className="mb-6 p-4 bg-red-100 text-red-700 font-semibold rounded-xl">{errores}</div>}

                <div className="space-y-8">
                    {seccionesARenderizar.map((seccion, idxSec) => (
                        <div key={idxSec} className="bg-indigo-50/30 p-6 rounded-2xl border border-indigo-50">
                            <h3 className="text-xl font-bold text-indigo-800 mb-6 pb-2 border-b border-indigo-100">{seccion.titulo}</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {seccion.campos.map((campo, i) => <React.Fragment key={i}>{renderCampo(campo)}</React.Fragment>)}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="flex justify-between mt-8 pt-6 border-t border-indigo-100">
                    {isPaginado ? (
                        <>
                            <button type="button" onClick={pasoActual === 0 ? () => navigate(esquema.redireccion) : anteriorPaso} className="px-6 py-2 bg-gray-200 text-gray-800 rounded-xl font-bold">
                                {pasoActual === 0 ? "Cancelar" : "Anterior"}
                            </button>
                            {pasoActual < esquema.secciones.length - 1 ? (
                                <button type="button" onClick={siguientePaso} className="px-6 py-2 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700">
                                    Siguiente
                                </button>
                            ) : (
                                <button type="submit" disabled={guardando} className="px-6 py-2 bg-pink-600 text-white rounded-xl font-bold hover:bg-pink-700">
                                    {guardando ? "Guardando..." : "Finalizar y Guardar"}
                                </button>
                            )}
                        </>
                    ) : (
                        <div className="flex gap-4 w-full justify-center">
                            <button type="button" onClick={() => navigate(esquema.redireccion)} className="px-8 py-3 bg-gray-200 text-gray-800 rounded-xl font-bold">Cancelar</button>
                            <button type="submit" disabled={guardando} className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold">
                                {guardando ? "Guardando..." : "Guardar"}
                            </button>
                        </div>
                    )}
                </div>
            </form>
        </div>
    );
}
