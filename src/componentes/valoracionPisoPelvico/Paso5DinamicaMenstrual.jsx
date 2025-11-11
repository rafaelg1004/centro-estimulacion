import React, { useCallback } from "react";
import { 
  CalendarIcon, 
  HeartIcon, 
  BeakerIcon,
  ShieldCheckIcon,
  UserIcon
} from "@heroicons/react/24/outline";

// Componente Section reutilizable
const Section = ({ title, icon: Icon, children, bgColor = "bg-gray-50", iconColor = "text-gray-600" }) => (
  <div className={`${bgColor} rounded-2xl p-6 shadow-sm border border-gray-100`}>
    <div className="flex items-center gap-3 mb-6">
      <div className={`p-2 rounded-xl bg-white shadow-sm`}>
        <Icon className={`w-6 h-6 ${iconColor}`} />
      </div>
      <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
    </div>
    {children}
  </div>
);

// Componente para inputs (fuera del componente principal para evitar re-creación)
const InputField = ({ label, name, type = "text", placeholder, formulario, handleChange, ...props }) => (
  <div className="space-y-2">
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    <input
      type={type}
      name={name}
      value={(formulario && formulario[name]) || ""}
      onChange={handleChange}
      placeholder={placeholder}
      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm hover:border-gray-300"
      {...props}
    />
  </div>
);

export default function Paso5DinamicaMenstrual({ formulario, setFormulario, siguientePaso, pasoAnterior }) {
  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setFormulario((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }, [setFormulario]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-purple-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-white rounded-3xl shadow-xl p-8 border border-pink-100">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              Paso 5: Dinámica Menstrual
            </h2>
            <p className="text-gray-600 mt-2">Información sobre el ciclo menstrual y salud reproductiva</p>
          </div>

          <form
            onSubmit={e => {
              e.preventDefault();
              siguientePaso();
            }}
            className="space-y-8"
          >
            {/* Información Menstrual */}
            <Section 
              title="Información Menstrual Básica" 
              icon={CalendarIcon}
              bgColor="bg-pink-50"
              iconColor="text-pink-600"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <InputField
                  label="Edad Menarquia"
                  name="edadMenarquia"
                  type="number"
                  placeholder="Años"
                  formulario={formulario}
                  handleChange={handleChange}
                />
                <InputField
                  label="Edad Menopausia"
                  name="edadMenopausia"
                  type="number"
                  placeholder="Años"
                  formulario={formulario}
                  handleChange={handleChange}
                />
                <InputField
                  label="Días de Menstruación"
                  name="diasMenstruacion"
                  type="number"
                  placeholder="Días"
                  formulario={formulario}
                  handleChange={handleChange}
                />
                <InputField
                  label="Intervalo del Período"
                  name="intervaloPeriodo"
                  type="number"
                  placeholder="Días"
                  formulario={formulario}
                  handleChange={handleChange}
                />
              </div>
            </Section>

            {/* Características del Sangrado */}
            <Section 
              title="Características del Sangrado" 
              icon={BeakerIcon}
              bgColor="bg-red-50"
              iconColor="text-red-600"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { key: "caracSangrado_fluido", label: "Fluido" },
                  { key: "caracSangrado_espeso", label: "Espeso" },
                  { key: "caracSangrado_entrecortado", label: "Entrecortado" },
                  { key: "caracSangrado_coágulos", label: "Coágulos" },
                  { key: "caracSangrado_oxidado", label: "Oxidado" },
                  { key: "caracSangrado_olor_sangre", label: "Olor a Sangre" },
                  { key: "caracSangrado_olor_lubricación", label: "Olor a Lubricación" }
                ].map((item) => (
                  <label key={item.key} className="flex items-center gap-3 p-3 bg-white border border-red-200 rounded-xl hover:bg-red-50 transition-colors cursor-pointer">
                    <input
                      type="checkbox"
                      name={item.key}
                      checked={formulario[item.key] || false}
                      onChange={handleChange}
                      className="h-4 w-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                    />
                    <span className="text-sm font-medium text-gray-700">{item.label}</span>
                  </label>
                ))}
              </div>
            </Section>

            {/* Síntomas Menstruales */}
            <Section 
              title="Síntomas Menstruales" 
              icon={HeartIcon}
              bgColor="bg-purple-50"
              iconColor="text-purple-600"
            >
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { key: "sintomaMenstrual_todos_los_días", label: "Todos los días" },
                    { key: "sintomaMenstrual_síndrome_ovulatorio", label: "Síndrome Ovulatorio" },
                    { key: "sintomaMenstrual_síndrome_premenstrual", label: "Síndrome Premenstrual" }
                  ].map((item) => (
                    <label key={item.key} className="flex items-center gap-3 p-3 bg-white border border-purple-200 rounded-xl hover:bg-purple-50 transition-colors cursor-pointer">
                      <input
                        type="checkbox"
                        name={item.key}
                        checked={formulario[item.key] || false}
                        onChange={handleChange}
                        className="h-4 w-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                      />
                      <span className="text-sm font-medium text-gray-700">{item.label}</span>
                    </label>
                  ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Algias del Período</label>
                    <input
                      type="text"
                      name="algiasPeriodo"
                      value={formulario.algiasPeriodo || ""}
                      onChange={handleChange}
                      placeholder="Describir algias"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm hover:border-gray-300"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Observaciones Menstruales</label>
                    <textarea
                      name="observacionesMenstrual"
                      value={formulario.observacionesMenstrual || ""}
                      onChange={handleChange}
                      placeholder="Observaciones adicionales"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm hover:border-gray-300"
                      rows={3}
                    />
                  </div>
                </div>
              </div>
            </Section>

            {/* Productos Menstruales */}
            <Section 
              title="Productos Menstruales" 
              icon={ShieldCheckIcon}
              bgColor="bg-emerald-50"
              iconColor="text-emerald-600"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { key: "productoMenstrual_copa_menstrual", label: "Copa Menstrual" },
                  { key: "productoMenstrual_tampones", label: "Tampones" },
                  { key: "productoMenstrual_compresa_desechable", label: "Compresa Desechable" },
                  { key: "productoMenstrual_compresa_reutilizable", label: "Compresa Reutilizable" },
                  { key: "productoMenstrual_bragas_menstruales", label: "Bragas Menstruales" },
                  { key: "productoMenstrual_anillo_vaginal", label: "Anillo Vaginal" }
                ].map((item) => (
                  <label key={item.key} className="flex items-center gap-3 p-3 bg-white border border-emerald-200 rounded-xl hover:bg-emerald-50 transition-colors cursor-pointer">
                    <input
                      type="checkbox"
                      name={item.key}
                      checked={formulario[item.key] || false}
                      onChange={handleChange}
                      className="h-4 w-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                    />
                    <span className="text-sm font-medium text-gray-700">{item.label}</span>
                  </label>
                ))}
              </div>
            </Section>

            {/* Dolor Menstrual */}
            <Section 
              title="Dolor Menstrual" 
              icon={HeartIcon}
              bgColor="bg-rose-50"
              iconColor="text-rose-600"
            >
              <div className="space-y-6">
                <label className="flex items-center gap-3 p-4 bg-white border border-rose-200 rounded-xl hover:bg-rose-50 transition-colors cursor-pointer">
                  <input
                    type="checkbox"
                    name="dolorMenstrual"
                    checked={formulario.dolorMenstrual || false}
                    onChange={handleChange}
                    className="h-5 w-5 text-rose-600 border-gray-300 rounded focus:ring-rose-500"
                  />
                  <span className="text-sm font-medium text-gray-700">Presenta Dolor Menstrual</span>
                </label>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Ubicación del Dolor</label>
                    <input
                      type="text"
                      name="ubicacionDolorMenstrual"
                      value={formulario.ubicacionDolorMenstrual || ""}
                      onChange={handleChange}
                      placeholder="Describir ubicación"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm hover:border-gray-300"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Factores Perpetuadores</label>
                    <input
                      type="text"
                      name="factoresPerpetuadores"
                      value={formulario.factoresPerpetuadores || ""}
                      onChange={handleChange}
                      placeholder="Qué lo empeora"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm hover:border-gray-300"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Factores Calmantes</label>
                    <input
                      type="text"
                      name="factoresCalmantes"
                      value={formulario.factoresCalmantes || ""}
                      onChange={handleChange}
                      placeholder="Qué lo alivia"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm hover:border-gray-300"
                    />
                  </div>
                </div>
              </div>
            </Section>

            {/* Métodos Anticonceptivos */}
            <Section 
              title="Métodos Anticonceptivos" 
              icon={ShieldCheckIcon}
              bgColor="bg-indigo-50"
              iconColor="text-indigo-600"
            >
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    { key: "anticonceptivo_píldora", label: "Píldora" },
                    { key: "anticonceptivo_diu", label: "DIU" },
                    { key: "anticonceptivo_preservativo", label: "Preservativo" },
                    { key: "anticonceptivo_parches", label: "Parches" },
                    { key: "anticonceptivo_diafragma", label: "Diafragma" },
                    { key: "anticonceptivo_anillo_vaginal", label: "Anillo Vaginal" }
                  ].map((item) => (
                    <label key={item.key} className="flex items-center gap-3 p-3 bg-white border border-indigo-200 rounded-xl hover:bg-indigo-50 transition-colors cursor-pointer">
                      <input
                        type="checkbox"
                        name={item.key}
                        checked={formulario[item.key] || false}
                        onChange={handleChange}
                        className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                      />
                      <span className="text-sm font-medium text-gray-700">{item.label}</span>
                    </label>
                  ))}
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Tipo de Anticonceptivo (Especificar)</label>
                  <input
                    type="text"
                    name="tipoAnticonceptivo"
                    value={formulario.tipoAnticonceptivo || ""}
                    onChange={handleChange}
                    placeholder="Especificar tipo de anticonceptivo"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm hover:border-gray-300"
                  />
                </div>
              </div>
            </Section>
            {/* Fertilidad */}
            <Section 
              title="Fertilidad y Tratamientos" 
              icon={UserIcon}
              bgColor="bg-orange-50"
              iconColor="text-orange-600"
            >
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Intentos de Embarazo</label>
                  <input
                    type="text"
                    name="intentosEmbarazo"
                    value={formulario.intentosEmbarazo || ""}
                    onChange={handleChange}
                    placeholder="Describir intentos de embarazo"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm hover:border-gray-300"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { key: "noMeQuedoEmbarazada", label: "No me quedé embarazada" },
                    { key: "fecundacionInVitro", label: "Fecundación In Vitro" },
                    { key: "tratamientoHormonal", label: "Tratamiento Hormonal" },
                    { key: "inseminacionArtificial", label: "Inseminación Artificial" }
                  ].map((item) => (
                    <label key={item.key} className="flex items-center gap-3 p-3 bg-white border border-orange-200 rounded-xl hover:bg-orange-50 transition-colors cursor-pointer">
                      <input
                        type="checkbox"
                        name={item.key}
                        checked={formulario[item.key] || false}
                        onChange={handleChange}
                        className="h-4 w-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                      />
                      <span className="text-sm font-medium text-gray-700">{item.label}</span>
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
                Anterior
              </button>
              <button
                type="submit"
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white font-medium rounded-xl transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
              >
                Siguiente
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}