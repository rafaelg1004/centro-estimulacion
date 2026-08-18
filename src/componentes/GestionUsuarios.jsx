import React, { useState, useEffect } from "react";
import { apiRequest } from "../config/api";
import Swal from "sweetalert2";
import {
  ShieldCheckIcon,
  ShieldExclamationIcon,
  UserMinusIcon,
  UserPlusIcon,
  KeyIcon,
  PencilSquareIcon,
  UserGroupIcon,
  LockClosedIcon,
  LockOpenIcon,
  MagnifyingGlassIcon,
  CheckCircleIcon,
  XCircleIcon,
} from "@heroicons/react/24/solid";

export default function GestionUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState("");
  const [qrSetup, setQrSetup] = useState(null);
  const [copiado, setCopiado] = useState(false);
  const [editandoUsuario, setEditandoUsuario] = useState(null);
  const [editFormData, setEditFormData] = useState({
    nombre: "",
    email: "",
    rol: "",
    registroMedico: "",
  });

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const cargarUsuarios = async () => {
    try {
      const data = await apiRequest("/auth/users");
      setUsuarios(data);
    } catch (error) {
      Swal.fire("Error", "No se pudieron cargar los usuarios", "error");
    } finally {
      setLoading(false);
    }
  };

  const bloquearUsuario = async (id) => {
    const result = await Swal.fire({
      title: "¿Bloquear usuario?",
      text: "El usuario será bloqueado temporalmente por 15 minutos",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#f97316",
      cancelButtonColor: "#6366f1",
      confirmButtonText: "Sí, bloquear",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      try {
        await apiRequest(`/auth/block-user/${id}`, { method: "POST" });
        await cargarUsuarios();
        Swal.fire("Bloqueado", "Usuario bloqueado por 15 minutos", "success");
      } catch (error) {
        Swal.fire("Error", "No se pudo bloquear el usuario", "error");
      }
    }
  };

  const desbloquearUsuario = async (id) => {
    try {
      await apiRequest(`/auth/unblock-user/${id}`, { method: "POST" });
      await cargarUsuarios();
      Swal.fire("Desbloqueado", "Usuario desbloqueado exitosamente", "success");
    } catch (error) {
      Swal.fire("Error", "No se pudo desbloquear el usuario", "error");
    }
  };

  const deshabilitar2FA = async (id) => {
    const result = await Swal.fire({
      title: "¿Deshabilitar 2FA?",
      text: "Se deshabilitará la autenticación de dos factores para este usuario",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6366f1",
      confirmButtonText: "Sí, deshabilitar",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      try {
        await apiRequest(`/auth/disable-2fa/${id}`, { method: "POST" });
        await cargarUsuarios();
        Swal.fire("Deshabilitado", "2FA deshabilitado correctamente", "success");
      } catch (error) {
        Swal.fire("Error", "No se pudo deshabilitar 2FA", "error");
      }
    }
  };

  const habilitar2FA = async (id) => {
    try {
      const data = await apiRequest("/auth/enable-2fa", {
        method: "POST",
        body: JSON.stringify({ userId: id }),
      });
      setQrSetup(data);
    } catch (error) {
      Swal.fire("Error", "No se pudo iniciar configuración 2FA", "error");
    }
  };

  const cambiarContrasena = async (id) => {
    const { value: newPassword } = await Swal.fire({
      title: "Cambiar Contraseña",
      input: "password",
      inputLabel: "Nueva contraseña (mínimo 6 caracteres)",
      inputPlaceholder: "Ingresa la nueva contraseña",
      inputValidator: (value) => {
        if (!value || value.length < 6) {
          return "La contraseña debe tener al menos 6 caracteres";
        }
      },
      showCancelButton: true,
      confirmButtonText: "Cambiar Contraseña",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#8b5cf6",
    });

    if (newPassword) {
      try {
        await apiRequest(`/auth/change-password/${id}`, {
          method: "POST",
          body: JSON.stringify({ newPassword }),
        });
        Swal.fire("Éxito", "Contraseña cambiada correctamente", "success");
      } catch (error) {
        Swal.fire("Error", "No se pudo cambiar la contraseña", "error");
      }
    }
  };

  const handleEditClick = (usuario) => {
    setEditFormData({
      nombre: usuario.nombre || "",
      email: usuario.email || "",
      rol: usuario.rol || "auxiliar",
      registroMedico: usuario.registro_medico || usuario.registroMedico || "",
    });
    setEditandoUsuario(usuario);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await apiRequest(`/auth/users/${editandoUsuario.id || editandoUsuario._id}`, {
        method: "PUT",
        body: JSON.stringify(editFormData),
      });
      Swal.fire("Éxito", "Usuario actualizado correctamente", "success");
      setEditandoUsuario(null);
      cargarUsuarios();
    } catch (error) {
      Swal.fire("Error", "No se pudo actualizar el usuario", "error");
    }
  };

  const copiarSecreto = (secret) => {
    navigator.clipboard.writeText(secret);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  };

  // Filtrado de usuarios por búsqueda
  const usuariosFiltrados = usuarios.filter((u) => {
    const q = busqueda.toLowerCase().trim();
    if (!q) return true;
    const nombre = (u.nombre || "").toLowerCase();
    const username = (u.username || u.usuario || "").toLowerCase();
    const email = (u.email || "").toLowerCase();
    const rol = (u.rol || "").toLowerCase();
    return nombre.includes(q) || username.includes(q) || email.includes(q) || rol.includes(q);
  });

  // Estadísticas rápidas
  const totalUsuarios = usuarios.length;
  const usuariosCon2FA = usuarios.filter(
    (u) => Boolean(u.two_factor_enabled || u.twoFactorEnabled)
  ).length;
  const usuariosBloqueados = usuarios.filter((u) => {
    const blockUntil = u.bloqueado_hasta || u.bloqueadoHasta;
    return blockUntil && new Date(blockUntil) > new Date();
  }).length;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[350px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-indigo-600"></div>
        <span className="mt-4 text-indigo-700 font-bold tracking-wide">Cargando panel de usuarios...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50/50 via-white to-pink-50/30 py-8 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Encabezado Principal */}
        <div className="bg-white rounded-3xl p-6 shadow-xl border border-indigo-100/80 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="p-3.5 bg-gradient-to-tr from-indigo-600 to-violet-500 text-white rounded-2xl shadow-lg shadow-indigo-200">
              <UserGroupIcon className="h-8 w-8" />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-gray-800 tracking-tight">
                Gestión de Usuarios
              </h2>
              <p className="text-sm text-gray-500 font-medium mt-0.5">
                Administra accesos, roles, estados de seguridad y autenticación 2FA
              </p>
            </div>
          </div>

          {/* Tarjetas de Estadísticas Rápidas */}
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <div className="flex-1 md:flex-none bg-indigo-50/60 border border-indigo-100 rounded-2xl px-4 py-2.5 text-center">
              <span className="block text-xs font-bold uppercase text-indigo-400">Total</span>
              <span className="text-xl font-black text-indigo-700">{totalUsuarios}</span>
            </div>
            <div className="flex-1 md:flex-none bg-emerald-50/60 border border-emerald-100 rounded-2xl px-4 py-2.5 text-center">
              <span className="block text-xs font-bold uppercase text-emerald-500">Con 2FA</span>
              <span className="text-xl font-black text-emerald-700">{usuariosCon2FA}</span>
            </div>
            <div className="flex-1 md:flex-none bg-rose-50/60 border border-rose-100 rounded-2xl px-4 py-2.5 text-center">
              <span className="block text-xs font-bold uppercase text-rose-400">Bloqueados</span>
              <span className="text-xl font-black text-rose-700">{usuariosBloqueados}</span>
            </div>
          </div>
        </div>

        {/* Bar de Búsqueda y Controles */}
        <div className="bg-white rounded-2xl p-4 shadow-md border border-gray-100 flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <MagnifyingGlassIcon className="h-5 w-5 absolute left-3.5 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por nombre, usuario, email o rol..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none text-sm transition-all"
            />
          </div>
          <span className="text-xs font-semibold text-gray-400 hidden sm:inline-block">
            Mostrando {usuariosFiltrados.length} de {usuarios.length} usuarios
          </span>
        </div>

        {/* Tabla de Usuarios */}
        <div className="bg-white rounded-3xl shadow-xl border border-indigo-100/70 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gradient-to-r from-indigo-50 via-purple-50/40 to-indigo-50 border-b border-indigo-100">
                  <th className="px-6 py-4 text-xs font-black text-indigo-900 uppercase tracking-wider">
                    Usuario
                  </th>
                  <th className="px-6 py-4 text-xs font-black text-indigo-900 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-4 text-xs font-black text-indigo-900 uppercase tracking-wider">
                    Rol / Reg. Médico
                  </th>
                  <th className="px-6 py-4 text-xs font-black text-indigo-900 uppercase tracking-wider">
                    Seguridad 2FA
                  </th>
                  <th className="px-6 py-4 text-xs font-black text-indigo-900 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-4 text-xs font-black text-indigo-900 uppercase tracking-wider text-center">
                    Acciones de Gestión
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {usuariosFiltrados.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center text-gray-400 font-medium">
                      No se encontraron usuarios que coincidan con la búsqueda.
                    </td>
                  </tr>
                ) : (
                  usuariosFiltrados.map((usuario) => {
                    const userId = usuario.id || usuario._id;
                    const is2FAEnabled = Boolean(
                      usuario.two_factor_enabled || usuario.twoFactorEnabled
                    );
                    const blockUntil = usuario.bloqueado_hasta || usuario.bloqueadoHasta;
                    const isBloqueado = Boolean(
                      blockUntil && new Date(blockUntil) > new Date()
                    );
                    const rol = usuario.rol || "usuario";

                    // Estilo badge rol
                    let rolBadgeClass = "bg-gray-100 text-gray-700 border-gray-200";
                    if (rol === "administracion") {
                      rolBadgeClass = "bg-purple-100 text-purple-800 border-purple-200 font-bold";
                    } else if (rol === "fisioterapeuta") {
                      rolBadgeClass = "bg-blue-100 text-blue-800 border-blue-200 font-bold";
                    } else if (rol === "auxiliar") {
                      rolBadgeClass = "bg-emerald-100 text-emerald-800 border-emerald-200 font-bold";
                    }

                    // Iniciales usuario
                    const iniciales = (usuario.nombre || usuario.username || "U")
                      .split(" ")
                      .map((n) => n[0])
                      .slice(0, 2)
                      .join("")
                      .toUpperCase();

                    return (
                      <tr
                        key={userId}
                        className="hover:bg-indigo-50/30 transition-colors group"
                      >
                        {/* Usuario / Nombre */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-bold flex items-center justify-center text-sm shadow-md shadow-indigo-100 flex-shrink-0">
                              {iniciales}
                            </div>
                            <div>
                              <div className="font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
                                {usuario.nombre || "Sin nombre registrado"}
                              </div>
                              <div className="text-xs text-gray-400 font-mono">
                                @{usuario.username || usuario.usuario}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Email */}
                        <td className="px-6 py-4 font-medium text-gray-600">
                          {usuario.email || <span className="text-gray-300 italic">No registrado</span>}
                        </td>

                        {/* Rol / Reg Médico */}
                        <td className="px-6 py-4">
                          <div className="space-y-1">
                            <span className={`inline-block px-2.5 py-0.5 text-xs rounded-full border ${rolBadgeClass} capitalize`}>
                              {rol}
                            </span>
                            {(usuario.registro_medico || usuario.registroMedico) && (
                              <div className="text-xs text-gray-400 font-medium">
                                RM: <span className="text-gray-600 font-semibold">{usuario.registro_medico || usuario.registroMedico}</span>
                              </div>
                            )}
                          </div>
                        </td>

                        {/* 2FA Estado */}
                        <td className="px-6 py-4">
                          {is2FAEnabled ? (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 shadow-sm">
                              <CheckCircleIcon className="h-4 w-4 text-emerald-600" />
                              2FA Habilitado
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-500 border border-gray-200">
                              <XCircleIcon className="h-4 w-4 text-gray-400" />
                              Sin 2FA
                            </span>
                          )}
                        </td>

                        {/* Estado Bloqueo */}
                        <td className="px-6 py-4">
                          {isBloqueado ? (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-full bg-rose-100 text-rose-800 border border-rose-200 shadow-sm animate-pulse">
                              <LockClosedIcon className="h-3.5 w-3.5 text-rose-600" />
                              Bloqueado
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
                              <LockOpenIcon className="h-3.5 w-3.5 text-emerald-500" />
                              Activo
                            </span>
                          )}
                        </td>

                        {/* Botones de Acción (Corregidos visualmente y lógicamente) */}
                        <td className="px-6 py-4">
                          <div className="flex flex-wrap items-center justify-center gap-2">
                            {/* Editar */}
                            <button
                              onClick={() => handleEditClick(usuario)}
                              title="Editar usuario"
                              className="px-3 py-1.5 rounded-xl bg-indigo-50 text-indigo-700 hover:bg-indigo-600 hover:text-white border border-indigo-200 transition-all font-semibold text-xs flex items-center gap-1.5 shadow-sm active:scale-95"
                            >
                              <PencilSquareIcon className="h-3.5 w-3.5" />
                              Editar
                            </button>

                            {/* Botón 2FA: Muestra Deshabilitar 2FA si está activo, o Habilitar 2FA si está inactivo */}
                            {is2FAEnabled ? (
                              <button
                                onClick={() => deshabilitar2FA(userId)}
                                title="Deshabilitar autenticación 2FA"
                                className="px-3 py-1.5 rounded-xl bg-rose-50 text-rose-700 hover:bg-rose-600 hover:text-white border border-rose-200 transition-all font-semibold text-xs flex items-center gap-1.5 shadow-sm active:scale-95"
                              >
                                <ShieldExclamationIcon className="h-3.5 w-3.5" />
                                Deshabilitar 2FA
                              </button>
                            ) : (
                              <button
                                onClick={() => habilitar2FA(userId)}
                                title="Habilitar autenticación 2FA"
                                className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white border border-emerald-200 transition-all font-semibold text-xs flex items-center gap-1.5 shadow-sm active:scale-95"
                              >
                                <ShieldCheckIcon className="h-3.5 w-3.5" />
                                Habilitar 2FA
                              </button>
                            )}

                            {/* Botón Bloquear/Desbloquear */}
                            {isBloqueado ? (
                              <button
                                onClick={() => desbloquearUsuario(userId)}
                                title="Desbloquear acceso"
                                className="px-3 py-1.5 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white border border-blue-200 transition-all font-semibold text-xs flex items-center gap-1.5 shadow-sm active:scale-95"
                              >
                                <UserPlusIcon className="h-3.5 w-3.5" />
                                Desbloquear
                              </button>
                            ) : (
                              <button
                                onClick={() => bloquearUsuario(userId)}
                                title="Bloquear por 15 minutos"
                                className="px-3 py-1.5 rounded-xl bg-amber-50 text-amber-700 hover:bg-amber-600 hover:text-white border border-amber-200 transition-all font-semibold text-xs flex items-center gap-1.5 shadow-sm active:scale-95"
                              >
                                <UserMinusIcon className="h-3.5 w-3.5" />
                                Bloquear
                              </button>
                            )}

                            {/* Cambiar Contraseña */}
                            <button
                              onClick={() => cambiarContrasena(userId)}
                              title="Cambiar contraseña de usuario"
                              className="px-3 py-1.5 rounded-xl bg-purple-50 text-purple-700 hover:bg-purple-600 hover:text-white border border-purple-200 transition-all font-semibold text-xs flex items-center gap-1.5 shadow-sm active:scale-95"
                            >
                              <KeyIcon className="h-3.5 w-3.5" />
                              Contraseña
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal de Configuración QR de 2FA */}
        {qrSetup && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
            <div className="bg-white p-8 rounded-3xl shadow-2xl max-w-md w-full border border-indigo-100 space-y-6">
              <div className="text-center space-y-2">
                <div className="h-12 w-12 bg-emerald-100 text-emerald-600 rounded-2xl mx-auto flex items-center justify-center">
                  <ShieldCheckIcon className="h-7 w-7" />
                </div>
                <h3 className="text-2xl font-black text-gray-800">
                  Configurar Autenticación 2FA
                </h3>
                <p className="text-xs text-gray-500">
                  {qrSetup.instrucciones || "Escanea el código QR con Google Authenticator o Authy"}
                </p>
              </div>

              {/* Imagen Código QR */}
              <div className="flex justify-center p-4 bg-gray-50 rounded-2xl border border-gray-200 shadow-inner">
                <img
                  src={qrSetup.qrCode}
                  alt="QR Code para 2FA"
                  className="rounded-xl shadow-md max-w-[210px] w-full"
                />
              </div>

              {/* Secreto manual */}
              <div className="bg-indigo-50/60 border border-indigo-100 p-4 rounded-2xl space-y-1 text-center">
                <span className="text-xs font-bold uppercase text-indigo-400">
                  Código secreto manual:
                </span>
                <div className="flex items-center justify-center gap-2 mt-1">
                  <code className="font-mono text-xs font-bold text-indigo-900 bg-white px-3 py-1.5 rounded-lg border border-indigo-200 break-all select-all">
                    {qrSetup.secret}
                  </code>
                  <button
                    onClick={() => copiarSecreto(qrSetup.secret)}
                    className="text-xs font-bold text-indigo-600 hover:text-indigo-800 underline flex-shrink-0"
                  >
                    {copiado ? "¡Copiado!" : "Copiar"}
                  </button>
                </div>
              </div>

              {/* Botón de Cierre */}
              <button
                onClick={() => {
                  setQrSetup(null);
                  cargarUsuarios();
                }}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg shadow-indigo-200 transition-all text-sm"
              >
                Entendido, cerrar
              </button>
            </div>
          </div>
        )}

        {/* Modal de Edición de Usuario */}
        {editandoUsuario && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
            <div className="bg-white p-8 rounded-3xl shadow-2xl max-w-md w-full border border-indigo-100 space-y-6">
              <div className="border-b border-gray-100 pb-4">
                <h3 className="text-2xl font-black text-gray-800 text-center">
                  Editar Usuario
                </h3>
                <p className="text-xs text-gray-400 text-center mt-1">
                  Modificando datos de @{editandoUsuario.username || editandoUsuario.usuario}
                </p>
              </div>

              <form onSubmit={handleEditSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase mb-1">
                    Nombre Completo
                  </label>
                  <input
                    type="text"
                    value={editFormData.nombre}
                    onChange={(e) =>
                      setEditFormData({ ...editFormData, nombre: e.target.value })
                    }
                    className="w-full border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-indigo-300 focus:border-indigo-500 outline-none text-sm transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase mb-1">
                    Correo Electrónico
                  </label>
                  <input
                    type="email"
                    value={editFormData.email}
                    onChange={(e) =>
                      setEditFormData({ ...editFormData, email: e.target.value })
                    }
                    className="w-full border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-indigo-300 focus:border-indigo-500 outline-none text-sm transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase mb-1">
                    Rol de Usuario
                  </label>
                  <select
                    value={editFormData.rol}
                    onChange={(e) =>
                      setEditFormData({ ...editFormData, rol: e.target.value })
                    }
                    className="w-full border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-indigo-300 focus:border-indigo-500 outline-none text-sm transition-all bg-white"
                    required
                  >
                    <option value="fisioterapeuta">Fisioterapeuta</option>
                    <option value="auxiliar">Auxiliar</option>
                    <option value="administracion">Administración</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase mb-1">
                    Registro Médico (RM)
                  </label>
                  <input
                    type="text"
                    value={editFormData.registroMedico}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        registroMedico: e.target.value,
                      })
                    }
                    placeholder="Ej: RM-123456"
                    className="w-full border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-indigo-300 focus:border-indigo-500 outline-none text-sm transition-all"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setEditandoUsuario(null)}
                    className="px-5 py-2.5 text-sm font-bold text-gray-500 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-lg shadow-indigo-200 transition-all"
                  >
                    Guardar Cambios
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}