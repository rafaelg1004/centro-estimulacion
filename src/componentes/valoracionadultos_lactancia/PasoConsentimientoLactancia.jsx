import React from "react";
import Swal from "sweetalert2";
import FirmaCanvas from "../valoraciondeingreso/FirmaCanvas";

export default function PasoConsentimientoLactancia({ formulario, handleChange, setFirma, anterior, onSubmit, InputField, esUltimoPaso = true }) {
  const handleGuardar = async () => {
    const result = await Swal.fire({
      title: "¿Deseas guardar la valoración?",
      text: "Confirma que quieres guardar este registro.",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#6366f1",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, guardar",
      cancelButtonText: "Cancelar"
    });
    if (result.isConfirmed) {
      await onSubmit(); // <-- Espera el guardado y la navegación
    }
  };

  return (
    <div>
      <h3 className="text-2xl font-bold text-indigo-700 mb-4 text-center">CONSTANCIA DE CONSENTIMIENTO INFORMADO PARA ASESORÍA EN LACTANCIA</h3>
      <div className="bg-indigo-50 rounded-xl p-4 mb-4 text-justify text-gray-700">
        <p className="mb-2">
          Yo <span className="font-semibold underline">{formulario.nombres || "_______________________________________"}</span> mayor de edad e Identificado con c.c. <span className="font-semibold underline">{formulario.cedula || "___________"}</span> de <span className="font-semibold underline">{formulario.lugarNacimiento || "_______________"}</span> actuando en nombre propio HAGO CONSTAR que he sido informado hoy{" "}
          <input
            type="date"
            name="fechaConsentimientoLactancia"
            value={formulario.fechaConsentimientoLactancia || ""}
            onChange={handleChange}
            className="border-b-2 border-indigo-400 bg-transparent outline-none px-2 inline-block align-middle"
            style={{ minWidth: 180 }}
            required
          />{" "}
          por la Fisioterapeuta – Asesora en Lactancia Dayan Ivonne Villegas Gamboa, acerca de la asesoría en Lactancia que recibiré.
        </p>
        <h4 className="font-semibold mt-4 mb-1">OBJETIVO DE LA ASESORÍA</h4>
        <p className="mb-2">
          La asesoría en lactancia tiene como finalidad acompañar el proceso de alimentación de mi bebé, resolver dudas, identificar posibles dificultades, brindar recomendaciones personalizadas y apoyar la instauración y mantenimiento de la lactancia materna exclusiva o complementaria, según el caso.
        </p>
        <h4 className="font-semibold mt-4 mb-1">ALCANCE DEL SERVICIO</h4>
        <ul className="list-disc ml-6 mb-2">
          <li>No reemplaza una consulta médica, ni pediátrica.</li>
          <li>Puede requerir seguimiento posterior según evolución del caso.</li>
          <li>Puede incluir observación directa del amamantamiento, técnicas de agarre, posturas y evaluación de signos en madre y bebé.</li>
          <li>Podrá recomendar la derivación a otros profesionales de la salud si se identifica alguna condición fuera del alcance del servicio.</li>
        </ul>
        <h4 className="font-semibold mt-4 mb-1">COMPROMISO DE SEGUIMIENTO</h4>
        <p className="mb-2">
          Comprendo que el éxito de la asesoría depende en gran parte de mi disposición y compromiso para seguir las recomendaciones brindadas por la profesional. Estoy de acuerdo en aplicar dichas sugerencias y comunicar cualquier dificultad o cambio que pueda surgir durante el proceso.
        </p>
        <h4 className="font-semibold mt-4 mb-1">CONFIDENCIALIDAD</h4>
        <p className="mb-2">
          La información compartida durante la asesoría será tratada de forma confidencial y utilizada únicamente para fines clínicos y educativos relacionados con mi proceso.
        </p>
        <h4 className="font-semibold mt-4 mb-1">AUTORIZACIÓN</h4>
        <p className="mb-2">
          Declaro que he comprendido el propósito de la asesoría, sus beneficios y limitaciones, y doy mi consentimiento voluntario para participar en ella.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
        {/* Columna izquierda: Firma paciente, Fecha, Teléfono */}
        <div className="flex flex-col gap-4">
          <FirmaCanvas
            label="Firma de la madre/paciente"
            name="firmaConsentimientoLactancia"
            setFormulario={setFirma}
            formulario={formulario}
          />
          <div>
            <label className="font-semibold block mb-1">Fecha</label>
            <input
              type="date"
              name="fechaConsentimientoLactancia"
              value={formulario.fechaConsentimientoLactancia || ""}
              onChange={handleChange}
              className="border-b-2 border-indigo-400 bg-transparent outline-none px-2 w-full"
              required
            />
          </div>
          <div>
            <label className="font-semibold block mb-1">Teléfono de contacto</label>
            <span className="block border-b-2 border-indigo-400 px-2 py-1 bg-indigo-50 rounded">
              {formulario.telefono || "No registrado"}
            </span>
          </div>
        </div>
        {/* Columna derecha: Firma profesional, nombre y registro fijos */}
        <div className="flex flex-col gap-4">
          <FirmaCanvas
            label="Firma profesional responsable"
            name="firmaProfesionalConsentimientoLactancia"
            setFormulario={setFirma}
            formulario={formulario}
          />
          <div>
            <label className="font-semibold block mb-1">Nombre profesional</label>
            <span className="block border-b-2 border-indigo-400 px-2 py-1 bg-indigo-50 rounded">
              Dayan Ivonne Villegas Gamboa
            </span>
          </div>
          <div>
            <label className="font-semibold block mb-1">Registro profesional</label>
            <span className="block border-b-2 border-indigo-400 px-2 py-1 bg-indigo-50 rounded">
              52862625
            </span>
          </div>
        </div>
      </div>
      <div className="flex justify-between mt-8">
        <button
          type="button"
          onClick={anterior}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold px-6 py-3 rounded-xl shadow transition"
        >
          Anterior
        </button>
        {esUltimoPaso ? (
          <button
            type="button"
            onClick={handleGuardar}
            className="bg-green-600 hover:bg-green-700 text-white font-bold px-6 py-3 rounded-xl shadow transition"
          >
            Guardar
          </button>
        ) : (
          <button
            type="button"
            onClick={onSubmit}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-3 rounded-xl shadow transition"
          >
            Siguiente
          </button>
        )}
      </div>
    </div>
  );
}