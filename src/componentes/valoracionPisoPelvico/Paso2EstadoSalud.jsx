import React from "react";

export default function Paso2EstadoSalud({ formulario, setFormulario, siguientePaso, pasoAnterior }) {
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
          <h3 className="text-xl font-bold text-indigo-700 mb-4">Estado de Salud</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full border border-indigo-200 rounded-xl bg-indigo-50">
              <thead>
                <tr className="text-indigo-800 font-semibold">
                  <th className="px-4 py-2">Temperatura</th>
                  <th className="px-4 py-2">TA</th>
                  <th className="px-4 py-2">FR</th>
                  <th className="px-4 py-2">FC</th>
                  <th className="px-4 py-2">Peso Previo</th>
                  <th className="px-4 py-2">Peso Actual</th>
                  <th className="px-4 py-2">Talla</th>
                  <th className="px-4 py-2">IMC</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="px-2 py-2">
                    <input
                      type="text"
                      name="temperatura"
                      value={formulario.temperatura || ""}
                      onChange={handleChange}
                      className="w-24 px-2 py-1 rounded border border-indigo-200"
                      placeholder="°C"
                    />
                  </td>
                  <td className="px-2 py-2">
                    <input
                      type="text"
                      name="ta"
                      value={formulario.ta || ""}
                      onChange={handleChange}
                      className="w-24 px-2 py-1 rounded border border-indigo-200"
                      placeholder="mmHg"
                    />
                  </td>
                  <td className="px-2 py-2">
                    <input
                      type="text"
                      name="fr"
                      value={formulario.fr || ""}
                      onChange={handleChange}
                      className="w-24 px-2 py-1 rounded border border-indigo-200"
                      placeholder="rpm"
                    />
                  </td>
                  <td className="px-2 py-2">
                    <input
                      type="text"
                      name="fc"
                      value={formulario.fc || ""}
                      onChange={handleChange}
                      className="w-24 px-2 py-1 rounded border border-indigo-200"
                      placeholder="lpm"
                    />
                  </td>
                  <td className="px-2 py-2">
                    <input
                      type="text"
                      name="pesoPrevio"
                      value={formulario.pesoPrevio || ""}
                      onChange={handleChange}
                      className="w-24 px-2 py-1 rounded border border-indigo-200"
                      placeholder="kg"
                    />
                  </td>
                  <td className="px-2 py-2">
                    <input
                      type="text"
                      name="pesoActual"
                      value={formulario.pesoActual || ""}
                      onChange={handleChange}
                      className="w-24 px-2 py-1 rounded border border-indigo-200"
                      placeholder="kg"
                    />
                  </td>
                  <td className="px-2 py-2">
                    <input
                      type="text"
                      name="talla"
                      value={formulario.talla || ""}
                      onChange={handleChange}
                      className="w-24 px-2 py-1 rounded border border-indigo-200"
                      placeholder="cm"
                    />
                  </td>
                  <td className="px-2 py-2">
                    <input
                      type="text"
                      name="imc"
                      value={formulario.imc || ""}
                      onChange={handleChange}
                      className="w-24 px-2 py-1 rounded border border-indigo-200"
                      placeholder="IMC"
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3 className="text-xl font-bold text-indigo-700 mt-8 mb-4">Antecedentes</h3>
          <div className="space-y-4">
            <div>
              <label className="font-semibold">Deporte en la actualidad:</label>
              <textarea
                name="deporteActual"
                value={formulario.deporteActual || ""}
                onChange={handleChange}
                className="w-full mt-1 px-3 py-2 border border-indigo-200 rounded"
                placeholder="Tipo/ Intensidad/ Duración / Frecuencia"
                rows={2}
              />
            </div>
            <div>
              <label className="font-semibold">AVD / Trabajo:</label>
              <div className="flex flex-wrap gap-4 mt-2">
                {["Bipedestación", "Sedestación", "Cargas", "Conducción", "Marcha", "Oficina", "Homeworking"].map((item) => (
                  <label key={item} className="flex items-center gap-1">
                    <input
                      type="checkbox"
                      name={`avd_${item.toLowerCase()}`}
                      checked={formulario[`avd_${item.toLowerCase()}`] || false}
                      onChange={handleChange}
                    />
                    {item}
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label className="font-semibold">Observaciones AVD/Trabajo:</label>
              <textarea
                name="observacionesAvd"
                value={formulario.observacionesAvd || ""}
                onChange={handleChange}
                className="w-full mt-1 px-3 py-2 border border-indigo-200 rounded"
                rows={2}
              />
            </div>
            <div>
              <label className="font-semibold">Farmacológicos:</label>
              <div className="flex flex-wrap gap-4 mt-2">
                {["Antihipertensivo", "Antidepresivo", "Ansiolítico", "Antibiótico", "Vitaminas", "Antioxidantes", "Complementación natural"].map((item) => (
                  <label key={item} className="flex items-center gap-1">
                    <input
                      type="checkbox"
                      name={`farmaco_${item.toLowerCase().replace(/ /g, "_")}`}
                      checked={formulario[`farmaco_${item.toLowerCase().replace(/ /g, "_")}`] || false}
                      onChange={handleChange}
                    />
                    {item}
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label className="font-semibold">Otros (Farmacológicos):</label>
              <input
                type="text"
                name="farmacoOtros"
                value={formulario.farmacoOtros || ""}
                onChange={handleChange}
                className="w-full mt-1 px-3 py-2 border border-indigo-200 rounded"
              />
            </div>
            <div>
              <label className="font-semibold">Información sobre medicación:</label>
              <input
                type="text"
                name="infoMedicacion"
                value={formulario.infoMedicacion || ""}
                onChange={handleChange}
                className="w-full mt-1 px-3 py-2 border border-indigo-200 rounded"
              />
            </div>
            <div>
              <label className="font-semibold">Alergias dérmicas / alimentarias:</label>
              <input
                type="text"
                name="alergias"
                value={formulario.alergias || ""}
                onChange={handleChange}
                className="w-full mt-1 px-3 py-2 border border-indigo-200 rounded"
              />
            </div>
            <div>
              <label className="font-semibold">Última analítica sangre / orina / heces / citología:</label>
              <input
                type="text"
                name="ultimaAnalitica"
                value={formulario.ultimaAnalitica || ""}
                onChange={handleChange}
                className="w-full mt-1 px-3 py-2 border border-indigo-200 rounded"
              />
            </div>
            <div>
              <label className="font-semibold">Patología cardiaca, pulmonar o cardiorrespiratoria:</label>
              <input
                type="text"
                name="patologiaCardio"
                value={formulario.patologiaCardio || ""}
                onChange={handleChange}
                className="w-full mt-1 px-3 py-2 border border-indigo-200 rounded"
              />
            </div>
            <div>
              <label className="font-semibold">Patología Neurológica:</label>
              <input
                type="text"
                name="patologiaNeuro"
                value={formulario.patologiaNeuro || ""}
                onChange={handleChange}
                className="w-full mt-1 px-3 py-2 border border-indigo-200 rounded"
              />
            </div>
            <div>
              <label className="font-semibold">Traumáticos:</label>
              <div className="flex flex-wrap gap-4 mt-2">
                {["Accidente de tráfico", "Caída sobre coxis", "Caída sobre espalda", "Golpe abdominal", "Golpe en la cabeza"].map((item) => (
                  <label key={item} className="flex items-center gap-1">
                    <input
                      type="checkbox"
                      name={`trauma_${item.toLowerCase().replace(/ /g, "_")}`}
                      checked={formulario[`trauma_${item.toLowerCase().replace(/ /g, "_")}`] || false}
                      onChange={handleChange}
                    />
                    {item}
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label className="font-semibold">Observaciones (Traumáticos):</label>
              <textarea
                name="observacionesTrauma"
                value={formulario.observacionesTrauma || ""}
                onChange={handleChange}
                className="w-full mt-1 px-3 py-2 border border-indigo-200 rounded"
                rows={2}
              />
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