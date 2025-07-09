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
import { API_CONFIG, apiRequest } from "../config/api";

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
    diagnosticoFisioterapeutico: "",
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
    // Campos del nuevo desarrollo ontológico
    sostieneCabeza_si: false,
    sostieneCabeza_no: false,
    sostieneCabeza_observaciones: "",
    seVoltea_si: false,
    seVoltea_no: false,
    seVoltea_observaciones: "",
    seSientaSinApoyo_si: false,
    seSientaSinApoyo_no: false,
    seSientaSinApoyo_observaciones: "",
    gatea_si: false,
    gatea_no: false,
    gatea_observaciones: "",
    sePoneDePerApoyado_si: false,
    sePoneDePerApoyado_no: false,
    sePoneDePerApoyado_observaciones: "",
    caminaSolo_si: false,
    caminaSolo_no: false,
    caminaSolo_observaciones: "",
    correSalta_si: false,
    correSalta_no: false,
    correSalta_observaciones: "",
    sigueObjetosMirada_si: false,
    sigueObjetosMirada_no: false,
    sigueObjetosMirada_observaciones: "",
    llevaObjetosBoca_si: false,
    llevaObjetosBoca_no: false,
    llevaObjetosBoca_observaciones: "",
    pasaObjetosEntreManos_si: false,
    pasaObjetosEntreManos_no: false,
    pasaObjetosEntreManos_observaciones: "",
    pinzaSuperior_si: false,
    pinzaSuperior_no: false,
    pinzaSuperior_observaciones: "",
    encajaPiezasGrandes_si: false,
    encajaPiezasGrandes_no: false,
    encajaPiezasGrandes_observaciones: "",
    dibujaGarabatos_si: false,
    dibujaGarabatos_no: false,
    dibujaGarabatos_observaciones: "",
    balbucea_si: false,
    balbucea_no: false,
    balbucea_observaciones: "",
    diceMamaPapa_si: false,
    diceMamaPapa_no: false,
    diceMamaPapa_observaciones: "",
    senalaQueQuiere_si: false,
    senalaQueQuiere_no: false,
    senalaQueQuiere_observaciones: "",
    dice5a10Palabras_si: false,
    dice5a10Palabras_no: false,
    dice5a10Palabras_observaciones: "",
    entiendeOrdenesSimples_si: false,
    entiendeOrdenesSimples_no: false,
    entiendeOrdenesSimples_observaciones: "",
    usaFrases2Palabras_si: false,
    usaFrases2Palabras_no: false,
    usaFrases2Palabras_observaciones: "",
    sonrieSocialmente_si: false,
    sonrieSocialmente_no: false,
    sonrieSocialmente_observaciones: "",
    respondeNombre_si: false,
    respondeNombre_no: false,
    respondeNombre_observaciones: "",
    interesaOtrosNinos_si: false,
    interesaOtrosNinos_no: false,
    interesaOtrosNinos_observaciones: "",
    juegoSimbolico_si: false,
    juegoSimbolico_no: false,
    juegoSimbolico_observaciones: "",
    seDespideLanzaBesos_si: false,
    seDespideLanzaBesos_no: false,
    seDespideLanzaBesos_observaciones: "",
    nivelDesarrolloAcorde_si: false,
    nivelDesarrolloAcorde_no: false,
    areasRequierenAcompanamiento: "",
    actividadesSugeridasCasa: "",
    estimulacionEntornoDiario: "",
    seguimientoSugeridoFecha: "",
    rutinaDiaria: "",
  };
  const [formulario, setFormulario] = useState(FORMULARIO_INICIAL);
  const [touched, setTouched] = useState({});

  useEffect(() => {
    if (pacienteId && !formularioCargado) {
      apiRequest(`/pacientes/${pacienteId}`)
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

    try {
      // Crear una copia limpia del formulario principal
      let dataToSend = { ...formulario };

      // Lista de campos de firma en el formulario principal
      const firmasFormulario = [
        "firmaProfesional",
        "firmaRepresentante",
        "firmaAcudiente",
        "firmaFisioterapeuta",
        "firmaAutorizacion",
        // agrega aquí cualquier otro campo de firma que uses en el formulario principal
      ];

      // Lista de campos de firma en el consentimiento
      const firmasConsentimiento = [
        "consentimiento_firmaAcudiente",
        "consentimiento_firmaFisio",
        // agrega aquí cualquier otro campo de firma en consentimiento
      ];

      // Subir todas las firmas del formulario principal y actualizar dataToSend
      for (const campo of firmasFormulario) {
        if (dataToSend[campo] && dataToSend[campo].startsWith("data:image")) {
          console.log(`Subiendo nueva imagen para ${campo}`);
          dataToSend[campo] = await subirFirmaAS3(dataToSend[campo]);
        }
      }

      // Subir todas las firmas del consentimiento y actualizar dataToSend
      for (const campo of firmasConsentimiento) {
        if (consentimiento[campo] && consentimiento[campo].startsWith("data:image")) {
          console.log(`Subiendo nueva imagen para ${campo}`);
          dataToSend[campo] = await subirFirmaAS3(consentimiento[campo]);
        } else if (consentimiento[campo]) {
          // Si no es base64, mantener el valor actual
          dataToSend[campo] = consentimiento[campo];
        }
      }

      // Agregar información del consentimiento (no firmas)
      dataToSend.paciente = pacienteId;
      dataToSend.consentimiento_nombreAcudiente = consentimiento.consentimiento_nombreAcudiente;
      dataToSend.consentimiento_ccAcudiente = consentimiento.consentimiento_ccAcudiente;
      dataToSend.consentimiento_lugarExpedicion = consentimiento.consentimiento_lugarExpedicion;
      dataToSend.consentimiento_nombreNino = consentimiento.consentimiento_nombreNino;
      dataToSend.consentimiento_registroCivil = consentimiento.consentimiento_registroCivil;
      dataToSend.consentimiento_fecha = consentimiento.consentimiento_fecha;
      dataToSend.consentimiento_ccFirmaAcudiente = consentimiento.consentimiento_ccFirmaAcudiente;
      dataToSend.consentimiento_ccFirmaFisioterapeuta = consentimiento.consentimiento_ccFirmaFisioterapeuta;

      await apiRequest(
        "/valoraciones",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(dataToSend),
        }
      );
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

    const res = await fetch(`${API_CONFIG.BASE_URL}/api/upload`, {
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
