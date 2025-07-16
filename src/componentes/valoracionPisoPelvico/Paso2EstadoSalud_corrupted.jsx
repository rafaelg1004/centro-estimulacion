import React, { useCallback } from "react";
import { HeartIcon, ScaleIcon, UserIcon, ExclamationTriangleIcon, ClipboardDocumentListIcon } from "@heroicons/react/24/outline";

// Componente para secciones (fuera del componente principal para evitar re-creación)
const Sectio              <div className="space-y-4">
                <InputField
                  label="Otros Fármacos"
                  name="farmacoOtros"
                  placeholder="Otros medicamentos"
                  formulario={formulario}
                  handleChange={handleChange}
                />
                <InputField
                  label="Alergias"
                  name="alergias"
                  placeholder="Alergias conocidas"
                  formulario={formulario}
                  handleChange={handleChange}
                />
                <InputField
                  label="Última Analítica"
                  name="ultimaAnalitica"
                  placeholder="Fecha de última analítica"
                  formulario={formulario}
                  handleChange={handleChange}
                />
              </div>n: Icon, children, bgColor = "bg-indigo-50", iconColor = "text-indigo-600" }) => (
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

// Componente para inputs (fuera del componente principal para evitar re-creación)
const InputField = ({ label, name, type = "text", placeholder, unit = "", formulario, handleChange }) => (
  <div className="space-y-2">
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    <div className="relative">
      <input
        type={type}
        name={name}
        value={(formulario && formulario[name]) || ""}
        onChange={handleChange}
        placeholder={placeholder}
        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm hover:border-gray-300"
      />
      {unit && (
        <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
          {unit}
        </span>
      )}
    </div>
  </div>
);

// Componente para checkboxes (fuera del componente principal para evitar re-creación)
const CheckboxField = ({ label, name, description, formulario, handleChange }) => (
  <div className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
    <input
      type="checkbox"
      id={name}
      name={name}
      checked={(formulario && formulario[name]) || false}
      onChange={handleChange}
      className="mt-0.5 h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
    />
    <div className="flex-1">
      <label htmlFor={name} className="text-sm font-medium text-gray-700 cursor-pointer">
        {label}
      </label>
      {description && (
        <p className="text-xs text-gray-500 mt-1">{description}</p>
      )}
    </div>
  </div>
);

export default function Paso2EstadoSalud({ formulario, setFormulario, siguientePaso, pasoAnterior }) {
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
            Paso 2: Estado de Salud
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
          {/* Signos Vitales */}
          <Section 
            title="Signos Vitales" 
            icon={HeartIcon}
            bgColor="bg-red-50"
            iconColor="text-red-600"
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <InputField
                label="Temperatura"
                name="temperatura"
                placeholder="36.5"
                unit="°C"
                formulario={formulario}
                handleChange={handleChange}
              />
              <InputField
                label="Tensión Arterial"
                name="ta"
                placeholder="120/80"
                unit="mmHg"
                formulario={formulario}
                handleChange={handleChange}
              />
              <InputField
                label="Frecuencia Respiratoria"
                name="fr"
                placeholder="20"
                unit="rpm"
                formulario={formulario}
                handleChange={handleChange}
              />
              <InputField
                label="Frecuencia Cardíaca"
                name="fc"
                placeholder="70"
                unit="lpm"
                formulario={formulario}
                handleChange={handleChange}
              />
            </div>
          </Section>

          {/* Medidas Antropométricas */}
          <Section 
            title="Medidas Antropométricas" 
            icon={ScaleIcon}
            bgColor="bg-green-50"
            iconColor="text-green-600"
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <InputField
                label="Peso Previo"
                name="pesoPrevio"
                placeholder="65"
                unit="kg"
                formulario={formulario}
                handleChange={handleChange}
              />
              <InputField
                label="Peso Actual"
                name="pesoActual"
                placeholder="67"
                unit="kg"
                formulario={formulario}
                handleChange={handleChange}
              />
              <InputField
                label="Talla"
                name="talla"
                placeholder="165"
                unit="cm"
                formulario={formulario}
                handleChange={handleChange}
              />
              <InputField
                label="IMC"
                name="imc"
                placeholder="24.6"
                unit="kg/m²"
                formulario={formulario}
                handleChange={handleChange}
              />
            </div>
          </Section>

          {/* Actividad Física y Observaciones */}
          <Section 
            title="Actividad Física y Estilo de Vida" 
            icon={UserIcon}
            bgColor="bg-blue-50"
            iconColor="text-blue-600"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField
                label="Deporte Actual"
                name="deporteActual"
                placeholder="Tipo de actividad física"
                formulario={formulario}
                handleChange={handleChange}
              />
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Observaciones AVD/Trabajo
                </label>
                <textarea
                  name="observacionesAvd"
                  value={formulario.observacionesAvd || ""}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm hover:border-gray-300 resize-none"
                  placeholder="Actividades de la vida diaria y trabajo..."
                />
              </div>
            </div>

            <div className="mt-6">
              <h4 className="text-md font-medium text-gray-800 mb-4">Actividades de la Vida Diaria</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                <CheckboxField 
                  label="Bipedestación" 
                  name="avd_bipedestación" 
                  formulario={formulario}
                  handleChange={handleChange}
                />
                <CheckboxField 
                  label="Sedestación" 
                  name="avd_sedestación" 
                  formulario={formulario}
                  handleChange={handleChange}
                />
                <CheckboxField 
                  label="Cargas" 
                  name="avd_cargas" 
                  formulario={formulario}
                  handleChange={handleChange}
                />
                <CheckboxField 
                  label="Conducción" 
                  name="avd_conducción" 
                  formulario={formulario}
                  handleChange={handleChange}
                />
                <CheckboxField 
                  label="Marcha" 
                  name="avd_marcha" 
                  formulario={formulario}
                  handleChange={handleChange}
                />
                <CheckboxField 
                  label="Oficina" 
                  name="avd_oficina" 
                  formulario={formulario}
                  handleChange={handleChange}
                />
                <CheckboxField 
                  label="Homeworking" 
                  name="avd_homeworking" 
                  formulario={formulario}
                  handleChange={handleChange}
                />
              </div>
            </div>
          </Section>

          {/* Información Médica */}
          <Section 
            title="Información Médica" 
            icon={ClipboardDocumentListIcon}
            bgColor="bg-purple-50"
            iconColor="text-purple-600"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Información sobre Medicación
                </label>
                <textarea
                  name="infoMedicacion"
                  value={formulario.infoMedicacion || ""}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm hover:border-gray-300 resize-none"
                  placeholder="Medicamentos actuales..."
                />
              </div>
              
              <div className="space-y-4">
                <InputField
                  label="Otros Fármacos"
                  name="farmacoOtros"
                  placeholder="Otros medicamentos"
                />
                <InputField
                  label="Alergias"
                  name="alergias"
                  placeholder="Alergias conocidas"
                />
                <InputField
                  label="Última Analítica"
                  name="ultimaAnalitica"
                  placeholder="Fecha y resultados"
                />
              </div>
            </div>

            <div className="mt-6">
              <h4 className="text-md font-medium text-gray-800 mb-4">Medicación Actual</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                <CheckboxField label="Antihipertensivo" name="farmaco_antihipertensivo" />
                <CheckboxField label="Antidepresivo" name="farmaco_antidepresivo" />
                <CheckboxField label="Ansiolítico" name="farmaco_ansiolítico" />
                <CheckboxField label="Antibiótico" name="farmaco_antibiótico" />
                <CheckboxField label="Vitaminas" name="farmaco_vitaminas" />
                <CheckboxField label="Antioxidantes" name="farmaco_antioxidantes" />
                <CheckboxField label="Complementación Natural" name="farmaco_complementación_natural" />
              </div>
            </div>
          </Section>

          {/* Patologías y Traumatismos */}
          <Section 
            title="Patologías y Traumatismos" 
            icon={ExclamationTriangleIcon}
            bgColor="bg-amber-50"
            iconColor="text-amber-600"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <InputField
                  label="Patología Cardiaca"
                  name="patologiaCardio"
                  placeholder="Enfermedades cardíacas"
                />
                <InputField
                  label="Patología Neurológica"
                  name="patologiaNeuro"
                  placeholder="Enfermedades neurológicas"
                />
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Observaciones Traumáticas
                  </label>
                  <textarea
                    name="observacionesTrauma"
                    value={formulario.observacionesTrauma || ""}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm hover:border-gray-300 resize-none"
                    placeholder="Detalles sobre traumatismos..."
                  />
                </div>
              </div>

              <div>
                <h4 className="text-md font-medium text-gray-800 mb-4">Antecedentes Traumáticos</h4>
                <div className="space-y-2">
                  <CheckboxField label="Accidente de Tráfico" name="trauma_accidente_de_tráfico" />
                  <CheckboxField label="Caída sobre Coxis" name="trauma_caída_sobre_coxis" />
                  <CheckboxField label="Caída sobre Espalda" name="trauma_caída_sobre_espalda" />
                  <CheckboxField label="Golpe Abdominal" name="trauma_golpe_abdominal" />
                  <CheckboxField label="Golpe en la Cabeza" name="trauma_golpe_en_la_cabeza" />
                </div>
              </div>
            </div>
          </Section>

          {/* Botones de navegación */}
          <div className="flex justify-between pt-8">
            <button 
              type="button"
              onClick={pasoAnterior}
              className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-4 px-8 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center gap-3"
            >
              <svg className="w-5 h-5 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              <span>Anterior</span>
            </button>
            
            <button 
              type="submit" 
              className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold py-4 px-8 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center gap-3"
            >
              <span>Continuar</span>
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