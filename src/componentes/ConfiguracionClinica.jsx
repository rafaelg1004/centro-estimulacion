import React, { useState, useEffect } from "react";
import { apiRequest } from "../config/api";
import Swal from "sweetalert2";
import {
  BuildingOfficeIcon,
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  IdentificationIcon,
  PhotoIcon,
  DocumentCheckIcon,
} from "@heroicons/react/24/outline";

export default function ConfiguracionClinica() {
  const [config, setConfig] = useState({
    nombre_clinica: "",
    slogan: "",
    nit: "",
    direccion: "",
    telefono: "",
    email: "",
    logo_url: "",
    codigo_habilitacion: "",
    representante_legal: "",
    registro_profesional_representante: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarConfiguracion();
  }, []);

  const cargarConfiguracion = async () => {
    try {
      const data = await apiRequest("/configuracion");
      setConfig(data);
    } catch (error) {
      console.error("Error al cargar la configuración:", error);
      Swal.fire("Error", "No se pudo cargar la configuración de la clínica.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setConfig({ ...config, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await apiRequest("/configuracion", {
        method: "PUT",
        body: JSON.stringify(config),
      });
      Swal.fire({
        title: "¡Guardado!",
        text: "La configuración de la clínica ha sido actualizada correctamente.",
        icon: "success",
        confirmButtonColor: "#4F46E5",
      });
    } catch (error) {
      console.error("Error al guardar la configuración:", error);
      Swal.fire("Error", "Ocurrió un error al intentar guardar los datos.", "error");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-5xl mx-auto bg-gray-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-indigo-900 tracking-tight flex items-center gap-3">
          <BuildingOfficeIcon className="h-8 w-8 text-pink-600" />
          Configuración de la Clínica
        </h1>
        <p className="text-gray-500 mt-2">
          Administra los datos institucionales que aparecerán en los reportes e historias clínicas PDF.
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-xl border border-indigo-50 overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-600 to-pink-500 px-6 py-4">
          <h2 className="text-white font-bold text-lg flex items-center gap-2">
            <DocumentCheckIcon className="h-5 w-5" />
            Información Oficial y de Habilitación
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 md:p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Institucional */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Nombre de la Clínica</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <BuildingOfficeIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="nombre_clinica"
                    value={config.nombre_clinica || ""}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:ring-indigo-500 focus:border-indigo-500 shadow-sm transition"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Slogan</label>
                <input
                  type="text"
                  name="slogan"
                  value={config.slogan || ""}
                  onChange={handleChange}
                  className="block w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-indigo-500 focus:border-indigo-500 shadow-sm transition"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">NIT</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <IdentificationIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="nit"
                    value={config.nit || ""}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:ring-indigo-500 focus:border-indigo-500 shadow-sm transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">URL del Logo (Link de la imagen)</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <PhotoIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="url"
                    name="logo_url"
                    value={config.logo_url || ""}
                    onChange={handleChange}
                    placeholder="https://ejemplo.com/logo.png"
                    className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:ring-indigo-500 focus:border-indigo-500 shadow-sm transition"
                  />
                </div>
                {config.logo_url && (
                  <div className="mt-4 p-4 border rounded-xl bg-gray-50 flex justify-center">
                    <img src={config.logo_url} alt="Logo Previsto" className="max-h-24 object-contain" onError={(e) => e.target.style.display = 'none'} />
                  </div>
                )}
              </div>
            </div>

            {/* Contacto y Legal */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Código Habilitación (MinSalud)</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <DocumentCheckIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="codigo_habilitacion"
                    value={config.codigo_habilitacion || ""}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:ring-indigo-500 focus:border-indigo-500 shadow-sm transition font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Dirección Principal</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MapPinIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="direccion"
                    value={config.direccion || ""}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:ring-indigo-500 focus:border-indigo-500 shadow-sm transition"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Teléfono</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <PhoneIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="telefono"
                      value={config.telefono || ""}
                      onChange={handleChange}
                      className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:ring-indigo-500 focus:border-indigo-500 shadow-sm transition"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="email"
                      name="email"
                      value={config.email || ""}
                      onChange={handleChange}
                      className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:ring-indigo-500 focus:border-indigo-500 shadow-sm transition"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-gray-100">
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-4">Representante Legal</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">Nombre Completo</label>
                    <input
                      type="text"
                      name="representante_legal"
                      value={config.representante_legal || ""}
                      onChange={handleChange}
                      className="block w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">Registro Profesional / Médico</label>
                    <input
                      type="text"
                      name="registro_profesional_representante"
                      value={config.registro_profesional_representante || ""}
                      onChange={handleChange}
                      className="block w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-10 flex justify-end">
            <button
              type="submit"
              className="bg-gradient-to-r from-indigo-600 to-indigo-800 hover:from-indigo-700 hover:to-indigo-900 text-white font-bold py-3 px-8 rounded-xl shadow-lg transition-all transform hover:-translate-y-1 focus:ring-4 focus:ring-indigo-300"
            >
              Guardar Configuración
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
