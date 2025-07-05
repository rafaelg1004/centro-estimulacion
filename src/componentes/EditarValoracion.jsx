import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Paso1DatosPaciente from "./valoraciondeingreso/Paso1DatosPaciente";
import Paso2Antecedentes from "./valoraciondeingreso/Paso2Antecedentes";
import Paso3Habitos from "./valoraciondeingreso/Paso3Habitos";
import Paso4Ontologico from "./valoraciondeingreso/Paso4Ontologico";
import Paso5Diagnostico from "./valoraciondeingreso/Paso5Diagnostico";
import Paso6Firmas from "./valoraciondeingreso/Paso6Firmas";
import Paso7Autorizacion from "./valoraciondeingreso/Paso7Autorizacion";
import Paso8Consentimiento from "./valoraciondeingreso/Paso8Consentimiento";

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
        className={`w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-base bg-indigo-50 shadow-sm
          ${touched && required && (!value || value.toString().trim() === "") ? "border-red-500" : "border-indigo-200"}
          ${disabled ? "bg-gray-100 text-gray-500 cursor-not-allowed" : ""}`}
      />
      {touched && required && (!value || value.toString().trim() === "") && (
        <span className="text-red-500 text-xs">Este campo es obligatorio</span>
      )}
    </div>
  );
};

export default function EditarValoracion() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [paso, setPaso] = useState(1);
  const [subPaso2, setSubPaso2] = useState(1);
  const [valoracion, setValoracion] = useState(null);
  const [touched, setTouched] = useState({});
  const [cargando, setCargando] = useState(true);
  const [mostrarConfirmarFinalizar, setMostrarConfirmarFinalizar] = useState(false);

  // Definir los arrays de firmas al inicio
  const firmasFormulario = [
    "firmaProfesional",
    "firmaRepresentante",
    "firmaAcudiente",
    "firmaFisioterapeuta",
    "firmaAutorizacion",
    // agrega aquí cualquier otro campo de firma que uses
  ];

  const firmasConsentimiento = [
    "consentimiento_firmaAcudiente",
    "consentimiento_firmaFisio",
    // agrega aquí cualquier otro campo de firma en consentimiento
  ];

  useEffect(() => {
    fetch(`/api/valoraciones/${id}`)
      .then(res => res.json())
      .then(data => {
        setValoracion(data);
        setCargando(false);
      });
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setValoracion((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Crear una copia limpia de la valoración
      let dataToSend = { ...valoracion };

      console.log('=== INICIANDO PROCESO DE GUARDADO ===');
      console.log('Datos actuales en el formulario:', dataToSend);

      // Obtener la valoración original una sola vez para comparar
      console.log('Obteniendo valoración original de la BD...');
      const valoracionOriginal = await fetch(`/api/valoraciones/${id}`)
        .then(res => res.json());
      
      console.log('Valoración original de la BD:', valoracionOriginal);

      // Subir todas las firmas del formulario principal y actualizar dataToSend
      console.log('Procesando firmas del formulario principal...');
      for (const campo of firmasFormulario) {
        console.log(`\n--- Procesando campo: ${campo} ---`);
        console.log(`Valor actual: ${dataToSend[campo] ? dataToSend[campo].substring(0, 50) + '...' : 'null'}`);
        console.log(`Valor original: ${valoracionOriginal[campo] ? valoracionOriginal[campo].substring(0, 50) + '...' : 'null'}`);
        
        if (dataToSend[campo] && dataToSend[campo].startsWith("data:image")) {
          console.log(`✓ ${campo} es base64, necesita subirse a S3`);
          
          // Si había una imagen anterior guardada, eliminarla
          if (valoracionOriginal[campo] && 
              valoracionOriginal[campo].includes('amazonaws.com') &&
              !valoracionOriginal[campo].startsWith("data:image")) {
            console.log(`✓ Hay imagen anterior en S3 para ${campo}: ${valoracionOriginal[campo]}`);
            console.log(`Eliminando imagen anterior...`);
            const resultadoEliminacion = await eliminarImagenDeS3(valoracionOriginal[campo]);
            console.log(`Resultado eliminación:`, resultadoEliminacion);
          } else if (valoracionOriginal[campo]) {
            console.log(`⚠️ Imagen original existe pero no es de S3: ${valoracionOriginal[campo].substring(0, 50)}...`);
          } else {
            console.log(`✗ No hay imagen anterior en ${campo} para eliminar`);
          }
          
          // Subir la nueva firma y reemplazar en dataToSend
          console.log(`Subiendo nueva imagen para ${campo}...`);
          const nuevaUrl = await subirFirmaAS3(dataToSend[campo]);
          console.log(`Nueva URL obtenida: ${nuevaUrl}`);
          dataToSend[campo] = nuevaUrl;
        } else {
          console.log(`✗ ${campo} no es base64, se mantiene sin cambios`);
        }
      }

      // Subir todas las firmas del consentimiento y actualizar dataToSend
      console.log('\nProcesando firmas del consentimiento...');
      for (const campo of firmasConsentimiento) {
        console.log(`\n--- Procesando campo consentimiento: ${campo} ---`);
        console.log(`Valor actual: ${dataToSend[campo] ? dataToSend[campo].substring(0, 50) + '...' : 'null'}`);
        console.log(`Valor original: ${valoracionOriginal[campo] ? valoracionOriginal[campo].substring(0, 50) + '...' : 'null'}`);
        
        if (dataToSend[campo] && dataToSend[campo].startsWith("data:image")) {
          console.log(`✓ ${campo} es base64, necesita subirse a S3`);
          
          // Si había una imagen anterior guardada, eliminarla
          if (valoracionOriginal[campo] && 
              valoracionOriginal[campo].includes('amazonaws.com') &&
              !valoracionOriginal[campo].startsWith("data:image")) {
            console.log(`✓ Hay imagen anterior en S3 para ${campo}: ${valoracionOriginal[campo]}`);
            console.log(`Eliminando imagen anterior...`);
            const resultadoEliminacion = await eliminarImagenDeS3(valoracionOriginal[campo]);
            console.log(`Resultado eliminación:`, resultadoEliminacion);
          } else if (valoracionOriginal[campo]) {
            console.log(`⚠️ Imagen original existe pero no es de S3: ${valoracionOriginal[campo].substring(0, 50)}...`);
          } else {
            console.log(`✗ No hay imagen anterior en ${campo} para eliminar`);
          }
          
          // Subir la nueva firma y reemplazar en dataToSend
          console.log(`Subiendo nueva imagen para ${campo}...`);
          const nuevaUrl = await subirFirmaAS3(dataToSend[campo]);
          console.log(`Nueva URL obtenida: ${nuevaUrl}`);
          dataToSend[campo] = nuevaUrl;
        } else {
          console.log(`✗ ${campo} no es base64, se mantiene sin cambios`);
        }
      }

      console.log('\n=== DATOS FINALES A ENVIAR ===');
      console.log('dataToSend final:', dataToSend);

      const response = await fetch(`/api/valoraciones/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSend),
      });

      if (!response.ok) {
        throw new Error('Error al actualizar la valoración');
      }

      navigate(`/valoraciones/${id}`);
    } catch (error) {
      console.error('Error al guardar la valoración:', error);
      alert('Error al guardar los cambios. Por favor, inténtalo de nuevo.');
    }
  };

  const onFirmaChange = (nombre, nuevaFirma) => {
    setValoracion(prev => ({
      ...prev,
      [nombre]: nuevaFirma
    }));
  };

  useEffect(() => {
    if (paso === 8 && valoracion) {
      setValoracion((prev) => ({
        ...prev,
        consentimiento_nombreAcudiente: prev.nombreAcudiente || "",
        consentimiento_ccAcudiente: prev.cedulaAcudiente || "",
        consentimiento_lugarExpedicion: prev.consentimiento_lugarExpedicion || "",
        consentimiento_nombreNino: prev.nombres || "",
        consentimiento_registroCivil: prev.registroCivil || "",
        consentimiento_fecha: prev.fecha || "",
        consentimiento_ccFirmaAcudiente: prev.cedulaAcudiente || "",
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paso]);

  if (cargando || !valoracion) return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-indigo-100 via-pink-100 to-green-100">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-indigo-600 border-solid"></div>
      <span className="mt-6 text-indigo-700 font-bold text-lg">Cargando valoración...</span>
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-pink-100 to-green-100 py-10 px-2">
      <form
        onSubmit={handleSubmit}
        className="max-w-4xl w-full mx-auto bg-white bg-opacity-90 p-8 rounded-3xl shadow-2xl border border-indigo-100"
      >
        <button
          type="button"
          onClick={() => navigate("/")}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-6 rounded-xl mb-4 shadow transition"
        >
          Volver al inicio
        </button>
        <h2 className="text-3xl font-extrabold text-center text-indigo-700 mb-4 drop-shadow">
          Editar Valoración
        </h2>
        <p className="text-center text-base text-gray-500 mb-6">
          Paso {paso}
        </p>

        {paso === 1 && (
          <Paso1DatosPaciente
            formulario={valoracion}
            handleChange={handleChange}
            touched={touched}
            camposObligatorios={[]}
            pasoCompleto={true}
            siguiente={() => setPaso(2)}
            InputField={InputField}
          />
        )}

        {paso === 2 && (
          <Paso2Antecedentes
            formulario={valoracion}
            handleChange={handleChange}
            touched={touched}
            camposObligatorios={[]}
            camposObligatoriosSubpaso2={{}}
            subPaso2={subPaso2}
            setSubPaso2={setSubPaso2}
            setPaso={setPaso}
            subPaso2Completo={true}
            subPaso2CompletoCampos={() => true}
            setTouched={setTouched}
            setFormulario={setValoracion}
            InputField={InputField}
          />
        )}
        {paso === 3 && (
          <Paso3Habitos
            formulario={valoracion}
            handleChange={handleChange}
            touched={touched}
            camposObligatorios={[]}
            pasoCompleto={true}
            setPaso={setPaso}
            InputField={InputField}
          />
        )}
        {paso === 4 && (
          <Paso4Ontologico
            formulario={valoracion}
            handleChange={handleChange}
            setFormulario={setValoracion}
            setPaso={setPaso}
            InputField={InputField}
          />
        )}
        {paso === 5 && (
          <Paso5Diagnostico
            formulario={valoracion}
            handleChange={handleChange}
            setPaso={setPaso}
          />
        )}
        {paso === 6 && (
          <Paso6Firmas
            formulario={valoracion}
            handleChange={handleChange}
            setFormulario={setValoracion}
            setPaso={setPaso}
            InputField={InputField}
            onFirmaChange={onFirmaChange}
          />
        )}
        {paso === 7 && (
          <Paso7Autorizacion
            formulario={valoracion}
            handleChange={handleChange}
            setFormulario={setValoracion}
            setPaso={setPaso}
            esEdicion={true}
            onFirmaChange={onFirmaChange}
            setMostrarConfirmarFinalizar={setMostrarConfirmarFinalizar}
          />
        )}
        {paso === 8 && (
          <Paso8Consentimiento
            valoracion={valoracion || {}}
            onChange={handleChange}
            consentimientoCompleto={true}
            onVolver={() => setPaso(7)}
            setFirmaConsentimiento={(name, data) => {
              setValoracion(prev => ({
                ...prev,
                [name]: data,
              }));
            }}
            esEdicion={true}
            onFinalizar={() => setMostrarConfirmarFinalizar(true)}
          />
        )}

        <div className="flex flex-col md:flex-row justify-center items-center gap-4 mt-8">
          {paso !== 8 && (
            <button
              type="button"
              onClick={() => setPaso(paso + 1)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-bold shadow transition"
            >
              Siguiente
            </button>
          )}
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold px-6 py-3 rounded-xl shadow transition"
          >
            Cancelar
          </button>
        </div>

        {mostrarConfirmarFinalizar && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
            <div className="bg-white border border-indigo-300 text-indigo-800 px-8 py-8 rounded-2xl shadow-lg flex flex-col items-center gap-6 max-w-md w-full">
              <h2 className="text-xl font-bold text-indigo-700 mb-2">¿Deseas guardar los cambios?</h2>
              <p className="mb-4 text-gray-700">
                Si continúas, se guardarán todos los cambios realizados en la valoración.<br />
                ¿Estás seguro de que deseas finalizar?
              </p>
              <div className="flex gap-4">
                <button
                  className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-xl shadow transition"
                  onClick={() => {
                    setMostrarConfirmarFinalizar(false);
                    document.querySelector("form").requestSubmit();
                  }}
                >
                  Sí, guardar
                </button>
                <button
                  className="bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-6 rounded-xl shadow transition"
                  onClick={() => setMostrarConfirmarFinalizar(false)}
                >
                  Cancelar
                </button>
              </div>
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

  const res = await fetch('/api/upload', {
    method: 'POST',
    body: formData,
  });
  const data = await res.json();
  return data.url; // URL pública de S3
}

async function eliminarImagenDeS3(imageUrl) {
  try {
    console.log(`Intentando eliminar imagen de S3: ${imageUrl}`);
    
    const res = await fetch('/api/delete-image', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ imageUrl }),
    });
    
    console.log(`Respuesta del servidor - Status: ${res.status}`);
    
    if (!res.ok) {
      const errorData = await res.json();
      console.error(`Error del servidor:`, errorData);
      throw new Error(`Error al eliminar imagen: ${errorData.error || res.statusText}`);
    }
    
    const data = await res.json();
    console.log(`✓ Imagen eliminada exitosamente:`, data);
    return data;
  } catch (error) {
    console.error('Error eliminando imagen de S3:', error);
    // No es crítico si falla la eliminación, continuamos con la subida
    return { error: error.message };
  }
}