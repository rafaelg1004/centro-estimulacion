import React from "react";

export default function Paso7ICIQSF({ formulario, setFormulario, siguientePaso, pasoAnterior }) {
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
          <h3 className="text-xl font-bold text-indigo-700 mb-4">ICIQ-SF - Cuestionario de Incontinencia Urinaria</h3>
          
          {/* Pregunta 1 */}
          <div>
            <label className="font-semibold block mb-2">
              1. ¿Con qué frecuencia pierde orina?
            </label>
            <div className="flex flex-col gap-2">
              {[
                { label: "Nunca", value: "0" },
                { label: "Una vez a la semana", value: "1" },
                { label: "2-3 veces/semana", value: "2" },
                { label: "Una vez al día", value: "3" },
                { label: "Varias veces al día", value: "4" },
                { label: "Continuamente", value: "5" },
              ].map(opt => (
                <label key={opt.value} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="icicq_frecuencia"
                    value={opt.value}
                    checked={formulario.icicq_frecuencia === opt.value}
                    onChange={handleChange}
                  />
                  {opt.label}
                </label>
              ))}
            </div>
          </div>

          {/* Pregunta 2 */}
          <div>
            <label className="font-semibold block mb-2">
              2. ¿Cantidad de orina que cree que se le escapa?
            </label>
            <div className="flex flex-col gap-2">
              {[
                { label: "No se me escapa nada", value: "0" },
                { label: "Muy poca cantidad", value: "2" },
                { label: "Una cantidad moderada", value: "4" },
                { label: "Mucha cantidad", value: "6" },
              ].map(opt => (
                <label key={opt.value} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="icicq_cantidad"
                    value={opt.value}
                    checked={formulario.icicq_cantidad === opt.value}
                    onChange={handleChange}
                  />
                  {opt.label}
                </label>
              ))}
            </div>
          </div>

          {/* Pregunta 3 */}
          <div>
            <label className="font-semibold block mb-2">
              3. ¿En qué medida estos escapes de orina han afectado su vida diaria?
            </label>
            <div className="flex items-center gap-2 flex-wrap">
              {[1,2,3,4,5,6,7,8,9,10].map(num => (
                <label key={num} className="flex flex-col items-center">
                  <input
                    type="radio"
                    name="icicq_impacto"
                    value={num}
                    checked={formulario.icicq_impacto === String(num)}
                    onChange={handleChange}
                  />
                  <span className="text-xs">{num}</span>
                </label>
              ))}
            </div>
            <div className="flex justify-between text-xs mt-1">
              <span>Nada</span>
              <span>Mucho</span>
            </div>
          </div>

          {/* Pregunta 4 */}
          <div>
            <label className="font-semibold block mb-2">
              4. ¿Cuándo pierde orina? (Señale todo lo que le pasa a Ud.)
            </label>
            <div className="flex flex-col gap-2">
              {[
                "Nunca",
                "Antes de llegar al servicio",
                "Al toser o estornudar",
                "Mientras duerme",
                "Al realizar esfuerzos físicos/ejercicio",
                "Cuando termina de orinar y ya se ha vestido",
                "Sin motivo evidente",
                "De forma continua"
              ].map(item => (
                <label key={item} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name={`icicq_cuando_${item.toLowerCase().replace(/[^a-z0-9]/g, "_")}`}
                    checked={formulario[`icicq_cuando_${item.toLowerCase().replace(/[^a-z0-9]/g, "_")}`] || false}
                    onChange={handleChange}
                  />
                  {item}
                </label>
              ))}
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