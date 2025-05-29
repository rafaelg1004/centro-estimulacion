import React, { useState } from "react";
import { useRef } from "react";
import SignaturePad from "react-signature-canvas";
import { useNavigate } from "react-router-dom";

const ValoracionIngreso = () => {
  const navigate = useNavigate();
  const [paso, setPaso] = useState(1);
  const [subPaso2, setSubPaso2] = useState(1);

  const [formulario, setFormulario] = useState({
    fecha: "",
    hora: "",
    nombres: "",
    registroCivil: "",
    genero: "",
    nacimiento: "",
    edad: "",
    peso: "",
    talla: "",
    direccion: "",
    telefono: "",
    celular: "",
    pediatra: "",
    aseguradora: "",
    madreNombre: "",
    madreEdad: "",
    madreOcupacion: "",
    padreNombre: "",
    padreEdad: "",
    padreOcupacion: "",
    motivoDeConsulta: "",
    antecedentesPrenatales: [],
    tipoParto: "",
    tiempoGestacion: "",
    lugarParto: "",
    atendida: "",
    medicoParto: "",
    pesoNacimiento: "",
    tallaNacimiento: "",
    recibioCurso: "",
    recienNacido: [],
    tiempoLactancia: "",
    hospitalarios: "",
    patologicos: "",
    familiares: "",
    traumaticos: "",
    farmacologicos: "",
    quirurgicos: "",
    toxicos: "",
    dieta: "",
    nombreProfesional: "",
    profesion: "",
    nombreRepresentante: "",
    firmaProfesional: "",
    firmaRepresentante: "",
    autorizacion: "",
    consentimiento: "",
    diagnostico: "",
    planTratamiento: "",
    nombreAcudiente: "",
    cedulaAcudiente: "",
    firmaAcudiente: "",
    nombreFisioterapeuta: "",
    cedulaFisioterapeuta: "",
    firmaFisioterapeuta: "",
    autorizacionNombre: "",
    autorizacionRegistro: "",
    ciudadFirma: "",
    diaFirma: "",
    mesFirma: "",
    anioFirma: "",
    cedulaAutorizacion: "",
    firmaAutorizacion: "",
    ontologico_ControlCefalico_si: false,
    tiempo_ControlCefalico: "",
    observaciones_ControlCefalico: "",

    ontologico_Rolados_si: false,
    tiempo_Rolados: "",
    observaciones_Rolados: "",

    ontologico_Sedente_si: false,
    tiempo_Sedente: "",
    observaciones_Sedente: "",

    ontologico_Gateo_si: false,
    tiempo_Gateo: "",
    observaciones_Gateo: "",

    ontologico_Bipedo_si: false,
    tiempo_Bipedo: "",
    observaciones_Bipedo: "",

    ontologico_Marcha_si: false,
    tiempo_Marcha: "",
    observaciones_Marcha: "",
    frecuenciaCardiaca: "",
    frecuenciaRespiratoria: "",
    temperatura: "",
    tejidoTegumentario: "",
    reflejosOsteotendinosos: "",
    reflejosAnormales: "",
    reflejosPatologicos: "",
    tonoMuscular: "",
    controlMotor: "",
    desplazamientos: "",
    sensibilidad: "",
    perfilSensorial: "",
    deformidades: "",
    aparatosOrtopedicos: "",
    sistemaPulmonar: "",
    problemasAsociados: "",
  });
  const [touched, setTouched] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormulario({ ...formulario, [name]: value });
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  const siguiente = () => {
    if (!pasoCompleto) {
      marcarCamposVacios();
      return;
    }
    setPaso((prev) => prev + 1);
  };
  //const anterior = () => setPaso((prev) => prev - 1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:4000/api/valoraciones", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formulario),
      });
      if (!response.ok) throw new Error("Error al guardar");
      alert("Valoración guardada con éxito");
      setFormulario({});
      setPaso(1);
    } catch (error) {
      alert("Error al enviar valoración");
      console.error(error);
    }
  };

  // Puedes ajustar los campos requeridos por paso según tu flujo
  const camposObligatorios = {
    1: [
      "fecha",
      "hora",
      "nombres",
      "registroCivil",
      "genero",
      "nacimiento",
      "edad",
      "peso",
      "talla",
      "direccion",
      "telefono",
      "celular",
      "pediatra",
      "aseguradora",
      "madreNombre",
      "madreEdad",
      "madreOcupacion",
      "padreNombre",
      "padreEdad",
      "padreOcupacion",
      "motivoDeConsulta",
    ],
    2: [
      "tipoParto",
      "tiempoGestacion",
      "lugarParto",
      "atendida",
      "medicoParto",
      "pesoNacimiento",
      "tallaNacimiento",
      "recibioCurso",
      "tiempoLactancia",
      "hospitalarios",
      "patologicos",
      "familiares",
      "traumaticos",
      "farmacologicos",
      "quirurgicos",
      "toxicos",
      "dieta",
    ],
    3: [
      "problemasSueno",
      "descripcionSueno",
      "duermeCon",
      "patronSueno",
      "pesadillas",
      "siesta",
      "dificultadesComer",
      "motivoComida",
      "problemasComer",
      "detalleProblemasComer",
      "alimentosPreferidos",
      "alimentosNoLeGustan",
      "viveConPadres",
      "permaneceCon",
      "prefiereA",
      "relacionHermanos",
      "emociones",
      "juegaCon",
      "juegosPreferidos",
      "relacionDesconocidos",
      "rutinaDiaria",
    ],
    // Agrega los campos requeridos para los pasos 4, 5, 6, 7 si los necesitas
  };

  const camposObligatoriosSubpaso2 = {
    2: [
      "tipoParto",
      "tiempoGestacion",
      "lugarParto",
      "atendida",
      "medicoParto",
      "pesoNacimiento",
      "tallaNacimiento",
      "recibioCurso",
    ],
    3: [
      "tiempoLactancia",
      "hospitalarios",
      "patologicos",
      "familiares",
      "traumaticos",
      "farmacologicos",
      "quirurgicos",
      "toxicos",
      "dieta",
    ],
  };

  const pasoCompleto = camposObligatorios[paso]
    ? camposObligatorios[paso].every(
        (campo) => formulario[campo] && formulario[campo].toString().trim() !== ""
      )
    : true;

  const subPaso2CompletoCampos = (subPaso) =>
    (camposObligatoriosSubpaso2[subPaso] || []).every(
      (campo) => formulario[campo] && formulario[campo].toString().trim() !== ""
    );

  const subPaso2Completo =
    paso !== 2 || subPaso2 !== 1
      ? true
      : formulario.antecedentesPrenatales && formulario.antecedentesPrenatales.length > 0;

  const marcarCamposVacios = () => {
    const nuevosTouched = { ...touched };
    (camposObligatorios[paso] || []).forEach((campo) => {
      if (!formulario[campo] || formulario[campo].toString().trim() === "") {
        nuevosTouched[campo] = true;
      }
    });
    setTouched(nuevosTouched);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-4xl mx-auto bg-white p-6 rounded-xl shadow-md"
    >
      <button
        type="button"
        onClick={() => navigate("/")}
        className="bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded mb-4"
      >
        Volver al inicio
      </button>
      <h2 className="text-2xl font-bold text-center text-indigo-600 mb-4">
        Valoración de Ingreso
      </h2>
      <p className="text-center text-sm text-gray-500 mb-6">
        Paso {paso}
      </p>

      {paso === 1 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField
            label="Fecha"
            name="fecha"
            type="date"
            value={formulario.fecha}
            onChange={handleChange}
            touched={touched.fecha}
            required={camposObligatorios[paso]?.includes("fecha")}
          />
          <InputField
            label="Hora"
            name="hora"
            type="time"
            value={formulario.hora}
            onChange={handleChange}
            touched={touched.hora}
            required={camposObligatorios[paso]?.includes("hora")}
          />
          <InputField
            label="Nombres y Apellidos"
            name="nombres"
            value={formulario.nombres}
            onChange={handleChange}
            touched={touched.nombres}
            required={camposObligatorios[paso]?.includes("nombres")}
          />
          <InputField
            label="Registro Civil"
            name="registroCivil"
            value={formulario.registroCivil}
            onChange={handleChange}
            touched={touched.registroCivil}
            required={camposObligatorios[paso]?.includes("registroCivil")}
          />
          <InputField
            label="Género"
            name="genero"
            value={formulario.genero}
            onChange={handleChange}
            touched={touched.genero}
            required={camposObligatorios[paso]?.includes("genero")}
          />
          <InputField
            label="Lugar y Fecha de Nacimiento"
            name="nacimiento"
            value={formulario.nacimiento}
            onChange={handleChange}
            touched={touched.nacimiento}
            required={camposObligatorios[paso]?.includes("nacimiento")}
          />
          <InputField
            label="Edad"
            name="edad"
            value={formulario.edad}
            onChange={handleChange}
            touched={touched.edad}
            required={camposObligatorios[paso]?.includes("edad")}
          />
          <InputField
            label="Peso"
            name="peso"
            value={formulario.peso}
            onChange={handleChange}
            touched={touched.peso}
            required={camposObligatorios[paso]?.includes("peso")}
          />
          <InputField
            label="Talla"
            name="talla"
            value={formulario.talla}
            onChange={handleChange}
            touched={touched.talla}
            required={camposObligatorios[paso]?.includes("talla")}
          />
          <InputField
            label="Dirección"
            name="direccion"
            value={formulario.direccion}
            onChange={handleChange}
            touched={touched.talla}
            required={camposObligatorios[paso]?.includes("talla")}
          />
          <InputField
            label="Teléfono"
            name="telefono"
            value={formulario.telefono}
            onChange={handleChange}
            touched={touched.telefono}
            required={camposObligatorios[paso]?.includes("telefono")}
          />
          <InputField
            label="Celular"
            name="celular"
            value={formulario.celular}
            onChange={handleChange}
            touched={touched.celular}
            required={camposObligatorios[paso]?.includes("celular")}
          />
          <InputField
            label="Pediatra tratante"
            name="pediatra"
            value={formulario.pediatra}
            onChange={handleChange}
            touched={touched.pediatra}
            required={camposObligatorios[paso]?.includes("pediatra")}
          />
          <InputField
            label="Aseguradora"
            name="aseguradora"
            value={formulario.aseguradora}
            onChange={handleChange}
            touched={touched.aseguradora}
            required={camposObligatorios[paso]?.includes("aseguradora")}
          />

          <div className="md:col-span-2 border-t pt-4 mt-4">
            <h4 className="text-lg font-semibold text-gray-700 mb-2">
              Datos Familiares
            </h4>
          </div>

          <InputField
            label="Nombre de la madre"
            name="madreNombre"
            value={formulario.madreNombre}
            onChange={handleChange}
            touched={touched.madreNombre}
            required={camposObligatorios[paso]?.includes("madreNombre")}
          />
          <InputField
            label="Edad de la madre"
            name="madreEdad"
            value={formulario.madreEdad}
            onChange={handleChange}
            touched={touched.madreEdad}
            required={camposObligatorios[paso]?.includes("madreEdad")}
          />
          <InputField
            label="Ocupación de la madre"
            name="madreOcupacion"
            value={formulario.madreOcupacion}
            onChange={handleChange}
            touched={touched.madreOcupacion}
            required={camposObligatorios[paso]?.includes("madreOcupacion")}
          />
          <InputField
            label="Nombre del padre"
            name="padreNombre"
            value={formulario.padreNombre}
            onChange={handleChange}
            touched={touched.padreNombre}
            required={camposObligatorios[paso]?.includes("padreNombre")}
          />
          <InputField
            label="Edad del padre"
            name="padreEdad"
            value={formulario.padreEdad}
            onChange={handleChange}
            touched={touched.padreEdad}
            required={camposObligatorios[paso]?.includes("padreEdad")}
          />
          <InputField
            label="Ocupación del padre"
            name="padreOcupacion"
            value={formulario.padreOcupacion}
            onChange={handleChange}
            touched={touched.padreOcupacion}
            required={camposObligatorios[paso]?.includes("padreOcupacion")}
          />
          <div className="md:col-span-2">
            <label className="block font-semibold mb-1">
              Motivo de consulta
            </label>
            <textarea
              name="motivoDeConsulta"
              value={formulario.motivoDeConsulta || ""}
              onChange={handleChange}
              rows={4}
              className={`w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-400
                ${touched.motivoDeConsulta && camposObligatorios[paso]?.includes("motivoDeConsulta") && (!formulario.motivoDeConsulta || formulario.motivoDeConsulta.trim() === "") ? "border-red-500" : "border-gray-300"}`}
              placeholder="Describa el motivo de la consulta..."
            />
            {touched.motivoDeConsulta && camposObligatorios[paso]?.includes("motivoDeConsulta") && (!formulario.motivoDeConsulta || formulario.motivoDeConsulta.trim() === "") && (
              <span className="text-red-500 text-xs">Este campo es obligatorio</span>
            )}
          </div>
          <div className="md:col-span-2 flex justify-end mt-6">
            <button
              type="button"
              onClick={siguiente}
              className={`font-bold py-2 px-4 rounded 
    ${pasoCompleto ? "bg-indigo-600 hover:bg-indigo-700 text-white" : "bg-gray-400 text-white cursor-not-allowed"}`}
              disabled={!pasoCompleto}
            >
              Siguiente
            </button>
          </div>
        </div>
      )}

      {paso === 2 && (
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
              {["Gestación Planeada", "Gestación Controlada", "Métodos anticonceptivos", "Intento de aborto",
                "Vómito primer trimestre", "Fármacos, alcohol, drogas o cigarrillo", "Exposición a Rayos X",
                "Convulsiones", "Desnutrición", "Anemia", "Maltrato", "Hipertensión", "Diabetes"].map((item) => (
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
                      setFormulario({ ...formulario, antecedentesPrenatales: nuevo });
                    }}
                    className="mr-2"
                  />
                  {item}
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
                  value={formulario.tipoParto || ""}
                  onChange={handleChange}
                  touched={touched.tipoParto}
                  required={camposObligatorios[paso]?.includes("tipoParto")}
                />
                <InputField
                  label="Tiempo de gestación"
                  name="tiempoGestacion"
                  value={formulario.tiempoGestacion || ""}
                  onChange={handleChange}
                  touched={touched.tiempoGestacion}
                  required={camposObligatorios[paso]?.includes("tiempoGestacion")}
                />
                <InputField
                  label="Lugar de parto"
                  name="lugarParto"
                  value={formulario.lugarParto || ""}
                  onChange={handleChange}
                  touched={touched.lugarParto}
                  required={camposObligatorios[paso]?.includes("lugarParto")}
                />
                <InputField
                  label="¿Atendida oportunamente?"
                  name="atendida"
                  value={formulario.atendida || ""}
                  onChange={handleChange}
                  touched={touched.atendida}
                />
                <InputField
                  label="Médico tratante"
                  name="medicoParto"
                  value={formulario.medicoParto || ""}
                  onChange={handleChange}
                  touched={touched.medicoParto}
                  required={camposObligatorios[paso]?.includes("medicoParto")}

                />
                <InputField
                  label="Peso al nacer"
                  name="pesoNacimiento"
                  value={formulario.pesoNacimiento || ""}
                  onChange={handleChange}
                  touched={touched.pesoNacimiento}
                  required={camposObligatorios[paso]?.includes("pesoNacimiento")}
                />
                <InputField
                  label="Talla al nacer"
                  name="tallaNacimiento"
                  value={formulario.tallaNacimiento || ""}
                  onChange={handleChange}
                  touched={touched.tallaNacimiento}
                  required={camposObligatorios[paso]?.includes("tallaNacimiento")}
                />
                <InputField
                  label="¿Recibió curso?"
                  name="recibioCurso"
                  value={formulario.recibioCurso || ""}
                  onChange={handleChange}
                  touched={touched.recibioCurso}
                  required={camposObligatorios[paso]?.includes("recibioCurso")}
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
                      setFormulario({ ...formulario, recienNacido: nuevo });
                    }}
                    className="mr-2"
                  />
                  {item}
                </label>
              ))}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <InputField
                  label="Tiempo de lactancia"
                  name="tiempoLactancia"
                  value={formulario.tiempoLactancia || ""}
                  onChange={handleChange}
                  touched={touched.tiempoLactancia}
                  required={camposObligatoriosSubpaso2[3]?.includes("tiempoLactancia")}
                />
                <InputField
                  label="Hospitalarios"
                  name="hospitalarios"
                  value={formulario.hospitalarios || ""}
                  onChange={handleChange}
                  touched={touched.hospitalarios}
                  required={camposObligatoriosSubpaso2[3]?.includes("hospitalarios")}
                />
                <InputField
                  label="Patológicos"
                  name="patologicos"
                  value={formulario.patologicos || ""}
                  onChange={handleChange}
                  touched={touched.patologicos}
                  required={camposObligatoriosSubpaso2[3]?.includes("patologicos")}
                />
                <InputField
                  label="Familiares"
                  name="familiares"
                  value={formulario.familiares || ""}
                  onChange={handleChange}
                  touched={touched.familiares}
                  required={camposObligatoriosSubpaso2[3]?.includes("familiares")}
                />
                <InputField
                  label="Traumáticos"
                  name="traumaticos"
                  value={formulario.traumaticos || ""}
                  onChange={handleChange}
                  touched={touched.traumaticos}
                  required={camposObligatoriosSubpaso2[3]?.includes("traumaticos")}
                />
                <InputField
                  label="Farmacológicos"
                  name="farmacologicos"
                  value={formulario.farmacologicos || ""}
                  onChange={handleChange}
                  touched={touched.farmacologicos}
                  required={camposObligatoriosSubpaso2[3]?.includes("farmacologicos")}
                />
                <InputField
                  label="Quirúrgicos"
                  name="quirurgicos"
                  value={formulario.quirurgicos || ""}
                  onChange={handleChange}
                  touched={touched.quirurgicos}
                  required={camposObligatoriosSubpaso2[3]?.includes("quirurgicos")}
                />
                <InputField
                  label="Tóxicos / alérgicos"
                  name="toxicos"
                  value={formulario.toxicos || ""}
                  onChange={handleChange}
                  touched={touched.toxicos}
                  required={camposObligatoriosSubpaso2[3]?.includes("toxicos")}
                />
                <InputField
                  label="Dieta o recomendaciones médicas"
                  name="dieta"
                  value={formulario.dieta || ""}
                  onChange={handleChange}
                  touched={touched.dieta}
                  required={camposObligatoriosSubpaso2[3]?.includes("dieta")}
                />
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
                  ((subPaso2 === 2 || subPaso2 === 3) && !subPaso2CompletoCampos(subPaso2))
                ) {
                  if (subPaso2 === 1) setTouched((prev) => ({ ...prev, antecedentesPrenatales: true }));
                  if (subPaso2 === 2 || subPaso2 === 3) {
                    const nuevosTouched = { ...touched };
                    (camposObligatoriosSubpaso2[subPaso2] || []).forEach((campo) => {
                      if (!formulario[campo] || formulario[campo].toString().trim() === "") {
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
      ((subPaso2 === 2 || subPaso2 === 3) && subPaso2CompletoCampos(subPaso2))
        ? "bg-indigo-600 hover:bg-indigo-700 text-white"
        : "bg-gray-400 text-white cursor-not-allowed"
    }`}
              disabled={
                (subPaso2 === 1 && !subPaso2Completo) ||
                ((subPaso2 === 2 || subPaso2 === 3) && !subPaso2CompletoCampos(subPaso2))
              }
            >
              {subPaso2 === 3 ? "Siguiente paso" : "Siguiente subpaso"}
            </button>
          </div>
        </div>
      )}
      {paso === 3 && (
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-indigo-600 mb-2">
            Paso 3: Desarrollo Personal y Hábitos
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              label="Problemas de Sueño"
              name="problemasSueno"
              value={formulario.problemasSueno || ""}
              onChange={handleChange}
            />
            <InputField
              label="Descripción del sueño"
              name="descripcionSueno"
              value={formulario.descripcionSueno || ""}
              onChange={handleChange}
            />
            <InputField
              label="Duerme con"
              name="duermeCon"
              value={formulario.duermeCon || ""}
              onChange={handleChange}
            />
            <InputField
              label="Patrón del Sueño"
              name="patronSueno"
              value={formulario.patronSueno || ""}
              onChange={handleChange}
            />
            <InputField
              label="Pesadillas"
              name="pesadillas"
              value={formulario.pesadillas || ""}
              onChange={handleChange}
            />
            <InputField
              label="Siesta"
              name="siesta"
              value={formulario.siesta || ""}
              onChange={handleChange}
            />
            <InputField
              label="Dificultades al comer"
              name="dificultadesComer"
              value={formulario.dificultadesComer || ""}
              onChange={handleChange}
            />
            <InputField
              label="Motivo (alimentación)"
              name="motivoComida"
              value={formulario.motivoComida || ""}
              onChange={handleChange}
            />
            <InputField
              label="Problemas al comer"
              name="problemasComer"
              value={formulario.problemasComer || ""}
              onChange={handleChange}
            />
            <InputField
              label="Detalle de problemas al comer"
              name="detalleProblemasComer"
              value={formulario.detalleProblemasComer || ""}
              onChange={handleChange}
            />
            <InputField
              label="Alimentos preferidos"
              name="alimentosPreferidos"
              value={formulario.alimentosPreferidos || ""}
              onChange={handleChange}
            />
            <InputField
              label="Alimentos que no le gustan"
              name="alimentosNoLeGustan"
              value={formulario.alimentosNoLeGustan || ""}
              onChange={handleChange}
            />
            <InputField
              label="Vive con los padres"
              name="viveConPadres"
              value={formulario.viveConPadres || ""}
              onChange={handleChange}
            />
            <InputField
              label="Permanece con"
              name="permaneceCon"
              value={formulario.permaneceCon || ""}
              onChange={handleChange}
            />
            <InputField
              label="Prefiere a"
              name="prefiereA"
              value={formulario.prefiereA || ""}
              onChange={handleChange}
            />
            <InputField
              label="Relación con hermanos"
              name="relacionHermanos"
              value={formulario.relacionHermanos || ""}
              onChange={handleChange}
            />
            <InputField
              label="Emociones"
              name="emociones"
              value={formulario.emociones || ""}
              onChange={handleChange}
            />
            <InputField
              label="Juega con"
              name="juegaCon"
              value={formulario.juegaCon || ""}
              onChange={handleChange}
            />
            <InputField
              label="Juegos preferidos"
              name="juegosPreferidos"
              value={formulario.juegosPreferidos || ""}
              onChange={handleChange}
            />
            <InputField
              label="Relación con desconocidos"
              name="relacionDesconocidos"
              value={formulario.relacionDesconocidos || ""}
              onChange={handleChange}
            />
            <InputField
              label="Rutina diaria"
              name="rutinaDiaria"
              value={formulario.rutinaDiaria || ""}
              onChange={handleChange}
            />
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
      )}
      {paso === 4 && (
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
                        setFormulario({
                          ...formulario,
                          [`ontologico_${campo}_si`]: e.target.checked,
                        })
                      }
                      className="mr-2"
                    />
                    Sí
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
            <label className="block font-semibold mb-1">Sistema Pulmonar</label>
            <textarea
              name="sistemaPulmonar"
              value={formulario.sistemaPulmonar || ""}
              onChange={handleChange}
              rows={3}
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Problemas Asociados</label>
            <textarea
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
      )}
      {paso === 5 && (
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-indigo-600 mb-2">
            Paso 5: Diagnóstico Fisioterapéutico y Plan de Tratamiento
          </h3>

          <div>
            <label className="block font-semibold mb-1">
              Diagnóstico Fisioterapéutico
            </label>
            <textarea
              name="diagnostico"
              value={formulario.diagnostico || ""}
              onChange={handleChange}
              rows={4}
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Plan de Tratamiento</label>
            <textarea
              name="planTratamiento"
              value={formulario.planTratamiento || ""}
              onChange={handleChange}
              rows={4}
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          <div className="flex justify-between pt-6">
            <button
              type="button"
              onClick={() => setPaso(4)}
              className="bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded"
            >
              Anterior
            </button>
            <button
              type="button"
              onClick={() => setPaso(6)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded"
            >
              Siguiente
            </button>
          </div>
        </div>
      )}
      {paso === 6 && (
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-indigo-600 mb-2">
            Paso 6: Firma del Profesional y Representante
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              label="Nombre del Profesional"
              name="nombreProfesional"
              value={formulario.nombreProfesional || ""}
              onChange={handleChange}
            />
            <InputField
              label="Profesión"
              name="profesion"
              value={formulario.profesion || ""}
              onChange={handleChange}
            />
            <FirmaCanvas
              label="Firma del Profesional"
              name="firmaProfesional"
              setFormulario={setFormulario}
              formulario={formulario}
            />
            <InputField
              label="Nombre del Representante"
              name="nombreRepresentante"
              value={formulario.nombreRepresentante || ""}
              onChange={handleChange}
            />
            <FirmaCanvas
              label="Firma del Representante"
              name="firmaRepresentante"
              setFormulario={setFormulario}
              formulario={formulario}
            />
          </div>

          <div className="flex justify-between pt-6">
            <button
              type="button"
              onClick={() => setPaso(5)}
              className="bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded"
            >
              Anterior
            </button>
            <button
              type="button"
              onClick={() => setPaso(7)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded"
            >
              Siguiente
            </button>
          </div>
        </div>
      )}
      {paso === 7 && (
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-indigo-600 mb-2">
            Paso 7: Autorización y Consentimiento
          </h3>

          <div className="mb-10">
            <h2 className="text-xl font-bold text-indigo-700 uppercase mb-4 border-b pb-1">
              AUTORIZACIÓN DE USO DE IMAGEN
            </h2>

            <p className="text-sm text-gray-700 leading-relaxed mb-4">
              Atendiendo al ejercicio de la Patria Potestad, establecido en el
              Código Civil Colombiano en su artículo 288, el artículo 24 del
              Decreto 2820 de 1974 y la Ley de Infancia y Adolescencia, el
              Ministerio de Educación Nacional solicita la autorización escrita
              del padre/madre de familia o acudiente del menor de edad:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Nombre del menor
                </label>
                <input
                  type="text"
                  name="autorizacionNombre"
                  value={formulario.autorizacionNombre || ""}
                  onChange={handleChange}
                  className="w-full border rounded-md p-2"
                  placeholder="Nombre del menor"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Número de Registro Civil
                </label>
                <input
                  type="text"
                  name="autorizacionRegistro"
                  value={formulario.autorizacionRegistro || ""}
                  onChange={handleChange}
                  className="w-full border rounded-md p-2"
                  placeholder="Número de registro civil"
                />
              </div>
            </div>

            <p className="text-sm text-gray-700 leading-relaxed mb-4">
              Para reproducir fotografías e imágenes de las actividades en las
              que participe, para ser utilizadas en publicaciones, proyectos,
              redes sociales y página Web.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-1">Ciudad</label>
                <input
                  type="text"
                  name="ciudadFirma"
                  value={formulario.ciudadFirma || ""}
                  onChange={handleChange}
                  className="w-full border rounded-md p-2"
                  placeholder="Ciudad"
                />
              </div>
              <div className="flex gap-2">
                <div>
                  <label className="block text-sm font-medium mb-1">Día</label>
                  <input
                    type="text"
                    name="diaFirma"
                    value={formulario.diaFirma || ""}
                    onChange={handleChange}
                    className="w-full border rounded-md p-2"
                    placeholder="dd"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Mes</label>
                  <input
                    type="text"
                    name="mesFirma"
                    value={formulario.mesFirma || ""}
                    onChange={handleChange}
                    className="w-full border rounded-md p-2"
                    placeholder="mes"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Año</label>
                  <input
                    type="text"
                    name="anioFirma"
                    value={formulario.anioFirma || ""}
                    onChange={handleChange}
                    className="w-full border rounded-md p-2"
                    placeholder="año"
                  />
                </div>
                              </div>
            </div>

            <FirmaCanvas
              label="Firma de Autorización"
              name="firmaAutorizacion"
              setFormulario={setFormulario}
              formulario={formulario}
            />
          </div>

          <div className="flex justify-between pt-6">
            <button
              type="button"
              onClick={() => setPaso(6)}
              className="bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded"
            >
              Anterior
            </button>
            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            >
              Finalizar
            </button>
          </div>
        </div>
      )}
    </form>
  );
};
const FirmaCanvas = ({ label, name, setFormulario, formulario }) => {
  const sigRef = useRef();

  const guardarFirma = () => {
    const dataURL = sigRef.current.toDataURL("image/png"); // Usamos toDataURL completo
    setFormulario((prev) => ({ ...prev, [name]: dataURL }));
  };

  const limpiarFirma = () => {
    sigRef.current.clear();
    setFormulario((prev) => ({ ...prev, [name]: "" }));
  };

  return (
    <div className="mb-4">
      <label className="block font-semibold mb-2">{label}</label>

      <div className="border rounded bg-white mb-2">
        <SignaturePad
          ref={sigRef}
          canvasProps={{ className: "w-full h-40" }}
        />
      </div>

      <div className="flex gap-2 mb-2">
        <button
          type="button"
          onClick={guardarFirma}
          className="bg-indigo-600 text-white px-3 py-1 rounded"
        >
          Guardar o Actualizar Firma
        </button>
        <button
          type="button"
          onClick={limpiarFirma}
          className="bg-red-500 text-white px-3 py-1 rounded"
        >
          Limpiar
        </button>
      </div>

      {formulario[name] && (
        <div>
          <p className="text-sm text-gray-600">Firma guardada:</p>
          <img
            src={formulario[name]}
            alt="firma guardada"
            className="border rounded max-h-32"
          />
        </div>
      )}
    </div>
  );
};

const InputField = ({ label, name, type = "text", value, onChange, touched, required }) => (
  <div>
    <label className="block font-semibold mb-1">{label}{required && <span className="text-red-500">*</span>}</label>
    <input
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      className={`w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-400
        ${touched && required && (!value || value.toString().trim() === "") ? "border-red-500" : "border-gray-300"}`}
    />
    {touched && required && (!value || value.toString().trim() === "") && (
      <span className="text-red-500 text-xs">Este campo es obligatorio</span>
    )}
  </div>
);

export default ValoracionIngreso;
