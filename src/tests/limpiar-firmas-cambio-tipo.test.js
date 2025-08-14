/**
 * Test para verificar limpieza de firmas al cambiar tipo de programa
 * El problema: al cambiar de "educacion" a "fisico", las firmas de educación no se eliminan
 */

const BASE_URL = 'http://localhost:5000/api';
const PACIENTE_ID = '6877c08ff9fe7ba56a9ad786';

async function testLimpiezaFirmas() {
  console.log('🧹 Iniciando test de limpieza de firmas al cambiar tipo...\n');

  try {
    // PASO 1: Crear valoración con educación y firmas
    console.log('📝 PASO 1: Creando valoración con programa educación');
    const valoracionId = await crearConEducacion();
    
    // PASO 2: Verificar firmas iniciales
    console.log('🔍 PASO 2: Verificando firmas de educación');
    await verificarFirmasEducacion(valoracionId);
    
    // PASO 3: Cambiar a físico (debería limpiar firmas de educación)
    console.log('🔄 PASO 3: Cambiando a físico - DEBE limpiar firmas educación');
    await cambiarAFisicoLimpiando(valoracionId);
    
    // PASO 4: Verificar que solo quedan firmas físicas
    console.log('✅ PASO 4: Verificando que solo quedan firmas físicas');
    await verificarSoloFirmasFisicas(valoracionId);
    
    console.log('\n✅ Test de limpieza de firmas completado!');
    
  } catch (error) {
    console.error('❌ Error en test de limpieza:', error);
  }
}

async function crearConEducacion() {
  const datosValoracion = {
    paciente: PACIENTE_ID,
    fecha: "2025-08-13",
    hora: "12:36",
    motivoConsulta: "Test limpieza firmas",
    tipoPrograma: "educacion",
    
    // Firmas específicas de educación
    firmaPacienteGeneral: "https://test.com/firma-paciente-general.png",
    firmaFisioterapeutaGeneral: "https://test.com/firma-fisio-general.png",
    firmaPacienteEducacion: "https://test.com/firma-paciente-educacion.png",
    firmaFisioterapeutaEducacion: "https://test.com/firma-fisio-educacion.png",
    
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

  if (!response.ok) {
    throw new Error(`Error creando valoración: ${response.statusText}`);
  }

  const resultado = await response.json();
  console.log(`✅ Valoración creada con ID: ${resultado._id}`);
  return resultado._id;
}

async function verificarFirmasEducacion(valoracionId) {
  const response = await fetch(`${BASE_URL}/consentimiento-perinatal/${valoracionId}`);
  const valoracion = await response.json();
  
  console.log('📋 Firmas de educación presentes:');
  console.log(`   - firmaPacienteGeneral: ${valoracion.firmaPacienteGeneral ? '✅' : '❌'}`);
  console.log(`   - firmaFisioterapeutaGeneral: ${valoracion.firmaFisioterapeutaGeneral ? '✅' : '❌'}`);
  console.log(`   - firmaPacienteEducacion: ${valoracion.firmaPacienteEducacion ? '✅' : '❌'}`);
  console.log(`   - firmaFisioterapeutaEducacion: ${valoracion.firmaFisioterapeutaEducacion ? '✅' : '❌'}`);
  
  // Verificar que NO hay firmas físicas
  console.log('📋 Firmas físicas (deben estar vacías):');
  console.log(`   - firmaPacienteFisico: ${valoracion.firmaPacienteFisico ? '❌ PRESENTE' : '✅ VACÍA'}`);
  console.log(`   - firmaFisioterapeutaFisico: ${valoracion.firmaFisioterapeutaFisico ? '❌ PRESENTE' : '✅ VACÍA'}`);
}

async function cambiarAFisicoLimpiando(valoracionId) {
  // Obtener valoración actual
  const getResponse = await fetch(`${BASE_URL}/consentimiento-perinatal/${valoracionId}`);
  const valoracion = await getResponse.json();
  
  // Preparar datos para cambio a físico
  const datosActualizados = {
    ...valoracion,
    tipoPrograma: "fisico",
    
    // AGREGAR firmas físicas
    firmaPacienteFisico: "https://test.com/firma-paciente-fisico.png",
    firmaFisioterapeutaFisico: "https://test.com/firma-fisio-fisico.png",
    
    // LIMPIAR firmas de educación (esto es lo que debe hacer el frontend)
    firmaPacienteGeneral: "",
    firmaFisioterapeutaGeneral: "",
    firmaPacienteEducacion: "",
    firmaFisioterapeutaEducacion: "",
    
    _actualizarSesiones: true
  };

  console.log('🔄 Enviando cambio con limpieza de firmas...');
  console.log('   - Agregando firmas físicas: ✅');
  console.log('   - Limpiando firmas educación: ✅');

  const putResponse = await fetch(`${BASE_URL}/consentimiento-perinatal/${valoracionId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(datosActualizados)
  });

  if (!putResponse.ok) {
    throw new Error(`Error actualizando: ${putResponse.statusText}`);
  }

  console.log('✅ Cambio enviado correctamente');
}

async function verificarSoloFirmasFisicas(valoracionId) {
  const response = await fetch(`${BASE_URL}/consentimiento-perinatal/${valoracionId}`);
  const valoracion = await response.json();
  
  console.log('📋 Estado final de firmas:');
  
  // Verificar firmas físicas (deben estar presentes)
  console.log('   FÍSICAS:');
  console.log(`     - firmaPacienteFisico: ${valoracion.firmaPacienteFisico ? '✅ PRESENTE' : '❌ FALTA'}`);
  console.log(`     - firmaFisioterapeutaFisico: ${valoracion.firmaFisioterapeutaFisico ? '✅ PRESENTE' : '❌ FALTA'}`);
  
  // Verificar firmas educación (deben estar vacías)
  console.log('   EDUCACIÓN (deben estar vacías):');
  console.log(`     - firmaPacienteGeneral: ${valoracion.firmaPacienteGeneral ? '❌ AÚN PRESENTE' : '✅ LIMPIA'}`);
  console.log(`     - firmaFisioterapeutaGeneral: ${valoracion.firmaFisioterapeutaGeneral ? '❌ AÚN PRESENTE' : '✅ LIMPIA'}`);
  console.log(`     - firmaPacienteEducacion: ${valoracion.firmaPacienteEducacion ? '❌ AÚN PRESENTE' : '✅ LIMPIA'}`);
  console.log(`     - firmaFisioterapeutaEducacion: ${valoracion.firmaFisioterapeutaEducacion ? '❌ AÚN PRESENTE' : '✅ LIMPIA'}`);
  
  // Verificar tipo de programa
  console.log(`   TIPO: ${valoracion.tipoPrograma} ${valoracion.tipoPrograma === 'fisico' ? '✅' : '❌'}`);
  
  // Validaciones
  const errores = [];
  
  if (!valoracion.firmaPacienteFisico) errores.push('Falta firmaPacienteFisico');
  if (!valoracion.firmaFisioterapeutaFisico) errores.push('Falta firmaFisioterapeutaFisico');
  if (valoracion.firmaPacienteGeneral) errores.push('firmaPacienteGeneral no se limpió');
  if (valoracion.firmaFisioterapeutaGeneral) errores.push('firmaFisioterapeutaGeneral no se limpió');
  if (valoracion.firmaPacienteEducacion) errores.push('firmaPacienteEducacion no se limpió');
  if (valoracion.firmaFisioterapeutaEducacion) errores.push('firmaFisioterapeutaEducacion no se limpió');
  
  if (errores.length > 0) {
    throw new Error(`❌ Errores encontrados:\n${errores.map(e => `   - ${e}`).join('\n')}`);
  }
  
  console.log('✅ Limpieza de firmas exitosa - Solo quedan firmas físicas');
}

// Función para mostrar el problema actual (sin limpiar firmas)
async function mostrarProblemaActual() {
  console.log('🚨 DEMOSTRANDO EL PROBLEMA ACTUAL...\n');
  
  try {
    // Crear con educación
    const valoracionId = await crearConEducacion();
    
    // Cambiar a físico SIN limpiar (como hace actualmente el frontend)
    const getResponse = await fetch(`${BASE_URL}/consentimiento-perinatal/${valoracionId}`);
    const valoracion = await getResponse.json();
    
    const datosProblematicos = {
      ...valoracion,
      tipoPrograma: "fisico",
      // Solo agregar firmas físicas, NO limpiar las de educación
      firmaPacienteFisico: "https://test.com/firma-paciente-fisico.png",
      firmaFisioterapeutaFisico: "https://test.com/firma-fisio-fisico.png",
      _actualizarSesiones: true
    };

    await fetch(`${BASE_URL}/consentimiento-perinatal/${valoracionId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datosProblematicos)
    });

    // Verificar el problema
    const responseProblema = await fetch(`${BASE_URL}/consentimiento-perinatal/${valoracionId}`);
    const valoracionProblema = await responseProblema.json();
    
    console.log('🚨 PROBLEMA: Firmas de ambos tipos presentes:');
    console.log(`   - Tipo programa: ${valoracionProblema.tipoPrograma}`);
    console.log(`   - Firmas físicas: ${valoracionProblema.firmaPacienteFisico ? 'SÍ' : 'NO'}`);
    console.log(`   - Firmas educación: ${valoracionProblema.firmaPacienteEducacion ? 'SÍ' : 'NO'}`);
    console.log('   ❌ Ambos tipos de firmas están presentes cuando solo deberían estar las físicas');
    
  } catch (error) {
    console.error('Error demostrando problema:', error);
  }
}

// Ejecutar ambos tests
async function ejecutarTests() {
  await mostrarProblemaActual();
  console.log('\n' + '='.repeat(50) + '\n');
  await testLimpiezaFirmas();
}

ejecutarTests();