import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PlusCircleIcon } from "@heroicons/react/24/solid";

export default function CrearClase() {
  const [nombre, setNombre] = useState("");
  const [fecha, setFecha] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch("https://mi-backend-787730618984.us-central1.run.app/api/clases", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre, fecha, descripcion }),
    });
    const data = await res.json();
    navigate(`/clases/${data._id}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-pink-100 to-green-100 flex items-center justify-center py-10 px-2">
      <form onSubmit={handleSubmit} className="max-w-md w-full mx-auto p-8 bg-white rounded-3xl shadow-2xl border border-indigo-100">
        <h2 className="text-3xl font-extrabold mb-6 text-indigo-700 text-center drop-shadow">Crear nueva Sesión</h2>
        <div className="mb-4">
          <label className="block text-indigo-700 font-semibold mb-1">Nombre</label>
          <input
            className="border border-indigo-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-xl px-4 py-2 w-full outline-none transition bg-indigo-50 shadow-sm"
            placeholder="Nombre"
            value={nombre}
            onChange={e => setNombre(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-indigo-700 font-semibold mb-1">Fecha</label>
          <input
            className="border border-indigo-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-xl px-4 py-2 w-full outline-none transition bg-indigo-50 shadow-sm"
            type="date"
            value={fecha}
            onChange={e => setFecha(e.target.value)}
            required
          />
        </div>
        <div className="mb-6">
          <label className="block text-indigo-700 font-semibold mb-1">Descripción</label>
          <textarea
            className="border border-indigo-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-xl px-4 py-2 w-full outline-none transition bg-indigo-50 shadow-sm resize-none"
            placeholder="Descripción"
            value={descripcion}
            onChange={e => setDescripcion(e.target.value)}
            rows={4}
            required
          />
        </div>
        <button
          className="bg-green-500 hover:bg-green-600 text-white font-bold px-6 py-3 rounded-xl shadow transition w-full flex items-center justify-center gap-2 text-lg"
          type="submit"
        >
          <PlusCircleIcon className="h-6 w-6" /> Crear Sesión
        </button>
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mt-4 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold px-6 py-3 rounded-xl shadow transition w-full flex items-center justify-center gap-2 text-lg"
        >
          Volver
        </button>
      </form>
    </div>
  );
}