import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Paso1DatosPaciente from "./valoraciondeingreso/Paso1DatosPaciente";
import Paso2Antecedentes from "./valoraciondeingreso/Paso2Antecedentes";
import Paso3Habitos from "./valoraciondeingreso/Paso3Habitos";
import Paso4Ontologico from "./valoraciondeingreso/Paso4Ontologico";
import Paso5Diagnostico from "./valoraciondeingreso/Paso5Diagnostico";
import Paso6Firmas from "./valoraciondeingreso/Paso6Firmas";
import Paso7Autorizacion from "./valoraciondeingreso/Paso7Autorizacion";
import Paso8Consentimiento from "./valoraciondeingreso/Paso8Consentimiento";

const InputField = ({
  label,
  name,
  value,
  onChange,
  touched,
  required,
  type = "text",
  options = [],
  ...rest
}) => (
  <div>
    <label className="block text-sm font-semibold mb-1" htmlFor={name}>
      {label}
    </label>
    {type === "select" ? (
      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        {...rest}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    ) : (
      <input
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        type={type}
        className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        {...rest}
      />
    )}
    {touched && required && (!value || value === "") && (
      <span className="text-red-500 text-xs">Este campo es obligatorio</span>
    )}
  </div>
);

const ValoracionIngreso = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const pacienteId = params.get("paciente");
  const [paso, setPaso] = useState(1);
  const [subPaso2, setSubPaso2] = useState(1);
  const [formularioCargado, setFormularioCargado] = useState(false);
  const [mostrarBanner, setMostrarBanner] = useState(false);
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);
  const [consentimiento, setConsentimiento] = useState({
    consentimiento_nombreAcudiente: "",
    consentimiento_ccAcudiente: "",
    consentimiento_lugarExpedicion: "",
    consentimiento_nombreNino: "",
    consentimiento_registroCivil: "",
    consentimiento_fecha: "",
    consentimiento_firmaAcudiente: "",
    consentimiento_ccFirmaAcudiente: "",
    consentimiento_firmaFisio: "",
    consentimiento_ccFirmaFisioterapeuta: "",
  });

  const FORMULARIO_INICIAL = {
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
    nombreFisioterapeuta: "Ft. Dayan Ivonne Villegas Gamboa",
    cedulaFisioterapeuta: "52862625",
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
  };
  const [formulario, setFormulario] = useState(FORMULARIO_INICIAL);
  const [touched, setTouched] = useState({});

  useEffect(() => {
    if (pacienteId && !formularioCargado) {
      fetch(
        `http://18.216.20.125:4000/api/pacientes/${pacienteId}`
      )
        .then((res) => res.json())
        .then((data) => {
          setFormulario((f) => ({
            ...f,
            nombres: data.nombres || "",
            registroCivil: data.registroCivil || "",
            genero: data.genero || "",
            nacimiento:
              (data.lugarNacimiento ? data.lugarNacimiento + " " : "") +
              (data.fechaNacimiento || ""),
            edad: data.edad || "",
            peso: data.peso || "",
            talla: data.talla || "",
            direccion: data.direccion || "",
            telefono: data.telefono || "",
            celular: data.celular || "",
            pediatra: data.pediatra || "",
            aseguradora: data.aseguradora || "",
            madreNombre: data.nombreMadre || "",
            madreEdad: data.edadMadre || "",
            madreOcupacion: data.ocupacionMadre || "",
            padreNombre: data.nombrePadre || "",
            padreEdad: data.edadPadre || "",
            padreOcupacion: data.ocupacionPadre || "",
          }));
          setFormularioCargado(true);
        });
    }
  }, [pacienteId, formularioCargado]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormulario((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (paso === 8) {
      setMostrarConfirmacion(true);
      return;
    }
    // ...el resto del submit si no es paso 8...
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

      "problemasComer",

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

  const camposConsentimiento = [
    "consentimiento_registroCivil",
    "consentimiento_fecha",
  ];
  const consentimientoCompleto = camposConsentimiento.every(
    (campo) => consentimiento[campo] && consentimiento[campo].toString().trim() !== ""
  );

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

  const handleConsentimientoChange = (e) => {
    const { name, value } = e.target;
    setConsentimiento((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const setFirmaConsentimiento = (name, dataURL) => {
    setConsentimiento((prev) => ({
      ...prev,
      [name]: dataURL,
    }));
  };

  useEffect(() => {
    if (paso === 8) {
      setConsentimiento((prev) => ({
        ...prev,
        consentimiento_nombreAcudiente: formulario.nombreAcudiente || "",
        consentimiento_ccAcudiente: formulario.cedulaAcudiente || "",
        consentimiento_nombreNino: formulario.nombres || "",
        consentimiento_registroCivil: formulario.registroCivil || "",
        consentimiento_ccFisioterapeuta: formulario.cedulaFisioterapeuta || "",
      }));
    }
  }, [paso, formulario]);

  useEffect(() => {
    if (paso === 8) {
      console.log("NOMBRE ACUDIENTE ACTUALIZADO:", consentimiento.nombreAcudiente);
    }
  }, [consentimiento.nombreAcudiente, paso]);

  const confirmarGuardado = async () => {
    setMostrarConfirmacion(false);

    // Subir la firma a S3 si está en base64
    let firmaUrl = formulario.firmaFisioterapeuta;
    if (firmaUrl && firmaUrl.startsWith("data:image")) {
      firmaUrl = await subirFirmaAS3(firmaUrl);
    }

    // Si tienes más firmas, repite el proceso para cada una:
    let firmaRepresentanteUrl = formulario.firmaRepresentante;
    if (firmaRepresentanteUrl && firmaRepresentanteUrl.startsWith("data:image")) {
      firmaRepresentanteUrl = await subirFirmaAS3(firmaRepresentanteUrl);
    }

    // Construye el objeto final para guardar
    const dataToSend = {
      ...formulario,
      paciente: pacienteId,
      firmaFisioterapeuta: firmaUrl,
      firmaRepresentante: firmaRepresentanteUrl,
      consentimiento_nombreAcudiente: consentimiento.consentimiento_nombreAcudiente,
      consentimiento_ccAcudiente: consentimiento.consentimiento_ccAcudiente,
      consentimiento_lugarExpedicion: consentimiento.consentimiento_lugarExpedicion,
      consentimiento_nombreNino: consentimiento.consentimiento_nombreNino,
      consentimiento_registroCivil: consentimiento.consentimiento_registroCivil,
      consentimiento_fecha: consentimiento.consentimiento_fecha,
      consentimiento_firmaAcudiente: consentimiento.consentimiento_firmaAcudiente,
      consentimiento_ccFirmaAcudiente: consentimiento.consentimiento_ccFirmaAcudiente,
      consentimiento_firmaFisio: consentimiento.consentimiento_firmaFisio,
      consentimiento_ccFirmaFisioterapeuta: consentimiento.consentimiento_ccFirmaFisioterapeuta,
    };

    try {
      const response = await fetch(
        "http://18.216.20.125:4000/api/valoraciones",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(dataToSend),
        }
      );
      if (!response.ok) throw new Error("Error al guardar");
      setMostrarBanner(true);
      setFormulario(FORMULARIO_INICIAL);
      setConsentimiento({
        consentimiento_nombreAcudiente: "",
        consentimiento_ccAcudiente: "",
        consentimiento_lugarExpedicion: "",
        consentimiento_nombreNino: "",
        consentimiento_registroCivil: "",
        consentimiento_fecha: "",
        consentimiento_firmaAcudiente: "",
        consentimiento_ccFirmaAcudiente: "",
        consentimiento_firmaFisio: "",
        consentimiento_ccFirmaFisioterapeuta: "",
      });
      setPaso(1);
    } catch (error) {
      alert("Error al enviar valoración");
      console.error(error);
    }
  };

  const onFirmaChange = (name, dataURL) => {
    setFormulario((prev) => ({
      ...prev,
      [name]: dataURL,
    }));
  };

  async function subirFirmaAS3(firmaBase64) {
    if (!firmaBase64) return "";
    function dataURLtoFile(dataurl, filename) {
      const arr = dataurl.split(',');
      const mime = arr[0].match(/:(.*?);/)[1];
      const bstr = atob(arr[1]);
      let n = bstr.length;
      const u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new File([u8arr], filename, { type: mime });
    }
    const file = dataURLtoFile(firmaBase64, 'firma.png');
    const formData = new FormData();
    formData.append('imagen', file);

    const res = await fetch('http://18.216.20.125:4000/api/upload', {
      method: 'POST',
      body: formData,
    });
    const data = await res.json();
    return data.url; // URL pública de S3
  }

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
        <Paso1DatosPaciente
          formulario={formulario}
          handleChange={handleChange}
          touched={touched}
          camposObligatorios={camposObligatorios[1]}
          pasoCompleto={pasoCompleto}
          siguiente={siguiente}
          InputField={InputField}
        />
      )}

      {paso === 2 && (
        <Paso2Antecedentes
          formulario={formulario}
          handleChange={handleChange}
          touched={touched}
          camposObligatorios={camposObligatorios[2]}
          camposObligatoriosSubpaso2={camposObligatoriosSubpaso2}
          subPaso2={subPaso2}
          setSubPaso2={setSubPaso2}
          setPaso={setPaso}
          subPaso2Completo={subPaso2Completo}
          subPaso2CompletoCampos={subPaso2CompletoCampos}
          setTouched={setTouched}
          setFormulario={setFormulario}
          InputField={InputField}
        />
      )}
      {paso === 3 && (
        <Paso3Habitos
          formulario={formulario}
          handleChange={handleChange}
          touched={touched}
          camposObligatorios={camposObligatorios[3]}
          pasoCompleto={pasoCompleto}
          setPaso={setPaso}
          InputField={InputField}
          setFormulario={setFormulario} // <-- AGREGA ESTA LÍNEA
        />
      )}
      {paso === 4 && (
        <Paso4Ontologico
          formulario={formulario}
          handleChange={handleChange}
          setFormulario={setFormulario}
          setPaso={setPaso}
          InputField={InputField}
        />
      )}
      {paso === 5 && (
        <Paso5Diagnostico
          formulario={formulario}
          handleChange={handleChange}
          setPaso={setPaso}
        />
      )}
      {paso === 6 && (
        <Paso6Firmas
          formulario={formulario}
          handleChange={handleChange}
          setFormulario={setFormulario}
          setPaso={setPaso}
          InputField={InputField}
          onFirmaChange={onFirmaChange}
        />
      )}
      {paso === 7 && (
        <Paso7Autorizacion
          formulario={formulario}
          handleChange={handleChange}
          setFormulario={setFormulario}
          setPaso={setPaso}
          onFirmaChange={onFirmaChange}
        />
      )}
      {paso === 8 && (
        <Paso8Consentimiento
          consentimiento={consentimiento || {}}
          fortmulario={formulario}
          onChange={handleConsentimientoChange}
          consentimientoCompleto={consentimientoCompleto}
          onVolver={() => setPaso(7)}
          setFirmaConsentimiento={setFirmaConsentimiento}
          esEdicion={false}
        />
      )}

      {mostrarBanner && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <h2 className="text-2xl font-bold text-green-600 mb-4">
              ¡Guardado con éxito!
            </h2>
            <p className="mb-6">La valoración se guardó correctamente.</p>
            <button
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded"
              onClick={() => {
                setMostrarBanner(false);
                navigate("/valoraciones"); // Cambia la ruta según tu app
              }}
            >
              Aceptar
            </button>
          </div>
        </div>
      )}

      {mostrarConfirmacion && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-sm w-full text-center">
            <h2 className="text-lg font-bold mb-4">
              ¿Deseas guardar los datos de la valoración?
            </h2>
            <div className="flex justify-center gap-4">
              <button
                className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
                onClick={confirmarGuardado}
              >
                Sí, guardar
              </button>
              <button
                className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
                onClick={() => setMostrarConfirmacion(false)}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </form>
  );
};

export default ValoracionIngreso;
