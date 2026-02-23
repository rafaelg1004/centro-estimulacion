import React, { useEffect, useState } from "react";
import { apiRequest } from "../../config/api";

import { useParams, Link } from "react-router-dom";
import Spinner from "../ui/Spinner";
import { PencilSquareIcon, ArrowLeftIcon, ArrowDownTrayIcon, LockClosedIcon } from "@heroicons/react/24/solid";
import Swal from 'sweetalert2';

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

  const exportarPDF = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/valoraciones/reporte/exportar-pdf/${id}?type=perinatal`, {
        method: 'GET',
        headers: { 'Accept': 'application/pdf' },
      });

      if (!response.ok) throw new Error('Error al generar el PDF');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `REPORTE_PERINATAL_${id}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exportando PDF:', error);
      alert('Error al generar el reporte PDF');
    }
  };

  useEffect(() => {
    apiRequest(`/consentimiento-perinatal/${id}`)
      .then(data => {
        if (Array.isArray(data.sesionesIntensivo)) {
          data.sesionesIntensivo.forEach((sesion, idx) => {
            data[`fechaSesionIntensivo${idx + 1}`] = sesion.fecha || "";
            data[`firmaPacienteSesionIntensivo${idx + 1}`] = sesion.firmaPaciente || "";
          });
        }
        setConsentimiento(data);
      })
      .catch(err => console.error("Error cargando consentimiento:", err));
  }, [id]);

  const bloquearRegistro = async () => {
    const result = await Swal.fire({
      title: '¿Cerrar Historia Clínica?',
      text: "Una vez bloqueada, la historia clínica será inmutable y no podrá ser editada ni eliminada.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      confirmButtonText: 'Sí, bloquear permanentemente',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      try {
        Swal.fire({ title: 'Bloqueando...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });
        await apiRequest(`/consentimiento-perinatal/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ bloqueada: true })
        });
        const updated = await apiRequest(`/consentimiento-perinatal/${id}`);
        setConsentimiento(updated);
        Swal.fire('¡Bloqueada!', 'El registro ahora es inmutable.', 'success');
      } catch (error) {
        Swal.fire('Error', 'No se pudo bloquear: ' + error.message, 'error');
      }
    }
  };

  if (!consentimiento) return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-indigo-100 via-pink-100 to-green-100">
      <Spinner />
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-pink-100 to-green-100 py-10 px-2">
      <div className="max-w-5xl w-full mx-auto bg-white p-8 rounded-3xl shadow-2xl border border-indigo-100">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8 px-4">
          <div className="flex flex-col items-center md:items-start">
            <h2 className="text-3xl font-extrabold text-indigo-800 drop-shadow">
              Detalle Consentimiento Perinatal
            </h2>
            {consentimiento.bloqueada && (
              <div className="bg-red-100 text-red-800 text-xs font-bold px-3 py-1 rounded-full border border-red-200 flex items-center gap-1 mt-2">
                <LockClosedIcon className="h-4 w-4" />
                BLOQUEADA (INMUTABLE)
              </div>
            )}
          </div>
          <div className="mt-4 md:mt-0">
            {/* Espacio para badge o info adicional */}
          </div>
        </div>

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

        {/* Tipo de Programa Seleccionado */}
        <Card title="Tipo de Programa">
          <div className="text-center p-4">
            <span className="inline-block bg-indigo-100 text-indigo-800 px-4 py-2 rounded-full font-semibold text-lg capitalize">
              {consentimiento.tipoPrograma || 'No especificado'}
            </span>
          </div>
        </Card>

        {/* Paso 6 - Solo mostrar si tiene firmas de consentimiento físico */}
        {(consentimiento.firmaPacienteConsentimiento || consentimiento.firmaFisioterapeutaConsentimiento) && (
          <Card title="Paso 6: Consentimiento Físico">
            <div className="mb-2 text-gray-700 border-l-4 border-indigo-300 pl-4 bg-indigo-50 rounded">
              Usted va a iniciar un programa de acondicionamiento físico perinatal que consta de 8 sesiones en donde realizaremos: Rumba, balonterapia, yoga, ejercicio con banda elástica, pesas, silla y palo. Estas actividades se llevan a cabo los días martes y jueves a las 7 am, este horario no es modificable. En caso de no poder asistir, por favor avisar el día anterior, de lo contrario la sesión se tomará como realizada. Solo se reponen sesiones en el caso de una incapacidad justificada. Le recomendamos constancia, con el fin de lograr los objetivos esperados como: mejorar su condición física, contribuir en una adecuada postura, mejorar la capacidad respiratoria y la circulación, tratar y/o prevenir dolores musculares, facilitar el parto vaginal y la recuperación durante el postparto, así como favorecer en su estado emocional. Como toda intervención, tratamiento o procedimiento, existen algunos riesgos como: dolor o molestia sobre todo al iniciar el programa y mareo, aunque no es muy común. Este programa es semipersonalizado por lo que estaremos muy atentos. Recuerde que su propio cuerpo es el mejor guía, en el caso de que considere que NO debe llevar a cabo alguna actividad o ejercicio está en la libertad de hacerlo.
              <br /><br />
              Yo <span className="font-semibold underline">{consentimiento.paciente?.nombres || "____________________"}</span> identificada con Cédula de Ciudadanía <span className="font-semibold underline">{consentimiento.paciente?.cedula || "_____________"}</span> he entendido con claridad la explicación que me ha dado la Fisioterapeuta Dayan Ivonne Villegas Gamboa en las líneas anteriores. Por lo cual comprendo los beneficios y riesgos. Así mismo, me considero conforme y satisfecha con la información que se me ha suministrado comprendiendo de manera global todo lo que conlleva hacer parte de este programa. Por lo que a través de la presente, doy mi consentimiento expreso para que el tratamiento sea llevado a cabo. Por favor hágale saber a su médico tratante que está haciendo parte de este programa de acondicionamiento físico.
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
              <div>
                <strong>Firma paciente (consentimiento físico):</strong>
                {consentimiento.firmaPacienteConsentimiento ? (
                  <img src={consentimiento.firmaPacienteConsentimiento} alt="Firma paciente consentimiento" className="h-12 mt-1 border" />
                ) : (
                  <div className="text-gray-400 text-sm mt-1">Sin firma</div>
                )}
              </div>
              <div>
                <strong>Firma fisioterapeuta (consentimiento físico):</strong>
                {consentimiento.firmaFisioterapeutaConsentimiento ? (
                  <img src={consentimiento.firmaFisioterapeutaConsentimiento} alt="Firma fisioterapeuta consentimiento" className="h-12 mt-1 border" />
                ) : (
                  <div className="text-gray-400 text-sm mt-1">Sin firma</div>
                )}
              </div>
            </div>
          </Card>
        )}

        {/* Paso 7 - Solo mostrar si tiene firmas de educación */}
        {(consentimiento.firmaPacienteGeneral || consentimiento.firmaFisioterapeutaGeneral) && (
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
            <div className="mt-4 text-sm text-gray-600">
              <p><strong>Sesiones programadas:</strong> {(consentimiento.sesiones || []).length} sesiones de educación para el nacimiento</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <strong>Firma Paciente General:</strong>
                {consentimiento.firmaPacienteGeneral ? (
                  <div className="flex flex-col">
                    <img src={consentimiento.firmaPacienteGeneral} alt="Firma paciente general" className="h-12 mt-1 border bg-white" />
                    {consentimiento.auditTrail?.firmaPacienteGeneral && (
                      <div className="text-[10px] text-gray-400 mt-1 font-mono">
                        IP: {consentimiento.auditTrail.firmaPacienteGeneral.ip} | {new Date(consentimiento.auditTrail.firmaPacienteGeneral.fechaHora).toLocaleString()}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-gray-400 text-sm mt-1">Sin firma</div>
                )}
              </div>
              <div>
                <strong>Firma Fisioterapeuta General:</strong>
                {consentimiento.firmaFisioterapeutaGeneral ? (
                  <div className="flex flex-col">
                    <img src={consentimiento.firmaFisioterapeutaGeneral} alt="Firma fisioterapeuta general" className="h-12 mt-1 border bg-white" />
                    {consentimiento.auditTrail?.firmaFisioterapeutaGeneral && (
                      <div className="text-[10px] text-gray-400 mt-1 font-mono">
                        IP: {consentimiento.auditTrail.firmaFisioterapeutaGeneral.ip} | Reg: {consentimiento.auditTrail.firmaFisioterapeutaGeneral.registroProfesional}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-gray-400 text-sm mt-1">Sin firma</div>
                )}
              </div>
            </div>
          </Card>
        )}

        {/* Firmas Físicas - Solo mostrar si tiene firmas físicas */}
        {(consentimiento.firmaPacienteFisico || consentimiento.firmaFisioterapeutaFisico) && (
          <Card title="Consentimiento Físico">
            <div className="mb-2 text-gray-700 border-l-4 border-blue-300 pl-4 bg-blue-50 rounded">
              Consentimiento para el programa de acondicionamiento físico perinatal.
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <strong>Firma Paciente (Físico):</strong>
                {consentimiento.firmaPacienteFisico ? (
                  <div className="flex flex-col">
                    <img src={consentimiento.firmaPacienteFisico} alt="Firma paciente físico" className="h-12 mt-1 border bg-white" />
                    {consentimiento.auditTrail?.firmaPacienteFisico && (
                      <div className="text-[10px] text-gray-400 mt-1 font-mono">
                        IP: {consentimiento.auditTrail.firmaPacienteFisico.ip} | {new Date(consentimiento.auditTrail.firmaPacienteFisico.fechaHora).toLocaleString()}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-gray-400 text-sm mt-1">Sin firma</div>
                )}
              </div>
              <div>
                <strong>Firma Fisioterapeuta (Físico):</strong>
                {consentimiento.firmaFisioterapeutaFisico ? (
                  <div className="flex flex-col">
                    <img src={consentimiento.firmaFisioterapeutaFisico} alt="Firma fisioterapeuta físico" className="h-12 mt-1 border bg-white" />
                    {consentimiento.auditTrail?.firmaFisioterapeutaFisico && (
                      <div className="text-[10px] text-gray-400 mt-1 font-mono">
                        IP: {consentimiento.auditTrail.firmaFisioterapeutaFisico.ip} | Reg: {consentimiento.auditTrail.firmaFisioterapeutaFisico.registroProfesional}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-gray-400 text-sm mt-1">Sin firma</div>
                )}
              </div>
            </div>
          </Card>
        )}

        {/* Paso 8 - Solo mostrar si tiene firmas intensivo */}
        {(consentimiento.firmaPacienteEducacion || consentimiento.firmaFisioterapeutaEducacion) && (
          <Card title="Paso 8: Consentimiento Educación Intensivo">
            <div className="mb-2 text-gray-700 border-l-4 border-purple-300 pl-4 bg-purple-50 rounded">
              Usted va a iniciar nuestro Programa de Educación para el Nacimiento Intensivo que consta de 3 sesiones teórico-prácticas para los padres, descritas a continuación.
              <br /><br />
              <strong>Nota:</strong> Adicional a este servicio manejamos asesoría en Lactancia la cual consiste en dos visitas en clínica y en casa, después del nacimiento del bebé. Este servicio tiene costo de $120.000 y se programa idealmente con tiempo para contar con la disponibilidad.
              <br /><br />
              Estas sesiones teórico-prácticas se llevan a cabo según programación y disponibilidad.
              <br /><br />
              Yo <span className="font-semibold underline">{consentimiento.paciente?.nombres || "____________________"}</span> identificada con Cédula de Ciudadanía <span className="font-semibold underline">{consentimiento.paciente?.cedula || "_____________"}</span> he entendido con claridad la explicación que me ha dado la Fisioterapeuta Dayan Ivonne Villegas Gamboa en las líneas anteriores. Por lo cual comprendo los beneficios y riesgos. Así mismo, me considero conforme y satisfecha con la información que se me ha suministrado comprendiendo de manera global todo lo que conlleva hacer parte de este programa. Por lo que a través de la presente, doy mi consentimiento expreso para que el tratamiento sea llevado a cabo.
            </div>
            <div className="mt-4 text-sm text-gray-600">
              <p><strong>Sesiones programadas:</strong> {(consentimiento.sesionesIntensivo || []).length} sesiones intensivas</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <strong>Firma Paciente (Intensivo):</strong>
                {consentimiento.firmaPacienteEducacion ? (
                  <div className="flex flex-col">
                    <img src={consentimiento.firmaPacienteEducacion} alt="Firma paciente intensivo" className="h-12 mt-1 border bg-white" />
                    {consentimiento.auditTrail?.firmaPacienteEducacion && (
                      <div className="text-[10px] text-gray-400 mt-1 font-mono">
                        IP: {consentimiento.auditTrail.firmaPacienteEducacion.ip} | {new Date(consentimiento.auditTrail.firmaPacienteEducacion.fechaHora).toLocaleString()}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-gray-400 text-sm mt-1">Sin firma</div>
                )}
              </div>
              <div>
                <strong>Firma Fisioterapeuta (Intensivo):</strong>
                {consentimiento.firmaFisioterapeutaEducacion ? (
                  <div className="flex flex-col">
                    <img src={consentimiento.firmaFisioterapeutaEducacion} alt="Firma fisioterapeuta intensivo" className="h-12 mt-1 border bg-white" />
                    {consentimiento.auditTrail?.firmaFisioterapeutaEducacion && (
                      <div className="text-[10px] text-gray-400 mt-1 font-mono">
                        IP: {consentimiento.auditTrail.firmaFisioterapeutaEducacion.ip} | Reg: {consentimiento.auditTrail.firmaFisioterapeutaEducacion.registroProfesional}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-gray-400 text-sm mt-1">Sin firma</div>
                )}
              </div>
            </div>
          </Card>
        )}

        {consentimiento.bloqueada && consentimiento.selloIntegridad && (
          <div className="mt-8 p-4 bg-gray-50 border-t border-gray-200 rounded-b-xl">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] text-gray-500 font-mono">
              <div className="flex items-center gap-2">
                <span className="font-bold text-green-600 flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3">
                    <path fillRule="evenodd" d="M12.516 2.17a.75.75 0 0 0-1.032 0 11.209 11.209 0 0 1-7.877 3.08.75.75 0 0 0-.722.515A12.74 12.74 0 0 0 2.25 9.75c0 5.944 4.068 10.938 9.52 12.334a.75.75 0 0 0 .46 0c5.451-1.396 9.52-6.39 9.52-12.334 0-1.36-.21-2.674-.601-3.91a.75.75 0 0 0-.722-.515 11.209 11.209 0 0 1-7.877-3.08Zm-1.545 14.167 4.1-4.1a.75.75 0 1 0-1.06-1.06l-3.57 3.57-1.57-1.57a.75.75 0 0 0-1.06 1.06l2.1 2.1a.75.75 0 0 0 1.06 0Z" clipRule="evenodd" />
                  </svg>
                  SELLO DE INTEGRIDAD:
                </span>
                <span className="break-all">{consentimiento.selloIntegridad}</span>
              </div>
              <div className="whitespace-nowrap italic">
                Cerrada el: {new Date(consentimiento.fechaBloqueo).toLocaleString()}
              </div>
            </div>
            <p className="text-[9px] text-gray-400 mt-2 text-center uppercase">
              Este documento ha sido sellado criptográficamente y es inmutable bajo la Ley 527 de 1999.
            </p>
          </div>
        )}

        {/* Botones de acción */}
        <div className="mt-8 text-center flex flex-col sm:flex-row justify-center gap-4">
          <Link
            to={consentimiento.bloqueada ? "#" : `/consentimientos-perinatales/${consentimiento._id}/editar`}
            className={`${consentimiento.bloqueada ? 'bg-gray-400 cursor-not-allowed' : 'bg-yellow-400 hover:bg-yellow-500'} text-white font-bold px-6 py-3 rounded-xl shadow transition flex items-center gap-2 text-lg justify-center`}
            onClick={(e) => consentimiento.bloqueada && e.preventDefault()}
          >
            <PencilSquareIcon className="h-6 w-6" />
            {consentimiento.bloqueada ? 'Solo Lectura' : 'Editar'}
          </Link>

          {!consentimiento.bloqueada && (
            <button
              onClick={bloquearRegistro}
              className="bg-red-500 hover:bg-red-600 text-white font-bold px-6 py-3 rounded-xl shadow transition flex items-center gap-2 text-lg justify-center"
            >
              <LockClosedIcon className="h-6 w-6" />
              Cerrar Historia
            </button>
          )}

          <button
            onClick={exportarPDF}
            className="bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-3 rounded-xl shadow transition flex items-center gap-2 text-lg justify-center"
          >
            <ArrowDownTrayIcon className="h-6 w-6" />
            Exportar PDF
          </button>

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