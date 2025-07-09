import React from "react";

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

        {/* Campos relacionados con el sueño */}
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
        />
        <InputField
          label="Pesadillas"
          name="pesadillas"
          value={formulario.pesadillas || ""}
          onChange={handleChange}
          touched={touched.pesadillas}
        />
        <InputField
          label="Siesta"
          name="siesta"
          value={formulario.siesta || ""}
          onChange={handleChange}
          touched={touched.siesta}
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

        {/* Alimentos preferidos - siempre habilitados */}
        <InputField
          label="Alimentos preferidos"
          name="alimentosPreferidos"
          value={formulario.alimentosPreferidos || ""}
          onChange={handleChange}
          touched={touched.alimentosPreferidos}
        />
        <InputField
          label="Alimentos que no le gustan"
          name="alimentosNoLeGustan"
          value={formulario.alimentosNoLeGustan || ""}
          onChange={handleChange}
          touched={touched.alimentosNoLeGustan}
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
        <div className="md:col-span-2">
          <label className="block text-sm font-semibold mb-1" htmlFor="rutinaDiaria">
            Rutina diaria
          </label>
          <textarea
            id="rutinaDiaria"
            name="rutinaDiaria"
            value={formulario.rutinaDiaria || ""}
            onChange={handleChange}
            placeholder="Describa la rutina diaria del niño/a..."
            rows={4}
            className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          {touched.rutinaDiaria && (!formulario.rutinaDiaria || formulario.rutinaDiaria === "") && (
            <span className="text-red-500 text-xs">Este campo es obligatorio</span>
          )}
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