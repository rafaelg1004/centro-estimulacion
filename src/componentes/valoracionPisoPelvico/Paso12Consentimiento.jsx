import React, { useCallback } from "react";
import FirmaCanvas from "../valoraciondeingreso/FirmaCanvas";
import Swal from "sweetalert2";
import { DocumentTextIcon, CalendarIcon, UserIcon, IdentificationIcon, MapPinIcon } from '@heroicons/react/24/outline';

// Componente para secciones con diseño moderno
const Section = ({ title, icon: Icon, gradient, children, className = "" }) => (
  <div className={`bg-gradient-to-r ${gradient} p-6 rounded-2xl shadow-lg border border-white/20 ${className}`}>
    <div className="flex items-center gap-3 mb-4">
      <div className="p-2 bg-white/20 rounded-xl">
        <Icon className="w-6 h-6 text-white" />
      </div>
      <h3 className="text-xl font-bold text-white">{title}</h3>
    </div>
    {children}
  </div>
);

// Componente para campos de entrada modernos
const InputField = ({ label, icon: Icon, formulario, handleChange, ...props }) => (
  <div className="space-y-2">
    <label className="flex items-center gap-2 text-gray-700 font-semibold">
      {Icon && <Icon className="w-5 h-5 text-indigo-600" />}
      {label}
    </label>
    <input
      {...props}
      value={(formulario && formulario[props.name]) || props.value || ""}
      onChange={handleChange}
      className={`w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-200 ${props.className || ""}`}
    />
  </div>
);

export default function Paso12Consentimiento({ formulario, setFormulario, siguientePaso, pasoAnterior }) {
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormulario((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, [setFormulario]);

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Título principal */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-3 bg-white px-6 py-3 rounded-2xl shadow-lg border border-indigo-100">
              <DocumentTextIcon className="w-8 h-8 text-indigo-600" />
              <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Consentimiento Informado
              </h2>
            </div>
            <p className="text-gray-600 mt-3 text-lg">
              Para evaluación y tratamiento de fisioterapia pélvica
            </p>
          </div>

          {/* Contenido del consentimiento */}
          <Section
            title="Documento de Consentimiento"
            icon={DocumentTextIcon}
            gradient="from-indigo-500 to-purple-600"
          >
            <div className="bg-white/90 backdrop-blur-sm p-6 rounded-xl shadow-inner max-h-96 overflow-y-auto border border-gray-200">
              <div className="text-justify text-sm leading-relaxed space-y-4 text-gray-700">
                <p>
                  Reconozco y entiendo que me han remitido o que he venido por voluntad propia a fisioterapia pélvica para que se me realice una evaluación y tratamiento de la(s) disfunción(es) de mi piso pélvico.
                </p>
                <p>
                  La/el fisioterapeuta pélvica(o) me ha enseñado la anatomía básica del piso pélvico, sus funciones y la relación con mi disfunción(es) actual(es).
                </p>
                <p>
                  Entiendo que para evaluar y tratar mi condición será necesario, inicial y periódicamente, que mi fisioterapeuta realice un examen de inspección y palpación detallada del área abdominal, lumbar, pélvica y genital externa, así como la palpación interna específica a través de la vagina y/o ano según se requiera y sea posible, para lo cual será necesario que me desvista dejando expuestas estas regiones de mi cuerpo.
                </p>
                <p>
                  Este examen incluirá, entre otras cosas, la evaluación del estado de la piel, el tejido eréctil, los reflejos, la presencia de tensión muscular, la estructura y el tono muscular, la fuerza y la resistencia, la movilidad de las cicatrices y la función del piso pélvico en general.
                </p>
                <p>
                  Comprendo que durante la evaluación también se me solicitarán actividades como la tos, el pujo y la valsalva máxima, además de diferentes movimientos con los músculos del piso pélvico.
                </p>
                <p>
                  Tengo conciencia de que la evaluación y tratamiento de fisioterapia pélvica, puede requerir la aplicación de procedimientos o técnicas que pueden ser tanto externas a nivel del abdomen, región lumbar, pelvis y zona genital, vulvar y/o anal, como internas en el canal vaginal y/o rectal con el fin de alcanzar los objetivos terapéuticos para mejorar o erradicar los síntomas de mi(s) disfunción(es).
                </p>
                <p>
                  Estas técnicas pueden incluir pero no están limitadas a: técnicas manuales (digitopresión, masaje, tracción, movilización, entre otras) o técnicas con equipos (electroterapia con electrodo intracavitario o adhesivo, biofeedback con electrodo intracavitario o adhesivo, masajeadores con y sin vibración, masajeadores térmicos, paquetes fríos o calientes, bolitas pélvicas, pesas vaginales, balones vaginales/ rectales, dilatadores vaginales/anales, bombas de vacío, fotobiomodulación, radiofrecuencia, ecografía, etc).
                </p>
                <p>
                  También soy consciente de que mi tratamiento puede involucrar ejercicios de movilidad pélvica con o sin balón, ejercicio de resistencia cardiovascular, de resistencia y fuerza muscular general y de flexibilidad, como también entrenamiento específico del piso pélvico.
                </p>
                <p>
                  Entiendo que deberé realizar en casa, una pauta de ejercicios tal y como la fisioterapeuta pélvica me lo indique, pudiendo ser ésta de ejercicios específicos de contracción/relajación de la musculatura pélvica con o sin la aplicación de herramientas terapéuticas, ejercicios funcionales, automasaje manual o instrumentalizado o de flexibilidad muscular.
                </p>
                <div className="border-l-4 border-amber-400 bg-amber-50 p-4 rounded-r-lg">
                  <h4 className="font-bold text-amber-800 mb-2">Posibles riesgos:</h4>
                  <p className="text-amber-700">
                    Reconozco que una evaluación completa del piso pélvico y/o un tratamiento de fisioterapia pélvica pueden aumentar mi nivel actual de dolor o malestar, o agravar mi disfunción o síntomas existentes y que este malestar suele ser temporal. Si no desaparece en 1-3 días, acepto ponerme en contacto con mi fisioterapeuta.
                  </p>
                  <p className="text-amber-700 mt-2">
                    Dentro de los malestares físicos temporales, pueden presentarse los siguientes: Dolor, ardor, sensación de calambre, sangrado de la mucosa, ganas de orinar o defecar, escape de gases anales o vaginales, mareo, taquicardia, bradicardia o hipotensión momentánea.
                  </p>
                  <p className="text-amber-700 mt-2">
                    Dentro de las incomodidades psicológicas o emocionales pueden presentarse: Vergüenza, nerviosismo, ansiedad o temor principalmente en la sesión de evaluación por ser la primera vez en fisioterapia pélvica.
                  </p>
                </div>
                <div className="border-l-4 border-green-400 bg-green-50 p-4 rounded-r-lg">
                  <h4 className="font-bold text-green-800 mb-2">Posibles beneficios:</h4>
                  <p className="text-green-700">
                    Una evaluación completa del piso pélvico y/o un tratamiento de fisioterapia pélvica pueden aliviar mis síntomas, mejorando mi calidad de vida y aumentando mi capacidad para realizar mis actividades diarias. Es posible que experimente un aumento de la fuerza, la conciencia, la flexibilidad y la resistencia de los músculos de mi piso pélvico e igualmente, puede que note una disminución del dolor o los malestares asociados a la disfunción que tengo. También podré adquirir un mayor conocimiento sobre mi disfunción y seré más consciente de los recursos disponibles para manejar mis síntomas y mejorar mi condición.
                  </p>
                </div>
                <div className="border-l-4 border-blue-400 bg-blue-50 p-4 rounded-r-lg">
                  <h4 className="font-bold text-blue-800 mb-2">No garantía:</h4>
                  <p className="text-blue-700">
                    Comprendo que la/el fisioterapeuta no puede hacer promesas ni garantías con respecto a la cura o la completa mejora de mi disfunción. Entiendo que mi fisioterapeuta compartirá su opinión profesional conmigo sobre los posibles resultados de la fisioterapia y analizará todas las opciones de tratamiento antes de que yo dé mi consentimiento para el tratamiento, basado en los resultados subjetivos y objetivos de la evaluación.
                  </p>
                </div>
                <p className="font-semibold text-gray-800">
                  Entiendo que tengo el derecho a revocar mi consentimiento en cualquier momento y que mi consentimiento verbal será obtenido continuamente a lo largo de las sesiones. Yo estaré siempre en control de mi propio cuerpo y de las actividades que me sean solicitadas realizar en la consulta con la/el fisioterapeuta.
                </p>
                <p className="font-semibold text-gray-800">
                  Al firmar este documento, acepto que he leído y entendido el CONSENTIMIENTO INFORMADO PARA EVALUACIÓN Y TRATAMIENTO DE FISIOTERAPIA PÉLVICA y que doy mi consentimiento para la evaluación y tratamiento de mi piso pélvico.
                </p>
              </div>
            </div>
          </Section>

          {/* Datos del paciente */}
          <Section
            title="Información del Paciente"
            icon={UserIcon}
            gradient="from-blue-500 to-indigo-600"
          >
            <div className="bg-white/90 backdrop-blur-sm p-6 rounded-xl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField
                  label="Fecha"
                  icon={CalendarIcon}
                  type="date"
                  name="consentimientoFecha"
                  formulario={formulario}
                  handleChange={handleChange}
                />
                <InputField
                  label="Ciudad"
                  icon={MapPinIcon}
                  type="text"
                  name="consentimientoCiudad"
                  placeholder="Ciudad donde se firma"
                  formulario={formulario}
                  handleChange={handleChange}
                />
                <InputField
                  label="Nombre completo"
                  icon={UserIcon}
                  type="text"
                  name="consentimientoNombre"
                  value={formulario?.consentimientoNombre || formulario?.nombres || ""}
                  readOnly
                  className="bg-gray-50"
                />
                <InputField
                  label="CC No."
                  icon={IdentificationIcon}
                  type="text"
                  name="consentimientoCC"
                  value={formulario?.consentimientoCC || formulario?.cedula || ""}
                  readOnly
                  className="bg-gray-50"
                />
              </div>
            </div>
          </Section>

          {/* Firma */}
          <Section
            title="Firma del Paciente"
            icon={DocumentTextIcon}
            gradient="from-purple-500 to-pink-600"
          >
            <div className="bg-white/90 backdrop-blur-sm p-6 rounded-xl">
              <div className="flex flex-col items-center space-y-4">
                <p className="text-gray-800 text-center font-medium">
                  Por favor, firme en el espacio a continuación para confirmar su consentimiento
                </p>
                <div className="bg-white p-4 rounded-xl shadow-inner border-2 border-dashed border-gray-300">
                  <FirmaCanvas
                    label="Firma consentimiento"
                    name="consentimientoFirma"
                    formulario={formulario}
                    setFormulario={(campo, valor) => setFormulario(f => ({ ...f, [campo]: valor }))}
                  />
                </div>
              </div>
            </div>
          </Section>

          {/* Botones de navegación */}
          <div className="flex justify-between items-center pt-6">
            <button
              type="button"
              onClick={pasoAnterior}
              className="flex items-center gap-2 bg-white text-gray-700 border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50 px-6 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Anterior
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg transform hover:scale-105"
            >
              Finalizar Valoración
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}