import React, { useState } from "react";
import "./login.css";
import { apiRequest, API_ENDPOINTS, logAPIConfig } from '../config/api';

export default function Login({ onLogin }) {
  const [usuarioOEmail, setUsuarioOEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);
  const [exito, setExito] = useState(false);
  const [shake, setShake] = useState(false);

  // Log de configuración en desarrollo
  React.useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      logAPIConfig();
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setCargando(true);
    setShake(false);
    try {
      const data = await apiRequest(API_ENDPOINTS.LOGIN, {
        method: "POST",
        body: JSON.stringify({ email: usuarioOEmail, usuario: usuarioOEmail, password }),
      });
      
      sessionStorage.setItem("token", data.token);
      setExito(true);
      setTimeout(() => {
        setCargando(false);
        setExito(false);
        onLogin(data.nombre);
      }, 1200);
    } catch (err) {
      setCargando(false);
      setError(err.message);
      setShake(true);
      setTimeout(() => setShake(false), 600);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-pink-100 to-green-100">
      <form
        autoComplete="on"
        onSubmit={handleSubmit}
        className={`bg-white bg-opacity-90 p-10 rounded-3xl shadow-2xl flex flex-col gap-6 w-full max-w-sm border border-indigo-100 relative transition-all duration-300 ${shake ? "animate-shake" : ""}`}
        style={{ minHeight: 400 }}
      >
        <h2 className="text-3xl font-extrabold text-indigo-700 text-center mb-2 drop-shadow">Iniciar sesión</h2>
        <input
          name="username"
          className="border border-indigo-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-indigo-50 shadow-sm text-base"
          value={usuarioOEmail}
          onChange={e => setUsuarioOEmail(e.target.value)}
          placeholder="Usuario o correo"
          type="text"
          autoComplete="username"
          required
        />
        <input
          name="password"
          className="border border-indigo-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-indigo-50 shadow-sm text-base"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
           autoComplete="current-password"
          placeholder="Contraseña"
          required
        />
        <button
          type="submit"
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl transition flex items-center justify-center text-lg shadow"
          disabled={cargando || exito}
        >
          {cargando ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
              </svg>
              Entrando...
            </span>
          ) : exito ? (
            <span className="flex items-center gap-2">
              <svg className="h-6 w-6 text-green-500 animate-pop" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="#bbf7d0" />
                <path stroke="#22c55e" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" d="M8 12l2.5 2.5L16 9" />
              </svg>
              ¡Bienvenido!
            </span>
          ) : (
            "Ingresar"
          )}
        </button>
        {error && (
          <div className="flex flex-col items-center gap-2">
            <span className="text-red-600 text-center">{error}</span>
            <svg className="h-8 w-8 text-red-400 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="#fee2e2" />
              <path stroke="#ef4444" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01" />
            </svg>
          </div>
        )}
        {/* Animación de éxito flotante */}
        {exito && (
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-80 rounded-3xl z-10">
            <svg className="h-20 w-20 text-green-400 animate-pop" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="#bbf7d0" />
              <path stroke="#22c55e" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" d="M8 12l2.5 2.5L16 9" />
            </svg>
          </div>
        )}
        {/* Animación de error shake: ver CSS abajo */}
      </form>
      {/* Animaciones CSS */}
     
    </div>
  );
}