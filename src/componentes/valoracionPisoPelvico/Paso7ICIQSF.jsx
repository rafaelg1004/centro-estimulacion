import React, { useCallback } from "react";
import { 
  ClipboardDocumentListIcon, 
  QuestionMarkCircleIcon, 
  ScaleIcon,
  ExclamationTriangleIcon
} from "@heroicons/react/24/outline";

// Componente para secciones (fuera del componente principal para evitar re-creación)
const Section = ({ title, icon: Icon, children, bgColor = "bg-indigo-50", iconColor = "text-indigo-600" }) => (
  <div className={`${bgColor} border border-indigo-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300`}>
    <div className="flex items-center gap-3 mb-4">
      <div className={`p-2 ${iconColor} bg-white rounded-xl shadow-sm`}>
        <Icon className="w-5 h-5" />
      </div>
      <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
    </div>
    {children}
  </div>
);

export default function Paso7ICIQSF({ formulario, setFormulario, siguientePaso, pasoAnterior }) {
  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setFormulario((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }, [setFormulario]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Título principal */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Valoración Piso Pélvico
          </h1>
          <h2 className="text-2xl font-semibold text-gray-700">
            Paso 7: ICIQ-SF - Cuestionario de Incontinencia Urinaria
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 mx-auto mt-4 rounded-full"></div>
        </div>

        <form
          onSubmit={e => {
            e.preventDefault();
            siguientePaso();
          }}
          className="space-y-8"
        >
          {/* Pregunta 1 - Frecuencia */}
          <Section 
            title="Pregunta 1: Frecuencia de pérdida de orina" 
            icon={ClipboardDocumentListIcon}
            bgColor="bg-blue-50"
            iconColor="text-blue-600"
          >
            <div className="space-y-3">
              <p className="text-sm text-gray-600 mb-4">¿Con qué frecuencia pierde orina?</p>
              <div className="space-y-3">
                {[
                  { label: "Nunca", value: "0" },
                  { label: "Una vez a la semana", value: "1" },
                  { label: "2-3 veces/semana", value: "2" },
                  { label: "Una vez al día", value: "3" },
                  { label: "Varias veces al día", value: "4" },
                  { label: "Continuamente", value: "5" },
                ].map(opt => (
                  <label key={opt.value} className="flex items-center gap-3 p-3 bg-white border border-blue-200 rounded-xl hover:bg-blue-50 transition-colors cursor-pointer">
                    <input
                      type="radio"
                      name="icicq_frecuencia"
                      value={opt.value}
                      checked={formulario.icicq_frecuencia === opt.value}
                      onChange={handleChange}
                      className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">{opt.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </Section>

          {/* Pregunta 2 - Cantidad */}
          <Section 
            title="Pregunta 2: Cantidad de orina" 
            icon={ScaleIcon}
            bgColor="bg-green-50"
            iconColor="text-green-600"
          >
            <div className="space-y-3">
              <p className="text-sm text-gray-600 mb-4">¿Cantidad de orina que cree que se le escapa?</p>
              <div className="space-y-3">
                {[
                  { label: "No se me escapa nada", value: "0" },
                  { label: "Muy poca cantidad", value: "2" },
                  { label: "Una cantidad moderada", value: "4" },
                  { label: "Mucha cantidad", value: "6" },
                ].map(opt => (
                  <label key={opt.value} className="flex items-center gap-3 p-3 bg-white border border-green-200 rounded-xl hover:bg-green-50 transition-colors cursor-pointer">
                    <input
                      type="radio"
                      name="icicq_cantidad"
                      value={opt.value}
                      checked={formulario.icicq_cantidad === opt.value}
                      onChange={handleChange}
                      className="h-4 w-4 text-green-600 border-gray-300 focus:ring-green-500"
                    />
                    <span className="text-sm text-gray-700">{opt.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </Section>

          {/* Pregunta 3 - Impacto */}
          <Section 
            title="Pregunta 3: Impacto en la vida diaria" 
            icon={ExclamationTriangleIcon}
            bgColor="bg-purple-50"
            iconColor="text-purple-600"
          >
            <div className="space-y-4">
              <p className="text-sm text-gray-600 mb-4">¿En qué medida estos escapes de orina han afectado su vida diaria?</p>
              
              <div className="bg-white p-4 rounded-xl border border-purple-200">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm text-gray-600 font-medium">Nada</span>
                  <span className="text-sm text-gray-600 font-medium">Mucho</span>
                </div>
                
                <div className="flex items-center justify-between gap-1">
                  {[1,2,3,4,5,6,7,8,9,10].map(num => (
                    <label key={num} className="flex flex-col items-center gap-1 cursor-pointer">
                      <input
                        type="radio"
                        name="icicq_impacto"
                        value={num}
                        checked={formulario.icicq_impacto === String(num)}
                        onChange={handleChange}
                        className="h-4 w-4 text-purple-600 border-gray-300 focus:ring-purple-500"
                      />
                      <span className="text-xs font-medium text-gray-700 bg-purple-100 px-2 py-1 rounded-full">{num}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </Section>

          {/* Pregunta 4 - Situaciones */}
          <Section 
            title="Pregunta 4: Situaciones de pérdida de orina" 
            icon={QuestionMarkCircleIcon}
            bgColor="bg-amber-50"
            iconColor="text-amber-600"
          >
            <div className="space-y-3">
              <p className="text-sm text-gray-600 mb-4">¿Cuándo pierde orina? (Señale todo lo que le pasa a Ud.)</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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
                  <label key={item} className="flex items-center gap-3 p-3 bg-white border border-amber-200 rounded-xl hover:bg-amber-50 transition-colors cursor-pointer">
                    <input
                      type="checkbox"
                      name={`icicq_cuando_${item.toLowerCase().replace(/[^a-z0-9]/g, "_")}`}
                      checked={formulario[`icicq_cuando_${item.toLowerCase().replace(/[^a-z0-9]/g, "_")}`] || false}
                      onChange={handleChange}
                      className="h-4 w-4 text-amber-600 border-gray-300 rounded focus:ring-amber-500"
                    />
                    <span className="text-sm text-gray-700">{item}</span>
                  </label>
                ))}
              </div>
            </div>
          </Section>

          <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={pasoAnterior}
              className="flex items-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition-all duration-200 shadow-sm hover:shadow-md"
            >
              <svg className="w-5 h-5 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              Anterior
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium rounded-xl transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
              Siguiente
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}