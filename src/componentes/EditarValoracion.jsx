import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiRequest } from "../config/api";
import DynamicFormBuilder from "./ui/DynamicFormBuilder";
import { ESQUEMA_VALORACION_PEDIATRIA } from "../config/esquemaValoracionPediatria";
import { ESQUEMA_VALORACION_LACTANCIA } from "../config/esquemaValoracionLactancia";
import { ESQUEMA_VALORACION_PISO_PELVICO } from "../config/esquemaValoracionPisoPelvico";
import { ESQUEMA_CONSENTIMIENTO_PERINATAL } from "../config/esquemaConsentimientoPerinatal";
import Swal from 'sweetalert2';

export default function EditarValoracion() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [valoracion, setValoracion] = useState(null);
  const [esquema, setEsquema] = useState(null);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const data = await apiRequest(`/valoraciones/${id}`);

        if (data.bloqueada) {
          Swal.fire("Inmutable", "Esta historia clínica está cerrada y no puede ser editada.", "info");
          navigate(`/valoraciones/${id}`);
          return;
        }

        setValoracion(data);

        // Determinar el esquema basándose en el contenido
        if (data.moduloLactancia && Object.keys(data.moduloLactancia).length > 1) {
          setEsquema(ESQUEMA_VALORACION_LACTANCIA);
        } else if (data.moduloPisoPelvico && Object.keys(data.moduloPisoPelvico).length > 1) {
          setEsquema(ESQUEMA_VALORACION_PISO_PELVICO);
        } else if (data.codConsulta === "890204" && !data.moduloLactancia) {
          setEsquema(ESQUEMA_CONSENTIMIENTO_PERINATAL);
        } else {
          setEsquema(ESQUEMA_VALORACION_PEDIATRIA);
        }
      } catch (err) {
        console.error("Error al cargar valoración para editar:", err);
        Swal.fire("Error", "No se pudo cargar la valoración", "error");
      }
    };
    cargarDatos();
  }, [id, navigate]);

  if (!valoracion || !esquema) return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-indigo-600"></div>
      <p className="mt-4 text-indigo-700 font-bold">Cargando editor...</p>
    </div>
  );

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      <DynamicFormBuilder
        esquema={esquema}
        initialData={valoracion}
        isPaginado={true}
        onSubmitSuccess={() => {
          navigate(`/valoraciones/${id}`);
        }}
      />
    </div>
  );
}