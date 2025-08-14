# Tests Automatizados - Módulo Valoración Perinatal

## Descripción
Test automatizado que verifica el correcto funcionamiento del módulo de Valoración Perinatal, incluyendo:

- ✅ Creación de valoraciones para cada tipo de programa
- ✅ Edición de valoraciones existentes  
- ✅ Verificación de sesiones creadas correctamente
- ✅ Validación de firmas independientes

## Tipos de Programa Probados

1. **Educación**: 10 sesiones de educación
2. **Físico**: 8 sesiones físicas
3. **Ambos**: 10 sesiones educación + 10 sesiones adicionales
4. **Intensivo**: 3 sesiones intensivas

## Cómo Ejecutar

### Prerequisitos
- Backend corriendo en `http://localhost:5000`
- Frontend corriendo en `http://localhost:3000`
- Paciente de prueba con ID: `6877c08ff9fe7ba56a9ad786`

### Ejecutar Tests
```bash
# Desde la carpeta centro-estimulacion
npm run test:perinatal
```

### Ejecutar Manualmente
```bash
node src/tests/valoracionperinatal.test.js
```

## Qué Prueba el Test

### 1. Creación de Valoraciones
- Crea una valoración para cada tipo de programa
- Verifica que se guarden correctamente en la base de datos
- Valida que las firmas sean independientes

### 2. Edición de Valoraciones  
- Modifica una valoración existente
- Verifica que los cambios se guarden correctamente

### 3. Verificación de Sesiones
- **Educación**: Debe crear 10 sesiones
- **Físico**: Debe crear 8 sesiones  
- **Ambos**: Debe crear 10 + 10 = 20 sesiones
- **Intensivo**: Debe crear 3 sesiones

### 4. Validación de Firmas
- Cada tipo de programa tiene campos de firma únicos
- Las firmas no se comparten entre tipos de programa

## Resultados Esperados

```
🚀 Iniciando tests del módulo Valoración Perinatal...

📝 TEST 1: Crear valoración - Programa Educación
✅ Valoración educacion creada con ID: 64a1b2c3d4e5f6789012345

📝 TEST 2: Crear valoración - Programa Físico  
✅ Valoración fisico creada con ID: 64a1b2c3d4e5f6789012346

📝 TEST 3: Crear valoración - Programa Ambos
✅ Valoración ambos creada con ID: 64a1b2c3d4e5f6789012347

📝 TEST 4: Crear valoración - Programa Intensivo
✅ Valoración intensivo creada con ID: 64a1b2c3d4e5f6789012348

📝 TEST 5: Editar valoración
✅ Valoración editada correctamente

📝 TEST 6: Verificar sesiones
✅ Sesiones educacion: 10 educación, 0 intensivo
✅ Sesiones fisico: 8 educación, 0 intensivo  
✅ Sesiones ambos: 10 educación, 10 intensivo
✅ Sesiones intensivo: 0 educación, 3 intensivo

✅ Todos los tests completados exitosamente!
```

## Limpieza de Datos

Al finalizar los tests, se ofrece la opción de limpiar los datos de prueba:

```
🧹 ¿Desea limpiar los datos de test? (y/n)
```

Responder `y` para eliminar todos los consentimientos creados durante las pruebas.

## Solución de Problemas

### Error de Conexión
- Verificar que el backend esté corriendo en puerto 5000
- Verificar que el frontend esté corriendo en puerto 3000

### Paciente No Encontrado
- Verificar que existe un paciente con ID `6877c08ff9fe7ba56a9ad786`
- Cambiar el `PACIENTE_ID` en el archivo de test si es necesario

### Tests Fallan
- Revisar logs de consola para errores específicos
- Verificar que la base de datos esté funcionando
- Comprobar que no hay errores en el backend

## Personalización

Para usar con diferentes datos:

1. Cambiar `PACIENTE_ID` en el archivo de test
2. Modificar `BASE_URL` si el backend está en otro puerto
3. Ajustar los datos de prueba según necesidades específicas