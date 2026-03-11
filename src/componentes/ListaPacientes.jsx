import React, { useState } from "react";
import TablaDinamica from "./ui/TablaDinamica";
import RegistroPacienteUnificado from "./RegistroPacienteUnificado";

export default function ListaPacientesUnificada() {
  const [showModal, setShowModal] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

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
      header: "Clasificación / Programa",
      accessor: "esAdulto",
      format: (val, row) => {
        if (!val) {
          return (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-tighter bg-indigo-50 text-indigo-600 border border-indigo-100">
              🧒 Pediátrico
            </span>
          );
        }
        const esMaterna = row.semanasGestacion || row.fum || row.estadoEmbarazo;
        return (
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-tighter ${esMaterna ? 'bg-pink-50 text-pink-600 border border-pink-100' : 'bg-gray-50 text-gray-600 border border-gray-100'}`}>
            {esMaterna ? '🤰 Materna' : '👤 Adulto'}
          </span>
        );
      }
    },
    {
      header: "Edad",
      accessor: "edad",
      format: (val, row) => `${val} ${!row.esAdulto ? 'meses' : 'años'}`
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
    <div className="p-4 relative">
      <TablaDinamica
        key={refreshKey}
        titulo="Lista Maestra de Pacientes"
        endpoint="/pacientes"
        columnas={columnasUnificadas}
        acciones={{
          crear: () => setShowModal(true),
          ver: "/pacientes/",
          editar: "/pacientes/editar/",
          eliminar: true
        }}
      />

      {/* Modal Overlay para Nuevo Paciente */}
      {showModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6" style={{ backgroundColor: 'rgba(0, 0, 0, 0.55)', backdropFilter: 'blur(5px)' }}>
          <RegistroPacienteUnificado 
            isModal={true} 
            onClose={() => setShowModal(false)}
            onSuccess={() => {
              setShowModal(false);
              setRefreshKey(prev => prev + 1); // Fuerza recarga de TablaDinamica 
            }}
          />
        </div>
      )}
    </div>
  );
}