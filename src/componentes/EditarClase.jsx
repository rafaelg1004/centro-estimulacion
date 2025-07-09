import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { PencilSquareIcon } from "@heroicons/react/24/solid";
import Swal from "sweetalert2";
import { apiRequest } from "../config/api";

export default function EditarClase() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [nombre, setNombre] = useState("");
  const [fecha, setFecha] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    apiRequest(`/clases/${id}`)
      .then(data => {
        setNombre(data.nombre || "");
        setFecha(data.fecha || "");
        setDescripcion(data.descripcion || "");
        setCargando(false);
      });
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await Swal.fire({
      title: "¿Deseas guardar los cambios?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sí, guardar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#facc15", // amarillo pastel
      cancelButtonColor: "#d1d5db", // gris pastel
    });
    if (!result.isConfirmed) return;
    await apiRequest(`/clases/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre, fecha, descripcion }),
    });
    navigate(`/clases/${id}`);
  };

  if (cargando) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-indigo-600 border-solid"></div>
        <span className="mt-6 text-indigo-700 font-bold text-lg">Cargando datos...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-pink-100 to-green-100 flex items-center justify-center py-10 px-2">
      <form onSubmit={handleSubmit} className="max-w-md w-full mx-auto p-8 bg-white rounded-3xl shadow-2xl border border-indigo-100">
        <h2 className="text-3xl font-extrabold mb-6 text-indigo-700 text-center drop-shadow flex items-center justify-center gap-2">
          <PencilSquareIcon className="h-8 w-8 text-yellow-500" />
          Editar Sesión
        </h2>
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
          className="bg-yellow-400 hover:bg-yellow-500 text-white font-bold px-6 py-3 rounded-xl shadow transition w-full flex items-center justify-center gap-2 text-lg"
          type="submit"
        >
          <PencilSquareIcon className="h-6 w-6" /> Guardar Cambios
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