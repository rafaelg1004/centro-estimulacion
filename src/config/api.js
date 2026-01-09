/**
 * CONFIGURACIÓN DE API PARA DESARROLLO Y PRODUCCIÓN
 * 
 * Este archivo centraliza las URLs de la API para facilitar
 * el desarrollo local y el deployment a producción.
 */

// Configuración base de la API
export const API_CONFIG = {
  // URLs según entorno - En producción usa rutas relativas (mismo servidor)
  BASE_URL: process.env.NODE_ENV === 'development' 
    ? 'http://localhost:5000' // Backend local con puerto 5000
    : '', // Producción: mismo servidor EC2, sin URL base

  // Timeouts por entorno
  TIMEOUT: process.env.NODE_ENV === 'production' ? 30000 : 10000,
  
  // Headers comunes
  HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
};

// Función helper para hacer requests
export const apiRequest = async (endpoint, options = {}) => {
  // Construir URL correctamente para cada entorno
  const url = `${API_CONFIG.BASE_URL}/api${endpoint}`;

  // Agregar token de autenticación si existe
  const token = sessionStorage.getItem("token");
  const authHeaders = token ? { 'Authorization': `Bearer ${token}` } : {};

  const config = {
    headers: { ...API_CONFIG.HEADERS, ...authHeaders },
    ...options,
    ...(options.headers && {
      headers: { ...API_CONFIG.HEADERS, ...authHeaders, ...options.headers }
    })
  };

  console.log(`🌐 ${config.method || 'GET'} ${url}`);
  
  try {
    const response = await fetch(url, config);
    
    // Verificar el content-type de la respuesta
    const contentType = response.headers.get('content-type');
    console.log(`📄 Content-Type: ${contentType}`);
    
    if (!response.ok) {
      // Si la respuesta no es ok, intentar obtener el error
      let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
      let errorData = null;
      
      if (contentType && contentType.includes('application/json')) {
        try {
          errorData = await response.json();
          errorMessage = errorData.error || errorData.message || errorMessage;
        } catch (jsonError) {
          console.warn('❌ No se pudo parsear el error como JSON');
        }
      } else {
        // Si no es JSON, obtener el texto completo para debugging
        const errorText = await response.text();
        console.error('❌ Respuesta no-JSON del servidor:', errorText.substring(0, 200) + '...');
        
        if (errorText.includes('<!DOCTYPE')) {
          errorMessage = `El servidor devolvió HTML en lugar de JSON. Verifica que el backend esté corriendo en ${API_CONFIG.BASE_URL}`;
        }
      }
      
      // Crear un error que incluya los datos del backend
      const error = new Error(errorMessage);
      error.response = { data: errorData, status: response.status };
      throw error;
    }
    
    // Verificar que la respuesta exitosa sea JSON
    if (!contentType || !contentType.includes('application/json')) {
      const responseText = await response.text();
      console.error('❌ Respuesta exitosa no es JSON:', responseText.substring(0, 200));
      throw new Error('El servidor no devolvió JSON válido');
    }
    
    return await response.json();
    
  } catch (error) {
    // Mejorar el manejo de errores de red
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      console.error(`❌ Error de conectividad: No se puede conectar a ${url}`);
      throw new Error(`No se puede conectar al servidor. Verifica que el backend esté corriendo en ${API_CONFIG.BASE_URL}`);
    }
    
    console.error(`❌ Error en ${endpoint}:`, error.message);
    throw error;
  }
};

// Endpoints específicos para fácil uso
export const API_ENDPOINTS = {
  // Autenticación
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  ENABLE_2FA: '/auth/enable-2fa',
  VERIFY_2FA: '/auth/verify-2fa',
  VERIFY_2FA_LOGIN: '/auth/verify-2fa-login',
  DISABLE_2FA: '/auth/disable-2fa',
  USER_INFO: '/auth/me',

  // Valoraciones
  VALORACIONES: '/valoraciones',
  VALORACION_BY_ID: (id) => `/valoraciones/${id}`,

  // Consentimientos Perinatales
  CONSENTIMIENTO_PERINATAL: '/consentimiento-perinatal',
  CONSENTIMIENTO_PERINATAL_BY_ID: (id) => `/consentimiento-perinatal/${id}`,

  // Pacientes
  PACIENTES: '/pacientes',
  PACIENTE_BY_ID: (id) => `/pacientes/${id}`,

  // Upload
  UPLOAD: '/upload'
};

// Función para debug - mostrar configuración actual
export const logAPIConfig = () => {
  console.log('🔧 === CONFIGURACIÓN DE API ===');
  console.log(`📍 Entorno: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 Base URL: ${API_CONFIG.BASE_URL}`);
  console.log(`⏱️ Timeout: ${API_CONFIG.TIMEOUT}ms`);
  console.log('===============================');
};

// Función para probar conectividad del API
export const testAPIConnection = async () => {
  console.log('🔍 === PROBANDO CONECTIVIDAD DE API ===');
  logAPIConfig();
  
  try {
    // Probar una ruta simple como health check
    const testUrl = `${API_CONFIG.BASE_URL}/api/pacientes`;
    console.log(`🌐 Probando: ${testUrl}`);
    
    const response = await fetch(testUrl, {
      method: 'GET',
      headers: API_CONFIG.HEADERS
    });
    
    console.log(`📊 Status: ${response.status} ${response.statusText}`);
    console.log(`📄 Content-Type: ${response.headers.get('content-type')}`);
    
    if (response.ok) {
      console.log('✅ Conectividad exitosa!');
      const data = await response.json();
      console.log(`📋 Datos recibidos: ${Array.isArray(data) ? data.length + ' elementos' : typeof data}`);
      return true;
    } else {
      console.log('❌ Error en la respuesta del servidor');
      return false;
    }
    
  } catch (error) {
    console.error('❌ Error de conectividad:', error.message);
    
    if (error.message.includes('fetch')) {
      console.log('💡 Sugerencias:');
      console.log('   1. Verifica que el backend esté corriendo');
      console.log('   2. Verifica que esté en el puerto correcto (4000)');
      console.log('   3. Verifica que no haya problemas de CORS');
    }
    
    return false;
  }
};
