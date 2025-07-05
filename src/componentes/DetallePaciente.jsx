import { useParams, useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { ClipboardDocumentListIcon, ArrowLeftIcon, PencilSquareIcon, CreditCardIcon, TrashIcon } from "@heroicons/react/24/solid";

export default function DetallePaciente() {
  const { id } = useParams();
  const [paciente, setPaciente] = useState(null);
  const [error, setError] = useState("");
  const [paquetes, setPaquetes] = useState([]);
  const [clases, setClases] = useState([]);
  const [pagina, setPagina] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`http://18.216.20.125:4000/api/pacientes/${id}`)
      .then(res => res.json())
      .then(data => setPaciente(data))
      .catch(() => setError("No se pudo cargar el paciente"));

    fetch(`http://18.216.20.125:4000/api/pagoPaquete/por-nino/${id}`)
      .then(res => res.json())
      .then(setPaquetes);

    fetch(`http://18.216.20.125:4000/api/clases/paciente/${id}`)
      .then(res => res.json())
      .then(setClases);
  }, [id]);

  const eliminarFactura = async (facturaId) => {
    if (window.confirm("¿Seguro que deseas eliminar esta factura?")) {
      await fetch(`http://18.216.20.125:4000/api/pagoPaquete/${facturaId}`, {
        method: "DELETE",
      });
      setPaquetes(paquetes.filter(p => p._id !== facturaId));
    }
  };

  if (error) return <div className="p-8 text-red-600">{error}</div>;
  if (!paciente) return (
    <div className="flex flex-col items-center justify-center min-h-[300px] bg-gradient-to-br from-indigo-100 via-pink-100 to-green-100">
      <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-indigo-600 border-solid"></div>
      <span className="mt-4 text-indigo-700 font-bold">Cargando...</span>
    </div>
  );

  // Paginación de clases
  const clasesPorPagina = 5;
  const totalPaginas = Math.ceil(clases.length / clasesPorPagina);
  const inicio = pagina * clasesPorPagina;
  const clasesAMostrar = clases.slice(inicio, inicio + clasesPorPagina);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-pink-100 to-green-100 py-10 px-2">
      <div className="p-8 max-w-2xl w-full mx-auto bg-white rounded-3xl shadow-2xl border border-indigo-100">
        <h2 className="text-3xl font-extrabold mb-8 text-indigo-700 text-center tracking-tight drop-shadow">
          Detalle del Paciente
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-indigo-50 rounded-2xl p-4 shadow-sm">
            <h3 className="font-semibold text-indigo-600 mb-2">Datos Generales</h3>
            <div className="mb-1"><span className="font-bold">Nombres:</span> {paciente.nombres}</div>
            <div className="mb-1"><span className="font-bold">Registro Civil:</span> {paciente.registroCivil}</div>
            <div className="mb-1"><span className="font-bold">Género:</span> {paciente.genero}</div>
            <div className="mb-1"><span className="font-bold">Lugar de Nacimiento:</span> {paciente.lugarNacimiento}</div>
            <div className="mb-1"><span className="font-bold">Fecha de Nacimiento:</span> {paciente.fechaNacimiento}</div>
            <div className="mb-1"><span className="font-bold">Edad:</span> {paciente.edad} {paciente.edad ? "meses" : ""}</div>
            <div className="mb-1">
              <span className="font-bold">Peso:</span> {paciente.peso} <span className="text-gray-500 text-xs">kg</span>
            </div>
            <div className="mb-1">
              <span className="font-bold">Talla:</span> {paciente.talla} <span className="text-gray-500 text-xs">cm</span>
            </div>
          </div>
          <div className="bg-indigo-50 rounded-2xl p-4 shadow-sm">
            <h3 className="font-semibold text-indigo-600 mb-2">Contacto y Salud</h3>
            <div className="mb-1"><span className="font-bold">Dirección:</span> {paciente.direccion}</div>
            <div className="mb-1"><span className="font-bold">Teléfono:</span> {paciente.telefono}</div>
            <div className="mb-1"><span className="font-bold">Celular:</span> {paciente.celular}</div>
            <div className="mb-1"><span className="font-bold">Pediatra:</span> {paciente.pediatra}</div>
            <div className="mb-1"><span className="font-bold">Aseguradora:</span> {paciente.aseguradora}</div>
          </div>
          <div className="bg-indigo-50 rounded-2xl p-4 shadow-sm md:col-span-2">
            <h3 className="font-semibold text-indigo-600 mb-2">Datos Familiares</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="mb-1"><span className="font-bold">Nombre Madre:</span> {paciente.nombreMadre}</div>
                <div className="mb-1"><span className="font-bold">Edad Madre:</span> {paciente.edadMadre}</div>
                <div className="mb-1"><span className="font-bold">Ocupación Madre:</span> {paciente.ocupacionMadre}</div>
              </div>
              <div>
                <div className="mb-1"><span className="font-bold">Nombre Padre:</span> {paciente.nombrePadre}</div>
                <div className="mb-1"><span className="font-bold">Edad Padre:</span> {paciente.edadPadre}</div>
                <div className="mb-1"><span className="font-bold">Ocupación Padre:</span> {paciente.ocupacionPadre}</div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col md:flex-row justify-center gap-4 mb-8">
          <button
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-xl shadow transition flex items-center gap-2 text-lg"
            onClick={() => navigate(`/valoracion?paciente=${paciente._id}`)}
          >
            <ClipboardDocumentListIcon className="h-6 w-6" />
            Nueva Valoración
          </button>
          <button
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-3 px-6 rounded-xl shadow transition flex items-center gap-2 text-lg"
            onClick={() => navigate("/pacientes")}
          >
            <ArrowLeftIcon className="h-6 w-6" />
            Volver a la lista
          </button>
          <Link
            to={`/paquetes/nuevo/${paciente._id}`}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-xl shadow transition flex items-center gap-2 text-lg"
          >
            <CreditCardIcon className="h-6 w-6" />
            Comprar paquete 
          </Link>
          <button
            className="bg-yellow-400 hover:bg-yellow-500 text-white font-bold py-3 px-6 rounded-xl shadow transition flex items-center gap-2 text-lg"
            onClick={() => navigate(`/pacientes/editar/${paciente._id}`)}
          >
            <PencilSquareIcon className="h-6 w-6" />
            Editar Paciente
          </button>
        </div>

        {/* Mostrar paquetes del paciente */}
        <div className="mt-8">
          <h3 className="font-semibold text-indigo-700 mb-2">Paquetes comprados</h3>
          {paquetes.length === 0 ? (
            <div className="text-gray-500">No hay paquetes registrados.</div>
          ) : (
            <ul className="mb-2">
              {paquetes.map(p => (
                <li key={p._id} className="border-b py-2 flex flex-col md:flex-row md:justify-between items-start md:items-center gap-2">
                  <span>
                    <b>Factura:</b> {p.numeroFactura} | <b>Clases usadas:</b> {p.clasesUsadas} / {p.clasesPagadas} | <b>Le quedan:</b> {p.clasesPagadas - p.clasesUsadas}
                  </span>
                  <span className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">{p.fechaPago?.slice(0,10)}</span>
                    <button
                      onClick={() => eliminarFactura(p._id)}
                      className="bg-red-500 hover:bg-red-700 text-white text-xs px-2 py-1 rounded font-bold flex items-center gap-1"
                      title="Eliminar factura"
                    >
                      <TrashIcon className="h-4 w-4" />
                      Eliminar
                    </button>
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Sección de clases del paciente paginada */}
        <div className="mt-8">
          <h3 className="font-semibold text-indigo-700 mb-2">Clases inscritas</h3>
          {clases.length === 0 ? (
            <div className="text-gray-500">No está inscrito en ninguna clase.</div>
          ) : (
            <>
              <ul className="mb-2">
                {clasesAMostrar.map(clase => (
                  <li key={clase._id} className="border-b py-2 flex flex-col md:flex-row md:justify-between">
                    <span>
                      <b>{clase.nombre}</b> | {clase.fecha} | {clase.descripcion}
                    </span>
                  </li>
                ))}
              </ul>
              <div className="flex justify-center items-center gap-4 mt-2">
                <button
                  className="px-3 py-1 rounded bg-indigo-100 text-indigo-700 font-bold disabled:opacity-50"
                  onClick={() => setPagina(pagina - 1)}
                  disabled={pagina === 0}
                  title="Anterior"
                >
                  &#8592;
                </button>
                <span className="text-sm text-gray-600">
                  Página {pagina + 1} de {totalPaginas}
                </span>
                <button
                  className="px-3 py-1 rounded bg-indigo-100 text-indigo-700 font-bold disabled:opacity-50"
                  onClick={() => setPagina(pagina + 1)}
                  disabled={pagina >= totalPaginas - 1}
                  title="Siguiente"
                >
                  &#8594;
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}