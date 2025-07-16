import React, { useCallback } from "react";
import { 
  HeartIcon,
  ClockIcon,
  ExclamationCircleIcon,
  ScaleIcon,
  MoonIcon,
  ClipboardDocumentListIcon
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

export default function Paso8DinamicaDefecatoria({ formulario, setFormulario, siguientePaso, pasoAnterior }) {
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
            Paso 8: Dinámica Defecatoria, Sexual, Nutricional, Sueño, Dolor y Exámenes
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
          {/* Dinámica Defecatoria */}
          <Section 
            title="Dinámica Defecatoria" 
            icon={ClockIcon}
            bgColor="bg-blue-50"
            iconColor="text-blue-600"
          >
            <div className="space-y-6">
              {/* Frecuencia */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">No. defecaciones al día</label>
                  <input
                    type="number"
                    name="numDefecacionesDia"
                    value={formulario.numDefecacionesDia || ""}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm hover:border-gray-300"
                    placeholder="Ej: 1"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">No. defecaciones en la noche</label>
                  <input
                    type="number"
                    name="numDefecacionesNoche"
                    value={formulario.numDefecacionesNoche || ""}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm hover:border-gray-300"
                    placeholder="Ej: 0"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">No. defecaciones a la semana</label>
                  <input
                    type="number"
                    name="numDefecacionesSemana"
                    value={formulario.numDefecacionesSemana || ""}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm hover:border-gray-300"
                    placeholder="Ej: 7"
                  />
                </div>
              </div>

              {/* Postura defecatoria */}
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700">Postura defecatoria</label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {["Sedestación Vertical", "Inclinado hacia delante", "Cuclillas"].map((item) => (
                    <label key={item} className="flex items-center gap-2 p-3 bg-white border border-blue-200 rounded-xl hover:bg-blue-50 transition-colors cursor-pointer">
                      <input
                        type="checkbox"
                        name={`posturaDefecatoria_${item.toLowerCase().replace(/ /g, "_")}`}
                        checked={formulario[`posturaDefecatoria_${item.toLowerCase().replace(/ /g, "_")}`] || false}
                        onChange={handleChange}
                        className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">{item}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Forma de defecación */}
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700">Forma de defecación</label>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {[
                    "Normal", "Hiperpresivo", "Dolorosa", "Cortada", "Sensación vaciado incompleto", "Cierre de ano antes de completar vaciado"
                  ].map((item) => (
                    <label key={item} className="flex items-center gap-2 p-3 bg-white border border-blue-200 rounded-xl hover:bg-blue-50 transition-colors cursor-pointer">
                      <input
                        type="checkbox"
                        name={`formaDefecacion_${item.toLowerCase().replace(/ /g, "_")}`}
                        checked={formulario[`formaDefecacion_${item.toLowerCase().replace(/ /g, "_")}`] || false}
                        onChange={handleChange}
                        className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">{item}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Dolor y Escala de Bristol */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Dolor (Tipo – localización)</label>
                  <textarea
                    name="dolorDefecacion"
                    value={formulario.dolorDefecacion || ""}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm hover:border-gray-300 resize-none"
                    placeholder="Describa el tipo y localización del dolor..."
                  />
                </div>

                <div className="space-y-4">
                  <label className="block text-sm font-medium text-gray-700">Escala de Bristol</label>
                  <div className="space-y-2">
                    {[
                      "TIPO 1 - Estreñimiento importante",
                      "TIPO 2 - Ligero estreñimiento",
                      "TIPO 3 - Normal",
                      "TIPO 4 - Normal",
                      "TIPO 5 - Falta de fibra",
                      "TIPO 6 - Ligera diarrea",
                      "TIPO 7 - Diarrea importante"
                    ].map((item, idx) => (
                      <label key={item} className="flex items-center gap-2 p-2 bg-white border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors cursor-pointer">
                        <input
                          type="radio"
                          name="escalaBristol"
                          value={idx + 1}
                          checked={formulario.escalaBristol === String(idx + 1)}
                          onChange={handleChange}
                          className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">{item}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Gases */}
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700">Gases</label>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                  {["Ausentes", "Pocos", "Esporádicos", "Frecuentes", "Diarios", "Constantes"].map((item) => (
                    <label key={item} className="flex items-center gap-2 p-3 bg-white border border-blue-200 rounded-xl hover:bg-blue-50 transition-colors cursor-pointer">
                      <input
                        type="checkbox"
                        name={`gases_${item.toLowerCase()}`}
                        checked={formulario[`gases_${item.toLowerCase()}`] || false}
                        onChange={handleChange}
                        className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">{item}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </Section>

          {/* Dinámica Sexual */}
          <Section 
            title="Dinámica Sexual" 
            icon={HeartIcon}
            bgColor="bg-pink-50"
            iconColor="text-pink-600"
          >
            <div className="space-y-6">
              {/* Lubricación */}
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700">Lubricación</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {["Liquida blanquecina", "Densa Granulada", "Mal olor", "Ausente"].map((item) => (
                    <label key={item} className="flex items-center gap-2 p-3 bg-white border border-pink-200 rounded-xl hover:bg-pink-50 transition-colors cursor-pointer">
                      <input
                        type="checkbox"
                        name={`lubricacion_${item.toLowerCase().replace(/ /g, "_")}`}
                        checked={formulario[`lubricacion_${item.toLowerCase().replace(/ /g, "_")}`] || false}
                        onChange={handleChange}
                        className="h-4 w-4 text-pink-600 border-gray-300 rounded focus:ring-pink-500"
                      />
                      <span className="text-sm text-gray-700">{item}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Orgasmos */}
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700">Orgasmos</label>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {["Ausente", "Orgasmo Único", "Orgasmo Múltiple", "Orgasmo corto", "Orgasmo Doloroso"].map((item) => (
                    <label key={item} className="flex items-center gap-2 p-3 bg-white border border-pink-200 rounded-xl hover:bg-pink-50 transition-colors cursor-pointer">
                      <input
                        type="checkbox"
                        name={`orgasmo_${item.toLowerCase().replace(/ /g, "_")}`}
                        checked={formulario[`orgasmo_${item.toLowerCase().replace(/ /g, "_")}`] || false}
                        onChange={handleChange}
                        className="h-4 w-4 text-pink-600 border-gray-300 rounded focus:ring-pink-500"
                      />
                      <span className="text-sm text-gray-700">{item}</span>
                    </label>
                  ))}
                </div>
              </div>
              {/* Disfunción Orgásmica */}
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700">Disfunción Orgásmica</label>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {[
                    "No siente", "Dolor que inhibe el orgasmo", "no logra Clímax", "No excitación y no resolución", "Frigidez"
                  ].map((item) => (
                    <label key={item} className="flex items-center gap-2 p-3 bg-white border border-pink-200 rounded-xl hover:bg-pink-50 transition-colors cursor-pointer">
                      <input
                        type="checkbox"
                        name={`disfuncionOrgasmica_${item.toLowerCase().replace(/ /g, "_")}`}
                        checked={formulario[`disfuncionOrgasmica_${item.toLowerCase().replace(/ /g, "_")}`] || false}
                        onChange={handleChange}
                        className="h-4 w-4 text-pink-600 border-gray-300 rounded focus:ring-pink-500"
                      />
                      <span className="text-sm text-gray-700">{item}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Campos de texto sexual */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">IU Durante la penetración</label>
                  <textarea
                    name="iuPenetracion"
                    value={formulario.iuPenetracion || ""}
                    onChange={handleChange}
                    rows={2}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm hover:border-gray-300 resize-none"
                    placeholder="Resolución del Orgasmo / Confunde con Squirting / Confunde con Eyaculación Femenina"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Masturbación</label>
                  <input
                    type="text"
                    name="masturbacion"
                    value={formulario.masturbacion || ""}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm hover:border-gray-300"
                    placeholder="Matinal / Tarde / Noche – Manual / Vibración"
                  />
                </div>
              </div>

              {/* Tipo de Relación */}
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700">Tipo de Relación y Dinámica Sexual con la Pareja</label>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {["Conflicto", "Ausencia libido", "Promiscuo", "No tiene pareja", "A distancia"].map((item) => (
                    <label key={item} className="flex items-center gap-2 p-3 bg-white border border-pink-200 rounded-xl hover:bg-pink-50 transition-colors cursor-pointer">
                      <input
                        type="checkbox"
                        name={`dinamicaSexual_${item.toLowerCase().replace(/ /g, "_")}`}
                        checked={formulario[`dinamicaSexual_${item.toLowerCase().replace(/ /g, "_")}`] || false}
                        onChange={handleChange}
                        className="h-4 w-4 text-pink-600 border-gray-300 rounded focus:ring-pink-500"
                      />
                      <span className="text-sm text-gray-700">{item}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Historia Sexual */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Historia Sexual</label>
                <textarea
                  name="historiaSexual"
                  value={formulario.historiaSexual || ""}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm hover:border-gray-300 resize-none"
                  placeholder="Detalles de la historia sexual..."
                />
              </div>

              {/* Factores emocionales */}
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700">Factores emocionales y dolor</label>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                  {[
                    "Conflicto Familiar", "Conflicto Pareja anterior", "Abuso", "Maltrato", "Miedo", "Tabú cultural", "Tabú Religioso", "autoconocimiento"
                  ].map((item) => (
                    <label key={item} className="flex items-center gap-2 p-3 bg-white border border-pink-200 rounded-xl hover:bg-pink-50 transition-colors cursor-pointer">
                      <input
                        type="checkbox"
                        name={`factorEmocional_${item.toLowerCase().replace(/ /g, "_")}`}
                        checked={formulario[`factorEmocional_${item.toLowerCase().replace(/ /g, "_")}`] || false}
                        onChange={handleChange}
                        className="h-4 w-4 text-pink-600 border-gray-300 rounded focus:ring-pink-500"
                      />
                      <span className="text-sm text-gray-700">{item}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Dolor sexual */}
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700">Dolor sexual</label>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
                  {["Dispareunia", "Alodinia", "Hiperalgesia", "Ardor", "Picazón"].map((item) => (
                    <label key={item} className="flex items-center gap-2 p-3 bg-white border border-pink-200 rounded-xl hover:bg-pink-50 transition-colors cursor-pointer">
                      <input
                        type="checkbox"
                        name={`dolorSexual_${item.toLowerCase()}`}
                        checked={formulario[`dolorSexual_${item.toLowerCase()}`] || false}
                        onChange={handleChange}
                        className="h-4 w-4 text-pink-600 border-gray-300 rounded focus:ring-pink-500"
                      />
                      <span className="text-sm text-gray-700">{item}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Campos de dolor específicos */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Relaciones Sexuales</label>
                    <input
                      type="text"
                      name="relacionesSexuales"
                      value={formulario.relacionesSexuales || ""}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm hover:border-gray-300"
                      placeholder="Frecuencia y características"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Dolor en el introito</label>
                    <input
                      type="text"
                      name="dolorIntroito"
                      value={formulario.dolorIntroito || ""}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm hover:border-gray-300"
                      placeholder="Penetración - cede/no cede - permite/no permite"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Dolor al Fondo</label>
                    <input
                      type="text"
                      name="dolorFondo"
                      value={formulario.dolorFondo || ""}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm hover:border-gray-300"
                      placeholder="penetración profunda - dolor abdominal - irradiado"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Dolor irradiado a</label>
                    <input
                      type="text"
                      name="dolorIrradiado"
                      value={formulario.dolorIrradiado || ""}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm hover:border-gray-300"
                      placeholder="vejiga, uretra, vulva, clítoris"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Dolor perineal</label>
                <input
                  type="text"
                  name="dolorPerineal"
                  value={formulario.dolorPerineal || ""}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm hover:border-gray-300"
                  placeholder="Durante excitación / orgasmo / tras relaciones"
                />
              </div>
            </div>
          </Section>

          {/* Dinámica Nutricional */}
          <Section 
            title="Dinámica Nutricional" 
            icon={ScaleIcon}
            bgColor="bg-green-50"
            iconColor="text-green-600"
          >
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Ingesta líquida diaria (litros)</label>
                  <input
                    type="text"
                    name="ingestaLiquida"
                    value={formulario.ingestaLiquida || ""}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm hover:border-gray-300"
                    placeholder="Ej: 2.5 litros"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Tipos de líquidos</label>
                  <input
                    type="text"
                    name="tiposLiquidos"
                    value={formulario.tiposLiquidos || ""}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm hover:border-gray-300"
                    placeholder="Agua, jugos, café, té..."
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Ingestas sólidas al día</label>
                  <input
                    type="text"
                    name="ingestasSolidas"
                    value={formulario.ingestasSolidas || ""}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm hover:border-gray-300"
                    placeholder="Ej: 3-5 comidas"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Tipo de dieta</label>
                  <input
                    type="text"
                    name="tipoDieta"
                    value={formulario.tipoDieta || ""}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm hover:border-gray-300"
                    placeholder="Balanceada, vegetariana, especial..."
                  />
                </div>
              </div>
            </div>
          </Section>

          {/* Dinámica de Sueño */}
          <Section 
            title="Dinámica de Sueño" 
            icon={MoonIcon}
            bgColor="bg-purple-50"
            iconColor="text-purple-600"
          >
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Horario de sueño</label>
                <input
                  type="text"
                  name="horarioSueno"
                  value={formulario.horarioSueno || ""}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm hover:border-gray-300"
                  placeholder="Ej: 10:00 PM - 6:00 AM"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Horas de sueño</label>
                  <input
                    type="text"
                    name="horasSueno"
                    value={formulario.horasSueno || ""}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm hover:border-gray-300"
                    placeholder="Ej: 8 horas"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Sueño continuo</label>
                  <input
                    type="text"
                    name="suenoContinuo"
                    value={formulario.suenoContinuo || ""}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm hover:border-gray-300"
                    placeholder="Sí/No"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Sueño interrumpido</label>
                  <input
                    type="text"
                    name="suenoInterrumpido"
                    value={formulario.suenoInterrumpido || ""}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm hover:border-gray-300"
                    placeholder="Frecuencia/Causas"
                  />
                </div>
              </div>
            </div>
          </Section>

          {/* Dinámica de Dolor */}
          <Section 
            title="Dinámica de Dolor" 
            icon={ExclamationCircleIcon}
            bgColor="bg-red-50"
            iconColor="text-red-600"
          >
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Inicio (constante/ matinal /Tarde /Noche)</label>
                  <input
                    type="text"
                    name="inicioDolor"
                    value={formulario.inicioDolor || ""}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm hover:border-gray-300"
                    placeholder="Constante, matinal, tarde, noche"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Localización</label>
                  <input
                    type="text"
                    name="localizacionDolor"
                    value={formulario.localizacionDolor || ""}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm hover:border-gray-300"
                    placeholder="Ubicación específica del dolor"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Tipo</label>
                  <input
                    type="text"
                    name="tipoDolor"
                    value={formulario.tipoDolor || ""}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm hover:border-gray-300"
                    placeholder="local/ irradiado/ lacerante/ agudo/ punzante /ardiente/ profundo/ sordo / irritante"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Intensidad</label>
                  <input
                    type="text"
                    name="intensidadDolor"
                    value={formulario.intensidadDolor || ""}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm hover:border-gray-300"
                    placeholder="Escala 1-10 o descripción"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Aumenta con</label>
                  <input
                    type="text"
                    name="aumentaCon"
                    value={formulario.aumentaCon || ""}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm hover:border-gray-300"
                    placeholder="Actividades que empeoran el dolor"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Disminuye con</label>
                  <input
                    type="text"
                    name="disminuyeCon"
                    value={formulario.disminuyeCon || ""}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm hover:border-gray-300"
                    placeholder="Actividades que mejoran el dolor"
                  />
                </div>
              </div>
            </div>
          </Section>

          {/* Exámenes */}
          <Section 
            title="Exámenes del Paciente" 
            icon={ClipboardDocumentListIcon}
            bgColor="bg-cyan-50"
            iconColor="text-cyan-600"
          >
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Exámenes que trae el paciente</label>
              <textarea
                name="examenesPaciente"
                value={formulario.examenesPaciente || ""}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm hover:border-gray-300 resize-none"
                placeholder="Describa los exámenes médicos, estudios y resultados que presenta el paciente..."
              />
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