import React, { useState, useEffect } from "react";
import { apiRequest } from "../config/api";
import Swal from "sweetalert2";
import {
  ShieldCheckIcon,
  ShieldExclamationIcon,
  UserMinusIcon,
  UserPlusIcon,
  KeyIcon
} from "@heroicons/react/24/solid";

export default function GestionUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [qrSetup, setQrSetup] = useState(null);

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
      text: "El usuario será bloqueado por 15 minutos",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#e53e3e",
      cancelButtonColor: "#6366f1",
      confirmButtonText: "Sí, bloquear",
      cancelButtonText: "Cancelar"
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
      Swal.fire("Desbloqueado", "Usuario desbloqueado", "success");
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
      confirmButtonColor: "#e53e3e",
      cancelButtonColor: "#6366f1",
      confirmButtonText: "Sí, deshabilitar",
      cancelButtonText: "Cancelar"
    });

    if (result.isConfirmed) {
      try {
        await apiRequest(`/auth/disable-2fa/${id}`, { method: "POST" });
        await cargarUsuarios();
        Swal.fire("Deshabilitado", "2FA deshabilitado", "success");
      } catch (error) {
        Swal.fire("Error", "No se pudo deshabilitar 2FA", "error");
      }
    }
  };

  const habilitar2FA = async (id) => {
    try {
      const data = await apiRequest("/auth/enable-2fa", {
        method: "POST",
        body: JSON.stringify({ userId: id })
      });
      setQrSetup(data);
    } catch (error) {
      Swal.fire("Error", "No se pudo habilitar 2FA", "error");
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
      confirmButtonText: "Cambiar",
      cancelButtonText: "Cancelar"
    });

    if (newPassword) {
      try {
        await apiRequest(`/auth/change-password/${id}`, {
          method: "POST",
          body: JSON.stringify({ newPassword })
        });
        Swal.fire("Éxito", "Contraseña cambiada correctamente", "success");
      } catch (error) {
        Swal.fire("Error", "No se pudo cambiar la contraseña", "error");
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-4 border-indigo-600 border-solid"></div>
        <span className="ml-4 text-indigo-700 font-bold">Cargando usuarios...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-2">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-indigo-700 mb-8 drop-shadow">Gestión de Usuarios</h2>

        <div className="bg-white bg-opacity-90 rounded-2xl shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-indigo-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-indigo-700 uppercase tracking-wider">Nombre</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-indigo-700 uppercase tracking-wider">Usuario</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-indigo-700 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-indigo-700 uppercase tracking-wider">Rol</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-indigo-700 uppercase tracking-wider">2FA</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-indigo-700 uppercase tracking-wider">Estado</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-indigo-700 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {usuarios.map((usuario) => (
                  <tr key={usuario._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{usuario.nombre}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{usuario.usuario}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{usuario.email || "N/A"}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">{usuario.rol}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        usuario.twoFactorEnabled ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {usuario.twoFactorEnabled ? 'Habilitado' : 'Deshabilitado'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {usuario.bloqueadoHasta && usuario.bloqueadoHasta > new Date() ? (
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                          Bloqueado
                        </span>
                      ) : (
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                          Activo
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex flex-wrap gap-1">
                      {usuario.twoFactorEnabled ? (
                        <button
                          onClick={() => deshabilitar2FA(usuario._id)}
                          className="bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded text-xs flex items-center gap-1"
                        >
                          <ShieldExclamationIcon className="h-3 w-3" />
                          Deshab 2FA
                        </button>
                      ) : (
                        <button
                          onClick={() => habilitar2FA(usuario._id)}
                          className="bg-green-600 hover:bg-green-700 text-white px-2 py-1 rounded text-xs flex items-center gap-1"
                        >
                          <ShieldCheckIcon className="h-3 w-3" />
                          Hab 2FA
                        </button>
                      )}

                      {usuario.bloqueadoHasta && usuario.bloqueadoHasta > new Date() ? (
                        <button
                          onClick={() => desbloquearUsuario(usuario._id)}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded text-xs flex items-center gap-1"
                        >
                          <UserPlusIcon className="h-3 w-3" />
                          Desbloq
                        </button>
                      ) : (
                        <button
                          onClick={() => bloquearUsuario(usuario._id)}
                          className="bg-orange-600 hover:bg-orange-700 text-white px-2 py-1 rounded text-xs flex items-center gap-1"
                        >
                          <UserMinusIcon className="h-3 w-3" />
                          Bloq
                        </button>
                      )}
                      <button
                        onClick={() => cambiarContrasena(usuario._id)}
                        className="bg-purple-600 hover:bg-purple-700 text-white px-2 py-1 rounded text-xs flex items-center gap-1"
                      >
                        <KeyIcon className="h-3 w-3" />
                        Pass
                      </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {qrSetup && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-2xl shadow-xl max-w-md w-full mx-4">
              <h3 className="text-xl font-bold text-indigo-700 mb-4 text-center">Configuración de 2FA</h3>
              <p className="text-gray-600 mb-4 text-center">{qrSetup.instrucciones}</p>
              <div className="flex justify-center mb-4">
                <img src={qrSetup.qrCode} alt="QR Code para 2FA" className="border border-gray-300 rounded-lg shadow-sm" style={{maxWidth: "200px"}} />
              </div>
              <div className="bg-gray-50 p-3 rounded-lg mb-4">
                <p className="text-sm text-gray-700"><strong>Secreto:</strong></p>
                <p className="font-mono text-xs bg-white p-2 rounded border mt-1 break-all">{qrSetup.secret}</p>
              </div>
              <div className="text-center">
                <button
                  onClick={() => {setQrSetup(null); cargarUsuarios();}}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded-lg transition"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}