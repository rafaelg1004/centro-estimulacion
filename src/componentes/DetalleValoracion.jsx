import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./DetalleValoracion.css";
import logo from "../assents/LOGO.png";
import { ArrowDownTrayIcon, PencilSquareIcon, HomeIcon } from "@heroicons/react/24/solid";

const DetalleValoracion = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [valoracion, setValoracion] = useState(null);
  const detalleRef = useRef();

  const exportarWord = async () => {
    try {
      const response = await fetch("https://mi-backend-787730618984.us-central1.run.app/api/exportar-word", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(valoracion),
      });

      if (!response.ok) throw new Error("Error al exportar");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "ValoracionIngreso.pdf";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error);
      alert("Error al exportar documento");
    }
  };

  useEffect(() => {
    fetch(`https://mi-backend-787730618984.us-central1.run.app/api/valoraciones/${id}`)
      .then((res) => res.json())
      .then((data) => setValoracion(data))
      .catch((err) => console.error("Error al cargar valoración:", err));
  }, [id]);

  if (!valoracion) return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-indigo-600 border-solid"></div>
      <span className="mt-6 text-indigo-700 font-bold text-lg">Cargando valoración...</span>
    </div>
  );

  return (
    <div className="bg-gradient-to-br from-indigo-50 via-pink-50 to-green-50 min-h-screen py-8 px-2 md:px-0">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl p-6 md:p-10 border border-indigo-100" ref={detalleRef}>
        <header className="flex flex-col md:flex-row items-center md:justify-between mb-6 gap-4">
          <div className="flex-shrink-0">
            <img src={logo} alt="Logo Empresa" className="w-32 md:w-40 drop-shadow" />
          </div>
          <div className="text-center md:text-left">
            <h2 className="text-2xl md:text-3xl font-bold text-indigo-700">D'Mamitas &amp; Babies</h2>
            <p className="text-base md:text-lg text-indigo-500">Valoración de Ingreso</p>
          </div>
        </header>

        <h2 className="text-2xl font-bold text-indigo-700 mb-6 text-center drop-shadow">Detalle de Valoración</h2>

        {/* DATOS DEL PACIENTE */}
        <section className="mb-8 bg-indigo-50 rounded-xl p-4 shadow">
          <h3 className="text-lg font-semibold text-indigo-600 border-b pb-1 mb-2">Datos del Paciente</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <p><strong>Nombre del paciente:</strong> {valoracion.paciente?.nombres}</p>
            <p><strong>Edad:</strong> {valoracion.paciente?.edad}</p>
            <p><strong>Género:</strong> {valoracion.paciente?.genero}</p>
            <p><strong>Fecha de nacimiento:</strong> {valoracion.paciente?.nacimiento}</p>
            <p><strong>Registro Civil:</strong> {valoracion.paciente?.registroCivil}</p>
            <p><strong>Dirección:</strong> {valoracion.paciente?.direccion}</p>
            <p><strong>Teléfono:</strong> {valoracion.paciente?.telefono}</p>
            <p><strong>Celular:</strong> {valoracion.paciente?.celular}</p>
            <p><strong>Pediatra:</strong> {valoracion.paciente?.pediatra}</p>
            <p><strong>Aseguradora:</strong> {valoracion.paciente?.aseguradora}</p>
            {/* Agrega aquí más campos según tu modelo de Paciente */}
          </div>
        </section>

      
        {/* DATOS FAMILIARES */}
        <section className="mb-8 bg-pink-50 rounded-xl p-4 shadow">
          <h3 className="text-lg font-semibold text-pink-600 border-b pb-1 mb-2">Datos Familiares</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <p><strong>Madre:</strong> {valoracion.paciente?.nombreMadre} ({valoracion.paciente?.edadMadre} años, {valoracion.paciente?.ocupacionMadre})</p>
            <p><strong>Padre:</strong> {valoracion.paciente?.nombrePadre} ({valoracion.paciente?.edadPadre} años, {valoracion.paciente?.ocupacionPadre})</p>
          </div>
        </section>

        {/* ANTECEDENTES */}
        <section className="mb-8 bg-green-50 rounded-xl p-4 shadow">
          <h3 className="text-lg font-semibold text-green-600 border-b pb-1 mb-2">Antecedentes</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <p><strong>Prenatales:</strong> {(valoracion.antecedentesPrenatales || []).join(", ")}</p>
            <p><strong>Tipo de Parto:</strong> {valoracion.tipoParto}</p>
            <p><strong>Tiempo de Gestación:</strong> {valoracion.tiempoGestacion}</p>
            <p><strong>Lugar de Parto:</strong> {valoracion.lugarParto}</p>
            <p><strong>Atendida:</strong> {valoracion.atendida}</p>
            <p><strong>Médico Parto:</strong> {valoracion.medicoParto}</p>
            <p><strong>Peso Nacimiento:</strong> {valoracion.pesoNacimiento}</p>
            <p><strong>Talla Nacimiento:</strong> {valoracion.tallaNacimiento}</p>
            <p><strong>¿Recibió curso?:</strong> {valoracion.recibioCurso}</p>
            <p><strong>Recién nacido:</strong> {(valoracion.recienNacido || []).join(", ")}</p>
            <p><strong>Lactancia:</strong> {valoracion.lactancia}</p>
            <p><strong>Tiempo de lactancia:</strong> {valoracion.tiempoLactancia}</p>
            <p><strong>Hospitalarios:</strong> {valoracion.hospitalarios}</p>
            <p><strong>Patológicos:</strong> {valoracion.patologicos}</p>
            <p><strong>Familiares:</strong> {valoracion.familiares}</p>
            <p><strong>Traumáticos:</strong> {valoracion.traumaticos}</p>
            <p><strong>Farmacológicos:</strong> {valoracion.farmacologicos}</p>
            <p><strong>Quirúrgicos:</strong> {valoracion.quirurgicos}</p>
            <p><strong>Tóxicos:</strong> {valoracion.toxicos}</p>
            <p><strong>Dieta:</strong> {valoracion.dieta}</p>
          </div>
        </section>

        {/* MOTIVO DE CONSULTA */}
        <section className="mb-8 bg-indigo-50 rounded-xl p-4 shadow">
          <h3 className="text-lg font-semibold text-indigo-600 border-b pb-1 mb-2">Motivo de Consulta</h3>
          <p>{valoracion.motivoDeConsulta}</p>
        </section>

        {/* DESARROLLO PERSONAL Y HÁBITOS */}
        <section className="mb-8 bg-pink-50 rounded-xl p-4 shadow">
          <h3 className="text-lg font-semibold text-pink-600 border-b pb-1 mb-2">Desarrollo Personal y Hábitos</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <p><strong>Problemas de Sueño:</strong> {valoracion.problemasSueno}</p>
            <p><strong>Descripción:</strong> {valoracion.descripcionSueno}</p>
            <p><strong>Duerme con:</strong> {valoracion.duermeCon}</p>
            <p><strong>Patrón del Sueño:</strong> {valoracion.patronSueno}</p>
            <p><strong>Pesadillas:</strong> {valoracion.pesadillas}</p>
            <p><strong>Siesta:</strong> {valoracion.siesta}</p>
            <p><strong>Dificultades al comer:</strong> {valoracion.dificultadesComer}</p>
            <p><strong>Problemas al comer:</strong> {valoracion.problemasComer}</p>
            <p><strong>Alimentos preferidos:</strong> {valoracion.alimentosPreferidos}</p>
            <p><strong>Alimentos que no le gustan:</strong> {valoracion.alimentosNoLeGustan}</p>
            <p><strong>Vive con los padres:</strong> {valoracion.viveConPadres}</p>
            <p><strong>Permanece con:</strong> {valoracion.permaneceCon}</p>
            <p><strong>Prefiere a:</strong> {valoracion.prefiereA}</p>
            <p><strong>Relación con hermanos:</strong> {valoracion.relacionHermanos}</p>
            <p><strong>Emociones:</strong> {valoracion.emociones}</p>
            <p><strong>Juega con:</strong> {valoracion.juegaCon}</p>
            <p><strong>Juegos preferidos:</strong> {valoracion.juegosPreferidos}</p>
            <p><strong>Relación con desconocidos:</strong> {valoracion.relacionDesconocidos}</p>
            <p><strong>Rutina diaria:</strong></p>
            <ul className="list-disc ml-6">
              {(valoracion.rutinaDiaria || []).map((item, idx) => (
                <li key={idx}>
                  <span className="font-semibold">{item.actividad}</span>
                  {" — "}
                  {item.desde} a {item.hasta}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* DESARROLLO ONTOLÓGICO */}
        <section className="mb-8 bg-indigo-50 rounded-xl p-4 shadow">
          <h3 className="text-lg font-semibold text-indigo-600 border-b pb-1 mb-2">Desarrollo Ontológico</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {["Cefálico", "Rolados", "Sedente", "Gateo", "Bípedo", "Marcha"].map((etapa) => {
              const key =
                etapa === "Cefálico"
                  ? "ControlCefalico"
                  : etapa === "Bípedo"
                  ? "Bipedo"
                  : etapa;
              return (
                <div key={key} className="mb-2">
                  <p>
                    <strong>{etapa}:</strong>{" "}
                    {valoracion[`ontologico_${key}_si`] ? "Sí" : "No"}
                  </p>
                  <p>
                    <strong>Tiempo:</strong> {valoracion[`tiempo_${key}`]}
                  </p>
                  <p>
                    <strong>Observaciones:</strong> {valoracion[`observaciones_${key}`]}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* OBSERVACIÓN GENERAL */}
        <section className="mb-8 bg-pink-50 rounded-xl p-4 shadow">
          <h3 className="text-lg font-semibold text-pink-600 border-b pb-1 mb-2">Observación General</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <p><strong>Frecuencia Cardiaca:</strong> {valoracion.frecuenciaCardiaca}</p>
            <p><strong>Frecuencia Respiratoria:</strong> {valoracion.frecuenciaRespiratoria}</p>
            <p><strong>Temperatura:</strong> {valoracion.temperatura}</p>
            <p><strong>Tejido Tegumentario:</strong> {valoracion.tejidoTegumentario}</p>
            <p><strong>Reflejos Osteotendinosos:</strong> {valoracion.reflejosOsteotendinosos}</p>
            <p><strong>Reflejos Anormales:</strong> {valoracion.reflejosAnormales}</p>
            <p><strong>Reflejos Patológicos:</strong> {valoracion.reflejosPatologicos}</p>
            <p><strong>Tono Muscular:</strong> {valoracion.tonoMuscular}</p>
            <p><strong>Control Motor:</strong> {valoracion.controlMotor}</p>
            <p><strong>Desplazamientos:</strong> {valoracion.desplazamientos}</p>
            <p><strong>Sensibilidad:</strong> {valoracion.sensibilidad}</p>
            <p><strong>Perfil Sensorial:</strong> {valoracion.perfilSensorial}</p>
            <p><strong>Deformidades:</strong> {valoracion.deformidades}</p>
            <p><strong>Aparatos Ortopédicos:</strong> {valoracion.aparatosOrtopedicos}</p>
            <p><strong>Sistema Pulmonar:</strong> {valoracion.sistemaPulmonar}</p>
            <p><strong>Problemas Asociados:</strong> {valoracion.problemasAsociados}</p>
          </div>
        </section>

        {/* DIAGNÓSTICO Y PLAN DE TRATAMIENTO */}
        <section className="mb-8 bg-indigo-50 rounded-xl p-4 shadow">
          <h3 className="text-lg font-semibold text-indigo-600 border-b pb-1 mb-2">Diagnóstico y Plan de Tratamiento</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <p><strong>Diagnóstico:</strong> {valoracion.diagnostico}</p>
            <p><strong>Plan de Tratamiento:</strong> {valoracion.planTratamiento}</p>
          </div>
        </section>

        {/* FIRMAS */}
        <section className="mb-8 bg-pink-50 rounded-xl p-4 shadow">
          <h2 className="text-xl font-bold text-indigo-700 uppercase mb-4 border-b pb-1">
            FIRMAS
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {valoracion.firmaProfesional && (
              <div>
                <p className="text-sm font-semibold text-gray-800 mb-1">Firma del Profesional</p>
                <p className="text-sm text-gray-600">Nombre: {valoracion.nombreFisioterapeuta}</p>
                <p className="text-sm text-gray-600 mb-2">Cédula: {valoracion.cedulaFisioterapeuta}</p>
                <img src={valoracion.firmaProfesional} alt="Firma Profesional" className="border rounded h-24" />
              </div>
            )}

            {valoracion.firmaRepresentante && (
              <div>
                <p className="text-sm font-semibold text-gray-800 mb-1">Firma del Representante</p>
                <p className="text-sm text-gray-600">Nombre: {valoracion.nombreAcudiente}</p>
                <p className="text-sm text-gray-600 mb-2">Cédula: {valoracion.cedulaAcudiente}</p>
                <img src={valoracion.firmaRepresentante} alt="Firma Representante" className="border rounded h-24" />
              </div>
            )}

            {valoracion.firmaAcudiente && (
              <div>
                <p className="text-sm font-semibold text-gray-800 mb-1">Firma del Acudiente</p>
                <p className="text-sm text-gray-600">Nombre: {valoracion.nombreAcudiente}</p>
                <p className="text-sm text-gray-600 mb-2">Cédula: {valoracion.cedulaAutorizacion}</p>
                <img src={valoracion.firmaAcudiente} alt="Firma Acudiente" className="border rounded h-24" />
              </div>
            )}
          </div>

          <div className="detalle-section mt-8">
            <h3 className="text-lg font-semibold text-indigo-600 border-b pb-1 mb-2">Autorización de Uso de Imagen</h3>

            <p className="text-sm text-gray-700 mb-4">
              Atendiendo al ejercicio de la Patria Potestad, establecido en el Código Civil Colombiano en su artículo 288, el artículo 24 del Decreto 2820 de 1974 y la Ley de Infancia y Adolescencia, el Ministerio de Educación Nacional solicita la autorización escrita del padre/madre de familia o acudiente del menor de edad: <span className="font-semibold border-b border-black px-2">{valoracion.autorizacionNombre}</span>, identificado(a) con Registro Civil número <span className="font-semibold border-b border-black px-2">{valoracion.autorizacionRegistro}</span>, para reproducir fotografías e imágenes de las actividades en las que participe, para ser utilizadas en publicaciones, proyectos, redes sociales y página Web.
            </p>

            <p className="text-sm text-gray-700 mb-4">
              Para constancia de lo anterior se firma y otorga en la ciudad de <span className="font-semibold border-b border-black px-2">{valoracion.ciudadFirma}</span>, el día <span className="font-semibold border-b border-black px-2">{valoracion.diaFirma}</span> del mes de <span className="font-semibold border-b border-black px-2">{valoracion.mesFirma}</span> de <span className="font-semibold border-b border-black px-2">{valoracion.anioFirma}</span>.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <div>
                <p className="text-sm text-gray-700"><strong>Nombre del representante:</strong> {valoracion.nombreAcudiente}</p>
                <p className="text-sm text-gray-700"><strong>Cédula del representante:</strong> {valoracion.cedulaAcudiente}</p>
              </div>

              {valoracion.firmaAutorizacion && (
                <div>
                  <p className="text-sm text-gray-700 font-medium">Firma del representante:</p>
                  <img src={valoracion.firmaAutorizacion} alt="Firma Autorización" className="border mt-1 h-24" />
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Consentimiento Informado (Paso 8) */}
        <div className="detalle-section border p-4 rounded-xl my-8 shadow bg-indigo-50">
          <h3 className="text-lg font-bold text-indigo-700 mb-4">CONSTANCIA DE CONSENTIMIENTO INFORMADO</h3>
          <p className="mb-2">
            Yo <span className="font-semibold border-b border-indigo-400 px-2 bg-gray-100">{valoracion.consentimiento_nombreAcudiente}</span>
            {" "}mayor de edad e Identificado con c.c.{" "}
            <span className="font-semibold border-b border-indigo-400 px-2">{valoracion.consentimiento_ccAcudiente}</span>
            {" "}de{" "}
            <span className="font-semibold border-b border-indigo-400 px-2">{valoracion.consentimiento_lugarExpedicion}</span>
            {" "}actuando en nombre propio o como representante legal de{" "}
            <span className="font-semibold border-b border-indigo-400 px-2">{valoracion.consentimiento_nombreNino}</span>
            {" "}identificado con Registro Civil No.{" "}
            <span className="font-semibold border-b border-indigo-400 px-2">{valoracion.consentimiento_registroCivil}</span>
            {" "}HAGO CONSTAR que he sido informado hoy{" "}
            <span className="font-semibold border-b border-indigo-400 px-2">{valoracion.consentimiento_fecha}</span>
            {" "}por la Fisioterapeuta Dayan Ivonne Villegas Gamboa, sobre el programa de Estimulación Adecuada de D'Mamitas&Babies, el cual tiene el objetivo de contribuir con el desarrollo integral de mi hijo/a abordando las dimensiones del desarrollo motor, cognitivo, sensorial, lenguaje y socialización.
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
              <span className="font-semibold mb-2">Firma del Acudiente o Representante legal</span>
              {valoracion.consentimiento_firmaAcudiente && (
                <img
                  src={valoracion.consentimiento_firmaAcudiente}
                  alt="Firma Acudiente"
                  className="border border-indigo-400 rounded bg-white mb-2"
                  style={{ width: 220, height: 80 }}
                />
              )}
              <span className="font-semibold border-b border-indigo-400 px-2 mt-2">{valoracion.consentimiento_ccFirmaAcudiente}</span>
              <span className="text-xs text-gray-700">C.C.</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="font-semibold mb-2">Firma del Fisioterapeuta</span>
              {valoracion.consentimiento_firmaFisio && (
                <img
                  src={valoracion.consentimiento_firmaFisio}
                  alt="Firma Fisioterapeuta"
                  className="border border-indigo-400 rounded bg-white mb-2"
                  style={{ width: 220, height: 80 }}
                />
              )}
              <span className="font-semibold border-b border-indigo-400 px-2 mt-2">{valoracion.cedulaFisioterapeuta}</span>
              <span className="text-xs text-gray-700">C.C.</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-center items-center gap-4 mt-8">
          <button
            onClick={exportarWord}
            className="bg-green-500 hover:bg-green-600 text-white font-bold px-6 py-3 rounded-xl shadow transition flex items-center gap-2 text-lg"
          >
            <ArrowDownTrayIcon className="h-6 w-6" />
            Exportar PDF
          </button>
          <button
            onClick={() => navigate(`/valoraciones/editar/${id}`)}
            className="bg-yellow-400 hover:bg-yellow-500 text-white font-bold px-6 py-3 rounded-xl shadow transition flex items-center gap-2 text-lg"
          >
            <PencilSquareIcon className="h-6 w-6" />
            Editar valoración
          </button>
          <button
            type="button"
            onClick={() => navigate("/")}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold px-6 py-3 rounded-xl shadow transition flex items-center gap-2 text-lg"
          >
            <HomeIcon className="h-6 w-6" />
            Volver al inicio
          </button>
        </div>
      </div>
    </div>
  );
};

export default DetalleValoracion;
