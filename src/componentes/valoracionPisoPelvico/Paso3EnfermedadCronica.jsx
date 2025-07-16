import React, { useCallback } from "react";
import { HeartIcon, ExclamationTriangleIcon, BeakerIcon, DocumentTextIcon } from "@heroicons/react/24/outline";

// Componente para secciones (fuera del componente principal para evitar re-creación)
const Section = ({ title, icon: Icon, children, bgColor = "bg-blue-50", iconColor = "text-blue-600" }) => (
  <div className={`${bgColor} border border-blue-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300`}>
    <div className="flex items-center gap-3 mb-4">
      <div className={`p-2 ${iconColor} bg-white rounded-xl shadow-sm`}>
        <Icon className="w-5 h-5" />
      </div>
      <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
    </div>
    {children}
  </div>
);

// Componente para checkboxes (fuera del componente principal para evitar re-creación)
const CheckboxGroup = ({ title, items, prefix, formulario, handleChange }) => (
  <div>
    <h4 className="text-md font-medium text-gray-700 mb-3">{title}</h4>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
      {items.map((item) => (
        <label key={item} className="flex items-center gap-3 p-3 hover:bg-white rounded-lg transition-colors cursor-pointer border border-transparent hover:border-blue-200">
          <input
            type="checkbox"
            name={`${prefix}_${item.toLowerCase().replace(/ /g, "_")}`}
            checked={(formulario && formulario[`${prefix}_${item.toLowerCase().replace(/ /g, "_")}`]) || false}
            onChange={handleChange}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <span className="text-sm text-gray-700">{item}</span>
        </label>
      ))}
    </div>
  </div>
);

// Componente para textarea (fuera del componente principal para evitar re-creación)
const TextAreaField = ({ label, name, placeholder, rows = 3, formulario, handleChange }) => (
  <div className="space-y-2">
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    <textarea
      name={name}
      value={(formulario && formulario[name]) || ""}
      onChange={handleChange}
      placeholder={placeholder}
      rows={rows}
      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm hover:border-gray-300 resize-none"
    />
  </div>
);

export default function Paso3EnfermedadCronica({ formulario, setFormulario, siguientePaso, pasoAnterior }) {
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
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
            Paso 3: Enfermedad Crónica
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 mx-auto mt-4 rounded-full"></div>
        </div>

        <form
          onSubmit={e => {
            e.preventDefault();
            siguientePaso();
          }}
          className="space-y-8"
        >
          {/* Enfermedades Crónicas */}
          <Section 
            title="Enfermedades Crónicas" 
            icon={HeartIcon}
            bgColor="bg-red-50"
            iconColor="text-red-600"
          >
            <CheckboxGroup
              title="Seleccione las enfermedades crónicas presentes:"
              items={[
                "Diabetes", "Hipotiroidismo", "Hipertiroidismo", "Hipertenso", "Hipercolesterolemia",
                "Asma", "Artrosis", "Osteoporosis", "Hernia cervical", "Hernia dorsal",
                "Hernia lumbar", "Hernia abdominal", "Hernia inguinal"
              ]}
              prefix="cronica"
              formulario={formulario}
              handleChange={handleChange}
            />
            <div className="mt-6">
              <TextAreaField
                label="Observaciones sobre enfermedades crónicas"
                name="observacionesCronica"
                placeholder="Describa detalles adicionales sobre las enfermedades crónicas..."
                formulario={formulario}
                handleChange={handleChange}
              />
            </div>
          </Section>

          {/* ETS */}
          <Section 
            title="Enfermedades de Transmisión Sexual" 
            icon={ExclamationTriangleIcon}
            bgColor="bg-orange-50"
            iconColor="text-orange-600"
          >
            <TextAreaField
              label="Información sobre ETS"
              name="observacionesETS"
              placeholder="Describa cualquier antecedente de enfermedades de transmisión sexual..."
              formulario={formulario}
              handleChange={handleChange}
            />
          </Section>

          {/* Factores Psicológicos */}
          <Section 
            title="Factores Psicológicos" 
            icon={BeakerIcon}
            bgColor="bg-purple-50"
            iconColor="text-purple-600"
          >
            <CheckboxGroup
              title="Factores psicológicos presentes:"
              items={["Duelos", "Ruptura relación"]}
              prefix="psico"
              formulario={formulario}
              handleChange={handleChange}
            />
            <div className="mt-6">
              <TextAreaField
                label="Observaciones psicológicas"
                name="observacionesPsico"
                placeholder="Describa detalles sobre factores psicológicos relevantes..."
                formulario={formulario}
                handleChange={handleChange}
              />
            </div>
          </Section>

          {/* Antecedentes Quirúrgicos */}
          <Section 
            title="Antecedentes Quirúrgicos" 
            icon={BeakerIcon}
            bgColor="bg-green-50"
            iconColor="text-green-600"
          >
            <CheckboxGroup
              title="Cirugías previas:"
              items={[
                "Cirugía torácica", "Cirugía abdominal", "Cirugía pélvica", 
                "Cirugía hernia", "Proceso oncológico"
              ]}
              prefix="qx"
              formulario={formulario}
              handleChange={handleChange}
            />
            <div className="mt-6">
              <TextAreaField
                label="Observaciones quirúrgicas"
                name="observacionesQx"
                placeholder="Describa detalles sobre las cirugías previas..."
                formulario={formulario}
                handleChange={handleChange}
              />
            </div>
          </Section>

          {/* Antecedentes Familiares y Tóxicos */}
          <Section 
            title="Antecedentes Familiares y Hábitos" 
            icon={DocumentTextIcon}
            bgColor="bg-amber-50"
            iconColor="text-amber-600"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <TextAreaField
                label="Antecedentes familiares"
                name="familiares"
                placeholder="Describa enfermedades o condiciones familiares relevantes..."
                formulario={formulario}
                handleChange={handleChange}
              />
              <TextAreaField
                label="Hábitos tóxicos"
                name="toxicos"
                placeholder="Describa consumo de tabaco, alcohol, drogas, etc..."
                formulario={formulario}
                handleChange={handleChange}
              />
            </div>
          </Section>

          {/* Botones de navegación */}
          <div className="flex justify-between items-center pt-8">
            <button 
              type="button" 
              onClick={pasoAnterior}
              className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-8 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span>Anterior</span>
            </button>
            
            <button 
              type="submit" 
              className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold py-3 px-8 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center gap-2"
            >
              <span>Siguiente</span>
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