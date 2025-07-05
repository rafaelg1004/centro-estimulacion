import React, { useRef, useState } from "react";
import SignatureCanvas from "react-signature-canvas";

const FirmaCanvas = ({ label, name, setFormulario, formulario, onFirmaChange }) => {
  const sigRef = useRef();
  const [firmaTemporal, setFirmaTemporal] = useState(""); // base64 temporal
  const [mostrarConfirmarGuardar, setMostrarConfirmarGuardar] = useState(false);

  // Guardar firma en base64 temporalmente
  const guardarFirmaTemporal = () => {
    if (sigRef.current && !sigRef.current.isEmpty()) {
      const nuevaFirma = sigRef.current.getTrimmedCanvas().toDataURL("image/png");
      setFirmaTemporal(nuevaFirma);
    }
  };

  const confirmarGuardarFirma = () => {
    setFormulario(name, firmaTemporal); // Guarda solo base64 en el formulario
    if (typeof onFirmaChange === "function") {
      onFirmaChange(name, firmaTemporal, true);
    }
    setFirmaTemporal("");
    setMostrarConfirmarGuardar(false);
  };

  const limpiarFirma = () => {
    if (sigRef.current) sigRef.current.clear();
    setFirmaTemporal("");
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
          onClick={() => setFormulario(name, "")}
        >
          Editar firma
        </button>
      </div>
    );
  }

  // Si hay una firma temporal, mostrar la previsualización y opciones
  if (firmaTemporal) {
    return (
      <div className="flex flex-col items-center mb-2">
        <img
          src={firmaTemporal}
          alt={label}
          className="border border-indigo-400 rounded bg-white mb-2"
          style={{ width: 340, height: 120, objectFit: "contain" }}
        />
        <span className="text-xs text-gray-700">{label} (sin guardar)</span>
        <div className="flex gap-2 mt-2">
          <button
            type="button"
            className="text-xs bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded"
            onClick={() => setMostrarConfirmarGuardar(true)}
          >
            Guardar firma
          </button>
          <button
            type="button"
            className="text-xs bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded"
            onClick={limpiarFirma}
          >
            Cancelar
          </button>
        </div>
        {/* Modal de confirmación para guardar */}
        {mostrarConfirmarGuardar && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 max-w-xs w-full text-center">
              <h2 className="text-base font-bold mb-4">¿Guardar esta firma?</h2>
              <p className="mb-4 text-sm text-gray-700">La firma se guardará y no podrá editarse sin borrar la actual.</p>
              <div className="flex justify-center gap-4">
                <button
                  className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
                  onClick={confirmarGuardarFirma}
                >
                  Sí, guardar
                </button>
                <button
                  className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
                  onClick={() => setMostrarConfirmarGuardar(false)}
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

  // Si no hay firma, mostrar el pad y el botón guardar temporal
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
          onClick={guardarFirmaTemporal}
        >
          Previsualizar firma
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