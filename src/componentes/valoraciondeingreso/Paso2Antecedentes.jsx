import React from "react";

const Paso2Antecedentes = ({
  formulario,
  handleChange,
  touched,
  camposObligatorios,
  camposObligatoriosSubpaso2,
  subPaso2,
  setSubPaso2,
  setPaso,
  subPaso2Completo,
  setTouched,
  setFormulario,
  InputField,
}) => {
  // Cambia la función de validación:
  const subPaso2CompletoCampos = (subPaso) => {
    return true; // Permite avanzar siempre, sin validar
  };

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-indigo-600 mb-2">
        Paso 2: Antecedentes (Subpaso {subPaso2})
      </h3>

      {/* SUBPASO 2.1: Prenatales */}
      {subPaso2 === 1 && (
        <>
          <h4 className="text-lg font-semibold text-gray-700">
            Antecedentes Prenatales
          </h4>
          {[
            "Gestación Planeada",
            "Gestación Controlada",
            "Métodos anticonceptivos",
            "Intento de aborto",
            "Vómito primer trimestre",
            "Fármacos, alcohol, drogas o cigarrillo",
            "Exposición a Rayos X",
            "Convulsiones",
            "Desnutrición",
            "Anemia",
            "Maltrato",
            "Hipertensión",
            "Diabetes",
          ].map((item) => (
            <label key={item} className="flex items-center">
              <input
                type="checkbox"
                name="antecedentesPrenatales"
                value={item}
                checked={formulario.antecedentesPrenatales?.includes(item)}
                onChange={(e) => {
                  const actual = formulario.antecedentesPrenatales || [];
                  const nuevo = e.target.checked
                    ? [...actual, item]
                    : actual.filter((i) => i !== item);
                  setFormulario((prev) => ({
                    ...prev,
                    antecedentesPrenatales: nuevo,
                  }));
                }}
                className="mr-2"
                id={`antecedentesPrenatales-${item}`}
              />
              <span>{item}</span>
            </label>
          ))}
        </>
      )}

      {/* SUBPASO 2.2: Perinatales */}
      {subPaso2 === 2 && (
        <>
          <h4 className="text-lg font-semibold text-gray-700">
            Antecedentes Perinatales
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              label="Tipo de parto"
              name="tipoParto"
              type="select"
              value={formulario.tipoParto || ""}
              onChange={handleChange}
              touched={touched.tipoParto}
              options={[
                { value: "", label: "Seleccione" },
                { value: "Vaginal", label: "Vaginal" },
                { value: "Cesárea", label: "Cesárea" }
              ]}
            />
            <InputField
              label="Tiempo de embarazo (semanas)"
              name="tiempoEmbarazo"
              type="number"
              value={formulario.tiempoEmbarazo || ""}
              onChange={handleChange}
              touched={touched.tiempoEmbarazo}
              min={20}
              max={45}
              placeholder="Ej: 38"
            />
            <InputField
              label="Lugar de parto"
              name="lugarParto"
              value={formulario.lugarParto || ""}
              onChange={handleChange}
              touched={touched.lugarParto}
            />
            <InputField
              label="¿Atendida oportunamente?"
              name="atendidoOportunamente"
              type="select"
              value={formulario.atendidoOportunamente || ""}
              onChange={handleChange}
              touched={touched.atendidoOportunamente}
              options={[
                { value: "", label: "Seleccione" },
                { value: "Sí", label: "Sí" },
                { value: "No", label: "No" }
              ]}
            />
            <InputField
              label="Médico tratante"
              name="medicoParto"
              value={formulario.medicoParto || ""}
              onChange={handleChange}
              touched={touched.medicoParto}
            />
            <InputField
              label="Peso al nacer (g)"
              name="pesoNacimiento"
              type="number"
              value={formulario.pesoNacimiento || ""}
              onChange={handleChange}
              touched={touched.pesoNacimiento}
              placeholder="Ej: 3200"
            />
            <InputField
              label="Talla al nacer (cm)"
              name="tallaNacimiento"
              type="number"
              value={formulario.tallaNacimiento || ""}
              onChange={handleChange}
              touched={touched.tallaNacimiento}
              placeholder="Ej: 50"
            />
            <InputField
              label="¿Recibió curso?"
              name="recibioCurso"
              type="select"
              value={formulario.recibioCurso || ""}
              onChange={handleChange}
              touched={touched.recibioCurso}
              options={[
                { value: "", label: "Seleccione" },
                { value: "Sí", label: "Sí" },
                { value: "No", label: "No" }
              ]}
            />
          </div>
        </>
      )}

      {/* SUBPASO 2.3: Recién Nacido */}
      {subPaso2 === 3 && (
        <>
          <h4 className="text-lg font-semibold text-gray-700">
            Antecedentes Recién Nacido
          </h4>
          {["Llanto", "Problemas respiratorios", "Incubadora"].map((item) => (
            <label key={item} className="flex items-center">
              <input
                type="checkbox"
                name="recienNacido"
                value={item}
                checked={formulario.recienNacido?.includes(item)}
                onChange={(e) => {
                  const actual = formulario.recienNacido || [];
                  const nuevo = e.target.checked
                    ? [...actual, item]
                    : actual.filter((i) => i !== item);
                  setFormulario((prev) => ({
                    ...prev,
                    recienNacido: nuevo,
                  }));
                }}
                className="mr-2"
                id={`recienNacido-${item}`}
              />
              <span>{item}</span>
            </label>
          ))}
          <div className="mt-4">
            <div className="md:col-span-2">
              <label className="block font-semibold mb-1">¿Recibió lactancia?</label>
              <div className="flex gap-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="lactancia"
                    value="SI"
                    checked={formulario.lactancia === "SI"}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  Sí
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="lactancia"
                    value="NO"
                    checked={formulario.lactancia === "NO"}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  No
                </label>
              </div>
            </div>
            <InputField
              label="Tiempo de lactancia (semanas)"
              name="tiempoLactancia"
              type="number"
              value={formulario.tiempoLactancia || ""}
              onChange={handleChange}
              touched={touched.tiempoLactancia}
              disabled={formulario.lactancia !== "SI"}
              placeholder="Ej: 12"
            />

            <div className="md:col-span-2 mt-4">
              <label className="block font-semibold mb-1">¿Estuvo hospitalizado?</label>
              <div className="flex gap-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="hospitalizado"
                    value="SI"
                    checked={formulario.hospitalizado === "SI"}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  Sí
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="hospitalizado"
                    value="NO"
                    checked={formulario.hospitalizado === "NO"}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  No
                </label>
              </div>
            </div>

            {formulario.hospitalizado === "SI" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                <InputField
                  label="Hospitalarios"
                  name="hospitalarios"
                  value={formulario.hospitalarios || ""}
                  onChange={handleChange}
                  touched={touched.hospitalarios}
                />
                <InputField
                  label="Patológicos"
                  name="patologicos"
                  value={formulario.patologicos || ""}
                  onChange={handleChange}
                  touched={touched.patologicos}
                />
                <InputField
                  label="Familiares"
                  name="familiares"
                  value={formulario.familiares || ""}
                  onChange={handleChange}
                  touched={touched.familiares}
                />
                <InputField
                  label="Traumáticos"
                  name="traumaticos"
                  value={formulario.traumaticos || ""}
                  onChange={handleChange}
                  touched={touched.traumaticos}
                />
                <InputField
                  label="Farmacológicos"
                  name="farmacologicos"
                  value={formulario.farmacologicos || ""}
                  onChange={handleChange}
                  touched={touched.farmacologicos}
                />
                <InputField
                  label="Quirúrgicos"
                  name="quirurgicos"
                  value={formulario.quirurgicos || ""}
                  onChange={handleChange}
                  touched={touched.quirurgicos}
                />
                <InputField
                  label="Tóxicos / alérgicos"
                  name="toxicos"
                  value={formulario.toxicos || ""}
                  onChange={handleChange}
                  touched={touched.toxicos}
                />
              </div>
            )}

            {/* Nuevo: Checkbox para indicar si se va a dar dieta o recomendaciones médicas */}
            <div className="md:col-span-2 mt-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="dietaIndicada"
                  checked={!!formulario.dietaIndicada}
                  onChange={e =>
                    setFormulario(prev => ({
                      ...prev,
                      dietaIndicada: e.target.checked,
                      recomendaciones: e.target.checked ? prev.recomendaciones || "" : "", // Limpia si se desmarca
                    }))
                  }
                  className="mr-2"
                />
                ¿Se va a dar dieta o recomendaciones médicas?
              </label>
            </div>

            {formulario.dietaIndicada && (
              <div className="md:col-span-2 mt-2">
                <InputField
                  label="Recomendaciones médicas"
                  name="recomendaciones"
                  value={formulario.recomendaciones || ""}
                  onChange={handleChange}
                  touched={touched.recomendaciones}
                  placeholder="Escriba aquí las recomendaciones..."
                  // Si quieres un textarea, agrega type="textarea" y ajusta InputField
                />
              </div>
            )}
          </div>
        </>
      )}

      <div className="flex justify-between pt-6">
        <button
          type="button"
          onClick={() =>
            subPaso2 > 1 ? setSubPaso2(subPaso2 - 1) : setPaso(1)
          }
          className="bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded"
        >
          {subPaso2 === 1 ? "Anterior" : "Subpaso anterior"}
        </button>
        <button
          type="button"
          onClick={() => {
            if (
              (subPaso2 === 1 && !subPaso2Completo) ||
              ((subPaso2 === 2 || subPaso2 === 3) &&
                !subPaso2CompletoCampos(subPaso2))
            ) {
              if (subPaso2 === 1)
                setTouched((prev) => ({
                  ...prev,
                  antecedentesPrenatales: true,
                }));
              if (subPaso2 === 2 || subPaso2 === 3) {
                const nuevosTouched = { ...touched };
                (camposObligatoriosSubpaso2[subPaso2] || []).forEach((campo) => {
                  if (
                    !formulario[campo] ||
                    formulario[campo].toString().trim() === ""
                  ) {
                    nuevosTouched[campo] = true;
                  }
                });
                setTouched(nuevosTouched);
              }
              return;
            }
            subPaso2 < 3 ? setSubPaso2(subPaso2 + 1) : setPaso(3);
          }}
          className={`font-bold py-2 px-4 rounded 
            ${
              (subPaso2 === 1 && subPaso2Completo) ||
              ((subPaso2 === 2 || subPaso2 === 3) &&
                subPaso2CompletoCampos(subPaso2))
                ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                : "bg-gray-400 text-white cursor-not-allowed"
            }`}
          disabled={
            (subPaso2 === 1 && !subPaso2Completo) ||
            ((subPaso2 === 2 || subPaso2 === 3) &&
              !subPaso2CompletoCampos(subPaso2))
          }
        >
          {subPaso2 === 3 ? "Siguiente paso" : "Siguiente subpaso"}
        </button>
      </div>
    </div>
  );
};

export default Paso2Antecedentes;