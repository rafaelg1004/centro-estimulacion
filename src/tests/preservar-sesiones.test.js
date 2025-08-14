/**
 * Test para verificar que las sesiones se preservan cuando NO se cambia el tipo de programa
 */

const BASE_URL = 'http://localhost:5000/api';
const PACIENTE_ID = '6877c08ff9fe7ba56a9ad786';

async function testPreservarSesiones() {
  console.log('🔒 Iniciando test de preservación de sesiones...\n');

  try {
    // PASO 1: Crear valoración con sesiones
    console.log('📝 PASO 1: Creando valoración con sesiones');
    const valoracionId = await crearValoracionConSesiones();
    
    // PASO 2: Agregar algunas firmas a las sesiones
    console.log('✍️ PASO 2: Agregando firmas a algunas sesiones');
    await agregarFirmasASesiones(valoracionId);
    
    // PASO 3: Editar otros campos SIN cambiar tipo de programa
    console.log('📝 PASO 3: Editando otros campos (sin cambiar tipo)');
    await editarSinCambiarTipo(valoracionId);
    
    // PASO 4: Verificar que las sesiones se preservaron
    console.log('✅ PASO 4: Verificando que las sesiones se preservaron');
    await verificarSesionesPreservadas(valoracionId);
    
    console.log('\n✅ Test de preservación completado exitosamente!');
    
  } catch (error) {
    console.error('❌ Error en test de preservación:', error);
  }
}

async function crearValoracionConSesiones() {
  const sesiones = [
    { nombre: "Sesión 1: Cambios anatómicos", fecha: "2025-01-15", firmaPaciente: "" },
    { nombre: "Sesión 2: Nutrición", fecha: "2025-01-22", firmaPaciente: "" },
    { nombre: "Sesión 3: Ejercicio", fecha: "2025-01-29", firmaPaciente: "" },
    { nombre: "Sesión 4: Trabajo de parto", fecha: "", firmaPaciente: "" },
    { nombre: "Sesión 5: Manejo del dolor", fecha: "", firmaPaciente: "" }
  ];

  const datosValoracion = {
    paciente: PACIENTE_ID,
    fecha: "2025-08-13",
    hora: "12:36",
    motivoConsulta: "Test preservar sesiones",
    tipoPrograma: "educacion",
    
    // Sesiones con algunas fechas
    sesiones: sesiones,
    sesionesIntensivo: [],
    
    // Firmas de educación
    firmaPacienteGeneral: "https://test.com/firma-paciente-general.png",
    firmaFisioterapeutaGeneral: "https://test.com/firma-fisio-general.png"
  };

  const response = await fetch(`${BASE_URL}/consentimiento-perinatal`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(datosValoracion)
  });

  const resultado = await response.json();
  console.log(`✅ Valoración creada con ${sesiones.length} sesiones: ${resultado._id}`);
  return resultado._id;
}

async function agregarFirmasASesiones(valoracionId) {
  // Obtener valoración
  const getResponse = await fetch(`${BASE_URL}/consentimiento-perinatal/${valoracionId}`);
  const valoracion = await getResponse.json();
  
  // Agregar firmas a las primeras 2 sesiones
  valoracion.sesiones[0].firmaPaciente = "https://test.com/firma-sesion1.png";
  valoracion.sesiones[1].firmaPaciente = "https://test.com/firma-sesion2.png";
  
  // También agregar a los campos individuales para simular el comportamiento real
  valoracion.fechaSesion1 = valoracion.sesiones[0].fecha;
  valoracion.firmaPacienteSesion1 = valoracion.sesiones[0].firmaPaciente;
  valoracion.fechaSesion2 = valoracion.sesiones[1].fecha;
  valoracion.firmaPacienteSesion2 = valoracion.sesiones[1].firmaPaciente;
  valoracion.fechaSesion3 = valoracion.sesiones[2].fecha;
  
  const putResponse = await fetch(`${BASE_URL}/consentimiento-perinatal/${valoracionId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(valoracion)
  });

  if (!putResponse.ok) {
    throw new Error('Error agregando firmas a sesiones');
  }

  console.log('✅ Firmas agregadas a 2 sesiones');
}

async function editarSinCambiarTipo(valoracionId) {
  // Obtener valoración actual
  const getResponse = await fetch(`${BASE_URL}/consentimiento-perinatal/${valoracionId}`);
  const valoracion = await getResponse.json();
  
  console.log('📊 Estado antes de editar:');
  console.log(`   - Tipo programa: ${valoracion.tipoPrograma}`);
  console.log(`   - Sesiones: ${valoracion.sesiones?.length || 0}`);
  console.log(`   - Sesiones con fecha: ${valoracion.sesiones?.filter(s => s.fecha).length || 0}`);
  console.log(`   - Sesiones con firma: ${valoracion.sesiones?.filter(s => s.firmaPaciente).length || 0}`);
  
  // Editar SOLO campos que no afectan el tipo de programa
  valoracion.motivoConsulta = 'Motivo editado - test preservación';
  valoracion.diagnosticoFisioterapeutico = 'Diagnóstico actualizado';
  valoracion.planIntervencion = 'Plan actualizado';
  valoracion.temperatura = '36.8';
  
  // NO cambiar tipoPrograma - debe seguir siendo "educacion"
  
  const putResponse = await fetch(`${BASE_URL}/consentimiento-perinatal/${valoracionId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(valoracion)
  });

  if (!putResponse.ok) {
    throw new Error('Error editando valoración');
  }

  console.log('✅ Campos editados sin cambiar tipo de programa');
}

async function verificarSesionesPreservadas(valoracionId) {
  const response = await fetch(`${BASE_URL}/consentimiento-perinatal/${valoracionId}`);
  const valoracion = await response.json();
  
  console.log('📊 Estado después de editar:');
  console.log(`   - Tipo programa: ${valoracion.tipoPrograma}`);
  console.log(`   - Sesiones: ${valoracion.sesiones?.length || 0}`);
  console.log(`   - Sesiones con fecha: ${valoracion.sesiones?.filter(s => s.fecha).length || 0}`);
  console.log(`   - Sesiones con firma: ${valoracion.sesiones?.filter(s => s.firmaPaciente).length || 0}`);
  
  // Verificaciones
  const errores = [];
  
  if (valoracion.tipoPrograma !== 'educacion') {
    errores.push(`Tipo programa cambió: esperado 'educacion', actual '${valoracion.tipoPrograma}'`);
  }
  
  if (!valoracion.sesiones || valoracion.sesiones.length === 0) {
    errores.push('Las sesiones se eliminaron');
  }
  
  if (valoracion.sesiones && valoracion.sesiones.length < 5) {
    errores.push(`Sesiones perdidas: esperado 5, actual ${valoracion.sesiones.length}`);
  }
  
  const sesionesConFecha = valoracion.sesiones?.filter(s => s.fecha).length || 0;
  if (sesionesConFecha < 3) {
    errores.push(`Fechas de sesiones perdidas: esperado 3, actual ${sesionesConFecha}`);
  }
  
  const sesionesConFirma = valoracion.sesiones?.filter(s => s.firmaPaciente).length || 0;
  if (sesionesConFirma < 2) {
    errores.push(`Firmas de sesiones perdidas: esperado 2, actual ${sesionesConFirma}`);
  }
  
  // Verificar que los campos editados sí cambiaron
  if (!valoracion.motivoConsulta?.includes('test preservación')) {
    errores.push('Los campos editados no se guardaron');
  }
  
  if (errores.length > 0) {
    throw new Error(`❌ Errores de preservación:\n${errores.map(e => `   - ${e}`).join('\n')}`);
  }
  
  console.log('✅ PRESERVACIÓN EXITOSA: Sesiones mantenidas, campos editados guardados');
  
  // Mostrar detalles de las sesiones preservadas
  console.log('\n📋 Detalle de sesiones preservadas:');
  valoracion.sesiones?.forEach((sesion, i) => {
    console.log(`   ${i+1}. ${sesion.nombre}`);
    console.log(`      Fecha: ${sesion.fecha || 'Sin fecha'}`);
    console.log(`      Firma: ${sesion.firmaPaciente ? 'Con firma' : 'Sin firma'}`);
  });
}

// Test adicional: verificar que SÍ se limpian cuando cambia el tipo
async function testLimpiezaCuandoCambiaTipo() {
  console.log('\n🔄 Test adicional: Verificar limpieza cuando SÍ cambia tipo...\n');
  
  try {
    // Crear valoración con sesiones
    const valoracionId = await crearValoracionConSesiones();
    await agregarFirmasASesiones(valoracionId);
    
    // Cambiar tipo de programa
    const getResponse = await fetch(`${BASE_URL}/consentimiento-perinatal/${valoracionId}`);
    const valoracion = await getResponse.json();
    
    console.log('🔄 Cambiando tipo de educacion → fisico');
    valoracion.tipoPrograma = 'fisico';
    valoracion.firmaPacienteFisico = 'https://test.com/firma-fisico.png';
    valoracion.firmaFisioterapeutaFisico = 'https://test.com/firma-fisio-fisico.png';
    
    const putResponse = await fetch(`${BASE_URL}/consentimiento-perinatal/${valoracionId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(valoracion)
    });
    
    // Verificar que las sesiones SÍ se limpiaron
    const responseVerif = await fetch(`${BASE_URL}/consentimiento-perinatal/${valoracionId}`);
    const valoracionVerif = await responseVerif.json();
    
    console.log('📊 Después del cambio de tipo:');
    console.log(`   - Tipo: ${valoracionVerif.tipoPrograma}`);
    console.log(`   - Sesiones: ${valoracionVerif.sesiones?.length || 0}`);
    console.log(`   - Firmas educación: ${valoracionVerif.firmaPacienteGeneral ? 'PRESENTES' : 'LIMPIADAS'}`);
    console.log(`   - Firmas físico: ${valoracionVerif.firmaPacienteFisico ? 'PRESENTES' : 'AUSENTES'}`);
    
    if (valoracionVerif.firmaPacienteGeneral) {
      console.log('❌ Las firmas de educación NO se limpiaron');
    } else {
      console.log('✅ Las firmas de educación se limpiaron correctamente');
    }
    
  } catch (error) {
    console.error('Error en test de limpieza:', error);
  }
}

// Ejecutar ambos tests
async function ejecutarTests() {
  await testPreservarSesiones();
  await testLimpiezaCuandoCambiaTipo();
}

ejecutarTests();