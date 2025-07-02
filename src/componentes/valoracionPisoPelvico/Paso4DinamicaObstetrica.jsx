import React from "react";

export default function Paso4DinamicaObstetrica({ formulario, setFormulario, siguientePaso, pasoAnterior }) {
  // Por defecto, muestra al menos un hijo
  const hijos = formulario.hijos || [
    { nombre: "", fechaNacimiento: "", peso: "", talla: "", tipoParto: "", semana: "" }
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormulario((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleHijoChange = (idx, e) => {
    const { name, value } = e.target;
    const nuevosHijos = hijos.map((h, i) =>
      i === idx ? { ...h, [name]: value } : h
    );
    setFormulario((prev) => ({
      ...prev,
      hijos: nuevosHijos,
    }));
  };

  const agregarHijo = () => {
    setFormulario((prev) => ({
      ...prev,
      hijos: [
        ...(prev.hijos || [
          { nombre: "", fechaNacimiento: "", peso: "", talla: "", tipoParto: "", semana: "" }
        ]),
        { nombre: "", fechaNacimiento: "", peso: "", talla: "", tipoParto: "", semana: "" }
      ],
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
          <h3 className="text-xl font-bold text-indigo-700 mb-4">Dinámica Obstétrica / Ginecológica</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="number"
              name="numEmbarazos"
              value={formulario.numEmbarazos || ""}
              onChange={handleChange}
              placeholder="No. Embarazos"
              className="px-3 py-2 border border-indigo-200 rounded"
            />
            <input
              type="number"
              name="numAbortos"
              value={formulario.numAbortos || ""}
              onChange={handleChange}
              placeholder="No. Abortos"
              className="px-3 py-2 border border-indigo-200 rounded"
            />
            <input
              type="number"
              name="numPartosVaginales"
              value={formulario.numPartosVaginales || ""}
              onChange={handleChange}
              placeholder="No. Partos Vaginales"
              className="px-3 py-2 border border-indigo-200 rounded"
            />
            <input
              type="number"
              name="numCesareas"
              value={formulario.numCesareas || ""}
              onChange={handleChange}
              placeholder="No. Cesáreas"
              className="px-3 py-2 border border-indigo-200 rounded"
            />
          </div>

          <div className="space-y-6">
            {hijos.map((hijo, idx) => (
              <div key={idx} className="border border-indigo-200 rounded-xl p-4 bg-indigo-50">
                <div className="font-semibold mb-2">Hijo No. {idx + 1}</div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="nombre"
                    value={hijo.nombre}
                    onChange={e => handleHijoChange(idx, e)}
                    placeholder="Nombre bebé"
                    className="px-3 py-2 border border-indigo-200 rounded"
                  />
                  <input
                    type="date"
                    name="fechaNacimiento"
                    value={hijo.fechaNacimiento}
                    onChange={e => handleHijoChange(idx, e)}
                    placeholder="Fecha Nacimiento"
                    className="px-3 py-2 border border-indigo-200 rounded"
                  />
                  <input
                    type="text"
                    name="peso"
                    value={hijo.peso}
                    onChange={e => handleHijoChange(idx, e)}
                    placeholder="Peso"
                    className="px-3 py-2 border border-indigo-200 rounded"
                  />
                  <input
                    type="text"
                    name="talla"
                    value={hijo.talla}
                    onChange={e => handleHijoChange(idx, e)}
                    placeholder="Talla"
                    className="px-3 py-2 border border-indigo-200 rounded"
                  />
                  <input
                    type="text"
                    name="tipoParto"
                    value={hijo.tipoParto}
                    onChange={e => handleHijoChange(idx, e)}
                    placeholder="Parto/cesárea"
                    className="px-3 py-2 border border-indigo-200 rounded"
                  />
                  <input
                    type="text"
                    name="semana"
                    value={hijo.semana}
                    onChange={e => handleHijoChange(idx, e)}
                    placeholder="Semana de gestación"
                    className="px-3 py-2 border border-indigo-200 rounded"
                  />
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={agregarHijo}
              className="bg-green-100 hover:bg-green-200 text-green-800 font-bold py-2 px-6 rounded-xl transition"
            >
              + Agregar hijo
            </button>
          </div>

          <div>
            <label className="font-semibold">Actividad física durante la gestación:</label>
            <textarea
              name="actividadFisicaGestacion"
              value={formulario.actividadFisicaGestacion || ""}
              onChange={handleChange}
              className="w-full mt-1 px-3 py-2 border border-indigo-200 rounded"
              rows={2}
            />
          </div>
          <div>
            <label className="font-semibold">Medicación (Progesterona / Ácido Fólico/ antibiótico / Multivitamínico):</label>
            <textarea
              name="medicacionGestacion"
              value={formulario.medicacionGestacion || ""}
              onChange={handleChange}
              className="w-full mt-1 px-3 py-2 border border-indigo-200 rounded"
              rows={2}
            />
          </div>
          <div>
            <label className="font-semibold">Trabajo de Parto - Desarrollo de la Dilatación:</label>
            <textarea
              name="trabajoPartoDilatacion"
              value={formulario.trabajoPartoDilatacion || ""}
              onChange={handleChange}
              className="w-full mt-1 px-3 py-2 border border-indigo-200 rounded"
              rows={2}
            />
          </div>
          <div>
            <label className="font-semibold">Desarrollo del Expulsivo:</label>
            <textarea
              name="trabajoPartoExpulsivo"
              value={formulario.trabajoPartoExpulsivo || ""}
              onChange={handleChange}
              className="w-full mt-1 px-3 py-2 border border-indigo-200 rounded"
              rows={2}
            />
          </div>
          <div>
            <label className="font-semibold">Técnica de Expulsivo:</label>
            <div className="flex flex-wrap gap-4 mt-2">
              {[
                "Kristeller", "Episiotomía sin desgarro", "Episiotomía con desgarro", "Vacuum", "Fórceps", "Espátulas",
                "Respetado", "Eutócico", "Natural", "Hipopresivo con grupo sinergistas", "Desgarro sin episiotomía"
              ].map((item) => (
                <label key={item} className="flex items-center gap-1">
                  <input
                    type="checkbox"
                    name={`tecnicaExpulsivo_${item.toLowerCase().replace(/ /g, "_")}`}
                    checked={formulario[`tecnicaExpulsivo_${item.toLowerCase().replace(/ /g, "_")}`] || false}
                    onChange={handleChange}
                  />
                  {item}
                </label>
              ))}
            </div>
          </div>
          <div>
            <label className="font-semibold">Observaciones:</label>
            <textarea
              name="observacionesDinamica"
              value={formulario.observacionesDinamica || ""}
              onChange={handleChange}
              className="w-full mt-1 px-3 py-2 border border-indigo-200 rounded"
              rows={2}
            />
          </div>
          <div>
            <label className="font-semibold">Actividad física durante el postparto:</label>
            <textarea
              name="actividadFisicaPostparto"
              value={formulario.actividadFisicaPostparto || ""}
              onChange={handleChange}
              className="w-full mt-1 px-3 py-2 border border-indigo-200 rounded"
              rows={2}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="flex items-center gap-2">
              Episodios de incontinencia urinaria tras el parto:
              <input
                type="checkbox"
                name="incontinenciaUrinaria"
                checked={formulario.incontinenciaUrinaria || false}
                onChange={handleChange}
              /> Sí
            </label>
            <label className="flex items-center gap-2">
              Fecal:
              <input
                type="checkbox"
                name="incontinenciaFecal"
                checked={formulario.incontinenciaFecal || false}
                onChange={handleChange}
              /> Sí
            </label>
            <label className="flex items-center gap-2">
              Gases vaginales:
              <input
                type="checkbox"
                name="gasesVaginales"
                checked={formulario.gasesVaginales || false}
                onChange={handleChange}
              /> Sí
            </label>
            <label className="flex items-center gap-2">
              ¿Siente o presenta algún tipo de bulto a nivel vaginal?
              <input
                type="checkbox"
                name="bultoVaginal"
                checked={formulario.bultoVaginal || false}
                onChange={handleChange}
              /> Sí
            </label>
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