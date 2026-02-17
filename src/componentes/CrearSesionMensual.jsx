import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PlusCircleIcon, ArrowLeftIcon } from "@heroicons/react/24/solid";
import { apiRequest } from "../config/api";
import Swal from "sweetalert2";

export default function CrearSesionMensual() {
  const [nombre, setNombre] = useState("");
  const [fecha, setFecha] = useState(new Date().toISOString().split('T')[0]);
  const [descripcionGeneral, setDescripcionGeneral] = useState("");
  const [cargando, setCargando] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCargando(true);
    try {
      const data = await apiRequest("/sesiones-mensuales", {
        method: "POST",
        body: JSON.stringify({ 
          nombre, 
          fecha, 
          descripcionGeneral,
          asistentes: [] 
        }),
      });
      
      Swal.fire({
        title: '¡Sesión Creada!',
        text: 'La sesión mensual ha sido creada exitosamente.',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false
      });
      
      navigate(`/sesiones-mensuales/${data._id}`);
    } catch (error) {
      console.error("Error al crear sesión mensual:", error);
      Swal.fire('Error', 'No se pudo crear la sesión', 'error');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 flex items-center justify-center py-10 px-4">
      <form onSubmit={handleSubmit} className="max-w-md w-full mx-auto p-8 bg-white rounded-3xl shadow-2xl border border-purple-100">
        <div className="flex items-center gap-2 mb-6">
          <button 
            type="button" 
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-purple-50 rounded-full transition"
          >
            <ArrowLeftIcon className="h-6 w-6 text-purple-600" />
          </button>
          <h2 className="text-2xl font-extrabold text-purple-700 drop-shadow">Nueva Sesión Mensual</h2>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-purple-700 font-semibold mb-1">Nombre de la Actividad</label>
            <input
              className="border border-purple-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 rounded-xl px-4 py-2 w-full outline-none transition bg-purple-50 shadow-sm"
              placeholder="Ej: Estimulación Temprana Nivel 1"
              value={nombre}
              onChange={e => setNombre(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-purple-700 font-semibold mb-1">Fecha</label>
            <input
              className="border border-purple-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 rounded-xl px-4 py-2 w-full outline-none transition bg-purple-50 shadow-sm"
              type="date"
              value={fecha}
              onChange={e => setFecha(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-purple-700 font-semibold mb-1">Descripción General</label>
            <textarea
              className="border border-purple-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 rounded-xl px-4 py-2 w-full outline-none transition bg-purple-50 shadow-sm resize-none"
              placeholder="¿Qué se trabajó hoy de forma general?"
              value={descripcionGeneral}
              onChange={e => setDescripcionGeneral(e.target.value)}
              rows={4}
            />
          </div>

          <button
            className={`bg-purple-600 hover:bg-purple-700 text-white font-bold px-6 py-3 rounded-xl shadow-lg transition w-full flex items-center justify-center gap-2 text-lg mt-6 ${cargando ? 'opacity-50 cursor-not-allowed' : ''}`}
            type="submit"
            disabled={cargando}
          >
            {cargando ? (
               <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-white ring-2 ring-transparent"></div>
            ) : (
              <PlusCircleIcon className="h-6 w-6" />
            )}
            Crear Sesión
          </button>
        </div>
      </form>
    </div>
  );
}
