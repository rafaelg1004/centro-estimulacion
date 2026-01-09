import React from "react";

export default function Paso3Lactancia({
  formulario,
  handleChange,
  touched,
  siguiente,
  anterior,
  InputField,
}) {
  return (
    <div>
      <h3 className="text-lg font-bold mb-4 text-indigo-700">Lactancia</h3>
      {/* Experiencia previa */}
      <div className="mb-4">
        <label className="block font-semibold mb-1">¿Experiencia previa con lactancia?</label>
        <div className="flex gap-4">
          <label>
            <input
              type="radio"
              name="experienciaLactancia"
              value="Sí"
              checked={formulario.experienciaLactancia === "Sí"}
              onChange={handleChange}
            />{" "}
            Sí
          </label>
          <label>
            <input
              type="radio"
              name="experienciaLactancia"
              value="No"
              checked={formulario.experienciaLactancia === "No"}
              onChange={handleChange}
            />{" "}
            No
          </label>
        </div>
      </div>
      <div className="mb-4">
        <InputField
          label="¿Cómo fue la experiencia?"
          name="comoFueExperiencia"
          value={formulario.comoFueExperiencia}
          onChange={handleChange}
          touched={touched.comoFueExperiencia}
        />
      </div>
      <div className="mb-4">
        <InputField
          label="¿Qué dificultades presentó (si hubo)?"
          name="dificultadesLactancia"
          value={formulario.dificultadesLactancia}
          onChange={handleChange}
          touched={touched.dificultadesLactancia}
        />
      </div>
      {/* Conocimientos y expectativas */}
      <h4 className="font-semibold mb-2 mt-6">Conocimientos y expectativas</h4>
      <div className="mb-4">
        <label className="block font-semibold mb-1">¿Deseas amamantar?</label>
        <div className="flex gap-4">
          <label>
            <input
              type="radio"
              name="deseaAmamantar"
              value="Sí"
              checked={formulario.deseaAmamantar === "Sí"}
              onChange={handleChange}
            />{" "}
            Sí
          </label>
          <label>
            <input
              type="radio"
              name="deseaAmamantar"
              value="No"
              checked={formulario.deseaAmamantar === "No"}
              onChange={handleChange}
            />{" "}
            No
          </label>
          <label>
            <input
              type="radio"
              name="deseaAmamantar"
              value="No estoy segura"
              checked={formulario.deseaAmamantar === "No estoy segura"}
              onChange={handleChange}
            />{" "}
            No estoy segura
          </label>
        </div>
      </div>
      <div className="mb-4">
        <label htmlFor="expectativasAsesoria" className="block font-semibold mb-1">
          ¿Qué esperas de esta asesoría?
        </label>
        <textarea
          id="expectativasAsesoria"
          name="expectativasAsesoria"
          value={formulario.expectativasAsesoria}
          onChange={handleChange}
          className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 border-gray-300"
          rows={2}
        />
      </div>
      <div className="mb-4">
        <label htmlFor="conocimientosLactancia" className="block font-semibold mb-1">
          ¿Qué sabes sobre lactancia materna?
        </label>
        <textarea
          id="conocimientosLactancia"
          name="conocimientosLactancia"
          value={formulario.conocimientosLactancia}
          onChange={handleChange}
          className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 border-gray-300"
          rows={2}
        />
      </div>
      {/* Aspectos físicos relevantes */}
      <h4 className="font-semibold mb-2 mt-6">Aspectos físicos relevantes</h4>
      <div className="mb-4">
        <label className="block font-semibold mb-1">Pechos:</label>
        <div className="flex gap-4 flex-wrap">
          <label>
            <input
              type="checkbox"
              name="pechosNormales"
              checked={formulario.pechosNormales || false}
              onChange={e => handleChange({ target: { name: "pechosNormales", value: e.target.checked } })}
            />{" "}
            Normales
          </label>
          <label>
            <input
              type="checkbox"
              name="pechosDolorosos"
              checked={formulario.pechosDolorosos || false}
              onChange={e => handleChange({ target: { name: "pechosDolorosos", value: e.target.checked } })}
            />{" "}
            Dolorosos
          </label>
          <label>
            <input
              type="checkbox"
              name="pechosSecrecion"
              checked={formulario.pechosSecrecion || false}
              onChange={e => handleChange({ target: { name: "pechosSecrecion", value: e.target.checked } })}
            />{" "}
            Secreción
          </label>
          <label>
            <input
              type="checkbox"
              name="pechosCirugias"
              checked={formulario.pechosCirugias || false}
              onChange={e => handleChange({ target: { name: "pechosCirugias", value: e.target.checked } })}
            />{" "}
            Cirugías previas
          </label>
        </div>
      </div>
      <div className="mb-4">
        <label className="block font-semibold mb-1">Forma del pezón:</label>
        <div className="flex gap-4 flex-wrap">
          <label>
            <input
              type="radio"
              name="formaPezon"
              value="Normal"
              checked={formulario.formaPezon === "Normal"}
              onChange={handleChange}
            />{" "}
            Normal
          </label>
          <label>
            <input
              type="radio"
              name="formaPezon"
              value="Plano"
              checked={formulario.formaPezon === "Plano"}
              onChange={handleChange}
            />{" "}
            Plano
          </label>
          <label>
            <input
              type="radio"
              name="formaPezon"
              value="Invertido"
              checked={formulario.formaPezon === "Invertido"}
              onChange={handleChange}
            />{" "}
            Invertido
          </label>
          <label>
            <input
              type="radio"
              name="formaPezon"
              value="Otro"
              checked={formulario.formaPezon === "Otro"}
              onChange={handleChange}
            />{" "}
            Otro
          </label>
          {formulario.formaPezon === "Otro" && (
            <input
              type="text"
              name="otraFormaPezon"
              value={formulario.otraFormaPezon || ""}
              onChange={handleChange}
              className="ml-2 border rounded-md p-1 w-32"
              placeholder="Especifique"
            />
          )}
        </div>
      </div>
      <div className="mb-4">
        <label htmlFor="observacionesFisicas" className="block font-semibold mb-1">
          Observaciones físicas
        </label>
        <textarea
          id="observacionesFisicas"
          name="observacionesFisicas"
          value={formulario.observacionesFisicas}
          onChange={handleChange}
          className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 border-gray-300"
          rows={2}
        />
      </div>
      {/* Factores que podrían influir */}
      <h4 className="font-semibold mb-2 mt-6">Factores que podrían influir en la lactancia</h4>
      <div className="mb-4">
        <InputField
          label="Medicamentos actuales"
          name="medicamentosActuales"
          value={formulario.medicamentosActuales}
          onChange={handleChange}
          touched={touched.medicamentosActuales}
        />
      </div>
      <div className="mb-4">
        <InputField
          label="Afecciones médicas"
          name="afeccionesMedicas"
          value={formulario.afeccionesMedicas}
          onChange={handleChange}
          touched={touched.afeccionesMedicas}
        />
      </div>
      <div className="mb-6">
        <label className="block font-semibold mb-1">¿Apoyo familiar para la lactancia?</label>
        <div className="flex gap-4">
          <label>
            <input
              type="radio"
              name="apoyoFamiliar"
              value="Sí"
              checked={formulario.apoyoFamiliar === "Sí"}
              onChange={handleChange}
            />{" "}
            Sí
          </label>
          <label>
            <input
              type="radio"
              name="apoyoFamiliar"
              value="No"
              checked={formulario.apoyoFamiliar === "No"}
              onChange={handleChange}
            />{" "}
            No
          </label>
          <label>
            <input
              type="radio"
              name="apoyoFamiliar"
              value="Parcial"
              checked={formulario.apoyoFamiliar === "Parcial"}
              onChange={handleChange}
            />{" "}
            Parcial
          </label>
        </div>
      </div>
      <div className="flex justify-between">
        <button
          type="button"
          className="px-6 py-2 rounded-md text-white font-semibold bg-gray-400 hover:bg-gray-500 transition"
          onClick={anterior}
        >
          Anterior
        </button>
        <button
          type="button"
          className="px-6 py-2 rounded-md text-white font-semibold bg-indigo-600 hover:bg-indigo-700 transition"
          onClick={siguiente}
        >
          Siguiente
        </button>
      </div>
    </div>
  );
}