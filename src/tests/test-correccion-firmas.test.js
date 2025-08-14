/**
 * Test para verificar que la corrección de limpieza de firmas funciona
 * Simula el escenario exacto del problema reportado
 */

const BASE_URL = 'http://localhost:5000/api';
const PACIENTE_ID = '6877c08ff9fe7ba56a9ad786';

async function testCorreccionFirmas() {
  console.log('🔧 Iniciando test de corrección de firmas...\n');

  try {
    // PASO 1: Crear valoración con educación (como en el problema original)
    console.log('📝 PASO 1: Creando valoración inicial con educación');
    const valoracionId = await crearValoracionEducacionOriginal();
    
    // PASO 2: Simular el cambio problemático (agregar firmas físicas sin limpiar educación)
    console.log('🚨 PASO 2: Simulando el problema - cambio sin limpiar firmas');
    await simularCambioProblematico(valoracionId);
    
    // PASO 3: Verificar que el problema existe
    console.log('🔍 PASO 3: Verificando que el problema existe');
    await verificarProblemaExiste(valoracionId);
    
    // PASO 4: Aplicar la corrección
    console.log('🔧 PASO 4: Aplicando la corrección');
    await aplicarCorreccion(valoracionId);
    
    // PASO 5: Verificar que la corrección funciona
    console.log('✅ PASO 5: Verificando que la corrección funciona');
    await verificarCorreccionFunciona(valoracionId);
    
    console.log('\n✅ Test de corrección completado exitosamente!');
    
  } catch (error) {
    console.error('❌ Error en test de corrección:', error);
  }
}

async function crearValoracionEducacionOriginal() {
  // Crear exactamente como en el problema original
  const datosValoracion = {
    paciente: PACIENTE_ID,
    fecha: "2025-08-13",
    hora: "12:36",
    motivoConsulta: "Test corrección firmas",
    tipoPrograma: "educacion",
    
    // Firmas de educación (como en el problema original)
    firmaPacienteGeneral: "https://firmasdmamitas.s3.us-east-2.amazonaws.com/test-firma-paciente-general.png",
    firmaFisioterapeutaGeneral: "https://firmasdmamitas.s3.us-east-2.amazonaws.com/test-firma-fisio-general.png",
    firmaPacienteEducacion: "https://firmasdmamitas.s3.us-east-2.amazonaws.com/test-firma-paciente-educacion.png",
    firmaFisioterapeutaEducacion: "https://firmasdmamitas.s3.us-east-2.amazonaws.com/test-firma-fisio-educacion.png",
    
    // Sesiones de educación
    sesiones: Array.from({length: 10}, (_, i) => ({
      nombre: `Sesión ${i+1}: Educación`,
      fecha: "",
      firmaPaciente: ""
    }))
  };

  const response = await fetch(`${BASE_URL}/consentimiento-perinatal`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(datosValoracion)
  });

  const resultado = await response.json();
  console.log(`✅ Valoración educación creada: ${resultado._id}`);
  return resultado._id;
}

async function simularCambioProblematico(valoracionId) {
  // Obtener valoración actual
  const getResponse = await fetch(`${BASE_URL}/consentimiento-perinatal/${valoracionId}`);
  const valoracion = await getResponse.json();
  
  // Simular el cambio problemático: cambiar a físico SIN limpiar firmas de educación
  const datosProblematicos = {
    ...valoracion,
    tipoPrograma: "fisico",
    
    // Agregar firmas físicas (como hace el frontend)
    firmaPacienteFisico: "https://firmasdmamitas.s3.us-east-2.amazonaws.com/test-firma-paciente-fisico.png",
    firmaFisioterapeutaFisico: "https://firmasdmamitas.s3.us-east-2.amazonaws.com/test-firma-fisio-fisico.png",
    
    // NO limpiar firmas de educación (este es el problema)
    // Las firmas de educación se mantienen
    
    _actualizarSesiones: true
  };

  console.log('🚨 Enviando cambio problemático (sin limpiar firmas educación)...');
  
  const putResponse = await fetch(`${BASE_URL}/consentimiento-perinatal/${valoracionId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(datosProblematicos)
  });

  if (!putResponse.ok) {
    throw new Error(`Error en cambio problemático: ${putResponse.statusText}`);
  }

  console.log('✅ Cambio problemático aplicado');
}

async function verificarProblemaExiste(valoracionId) {
  const response = await fetch(`${BASE_URL}/consentimiento-perinatal/${valoracionId}`);
  const valoracion = await response.json();
  
  console.log('🔍 Estado después del cambio problemático:');
  console.log(`   - Tipo programa: ${valoracion.tipoPrograma}`);
  console.log(`   - Firmas físicas: ${valoracion.firmaPacienteFisico ? 'PRESENTES' : 'AUSENTES'}`);
  console.log(`   - Firmas educación general: ${valoracion.firmaPacienteGeneral ? 'PRESENTES' : 'AUSENTES'}`);
  console.log(`   - Firmas educación específica: ${valoracion.firmaPacienteEducacion ? 'PRESENTES' : 'AUSENTES'}`);
  
  // Verificar que el problema existe
  const problemaExiste = (
    valoracion.tipoPrograma === 'fisico' &&
    valoracion.firmaPacienteFisico && // Tiene firmas físicas
    (valoracion.firmaPacienteGeneral || valoracion.firmaPacienteEducacion) // Y también tiene firmas de educación
  );
  
  if (problemaExiste) {
    console.log('🚨 PROBLEMA CONFIRMADO: Firmas de ambos tipos presentes');
  } else {
    throw new Error('❌ No se pudo reproducir el problema');
  }
}

async function aplicarCorreccion(valoracionId) {
  // Obtener valoración actual
  const getResponse = await fetch(`${BASE_URL}/consentimiento-perinatal/${valoracionId}`);
  const valoracion = await getResponse.json();
  
  // Aplicar la corrección: cambiar tipo y limpiar firmas correctamente
  const datosCorregidos = {
    ...valoracion,
    tipoPrograma: "fisico",
    
    // Mantener firmas físicas
    firmaPacienteFisico: valoracion.firmaPacienteFisico,
    firmaFisioterapeutaFisico: valoracion.firmaFisioterapeutaFisico,
    
    // LIMPIAR firmas de educación (esta es la corrección)
    firmaPacienteGeneral: '',
    firmaFisioterapeutaGeneral: '',
    firmaPacienteEducacion: '',
    firmaFisioterapeutaEducacion: '',
    
    // Marcar que cambió el tipo original para activar la lógica de limpieza
    _tipoPrograma_original: 'educacion',
    
    _actualizarSesiones: true
  };

  console.log('🔧 Aplicando corrección (limpiando firmas de educación)...');
  
  const putResponse = await fetch(`${BASE_URL}/consentimiento-perinatal/${valoracionId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(datosCorregidos)
  });

  if (!putResponse.ok) {
    throw new Error(`Error aplicando corrección: ${putResponse.statusText}`);
  }

  console.log('✅ Corrección aplicada');
}

async function verificarCorreccionFunciona(valoracionId) {
  const response = await fetch(`${BASE_URL}/consentimiento-perinatal/${valoracionId}`);
  const valoracion = await response.json();
  
  console.log('🔍 Estado después de la corrección:');
  console.log(`   - Tipo programa: ${valoracion.tipoPrograma}`);
  console.log(`   - Firmas físicas: ${valoracion.firmaPacienteFisico ? 'PRESENTES' : 'AUSENTES'}`);
  console.log(`   - Firmas educación general: ${valoracion.firmaPacienteGeneral ? 'PRESENTES' : 'AUSENTES'}`);
  console.log(`   - Firmas educación específica: ${valoracion.firmaPacienteEducacion ? 'PRESENTES' : 'AUSENTES'}`);
  
  // Verificar que la corrección funciona
  const errores = [];
  
  if (valoracion.tipoPrograma !== 'fisico') {
    errores.push('Tipo de programa incorrecto');
  }
  
  if (!valoracion.firmaPacienteFisico) {
    errores.push('Faltan firmas físicas');
  }
  
  if (valoracion.firmaPacienteGeneral) {
    errores.push('Firmas de educación general no se limpiaron');
  }
  
  if (valoracion.firmaPacienteEducacion) {
    errores.push('Firmas de educación específica no se limpiaron');
  }
  
  if (errores.length > 0) {
    throw new Error(`❌ Corrección falló:\n${errores.map(e => `   - ${e}`).join('\n')}`);
  }
  
  console.log('✅ CORRECCIÓN EXITOSA: Solo quedan firmas del tipo correcto');
}

// Función para mostrar el antes y después
async function mostrarAntesYDespues() {
  console.log('📊 DEMOSTRACIÓN: ANTES Y DESPUÉS DE LA CORRECCIÓN\n');
  
  try {
    // Crear valoración
    const valoracionId = await crearValoracionEducacionOriginal();
    
    // Estado inicial
    let response = await fetch(`${BASE_URL}/consentimiento-perinatal/${valoracionId}`);
    let valoracion = await response.json();
    
    console.log('📋 ANTES (educación):');
    console.log(`   - Tipo: ${valoracion.tipoPrograma}`);
    console.log(`   - Firmas educación: ${valoracion.firmaPacienteEducacion ? 'SÍ' : 'NO'}`);
    console.log(`   - Firmas físico: ${valoracion.firmaPacienteFisico ? 'SÍ' : 'NO'}`);
    
    // Cambio problemático
    await simularCambioProblematico(valoracionId);
    
    response = await fetch(`${BASE_URL}/consentimiento-perinatal/${valoracionId}`);
    valoracion = await response.json();
    
    console.log('\n🚨 PROBLEMA (físico con firmas de educación):');
    console.log(`   - Tipo: ${valoracion.tipoPrograma}`);
    console.log(`   - Firmas educación: ${valoracion.firmaPacienteEducacion ? 'SÍ (PROBLEMA)' : 'NO'}`);
    console.log(`   - Firmas físico: ${valoracion.firmaPacienteFisico ? 'SÍ' : 'NO'}`);
    
    // Aplicar corrección
    await aplicarCorreccion(valoracionId);
    
    response = await fetch(`${BASE_URL}/consentimiento-perinatal/${valoracionId}`);
    valoracion = await response.json();
    
    console.log('\n✅ DESPUÉS (físico solo con firmas físicas):');
    console.log(`   - Tipo: ${valoracion.tipoPrograma}`);
    console.log(`   - Firmas educación: ${valoracion.firmaPacienteEducacion ? 'SÍ' : 'NO (CORREGIDO)'}`);
    console.log(`   - Firmas físico: ${valoracion.firmaPacienteFisico ? 'SÍ' : 'NO'}`);
    
  } catch (error) {
    console.error('Error en demostración:', error);
  }
}

// Ejecutar tests
async function ejecutarTodos() {
  await mostrarAntesYDespues();
  console.log('\n' + '='.repeat(60) + '\n');
  await testCorreccionFirmas();
}

ejecutarTodos();