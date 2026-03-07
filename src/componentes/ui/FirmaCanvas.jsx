import React, { useRef } from "react";
import SignaturePad from "react-signature-canvas";

/**
 * Componente Reutilizable para capturar firmas
 * Soporta la interfaz antigua (label, name, formulario, setFormulario)
 * y la nueva (etiqueta, onSave).
 */
export default function FirmaCanvas({
    label, etiqueta, // Nombres para la etiqueta
    name, formulario, setFormulario, // Interfaz antigua
    onSave, onClear // Interfaz nueva
}) {
    const sigPad = useRef({});
    const displayLabel = label || etiqueta;

    // Si hay una firma previa en el formulario (edición), se debería cargar
    // Nota: SignaturePad es un canvas, no carga imágenes base64 directamente con un prop de src.
    // Pero para capturar nuevas firmas, esto es lo que se usa.

    const clear = () => {
        sigPad.current.clear();
        if (onClear) onClear();
        if (setFormulario && name) {
            setFormulario(prev => ({ ...prev, [name]: "" }));
        }
    };

    const handleEnd = () => {
        const dataUrl = sigPad.current.toDataURL();
        if (onSave) onSave(dataUrl);
        if (setFormulario && name) {
            setFormulario(prev => ({ ...prev, [name]: dataUrl }));
        }
    };

    return (
        <div className="flex flex-col gap-2 w-full">
            {displayLabel && <label className="text-sm font-bold text-gray-700">{displayLabel}</label>}
            <div className="border-2 border-dashed border-gray-300 rounded-xl bg-white overflow-hidden aspect-[2/1] relative shadow-inner">
                <SignaturePad
                    ref={sigPad}
                    onEnd={handleEnd}
                    canvasProps={{
                        className: "w-full h-full cursor-crosshair",
                        style: { width: '100%', height: '100%' }
                    }}
                />
                {/* Placeholder visual si está vacío */}
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-10">
                    <span className="text-4xl">🖋️</span>
                </div>
            </div>
            <button
                type="button"
                onClick={clear}
                className="text-[10px] text-red-500 font-black uppercase tracking-widest self-end hover:bg-red-50 px-2 py-1 rounded transition mt-1 border border-red-100"
            >
                Limpiar Firma
            </button>
        </div>
    );
}
