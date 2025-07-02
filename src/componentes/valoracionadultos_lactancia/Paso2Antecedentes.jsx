import React from "react";

export default function Paso2Antecedentes({
  formulario,
  handleChange,
  touched,
  pasoCompleto,
  siguiente,
  anterior,
  InputField,
}) {
  return (
    <div>
      <h3 className="text-lg font-bold mb-4 text-indigo-700">Antecedentes</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <InputField label="Hospitalarios" name="hospitalarios" value={formulario.hospitalarios} onChange={handleChange} touched={touched.hospitalarios} required={false} />
        <InputField label="Patológicos" name="patologicos" value={formulario.patologicos} onChange={handleChange} touched={touched.patologicos} required={false} />
        <InputField label="Familiares" name="familiares" value={formulario.familiares} onChange={handleChange} touched={touched.familiares} required={false} />
        <InputField label="Traumáticos" name="traumaticos" value={formulario.traumaticos} onChange={handleChange} touched={touched.traumaticos} required={false} />
        <InputField label="Farmacológicos" name="farmacologicos" value={formulario.farmacologicos} onChange={handleChange} touched={touched.farmacologicos} required={false} />
        <InputField label="Quirúrgicos" name="quirurgicos" value={formulario.quirurgicos} onChange={handleChange} touched={touched.quirurgicos} required={false} />
        <InputField label="Tóxico/alérgicos" name="toxicoAlergicos" value={formulario.toxicoAlergicos} onChange={handleChange} touched={touched.toxicoAlergicos} required={false} />
      </div>
      <h3 className="text-lg font-bold mb-4 text-indigo-700">Obstétricos</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <InputField label="No. Embarazos" name="numEmbarazos" value={formulario.numEmbarazos} onChange={handleChange} touched={touched.numEmbarazos} required={false} />
        <InputField label="No. Abortos" name="numAbortos" value={formulario.numAbortos} onChange={handleChange} touched={touched.numAbortos} required={false} />
        <InputField label="No. Partos Vaginales" name="numPartosVaginales" value={formulario.numPartosVaginales} onChange={handleChange} touched={touched.numPartosVaginales} required={false} />
        <InputField label="Instrumentado" name="instrumentado" value={formulario.instrumentado} onChange={handleChange} touched={touched.instrumentado} required={false} />
        <InputField label="No. de Cesáreas" name="numCesareas" value={formulario.numCesareas} onChange={handleChange} touched={touched.numCesareas} required={false} />
        <InputField label="Fecha" name="fechaObstetrico" type="date" value={formulario.fechaObstetrico} onChange={handleChange} touched={touched.fechaObstetrico} required={false} />
        <InputField label="Peso" name="peso" value={formulario.peso} onChange={handleChange} touched={touched.peso} required={false} />
        <InputField label="Talla" name="talla" value={formulario.talla} onChange={handleChange} touched={touched.talla} required={false} />
        <InputField label="Episiotomía" name="episiotomia" value={formulario.episiotomia} onChange={handleChange} touched={touched.episiotomia} required={false} />
        <InputField label="Desgarro" name="desgarro" value={formulario.desgarro} onChange={handleChange} touched={touched.desgarro} required={false} />
        <InputField label="Espacio entre embarazos" name="espacioEntreEmbarazos" value={formulario.espacioEntreEmbarazos} onChange={handleChange} touched={touched.espacioEntreEmbarazos} required={false} />
        <InputField label="Actividad física (antes/durante/después)" name="actividadFisica" value={formulario.actividadFisica} onChange={handleChange} touched={touched.actividadFisica} required={false} />
      </div>
      <div className="mb-4">
        <label htmlFor="complicaciones" className="block font-semibold mb-1">
          Complicaciones
        </label>
        <textarea
          id="complicaciones"
          name="complicaciones"
          value={formulario.complicaciones}
          onChange={handleChange}
          className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 border-gray-300"
          rows={2}
        />
      </div>
      <h3 className="text-lg font-bold mb-4 text-indigo-700">Ginecológicos</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <InputField label="Cirugías previas" name="cirugiasPrevias" value={formulario.cirugiasPrevias} onChange={handleChange} touched={touched.cirugiasPrevias} required={false} />
        <InputField label="Prolapsos" name="prolapsos" value={formulario.prolapsos} onChange={handleChange} touched={touched.prolapsos} required={false} />
        <InputField label="Hormonales" name="hormonales" value={formulario.hormonales} onChange={handleChange} touched={touched.hormonales} required={false} />
        <InputField label="Anticonceptivos" name="anticonceptivos" value={formulario.anticonceptivos} onChange={handleChange} touched={touched.anticonceptivos} required={false} />
      </div>
      <div className="flex justify-between">
        <button
          type="button"
          className="px-6 py-2 rounded-md text-white font-semibold bg-gray-400 hover:bg-gray-500 transition"
          onClick={anterior}
        >
          Anterior
        </button>
        <button
          type="button"
          className="px-6 py-2 rounded-md text-white font-semibold bg-indigo-600 hover:bg-indigo-700 transition"
          onClick={siguiente}
        >
          Siguiente
        </button>
      </div>
    </div>
  );
}