import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from "react-router-dom";


const ListaValoraciones = () => {
  const [valoraciones, setValoraciones] = useState([]);
  const [error, setError] = useState(null);
  const [busqueda, setBusqueda] = useState("");
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [cargando, setCargando] = useState(false);
  const navigate = useNavigate();

  const buscarValoraciones = async () => {
    setCargando(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (busqueda) params.append("documento", busqueda);
      if (fechaInicio) params.append("fechaInicio", fechaInicio);
      if (fechaFin) params.append("fechaFin", fechaFin);

      const res = await fetch(`https://hopeful-insight.railway.app//api/valoraciones?${params.toString()}`);
      if (!res.ok) throw new Error("Error al buscar valoraciones");
      const data = await res.json();
      setValoraciones(data);
    } catch (err) {
      setError('No se pudieron cargar las valoraciones.');
      setValoraciones([]);
    }
    setCargando(false);
  };

  // Cargar todas al inicio
  useEffect(() => {
    buscarValoraciones();
    // eslint-disable-next-line
  }, []);

  if (error) return <p className="text-red-500 text-center">{error}</p>;

  return (
    <div className="max-w-2xl mx-auto mt-10 bg-white p-8 rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold text-indigo-700 mb-6 text-center">Lista de Valoraciones</h2>
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6">
        <div className="flex flex-col md:flex-row gap-2 w-full">
          <input
            type="text"
            placeholder="Buscar por documento"
            value={busqueda}
            onChange={e => setBusqueda(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 w-full md:w-48"
          />
          <input
            type="date"
            value={fechaInicio}
            onChange={e => setFechaInicio(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 w-full md:w-40"
            placeholder="Desde"
          />
          <input
            type="date"
            value={fechaFin}
            onChange={e => setFechaFin(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 w-full md:w-40"
            placeholder="Hasta"
          />
          <button
            onClick={buscarValoraciones}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Buscar
          </button>
        </div>
        <button
          onClick={() => navigate("/valoracion")}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded shadow"
        >
          Nueva valoración
        </button>
      </div>
      {cargando ? (
        <p className="text-gray-500 text-center">Cargando...</p>
      ) : valoraciones.length === 0 ? (
        <p className="text-gray-500 text-center">No hay valoraciones registradas.</p>
      ) : (
        <div className="space-y-4">
          {valoraciones.map((valoracion) => (
            <div
              key={valoracion._id}
              className="border border-gray-200 rounded-lg p-5 flex flex-col md:flex-row md:items-center md:justify-between hover:shadow-md transition"
            >
              <div>
                <p className="font-semibold text-lg text-gray-800">
                  {valoracion.nombres}
                </p>
                <p className="text-gray-500 text-sm">
                  Documento: <span className="font-medium">{valoracion.registroCivil}</span>
                </p>
                <p className="text-gray-500 text-sm">
                  Fecha: <span className="font-medium">{valoracion.fecha}</span>
                </p>
              </div>
              <Link
                to={`/valoraciones/${valoracion._id}`}
                className="mt-3 md:mt-0 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition"
              >
                Ver detalle
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ListaValoraciones;
