import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";

const ListaValoraciones = () => {
  const [valoraciones, setValoraciones] = useState([]);
  const [error, setError] = useState(null);
  const [busqueda, setBusqueda] = useState("");
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [cargando, setCargando] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [confirmarId, setConfirmarId] = useState(null);
 

  const buscarValoraciones = async () => {
    setCargando(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (busqueda) params.append("documento", busqueda);
      if (fechaInicio) params.append("fechaInicio", fechaInicio);
      if (fechaFin) params.append("fechaFin", fechaFin);

      //const res = await fetch(`https://centro-backend-production.up.railway.app/api/valoraciones?${params.toString()}`);
      //const res = await fetch(`http://localhost:4000/api/valoraciones?${params.toString()}`);      //local
      const res = await fetch(`/api/valoraciones?${params.toString()}`);
      if (!res.ok) throw new Error("Error al buscar valoraciones");
      const data = await res.json();
      setValoraciones(data);
    } catch (err) {
      setError('No se pudieron cargar las valoraciones.');
      setValoraciones([]);
    }
    setCargando(false);
  };

  const eliminarValoracion = async (id) => {
    try {
      console.log(`Eliminando valoración ${id}...`);
      const res = await fetch(`/api/valoraciones/${id}`, {
        method: "DELETE",
      });
      
      if (!res.ok) throw new Error("No se pudo eliminar en el backend");
      
      const resultado = await res.json();
      console.log('Resultado de eliminación:', resultado);
      
      setValoraciones(valoraciones.filter(v => v._id !== id));
      
      // Mostrar mensaje con información de imágenes eliminadas
      const mensajeCompleto = resultado.imagenesEliminadas > 0 
        ? `Valoración eliminada correctamente (${resultado.imagenesEliminadas} imágenes eliminadas de S3)`
        : "Valoración eliminada correctamente";
        
      setMensaje(mensajeCompleto);
      setTimeout(() => setMensaje(""), 6000);
    } catch (error) {
      console.error('Error eliminando valoración:', error);
      setMensaje("No se pudo eliminar la valoración");
      setTimeout(() => setMensaje(""), 4000);
    }
  };

  // Cargar todas al inicio
  useEffect(() => {
    buscarValoraciones();
    // eslint-disable-next-line
  }, []);

  if (error) return <p className="text-red-500 text-center">{error}</p>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-pink-100 to-green-100 py-10 px-2">
      <div className="max-w-2xl w-full bg-white bg-opacity-90 p-8 rounded-3xl shadow-2xl border border-indigo-100">
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
        <h2 className="text-2xl font-bold text-indigo-700 mb-6 text-center">Lista de Valoraciones</h2>
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6">
          <div className="flex flex-col md:flex-row gap-2 w-full">
            <input
              type="text"
              placeholder="Buscar por documento"
              value={busqueda}
              onChange={e => setBusqueda(e.target.value)}
              className="border border-indigo-200 rounded-xl px-3 py-2 w-full md:w-48 bg-indigo-50 focus:ring-2 focus:ring-indigo-400 transition"
            />
            <input
              type="date"
              value={fechaInicio}
              onChange={e => setFechaInicio(e.target.value)}
              className="border border-indigo-200 rounded-xl px-3 py-2 w-full md:w-40 bg-indigo-50 focus:ring-2 focus:ring-indigo-400 transition"
              placeholder="Desde"
            />
            <input
              type="date"
              value={fechaFin}
              onChange={e => setFechaFin(e.target.value)}
              className="border border-indigo-200 rounded-xl px-3 py-2 w-full md:w-40 bg-indigo-50 focus:ring-2 focus:ring-indigo-400 transition"
              placeholder="Hasta"
            />
            <button
              onClick={buscarValoraciones}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-xl shadow transition"
            >
              Buscar
            </button>
          </div>
        </div>
        {cargando ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-indigo-600 border-solid"></div>
            <span className="mt-4 text-indigo-700 font-bold">Cargando...</span>
          </div>
        ) : valoraciones.length === 0 ? (
          <p className="text-gray-500 text-center">No hay valoraciones registradas.</p>
        ) : (
          <div className="space-y-4">
            {valoraciones
              .slice()
              .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
              .map((valoracion) => (
                <div
                  key={valoracion._id}
                  className="border border-indigo-200 rounded-2xl p-5 flex flex-col md:flex-row md:items-center md:justify-between hover:shadow-xl transition bg-indigo-50"
                >
                  <div>
                    <p className="text-indigo-500 text-sm">
                      Documento:{" "}
                      <span className="font-medium">
                        {valoracion.paciente?.registroCivil || valoracion.registroCivil || "-"}
                      </span>
                    </p>
                    <p className="font-semibold text-lg text-indigo-800">
                      {valoracion.paciente?.nombres || valoracion.nombres || "Sin nombre"}
                    </p>
                    <p className="text-indigo-500 text-sm">
                      Mamá: <span className="font-medium">
                        {valoracion.paciente?.nombreMadre || valoracion.madreNombre || "-"}
                      </span>
                    </p>
                    <p className="text-indigo-500 text-sm">
                      Fecha: <span className="font-medium">{valoracion.fecha}</span>
                    </p>
                  </div>
                  <div className="flex gap-2 mt-3 md:mt-0">
                    <Link
                      to={`/valoraciones/${valoracion._id}`}
                      className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-xl shadow transition"
                    >
                      Ver detalle
                    </Link>
                    <button
                      onClick={() => setConfirmarId(valoracion._id)}
                      className="bg-pink-200 hover:bg-pink-300 text-pink-800 font-bold py-2 px-4 rounded-xl shadow transition"
                      title="Eliminar valoración"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              ))}
          </div>
        )}
        {confirmarId && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-40">
            <div className="bg-white border border-pink-200 text-pink-800 px-6 py-6 rounded-2xl shadow-lg flex flex-col items-center gap-4 max-w-md w-full">
              <div className="text-center">
                <h3 className="font-bold text-lg mb-2">¿Seguro que deseas eliminar esta valoración?</h3>
                <p className="text-sm text-gray-600">
                  Esta acción eliminará permanentemente la valoración y todas las imágenes asociadas de S3.
                  <br />
                  <strong>Esta acción no se puede deshacer.</strong>
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={async () => {
                    await eliminarValoracion(confirmarId);
                    setConfirmarId(null);
                  }}
                  className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-xl font-bold shadow transition"
                >
                  Sí, eliminar todo
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

export default ListaValoraciones;
