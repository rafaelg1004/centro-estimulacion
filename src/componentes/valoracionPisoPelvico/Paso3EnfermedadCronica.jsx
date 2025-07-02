import React from "react";

export default function Paso3EnfermedadCronica({ formulario, setFormulario, siguientePaso, pasoAnterior }) {
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
          <h3 className="text-xl font-bold text-indigo-700 mb-4">Enfermedad Crónica</h3>
          {/* Enfermedades crónicas */}
          <div>
            <div className="flex flex-wrap gap-4">
              {[
                "Diabetes", "Hipotiroidismo", "Hipertiroidismo", "Hipertenso", "Hipercolesterolemia",
                "Asma", "Artrosis", "Osteoporosis", "Hernia cervical", "Hernia dorsal",
                "Hernia lumbar", "Hernia abdominal", "Hernia inguinal"
              ].map((item) => (
                <label key={item} className="flex items-center gap-1">
                  <input
                    type="checkbox"
                    name={`cronica_${item.toLowerCase().replace(/ /g, "_")}`}
                    checked={formulario[`cronica_${item.toLowerCase().replace(/ /g, "_")}`] || false}
                    onChange={handleChange}
                  />
                  {item}
                </label>
              ))}
            </div>
            <div className="mt-4">
              <label className="font-semibold">Observaciones (Enfermedad Crónica):</label>
              <textarea
                name="observacionesCronica"
                value={formulario.observacionesCronica || ""}
                onChange={handleChange}
                className="w-full mt-1 px-3 py-2 border border-indigo-200 rounded"
                rows={2}
              />
            </div>
          </div>
          {/* Enfermedades de transmisión sexual */}
          <div>
            <label className="font-semibold">Enfermedades de transmisión sexual:</label>
            <textarea
              name="observacionesETS"
              value={formulario.observacionesETS || ""}
              onChange={handleChange}
              className="w-full mt-1 px-3 py-2 border border-indigo-200 rounded"
              rows={2}
            />
          </div>
          {/* Psicológicos */}
          <div>
            <h3 className="font-semibold text-indigo-600 mb-2">Psicológicos</h3>
            <div className="flex flex-wrap gap-4">
              {["Duelos", "Ruptura relación"].map((item) => (
                <label key={item} className="flex items-center gap-1">
                  <input
                    type="checkbox"
                    name={`psico_${item.toLowerCase().replace(/ /g, "_")}`}
                    checked={formulario[`psico_${item.toLowerCase().replace(/ /g, "_")}`] || false}
                    onChange={handleChange}
                  />
                  {item}
                </label>
              ))}
            </div>
            <div className="mt-4">
              <label className="font-semibold">Psicológicos - Observaciones:</label>
              <textarea
                name="observacionesPsico"
                value={formulario.observacionesPsico || ""}
                onChange={handleChange}
                className="w-full mt-1 px-3 py-2 border border-indigo-200 rounded"
                rows={2}
              />
            </div>
          </div>
          {/* Quirúrgicos */}
          <div>
            <h3 className="text-xl font-bold text-indigo-700 mb-4">Quirúrgicos</h3>
            <div className="flex flex-wrap gap-4">
              {[
                "Cirugía torácica", "Cirugía abdominal", "Cirugía pélvica", "Cirugía hernia", "Proceso oncológico"
              ].map((item) => (
                <label key={item} className="flex items-center gap-1">
                  <input
                    type="checkbox"
                    name={`qx_${item.toLowerCase().replace(/ /g, "_")}`}
                    checked={formulario[`qx_${item.toLowerCase().replace(/ /g, "_")}`] || false}
                    onChange={handleChange}
                  />
                  {item}
                </label>
              ))}
            </div>
            <div className="mt-4">
              <label className="font-semibold">Observaciones (Quirúrgicos):</label>
              <textarea
                name="observacionesQx"
                value={formulario.observacionesQx || ""}
                onChange={handleChange}
                className="w-full mt-1 px-3 py-2 border border-indigo-200 rounded"
                rows={2}
              />
            </div>
          </div>
          {/* Familiares y tóxicos */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="font-semibold">Familiares:</label>
              <input
                type="text"
                name="familiares"
                value={formulario.familiares || ""}
                onChange={handleChange}
                className="w-full mt-1 px-3 py-2 border border-indigo-200 rounded"
              />
            </div>
            <div>
              <label className="font-semibold">Tóxicos:</label>
              <input
                type="text"
                name="toxicos"
                value={formulario.toxicos || ""}
                onChange={handleChange}
                className="w-full mt-1 px-3 py-2 border border-indigo-200 rounded"
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