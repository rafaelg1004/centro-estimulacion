import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./DetalleValoracion.css";
import logo from "../assents/LOGO.png";
import { ArrowDownTrayIcon, PencilSquareIcon, HomeIcon } from "@heroicons/react/24/solid";
import { apiRequest } from "../config/api";
import { exportarValoracionPisoPelvicoAWord } from "../utils/exportarValoracionWord";
import Swal from 'sweetalert2';

// Función helper para renderizar valores de forma segura
const renderValue = (value) => {
  if (value === null || value === undefined) return '';
  if (typeof value === 'object') {
    // Si es un array, unirlo con comas
    if (Array.isArray(value)) {
      return value.join(', ');
    }
    // Si es un objeto, convertir a string o devolver "No especificado"
    return JSON.stringify(value);
  }
  return String(value);
};

// Función helper para obtener datos del paciente (modelo nuevo o antiguo)
const obtenerDatoPaciente = (valoracion, campo) => {
  // Primero intentar con el modelo nuevo (valoracion.paciente)
  if (valoracion.paciente && valoracion.paciente[campo] !== undefined) {
    return valoracion.paciente[campo];
  }

  // Si no existe, intentar con el modelo antiguo (directamente en valoracion)
  if (valoracion[campo] !== undefined) {
    return valoracion[campo];
  }

  // Si no existe en ninguno, devolver null
  return null;
};

const DetalleValoracion = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [valoracion, setValoracion] = useState(null);
  const detalleRef = useRef();

  const exportarWord = async () => {
    try {
      console.log('🔄 Iniciando exportación a Word...');
      console.log('📊 Datos de valoración para exportar:', valoracion);

      // Usar nuestra función de exportación a Word
      await exportarValoracionPisoPelvicoAWord(valoracion);

      console.log('✅ Exportación a Word completada exitosamente');
    } catch (error) {
      console.error('❌ Error al exportar a Word:', error);
      alert("Error al exportar documento a Word");
    }
  };

  const exportarPDF = async () => {
    try {
      Swal.fire({
        title: 'Generando PDF...',
        text: 'Preparando el informe con firmas desde el servidor',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });

      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/valoraciones/reporte/exportar-pdf/${id}?type=nino`, {
        method: 'GET',
        headers: {
          'Accept': 'application/pdf',
        },
      });

      if (!response.ok) throw new Error('Error al generar el PDF');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `REPORTE_VALORACION_${id}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      Swal.fire({
        icon: 'success',
        title: '¡PDF Generado!',
        text: 'El reporte se ha descargado correctamente.',
        timer: 2000,
        showConfirmButton: false
      });
    } catch (error) {
      console.error('Error exportando PDF:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo generar el reporte PDF.'
      });
    }
  };

  const bloquearValoracion = async () => {
    const result = await Swal.fire({
      title: '¿Cerrar Historia Clínica?',
      text: "Una vez bloqueada, la historia clínica será inmutable y no podrá ser editada ni eliminada, cumpliendo con la normativa de salud vigente.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, bloquear permanentemente',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      try {
        Swal.fire({
          title: 'Bloqueando registro...',
          allowOutsideClick: false,
          didOpen: () => Swal.showLoading()
        });

        await apiRequest(`/valoraciones/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ bloqueada: true })
        });

        // Recargar datos
        const updatedData = await apiRequest(`/valoraciones/${id}`);
        setValoracion(updatedData);

        Swal.fire(
          '¡Bloqueada!',
          'El registro de historia clínica ahora es inmutable.',
          'success'
        );
      } catch (error) {
        console.error('Error bloqueando valoración:', error);
        Swal.fire('Error', 'No se pudo bloquear el registro: ' + error.message, 'error');
      }
    }
  };

  useEffect(() => {
    apiRequest(`/valoraciones/${id}`)
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


        <h2 className="text-2xl font-bold text-indigo-700 mb-2 text-center drop-shadow">Detalle de Valoración</h2>
        {valoracion.bloqueada && (
          <div className="flex justify-center mb-6">
            <span className="bg-red-100 text-red-800 text-sm font-bold px-4 py-1.5 rounded-full border border-red-200 flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-red-600 animate-pulse"></span>
              HISTORIA CLÍNICA BLOQUEADA (INMUTABLE)
            </span>
          </div>
        )}

        {/* INFORMACIÓN DE LA VALORACIÓN */}
        <section className="mb-8 bg-purple-50 rounded-xl p-4 shadow">
          <h3 className="text-lg font-semibold text-purple-600 border-b pb-1 mb-2">Información de la Valoración</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <p><strong>Fecha de la Valoración:</strong> {valoracion.fecha || 'No especificado'}</p>
            <p><strong>Hora de la Valoración:</strong> {valoracion.hora || 'No especificado'}</p>
          </div>
        </section>

        {/* DATOS DEL PACIENTE */}
        <section className="mb-8 bg-indigo-50 rounded-xl p-4 shadow">
          <h3 className="text-lg font-semibold text-indigo-600 border-b pb-1 mb-2">Datos Generales</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <p><strong>Nombres:</strong> {obtenerDatoPaciente(valoracion, 'nombres') || 'No especificado'}</p>
            <p><strong>Registro Civil:</strong> {obtenerDatoPaciente(valoracion, 'registroCivil') || 'No especificado'}</p>
            <p><strong>Género:</strong> {obtenerDatoPaciente(valoracion, 'genero') || 'No especificado'}</p>
            <p><strong>Lugar de Nacimiento:</strong> {obtenerDatoPaciente(valoracion, 'lugarNacimiento') || 'No especificado'}</p>
            <p><strong>Fecha de Nacimiento:</strong> {obtenerDatoPaciente(valoracion, 'fechaNacimiento') || obtenerDatoPaciente(valoracion, 'nacimiento') || 'No especificado'}</p>
            <p><strong>Edad:</strong> {obtenerDatoPaciente(valoracion, 'edad') || 'No especificado'}</p>
            <p><strong>Peso:</strong> {obtenerDatoPaciente(valoracion, 'peso') || 'No especificado'}</p>
            <p><strong>Talla:</strong> {obtenerDatoPaciente(valoracion, 'talla') || 'No especificado'}</p>
          </div>
        </section>

        {/* CONTACTO Y SALUD */}
        <section className="mb-8 bg-green-50 rounded-xl p-4 shadow">
          <h3 className="text-lg font-semibold text-green-600 border-b pb-1 mb-2">Contacto y Salud</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <p><strong>Dirección:</strong> {obtenerDatoPaciente(valoracion, 'direccion') || 'No especificado'}</p>
            <p><strong>Teléfono:</strong> {obtenerDatoPaciente(valoracion, 'telefono') || 'No especificado'}</p>
            <p><strong>Celular:</strong> {obtenerDatoPaciente(valoracion, 'celular') || 'No especificado'}</p>
            <p><strong>Pediatra:</strong> {obtenerDatoPaciente(valoracion, 'pediatra') || 'No especificado'}</p>
            <p><strong>Aseguradora:</strong> {obtenerDatoPaciente(valoracion, 'aseguradora') || 'No especificado'}</p>
          </div>
        </section>


        {/* DATOS FAMILIARES */}
        <section className="mb-8 bg-pink-50 rounded-xl p-4 shadow">
          <h3 className="text-lg font-semibold text-pink-600 border-b pb-1 mb-2">Datos Familiares</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <p><strong>Nombre Madre:</strong> {obtenerDatoPaciente(valoracion, 'nombreMadre') || obtenerDatoPaciente(valoracion, 'madreNombre') || 'No especificado'}</p>
            <p><strong>Edad Madre:</strong> {obtenerDatoPaciente(valoracion, 'edadMadre') || obtenerDatoPaciente(valoracion, 'madreEdad') || 'No especificado'}</p>
            <p><strong>Ocupación Madre:</strong> {obtenerDatoPaciente(valoracion, 'ocupacionMadre') || obtenerDatoPaciente(valoracion, 'madreOcupacion') || 'No especificado'}</p>
            <p><strong>Nombre Padre:</strong> {obtenerDatoPaciente(valoracion, 'nombrePadre') || obtenerDatoPaciente(valoracion, 'padreNombre') || 'No especificado'}</p>
            <p><strong>Edad Padre:</strong> {obtenerDatoPaciente(valoracion, 'edadPadre') || obtenerDatoPaciente(valoracion, 'padreEdad') || 'No especificado'}</p>
            <p><strong>Ocupación Padre:</strong> {obtenerDatoPaciente(valoracion, 'ocupacionPadre') || obtenerDatoPaciente(valoracion, 'padreOcupacion') || 'No especificado'}</p>
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
            <p><strong>Tiempo de lactancia:</strong> {valoracion.tiempoLactancia || ''}</p>
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
          <p>
            {valoracion.motivoDeConsulta === 'estimulacion' ?
              "Iniciar programa de estimulación adecuada" :
              valoracion.motivoDeConsulta === 'fisioterapia' ?
                "Iniciar sesiones de fisioterapia pediátrica" :
                valoracion.motivoDeConsulta || 'No especificado'
            }
          </p>
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
            <p><strong>Rutina diaria:</strong> {renderValue(valoracion.rutinaDiaria)}</p>
          </div>
        </section>

        {/* DESARROLLO ONTOLÓGICO */}
        <section className="mb-8 bg-indigo-50 rounded-xl p-4 shadow">
          <h3 className="text-lg font-semibold text-indigo-600 border-b pb-1 mb-4">Desarrollo Ontológico</h3>

          <div className="mb-6">
            <h4 className="text-md font-semibold text-indigo-500 mb-3">Motricidad Gruesa</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border-l-4 border-indigo-300 pl-3">
                <p><strong>Sostiene Cabeza:</strong> {valoracion.sostieneCabeza_si ? 'Sí' : valoracion.sostieneCabeza_no ? 'No' : 'No evaluado'}</p>
                {valoracion.sostieneCabeza_observaciones && <p className="text-sm text-gray-600"><strong>Observaciones:</strong> {valoracion.sostieneCabeza_observaciones}</p>}
              </div>
              <div className="border-l-4 border-indigo-300 pl-3">
                <p><strong>Se Voltea:</strong> {valoracion.seVoltea_si ? 'Sí' : valoracion.seVoltea_no ? 'No' : 'No evaluado'}</p>
                {valoracion.seVoltea_observaciones && <p className="text-sm text-gray-600"><strong>Observaciones:</strong> {valoracion.seVoltea_observaciones}</p>}
              </div>
              <div className="border-l-4 border-indigo-300 pl-3">
                <p><strong>Se Sienta sin Apoyo:</strong> {valoracion.seSientaSinApoyo_si ? 'Sí' : valoracion.seSientaSinApoyo_no ? 'No' : 'No evaluado'}</p>
                {valoracion.seSientaSinApoyo_observaciones && <p className="text-sm text-gray-600"><strong>Observaciones:</strong> {valoracion.seSientaSinApoyo_observaciones}</p>}
              </div>
              <div className="border-l-4 border-indigo-300 pl-3">
                <p><strong>Gatea:</strong> {valoracion.gatea_si ? 'Sí' : valoracion.gatea_no ? 'No' : 'No evaluado'}</p>
                {valoracion.gatea_observaciones && <p className="text-sm text-gray-600"><strong>Observaciones:</strong> {valoracion.gatea_observaciones}</p>}
              </div>
              <div className="border-l-4 border-indigo-300 pl-3">
                <p><strong>Se Pone de Pie Apoyado:</strong> {valoracion.sePoneDePerApoyado_si ? 'Sí' : valoracion.sePoneDePerApoyado_no ? 'No' : 'No evaluado'}</p>
                {valoracion.sePoneDePerApoyado_observaciones && <p className="text-sm text-gray-600"><strong>Observaciones:</strong> {valoracion.sePoneDePerApoyado_observaciones}</p>}
              </div>
              <div className="border-l-4 border-indigo-300 pl-3">
                <p><strong>Camina Solo:</strong> {valoracion.caminaSolo_si ? 'Sí' : valoracion.caminaSolo_no ? 'No' : 'No evaluado'}</p>
                {valoracion.caminaSolo_observaciones && <p className="text-sm text-gray-600"><strong>Observaciones:</strong> {valoracion.caminaSolo_observaciones}</p>}
              </div>
              <div className="border-l-4 border-indigo-300 pl-3">
                <p><strong>Corre y Salta:</strong> {valoracion.correSalta_si ? 'Sí' : valoracion.correSalta_no ? 'No' : 'No evaluado'}</p>
                {valoracion.correSalta_observaciones && <p className="text-sm text-gray-600"><strong>Observaciones:</strong> {valoracion.correSalta_observaciones}</p>}
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h4 className="text-md font-semibold text-pink-500 mb-3">Motricidad Fina</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border-l-4 border-pink-300 pl-3">
                <p><strong>Sigue Objetos con la Mirada:</strong> {valoracion.sigueObjetosMirada_si ? 'Sí' : valoracion.sigueObjetosMirada_no ? 'No' : 'No evaluado'}</p>
                {valoracion.sigueObjetosMirada_observaciones && <p className="text-sm text-gray-600"><strong>Observaciones:</strong> {valoracion.sigueObjetosMirada_observaciones}</p>}
              </div>
              <div className="border-l-4 border-pink-300 pl-3">
                <p><strong>Lleva Objetos a la Boca:</strong> {valoracion.llevaObjetosBoca_si ? 'Sí' : valoracion.llevaObjetosBoca_no ? 'No' : 'No evaluado'}</p>
                {valoracion.llevaObjetosBoca_observaciones && <p className="text-sm text-gray-600"><strong>Observaciones:</strong> {valoracion.llevaObjetosBoca_observaciones}</p>}
              </div>
              <div className="border-l-4 border-pink-300 pl-3">
                <p><strong>Pasa Objetos entre Manos:</strong> {valoracion.pasaObjetosEntreManos_si ? 'Sí' : valoracion.pasaObjetosEntreManos_no ? 'No' : 'No evaluado'}</p>
                {valoracion.pasaObjetosEntreManos_observaciones && <p className="text-sm text-gray-600"><strong>Observaciones:</strong> {valoracion.pasaObjetosEntreManos_observaciones}</p>}
              </div>
              <div className="border-l-4 border-pink-300 pl-3">
                <p><strong>Pinza Superior:</strong> {valoracion.pinzaSuperior_si ? 'Sí' : valoracion.pinzaSuperior_no ? 'No' : 'No evaluado'}</p>
                {valoracion.pinzaSuperior_observaciones && <p className="text-sm text-gray-600"><strong>Observaciones:</strong> {valoracion.pinzaSuperior_observaciones}</p>}
              </div>
              <div className="border-l-4 border-pink-300 pl-3">
                <p><strong>Encaja Piezas Grandes:</strong> {valoracion.encajaPiezasGrandes_si ? 'Sí' : valoracion.encajaPiezasGrandes_no ? 'No' : 'No evaluado'}</p>
                {valoracion.encajaPiezasGrandes_observaciones && <p className="text-sm text-gray-600"><strong>Observaciones:</strong> {valoracion.encajaPiezasGrandes_observaciones}</p>}
              </div>
              <div className="border-l-4 border-pink-300 pl-3">
                <p><strong>Dibuja Garabatos:</strong> {valoracion.dibujaGarabatos_si ? 'Sí' : valoracion.dibujaGarabatos_no ? 'No' : 'No evaluado'}</p>
                {valoracion.dibujaGarabatos_observaciones && <p className="text-sm text-gray-600"><strong>Observaciones:</strong> {valoracion.dibujaGarabatos_observaciones}</p>}
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h4 className="text-md font-semibold text-green-500 mb-3">Lenguaje y Comunicación</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border-l-4 border-green-300 pl-3">
                <p><strong>Balbucea:</strong> {valoracion.balbucea_si ? 'Sí' : valoracion.balbucea_no ? 'No' : 'No evaluado'}</p>
                {valoracion.balbucea_observaciones && <p className="text-sm text-gray-600"><strong>Observaciones:</strong> {valoracion.balbucea_observaciones}</p>}
              </div>
              <div className="border-l-4 border-green-300 pl-3">
                <p><strong>Dice Mamá/Papá:</strong> {valoracion.diceMamaPapa_si ? 'Sí' : valoracion.diceMamaPapa_no ? 'No' : 'No evaluado'}</p>
                {valoracion.diceMamaPapa_observaciones && <p className="text-sm text-gray-600"><strong>Observaciones:</strong> {valoracion.diceMamaPapa_observaciones}</p>}
              </div>
              <div className="border-l-4 border-green-300 pl-3">
                <p><strong>Señala lo que Quiere:</strong> {valoracion.senalaQueQuiere_si ? 'Sí' : valoracion.senalaQueQuiere_no ? 'No' : 'No evaluado'}</p>
                {valoracion.senalaQueQuiere_observaciones && <p className="text-sm text-gray-600"><strong>Observaciones:</strong> {valoracion.senalaQueQuiere_observaciones}</p>}
              </div>
              <div className="border-l-4 border-green-300 pl-3">
                <p><strong>Dice 5-10 Palabras:</strong> {valoracion.dice5a10Palabras_si ? 'Sí' : valoracion.dice5a10Palabras_no ? 'No' : 'No evaluado'}</p>
                {valoracion.dice5a10Palabras_observaciones && <p className="text-sm text-gray-600"><strong>Observaciones:</strong> {valoracion.dice5a10Palabras_observaciones}</p>}
              </div>
              <div className="border-l-4 border-green-300 pl-3">
                <p><strong>Entiende Órdenes Simples:</strong> {valoracion.entiendeOrdenesSimples_si ? 'Sí' : valoracion.entiendeOrdenesSimples_no ? 'No' : 'No evaluado'}</p>
                {valoracion.entiendeOrdenesSimples_observaciones && <p className="text-sm text-gray-600"><strong>Observaciones:</strong> {valoracion.entiendeOrdenesSimples_observaciones}</p>}
              </div>
              <div className="border-l-4 border-green-300 pl-3">
                <p><strong>Usa Frases de 2 Palabras:</strong> {valoracion.usaFrases2Palabras_si ? 'Sí' : valoracion.usaFrases2Palabras_no ? 'No' : 'No evaluado'}</p>
                {valoracion.usaFrases2Palabras_observaciones && <p className="text-sm text-gray-600"><strong>Observaciones:</strong> {valoracion.usaFrases2Palabras_observaciones}</p>}
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h4 className="text-md font-semibold text-purple-500 mb-3">Socioemocional</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border-l-4 border-purple-300 pl-3">
                <p><strong>Sonríe Socialmente:</strong> {valoracion.sonrieSocialmente_si ? 'Sí' : valoracion.sonrieSocialmente_no ? 'No' : 'No evaluado'}</p>
                {valoracion.sonrieSocialmente_observaciones && <p className="text-sm text-gray-600"><strong>Observaciones:</strong> {valoracion.sonrieSocialmente_observaciones}</p>}
              </div>
              <div className="border-l-4 border-purple-300 pl-3">
                <p><strong>Responde al Nombre:</strong> {valoracion.respondeNombre_si ? 'Sí' : valoracion.respondeNombre_no ? 'No' : 'No evaluado'}</p>
                {valoracion.respondeNombre_observaciones && <p className="text-sm text-gray-600"><strong>Observaciones:</strong> {valoracion.respondeNombre_observaciones}</p>}
              </div>
              <div className="border-l-4 border-purple-300 pl-3">
                <p><strong>Se Interesa por Otros Niños:</strong> {valoracion.interesaOtrosNinos_si ? 'Sí' : valoracion.interesaOtrosNinos_no ? 'No' : 'No evaluado'}</p>
                {valoracion.interesaOtrosNinos_observaciones && <p className="text-sm text-gray-600"><strong>Observaciones:</strong> {valoracion.interesaOtrosNinos_observaciones}</p>}
              </div>
              <div className="border-l-4 border-purple-300 pl-3">
                <p><strong>Juego Simbólico:</strong> {valoracion.juegoSimbolico_si ? 'Sí' : valoracion.juegoSimbolico_no ? 'No' : 'No evaluado'}</p>
                {valoracion.juegoSimbolico_observaciones && <p className="text-sm text-gray-600"><strong>Observaciones:</strong> {valoracion.juegoSimbolico_observaciones}</p>}
              </div>
              <div className="border-l-4 border-purple-300 pl-3">
                <p><strong>Se Despide/Lanza Besos:</strong> {valoracion.seDespideLanzaBesos_si ? 'Sí' : valoracion.seDespideLanzaBesos_no ? 'No' : 'No evaluado'}</p>
                {valoracion.seDespideLanzaBesos_observaciones && <p className="text-sm text-gray-600"><strong>Observaciones:</strong> {valoracion.seDespideLanzaBesos_observaciones}</p>}
              </div>
            </div>
          </div>

          <div className="mb-4">
            <h4 className="text-md font-semibold text-orange-500 mb-3">Conclusión General</h4>
            <div className="bg-orange-50 p-4 rounded-lg">
              <p><strong>Nivel de desarrollo acorde a la edad:</strong> {valoracion.nivelDesarrolloAcorde_si ? 'Sí' : valoracion.nivelDesarrolloAcorde_no ? 'No' : 'No evaluado'}</p>
              {valoracion.areasRequierenAcompanamiento && <p className="mt-2"><strong>Áreas que requieren acompañamiento:</strong> {valoracion.areasRequierenAcompanamiento}</p>}
              {valoracion.actividadesSugeridasCasa && <p className="mt-2"><strong>Actividades sugeridas para casa:</strong> {valoracion.actividadesSugeridasCasa}</p>}
              {valoracion.estimulacionEntornoDiario && <p className="mt-2"><strong>Estimulación en entorno diario:</strong> {valoracion.estimulacionEntornoDiario}</p>}
              {valoracion.seguimientoSugeridoFecha && <p className="mt-2"><strong>Seguimiento sugerido (fecha):</strong> {valoracion.seguimientoSugeridoFecha}</p>}
            </div>
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
          <h3 className="text-lg font-semibold text-indigo-600 border-b pb-1 mb-4">Diagnóstico y Plan de Tratamiento</h3>

          <div className="space-y-4">
            <div>
              <p className="font-semibold text-indigo-700">Diagnóstico Fisioterapéutico:</p>
              <p className="text-sm text-gray-700 mt-1">
                {valoracion.diagnosticoFisioterapeutico === 'opcion1' ?
                  "Paciente con adecuado desarrollo neuromotor acorde a su edad cronológica, con adquisición oportuna de los hitos del desarrollo en las áreas de motricidad gruesa, motricidad fina, lenguaje y socioemocional." :
                  valoracion.diagnosticoFisioterapeutico === 'opcion2' ?
                    "Se evidencia un retraso en el desarrollo neuromotor en relación con la edad cronológica del niño(a), observándose la ausencia o inmadurez en hitos esperados. Este retraso puede estar asociado a falta de estimulación." :
                    valoracion.diagnosticoFisioterapeutico || "No especificado"
                }
              </p>
            </div>

            <div>
              <p className="font-semibold text-indigo-700">Plan de Tratamiento:</p>
              <p className="text-sm text-gray-700 mt-1">
                {valoracion.planTratamiento === 'opcion1' ?
                  "Se propone iniciar un proceso de estimulación adecuada con el objetivo de favorecer el desarrollo integral del niño(a), fortaleciendo áreas como la motricidad, el lenguaje, la interacción social y la exploración sensorial." :
                  valoracion.planTratamiento === 'opcion2' ?
                    "Se propone iniciar un proceso de estimulación adecuada con el objetivo de favorecer el desarrollo integral del niño(a), fortaleciendo áreas como la motricidad, el lenguaje, la interacción social y la exploración sensorial. Se trabajará con sesiones grupales estructuradas y orientación a la familia, además de sesiones personalizadas." :
                    valoracion.planTratamiento || "No especificado"
                }
              </p>
            </div>
          </div>
        </section>

        {/* FIRMAS */}
        <section className="mb-8 bg-pink-50 rounded-xl p-4 shadow">
          <h2 className="text-xl font-bold text-indigo-700 uppercase mb-4 border-b pb-1">
            FIRMAS
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {valoracion.firmaProfesional && (
              <div className="flex flex-col items-center md:items-start">
                <p className="text-sm font-semibold text-gray-800 mb-1">Firma del Profesional</p>
                <p className="text-sm text-gray-600">Nombre: {valoracion.nombreFisioterapeuta}</p>
                <p className="text-sm text-gray-600 mb-2">Cédula: {valoracion.cedulaFisioterapeuta}</p>
                <img src={valoracion.firmaProfesional} alt="Firma Profesional" className="border rounded h-24 bg-white" />
                {valoracion.auditTrail?.firmaProfesional && (
                  <div className="text-[10px] text-gray-400 mt-1 max-w-[200px] text-center md:text-left font-mono">
                    IP: {valoracion.auditTrail.firmaProfesional.ip} <br />
                    Reg: {valoracion.auditTrail.firmaProfesional.registroProfesional} <br />
                    {new Date(valoracion.auditTrail.firmaProfesional.fechaHora).toLocaleString()}
                  </div>
                )}
              </div>
            )}

            {valoracion.firmaRepresentante && (
              <div className="flex flex-col items-center md:items-start">
                <p className="text-sm font-semibold text-gray-800 mb-1">Firma del Representante</p>
                <p className="text-sm text-gray-600">Nombre: {valoracion.nombreAcudiente}</p>
                <p className="text-sm text-gray-600 mb-2">Cédula: {valoracion.cedulaAcudiente}</p>
                <img src={valoracion.firmaRepresentante} alt="Firma Representante" className="border rounded h-24 bg-white" />
                {valoracion.auditTrail?.firmaRepresentante && (
                  <div className="text-[10px] text-gray-400 mt-1 max-w-[200px] text-center md:text-left font-mono">
                    IP: {valoracion.auditTrail.firmaRepresentante.ip} <br />
                    {new Date(valoracion.auditTrail.firmaRepresentante.fechaHora).toLocaleString()}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="detalle-section mt-8">
            <h3 className="text-lg font-semibold text-indigo-600 border-b pb-1 mb-2">Autorización de Uso de Imagen</h3>

            <p className="text-sm text-gray-700 mb-4">
              Atendiendo al ejercicio de la Patria Potestad, establecido en el Código Civil Colombiano en su artículo 288, el artículo 24 del Decreto 2820 de 1974 y la Ley de Infancia y Adolescencia, el Ministerio de Educación Nacional solicita la autorización escrita del padre/madre de familia o acudiente del menor de edad: <span className="font-semibold border-b border-black px-2">{valoracion.autorizacionNombre || obtenerDatoPaciente(valoracion, 'nombres')}</span>, identificado(a) con Registro Civil número <span className="font-semibold border-b border-black px-2">{valoracion.autorizacionRegistro || obtenerDatoPaciente(valoracion, 'registroCivil')}</span>, para reproducir fotografías e imágenes de las actividades en las que participe, para ser utilizadas en publicaciones, proyectos, redes sociales y página Web.
            </p>

            <p className="text-sm text-gray-700 mb-4">
              Para constancia de lo anterior se firma y otorga en la ciudad de <span className="font-semibold border-b border-black px-2">Montería</span>, el día <span className="font-semibold border-b border-black px-2">{valoracion.diaFirma || '___'}</span> del mes de <span className="font-semibold border-b border-black px-2">{valoracion.mesFirma || '___'}</span> de <span className="font-semibold border-b border-black px-2">{valoracion.anioFirma || '___'}</span>.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <div>
                <p className="text-sm text-gray-700"><strong>Nombre del representante:</strong> {valoracion.nombreAcudiente || obtenerDatoPaciente(valoracion, 'nombreMadre') || obtenerDatoPaciente(valoracion, 'nombrePadre')}</p>
                <p className="text-sm text-gray-700"><strong>Cédula del representante:</strong> {valoracion.cedulaAcudiente || obtenerDatoPaciente(valoracion, 'documentoRepresentante')}</p>
              </div>

              {valoracion.firmaAutorizacion && (
                <div className="flex flex-col items-center md:items-start">
                  <p className="text-sm text-gray-700 font-medium">Firma del representante:</p>
                  <img src={valoracion.firmaAutorizacion} alt="Firma Autorización" className="border mt-1 h-24 bg-white" />
                  {valoracion.auditTrail?.firmaAutorizacion && (
                    <div className="text-[9px] text-gray-400 mt-1 font-mono">
                      IP: {valoracion.auditTrail.firmaAutorizacion.ip} | {new Date(valoracion.auditTrail.firmaAutorizacion.fechaHora).toLocaleString()}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Consentimiento Informado (Paso 8) */}
        <div className="detalle-section border p-4 rounded-xl my-8 shadow bg-indigo-50">
          <h3 className="text-lg font-bold text-indigo-700 mb-4 text-center">CONSTANCIA DE CONSENTIMIENTO INFORMADO</h3>
          <p className="text-sm leading-relaxed text-justify mb-4">
            Yo <span className="font-semibold border-b border-indigo-400 px-2 bg-gray-50">{valoracion.consentimiento_nombreAcudiente}</span>
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
          <p className="text-sm leading-relaxed text-justify mb-4 font-semibold">
            IMPORTANTE: Durante la atención se pueden generar riesgos como lesiones osteomusculares, caída o golpes por traslados y desplazamientos, irritación o ansiedad.
          </p>
          <p className="text-sm leading-relaxed text-justify mb-4">
            Se me ha dado la oportunidad de preguntar y aclarar las dudas generadas sobre la atención en el servicio, por lo que he recibido la información a satisfacción sobre la atención prestada. Además, se me explicó la importancia de acompañar permanentemente a mi hijo/a durante el tiempo de la sesión y de lo importante que es la continuidad en el proceso. Por lo anterior doy mi consentimiento libre e informado.
          </p>

          <div className="flex flex-col md:flex-row justify-around mt-8 gap-8">
            <div className="flex flex-col items-center">
              <span className="text-xs font-bold text-gray-500 mb-2 uppercase">Firma del Acudiente / Representante</span>
              {valoracion.consentimiento_firmaAcudiente && (
                <div className="flex flex-col items-center">
                  <img
                    src={valoracion.consentimiento_firmaAcudiente}
                    alt="Firma Acudiente"
                    className="border border-indigo-300 rounded bg-white"
                    style={{ width: 220, height: 80, objectFit: 'contain' }}
                  />
                  {valoracion.auditTrail?.consentimiento_firmaAcudiente && (
                    <div className="text-[10px] text-gray-400 mt-1 font-mono text-center">
                      IP: {valoracion.auditTrail.consentimiento_firmaAcudiente.ip} <br />
                      {new Date(valoracion.auditTrail.consentimiento_firmaAcudiente.fechaHora).toLocaleString()}
                    </div>
                  )}
                </div>
              )}
              <span className="font-semibold border-b border-indigo-400 px-2 mt-2 text-sm">{valoracion.consentimiento_ccFirmaAcudiente}</span>
              <span className="text-[10px] text-gray-500">IDENTIFICACIÓN</span>
            </div>

            <div className="flex flex-col items-center">
              <span className="text-xs font-bold text-gray-500 mb-2 uppercase">Firma Fisioterapeuta Tratante</span>
              {valoracion.consentimiento_firmaFisio && (
                <div className="flex flex-col items-center">
                  <img
                    src={valoracion.consentimiento_firmaFisio}
                    alt="Firma Fisioterapeuta"
                    className="border border-indigo-300 rounded bg-white"
                    style={{ width: 220, height: 80, objectFit: 'contain' }}
                  />
                  {valoracion.auditTrail?.consentimiento_firmaFisio && (
                    <div className="text-[10px] text-gray-400 mt-1 font-mono text-center">
                      IP: {valoracion.auditTrail.consentimiento_firmaFisio.ip} <br />
                      Reg: {valoracion.auditTrail.consentimiento_firmaFisio.registroProfesional} <br />
                      {new Date(valoracion.auditTrail.consentimiento_firmaFisio.fechaHora).toLocaleString()}
                    </div>
                  )}
                </div>
              )}
              <span className="font-semibold border-b border-indigo-400 px-2 mt-2 text-sm">{valoracion.cedulaFisioterapeuta}</span>
              <span className="text-[10px] text-gray-500">REGISTRO MÉDICO</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-center items-center gap-4 mt-8">
          <button
            onClick={exportarWord}
            className="bg-green-500 hover:bg-green-600 text-white font-bold px-6 py-3 rounded-xl shadow transition flex items-center gap-2 text-lg"
          >
            <ArrowDownTrayIcon className="h-6 w-6" />
            Exportar a Word
          </button>
          <button
            onClick={exportarPDF}
            className="bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-3 rounded-xl shadow transition flex items-center gap-2 text-lg"
          >
            <ArrowDownTrayIcon className="h-6 w-6" />
            Exportar a PDF (Firmas)
          </button>
          <button
            onClick={() => navigate(`/valoraciones/editar/${id}`)}
            disabled={valoracion.bloqueada}
            className={`${valoracion.bloqueada ? 'bg-gray-400 cursor-not-allowed' : 'bg-yellow-400 hover:bg-yellow-500'} text-white font-bold px-6 py-3 rounded-xl shadow transition flex items-center gap-2 text-lg`}
            title={valoracion.bloqueada ? "No se puede editar una historia bloqueada" : "Editar valoración"}
          >
            <PencilSquareIcon className="h-6 w-6" />
            {valoracion.bloqueada ? 'Lectura Protegida' : 'Editar valoración'}
          </button>
          {!valoracion.bloqueada && (
            <button
              onClick={bloquearValoracion}
              className="bg-red-500 hover:bg-red-600 text-white font-bold px-6 py-3 rounded-xl shadow transition flex items-center gap-2 text-lg"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
              </svg>
              Cerrar Historia
            </button>
          )}
        </div>

        {valoracion.bloqueada && valoracion.selloIntegridad && (
          <div className="mt-8 p-4 bg-gray-50 border-t border-gray-200 rounded-b-xl">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] text-gray-500 font-mono">
              <div className="flex items-center gap-2">
                <span className="font-bold text-green-600 flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3">
                    <path fillRule="evenodd" d="M12.516 2.17a.75.75 0 0 0-1.032 0 11.209 11.209 0 0 1-7.877 3.08.75.75 0 0 0-.722.515A12.74 12.74 0 0 0 2.25 9.75c0 5.944 4.068 10.938 9.52 12.334a.75.75 0 0 0 .46 0c5.451-1.396 9.52-6.39 9.52-12.334 0-1.36-.21-2.674-.601-3.91a.75.75 0 0 0-.722-.515 11.209 11.209 0 0 1-7.877-3.08Zm-1.545 14.167 4.1-4.1a.75.75 0 1 0-1.06-1.06l-3.57 3.57-1.57-1.57a.75.75 0 0 0-1.06 1.06l2.1 2.1a.75.75 0 0 0 1.06 0Z" clipRule="evenodd" />
                  </svg>
                  SELLO DE INTEGRIDAD:
                </span>
                <span className="break-all">{valoracion.selloIntegridad}</span>
              </div>
              <div className="whitespace-nowrap italic">
                Cerrada el: {new Date(valoracion.fechaBloqueo).toLocaleString()}
              </div>
            </div>
            <p className="text-[9px] text-gray-400 mt-2 text-center uppercase">
              Este documento ha sido sellado criptográficamente y es inmutable bajo la Ley 527 de 1999.
            </p>
          </div>
        )}
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
  );
};

export default DetalleValoracion;
