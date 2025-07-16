import React from "react";
import { UserIcon, PhoneIcon, CalendarDaysIcon, HeartIcon, UserGroupIcon, DocumentTextIcon } from "@heroicons/react/24/outline";

// Función para obtener valores de forma segura para inputs
const getSafeValue = (value) => {
  if (value === null || value === undefined) return '';
  if (typeof value === 'object') return '';
  return String(value);
};

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

// Componente para inputs (fuera del componente principal para evitar re-creación)
const InputField = ({ label, name, type = "text", placeholder, required = false, options = null, readOnly = false, formulario, handleChange }) => {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
        {readOnly && <span className="text-green-600 text-xs ml-2">(Solo lectura)</span>}
      </label>
      {options ? (
        <select
          name={name}
          value={getSafeValue(formulario[name])}
          onChange={handleChange}
          required={required}
          disabled={readOnly}
          className={`w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 shadow-sm hover:border-gray-300 ${
            readOnly ? 'bg-gray-50 text-gray-600 cursor-not-allowed' : 'bg-white'
          }`}
        >
          <option value="">{placeholder}</option>
          {options.map(option => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      ) : type === "textarea" ? (
        <textarea
          name={name}
          value={getSafeValue(formulario[name])}
          onChange={handleChange}
          placeholder={placeholder}
          required={required}
          readOnly={readOnly}
          rows={3}
          className={`w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 shadow-sm hover:border-gray-300 resize-none ${
            readOnly ? 'bg-gray-50 text-gray-600 cursor-not-allowed' : 'bg-white'
          }`}
        />
      ) : (
        <input
          type={type}
          name={name}
          value={getSafeValue(formulario[name])}
          onChange={handleChange}
          placeholder={placeholder}
          required={required}
          readOnly={readOnly}
          className={`w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 shadow-sm hover:border-gray-300 ${
            readOnly ? 'bg-gray-50 text-gray-600 cursor-not-allowed' : 'bg-white'
          }`}
        />
      )}
    </div>
  );
};

export default function Paso1DatosGenerales({ formulario, setFormulario, siguientePaso }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormulario((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Verificar si hay datos del paciente cargados
  const datosPacienteCargados = formulario.nombres || formulario.cedula;

  // Función para renderizar valores de forma segura
  const renderValue = (value) => {
    if (value === null || value === undefined) return '';
    if (typeof value === 'object') return JSON.stringify(value);
    return String(value);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-8">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Header con información del paciente */}
        {datosPacienteCargados && (
          <div className="mb-8 bg-gradient-to-r from-green-400 to-emerald-500 text-white p-6 rounded-2xl shadow-lg">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-white bg-opacity-20 rounded-xl">
                <UserIcon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Datos del paciente cargados</h3>
                <p className="text-green-100">
                  {renderValue(formulario.nombres)} - CC: {renderValue(formulario.cedula)}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Título principal */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Valoración Piso Pélvico
          </h1>
          <h2 className="text-2xl font-semibold text-gray-700">
            Paso 1: Datos Generales
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 mx-auto mt-4 rounded-full"></div>
        </div>

        {/* Información de fecha y hora */}
        <div className="mb-8 bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 text-blue-600 bg-blue-50 rounded-xl">
              <CalendarDaysIcon className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800">Información de la Consulta</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField
              label="Fecha de valoración"
              name="fecha"
              type="date"
              required={true}
              formulario={formulario}
              handleChange={handleChange}
            />
            <InputField
              label="Hora de valoración"
              name="hora"
              type="time"
              required={true}
              formulario={formulario}
              handleChange={handleChange}
            />
          </div>
        </div>

        <form
          onSubmit={e => {
            e.preventDefault();
            siguientePaso();
          }}
          className="space-y-8"
        >
          {/* Datos Personales */}
          <Section 
            title="Datos Personales" 
            icon={UserIcon}
            bgColor="bg-blue-50"
            iconColor="text-blue-600"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              <InputField
                label="Nombres y Apellidos"
                name="nombres"
                placeholder="Ingrese nombres completos"
                required={true}
                readOnly={true}
                formulario={formulario}
                handleChange={handleChange}
              />
              <InputField
                label="Cédula"
                name="cedula"
                placeholder="Número de identificación"
                required={true}
                readOnly={true}
                formulario={formulario}
                handleChange={handleChange}
              />
              <InputField
                label="Género"
                name="genero"
                placeholder="Seleccione género"
                required={true}
                options={["Femenino", "Masculino", "Otro"]}
                readOnly={true}
                formulario={formulario}
                handleChange={handleChange}
              />
              <InputField
                label="Lugar de Nacimiento"
                name="lugarNacimiento"
                placeholder="Ciudad, País"
                readOnly={true}
                formulario={formulario}
                handleChange={handleChange}
              />
              <InputField
                label="Fecha de Nacimiento"
                name="fechaNacimiento"
                type="date"
                required={true}
                readOnly={true}
                formulario={formulario}
                handleChange={handleChange}
              />
              <InputField
                label="Edad"
                name="edad"
                placeholder="Años cumplidos"
                required={true}
                readOnly={true}
                formulario={formulario}
                handleChange={handleChange}
              />
            </div>
          </Section>

          {/* Información de Contacto */}
          <Section 
            title="Información de Contacto" 
            icon={PhoneIcon}
            bgColor="bg-emerald-50"
            iconColor="text-emerald-600"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              <InputField
                label="Estado Civil"
                name="estadoCivil"
                placeholder="Soltero, Casado, etc."
                readOnly={true}
                formulario={formulario}
                handleChange={handleChange}
              />
              <InputField
                label="Dirección"
                name="direccion"
                placeholder="Dirección completa"
                readOnly={true}
                formulario={formulario}
                handleChange={handleChange}
              />
              <InputField
                label="Teléfono"
                name="telefono"
                placeholder="Teléfono fijo"
                readOnly={true}
                formulario={formulario}
                handleChange={handleChange}
              />
              <InputField
                label="Celular"
                name="celular"
                placeholder="Número celular"
                readOnly={true}
                formulario={formulario}
                handleChange={handleChange}
              />
              <InputField
                label="Ocupación"
                name="ocupacion"
                placeholder="Profesión u oficio"
                readOnly={true}
                formulario={formulario}
                handleChange={handleChange}
              />
              <InputField
                label="Nivel Educativo"
                name="nivelEducativo"
                placeholder="Bachillerato, Técnico, etc."
                readOnly={true}
                formulario={formulario}
                handleChange={handleChange}
              />
            </div>
          </Section>

          {/* Información Médica */}
          <Section 
            title="Información Médica" 
            icon={HeartIcon}
            bgColor="bg-rose-50"
            iconColor="text-rose-600"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField
                label="Médico Tratante"
                name="medicoTratante"
                placeholder="Nombre del médico"
                readOnly={true}
                formulario={formulario}
                handleChange={handleChange}
              />
              <InputField
                label="Aseguradora"
                name="aseguradora"
                placeholder="EPS o aseguradora"
                readOnly={true}
                formulario={formulario}
                handleChange={handleChange}
              />
            </div>
          </Section>

          {/* Información del Acompañante */}
          <Section 
            title="Información del Acompañante" 
            icon={UserGroupIcon}
            bgColor="bg-amber-50"
            iconColor="text-amber-600"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField
                label="Nombre del Acompañante"
                name="acompanante"
                placeholder="Nombre completo"
                readOnly={true}
                formulario={formulario}
                handleChange={handleChange}
              />
              <InputField
                label="Teléfono del Acompañante"
                name="telefonoAcompanante"
                placeholder="Número de contacto"
                readOnly={true}
                formulario={formulario}
                handleChange={handleChange}
              />
            </div>
          </Section>

          {/* Datos de Embarazo */}
          <Section 
            title="Datos de Embarazo (si aplica)" 
            icon={HeartIcon}
            bgColor="bg-pink-50"
            iconColor="text-pink-600"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField
                label="Nombre del Bebé"
                name="nombreBebe"
                placeholder="Nombre del bebé"
                readOnly={true}
                formulario={formulario}
                handleChange={handleChange}
              />
              <InputField
                label="Semanas de Gestación"
                name="semanasGestacion"
                placeholder="Número de semanas"
                readOnly={true}
                formulario={formulario}
                handleChange={handleChange}
              />
              <InputField
                label="FUM (Fecha Última Menstruación)"
                name="fum"
                type="date"
                readOnly={true}
                formulario={formulario}
                handleChange={handleChange}
              />
              <InputField
                label="Fecha Probable de Parto"
                name="fechaProbableParto"
                type="date"
                readOnly={true}
                formulario={formulario}
                handleChange={handleChange}
              />
            </div>
          </Section>

          {/* Motivo de Consulta */}
          <Section 
            title="Motivo de Consulta" 
            icon={DocumentTextIcon}
            bgColor="bg-violet-50"
            iconColor="text-violet-600"
          >
            <InputField
              label="Descripción del motivo de consulta"
              name="motivoConsulta"
              type="textarea"
              placeholder="Describe detalladamente el motivo de la consulta..."
              required={true}
              formulario={formulario}
              handleChange={handleChange}
            />
          </Section>

          {/* Botón de continuar */}
          <div className="flex justify-center pt-8">
            <button 
              type="submit" 
              className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold py-4 px-12 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center gap-3"
            >
              <span>Continuar al Siguiente Paso</span>
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
