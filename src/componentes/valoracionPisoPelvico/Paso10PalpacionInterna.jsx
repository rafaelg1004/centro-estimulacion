import React, { useCallback } from "react";
import { 
  HandRaisedIcon,
  AdjustmentsHorizontalIcon,
  ScaleIcon,
  ChartBarIcon
} from "@heroicons/react/24/outline";

const opcionesOxford = [
  { value: "0", label: "0/5 Ausencia de contracción." },
  { value: "1", label: "1/5 Contracción muy débil." },
  { value: "2", label: "2/5 Contracción débil." },
  { value: "3", label: "3/5 Contracción moderada, con tensión y mantenida." },
  { value: "4", label: "4/5 Contracción buena. Mantenimiento de la tensión con resistencia." },
  { value: "5", label: "5/5 Contracción fuerte. Mantenimiento de la tensión con fuerte resistencia." },
];

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

export default function Paso10PalpacionInterna({ formulario, setFormulario, siguientePaso, pasoAnterior }) {
  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setFormulario((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }, [setFormulario]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Título principal */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Valoración Piso Pélvico
          </h1>
          <h2 className="text-2xl font-semibold text-gray-700">
            Paso 10: Palpación Interna
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
          {/* Cúpulas */}
          <Section 
            title="Cúpulas" 
            icon={HandRaisedIcon}
            bgColor="bg-blue-50"
            iconColor="text-blue-600"
          >
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">Evaluación de Cúpulas</label>
              <div className="flex gap-6">
                <label className="flex items-center gap-2 p-3 bg-white border border-blue-200 rounded-xl hover:bg-blue-50 transition-colors cursor-pointer">
                  <input
                    type="checkbox"
                    name="cupulaDerecha"
                    checked={(formulario && formulario.cupulaDerecha) || false}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700">Derecha</span>
                </label>
                <label className="flex items-center gap-2 p-3 bg-white border border-blue-200 rounded-xl hover:bg-blue-50 transition-colors cursor-pointer">
                  <input
                    type="checkbox"
                    name="cupulaIzquierda"
                    checked={(formulario && formulario.cupulaIzquierda) || false}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700">Izquierda</span>
                </label>
              </div>
            </div>
          </Section>
          {/* Tono General */}
          <Section 
            title="Tono General" 
            icon={AdjustmentsHorizontalIcon}
            bgColor="bg-green-50"
            iconColor="text-green-600"
          >
            <div className="space-y-6">
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700">Tono General (tracción como estiramiento y veo respuesta)</label>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                  {["Normal", "Aumentado", "Disminuido", "Hipotonía", "Hiperactividad"].map((item) => (
                    <label key={item} className="flex items-center gap-2 p-3 bg-white border border-green-200 rounded-xl hover:bg-green-50 transition-colors cursor-pointer">
                      <input
                        type="radio"
                        name="tonoGeneral"
                        value={item}
                        checked={(formulario && formulario.tonoGeneral) === item}
                        onChange={handleChange}
                        className="h-4 w-4 text-green-600 border-gray-300 focus:ring-green-500"
                      />
                      <span className="text-sm text-gray-700">{item}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Observaciones sobre el tono</label>
                <input
                  type="text"
                  name="tonoObservaciones"
                  value={(formulario && formulario.tonoObservaciones) || ""}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm hover:border-gray-300"
                  placeholder="Observaciones detalladas sobre el tono muscular"
                />
              </div>
            </div>
          </Section>
          {/* Capacidad Contráctil General */}
          <Section 
            title="Capacidad Contráctil General" 
            icon={ScaleIcon}
            bgColor="bg-purple-50"
            iconColor="text-purple-600"
          >
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Capacidad Contráctil General</label>
              <input
                type="text"
                name="capacidadContractil"
                value={(formulario && formulario.capacidadContractil) || ""}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm hover:border-gray-300"
                placeholder="Evaluación de la capacidad contráctil"
              />
            </div>
          </Section>
          {/* Fuerza (Escala de Oxford) */}
          <Section 
            title="Fuerza (Escala de Oxford)" 
            icon={ChartBarIcon}
            bgColor="bg-red-50"
            iconColor="text-red-600"
          >
            <div className="space-y-8">
              {/* Global */}
              <div className="space-y-4">
                <h4 className="text-md font-semibold text-gray-800">Evaluación Global</h4>
                <div className="space-y-3">
                  {opcionesOxford.map(opt => (
                    <label key={opt.value} className="flex items-start gap-3 p-3 bg-white border border-red-200 rounded-xl hover:bg-red-50 transition-colors cursor-pointer">
                      <input
                        type="radio"
                        name="oxfordGlobal"
                        value={opt.value}
                        checked={(formulario && formulario.oxfordGlobal) === opt.value}
                        onChange={handleChange}
                        className="mt-1 h-4 w-4 text-red-600 border-gray-300 focus:ring-red-500"
                      />
                      <span className="text-sm text-gray-700 leading-relaxed">{opt.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Derecha e Izquierda */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Derecha */}
                <div className="space-y-4">
                  <h4 className="text-md font-semibold text-gray-800">Evaluación Derecha</h4>
                  <div className="space-y-2">
                    {opcionesOxford.map(opt => (
                      <label key={opt.value} className="flex items-start gap-2 p-2 bg-white border border-red-200 rounded-lg hover:bg-red-50 transition-colors cursor-pointer">
                        <input
                          type="radio"
                          name="oxfordDerecha"
                          value={opt.value}
                          checked={(formulario && formulario.oxfordDerecha) === opt.value}
                          onChange={handleChange}
                          className="mt-1 h-3 w-3 text-red-600 border-gray-300 focus:ring-red-500"
                        />
                        <span className="text-xs text-gray-700 leading-relaxed">{opt.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Izquierda */}
                <div className="space-y-4">
                  <h4 className="text-md font-semibold text-gray-800">Evaluación Izquierda</h4>
                  <div className="space-y-2">
                    {opcionesOxford.map(opt => (
                      <label key={opt.value} className="flex items-start gap-2 p-2 bg-white border border-red-200 rounded-lg hover:bg-red-50 transition-colors cursor-pointer">
                        <input
                          type="radio"
                          name="oxfordIzquierda"
                          value={opt.value}
                          checked={(formulario && formulario.oxfordIzquierda) === opt.value}
                          onChange={handleChange}
                          className="mt-1 h-3 w-3 text-red-600 border-gray-300 focus:ring-red-500"
                        />
                        <span className="text-xs text-gray-700 leading-relaxed">{opt.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Section>

          {/* Escala PERFECT */}
          <Section 
            title="Escala PERFECT" 
            icon={ChartBarIcon}
            bgColor="bg-amber-50"
            iconColor="text-amber-600"
          >
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">P - Power (Fuerza)</label>
                  <input
                    type="text"
                    name="perfectPower"
                    value={(formulario && formulario.perfectPower) || ""}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm hover:border-gray-300"
                    placeholder="Valorar de 0-5 por Oxford"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">E - Endurance (Resistencia)</label>
                  <input
                    type="text"
                    name="perfectEndurance"
                    value={(formulario && formulario.perfectEndurance) || ""}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm hover:border-gray-300"
                    placeholder="Tiempo manteniendo contracción máxima, sin perder la fuerza"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">R - Repetitions (Repeticiones)</label>
                  <input
                    type="text"
                    name="perfectRepetitions"
                    value={(formulario && formulario.perfectRepetitions) || ""}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm hover:border-gray-300"
                    placeholder="N° de repeticiones posibles, con descanso de 4s"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">F - Fast (Rápidas)</label>
                  <input
                    type="text"
                    name="perfectFast"
                    value={(formulario && formulario.perfectFast) || ""}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm hover:border-gray-300"
                    placeholder="N° de contracciones rápidas tras 1 min de descanso"
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">ECT - Every Contraction Time</label>
                  <input
                    type="text"
                    name="perfectECT"
                    value={(formulario && formulario.perfectECT) || ""}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm hover:border-gray-300"
                    placeholder="N° de contracciones en un tiempo determinado"
                  />
                </div>
              </div>
            </div>
          </Section>

          {/* Botones de navegación */}
          <div className="flex justify-between items-center pt-8">
            <button
              type="button"
              onClick={pasoAnterior}
              className="group relative px-8 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Anterior
              </span>
            </button>
            
            <button
              type="submit"
              className="group relative px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
              <span className="flex items-center gap-2">
                Siguiente
                <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}