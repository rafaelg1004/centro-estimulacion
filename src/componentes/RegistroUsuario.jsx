import React, { useState } from "react";
import { apiRequest } from "../config/api";

export default function RegistroUsuario() {
  const [email, setEmail] = useState("");
  const [usuario, setUsuario] = useState("");
  const [nombre, setNombre] = useState("");
  const [password, setPassword] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setMensaje("");
    try {
      const data = await apiRequest("/auth/register", {
        method: "POST",
        body: JSON.stringify({ email, usuario, nombre, password }),
      });
      setMensaje(data.mensaje);
      setEmail(""); setUsuario(""); setNombre(""); setPassword("");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{maxWidth: 400, margin: "2rem auto", display: "flex", flexDirection: "column", gap: 10}}>
      <h2>Registrar usuario</h2>
      <input value={nombre} onChange={e => setNombre(e.target.value)} placeholder="Nombre" required />
      <input value={usuario} onChange={e => setUsuario(e.target.value)} placeholder="Usuario" required />
      <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Correo (opcional)" type="email" />
      <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Contraseña" required />
      <button type="submit">Registrar</button>
      {mensaje && <div style={{color: "green"}}>{mensaje}</div>}
      {error && <div style={{color: "red"}}>{error}</div>}
    </form>
  );
}