import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import logo from "../assents/LOGO.png"; // Ajusta la ruta si es necesario
import { UserGroupIcon } from "@heroicons/react/24/outline";
import { ClipboardDocumentListIcon, AcademicCapIcon, ChartBarIcon } from "@heroicons/react/24/outline";
import { apiRequest } from "../config/api";

export default function Home() {
  const navigate = useNavigate();
  const [borradores, setBorradores] = useState([]);

  useEffect(() => {
    const fetchBorradores = async () => {
      try {
        const data = await apiRequest("/borradores/mis-borradores");
        if (data && data.length > 0) {
          setBorradores(data);
          
          // Mostrar notificación solo para el más reciente o mostrar una lista
          const borrador = data[0];
          
          Swal.fire({
            title: '¡Tienes una valoración pendiente!',
            text: `Dejaste incompleta la valoración de ${borrador.tipoFormulario} para ${borrador.nombrePaciente || 'un paciente'}. ¿Deseas reanudarla?`,
            icon: 'info',
            showCancelButton: true,
            showDenyButton: true,
            confirmButtonText: 'Sí, reanudar',
            cancelButtonText: 'No, descartar por ahora',
            denyButtonText: 'Eliminar borrador',
            confirmButtonColor: '#4f46e5',
            denyButtonColor: '#ef4444'
          }).then(async (result) => {
            if (result.isConfirmed) {
              // Redirigir a NuevaValoracionUnificada con los parámetros
              navigate(`/valoracion?paciente=${borrador.pacienteId}&tipo=${borrador.tipoFormulario === 'Piso Pélvico' ? 'pisopelvico' : (borrador.tipoFormulario.includes('Perinatal') ? 'perinatal' : 'lactancia')}&borradorId=${borrador.id}`);
            } else if (result.isDenied) {
              // Borrar directamente desde el Home
              try {
                await apiRequest(`/borradores/${borrador.id}`, { method: 'DELETE' });
                setBorradores(prev => prev.filter(b => b.id !== borrador.id));
                Swal.fire('Eliminado', 'El borrador ha sido eliminado permanentemente.', 'success');
              } catch (e) {
                console.error("Error al borrar desde el Home", e);
              }
            }
          });
        }
      } catch (error) {
        console.error("Error consultando borradores", error);
      }
    };
    
    fetchBorradores();
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-100 via-purple-100 to-green-100">
      <div className="bg-white bg-opacity-90 p-10 rounded-3xl shadow-2xl flex flex-col gap-8 w-full max-w-lg items-center border border-indigo-100">
        <img src={logo} alt="Logo" className="w-40 mb-2 drop-shadow" />
        <h1 className="text-3xl font-extrabold text-indigo-700 mb-2 text-center drop-shadow">
          D'Mamitas & Babies
        </h1>
        <p className="text-indigo-500 text-center mb-4">
          Bienvenido al sistema de gestión de valoraciones y sesiones.<br />
          ¡Tu desarrollo y bienestar es nuestra prioridad!
        </p>
        <div className="flex flex-col gap-4 w-full">
          <Link
            to="/pacientes"
            className="flex items-center justify-center gap-2 bg-indigo-200 hover:bg-indigo-300 text-indigo-800 font-bold py-3 rounded-xl text-center transition transform hover:scale-105 shadow"
          >
            <UserGroupIcon className="h-6 w-6" /> Lista de Pacientes
          </Link>
          <Link
            to="/clases"
            className="flex items-center justify-center gap-2 bg-green-200 hover:bg-green-300 text-green-800 font-bold py-3 rounded-xl text-center transition transform hover:scale-105 shadow"
          >
            <AcademicCapIcon className="h-6 w-6" /> Sesiones
          </Link>
          <Link
            to="/valoraciones"
            className="flex items-center justify-center gap-2 bg-pink-200 hover:bg-pink-300 text-pink-800 font-bold py-3 rounded-xl text-center transition transform hover:scale-105 shadow"
          >
            <ClipboardDocumentListIcon className="h-6 w-6" /> Historia Clínica
          </Link>
          <Link
            to="/reporte-paquetes"
            className="flex items-center justify-center gap-2 bg-yellow-200 hover:bg-yellow-300 text-yellow-800 font-bold py-3 rounded-xl text-center transition transform hover:scale-105 shadow"
          >
            <ChartBarIcon className="h-6 w-6" /> Reporte de Paquetes
          </Link>
        </div>
      </div>
    </div>
  );
}