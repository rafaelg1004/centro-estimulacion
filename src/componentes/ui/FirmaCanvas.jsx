import React, { useRef, useState, useEffect } from "react";
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

    // El valor actual de la firma proveniente de los props
    const currentValue = formulario && name ? formulario[name] : null;

    // Si tenemos una URL (S3) o Base64 que viene precargada, la mostramos como imagen
    const [mostrarImagenFija, setMostrarImagenFija] = useState(false);

    useEffect(() => {
        // Si hay un valor actual y el pad está vacío (o aún no referenciado), mostramos la imagen fija
        const isPadEmpty = !sigPad.current || typeof sigPad.current.isEmpty !== 'function' || sigPad.current.isEmpty();

        if (currentValue && isPadEmpty) {
            setMostrarImagenFija(true);
        } else if (!currentValue) {
            setMostrarImagenFija(false);
        }
    }, [currentValue]);

    const clear = () => {
        if (sigPad.current) {
            sigPad.current.clear();
        }
        setMostrarImagenFija(false);
        if (onClear) onClear();
        if (setFormulario && name) {
            setFormulario(prev => ({ ...prev, [name]: "" }));
        }
    };

    const handleEnd = () => {
        if (sigPad.current) {
            const dataUrl = sigPad.current.toDataURL();
            if (onSave) onSave(dataUrl);
            if (setFormulario && name) {
                setFormulario(prev => ({ ...prev, [name]: dataUrl }));
            }
        }
    };

    return (
        <div className="flex flex-col gap-2 w-full">
            {displayLabel && <label className="text-sm font-bold text-gray-700">{displayLabel}</label>}
            <div className="border-2 border-dashed border-gray-300 rounded-xl bg-white overflow-hidden aspect-[2/1] relative shadow-inner group">
                {mostrarImagenFija && currentValue ? (
                    <div className="absolute inset-0 bg-white z-10 flex items-center justify-center p-2">
                        <img
                            src={currentValue.startsWith('/api') && process.env.NODE_ENV === 'development' ? `http://localhost:5000${currentValue}` : currentValue}
                            alt="Firma guardada"
                            className="max-w-full max-h-full object-contain pointer-events-none"
                        />
                    </div>
                ) : null}

                <SignaturePad
                    ref={sigPad}
                    onEnd={handleEnd}
                    canvasProps={{
                        className: "w-full h-full cursor-crosshair",
                        style: { width: '100%', height: '100%' }
                    }}
                />

                {/* Placeholder visual si está vacío (modificado z-index para que quede detrás del canvas) */}
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-10 -z-10">
                    <span className="text-4xl">🖋️</span>
                </div>
            </div>
            <button
                type="button"
                onClick={clear}
                className="text-[10px] text-red-500 font-black uppercase tracking-widest self-end hover:bg-red-50 px-2 py-1 rounded transition mt-1 border border-red-100"
            >
                {mostrarImagenFija ? "Eliminar y Volver a Firmar" : "Limpiar Firma"}
            </button>
        </div>
    );
}
