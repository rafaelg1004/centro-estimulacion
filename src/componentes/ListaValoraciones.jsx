import React, { useState, useCallback } from "react";
import TablaDinamica from "./ui/TablaDinamica";
import { apiRequest } from "../config/api";
import { LockClosedIcon } from "@heroicons/react/24/solid";

export default function HistoriaClinicaDigital() {
  // Columnas inteligentes para la Historia Clínica
  const columnasHC = [
    {
      header: "Paciente",
      accessor: "paciente",
      format: (val) => val ? (
        <div className="flex flex-col">
          <span className="font-bold text-gray-800">{val.nombres} {val.apellidos}</span>
          <span className="text-[10px] text-gray-500 italic">{val.numDocumentoIdentificacion}</span>
        </div>
      ) : "Paciente elminado"
    },
    {
      header: "Especialidad / Tipo",
      accessor: "tipo",
      format: (val) => {
        const colors = {
          'Pediatría': 'bg-indigo-100 text-indigo-700 border-indigo-200',
          'Lactancia': 'bg-pink-100 text-pink-700 border-pink-200',
          'Piso Pélvico': 'bg-orange-100 text-orange-700 border-orange-200',
          'General': 'bg-gray-100 text-gray-700 border-gray-200 shadow-sm'
        };
        const color = colors[val] || colors.General;
        return (
          <span className={`px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-tighter border ${color}`}>
            {val || 'General'}
          </span>
        );
      }
    },
    {
      header: "Fecha Atención",
      accessor: "fechaInicioAtencion",
      format: (val, row) => {
        const d = new Date(val || row.createdAt);
        return isNaN(d) ? "Fecha Inválida" : (
          <div className="flex flex-col">
            <span className="font-medium text-gray-700">{d.toLocaleDateString("es-CO", { day: '2-digit', month: 'short', year: 'numeric' })}</span>
            <span className="text-[9px] text-gray-400">{d.toLocaleTimeString("es-CO", { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
        );
      }
    },
    {
      header: "Diagnóstico / Motivo",
      accessor: "motivoConsulta",
      format: (val, row) => (
        <div className="max-w-[200px]">
          <span className="text-xs font-bold text-indigo-900 block truncate">{row.codDiagnosticoPrincipal || 'N/A'}</span>
          <span className="text-[10px] text-gray-500 italic truncate block">{val || 'No especificado'}</span>
        </div>
      )
    },
    {
      header: "Estado",
      accessor: "bloqueada",
      format: (val) => (
        <span className={`flex items-center gap-1 text-[10px] font-bold ${val ? 'text-green-600' : 'text-amber-600'}`}>
          {val ? '🔒 Cerrada' : '✍️ En Edición'}
        </span>
      )
    }
  ];

  return (
    <div className="p-4">
      <TablaDinamica
        titulo="Historia Clínica Digital Unificada"
        endpoint="/valoraciones"
        columnas={columnasHC}
        filtrosExtras={[
          { name: "busqueda", label: "Buscar por Paciente o ID", type: "text", placeholder: "Nombre o Cédula..." },
          { name: "fechaInicio", label: "Desde", type: "date" },
          { name: "fechaFin", label: "Hasta", type: "date" }
        ]}
        acciones={{
          ver: (row) => {
            // Lógica dinámica de ruta según el tipo mapeado en el backend
            let ruta = "/detalle-valoracion/";
            if (row.tipo === 'Piso Pélvico') ruta = "/valoraciones-piso-pelvico/";
            if (row.tipo === 'Lactancia') ruta = "/valoracion-ingreso-adultos-lactancia/";
            return `${ruta}${row._id}`;
          },
          editar: (row) => {
            if (row.bloqueada) return null;
            let ruta = "/valoraciones/editar/";
            if (row.tipo === 'Piso Pélvico') ruta = "/valoracion-piso-pelvico/editar/";
            if (row.tipo === 'Lactancia') ruta = "/valoraciones-adultos-lactancia/editar/";
            return `${ruta}${row._id}`;
          },
          eliminar: true
        }}
      />
    </div>
  );
}
