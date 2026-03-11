import React, { useState } from "react";
import DynamicFormBuilder from "./ui/DynamicFormBuilder";
import { ESQUEMA_PACIENTE_NINO, ESQUEMA_PACIENTE_ADULTO } from "../config/esquemasFormularios";

export default function RegistroPacienteUnificado({ isModal = false, onClose, onSuccess }) {
    const [tipoPaciente, setTipoPaciente] = useState(null);

    if (!tipoPaciente) {
        const tarjetaSeleccion = (
            <div className={isModal ? "bg-white w-full max-w-lg rounded-3xl shadow-2xl p-10 flex flex-col items-center relative animate-fadeIn shrink-0" : "bg-white rounded-3xl shadow-2xl p-10 text-center max-w-md w-full border border-indigo-100 flex flex-col items-center relative animate-fadeIn"}>
                {isModal && (
                    <div className="absolute top-4 right-4">
                        <button onClick={onClose} className="p-2 text-gray-400 hover:bg-red-50 hover:text-red-500 rounded-full transition-colors flex items-center justify-center" title="Cerrar modal">
                            ✕
                        </button>
                    </div>
                )}
                <h2 className="text-2xl font-extrabold text-indigo-800 mb-8 w-full text-center">Seleccione el Tipo de Paciente</h2>
                <div className="w-full space-y-4">
                    <button
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-5 rounded-2xl font-bold text-lg w-full flex items-center justify-center gap-3 transition-transform hover:scale-[1.02] shadow-sm"
                        onClick={() => setTipoPaciente("nino")}
                    >
                        <span className="text-2xl">🧸</span> <span>Paciente Niño</span>
                    </button>
                    <button
                        className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-5 rounded-2xl font-bold text-lg w-full flex items-center justify-center gap-3 transition-transform hover:scale-[1.02] shadow-sm"
                        onClick={() => setTipoPaciente("adulto")}
                    >
                        <span className="text-2xl">🤰</span> <span>Paciente Materno</span>
                    </button>
                </div>
            </div>
        );

        return isModal ? tarjetaSeleccion : (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-pink-100 to-green-100 p-4">
                {tarjetaSeleccion}
            </div>
        );
    }

    const esquemaActivo = tipoPaciente === "nino" ? ESQUEMA_PACIENTE_NINO : ESQUEMA_PACIENTE_ADULTO;

    return (
        <div className={isModal ? "bg-white w-full max-w-6xl max-h-[95vh] rounded-[24px] shadow-2xl flex flex-col overflow-hidden relative animate-fadeIn" : "relative bg-gray-50 flex-1 h-full w-full"}>
            
            {/* Header Sticky si es modal para dejar claro el contexto */}
            {isModal && (
                <div className="flex items-center justify-between shrink-0 px-6 py-4 bg-gray-50 border-b border-gray-100 z-10 hidden sm:flex">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setTipoPaciente(null)}
                            className="bg-white text-indigo-700 border border-indigo-200 hover:bg-indigo-50 font-bold py-1.5 px-3 rounded-lg shadow-sm transition-all text-xs flex items-center gap-2"
                        >
                            ← Cambiar a {tipoPaciente === "nino" ? "Materno" : "Niño"}
                        </button>
                        <h3 className="font-bold text-gray-700">Completando nuevo paciente</h3>
                    </div>
                    <button 
                        onClick={onClose} 
                        className="p-2 bg-white border border-gray-200 text-gray-400 hover:text-red-500 hover:bg-red-50 hover:border-red-200 rounded-full transition-colors flex items-center justify-center w-8 h-8 shadow-sm"
                        title="Cerrar modal"
                    >
                        ✕
                    </button>
                </div>
            )}

            {/* Si no es modal, el botón viejo flotante */}
            {!isModal && (
                <button
                    onClick={() => setTipoPaciente(null)}
                    className="absolute top-4 left-4 z-50 bg-white bg-opacity-80 hover:bg-opacity-100 text-indigo-700 font-bold py-2 px-4 rounded-lg shadow border border-indigo-200 backdrop-blur-sm transition-all text-sm flex items-center gap-2"
                >
                    <span>← Cambiar a {tipoPaciente === "nino" ? "Materno" : "Niño"}</span>
                </button>
            )}

            {/* Carga el constructor de formularios con el esquema correcto */}
            <div className="w-full flex-1 flex flex-col min-h-0 overflow-hidden relative bg-white">
                <DynamicFormBuilder 
                    esquema={esquemaActivo} 
                    onSubmitSuccess={onSuccess}
                    onCancel={onClose} 
                    isModalLayout={isModal}
                />
            </div>
        </div>
    );
}
