import React from "react";

export default function Paso6DinamicaMiccional({ formulario, setFormulario, siguientePaso, pasoAnterior }) {
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
          <h3 className="text-xl font-bold text-indigo-700 mb-4">Dinámica Miccional</h3>
          <div className="mb-4">
            <label className="font-semibold">Usa de protector/ Toalla / Pañal:</label>
            <input
              type="text"
              name="protectorMiccional"
              value={formulario.protectorMiccional || ""}
              onChange={handleChange}
              className="w-full mt-1 px-3 py-2 border border-indigo-200 rounded"
            />
          </div>
          <div className="mb-4">
            <label className="font-semibold">Tipo de Ropa Interior: Material / Tipo:</label>
            <input
              type="text"
              name="ropaInterior"
              value={formulario.ropaInterior || ""}
              onChange={handleChange}
              className="w-full mt-1 px-3 py-2 border border-indigo-200 rounded"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="number"
              name="numMiccionesDia"
              value={formulario.numMiccionesDia || ""}
              onChange={handleChange}
              placeholder="N° Micciones al día"
              className="px-3 py-2 border border-indigo-200 rounded"
            />
            <input
              type="number"
              name="cadaCuantasHoras"
              value={formulario.cadaCuantasHoras || ""}
              onChange={handleChange}
              placeholder="Cada cuántas horas"
              className="px-3 py-2 border border-indigo-200 rounded"
            />
            <input
              type="number"
              name="numMiccionesNoche"
              value={formulario.numMiccionesNoche || ""}
              onChange={handleChange}
              placeholder="N° Micciones en la noche"
              className="px-3 py-2 border border-indigo-200 rounded"
            />
          </div>
          <div>
            <label className="font-semibold">Características de la micción:</label>
            <div className="flex flex-wrap gap-4 mt-2">
              {["Normal", "Irritativo", "Urgente", "Doloroso"].map((item) => (
                <label key={item} className="flex items-center gap-1">
                  <input
                    type="checkbox"
                    name={`caracMiccion_${item.toLowerCase()}`}
                    checked={formulario[`caracMiccion_${item.toLowerCase()}`] || false}
                    onChange={handleChange}
                  />
                  {item}
                </label>
              ))}
            </div>
          </div>
          <div className="flex flex-wrap gap-6">
            <label className="flex items-center gap-2">
              Sensación de vaciado completo
              <input
                type="checkbox"
                name="vaciadoCompleto"
                checked={formulario.vaciadoCompleto || false}
                onChange={handleChange}
              />
            </label>
            <label className="flex items-center gap-2">
              Sensación de vaciado incompleto
              <input
                type="checkbox"
                name="vaciadoIncompleto"
                checked={formulario.vaciadoIncompleto || false}
                onChange={handleChange}
              />
            </label>
          </div>
          <div className="flex flex-wrap gap-6">
            <label className="flex items-center gap-2">
              Postura miccional sentado
              <input
                type="checkbox"
                name="posturaSentado"
                checked={formulario.posturaSentado || false}
                onChange={handleChange}
              />
            </label>
            <label className="flex items-center gap-2">
              Postura miccional hiperpresivo
              <input
                type="checkbox"
                name="posturaHiperpresivo"
                checked={formulario.posturaHiperpresivo || false}
                onChange={handleChange}
              />
            </label>
          </div>
          <div>
            <label className="font-semibold">Forma de micción:</label>
            <div className="flex flex-wrap gap-4 mt-2">
              {[
                "Constante", "Cortada", "Lateralizada", "Inclinada anterior", "Explosiva",
                "Aspersor", "Bifurcada", "Débil"
              ].map((item) => (
                <label key={item} className="flex items-center gap-1">
                  <input
                    type="checkbox"
                    name={`formaMiccion_${item.toLowerCase().replace(/ /g, "_")}`}
                    checked={formulario[`formaMiccion_${item.toLowerCase().replace(/ /g, "_")}`] || false}
                    onChange={handleChange}
                  />
                  {item}
                </label>
              ))}
            </div>
          </div>
          <div className="flex flex-wrap gap-6">
            <label className="flex items-center gap-2">
              Necesita empujar para comenzar
              <input
                type="checkbox"
                name="empujarComenzar"
                checked={formulario.empujarComenzar || false}
                onChange={handleChange}
              />
            </label>
            <label className="flex items-center gap-2">
              Necesita empujar para terminar
              <input
                type="checkbox"
                name="empujarTerminar"
                checked={formulario.empujarTerminar || false}
                onChange={handleChange}
              />
            </label>
          </div>
          <div>
            <label className="font-semibold">Tipo de Incontinencia:</label>
            <div className="flex flex-wrap gap-4 mt-2">
              <label className="flex items-center gap-1">
                <input
                  type="checkbox"
                  name="incontinenciaEsfuerzoRie"
                  checked={formulario.incontinenciaEsfuerzoRie || false}
                  onChange={handleChange}
                />
                De esfuerzo: ríe
              </label>
              <label className="flex items-center gap-1">
                <input
                  type="checkbox"
                  name="incontinenciaEsfuerzoSalta"
                  checked={formulario.incontinenciaEsfuerzoSalta || false}
                  onChange={handleChange}
                />
                salta
              </label>
              <label className="flex items-center gap-1">
                <input
                  type="checkbox"
                  name="incontinenciaEsfuerzoCorre"
                  checked={formulario.incontinenciaEsfuerzoCorre || false}
                  onChange={handleChange}
                />
                corre
              </label>
              <input
                type="text"
                name="incontinenciaEsfuerzoOtros"
                value={formulario.incontinenciaEsfuerzoOtros || ""}
                onChange={handleChange}
                placeholder="otros"
                className="px-3 py-2 border border-indigo-200 rounded"
              />
            </div>
            <div className="flex flex-wrap gap-4 mt-2">
              <label className="flex items-center gap-1">
                <input
                  type="checkbox"
                  name="incontinenciaUrgencia"
                  checked={formulario.incontinenciaUrgencia || false}
                  onChange={handleChange}
                />
                De Urgencia
              </label>
              <label className="flex items-center gap-1">
                <input
                  type="checkbox"
                  name="incontinenciaMixta"
                  checked={formulario.incontinenciaMixta || false}
                  onChange={handleChange}
                />
                Mixta
              </label>
            </div>
          </div>
          <div>
            <label className="font-semibold">Dolor al orinar:</label>
            <input
              type="text"
              name="dolorOrinar"
              value={formulario.dolorOrinar || ""}
              onChange={handleChange}
              className="w-full mt-1 px-3 py-2 border border-indigo-200 rounded"
            />
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