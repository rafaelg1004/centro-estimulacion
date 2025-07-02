import React from "react";
import FirmaCanvas from "../valoraciondeingreso/FirmaCanvas";
import Swal from "sweetalert2";

export default function Paso12Consentimiento({ formulario, setFormulario, siguientePaso, pasoAnterior }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormulario((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await Swal.fire({
      title: "¿Desea guardar la valoración?",
      text: "Confirme que desea guardar la información.",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sí, guardar",
      cancelButtonText: "Cancelar",
    });
    if (result.isConfirmed) {
      siguientePaso();
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-100 via-purple-100 to-green-100">
      <div className="bg-white bg-opacity-90 p-2 md:p-6 rounded-3xl shadow-2xl flex flex-col gap-8 w-full max-w-3xl border border-indigo-100">
        <form
          onSubmit={handleSubmit}
          className="space-y-8"
        >
          <h3 className="text-xl font-bold text-indigo-700 mb-4">
            Consentimiento informado para evaluación y tratamiento de fisioterapia pélvica
          </h3>
          <div className="bg-gray-50 p-4 rounded text-justify text-sm max-h-96 overflow-y-auto border">
            <p>
              Reconozco y entiendo que me han remitido o que he venido por voluntad propia a fisioterapia pélvica para que se me realice una evaluación y tratamiento de la(s) disfunción(es) de mi piso pélvico.<br /><br />
              La/el fisioterapeuta pélvica(o) me ha enseñado la anatomía básica del piso pélvico, sus funciones y la relación con mi disfunción(es) actual(es).<br /><br />
              Entiendo que para evaluar y tratar mi condición será necesario, inicial y periódicamente, que mi fisioterapeuta realice un examen de inspección y palpación detallada del área abdominal, lumbar, pélvica y genital externa, así como la palpación interna específica a través de la vagina y/o ano según se requiera y sea posible, para lo cual será necesario que me desvista dejando expuestas estas regiones de mi cuerpo.<br /><br />
              Este examen incluirá, entre otras cosas, la evaluación del estado de la piel, el tejido eréctil, los reflejos, la presencia de tensión muscular, la estructura y el tono muscular, la fuerza y la resistencia, la movilidad de las cicatrices y la función del piso pélvico en general.<br /><br />
              Comprendo que durante la evaluación también se me solicitarán actividades como la tos, el pujo y la valsalva máxima, además de diferentes movimientos con los músculos del piso pélvico.<br /><br />
              Tengo conciencia de que la evaluación y tratamiento de fisioterapia pélvica, puede requerir la aplicación de procedimientos o técnicas que pueden ser tanto externas a nivel del abdomen, región lumbar, pelvis y zona genital, vulvar y/o anal, como internas en el canal vaginal y/o rectal con el fin de alcanzar los objetivos terapéuticos para mejorar o erradicar los síntomas de mi(s) disfunción(es).<br /><br />
              Estas técnicas pueden incluir pero no están limitadas a: técnicas manuales (digitopresión, masaje, tracción, movilización, entre otras) o técnicas con equipos (electroterapia con electrodo intracavitario o adhesivo, biofeedback con electrodo intracavitario o adhesivo, masajeadores con y sin vibración, masajeadores térmicos, paquetes fríos o calientes, bolitas pélvicas, pesas vaginales, balones vaginales/ rectales, dilatadores vaginales/anales, bombas de vacío, fotobiomodulación, radiofrecuencia, ecografía, etc).<br /><br />
              También soy consciente de que mi tratamiento puede involucrar ejercicios de movilidad pélvica con o sin balón, ejercicio de resistencia cardiovascular, de resistencia y fuerza muscular general y de flexibilidad, como también entrenamiento específico del piso pélvico.<br /><br />
              Entiendo que deberé realizar en casa, una pauta de ejercicios tal y como la fisioterapeuta pélvica me lo indique, pudiendo ser ésta de ejercicios específicos de contracción/relajación de la musculatura pélvica con o sin la aplicación de herramientas terapéuticas, ejercicios funcionales, automasaje manual o instrumentalizado o de flexibilidad muscular.<br /><br />
              <b>Posibles riesgos:</b> reconozco que una evaluación completa del piso pélvico y/o un tratamiento de fisioterapia pélvica pueden aumentar mi nivel actual de dolor o malestar, o agravar mi disfunción o síntomas existentes y que este malestar suele ser temporal. Si no desaparece en 1-3 días, acepto ponerme en contacto con mi fisioterapeuta.<br /><br />
              Dentro de los malestares físicos temporales, pueden presentarse los siguientes: Dolor, ardor, sensación de calambre, sangrado de la mucosa, ganas de orinar o defecar, escape de gases anales o vaginales, mareo, taquicardia, bradicardia o hipotensión momentánea.<br /><br />
              Dentro de las incomodidades psicológicas o emocionales pueden presentarse: Vergüenza, nerviosismo, ansiedad o temor principalmente en la sesión de evaluación por ser la primera vez en fisioterapia pélvica.<br /><br />
              <b>Posibles beneficios:</b> una evaluación completa del piso pélvico y/o un tratamiento de fisioterapia pélvica pueden aliviar mis síntomas, mejorando mi calidad de vida y aumentando mi capacidad para realizar mis actividades diarias. Es posible que experimente un aumento de la fuerza, la conciencia, la flexibilidad y la resistencia de los músculos de mi piso pélvico e igualmente, puede que note una disminución del dolor o los malestares asociados a la disfunción que tengo. También podré adquirir un mayor conocimiento sobre mi disfunción y seré más consciente de los recursos disponibles para manejar mis síntomas y mejorar mi condición.<br /><br />
              <b>No garantía:</b> comprendo que la/el fisioterapeuta no puede hacer promesas ni garantías con respecto a la cura o la completa mejora de mi disfunción. Entiendo que mi fisioterapeuta compartirá su opinión profesional conmigo sobre los posibles resultados de la fisioterapia y analizará todas las opciones de tratamiento antes de que yo dé mi consentimiento para el tratamiento, basado en los resultados subjetivos y objetivos de la evaluación.<br /><br />
              Entiendo que tengo el derecho a revocar mi consentimiento en cualquier momento y que mi consentimiento verbal será obtenido continuamente a lo largo de las sesiones. Yo estaré siempre en control de mi propio cuerpo y de las actividades que me sean solicitadas realizar en la consulta con la/el fisioterapeuta.<br /><br />
              Al firmar este documento, acepto que he leído y entendido el CONSENTIMIENTO INFORMADO PARA EVALUACIÓN Y TRATAMIENTO DE FISIOTERAPIA PÉLVICA y que doy mi consentimiento para la evaluación y tratamiento de mi piso pélvico.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="font-semibold">Fecha</label>
              <input
                type="date"
                name="consentimientoFecha"
                value={formulario.consentimientoFecha || ""}
                onChange={handleChange}
                className="w-full mt-1 px-3 py-2 border border-indigo-200 rounded"
              />
            </div>
            <div>
              <label className="font-semibold">Ciudad</label>
              <input
                type="text"
                name="consentimientoCiudad"
                value="Montería"
                readOnly
                className="w-full mt-1 px-3 py-2 border border-indigo-200 rounded bg-gray-100"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="font-semibold">Nombre completo</label>
              <input
                type="text"
                name="consentimientoNombre"
                value={formulario.consentimientoNombre || formulario.nombres || ""}
                onChange={handleChange}
                readOnly
                className="w-full mt-1 px-3 py-2 border border-indigo-200 rounded"
              />
            </div>
            <div>
              <label className="font-semibold">CC No.</label>
              <input
                type="text"
                name="consentimientoCC"
                value={formulario.consentimientoCC || formulario.cedula || ""}
                onChange={handleChange}
                readOnly
                className="w-full mt-1 px-3 py-2 border border-indigo-200 rounded"
              />
            </div>
          </div>
          {/* Firma centrada */}
          <div className="flex flex-col items-center mt-8">
            <label className="font-semibold mb-2">Firma consentimiento:</label>
            <FirmaCanvas
              label="Firma consentimiento"
              name="consentimientoFirma"
              formulario={formulario}
              setFormulario={(campo, valor) => setFormulario(f => ({ ...f, [campo]: valor }))}
            />
          </div>
          <div className="flex justify-between mt-6">
            <button
              type="button"
              onClick={pasoAnterior}
              className="bg-gray-300 hover:bg-gray-400 text-black px-6 py-2 rounded font-bold"
            >
              Anterior
            </button>
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded transition"
            >
              Finalizar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}