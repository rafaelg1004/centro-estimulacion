import React from "react";
import FirmaCanvas from "../valoraciondeingreso/FirmaCanvas";

export default function Paso5Autorizacion({
  formulario,
  setFirma,
  anterior,
  siguiente,
  onSubmit,
}) {
  return (
    <div>
      <h3 className="text-lg font-bold mb-4 text-indigo-700">Autorización de uso de imágenes</h3>
      <p className="mb-6 text-gray-700">
        Autorizo a D&#39;Mamitas &amp; Babies para reproducir fotografías e imágenes de las actividades en las que participe, para ser utilizadas en sus publicaciones, proyectos, redes sociales y página web.
      </p>
      <div className="mb-6">
        <FirmaCanvas
          label="Firma"
          name="firmaAutorizacion"
          setFormulario={setFirma}
          formulario={formulario}
        />
      </div>
      <div className="flex justify-between">
        <button
          type="button"
          className="px-6 py-2 rounded-md text-white font-semibold bg-gray-400 hover:bg-gray-500 transition"
          onClick={anterior}
        >
          Anterior
        </button>
        <button
          type="button"
          className="px-6 py-2 rounded-md text-white font-semibold bg-indigo-600 hover:bg-indigo-700 transition"
          onClick={siguiente}
        >
          Siguiente
        </button>
      </div>
    </div>
  );
}