import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiRequest, API_CONFIG } from "../../config/api";
import Paso1DatosPersonalesPerinatal from "./Paso1DatosPersonalesPerinatal";
import Paso2AntecedentesPerinatal from "./Paso2AntecedentesPerinatal";
import Paso3EstadoSaludPerinatal from "./Paso3EstadoSaludPerinatal";
import Paso4EvaluacionFisioterapeuticaPerinatal from "./Paso4EvaluacionFisioterapeuticaPerinatal";
import Paso5DiagnosticoIntervencionPerinatal from "./Paso5DiagnosticoIntervencionPerinatal";
import Paso6ConsentimientoFisicoPerinatal from "./Paso6ConsentimientoFisicoPerinatal";
import Paso7ConsentimientoEducacionNacimientoPerinatal from "./Paso7ConsentimientoEducacionNacimientoPerinatal";
import Paso8ConsentimientoEducacionIntensivoPerinatal from "./Paso8ConsentimientoEducacionIntensivoPerinatal";
import Swal from "sweetalert2";

// Funciones de utilidad para S3
async function subirFirmaAS3(firmaBase64) {
  function dataURLtoFile(dataurl, filename) {
    const arr = dataurl.split(",");
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  }
  const file = dataURLtoFile(firmaBase64, 'firma.png');
  const formData = new FormData();
  formData.append('imagen', file);

  const res = await fetch(`${API_CONFIG.BASE_URL}/api/upload`, {
    method: 'POST',
    body: formData,
  });
  const data = await res.json();
  return data.url; // URL pública de S3
}

const FORMULARIO_INICIAL = {
  fecha: new Date().toISOString().split('T')[0], // Fecha actual en formato YYYY-MM-DD
  hora: new Date().toTimeString().slice(0, 5), // Hora actual en formato HH:MM
  motivoConsulta: "",
  
  // Campos del Paso 5
  diagnosticoFisioterapeutico: "",
  planIntervencion: "",
  visitaCierre: "",
  firmaPaciente: "",
  firmaFisioterapeuta: "",
  firmaAutorizacion: "",
  
  // Firmas de consentimientos
  firmaPacienteGeneral: "",
  firmaFisioterapeutaGeneral: "",
  firmaPacienteFisico: "",
  firmaFisioterapeutaFisico: "",
  firmaPacienteEducacion: "",
  firmaFisioterapeutaEducacion: "",
  // Campos de sesiones del Paso 7
  fechaSesion1: "",
  firmaPacienteSesion1: "",
  fechaSesion2: "",
  firmaPacienteSesion2: "",
  fechaSesion3: "",
  firmaPacienteSesion3: "",
  fechaSesion4: "",
  firmaPacienteSesion4: "",
  fechaSesion5: "",
  firmaPacienteSesion5: "",
  fechaSesion6: "",
  firmaPacienteSesion6: "",
  fechaSesion7: "",
  firmaPacienteSesion7: "",
  fechaSesion8: "",
  firmaPacienteSesion8: "",
  fechaSesion9: "",
  firmaPacienteSesion9: "",
  fechaSesion10: "",
  firmaPacienteSesion10: "",
  // Campos de sesiones intensivo del Paso 8
  fechaSesionIntensivo1: "",
  firmaPacienteSesionIntensivo1: "",
  fechaSesionIntensivo2: "",
  firmaPacienteSesionIntensivo2: "",
  fechaSesionIntensivo3: "",
  firmaPacienteSesionIntensivo3: "",
  // ...todos los otros campos de todos los pasos...
};

export default function ValoracionIngresoProgramaPerinatal() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formulario, setFormulario] = useState(FORMULARIO_INICIAL);
  const [paciente, setPaciente] = useState(null);
  const [paso, setPaso] = useState(1);
  const [consentimientoExistente, setConsentimientoExistente] = useState(null);
  const [mostrarAdvertenciaCambio, setMostrarAdvertenciaCambio] = useState(false);
  const [nuevoTipoPrograma, setNuevoTipoPrograma] = useState(null);

  useEffect(() => {
    apiRequest(`/pacientes-adultos/${id}`)
      .then(data => setPaciente(data));
    
    // Verificar si ya existe un consentimiento perinatal
    apiRequest(`/consentimiento-perinatal/paciente/${id}`)
      .then(consentimientos => {
        if (consentimientos && consentimientos.length > 0) {
          setConsentimientoExistente(consentimientos[0]);
          setFormulario(prev => ({
            ...prev,
            tipoPrograma: consentimientos[0].tipoPrograma
          }));
        }
      })
      .catch(err => console.log('No hay consentimientos existentes'));
    
    // Establecer fecha y hora actual si están vacías
    if (!formulario.fecha || !formulario.hora) {
      const ahora = new Date();
      setFormulario(prev => ({
        ...prev,
        fecha: prev.fecha || ahora.toISOString().split('T')[0],
        hora: prev.hora || ahora.toTimeString().slice(0, 5)
      }));
    }
    
    // Debug: Ver estado inicial del formulario
    console.log('=== ESTADO INICIAL FORMULARIO ===');
    console.log('firmaPacienteGeneral:', formulario.firmaPacienteGeneral);
    console.log('firmaPacienteGeneralIntensivo:', formulario.firmaPacienteGeneralIntensivo);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleChange = useCallback((e) => {
    // Si es evento de input
    if (e && e.target) {
      const { name, value, type, checked } = e.target;
      const newValue = type === "checkbox" ? checked : value;
      console.log(`Campo actualizado: ${name} = ${newValue}`);
      setFormulario((prev) => ({
        ...prev,
        [name]: newValue,
      }));
    }
    // Si es objeto directo { campo: valor }
    else if (typeof e === "object" && e !== null) {
      console.log(`Campos actualizados:`, e);
      // Debug específico para firmas
      if (e.firmaPacienteGeneral || e.firmaPacienteGeneralIntensivo) {
        console.log('⚠️ ALERTA: Se está actualizando una firma general:', e);
      }
      setFormulario((prev) => ({
        ...prev,
        ...e,
      }));
    }
  }, []);

  const setFirma = (name, value) => {
    console.log(`🖊️ Firma actualizada: ${name} = ${value ? 'imagen capturada' : 'vacía'}`);
    console.log('🔍 Estado actual antes de actualizar:', {
      firmaPacienteGeneral: formulario.firmaPacienteGeneral ? 'TIENE' : 'VACIO',
      firmaPacienteEducacion: formulario.firmaPacienteEducacion ? 'TIENE' : 'VACIO'
    });
    setFormulario(prev => {
      const nuevoEstado = {
        ...prev,
        [name]: value,
      };
      console.log('🔄 Nuevo estado después de actualizar:', {
        firmaPacienteGeneral: nuevoEstado.firmaPacienteGeneral ? 'TIENE' : 'VACIO',
        firmaPacienteEducacion: nuevoEstado.firmaPacienteEducacion ? 'TIENE' : 'VACIO'
      });
      return nuevoEstado;
    });
  };

  const manejarCambioTipoPrograma = (tipo) => {
    // Si hay consentimiento existente y tiene sesiones, mostrar advertencia
    if (consentimientoExistente && 
        consentimientoExistente.tipoPrograma !== tipo &&
        ((consentimientoExistente.sesiones && consentimientoExistente.sesiones.length > 0) ||
         (consentimientoExistente.sesionesIntensivo && consentimientoExistente.sesionesIntensivo.length > 0))) {
      setNuevoTipoPrograma(tipo);
      setMostrarAdvertenciaCambio(true);
    } else {
      handleChange({tipoPrograma: tipo});
    }
  };

  const confirmarCambioTipoPrograma = async () => {
    try {
      // Recopilar URLs de firmas de S3 para eliminar
      const firmasParaEliminar = [];
      
      // Firmas de sesiones
      if (consentimientoExistente.sesiones) {
        consentimientoExistente.sesiones.forEach(sesion => {
          if (sesion.firmaPaciente && sesion.firmaPaciente.startsWith('https://')) {
            firmasParaEliminar.push(sesion.firmaPaciente);
          }
        });
      }
      
      if (consentimientoExistente.sesionesIntensivo) {
        consentimientoExistente.sesionesIntensivo.forEach(sesion => {
          if (sesion.firmaPaciente && sesion.firmaPaciente.startsWith('https://')) {
            firmasParaEliminar.push(sesion.firmaPaciente);
          }
        });
      }
      
      // Firmas de consentimientos que no se van a usar
      const tipoAnterior = consentimientoExistente.tipoPrograma;
      
      console.log('=== ANALIZANDO FIRMAS PARA ELIMINAR ===');
      console.log('Tipo anterior:', tipoAnterior);
      console.log('Nuevo tipo:', nuevoTipoPrograma);
      console.log('Firmas actuales:', {
        firmaPacienteGeneral: consentimientoExistente.firmaPacienteGeneral ? 'TIENE' : 'VACIO',
        firmaFisioterapeutaGeneral: consentimientoExistente.firmaFisioterapeutaGeneral ? 'TIENE' : 'VACIO',
        firmaPacienteFisico: consentimientoExistente.firmaPacienteFisico ? 'TIENE' : 'VACIO',
        firmaFisioterapeutaFisico: consentimientoExistente.firmaFisioterapeutaFisico ? 'TIENE' : 'VACIO',
        firmaPacienteEducacion: consentimientoExistente.firmaPacienteEducacion ? 'TIENE' : 'VACIO',
        firmaFisioterapeutaEducacion: consentimientoExistente.firmaFisioterapeutaEducacion ? 'TIENE' : 'VACIO'
      });
      
      // Eliminar TODAS las firmas de consentimientos que no corresponden al nuevo tipo
      // Firmas de educación (firmaPacienteGeneral, firmaFisioterapeutaGeneral)
      if (nuevoTipoPrograma !== 'educacion' && nuevoTipoPrograma !== 'ambos') {
        console.log('Eliminando firmas de educación porque nuevo tipo no es educacion ni ambos');
        if (consentimientoExistente.firmaPacienteGeneral && consentimientoExistente.firmaPacienteGeneral.startsWith('https://')) {
          console.log('Agregando firmaPacienteGeneral para eliminar:', consentimientoExistente.firmaPacienteGeneral);
          firmasParaEliminar.push(consentimientoExistente.firmaPacienteGeneral);
        }
        if (consentimientoExistente.firmaFisioterapeutaGeneral && consentimientoExistente.firmaFisioterapeutaGeneral.startsWith('https://')) {
          console.log('Agregando firmaFisioterapeutaGeneral para eliminar:', consentimientoExistente.firmaFisioterapeutaGeneral);
          firmasParaEliminar.push(consentimientoExistente.firmaFisioterapeutaGeneral);
        }
      }
      
      // Firmas físicas (firmaPacienteFisico, firmaFisioterapeutaFisico)
      if (nuevoTipoPrograma !== 'fisico' && nuevoTipoPrograma !== 'ambos') {
        console.log('Eliminando firmas físicas porque nuevo tipo no es fisico ni ambos');
        if (consentimientoExistente.firmaPacienteFisico && consentimientoExistente.firmaPacienteFisico.startsWith('https://')) {
          console.log('Agregando firmaPacienteFisico para eliminar:', consentimientoExistente.firmaPacienteFisico);
          firmasParaEliminar.push(consentimientoExistente.firmaPacienteFisico);
        }
        if (consentimientoExistente.firmaFisioterapeutaFisico && consentimientoExistente.firmaFisioterapeutaFisico.startsWith('https://')) {
          console.log('Agregando firmaFisioterapeutaFisico para eliminar:', consentimientoExistente.firmaFisioterapeutaFisico);
          firmasParaEliminar.push(consentimientoExistente.firmaFisioterapeutaFisico);
        }
      }
      
      // Firmas intensivas (firmaPacienteEducacion, firmaFisioterapeutaEducacion)
      if (nuevoTipoPrograma !== 'intensivo') {
        console.log('Eliminando firmas intensivas porque nuevo tipo no es intensivo');
        if (consentimientoExistente.firmaPacienteEducacion && consentimientoExistente.firmaPacienteEducacion.startsWith('https://')) {
          console.log('Agregando firmaPacienteEducacion para eliminar:', consentimientoExistente.firmaPacienteEducacion);
          firmasParaEliminar.push(consentimientoExistente.firmaPacienteEducacion);
        }
        if (consentimientoExistente.firmaFisioterapeutaEducacion && consentimientoExistente.firmaFisioterapeutaEducacion.startsWith('https://')) {
          console.log('Agregando firmaFisioterapeutaEducacion para eliminar:', consentimientoExistente.firmaFisioterapeutaEducacion);
          firmasParaEliminar.push(consentimientoExistente.firmaFisioterapeutaEducacion);
        }
      }
      
      console.log('Total de firmas para eliminar:', firmasParaEliminar.length);
      console.log('URLs de firmas para eliminar:', firmasParaEliminar);

      // Eliminar firmas de S3 si existen
      if (firmasParaEliminar.length > 0) {
        try {
          await apiRequest('/eliminar-firmas-s3', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ urls: firmasParaEliminar })
          });
        } catch (s3Error) {
          console.warn('Error eliminando firmas de S3:', s3Error);
        }
      }

      // Actualizar el consentimiento eliminando las sesiones y firmas no utilizadas
      const datosActualizados = { ...consentimientoExistente };
      datosActualizados.sesiones = [];
      datosActualizados.sesionesIntensivo = [];
      datosActualizados.tipoPrograma = nuevoTipoPrograma;
      
      // Limpiar TODAS las firmas de consentimientos que no corresponden al nuevo tipo
      console.log('=== LIMPIANDO FIRMAS EN BASE DE DATOS ===');
      
      // Firmas de educación
      if (nuevoTipoPrograma !== 'educacion' && nuevoTipoPrograma !== 'ambos') {
        console.log('Limpiando firmas de educación en BD');
        datosActualizados.firmaPacienteGeneral = '';
        datosActualizados.firmaFisioterapeutaGeneral = '';
      }
      
      // Firmas físicas
      if (nuevoTipoPrograma !== 'fisico' && nuevoTipoPrograma !== 'ambos') {
        console.log('Limpiando firmas físicas en BD');
        datosActualizados.firmaPacienteFisico = '';
        datosActualizados.firmaFisioterapeutaFisico = '';
      }
      
      // Firmas intensivas
      if (nuevoTipoPrograma !== 'intensivo') {
        console.log('Limpiando firmas intensivas en BD');
        datosActualizados.firmaPacienteEducacion = '';
        datosActualizados.firmaFisioterapeutaEducacion = '';
      }
      
      console.log('Firmas que quedarán después de limpiar:', {
        firmaPacienteGeneral: datosActualizados.firmaPacienteGeneral || 'VACIO',
        firmaFisioterapeutaGeneral: datosActualizados.firmaFisioterapeutaGeneral || 'VACIO',
        firmaPacienteFisico: datosActualizados.firmaPacienteFisico || 'VACIO',
        firmaFisioterapeutaFisico: datosActualizados.firmaFisioterapeutaFisico || 'VACIO',
        firmaPacienteEducacion: datosActualizados.firmaPacienteEducacion || 'VACIO',
        firmaFisioterapeutaEducacion: datosActualizados.firmaFisioterapeutaEducacion || 'VACIO'
      });

      await apiRequest(`/consentimiento-perinatal/${consentimientoExistente._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datosActualizados)
      });

      // Actualizar estado local
      setConsentimientoExistente(datosActualizados);
      handleChange({tipoPrograma: nuevoTipoPrograma});
      setMostrarAdvertenciaCambio(false);
      setNuevoTipoPrograma(null);
      
      await Swal.fire({
        icon: 'success',
        title: 'Tipo de programa cambiado',
        text: `Se eliminaron ${(consentimientoExistente.sesiones?.length || 0) + (consentimientoExistente.sesionesIntensivo?.length || 0)} sesiones existentes${firmasParaEliminar.length > 0 ? ` y ${firmasParaEliminar.length} firmas de S3` : ''}.`,
        confirmButtonColor: '#6366f1'
      });
    } catch (error) {
      console.error('Error cambiando tipo de programa:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Error al cambiar el tipo de programa',
        confirmButtonColor: '#e53e3e'
      });
    }
  };
//const handleSiguiente = () => {
  //console.log("Avanzando al paso 6");
  //setPaso(6);
//};
  const siguiente = () => {
    if (paso === 5) {
      setPaso(6);
    } else if (paso === 6) {
      setPaso(7);
    } else if (paso === 7 && formulario.tipoPrograma === "ambos") {
      setPaso(8);
    } else {
      setPaso(paso + 1);
    }
  };
  const anterior = (nuevoPaso) => {
    if (nuevoPaso) setPaso(nuevoPaso);
    else setPaso((prev) => prev - 1);
  };

  // Función de debugging temporal
  const debugFormulario = () => {
    console.log('=== DEBUG FORMULARIO ===');
    console.log('Estado completo del formulario:', formulario);
    
    const camposSesiones = {};
    for (let i = 1; i <= 10; i++) {
      if (formulario[`fechaSesion${i}`] || formulario[`firmaPacienteSesion${i}`]) {
        camposSesiones[`fechaSesion${i}`] = formulario[`fechaSesion${i}`];
        camposSesiones[`firmaPacienteSesion${i}`] = formulario[`firmaPacienteSesion${i}`] ? 'TIENE FIRMA' : 'SIN FIRMA';
      }
    }
    console.log('Campos de sesiones encontrados:', camposSesiones);
    
    // Guardar en localStorage para fácil inspección
    const debugData = {
      timestamp: new Date().toISOString(),
      formulario: formulario,
      camposSesiones: camposSesiones,
      totalCamposSesiones: Object.keys(camposSesiones).length
    };
    localStorage.setItem('debug_formulario_estado', JSON.stringify(debugData, null, 2));
    
    alert(`Campos de sesiones: ${Object.keys(camposSesiones).length}\nDatos guardados en localStorage.\nAbre DevTools > Application > Local Storage > debug_formulario_estado`);
  };

  const handleSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();

    try {
      const datosAEnviar = { ...formulario };
      
      // Lista de campos que pueden contener firmas en valoraciones perinatales
      const camposFirmas = [
        'firmaPaciente',
        'firmaFisioterapeuta',
        'firmaAutorizacion',
        'firmaPacienteConsentimiento',
        'firmaFisioterapeutaConsentimiento',
        'firmaPacienteGeneral',
        'firmaFisioterapeutaGeneral',
        'firmaPacienteGeneralIntensivo',
        'firmaFisioterapeutaGeneralIntensivo',
        // Firmas dinámicas de sesiones (Paso 7)
        'firmaPacienteSesion1',
        'firmaPacienteSesion2',
        'firmaPacienteSesion3',
        'firmaPacienteSesion4',
        'firmaPacienteSesion5',
        'firmaPacienteSesion6',
        'firmaPacienteSesion7',
        'firmaPacienteSesion8',
        'firmaPacienteSesion9',
        'firmaPacienteSesion10',
        // Firmas dinámicas de sesiones intensivo (Paso 8)
        'firmaPacienteSesionIntensivo1',
        'firmaPacienteSesionIntensivo2',
        'firmaPacienteSesionIntensivo3'
      ];

      // Procesar cada campo de firma
      for (const campo of camposFirmas) {
        if (datosAEnviar[campo] && typeof datosAEnviar[campo] === 'string' && datosAEnviar[campo].startsWith('data:image')) {
          datosAEnviar[campo] = await subirFirmaAS3(datosAEnviar[campo]);
        }
      }

      // Solo guardar el tipo de programa, las sesiones se crearán dinámicamente
      console.log('=== GUARDANDO TIPO DE PROGRAMA ===');
      console.log('Tipo de programa seleccionado:', formulario.tipoPrograma);
      
      // No crear sesiones aquí, se crearán dinámicamente en el módulo de sesiones
      datosAEnviar.sesiones = [];
      datosAEnviar.sesionesIntensivo = [];

      // Agregar referencia al paciente
      datosAEnviar.paciente = paciente._id;
      
      // DEBUG: Verificar tipoPrograma antes de crear sesiones
      console.log('=== ANTES DE CREAR SESIONES ===');
      console.log('formulario.tipoPrograma:', formulario.tipoPrograma);
      console.log('datosAEnviar.tipoPrograma:', datosAEnviar.tipoPrograma);
      console.log('Formulario completo:', formulario);

      // Asegurar que todos los campos requeridos tengan al menos un valor vacío
      const camposRequeridos = [
        'tipoPrograma',
        'diagnosticoFisioterapeutico',
        'planIntervencion',
        'visitaCierre',
        'firmaPacienteGeneral',
        'firmaFisioterapeutaGeneral',
        'firmaPacienteConsentimiento', 
        'firmaFisioterapeutaConsentimiento',
        'firmaPacienteFisico',
        'firmaFisioterapeutaFisico',
        'firmaPacienteEducacion',
        'firmaFisioterapeutaEducacion'
      ];
      
      camposRequeridos.forEach(campo => {
        if (!datosAEnviar[campo]) {
          datosAEnviar[campo] = "";
        }
      });
      
      // Asegurar que tipoPrograma se envíe
      if (formulario.tipoPrograma) {
        datosAEnviar.tipoPrograma = formulario.tipoPrograma;
      }
      
      console.log("Tipo de programa a enviar:", datosAEnviar.tipoPrograma);
      console.log("Datos completos a enviar:", datosAEnviar);

      const response = await apiRequest("/consentimiento-perinatal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datosAEnviar),
      });
      console.log("Respuesta del backend al guardar:", response); // <-- Log agregado
      if (response && response._id) {
        await Swal.fire({
          icon: "success",
          title: "¡Guardado!",
          text: "El formulario se guardó correctamente.",
          confirmButtonColor: "#6366f1"
        });
        // Redirigir a la vista de sesiones del paciente
        navigate(`/pacientes/${paciente._id}/sesiones-perinatal`);
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Error al guardar el formulario.",
          confirmButtonColor: "#e53e3e"
        });
      }
    } catch (error) {
      console.error('Error al guardar valoración perinatal:', error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Error de conexión con el servidor.",
        confirmButtonColor: "#e53e3e"
      });
    }
  };

  // Depuración de flujo
  console.log("Paso actual:", paso, "Tipo programa:", formulario.tipoPrograma);
  // (Eliminado el bloque de prueba que mostraba un mensaje en paso 7)

  if (!paciente) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[200px] bg-gradient-to-br from-indigo-100 via-pink-100 to-green-100">
        <div className="animate-spin rounded-full h-8 w-8 border-t-4 border-indigo-600 border-solid"></div>
        <span className="mt-4 text-indigo-700 font-bold">Cargando datos del paciente...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-pink-100 to-green-100 py-10 px-2">
      <form className="max-w-3xl w-full mx-auto bg-white bg-opacity-90 p-8 rounded-3xl shadow-2xl border border-indigo-100"
        onSubmit={handleSubmit}
      >
        <h2 className="text-3xl font-extrabold text-center text-indigo-700 mb-4 drop-shadow">
          Valoración de Ingreso Programa Perinatal
        </h2>
        <p className="text-center text-base text-gray-500 mb-6">
          Paso {paso} de {formulario.tipoPrograma === 'ambos' ? '8' : '7'}
        </p>
        
        {/* Botón de debug temporal - QUITAR EN PRODUCCIÓN */}
        {process.env.NODE_ENV === 'development' && (
          <div className="text-center mb-4">
            <button
              type="button"
              onClick={debugFormulario}
              className="bg-red-500 hover:bg-red-600 text-white text-xs px-3 py-1 rounded"
            >
              🐛 Debug Formulario
            </button>
          </div>
        )}
        {paso === 1 && (
          <Paso1DatosPersonalesPerinatal
            formulario={formulario}
            handleChange={handleChange}
            siguiente={siguiente}
            paciente={paciente}
          />
        )}
        {paso === 2 && (
          <Paso2AntecedentesPerinatal
            formulario={formulario}
            handleChange={handleChange}
            siguiente={siguiente}
            anterior={anterior}
          />
        )}
        {paso === 3 && (
          <Paso3EstadoSaludPerinatal
            formulario={formulario}
            handleChange={handleChange}
            siguiente={siguiente}
            anterior={anterior}
          />
        )}
        {paso === 4 && (
          <Paso4EvaluacionFisioterapeuticaPerinatal
            formulario={formulario}
            handleChange={handleChange}
            siguiente={siguiente}
            anterior={anterior}
          />
        )}
        {paso === 5 && (
          <Paso5DiagnosticoIntervencionPerinatal
            formulario={formulario}
            setFirma={setFirma}
            handleChange={handleChange}
            anterior={() => setPaso(4)}
            siguiente={siguiente} // <-- Usar la función real
          />
        )}
        {paso === 6 && (
          <div className="text-center">
            <h3 className="text-2xl font-bold text-indigo-700 mb-8">Elige el programa que mejor se adapte a las necesidades del paciente</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div 
                className={`p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 hover:shadow-lg ${
                  formulario.tipoPrograma === 'educacion' 
                    ? 'border-green-500 bg-green-50 shadow-lg transform scale-105' 
                    : 'border-gray-200 hover:border-green-300'
                }`}
                onClick={() => manejarCambioTipoPrograma('educacion')}
              >
                <div className="text-4xl mb-4">📚</div>
                <h4 className="text-xl font-bold text-green-700 mb-2">Educación</h4>
                <p className="text-gray-600 text-sm">10 sesiones teórico-prácticas de preparación para el parto</p>
              </div>
              
              <div 
                className={`p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 hover:shadow-lg ${
                  formulario.tipoPrograma === 'fisico' 
                    ? 'border-blue-500 bg-blue-50 shadow-lg transform scale-105' 
                    : 'border-gray-200 hover:border-blue-300'
                }`}
                onClick={() => manejarCambioTipoPrograma('fisico')}
              >
                <div className="text-4xl mb-4">💪</div>
                <h4 className="text-xl font-bold text-blue-700 mb-2">Físico</h4>
                <p className="text-gray-600 text-sm">8 sesiones de acondicionamiento físico perinatal</p>
              </div>
              
              <div 
                className={`p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 hover:shadow-lg ${
                  formulario.tipoPrograma === 'ambos' 
                    ? 'border-orange-500 bg-orange-50 shadow-lg transform scale-105' 
                    : 'border-gray-200 hover:border-orange-300'
                }`}
                onClick={() => manejarCambioTipoPrograma('ambos')}
              >
                <div className="text-4xl mb-4">🌟</div>
                <h4 className="text-xl font-bold text-orange-700 mb-2">Educación y Físico</h4>
                <p className="text-gray-600 text-sm">Ambos programas: 10 sesiones educación + 8 sesiones físico</p>
              </div>
              
              <div 
                className={`p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 hover:shadow-lg ${
                  formulario.tipoPrograma === 'intensivo' 
                    ? 'border-purple-500 bg-purple-50 shadow-lg transform scale-105' 
                    : 'border-gray-200 hover:border-purple-300'
                }`}
                onClick={() => manejarCambioTipoPrograma('intensivo')}
              >
                <div className="text-4xl mb-4">⚡</div>
                <h4 className="text-xl font-bold text-purple-700 mb-2">Intensivo</h4>
                <p className="text-gray-600 text-sm">3 sesiones intensivas (solo intensivo)</p>
              </div>
            </div>
            
            <div className="flex justify-between">
              <button
                type="button"
                onClick={() => anterior()}
                className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-xl transition"
              >
                Anterior
              </button>
              {formulario.tipoPrograma && (
                <button
                  type="button"
                  onClick={() => siguiente()}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-xl transition"
                >
                  Continuar
                </button>
              )}
            </div>
          </div>
        )}
        {/* EDUCACION: Solo consentimiento educación */}
        {paso === 7 && formulario.tipoPrograma === "educacion" && (
          <Paso7ConsentimientoEducacionNacimientoPerinatal
            formulario={formulario}
            handleChange={handleChange}
            setFirma={setFirma}
            anterior={anterior}
            onSubmit={handleSubmit}
            tipoPrograma={formulario.tipoPrograma}
            paciente={paciente}
          />
        )}
        
        {/* FISICO: Solo consentimiento físico */}
        {paso === 7 && formulario.tipoPrograma === "fisico" && (
          <Paso6ConsentimientoFisicoPerinatal
            formulario={formulario}
            handleChange={handleChange}
            setFirma={setFirma}
            anterior={anterior}
            onSubmit={handleSubmit}
            tipoPrograma={formulario.tipoPrograma}
            paciente={paciente}
          />
        )}
        
        {/* AMBOS: Primero educación (paso 7) */}
        {paso === 7 && formulario.tipoPrograma === "ambos" && (
          <Paso7ConsentimientoEducacionNacimientoPerinatal
            formulario={formulario}
            handleChange={handleChange}
            setFirma={setFirma}
            anterior={anterior}
            siguiente={siguiente}
            tipoPrograma={formulario.tipoPrograma}
            paciente={paciente}
          />
        )}
        
        {/* AMBOS: Luego físico (paso 8) */}
        {paso === 8 && formulario.tipoPrograma === "ambos" && (
          <Paso6ConsentimientoFisicoPerinatal
            formulario={formulario}
            handleChange={handleChange}
            setFirma={setFirma}
            anterior={anterior}
            onSubmit={handleSubmit}
            tipoPrograma={formulario.tipoPrograma}
            paciente={paciente}
          />
        )}
        
        {/* INTENSIVO: Solo consentimiento intensivo */}
        {paso === 7 && formulario.tipoPrograma === "intensivo" && (
          <Paso8ConsentimientoEducacionIntensivoPerinatal
            formulario={formulario}
            handleChange={handleChange}
            setFirma={setFirma}
            anterior={anterior}
            onSubmit={handleSubmit}
            tipoPrograma={formulario.tipoPrograma}
            paciente={paciente}
          />
        )}
       
      </form>
      
      {/* Modal de advertencia para cambio de tipo de programa */}
      {mostrarAdvertenciaCambio && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-lg w-full mx-4">
            <h3 className="text-xl font-bold text-orange-700 mb-4">
              ⚠️ Cambio de Tipo de Programa
            </h3>
            <p className="text-gray-600 mb-4">
              Al cambiar el tipo de programa se eliminarán TODAS las sesiones existentes y sus firmas.
            </p>
            
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-4">
              <h4 className="font-semibold text-orange-800 mb-2">Se eliminarán:</h4>
              <ul className="space-y-1 text-sm text-orange-700">
                {consentimientoExistente?.sesiones && consentimientoExistente.sesiones.length > 0 && (
                  <li>• {consentimientoExistente.sesiones.length} sesiones de educación</li>
                )}
                {consentimientoExistente?.sesionesIntensivo && consentimientoExistente.sesionesIntensivo.length > 0 && (
                  <li>• {consentimientoExistente.sesionesIntensivo.length} sesiones intensivas/adicionales</li>
                )}
                <li>• Todas las firmas asociadas a las sesiones</li>
              </ul>
              
              <div className="mt-3 pt-3 border-t border-orange-200">
                <p className="text-sm font-medium text-orange-800">
                  Cambio: {consentimientoExistente?.tipoPrograma} → {nuevoTipoPrograma}
                </p>
                <p className="text-xs text-orange-600 mt-1">
                  ⚠️ Esta acción no se puede deshacer
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={confirmarCambioTipoPrograma}
                className="flex-1 bg-orange-600 hover:bg-orange-700 text-white py-2 px-4 rounded-lg font-medium transition"
              >
                Sí, Cambiar Tipo
              </button>
              <button
                onClick={() => {
                  setMostrarAdvertenciaCambio(false);
                  setNuevoTipoPrograma(null);
                }}
                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg font-medium transition"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}