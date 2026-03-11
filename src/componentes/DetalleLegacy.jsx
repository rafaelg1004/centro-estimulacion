
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiRequest } from "../config/api";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";

export default function DetalleLegacy() {
    const { collection, id } = useParams();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        apiRequest(`/valoraciones/legacy/${collection}/${id}`)
            .then(res => {
                setData(res);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, [collection, id]);

    if (loading) return <div className="p-20 text-center">Cargando datos históricos...</div>;
    if (!data) return <div className="p-20 text-center text-red-500">No se encontró la valoración antigua.</div>;

    // Filtrar campos técnicos
    const entries = Object.entries(data).filter(([key]) => 
        !key.startsWith('_') && 
        key !== 'paciente' && 
        key !== 'firmaRepresentante' && 
        key !== 'firmaFisioterapeuta' &&
        key !== 'firmaAcudiente'
    );

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden">
                <div className="bg-amber-500 p-6 text-white flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-bold uppercase">Valoración Histórica (Legacy)</h2>
                        <p className="text-amber-100 text-sm italic">Este es un registro antiguo exportado del sistema anterior.</p>
                    </div>
                    <button onClick={() => navigate(-1)} className="bg-amber-600 hover:bg-amber-700 p-2 rounded-full">
                        <ArrowLeftIcon className="h-6 w-6" />
                    </button>
                </div>

                <div className="p-8">
                    <div className="mb-8 bg-amber-50 rounded-2xl p-4 border border-amber-100">
                        <p className="font-bold text-amber-800">Paciente: <span className="text-gray-900 font-normal">{data.paciente?.nombres} {data.paciente?.apellidos}</span></p>
                        <p className="font-bold text-amber-800">Fecha: <span className="text-gray-900 font-normal">{data.fecha || new Date(data.createdAt).toLocaleDateString()}</span></p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {entries.map(([key, value]) => (
                            <div key={key} className="border-b border-gray-100 py-2">
                                <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest">{key.replace(/_/g, ' ')}</span>
                                <span className="text-sm text-gray-800">
                                    {typeof value === 'boolean' ? (value ? '✅ Sí' : '❌ No') : 
                                     Array.isArray(value) ? value.join(', ') : 
                                     value?.toString() || '---'}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
                
                <div className="bg-gray-50 p-6 text-center text-gray-400 text-xs italic">
                    DMAMITAS & BABIES - Registro Migrado
                </div>
            </div>
        </div>
    );
}
