import React, { useRef, useState } from "react";
import SignatureCanvas from "react-signature-canvas";

const FirmaCanvas = ({ label, name, setFormulario, formulario, onFirmaChange }) => {
  const sigRef = useRef();
  const [mostrarConfirmarEditar, setMostrarConfirmarEditar] = useState(false);
  const [subiendo, setSubiendo] = useState(false);

  // Convierte base64 a archivo
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

  const guardarFirma = async () => {
    if (
      typeof setFormulario === "function" &&
      sigRef.current &&
      !sigRef.current.isEmpty()
    ) {
      const nuevaFirma = sigRef.current.getTrimmedCanvas().toDataURL("image/png");
      setSubiendo(true);
      try {
        // 1. Convierte base64 a archivo
        const file = dataURLtoFile(nuevaFirma, 'firma.png');
        const formData = new FormData();
        formData.append('imagen', file);

        // 2. Sube el archivo al backend
        const res = await fetch('http://18.216.20.125:4000/api/upload', {
          method: 'POST',
          body: formData,
        });
        const data = await res.json();

        // 3. Guarda solo la URL en el formulario
        setFormulario(name, data.url);
        if (typeof onFirmaChange === "function") {
          onFirmaChange(name, data.url, true);
        }
      } catch (error) {
        alert("Error subiendo la firma. Intenta de nuevo.");
      }
      setSubiendo(false);
    }
  };

  const limpiarFirma = () => {
    if (sigRef.current) sigRef.current.clear();
  };

  // Confirmar antes de editar la firma existente
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
          onClick={() => setMostrarConfirmarEditar(true)}
        >
          Editar firma
        </button>

        {/* Modal de confirmación para editar */}
        {mostrarConfirmarEditar && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 max-w-xs w-full text-center">
              <h2 className="text-base font-bold mb-4">¿Estás seguro de editar la firma?</h2>
              <p className="mb-4 text-sm text-gray-700">Si continúas, la firma actual se eliminará y podrás ingresar una nueva.</p>
              <div className="flex justify-center gap-4">
                <button
                  className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
                  onClick={() => {
                    setFormulario(name, "");
                    setMostrarConfirmarEditar(false);
                  }}
                >
                  Sí, editar
                </button>
                <button
                  className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
                  onClick={() => setMostrarConfirmarEditar(false)}
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}
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
          className="text-xs bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded"
          onClick={guardarFirma}
          disabled={subiendo}
        >
          {subiendo ? "Subiendo..." : "Guardar firma"}
        </button>
        <button
          type="button"
          className="text-xs bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded"
          onClick={limpiarFirma}
          disabled={subiendo}
        >
          Limpiar
        </button>
      </div>
      <span className="text-xs text-gray-700">{label}</span>
    </div>
  );
};

export default FirmaCanvas;