import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import Spinner from "./ui/Spinner"; // Ajusta la ruta si tu Spinner está en otro lugar

const ListaValoracionesIngresoAdultosLactancia = () => {
  const [valoraciones, setValoraciones] = useState(null);
  const [busqueda, setBusqueda] = useState("");
  const [cargando, setCargando] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [confirmarId, setConfirmarId] = useState(null);

  const buscarValoraciones = async (q = "") => {
    setCargando(true);
    try {
      let url = "https://mi-backend-787730618984.us-central1.run.app/api/valoracion-ingreso-adultos-lactancia";
      if (q.trim() !== "") {
        url += `/buscar?q=${encodeURIComponent(q)}`;
      }
      const res = await fetch(url);
      const data = await res.json();
      setValoraciones(Array.isArray(data) ? data : []);
    } catch {
      setValoraciones([]);
    }
    setCargando(false);
  };

  useEffect(() => {
    buscarValoraciones();
    // eslint-disable-next-line
  }, []);

  const handleInputChange = (e) => {
    setBusqueda(e.target.value);
    if (e.target.value.trim() === "") {
      buscarValoraciones("");
    }
  };

  const handleBuscar = (e) => {
    e.preventDefault();
    buscarValoraciones(busqueda);
  };

  const eliminarValoracion = async (id) => {
    try {
      const res = await fetch(`https://mi-backend-787730618984.us-central1.run.app/api/valoracion-ingreso-adultos-lactancia/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("No se pudo eliminar en el backend");
      setValoraciones(valoraciones.filter(v => v._id !== id));
      setMensaje("Valoración eliminada correctamente");
      setTimeout(() => setMensaje(""), 4000);
    } catch {
      setMensaje("No se pudo eliminar la valoración");
      setTimeout(() => setMensaje(""), 4000);
    }
  };

  const lista = Array.isArray(valoraciones) ? valoraciones : [];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-pink-100 to-green-100 py-10 px-2">
      <div className="max-w-4xl w-full bg-white bg-opacity-90 p-8 rounded-3xl shadow-2xl border border-indigo-100">
        {mensaje && (
          <div className="mb-4 flex items-center justify-between bg-green-100 border border-green-300 text-green-800 px-4 py-3 rounded shadow transition">
            <span>{mensaje}</span>
            <button
              onClick={() => setMensaje("")}
              className="ml-4 text-green-700 hover:text-green-900 font-bold"
              title="Cerrar"
            >
              ×
            </button>
          </div>
        )}
        <h2 className="text-3xl font-bold mb-6 text-indigo-700 text-center">Valoraciones Adultos Lactancia</h2>
        <form onSubmit={handleBuscar} className="mb-6 flex flex-col md:flex-row justify-center gap-2">
          <input
            type="text"
            placeholder="Buscar por nombre o cédula..."
            value={busqueda}
            onChange={handleInputChange}
            className="border border-indigo-200 rounded-xl px-3 py-2 w-full md:w-72 bg-indigo-50 focus:ring-2 focus:ring-indigo-400 transition"
          />
          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl font-semibold shadow transition"
          >
            Buscar
          </button>
        </form>
        <div className="overflow-x-auto rounded shadow">
          <table className="min-w-full text-base bg-white rounded-xl overflow-hidden">
            <thead>
              <tr className="bg-indigo-600 text-white">
                <th className="px-4 py-3 text-left">Nombre</th>
                <th className="px-4 py-3 text-left">Cédula</th>
                <th className="px-4 py-3 text-left">Fecha</th>
                <th className="px-4 py-3 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {cargando ? (
                <tr>
                  <td colSpan={4} className="px-4 py-6 text-center">
                    <Spinner />
                  </td>
                </tr>
              ) : lista.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-6 text-center text-gray-500">
                    No hay valoraciones registradas.
                  </td>
                </tr>
              ) : (
                lista.map((valoracion, idx) => (
                  <tr
                    key={valoracion._id}
                    className={idx % 2 === 0 ? "bg-indigo-50 hover:bg-indigo-100" : "bg-white hover:bg-indigo-50"}
                  >
                    <td className="px-4 py-2 border-b border-indigo-100 font-medium">
                      {valoracion.nombres || "Sin nombre"}
                    </td>
                    <td className="px-4 py-2 border-b border-indigo-100">
                      {valoracion.cedula || "-"}
                    </td>
                    <td className="px-4 py-2 border-b border-indigo-100">
                      {valoracion.fecha || "-"}
                    </td>
                    <td className="px-4 py-2 border-b border-indigo-100 text-center">
                      <Link
                        to={`/valoracion-ingreso-adultos-lactancia/${valoracion._id}`}
                        className="inline-block bg-green-500 hover:bg-green-600 text-white px-4 py-1 rounded-xl font-semibold shadow transition"
                      >
                        Ver detalle
                      </Link>
                      <button
                        onClick={() => setConfirmarId(valoracion._id)}
                        className="inline-block bg-pink-200 hover:bg-pink-300 text-pink-800 px-4 py-1 rounded-xl ml-2 font-semibold shadow transition"
                        title="Eliminar valoración"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {confirmarId && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-40">
            <div className="bg-white border border-pink-200 text-pink-800 px-6 py-4 rounded-2xl shadow-lg flex flex-col items-center gap-4 max-w-md w-full">
              <span className="font-bold">¿Seguro que deseas eliminar esta valoración?</span>
              <div className="flex gap-2">
                <button
                  onClick={async () => {
                    await eliminarValoracion(confirmarId);
                    setConfirmarId(null);
                  }}
                  className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-xl font-bold shadow transition"
                >
                  Sí, eliminar
                </button>
                <button
                  onClick={() => setConfirmarId(null)}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-xl font-bold shadow transition"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ListaValoracionesIngresoAdultosLactancia;