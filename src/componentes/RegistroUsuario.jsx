import React, { useState } from "react";
import { apiRequest } from "../config/api";

export default function RegistroUsuario() {
  const [email, setEmail] = useState("");
  const [usuario, setUsuario] = useState("");
  const [nombre, setNombre] = useState("");
  const [password, setPassword] = useState("");
  const [rol, setRol] = useState("auxiliar");
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const [twoFactorSetup, setTwoFactorSetup] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setMensaje(""); setTwoFactorSetup(null);
    try {
      const data = await apiRequest("/auth/register", {
        method: "POST",
        body: JSON.stringify({ email, usuario, nombre, password, rol }),
      });
      setMensaje(data.mensaje);
      if (data.twoFactorSetup) {
        setTwoFactorSetup(data.twoFactorSetup);
      } else {
        setEmail(""); setUsuario(""); setNombre(""); setPassword(""); setRol("auxiliar");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-pink-100 to-green-100 py-10 px-2">
      <form onSubmit={handleSubmit} className="max-w-md w-full mx-auto bg-white bg-opacity-90 p-8 rounded-3xl shadow-2xl border border-indigo-100">
        <h2 className="text-2xl font-bold text-center text-indigo-700 mb-6 drop-shadow">Registrar Usuario</h2>
        <div className="space-y-4">
          <input
            value={nombre}
            onChange={e => setNombre(e.target.value)}
            placeholder="Nombre"
            required
            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <input
            value={usuario}
            onChange={e => setUsuario(e.target.value)}
            placeholder="Usuario"
            required
            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <input
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Correo (opcional)"
            type="email"
            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Contraseña"
            required
            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <select
            value={rol}
            onChange={e => setRol(e.target.value)}
            required
            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="fisioterapeuta">Fisioterapeuta</option>
            <option value="auxiliar">Auxiliar</option>
            <option value="administracion">Administración</option>
          </select>
        </div>
        <button
          type="submit"
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg transition mt-6"
        >
          Registrar
        </button>
        {mensaje && <div className="mt-4 p-3 bg-green-100 text-green-700 rounded-lg text-center">{mensaje}</div>}
        {error && <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-lg text-center">{error}</div>}
      {twoFactorSetup && (
        <div className="mt-8 p-6 bg-white bg-opacity-90 rounded-2xl shadow-xl border border-indigo-200 max-w-md mx-auto">
          <h3 className="text-xl font-bold text-indigo-700 mb-4 text-center">Configuración de Autenticación de Dos Factores</h3>
          <p className="text-gray-600 mb-4 text-center">{twoFactorSetup.instrucciones}</p>
          <div className="flex justify-center mb-4">
            <img src={twoFactorSetup.qrCode} alt="QR Code para 2FA" className="border border-gray-300 rounded-lg shadow-sm" style={{maxWidth: "200px"}} />
          </div>
          <div className="bg-gray-50 p-3 rounded-lg mb-4">
            <p className="text-sm text-gray-700"><strong>Secreto (guárdalo en un lugar seguro):</strong></p>
            <p className="font-mono text-xs bg-white p-2 rounded border mt-1 break-all">{twoFactorSetup.secret}</p>
          </div>
          <div className="text-center">
            <button
              onClick={() => {setTwoFactorSetup(null); setEmail(""); setUsuario(""); setNombre(""); setPassword(""); setRol("auxiliar");}}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded-lg transition"
            >
              Cerrar y Limpiar Formulario
            </button>
          </div>
        </div>
      )}
    </form>
    </div>
  );
}