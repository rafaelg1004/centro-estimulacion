import React from "react";

export default function Paso8DinamicaDefecatoria({ formulario, setFormulario, siguientePaso, pasoAnterior }) {
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
          <h3 className="text-xl font-bold text-indigo-700 mb-4">Dinámica Defecatoria</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="number"
              name="numDefecacionesDia"
              value={formulario.numDefecacionesDia || ""}
              onChange={handleChange}
              placeholder="No. defecaciones al día"
              className="px-3 py-2 border border-indigo-200 rounded"
            />
            <input
              type="number"
              name="numDefecacionesNoche"
              value={formulario.numDefecacionesNoche || ""}
              onChange={handleChange}
              placeholder="No. Defecaciones en la noche"
              className="px-3 py-2 border border-indigo-200 rounded"
            />
            <input
              type="number"
              name="numDefecacionesSemana"
              value={formulario.numDefecacionesSemana || ""}
              onChange={handleChange}
              placeholder="No. Defecaciones a la semana"
              className="px-3 py-2 border border-indigo-200 rounded"
            />
          </div>
          <div>
            <label className="font-semibold">Postura defecatoria:</label>
            <div className="flex flex-wrap gap-4 mt-2">
              {["Sedestación Vertical", "Inclinado hacia delante", "Cuclillas"].map((item) => (
                <label key={item} className="flex items-center gap-1">
                  <input
                    type="checkbox"
                    name={`posturaDefecatoria_${item.toLowerCase().replace(/ /g, "_")}`}
                    checked={formulario[`posturaDefecatoria_${item.toLowerCase().replace(/ /g, "_")}`] || false}
                    onChange={handleChange}
                  />
                  {item}
                </label>
              ))}
            </div>
          </div>
          <div>
            <label className="font-semibold">Forma de defecación:</label>
            <div className="flex flex-wrap gap-4 mt-2">
              {[
                "Normal", "Hiperpresivo", "Dolorosa", "Cortada", "Sensación vaciado incompleto", "Cierre de ano antes de completar vaciado"
              ].map((item) => (
                <label key={item} className="flex items-center gap-1">
                  <input
                    type="checkbox"
                    name={`formaDefecacion_${item.toLowerCase().replace(/ /g, "_")}`}
                    checked={formulario[`formaDefecacion_${item.toLowerCase().replace(/ /g, "_")}`] || false}
                    onChange={handleChange}
                  />
                  {item}
                </label>
              ))}
            </div>
          </div>
          <div>
            <label className="font-semibold">Dolor (Tipo – localización):</label>
            <input
              type="text"
              name="dolorDefecacion"
              value={formulario.dolorDefecacion || ""}
              onChange={handleChange}
              className="w-full mt-1 px-3 py-2 border border-indigo-200 rounded"
            />
          </div>
          <div>
            <label className="font-semibold">Escala de Bristol:</label>
            <div className="flex flex-wrap gap-4 mt-2">
              {[
                "TIPO 1 - Estreñimiento importante",
                "TIPO 2 - Ligero estreñimiento",
                "TIPO 3 - Normal",
                "TIPO 4 - Normal",
                "TIPO 5 - Falta de fibra",
                "TIPO 6 - Ligera diarrea",
                "TIPO 7 - Diarrea importante"
              ].map((item, idx) => (
                <label key={item} className="flex items-center gap-1">
                  <input
                    type="radio"
                    name="escalaBristol"
                    value={idx + 1}
                    checked={formulario.escalaBristol === String(idx + 1)}
                    onChange={handleChange}
                  />
                  {item}
                </label>
              ))}
            </div>
          </div>
          <div>
            <label className="font-semibold">Gases:</label>
            <div className="flex flex-wrap gap-4 mt-2">
              {["Ausentes", "Pocos", "Esporádicos", "Frecuentes", "Diarios", "Constantes"].map((item) => (
                <label key={item} className="flex items-center gap-1">
                  <input
                    type="checkbox"
                    name={`gases_${item.toLowerCase()}`}
                    checked={formulario[`gases_${item.toLowerCase()}`] || false}
                    onChange={handleChange}
                  />
                  {item}
                </label>
              ))}
            </div>
          </div>

          {/* Dinámica Sexual */}
          <h3 className="text-xl font-bold text-indigo-700 mb-4">Dinámica Sexual</h3>
          <div>
            <label className="font-semibold">Lubricación:</label>
            <div className="flex flex-wrap gap-4 mt-2">
              {["Liquida blanquecina", "Densa Granulada", "Mal olor", "Ausente"].map((item) => (
                <label key={item} className="flex items-center gap-1">
                  <input
                    type="checkbox"
                    name={`lubricacion_${item.toLowerCase().replace(/ /g, "_")}`}
                    checked={formulario[`lubricacion_${item.toLowerCase().replace(/ /g, "_")}`] || false}
                    onChange={handleChange}
                  />
                  {item}
                </label>
              ))}
            </div>
          </div>
          <div>
            <label className="font-semibold">Orgasmos:</label>
            <div className="flex flex-wrap gap-4 mt-2">
              {["Ausente", "Orgasmo Único", "Orgasmo Múltiple", "Orgasmo corto", "Orgasmo Doloroso"].map((item) => (
                <label key={item} className="flex items-center gap-1">
                  <input
                    type="checkbox"
                    name={`orgasmo_${item.toLowerCase().replace(/ /g, "_")}`}
                    checked={formulario[`orgasmo_${item.toLowerCase().replace(/ /g, "_")}`] || false}
                    onChange={handleChange}
                  />
                  {item}
                </label>
              ))}
            </div>
          </div>
          <div>
            <label className="font-semibold">Disfunción Orgásmica:</label>
            <div className="flex flex-wrap gap-4 mt-2">
              {[
                "No siente", "Dolor que inhibe el orgasmo", "no logra Clímax", "No excitación y no resolución", "Frigidez"
              ].map((item) => (
                <label key={item} className="flex items-center gap-1">
                  <input
                    type="checkbox"
                    name={`disfuncionOrgasmica_${item.toLowerCase().replace(/ /g, "_")}`}
                    checked={formulario[`disfuncionOrgasmica_${item.toLowerCase().replace(/ /g, "_")}`] || false}
                    onChange={handleChange}
                  />
                  {item}
                </label>
              ))}
            </div>
          </div>
          <div>
            <label className="font-semibold">IU Durante la penetración/ Resolución del Orgasmo/ Confunde con Squirting/ Confunde con Eyaculación Femenina:</label>
            <input
              type="text"
              name="iuPenetracion"
              value={formulario.iuPenetracion || ""}
              onChange={handleChange}
              className="w-full mt-1 px-3 py-2 border border-indigo-200 rounded"
            />
          </div>
          <div>
            <label className="font-semibold">Tipo de Relación y Dinámica Sexual con la Pareja:</label>
            <div className="flex flex-wrap gap-4 mt-2">
              {["Conflicto", "Ausencia libido", "Promiscuo", "No tiene pareja", "A distancia"].map((item) => (
                <label key={item} className="flex items-center gap-1">
                  <input
                    type="checkbox"
                    name={`dinamicaSexual_${item.toLowerCase().replace(/ /g, "_")}`}
                    checked={formulario[`dinamicaSexual_${item.toLowerCase().replace(/ /g, "_")}`] || false}
                    onChange={handleChange}
                  />
                  {item}
                </label>
              ))}
            </div>
          </div>
          <div>
            <label className="font-semibold">Masturbación:</label>
            <input
              type="text"
              name="masturbacion"
              value={formulario.masturbacion || ""}
              onChange={handleChange}
              className="w-full mt-1 px-3 py-2 border border-indigo-200 rounded"
              placeholder="Matinal/ Tarde/ Noche – Manual/ Vibración"
            />
          </div>
          <div>
            <label className="font-semibold">Historia Sexual:</label>
            <textarea
              name="historiaSexual"
              value={formulario.historiaSexual || ""}
              onChange={handleChange}
              className="w-full mt-1 px-3 py-2 border border-indigo-200 rounded"
              rows={2}
            />
          </div>
          <div>
            <label className="font-semibold">Factores emocionales y dolor:</label>
            <div className="flex flex-wrap gap-4 mt-2">
              {[
                "Conflicto Familiar", "Conflicto Pareja anterior", "Abuso", "Maltrato", "Miedo", "Tabú cultural", "Tabú Religioso", "autoconocimiento"
              ].map((item) => (
                <label key={item} className="flex items-center gap-1">
                  <input
                    type="checkbox"
                    name={`factorEmocional_${item.toLowerCase().replace(/ /g, "_")}`}
                    checked={formulario[`factorEmocional_${item.toLowerCase().replace(/ /g, "_")}`] || false}
                    onChange={handleChange}
                  />
                  {item}
                </label>
              ))}
            </div>
          </div>
          <div>
            <label className="font-semibold">Dolor sexual:</label>
            <div className="flex flex-wrap gap-4 mt-2">
              {["Dispareunia", "Alodinia", "Hiperalgesia", "Ardor", "Picazón"].map((item) => (
                <label key={item} className="flex items-center gap-1">
                  <input
                    type="checkbox"
                    name={`dolorSexual_${item.toLowerCase()}`}
                    checked={formulario[`dolorSexual_${item.toLowerCase()}`] || false}
                    onChange={handleChange}
                  />
                  {item}
                </label>
              ))}
            </div>
          </div>
          <div>
            <label className="font-semibold">Relaciones Sexuales:</label>
            <input
              type="text"
              name="relacionesSexuales"
              value={formulario.relacionesSexuales || ""}
              onChange={handleChange}
              className="w-full mt-1 px-3 py-2 border border-indigo-200 rounded"
            />
          </div>
          <div>
            <label className="font-semibold">Dolor en el introito:</label>
            <input
              type="text"
              name="dolorIntroito"
              value={formulario.dolorIntroito || ""}
              onChange={handleChange}
              className="w-full mt-1 px-3 py-2 border border-indigo-200 rounded"
              placeholder="Penetración -no cede con la penetración – cede con penetración- no permite Penetración"
            />
          </div>
          <div>
            <label className="font-semibold">Dolor al Fondo:</label>
            <input
              type="text"
              name="dolorFondo"
              value={formulario.dolorFondo || ""}
              onChange={handleChange}
              className="w-full mt-1 px-3 py-2 border border-indigo-200 rounded"
              placeholder="penetración profunda- dolor abdominal- irradiado a ovarios – profundo según la postura"
            />
          </div>
          <div>
            <label className="font-semibold">Dolor irradiado a:</label>
            <input
              type="text"
              name="dolorIrradiado"
              value={formulario.dolorIrradiado || ""}
              onChange={handleChange}
              className="w-full mt-1 px-3 py-2 border border-indigo-200 rounded"
              placeholder="vejiga, uretra, vulva, clítoris, vejiga hiperactiva tras relaciones"
            />
          </div>
          <div>
            <label className="font-semibold">Dolor perineal:</label>
            <input
              type="text"
              name="dolorPerineal"
              value={formulario.dolorPerineal || ""}
              onChange={handleChange}
              className="w-full mt-1 px-3 py-2 border border-indigo-200 rounded"
              placeholder="Durante excitación/ orgasmo / tras relaciones"
            />
          </div>

          {/* Dinámica Nutricional */}
          <h3 className="text-xl font-bold text-indigo-700 mb-4">Dinámica Nutricional</h3>
          <div>
            <label className="font-semibold">Ingesta líquida diaria (litros):</label>
            <input
              type="text"
              name="ingestaLiquida"
              value={formulario.ingestaLiquida || ""}
              onChange={handleChange}
              className="w-full mt-1 px-3 py-2 border border-indigo-200 rounded"
            />
          </div>
          <div>
            <label className="font-semibold">Tipos de líquidos:</label>
            <input
              type="text"
              name="tiposLiquidos"
              value={formulario.tiposLiquidos || ""}
              onChange={handleChange}
              className="w-full mt-1 px-3 py-2 border border-indigo-200 rounded"
            />
          </div>
          <div>
            <label className="font-semibold">Ingestas sólidas al día:</label>
            <input
              type="text"
              name="ingestasSolidas"
              value={formulario.ingestasSolidas || ""}
              onChange={handleChange}
              className="w-full mt-1 px-3 py-2 border border-indigo-200 rounded"
            />
          </div>
          <div>
            <label className="font-semibold">Tipo de dieta:</label>
            <input
              type="text"
              name="tipoDieta"
              value={formulario.tipoDieta || ""}
              onChange={handleChange}
              className="w-full mt-1 px-3 py-2 border border-indigo-200 rounded"
            />
          </div>

          {/* Dinámica de Sueño */}
          <h3 className="text-xl font-bold text-indigo-700 mb-4">Dinámica de Sueño</h3>
          <div>
            <label className="font-semibold">Horario de sueño:</label>
            <input
              type="text"
              name="horarioSueno"
              value={formulario.horarioSueno || ""}
              onChange={handleChange}
              className="w-full mt-1 px-3 py-2 border border-indigo-200 rounded"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              name="horasSueno"
              value={formulario.horasSueno || ""}
              onChange={handleChange}
              placeholder="Horas"
              className="px-3 py-2 border border-indigo-200 rounded"
            />
            <input
              type="text"
              name="suenoContinuo"
              value={formulario.suenoContinuo || ""}
              onChange={handleChange}
              placeholder="Continuo"
              className="px-3 py-2 border border-indigo-200 rounded"
            />
            <input
              type="text"
              name="suenoInterrumpido"
              value={formulario.suenoInterrumpido || ""}
              onChange={handleChange}
              placeholder="Interrumpido"
              className="px-3 py-2 border border-indigo-200 rounded"
            />
          </div>

          {/* Dinámica de Dolor */}
          <h3 className="text-xl font-bold text-indigo-700 mb-4">Dinámica de Dolor</h3>
          <div>
            <label className="font-semibold">Inicio (constante/ matinal /Tarde /Noche):</label>
            <input
              type="text"
              name="inicioDolor"
              value={formulario.inicioDolor || ""}
              onChange={handleChange}
              className="w-full mt-1 px-3 py-2 border border-indigo-200 rounded"
            />
          </div>
          <div>
            <label className="font-semibold">Localización:</label>
            <input
              type="text"
              name="localizacionDolor"
              value={formulario.localizacionDolor || ""}
              onChange={handleChange}
              className="w-full mt-1 px-3 py-2 border border-indigo-200 rounded"
            />
          </div>
          <div>
            <label className="font-semibold">Tipo:</label>
            <input
              type="text"
              name="tipoDolor"
              value={formulario.tipoDolor || ""}
              onChange={handleChange}
              className="w-full mt-1 px-3 py-2 border border-indigo-200 rounded"
              placeholder="local/ irradiado/ lacerante/ agudo/ punzante /ardiente/ profundo/ sordo / irritante"
            />
          </div>
          <div>
            <label className="font-semibold">Intensidad:</label>
            <input
              type="text"
              name="intensidadDolor"
              value={formulario.intensidadDolor || ""}
              onChange={handleChange}
              className="w-full mt-1 px-3 py-2 border border-indigo-200 rounded"
            />
          </div>
          <div>
            <label className="font-semibold">Aumenta con:</label>
            <input
              type="text"
              name="aumentaCon"
              value={formulario.aumentaCon || ""}
              onChange={handleChange}
              className="w-full mt-1 px-3 py-2 border border-indigo-200 rounded"
            />
          </div>
          <div>
            <label className="font-semibold">Disminuye con:</label>
            <input
              type="text"
              name="disminuyeCon"
              value={formulario.disminuyeCon || ""}
              onChange={handleChange}
              className="w-full mt-1 px-3 py-2 border border-indigo-200 rounded"
            />
          </div>

          {/* Exámenes */}
          <div>
            <label className="font-semibold">Exámenes que trae el paciente:</label>
            <textarea
              name="examenesPaciente"
              value={formulario.examenesPaciente || ""}
              onChange={handleChange}
              className="w-full mt-1 px-3 py-2 border border-indigo-200 rounded"
              rows={2}
            />
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