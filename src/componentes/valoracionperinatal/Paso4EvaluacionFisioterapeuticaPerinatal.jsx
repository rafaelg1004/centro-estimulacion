import React from "react";

export default function Paso4EvaluacionFisioterapeuticaPerinatal({ formulario, handleChange, siguiente, anterior }) {
  return (
    <div>
      <h3 className="text-lg font-bold text-indigo-700 mb-4">4. Evaluación Fisioterapéutica</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 mb-6">
        <div>
          <label className="font-semibold">Postura:</label>
          <input
            type="text"
            name="postura"
            value={formulario.postura || ""}
            onChange={e => handleChange({ postura: e.target.value })}
            className="w-full border rounded p-2"
          />
        </div>
        <div>
          <label className="font-semibold">Abdomen:</label>
          <input
            type="text"
            name="abdomen"
            value={formulario.abdomen || ""}
            onChange={e => handleChange({ abdomen: e.target.value })}
            className="w-full border rounded p-2"
          />
        </div>
        <div>
          <label className="font-semibold">Patrón respiratorio:</label>
          <input
            type="text"
            name="patronRespiratorio"
            value={formulario.patronRespiratorio || ""}
            onChange={e => handleChange({ patronRespiratorio: e.target.value })}
            className="w-full border rounded p-2"
          />
        </div>
        <div>
          <label className="font-semibold">Diafragma:</label>
          <input
            type="text"
            name="diafragma"
            value={formulario.diafragma || ""}
            onChange={e => handleChange({ diafragma: e.target.value })}
            className="w-full border rounded p-2"
          />
        </div>
        <div>
          <label className="font-semibold">Piel:</label>
          <input
            type="text"
            name="piel"
            value={formulario.piel || ""}
            onChange={e => handleChange({ piel: e.target.value })}
            className="w-full border rounded p-2"
          />
        </div>
        <div>
          <label className="font-semibold">Movilidad:</label>
          <input
            type="text"
            name="movilidad"
            value={formulario.movilidad || ""}
            onChange={e => handleChange({ movilidad: e.target.value })}
            className="w-full border rounded p-2"
          />
        </div>
        <div>
          <label className="font-semibold">Psoas secuencia:</label>
          <input
            type="text"
            name="psoasSecuencia"
            value={formulario.psoasSecuencia || ""}
            onChange={e => handleChange({ psoasSecuencia: e.target.value })}
            className="w-full border rounded p-2"
          />
        </div>
        <div>
          <label className="font-semibold">Dolor:</label>
          <input
            type="text"
            name="dolor"
            value={formulario.dolor || ""}
            onChange={e => handleChange({ dolor: e.target.value })}
            className="w-full border rounded p-2"
          />
        </div>
        <div>
          <label className="font-semibold">Palpación abdomen bajo:</label>
          <input
            type="text"
            name="palpacionAbdomenBajo"
            value={formulario.palpacionAbdomenBajo || ""}
            onChange={e => handleChange({ palpacionAbdomenBajo: e.target.value })}
            className="w-full border rounded p-2"
          />
        </div>
        <div>
          <label className="font-semibold">Observación piso pélvico:</label>
          <input
            type="text"
            name="observacionPisoPelvico"
            value={formulario.observacionPisoPelvico || ""}
            onChange={e => handleChange({ observacionPisoPelvico: e.target.value })}
            className="w-full border rounded p-2"
          />
        </div>
        <div>
          <label className="font-semibold">Sensibilidad piso pélvico:</label>
          <input
            type="text"
            name="sensibilidadPisoPelvico"
            value={formulario.sensibilidadPisoPelvico || ""}
            onChange={e => handleChange({ sensibilidadPisoPelvico: e.target.value })}
            className="w-full border rounded p-2"
          />
        </div>
        <div>
          <label className="font-semibold">Reflejos piso pélvico:</label>
          <input
            type="text"
            name="reflejosPisoPelvico"
            value={formulario.reflejosPisoPelvico || ""}
            onChange={e => handleChange({ reflejosPisoPelvico: e.target.value })}
            className="w-full border rounded p-2"
          />
        </div>
        <div>
          <label className="font-semibold">Compartimento anterior:</label>
          <input
            type="text"
            name="compartimentoAnterior"
            value={formulario.compartimentoAnterior || ""}
            onChange={e => handleChange({ compartimentoAnterior: e.target.value })}
            className="w-full border rounded p-2"
          />
        </div>
        <div>
          <label className="font-semibold">Compartimento medio:</label>
          <input
            type="text"
            name="compartimentoMedio"
            value={formulario.compartimentoMedio || ""}
            onChange={e => handleChange({ compartimentoMedio: e.target.value })}
            className="w-full border rounded p-2"
          />
        </div>
        <div>
          <label className="font-semibold">Compartimento posterior:</label>
          <input
            type="text"
            name="compartimentoPosterior"
            value={formulario.compartimentoPosterior || ""}
            onChange={e => handleChange({ compartimentoPosterior: e.target.value })}
            className="w-full border rounded p-2"
          />
        </div>
        <div>
          <label className="font-semibold">Dinámicas piso pélvico:</label>
          <input
            type="text"
            name="dinamicasPisoPelvico"
            value={formulario.dinamicasPisoPelvico || ""}
            onChange={e => handleChange({ dinamicasPisoPelvico: e.target.value })}
            className="w-full border rounded p-2"
          />
        </div>
        <div>
          <label className="font-semibold">Fuerza piso pélvico:</label>
          <input
            type="text"
            name="fuerzaPisoPelvico"
            value={formulario.fuerzaPisoPelvico || ""}
            onChange={e => handleChange({ fuerzaPisoPelvico: e.target.value })}
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