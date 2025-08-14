# Solución: Limpieza de Firmas al Cambiar Tipo de Programa

## Problema Identificado

Al cambiar el tipo de programa de "educacion" a "fisico" en una valoración perinatal, las firmas del programa anterior no se eliminaban, causando que se mantuvieran firmas de ambos tipos de programa.

### Logs del Problema
```
tipoPrograma: fisico
- firmaPacienteGeneral: TIENE          ← ❌ No debería estar (es de educación)
- firmaFisioterapeutaGeneral: TIENE    ← ❌ No debería estar (es de educación)  
- firmaPacienteFisico: TIENE           ← ✅ Correcto (es de físico)
- firmaFisioterapeutaFisico: TIENE     ← ✅ Correcto (es de físico)
- firmaPacienteEducacion: TIENE        ← ❌ No debería estar (es de educación)
- firmaFisioterapeutaEducacion: TIENE  ← ❌ No debería estar (es de educación)
```

## Solución Implementada

Se agregó lógica en la función `handleSubmit` del componente `EditarConsentimientoPerinatal.jsx` para limpiar automáticamente las firmas que no corresponden al tipo de programa actual.

### Código Agregado

```javascript
// LIMPIAR FIRMAS QUE NO CORRESPONDEN AL TIPO DE PROGRAMA ACTUAL
if (formulario.tipoPrograma !== formulario._tipoPrograma_original) {
  console.log('🧹 Limpiando firmas del tipo anterior:', formulario._tipoPrograma_original, '→', formulario.tipoPrograma);
  
  // Limpiar firmas de educación si no es educación ni ambos
  if (formulario.tipoPrograma !== 'educacion' && formulario.tipoPrograma !== 'ambos') {
    dataToSend.firmaPacienteGeneral = '';
    dataToSend.firmaFisioterapeutaGeneral = '';
    console.log('🗑️ Limpiadas firmas de educación general');
  }
  
  // Limpiar firmas físicas si no es físico ni ambos
  if (formulario.tipoPrograma !== 'fisico' && formulario.tipoPrograma !== 'ambos') {
    dataToSend.firmaPacienteFisico = '';
    dataToSend.firmaFisioterapeutaFisico = '';
    console.log('🗑️ Limpiadas firmas físicas');
  }
  
  // Limpiar firmas de educación específica si no es intensivo
  if (formulario.tipoPrograma !== 'intensivo') {
    dataToSend.firmaPacienteEducacion = '';
    dataToSend.firmaFisioterapeutaEducacion = '';
    console.log('🗑️ Limpiadas firmas de educación intensiva');
  }
}
```

## Lógica de Limpieza

### Tipos de Firmas por Programa

| Tipo Programa | Firmas que DEBE tener | Firmas que se LIMPIAN |
|---------------|----------------------|----------------------|
| **educacion** | `firmaPacienteGeneral`<br>`firmaFisioterapeutaGeneral` | `firmaPacienteFisico`<br>`firmaFisioterapeutaFisico`<br>`firmaPacienteEducacion`<br>`firmaFisioterapeutaEducacion` |
| **fisico** | `firmaPacienteFisico`<br>`firmaFisioterapeutaFisico` | `firmaPacienteGeneral`<br>`firmaFisioterapeutaGeneral`<br>`firmaPacienteEducacion`<br>`firmaFisioterapeutaEducacion` |
| **intensivo** | `firmaPacienteEducacion`<br>`firmaFisioterapeutaEducacion` | `firmaPacienteGeneral`<br>`firmaFisioterapeutaGeneral`<br>`firmaPacienteFisico`<br>`firmaFisioterapeutaFisico` |
| **ambos** | TODAS las firmas | Ninguna (mantiene todas) |

## Resultado Esperado

Después de la corrección, al cambiar de "educacion" a "fisico":

```
tipoPrograma: fisico
- firmaPacienteGeneral: VACIO          ← ✅ Limpiado correctamente
- firmaFisioterapeutaGeneral: VACIO    ← ✅ Limpiado correctamente
- firmaPacienteFisico: TIENE           ← ✅ Correcto (es de físico)
- firmaFisioterapeutaFisico: TIENE     ← ✅ Correcto (es de físico)
- firmaPacienteEducacion: VACIO        ← ✅ Limpiado correctamente
- firmaFisioterapeutaEducacion: VACIO  ← ✅ Limpiado correctamente
```

## Tests Creados

1. **`limpiar-firmas-cambio-tipo.test.js`**: Test que demuestra el problema y la solución correcta
2. **`test-correccion-firmas.test.js`**: Test que verifica que la corrección implementada funciona
3. **`cambio-tipo-programa.test.js`**: Test general para cambios de tipo de programa

## Archivos Modificados

- `EditarConsentimientoPerinatal.jsx`: Agregada lógica de limpieza de firmas en `handleSubmit`

## Cómo Probar

```bash
# Ejecutar test de corrección
node src/tests/test-correccion-firmas.test.js

# Ejecutar test de limpieza
node src/tests/limpiar-firmas-cambio-tipo.test.js
```

## Beneficios

1. **Consistencia**: Solo se mantienen las firmas del tipo de programa actual
2. **Limpieza**: Se eliminan firmas obsoletas automáticamente
3. **Integridad**: Los datos quedan en estado consistente
4. **Transparencia**: Logs claros muestran qué firmas se limpian

## Casos de Uso Cubiertos

- ✅ Educación → Físico
- ✅ Educación → Intensivo  
- ✅ Físico → Educación
- ✅ Físico → Intensivo
- ✅ Intensivo → Educación
- ✅ Intensivo → Físico
- ✅ Cualquier tipo → Ambos (mantiene todas las firmas)
- ✅ Ambos → Cualquier tipo específico (limpia las no necesarias)