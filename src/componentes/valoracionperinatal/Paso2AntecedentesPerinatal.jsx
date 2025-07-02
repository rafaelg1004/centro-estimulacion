import React from "react";

export default function Paso2AntecedentesPerinatal({ formulario, handleChange, siguiente, anterior }) {
  // Función para limpiar los campos si responde "NO"
  const limpiarObstetricos = () => {
    handleChange({
      numEmbarazos: "",
      numAbortos: "",
      numPartosVaginales: "",
      instrumentado: "",
      numCesareas: "",
      fechaObstetrico: "",
      peso: "",
      talla: "",
      episiotomia: "",
      desgarro: "",
      espacioEntreEmbarazos: "",
      actividadFisica: "",
      complicaciones: ""
    });
  };

  const handleHaTenidoEmbarazos = e => {
    handleChange({ haTenidoEmbarazos: e.target.value });
    if (e.target.value !== "SI") limpiarObstetricos();
  };

  return (
    <div>
      <h3 className="text-lg font-bold text-indigo-700 mb-4">2. Antecedentes</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 mb-6">
        <div>
          <label className="font-semibold">Hospitalarios:</label>
          <input
            type="text"
            name="hospitalarios"
            value={formulario.hospitalarios || ""}
            onChange={e => handleChange({ hospitalarios: e.target.value })}
            className="w-full border rounded p-2"
          />
        </div>
        <div>
          <label className="font-semibold">Patológicos:</label>
          <input
            type="text"
            name="patologicos"
            value={formulario.patologicos || ""}
            onChange={e => handleChange({ patologicos: e.target.value })}
            className="w-full border rounded p-2"
          />
        </div>
        <div>
          <label className="font-semibold">Familiares:</label>
          <input
            type="text"
            name="familiares"
            value={formulario.familiares || ""}
            onChange={e => handleChange({ familiares: e.target.value })}
            className="w-full border rounded p-2"
          />
        </div>
        <div>
          <label className="font-semibold">Traumáticos:</label>
          <input
            type="text"
            name="traumaticos"
            value={formulario.traumaticos || ""}
            onChange={e => handleChange({ traumaticos: e.target.value })}
            className="w-full border rounded p-2"
          />
        </div>
        <div>
          <label className="font-semibold">Farmacológicos:</label>
          <input
            type="text"
            name="farmacologicos"
            value={formulario.farmacologicos || ""}
            onChange={e => handleChange({ farmacologicos: e.target.value })}
            className="w-full border rounded p-2"
          />
        </div>
        <div>
          <label className="font-semibold">Quirúrgicos:</label>
          <input
            type="text"
            name="quirurgicos"
            value={formulario.quirurgicos || ""}
            onChange={e => handleChange({ quirurgicos: e.target.value })}
            className="w-full border rounded p-2"
          />
        </div>
        <div>
          <label className="font-semibold">Tóxico/alérgicos:</label>
          <input
            type="text"
            name="toxicoAlergicos"
            value={formulario.toxicoAlergicos || ""}
            onChange={e => handleChange({ toxicoAlergicos: e.target.value })}
            className="w-full border rounded p-2"
          />
        </div>
      </div>

      <h4 className="font-bold text-indigo-600 mt-6 mb-2">Obstétricos</h4>
      <div className="mb-4">
        <label className="font-semibold">¿Ha tenido embarazos?</label>
        <select
          name="haTenidoEmbarazos"
          value={formulario.haTenidoEmbarazos || ""}
          onChange={handleHaTenidoEmbarazos}
          className="w-full border rounded p-2"
          required
        >
          <option value="">Seleccione una opción</option>
          <option value="SI">Sí</option>
          <option value="NO">No</option>
        </select>
      </div>

      {formulario.haTenidoEmbarazos === "SI" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 mb-6">
          <div>
            <label className="font-semibold">No. Embarazos:</label>
            <input
              type="number"
              name="numEmbarazos"
              value={formulario.numEmbarazos || ""}
              onChange={e => handleChange({ numEmbarazos: e.target.value })}
              className="w-full border rounded p-2"
              min={0}
            />
          </div>
          <div>
            <label className="font-semibold">No. Abortos:</label>
            <input
              type="number"
              name="numAbortos"
              value={formulario.numAbortos || ""}
              onChange={e => handleChange({ numAbortos: e.target.value })}
              className="w-full border rounded p-2"
              min={0}
            />
          </div>
          <div>
            <label className="font-semibold">No. Partos Vaginales:</label>
            <input
              type="number"
              name="numPartosVaginales"
              value={formulario.numPartosVaginales || ""}
              onChange={e => handleChange({ numPartosVaginales: e.target.value })}
              className="w-full border rounded p-2"
              min={0}
            />
          </div>
          <div>
            <label className="font-semibold">Instrumentado:</label>
            <input
              type="text"
              name="instrumentado"
              value={formulario.instrumentado || ""}
              onChange={e => handleChange({ instrumentado: e.target.value })}
              className="w-full border rounded p-2"
            />
          </div>
          <div>
            <label className="font-semibold">No. de Cesáreas:</label>
            <input
              type="number"
              name="numCesareas"
              value={formulario.numCesareas || ""}
              onChange={e => handleChange({ numCesareas: e.target.value })}
              className="w-full border rounded p-2"
              min={0}
            />
          </div>
          <div>
            <label className="font-semibold">Fecha:</label>
            <input
              type="date"
              name="fechaObstetrico"
              value={formulario.fechaObstetrico || ""}
              onChange={e => handleChange({ fechaObstetrico: e.target.value })}
              className="w-full border rounded p-2"
            />
          </div>
          <div>
            <label className="font-semibold">Peso:</label>
            <input
              type="text"
              name="peso"
              value={formulario.peso || ""}
              onChange={e => handleChange({ peso: e.target.value })}
              className="w-full border rounded p-2"
            />
          </div>
          <div>
            <label className="font-semibold">Talla:</label>
            <input
              type="text"
              name="talla"
              value={formulario.talla || ""}
              onChange={e => handleChange({ talla: e.target.value })}
              className="w-full border rounded p-2"
            />
          </div>
          <div>
            <label className="font-semibold">Episiotomía:</label>
            <input
              type="text"
              name="episiotomia"
              value={formulario.episiotomia || ""}
              onChange={e => handleChange({ episiotomia: e.target.value })}
              className="w-full border rounded p-2"
            />
          </div>
          <div>
            <label className="font-semibold">Desgarro:</label>
            <input
              type="text"
              name="desgarro"
              value={formulario.desgarro || ""}
              onChange={e => handleChange({ desgarro: e.target.value })}
              className="w-full border rounded p-2"
            />
          </div>
          <div>
            <label className="font-semibold">Espacio entre embarazos:</label>
            <input
              type="text"
              name="espacioEntreEmbarazos"
              value={formulario.espacioEntreEmbarazos || ""}
              onChange={e => handleChange({ espacioEntreEmbarazos: e.target.value })}
              className="w-full border rounded p-2"
            />
          </div>
          <div>
            <label className="font-semibold">Actividad física (antes/durante/después):</label>
            <input
              type="text"
              name="actividadFisica"
              value={formulario.actividadFisica || ""}
              onChange={e => handleChange({ actividadFisica: e.target.value })}
              className="w-full border rounded p-2"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="font-semibold">Complicaciones:</label>
            <textarea
              name="complicaciones"
              value={formulario.complicaciones || ""}
              onChange={e => handleChange({ complicaciones: e.target.value })}
              className="w-full border rounded p-2"
            />
          </div>
        </div>
      )}

      <h4 className="font-bold text-indigo-600 mt-6 mb-2">Ginecológicos</h4>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 mb-6">
        <div>
          <label className="font-semibold">Cirugías previas:</label>
          <input
            type="text"
            name="cirugiasPrevias"
            value={formulario.cirugiasPrevias || ""}
            onChange={e => handleChange({ cirugiasPrevias: e.target.value })}
            className="w-full border rounded p-2"
          />
        </div>
        <div>
          <label className="font-semibold">Prolapsos:</label>
          <input
            type="text"
            name="prolapsos"
            value={formulario.prolapsos || ""}
            onChange={e => handleChange({ prolapsos: e.target.value })}
            className="w-full border rounded p-2"
          />
        </div>
        <div>
          <label className="font-semibold">Hormonales:</label>
          <input
            type="text"
            name="hormonales"
            value={formulario.hormonales || ""}
            onChange={e => handleChange({ hormonales: e.target.value })}
            className="w-full border rounded p-2"
          />
        </div>
        <div>
          <label className="font-semibold">Anticonceptivos:</label>
          <input
            type="text"
            name="anticonceptivos"
            value={formulario.anticonceptivos || ""}
            onChange={e => handleChange({ anticonceptivos: e.target.value })}
            className="w-full border rounded p-2"
          />
        </div>
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