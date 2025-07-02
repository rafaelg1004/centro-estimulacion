import React from "react";

export default function Paso3EstadoSaludPerinatal({ formulario, handleChange, siguiente, anterior }) {
  return (
    <div>
      <h3 className="text-lg font-bold text-indigo-700 mb-4">3. Estado de Salud</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 mb-6">
        <div>
          <label className="font-semibold">Temperatura:</label>
          <input type="text" name="temperatura" value={formulario.temperatura || ""} onChange={e => handleChange({ temperatura: e.target.value })} className="w-full border rounded p-2" />
        </div>
        <div>
          <label className="font-semibold">TA:</label>
          <input type="text" name="ta" value={formulario.ta || ""} onChange={e => handleChange({ ta: e.target.value })} className="w-full border rounded p-2" />
        </div>
        <div>
          <label className="font-semibold">FR:</label>
          <input type="text" name="fr" value={formulario.fr || ""} onChange={e => handleChange({ fr: e.target.value })} className="w-full border rounded p-2" />
        </div>
        <div>
          <label className="font-semibold">FC:</label>
          <input type="text" name="fc" value={formulario.fc || ""} onChange={e => handleChange({ fc: e.target.value })} className="w-full border rounded p-2" />
        </div>
        <div>
          <label className="font-semibold">Peso previo:</label>
          <input type="text" name="pesoPrevio" value={formulario.pesoPrevio || ""} onChange={e => handleChange({ pesoPrevio: e.target.value })} className="w-full border rounded p-2" />
        </div>
        <div>
          <label className="font-semibold">Peso actual:</label>
          <input type="text" name="pesoActual" value={formulario.pesoActual || ""} onChange={e => handleChange({ pesoActual: e.target.value })} className="w-full border rounded p-2" />
        </div>
        <div>
          <label className="font-semibold">Talla:</label>
          <input type="text" name="talla" value={formulario.talla || ""} onChange={e => handleChange({ talla: e.target.value })} className="w-full border rounded p-2" />
        </div>
        <div>
          <label className="font-semibold">IMC:</label>
          <input type="text" name="imc" value={formulario.imc || ""} onChange={e => handleChange({ imc: e.target.value })} className="w-full border rounded p-2" />
        </div>
        <div className="sm:col-span-2">
          <label className="font-semibold block mb-1">PARMED-X FOR PREGNANCY</label>
          <div className="text-gray-700 text-sm mb-2">
            Guía para valorar el estado de salud prenatal antes de la participación en un programa de fitness prenatal o en cualquier otro tipo de ejercicio.
            <br />
            <strong>En el pasado usted ha experimentado:</strong>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <h4 className="font-bold text-indigo-600 mb-2">Condición General de Salud</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2">
          <div>
            <label>¿Abortos anteriores?</label>
            <select name="abortosAnteriores" value={formulario.abortosAnteriores || ""} onChange={e => handleChange({ abortosAnteriores: e.target.value })} className="w-full border rounded p-2">
              <option value="">Seleccione</option>
              <option value="si">Sí</option>
              <option value="no">No</option>
            </select>
          </div>
          <div>
            <label>¿Otras complicaciones durante la gestación?</label>
            <select name="otrasComplicaciones" value={formulario.otrasComplicaciones || ""} onChange={e => handleChange({ otrasComplicaciones: e.target.value })} className="w-full border rounded p-2">
              <option value="">Seleccione</option>
              <option value="si">Sí</option>
              <option value="no">No</option>
            </select>
          </div>
          <div className="sm:col-span-2">
            <label>Si la respuesta es sí, explique:</label>
            <textarea name="explicacionComplicaciones" value={formulario.explicacionComplicaciones || ""} onChange={e => handleChange({ explicacionComplicaciones: e.target.value })} className="w-full border rounded p-2" />
          </div>
          <div>
            <label>Número de gestaciones previas:</label>
            <input type="number" name="numGestacionesPrevias" value={formulario.numGestacionesPrevias || ""} onChange={e => handleChange({ numGestacionesPrevias: e.target.value })} className="w-full border rounded p-2" min={0} />
          </div>
        </div>
      </div>

      <div className="mb-6">
        <h4 className="font-bold text-indigo-600 mb-2">Condición Gestación Actual</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2">
          {[
            { label: "Fatiga marcada", name: "fatigaMarcada" },
            { label: "Sangrado vaginal (manchado)", name: "sangradoVaginal" },
            { label: "Debilidad o mareo sin explicación", name: "debilidadMareo" },
            { label: "Dolor abdominal sin explicación", name: "dolorAbdominal" },
            { label: "Sudoración espontánea en tobillos, manos o cara", name: "sudoracionEspontanea" },
            { label: "Dolores de cabeza persistentes", name: "doloresCabeza" },
            { label: "Sudoración, dolor o enrojecimiento en la pantorrilla", name: "sudoracionPantorrilla" },
            { label: "Ausencia de movimientos fetales luego del sexto mes", name: "ausenciaMovFetales" },
            { label: "Dejar de ganar peso después del 5to mes", name: "dejarGanarPeso" },
          ].map(({ label, name }) => (
            <div key={name}>
              <label>{label}</label>
              <select name={name} value={formulario[name] || ""} onChange={e => handleChange({ [name]: e.target.value })} className="w-full border rounded p-2">
                <option value="">Seleccione</option>
                <option value="si">Sí</option>
                <option value="no">No</option>
              </select>
            </div>
          ))}
          <div className="sm:col-span-2">
            <label>Si la respuesta fue sí en alguna pregunta, por favor explique:</label>
            <textarea name="explicacionCondicionActual" value={formulario.explicacionCondicionActual || ""} onChange={e => handleChange({ explicacionCondicionActual: e.target.value })} className="w-full border rounded p-2" />
          </div>
        </div>
      </div>

      <div className="mb-6">
        <h4 className="font-bold text-indigo-600 mb-2">Actividad durante el último mes</h4>
        <label>¿Qué actividades físicas o recreacionales practica?</label>
        <textarea name="actividadesFisicas" value={formulario.actividadesFisicas || ""} onChange={e => handleChange({ actividadesFisicas: e.target.value })} className="w-full border rounded p-2 mb-2" />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-4 gap-y-2 mb-2">
          <div>
            <label>Intensidad</label>
            <select name="intensidad" value={formulario.intensidad || ""} onChange={e => handleChange({ intensidad: e.target.value })} className="w-full border rounded p-2">
              <option value="">Seleccione</option>
              <option value="Fuerte">Fuerte</option>
              <option value="Mediana">Mediana</option>
              <option value="Ligera">Ligera</option>
            </select>
          </div>
          <div>
            <label>Frecuencia (veces por semana)</label>
            <select name="frecuencia" value={formulario.frecuencia || ""} onChange={e => handleChange({ frecuencia: e.target.value })} className="w-full border rounded p-2">
              <option value="">Seleccione</option>
              <option value="1-2">1-2</option>
              <option value="3-4">3-4</option>
              <option value="+4">+4</option>
            </select>
          </div>
          <div>
            <label>Tiempo (minutos al día)</label>
            <select name="tiempo" value={formulario.tiempo || ""} onChange={e => handleChange({ tiempo: e.target.value })} className="w-full border rounded p-2">
              <option value="">Seleccione</option>
              <option value="10-20 min">10-20 min</option>
              <option value="20-40 min">20-40 min</option>
              <option value="+40">+40</option>
            </select>
          </div>
        </div>
        <label>Su actividad diaria trabajo/casa implica:</label>
        {[
          { label: "¿Levantar objetos pesados?", name: "levantarPesos" },
          { label: "Subir escaleras frecuentemente", name: "subirEscaleras" },
          { label: "Caminar ocasionalmente (+1 vez por hora)", name: "caminarOcasionalmente" },
          { label: "Bipedestación prolongada", name: "bipedestacion" },
          { label: "Mantener sentada", name: "mantenerSentada" },
          { label: "Actividad diaria normal", name: "actividadNormal" },
        ].map(({ label, name }) => (
          <div key={name} className="mb-1">
            <label>{label}</label>
            <select name={name} value={formulario[name] || ""} onChange={e => handleChange({ [name]: e.target.value })} className="w-full border rounded p-2">
              <option value="">Seleccione</option>
              <option value="si">Sí</option>
              <option value="no">No</option>
            </select>
          </div>
        ))}
      </div>

      <div className="mb-6">
        <h4 className="font-bold text-indigo-600 mb-2">Intenciones de Actividad Física</h4>
        <label>¿Qué actividad física desea hacer?</label>
        <input type="text" name="actividadFisicaDeseada" value={formulario.actividadFisicaDeseada || ""} onChange={e => handleChange({ actividadFisicaDeseada: e.target.value })} className="w-full border rounded p-2 mb-2" />
      </div>

      <div className="mb-6">
        <h4 className="font-bold text-indigo-600 mb-2">Contraindicaciones Relativas</h4>
        {[
          { label: "Ruptura de membranas, trabajo de parto prematuro", name: "rupturaMembranas" },
          { label: "Hemorragia persistente en el segundo o tercer trimestre, placenta previa", name: "hemorragiaPersistente" },
          { label: "Hipertensión inducida por embarazo o preeclampsia", name: "hipertensionEmbarazo" },
          { label: "Cérvix incompetente", name: "cervixIncompetente" },
          { label: "Evidencia de restricción en el crecimiento intrauterino", name: "restriccionCrecimiento" },
          { label: "Embarazo de alto riesgo", name: "embarazoAltoRiesgo" },
          { label: "Diabetes tipo I no controlada, hipertensión o enfermedad tiroidea, otros desordenes cardiovasculares, pulmonares o sistémicos", name: "diabetesNoControlada" },
        ].map(({ label, name }) => (
          <div key={name} className="mb-1">
            <label>{label}</label>
            <select name={name} value={formulario[name] || ""} onChange={e => handleChange({ [name]: e.target.value })} className="w-full border rounded p-2">
              <option value="">Seleccione</option>
              <option value="si">Sí</option>
              <option value="no">No</option>
            </select>
          </div>
        ))}
        <div>
          <label>¿Esto es un cambio con respecto a lo que usted hace normalmente?</label>
          <select name="cambioActividad" value={formulario.cambioActividad || ""} onChange={e => handleChange({ cambioActividad: e.target.value })} className="w-full border rounded p-2">
            <option value="">Seleccione</option>
            <option value="si">Sí</option>
            <option value="no">No</option>
          </select>
        </div>
      </div>

      <div className="mb-6">
        <h4 className="font-bold text-indigo-600 mb-2">Contraindicaciones Absolutas</h4>
        {[
          { label: "¿Historia de aborto espontáneo o trabajo de parto prematuro en gestaciones previas?", name: "historiaAborto" },
          { label: "¿Enfermedad cardiovascular o respiratoria moderada HTA o asma?", name: "enfermedadCardioRespiratoria" },
          { label: "Anemia o deficiencia de hierro", name: "anemia" },
          { label: "Malnutrición o desórdenes alimenticios (bulimia o anorexia)", name: "malnutricion" },
          { label: "Embarazo gemelar después de semana 28", name: "embarazoGemelar" },
          { label: "Diabetes Tipo I no controlada, hipertensión o enfermedad tiroidea, otros desordenes cardiovasculares, pulmonares o sistémicos", name: "diabetesNoControladaAbsoluta" },
        ].map(({ label, name }) => (
          <div key={name} className="mb-1">
            <label>{label}</label>
            <select name={name} value={formulario[name] || ""} onChange={e => handleChange({ [name]: e.target.value })} className="w-full border rounded p-2">
              <option value="">Seleccione</option>
              <option value="si">Sí</option>
              <option value="no">No</option>
            </select>
          </div>
        ))}
      </div>

      <div className="mb-6">
        <label className="font-semibold">ACTIVIDAD FÍSICA</label>
        <div className="flex gap-4 mt-2">
          <label className="flex items-center gap-1">
            <input type="radio" name="actividadFisicaAprobada" value="aprobada" checked={formulario.actividadFisicaAprobada === "aprobada"} onChange={e => handleChange({ actividadFisicaAprobada: e.target.value })} />
            Aprobada / Recomendada
          </label>
          <label className="flex items-center gap-1">
            <input type="radio" name="actividadFisicaAprobada" value="contraindicada" checked={formulario.actividadFisicaAprobada === "contraindicada"} onChange={e => handleChange({ actividadFisicaAprobada: e.target.value })} />
            Contraindicada
          </label>
        </div>
      </div>

      <div className="mb-6">
        <label className="font-semibold">Observaciones:</label>
        <textarea name="observaciones" value={formulario.observaciones || ""} onChange={e => handleChange({ observaciones: e.target.value })} className="w-full border rounded p-2" />
      </div>

      <div className="flex justify-between mt-8">
        <button
          type="button"
          onClick={anterior}
          className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-6 rounded transition"
        >
          Anterior
        </button>
        <button
          type="button"
          onClick={siguiente}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded transition"
        >
          Siguiente
        </button>
      </div>
    </div>
  );
}