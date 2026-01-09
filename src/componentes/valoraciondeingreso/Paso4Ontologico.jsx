import React from "react";

// Mover CheckboxGroup fuera del componente principal para evitar re-creaciones
const CheckboxGroup = ({ label, fieldPrefix, ageRange, formulario, handleChange, handleRadioChange }) => (
  <div className="border rounded-lg p-4 mb-4">
    <div className="grid grid-cols-4 gap-2 items-center">
      <div className="font-medium text-sm">
        {label} <br />
        <span className="text-xs text-gray-500">({ageRange})</span>
      </div>
      <div className="text-center">
        <label className="flex flex-col items-center">
          <input
            type="radio"
            name={fieldPrefix}
            value="si"
            checked={formulario[`${fieldPrefix}_si`]}
            onChange={() => handleRadioChange(fieldPrefix, 'si')}
            className="mb-1"
          />
          <span className="text-xs">Sí</span>
        </label>
      </div>
      <div className="text-center">
        <label className="flex flex-col items-center">
          <input
            type="radio"
            name={fieldPrefix}
            value="no"
            checked={formulario[`${fieldPrefix}_no`]}
            onChange={() => handleRadioChange(fieldPrefix, 'no')}
            className="mb-1"
          />
          <span className="text-xs">No</span>
        </label>
      </div>
      <div>
        <textarea
          name={`${fieldPrefix}_observaciones`}
          value={formulario[`${fieldPrefix}_observaciones`] || ""}
          onChange={handleChange}
          placeholder="Observaciones..."
          rows={2}
          className="w-full border rounded px-2 py-1 text-xs"
        />
      </div>
    </div>
  </div>
);

const Paso4Ontologico = ({
  formulario,
  handleChange,
  setFormulario,
  setPaso,
  InputField,
}) => {
  const handleRadioChange = (fieldPrefix, value) => {
    setFormulario(prev => ({
      ...prev,
      [`${fieldPrefix}_si`]: value === 'si',
      [`${fieldPrefix}_no`]: value === 'no'
    }));
  };

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-indigo-600 mb-4">
        Paso 4: Desarrollo Ontológico
      </h3>

      {/* Motricidad Gruesa */}
      <div className="bg-blue-50 p-4 rounded-lg">
        <h4 className="text-lg font-semibold text-blue-800 mb-4">Motricidad Gruesa</h4>
        <div className="grid grid-cols-4 gap-2 mb-2 font-semibold text-sm bg-blue-100 p-2 rounded">
          <div>Ítem</div>
          <div className="text-center">Sí</div>
          <div className="text-center">No</div>
          <div className="text-center">Observaciones</div>
        </div>
        
        <CheckboxGroup 
          label="Sostiene la cabeza" 
          fieldPrefix="sostieneCabeza" 
          ageRange="2-4 meses" 
          formulario={formulario}
          handleChange={handleChange}
          handleRadioChange={handleRadioChange}
        />
        <CheckboxGroup 
          label="Se voltea" 
          fieldPrefix="seVoltea" 
          ageRange="4-6 meses" 
          formulario={formulario}
          handleChange={handleChange}
          handleRadioChange={handleRadioChange}
        />
        <CheckboxGroup 
          label="Se sienta sin apoyo" 
          fieldPrefix="seSientaSinApoyo" 
          ageRange="6-8 meses" 
          formulario={formulario}
          handleChange={handleChange}
          handleRadioChange={handleRadioChange}
        />
        <CheckboxGroup 
          label="Gatea o se arrastra" 
          fieldPrefix="gatea" 
          ageRange="7-10 meses" 
          formulario={formulario}
          handleChange={handleChange}
          handleRadioChange={handleRadioChange}
        />
        <CheckboxGroup 
          label="Se pone de pie con apoyo" 
          fieldPrefix="sePoneDePerApoyado" 
          ageRange="9-12 meses" 
          formulario={formulario}
          handleChange={handleChange}
          handleRadioChange={handleRadioChange}
        />
        <CheckboxGroup 
          label="Camina solo" 
          fieldPrefix="caminaSolo" 
          ageRange="12-15 meses" 
          formulario={formulario}
          handleChange={handleChange}
          handleRadioChange={handleRadioChange}
        />
        <CheckboxGroup 
          label="Corre o salta" 
          fieldPrefix="correSalta" 
          ageRange="18-24 meses" 
          formulario={formulario}
          handleChange={handleChange}
          handleRadioChange={handleRadioChange}
        />
      </div>

      {/* Motricidad Fina */}
      <div className="bg-green-50 p-4 rounded-lg">
        <h4 className="text-lg font-semibold text-green-800 mb-4">Motricidad Fina</h4>
        <div className="grid grid-cols-4 gap-2 mb-2 font-semibold text-sm bg-green-100 p-2 rounded">
          <div>Ítem</div>
          <div className="text-center">Sí</div>
          <div className="text-center">No</div>
          <div className="text-center">Observaciones</div>
        </div>
        
        <CheckboxGroup 
          label="Sigue objetos con la mirada" 
          fieldPrefix="sigueObjetosMirada" 
          ageRange="2-3 meses" 
          formulario={formulario}
          handleChange={handleChange}
          handleRadioChange={handleRadioChange}
        />
        <CheckboxGroup 
          label="Lleva objetos a la boca" 
          fieldPrefix="llevaObjetosBoca" 
          ageRange="4-6 meses" 
          formulario={formulario}
          handleChange={handleChange}
          handleRadioChange={handleRadioChange}
        />
        <CheckboxGroup 
          label="Pasa objetos entre manos" 
          fieldPrefix="pasaObjetosEntreManos" 
          ageRange="6-7 meses" 
          formulario={formulario}
          handleChange={handleChange}
          handleRadioChange={handleRadioChange}
        />
        <CheckboxGroup 
          label="Pinza superior (índice-pulgar)" 
          fieldPrefix="pinzaSuperior" 
          ageRange="9-12 meses" 
          formulario={formulario}
          handleChange={handleChange}
          handleRadioChange={handleRadioChange}
        />
        <CheckboxGroup 
          label="Encaja piezas grandes" 
          fieldPrefix="encajaPiezasGrandes" 
          ageRange="12-18 meses" 
          formulario={formulario}
          handleChange={handleChange}
          handleRadioChange={handleRadioChange}
        />
        <CheckboxGroup 
          label="Dibuja garabatos" 
          fieldPrefix="dibujaGarabatos" 
          ageRange="18-24 meses" 
          formulario={formulario}
          handleChange={handleChange}
          handleRadioChange={handleRadioChange}
        />
      </div>

      {/* Lenguaje y Comunicación */}
      <div className="bg-yellow-50 p-4 rounded-lg">
        <h4 className="text-lg font-semibold text-yellow-800 mb-4">Lenguaje y Comunicación</h4>
        <div className="grid grid-cols-4 gap-2 mb-2 font-semibold text-sm bg-yellow-100 p-2 rounded">
          <div>Ítem</div>
          <div className="text-center">Sí</div>
          <div className="text-center">No</div>
          <div className="text-center">Observaciones</div>
        </div>
        
        <CheckboxGroup 
          label="Balbucea o emite sonidos" 
          fieldPrefix="balbucea" 
          ageRange="3-6 meses" 
          formulario={formulario}
          handleChange={handleChange}
          handleRadioChange={handleRadioChange}
        />
        <CheckboxGroup 
          label="Dice mamá/papá con sentido" 
          fieldPrefix="diceMamaPapa" 
          ageRange="9-12 meses" 
          formulario={formulario}
          handleChange={handleChange}
          handleRadioChange={handleRadioChange}
        />
        <CheckboxGroup 
          label="Señala lo que quiere" 
          fieldPrefix="senalaQueQuiere" 
          ageRange="10-14 meses" 
          formulario={formulario}
          handleChange={handleChange}
          handleRadioChange={handleRadioChange}
        />
        <CheckboxGroup 
          label="Dice 5-10 palabras" 
          fieldPrefix="dice5a10Palabras" 
          ageRange="12-18 meses" 
          formulario={formulario}
          handleChange={handleChange}
          handleRadioChange={handleRadioChange}
        />
        <CheckboxGroup 
          label="Entiende órdenes simples" 
          fieldPrefix="entiendeOrdenesSimples" 
          ageRange="12-18 meses" 
          formulario={formulario}
          handleChange={handleChange}
          handleRadioChange={handleRadioChange}
        />
        <CheckboxGroup 
          label="Usa frases de 2 palabras" 
          fieldPrefix="usaFrases2Palabras" 
          ageRange="18-24 meses" 
          formulario={formulario}
          handleChange={handleChange}
          handleRadioChange={handleRadioChange}
        />
      </div>

      {/* Socioemocional */}
      <div className="bg-purple-50 p-4 rounded-lg">
        <h4 className="text-lg font-semibold text-purple-800 mb-4">Socioemocional</h4>
        <div className="grid grid-cols-4 gap-2 mb-2 font-semibold text-sm bg-purple-100 p-2 rounded">
          <div>Ítem</div>
          <div className="text-center">Sí</div>
          <div className="text-center">No</div>
          <div className="text-center">Observaciones</div>
        </div>
        
        <CheckboxGroup 
          label="Sonríe socialmente" 
          fieldPrefix="sonrieSocialmente" 
          ageRange="2-3 meses" 
          formulario={formulario}
          handleChange={handleChange}
          handleRadioChange={handleRadioChange}
        />
        <CheckboxGroup 
          label="Responde a su nombre" 
          fieldPrefix="respondeNombre" 
          ageRange="6-8 meses" 
          formulario={formulario}
          handleChange={handleChange}
          handleRadioChange={handleRadioChange}
        />
        <CheckboxGroup 
          label="Se interesa por otros niños" 
          fieldPrefix="interesaOtrosNinos" 
          ageRange="10-12 meses" 
          formulario={formulario}
          handleChange={handleChange}
          handleRadioChange={handleRadioChange}
        />
        <CheckboxGroup 
          label="Juego simbólico" 
          fieldPrefix="juegoSimbolico" 
          ageRange="18-24 meses" 
          formulario={formulario}
          handleChange={handleChange}
          handleRadioChange={handleRadioChange}
        />
        <CheckboxGroup 
          label="Se despide / lanza besos" 
          fieldPrefix="seDespideLanzaBesos" 
          ageRange="12-18 meses" 
          formulario={formulario}
          handleChange={handleChange}
          handleRadioChange={handleRadioChange}
        />
      </div>

      {/* Conclusión General */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="text-lg font-semibold text-gray-800 mb-4">Conclusión General</h4>
        
        <div className="mb-4">
          <label className="block font-semibold mb-2">¿Nivel de desarrollo acorde a la edad?</label>
          <div className="flex gap-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="nivelDesarrolloAcorde"
                value="si"
                checked={formulario.nivelDesarrolloAcorde_si}
                onChange={() => handleRadioChange('nivelDesarrolloAcorde', 'si')}
                className="mr-2"
              />
              Sí
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="nivelDesarrolloAcorde"
                value="no"
                checked={formulario.nivelDesarrolloAcorde_no}
                onChange={() => handleRadioChange('nivelDesarrolloAcorde', 'no')}
                className="mr-2"
              />
              No
            </label>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block font-semibold mb-1">Áreas que requieren acompañamiento:</label>
            <textarea
              name="areasRequierenAcompanamiento"
              value={formulario.areasRequierenAcompanamiento || ""}
              onChange={handleChange}
              placeholder="- \n- "
              rows={3}
              className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Actividades sugeridas en casa:</label>
            <textarea
              name="actividadesSugeridasCasa"
              value={formulario.actividadesSugeridasCasa || ""}
              onChange={handleChange}
              placeholder="- \n- "
              rows={3}
              className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Seguimiento sugerido (¿En cuánto tiempo recomienda la próxima visita?):</label>
            <textarea
              name="seguimientoSugeridoTexto"
              value={formulario.seguimientoSugeridoTexto || ""}
              onChange={handleChange}
              placeholder="Ejemplo: En 1 mes, en 15 días, según evolución, etc."
              rows={2}
              className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>
        </div>
      </div>

      {/* Observación General */}
      <div className="bg-orange-50 p-4 rounded-lg">
        <h4 className="text-lg font-semibold text-orange-800 mb-4">Observación General</h4>
        
        {/* Signos Vitales */}
        <div className="mb-4">
          <h5 className="font-semibold mb-2">Signos Vitales:</h5>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Frecuencia Cardiaca (80-160ppm)</label>
              <input
                type="text"
                name="frecuenciaCardiaca"
                value={formulario.frecuenciaCardiaca || ""}
                onChange={handleChange}
                className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Frecuencia Respiratoria (30±5)</label>
              <input
                type="text"
                name="frecuenciaRespiratoria"
                value={formulario.frecuenciaRespiratoria || ""}
                onChange={handleChange}
                className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Temperatura</label>
              <input
                type="text"
                name="temperatura"
                value={formulario.temperatura || ""}
                onChange={handleChange}
                className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>
          </div>
        </div>

        {/* Otras observaciones */}
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block font-medium mb-1">Tejido Tegumentario:</label>
            <textarea
              name="tejidoTegumentario"
              value={formulario.tejidoTegumentario || ""}
              onChange={handleChange}
              rows={2}
              className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Reflejos Osteotendinosos:</label>
            <textarea
              name="reflejosOsteotendinosos"
              value={formulario.reflejosOsteotendinosos || ""}
              onChange={handleChange}
              rows={2}
              className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium mb-1">Anormales:</label>
              <textarea
                name="reflejosAnormales"
                value={formulario.reflejosAnormales || ""}
                onChange={handleChange}
                rows={2}
                className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>
            <div>
              <label className="block font-medium mb-1">Patológicos:</label>
              <textarea
                name="reflejosPatologicos"
                value={formulario.reflejosPatologicos || ""}
                onChange={handleChange}
                rows={2}
                className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>
          </div>

          <div>
            <label className="block font-medium mb-1">Tono Muscular:</label>
            <textarea
              name="tonoMuscular"
              value={formulario.tonoMuscular || ""}
              onChange={handleChange}
              rows={2}
              className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Control Motor:</label>
            <textarea
              name="controlMotor"
              value={formulario.controlMotor || ""}
              onChange={handleChange}
              rows={2}
              className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Desplazamientos:</label>
            <textarea
              name="desplazamientos"
              value={formulario.desplazamientos || ""}
              onChange={handleChange}
              rows={2}
              className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Sensibilidad:</label>
            <textarea
              name="sensibilidad"
              value={formulario.sensibilidad || ""}
              onChange={handleChange}
              rows={2}
              className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Perfil Sensorial:</label>
            <textarea
              name="perfilSensorial"
              value={formulario.perfilSensorial || ""}
              onChange={handleChange}
              rows={2}
              className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Deformidades:</label>
            <textarea
              name="deformidades"
              value={formulario.deformidades || ""}
              onChange={handleChange}
              rows={2}
              className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Aparatos Ortopédicos:</label>
            <textarea
              name="aparatosOrtopedicos"
              value={formulario.aparatosOrtopedicos || ""}
              onChange={handleChange}
              rows={2}
              className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Sistema Pulmonar:</label>
            <textarea
              name="sistemaPulmonar"
              value={formulario.sistemaPulmonar || ""}
              onChange={handleChange}
              rows={3}
              className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Problemas Asociados:</label>
            <textarea
              name="problemasAsociados"
              value={formulario.problemasAsociados || ""}
              onChange={handleChange}
              rows={2}
              className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-between pt-6">
        <button
          type="button"
          onClick={() => setPaso(3)}
          className="bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded"
        >
          Anterior
        </button>
        <button
          type="button"
          onClick={() => setPaso(5)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded"
        >
          Siguiente
        </button>
      </div>
    </div>
  );
};

export default Paso4Ontologico;

