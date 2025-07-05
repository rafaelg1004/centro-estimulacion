import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Paso1 from "./Paso1DatosPersonalesPerinatal";
import Paso2 from "./Paso2AntecedentesPerinatal";
import Paso3 from "./Paso3EstadoSaludPerinatal";
import Paso4 from "./Paso4EvaluacionFisioterapeuticaPerinatal";
import Paso5 from "./Paso5DiagnosticoIntervencionPerinatal";
import Paso6 from "./Paso6ConsentimientoFisicoPerinatal";
import Paso7 from "./Paso7ConsentimientoEducacionNacimientoPerinatal";
import Paso8 from "./Paso8ConsentimientoEducacionIntensivoPerinatal";
import Swal from "sweetalert2";
import Spinner from "../ui/Spinner"; // Asegúrate de que la ruta sea correcta

export default function EditarConsentimientoPerinatal() {
  console.log("EditarConsentimientoPerinatal montado");
  const { id } = useParams();
  const navigate = useNavigate();
  const [formulario, setFormulario] = useState(null);
  const [paso, setPaso] = useState(1);

  useEffect(() => {
    fetch(`http://18.216.20.125:4000/api/consentimiento-perinatal/${id}`)
      .then(res => res.json())
      .then(data => {
        console.log("Respuesta API:", data); // <-- Agrega esto
        if (Array.isArray(data.sesiones)) {
          data.sesiones.forEach((sesion, idx) => {
            data[`fechaSesion${idx + 1}`] = sesion.fecha || "";
            data[`firmaPacienteSesion${idx + 1}`] = sesion.firmaPaciente || "";
          });
        }
        if (Array.isArray(data.sesionesIntensivo)) {
          data.sesionesIntensivo.forEach((sesion, idx) => {
            data[`fechaSesionIntensivo${idx + 1}`] = sesion.fecha || "";
            data[`firmaPacienteSesionIntensivo${idx + 1}`] = sesion.firmaPaciente || "";
          });
        }
        setFormulario(data);
      });
  }, [id]);

  if (!formulario) return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-indigo-100 via-pink-100 to-green-100">
      <Spinner />
    </div>
  );

  const handleChange = (nuevo) => setFormulario(prev => ({ ...prev, ...nuevo }));

  const setFirma = (name, value) => {
    setFormulario(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();

    // Reconstruir arrays de sesiones
    const sesiones = [];
    for (let i = 1; i <= 10; i++) {
      if (formulario[`fechaSesion${i}`] || formulario[`firmaPacienteSesion${i}`]) {
        sesiones.push({
          nombre: `Sesión ${i}`,
          fecha: formulario[`fechaSesion${i}`] || "",
          firmaPaciente: formulario[`firmaPacienteSesion${i}`] || "",
        });
      }
    }

    const sesionesIntensivo = [];
    for (let i = 1; i <= 10; i++) {
      if (formulario[`fechaSesionIntensivo${i}`] || formulario[`firmaPacienteSesionIntensivo${i}`]) {
        sesionesIntensivo.push({
          nombre: `Sesión Intensivo ${i}`,
          fecha: formulario[`fechaSesionIntensivo${i}`] || "",
          firmaPaciente: formulario[`firmaPacienteSesionIntensivo${i}`] || "",
        });
      }
    }

    const dataToSend = {
      ...formulario,
      sesiones,
      sesionesIntensivo,
    };

    try {
      await fetch(`http://18.216.20.125:4000/api/consentimiento-perinatal/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSend),
      });
      await Swal.fire({
        icon: "success",
        title: "¡Actualizado!",
        text: "El formulario se Actualizo correctamente.",
        confirmButtonColor: "#6366f1"
      });
      navigate(`/consentimientos-perinatales/${id}`);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Error de conexión con el servidor.",
        confirmButtonColor: "#e53e3e"
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-pink-100 to-green-100 py-10 px-2">
      <form onSubmit={handleSubmit} className="max-w-4xl w-full mx-auto bg-white bg-opacity-90 p-8 rounded-3xl shadow-2xl border border-indigo-100">
        <h2 className="text-3xl font-extrabold mb-6 text-indigo-700 text-center drop-shadow">
          Editar Consentimiento Perinatal
        </h2>
        <div className="mb-6">
          {paso === 1 && (
            <Paso1
              formulario={formulario}
              handleChange={handleChange}
              siguiente={() => setPaso(2)}
              paciente={formulario.paciente}
            />
          )}
          {paso === 2 && (
            <Paso2
              formulario={formulario}
              handleChange={handleChange}
              anterior={() => setPaso(1)}
              siguiente={() => setPaso(3)}
            />
          )}
          {paso === 3 && (
            <Paso3
              formulario={formulario}
              handleChange={handleChange}
              anterior={() => setPaso(2)}
              siguiente={() => setPaso(4)}
            />
          )}
          {paso === 4 && (
            <Paso4
              formulario={formulario}
              handleChange={handleChange}
              anterior={() => setPaso(3)}
              siguiente={() => setPaso(5)}
            />
          )}
          {paso === 5 && (
            <Paso5
              formulario={formulario}
              setFirma={setFirma}
              handleChange={handleChange}
              anterior={() => setPaso(4)}
              siguiente={() => setPaso(6)}
            />
          )}
          {paso === 6 && (
            <Paso6
              formulario={formulario}
              setFirma={setFirma}
              handleChange={handleChange}
              anterior={() => setPaso(5)}
              onSubmit={() => setPaso(7)}
              paciente={formulario.paciente}
            />
          )}
          {paso === 7 && (
            <Paso7
              formulario={formulario}
              setFirma={setFirma}
              handleChange={handleChange}
              anterior={() => setPaso(6)}
              onSubmit={() => setPaso(8)}
              paciente={formulario.paciente}
            />
          )}
          {paso === 8 && (
            <Paso8
              formulario={formulario}
              setFirma={setFirma}
              handleChange={handleChange}
              anterior={() => setPaso(7)}
              onSubmit={handleSubmit}
              paciente={formulario.paciente}
            />
          )}
        </div>
      
      </form>
    </div>
  );
}