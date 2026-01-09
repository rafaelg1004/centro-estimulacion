import React, { useRef, useState } from "react";
import SignatureCanvas from "react-signature-canvas";
import { API_CONFIG } from "../../config/api";

const FirmaCanvas = ({ label, name, setFormulario, formulario, onFirmaChange }) => {
  const sigRef = useRef();
  const [subiendo, setSubiendo] = useState(false);

  // Función para subir firma a S3
  const subirFirmaAS3 = async (firmaBase64) => {
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
  };

  // Función para eliminar imagen anterior de S3
  const eliminarImagenDeS3 = async (imageUrl) => {
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
  };

  // Guardar firma subiendo a S3
  const guardarFirma = async () => {
    if (sigRef.current && !sigRef.current.isEmpty()) {
      setSubiendo(true);
      try {
        const firmaBase64 = sigRef.current.getTrimmedCanvas().toDataURL("image/png");
        
        // Si ya hay una firma anterior, eliminarla de S3
        if (formulario[name] && typeof formulario[name] === 'string' && formulario[name].includes('amazonaws.com')) {
          console.log(`Eliminando firma anterior de S3: ${formulario[name]}`);
          await eliminarImagenDeS3(formulario[name]);
        }
        
        // Subir nueva firma a S3
        console.log(`Subiendo nueva firma a S3...`);
        const urlS3 = await subirFirmaAS3(firmaBase64);
        console.log(`✓ Firma subida a S3: ${urlS3}`);
        
        setFormulario(name, urlS3);
        if (typeof onFirmaChange === "function") {
          onFirmaChange(name, urlS3, true);
        }
      } catch (error) {
        console.error('Error al procesar firma:', error);
        alert('Error al guardar la firma. Inténtalo de nuevo.');
      } finally {
        setSubiendo(false);
      }
    }
  };

  const limpiarFirma = async () => {
    if (sigRef.current) sigRef.current.clear();
    
    // Si hay una firma guardada como URL de S3, eliminarla
    if (formulario[name] && typeof formulario[name] === 'string' && formulario[name].includes('amazonaws.com')) {
      console.log(`Eliminando firma de S3: ${formulario[name]}`);
      await eliminarImagenDeS3(formulario[name]);
    }
    
    setFormulario(name, "");
  };

  // Si ya hay una firma guardada, mostrar la imagen y opción de editar
  if (formulario[name]) {
    return (
      <div className="flex flex-col items-center mb-2">
        <img
          src={formulario[name]}
          alt={label}
          className="border border-indigo-400 rounded bg-white mb-2"
          style={{ width: 340, height: 120, objectFit: "contain" }}
        />
        <span className="text-xs text-gray-700">{label} (guardada)</span>
        <button
          type="button"
          className="mt-2 text-xs bg-yellow-400 hover:bg-yellow-500 text-black px-3 py-1 rounded"
          onClick={limpiarFirma}
        >
          Editar firma
        </button>
      </div>
    );
  }

  // Si no hay firma, mostrar el pad y el botón guardar
  return (
    <div className="flex flex-col items-center mb-2">
      <SignatureCanvas
        penColor="black"
        canvasProps={{
          width: 340,
          height: 120,
          className: "border border-indigo-400 rounded bg-white"
        }}
        ref={sigRef}
      />
      <div className="flex gap-2 mt-2">
        <button
          type="button"
          className="text-xs bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded disabled:opacity-50"
          onClick={guardarFirma}
          disabled={subiendo}
        >
          {subiendo ? 'Guardando...' : 'Guardar firma'}
        </button>
        <button
          type="button"
          className="text-xs bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded"
          onClick={limpiarFirma}
        >
          Limpiar
        </button>
      </div>
      <span className="text-xs text-gray-700">{label}</span>
    </div>
  );
};

export default FirmaCanvas;