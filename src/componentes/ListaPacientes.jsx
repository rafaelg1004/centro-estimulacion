import React, { useState } from "react";
import TablaDinamica from "./ui/TablaDinamica";
import { format } from "date-fns";

export default function ListaPacientesUnificada() {
  // Columnas inteligentes para todos los pacientes
  const columnasUnificadas = [
    {
      header: "Paciente",
      accessor: "nombres",
      format: (val, row) => (
        <div className="flex flex-col">
          <span className="font-bold text-indigo-900">{val} {row.apellidos}</span>
          <span className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold italic">{row.tipoDocumentoIdentificacion || row.tipoDocumento}: {row.numDocumentoIdentificacion}</span>
        </div>
      )
    },
    {
      header: "Identificación CLN",
      accessor: "tipo",
      format: (val, row) => {
        const isNino = ['RC', 'TI', 'MS', 'AS', 'CD', 'CN', 'SC'].includes(row.tipoDocumentoIdentificacion);
        return (
          <span className={`px - 2 py - 0.5 rounded - full text - [10px] font - black uppercase tracking - tighter ${isNino ? 'bg-indigo-50 text-indigo-600 border border-indigo-100' : 'bg-pink-50 text-pink-600 border border-pink-100'} `}>
            {isNino ? '🧒 Pediátrico' : '🤰 Materno'}
          </span>
        );
      }
    },
    {
      header: "Edad",
      accessor: "edad",
      format: (val, row) => {
        const isNino = ['RC', 'TI', 'MS', 'AS', 'CD', 'CN', 'SC'].includes(row.tipoDocumentoIdentificacion);
        return `${val} ${isNino ? 'meses' : 'años'} `;
      }
    },
    { header: "Género", accessor: "genero", format: (val, row) => row.codSexo || val || 'N/A' },
    {
      header: "Contacto / Acudiente",
      accessor: "celular",
      format: (val, row) => (
        <div className="flex flex-col text-xs">
          <span className="font-semibold">📞 {val || row.telefono || 'Sin tel'}</span>
          <span className="text-gray-500 truncate max-w-[150px]">{row.nombreMadre || row.nombrePadre || row.acompanante || 'Directo'}</span>
        </div>
      )
    },
    {
      header: "Aseguradora",
      accessor: "aseguradora",
      format: (val) => <span className="text-xs font-medium text-gray-600 italic underline decoration-indigo-200">{val || 'Particular'}</span>
    }
  ];

  return (
    <div className="p-4">
      <TablaDinamica
        titulo="Lista Maestra de Pacientes"
        endpoint="/pacientes"
        columnas={columnasUnificadas}
        acciones={{
          ver: "/pacientes/",
          editar: "/pacientes/editar/",
          eliminar: true
        }}
      />
    </div>
  );
}