import { useParams, useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { ClipboardDocumentListIcon, ArrowLeftIcon, PencilSquareIcon, CreditCardIcon, TrashIcon } from "@heroicons/react/24/solid";
import { apiRequest } from "../config/api";
import Swal from 'sweetalert2';

export default function DetallePaciente() {
  const { id } = useParams();
  const [paciente, setPaciente] = useState(null);
  const [error, setError] = useState("");
  const [paquetes, setPaquetes] = useState([]);
  const [clases, setClases] = useState([]);
  const [pagina, setPagina] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    apiRequest(`/pacientes/${id}`)
      .then(data => setPaciente(data))
      .catch(() => setError("No se pudo cargar el paciente"));

    apiRequest(`/pagoPaquete/por-nino/${id}`)
      .then(setPaquetes);

    apiRequest(`/clases/paciente/${id}`)
      .then(setClases);
  }, [id]);

  const eliminarFactura = async (paquete) => {
    const result = await Swal.fire({
      title: '¿Eliminar paquete?',
      text: `¿Estás seguro de eliminar el paquete ${paquete.numeroFactura}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      try {
        await apiRequest(`/pagoPaquete/${paquete._id}`, { method: 'DELETE' });
        
        Swal.fire({
          title: '¡Eliminado!',
          text: 'El paquete ha sido eliminado correctamente.',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false
        });
        
        setPaquetes(paquetes.filter(p => p._id !== paquete._id));
      } catch (error) {
        console.error('Error al eliminar paquete:', error);
        
        // Intentar parsear el mensaje de error del backend
        let errorMessage = 'No se pudo eliminar el paquete. Inténtalo de nuevo.';
        let errorData = null;
        
        // Verificar diferentes formatos de error
        if (error.response && error.response.data) {
          errorData = error.response.data;
        } else if (error.message && error.message.includes('{')) {
          try {
            errorData = JSON.parse(error.message.substring(error.message.indexOf('{')));
          } catch (e) {
            // Si no se puede parsear, usar el mensaje original
          }
        }
        
        if (errorData && errorData.clasesAfectadas) {
          Swal.fire({
            title: 'No se puede eliminar',
            html: `
              <div style="text-align: left;">
                <p><strong>Motivo:</strong> Esta factura está siendo usada en ${errorData.clasesAfectadas} sesión(es):</p>
                <ul style="margin: 10px 0; padding-left: 20px;">
                  ${errorData.nombresClases.split(', ').map(clase => `<li>${clase}</li>`).join('')}
                </ul>
                <p><strong>Qué hacer:</strong></p>
                <ol style="margin: 10px 0; padding-left: 20px;">
                  <li>Ve a la sección "Lista de Sesiones"</li>
                  <li>Busca cada sesión mencionada arriba</li>
                  <li>Elimina al paciente de la lista de inscritos</li>
                  <li>Luego podrás eliminar esta factura</li>
                </ol>
              </div>
            `,
            icon: 'warning',
            confirmButtonText: 'Entendido',
            width: '500px'
          });
        } else if (errorData && errorData.mensaje) {
          Swal.fire({
            title: 'No se puede eliminar',
            text: errorData.mensaje,
            icon: 'error',
            confirmButtonText: 'Entendido'
          });
        } else if (error.message && error.message.includes('siendo usada en sesiones')) {
          Swal.fire({
            title: 'No se puede eliminar',
            text: 'Esta factura está siendo usada en clases activas. Primero debe eliminar al paciente de las sesiones donde está inscrito.',
            icon: 'error',
            confirmButtonText: 'Entendido'
          });
        } else {
          Swal.fire({
            title: 'Error',
            text: errorMessage,
            icon: 'error',
            confirmButtonText: 'Cerrar'
          });
        }
      }
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
        {/* Botones de acciones organizados en grupos */}
        <div className="space-y-4 mb-8">
          {/* Grupo 1: Acciones principales de valoraciones */}
          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <button
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-xl shadow transition flex items-center justify-center gap-2 text-base"
              onClick={async () => {
                try {
                  // Verificar si ya existe una valoración para este paciente
                  const response = await apiRequest(`/valoraciones/verificar/${paciente._id}`);
                  
                  if (response.tieneValoracion) {
                    // Si ya tiene valoración, mostrar modal de confirmación
                    const result = await Swal.fire({
                      title: 'Valoración Existente',
                      html: `
                        <div class="text-center">
                          <div class="text-6xl mb-4">⚠️</div>
                          <p class="text-lg mb-4">Este paciente ya tiene una valoración de ingreso registrada.</p>
                          <p class="text-gray-600 mb-4">Fecha: <strong>${response.valoracion.fecha || 'No especificada'}</strong></p>
                          <p class="text-gray-600 mb-4">Motivo: <strong>${response.valoracion.motivoDeConsulta || 'No especificado'}</strong></p>
                          <p class="text-sm text-gray-500">¿Qué deseas hacer?</p>
                        </div>
                      `,
                      icon: 'warning',
                      showCancelButton: true,
                      confirmButtonColor: '#3085d6',
                      cancelButtonColor: '#6c757d',
                                             confirmButtonText: 'Ver/Editar Valoración',
                       cancelButtonText: 'Cancelar',
                      reverseButtons: true
                    });

                                         if (result.isConfirmed) {
                       // Ir a ver/editar la valoración existente
                       navigate(`/valoraciones/${response.valoracion.id}`);
                     }
                     // Si se cancela, no hacer nada (mantener en la página actual)
                  } else {
                    // No tiene valoración, proceder normalmente
                    navigate(`/valoracion?paciente=${paciente._id}`);
                  }
                } catch (error) {
                  console.error('Error al verificar valoración:', error);
                  // En caso de error, permitir continuar
                  navigate(`/valoracion?paciente=${paciente._id}`);
                }
              }}
            >
              <ClipboardDocumentListIcon className="h-5 w-5" />
              Nueva Valoración
            </button>
            <button
              className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-xl shadow transition flex items-center justify-center gap-2 text-base"
              onClick={async () => {
                try {
                  // Verificar si existe una valoración para este paciente
                  const response = await apiRequest(`/valoraciones/verificar/${paciente._id}`);
                  
                  if (response.tieneValoracion) {
                    // Si tiene valoración, ir directamente al detalle
                    navigate(`/valoraciones/${response.valoracion.id}`);
                  } else {
                    // Si no tiene valoración, mostrar mensaje
                    Swal.fire({
                      title: 'Sin Valoración',
                      text: 'Este paciente aún no tiene una valoración registrada.',
                      icon: 'info',
                      confirmButtonText: 'Entendido'
                    });
                  }
                } catch (error) {
                  console.error('Error al verificar valoración:', error);
                  Swal.fire({
                    title: 'Error',
                    text: 'No se pudo verificar la valoración del paciente.',
                    icon: 'error',
                    confirmButtonText: 'Cerrar'
                  });
                }
              }}
            >
              <ClipboardDocumentListIcon className="h-5 w-5" />
              Ver Valoración
            </button>
          </div>
          
          {/* Grupo 2: Gestión del paciente */}
          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <button
              className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 px-6 rounded-xl shadow transition flex items-center justify-center gap-2 text-base"
              onClick={() => navigate(`/pacientes/editar/${paciente._id}`)}
            >
              <PencilSquareIcon className="h-5 w-5" />
              Editar Paciente
            </button>
            <Link
              to={`/paquetes/nuevo/${paciente._id}`}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-xl shadow transition flex items-center justify-center gap-2 text-base"
            >
              <CreditCardIcon className="h-5 w-5" />
              Comprar Paquete
            </Link>
          </div>
          
          {/* Grupo 3: Navegación */}
          <div className="flex justify-center">
            <button
              className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-xl shadow transition flex items-center justify-center gap-2 text-base"
              onClick={() => navigate("/pacientes")}
            >
              <ArrowLeftIcon className="h-5 w-5" />
              Volver a la Lista
            </button>
          </div>
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
                      onClick={async () => {
                        const result = await Swal.fire({
                          title: 'Editar Paquete',
                          text: `¿Deseas editar el paquete ${p.numeroFactura}?`,
                          icon: 'question',
                          showCancelButton: true,
                          confirmButtonColor: '#3085d6',
                          cancelButtonColor: '#6c757d',
                          confirmButtonText: 'Sí, editar',
                          cancelButtonText: 'Cancelar'
                        });
                        if (result.isConfirmed) {
                          navigate(`/paquetes/editar/${p._id}`);
                        }
                      }}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white text-xs px-2 py-1 rounded font-bold flex items-center gap-1"
                      title="Editar factura"
                    >
                      <PencilSquareIcon className="h-4 w-4" />
                      Editar
                    </button>
                    <button
                      onClick={() => eliminarFactura(p)}
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