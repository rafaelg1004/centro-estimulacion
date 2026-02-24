import React, { useState } from "react";
import DynamicFormBuilder from "./ui/DynamicFormBuilder";
import { ESQUEMA_PACIENTE_NINO, ESQUEMA_PACIENTE_ADULTO } from "../config/esquemasFormularios";

export default function RegistroPacienteUnificado() {
    const [tipoPaciente, setTipoPaciente] = useState(null);

    if (!tipoPaciente) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-pink-100 to-green-100 py-10 px-2">
                <div className="bg-white rounded-3xl shadow-2xl p-10 text-center max-w-md w-full border border-indigo-100 transform transition-all hover:scale-105">
                    <h2 className="text-3xl font-extrabold text-indigo-800 mb-8 drop-shadow-sm">¿A quién vamos a registrar?</h2>
                    <div className="flex flex-col gap-4">
                        <button
                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-4 rounded-2xl font-bold text-xl shadow-md transition-all flex items-center justify-center gap-3"
                            onClick={() => setTipoPaciente("nino")}
                        >
                            <span className="text-3xl">🧸</span> <span>Paciente Niño</span>
                        </button>
                        <button
                            className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-4 rounded-2xl font-bold text-xl shadow-md transition-all flex items-center justify-center gap-3 mt-4"
                            onClick={() => setTipoPaciente("adulto")}
                        >
                            <span className="text-3xl">🤰</span> <span>Paciente Materno</span>
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const esquemaActivo = tipoPaciente === "nino" ? ESQUEMA_PACIENTE_NINO : ESQUEMA_PACIENTE_ADULTO;

    return (
        <div className="relative">
            {/* Botón para volver a seleccionar el tipo de paciente, se pone arriba a la izquierda */}
            <button
                onClick={() => setTipoPaciente(null)}
                className="absolute top-4 left-4 z-10 bg-white bg-opacity-80 hover:bg-opacity-100 text-indigo-700 font-bold py-2 px-4 rounded-lg shadow border border-indigo-200 backdrop-blur-sm transition-all text-sm flex items-center gap-2"
            >
                <span>← Cambiar a {tipoPaciente === "nino" ? "Materno" : "Niño"}</span>
            </button>

            {/* Carga el constructor de formularios con el esquema correcto */}
            <DynamicFormBuilder esquema={esquemaActivo} />
        </div>
    );
}
