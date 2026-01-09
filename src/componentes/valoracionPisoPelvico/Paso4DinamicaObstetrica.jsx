import React, { useCallback, useMemo } from "react";
import { DocumentTextIcon, PlusIcon, TrashIcon, HeartIcon, UserGroupIcon } from "@heroicons/react/24/outline";

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
const InputField = ({ label, name, type = "text", placeholder, formulario, handleChange, ...props }) => (
  <div className="space-y-2">
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    <input
      type={type}
      name={name}
      value={(formulario && formulario[name]) || ""}
      onChange={handleChange}
      placeholder={placeholder}
      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm hover:border-gray-300"
      {...props}
    />
  </div>
);

export default function Paso4DinamicaObstetrica({ formulario, setFormulario, siguientePaso, pasoAnterior }) {
  const hijos = useMemo(() => formulario.hijos || [
    { nombre: "", fechaNacimiento: "", peso: "", talla: "", tipoParto: "", semana: "" }
  ], [formulario.hijos]);

  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setFormulario((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }, [setFormulario]);

  const handleHijoChange = useCallback((idx, e) => {
    const { name, value } = e.target;
    const nuevosHijos = hijos.map((h, i) =>
      i === idx ? { ...h, [name]: value } : h
    );
    setFormulario((prev) => ({
      ...prev,
      hijos: nuevosHijos,
    }));
  }, [hijos, setFormulario]);

  const agregarHijo = useCallback(() => {
    setFormulario((prev) => ({
      ...prev,
      hijos: [
        ...(prev.hijos || [
          { nombre: "", fechaNacimiento: "", peso: "", talla: "", tipoParto: "", semana: "" }
        ]),
        { nombre: "", fechaNacimiento: "", peso: "", talla: "", tipoParto: "", semana: "" }
      ],
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
            Paso 4: Dinámica Obstétrica / Ginecológica
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
          {/* Información de Embarazos */}
          <Section 
            title="Información de Embarazos" 
            icon={HeartIcon}
            bgColor="bg-pink-50"
            iconColor="text-pink-600"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <InputField
                label="No. Embarazos"
                name="numEmbarazos"
                type="number"
                formulario={formulario}
                handleChange={handleChange}
              />
              <InputField
                label="No. Abortos"
                name="numAbortos"
                type="number"
                formulario={formulario}
                handleChange={handleChange}
              />
              <InputField
                label="No. Partos Vaginales"
                name="numPartosVaginales"
                type="number"
                formulario={formulario}
                handleChange={handleChange}
              />
              <InputField
                label="No. Cesáreas"
                name="numCesareas"
                type="number"
                formulario={formulario}
                handleChange={handleChange}
              />
            </div>
          </Section>

          {/* Información de Hijos */}
          <Section 
            title="Información de Hijos" 
            icon={UserGroupIcon}
            bgColor="bg-blue-50"
            iconColor="text-blue-600"
          >
            <div className="space-y-6">
              {hijos.map((hijo, idx) => (
                <div key={idx} className="bg-white border border-blue-200 rounded-xl p-6 shadow-sm">
                  <div className="font-semibold mb-4 text-blue-700">Hijo No. {idx + 1}</div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">Nombre bebé</label>
                      <input
                        type="text"
                        name="nombre"
                        value={hijo.nombre}
                        onChange={e => handleHijoChange(idx, e)}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm hover:border-gray-300"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">Fecha Nacimiento</label>
                      <input
                        type="date"
                        name="fechaNacimiento"
                        value={hijo.fechaNacimiento}
                        onChange={e => handleHijoChange(idx, e)}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm hover:border-gray-300"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">Peso</label>
                      <input
                        type="text"
                        name="peso"
                        value={hijo.peso}
                        onChange={e => handleHijoChange(idx, e)}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm hover:border-gray-300"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">Talla</label>
                      <input
                        type="text"
                        name="talla"
                        value={hijo.talla}
                        onChange={e => handleHijoChange(idx, e)}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm hover:border-gray-300"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">Parto/cesárea</label>
                      <input
                        type="text"
                        name="tipoParto"
                        value={hijo.tipoParto}
                        onChange={e => handleHijoChange(idx, e)}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm hover:border-gray-300"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">Semana de gestación</label>
                      <input
                        type="text"
                        name="semana"
                        value={hijo.semana}
                        onChange={e => handleHijoChange(idx, e)}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm hover:border-gray-300"
                      />
                    </div>
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={agregarHijo}
                className="bg-green-100 hover:bg-green-200 text-green-800 font-bold py-2 px-6 rounded-xl transition flex items-center gap-2"
              >
                <PlusIcon className="w-5 h-5" />
                Agregar hijo
              </button>
            </div>
          </Section>

          {/* Información del Embarazo y Parto */}
          <Section 
            title="Información del Embarazo y Parto" 
            icon={DocumentTextIcon}
            bgColor="bg-purple-50"
            iconColor="text-purple-600"
          >
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Actividad física durante la gestación</label>
                <textarea
                  name="actividadFisicaGestacion"
                  value={formulario.actividadFisicaGestacion || ""}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm hover:border-gray-300"
                  rows={3}
                />
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Medicación (Progesterona / Ácido Fólico/ antibiótico / Multivitamínico)</label>
                <textarea
                  name="medicacionGestacion"
                  value={formulario.medicacionGestacion || ""}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm hover:border-gray-300"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Trabajo de Parto - Desarrollo de la Dilatación</label>
                <textarea
                  name="trabajoPartoDilatacion"
                  value={formulario.trabajoPartoDilatacion || ""}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm hover:border-gray-300"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Desarrollo del Expulsivo</label>
                <textarea
                  name="trabajoPartoExpulsivo"
                  value={formulario.trabajoPartoExpulsivo || ""}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm hover:border-gray-300"
                  rows={3}
                />
              </div>

              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700">Técnica de Expulsivo</label>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {[
                    "Kristeller", "Episiotomía sin desgarro", "Episiotomía con desgarro", "Vacuum", "Fórceps", "Espátulas",
                    "Respetado", "Eutócico", "Natural", "Hipopresivo con grupo sinergistas", "Desgarro sin episiotomía"
                  ].map((item) => (
                    <label key={item} className="flex items-center gap-2 p-3 bg-white border border-purple-200 rounded-xl hover:bg-purple-50 transition-colors cursor-pointer">
                      <input
                        type="checkbox"
                        name={`tecnicaExpulsivo_${item.toLowerCase().replace(/ /g, "_")}`}
                        checked={formulario[`tecnicaExpulsivo_${item.toLowerCase().replace(/ /g, "_")}`] || false}
                        onChange={handleChange}
                        className="h-4 w-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                      />
                      <span className="text-sm text-gray-700">{item}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Observaciones</label>
                <textarea
                  name="observacionesDinamica"
                  value={formulario.observacionesDinamica || ""}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm hover:border-gray-300"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Actividad física durante el postparto</label>
                <textarea
                  name="actividadFisicaPostparto"
                  value={formulario.actividadFisicaPostparto || ""}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm hover:border-gray-300"
                  rows={3}
                />
              </div>
            </div>
          </Section>

          {/* Síntomas Postparto */}
          <Section 
            title="Síntomas Postparto" 
            icon={DocumentTextIcon}
            bgColor="bg-red-50"
            iconColor="text-red-600"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <label className="flex items-center gap-3 p-4 bg-white border border-red-200 rounded-xl hover:bg-red-50 transition-colors cursor-pointer">
                  <input
                    type="checkbox"
                    name="incontinenciaUrinaria"
                    checked={formulario.incontinenciaUrinaria || false}
                    onChange={handleChange}
                    className="h-5 w-5 text-red-600 border-gray-300 rounded focus:ring-red-500"
                  />
                  <span className="text-sm font-medium text-gray-700">Episodios de incontinencia urinaria tras el parto</span>
                </label>

                <label className="flex items-center gap-3 p-4 bg-white border border-red-200 rounded-xl hover:bg-red-50 transition-colors cursor-pointer">
                  <input
                    type="checkbox"
                    name="incontinenciaFecal"
                    checked={formulario.incontinenciaFecal || false}
                    onChange={handleChange}
                    className="h-5 w-5 text-red-600 border-gray-300 rounded focus:ring-red-500"
                  />
                  <span className="text-sm font-medium text-gray-700">Incontinencia Fecal</span>
                </label>
              </div>

              <div className="space-y-4">
                <label className="flex items-center gap-3 p-4 bg-white border border-red-200 rounded-xl hover:bg-red-50 transition-colors cursor-pointer">
                  <input
                    type="checkbox"
                    name="gasesVaginales"
                    checked={formulario.gasesVaginales || false}
                    onChange={handleChange}
                    className="h-5 w-5 text-red-600 border-gray-300 rounded focus:ring-red-500"
                  />
                  <span className="text-sm font-medium text-gray-700">Gases vaginales</span>
                </label>

                <label className="flex items-center gap-3 p-4 bg-white border border-red-200 rounded-xl hover:bg-red-50 transition-colors cursor-pointer">
                  <input
                    type="checkbox"
                    name="bultoVaginal"
                    checked={formulario.bultoVaginal || false}
                    onChange={handleChange}
                    className="h-5 w-5 text-red-600 border-gray-300 rounded focus:ring-red-500"
                  />
                  <span className="text-sm font-medium text-gray-700">¿Siente o presenta algún tipo de bulto a nivel vaginal?</span>
                </label>
              </div>
            </div>
          </Section>

          <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={pasoAnterior}
              className="flex items-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition-all duration-200 shadow-sm hover:shadow-md"
            >
              <TrashIcon className="w-5 h-5" />
              Anterior
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium rounded-xl transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
              <DocumentTextIcon className="w-5 h-5" />
              Siguiente
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}