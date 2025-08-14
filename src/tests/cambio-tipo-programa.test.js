/**
 * Test para cambio de tipo de programa en valoración perinatal
 * Reproduce el escenario donde se cambia de "educacion" a "fisico"
 */

const BASE_URL = 'http://localhost:5000/api';
const PACIENTE_ID = '6877c08ff9fe7ba56a9ad786';

async function testCambioTipoPrograma() {
  console.log('🔄 Iniciando test de cambio de tipo de programa...\n');

  try {
    // PASO 1: Crear valoración inicial con tipo "educacion"
    console.log('📝 PASO 1: Creando valoración inicial - Programa Educación');
    const valoracionId = await crearValoracionEducacion();
    
    // PASO 2: Verificar estado inicial
    console.log('🔍 PASO 2: Verificando estado inicial');
    await verificarEstadoInicial(valoracionId);
    
    // PASO 3: Cambiar a programa físico
    console.log('🔄 PASO 3: Cambiando a programa físico');
    await cambiarAFisico(valoracionId);
    
    // PASO 4: Verificar cambio
    console.log('✅ PASO 4: Verificando cambio aplicado');
    await verificarCambioAplicado(valoracionId);
    
    console.log('\n✅ Test de cambio de tipo completado exitosamente!');
    
  } catch (error) {
    console.error('❌ Error en test de cambio de tipo:', error);
  }
}

async function crearValoracionEducacion() {
  const sesionesEducacion = [
    "Sesión 1: Cambios anatómicos y fisiológicos del embarazo",
    "Sesión 2: Nutrición durante el embarazo", 
    "Sesión 3: Ejercicio y relajación",
    "Sesión 4: Trabajo de parto y parto",
    "Sesión 5: Manejo del dolor",
    "Sesión 6: Lactancia materna",
    "Sesión 7: Cuidados del recién nacido",
    "Sesión 8: Sesión para abuelos",
    "Sesión 9: Visita postparto inmediato",
    "Sesión 10: Visita postparto 15 días"
  ].map(nombre => ({ nombre, fecha: "", firmaPaciente: "" }));

  const datosValoracion = {
    paciente: PACIENTE_ID,
    fecha: "2025-08-13",
    hora: "12:36",
    motivoConsulta: "Test cambio tipo programa",
    tipoPrograma: "educacion",
    sesiones: sesionesEducacion,
    sesionesIntensivo: [],
    
    // Firmas para educación
    firmaPacienteGeneral: "test-firma-paciente-educacion",
    firmaFisioterapeutaGeneral: "test-firma-fisioterapeuta-educacion",
    firmaPacienteEducacion: "test-firma-paciente-educacion-especifica",
    firmaFisioterapeutaEducacion: "test-firma-fisioterapeuta-educacion-especifica"
  };

  const response = await fetch(`${BASE_URL}/consentimiento-perinatal`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(datosValoracion)
  });

  if (!response.ok) {
    throw new Error(`Error creando valoración educación: ${response.statusText}`);
  }

  const resultado = await response.json();
  console.log(`✅ Valoración educación creada con ID: ${resultado._id}`);
  return resultado._id;
}

async function verificarEstadoInicial(valoracionId) {
  const response = await fetch(`${BASE_URL}/consentimiento-perinatal/${valoracionId}`);
  if (!response.ok) {
    throw new Error('Error obteniendo valoración inicial');
  }

  const valoracion = await response.json();
  
  console.log(`📊 Estado inicial:`);
  console.log(`   - Tipo programa: ${valoracion.tipoPrograma}`);
  console.log(`   - Tipo original: ${valoracion._tipoPrograma_original || 'No definido'}`);
  console.log(`   - Sesiones educación: ${valoracion.sesiones?.length || 0}`);
  console.log(`   - Sesiones físico: ${valoracion.sesionesIntensivo?.length || 0}`);
  console.log(`   - Firmas educación: ${valoracion.firmaPacienteEducacion ? 'SÍ' : 'NO'}`);
  console.log(`   - Firmas físico: ${valoracion.firmaPacienteFisico ? 'SÍ' : 'NO'}`);
}

async function cambiarAFisico(valoracionId) {
  // Obtener valoración actual
  const getResponse = await fetch(`${BASE_URL}/consentimiento-perinatal/${valoracionId}`);
  if (!getResponse.ok) {
    throw new Error('Error obteniendo valoración para cambiar');
  }
  
  const valoracion = await getResponse.json();
  
  // Simular el cambio que se está haciendo en el frontend
  const datosActualizados = {
    ...valoracion,
    tipoPrograma: "fisico",
    
    // Agregar firmas físicas (simulando lo que hace el frontend)
    firmaPacienteFisico: "https://firmasdmamitas.s3.us-east-2.amazonaws.com/test-firma-fisico-paciente.png",
    firmaFisioterapeutaFisico: "https://firmasdmamitas.s3.us-east-2.amazonaws.com/test-firma-fisico-fisioterapeuta.png",
    
    // Mantener las firmas de educación existentes
    // (esto simula el comportamiento actual del frontend)
    
    _actualizarSesiones: true
  };

  console.log('🔄 Enviando cambio a físico...');
  console.log(`   - Tipo programa: ${datosActualizados.tipoPrograma}`);
  console.log(`   - Firmas físico: ${datosActualizados.firmaPacienteFisico ? 'AGREGADAS' : 'NO'}`);
  console.log(`   - Firmas educación: ${datosActualizados.firmaPacienteEducacion ? 'MANTENIDAS' : 'NO'}`);

  const putResponse = await fetch(`${BASE_URL}/consentimiento-perinatal/${valoracionId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(datosActualizados)
  });

  if (!putResponse.ok) {
    const errorText = await putResponse.text();
    throw new Error(`Error cambiando a físico: ${putResponse.statusText} - ${errorText}`);
  }

  const resultado = await putResponse.json();
  console.log('✅ Cambio enviado al backend');
  return resultado;
}

async function verificarCambioAplicado(valoracionId) {
  const response = await fetch(`${BASE_URL}/consentimiento-perinatal/${valoracionId}`);
  if (!response.ok) {
    throw new Error('Error obteniendo valoración después del cambio');
  }

  const valoracion = await response.json();
  
  console.log(`📊 Estado después del cambio:`);
  console.log(`   - Tipo programa: ${valoracion.tipoPrograma}`);
  console.log(`   - Tipo original: ${valoracion._tipoPrograma_original || 'No definido'}`);
  console.log(`   - Sesiones educación: ${valoracion.sesiones?.length || 0}`);
  console.log(`   - Sesiones físico: ${valoracion.sesionesIntensivo?.length || 0}`);
  console.log(`   - Firmas educación: ${valoracion.firmaPacienteEducacion ? 'SÍ' : 'NO'}`);
  console.log(`   - Firmas físico: ${valoracion.firmaPacienteFisico ? 'SÍ' : 'NO'}`);
  
  // Verificaciones
  if (valoracion.tipoPrograma !== 'fisico') {
    throw new Error(`❌ Tipo programa no cambió. Esperado: fisico, Actual: ${valoracion.tipoPrograma}`);
  }
  
  if (!valoracion.firmaPacienteFisico) {
    throw new Error('❌ Firmas físicas no se guardaron');
  }
  
  console.log('✅ Cambio aplicado correctamente');
}

// Ejecutar test
testCambioTipoPrograma();