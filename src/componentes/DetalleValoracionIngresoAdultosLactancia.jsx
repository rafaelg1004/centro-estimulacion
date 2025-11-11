import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { PencilSquareIcon, ArrowLeftIcon } from "@heroicons/react/24/solid";
import { apiRequest } from "../config/api";

const Card = ({ title, children }) => (
  <div className="bg-indigo-50 rounded-2xl shadow p-6 mb-8 border border-indigo-100">
    <h3 className="text-lg font-bold text-indigo-700 mb-4 border-b border-indigo-200 pb-1">{title}</h3>
    {children}
  </div>
);

function Field({ label, value, isImage }) {
  if (isImage && value && value.toString().startsWith("data:image")) {
    return (
      <div className="flex flex-col items-center mb-2">
        {label && <span className="font-semibold text-gray-700 mb-1">{label}:</span>}
        <img src={value} alt={label} className="max-w-xs rounded shadow border" />
      </div>
    );
  }
  return (
    <div className="flex flex-col mb-2">
      {label && <span className="font-semibold text-gray-700 mb-1">{label}:</span>}
      <span className="text-gray-900">{typeof value === "boolean" ? (value ? "Sí" : "No") : value ? value : <span className="text-gray-400">—</span>}</span>
    </div>
  );
}

export default function DetalleValoracionIngresoAdultosLactancia() {
  const { id } = useParams();
  const [valoracion, setValoracion] = useState(null);
  const [cargando, setCargando] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    apiRequest(`/valoracion-ingreso-adultos-lactancia/${id}`)
      .then(data => {
        setValoracion(data);
        setCargando(false);
      });
  }, [id]);

  if (cargando) {
    return (
      <div className="flex justify-center items-center min-h-[200px] bg-gradient-to-br from-indigo-100 via-pink-100 to-green-100">
        <div className="animate-spin rounded-full h-8 w-8 border-t-4 border-indigo-600 border-solid"></div>
        <span className="ml-2 text-indigo-700 font-bold text-xs">Cargando...</span>
      </div>
    );
  }

  if (!valoracion) {
    return <div className="text-center text-red-600">No se encontró la valoración.</div>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-pink-100 to-green-100 py-10 px-2">
      <div className="max-w-3xl mx-auto bg-white p-4 sm:p-8 rounded-3xl shadow-2xl border border-indigo-100">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <Link
            to="/valoraciones-adultos-lactancia"
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded-xl shadow transition flex items-center gap-2 text-lg"
          >
            <ArrowLeftIcon className="h-6 w-6" />
            Volver a la lista
          </Link>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-indigo-700 text-center flex-1 tracking-tight drop-shadow">
            Detalle de Valoración Adultos Lactancia
          </h2>
          <button
            onClick={() => navigate(`/editar-valoracion-ingreso-adultos-lactancia/${id}`)}
            className="bg-yellow-400 hover:bg-yellow-500 text-white font-bold py-2 px-6 rounded-xl shadow transition flex items-center gap-2 text-lg"
            title="Editar valoración"
          >
            <PencilSquareIcon className="h-6 w-6" />
            Editar
          </button>
        </div>

        <Card title="1. Datos personales">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8">
            <Field label="Nombres" value={valoracion.nombres} />
            <Field label="Cédula" value={valoracion.cedula} />
            <Field label="Teléfono" value={valoracion.telefono} />
            <Field label="Fecha" value={valoracion.fecha} />
            <Field label="Hora" value={valoracion.hora} />
            <Field label="Motivo de consulta" value={valoracion.motivoConsulta} />
            <Field label="Género" value={valoracion.genero} />
            <Field label="Lugar de nacimiento" value={valoracion.lugarNacimiento} />
            <Field label="Fecha de nacimiento" value={valoracion.fechaNacimiento} />
            <Field label="Edad" value={valoracion.edad} />
            <Field label="Estado civil" value={valoracion.estadoCivil} />
            <Field label="Dirección" value={valoracion.direccion} />
            <Field label="Celular" value={valoracion.celular} />
            <Field label="Ocupación" value={valoracion.ocupacion} />
            <Field label="Nivel educativo" value={valoracion.nivelEducativo} />
            <Field label="Médico tratante" value={valoracion.medicoTratante} />
            <Field label="Aseguradora" value={valoracion.aseguradora} />
            <Field label="Acompañante" value={valoracion.acompanante} />
            <Field label="Teléfono acompañante" value={valoracion.telefonoAcompanante} />
            <Field label="Nombre bebé" value={valoracion.nombreBebe} />
            <Field label="Semanas gestación" value={valoracion.semanasGestacion} />
            <Field label="FUM" value={valoracion.fum} />
            <Field label="Fecha probable parto" value={valoracion.fechaProbableParto} />
            <Field label="Fecha posible nacimiento" value={valoracion.fechaPosibleNacimiento} />
          </div>
        </Card>

        <Card title="2. Antecedentes y ginecológicos">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8">
            <Field label="Hospitalarios" value={valoracion.hospitalarios} />
            <Field label="Patológicos" value={valoracion.patologicos} />
            <Field label="Familiares" value={valoracion.familiares} />
            <Field label="Traumáticos" value={valoracion.traumaticos} />
            <Field label="Farmacológicos" value={valoracion.farmacologicos} />
            <Field label="Quirúrgicos" value={valoracion.quirurgicos} />
            <Field label="Tóxico-alérgicos" value={valoracion.toxicoAlergicos} />
            <Field label="N° embarazos" value={valoracion.numEmbarazos} />
            <Field label="N° abortos" value={valoracion.numAbortos} />
            <Field label="N° partos vaginales" value={valoracion.numPartosVaginales} />
            <Field label="Instrumentado" value={valoracion.instrumentado} />
            <Field label="N° cesáreas" value={valoracion.numCesareas} />
            <Field label="Fecha obstétrico" value={valoracion.fechaObstetrico} />
            <Field label="Peso" value={valoracion.peso} />
            <Field label="Talla" value={valoracion.talla} />
            <Field label="Episiotomía" value={valoracion.episiotomia} />
            <Field label="Desgarro" value={valoracion.desgarro} />
            <Field label="Espacio entre embarazos" value={valoracion.espacioEntreEmbarazos} />
            <Field label="Actividad física" value={valoracion.actividadFisica} />
            <Field label="Complicaciones" value={valoracion.complicaciones} />
            <Field label="Cirugías previas" value={valoracion.cirugiasPrevias} />
            <Field label="Prolapsos" value={valoracion.prolapsos} />
            <Field label="Hormonales" value={valoracion.hormonales} />
            <Field label="Anticonceptivos" value={valoracion.anticonceptivos} />
          </div>
        </Card>

        <Card title="3. Lactancia">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8">
            <Field label="Experiencia lactancia" value={valoracion.experienciaLactancia} />
            <Field label="¿Cómo fue la experiencia?" value={valoracion.comoFueExperiencia} />
            <Field label="Dificultades lactancia" value={valoracion.dificultadesLactancia} />
            <Field label="¿Desea amamantar?" value={valoracion.deseaAmamantar} />
            <Field label="Expectativas asesoría" value={valoracion.expectativasAsesoria} />
            <Field label="Conocimientos lactancia" value={valoracion.conocimientosLactancia} />
            <Field label="Pechos normales" value={valoracion.pechosNormales} />
            <Field label="Pechos dolorosos" value={valoracion.pechosDolorosos} />
            <Field label="Pechos secreción" value={valoracion.pechosSecrecion} />
            <Field label="Pechos cirugías" value={valoracion.pechosCirugias} />
            <Field label="Forma pezón" value={valoracion.formaPezon} />
            <Field label="Otra forma pezón" value={valoracion.otraFormaPezon} />
            <Field label="Observaciones físicas" value={valoracion.observacionesFisicas} />
            <Field label="Medicamentos actuales" value={valoracion.medicamentosActuales} />
            <Field label="Afecciones médicas" value={valoracion.afeccionesMedicas} />
            <Field label="Apoyo familiar" value={valoracion.apoyoFamiliar} />
          </div>
        </Card>

        <Card title="4. Plan de intervención">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8">
            <Field label="Plan de intervención" value={valoracion.planIntervencion} />
            <Field label="Visita cierre" value={valoracion.visitaCierre} />
          </div>
          <div className="flex flex-col md:flex-row justify-center items-center gap-8 mt-6">
            <div className="flex-1 flex flex-col items-center">
              <span className="font-semibold text-gray-700 mb-1 block text-center">
                El paciente firma para aceptar el plan de intervención y la visita de cierre.
              </span>
              <Field label="Firma paciente" value={valoracion.firmaPaciente} isImage />
            </div>
            <div className="flex-1 flex flex-col items-center">
              <span className="font-semibold text-gray-700 mb-1 block text-center">
                El fisioterapeuta firma para validar el plan de intervención.
              </span>
              <Field label="Firma fisioterapeuta" value={valoracion.firmaFisioterapeutaPlanIntervencion} isImage />
            </div>
          </div>
        </Card>

        <Card title="5. Autorización de uso de imágenes">
          <div className="mb-4">
            <span className="font-semibold text-gray-700 mb-1 block">
              Autorizo a D&#39;Mamitas &amp; Babies para reproducir fotografías e imágenes de las actividades en las que participe, para ser utilizadas en sus publicaciones, proyectos, redes sociales y página web.
            </span>
          </div>
          <div className="flex flex-col items-center">
            <Field label="Firma autorización" value={valoracion.firmaAutorizacion} isImage />
          </div>
        </Card>

        <Card title="6. Lactancia prenatal">
          <p className="mb-4 text-gray-700">
            En lactancia prenatal, que consta de una sesión teórica y una visita en la clínica o en casa según su necesidad, es importante que nos avise la fecha posible del nacimiento. Además, contará con nuestro acompañamiento telefónico para cualquier duda e inquietud.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Sesión 1 */}
            <div className="border rounded-xl p-4 bg-white shadow-sm flex flex-col items-center">
              <h4 className="font-semibold mb-2 text-indigo-600">Sesión No. 1 - Teórico-práctica</h4>
              <Field label="Fecha sesión 1" value={valoracion.fechaSesion1} />
              <Field label="Firma paciente sesión 1" value={valoracion.firmaPacienteSesion1} isImage />
            </div>
            {/* Sesión 2 */}
            <div className="border rounded-xl p-4 bg-white shadow-sm flex flex-col items-center">
              <h4 className="font-semibold mb-2 text-indigo-600">Sesión No. 2 - Visita</h4>
              <Field label="Fecha sesión 2" value={valoracion.fechaSesion2} />
              <Field label="Firma paciente sesión 2" value={valoracion.firmaPacienteSesion2} isImage />
            </div>
          </div>
          {/* Consentimiento */}
          <div className="my-6">
            <p className="mb-2 text-gray-700 text-center">
              Yo <span className="font-semibold underline">{valoracion.nombres}</span> identificada con Cédula de Ciudadanía <span className="font-semibold underline">{valoracion.cedula}</span> he entendido con claridad la explicación que me ha dado la Fisioterapeuta Dayan Ivonne Villegas Gamboa en las líneas anteriores. Por lo cual comprendo los beneficios y riesgos. Así mismo, me considero conforme y satisfecha con la información que se me ha suministrado comprendiendo de manera global todo lo que conlleva hacer parte de este programa. Por lo que a través de la presente, doy mi consentimiento expreso para que el tratamiento llevado a cabo. Si necesita una visita adicional de lactancia, esta tiene un costo de $80.000. Este servicio se programa según disponibilidad.
            </p>
          </div>
          {/* Firmas finales */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-8 mb-2">
            <div className="flex-1 flex flex-col items-center">
              <span className="font-semibold text-gray-700 mb-1 block">Firma fisioterapeuta</span>
              <Field label="" value={valoracion.firmaFisioterapeutaPrenatal} isImage />
            </div>
            <div className="flex-1 flex flex-col items-center">
              <span className="font-semibold text-gray-700 mb-1 block">Firma final paciente</span>
              <Field label="" value={valoracion.firmaPacientePrenatalFinal} isImage />
            </div>
          </div>
        </Card>

        <Card title="7. Constancia de consentimiento informado para asesoría en lactancia">
          <div className="mb-4 text-gray-700 space-y-2">
            <p>
              Yo <span className="font-semibold underline">{valoracion.nombres}</span> mayor de edad e identificado con c.c.{" "}
              <span className="font-semibold underline">{valoracion.cedula}</span> de{" "}
              <span className="font-semibold underline">{valoracion.lugarNacimiento}</span> actuando en nombre propio HAGO CONSTAR que he sido informado hoy{" "}
              <span className="font-semibold underline">{valoracion.fechaConsentimientoLactancia}</span> por la Fisioterapeuta – Asesora en Lactancia Dayan Ivonne Villegas Gamboa, acerca de la asesoría en Lactancia que recibiré.
            </p>
            <h4 className="font-semibold mt-4 mb-1">OBJETIVO DE LA ASESORÍA</h4>
            <p>
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
            <p>
              Comprendo que el éxito de la asesoría depende en gran parte de mi disposición y compromiso para seguir las recomendaciones brindadas por la profesional. Estoy de acuerdo en aplicar dichas sugerencias y comunicar cualquier dificultad o cambio que pueda surgir durante el proceso.
            </p>
            <h4 className="font-semibold mt-4 mb-1">CONFIDENCIALIDAD</h4>
            <p>
              La información compartida durante la asesoría será tratada de forma confidencial y utilizada únicamente para fines clínicos y educativos relacionados con mi proceso.
            </p>
            <h4 className="font-semibold mt-4 mb-1">AUTORIZACIÓN</h4>
            <p>
              Declaro que he comprendido el propósito de la asesoría, sus beneficios y limitaciones, y doy mi consentimiento voluntario para participar en ella.
            </p>
            <p className="mt-2">
              <span className="font-semibold">Teléfono de contacto:</span> <span className="underline">{valoracion.telefono}</span>
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Field label="Firma de la madre/paciente" value={valoracion.firmaConsentimientoLactancia} isImage />
              <Field label="Fecha" value={valoracion.fechaConsentimientoLactancia} />
              <Field label="Teléfono de contacto" value={valoracion.telefono} />
            </div>
            <div>
              <Field label="Firma profesional responsable" value={valoracion.firmaProfesionalConsentimientoLactancia} isImage />
              <Field label="Nombre profesional" value={valoracion.nombreProfesionalConsentimientoLactancia || "Dayan Ivonne Villegas Gamboa"} />
              <Field label="Registro profesional" value={valoracion.registroProfesionalConsentimientoLactancia || "52862625"} />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}