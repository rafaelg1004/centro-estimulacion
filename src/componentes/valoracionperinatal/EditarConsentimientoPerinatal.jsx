import React, { useEffect, useState } from "react";
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
import Spinner from "../ui/Spinner";

// Función para subir firmas a S3
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

export default function EditarConsentimientoPerinatal() {
  console.log("EditarConsentimientoPerinatal montado");
  const { id } = useParams();
  const navigate = useNavigate();
  const [formulario, setFormulario] = useState(null);
  const [paso, setPaso] = useState(1);
  const [mostrarAdvertenciaCambio, setMostrarAdvertenciaCambio] = useState(false);
  const [nuevoTipoPrograma, setNuevoTipoPrograma] = useState(null);
  const [formularioOriginal, setFormularioOriginal] = useState(null);

  useEffect(() => {
    apiRequest(`/consentimiento-perinatal/${id}`)
      .then(data => {
        console.log("Respuesta API:", data); // <-- Agrega esto
        if (Array.isArray(data.sesiones)) {
          data.sesiones.forEach((sesion, idx) => {
            data[`fechaSesion${idx + 1}`] = sesion.fecha || "";
            data[`firmaPacienteSesion${idx + 1}`] = sesion.firmaPaciente || "";
          });
        }
        if (Array.isArray(data.sesionesIntensivo)) {
          data.sesionesIntensivo.forEach((sesion, idx) => {
            data[`fechaSesionIntensivo${idx + 1}`] = sesion.fecha || "";
            data[`firmaPacienteSesionIntensivo${idx + 1}`] = sesion.firmaPaciente || "";
          });
        }
        // Solo detectar tipo de programa si no existe
        if (!data.tipoPrograma) {
          console.log("=== DETECTANDO TIPO DE PROGRAMA ===");
          console.log('Datos completos:', JSON.stringify(data, null, 2));
          console.log('Campo tipoPrograma original:', data.tipoPrograma);
          console.log('Todas las propiedades:', Object.keys(data));
          
          const tieneFirmaEducacion = !!(data.firmaPacienteGeneral || data.firmaFisioterapeutaGeneral);
          const tieneFirmaFisico = !!(data.firmaPacienteFisico || data.firmaFisioterapeutaFisico);
          const tieneFirmaIntensivo = !!(data.firmaPacienteEducacion || data.firmaFisioterapeutaEducacion);
          
          const sesionesEducacion = data.sesiones?.length || 0;
          const sesionesIntensivo = data.sesionesIntensivo?.length || 0;
          
          console.log('Firmas detectadas:', { 
            educacion: tieneFirmaEducacion, 
            fisico: tieneFirmaFisico, 
            intensivo: tieneFirmaIntensivo 
          });
          console.log('Sesiones detectadas:', { 
            educacion: sesionesEducacion, 
            intensivo: sesionesIntensivo 
          });
          
          // Detectar por firmas y sesiones con lógica mejorada
          if (sesionesIntensivo === 3 && sesionesEducacion === 0) {
            data.tipoPrograma = "intensivo";
            console.log('Detectado: INTENSIVO (3 sesiones intensivo, 0 educación)');
          } else if (sesionesEducacion === 10 && sesionesIntensivo === 10) {
            data.tipoPrograma = "ambos";
            console.log('Detectado: AMBOS (10 educación + 10 intensivo)');
          } else if (sesionesEducacion === 10 && sesionesIntensivo === 0) {
            data.tipoPrograma = "educacion";
            console.log('Detectado: EDUCACION (10 sesiones educación)');
          } else if (sesionesEducacion === 8 && sesionesIntensivo === 0) {
            data.tipoPrograma = "fisico";
            console.log('Detectado: FISICO (8 sesiones físicas)');
          } else if (tieneFirmaEducacion && tieneFirmaFisico) {
            data.tipoPrograma = "ambos";
            console.log('Detectado: AMBOS (por firmas)');
          } else if (tieneFirmaIntensivo) {
            data.tipoPrograma = "intensivo";
            console.log('Detectado: INTENSIVO (por firmas)');
          } else if (tieneFirmaEducacion) {
            data.tipoPrograma = "educacion";
            console.log('Detectado: EDUCACION (por firmas)');
          } else if (tieneFirmaFisico) {
            data.tipoPrograma = "fisico";
            console.log('Detectado: FISICO (por firmas)');
          }
          
          console.log(`RESULTADO: Tipo de programa = ${data.tipoPrograma}`);
          
          if (!data.tipoPrograma) {
            console.error('❌ PROBLEMA: tipoPrograma no está guardado en la base de datos');
          }
        } else {
          console.log(`Tipo de programa ya existía: ${data.tipoPrograma}`);
          console.log('Manteniendo tipo original sin detectar automáticamente');
        }
        
        // Guardar el tipo de programa original para comparar después
        data._tipoPrograma_original = data.tipoPrograma;
        
        // Si no se pudo determinar, usar el valor guardado en la base de datos
        if (!data.tipoPrograma) {
          console.warn("No se pudo determinar el tipo de programa automáticamente");
        }
        
        setFormulario(data);
        setFormularioOriginal(data); // Guardar copia original
      });
  }, [id]);

  if (!formulario) return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-indigo-100 via-pink-100 to-green-100">
      <Spinner />
    </div>
  );

  const handleChange = (e) => {
    // Si es evento de input
    if (e && e.target) {
      const { name, value, type, checked } = e.target;
      const newValue = type === "checkbox" ? checked : value;
      setFormulario(prev => ({
        ...prev,
        [name]: newValue,
      }));
    }
    // Si es objeto directo { campo: valor }
    else if (typeof e === "object" && e !== null) {
      // Si está cambiando el tipo de programa, limpiar las sesiones anteriores
      if (e.tipoPrograma && e.tipoPrograma !== formulario.tipoPrograma) {
        const nuevoFormulario = { ...formulario, ...e };
        
        // Limpiar todas las sesiones primero
        for (let i = 1; i <= 10; i++) {
          nuevoFormulario[`fechaSesion${i}`] = "";
          nuevoFormulario[`firmaPacienteSesion${i}`] = "";
          nuevoFormulario[`fechaSesionIntensivo${i}`] = "";
          nuevoFormulario[`firmaPacienteSesionIntensivo${i}`] = "";
        }
        nuevoFormulario.sesiones = [];
        nuevoFormulario.sesionesIntensivo = [];
        
        // Mantener el tipo de programa original para comparar al guardar
        nuevoFormulario._tipoPrograma_original = formulario._tipoPrograma_original;
        
        // Indicar que se deben actualizar las sesiones en el backend
        nuevoFormulario._actualizarSesiones = true;
        
        setFormulario(nuevoFormulario);
      } else {
        setFormulario(prev => ({ ...prev, ...e }));
      }
    }
  };

  const setFirma = (name, value) => {
    setFormulario(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const manejarCambioTipoPrograma = (tipo) => {
    // Si hay formulario original y tiene sesiones, mostrar advertencia
    if (formularioOriginal && 
        formularioOriginal.tipoPrograma !== tipo &&
        ((formularioOriginal.sesiones && formularioOriginal.sesiones.length > 0) ||
         (formularioOriginal.sesionesIntensivo && formularioOriginal.sesionesIntensivo.length > 0))) {
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
      if (formularioOriginal.sesiones) {
        formularioOriginal.sesiones.forEach(sesion => {
          if (sesion.firmaPaciente && sesion.firmaPaciente.startsWith('https://')) {
            firmasParaEliminar.push(sesion.firmaPaciente);
          }
        });
      }
      
      if (formularioOriginal.sesionesIntensivo) {
        formularioOriginal.sesionesIntensivo.forEach(sesion => {
          if (sesion.firmaPaciente && sesion.firmaPaciente.startsWith('https://')) {
            firmasParaEliminar.push(sesion.firmaPaciente);
          }
        });
      }
      
      // Firmas de consentimientos que no se van a usar
      // Firmas de educación
      if (nuevoTipoPrograma !== 'educacion' && nuevoTipoPrograma !== 'ambos') {
        if (formularioOriginal.firmaPacienteGeneral && formularioOriginal.firmaPacienteGeneral.startsWith('https://')) {
          firmasParaEliminar.push(formularioOriginal.firmaPacienteGeneral);
        }
        if (formularioOriginal.firmaFisioterapeutaGeneral && formularioOriginal.firmaFisioterapeutaGeneral.startsWith('https://')) {
          firmasParaEliminar.push(formularioOriginal.firmaFisioterapeutaGeneral);
        }
      }
      
      // Firmas físicas
      if (nuevoTipoPrograma !== 'fisico' && nuevoTipoPrograma !== 'ambos') {
        if (formularioOriginal.firmaPacienteFisico && formularioOriginal.firmaPacienteFisico.startsWith('https://')) {
          firmasParaEliminar.push(formularioOriginal.firmaPacienteFisico);
        }
        if (formularioOriginal.firmaFisioterapeutaFisico && formularioOriginal.firmaFisioterapeutaFisico.startsWith('https://')) {
          firmasParaEliminar.push(formularioOriginal.firmaFisioterapeutaFisico);
        }
      }
      
      // Firmas intensivas
      if (nuevoTipoPrograma !== 'intensivo') {
        if (formularioOriginal.firmaPacienteEducacion && formularioOriginal.firmaPacienteEducacion.startsWith('https://')) {
          firmasParaEliminar.push(formularioOriginal.firmaPacienteEducacion);
        }
        if (formularioOriginal.firmaFisioterapeutaEducacion && formularioOriginal.firmaFisioterapeutaEducacion.startsWith('https://')) {
          firmasParaEliminar.push(formularioOriginal.firmaFisioterapeutaEducacion);
        }
      }

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

      // Actualizar el formulario eliminando las sesiones y firmas no utilizadas
      const datosActualizados = { ...formulario };
      datosActualizados.sesiones = [];
      datosActualizados.sesionesIntensivo = [];
      datosActualizados.tipoPrograma = nuevoTipoPrograma;
      
      // Limpiar firmas de consentimientos que no se van a usar
      if (nuevoTipoPrograma !== 'educacion' && nuevoTipoPrograma !== 'ambos') {
        datosActualizados.firmaPacienteGeneral = '';
        datosActualizados.firmaFisioterapeutaGeneral = '';
      }
      
      if (nuevoTipoPrograma !== 'fisico' && nuevoTipoPrograma !== 'ambos') {
        datosActualizados.firmaPacienteFisico = '';
        datosActualizados.firmaFisioterapeutaFisico = '';
      }
      
      if (nuevoTipoPrograma !== 'intensivo') {
        datosActualizados.firmaPacienteEducacion = '';
        datosActualizados.firmaFisioterapeutaEducacion = '';
      }

      await apiRequest(`/consentimiento-perinatal/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datosActualizados)
      });

      // Actualizar estado local
      setFormulario(datosActualizados);
      setFormularioOriginal(datosActualizados);
      setMostrarAdvertenciaCambio(false);
      setNuevoTipoPrograma(null);
      
      await Swal.fire({
        icon: 'success',
        title: 'Tipo de programa cambiado',
        text: `Se eliminaron ${(formularioOriginal.sesiones?.length || 0) + (formularioOriginal.sesionesIntensivo?.length || 0)} sesiones existentes${firmasParaEliminar.length > 0 ? ` y ${firmasParaEliminar.length} firmas de S3` : ''}.`,
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

  const handleSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();

    // Verificar si hay firmas en el formulario
    const tieneFirmas = [
      'firmaPaciente',
      'firmaFisioterapeuta',
      'firmaPacienteConsentimiento',
      'firmaFisioterapeutaConsentimiento',
      'firmaPacienteGeneral',
      'firmaFisioterapeutaGeneral',
      'firmaPacienteFisico',
      'firmaFisioterapeutaFisico',
      'firmaPacienteEducacion',
      'firmaFisioterapeutaEducacion',
      'firmaPacienteGeneralIntensivo',
      'firmaFisioterapeutaGeneralIntensivo'
    ].some(campo => formulario[campo] && formulario[campo].length > 0);

    // Si hay firmas y se está cambiando el tipo de programa, mostrar advertencia
    if (tieneFirmas && formulario.tipoPrograma !== formulario._tipoPrograma_original) {
      const confirmar = await Swal.fire({
        icon: "warning",
        title: "Consentimiento ya firmado",
        text: "El consentimiento ya tiene firmas. Cambiar el tipo de programa eliminará todas las sesiones anteriores y requerirá nuevas firmas.",
        showCancelButton: true,
        confirmButtonText: "Continuar y eliminar sesiones anteriores",
        cancelButtonText: "Cancelar",
        confirmButtonColor: "#6366f1"
      });
      
      if (!confirmar.isConfirmed) {
        return;
      }
    }

    // DETECTAR SI CAMBIÓ EL TIPO DE PROGRAMA
    const cambioTipoPrograma = formulario.tipoPrograma !== formulario._tipoPrograma_original;

    let sesiones, sesionesIntensivo;
    
    if (cambioTipoPrograma) {
      // Si cambió el tipo, reconstruir desde campos individuales
      sesiones = [];
      for (let i = 1; i <= 10; i++) {
        if (formulario[`fechaSesion${i}`] || formulario[`firmaPacienteSesion${i}`]) {
          sesiones.push({
            nombre: `Sesión ${i}`,
            fecha: formulario[`fechaSesion${i}`] || "",
            firmaPaciente: formulario[`firmaPacienteSesion${i}`] || "",
          });
        }
      }

      sesionesIntensivo = [];
      for (let i = 1; i <= 10; i++) {
        if (formulario[`fechaSesionIntensivo${i}`] || formulario[`firmaPacienteSesionIntensivo${i}`]) {
          sesionesIntensivo.push({
            nombre: `Sesión Intensivo ${i}`,
            fecha: formulario[`fechaSesionIntensivo${i}`] || "",
            firmaPaciente: formulario[`firmaPacienteSesionIntensivo${i}`] || "",
          });
        }
      }
    } else {
      // Si NO cambió el tipo, preservar sesiones existentes
      sesiones = formulario.sesiones || [];
      sesionesIntensivo = formulario.sesionesIntensivo || [];
    }

    const dataToSend = {
      ...formulario,
      sesiones,
      sesionesIntensivo,
      // Solo actualizar sesiones si cambió el tipo de programa
      _actualizarSesiones: cambioTipoPrograma
    };

    // LIMPIAR FIRMAS SOLO SI CAMBIÓ EL TIPO DE PROGRAMA
    if (cambioTipoPrograma) {
      console.log('🧹 Limpiando firmas del tipo anterior:', formulario._tipoPrograma_original, '→', formulario.tipoPrograma);
      
      // Limpiar firmas de educación si no es educación ni ambos
      if (formulario.tipoPrograma !== 'educacion' && formulario.tipoPrograma !== 'ambos') {
        dataToSend.firmaPacienteGeneral = '';
        dataToSend.firmaFisioterapeutaGeneral = '';
        console.log('🗑️ Limpiadas firmas de educación general');
      }
      
      // Limpiar firmas físicas si no es físico ni ambos
      if (formulario.tipoPrograma !== 'fisico' && formulario.tipoPrograma !== 'ambos') {
        dataToSend.firmaPacienteFisico = '';
        dataToSend.firmaFisioterapeutaFisico = '';
        console.log('🗑️ Limpiadas firmas físicas');
      }
      
      // Limpiar firmas de educación específica si no es intensivo
      if (formulario.tipoPrograma !== 'intensivo') {
        dataToSend.firmaPacienteEducacion = '';
        dataToSend.firmaFisioterapeutaEducacion = '';
        console.log('🗑️ Limpiadas firmas de educación intensiva');
      }
    } else {
      console.log('ℹ️ Tipo de programa sin cambios, preservando sesiones existentes');
    }

    try {
      console.log('=== PROCESANDO FIRMAS ANTES DE ENVIAR ===');
      
      // Lista de campos que pueden contener firmas en valoraciones perinatales
      const camposFirmas = [
        'firmaPaciente',
        'firmaFisioterapeuta',
        'firmaAutorizacion',
        'firmaPacienteConsentimiento',
        'firmaFisioterapeutaConsentimiento',
        'firmaPacienteGeneral',
        'firmaFisioterapeutaGeneral',
        'firmaPacienteFisico',
        'firmaFisioterapeutaFisico',
        'firmaPacienteEducacion',
        'firmaFisioterapeutaEducacion',
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
        if (dataToSend[campo] && typeof dataToSend[campo] === 'string' && dataToSend[campo].startsWith('data:image')) {
          console.log(`🔄 Subiendo ${campo} a S3...`);
          dataToSend[campo] = await subirFirmaAS3(dataToSend[campo]);
          console.log(`✅ ${campo} subida a S3: ${dataToSend[campo]}`);
        }
      }

      console.log('🚀 Enviando datos procesados al backend...');
      console.log('=== DATOS COMPLETOS A ENVIAR ===');
      console.log('tipoPrograma:', dataToSend.tipoPrograma);
      console.log('Firmas que se envían:');
      console.log('- firmaPacienteGeneral:', dataToSend.firmaPacienteGeneral ? 'TIENE' : 'VACIO');
      console.log('- firmaFisioterapeutaGeneral:', dataToSend.firmaFisioterapeutaGeneral ? 'TIENE' : 'VACIO');
      console.log('- firmaPacienteFisico:', dataToSend.firmaPacienteFisico ? 'TIENE' : 'VACIO');
      console.log('- firmaFisioterapeutaFisico:', dataToSend.firmaFisioterapeutaFisico ? 'TIENE' : 'VACIO');
      console.log('- firmaPacienteEducacion:', dataToSend.firmaPacienteEducacion ? 'TIENE' : 'VACIO');
      console.log('- firmaFisioterapeutaEducacion:', dataToSend.firmaFisioterapeutaEducacion ? 'TIENE' : 'VACIO');
      console.log('Objeto completo:', JSON.stringify(dataToSend, null, 2));
      
      const response = await apiRequest(`/consentimiento-perinatal/${id}`, {
        method: "PUT",
        body: JSON.stringify(dataToSend),
      });
      
      console.log('=== RESPUESTA DEL BACKEND ===');
      console.log('Respuesta:', response);

      await Swal.fire({
        icon: "success",
        title: "¡Actualizado!",
        text: "El formulario se actualizó correctamente.",
        confirmButtonColor: "#6366f1"
      });
      navigate(`/consentimientos-perinatales/${id}`);
    } catch (error) {
      console.error('Error al guardar el consentimiento:', error);
      await Swal.fire({
        icon: "error",
        title: "Error",
        text: "Error de conexión con el servidor.",
        confirmButtonColor: "#e53e3e"
      });
    }
  };

  // Función para navegar al siguiente paso
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
  
  // Función para navegar al paso anterior
  const anterior = (nuevoPaso) => {
    if (nuevoPaso) setPaso(nuevoPaso);
    else setPaso((prev) => prev - 1);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-pink-100 to-green-100 py-10 px-2">
      <form onSubmit={handleSubmit} className="max-w-4xl w-full mx-auto bg-white bg-opacity-90 p-8 rounded-3xl shadow-2xl border border-indigo-100">
        <h2 className="text-3xl font-extrabold mb-6 text-indigo-700 text-center drop-shadow">
          Editar Consentimiento Perinatal
        </h2>
        
        {/* Debug info */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mb-4 p-3 bg-red-50 rounded border text-xs">
            <strong>DEBUG EDICION:</strong> Paso: {paso}, Tipo: {formulario?.tipoPrograma}, 
            Formulario existe: {formulario ? 'SI' : 'NO'}
          </div>
        )}
        <div className="mb-6">
          {paso === 1 && (
            <Paso1DatosPersonalesPerinatal
              formulario={formulario}
              handleChange={(e) => {
                if (e && e.target) {
                  const { name, value } = e.target;
                  handleChange({ [name]: value });
                } else {
                  handleChange(e);
                }
              }}
              siguiente={() => siguiente()}
              paciente={formulario.paciente}
            />
          )}
          {paso === 2 && (
            <Paso2AntecedentesPerinatal
              formulario={formulario}
              handleChange={(e) => {
                if (e && e.target) {
                  const { name, value } = e.target;
                  handleChange({ [name]: value });
                } else {
                  handleChange(e);
                }
              }}
              anterior={() => anterior()}
              siguiente={() => siguiente()}
            />
          )}
          {paso === 3 && (
            <Paso3EstadoSaludPerinatal
              formulario={formulario}
              handleChange={(e) => {
                if (e && e.target) {
                  const { name, value } = e.target;
                  handleChange({ [name]: value });
                } else {
                  handleChange(e);
                }
              }}
              anterior={() => anterior()}
              siguiente={() => siguiente()}
            />
          )}
          {paso === 4 && (
            <Paso4EvaluacionFisioterapeuticaPerinatal
              formulario={formulario}
              handleChange={(e) => {
                if (e && e.target) {
                  const { name, value } = e.target;
                  handleChange({ [name]: value });
                } else {
                  handleChange(e);
                }
              }}
              anterior={() => anterior()}
              siguiente={() => siguiente()}
            />
          )}
          {paso === 5 && (
            <Paso5DiagnosticoIntervencionPerinatal
              formulario={formulario}
              setFirma={setFirma}
              handleChange={handleChange}
              anterior={() => setPaso(4)}
              siguiente={siguiente}
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
              setFirma={setFirma}
              handleChange={handleChange}
              anterior={() => anterior(6)}
              onSubmit={handleSubmit}
              tipoPrograma={formulario.tipoPrograma}
              paciente={formulario.paciente}
            />
          )}
          
          {/* FISICO: Solo consentimiento físico */}
          {paso === 7 && formulario.tipoPrograma === "fisico" && (
            <Paso6ConsentimientoFisicoPerinatal
              formulario={formulario}
              setFirma={setFirma}
              handleChange={handleChange}
              anterior={() => anterior(6)}
              onSubmit={handleSubmit}
              tipoPrograma={formulario.tipoPrograma}
              paciente={formulario.paciente}
            />
          )}
          
          {/* AMBOS: Primero educación (paso 7) */}
          {paso === 7 && formulario.tipoPrograma === "ambos" && (
            <Paso7ConsentimientoEducacionNacimientoPerinatal
              formulario={formulario}
              setFirma={setFirma}
              handleChange={handleChange}
              anterior={() => anterior(6)}
              siguiente={siguiente}
              tipoPrograma={formulario.tipoPrograma}
              paciente={formulario.paciente}
            />
          )}
          
          {/* AMBOS: Luego físico (paso 8) */}
          {paso === 8 && formulario.tipoPrograma === "ambos" && (
            <Paso6ConsentimientoFisicoPerinatal
              formulario={formulario}
              setFirma={setFirma}
              handleChange={handleChange}
              anterior={() => anterior(7)}
              onSubmit={handleSubmit}
              tipoPrograma={formulario.tipoPrograma}
              paciente={formulario.paciente}
            />
          )}
          
          {/* INTENSIVO: Solo consentimiento intensivo */}
          {paso === 7 && formulario.tipoPrograma === "intensivo" && (
            <Paso8ConsentimientoEducacionIntensivoPerinatal
              formulario={formulario}
              setFirma={setFirma}
              handleChange={handleChange}
              anterior={() => anterior(6)}
              onSubmit={handleSubmit}
              tipoPrograma={formulario.tipoPrograma}
              paciente={formulario.paciente}
            />
          )}
        </div>
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
                {formularioOriginal?.sesiones && formularioOriginal.sesiones.length > 0 && (
                  <li>• {formularioOriginal.sesiones.length} sesiones de educación</li>
                )}
                {formularioOriginal?.sesionesIntensivo && formularioOriginal.sesionesIntensivo.length > 0 && (
                  <li>• {formularioOriginal.sesionesIntensivo.length} sesiones intensivas/adicionales</li>
                )}
                <li>• Todas las firmas asociadas a las sesiones</li>
                <li>• Firmas de consentimientos no utilizados</li>
              </ul>
              
              <div className="mt-3 pt-3 border-t border-orange-200">
                <p className="text-sm font-medium text-orange-800">
                  Cambio: {formularioOriginal?.tipoPrograma} → {nuevoTipoPrograma}
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