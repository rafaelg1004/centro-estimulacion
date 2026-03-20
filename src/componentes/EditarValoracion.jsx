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

        // Determinar el esquema usando tipoPrograma primero (más confiable que inspeccionar módulos)
        const tp = data.tipoPrograma || '';
        if (tp.includes('Lactancia') || data.moduloLactancia?.tipoLactancia) {
          setEsquema(ESQUEMA_VALORACION_LACTANCIA);
        } else if (tp.includes('Piso') || data.codConsulta === '890202') {
          setEsquema(ESQUEMA_VALORACION_PISO_PELVICO);
        } else if (tp === 'Perinatal' || data.codConsulta === '890204') {
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

  const calcularEdad = (fechaNac) => {
    if (!fechaNac) return "N/A";
    const hoy = new Date();
    const cumple = new Date(fechaNac);
    let edadAnos = hoy.getFullYear() - cumple.getFullYear();
    let edadMeses = hoy.getMonth() - cumple.getMonth();
    if (hoy.getDate() < cumple.getDate()) edadMeses--;
    if (edadMeses < 0) { edadAnos--; edadMeses += 12; }
    if (edadAnos < 2) {
      const totalMeses = (edadAnos * 12) + edadMeses;
      return `${edadAnos} años (${totalMeses} meses)`;
    }
    return `${edadAnos} años`;
  };

  if (!valoracion || !esquema) return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-indigo-600"></div>
      <p className="mt-4 text-indigo-700 font-bold">Cargando editor...</p>
    </div>
  );

  const paciente = valoracion.paciente || {};
  const isPediatria = !paciente.esAdulto;

  const camposFichaGeneral = [
    { nombre: "paciente_info_nombre", etiqueta: "Nombre del Paciente", tipo: "text", lecsolo: true, valorPorDefecto: `${paciente.nombres || ""} ${paciente.apellidos || ""}` },
    { nombre: "paciente_info_doc", etiqueta: "Identificación", tipo: "text", lecsolo: true, valorPorDefecto: `${paciente.tipoDocumentoIdentificacion || "Doc"}: ${paciente.numDocumentoIdentificacion || "S.D"}` },
    { nombre: "paciente_info_edad", etiqueta: "Edad / Sexo / Teléfono", tipo: "text", lecsolo: true, valorPorDefecto: `${calcularEdad(paciente.fechaNacimiento)} - ${paciente.codSexo === 'M' ? 'Masc' : 'Fem'} - Tel: ${paciente.datosContacto?.telefono || "N/A"}` }
  ];

  const camposExtra = [];
  if (isPediatria) {
    camposExtra.push(
      { nombre: "extra_pediatra", etiqueta: "Pediatra", tipo: "text", lecsolo: true, valorPorDefecto: paciente.pediatra || "No asignado" },
      { nombre: "extra_madre", etiqueta: "Madre", tipo: "text", lecsolo: true, valorPorDefecto: `${paciente.nombreMadre || "S.D"} (${paciente.ocupacionMadre || "S.O"})` },
      { nombre: "extra_padre", etiqueta: "Padre", tipo: "text", lecsolo: true, valorPorDefecto: `${paciente.nombrePadre || "S.D"} (${paciente.ocupacionPadre || "S.O"})` }
    );
  } else {
    camposExtra.push(
      { nombre: "extra_gestacion", etiqueta: "Datos Maternos", tipo: "text", lecsolo: true, valorPorDefecto: `Sem. Gest: ${paciente.semanasGestacion || "N/A"} - FUM: ${paciente.fum || "N/A"}` },
      { nombre: "extra_ocupacion", etiqueta: "Ocupación / Aseguradora", tipo: "text", lecsolo: true, valorPorDefecto: `${paciente.ocupacion || "S.O"} - ${paciente.aseguradora || "Particular"}` }
    );
  }

  const esquemaConPaciente = {
    ...esquema,
    titulo: `${esquema.titulo} (Editando) - ${paciente.nombres || ""}`,
    secciones: [
      {
        titulo: "Ficha del Paciente",
        siempreVisible: true,
        campos: [
          ...camposFichaGeneral,
          ...camposExtra,
          { nombre: "paciente", tipo: "hidden", valorPorDefecto: paciente._id }
        ]
      },
      ...esquema.secciones
    ]
  };

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      <DynamicFormBuilder
        esquema={esquemaConPaciente}
        initialData={valoracion}
        isPaginado={true}
        pacienteId={paciente._id}
        onSubmitSuccess={() => {
          navigate(`/valoraciones/${id}`);
        }}
      />
    </div>
  );
}