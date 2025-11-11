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
import FirmaCanvas from "../valoraciondeingreso/FirmaCanvas";

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
  fechaConsentimientoLactancia: "",
  firmaConsentimientoLactancia: "",
  firmaProfesionalConsentimientoLactancia: "",
  nombreProfesionalConsentimientoLactancia: "",
  registroProfesionalConsentimientoLactancia: "",
};

export default function EditarValoracionIngresoAdultosLactancia() {
  const { id } = useParams();
  const [formulario, setFormulario] = useState(FORMULARIO_INICIAL);
  const [touched, setTouched] = useState({});
  const [paso, setPaso] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    apiRequest(`/valoracion-ingreso-adultos-lactancia/${id}`)
      .then(res => res.json())
      .then(data => setFormulario(prev => ({
        ...prev,
        ...data,
      })));
  }, [id]);

  const handleChange = (e) => {
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
      // Crear una copia limpia de la valoración
      let dataToSend = { ...formulario };
      
      // Remover el _id
      const { _id, ...formularioSinId } = dataToSend;
      dataToSend = formularioSinId;

      // Obtener la valoración original para comparar imágenes
      console.log('Obteniendo valoración original de la BD...');
      const valoracionOriginal = await apiRequest(`/valoracion-ingreso-adultos-lactancia/${id}`)
        .then(res => res.json());

      // Lista de campos de firma
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

      console.log('=== PROCESANDO FIRMAS LACTANCIA (EDICIÓN) ===');
      
      // Procesar todas las firmas
      for (const campo of firmasFormulario) {
        if (dataToSend[campo] && dataToSend[campo].startsWith("data:image")) {
          console.log(`Procesando firma ${campo} - es base64, necesita subirse a S3`);
          
          // Si había una imagen anterior, eliminarla
          if (valoracionOriginal[campo] && 
              valoracionOriginal[campo].includes('amazonaws.com') &&
              !valoracionOriginal[campo].startsWith("data:image")) {
            console.log(`Eliminando imagen anterior para ${campo}: ${valoracionOriginal[campo]}`);
            await eliminarImagenDeS3(valoracionOriginal[campo]);
          }
          
          // Subir la nueva firma
          console.log(`Subiendo nueva imagen para ${campo}`);
          dataToSend[campo] = await subirFirmaAS3(dataToSend[campo]);
        }
      }

      console.log('Enviando datos actualizados al backend...');
      const res = await apiRequest(`/valoracion-ingreso-adultos-lactancia/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      });

      if (!res.ok) throw new Error("Error en la respuesta del servidor");
      
      console.log('✓ Valoración actualizada exitosamente');
      navigate(`/valoracion-ingreso-adultos-lactancia/${id}`);
    } catch (error) {
      console.error("Error actualizando valoración:", error);
      alert('Error al actualizar la valoración. Por favor, inténtalo de nuevo.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-pink-100 to-green-100 py-10 px-2">
      <form className="max-w-3xl w-full mx-auto bg-white bg-opacity-90 p-8 rounded-3xl shadow-2xl border border-indigo-100"
        onSubmit={handleSubmit}
      >
        <h2 className="text-3xl font-extrabold text-center text-indigo-700 mb-4 drop-shadow">
          Editar Valoración de Ingreso Asesoría en Lactancia
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
            onSubmit={() => setPaso(7)}
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
            esUltimoPaso={true}
          />
        )}
        {paso === 8 && (
          <div>
            <h3 className="text-2xl font-bold text-center text-indigo-700 mb-4">
              Firma del Paciente
            </h3>
            <div className="border-t border-indigo-300 my-4"></div>
            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2">
                Firma:
              </label>
              <FirmaCanvas
                onEnd={(dataURL) => setFirma("firmaPaciente", dataURL)}
                className="border-2 border-indigo-300 rounded-lg"
              />
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => setPaso(paso - 1)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg shadow-md hover:bg-gray-300 transition-colors mr-2"
              >
                Anterior
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 transition-colors"
              >
                Guardar y Finalizar
              </button>
            </div>
          </div>
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

async function eliminarImagenDeS3(imageUrl) {
  try {
    console.log(`Intentando eliminar imagen de S3: ${imageUrl}`);
    
    const res = await fetch(`${API_CONFIG.BASE_URL}/api/delete-image`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ imageUrl }),
    });
    
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(`Error al eliminar imagen: ${errorData.error || res.statusText}`);
    }
    
    const data = await res.json();
    console.log(`✓ Imagen eliminada exitosamente:`, data);
    return data;
  } catch (error) {
    console.error('Error eliminando imagen de S3:', error);
    return { error: error.message };
  }
}