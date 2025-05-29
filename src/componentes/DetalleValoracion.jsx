import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
//import jsPDF from "jspdf";
//import html2canvas from "html2canvas";
import "./DetalleValoracion.css";
import logo from "../assents/LOGO.png";

const DetalleValoracion = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [valoracion, setValoracion] = useState(null);
  const detalleRef = useRef();
   /*const exportarWord = async () => {
    try {
      const response = await fetch("http://localhost:4000/api/exportar-word", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(valoracion), // los datos ya cargados desde Mongo
      });

      if (!response.ok) throw new Error("Error al exportar");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "ValoracionIngreso.docx";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error);
      alert("Error al exportar documento");
    }
  };*/
  const exportarPDF2 = async () => {
  try {
    const response = await fetch("https://hopeful-insight.railway.app//api/exportar-pdf", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(valoracion) // 👈 Enviar los datos cargados desde Mongo
    });

    if (!response.ok) throw new Error("Error al exportar PDF");

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
    console.error("❌ Error al exportar:", error);
    alert("Hubo un error al generar el PDF");
  }
};

  useEffect(() => {
    fetch(`https://hopeful-insight.railway.app/api/valoraciones/${id}`)
      .then((res) => res.json())
      .then((data) => setValoracion(data))
      .catch((err) => console.error("Error al cargar valoración:", err));
  }, [id]);

  /*{const exportarPDF = async () => {
    const input = detalleRef.current;
    window.scrollTo(0, 0);

    const canvas = await html2canvas(input, {
      scale: 2,
      useCORS: true,
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const imgHeight = (canvas.height * pdfWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
    heightLeft -= pdfHeight;

    while (heightLeft > 0) {
      position -= pdfHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
      heightLeft -= pdfHeight;
    }

    pdf.save(`valoracion_${valoracion.nombres}.pdf`);
  };*/

  if (!valoracion) return <p>Cargando...</p>;
  
   console.log("📦 Datos enviados:", valoracion);
  return (
      <div className="detalle-container" ref={detalleRef}>
      <header className="encabezado">
        <div className="logo-container">
          <img src={logo} alt="Logo Empresa" className="logo-empresa" />
        </div>
        <div className="titulo-container">
          <h2 className="titulo">CENTRO DE ESTIMULACIÓN MAMITAS</h2>
          <p className="subtitulo">Valoración de Ingreso</p>
        </div>
      </header>
      <h2 className="text-2xl font-bold text-indigo-700 mb-6 text-center">
      Detalle de Valoración
    </h2>
       <div className="detalle-section border p-4 rounded-md mb-6 shadow-sm">
      <section className="mb-6">
        <h3 className="text-lg font-semibold text-indigo-600 border-b pb-1 mb-2">Datos Generales</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <p><strong>Nombre:</strong> {valoracion.nombres}</p>
          <p><strong>Edad:</strong> {valoracion.edad}</p>
          <p><strong>Género:</strong> {valoracion.genero}</p>
          <p><strong>Nacimiento:</strong> {valoracion.nacimiento}</p>
          <p  ><strong>Registro Civil:</strong> {valoracion.registroCivil}</p>
          <p><strong>Peso:</strong> {valoracion.peso}</p>
          <p><strong>Talla:</strong> {valoracion.talla}</p>
          <p><strong>Dirección:</strong> {valoracion.direccion}</p>
          <p><strong>Teléfono:</strong> {valoracion.telefono}</p>
          <p><strong>Celular:</strong> {valoracion.celular}</p>
          <p><strong>Pediatra:</strong> {valoracion.pediatra}</p>
          <p><strong>Aseguradora:</strong> {valoracion.aseguradora}</p>
        </div>
      </section>
      </div>
      <div className="detalle-section border p-4 rounded-md mb-6 shadow-sm">
      <section className="mb-6">
        <h3 className="text-lg font-semibold text-indigo-600 border-b pb-1 mb-2">Datos Familiares</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        <p><strong>Madre:</strong> {valoracion.madreNombre} ({valoracion.madreEdad} años, {valoracion.madreOcupacion})</p>
        <p><strong>Padre:</strong> {valoracion.padreNombre} ({valoracion.padreEdad} años, {valoracion.padreOcupacion})</p>
        </div>
      </section>
        </div>
      <div className="detalle-section border p-4 rounded-md mb-6 shadow-sm">
      <section className="mb-6">
        <h3 className="text-lg font-semibold text-indigo-600 border-b pb-1 mb-2">Antecedentes</h3>
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
      </div>
      <div className="detalle-section border p-4 rounded-md mb-6 shadow-sm">
      <section className="mb-6">
        <h3>Desarrollo Personal y Hábitos</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <p><strong>Problemas de Sueño:</strong> {valoracion.problemasSueño}</p>
            <p><strong>Descripción:</strong> {valoracion.descripcionProblemasSueño}</p>
            <p><strong>Duerme con:</strong> {valoracion.duermeCon}</p>
            <p><strong>Patrón del Sueño:</strong> {valoracion.patronSueno}</p>
            <p><strong>Pesadillas:</strong> {valoracion.pesadillas}</p>
      <p><strong>Siesta:</strong> {valoracion.siesta}</p>
      <p><strong>Dificultades al comer:</strong> {valoracion.dificultadAlimentacion}</p>
      <p><strong>Motivo:</strong> {valoracion.motivoDificultadAlimentacion}</p>
      <p><strong>Problemas al comer:</strong> {(valoracion.problemasComida || []).join(", ")}</p>
      <p><strong>Detalle de problemas al comer:</strong> {valoracion.detalleProblemasAlComer}</p>
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
      <p><strong>Rutina diaria:</strong> {valoracion.rutinaDiaria}</p>
        </div>
      </section>
            </div>

      <div className="detalle-section border p-4 rounded-md mb-6 shadow-sm">
             
            <section className="mb-6">
        <h3 className="text-lg font-semibold text-indigo-600 border-b pb-1 mb-2">Desarrollo Ontológico</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {["Cefálico", "Rolados", "Sedente", "Gateo", "Bípedo", "Marcha"].map((etapa) => {
          const key = etapa === "Cefálico" ? "ControlCefálico" : etapa;
          return (
            <div key={key} className="mb-2">
              <p><strong>{etapa}:</strong> {valoracion[`ontologico_${key}_si`] ? "Sí" : "No"}</p>
              <p><strong>Tiempo:</strong> {valoracion[`tiempo_${key}`]}</p>
              <p><strong>Observaciones:</strong> {valoracion[`observaciones_${key}`]}</p>
            </div>
          );
        })}
        </div>
      </section>
      </div>
      <div className="detalle-section border p-4 rounded-md mb-6 shadow-sm">
     <section className="mb-6">
        <h3 className="text-lg font-semibold text-indigo-600 border-b pb-1 mb-2">Observación General</h3>
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


            </div>
      <div className="detalle-section border p-4 rounded-md mb-6 shadow-sm">
           <section className="mb-6">
        <h3 className="text-lg font-semibold text-indigo-600 border-b pb-1 mb-2">Diagnóstico y Plan de Tratamiento</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        <p><strong>Diagnóstico:</strong> {valoracion.diagnostico}</p>
        <p><strong>Plan de Tratamiento:</strong> {valoracion.planTratamiento}</p>
        </div>
      </section>
      </div>
    <div className="detalle-section border p-4 rounded-md mb-6 shadow-sm">

      <section className="mb-6">
        <h2 className="text-xl font-bold text-indigo-700 uppercase mb-4 border-b pb-1">
    FIRMAS
  </h2>

  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    {valoracion.firmaProfesional && (
      <div>
        <p className="text-sm font-semibold text-gray-800 mb-1">Firma del Profesional</p>
        <p className="text-sm text-gray-600">Nombre: {valoracion.nombreProfesional}</p>
        <p className="text-sm text-gray-600 mb-2">Cédula: {valoracion.cedulaFisioterapeuta}</p>
        <img src={valoracion.firmaProfesional} alt="Firma Profesional" className="border rounded h-24" />
      </div>
    )}

    {valoracion.firmaRepresentante && (
      <div>
        <p className="text-sm font-semibold text-gray-800 mb-1">Firma del Representante</p>
        <p className="text-sm text-gray-600">Nombre: {valoracion.nombreRepresentante}</p>
        <p className="text-sm text-gray-600 mb-2">Cédula: {valoracion.cedulaAutorizacion}</p>
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
      <p className="text-sm text-gray-700"><strong>Nombre del acudiente:</strong> {valoracion.autorizacionNombre}</p>
      <p className="text-sm text-gray-700"><strong>Cédula de ciudadanía:</strong> {valoracion.cedulaAutorizacion}</p>
       </div>

    {valoracion.firmaAutorizacion && (
          <div>
        <p className="text-sm text-gray-700 font-medium">Firma del acudiente:</p>
        <img src={valoracion.firmaAutorizacion} alt="Firma Autorización" className="border mt-1 h-24" />
      </div>
     )}
    </div>
    </div>

        
      </section>
      </div>

                 <button
      onClick={exportarPDF2}
    className="mt-6 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
  Exportar Documento Oficial (.docx)
</button>
<button
        type="button"
        onClick={() => navigate("/")}
        className="mt-4 bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded"
      >
        Volver al inicio
      </button>
    </div>
    
  );
  
};

export default DetalleValoracion;
