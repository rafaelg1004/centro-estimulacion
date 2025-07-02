import React from "react";

export default function Paso5DinamicaMenstrual({ formulario, setFormulario, siguientePaso, pasoAnterior }) {
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormulario((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-100 via-purple-100 to-green-100">
      <div className="bg-white bg-opacity-90 p-10 rounded-3xl shadow-2xl flex flex-col gap-8 w-full max-w-2xl border border-indigo-100">
        <form
          onSubmit={e => {
            e.preventDefault();
            siguientePaso();
          }}
          className="space-y-8"
        >
          <h3 className="text-xl font-bold text-indigo-700 mb-4">Dinámica Menstrual</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="number"
              name="edadMenarquia"
              value={formulario.edadMenarquia || ""}
              onChange={handleChange}
              placeholder="Edad Menarquia"
              className="px-3 py-2 border border-indigo-200 rounded"
            />
            <input
              type="number"
              name="edadMenopausia"
              value={formulario.edadMenopausia || ""}
              onChange={handleChange}
              placeholder="Edad Menopausia"
              className="px-3 py-2 border border-indigo-200 rounded"
            />
            <input
              type="number"
              name="diasMenstruacion"
              value={formulario.diasMenstruacion || ""}
              onChange={handleChange}
              placeholder="Días de Menstruación"
              className="px-3 py-2 border border-indigo-200 rounded"
            />
            <input
              type="number"
              name="intervaloPeriodo"
              value={formulario.intervaloPeriodo || ""}
              onChange={handleChange}
              placeholder="Intervalo entre periodo"
              className="px-3 py-2 border border-indigo-200 rounded"
            />
          </div>

          <div>
            <label className="font-semibold">Características del sangrado:</label>
            <div className="flex flex-wrap gap-4 mt-2">
              {["Fluido", "Espeso", "Entrecortado", "Coágulos", "Oxidado", "Olor sangre", "Olor lubricación"].map((item) => (
                <label key={item} className="flex items-center gap-1">
                  <input
                    type="checkbox"
                    name={`caracSangrado_${item.toLowerCase().replace(/ /g, "_")}`}
                    checked={formulario[`caracSangrado_${item.toLowerCase().replace(/ /g, "_")}`] || false}
                    onChange={handleChange}
                  />
                  {item}
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="font-semibold">Algias durante el periodo menstrual:</label>
            <div className="flex flex-wrap gap-4">
              {["Todos los días", "Síndrome Ovulatorio", "Síndrome Premenstrual"].map((item) => (
                <label key={item} className="flex items-center gap-1">
                  <input
                    type="checkbox"
                    name={`sintomaMenstrual_${item.toLowerCase().replace(/ /g, "_")}`}
                    checked={formulario[`sintomaMenstrual_${item.toLowerCase().replace(/ /g, "_")}`] || false}
                    onChange={handleChange}
                  />
                  {item}
                </label>
              ))}
            </div>
            <textarea
              name="algiasPeriodo"
              value={formulario.algiasPeriodo || ""}
              onChange={handleChange}
              className="w-full mt-1 px-3 py-2 border border-indigo-200 rounded"
              rows={2}
            />
          </div>

          <div>
            <label className="font-semibold">Observaciones:</label>
            <textarea
              name="observacionesMenstrual"
              value={formulario.observacionesMenstrual || ""}
              onChange={handleChange}
              className="w-full mt-1 px-3 py-2 border border-indigo-200 rounded"
              rows={2}
            />
          </div>

          <div>
            <label className="font-semibold">Durante los días de sangrado usa:</label>
            <div className="flex flex-wrap gap-4 mt-2">
              {["Copa menstrual", "Tampones", "Compresa desechable", "Compresa reutilizable", "Bragas menstruales", "Anillo vaginal"].map((item) => (
                <label key={item} className="flex items-center gap-1">
                  <input
                    type="checkbox"
                    name={`productoMenstrual_${item.toLowerCase().replace(/ /g, "_")}`}
                    checked={formulario[`productoMenstrual_${item.toLowerCase().replace(/ /g, "_")}`] || false}
                    onChange={handleChange}
                  />
                  {item}
                </label>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-4">
            <label className="flex items-center gap-2">
              Dolor:
              <input
                type="checkbox"
                name="dolorMenstrual"
                checked={formulario.dolorMenstrual || false}
                onChange={handleChange}
              /> Sí
            </label>
            <input
              type="text"
              name="ubicacionDolorMenstrual"
              value={formulario.ubicacionDolorMenstrual || ""}
              onChange={handleChange}
              placeholder="Ubicación"
              className="px-3 py-2 border border-indigo-200 rounded"
            />
          </div>
          <div>
            <label className="font-semibold">Factores perpetuadores:</label>
            <input
              type="text"
              name="factoresPerpetuadores"
              value={formulario.factoresPerpetuadores || ""}
              onChange={handleChange}
              className="w-full mt-1 px-3 py-2 border border-indigo-200 rounded"
            />
          </div>
          <div>
            <label className="font-semibold">Factores calmantes:</label>
            <input
              type="text"
              name="factoresCalmantes"
              value={formulario.factoresCalmantes || ""}
              onChange={handleChange}
              className="w-full mt-1 px-3 py-2 border border-indigo-200 rounded"
            />
          </div>

          <div>
            <label className="font-semibold">Métodos anticonceptivos:</label>
            <div className="flex flex-wrap gap-4 mt-2">
              {["Píldora", "DIU", "Preservativo", "Parches", "Diafragma", "Anillo vaginal"].map((item) => (
                <label key={item} className="flex items-center gap-1">
                  <input
                    type="checkbox"
                    name={`anticonceptivo_${item.toLowerCase().replace(/ /g, "_")}`}
                    checked={formulario[`anticonceptivo_${item.toLowerCase().replace(/ /g, "_")}`] || false}
                    onChange={handleChange}
                  />
                  {item}
                </label>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <input
              type="number"
              name="intentosEmbarazo"
              value={formulario.intentosEmbarazo || ""}
              onChange={handleChange}
              placeholder="Intentos de Embarazo"
              className="px-3 py-2 border border-indigo-200 rounded mb-2 w-full md:w-1/2"
            />
            <div className="flex flex-wrap gap-6 mt-2">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="noMeQuedoEmbarazada"
                  checked={formulario.noMeQuedoEmbarazada || false}
                  onChange={handleChange}
                />
                No me quedo embarazada
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="fecundacionInVitro"
                  checked={formulario.fecundacionInVitro || false}
                  onChange={handleChange}
                />
                Fecundación in Vitro
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="tratamientoHormonal"
                  checked={formulario.tratamientoHormonal || false}
                  onChange={handleChange}
                />
                Tratamiento Hormonal
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="inseminacionArtificial"
                  checked={formulario.inseminacionArtificial || false}
                  onChange={handleChange}
                />
                Inseminación Artificial
              </label>
            </div>
          </div>

          <div className="flex justify-between mt-6">
            <button
              type="button"
              onClick={pasoAnterior}
              className="bg-gray-300 hover:bg-gray-400 text-black px-6 py-2 rounded font-bold"
            >
              Anterior
            </button>
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded transition"
            >
              Siguiente
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}