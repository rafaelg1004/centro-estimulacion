import React, { useCallback } from "react";
import { 
  UserIcon,
  EyeIcon
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

export default function Paso9EvaluacionFisioterapeutica({ formulario, setFormulario, siguientePaso, pasoAnterior }) {
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
            Paso 9: Evaluación Fisioterapéutica
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
          {/* Evaluación Fisioterapéutica */}
          <Section 
            title="Evaluación Fisioterapéutica" 
            icon={UserIcon}
            bgColor="bg-indigo-50"
            iconColor="text-indigo-600"
          >
            <div className="space-y-6">
              {/* Marcha y Postura */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Marcha</label>
                  <textarea
                    name="marcha"
                    value={formulario.marcha || ""}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm hover:border-gray-300 resize-none"
                    placeholder="Evaluación de la marcha del paciente..."
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Postura (L3- Ombligo)</label>
                  <textarea
                    name="postura"
                    value={formulario.postura || ""}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm hover:border-gray-300 resize-none"
                    placeholder="Evaluación postural del paciente..."
                  />
                </div>
              </div>

              {/* Diafragmas */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Diafragma Orofaríngeo</label>
                  <textarea
                    name="diafragmaOrofaringeo"
                    value={formulario.diafragmaOrofaringeo || ""}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm hover:border-gray-300 resize-none"
                    placeholder="ATM, MORDIDA, MASTICACIÓN, AFONÍA, BRUXISMO, FLEXORES DE CUELLO, PECTORALES"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Diafragma Torácico</label>
                  <textarea
                    name="diafragmaToracico"
                    value={formulario.diafragmaToracico || ""}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm hover:border-gray-300 resize-none"
                    placeholder="Evaluación del diafragma torácico..."
                  />
                </div>
              </div>

              {/* Testing Centro Frénico */}
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700">Testing Centro Frénico</label>
                <div className="flex flex-wrap gap-3">
                  {[8,9,10,11,12,1,2,3,4].map(num => (
                    <label key={num} className="flex items-center gap-2 p-3 bg-white border border-indigo-200 rounded-xl hover:bg-indigo-50 transition-colors cursor-pointer">
                      <input
                        type="checkbox"
                        name={`testingCentroFrenico_${num}`}
                        checked={formulario[`testingCentroFrenico_${num}`] || false}
                        onChange={handleChange}
                        className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                      />
                      <span className="text-sm font-medium text-gray-700">{num}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Testing Adicionales */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Testing de Pilares</label>
                  <input
                    type="text"
                    name="testingPilares"
                    value={formulario.testingPilares || ""}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm hover:border-gray-300"
                    placeholder="Resultado del testing de pilares"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Testing de Traslación Arco Costal</label>
                  <input
                    type="text"
                    name="testingArcoCostal"
                    value={formulario.testingArcoCostal || ""}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm hover:border-gray-300"
                    placeholder="Resultado del testing de arco costal"
                  />
                </div>
              </div>

              {/* Diafragma Pélvico */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Diafragma Pélvico</label>
                <input
                  type="text"
                  name="diafragmaPelvico"
                  value={formulario.diafragmaPelvico || ""}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm hover:border-gray-300"
                  placeholder="Evaluación del diafragma pélvico"
                />
              </div>

              {/* Tipo de Pelvis */}
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700">Tipo de Pelvis</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {["Ginecoide", "Platipelóide (más ancha)", "Androide", "Antropoide (más alta)"].map((item) => (
                    <label key={item} className="flex items-center gap-2 p-3 bg-white border border-indigo-200 rounded-xl hover:bg-indigo-50 transition-colors cursor-pointer">
                      <input
                        type="radio"
                        name="tipoPelvis"
                        value={item}
                        checked={formulario.tipoPelvis === item}
                        onChange={handleChange}
                        className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                      />
                      <span className="text-sm text-gray-700">{item}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Abdomen y Diastasis */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Abdomen (Test de Tos)</label>
                  <input
                    type="text"
                    name="abdomenTestTos"
                    value={formulario.abdomenTestTos || ""}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm hover:border-gray-300"
                    placeholder="Resultado del test de tos"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Diástasis</label>
                  <input
                    type="text"
                    name="diastasis"
                    value={formulario.diastasis || ""}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm hover:border-gray-300"
                    placeholder="Medición de la diástasis"
                  />
                </div>
              </div>

              {/* Mediciones específicas */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Supraumbilical</label>
                  <input
                    type="text"
                    name="supraumbilical"
                    value={formulario.supraumbilical || ""}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm hover:border-gray-300"
                    placeholder="3 cm arriba ombligo"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Umbilical</label>
                  <input
                    type="text"
                    name="umbilical"
                    value={formulario.umbilical || ""}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm hover:border-gray-300"
                    placeholder="A nivel del ombligo"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Infraumbilical</label>
                  <input
                    type="text"
                    name="infraumbilical"
                    value={formulario.infraumbilical || ""}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm hover:border-gray-300"
                    placeholder="2 cm abajo ombligo"
                  />
                </div>
              </div>

              {/* Movilidad */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Movilidad</label>
                <input
                  type="text"
                  name="movilidad"
                  value={formulario.movilidad || ""}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm hover:border-gray-300"
                  placeholder="Psoas – aductor- piramidal- secuencia Extensión cadera- secuencia abducción cadera"
                />
              </div>

              {/* Test Dinámicos */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Test Dinámicos (Art. Sacroilíaca – Sínfisis Púbica)</label>
                <textarea
                  name="testDinamicos"
                  value={formulario.testDinamicos || ""}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm hover:border-gray-300 resize-none"
                  placeholder="Espinas Iliacas Postero Superiores - Cigüeña, Prueba de Derbolowsky, Signo de Piedallu, Distracción Sacroilíaca, Movilidad coxis, Palpación, Piel"
                />
              </div>
            </div>
          </Section>

          {/* Valoración Perineal Externa */}
          <Section 
            title="Valoración Perineal Externa" 
            icon={EyeIcon}
            bgColor="bg-pink-50"
            iconColor="text-pink-600"
          >
            <div className="space-y-6">
              {/* Evaluación básica */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Vulva</label>
                  <input
                    type="text"
                    name="vulva"
                    value={formulario.vulva || ""}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm hover:border-gray-300"
                    placeholder="Descripción del estado vulvar"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Mucosa</label>
                  <input
                    type="text"
                    name="mucosa"
                    value={formulario.mucosa || ""}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm hover:border-gray-300"
                    placeholder="Estado de la mucosa"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Labios (Uno Sobre Otro Por Lo General)</label>
                  <input
                    type="text"
                    name="labios"
                    value={formulario.labios || ""}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm hover:border-gray-300"
                    placeholder="Descripción de los labios"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Lubricación</label>
                  <input
                    type="text"
                    name="lubricacionPerineal"
                    value={formulario.lubricacionPerineal || ""}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm hover:border-gray-300"
                    placeholder="Estado de la lubricación"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Flujo Olor – Color</label>
                  <input
                    type="text"
                    name="flujoOlorColor"
                    value={formulario.flujoOlorColor || ""}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm hover:border-gray-300"
                    placeholder="Características del flujo"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Ph (Epitelio Vaginal)</label>
                  <input
                    type="text"
                    name="phVaginal"
                    value={formulario.phVaginal || ""}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm hover:border-gray-300"
                    placeholder="Menor 5 Sin Atrofia/ 5-5.49 Leve Atrofia/ 5.5-6.49 Moderada Atrofia /6.5 Severa Atrofia"
                  />
                </div>
              </div>

              {/* Vagina */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Vagina</label>
                <input
                  type="text"
                  name="vagina"
                  value={formulario.vagina || ""}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm hover:border-gray-300"
                  placeholder="Estenosada Labios Cerrados - Postparto Abierta"
                />
              </div>

              {/* Diámetro de apertura */}
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700">Diámetro apertura de la vagina/introito</label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {[
                    { label: "Grado 1 (22 a 25mm)", value: "grado1" },
                    { label: "Grado 2 (25 a 30mm)", value: "grado2" },
                    { label: "Grado 3", value: "grado3" }
                  ].map(opt => (
                    <label key={opt.value} className="flex items-center gap-2 p-3 bg-white border border-pink-200 rounded-xl hover:bg-pink-50 transition-colors cursor-pointer">
                      <input
                        type="radio"
                        name="diametroIntroito"
                        value={opt.value}
                        checked={formulario.diametroIntroito === opt.value}
                        onChange={handleChange}
                        className="h-4 w-4 text-pink-600 border-gray-300 focus:ring-pink-500"
                      />
                      <span className="text-sm text-gray-700">{opt.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Evaluación específica */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Clítoris Pequeño – Grande</label>
                  <input
                    type="text"
                    name="clitoris"
                    value={formulario.clitoris || ""}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm hover:border-gray-300"
                    placeholder="Tamaño del clítoris"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Destapar Capuchón (Dolor)</label>
                  <input
                    type="text"
                    name="capuchonDolor"
                    value={formulario.capuchonDolor || ""}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm hover:border-gray-300"
                    placeholder="Presencia de dolor"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Muevo Vulva Hacia Arriba Clítoris se eleva</label>
                  <input
                    type="text"
                    name="vulvaClitoris"
                    value={formulario.vulvaClitoris || ""}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm hover:border-gray-300"
                    placeholder="Movilidad del clítoris"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Sensibilidad (Cada Lado)</label>
                  <input
                    type="text"
                    name="sensibilidadLados"
                    value={formulario.sensibilidadLados || ""}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm hover:border-gray-300"
                    placeholder="Ilioinginal- Relación con la Cesárea"
                  />
                </div>
              </div>

              {/* Patologías y cicatrices */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Hemorroides – Varices Vulvares</label>
                  <input
                    type="text"
                    name="hemorroidesVarices"
                    value={formulario.hemorroidesVarices || ""}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm hover:border-gray-300"
                    placeholder="Presencia de hemorroides o varices"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Cicatrices: Episiotomía- Desgarro</label>
                  <input
                    type="text"
                    name="cicatrices"
                    value={formulario.cicatrices || ""}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm hover:border-gray-300"
                    placeholder="Presencia de cicatrices"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Cirugías Estéticas: Labioplastia – Asimetría</label>
                  <input
                    type="text"
                    name="cirugiasEsteticas"
                    value={formulario.cirugiasEsteticas || ""}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm hover:border-gray-300"
                    placeholder="Cirugías previas"
                  />
                </div>
              </div>

              {/* Glándulas */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Glándulas De Skene Eyaculación</label>
                  <input
                    type="text"
                    name="glandulasSkene"
                    value={formulario.glandulasSkene || ""}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm hover:border-gray-300"
                    placeholder="Estado de las glándulas de Skene"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Glándulas De Bartolini Lubricación</label>
                  <input
                    type="text"
                    name="glandulasBartolini"
                    value={formulario.glandulasBartolini || ""}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm hover:border-gray-300"
                    placeholder="Estado de las glándulas de Bartolini"
                  />
                </div>
              </div>

              {/* Evaluación anatómica */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Elasticidad de La Orquilla Vulvar</label>
                  <input
                    type="text"
                    name="elasticidadOrquilla"
                    value={formulario.elasticidadOrquilla || ""}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm hover:border-gray-300"
                    placeholder="Elasticidad de la orquilla"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Uretra – Vagina – Ano</label>
                  <input
                    type="text"
                    name="uretraVaginaAno"
                    value={formulario.uretraVaginaAno || ""}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm hover:border-gray-300"
                    placeholder="Evaluación anatómica"
                  />
                </div>
              </div>

              {/* Mediciones */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Distancia Ano-Vulvar (cm)</label>
                  <input
                    type="text"
                    name="distanciaAnoVulvar"
                    value={formulario.distanciaAnoVulvar || ""}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm hover:border-gray-300"
                    placeholder="Distancia en centímetros"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Diámetro Bituberoso</label>
                  <input
                    type="text"
                    name="diametroBituberoso"
                    value={formulario.diametroBituberoso || ""}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm hover:border-gray-300"
                    placeholder="Medición del diámetro"
                  />
                </div>
              </div>

              {/* Núcleo central y contracción */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Núcleo Central Del Periné</label>
                  <input
                    type="text"
                    name="nucleoCentralPerine"
                    value={formulario.nucleoCentralPerine || ""}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm hover:border-gray-300"
                    placeholder="Ascendido- Descendido- Plano"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Contracción y Observar</label>
                  <input
                    type="text"
                    name="contraccionObservar"
                    value={formulario.contraccionObservar || ""}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm hover:border-gray-300"
                    placeholder="Observaciones de la contracción"
                  />
                </div>
              </div>

              {/* Reflejos y síntomas */}
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700">Reflejos y Síntomas</label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <label className="flex items-center gap-2 p-3 bg-white border border-pink-200 rounded-xl hover:bg-pink-50 transition-colors cursor-pointer">
                    <input
                      type="checkbox"
                      name="reflejoTosAno"
                      checked={formulario.reflejoTosAno || false}
                      onChange={handleChange}
                      className="h-4 w-4 text-pink-600 border-gray-300 rounded focus:ring-pink-500"
                    />
                    <span className="text-sm text-gray-700">Reflejo de Tos (Ano Cierra)</span>
                  </label>

                  <label className="flex items-center gap-2 p-3 bg-white border border-pink-200 rounded-xl hover:bg-pink-50 transition-colors cursor-pointer">
                    <input
                      type="checkbox"
                      name="prurito"
                      checked={formulario.prurito || false}
                      onChange={handleChange}
                      className="h-4 w-4 text-pink-600 border-gray-300 rounded focus:ring-pink-500"
                    />
                    <span className="text-sm text-gray-700">Prurito</span>
                  </label>

                  <label className="flex items-center gap-2 p-3 bg-white border border-pink-200 rounded-xl hover:bg-pink-50 transition-colors cursor-pointer">
                    <input
                      type="checkbox"
                      name="escozor"
                      checked={formulario.escozor || false}
                      onChange={handleChange}
                      className="h-4 w-4 text-pink-600 border-gray-300 rounded focus:ring-pink-500"
                    />
                    <span className="text-sm text-gray-700">Escozor</span>
                  </label>
                </div>
              </div>

              {/* Valoración neurológica */}
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700">Valoración neurológica</label>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {[
                    "Reflejo clitorideo", "Reflejo Bulvocavernoso", "Reflejo Anal", "Rolling test",
                    "Maniobra de Valsalva (tos)", "Sensibilidad cutánea", "Signo de tinel interno/externo"
                  ].map((item) => (
                    <label key={item} className="flex items-center gap-2 p-3 bg-white border border-pink-200 rounded-xl hover:bg-pink-50 transition-colors cursor-pointer">
                      <input
                        type="checkbox"
                        name={`valoracionNeuro_${item.toLowerCase().replace(/ /g, "_")}`}
                        checked={formulario[`valoracionNeuro_${item.toLowerCase().replace(/ /g, "_")}`] || false}
                        onChange={handleChange}
                        className="h-4 w-4 text-pink-600 border-gray-300 rounded focus:ring-pink-500"
                      />
                      <span className="text-sm text-gray-700">{item}</span>
                    </label>
                  ))}
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