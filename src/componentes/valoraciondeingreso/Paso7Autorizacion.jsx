import React from "react";
import FirmaCanvas from "./FirmaCanvas";

const Paso7Autorizacion = ({
  formulario,
  handleChange,
  setFormulario,
  setPaso,
  esEdicion = false, // <-- nueva prop
  onFirmaChange,
  setMostrarConfirmarFinalizar, // <-- agrega esto
}) => (
  <div className="space-y-4">
    <h3 className="text-xl font-bold text-indigo-600 mb-2">
      Paso 7: Autorización y Consentimiento
    </h3>

    <div className="mb-10">
      <h2 className="text-xl font-bold text-indigo-700 uppercase mb-4 border-b pb-1">
        AUTORIZACIÓN DE USO DE IMAGEN
      </h2>

      <p className="text-sm text-gray-700 leading-relaxed mb-4">
        Atendiendo al ejercicio de la Patria Potestad, establecido en el
        Código Civil Colombiano en su artículo 288, el artículo 24 del
        Decreto 2820 de 1974 y la Ley de Infancia y Adolescencia, el
        Ministerio de Educación Nacional solicita la autorización escrita
        del padre/madre de familia o acudiente del menor de edad:
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label htmlFor="autorizacionNombre" className="block text-sm font-medium mb-1">
            Nombre del menor
          </label>
          <input
            id="autorizacionNombre"
            type="text"
            name="autorizacionNombre"
            value={formulario.nombres || ""}
            readOnly
            className="w-full border rounded-md p-2 bg-gray-100"
            placeholder="Nombre del menor"
          />
        </div>
        <div>
          <label htmlFor="autorizacionRegistro" className="block text-sm font-medium mb-1">
            Número de Registro Civil
          </label>
          <input
            id="autorizacionRegistro"
            type="text"
            name="autorizacionRegistro"
            value={formulario.registroCivil || ""}
            readOnly
            className="w-full border rounded-md p-2 bg-gray-100"
            placeholder="Número de registro civil"
          />
        </div>
      </div>

      <p className="text-sm text-gray-700 leading-relaxed mb-4">
        Para reproducir fotografías e imágenes de las actividades en las
        que participe, para ser utilizadas en publicaciones, proyectos,
        redes sociales y página Web.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label htmlFor="ciudadFirma" className="block text-sm font-medium mb-1">Ciudad</label>
          <input
            id="ciudadFirma"
            type="text"
            name="ciudadFirma"
            value="Montería"
            readOnly
            className="w-full border rounded-md p-2 bg-gray-100"
            placeholder="Ciudad"
          />
        </div>
        <div className="flex gap-2">
          <div>
            <label htmlFor="diaFirma" className="block text-sm font-medium mb-1">Día</label>
            <select
              id="diaFirma"
              name="diaFirma"
              value={formulario.diaFirma || ""}
              onChange={handleChange}
              className="w-full border rounded-md p-2"
            >
              <option value="">Día</option>
              {[...Array(31)].map((_, i) => (
                <option key={i + 1} value={i + 1}>{i + 1}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="mesFirma" className="block text-sm font-medium mb-1">Mes</label>
            <select
              id="mesFirma"
              name="mesFirma"
              value={formulario.mesFirma || ""}
              onChange={handleChange}
              className="w-full border rounded-md p-2"
            >
              <option value="">Mes</option>
              {[...Array(12)].map((_, i) => (
                <option key={i + 1} value={i + 1}>{i + 1}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="anioFirma" className="block text-sm font-medium mb-1">Año</label>
            <input
              id="anioFirma"
              type="number"
              name="anioFirma"
              value={formulario.anioFirma || ""}
              onChange={handleChange}
              className="w-full border rounded-md p-2"
              placeholder="año"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label htmlFor="nombreAcudiente" className="block text-sm font-medium mb-1">
            Nombre del representante
          </label>
          <input
            id="nnombreAcudiente"
            type="text"
            name="nombreAcudiente"
            value={formulario.nombreAcudiente|| ""}
                readOnly
            className="w-full border rounded-md p-2 bg-gray-100"
          />
        </div>
        <div>
          <label htmlFor="cedulaAcudiente" className="block text-sm font-medium mb-1">
            Cédula del representante
          </label>
          <input
            id="cedulaAcudiente"
            type="text"
            name="cedulaAcudiente"
            value={formulario.cedulaAcudiente || ""}
            readOnly
            className="w-full border rounded-md p-2 bg-gray-100"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label htmlFor="nombreFisioterapeuta" className="block text-sm font-medium mb-1">
            Nombre del Profesional
          </label>
          <input
            id="nombreFisioterapeuta"
            type="text"
            name="nombreFisioterapeuta"
            value={formulario.nombreFisioterapeuta || ""}
            readOnly
            className="w-full border rounded-md p-2 bg-gray-100"
            placeholder="Nombre del Profesional"
          />
        </div>
        <div>
          <label htmlFor="cedulaFisioterapeuta" className="block text-sm font-medium mb-1">
            Cédula del Profesional
          </label>
          <input
            id="cedulaFisioterapeuta"
            type="text"
            name="cedulaFisioterapeuta"
            value={formulario.cedulaFisioterapeuta || ""}
            readOnly
            className="w-full border rounded-md p-2 bg-gray-100"
            placeholder="Cédula del Profesional"
          />
        </div>
      </div>

      <FirmaCanvas
        label="Firma de Autorización"
        name="firmaAutorizacion"
        setFormulario={onFirmaChange}
        formulario={formulario}
      />
    </div>

    <div className="flex justify-between items-center pt-6 mt-8">
      <button
        type="button"
        onClick={() => setPaso(6)}
        className="bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded"
      >
        Anterior
      </button>
      <button
        type="button"
        className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded"
        onClick={() => setPaso(8)}
      >
        Siguiente: Consentimiento Informado
      </button>
    </div>
  </div>
);

export default Paso7Autorizacion;