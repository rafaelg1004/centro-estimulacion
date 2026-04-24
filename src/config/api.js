/**
 * CONFIGURACIÓN DE API PARA DESARROLLO Y PRODUCCIÓN
 *
 * Este archivo centraliza las URLs de la API para facilitar
 * el desarrollo local y el deployment a producción.
 */

// Detectar URL del backend
const getBaseUrl = () => {
  // 1. Primero intentar usar variable de entorno
  if (process.env.REACT_APP_API_URL) {
    return process.env.REACT_APP_API_URL.replace(/\/+$/, ""); // quitar trailing slashes
  }

  // 2. Localhost - usar puerto específico del backend
  if (
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1"
  ) {
    return "http://127.0.0.1:3005";
  }

  // 3. Producción - usar el mismo origen (asume proxy configura /api al backend)
  return `${window.location.protocol}//${window.location.host}`;
};

// Configuración base de la API
export const API_CONFIG = {
  BASE_URL: getBaseUrl(),

  // Timeouts por entorno
  TIMEOUT: process.env.NODE_ENV === "production" ? 30000 : 10000,

  // Headers comunes
  HEADERS: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
};

// Función helper para hacer requests
export const apiRequest = async (endpoint, options = {}) => {
  // Construir URL correctamente para cada entorno
  const url = `${API_CONFIG.BASE_URL}/api${endpoint}`;

  // Agregar token de autenticación si existe
  const token = sessionStorage.getItem("token");
  const authHeaders = token ? { Authorization: `Bearer ${token}` } : {};

  const config = {
    headers: { ...API_CONFIG.HEADERS, ...authHeaders },
    ...options,
    ...(options.headers && {
      headers: { ...API_CONFIG.HEADERS, ...authHeaders, ...options.headers },
    }),
  };

  console.log(`🌐 ${config.method || "GET"} ${url}`);

  try {
    const response = await fetch(url, config);

    // Verificar el content-type de la respuesta
    const contentType = response.headers.get("content-type");
    console.log(`📄 Content-Type: ${contentType}`);

    if (!response.ok) {
      // Si la respuesta no es ok, intentar obtener el error
      let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
      let errorData = null;

      if (contentType && contentType.includes("application/json")) {
        try {
          errorData = await response.json();
          errorMessage = errorData.error || errorData.message || errorMessage;
        } catch (jsonError) {
          console.warn("❌ No se pudo parsear el error como JSON");
        }
      } else {
        // Si no es JSON, obtener el texto completo para debugging
        const errorText = await response.text();
        console.error(
          "❌ Respuesta no-JSON del servidor:",
          errorText.substring(0, 200) + "...",
        );

        if (errorText.includes("<!DOCTYPE")) {
          errorMessage = `El servidor devolvió HTML en lugar de JSON. Verifica que el backend esté corriendo en ${API_CONFIG.BASE_URL}`;
        }
      }

      // Si el token venció o es inválido, cerrar sesión automáticamente
      if (response.status === 401) {
        window.dispatchEvent(new CustomEvent("session:expired"));
      }

      // Crear un error que incluya los datos del backend
      const error = new Error(errorMessage);
      error.response = { data: errorData, status: response.status };
      throw error;
    }

    // Verificar que la respuesta exitosa sea JSON
    if (!contentType || !contentType.includes("application/json")) {
      const responseText = await response.text();
      console.error(
        "❌ Respuesta exitosa no es JSON:",
        responseText.substring(0, 200),
      );
      throw new Error("El servidor no devolvió JSON válido");
    }

    return await response.json();
  } catch (error) {
    // Mejorar el manejo de errores de red
    if (error.name === "TypeError" && error.message.includes("fetch")) {
      console.error(`❌ Error de conectividad: No se puede conectar a ${url}`);
      throw new Error(
        `No se puede conectar al servidor. Verifica que el backend esté corriendo en ${API_CONFIG.BASE_URL}`,
      );
    }

    console.error(`❌ Error en ${endpoint}:`, error.message);
    throw error;
  }
};

// Función helper para descargar archivos (PDF, Excel, etc.)
export const apiDownload = async (endpoint, options = {}) => {
  const url = `${API_CONFIG.BASE_URL}/api${endpoint}`;
  const token = sessionStorage.getItem("token");
  const authHeaders = token ? { Authorization: `Bearer ${token}` } : {};

  const config = {
    headers: { ...authHeaders }, // Solo se adjunta auth, content-type puede variar
    ...options,
    ...(options.headers && {
      headers: { ...authHeaders, ...options.headers },
    }),
  };

  try {
    const response = await fetch(url, config);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    return await response.blob();
  } catch (error) {
    console.error(
      `❌ Error descargando archivo de ${endpoint}:`,
      error.message,
    );
    throw error;
  }
};

// Endpoints específicos para fácil uso
export const API_ENDPOINTS = {
  // Autenticación
  LOGIN: "/auth/login",
  REGISTER: "/auth/register",
  ENABLE_2FA: "/auth/enable-2fa",
  VERIFY_2FA: "/auth/verify-2fa",
  VERIFY_2FA_LOGIN: "/auth/verify-2fa-login",
  DISABLE_2FA: "/auth/disable-2fa",
  USER_INFO: "/auth/me",

  // Valoraciones
  VALORACIONES: "/valoraciones",
  VALORACION_BY_ID: (id) => `/valoraciones/${id}`,

  // Consentimientos Perinatales
  CONSENTIMIENTO_PERINATAL: "/consentimiento-perinatal",
  CONSENTIMIENTO_PERINATAL_BY_ID: (id) => `/consentimiento-perinatal/${id}`,

  // Pacientes
  PACIENTES: "/pacientes",
  PACIENTE_BY_ID: (id) => `/pacientes/${id}`,

  // Upload
  UPLOAD: "/upload",
};

// Función para debug - mostrar configuración actual
export const logAPIConfig = () => {
  console.log("🔧 === CONFIGURACIÓN DE API ===");
  console.log(`📍 Entorno: ${process.env.NODE_ENV || "development"}`);
  console.log(`🌐 Base URL: ${API_CONFIG.BASE_URL}`);
  console.log(`⏱️ Timeout: ${API_CONFIG.TIMEOUT}ms`);
  console.log("===============================");
};

// Función para probar conectividad del API
export const testAPIConnection = async () => {
  console.log("🔍 === PROBANDO CONECTIVIDAD DE API ===");
  logAPIConfig();

  try {
    // Probar una ruta simple como health check
    const testUrl = `${API_CONFIG.BASE_URL}/api/pacientes`;
    console.log(`🌐 Probando: ${testUrl}`);

    // Si hay un token activo, adjuntarlo para evitar llenar los logs del servidor con "intento sin token"
    const token = sessionStorage.getItem("token");
    const authHeaders = token ? { Authorization: `Bearer ${token}` } : {};

    const response = await fetch(testUrl, {
      method: "GET",
      headers: { ...API_CONFIG.HEADERS, ...authHeaders },
    });

    console.log(`📊 Status: ${response.status} ${response.statusText}`);
    console.log(`📄 Content-Type: ${response.headers.get("content-type")}`);

    // Una respuesta 401 o 403 significa que el servidor está vivo pero no tenemos token válido, lo cual también es conexión exitosa
    if (response.ok || response.status === 401 || response.status === 403) {
      console.log("✅ Conectividad exitosa!");
      return true;
    } else {
      console.log("❌ Error en la respuesta del servidor:", response.status);
      return false;
    }
  } catch (error) {
    console.error("❌ Error de conectividad:", error.message);

    if (error.message.includes("fetch")) {
      console.log("💡 Sugerencias:");
      console.log("   1. Verifica que el backend esté corriendo");
      console.log("   2. Verifica que esté en el puerto correcto (3005)");
      console.log("   3. Verifica que no haya problemas de CORS");
    }

    return false;
  }
};
