import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Paso1DatosPersonalesPerinatal from "./Paso1DatosPersonalesPerinatal";
import Paso2AntecedentesPerinatal from "./Paso2AntecedentesPerinatal";
import Paso3EstadoSaludPerinatal from "./Paso3EstadoSaludPerinatal";
import Paso4EvaluacionFisioterapeuticaPerinatal from "./Paso4EvaluacionFisioterapeuticaPerinatal";
import Paso5DiagnosticoIntervencionPerinatal from "./Paso5DiagnosticoIntervencionPerinatal";
import Paso6ConsentimientoFisicoPerinatal from "./Paso6ConsentimientoFisicoPerinatal";
import Paso7ConsentimientoEducacionNacimientoPerinatal from "./Paso7ConsentimientoEducacionNacimientoPerinatal";
import Paso8ConsentimientoEducacionIntensivoPerinatal from "./Paso8ConsentimientoEducacionIntensivoPerinatal";
import Swal from "sweetalert2";

const FORMULARIO_INICIAL = {
  fecha: "",
  hora: "",
  motivoConsulta: "",
  firmaPacienteGeneral: "",
  // ...todos los campos de todos los pasos...
};

export default function ValoracionIngresoProgramaPerinatal() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formulario, setFormulario] = useState(FORMULARIO_INICIAL);
  const [paciente, setPaciente] = useState(null);
  const [paso, setPaso] = useState(1);

  useEffect(() => {
    fetch(`http://18.216.20.125:4000/api/pacientes-adultos/${id}`)
      .then(res => res.json())
      .then(data => setPaciente(data));
  }, [id]);

  const handleChange = (e) => {
    // Si es evento de input
    if (e && e.target) {
      const { name, value, type, checked } = e.target;
      setFormulario((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
    // Si es objeto directo { campo: valor }
    else if (typeof e === "object" && e !== null) {
      setFormulario((prev) => ({
        ...prev,
        ...e,
      }));
    }
  };

  const setFirma = (name, value) => {
    setFormulario(prev => ({
      ...prev,
      [name]: value,
    }));
  };
//const handleSiguiente = () => {
  //console.log("Avanzando al paso 6");
  //setPaso(6);
//};
  const siguiente = () => setPaso((prev) => prev + 1);
  const anterior = () => setPaso((prev) => prev - 1);

  const handleSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();

    try {
      const datosAEnviar = {
        ...formulario,
        paciente: paciente._id,
      };
      console.log("Datos que se envían al backend:", datosAEnviar);

      const response = await fetch("http://18.216.20.125:4000/api/consentimiento-perinatal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datosAEnviar),
      });
      if (response.ok) {
        await Swal.fire({
          icon: "success",
          title: "¡Guardado!",
          text: "El formulario se guardó correctamente.",
          confirmButtonColor: "#6366f1"
        });
        navigate("/consentimientos-perinatales");
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Error al guardar el formulario.",
          confirmButtonColor: "#e53e3e"
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Error de conexión con el servidor.",
        confirmButtonColor: "#e53e3e"
      });
    }
  };

  if (!paciente) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[200px] bg-gradient-to-br from-indigo-100 via-pink-100 to-green-100">
        <div className="animate-spin rounded-full h-8 w-8 border-t-4 border-indigo-600 border-solid"></div>
        <span className="mt-4 text-indigo-700 font-bold">Cargando datos del paciente...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-pink-100 to-green-100 py-10 px-2">
      <form className="max-w-3xl w-full mx-auto bg-white bg-opacity-90 p-8 rounded-3xl shadow-2xl border border-indigo-100"
        onSubmit={handleSubmit}
      >
        <h2 className="text-3xl font-extrabold text-center text-indigo-700 mb-4 drop-shadow">
          Valoración de Ingreso Programa Perinatal
        </h2>
        <p className="text-center text-base text-gray-500 mb-6">
          Paso {paso} de 8
        </p>
        {paso === 1 && (
          <Paso1DatosPersonalesPerinatal
            formulario={formulario}
            handleChange={handleChange}
            siguiente={siguiente}
            paciente={paciente}
          />
        )}
        {paso === 2 && (
          <Paso2AntecedentesPerinatal
            formulario={formulario}
            handleChange={handleChange}
            siguiente={siguiente}
            anterior={anterior}
          />
        )}
        {paso === 3 && (
          <Paso3EstadoSaludPerinatal
            formulario={formulario}
            handleChange={handleChange}
            siguiente={siguiente}
            anterior={anterior}
          />
        )}
        {paso === 4 && (
          <Paso4EvaluacionFisioterapeuticaPerinatal
            formulario={formulario}
            handleChange={handleChange}
            siguiente={siguiente}
            anterior={anterior}
          />
        )}
        {paso === 5 && (
          <Paso5DiagnosticoIntervencionPerinatal
            formulario={formulario}
            setFirma={setFirma}
            handleChange={handleChange}
            anterior={() => setPaso(4)}
            siguiente={() => setPaso(6)} // <-- ¡ESTO ES LO IMPORTANTE!
          />
        )}
        {paso === 6 && (
          <Paso6ConsentimientoFisicoPerinatal
            formulario={formulario}
            handleChange={handleChange}
            setFirma={setFirma}
            anterior={anterior}
            onSubmit={siguiente}
            paciente={paciente}
          />
        )}
        {paso === 7 && (
          <Paso7ConsentimientoEducacionNacimientoPerinatal
            formulario={formulario}
            handleChange={handleChange}
            setFirma={setFirma}
            anterior={anterior}
            onSubmit={siguiente}
            paciente={paciente}
          />
        )}
        {paso === 8 && (
          <Paso8ConsentimientoEducacionIntensivoPerinatal
            formulario={formulario}
            handleChange={handleChange}
            setFirma={setFirma}
            anterior={anterior}
            onSubmit={handleSubmit}
            paciente={paciente}
          />
        )}
       
      </form>
    </div>
  );
}