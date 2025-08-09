import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiRequest, API_CONFIG } from "../../config/api";
import Paso1 from "./Paso1DatosPersonalesPerinatal";
import Paso2 from "./Paso2AntecedentesPerinatal";
import Paso3 from "./Paso3EstadoSaludPerinatal";
import Paso4 from "./Paso4EvaluacionFisioterapeuticaPerinatal";
import Paso5 from "./Paso5DiagnosticoIntervencionPerinatal";
import Paso6 from "./Paso6ConsentimientoFisicoPerinatal";
import Paso7 from "./Paso7ConsentimientoEducacionNacimientoPerinatal";
import Paso8 from "./Paso8ConsentimientoEducacionIntensivoPerinatal";
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
  const [prevPaso, setPrevPaso] = useState(null);

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
        // Asegurarse de que tipoPrograma tenga un valor válido
        if (!data.tipoPrograma) {
          console.warn("tipoPrograma no está definido en los datos recibidos");
          // Intentar determinar el tipo de programa basado en las sesiones
          console.log("Intentando determinar tipo de programa...");
          console.log("Sesiones intensivo:", data.sesionesIntensivo);
          console.log("Sesiones regulares:", data.sesiones);
          
          // Verificar si hay sesiones intensivas
          if (data.sesionesIntensivo && data.sesionesIntensivo.length > 0) {
            console.log("Detectado programa intensivo por sesiones intensivas");
            data.tipoPrograma = "intensivo";
          } 
          // Verificar si hay sesiones regulares
          else if (data.sesiones && data.sesiones.length > 0) {
            // Mostrar todas las sesiones para depurar
            data.sesiones.forEach((s, i) => {
              console.log(`Sesión ${i+1}: ${s.nombreSesion}, tipo: ${s.tipoPrograma}`);
            });
            
            // Verificar directamente por el campo tipoPrograma en las sesiones
            if (data.sesiones[0] && data.sesiones[0].tipoPrograma) {
              console.log(`Usando tipoPrograma de la primera sesión: ${data.sesiones[0].tipoPrograma}`);
              data.tipoPrograma = data.sesiones[0].tipoPrograma;
            } 
            // Si no tiene tipoPrograma, intentar determinar por el nombre
            else {
              // Verificar si hay sesiones de educación y físico
              const tieneEducacion = data.sesiones.some(s => s.nombreSesion && s.nombreSesion.includes("Educación"));
              const tieneFisico = data.sesiones.some(s => s.nombreSesion && s.nombreSesion.includes("Físico"));
              
              console.log(`Detección por nombre: tieneEducacion=${tieneEducacion}, tieneFisico=${tieneFisico}`);
              
              if (tieneEducacion && tieneFisico) {
                data.tipoPrograma = "ambos";
              } else if (tieneEducacion) {
                data.tipoPrograma = "educacion";
              } else if (tieneFisico) {
                data.tipoPrograma = "fisico";
              } else {
                // Si no se puede determinar, dejar undefined para que el usuario lo seleccione
                console.log("No se pudo determinar el tipo de programa automáticamente");
                data.tipoPrograma = undefined;
              }
            }
          } else {
            // Si no hay sesiones, dejar undefined para que el usuario lo seleccione
            console.log("No hay sesiones, el usuario debe seleccionar el tipo de programa");
            data.tipoPrograma = undefined;
          }
          console.log(`Tipo de programa determinado automáticamente: ${data.tipoPrograma}`);
        }
        
        // Guardar el tipo de programa original para comparar después
        data._tipoPrograma_original = data.tipoPrograma;
        
        // Si no se pudo determinar el tipo de programa, mostrar un mensaje
        if (!data.tipoPrograma) {
          console.warn("No se pudo determinar el tipo de programa. El usuario deberá seleccionarlo.");
        }
        
        setFormulario(data);
      });
  }, [id]);

  if (!formulario) return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-indigo-100 via-pink-100 to-green-100">
      <Spinner />
    </div>
  );

  const handleChange = (nuevo) => {
    // Si está cambiando el tipo de programa, limpiar las sesiones anteriores
    if (nuevo && nuevo.tipoPrograma && nuevo.tipoPrograma !== formulario.tipoPrograma) {
      const nuevoFormulario = { ...formulario, ...nuevo };
      
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
      
      // Las sesiones se crearán nuevamente en los componentes específicos
      // según el tipo de programa seleccionado
      
      setFormulario(nuevoFormulario);
    } else {
      setFormulario(prev => ({ ...prev, ...nuevo }));
    }
  };

  const setFirma = (name, value) => {
    setFormulario(prev => ({
      ...prev,
      [name]: value,
    }));
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

    // Reconstruir arrays de sesiones
    const sesiones = [];
    for (let i = 1; i <= 10; i++) {
      if (formulario[`fechaSesion${i}`] || formulario[`firmaPacienteSesion${i}`]) {
        sesiones.push({
          nombre: `Sesión ${i}`,
          fecha: formulario[`fechaSesion${i}`] || "",
          firmaPaciente: formulario[`firmaPacienteSesion${i}`] || "",
        });
      }
    }

    const sesionesIntensivo = [];
    for (let i = 1; i <= 10; i++) {
      if (formulario[`fechaSesionIntensivo${i}`] || formulario[`firmaPacienteSesionIntensivo${i}`]) {
        sesionesIntensivo.push({
          nombre: `Sesión Intensivo ${i}`,
          fecha: formulario[`fechaSesionIntensivo${i}`] || "",
          firmaPaciente: formulario[`firmaPacienteSesionIntensivo${i}`] || "",
        });
      }
    }

    const dataToSend = {
      ...formulario,
      sesiones,
      sesionesIntensivo,
      // Asegurarse de que se envía el parámetro para actualizar sesiones si cambió el tipo de programa
      _actualizarSesiones: formulario._actualizarSesiones === true || formulario.tipoPrograma !== formulario._tipoPrograma_original
    };

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
      await apiRequest(`/consentimiento-perinatal/${id}`, {
        method: "PUT",
        body: JSON.stringify(dataToSend),
      });

      await Swal.fire({
        icon: "success",
        title: "¡Actualizado!",
        text: "El formulario se Actualizo correctamente.",
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

  // Función para navegar al siguiente paso, similar a ValoracionIngresoProgramaPerinatal
  const siguiente = (tipoProgramaArg) => {
    setPrevPaso(paso);
    const tipoPrograma = tipoProgramaArg || formulario.tipoPrograma;
    
    if (paso === 5) {
      if (tipoPrograma === "fisico") setPaso(6);
      else if (tipoPrograma === "educacion") setPaso(7);
      else if (tipoPrograma === "intensivo") setPaso(8);
      else if (tipoPrograma === "ambos") setPaso(6);
      else setPaso(paso + 1); // fallback
    } else if (paso === 6 && tipoPrograma === "ambos") {
      setPaso(7);
    } else {
      setPaso(paso + 1);
    }
  };
  
  // Función para navegar al paso anterior
  const anterior = (nuevoPaso) => {
    setPrevPaso(paso);
    if (nuevoPaso) setPaso(nuevoPaso);
    else setPaso((prev) => prev - 1);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-pink-100 to-green-100 py-10 px-2">
      <form onSubmit={handleSubmit} className="max-w-4xl w-full mx-auto bg-white bg-opacity-90 p-8 rounded-3xl shadow-2xl border border-indigo-100">
        <h2 className="text-3xl font-extrabold mb-6 text-indigo-700 text-center drop-shadow">
          Editar Consentimiento Perinatal
        </h2>
        <div className="mb-6">
          {paso === 1 && (
            <Paso1
              formulario={formulario}
              handleChange={handleChange}
              siguiente={() => siguiente()}
              paciente={formulario.paciente}
            />
          )}
          {paso === 2 && (
            <Paso2
              formulario={formulario}
              handleChange={handleChange}
              anterior={anterior}
              siguiente={() => siguiente()}
            />
          )}
          {paso === 3 && (
            <Paso3
              formulario={formulario}
              handleChange={handleChange}
              anterior={anterior}
              siguiente={() => siguiente()}
            />
          )}
          {paso === 4 && (
            <Paso4
              formulario={formulario}
              handleChange={handleChange}
              anterior={anterior}
              siguiente={() => siguiente()}
            />
          )}
          {paso === 5 && (
            <Paso5
              formulario={formulario}
              setFirma={setFirma}
              handleChange={async (nuevo) => {
                // Si el usuario intenta avanzar sin tipoPrograma, mostrar alerta
                if (nuevo && nuevo.tipoPrograma === undefined && !formulario.tipoPrograma) {
                  await Swal.fire({
                    icon: 'warning',
                    title: 'Selecciona el tipo de programa',
                    text: 'Debes seleccionar el tipo de programa para continuar.',
                  });
                  return;
                }
                handleChange(nuevo);
              }}
              anterior={() => setPaso(4)}
              siguiente={async () => {
                if (!formulario.tipoPrograma) {
                  await Swal.fire({
                    icon: 'warning',
                    title: 'Selecciona el tipo de programa',
                    text: 'Debes seleccionar el tipo de programa para continuar.',
                  });
                  return;
                }
                siguiente();
              }}
            />
          )}
          {paso === 6 && (formulario.tipoPrograma === "fisico" || formulario.tipoPrograma === "ambos") && (
            <Paso6
              formulario={formulario}
              setFirma={setFirma}
              handleChange={handleChange}
              anterior={anterior}
              siguiente={siguiente}
              paciente={formulario.paciente}
              tipoPrograma={formulario.tipoPrograma}
              onSubmit={formulario.tipoPrograma === "fisico" ? handleSubmit : undefined}
            />
          )}
          {paso === 7 && (formulario.tipoPrograma === "educacion" || formulario.tipoPrograma === "ambos") && (
            <Paso7
              formulario={formulario}
              setFirma={setFirma}
              handleChange={handleChange}
              anterior={anterior}
              siguiente={formulario.tipoPrograma === "ambos" ? undefined : undefined} // Forzar a undefined para que muestre el botón de guardar
              onSubmit={handleSubmit} // Siempre pasar handleSubmit
              paciente={formulario.paciente}
              tipoPrograma={formulario.tipoPrograma}
            />
          )}
          {paso === 8 && formulario.tipoPrograma === "intensivo" && (
            <Paso8
              formulario={formulario}
              setFirma={setFirma}
              handleChange={handleChange}
              anterior={anterior}
              onSubmit={handleSubmit}
              paciente={formulario.paciente}
              tipoPrograma={formulario.tipoPrograma}
            />
          )}
        </div>
      </form>
    </div>
  );
}