import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Spinner from "../ui/Spinner";
import { PencilSquareIcon, ArrowLeftIcon } from "@heroicons/react/24/solid";

const Card = ({ title, children }) => (
  <div className="bg-indigo-50 rounded-2xl shadow p-6 mb-8 border border-indigo-100">
    <h3 className="text-lg font-bold text-indigo-700 mb-3 border-b border-indigo-200 pb-1">{title}</h3>
    {children}
  </div>
);

const Field = ({ label, value }) => (
  <div className="mb-1">
    <span className="font-semibold text-gray-700">{label}:</span>{" "}
    <span className="text-gray-900">{value || <span className="text-gray-400">Sin dato</span>}</span>
  </div>
);

export default function DetalleConsentimientoPerinatal() {
  const { id } = useParams();
  const [consentimiento, setConsentimiento] = useState(null);

  useEffect(() => {
    fetch(`https://mi-backend-787730618984.us-central1.run.app/api/consentimiento-perinatal/${id}`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data.sesionesIntensivo)) {
          data.sesionesIntensivo.forEach((sesion, idx) => {
            data[`fechaSesionIntensivo${idx + 1}`] = sesion.fecha || "";
            data[`firmaPacienteSesionIntensivo${idx + 1}`] = sesion.firmaPaciente || "";
          });
        }
        setConsentimiento(data);
      });
  }, [id]);

  if (!consentimiento) return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-indigo-100 via-pink-100 to-green-100">
      <Spinner />
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-pink-100 to-green-100 py-10 px-2">
      <div className="max-w-5xl w-full mx-auto bg-white p-8 rounded-3xl shadow-2xl border border-indigo-100">
        <h2 className="text-3xl font-extrabold mb-8 text-indigo-800 text-center drop-shadow">
          Detalle Consentimiento Perinatal
        </h2>
        
        {/* Paso 1 */}
        <Card title="Paso 1: Datos del Paciente">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-1">
            <Field label="Nombre" value={consentimiento.paciente?.nombres} />
            <Field label="Cédula" value={consentimiento.paciente?.cedula} />
            <Field label="Fecha de nacimiento" value={consentimiento.paciente?.fechaNacimiento} />
            <Field label="Edad" value={consentimiento.paciente?.edad} />
            <Field label="Género" value={consentimiento.paciente?.genero} />
            <Field label="Teléfono" value={consentimiento.paciente?.telefono} />
            <Field label="Celular" value={consentimiento.paciente?.celular} />
            <Field label="Dirección" value={consentimiento.paciente?.direccion} />
            <Field label="Ocupación" value={consentimiento.paciente?.ocupacion} />
            <Field label="Nivel educativo" value={consentimiento.paciente?.nivelEducativo} />
            <Field label="Aseguradora" value={consentimiento.paciente?.aseguradora} />
            <Field label="Médico tratante" value={consentimiento.paciente?.medicoTratante} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 mt-4">
            <Field label="Fecha" value={consentimiento.fecha} />
            <Field label="Hora" value={consentimiento.hora} />
            <Field label="Motivo de consulta" value={consentimiento.motivoConsulta} />
          </div>
        </Card>

        {/* Paso 2 */}
        <Card title="Paso 2: Antecedentes">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-1">
            <Field label="Hospitalarios" value={consentimiento.hospitalarios} />
            <Field label="Patológicos" value={consentimiento.patologicos} />
            <Field label="Familiares" value={consentimiento.familiares} />
            <Field label="Traumáticos" value={consentimiento.traumaticos} />
            <Field label="Farmacológicos" value={consentimiento.farmacologicos} />
            <Field label="Quirúrgicos" value={consentimiento.quirurgicos} />
            <Field label="Tóxico-alérgicos" value={consentimiento.toxicoAlergicos} />
            <Field label="N° Embarazos" value={consentimiento.numEmbarazos} />
            <Field label="N° Abortos" value={consentimiento.numAbortos} />
            <Field label="N° Partos Vaginales" value={consentimiento.numPartosVaginales} />
            <Field label="Instrumentado" value={consentimiento.instrumentado} />
            <Field label="N° Cesáreas" value={consentimiento.numCesareas} />
            <Field label="Fecha obstétrico" value={consentimiento.fechaObstetrico} />
            <Field label="Peso" value={consentimiento.peso} />
            <Field label="Talla" value={consentimiento.talla} />
            <Field label="Episiotomía" value={consentimiento.episiotomia} />
            <Field label="Desgarro" value={consentimiento.desgarro} />
            <Field label="Espacio entre embarazos" value={consentimiento.espacioEntreEmbarazos} />
            <Field label="Actividad física" value={consentimiento.actividadFisica} />
            <Field label="Complicaciones" value={consentimiento.complicaciones} />
            <Field label="Cirugías previas" value={consentimiento.cirugiasPrevias} />
            <Field label="Prolapsos" value={consentimiento.prolapsos} />
            <Field label="Hormonales" value={consentimiento.hormonales} />
            <Field label="Anticonceptivos" value={consentimiento.anticonceptivos} />
          </div>
        </Card>

        {/* Paso 3 */}
        <Card title="Paso 3: Estado de Salud">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-1">
            <Field label="Temperatura" value={consentimiento.temperatura} />
            <Field label="TA" value={consentimiento.ta} />
            <Field label="FR" value={consentimiento.fr} />
            <Field label="FC" value={consentimiento.fc} />
            <Field label="Peso previo" value={consentimiento.pesoPrevio} />
            <Field label="Peso actual" value={consentimiento.pesoActual} />
            <Field label="Talla" value={consentimiento.tallaEstadoSalud} />
            <Field label="IMC" value={consentimiento.imc} />
            <Field label="Abortos anteriores" value={consentimiento.abortosAnteriores} />
            <Field label="Otras complicaciones" value={consentimiento.otrasComplicaciones} />
            <Field label="Explicación complicaciones" value={consentimiento.explicacionComplicaciones} />
            <Field label="N° gestaciones previas" value={consentimiento.numGestacionesPrevias} />
            <Field label="Fatiga marcada" value={consentimiento.fatigaMarcada} />
            <Field label="Sangrado vaginal" value={consentimiento.sangradoVaginal} />
            <Field label="Debilidad/mareo" value={consentimiento.debilidadMareo} />
            <Field label="Dolor abdominal" value={consentimiento.dolorAbdominal} />
            <Field label="Sudoración espontánea" value={consentimiento.sudoracionEspontanea} />
            <Field label="Dolores de cabeza" value={consentimiento.doloresCabeza} />
            <Field label="Sudoración pantorrilla" value={consentimiento.sudoracionPantorrilla} />
            <Field label="Ausencia mov. fetales" value={consentimiento.ausenciaMovFetales} />
            <Field label="Dejar ganar peso" value={consentimiento.dejarGanarPeso} />
            <Field label="Explicación condición actual" value={consentimiento.explicacionCondicionActual} />
            <Field label="Actividades físicas" value={consentimiento.actividadesFisicas} />
            <Field label="Intensidad" value={consentimiento.intensidad} />
            <Field label="Frecuencia" value={consentimiento.frecuencia} />
            <Field label="Tiempo" value={consentimiento.tiempo} />
            <Field label="Levantar pesos" value={consentimiento.levantarPesos} />
            <Field label="Subir escaleras" value={consentimiento.subirEscaleras} />
            <Field label="Caminar ocasionalmente" value={consentimiento.caminarOcasionalmente} />
            <Field label="Bipedestación" value={consentimiento.bipedestacion} />
            <Field label="Mantener sentada" value={consentimiento.mantenerSentada} />
            <Field label="Actividad normal" value={consentimiento.actividadNormal} />
            <Field label="Actividad física deseada" value={consentimiento.actividadFisicaDeseada} />
            <Field label="Ruptura de membranas" value={consentimiento.rupturaMembranas} />
            <Field label="Hemorragia persistente" value={consentimiento.hemorragiaPersistente} />
            <Field label="Hipertensión embarazo" value={consentimiento.hipertensionEmbarazo} />
            <Field label="Cérvix incompetente" value={consentimiento.cervixIncompetente} />
            <Field label="Restricción crecimiento" value={consentimiento.restriccionCrecimiento} />
            <Field label="Embarazo alto riesgo" value={consentimiento.embarazoAltoRiesgo} />
            <Field label="Diabetes no controlada" value={consentimiento.diabetesNoControlada} />
            <Field label="Cambio de actividad" value={consentimiento.cambioActividad} />
            <Field label="Historia de aborto" value={consentimiento.historiaAborto} />
            <Field label="Enfermedad cardio-respiratoria" value={consentimiento.enfermedadCardioRespiratoria} />
            <Field label="Anemia" value={consentimiento.anemia} />
            <Field label="Malnutrición" value={consentimiento.malnutricion} />
            <Field label="Embarazo gemelar" value={consentimiento.embarazoGemelar} />
            <Field label="Diabetes no controlada absoluta" value={consentimiento.diabetesNoControladaAbsoluta} />
            <Field label="Actividad física aprobada" value={consentimiento.actividadFisicaAprobada} />
            <Field label="Observaciones" value={consentimiento.observaciones} />
          </div>
        </Card>

        {/* Paso 4 */}
        <Card title="Paso 4: Evaluación Fisioterapéutica">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-1">
            <Field label="Postura" value={consentimiento.postura} />
            <Field label="Abdomen" value={consentimiento.abdomen} />
            <Field label="Patrón respiratorio" value={consentimiento.patronRespiratorio} />
            <Field label="Diafragma" value={consentimiento.diafragma} />
            <Field label="Piel" value={consentimiento.piel} />
            <Field label="Movilidad" value={consentimiento.movilidad} />
            <Field label="Psoas secuencia" value={consentimiento.psoasSecuencia} />
            <Field label="Dolor" value={consentimiento.dolor} />
            <Field label="Palpación abdomen bajo" value={consentimiento.palpacionAbdomenBajo} />
            <Field label="Observación piso pélvico" value={consentimiento.observacionPisoPelvico} />
            <Field label="Sensibilidad piso pélvico" value={consentimiento.sensibilidadPisoPelvico} />
            <Field label="Reflejos piso pélvico" value={consentimiento.reflejosPisoPelvico} />
            <Field label="Compartimento anterior" value={consentimiento.compartimentoAnterior} />
            <Field label="Compartimento medio" value={consentimiento.compartimentoMedio} />
            <Field label="Compartimento posterior" value={consentimiento.compartimentoPosterior} />
            <Field label="Dinámicas piso pélvico" value={consentimiento.dinamicasPisoPelvico} />
            <Field label="Fuerza piso pélvico" value={consentimiento.fuerzaPisoPelvico} />
          </div>
        </Card>

        {/* Paso 5 */}
        <Card title="Paso 5: Diagnóstico y Plan de Intervención">
          <Field label="Diagnóstico fisioterapéutico" value={consentimiento.diagnosticoFisioterapeutico} />
          <Field label="Plan de intervención" value={consentimiento.planIntervencion} />
          <Field label="Visita de cierre" value={consentimiento.visitaCierre} />
          <div className="my-4 text-gray-700 border-l-4 border-indigo-300 pl-4 bg-indigo-50 rounded">
            Yo <span className="font-semibold underline">{consentimiento.paciente?.nombres || "____________________"}</span> identificada con Cédula de Ciudadanía <span className="font-semibold underline">{consentimiento.paciente?.cedula || "_____________"}</span> he entendido con claridad la explicación que me ha dado la Fisioterapeuta Dayan Ivonne Villegas Gamboa en las líneas anteriores. Por lo cual comprendo los beneficios y riesgos. Así mismo, me considero conforme y satisfecha con la información que se me ha suministrado comprendiendo de manera global todo lo que conlleva hacer parte de este programa. Por lo que a través de la presente, doy mi consentimiento expreso para que el tratamiento sea llevado a cabo.
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
            <div>
              <strong>Firma paciente:</strong>
              {consentimiento.firmaPaciente && (
                <img src={consentimiento.firmaPaciente} alt="Firma paciente" className="h-12 mt-1 border" />
              )}
            </div>
            <div>
              <strong>Firma fisioterapeuta:</strong>
              {consentimiento.firmaFisioterapeuta && (
                <img src={consentimiento.firmaFisioterapeuta} alt="Firma fisioterapeuta" className="h-12 mt-1 border" />
              )}
            </div>
          </div>
        </Card>

        {/* Autorización imágenes */}
        <Card title="Autorización de uso de imágenes">
          <div className="mb-2 text-gray-700">
            Autorizo a D&#39;Mamitas &amp; Babies para reproducir fotografías e imágenes de las actividades en las que participe, para ser utilizadas en sus publicaciones, proyectos, redes sociales y página web.
          </div>
          <div>
            <strong>Firma autorización imágenes:</strong>
            {consentimiento.firmaAutorizacion && (
              <img src={consentimiento.firmaAutorizacion} alt="Firma autorización" className="h-12 mt-1 border" />
            )}
          </div>
        </Card>

        {/* Paso 6 */}
        <Card title="Paso 6: Consentimiento Físico">
          <div className="mb-2 text-gray-700 border-l-4 border-indigo-300 pl-4 bg-indigo-50 rounded">
            Usted va a iniciar un programa de acondicionamiento físico perinatal que consta de 8 sesiones en donde realizaremos: Rumba, balonterapia, yoga, ejercicio con banda elástica, pesas, silla y palo. Estas actividades se llevan a cabo los días martes y jueves a las 7 am, este horario no es modificable. En caso de no poder asistir, por favor avisar el día anterior, de lo contrario la sesión se tomará como realizada. Solo se reponen sesiones en el caso de una incapacidad justificada. Le recomendamos constancia, con el fin de lograr los objetivos esperados como: mejorar su condición física, contribuir en una adecuada postura, mejorar la capacidad respiratoria y la circulación, tratar y/o prevenir dolores musculares, facilitar el parto vaginal y la recuperación durante el postparto, así como favorecer en su estado emocional. Como toda intervención, tratamiento o procedimiento, existen algunos riesgos como: dolor o molestia sobre todo al iniciar el programa y mareo, aunque no es muy común. Este programa es semipersonalizado por lo que estaremos muy atentos. Recuerde que su propio cuerpo es el mejor guía, en el caso de que considere que NO debe llevar a cabo alguna actividad o ejercicio está en la libertad de hacerlo.
            <br /><br />
            Yo <span className="font-semibold underline">{consentimiento.paciente?.nombres || "____________________"}</span> identificada con Cédula de Ciudadanía <span className="font-semibold underline">{consentimiento.paciente?.cedula || "_____________"}</span> he entendido con claridad la explicación que me ha dado la Fisioterapeuta Dayan Ivonne Villegas Gamboa en las líneas anteriores. Por lo cual comprendo los beneficios y riesgos. Así mismo, me considero conforme y satisfecha con la información que se me ha suministrado comprendiendo de manera global todo lo que conlleva hacer parte de este programa. Por lo que a través de la presente, doy mi consentimiento expreso para que el tratamiento sea llevado a cabo. Por favor hágale saber a su médico tratante que está haciendo parte de este programa de acondicionamiento físico.
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
            <div>
              <strong>Firma paciente (consentimiento físico):</strong>
              {consentimiento.firmaPacienteConsentimiento && (
                <img src={consentimiento.firmaPacienteConsentimiento} alt="Firma paciente consentimiento" className="h-12 mt-1 border" />
              )}
            </div>
            <div>
              <strong>Firma fisioterapeuta (consentimiento físico):</strong>
              {consentimiento.firmaFisioterapeutaConsentimiento && (
                <img src={consentimiento.firmaFisioterapeutaConsentimiento} alt="Firma fisioterapeuta consentimiento" className="h-12 mt-1 border" />
              )}
            </div>
          </div>
        </Card>

        {/* Paso 7 */}
        <Card title="Paso 7: Consentimiento Educación para el Nacimiento">
          <div className="mb-2 text-gray-700 border-l-4 border-indigo-300 pl-4 bg-indigo-50 rounded">
            Usted va a iniciar nuestro Programa de Educación para el Nacimiento que
            consta de 7 sesiones teórico-prácticas para los padres y 1 sesión para
            los abuelos, descritas a continuación. De igual manera incluye una visita
            postparto inmediato en clínica (según disponibilidad) y otra visita
            durante los siguientes 15 días de postparto, la pareja decide en qué
            momento programarla y se lleva a cabo según disponibilidad.
            <br /><br />
            <strong>Nota:</strong> Luego de estas visitas podrán tener acceso a nuevas
            asesorías con un valor especial de $60.000 cada una. Estas asesorías
            pueden ser acerca de banco de leche, extracción y conservación,
            obstrucciones, mastitis, brotes de crecimiento entre otras.
            <br /><br />
            Estas sesiones teórico-prácticas se llevan a cabo los días miércoles 6
            pm, con disponibilidad de dos horas. Se estará enviando mensaje de
            confirmación, así que agradecemos su oportuna respuesta.
            <br /><br />
            Yo <span className="font-semibold underline">{consentimiento.paciente?.nombres || "____________________"}</span> identificada con Cédula de Ciudadanía <span className="font-semibold underline">{consentimiento.paciente?.cedula || "_____________"}</span> he entendido con claridad la explicación que me ha dado la Fisioterapeuta Dayan Ivonne Villegas Gamboa en las líneas anteriores. Por lo cual comprendo los beneficios y riesgos. Así mismo, me considero conforme y satisfecha con la información que se me ha suministrado comprendiendo de manera global todo lo que conlleva hacer parte de este programa. Por lo que a través de la presente, doy mi consentimiento expreso para que el tratamiento sea llevado a cabo.
          </div>
          <div className="overflow-x-auto mt-4">
            <table className="min-w-full border text-sm mb-4">
              <thead>
                <tr className="bg-indigo-100">
                  <th className="px-2 py-1 border">Sesión</th>
                  <th className="px-2 py-1 border">Fecha</th>
                  <th className="px-2 py-1 border">Firma Paciente</th>
                </tr>
              </thead>
              <tbody>
                {(consentimiento.sesiones || []).map((s, idx) => (
                  <tr key={idx}>
                    <td>{s.nombre}</td>
                    <td>{s.fecha}</td>
                    <td>
                      {s.firmaPaciente && (
                        <img src={s.firmaPaciente} alt="Firma paciente" style={{ height: 48, border: "1px solid #ccc" }} />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <strong>Firma Paciente General:</strong>
              {consentimiento.firmaPacienteGeneral && (
                <img src={consentimiento.firmaPacienteGeneral} alt="Firma paciente general" className="h-12 mt-1 border" />
              )}
            </div>
            <div>
              <strong>Firma Fisioterapeuta General:</strong>
              {consentimiento.firmaFisioterapeutaGeneral && (
                <img src={consentimiento.firmaFisioterapeutaGeneral} alt="Firma fisioterapeuta general" className="h-12 mt-1 border" />
              )}
            </div>
          </div>
        </Card>

        {/* Paso 8 */}
        <Card title="Paso 8: Consentimiento Educación Intensivo">
          <div className="mb-2 text-gray-700 border-l-4 border-indigo-300 pl-4 bg-indigo-50 rounded">
            Usted va a iniciar nuestro Programa de Educación para el Nacimiento Intensivo que consta de 3 sesiones teórico-prácticas para los padres, descritas a continuación.
            <br /><br />
            <strong>Nota:</strong> Adicional a este servicio manejamos asesoría en Lactancia la cual consiste en dos visitas en clínica y en casa, después del nacimiento del bebé. Este servicio tiene costo de $120.000 y se programa idealmente con tiempo para contar con la disponibilidad.
            <br /><br />
            Estas sesiones teórico-prácticas se llevan a cabo según programación y disponibilidad.
            <br /><br />
            Yo <span className="font-semibold underline">{consentimiento.paciente?.nombres || "____________________"}</span> identificada con Cédula de Ciudadanía <span className="font-semibold underline">{consentimiento.paciente?.cedula || "_____________"}</span> he entendido con claridad la explicación que me ha dado la Fisioterapeuta Dayan Ivonne Villegas Gamboa en las líneas anteriores. Por lo cual comprendo los beneficios y riesgos. Así mismo, me considero conforme y satisfecha con la información que se me ha suministrado comprendiendo de manera global todo lo que conlleva hacer parte de este programa. Por lo que a través de la presente, doy mi consentimiento expreso para que el tratamiento sea llevado a cabo.
          </div>
          <div className="overflow-x-auto mt-4">
            <table className="min-w-full border text-sm mb-4">
              <thead>
                <tr className="bg-indigo-100">
                  <th className="px-2 py-1 border">Sesión</th>
                  <th className="px-2 py-1 border">Fecha</th>
                  <th className="px-2 py-1 border">Firma Paciente</th>
                </tr>
              </thead>
              <tbody>
                {(consentimiento.sesionesIntensivo || []).map((s, idx) => (
                  <tr key={idx}>
                    <td className="px-2 py-1 border">{s.nombre || ""}</td>
                    <td className="px-2 py-1 border">{s.fecha || ""}</td>
                    <td className="px-2 py-1 border">
                      {s.firmaPaciente && (
                        <img src={s.firmaPaciente} alt="Firma paciente" className="h-12 mt-1 border" />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <strong>Firma Paciente General Intensivo:</strong>
              {consentimiento.firmaPacienteGeneralIntensivo && (
                <img src={consentimiento.firmaPacienteGeneralIntensivo} alt="Firma paciente general intensivo" className="h-12 mt-1 border" />
              )}
            </div>
            <div>
              <strong>Firma Fisioterapeuta General Intensivo:</strong>
              {consentimiento.firmaFisioterapeutaGeneralIntensivo && (
                <img src={consentimiento.firmaFisioterapeutaGeneralIntensivo} alt="Firma fisioterapeuta general intensivo" className="h-12 mt-1 border" />
              )}
            </div>
          </div>
        </Card>

        {/* Botones de acción */}
        <div className="mt-8 text-center flex flex-col sm:flex-row justify-center gap-4">
          <Link
            to={`/consentimientos-perinatales/${consentimiento._id}/editar`}
            className="bg-yellow-400 hover:bg-yellow-500 text-white font-bold px-6 py-3 rounded-xl shadow transition flex items-center gap-2 text-lg justify-center"
          >
            <PencilSquareIcon className="h-6 w-6" />
            Editar
          </Link>
          <Link
            to="/consentimientos-perinatales"
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold px-6 py-3 rounded-xl shadow transition flex items-center gap-2 text-lg justify-center"
          >
            <ArrowLeftIcon className="h-6 w-6" />
            Volver a la lista
          </Link>
        </div>
      </div>
    </div>
  );
}