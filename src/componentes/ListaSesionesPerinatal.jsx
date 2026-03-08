import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiRequest, API_CONFIG } from "../config/api";
import { ArrowLeftIcon, CheckCircleIcon, ClockIcon, PencilSquareIcon, LockClosedIcon } from "@heroicons/react/24/solid";
import FirmaCanvas from "./ui/FirmaCanvas";

export default function ListaSesionesPerinatal() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [paciente, setPaciente] = useState(null);
  const [consentimiento, setConsentimiento] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [sesionEditando, setSesionEditando] = useState(null);
  const [fechaTemp, setFechaTemp] = useState("");
  const [formularioTemp, setFormularioTemp] = useState({});
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);
  const [sesionesDisponibles, setSesionesDisponibles] = useState(null);
  const [mostrarConfirmacionEliminar, setMostrarConfirmacionEliminar] = useState(false);
  const [mostrarExito, setMostrarExito] = useState(false);
  const [mensajeExito, setMensajeExito] = useState('');
  const [mostrarModalError, setMostrarModalError] = useState(false);
  const [mensajeError, setMensajeError] = useState('');
  const [mostrarModalExito, setMostrarModalExito] = useState(false);
  const [mensajeExitoSesion, setMensajeExitoSesion] = useState('');
  const [sesionAEliminar, setSesionAEliminar] = useState(null);
  const [mostrarConfirmacionEliminarSesion, setMostrarConfirmacionEliminarSesion] = useState(false);
  const [mostrarConfirmacionAgregarSesion, setMostrarConfirmacionAgregarSesion] = useState(false);

  const crearSesionesDinamicas = (tipoPrograma) => {
    let sesiones = [];
    let sesionesIntensivo = [];

    if (tipoPrograma === 'educacion' || tipoPrograma === 'ambos') {
      const nombresSesiones = [
        "Sesión No. 1: Introducción y Autocuidado",
        "Sesión No. 2: Parto Vaginal",
        "Sesión No. 3: Cesárea y Postparto",
        "Sesión No. 4: Lactancia",
        "Sesión No. 5: Cuidados del Recién Nacido",
        "Sesión No. 6: Técnicas de Confort",
        "Sesión No. 7: Estimulación Prenatal",
        "Sesión No. 8: Abuelos",
        "Visita en Clínica",
        "Visita de Cierre"
      ];
      for (let i = 0; i < 10; i++) {
        sesiones.push({ nombre: nombresSesiones[i], fecha: "", firmaPaciente: "" });
      }
    }

    if (tipoPrograma === 'fisico') {
      for (let i = 1; i <= 8; i++) {
        sesiones.push({ nombre: `Sesión No. ${i}`, fecha: "", firmaPaciente: "" });
      }
    }

    if (tipoPrograma === 'intensivo' || tipoPrograma === 'educacion intensiva') {
      const nombresIntensivo = [
        "Sesión No. 1: Introducción y Autocuidado, Cuidados del recién Nacido, Estimulación Prenatal",
        "Sesión No. 2: Trabajo de Parto, Cesárea",
        "Sesión No. 3: Lactancia, Postparto"
      ];
      sesionesIntensivo = nombresIntensivo.map(nombre => ({ nombre, fecha: "", firmaPaciente: "" }));
    }

    if (tipoPrograma === 'ambos') {
      for (let i = 1; i <= 8; i++) {
        sesionesIntensivo.push({
          nombre: `Sesión No. ${i} (Acondicionamiento Físico)`,
          fecha: "",
          firmaPaciente: ""
        });
      }
    }

    return { sesiones, sesionesIntensivo };
  };

  useEffect(() => {
    cargarDatos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const cargarDatos = async () => {
    try {
      // 1. Cargar datos del paciente (Ruta unificada)
      const datoPaciente = await apiRequest(`/pacientes/${id}`);
      setPaciente(datoPaciente);

      // 2. Buscar valoración perinatal unificada
      console.log('Buscando valoración perinatal para paciente:', id);
      const valoraciones = await apiRequest(`/valoraciones/paciente/${id}`);
      const valPerinatal = (valoraciones || []).find(v => v.codConsulta === '890204');

      if (valPerinatal) {
        console.log('✓ Valoración Perinatal encontrada:', valPerinatal._id);

        // Detección robusta de firmas (Unificadas + Legado)
        const firmaPac = valPerinatal.firmas?.pacienteOAcudiente?.firmaUrl || valPerinatal.firmaPaciente || valPerinatal.firmaPacienteConsentimiento;
        const firmaProf = valPerinatal.firmas?.profesional?.firmaUrl || valPerinatal.firmaProfesional || valPerinatal.firmaFisioterapeuta;

        const tieneFirmasUnificadas = !!(firmaPac && firmaProf);
        const rawTipo = valPerinatal.moduloPerinatal?.planElegido || valPerinatal.tipoPrograma || "";
        const tipoPrograma = String(rawTipo).toLowerCase().trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

        // Inyectar metadatos
        valPerinatal.tipoPrograma = tipoPrograma;
        valPerinatal.tieneFirmasUnificadas = tieneFirmasUnificadas;

        // 3. Obtener sesiones desde la colección independiente (Citas/Evoluciones)
        console.log('Buscando sesiones (Citas) independientes...');
        const sesionesAPI = await apiRequest(`/sesiones-perinatal/paciente/${id}`);

        // Clasificar sesiones según su nombre
        const esIntensiva = (s) => {
          const desc = (s.nombre || s.descripcionEvolucion || "").toLowerCase();
          // Clasificar como programa si coincide con la lista intensiva desglosada
          return desc.includes('intensivo') || desc.includes('fisico') ||
            desc.includes('nacido') || desc.includes('estimulacion') ||
            desc.includes('parto') || desc.includes('cesarea') ||
            desc.includes('introduccion') || desc.includes('autocuidado') ||
            desc.includes('lactancia') || desc.includes('postparto');
        };
        const normalizeSesion = (s) => ({
          ...s,
          fecha: s.fechaInicioAtencion ? String(s.fechaInicioAtencion).split('T')[0] : s.fecha,
          firmaPaciente: s.firmas?.paciente?.firmaUrl || s.firmaPaciente,
          nombre: s.descripcionEvolucion || s.nombre
        });

        const normalizedSesiones = (sesionesAPI || []).map(normalizeSesion);

        valPerinatal.sesiones = normalizedSesiones.filter(s => !esIntensiva(s));
        valPerinatal.sesionesIntensivo = normalizedSesiones.filter(s => esIntensiva(s));

        console.log(`📊 Sesiones cargadas: ${valPerinatal.sesiones.length} regulares, ${valPerinatal.sesionesIntensivo.length} de programa específico. Plan detectado: ${tipoPrograma}`);

        // 4. Si no tiene sesiones aún, preparar las opciones para crearlas
        if (tipoPrograma && valPerinatal.sesiones.length === 0 && valPerinatal.sesionesIntensivo.length === 0) {
          const { sesiones: sdReg, sesionesIntensivo: sdInt } = crearSesionesDinamicas(tipoPrograma);

          if (sdReg.length > 0 || sdInt.length > 0) {
            setSesionesDisponibles({
              sesiones: sdReg,
              sesionesIntensivo: sdInt,
              tieneEducacionFirmada: (tipoPrograma === 'educacion' || tipoPrograma === 'ambos' || tipoPrograma === 'educativa'),
              tieneFisicoFirmado: (tipoPrograma === 'fisico' || tipoPrograma === 'ambos'),
              tieneIntensivoFirmado: (tipoPrograma === 'intensivo' || tipoPrograma === 'educacion intensiva'),
              tieneFirmasUnificadas: true
            });
          }
        }

        setConsentimiento(valPerinatal);
      } else {
        console.warn('⚠️ No se encontró valoración perinatal para este paciente.');
      }
    } catch (error) {
      console.error("Error al cargar datos unificados:", error);
    } finally {
      setCargando(false);
    }
  };


  const guardarSesion = async () => {
    try {
      let firmaFinal = formularioTemp.firmaPaciente;

      // Si es base64, subir a S3 primero
      if (firmaFinal && firmaFinal.startsWith('data:image')) {
        try {
          const formData = new FormData();
          const blob = await (await fetch(firmaFinal)).blob();
          formData.append('imagen', blob, `firma_paciente_sesion_${sesionEditando._id}.png`);

          const uploadRes = await fetch(`${API_CONFIG.BASE_URL}/api/upload`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${sessionStorage.getItem("token")}`
            },
            body: formData
          });
          const uploadData = await uploadRes.json();
          if (uploadData.url) {
            firmaFinal = uploadData.url;
          }
        } catch (uploadError) {
          console.error("Error al subir firma a S3:", uploadError);
          setMensajeError("No se pudo subir la firma al servidor.");
          setMostrarModalError(true);
          return;
        }
      }

      // Petición directa a la API de sesiones (Evoluciones/Citas)
      await apiRequest(`/sesiones-perinatal/${sesionEditando._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fechaInicioAtencion: fechaTemp,
          fecha: fechaTemp, // fallback legacy
          firmaPaciente: firmaFinal || ""
        })
      });

      // Recargar todos los datos desde el servidor para asegurar sincronía
      await cargarDatos();

      setSesionEditando(null);
      setFechaTemp("");
      setFormularioTemp({});
      setMensajeExitoSesion('Cita / Sesión actualizada correctamente');
      setMostrarModalExito(true);
    } catch (error) {
      console.error('Error al guardar sesión:', error);
      setMensajeError('Error al guardar la sesión');
      setMostrarModalError(true);
    }
  };

  const confirmarCreacionSesiones = async () => {
    try {
      // Al hacer PUT, el backend detectará que hay firmas y generará las sesiones independientes
      await apiRequest(`/valoraciones/${consentimiento._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...consentimiento, tipoPrograma: consentimiento.tipoPrograma })
      });

      // Recargamos para ver las nuevas sesiones (Evoluciones) creadas por el backend
      await cargarDatos();

      setSesionesDisponibles(null);
      setMostrarConfirmacion(false);

      setMensajeExito(`✅ Programa iniciado exitosamente\n\nLas sesiones han sido generadas como registros independientes para su seguimiento.`);
      setMostrarExito(true);
    } catch (error) {
      console.error('Error al iniciar programa:', error);
      alert('Error al iniciar el programa');
    }
  };

  const confirmarAgregarSesionExtra = async () => {
    try {
      const plan = consentimiento.tipoPrograma;
      const esEducacion = plan === 'educacion' || plan === 'ambos';
      const nombreExtra = `Sesión Extra ${esEducacion ? 'Educativa' : 'Física'}`;

      await apiRequest('/sesiones-perinatal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paciente: id,
          valoracionAsociada: consentimiento._id,
          nombreSesion: nombreExtra
        })
      });

      await cargarDatos();
      setMostrarConfirmacionAgregarSesion(false);
      setMensajeExitoSesion('Sesión extra agregada correctamente');
      setMostrarModalExito(true);
    } catch (error) {
      console.error('Error agregando sesión extra:', error);
      setMensajeError('Error al agregar sesión extra');
      setMostrarModalError(true);
    }
  };

  const eliminarSesionExtra = async () => {
    try {
      // Eliminar firma de S3 si existe
      if (sesionAEliminar.firmaPaciente && sesionAEliminar.firmaPaciente.startsWith('https://')) {
        try {
          await apiRequest('/eliminar-firmas-s3', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ urls: [sesionAEliminar.firmaPaciente] })
          });
        } catch (s3Error) {
          console.warn('Error eliminando firma de S3:', s3Error);
        }
      }

      await apiRequest(`/sesiones-perinatal/${sesionAEliminar._id}`, {
        method: 'DELETE'
      });

      await cargarDatos();
      setMostrarConfirmacionEliminarSesion(false);
      setSesionAEliminar(null);
      setMensajeExitoSesion('Sesión eliminada correctamente');
      setMostrarModalExito(true);
    } catch (error) {
      console.error('Error al eliminar sesión:', error);
      setMensajeError('Error al eliminar la sesión');
      setMostrarModalError(true);
    }
  };

  const confirmarEliminacionSesiones = async () => {
    try {
      const todas = [...(consentimiento.sesiones || []), ...(consentimiento.sesionesIntensivo || [])];

      // Eliminar firmas de S3 en batch
      const firmasParaEliminar = todas
        .map(s => s.firmaPaciente)
        .filter(f => f && f.startsWith('https://'));

      if (firmasParaEliminar.length > 0) {
        await apiRequest('/eliminar-firmas-s3', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ urls: firmasParaEliminar })
        });
      }

      // Eliminar sesiones una por una (o podríamos implementar un deleteMany en el back)
      for (const sesion of todas) {
        await apiRequest(`/sesiones-perinatal/${sesion._id}`, { method: 'DELETE' });
      }

      await cargarDatos();
      setMostrarConfirmacionEliminar(false);
      setMensajeExito(`🗑️ Programa reiniciado exitosamente\n\nTodas las sesiones han sido eliminadas.`);
      setMostrarExito(true);
    } catch (error) {
      console.error('Error al reiniciar programa:', error);
      alert('Error al reiniciar el programa');
    }
  };

  const formatDateUnshifted = (dateVal) => {
    if (!dateVal) return "Fecha pendiente";
    try {
      // Extraemos solo "YYYY-MM-DD" e ignoramos las horas
      const [year, month, day] = String(dateVal).split('T')[0].split('-');
      if (!year || !month || !day) return "Fecha Inválida";
      return `Fecha: ${day}/${month}/${year}`;
    } catch (e) {
      return "Fecha Inválida";
    }
  };

  const renderSesiones = (sesiones, titulo, tipo) => {
    if (!sesiones || sesiones.length === 0) return null;

    return (
      <div className="mb-8">
        <h3 className="text-xl font-bold text-indigo-700 mb-4">{titulo}</h3>
        <div className="grid gap-4">
          {sesiones.map((sesion, index) => (
            <div key={index} className="bg-white rounded-xl p-4 shadow-lg border border-indigo-100">
              <div className="flex justify-between items-center">
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900">{sesion.nombre || sesion.descripcionEvolucion}</h4>
                  <p className="text-sm text-gray-600">
                    {formatDateUnshifted(sesion.fecha || sesion.fechaInicioAtencion)}
                  </p>
                  {/* Mostrar la miniatura de la firma si existe */}
                  {sesion.firmaPaciente && sesion.firmaPaciente.startsWith('http') && (
                    <div className="mt-2 bg-gray-50 border border-gray-200 rounded p-1 w-32 h-12 relative shadow-inner">
                      <img
                        src={sesion.firmaPaciente}
                        alt="Firma del paciente"
                        className="max-w-full max-h-full object-contain mx-auto"
                      />
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {sesion.firmaPaciente ? (
                    <div className="flex flex-col items-center">
                      <CheckCircleIcon className="h-6 w-6 text-green-600" title="Firmado" />
                      {consentimiento.auditTrail?.[`${tipo === 'educacion' ? 'sesion' : 'sesionIntensivo'}_${index}_firmaPaciente`] && (
                        <span className="text-[8px] text-gray-400 font-mono">
                          IP: {consentimiento.auditTrail[`${tipo === 'educacion' ? 'sesion' : 'sesionIntensivo'}_${index}_firmaPaciente`].ip}
                        </span>
                      )}
                    </div>
                  ) : (
                    <ClockIcon className="h-6 w-6 text-yellow-600" title="Pendiente" />
                  )}
                  {!consentimiento.bloqueada && (
                    <button
                      onClick={() => {
                        setSesionEditando({ ...sesion, index, tipo });
                        setFechaTemp(sesion.fecha || "");
                        setFormularioTemp({ firmaPaciente: sesion.firmaPaciente || "" });
                      }}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded-lg transition"
                      title="Editar sesión"
                    >
                      <PencilSquareIcon className="h-4 w-4" />
                    </button>
                  )}
                  {(sesion.nombre || sesion.descripcionEvolucion || "").includes('Extra') && !consentimiento.bloqueada && (
                    <button
                      onClick={() => {
                        setSesionAEliminar({ ...sesion, index, tipo });
                        setMostrarConfirmacionEliminarSesion(true);
                      }}
                      className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg transition"
                      title="Eliminar sesión extra"
                    >
                      🗑️
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  if (cargando) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-indigo-600"></div>
        <span className="mt-4 text-indigo-700 font-bold">Cargando sesiones...</span>
      </div>
    );
  }

  if (!paciente) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-pink-100 to-green-100">
        <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md text-center">
          <h2 className="text-xl font-bold text-red-700 mb-2">Paciente no encontrado</h2>
          <p className="text-gray-600 mb-4">No se pudo cargar la información del paciente.</p>
          <button
            onClick={() => navigate(`/pacientes-adultos/${id}`)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-xl transition"
          >
            Volver al Paciente
          </button>
        </div>
      </div>
    );
  }

  if (!consentimiento) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-pink-100 to-green-100">
        <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md text-center">
          <h2 className="text-xl font-bold text-orange-700 mb-2">Sin valoración perinatal</h2>
          <p className="text-gray-600 mb-4">
            El paciente <strong>{paciente.nombres}</strong> aún no tiene una valoración perinatal registrada.
          </p>
          <div className="flex flex-col gap-3">
            <button
              onClick={() => navigate(`/valoracion?paciente=${paciente._id}&tipo=perinatal`)}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-xl transition"
            >
              Crear Valoración Perinatal
            </button>
            <button
              onClick={() => navigate(`/pacientes-adultos/${id}`)}
              className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-xl transition"
            >
              Volver al Paciente
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-pink-100 to-green-100 py-10 px-2">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-3xl shadow-2xl p-8 border border-indigo-100">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-extrabold text-indigo-700 drop-shadow">
                Sesiones Perinatales
              </h1>
              <p className="text-gray-600">
                Paciente: <span className="font-semibold">{paciente.nombres}</span>
              </p>
              <p className="text-sm text-gray-500">
                Tipo de programa: <span className="font-semibold capitalize">{consentimiento.tipoPrograma || 'No especificado'}</span>
              </p>
              {consentimiento.bloqueada && (
                <div className="mt-2 inline-flex items-center gap-2 bg-green-50 px-3 py-1 rounded-full border border-green-200">
                  <LockClosedIcon className="h-4 w-4 text-green-600" />
                  <span className="text-[10px] font-bold text-green-700 uppercase">Registro Protegido - {consentimiento.selloIntegridad?.substring(0, 16)}...</span>
                </div>
              )}
            </div>
            <button
              onClick={() => navigate(`/pacientes/${id}`)}
              className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-xl font-bold shadow transition flex items-center gap-2"
            >
              <ArrowLeftIcon className="h-5 w-5" />
              Volver al Paciente
            </button>
          </div>

          {/* Descripción del programa Físico si aplica */}
          {(consentimiento.tipoPrograma === 'fisico' || consentimiento.tipoPrograma === 'ambos') && (
            <div className="mb-6 p-5 bg-indigo-50 border-l-4 border-indigo-500 rounded-r-2xl text-sm text-indigo-900 shadow-sm">
              <h4 className="font-bold mb-2 flex items-center gap-2">
                <ClockIcon className="h-5 w-5 text-indigo-600" />
                Información del Programa Físico
              </h4>
              <p className="leading-relaxed">
                Usted va a iniciar un programa de acondicionamiento físico perinatal que consta de 8 sesiones en
                donde realizaremos; Rumba, balonterapia, yoga, ejercicio con banda elástica, pesas, silla y palo. Estas
                actividades se llevan a cabo los días martes y jueves a las 7 am, este horario no es modificable. En
                caso de no poder asistir, por favor avisar el día anterior, de lo contrario la sesión se tomará como
                realizada. Solo se reponen sesiones en el caso de una incapacidad justificada.
              </p>
            </div>
          )}

          {/* Mostrar sesiones basándose en si existen */}
          {((consentimiento.sesiones && consentimiento.sesiones.length > 0) ||
            (consentimiento.sesionesIntensivo && consentimiento.sesionesIntensivo.length > 0)) && (
              <div className="mb-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold text-indigo-700">Sesiones Creadas</h2>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        // Verificar que todas las sesiones estén finalizadas (firmadas)
                        const todasLasSesiones = [...(consentimiento.sesiones || []), ...(consentimiento.sesionesIntensivo || [])];
                        const sesionesNoFinalizadas = todasLasSesiones.filter(sesion => !sesion.firmaPaciente || !sesion.fecha);

                        if (sesionesNoFinalizadas.length > 0) {
                          setMensajeError(`No se pueden agregar sesiones extras. Primero debe finalizar todas las sesiones pendientes (${sesionesNoFinalizadas.length} sesiones sin completar).`);
                          setMostrarModalError(true);
                          return;
                        }

                        // Con la nueva lógica, permitimos agregar sesiones si el programa está configurado
                        setMostrarConfirmacionAgregarSesion(true);
                      }}
                      className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-medium transition flex items-center gap-2"
                    >
                      ➕ Agregar Sesión Extra
                    </button>
                    <button
                      onClick={() => setMostrarConfirmacionEliminar(true)}
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition flex items-center gap-2"
                    >
                      🗑️ Eliminar Todas las Sesiones
                    </button>
                  </div>
                </div>
              </div>
            )}

          {consentimiento.sesiones && consentimiento.sesiones.length > 0 &&
            renderSesiones(
              consentimiento.sesiones,
              consentimiento.tipoPrograma === "fisico" ? "Acondicionamiento Físico Perinatal" : "Programa de Educación para el Nacimiento",
              "educacion"
            )
          }

          {consentimiento.sesionesIntensivo && consentimiento.sesionesIntensivo.length > 0 &&
            renderSesiones(
              consentimiento.sesionesIntensivo,
              consentimiento.tipoPrograma === "intensivo" ? "Programa de Educación Intensivo" :
                consentimiento.tipoPrograma === "ambos" ? "Acondicionamiento Físico Perinatal" : "Sesiones Adicionales",
              "intensivo"
            )
          }

          {/* Botón para crear sesiones cuando están disponibles */}
          {sesionesDisponibles && (
            <div className="text-center py-8">
              <h3 className="text-xl font-bold text-green-700 mb-2">Sesiones disponibles para crear</h3>
              <p className="text-gray-600 mb-4">
                Se pueden crear las siguientes sesiones basadas en los consentimientos firmados:
              </p>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-sm text-left max-w-md mx-auto mb-4">
                <ul className="space-y-1">
                  {(sesionesDisponibles.tieneEducacionFirmada || consentimiento.tipoPrograma === 'educacion' || consentimiento.tipoPrograma === 'educativa') && sesionesDisponibles.sesiones?.length > 0 && (
                    <li>• <strong>Educación:</strong> {sesionesDisponibles.sesiones?.length || 0} sesiones</li>
                  )}
                  {(sesionesDisponibles.tieneFisicoFirmado || consentimiento.tipoPrograma === 'fisico') && sesionesDisponibles.sesiones?.length > 0 && (
                    <li>• <strong>Acondicionamiento Físico:</strong> {sesionesDisponibles.sesiones?.length || 0} sesiones</li>
                  )}
                  {(sesionesDisponibles.tieneFisicoFirmado || consentimiento.tipoPrograma === 'ambos') && sesionesDisponibles.sesionesIntensivo?.length > 0 && (
                    <li>• <strong>Físico adicional:</strong> {sesionesDisponibles.sesionesIntensivo?.length || 0} sesiones</li>
                  )}
                  {(sesionesDisponibles.tieneIntensivoFirmado || consentimiento.tipoPrograma === 'intensivo') && sesionesDisponibles.sesionesIntensivo?.length > 0 && (
                    <li>• <strong>Educación Intensiva:</strong> {sesionesDisponibles.sesionesIntensivo?.length || 0} sesiones</li>
                  )}

                </ul>
              </div>
              <button
                onClick={() => setMostrarConfirmacion(true)}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-bold transition"
              >
                Crear Sesiones
              </button>
            </div>
          )}

          {/* Sello de integridad si la valoración está bloqueada */}
          {consentimiento.bloqueada && consentimiento.selloIntegridad && (
            <div className="mt-4 pt-4 border-t border-indigo-200">
              <div className="flex flex-col md:flex-row justify-between items-center gap-2 text-[10px] text-gray-400 font-mono">
                <div className="flex items-center gap-1">
                  <span className="font-bold text-green-600">SELLO DE INTEGRIDAD (Ley 527):</span>
                  <span className="break-all">{consentimiento.selloIntegridad}</span>
                </div>
                <div className="whitespace-nowrap italic">
                  Cerrada el: {new Date(consentimiento.fechaBloqueo).toLocaleString()}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal de confirmación para crear sesiones */}
      {mostrarConfirmacion && sesionesDisponibles && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-lg w-full mx-4">
            <h3 className="text-xl font-bold text-green-700 mb-4">
              Confirmar Creación de Sesiones
            </h3>
            <p className="text-gray-600 mb-4">
              ¿Está seguro de que desea crear las siguientes sesiones?
            </p>

            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <h4 className="font-semibold text-gray-800 mb-2">Sesiones a crear:</h4>
              <ul className="space-y-2 text-sm">
                {(sesionesDisponibles.tieneEducacionFirmada || consentimiento.tipoPrograma === 'educacion' || consentimiento.tipoPrograma === 'educativa') && sesionesDisponibles.sesiones?.map((sesion, index) => (
                  <li key={`edu-${index}`} className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                    {sesion.nombre}
                  </li>
                ))}
                {(sesionesDisponibles.tieneFisicoFirmado || consentimiento.tipoPrograma === 'fisico') && sesionesDisponibles.sesiones?.map((sesion, index) => (
                  <li key={`fis-${index}`} className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    {sesion.nombre}
                  </li>
                ))}

                {(sesionesDisponibles.tieneFisicoFirmado || consentimiento.tipoPrograma === 'ambos') && sesionesDisponibles.sesionesIntensivo?.map((sesion, index) => (
                  <li key={`amb-${index}`} className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                    {sesion.nombre}
                  </li>
                ))}

                {(sesionesDisponibles.tieneIntensivoFirmado || consentimiento.tipoPrograma === 'intensivo') && sesionesDisponibles.sesionesIntensivo?.map((sesion, index) => (
                  <li key={`int-${index}`} className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                    {sesion.nombre}
                  </li>
                ))}
              </ul>

              <div className="mt-3 pt-3 border-t border-gray-200">
                <p className="text-sm font-medium text-gray-700">
                  Total: {(sesionesDisponibles.sesiones?.length || 0) + (sesionesDisponibles.sesionesIntensivo?.length || 0)} sesiones
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Tipo de programa: <span className="capitalize font-medium">{consentimiento.tipoPrograma}</span>
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={confirmarCreacionSesiones}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg font-medium transition"
              >
                Sí, Crear Sesiones
              </button>
              <button
                onClick={() => setMostrarConfirmacion(false)}
                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg font-medium transition"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de confirmación para eliminar sesiones */}
      {mostrarConfirmacionEliminar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-lg w-full mx-4">
            <h3 className="text-xl font-bold text-red-700 mb-4">
              ⚠️ Confirmar Eliminación de Sesiones
            </h3>
            <p className="text-gray-600 mb-4">
              ¿Está seguro de que desea eliminar TODAS las sesiones?
            </p>

            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <h4 className="font-semibold text-red-800 mb-2">Esta acción eliminará:</h4>
              <ul className="space-y-1 text-sm text-red-700">
                {consentimiento.sesiones && consentimiento.sesiones.length > 0 && (
                  <li>• {consentimiento.sesiones.length} sesiones de educación</li>
                )}
                {consentimiento.sesionesIntensivo && consentimiento.sesionesIntensivo.length > 0 && (
                  <li>• {consentimiento.sesionesIntensivo.length} sesiones {consentimiento.tipoPrograma === 'intensivo' ? 'intensivas' : 'adicionales'}</li>
                )}
              </ul>

              <div className="mt-3 pt-3 border-t border-red-200">
                <p className="text-sm font-medium text-red-800">
                  Total: {(consentimiento.sesiones?.length || 0) + (consentimiento.sesionesIntensivo?.length || 0)} sesiones
                </p>
                <p className="text-xs text-red-600 mt-2">
                  ⚠️ Esta acción no se puede deshacer
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={confirmarEliminacionSesiones}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg font-medium transition"
              >
                Sí, Eliminar Todas
              </button>
              <button
                onClick={() => setMostrarConfirmacionEliminar(false)}
                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg font-medium transition"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de éxito */}
      {mostrarExito && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full mx-4">
            <div className="text-center">
              <div className="text-4xl mb-4">
                {mensajeExito.includes('creadas') ? '✅' : '🗑️'}
              </div>
              <h3 className="text-xl font-bold text-green-700 mb-4">
                {mensajeExito.includes('creadas') ? 'Sesiones Creadas' : 'Sesiones Eliminadas'}
              </h3>
              <div className="text-gray-600 mb-6 whitespace-pre-line">
                {mensajeExito.replace(/✅|🗑️/, '').trim()}
              </div>
              <button
                onClick={() => setMostrarExito(false)}
                className="bg-green-600 hover:bg-green-700 text-white py-2 px-6 rounded-lg font-medium transition"
              >
                Aceptar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal para editar sesión */}
      {sesionEditando && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-indigo-700 mb-4">
              Editar Sesión
            </h3>
            <h4 className="font-semibold text-gray-900 mb-4">
              {sesionEditando.nombre}
            </h4>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fecha de la sesión
              </label>
              <input
                type="date"
                value={fechaTemp}
                onChange={(e) => setFechaTemp(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            <div className="mb-4">
              <FirmaCanvas
                label="Firma del paciente"
                name="firmaPaciente"
                formulario={formularioTemp}
                setFormulario={setFormularioTemp}
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={guardarSesion}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg font-medium transition"
              >
                Guardar
              </button>
              <button
                onClick={() => {
                  setSesionEditando(null);
                  setFechaTemp("");
                  setFormularioTemp({});
                }}
                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg font-medium transition"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Error */}
      {mostrarModalError && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full mx-4">
            <div className="text-center">
              <div className="text-4xl mb-4">⚠️</div>
              <h3 className="text-xl font-bold text-red-700 mb-4">Error</h3>
              <p className="text-gray-600 mb-6">{mensajeError}</p>
              <button
                onClick={() => setMostrarModalError(false)}
                className="bg-red-600 hover:bg-red-700 text-white py-2 px-6 rounded-lg font-medium transition"
              >
                Aceptar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de confirmación para agregar sesión extra */}
      {mostrarConfirmacionAgregarSesion && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-lg w-full mx-4">
            <h3 className="text-xl font-bold text-orange-700 mb-4">
              ⚠️ Confirmar Agregar Sesión Extra
            </h3>
            <p className="text-gray-600 mb-4">
              ¿Está seguro de que desea agregar una sesión extra al programa?
            </p>

            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-4">
              <h4 className="font-semibold text-orange-800 mb-2">Información importante:</h4>
              <ul className="space-y-1 text-sm text-orange-700">
                <li>• La sesión extra se agregará al final del programa actual</li>
                <li>• Podrá programar fecha y obtener firma del paciente</li>
                <li>• Las sesiones extra pueden eliminarse individualmente</li>
                <li>• Se creará basada en los consentimientos firmados disponibles</li>
              </ul>
            </div>

            <div className="flex gap-3">
              <button
                onClick={confirmarAgregarSesionExtra}
                className="flex-1 bg-orange-600 hover:bg-orange-700 text-white py-2 px-4 rounded-lg font-medium transition"
              >
                Sí, Agregar Sesión
              </button>
              <button
                onClick={() => setMostrarConfirmacionAgregarSesion(false)}
                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg font-medium transition"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de confirmación para eliminar sesión individual */}
      {mostrarConfirmacionEliminarSesion && sesionAEliminar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-lg w-full mx-4">
            <h3 className="text-xl font-bold text-red-700 mb-4">
              ⚠️ Confirmar Eliminación de Sesión
            </h3>
            <p className="text-gray-600 mb-4">
              ¿Está seguro de que desea eliminar esta sesión extra?
            </p>

            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <h4 className="font-semibold text-red-800 mb-2">Sesión a eliminar:</h4>
              <p className="text-sm text-red-700">{sesionAEliminar.nombre}</p>
              {sesionAEliminar.fecha && (
                <p className="text-xs text-red-600 mt-1">Fecha: {sesionAEliminar.fecha}</p>
              )}
              <p className="text-xs text-red-600 mt-2">
                ⚠️ Esta acción no se puede deshacer
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={eliminarSesionExtra}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg font-medium transition"
              >
                Sí, Eliminar
              </button>
              <button
                onClick={() => {
                  setMostrarConfirmacionEliminarSesion(false);
                  setSesionAEliminar(null);
                }}
                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg font-medium transition"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Éxito para Sesiones */}
      {mostrarModalExito && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full mx-4">
            <div className="text-center">
              <div className="text-4xl mb-4">✅</div>
              <h3 className="text-xl font-bold text-green-700 mb-4">Éxito</h3>
              <p className="text-gray-600 mb-6">{mensajeExitoSesion}</p>
              <button
                onClick={() => setMostrarModalExito(false)}
                className="bg-green-600 hover:bg-green-700 text-white py-2 px-6 rounded-lg font-medium transition"
              >
                Aceptar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}