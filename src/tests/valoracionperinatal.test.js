/**
 * Test automatizado para el módulo de Valoración Perinatal
 * Prueba la creación y edición de consentimientos perinatales
 */

// Test simplificado usando fetch para probar las APIs
const BASE_URL = 'http://localhost:5000/api';
const PACIENTE_ID = '6877c08ff9fe7ba56a9ad786';

async function runTests() {
  console.log('🚀 Iniciando tests del módulo Valoración Perinatal...\n');

  try {
    // TEST 1: Crear valoración - Programa Educación
    console.log('📝 TEST 1: Crear valoración - Programa Educación');
    const educacionId = await testCrearValoracion('educacion');
    
    // TEST 2: Crear valoración - Programa Físico  
    console.log('📝 TEST 2: Crear valoración - Programa Físico');
    const fisicoId = await testCrearValoracion('fisico');
    
    // TEST 3: Crear valoración - Programa Ambos
    console.log('📝 TEST 3: Crear valoración - Programa Ambos');
    const ambosId = await testCrearValoracion('ambos');
    
    // TEST 4: Crear valoración - Programa Intensivo
    console.log('📝 TEST 4: Crear valoración - Programa Intensivo');
    const intensivoId = await testCrearValoracion('intensivo');
    
    // TEST 5: Editar valoración
    console.log('📝 TEST 5: Editar valoración');
    await testEditarValoracion(educacionId);
    
    // TEST 6: Verificar sesiones creadas
    console.log('📝 TEST 6: Verificar sesiones');
    await testVerificarSesiones(educacionId, 'educacion');
    await testVerificarSesiones(fisicoId, 'fisico');
    await testVerificarSesiones(ambosId, 'ambos');
    await testVerificarSesiones(intensivoId, 'intensivo');
    
    console.log('\n✅ Todos los tests completados exitosamente!');
    
  } catch (error) {
    console.error('❌ Error en los tests:', error);
  }
}

async function testCrearValoracion(tipoPrograma) {
  // Crear sesiones según el tipo de programa
  let sesiones = [];
  let sesionesIntensivo = [];
  
  if (tipoPrograma === 'educacion' || tipoPrograma === 'ambos') {
    const nombresSesiones = [
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
    ];
    
    for (let i = 0; i < 10; i++) {
      sesiones.push({
        nombre: nombresSesiones[i],
        fecha: "",
        firmaPaciente: ""
      });
    }
  }
  
  if (tipoPrograma === 'fisico') {
    const sesionesFisico = [
      { nombre: "Sesión Física 1: Evaluación inicial", fecha: "", firmaPaciente: "" },
      { nombre: "Sesión Física 2: Acondicionamiento básico", fecha: "", firmaPaciente: "" },
      { nombre: "Sesión Física 3: Fortalecimiento core", fecha: "", firmaPaciente: "" },
      { nombre: "Sesión Física 4: Ejercicios respiratorios", fecha: "", firmaPaciente: "" },
      { nombre: "Sesión Física 5: Yoga prenatal", fecha: "", firmaPaciente: "" },
      { nombre: "Sesión Física 6: Balonterapia", fecha: "", firmaPaciente: "" },
      { nombre: "Sesión Física 7: Ejercicios con banda", fecha: "", firmaPaciente: "" },
      { nombre: "Sesión Física 8: Sesión final", fecha: "", firmaPaciente: "" }
    ];
    sesiones = sesionesFisico;
  }
  
  if (tipoPrograma === 'intensivo') {
    sesionesIntensivo = [
      { nombre: "Sesión 1: Preparación integral para el parto", fecha: "", firmaPaciente: "" },
      { nombre: "Sesión 2: Técnicas de relajación y respiración", fecha: "", firmaPaciente: "" },
      { nombre: "Sesión 3: Lactancia y cuidados del bebé", fecha: "", firmaPaciente: "" }
    ];
  }
  
  if (tipoPrograma === 'ambos') {
    // Para ambos, crear sesiones adicionales
    for (let i = 0; i < 10; i++) {
      sesionesIntensivo.push({
        nombre: `Sesión Adicional ${i+1}: Preparación avanzada`,
        fecha: "",
        firmaPaciente: ""
      });
    }
  }

  const datosValoracion = {
    paciente: PACIENTE_ID,
    fecha: new Date().toISOString().split('T')[0],
    hora: new Date().toTimeString().slice(0, 5),
    motivoConsulta: `Test ${tipoPrograma}`,
    tipoPrograma: tipoPrograma,
    
    // Sesiones creadas
    sesiones: sesiones,
    sesionesIntensivo: sesionesIntensivo,
    
    // Datos básicos requeridos
    hospitalarios: 'Sin antecedentes',
    temperatura: '36.5',
    postura: 'Normal',
    diagnosticoFisioterapeutico: `Diagnóstico test ${tipoPrograma}`,
    planIntervencion: `Plan test ${tipoPrograma}`,
    
    // Firmas según tipo de programa
    firmaPaciente: 'test-firma-paciente',
    firmaFisioterapeuta: 'test-firma-fisioterapeuta',
    
    ...(tipoPrograma === 'educacion' && {
      firmaPacienteGeneral: 'test-firma-paciente-educacion',
      firmaFisioterapeutaGeneral: 'test-firma-fisioterapeuta-educacion'
    }),
    
    ...(tipoPrograma === 'fisico' && {
      firmaPacienteFisico: 'test-firma-paciente-fisico',
      firmaFisioterapeutaFisico: 'test-firma-fisioterapeuta-fisico'
    }),
    
    ...(tipoPrograma === 'ambos' && {
      firmaPacienteGeneral: 'test-firma-paciente-educacion',
      firmaFisioterapeutaGeneral: 'test-firma-fisioterapeuta-educacion',
      firmaPacienteFisico: 'test-firma-paciente-fisico',
      firmaFisioterapeutaFisico: 'test-firma-fisioterapeuta-fisico'
    }),
    
    ...(tipoPrograma === 'intensivo' && {
      firmaPacienteEducacion: 'test-firma-paciente-intensivo',
      firmaFisioterapeutaEducacion: 'test-firma-fisioterapeuta-intensivo'
    })
  };

  const response = await fetch(`${BASE_URL}/consentimiento-perinatal`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(datosValoracion)
  });

  if (!response.ok) {
    throw new Error(`Error creando valoración ${tipoPrograma}: ${response.statusText}`);
  }

  const resultado = await response.json();
  console.log(`✅ Valoración ${tipoPrograma} creada con ID: ${resultado._id}`);
  return resultado._id;
}

async function testEditarValoracion(valoracionId) {
  // Obtener valoración existente
  const getResponse = await fetch(`${BASE_URL}/consentimiento-perinatal/${valoracionId}`);
  if (!getResponse.ok) {
    throw new Error('Error obteniendo valoración para editar');
  }
  
  const valoracion = await getResponse.json();
  
  // Modificar datos
  valoracion.motivoConsulta = 'Consulta editada por test';
  valoracion.diagnosticoFisioterapeutico = 'Diagnóstico actualizado por test';
  
  // Actualizar
  const putResponse = await fetch(`${BASE_URL}/consentimiento-perinatal/${valoracionId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(valoracion)
  });

  if (!putResponse.ok) {
    throw new Error('Error editando valoración');
  }

  console.log('✅ Valoración editada correctamente');
}

async function testVerificarSesiones(valoracionId, tipoPrograma) {
  const response = await fetch(`${BASE_URL}/consentimiento-perinatal/${valoracionId}`);
  if (!response.ok) {
    throw new Error('Error obteniendo valoración');
  }

  const valoracion = await response.json();
  
  // Verificar sesiones según tipo de programa
  const sesionesEsperadas = {
    'educacion': { sesiones: 10, sesionesIntensivo: 0 },
    'fisico': { sesiones: 8, sesionesIntensivo: 0 },
    'ambos': { sesiones: 10, sesionesIntensivo: 10 },
    'intensivo': { sesiones: 0, sesionesIntensivo: 3 }
  };

  const esperado = sesionesEsperadas[tipoPrograma];
  const sesionesActuales = valoracion.sesiones?.length || 0;
  const sesionesIntensivoActuales = valoracion.sesionesIntensivo?.length || 0;

  if (sesionesActuales === esperado.sesiones && sesionesIntensivoActuales === esperado.sesionesIntensivo) {
    console.log(`✅ Sesiones ${tipoPrograma}: ${sesionesActuales} educación, ${sesionesIntensivoActuales} intensivo`);
  } else {
    throw new Error(`❌ Sesiones incorrectas para ${tipoPrograma}. Esperado: ${esperado.sesiones}/${esperado.sesionesIntensivo}, Actual: ${sesionesActuales}/${sesionesIntensivoActuales}`);
  }
}

// Función para limpiar datos de test
async function limpiarDatosTest() {
  console.log('🧹 Limpiando datos de test...');
  
  try {
    // Obtener todos los consentimientos del paciente de test
    const response = await fetch(`${BASE_URL}/consentimiento-perinatal/paciente/${PACIENTE_ID}`);
    if (response.ok) {
      const consentimientos = await response.json();
      
      // Eliminar consentimientos que contengan "test" en el motivo
      for (const consentimiento of consentimientos) {
        if (consentimiento.motivoConsulta?.toLowerCase().includes('test')) {
          await fetch(`${BASE_URL}/consentimiento-perinatal/${consentimiento._id}`, {
            method: 'DELETE'
          });
          console.log(`🗑️ Eliminado consentimiento test: ${consentimiento._id}`);
        }
      }
    }
  } catch (error) {
    console.log('⚠️ Error limpiando datos de test:', error.message);
  }
}

// Ejecutar tests
if (require.main === module) {
  runTests().then(() => {
    console.log('\n🧹 ¿Desea limpiar los datos de test? (y/n)');
    process.stdin.once('data', (data) => {
      if (data.toString().trim().toLowerCase() === 'y') {
        limpiarDatosTest().then(() => {
          console.log('✅ Limpieza completada');
          process.exit(0);
        });
      } else {
        process.exit(0);
      }
    });
  });
}

module.exports = { runTests, limpiarDatosTest };