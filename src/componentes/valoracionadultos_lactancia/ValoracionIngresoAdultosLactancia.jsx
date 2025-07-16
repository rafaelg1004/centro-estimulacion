import React, { useState, useEffect } from "react";
import { apiRequest, API_CONFIG } from "../../config/api";

import { useParams, useNavigate } from "react-router-dom";
import Paso1DatosPersonales from "./Paso1DatosPersonales.jsx";
import Paso2Antecedentes from "./Paso2Antecedentes.jsx";
import Paso3Lactancia from "./Paso3Lactancia.jsx";
import Paso4PlanIntervencion from "./Paso4PlanIntervencion.jsx";
import Paso5Autorizacion from "./Paso5Autorizacion.jsx";
import PasoLactanciaPrenatal from "./PasoLactanciaPrenatal.jsx";
import PasoConsentimientoLactancia from "./PasoConsentimientoLactancia.jsx";

const InputField = ({ label, name, type = "text", value, onChange, touched, required, disabled }) => {
  const id = `input-${name}`;
  return (
    <div>
      <label htmlFor={id} className="block font-semibold mb-1">
        {label}{required && <span className="text-red-500">*</span>}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`w-full px-4 py-3 rounded-xl border border-indigo-200 focus:ring-2 focus:ring-indigo-400 outline-none text-base bg-indigo-50 shadow-sm
          ${touched && required && (!value || value.toString().trim() === "") ? "border-red-500" : ""}
          ${disabled ? "bg-gray-100 text-gray-500 cursor-not-allowed" : ""}`}
      />
      {touched && required && (!value || value.toString().trim() === "") && (
        <span className="text-red-500 text-xs">Este campo es obligatorio</span>
      )}
    </div>
  );
};

const FORMULARIO_INICIAL = {
  nombres: "",
  cedula: "",
  telefono: "",
  correo: "",
  fecha: "",
  hora: "",
  motivoConsulta: "",
  // Datos personales adicionales
  genero: "",
  lugarNacimiento: "",
  fechaNacimiento: "",
  edad: "",
  estadoCivil: "",
  direccion: "",
  celular: "",
  ocupacion: "",
  nivelEducativo: "",
  medicoTratante: "",
  aseguradora: "",
  acompanante: "",
  telefonoAcompanante: "",
  nombreBebe: "",
  semanasGestacion: "",
  fum: "",
  fechaProbableParto: "",
  fechaPosibleNacimiento: "",
  sesion1: "",
  sesion2: "",
  firmaPacientePrenatal: "",

  // Antecedentes y ginecológicos
  hospitalarios: "",
  patologicos: "",
  familiares: "",
  traumaticos: "",
  farmacologicos: "",
  quirurgicos: "",
  toxicoAlergicos: "",
  numEmbarazos: "",
  numAbortos: "",
  numPartosVaginales: "",
  instrumentado: "",
  numCesareas: "",
  fechaObstetrico: "",
  peso: "",
  talla: "",
  episiotomia: "",
  desgarro: "",
  espacioEntreEmbarazos: "",
  actividadFisica: "",
  complicaciones: "",
  cirugiasPrevias: "",
  prolapsos: "",
  hormonales: "",
  anticonceptivos: "",
  // Paso 3: Lactancia
  experienciaLactancia: "",
  comoFueExperiencia: "",
  dificultadesLactancia: "",
  deseaAmamantar: "",
  expectativasAsesoria: "",
  conocimientosLactancia: "",
  pechosNormales: false,
  pechosDolorosos: false,
  pechosSecrecion: false,
  pechosCirugias: false,
  formaPezon: "",
  otraFormaPezon: "",
  observacionesFisicas: "",
  medicamentosActuales: "",
  afeccionesMedicas: "",
  apoyoFamiliar: "",
  // Paso 4: Plan de intervención
  planIntervencion: "",
  visitaCierre: "",
  firmaPaciente: "",
  firmaFisioterapeuta: "",
  firmaAutorizacion: "",
  fechaSesion1: "",
  firmaPacienteSesion1: "",
  fechaSesion2: "",
  firmaPacienteSesion2: "",
  firmaFisioterapeutaPlanIntervencion: "",
  firmaFisioterapeutaPrenatal: "",
  firmaPacientePrenatalFinal: "",
  // Consentimiento Lactancia
  fechaConsentimientoLactancia: "",
  firmaConsentimientoLactancia: "",
  firmaProfesionalConsentimientoLactancia: "",
  nombreProfesionalConsentimientoLactancia: "",
  registroProfesionalConsentimientoLactancia: "",
};

export default function ValoracionIngresoAdultosLactancia() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formulario, setFormulario] = useState(FORMULARIO_INICIAL);
  const [touched, setTouched] = useState({});
  const [paso, setPaso] = useState(1);

  // Traer datos del paciente adulto
  useEffect(() => {
    apiRequest(`/pacientes-adultos/${id}`)
      .then(data => setFormulario(prev => ({
        ...prev,
        ...data,
      })));
  }, [id]);

  const handleChange = (e) => {
    // Para los checkboxes personalizados del paso 3
    if (e && e.target && typeof e.target.value === "boolean") {
      const { name, value } = e.target;
      setFormulario((prev) => ({
        ...prev,
        [name]: value,
      }));
      setTouched((prev) => ({ ...prev, [name]: true }));
      return;
    }
    const { name, value } = e.target;
    setFormulario((prev) => ({
      ...prev,
      [name]: value,
    }));
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  const camposObligatorios = ["fecha", "hora", "motivoConsulta"];
  const pasoCompleto = camposObligatorios.every(
    (campo) => formulario[campo] && formulario[campo].toString().trim() !== ""
  );

  const siguiente = () => {
    if (!pasoCompleto) {
      const nuevosTouched = { ...touched };
      camposObligatorios.forEach((campo) => {
        if (!formulario[campo] || formulario[campo].toString().trim() === "") {
          nuevosTouched[campo] = true;
        }
      });
      setTouched(nuevosTouched);
      return;
    }
    setPaso((prev) => prev + 1);
  };

  const setFirma = (name, value) => {
    // Si recibe un objeto { name, value }
    if (typeof name === "object" && name !== null && "name" in name && "value" in name) {
      setFormulario(prev => ({
        ...prev,
        [name.name]: name.value,
      }));
    } else {
      // Si recibe (name, value)
      setFormulario(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();

    try {
      // Crear una copia limpia del formulario
      let dataToSend = { ...formulario };
      
      // Remover el _id si existe
      const { _id, ...formularioSinId } = dataToSend;
      dataToSend = formularioSinId;

      // Lista de campos de firma en este formulario
      const firmasFormulario = [
        "firmaPacientePrenatal",
        "firmaPaciente", 
        "firmaFisioterapeuta",
        "firmaAutorizacion",
        "firmaPacienteSesion1",
        "firmaPacienteSesion2",
        "firmaFisioterapeutaPlanIntervencion",
        "firmaFisioterapeutaPrenatal",
        "firmaPacientePrenatalFinal",
        "firmaConsentimientoLactancia",
        "firmaProfesionalConsentimientoLactancia"
      ];

      console.log('=== PROCESANDO FIRMAS LACTANCIA ===');
      
      // Procesar todas las firmas y subir a S3 si son base64
      for (const campo of firmasFormulario) {
        if (dataToSend[campo] && dataToSend[campo].startsWith("data:image")) {
          console.log(`Subiendo firma ${campo} a S3...`);
          dataToSend[campo] = await subirFirmaAS3(dataToSend[campo]);
          console.log(`✓ Firma ${campo} subida exitosamente`);
        }
      }

      // Agrega los datos fijos de la doctora
      dataToSend.nombreProfesionalConsentimientoLactancia = "Dayan Ivonne Villegas Gamboa";
      dataToSend.registroProfesionalConsentimientoLactancia = "52862625";

      console.log('Enviando datos al backend...');
      const res = await apiRequest("/valoracion-ingreso-adultos-lactancia", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSend),
      });
      
      if (!res.ok) throw new Error("Error en la respuesta del servidor");
      
      console.log('✓ Valoración guardada exitosamente');
      setFormulario(FORMULARIO_INICIAL);
      setPaso(1);
      navigate("/valoraciones-adultos-lactancia");
    } catch (error) {
      console.error("Error guardando valoración:", error);
      alert('Error al guardar la valoración. Por favor, inténtalo de nuevo.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-pink-100 to-green-100 py-10 px-2">
      <form className="max-w-3xl w-full mx-auto bg-white bg-opacity-90 p-8 rounded-3xl shadow-2xl border border-indigo-100"
        onSubmit={handleSubmit}
      >
        <h2 className="text-3xl font-extrabold text-center text-indigo-700 mb-4 drop-shadow">
          Valoración de Ingreso Asesoría en Lactancia
        </h2>
        <p className="text-center text-base text-gray-500 mb-6">
          Paso {paso}
        </p>
        {paso === 1 && (
          <Paso1DatosPersonales
            formulario={formulario}
            handleChange={handleChange}
            touched={touched}
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
            siguiente={() => setPaso(paso + 1)}
            anterior={() => setPaso(paso - 1)}
            InputField={InputField}
          />
        )}
        {paso === 3 && (
          <Paso3Lactancia
            formulario={formulario}
            handleChange={handleChange}
            touched={touched}
            siguiente={() => setPaso(paso + 1)}
            anterior={() => setPaso(paso - 1)}
            InputField={InputField}
          />
        )}
        {paso === 4 && (
          <Paso4PlanIntervencion
            formulario={formulario}
            setFirma={setFirma}
            anterior={() => setPaso(paso - 1)}
            siguiente={() => setPaso(paso + 1)}
          />
        )}
        {paso === 5 && (
          <Paso5Autorizacion
            formulario={formulario}
            setFirma={setFirma}
            anterior={() => setPaso(paso - 1)}
            siguiente={() => setPaso(paso + 1)}
            onSubmit={handleSubmit}
          />
        )}
        {paso === 6 && (
          <PasoLactanciaPrenatal
            formulario={formulario}
            setFirma={setFirma}
            handleChange={handleChange}
            anterior={() => setPaso(paso - 1)}
            onSubmit={() => setPaso(7)} // <-- Esto permite avanzar al paso 7
            InputField={InputField}
          />
        )}
        {paso === 7 && (
          <PasoConsentimientoLactancia
            formulario={formulario}
            handleChange={handleChange}
            setFirma={setFirma}
            anterior={() => setPaso(paso - 1)}
            onSubmit={handleSubmit}
            InputField={InputField}
          />
        )}
        
      </form>
    </div>
  );
}

async function subirFirmaAS3(firmaBase64) {
  function dataURLtoFile(dataurl, filename) {
    const arr = dataurl.split(",");
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