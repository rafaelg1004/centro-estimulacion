import React, { useState } from "react";

const Paso3Habitos = ({
  formulario,
  handleChange,
  touched,
  camposObligatorios,
  pasoCompleto,
  setPaso,
  InputField,
  setFormulario, // Asegúrate de tener esto disponible
}) => {
  // Inicializa rutinaDiaria como array si no existe
  const [rutina, setRutina] = useState(formulario.rutinaDiaria || [
    { desde: "", hasta: "", actividad: "" }
  ]);

  // Actualiza el array en el estado local y en el formulario principal
  const handleRutinaChange = (idx, field, value) => {
    const nuevaRutina = rutina.map((item, i) =>
      i === idx ? { ...item, [field]: value } : item
    );
    setRutina(nuevaRutina);
    setFormulario(prev => ({
      ...prev,
      rutinaDiaria: nuevaRutina
    }));
  };

  const agregarFila = () => {
    const nuevaRutina = [...rutina, { desde: "", hasta: "", actividad: "" }];
    setRutina(nuevaRutina);
    setFormulario(prev => ({
      ...prev,
      rutinaDiaria: nuevaRutina
    }));
  };

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-indigo-600 mb-2">
        Paso 3: Desarrollo Personal y Hábitos
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Problemas de Sueño */}
        <InputField
          label="¿Tiene problemas de sueño?"
          name="problemasSueno"
          type="select"
          value={formulario.problemasSueno || ""}
          onChange={handleChange}
          touched={touched.problemasSueno}
          options={[
            { value: "", label: "Seleccione" },
            { value: "SI", label: "Sí" },
            { value: "NO", label: "No" },
          ]}
        />

        {/* Campos relacionados con el sueño, solo habilitados si problemasSueno === "SI" */}
        <InputField
          label="Descripción del sueño"
          name="descripcionSueno"
          value={formulario.descripcionSueno || ""}
          onChange={handleChange}
          touched={touched.descripcionSueno}
          disabled={formulario.problemasSueno !== "SI"}
        />
        <InputField
          label="Duerme con"
          name="duermeCon"
          value={formulario.duermeCon || ""}
          onChange={handleChange}
          touched={touched.duermeCon}
          disabled={formulario.problemasSueno !== "SI"}
        />
        <InputField
          label="Patrón del Sueño"
          name="patronSueno"
          value={formulario.patronSueno || ""}
          onChange={handleChange}
          touched={touched.patronSueno}
          disabled={formulario.problemasSueno !== "SI"}
        />
        <InputField
          label="Pesadillas"
          name="pesadillas"
          value={formulario.pesadillas || ""}
          onChange={handleChange}
          touched={touched.pesadillas}
          disabled={formulario.problemasSueno !== "SI"}
        />
        <InputField
          label="Siesta"
          name="siesta"
          value={formulario.siesta || ""}
          onChange={handleChange}
          touched={touched.siesta}
          disabled={formulario.problemasSueno !== "SI"}
        />

        {/* Dificultades al comer: select Sí/No */}
        <InputField
          label="¿Dificultades al comer?"
          name="dificultadesComer"
          type="select"
          value={formulario.dificultadesComer || ""}
          onChange={handleChange}
          touched={touched.dificultadesComer}
          options={[
            { value: "", label: "Seleccione" },
            { value: "SI", label: "Sí" },
            { value: "NO", label: "No" },
          ]}
       
        />

        {/* Problemas al comer solo si dificultadesComer === "SI" */}
        <InputField
          label="Problemas al comer"
          name="problemasComer"
          value={formulario.problemasComer || ""}
          onChange={handleChange}
          touched={touched.problemasComer}
          disabled={formulario.dificultadesComer !== "SI"}
        />

        {/* Alimentos preferidos */}
        <InputField
          label="Alimentos preferidos"
          name="alimentosPreferidos"
          value={formulario.alimentosPreferidos || ""}
          onChange={handleChange}
          touched={touched.alimentosPreferidos}
        disabled={formulario.dificultadesComer !== "SI"}
        
        />
        <InputField
          label="Alimentos que no le gustan"
          name="alimentosNoLeGustan"
          value={formulario.alimentosNoLeGustan || ""}
          onChange={handleChange}
          touched={touched.alimentosNoLeGustan}
          disabled={
             formulario.dificultadesComer !== "SI"
          }
        />

        {/* Vive con los padres: select Sí/No */}
        <InputField
          label="¿Vive con los padres?"
          name="viveConPadres"
          type="select"
          value={formulario.viveConPadres || ""}
          onChange={handleChange}
          touched={touched.viveConPadres}
          options={[
            { value: "", label: "Seleccione" },
            { value: "SI", label: "Sí" },
            { value: "NO", label: "No" },
          ]}
        />

        {/* Los demás campos siempre habilitados */}
        <InputField
          label="Permanece con"
          name="permaneceCon"
          value={formulario.permaneceCon || ""}
          onChange={handleChange}
          touched={touched.permaneceCon}
        />
        <InputField
          label="Prefiere a"
          name="prefiereA"
          value={formulario.prefiereA || ""}
          onChange={handleChange}
          touched={touched.prefiereA}
        />
        <InputField
          label="¿Tiene hermanos?"
          name="tieneHermanos"
          type="select"
          value={formulario.tieneHermanos || ""}
          onChange={handleChange}
          touched={touched.tieneHermanos}
          options={[
            { value: "", label: "Seleccione" },
            { value: "SI", label: "Sí" },
            { value: "NO", label: "No" },
          ]}
        />
        <InputField
          label="Relación con hermanos"
          name="relacionHermanos"
          value={formulario.relacionHermanos || ""}
          onChange={handleChange}
          touched={touched.relacionHermanos}
          disabled={formulario.tieneHermanos !== "SI"}
        />
        <InputField
          label="Emociones"
          name="emociones"
          value={formulario.emociones || ""}
          onChange={handleChange}
          touched={touched.emociones}
        />
        <InputField
          label="Juega con"
          name="juegaCon"
          value={formulario.juegaCon || ""}
          onChange={handleChange}
          touched={touched.juegaCon}
        />
        <InputField
          label="Juegos preferidos"
          name="juegosPreferidos"
          value={formulario.juegosPreferidos || ""}
          onChange={handleChange}
          touched={touched.juegosPreferidos}
        />
        <InputField
          label="Relación con desconocidos (EVENTOS)"
          name="relacionDesconocidos"
          value={formulario.relacionDesconocidos || ""}
          onChange={handleChange}
          touched={touched.relacionDesconocidos}
        />
        <InputField
          label="Rutina diaria"
          name="rutinaDiaria"
          value={formulario.rutinaDiaria || ""}
          onChange={handleChange}
          touched={touched.rutinaDiaria}
        />
        <div className="md:col-span-2">
          <label className="block font-semibold mb-1">Rutina diaria</label>
          <div className="space-y-2">
            {rutina.map((item, idx) => (
              <div key={idx} className="flex gap-2 items-center">
                <input
                  type="time"
                  value={item.desde}
                  onChange={e => handleRutinaChange(idx, "desde", e.target.value)}
                  className="border rounded px-2 py-1"
                  placeholder="Desde"
                />
                <span>a</span>
                <input
                  type="time"
                  value={item.hasta}
                  onChange={e => handleRutinaChange(idx, "hasta", e.target.value)}
                  className="border rounded px-2 py-1"
                  placeholder="Hasta"
                />
                <input
                  type="text"
                  value={item.actividad}
                  onChange={e => handleRutinaChange(idx, "actividad", e.target.value)}
                  className="border rounded px-2 py-1 flex-1"
                  placeholder="Actividad"
                />
                {idx === rutina.length - 1 && (
                  <button
                    type="button"
                    onClick={agregarFila}
                    className="bg-green-500 text-white px-2 py-1 rounded font-bold"
                    title="Agregar actividad"
                  >
                    +
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="flex justify-between pt-6">
        <button
          type="button"
          onClick={() => setPaso(2)}
          className="bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded"
        >
          Anterior
        </button>
        <button
          type="button"
          onClick={() => setPaso(4)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded"
        >
          Siguiente
        </button>
      </div>
    </div>
  );
};

export default Paso3Habitos;