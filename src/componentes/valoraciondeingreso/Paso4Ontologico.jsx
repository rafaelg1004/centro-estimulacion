import React from "react";

const Paso4Ontologico = ({
  formulario,
  handleChange,
  setFormulario,
  setPaso,
  InputField,
}) => (
  <div className="space-y-4">
    <div>
      <h4 className="text-lg font-semibold mb-2 text-indigo-600">
        Desarrollo Ontológico
      </h4>
      {[
        { label: "Control Cefálico", campo: "ControlCefalico" },
        { label: "Rolados", campo: "Rolados" },
        { label: "Sedente", campo: "Sedente" },
        { label: "Gateo", campo: "Gateo" },
        { label: "Bípedo", campo: "Bipedo" },
        { label: "Marcha", campo: "Marcha" },
      ].map(({ label, campo }) => (
        <div key={campo} className="mb-4 border rounded p-4 bg-gray-50">
          <label className="block font-semibold mb-1">{label}</label>
          <div className="flex items-center gap-4 mb-2">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formulario[`ontologico_${campo}_si`] || false}
                onChange={(e) =>
                  setFormulario((prev) => ({
                    ...prev,
                    [`ontologico_${campo}_si`]: e.target.checked,
                  }))
                }
                className="mr-2"
                id={`ontologico_${campo}_si`}
              />
              <span className="ml-1">Sí</span>
            </label>
          </div>
          <InputField
            label="Tiempo"
            name={`tiempo_${campo}`}
            value={formulario[`tiempo_${campo}`] || ""}
            onChange={handleChange}
          />
          <InputField
            label="Observaciones"
            name={`observaciones_${campo}`}
            value={formulario[`observaciones_${campo}`] || ""}
            onChange={handleChange}
          />
        </div>
      ))}
    </div>
    <h3 className="text-xl font-bold text-indigo-600 mb-2">
      Paso 4: Desarrollo Ontológico y Observación General
    </h3>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <InputField
        label="Frecuencia Cardiaca (ppm)"
        name="frecuenciaCardiaca"
        value={formulario.frecuenciaCardiaca || ""}
        onChange={handleChange}
      />
      <InputField
        label="Frecuencia Respiratoria"
        name="frecuenciaRespiratoria"
        value={formulario.frecuenciaRespiratoria || ""}
        onChange={handleChange}
      />
      <InputField
        label="Temperatura"
        name="temperatura"
        value={formulario.temperatura || ""}
        onChange={handleChange}
      />
      <InputField
        label="Tejido Tegumentario"
        name="tejidoTegumentario"
        value={formulario.tejidoTegumentario || ""}
        onChange={handleChange}
      />
      <InputField
        label="Reflejos Osteotendinosos"
        name="reflejosOsteotendinosos"
        value={formulario.reflejosOsteotendinosos || ""}
        onChange={handleChange}
      />
      <InputField
        label="Reflejos Anormales"
        name="reflejosAnormales"
        value={formulario.reflejosAnormales || ""}
        onChange={handleChange}
      />
      <InputField
        label="Reflejos Patológicos"
        name="reflejosPatologicos"
        value={formulario.reflejosPatologicos || ""}
        onChange={handleChange}
      />
      <InputField
        label="Tono Muscular"
        name="tonoMuscular"
        value={formulario.tonoMuscular || ""}
        onChange={handleChange}
      />
      <InputField
        label="Control Motor"
        name="controlMotor"
        value={formulario.controlMotor || ""}
        onChange={handleChange}
      />
      <InputField
        label="Desplazamientos"
        name="desplazamientos"
        value={formulario.desplazamientos || ""}
        onChange={handleChange}
      />
      <InputField
        label="Sensibilidad"
        name="sensibilidad"
        value={formulario.sensibilidad || ""}
        onChange={handleChange}
      />
      <InputField
        label="Perfil Sensorial"
        name="perfilSensorial"
        value={formulario.perfilSensorial || ""}
        onChange={handleChange}
      />
      <InputField
        label="Deformidades o Contracturas"
        name="deformidades"
        value={formulario.deformidades || ""}
        onChange={handleChange}
      />
      <InputField
        label="Aparatos Ortopédicos"
        name="aparatosOrtopedicos"
        value={formulario.aparatosOrtopedicos || ""}
        onChange={handleChange}
      />
    </div>

    <div>
      <label htmlFor="sistemaPulmonar" className="block font-semibold mb-1">
        Sistema Pulmonar
      </label>
      <textarea
        id="sistemaPulmonar"
        name="sistemaPulmonar"
        value={formulario.sistemaPulmonar || ""}
        onChange={handleChange}
        rows={3}
        className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
      />
    </div>

    <div>
      <label htmlFor="problemasAsociados" className="block font-semibold mb-1">
        Problemas Asociados
      </label>
      <textarea
        id="problemasAsociados"
        name="problemasAsociados"
        value={formulario.problemasAsociados || ""}
        onChange={handleChange}
        rows={3}
        className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
      />
    </div>

    <div className="flex justify-between pt-6">
      <button
        type="button"
        onClick={() => setPaso(3)}
        className="bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded"
      >
        Anterior
      </button>
      <button
        type="button"
        onClick={() => setPaso(5)}
        className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded"
      >
        Siguiente
      </button>
    </div>
  </div>
);

export default Paso4Ontologico;