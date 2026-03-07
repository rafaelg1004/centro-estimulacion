import { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  UserPlusIcon,
  TrashIcon,
  PencilSquareIcon,
  ArrowLeftIcon,
  CheckIcon,
  LockClosedIcon
} from "@heroicons/react/24/solid";
import FirmaCanvas from "./ui/FirmaCanvas";
import Swal from "sweetalert2";
import { apiRequest } from "../config/api";

export default function DetalleSesionMensual() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [sesion, setSesion] = useState(null);
  const [pacientes, setPacientes] = useState([]);
  const [busquedaNino, setBusquedaNino] = useState("");
  const [showSugerencias, setShowSugerencias] = useState(false);
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);

  // Cargar datos de la sesión
  const cargarSesion = useCallback(async () => {
    try {
      const data = await apiRequest(`/sesiones-mensuales/${id}`);
      setSesion(data);
    } catch (error) {
      console.error("Error al cargar sesión:", error);
    } finally {
      setCargando(false);
    }
  }, [id]);

  useEffect(() => {
    cargarSesion();
  }, [cargarSesion]);

  // Buscar pacientes para agregar
  useEffect(() => {
    if (busquedaNino.trim() === "") {
      setPacientes([]);
      return;
    }
    const delayDebounce = setTimeout(() => {
      apiRequest(`/pacientes/buscar?q=${encodeURIComponent(busquedaNino)}`)
        .then(data => {
          if (Array.isArray(data)) setPacientes(data);
          else setPacientes([]);
        })
        .catch(() => setPacientes([]));
    }, 400);

    return () => clearTimeout(delayDebounce);
  }, [busquedaNino]);

  const agregarAsistente = async (paciente) => {
    // Verificar si ya está en la lista
    if (sesion.asistentes.some(a => (a.nino._id || a.nino) === paciente._id)) {
      Swal.fire('Atención', 'Este niño ya está registrado en la sesión', 'info');
      setBusquedaNino("");
      return;
    }

    const nuevosAsistentes = [...sesion.asistentes, { nino: paciente, observaciones: "" }];
    actualizarSesion({ asistentes: nuevosAsistentes });
    setBusquedaNino("");
    setShowSugerencias(false);
  };

  const eliminarAsistente = async (ninoId) => {
    const result = await Swal.fire({
      title: "¿Eliminar asistente?",
      text: "Se borrarán también las observaciones de este niño en esta sesión.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      confirmButtonColor: "#ef4444",
    });

    if (result.isConfirmed) {
      const nuevosAsistentes = sesion.asistentes.filter(a => (a.nino._id || a.nino) !== ninoId);
      actualizarSesion({ asistentes: nuevosAsistentes });
    }
  };

  const actualizarObservacion = (ninoId, texto) => {
    const nuevosAsistentes = sesion.asistentes.map(a => {
      if ((a.nino._id || a.nino) === ninoId) {
        return { ...a, observaciones: texto };
      }
      return a;
    });
    setSesion({ ...sesion, asistentes: nuevosAsistentes });
  };

  const guardarCambios = async () => {
    setGuardando(true);
    // Limpiar el objeto para enviar solo IDs al backend en el campo nino
    const sesionParaGuardar = {
      ...sesion,
      asistentes: sesion.asistentes.map(a => ({
        nino: a.nino._id || a.nino,
        observaciones: a.observaciones
      }))
    };

    try {
      await apiRequest(`/sesiones-mensuales/${id}`, {
        method: "PUT",
        body: JSON.stringify(sesionParaGuardar),
      });
      Swal.fire({
        title: '¡Guardado!',
        text: 'Los cambios se han guardado correctamente',
        icon: 'success',
        timer: 1500,
        showConfirmButton: false
      });
      cargarSesion(); // Recargar para tener los datos limpios
    } catch (error) {
      console.error("Error al guardar:", error);
      Swal.fire('Error', 'No se pudo guardar la información', 'error');
    } finally {
      setGuardando(false);
    }
  };

  const actualizarSesion = async (datos) => {
    try {
      const updateData = {
        ...sesion,
        ...datos,
        asistentes: (datos.asistentes || sesion.asistentes).map(a => ({
          nino: a.nino._id || a.nino,
          observaciones: a.observaciones
        }))
      };

      const res = await apiRequest(`/sesiones-mensuales/${id}`, {
        method: "PUT",
        body: JSON.stringify(updateData),
      });
      setSesion(res);
    } catch (error) {
      console.error("Error al actualizar:", error);
    }
  };

  const bloquearSesion = async () => {
    const result = await Swal.fire({
      title: '¿Cerrar Reporte de Asistencia?',
      text: "Una vez bloqueado, el reporte será inmutable y no podrá ser editado.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      confirmButtonText: 'Sí, cerrar'
    });

    if (result.isConfirmed) {
      try {
        setGuardando(true);
        await apiRequest(`/sesiones-mensuales/${id}`, {
          method: 'PUT',
          body: JSON.stringify({ ...sesion, bloqueada: true })
        });
        await cargarSesion();
        Swal.fire('¡Cerrado!', 'El reporte ahora es inmutable.', 'success');
      } catch (error) {
        Swal.fire('Error', error.message, 'error');
      } finally {
        setGuardando(false);
      }
    }
  };

  if (cargando || !sesion) return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-purple-600 border-solid"></div>
      <span className="mt-6 text-purple-700 font-bold text-lg">Cargando sesión mensual...</span>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-3xl shadow-2xl border border-purple-100 overflow-hidden">
          {/* Header */}
          <div className="bg-purple-600 p-6 text-white">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <button onClick={() => navigate("/sesiones-mensuales")} className="p-1 hover:bg-purple-500 rounded-lg transition">
                    <ArrowLeftIcon className="h-6 w-6" />
                  </button>
                  <h2 className="text-3xl font-bold">{sesion.nombre}</h2>
                </div>
                <p className="opacity-90 flex items-center gap-2">
                  <span className="font-semibold">Fecha:</span> {sesion.fecha}
                </p>
              </div>
              <div className="flex gap-2">
                {!sesion.bloqueada ? (
                  <>
                    <button
                      onClick={guardarCambios}
                      disabled={guardando}
                      className="bg-white text-purple-700 hover:bg-purple-50 font-bold px-4 py-2 rounded-xl shadow-md transition flex items-center gap-2"
                    >
                      {guardando ? (
                        <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-purple-600 border-solid"></div>
                      ) : (
                        <CheckIcon className="h-5 w-5" />
                      )}
                      Guardar Todo
                    </button>
                    <button
                      onClick={bloquearSesion}
                      className="bg-red-500 hover:bg-red-600 text-white font-bold px-4 py-2 rounded-xl shadow-md transition flex items-center gap-2 text-sm"
                    >
                      <LockClosedIcon className="h-4 w-4" />
                      Cerrar Reporte
                    </button>
                  </>
                ) : (
                  <div className="bg-green-100 text-green-700 px-4 py-2 rounded-xl border border-green-200 flex items-center gap-2 font-bold">
                    <LockClosedIcon className="h-5 w-5" />
                    Reporte Inmutable
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="p-6">
            {/* Descripción General */}
            <div className="mb-8">
              <label className="block text-purple-700 font-bold mb-2 flex items-center gap-2">
                <PencilSquareIcon className="h-5 w-5" /> Descripción de la Sesión
              </label>
              <textarea
                className="w-full border border-purple-100 rounded-2-xl p-4 bg-purple-50 focus:ring-2 focus:ring-purple-200 outline-none transition resize-none"
                rows={3}
                value={sesion.descripcionGeneral || ""}
                onChange={(e) => setSesion({ ...sesion, descripcionGeneral: e.target.value })}
                placeholder="Escribe aquí los objetivos o el resumen de la clase..."
                disabled={sesion.bloqueada}
              />
            </div>

            {/* Buscador de Niños */}
            {!sesion.bloqueada && (
              <div className="bg-indigo-50 rounded-2xl p-6 mb-8 border border-indigo-100">
                <h3 className="font-bold text-lg text-indigo-800 mb-4 flex items-center gap-2">
                  <UserPlusIcon className="h-6 w-6" /> Agregar Niño que Asistió
                </h3>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Escribe el nombre del niño..."
                    value={busquedaNino}
                    onChange={e => {
                      setBusquedaNino(e.target.value);
                      setShowSugerencias(true);
                    }}
                    onFocus={() => setShowSugerencias(true)}
                    className="w-full border border-indigo-200 focus:border-indigo-500 rounded-xl px-4 py-3 outline-none transition shadow-sm bg-white"
                    autoComplete="off"
                  />

                  {showSugerencias && busquedaNino && (
                    <div className="absolute left-0 top-full mt-1 w-full bg-white border border-indigo-200 rounded-xl shadow-xl z-50 max-h-60 overflow-y-auto">
                      {pacientes.length > 0 ? (
                        pacientes.map(p => (
                          <div
                            key={p._id}
                            className="px-4 py-3 hover:bg-indigo-50 cursor-pointer transition flex justify-between items-center border-b border-indigo-50 last:border-0"
                            onMouseDown={() => agregarAsistente(p)}
                          >
                            <span className="font-medium text-gray-800">{p.nombres}</span>
                            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">Seleccionar</span>
                          </div>
                        ))
                      ) : (
                        <div className="px-4 py-3 text-gray-500 italic">No se encontraron pacientes...</div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Lista de Asistentes */}
            <div>
              <h3 className="font-bold text-xl text-purple-800 mb-6 flex items-center gap-2">
                Niños Asistentes ({sesion.asistentes.length})
              </h3>

              {sesion.asistentes.length === 0 ? (
                <div className="text-center py-10 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                  <p className="text-gray-500">No hay niños registrados en esta sesión aún.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {sesion.asistentes.map((asistente) => (
                    <div
                      key={asistente.nino._id || asistente.nino}
                      className="bg-white border border-purple-100 rounded-2xl shadow-sm hover:shadow-md transition p-5 overflow-hidden relative"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-bold">
                            {asistente.nino.nombres?.[0] || "?"}
                          </div>
                          <h4 className="text-lg font-bold text-purple-900">
                            {asistente.nino.nombres || "Niño desconocido"}
                          </h4>
                        </div>
                        {!sesion.bloqueada && (
                          <button
                            onClick={() => eliminarAsistente(asistente.nino._id || asistente.nino)}
                            className="text-red-400 hover:text-red-600 transition p-1"
                            title="Eliminar de la sesión"
                          >
                            <TrashIcon className="h-6 w-6" />
                          </button>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-600 mb-1">
                          Observaciones específicas:
                        </label>
                        <textarea
                          className="w-full bg-gray-50 border border-gray-100 rounded-xl p-3 focus:bg-white focus:ring-2 focus:ring-purple-100 outline-none transition resize-none"
                          rows={2}
                          value={asistente.observaciones || ""}
                          onChange={(e) => actualizarObservacion(asistente.nino._id || asistente.nino, e.target.value)}
                          placeholder={`Escribe cómo le fue a ${asistente.nino.nombres?.split(' ')[0]}...`}
                          disabled={sesion.bloqueada}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Firma al final */}
            <div className="mt-12 bg-gray-50 rounded-2xl p-8 border border-gray-200">
              <h3 className="font-bold text-center text-purple-700 mb-6 underline">FIRMA PROFESIONAL RESPONSABLE</h3>
              <div className="flex flex-col items-center">
                {!sesion.bloqueada ? (
                  <FirmaCanvas
                    label="Firma de la Fisioterapeuta"
                    onUpload={(url) => setSesion({ ...sesion, firmaFisioterapeuta: url })}
                    initialImage={sesion.firmaFisioterapeuta}
                  />
                ) : (
                  <div className="flex flex-col items-center">
                    {sesion.firmaFisioterapeuta ? (
                      <>
                        <img src={sesion.firmaFisioterapeuta} alt="Firma Profesional" className="max-h-32 rounded shadow-sm border bg-white" />
                        {sesion.auditTrail?.firmaFisioterapeuta && (
                          <div className="text-[10px] text-gray-400 mt-2 font-mono text-center leading-tight">
                            Firmado Electrónicamente por {sesion.auditTrail.firmaFisioterapeuta.nombreUsuario}<br />
                            Reg: {sesion.auditTrail.firmaFisioterapeuta.registroProfesional}<br />
                            IP: {sesion.auditTrail.firmaFisioterapeuta.ip} | {new Date(sesion.auditTrail.firmaFisioterapeuta.fechaHora).toLocaleString()}
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="text-gray-400 italic">No se registró firma</div>
                    )}
                  </div>
                )}
              </div>

              {sesion.bloqueada && sesion.selloIntegridad && (
                <div className="mt-8 pt-6 border-t border-gray-200 text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <LockClosedIcon className="h-5 w-5 text-green-600" />
                    <span className="font-bold text-green-700 uppercase tracking-tighter text-sm">Sellado de Integridad Criptográfico (Ley 527)</span>
                  </div>
                  <p className="font-mono text-[8.5px] text-gray-400 break-all bg-white p-2 rounded border border-gray-100">
                    HASH: {sesion.selloIntegridad}
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="p-6 bg-gray-50 border-t border-purple-50 flex justify-end gap-4">
            {!sesion.bloqueada && (
              <button
                onClick={guardarCambios}
                disabled={guardando}
                className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-10 py-3 rounded-2xl shadow-lg transition flex items-center gap-2 transform hover:scale-105"
              >
                {guardando ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-white border-solid"></div>
                ) : (
                  <CheckIcon className="h-6 w-6" />
                )}
                Guardar Reporte
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
