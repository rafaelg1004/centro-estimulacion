import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiRequest, apiDownload } from "../config/api";
import DynamicDetailBuilder from "./ui/DynamicDetailBuilder";
import { ESQUEMA_VALORACION_PEDIATRIA } from "../config/esquemaValoracionPediatria";
import { ESQUEMA_VALORACION_LACTANCIA } from "../config/esquemaValoracionLactancia";
import { ESQUEMA_VALORACION_PISO_PELVICO } from "../config/esquemaValoracionPisoPelvico";
import { ESQUEMA_CONSENTIMIENTO_PERINATAL } from "../config/esquemaConsentimientoPerinatal";
import Swal from 'sweetalert2';

export default function DetalleValoracion() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [valoracion, setValoracion] = useState(null);
  const [esquema, setEsquema] = useState(null);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const data = await apiRequest(`/valoraciones/${id}`);
        setValoracion(data);

        // Determinar el esquema basándose en codConsulta (CUPS) primero, luego módulos
        if (data.codConsulta === "890204") {
          // Perinatal (código CUPS específico)
          setEsquema(ESQUEMA_CONSENTIMIENTO_PERINATAL);
        } else if (data.codConsulta === "890202" || (data.moduloPisoPelvico && Object.keys(data.moduloPisoPelvico).length > 0)) {
          // Piso Pélvico
          setEsquema(ESQUEMA_VALORACION_PISO_PELVICO);
        } else if (data.moduloLactancia && Object.keys(data.moduloLactancia).length > 0) {
          // Lactancia
          setEsquema(ESQUEMA_VALORACION_LACTANCIA);
        } else if (data.moduloPediatria && Object.keys(data.moduloPediatria).length > 0) {
          // Pediatría
          setEsquema(ESQUEMA_VALORACION_PEDIATRIA);
        } else {
          // Por defecto Pediatría (o un esquema general)
          setEsquema(ESQUEMA_VALORACION_PEDIATRIA);
        }
      } catch (err) {
        console.error("Error al cargar valoración:", err);
        Swal.fire("Error", "No se pudo cargar la valoración", "error");
      }
    };
    cargarDatos();
  }, [id]);

  const handleExportPDF = async () => {
    try {
      Swal.fire({
        title: 'Generando PDF...',
        text: 'Preparando el informe con firmas desde el servidor',
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading()
      });

      const type = (valoracion.moduloPediatria) ? 'nino' : 'adulto';
      const blob = await apiDownload(`/valoraciones/reporte/exportar-pdf/${id}?type=${type}`);

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `HC_${valoracion.paciente?.numDocumentoIdentificacion || id}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      Swal.close();
    } catch (error) {
      console.error('Error exportando PDF:', error);
      Swal.fire('Error', 'No se pudo generar el reporte PDF.', 'error');
    }
  };

  const handleLock = async () => {
    const result = await Swal.fire({
      title: '¿Cerrar Historia Clínica?',
      text: "Una vez bloqueada, la historia clínica será inmutable y no podrá ser editada, cumpliendo con la normativa vigente.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, cerrar permanentemente',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      try {
        await apiRequest(`/valoraciones/${id}`, {
          method: 'PUT',
          body: JSON.stringify({ bloqueada: true })
        });
        // Recargar
        const updated = await apiRequest(`/valoraciones/${id}`);
        setValoracion(updated);
        Swal.fire('Bloqueada', 'El registro ahora es inmutable.', 'success');
      } catch (error) {
        Swal.fire('Error', 'No se pudo cerrar la historia: ' + error.message, 'error');
      }
    }
  };

  if (!valoracion || !esquema) return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-indigo-600"></div>
      <p className="mt-4 text-indigo-700 font-bold">Cargando Historia Clínica...</p>
    </div>
  );

  return (
    <DynamicDetailBuilder
      esquema={esquema}
      data={valoracion}
      onBack={() => navigate("/valoraciones")}
      onEdit={() => navigate(`/valoraciones/editar/${id}`)}
      onExportPDF={handleExportPDF}
      onLock={handleLock}
    />
  );
}
