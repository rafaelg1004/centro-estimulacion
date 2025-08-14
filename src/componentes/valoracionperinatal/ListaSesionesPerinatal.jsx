import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiRequest } from "../../config/api";
import { ArrowLeftIcon, CheckCircleIcon, ClockIcon, PencilSquareIcon } from "@heroicons/react/24/solid";
import FirmaCanvas from "../valoraciondeingreso/FirmaCanvas";

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

  const crearSesionesDinamicas = (tipoPrograma, firmasValidadas = {}) => {
    let sesiones = [];
    let sesionesIntensivo = [];
    
    // Solo crear sesiones si el consentimiento correspondiente está firmado
    if ((tipoPrograma === 'educacion' || tipoPrograma === 'ambos') && firmasValidadas.tieneEducacionFirmada) {
      const nombresSesiones = [
        "Sesión 1: Cambios anatómicos y fisiológicos del embarazo",
        "Sesión 2: Nutrición durante el embarazo", 
        "Sesión 3: Ejercicio y relajación",
        "Sesión 4: Trabajo de parto y parto",
        "Sesión 5: Manejo del dolor",
        "Sesión 6: Lactancia materna",
        "Sesión 7: Cuidados del recién nacido",
        "Sesión 8: Sesión para abuelos",
        "Sesión 9: Visita postparto inmediato",
        "Sesión 10: Visita postparto 15 días"
      ];
      
      for (let i = 0; i < 10; i++) {
        sesiones.push({
          nombre: nombresSesiones[i],
          fecha: "",
          firmaPaciente: ""
        });
      }
    }
    
    if (tipoPrograma === 'fisico' && firmasValidadas.tieneFisicoFirmado) {
      sesiones = [
        { nombre: "Sesión Física 1: Evaluación inicial", fecha: "", firmaPaciente: "" },
        { nombre: "Sesión Física 2: Acondicionamiento básico", fecha: "", firmaPaciente: "" },
        { nombre: "Sesión Física 3: Fortalecimiento core", fecha: "", firmaPaciente: "" },
        { nombre: "Sesión Física 4: Ejercicios respiratorios", fecha: "", firmaPaciente: "" },
        { nombre: "Sesión Física 5: Yoga prenatal", fecha: "", firmaPaciente: "" },
        { nombre: "Sesión Física 6: Balonterapia", fecha: "", firmaPaciente: "" },
        { nombre: "Sesión Física 7: Ejercicios con banda", fecha: "", firmaPaciente: "" },
        { nombre: "Sesión Física 8: Sesión final", fecha: "", firmaPaciente: "" }
      ];
    }
    
    if (tipoPrograma === 'intensivo' && firmasValidadas.tieneIntensivoFirmado) {
      sesionesIntensivo = [
        { nombre: "Sesión 1: Preparación integral para el parto", fecha: "", firmaPaciente: "" },
        { nombre: "Sesión 2: Técnicas de relajación y respiración", fecha: "", firmaPaciente: "" },
        { nombre: "Sesión 3: Lactancia y cuidados del bebé", fecha: "", firmaPaciente: "" }
      ];
    }
    
    if (tipoPrograma === 'ambos') {
      // Para ambos, crear sesiones físicas solo si está firmado el consentimiento físico
      if (firmasValidadas.tieneFisicoFirmado) {
        for (let i = 0; i < 8; i++) {
          sesionesIntensivo.push({
            nombre: `Sesión Física ${i+1}: Acondicionamiento especializado`,
            fecha: "",
            firmaPaciente: ""
          });
        }
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
      // Cargar datos del paciente
      const datoPaciente = await apiRequest(`/pacientes-adultos/${id}`);
      setPaciente(datoPaciente);

      // Buscar el consentimiento más reciente del paciente
      try {
        const consentimientos = await apiRequest(`/consentimiento-perinatal/paciente/${id}`);
        console.log('Consentimientos encontrados:', consentimientos);
        if (consentimientos && consentimientos.length > 0) {
          const consentimiento = consentimientos[0];
          console.log('Consentimiento seleccionado:', consentimiento);
          
          // Verificar qué consentimientos están firmados para mostrar opciones
          console.log('=== VERIFICANDO FIRMAS DESDE BACKEND ===');
          console.log('firmaPacienteGeneral:', consentimiento.firmaPacienteGeneral);
          console.log('firmaFisioterapeutaGeneral:', consentimiento.firmaFisioterapeutaGeneral);
          console.log('firmaPacienteFisico:', consentimiento.firmaPacienteFisico);
          console.log('firmaFisioterapeutaFisico:', consentimiento.firmaFisioterapeutaFisico);
          console.log('firmaPacienteEducacion:', consentimiento.firmaPacienteEducacion);
          console.log('firmaFisioterapeutaEducacion:', consentimiento.firmaFisioterapeutaEducacion);
          
          const tieneEducacionFirmada = consentimiento.firmaPacienteGeneral && consentimiento.firmaFisioterapeutaGeneral;
          const tieneFisicoFirmado = consentimiento.firmaPacienteFisico && consentimiento.firmaFisioterapeutaFisico;
          const tieneIntensivoFirmado = consentimiento.firmaPacienteEducacion && consentimiento.firmaFisioterapeutaEducacion;
          
          console.log('Consentimientos firmados:', {
            educacion: tieneEducacionFirmada,
            fisico: tieneFisicoFirmado,
            intensivo: tieneIntensivoFirmado
          });
          
          // Si no tiene sesiones, preparar las opciones disponibles
          if (consentimiento.tipoPrograma && 
              (!consentimiento.sesiones || consentimiento.sesiones.length === 0)) {
            const { sesiones, sesionesIntensivo } = crearSesionesDinamicas(
              consentimiento.tipoPrograma, 
              { tieneEducacionFirmada, tieneFisicoFirmado, tieneIntensivoFirmado }
            );
            setSesionesDisponibles({ sesiones, sesionesIntensivo, tieneEducacionFirmada, tieneFisicoFirmado, tieneIntensivoFirmado });
          }
          
          console.log('Sesiones:', consentimiento.sesiones);
          console.log('Sesiones intensivo:', consentimiento.sesionesIntensivo);
          setConsentimiento(consentimiento);
        }
      } catch (consentimientoError) {
        console.error('Error al buscar consentimientos:', consentimientoError);
        // Intentar buscar en todos los consentimientos
        try {
          const todosConsentimientos = await apiRequest('/consentimiento-perinatal');
          console.log('Todos los consentimientos:', todosConsentimientos);
          const consentimientoPaciente = todosConsentimientos.find(c => 
            c.paciente && (c.paciente._id === id || c.paciente === id)
          );
          if (consentimientoPaciente) {
            console.log('Consentimiento encontrado por filtro:', consentimientoPaciente);
            setConsentimiento(consentimientoPaciente);
          }
        } catch (error2) {
          console.error('Error al buscar en todos los consentimientos:', error2);
        }
      }
    } catch (error) {
      console.error("Error al cargar datos:", error);
    } finally {
      setCargando(false);
    }
  };

  const guardarSesion = async () => {
    try {
      const sesionActualizada = {
        ...sesionEditando,
        fecha: fechaTemp,
        firmaPaciente: formularioTemp.firmaPaciente || ""
      };

      // Actualizar en el consentimiento
      const datosActualizados = { ...consentimiento };
      if (sesionEditando.tipo === 'educacion') {
        datosActualizados.sesiones[sesionEditando.index] = sesionActualizada;
      } else {
        datosActualizados.sesionesIntensivo[sesionEditando.index] = sesionActualizada;
      }

      await apiRequest(`/consentimiento-perinatal/${consentimiento._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datosActualizados)
      });

      setConsentimiento(datosActualizados);
      setSesionEditando(null);
      setFechaTemp("");
      setFormularioTemp({});
      alert('Sesión actualizada correctamente');
    } catch (error) {
      console.error('Error al guardar sesión:', error);
      alert('Error al guardar la sesión');
    }
  };

  const confirmarCreacionSesiones = async () => {
    try {
      const datosActualizados = { ...consentimiento };
      datosActualizados.sesiones = sesionesDisponibles.sesiones;
      datosActualizados.sesionesIntensivo = sesionesDisponibles.sesionesIntensivo;

      await apiRequest(`/consentimiento-perinatal/${consentimiento._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datosActualizados)
      });

      setConsentimiento(datosActualizados);
      setSesionesDisponibles(null);
      setMostrarConfirmacion(false);
      
      setMensajeExito(`✅ Sesiones creadas exitosamente\n\nTotal de sesiones creadas: ${(datosActualizados.sesiones?.length || 0) + (datosActualizados.sesionesIntensivo?.length || 0)}\nTipo de programa: ${consentimiento.tipoPrograma}\n\nLas sesiones están listas para ser programadas.`);
      setMostrarExito(true);
    } catch (error) {
      console.error('Error al crear sesiones:', error);
      alert('Error al crear las sesiones');
    }
  };

  const confirmarEliminacionSesiones = async () => {
    try {
      // Recopilar URLs de firmas de S3 para eliminar
      const firmasParaEliminar = [];
      
      // Firmas de sesiones regulares
      if (consentimiento.sesiones) {
        consentimiento.sesiones.forEach(sesion => {
          if (sesion.firmaPaciente && sesion.firmaPaciente.startsWith('https://')) {
            firmasParaEliminar.push(sesion.firmaPaciente);
          }
        });
      }
      
      // Firmas de sesiones intensivas
      if (consentimiento.sesionesIntensivo) {
        consentimiento.sesionesIntensivo.forEach(sesion => {
          if (sesion.firmaPaciente && sesion.firmaPaciente.startsWith('https://')) {
            firmasParaEliminar.push(sesion.firmaPaciente);
          }
        });
      }

      // Eliminar firmas de S3 si existen
      if (firmasParaEliminar.length > 0) {
        console.log('Eliminando firmas de S3:', firmasParaEliminar);
        try {
          await apiRequest('/eliminar-firmas-s3', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ urls: firmasParaEliminar })
          });
        } catch (s3Error) {
          console.warn('Error eliminando firmas de S3:', s3Error);
        }
      }

      const datosActualizados = { ...consentimiento };
      datosActualizados.sesiones = [];
      datosActualizados.sesionesIntensivo = [];

      await apiRequest(`/consentimiento-perinatal/${consentimiento._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datosActualizados)
      });

      setConsentimiento(datosActualizados);
      setMostrarConfirmacionEliminar(false);
      
      const mensajeFirmas = firmasParaEliminar.length > 0 ? `\n\nSe eliminaron ${firmasParaEliminar.length} firmas de S3.` : '';
      setMensajeExito(`🗑️ Sesiones eliminadas exitosamente\n\nTodas las sesiones han sido eliminadas del programa.${mensajeFirmas}`);
      setMostrarExito(true);
    } catch (error) {
      console.error('Error al eliminar sesiones:', error);
      alert('Error al eliminar las sesiones');
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
                  <h4 className="font-semibold text-gray-900">{sesion.nombre}</h4>
                  <p className="text-sm text-gray-600">
                    {sesion.fecha ? `Fecha: ${sesion.fecha}` : "Fecha pendiente"}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {sesion.firmaPaciente ? (
                    <CheckCircleIcon className="h-6 w-6 text-green-600" title="Firmado" />
                  ) : (
                    <ClockIcon className="h-6 w-6 text-yellow-600" title="Pendiente" />
                  )}
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
            onClick={() => navigate("/consentimientos-perinatales")}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-xl transition"
          >
            Volver
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
              onClick={() => navigate(`/valoracion-ingreso-programa-perinatal/${paciente._id}`)}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-xl transition"
            >
              Crear Valoración Perinatal
            </button>
            <button
              onClick={() => navigate("/consentimientos-perinatales")}
              className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-xl transition"
            >
              Volver
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
            </div>
            <button
              onClick={() => navigate("/consentimientos-perinatales")}
              className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-xl font-bold shadow transition flex items-center gap-2"
            >
              <ArrowLeftIcon className="h-5 w-5" />
              Volver
            </button>
          </div>

          {/* Debug info */}
          {process.env.NODE_ENV === 'development' && (
            <div className="mb-4 p-3 bg-yellow-50 rounded border text-xs">
              <strong>Debug:</strong> Tipo: {consentimiento.tipoPrograma}, 
              Sesiones: {consentimiento.sesiones?.length || 0}, 
              Intensivo: {consentimiento.sesionesIntensivo?.length || 0}<br/>
              <strong>Firmas Consentimientos:</strong><br/>
              • Educación: Pac={consentimiento.firmaPacienteGeneral ? 'SI' : 'NO'} Fisio={consentimiento.firmaFisioterapeutaGeneral ? 'SI' : 'NO'}<br/>
              • Físico: Pac={consentimiento.firmaPacienteFisico ? 'SI' : 'NO'} Fisio={consentimiento.firmaFisioterapeutaFisico ? 'SI' : 'NO'}<br/>
              • Intensivo: Pac={consentimiento.firmaPacienteEducacion ? 'SI' : 'NO'} Fisio={consentimiento.firmaFisioterapeutaEducacion ? 'SI' : 'NO'}
            </div>
          )}

          {/* Mostrar sesiones basándose en si existen */}
          {((consentimiento.sesiones && consentimiento.sesiones.length > 0) || 
            (consentimiento.sesionesIntensivo && consentimiento.sesionesIntensivo.length > 0)) && (
            <div className="mb-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-indigo-700">Sesiones Creadas</h2>
                <button
                  onClick={() => setMostrarConfirmacionEliminar(true)}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition flex items-center gap-2"
                >
                  🗑️ Eliminar Todas las Sesiones
                </button>
              </div>
            </div>
          )}

          {consentimiento.sesiones && consentimiento.sesiones.length > 0 && 
            renderSesiones(consentimiento.sesiones, "Sesiones de Educación para el Nacimiento", "educacion")
          }

          {consentimiento.sesionesIntensivo && consentimiento.sesionesIntensivo.length > 0 && 
            renderSesiones(consentimiento.sesionesIntensivo, 
              consentimiento.tipoPrograma === "intensivo" ? "Sesiones de Educación Intensivo" : "Sesiones Adicionales",
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
                  {sesionesDisponibles.tieneEducacionFirmada && (
                    <li>• <strong>Educación:</strong> {sesionesDisponibles.sesiones?.length || 0} sesiones</li>
                  )}
                  {sesionesDisponibles.tieneFisicoFirmado && consentimiento.tipoPrograma === 'fisico' && (
                    <li>• <strong>Físico:</strong> {sesionesDisponibles.sesiones?.length || 0} sesiones</li>
                  )}
                  {sesionesDisponibles.tieneFisicoFirmado && consentimiento.tipoPrograma === 'ambos' && (
                    <li>• <strong>Físico adicional:</strong> {sesionesDisponibles.sesionesIntensivo?.length || 0} sesiones</li>
                  )}
                  {sesionesDisponibles.tieneIntensivoFirmado && (
                    <li>• <strong>Intensivo:</strong> {sesionesDisponibles.sesionesIntensivo?.length || 0} sesiones</li>
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

          {/* Mensaje cuando no hay sesiones disponibles */}
          {(!consentimiento.sesiones || consentimiento.sesiones.length === 0) && 
           (!consentimiento.sesionesIntensivo || consentimiento.sesionesIntensivo.length === 0) && 
           !sesionesDisponibles && (
            <div className="text-center py-8">
              <h3 className="text-xl font-bold text-orange-700 mb-2">Sesiones no disponibles</h3>
              <p className="text-gray-600 mb-4">
                Para habilitar las sesiones, debe completar y firmar los consentimientos correspondientes:
              </p>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-sm text-left max-w-md mx-auto">
                <ul className="space-y-1">
                  <li>• <strong>Educación:</strong> Requiere consentimiento de educación firmado</li>
                  <li>• <strong>Físico:</strong> Requiere consentimiento físico firmado</li>
                  <li>• <strong>Intensivo:</strong> Requiere consentimiento intensivo firmado</li>
                  <li>• <strong>Ambos:</strong> Requiere ambos consentimientos firmados</li>
                </ul>
              </div>
              <button
                onClick={() => navigate(`/consentimientos-perinatales/${consentimiento._id}/editar`)}
                className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-xl transition"
              >
                Completar Consentimientos
              </button>
            </div>
          )}

          {/* Información adicional */}
          <div className="mt-8 bg-indigo-50 rounded-xl p-4">
            <h4 className="font-semibold text-indigo-700 mb-2">Información del Consentimiento</h4>
            <p className="text-sm text-gray-600">
              Fecha de creación: {new Date(consentimiento.fecha + 'T00:00:00').toLocaleDateString('es-CO')}
            </p>
            {consentimiento.motivoConsulta && (
              <p className="text-sm text-gray-600 mt-1">
                Motivo de consulta: {consentimiento.motivoConsulta}
              </p>
            )}
          </div>
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
                {sesionesDisponibles.tieneEducacionFirmada && sesionesDisponibles.sesiones?.map((sesion, index) => (
                  <li key={`edu-${index}`} className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                    {sesion.nombre}
                  </li>
                ))}
                {sesionesDisponibles.tieneFisicoFirmado && consentimiento.tipoPrograma === 'fisico' && sesionesDisponibles.sesiones?.map((sesion, index) => (
                  <li key={`fis-${index}`} className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    {sesion.nombre}
                  </li>
                ))}
                {sesionesDisponibles.tieneIntensivoFirmado && sesionesDisponibles.sesionesIntensivo?.map((sesion, index) => (
                  <li key={`int-${index}`} className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                    {sesion.nombre}
                  </li>
                ))}
                {sesionesDisponibles.tieneFisicoFirmado && consentimiento.tipoPrograma === 'ambos' && sesionesDisponibles.sesionesIntensivo?.map((sesion, index) => (
                  <li key={`amb-${index}`} className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
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
                setFormulario={(name, value) => setFormularioTemp(prev => ({ ...prev, [name]: value }))}
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
    </div>
  );
}