import React, { useState, useEffect } from "react";
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
  fecha: "",
  hora: "",
  motivoConsulta: "",
  firmaPacienteGeneral: "",
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

  useEffect(() => {
    apiRequest(`/pacientes-adultos/${id}`)
      .then(data => setPaciente(data));
  }, [id]);

  const handleChange = (e) => {
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
      setFormulario((prev) => ({
        ...prev,
        ...e,
      }));
    }
  };

  const setFirma = (name, value) => {
    console.log(`Firma actualizada: ${name} = ${value ? 'imagen capturada' : 'vacía'}`);
    setFormulario(prev => ({
      ...prev,
      [name]: value,
    }));
  };
//const handleSiguiente = () => {
  //console.log("Avanzando al paso 6");
  //setPaso(6);
//};
  const siguiente = () => setPaso((prev) => prev + 1);
  const anterior = () => setPaso((prev) => prev - 1);

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

      // Reconstruir arrays de sesiones antes de enviar
      const sesiones = [];
      for (let i = 1; i <= 10; i++) {
        if (datosAEnviar[`fechaSesion${i}`] || datosAEnviar[`firmaPacienteSesion${i}`]) {
          const sesion = {
            nombre: `Sesión ${i}`,
            fecha: datosAEnviar[`fechaSesion${i}`] || "",
            firmaPaciente: datosAEnviar[`firmaPacienteSesion${i}`] || "",
          };
          sesiones.push(sesion);
        }
      }

      const sesionesIntensivo = [];
      for (let i = 1; i <= 10; i++) {
        if (datosAEnviar[`fechaSesionIntensivo${i}`] || datosAEnviar[`firmaPacienteSesionIntensivo${i}`]) {
          sesionesIntensivo.push({
            nombre: `Sesión Intensivo ${i}`,
            fecha: datosAEnviar[`fechaSesionIntensivo${i}`] || "",
            firmaPaciente: datosAEnviar[`firmaPacienteSesionIntensivo${i}`] || "",
          });
        }
      }

      // Agregar los arrays reconstruidos
      datosAEnviar.sesiones = sesiones;
      datosAEnviar.sesionesIntensivo = sesionesIntensivo;

      // Agregar referencia al paciente
      datosAEnviar.paciente = paciente._id;

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
        navigate("/consentimientos-perinatales");
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
          Paso {paso} de 8
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
            siguiente={() => setPaso(6)} // <-- ¡ESTO ES LO IMPORTANTE!
          />
        )}
        {paso === 6 && (
          <Paso6ConsentimientoFisicoPerinatal
            formulario={formulario}
            handleChange={handleChange}
            setFirma={setFirma}
            anterior={anterior}
            onSubmit={siguiente}
            paciente={paciente}
          />
        )}
        {paso === 7 && (
          <Paso7ConsentimientoEducacionNacimientoPerinatal
            formulario={formulario}
            handleChange={handleChange}
            setFirma={setFirma}
            anterior={anterior}
            onSubmit={siguiente}
            paciente={paciente}
          />
        )}
        {paso === 8 && (
          <Paso8ConsentimientoEducacionIntensivoPerinatal
            formulario={formulario}
            handleChange={handleChange}
            setFirma={setFirma}
            anterior={anterior}
            onSubmit={handleSubmit}
            paciente={paciente}
          />
        )}
       
      </form>
    </div>
  );
}