import React from "react";
import FirmaCanvas from "./FirmaCanvas";

export default function Paso8Consentimiento({
  consentimiento = {},
  formulario ={},
  valoracion = {}, // <--- valor por defecto
  onChange,
  consentimientoCompleto,
  onVolver,
  setFirmaConsentimiento,
  esEdicion,
  onFinalizar
}) {
  // Usar datos de edición si existen, si no, los de nuevo consentimiento
  const datos = valoracion && Object.keys(valoracion).length > 0 ? valoracion : consentimiento || {};
console.log("Datos de consentimiento:", datos);
  return (
    <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-6 my-8 shadow">
      <h3 className="text-lg font-bold text-indigo-700 mb-4">CONSTANCIA DE CONSENTIMIENTO INFORMADO</h3>
      <p className="mb-2">
        Yo{" "}
        <input
          type="text"
          className="border-b border-indigo-400 bg-gray-100 outline-none min-w-[180px] mx-1"
          name="nombreAcudiente"
          value={datos.nombreAcudiente || ""}
          readOnly
          placeholder="Nombre acudiente"
        />{" "}
        mayor de edad e Identificado con c.c.{" "}
        <input
         id="cedulaAcudiente"
          type="text"
          className="border-b border-indigo-400 bg-transparent outline-none min-w-[100px] mx-1"
          name="cedulaAcudiente"
          value={datos.cedulaAcudiente ||""}
          onChange={onChange}
          readOnly
          placeholder="C.C. acudiente"
        />{" "}
        de{" "}
        <input
          type="text"
          className="border-b border-indigo-400 bg-transparent outline-none min-w-[100px] mx-1"
          name="consentimiento_lugarExpedicion"
          value={datos.consentimiento_lugarExpedicion || ""}
          onChange={onChange}
         
          placeholder="Lugar"
        />{" "}
        actuando en nombre propio o como representante legal de{" "}
        <input
          type="text"
          className="border-b border-indigo-400 bg-transparent outline-none min-w-[180px] mx-1"
          name="nombres"
          value={datos.nombres || ""}
          onChange={onChange}
          readOnly
          placeholder="Nombre niño/a"
        />{" "}
        identificado con Registro Civil No.{" "}
        <input
          type="text"
          className="border-b border-indigo-400 bg-transparent outline-none min-w-[120px] mx-1"
          name="registroCivil"
          value={datos.registroCivil || ""}
          onChange={onChange}
          readOnly
          placeholder="Registro Civil"
        />{" "}
        HAGO CONSTAR que he sido informado hoy{" "}
        <input
          type="date"
          className="border-b border-indigo-400 bg-transparent outline-none min-w-[120px] mx-1"
          name="consentimiento_fecha"
          value={datos.consentimiento_fecha || ""}
          onChange={onChange}
         
        />{" "}
        por la Fisioterapeuta Dayan Ivonne Villegas Gamboa, sobre el programa de Estimulación Adecuada de D'Mamitas&Babies, el cual tiene el objetivo de contribuir con el desarrollo integral de mi hijo/a abordando las dimensiones del desarrollo motor, cognitivo, sensorial, lenguaje y socialización.
      </p>
      <p className="mb-2">
        Durante la atención se pueden generar riesgos como lesiones osteomusculares, caída o golpes por traslados y desplazamientos, irritación o ansiedad.
      </p>
      <p className="mb-2">
        Se me ha dado la oportunidad de preguntar y aclarar las dudas generadas sobre la atención en el servicio, por lo que he recibido la información a satisfacción sobre la atención prestada. Además, se me explicó la importancia de acompañar permanentemente a mi hijo/a durante el tiempo de la sesión y de lo importante que es la continuidad en el proceso.
      </p>
      <p className="mb-2">
        Por lo anterior doy constancia de haber sido informado a satisfacción y doy mi consentimiento para que se me expliquen los procedimientos propios de este tipo de atención, entendiendo y aceptando los posibles riesgos de complicaciones que estos pueden implicar.
      </p>
      <div className="flex flex-col md:flex-row justify-between mt-8 gap-8">
        <div className="flex flex-col items-center">
          {/* Firma digital del acudiente */}
          <FirmaCanvas
            label="Firma del Acudiente o Representante legal"
            name="consentimiento_firmaAcudiente"
            setFormulario={setFirmaConsentimiento}
            formulario={datos}
            firma={datos.consentimiento_firmaAcudiente || ""}
          />
          <input
            type="text"
            className="border-b border-indigo-400 bg-transparent outline-none min-w-[180px] mt-2 text-center"
            name="consentimiento_ccFirmaAcudiente"
            value={datos.consentimiento_ccAcudiente || ""}
            onChange={onChange}
            readOnly
            placeholder="C.C. acudiente"
          />
          <span className="text-xs text-gray-700">C.C. Acudiente</span>
        </div>
        <div className="flex flex-col items-center">
          {/* Firma digital de la fisioterapeuta */}
          <FirmaCanvas
            label="Firma del Fisioterapeuta"
            name="consentimiento_firmaFisio"
            setFormulario={setFirmaConsentimiento}
            formulario={datos}
            firma={datos.consentimiento_firmaFisio || ""}
          />
          <input
            type="text"
            className="border-b border-indigo-400 bg-transparent outline-none min-w-[180px] mt-2 text-center"
            name="consentimiento_ccFisioterapeuta"
            value={
              formulario.cedulaFisioterapeuta ||
              datos.cedulaFisioterapeuta ||
              "52862625"
            }
            readOnly
            placeholder="C.C. fisioterapeuta"
          />
          <span className="text-xs text-gray-700">C.C. Fisioterapeuta</span>
        </div>
      </div>
      {!consentimientoCompleto && (
        <div className="text-red-600 text-center mt-4">Por favor, completa todos los campos del consentimiento.</div>
      )}
      <div className="flex justify-center mt-8 gap-4">
        <button
          type="button"
          className="bg-gray-300 hover:bg-gray-400 text-black px-8 py-3 rounded-lg font-bold text-lg shadow transition"
          onClick={onVolver}
        >
          Volver
        </button>
        {esEdicion ? (
          <button
            type="button"
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-bold text-lg shadow transition"
            disabled={!consentimientoCompleto}
            onClick={onFinalizar}
          >
            Guardar cambios
          </button>
        ) : (
          <button
            type="submit"
            className={`bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-lg font-bold text-lg shadow transition ${!consentimientoCompleto ? "opacity-50 cursor-not-allowed" : ""}`}
            disabled={!consentimientoCompleto}
          >
            Finalizar y Guardar
          </button>
        )}
      </div>
    </div>
  );
}