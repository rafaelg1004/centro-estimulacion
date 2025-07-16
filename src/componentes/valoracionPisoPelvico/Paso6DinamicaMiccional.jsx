import React, { useCallback } from "react";
import { 
  BeakerIcon, 
  ClockIcon, 
  ExclamationCircleIcon, 
  DocumentTextIcon,
  UserIcon
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



export default function Paso6DinamicaMiccional({ formulario, setFormulario, siguientePaso, pasoAnterior }) {
  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setFormulario((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }, [setFormulario]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-8">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Título principal */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Valoración Piso Pélvico
          </h1>
          <h2 className="text-2xl font-semibold text-gray-700">
            Paso 6: Dinámica Miccional
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
          {/* Información General */}
          <Section 
            title="Información General" 
            icon={UserIcon}
            bgColor="bg-blue-50"
            iconColor="text-blue-600"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Usa de protector / Toalla / Pañal</label>
                <input
                  type="text"
                  name="protectorMiccional"
                  value={formulario.protectorMiccional || ""}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm hover:border-gray-300"
                  placeholder="Tipo de protección utilizada"
                />
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Tipo de Ropa Interior: Material / Tipo</label>
                <input
                  type="text"
                  name="ropaInterior"
                  value={formulario.ropaInterior || ""}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm hover:border-gray-300"
                  placeholder="Material y tipo de ropa interior"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Deseo miccional</label>
                <input
                  type="text"
                  name="deseoMiccional"
                  value={formulario.deseoMiccional || ""}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm hover:border-gray-300"
                  placeholder="Descripción del deseo miccional"
                />
              </div>
            </div>
          </Section>

          {/* Frecuencia Miccional */}
          <Section 
            title="Frecuencia Miccional" 
            icon={ClockIcon}
            bgColor="bg-green-50"
            iconColor="text-green-600"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">N° Micciones al día</label>
                <input
                  type="number"
                  name="numMiccionesDia"
                  value={formulario.numMiccionesDia || ""}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm hover:border-gray-300"
                  placeholder="Ej: 8"
                />
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Cada cuántas horas</label>
                <input
                  type="number"
                  name="cadaCuantasHoras"
                  value={formulario.cadaCuantasHoras || ""}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm hover:border-gray-300"
                  placeholder="Ej: 3"
                />
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">N° Micciones en la noche</label>
                <input
                  type="number"
                  name="numMiccionesNoche"
                  value={formulario.numMiccionesNoche || ""}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm hover:border-gray-300"
                  placeholder="Ej: 1"
                />
              </div>
            </div>
          </Section>

          {/* Características de la Micción */}
          <Section 
            title="Características de la Micción" 
            icon={BeakerIcon}
            bgColor="bg-purple-50"
            iconColor="text-purple-600"
          >
            <div className="space-y-6">
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700">Características de la micción</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {["Normal", "Irritativo", "Urgente", "Doloroso"].map((item) => (
                    <label key={item} className="flex items-center gap-2 p-3 bg-white border border-purple-200 rounded-xl hover:bg-purple-50 transition-colors cursor-pointer">
                      <input
                        type="checkbox"
                        name={`caracMiccion_${item.toLowerCase()}`}
                        checked={formulario[`caracMiccion_${item.toLowerCase()}`] || false}
                        onChange={handleChange}
                        className="h-4 w-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                      />
                      <span className="text-sm text-gray-700">{item}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="text-md font-medium text-gray-800">Sensación de Vaciado</h4>
                  <div className="space-y-3">
                    <label className="flex items-center gap-3 p-3 bg-white border border-purple-200 rounded-xl hover:bg-purple-50 transition-colors cursor-pointer">
                      <input
                        type="checkbox"
                        name="vaciadoCompleto"
                        checked={formulario.vaciadoCompleto || false}
                        onChange={handleChange}
                        className="h-4 w-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                      />
                      <span className="text-sm text-gray-700">Sensación de vaciado completo</span>
                    </label>
                    <label className="flex items-center gap-3 p-3 bg-white border border-purple-200 rounded-xl hover:bg-purple-50 transition-colors cursor-pointer">
                      <input
                        type="checkbox"
                        name="vaciadoIncompleto"
                        checked={formulario.vaciadoIncompleto || false}
                        onChange={handleChange}
                        className="h-4 w-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                      />
                      <span className="text-sm text-gray-700">Sensación de vaciado incompleto</span>
                    </label>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-md font-medium text-gray-800">Postura Miccional</h4>
                  <div className="space-y-3">
                    <label className="flex items-center gap-3 p-3 bg-white border border-purple-200 rounded-xl hover:bg-purple-50 transition-colors cursor-pointer">
                      <input
                        type="checkbox"
                        name="posturaSentado"
                        checked={formulario.posturaSentado || false}
                        onChange={handleChange}
                        className="h-4 w-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                      />
                      <span className="text-sm text-gray-700">Postura miccional sentado</span>
                    </label>
                    <label className="flex items-center gap-3 p-3 bg-white border border-purple-200 rounded-xl hover:bg-purple-50 transition-colors cursor-pointer">
                      <input
                        type="checkbox"
                        name="posturaHiperpresivo"
                        checked={formulario.posturaHiperpresivo || false}
                        onChange={handleChange}
                        className="h-4 w-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                      />
                      <span className="text-sm text-gray-700">Postura miccional hiperpresivo</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700">Forma de micción</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    "Constante", "Cortada", "Lateralizada", "Inclinada anterior", "Explosiva",
                    "Aspersor", "Bifurcada", "Débil"
                  ].map((item) => (
                    <label key={item} className="flex items-center gap-2 p-3 bg-white border border-purple-200 rounded-xl hover:bg-purple-50 transition-colors cursor-pointer">
                      <input
                        type="checkbox"
                        name={`formaMiccion_${item.toLowerCase().replace(/ /g, "_")}`}
                        checked={formulario[`formaMiccion_${item.toLowerCase().replace(/ /g, "_")}`] || false}
                        onChange={handleChange}
                        className="h-4 w-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                      />
                      <span className="text-sm text-gray-700">{item}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <label className="flex items-center gap-3 p-3 bg-white border border-purple-200 rounded-xl hover:bg-purple-50 transition-colors cursor-pointer">
                  <input
                    type="checkbox"
                    name="empujarComenzar"
                    checked={formulario.empujarComenzar || false}
                    onChange={handleChange}
                    className="h-4 w-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                  />
                  <span className="text-sm text-gray-700">Necesita empujar para comenzar</span>
                </label>
                <label className="flex items-center gap-3 p-3 bg-white border border-purple-200 rounded-xl hover:bg-purple-50 transition-colors cursor-pointer">
                  <input
                    type="checkbox"
                    name="empujarTerminar"
                    checked={formulario.empujarTerminar || false}
                    onChange={handleChange}
                    className="h-4 w-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                  />
                  <span className="text-sm text-gray-700">Necesita empujar para terminar</span>
                </label>
              </div>
            </div>
          </Section>

          {/* Incontinencia */}
          <Section 
            title="Tipo de Incontinencia" 
            icon={ExclamationCircleIcon}
            bgColor="bg-red-50"
            iconColor="text-red-600"
          >
            <div className="space-y-6">
              <div className="space-y-4">
                <h4 className="text-md font-medium text-gray-800">Incontinencia de Esfuerzo</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  <label className="flex items-center gap-2 p-3 bg-white border border-red-200 rounded-xl hover:bg-red-50 transition-colors cursor-pointer">
                    <input
                      type="checkbox"
                      name="incontinenciaEsfuerzoRie"
                      checked={formulario.incontinenciaEsfuerzoRie || false}
                      onChange={handleChange}
                      className="h-4 w-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                    />
                    <span className="text-sm text-gray-700">De esfuerzo: ríe</span>
                  </label>
                  <label className="flex items-center gap-2 p-3 bg-white border border-red-200 rounded-xl hover:bg-red-50 transition-colors cursor-pointer">
                    <input
                      type="checkbox"
                      name="incontinenciaEsfuerzoSalta"
                      checked={formulario.incontinenciaEsfuerzoSalta || false}
                      onChange={handleChange}
                      className="h-4 w-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                    />
                    <span className="text-sm text-gray-700">salta</span>
                  </label>
                  <label className="flex items-center gap-2 p-3 bg-white border border-red-200 rounded-xl hover:bg-red-50 transition-colors cursor-pointer">
                    <input
                      type="checkbox"
                      name="incontinenciaEsfuerzoCorre"
                      checked={formulario.incontinenciaEsfuerzoCorre || false}
                      onChange={handleChange}
                      className="h-4 w-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                    />
                    <span className="text-sm text-gray-700">corre</span>
                  </label>
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Otros</label>
                  <input
                    type="text"
                    name="incontinenciaEsfuerzoOtros"
                    value={formulario.incontinenciaEsfuerzoOtros || ""}
                    onChange={handleChange}
                    placeholder="Especifique otros tipos de incontinencia de esfuerzo"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm hover:border-gray-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <label className="flex items-center gap-3 p-4 bg-white border border-red-200 rounded-xl hover:bg-red-50 transition-colors cursor-pointer">
                  <input
                    type="checkbox"
                    name="incontinenciaUrgencia"
                    checked={formulario.incontinenciaUrgencia || false}
                    onChange={handleChange}
                    className="h-5 w-5 text-red-600 border-gray-300 rounded focus:ring-red-500"
                  />
                  <span className="text-sm font-medium text-gray-700">De Urgencia</span>
                </label>
                <label className="flex items-center gap-3 p-4 bg-white border border-red-200 rounded-xl hover:bg-red-50 transition-colors cursor-pointer">
                  <input
                    type="checkbox"
                    name="incontinenciaMixta"
                    checked={formulario.incontinenciaMixta || false}
                    onChange={handleChange}
                    className="h-5 w-5 text-red-600 border-gray-300 rounded focus:ring-red-500"
                  />
                  <span className="text-sm font-medium text-gray-700">Mixta</span>
                </label>
              </div>
            </div>
          </Section>

          {/* Dolor */}
          <Section 
            title="Dolor al Orinar" 
            icon={DocumentTextIcon}
            bgColor="bg-amber-50"
            iconColor="text-amber-600"
          >
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Descripción del dolor</label>
              <textarea
                name="dolorOrinar"
                value={formulario.dolorOrinar || ""}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm hover:border-gray-300 resize-none"
                placeholder="Describa el tipo, intensidad y ubicación del dolor..."
              />
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