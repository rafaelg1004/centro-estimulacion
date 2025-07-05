import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Paso1DatosPersonales from "./Paso1DatosPersonales.jsx";
import Paso2Antecedentes from "./Paso2Antecedentes.jsx";
import Paso3Lactancia from "./Paso3Lactancia.jsx";
import Paso4PlanIntervencion from "./Paso4PlanIntervencion.jsx";
import Paso5Autorizacion from "./Paso5Autorizacion.jsx";
import PasoLactanciaPrenatal from "./PasoLactanciaPrenatal.jsx";
import PasoConsentimientoLactancia from "./PasoConsentimientoLactancia.jsx";
import Swal from 'sweetalert2';

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
    fetch(`http://18.216.20.125:4000/api/pacientes-adultos/${id}`)
      .then(res => res.json())
      .then(data => setFormulario(prev => ({
        ...prev,
        ...data, // Esto copia todos los campos del paciente adulto
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

    // Agrega aquí los datos fijos de la doctora
    const { _id, ...formularioSinId } = formulario;
    formularioSinId.nombreProfesionalConsentimientoLactancia = "Dayan Ivonne Villegas Gamboa";
    formularioSinId.registroProfesionalConsentimientoLactancia = "52862625";

    // Ahora sí, envía los datos al backend
    try {
      const res = await fetch("http://18.216.20.125:4000/api/valoracion-ingreso-adultos-lactancia", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formularioSinId),
      });
      if (!res.ok) throw new Error("Error en la respuesta del servidor");
      // Opcional: await res.json();
      // Mostrar SweetAlert de éxito si quieres
      // Swal.fire('¡Guardado!', 'La valoración fue guardada correctamente.', 'success');
      setFormulario(FORMULARIO_INICIAL);
      setPaso(1);
      navigate("/valoraciones-adultos-lactancia");
    } catch (error) {
      // Manejo de error
      // Swal.fire('Error', 'Ocurrió un error al guardar la valoración.', 'error');
      console.error("Error en fetch:", error);
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