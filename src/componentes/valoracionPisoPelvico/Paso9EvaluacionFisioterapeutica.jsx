import React from "react";

export default function Paso9EvaluacionFisioterapeutica({ formulario, setFormulario, siguientePaso, pasoAnterior }) {
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormulario((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-100 via-purple-100 to-green-100">
      <div className="bg-white bg-opacity-90 p-10 rounded-3xl shadow-2xl flex flex-col gap-8 w-full max-w-2xl border border-indigo-100">
        <form
          onSubmit={e => {
            e.preventDefault();
            siguientePaso();
          }}
          className="space-y-8"
        >
          <h3 className="text-xl font-bold text-indigo-700 mb-4">Evaluación Fisioterapéutica</h3>
          <div>
            <label className="font-semibold">Marcha:</label>
            <textarea
              name="marcha"
              value={formulario.marcha || ""}
              onChange={handleChange}
              className="w-full mt-1 px-3 py-2 border border-indigo-200 rounded"
              rows={2}
            />
          </div>
          <div>
            <label className="font-semibold">Postura (L3- Ombligo):</label>
            <textarea
              name="postura"
              value={formulario.postura || ""}
              onChange={handleChange}
              className="w-full mt-1 px-3 py-2 border border-indigo-200 rounded"
              rows={2}
            />
          </div>
          <div>
            <label className="font-semibold">Diafragma Orofaringeo:</label>
            <textarea
              name="diafragmaOrofaringeo"
              value={formulario.diafragmaOrofaringeo || ""}
              onChange={handleChange}
              className="w-full mt-1 px-3 py-2 border border-indigo-200 rounded"
              rows={2}
              placeholder="ATM, MORDIDA, MASTICACION, AFONIA, BRUXISMO, FLEXORES DE CUELLO, PECTORALES"
            />
          </div>
          <div>
            <label className="font-semibold">Diafragma Torácico:</label>
            <textarea
              name="diafragmaToracico"
              value={formulario.diafragmaToracico || ""}
              onChange={handleChange}
              className="w-full mt-1 px-3 py-2 border border-indigo-200 rounded"
              rows={2}
            />
          </div>
          <div>
            <label className="font-semibold">Testing Centro Frénico:</label>
            <div className="flex flex-wrap gap-2 mt-2">
              {[8,9,10,11,12,1,2,3,4].map(num => (
                <label key={num} className="flex items-center gap-1">
                  <input
                    type="checkbox"
                    name={`testingCentroFrenico_${num}`}
                    checked={formulario[`testingCentroFrenico_${num}`] || false}
                    onChange={handleChange}
                  />
                  {num}
                </label>
              ))}
            </div>
          </div>
          <div>
            <label className="font-semibold">Testing de Pilares:</label>
            <input
              type="text"
              name="testingPilares"
              value={formulario.testingPilares || ""}
              onChange={handleChange}
              className="w-full mt-1 px-3 py-2 border border-indigo-200 rounded"
            />
          </div>
          <div>
            <label className="font-semibold">Testing de Traslación Arco Costal:</label>
            <input
              type="text"
              name="testingArcoCostal"
              value={formulario.testingArcoCostal || ""}
              onChange={handleChange}
              className="w-full mt-1 px-3 py-2 border border-indigo-200 rounded"
            />
          </div>
          <div>
            <label className="font-semibold">Diafragma Pélvico:</label>
            <input
              type="text"
              name="diafragmaPelvico"
              value={formulario.diafragmaPelvico || ""}
              onChange={handleChange}
              className="w-full mt-1 px-3 py-2 border border-indigo-200 rounded"
            />
          </div>
          <div>
            <label className="font-semibold">Tipo de Pelvis:</label>
            <div className="flex flex-wrap gap-4 mt-2">
              {["Ginecoide", "Platipelóide (más ancha)", "Androide", "Antropoide (más alta)"].map((item) => (
                <label key={item} className="flex items-center gap-1">
                  <input
                    type="radio"
                    name="tipoPelvis"
                    value={item}
                    checked={formulario.tipoPelvis === item}
                    onChange={handleChange}
                  />
                  {item}
                </label>
              ))}
            </div>
          </div>
          <div>
            <label className="font-semibold">Abdomen (Test de Tos):</label>
            <input
              type="text"
              name="abdomenTestTos"
              value={formulario.abdomenTestTos || ""}
              onChange={handleChange}
              className="w-full mt-1 px-3 py-2 border border-indigo-200 rounded"
            />
          </div>
          <div>
            <label className="font-semibold">Diastasis:</label>
            <input
              type="text"
              name="diastasis"
              value={formulario.diastasis || ""}
              onChange={handleChange}
              className="w-full mt-1 px-3 py-2 border border-indigo-200 rounded"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              name="supraumbilical"
              value={formulario.supraumbilical || ""}
              onChange={handleChange}
              placeholder="Supraumbilical 3 cm arriba ombligo"
              className="px-3 py-2 border border-indigo-200 rounded"
            />
            <input
              type="text"
              name="umbilical"
              value={formulario.umbilical || ""}
              onChange={handleChange}
              placeholder="Umbilical"
              className="px-3 py-2 border border-indigo-200 rounded"
            />
            <input
              type="text"
              name="infraumbilical"
              value={formulario.infraumbilical || ""}
              onChange={handleChange}
              placeholder="Infraumbilical 2 cm abajo ombligo"
              className="px-3 py-2 border border-indigo-200 rounded"
            />
          </div>
          <div>
            <label className="font-semibold">Movilidad:</label>
            <input
              type="text"
              name="movilidad"
              value={formulario.movilidad || ""}
              onChange={handleChange}
              className="w-full mt-1 px-3 py-2 border border-indigo-200 rounded"
              placeholder="Psoas – aductor- piramidal- secuencia Extensión cadera- secuencia abducción cadera"
            />
          </div>
          <div>
            <label className="font-semibold">Test Dinámicos (Art. Sacroilíaca – Sínfisis Púbica):</label>
            <textarea
              name="testDinamicos"
              value={formulario.testDinamicos || ""}
              onChange={handleChange}
              className="w-full mt-1 px-3 py-2 border border-indigo-200 rounded"
              rows={3}
              placeholder="Espinas Iliacas Postero Superiores - Cigüeña, Prueba de Derbolowsky, Signo de Piedallu, Distracción Sacroilíaca, Movilidad coxis, Palpación, Piel"
            />
          </div>

          {/* Valoración Perineal Externa */}
          <h3 className="text-xl font-bold text-indigo-700 mb-4">Valoración Perineal Externa</h3>
          <div>
            <label className="font-semibold">Vulva:</label>
            <input
              type="text"
              name="vulva"
              value={formulario.vulva || ""}
              onChange={handleChange}
              className="w-full mt-1 px-3 py-2 border border-indigo-200 rounded"
            />
          </div>
          <div>
            <label className="font-semibold">Mucosa:</label>
            <input
              type="text"
              name="mucosa"
              value={formulario.mucosa || ""}
              onChange={handleChange}
              className="w-full mt-1 px-3 py-2 border border-indigo-200 rounded"
            />
          </div>
          <div>
            <label className="font-semibold">Labios (Uno Sobre Otro Por Lo General):</label>
            <input
              type="text"
              name="labios"
              value={formulario.labios || ""}
              onChange={handleChange}
              className="w-full mt-1 px-3 py-2 border border-indigo-200 rounded"
            />
          </div>
          <div>
            <label className="font-semibold">Lubricación:</label>
            <input
              type="text"
              name="lubricacionPerineal"
              value={formulario.lubricacionPerineal || ""}
              onChange={handleChange}
              className="w-full mt-1 px-3 py-2 border border-indigo-200 rounded"
            />
          </div>
          <div>
            <label className="font-semibold">Flujo Olor – Color:</label>
            <input
              type="text"
              name="flujoOlorColor"
              value={formulario.flujoOlorColor || ""}
              onChange={handleChange}
              className="w-full mt-1 px-3 py-2 border border-indigo-200 rounded"
            />
          </div>
          <div>
            <label className="font-semibold">Ph (Epitelio Vaginal):</label>
            <input
              type="text"
              name="phVaginal"
              value={formulario.phVaginal || ""}
              onChange={handleChange}
              className="w-full mt-1 px-3 py-2 border border-indigo-200 rounded"
              placeholder="Menor 5 Sin Atrofia/ 5-5.49 Leve Atrofia/ 5.5-6.49 Moderada Atrofia /6.5 Severa Atrofia"
            />
          </div>
          <div>
            <label className="font-semibold">Vagina:</label>
            <input
              type="text"
              name="vagina"
              value={formulario.vagina || ""}
              onChange={handleChange}
              className="w-full mt-1 px-3 py-2 border border-indigo-200 rounded"
              placeholder="Estenosada Labios Cerrados - Postparto Abierta"
            />
          </div>
          <div>
            <label className="font-semibold">Diámetro apertura de la vagina/introito:</label>
            <div className="flex flex-wrap gap-4 mt-2">
              {[
                { label: "Grado 1 (22 a 25mm)", value: "grado1" },
                { label: "Grado 2 (25 a 30mm)", value: "grado2" },
                { label: "Grado 3", value: "grado3" }
              ].map(opt => (
                <label key={opt.value} className="flex items-center gap-1">
                  <input
                    type="radio"
                    name="diametroIntroito"
                    value={opt.value}
                    checked={formulario.diametroIntroito === opt.value}
                    onChange={handleChange}
                  />
                  {opt.label}
                </label>
              ))}
            </div>
          </div>
          <div>
            <label className="font-semibold">Clítoris Pequeño – Grande:</label>
            <input
              type="text"
              name="clitoris"
              value={formulario.clitoris || ""}
              onChange={handleChange}
              className="w-full mt-1 px-3 py-2 border border-indigo-200 rounded"
            />
          </div>
          <div>
            <label className="font-semibold">Destapar Capuchón (Dolor):</label>
            <input
              type="text"
              name="capuchonDolor"
              value={formulario.capuchonDolor || ""}
              onChange={handleChange}
              className="w-full mt-1 px-3 py-2 border border-indigo-200 rounded"
            />
          </div>
          <div>
            <label className="font-semibold">Muevo Vulva Hacia Arriba Clítoris se eleva:</label>
            <input
              type="text"
              name="vulvaClitoris"
              value={formulario.vulvaClitoris || ""}
              onChange={handleChange}
              className="w-full mt-1 px-3 py-2 border border-indigo-200 rounded"
            />
          </div>
          <div>
            <label className="font-semibold">Sensibilidad (Cada Lado):</label>
            <input
              type="text"
              name="sensibilidadLados"
              value={formulario.sensibilidadLados || ""}
              onChange={handleChange}
              className="w-full mt-1 px-3 py-2 border border-indigo-200 rounded"
              placeholder="Ilioinginal- Relación con la Cesárea"
            />
          </div>
          <div>
            <label className="font-semibold">Hemorroides – Varices Vulvares:</label>
            <input
              type="text"
              name="hemorroidesVarices"
              value={formulario.hemorroidesVarices || ""}
              onChange={handleChange}
              className="w-full mt-1 px-3 py-2 border border-indigo-200 rounded"
            />
          </div>
          <div>
            <label className="font-semibold">Cicatrices: Episiotomía- Desgarro:</label>
            <input
              type="text"
              name="cicatrices"
              value={formulario.cicatrices || ""}
              onChange={handleChange}
              className="w-full mt-1 px-3 py-2 border border-indigo-200 rounded"
            />
          </div>
          <div>
            <label className="font-semibold">Cirugías Estéticas: Labioplastia – Asimetría:</label>
            <input
              type="text"
              name="cirugiasEsteticas"
              value={formulario.cirugiasEsteticas || ""}
              onChange={handleChange}
              className="w-full mt-1 px-3 py-2 border border-indigo-200 rounded"
            />
          </div>
          <div>
            <label className="font-semibold">Glándulas De Skene Eyaculación:</label>
            <input
              type="text"
              name="glandulasSkene"
              value={formulario.glandulasSkene || ""}
              onChange={handleChange}
              className="w-full mt-1 px-3 py-2 border border-indigo-200 rounded"
            />
          </div>
          <div>
            <label className="font-semibold">Glándulas De Bartolini Lubricación:</label>
            <input
              type="text"
              name="glandulasBartolini"
              value={formulario.glandulasBartolini || ""}
              onChange={handleChange}
              className="w-full mt-1 px-3 py-2 border border-indigo-200 rounded"
            />
          </div>
          <div>
            <label className="font-semibold">Elasticidad de La Orquilla Vulvar:</label>
            <input
              type="text"
              name="elasticidadOrquilla"
              value={formulario.elasticidadOrquilla || ""}
              onChange={handleChange}
              className="w-full mt-1 px-3 py-2 border border-indigo-200 rounded"
            />
          </div>
          <div>
            <label className="font-semibold">Uretra – Vagina – Ano:</label>
            <input
              type="text"
              name="uretraVaginaAno"
              value={formulario.uretraVaginaAno || ""}
              onChange={handleChange}
              className="w-full mt-1 px-3 py-2 border border-indigo-200 rounded"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              name="distanciaAnoVulvar"
              value={formulario.distanciaAnoVulvar || ""}
              onChange={handleChange}
              placeholder="Distancia Ano-Vulvar (cm)"
              className="px-3 py-2 border border-indigo-200 rounded"
            />
            <input
              type="text"
              name="diametroBituberoso"
              value={formulario.diametroBituberoso || ""}
              onChange={handleChange}
              placeholder="Diámetro Bituberoso"
              className="px-3 py-2 border border-indigo-200 rounded"
            />
          </div>
          <div>
            <label className="font-semibold">Núcleo Central Del Periné:</label>
            <input
              type="text"
              name="nucleoCentralPerine"
              value={formulario.nucleoCentralPerine || ""}
              onChange={handleChange}
              className="w-full mt-1 px-3 py-2 border border-indigo-200 rounded"
              placeholder="Ascendido- Descendido- Plano"
            />
          </div>
          <div>
            <label className="font-semibold">Contracción y Observar:</label>
            <input
              type="text"
              name="contraccionObservar"
              value={formulario.contraccionObservar || ""}
              onChange={handleChange}
              className="w-full mt-1 px-3 py-2 border border-indigo-200 rounded"
            />
          </div>
          <div className="flex flex-wrap gap-6">
            <label className="flex items-center gap-2">
              Reflejo de Tos (Ano Cierra)
              <input
                type="checkbox"
                name="reflejoTosAno"
                checked={formulario.reflejoTosAno || false}
                onChange={handleChange}
              />
            </label>
            <label className="flex items-center gap-2">
              Prurito
              <input
                type="checkbox"
                name="prurito"
                checked={formulario.prurito || false}
                onChange={handleChange}
              />
            </label>
            <label className="flex items-center gap-2">
              Escozor
              <input
                type="checkbox"
                name="escozor"
                checked={formulario.escozor || false}
                onChange={handleChange}
              />
            </label>
          </div>
          <div>
            <label className="font-semibold">Valoración neurológica:</label>
            <div className="flex flex-wrap gap-4 mt-2">
              {[
                "Reflejo clitorideo", "Reflejo Bulvocavernoso", "Reflejo Anal", "Rolling test",
                "Maniobra de Valsalva (tos)", "Sensibilidad cutánea", "Signo de tinel interno/externo"
              ].map((item) => (
                <label key={item} className="flex items-center gap-1">
                  <input
                    type="checkbox"
                    name={`valoracionNeuro_${item.toLowerCase().replace(/ /g, "_")}`}
                    checked={formulario[`valoracionNeuro_${item.toLowerCase().replace(/ /g, "_")}`] || false}
                    onChange={handleChange}
                  />
                  {item}
                </label>
              ))}
            </div>
          </div>
          <div className="flex justify-between mt-6">
            <button
              type="button"
              onClick={pasoAnterior}
              className="bg-gray-300 hover:bg-gray-400 text-black px-6 py-2 rounded font-bold"
            >
              Anterior
            </button>
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded transition"
            >
              Siguiente 
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}