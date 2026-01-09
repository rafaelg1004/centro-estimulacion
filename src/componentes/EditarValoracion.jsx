import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiRequest, API_CONFIG } from "../config/api";
import Paso1DatosPaciente from "./valoraciondeingreso/Paso1DatosPaciente";
import Paso2Antecedentes from "./valoraciondeingreso/Paso2Antecedentes";
import Paso3Habitos from "./valoraciondeingreso/Paso3Habitos";
import Paso4Ontologico from "./valoraciondeingreso/Paso4Ontologico";
import Paso5Diagnostico from "./valoraciondeingreso/Paso5Diagnostico";
import Paso6Firmas from "./valoraciondeingreso/Paso6Firmas";
import Paso7Autorizacion from "./valoraciondeingreso/Paso7Autorizacion";
import Paso8Consentimiento from "./valoraciondeingreso/Paso8Consentimiento";

// ========== SOLUCIÓN PARA CHROME MÓVIL ==========
// Detección de Chrome móvil
function isMobileChrome() {
  const userAgent = navigator.userAgent;
  const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
  const isChrome = /Chrome/i.test(userAgent) && !/Edg/i.test(userAgent);
  return isMobile && isChrome;
}

// Headers optimizados para Chrome móvil
const MOBILE_CHROME_HEADERS = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
  'Cache-Control': 'no-cache',
  'Connection': 'keep-alive',
  'X-Requested-With': 'XMLHttpRequest'
};

// Función de retry con backoff exponencial
async function retryRequest(requestFn, maxRetries = 3, baseDelay = 1000) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const result = await requestFn();
      return result;
    } catch (error) {
      console.log(`🔄 Intento ${attempt} falló:`, error.message);
      
      if (attempt === maxRetries) {
        throw error;
      }
      
      // Backoff exponencial con jitter
      const delay = baseDelay * Math.pow(2, attempt - 1) + Math.random() * 1000;
      console.log(`⏳ Esperando ${delay.toFixed(0)}ms antes del siguiente intento...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}

// Función de envío optimizada para Chrome móvil
async function sendToBackendMobileOptimized(url, data, options = {}) {
  console.log('🔧 Iniciando envío optimizado para Chrome móvil...');
  console.log('📱 Dispositivo detectado:', isMobileChrome() ? 'Chrome Móvil' : 'Otro');
  
  // Preparar headers
  const headers = isMobileChrome() 
    ? { ...MOBILE_CHROME_HEADERS, ...options.headers }
    : { 'Content-Type': 'application/json', ...options.headers };
  
  // Función de envío base
  const makeRequest = async () => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      controller.abort();
    }, isMobileChrome() ? 45000 : 10000); // Timeout más largo para móvil
    
    try {
      console.log('📤 Enviando request a:', url);
      
      const fetchOptions = {
        method: options.method || 'POST',
        headers,
        signal: controller.signal,
        // Opciones específicas para móvil
        ...(isMobileChrome() && {
          cache: 'no-cache',
          mode: 'cors',
          credentials: 'same-origin'
        })
      };
      
      // Solo agregar body si no es GET
      if (options.method !== 'GET') {
        console.log('📊 Tamaño del payload:', new Blob([JSON.stringify(data)]).size, 'bytes');
        fetchOptions.body = JSON.stringify(data);
      }
      
      const response = await fetch(url, fetchOptions);
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const result = await response.json();
      console.log('✅ Respuesta exitosa recibida');
      return result;
      
    } catch (error) {
      clearTimeout(timeoutId);
      
      if (error.name === 'AbortError') {
        throw new Error('⏰ Timeout - La solicitud tardó demasiado. Intenta cerrar otras pestañas.');
      }
      
      throw error;
    }
  };
  
  // Ejecutar con retry para Chrome móvil
  if (isMobileChrome()) {
    return await retryRequest(makeRequest, 3, 2000);
  } else {
    return await makeRequest();
  }
}

// Limpieza de datos específica para móvil
function cleanFormDataForMobile(data) {
  const cleaned = JSON.parse(JSON.stringify(data));
  
  // Eliminar campos undefined/null que pueden causar problemas en móvil
  function removeEmptyFields(obj) {
    if (obj === null || obj === undefined) return;
    Object.keys(obj).forEach(key => {
      if (obj[key] === null || obj[key] === undefined || obj[key] === '') {
        delete obj[key];
      } else if (typeof obj[key] === 'object' && !Array.isArray(obj[key]) && obj[key] !== null) {
        removeEmptyFields(obj[key]);
      }
    });
  }
  
  removeEmptyFields(cleaned);
  
  // Validar arrays críticos
  if (cleaned.sesiones && !Array.isArray(cleaned.sesiones)) {
    console.warn('⚠️ Sesiones no es un array, convirtiendo...');
    cleaned.sesiones = [];
  }
  
  return cleaned;
}
// ========== FIN SOLUCIÓN CHROME MÓVIL ==========

const InputField = ({ label, name, type = "text", value, onChange, touched, required, disabled }) => {
  const id = `input-${name}`;
  return (
    <div>
      <label htmlFor={id} className="block font-semibold mb-1">
        {label}{required && <span className="text-red-500">*</span>}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-base bg-indigo-50 shadow-sm
          ${touched && required && (!value || value.toString().trim() === "") ? "border-red-500" : "border-indigo-200"}
          ${disabled ? "bg-gray-100 text-gray-500 cursor-not-allowed" : ""}`}
      />
      {touched && required && (!value || value.toString().trim() === "") && (
        <span className="text-red-500 text-xs">Este campo es obligatorio</span>
      )}
    </div>
  );
};

export default function EditarValoracion() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [paso, setPaso] = useState(1);
  const [subPaso2, setSubPaso2] = useState(1);
  const [valoracion, setValoracion] = useState(null);
  const [touched, setTouched] = useState({});
  const [cargando, setCargando] = useState(true);
  const [mostrarConfirmarFinalizar, setMostrarConfirmarFinalizar] = useState(false);

  // Función helper para obtener datos del paciente (modelo nuevo o antiguo)
  const obtenerDatoPaciente = (valoracion, campo) => {
    if (!valoracion) return null;
    
    // Primero intentar con el modelo nuevo (valoracion.paciente)
    if (valoracion.paciente && valoracion.paciente[campo] !== undefined) {
      return valoracion.paciente[campo];
    }
    
    // Si no existe, intentar con el modelo antiguo (directamente en valoracion)
    if (valoracion[campo] !== undefined) {
      return valoracion[campo];
    }
    
    // Si no existe en ninguno, devolver null
    return null;
  };

  // Definir los arrays de firmas al inicio
  const firmasFormulario = [
    "firmaProfesional",
    "firmaRepresentante",
    "firmaAcudiente",
    "firmaFisioterapeuta",
    "firmaAutorizacion",
    // agrega aquí cualquier otro campo de firma que uses
  ];

  const firmasConsentimiento = [
    "consentimiento_firmaAcudiente",
    "consentimiento_firmaFisio",
    // agrega aquí cualquier otro campo de firma en consentimiento
  ];

  useEffect(() => {
    // Capturar información del dispositivo para debugging móvil
    const deviceInfo = {
      screenWidth: window.screen.width,
      screenHeight: window.screen.height,
      windowWidth: window.innerWidth,
      windowHeight: window.innerHeight,
      userAgent: navigator.userAgent,
      platform: navigator.platform,
      memory: navigator.deviceMemory || 'no disponible',
      connectionType: navigator.connection?.effectiveType || 'no disponible',
      timestamp: new Date().toISOString()
    };
    
    console.log('📱 Información del dispositivo:', deviceInfo);
    
    // OPTIMIZACIÓN: Cargar SOLO la valoración específica, no todas
    console.log('🚀 OPTIMIZACIÓN: Cargando solo valoración específica ID:', id);
    const startTime = performance.now();
    
    // Usar endpoint optimizado que solo devuelve UNA valoración
    apiRequest(`/valoraciones/${id}`)
      .then(data => {
        const loadTime = performance.now() - startTime;
        console.log(`✅ Valoración cargada en ${loadTime.toFixed(0)}ms`);
        console.log('📊 Tamaño de la valoración:', JSON.stringify(data).length, 'caracteres');
        
        // Crear una versión unificada con datos del paciente accesibles directamente
        const valoracionUnificada = {
          ...data,
          // Asegurar que los datos del paciente estén disponibles directamente en la valoración
          nombres: obtenerDatoPaciente(data, 'nombres'),
          cedula: obtenerDatoPaciente(data, 'cedula'),
          genero: obtenerDatoPaciente(data, 'genero'),
          edad: obtenerDatoPaciente(data, 'edad'),
          lugarNacimiento: obtenerDatoPaciente(data, 'lugarNacimiento'),
          fechaNacimiento: obtenerDatoPaciente(data, 'fechaNacimiento') || obtenerDatoPaciente(data, 'nacimiento'),
          registroCivil: obtenerDatoPaciente(data, 'registroCivil'),
          peso: obtenerDatoPaciente(data, 'peso'),
          talla: obtenerDatoPaciente(data, 'talla'),
          direccion: obtenerDatoPaciente(data, 'direccion'),
          telefono: obtenerDatoPaciente(data, 'telefono'),
          celular: obtenerDatoPaciente(data, 'celular'),
          pediatra: obtenerDatoPaciente(data, 'pediatra'),
          aseguradora: obtenerDatoPaciente(data, 'aseguradora'),
          estadoCivil: obtenerDatoPaciente(data, 'estadoCivil'),
          ocupacion: obtenerDatoPaciente(data, 'ocupacion'),
          // Datos familiares con ambos formatos
          nombreMadre: obtenerDatoPaciente(data, 'nombreMadre') || obtenerDatoPaciente(data, 'madreNombre'),
          madreNombre: obtenerDatoPaciente(data, 'madreNombre') || obtenerDatoPaciente(data, 'nombreMadre'),
          edadMadre: obtenerDatoPaciente(data, 'edadMadre') || obtenerDatoPaciente(data, 'madreEdad'),
          madreEdad: obtenerDatoPaciente(data, 'madreEdad') || obtenerDatoPaciente(data, 'edadMadre'),
          ocupacionMadre: obtenerDatoPaciente(data, 'ocupacionMadre') || obtenerDatoPaciente(data, 'madreOcupacion'),
          madreOcupacion: obtenerDatoPaciente(data, 'madreOcupacion') || obtenerDatoPaciente(data, 'ocupacionMadre'),
          escolaridadMadre: obtenerDatoPaciente(data, 'escolaridadMadre') || obtenerDatoPaciente(data, 'madreEscolaridad'),
          madreEscolaridad: obtenerDatoPaciente(data, 'madreEscolaridad') || obtenerDatoPaciente(data, 'escolaridadMadre'),
          nombrePadre: obtenerDatoPaciente(data, 'nombrePadre') || obtenerDatoPaciente(data, 'padreNombre'),
          padreNombre: obtenerDatoPaciente(data, 'padreNombre') || obtenerDatoPaciente(data, 'nombrePadre'),
          edadPadre: obtenerDatoPaciente(data, 'edadPadre') || obtenerDatoPaciente(data, 'padreEdad'),
          padreEdad: obtenerDatoPaciente(data, 'padreEdad') || obtenerDatoPaciente(data, 'edadPadre'),
          ocupacionPadre: obtenerDatoPaciente(data, 'ocupacionPadre') || obtenerDatoPaciente(data, 'padreOcupacion'),
          padreOcupacion: obtenerDatoPaciente(data, 'padreOcupacion') || obtenerDatoPaciente(data, 'ocupacionPadre'),
          escolaridadPadre: obtenerDatoPaciente(data, 'escolaridadPadre') || obtenerDatoPaciente(data, 'padreEscolaridad'),
          padreEscolaridad: obtenerDatoPaciente(data, 'padreEscolaridad') || obtenerDatoPaciente(data, 'escolaridadPadre'),
          numeroHermanos: obtenerDatoPaciente(data, 'numeroHermanos'),
          lugarQueOcupa: obtenerDatoPaciente(data, 'lugarQueOcupa')
        };
        
        console.log('🔄 Datos unificados del paciente aplicados');
        setValoracion(valoracionUnificada);
        setCargando(false);
      })
      .catch(error => {
        console.error('❌ Error cargando valoración:', error);
        const loadTime = performance.now() - startTime;
        console.log(`💥 Error después de ${loadTime.toFixed(0)}ms`);
        
        // Mostrar error específico para usuarios
        alert('Error al cargar la valoración. Intenta recargar la página.');
        setCargando(false);
      });
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setValoracion((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Mostrar indicador especial para Chrome móvil
    if (isMobileChrome()) {
      console.log('📱 CHROME MÓVIL DETECTADO - Usando optimizaciones especiales');
      setCargando(true);
      
      // Verificar conexión
      if (!navigator.onLine) {
        alert('❌ Sin conexión a internet. Verifica tu conexión e intenta nuevamente.');
        setCargando(false);
        return;
      }
    }

    try {
      // Crear una copia limpia de la valoración
      let dataToSend = { ...valoracion };

      console.log('=== INICIANDO PROCESO DE GUARDADO ===');
      console.log('Datos actuales en el formulario:', dataToSend);

      // Obtener la valoración original una sola vez para comparar
      console.log('Obteniendo valoración original de la BD...');
      const valoracionOriginal = await apiRequest(`/valoraciones/${id}`);
      
      console.log('Valoración original de la BD:', valoracionOriginal);

      // Subir todas las firmas del formulario principal y actualizar dataToSend
      console.log('Procesando firmas del formulario principal...');
      for (const campo of firmasFormulario) {
        console.log(`\n--- Procesando campo: ${campo} ---`);
        console.log(`Valor actual: ${dataToSend[campo] ? dataToSend[campo].substring(0, 50) + '...' : 'null'}`);
        console.log(`Valor original: ${valoracionOriginal[campo] ? valoracionOriginal[campo].substring(0, 50) + '...' : 'null'}`);
        
        if (dataToSend[campo] && dataToSend[campo].startsWith("data:image")) {
          console.log(`✓ ${campo} es base64, necesita subirse a S3`);
          
          // Si había una imagen anterior guardada, eliminarla
          if (valoracionOriginal[campo] && 
              valoracionOriginal[campo].includes('amazonaws.com') &&
              !valoracionOriginal[campo].startsWith("data:image")) {
            console.log(`✓ Hay imagen anterior en S3 para ${campo}: ${valoracionOriginal[campo]}`);
            console.log(`Eliminando imagen anterior...`);
            const resultadoEliminacion = await eliminarImagenDeS3(valoracionOriginal[campo]);
            console.log(`Resultado eliminación:`, resultadoEliminacion);
          } else if (valoracionOriginal[campo]) {
            console.log(`⚠️ Imagen original existe pero no es de S3: ${valoracionOriginal[campo].substring(0, 50)}...`);
          } else {
            console.log(`✗ No hay imagen anterior en ${campo} para eliminar`);
          }
          
          // Subir la nueva firma y reemplazar en dataToSend
          console.log(`Subiendo nueva imagen para ${campo}...`);
          const nuevaUrl = await subirFirmaAS3(dataToSend[campo]);
          console.log(`Nueva URL obtenida: ${nuevaUrl}`);
          dataToSend[campo] = nuevaUrl;
        } else {
          console.log(`✗ ${campo} no es base64, se mantiene sin cambios`);
        }
      }

      // Subir todas las firmas del consentimiento y actualizar dataToSend
      console.log('\nProcesando firmas del consentimiento...');
      for (const campo of firmasConsentimiento) {
        console.log(`\n--- Procesando campo consentimiento: ${campo} ---`);
        console.log(`Valor actual: ${dataToSend[campo] ? dataToSend[campo].substring(0, 50) + '...' : 'null'}`);
        console.log(`Valor original: ${valoracionOriginal[campo] ? valoracionOriginal[campo].substring(0, 50) + '...' : 'null'}`);
        
        if (dataToSend[campo] && dataToSend[campo].startsWith("data:image")) {
          console.log(`✓ ${campo} es base64, necesita subirse a S3`);
          
          // Si había una imagen anterior guardada, eliminarla
          if (valoracionOriginal[campo] && 
              valoracionOriginal[campo].includes('amazonaws.com') &&
              !valoracionOriginal[campo].startsWith("data:image")) {
            console.log(`✓ Hay imagen anterior en S3 para ${campo}: ${valoracionOriginal[campo]}`);
            console.log(`Eliminando imagen anterior...`);
            const resultadoEliminacion = await eliminarImagenDeS3(valoracionOriginal[campo]);
            console.log(`Resultado eliminación:`, resultadoEliminacion);
          } else if (valoracionOriginal[campo]) {
            console.log(`⚠️ Imagen original existe pero no es de S3: ${valoracionOriginal[campo].substring(0, 50)}...`);
          } else {
            console.log(`✗ No hay imagen anterior en ${campo} para eliminar`);
          }
          
          // Subir la nueva firma y reemplazar en dataToSend
          console.log(`Subiendo nueva imagen para ${campo}...`);
          const nuevaUrl = await subirFirmaAS3(dataToSend[campo]);
          console.log(`Nueva URL obtenida: ${nuevaUrl}`);
          dataToSend[campo] = nuevaUrl;
        } else {
          console.log(`✗ ${campo} no es base64, se mantiene sin cambios`);
        }
      }

      console.log('\n=== DATOS FINALES A ENVIAR ===');
      console.log('dataToSend final:', dataToSend);

      // Limpiar datos y usar la función apiRequest estándar
      const dataToSendCleaned = cleanFormDataForMobile(dataToSend);
      console.log('📱 Datos limpiados para móvil:', dataToSendCleaned);

      const response = await apiRequest(`/valoraciones/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSendCleaned)
      });

      console.log('✅ Respuesta del servidor:', response);

      if (!response) {
        throw new Error('Error al actualizar la valoración - respuesta vacía');
      }

      navigate(`/valoraciones/${id}`);
    } catch (error) {
      console.error('Error al guardar la valoración:', error);
      
      // Mensajes específicos para Chrome móvil
      if (isMobileChrome()) {
        if (error.message.includes('Timeout')) {
          alert('⏰ La conexión está lenta. Intenta:\n• Cerrar otras pestañas\n• Conectarte a WiFi\n• Intentar nuevamente');
        } else if (error.message.includes('Failed to fetch')) {
          alert('🌐 Problema de conexión. Verifica tu internet e intenta nuevamente.');
        } else {
          alert(`📱 Error en Chrome móvil: ${error.message}\n\nIntentos recomendados:\n• Cerrar otras apps\n• Recargar la página\n• Intentar nuevamente`);
        }
      } else {
        alert('Error al guardar los cambios. Por favor, inténtalo de nuevo.');
      }
      
      setCargando(false);
    }
  };

  const onFirmaChange = (nombre, nuevaFirma) => {
    setValoracion(prev => ({
      ...prev,
      [nombre]: nuevaFirma
    }));
  };

  useEffect(() => {
    if (paso === 8 && valoracion) {
      setValoracion((prev) => ({
        ...prev,
        consentimiento_nombreAcudiente: prev.nombreAcudiente || "",
        consentimiento_ccAcudiente: prev.cedulaAcudiente || "",
        consentimiento_lugarExpedicion: prev.consentimiento_lugarExpedicion || "",
        consentimiento_nombreNino: prev.nombres || "",
        consentimiento_registroCivil: prev.registroCivil || "",
        consentimiento_fecha: prev.fecha || "",
        consentimiento_ccFirmaAcudiente: prev.cedulaAcudiente || "",
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paso]);

  if (cargando || !valoracion) return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-indigo-100 via-pink-100 to-green-100">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-indigo-600 border-solid"></div>
      <span className="mt-6 text-indigo-700 font-bold text-lg">Cargando valoración...</span>
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-pink-100 to-green-100 py-10 px-2">
      <form
        onSubmit={handleSubmit}
        className="max-w-4xl w-full mx-auto bg-white bg-opacity-90 p-8 rounded-3xl shadow-2xl border border-indigo-100"
      >
        <button
          type="button"
          onClick={() => navigate("/")}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-6 rounded-xl mb-4 shadow transition"
        >
          Volver al inicio
        </button>
        <h2 className="text-3xl font-extrabold text-center text-indigo-700 mb-4 drop-shadow">
          Editar Valoración
        </h2>
        <p className="text-center text-base text-gray-500 mb-6">
          Paso {paso}
        </p>

        {paso === 1 && (
          <Paso1DatosPaciente
            formulario={valoracion}
            handleChange={handleChange}
            touched={touched}
            camposObligatorios={[]}
            pasoCompleto={true}
            siguiente={() => setPaso(2)}
            InputField={InputField}
          />
        )}

        {paso === 2 && (
          <Paso2Antecedentes
            formulario={valoracion}
            handleChange={handleChange}
            touched={touched}
            camposObligatorios={[]}
            camposObligatoriosSubpaso2={{}}
            subPaso2={subPaso2}
            setSubPaso2={setSubPaso2}
            setPaso={setPaso}
            subPaso2Completo={true}
            subPaso2CompletoCampos={() => true}
            setTouched={setTouched}
            setFormulario={setValoracion}
            InputField={InputField}
          />
        )}
        {paso === 3 && (
          <Paso3Habitos
            formulario={valoracion}
            handleChange={handleChange}
            touched={touched}
            camposObligatorios={[]}
            pasoCompleto={true}
            setPaso={setPaso}
            InputField={InputField}
          />
        )}
        {paso === 4 && (
          <Paso4Ontologico
            formulario={valoracion}
            handleChange={handleChange}
            setFormulario={setValoracion}
            setPaso={setPaso}
            InputField={InputField}
          />
        )}
        {paso === 5 && (
          <Paso5Diagnostico
            formulario={valoracion}
            handleChange={handleChange}
            setPaso={setPaso}
          />
        )}
        {paso === 6 && (
          <Paso6Firmas
            formulario={valoracion}
            handleChange={handleChange}
            setFormulario={setValoracion}
            setPaso={setPaso}
            InputField={InputField}
            onFirmaChange={onFirmaChange}
          />
        )}
        {paso === 7 && (
          <Paso7Autorizacion
            formulario={valoracion}
            handleChange={handleChange}
            setFormulario={setValoracion}
            setPaso={setPaso}
            esEdicion={true}
            onFirmaChange={onFirmaChange}
            setMostrarConfirmarFinalizar={setMostrarConfirmarFinalizar}
          />
        )}
        {paso === 8 && (
          <Paso8Consentimiento
            valoracion={valoracion || {}}
            onChange={handleChange}
            consentimientoCompleto={true}
            onVolver={() => setPaso(7)}
            setFirmaConsentimiento={(name, data) => {
              setValoracion(prev => ({
                ...prev,
                [name]: data,
              }));
            }}
            esEdicion={true}
            onFinalizar={() => setMostrarConfirmarFinalizar(true)}
          />
        )}

        <div className="flex flex-col md:flex-row justify-center items-center gap-4 mt-8">
          {paso !== 8 && (
            <button
              type="button"
              onClick={() => setPaso(paso + 1)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-bold shadow transition"
            >
              Siguiente
            </button>
          )}
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold px-6 py-3 rounded-xl shadow transition"
          >
            Cancelar
          </button>
        </div>

        {mostrarConfirmarFinalizar && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
            <div className="bg-white border border-indigo-300 text-indigo-800 px-8 py-8 rounded-2xl shadow-lg flex flex-col items-center gap-6 max-w-md w-full">
              <h2 className="text-xl font-bold text-indigo-700 mb-2">¿Deseas guardar los cambios?</h2>
              <p className="mb-4 text-gray-700">
                Si continúas, se guardarán todos los cambios realizados en la valoración.<br />
                ¿Estás seguro de que deseas finalizar?
              </p>
              <div className="flex gap-4">
                <button
                  className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-xl shadow transition"
                  onClick={() => {
                    setMostrarConfirmarFinalizar(false);
                    document.querySelector("form").requestSubmit();
                  }}
                >
                  Sí, guardar
                </button>
                <button
                  className="bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-6 rounded-xl shadow transition"
                  onClick={() => setMostrarConfirmarFinalizar(false)}
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}

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

async function eliminarImagenDeS3(imageUrl) {
  try {
    console.log(`Intentando eliminar imagen de S3: ${imageUrl}`);
    
    const result = await sendToBackendMobileOptimized(
      '/api/delete-image',
      { imageUrl },
      { method: 'DELETE' }
    );
    
    console.log(`✓ Imagen eliminada exitosamente:`, result);
    return result;
  } catch (error) {
    console.error('Error eliminando imagen de S3:', error);
    // No es crítico si falla la eliminación, continuamos con la subida
    return { error: error.message };
  }
}