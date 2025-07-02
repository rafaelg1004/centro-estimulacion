import React from "react";

const opcionesOxford = [
  { value: "0", label: "0/5 Ausencia de contracción." },
  { value: "1", label: "1/5 Contracción muy débil." },
  { value: "2", label: "2/5 Contracción débil." },
  { value: "3", label: "3/5 Contracción moderada, con tensión y mantenida." },
  { value: "4", label: "4/5 Contracción buena. Mantenimiento de la tensión con resistencia." },
  { value: "5", label: "5/5 Contracción fuerte. Mantenimiento de la tensión con fuerte resistencia." },
];

export default function Paso10PalpacionInterna({ formulario, setFormulario, siguientePaso, pasoAnterior }) {
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
          <h3 className="text-xl font-bold text-indigo-700 mb-4">Palpación Interna</h3>
          <div>
            <label className="font-semibold">Cúpulas:</label>
            <div className="flex flex-wrap gap-4 mt-2">
              <label className="flex items-center gap-1">
                <input
                  type="checkbox"
                  name="cupulaDerecha"
                  checked={formulario.cupulaDerecha || false}
                  onChange={handleChange}
                />
                Derecha
              </label>
              <label className="flex items-center gap-1">
                <input
                  type="checkbox"
                  name="cupulaIzquierda"
                  checked={formulario.cupulaIzquierda || false}
                  onChange={handleChange}
                />
                Izquierda
              </label>
            </div>
          </div>
          <div>
            <label className="font-semibold">Tono General (tracción como estiramiento y veo respuesta):</label>
            <div className="flex flex-wrap gap-4 mt-2">
              {["Normal", "Aumentado", "Disminuido", "Hipotonía", "Hiperactividad"].map((item) => (
                <label key={item} className="flex items-center gap-1">
                  <input
                    type="radio"
                    name="tonoGeneral"
                    value={item}
                    checked={formulario.tonoGeneral === item}
                    onChange={handleChange}
                  />
                  {item}
                </label>
              ))}
            </div>
            <input
              type="text"
              name="tonoObservaciones"
              value={formulario.tonoObservaciones || ""}
              onChange={handleChange}
              className="w-full mt-1 px-3 py-2 border border-indigo-200 rounded"
              placeholder="Observaciones sobre el tono"
            />
          </div>
          <div>
            <label className="font-semibold">Capacidad Contráctil General:</label>
            <input
              type="text"
              name="capacidadContractil"
              value={formulario.capacidadContractil || ""}
              onChange={handleChange}
              className="w-full mt-1 px-3 py-2 border border-indigo-200 rounded"
            />
          </div>
          <div>
            <label className="font-semibold mb-2 block">Fuerza (Escala de Oxford):</label>
            <div className="mb-2">
              <span className="font-semibold">Global:</span>
              <div className="flex flex-col gap-1 ml-4">
                {opcionesOxford.map(opt => (
                  <label key={opt.value} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="oxfordGlobal"
                      value={opt.value}
                      checked={formulario.oxfordGlobal === opt.value}
                      onChange={handleChange}
                    />
                    {opt.label}
                  </label>
                ))}
              </div>
            </div>
            <div className="mb-2">
              <span className="font-semibold">Derecha:</span>
              <div className="flex flex-col gap-1 ml-4">
                {opcionesOxford.map(opt => (
                  <label key={opt.value} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="oxfordDerecha"
                      value={opt.value}
                      checked={formulario.oxfordDerecha === opt.value}
                      onChange={handleChange}
                    />
                    {opt.label}
                  </label>
                ))}
              </div>
            </div>
            <div>
              <span className="font-semibold">Izquierda:</span>
              <div className="flex flex-col gap-1 ml-4">
                {opcionesOxford.map(opt => (
                  <label key={opt.value} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="oxfordIzquierda"
                      value={opt.value}
                      checked={formulario.oxfordIzquierda === opt.value}
                      onChange={handleChange}
                    />
                    {opt.label}
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Escala PERFECT */}
          <div className="border-t pt-6 mt-6">
            <h4 className="text-lg font-bold text-indigo-600 mb-2">Escala PERFECT</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="font-semibold">P - Power (Fuerza):</label>
                <input
                  type="text"
                  name="perfectPower"
                  value={formulario.perfectPower || ""}
                  onChange={handleChange}
                  className="w-full mt-1 px-3 py-2 border border-indigo-200 rounded"
                  placeholder="Valorar de 0-5 por Oxford"
                />
              </div>
              <div>
                <label className="font-semibold">E - Endurance (Resistencia):</label>
                <input
                  type="text"
                  name="perfectEndurance"
                  value={formulario.perfectEndurance || ""}
                  onChange={handleChange}
                  className="w-full mt-1 px-3 py-2 border border-indigo-200 rounded"
                  placeholder="Tiempo manteniendo contracción máxima, sin perder la fuerza"
                />
              </div>
              <div>
                <label className="font-semibold">R - Repetitions (Repeticiones):</label>
                <input
                  type="text"
                  name="perfectRepetitions"
                  value={formulario.perfectRepetitions || ""}
                  onChange={handleChange}
                  className="w-full mt-1 px-3 py-2 border border-indigo-200 rounded"
                  placeholder="N° de repeticiones posibles, con descanso de 4s"
                />
              </div>
              <div>
                <label className="font-semibold">F - Fast (Rápidas):</label>
                <input
                  type="text"
                  name="perfectFast"
                  value={formulario.perfectFast || ""}
                  onChange={handleChange}
                  className="w-full mt-1 px-3 py-2 border border-indigo-200 rounded"
                  placeholder="N° de contracciones rápidas tras 1 min de descanso"
                />
              </div>
              <div>
                <label className="font-semibold">ECT - Every Contraction Time:</label>
                <input
                  type="text"
                  name="perfectECT"
                  value={formulario.perfectECT || ""}
                  onChange={handleChange}
                  className="w-full mt-1 px-3 py-2 border border-indigo-200 rounded"
                  placeholder="N° de contracciones en un tiempo determinado"
                />
              </div>
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