import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { ClipboardDocumentListIcon, PencilSquareIcon, ArrowLeftIcon, CalendarDaysIcon, EyeIcon } from "@heroicons/react/24/solid";
import { HeartIcon } from "@heroicons/react/24/solid"; // Para el botón de piso pélvico
import { apiRequest } from "../config/api";

export default function DetallePacienteAdulto() {
  const { id } = useParams();
  const [paciente, setPaciente] = useState(null);
  const [valoraciones, setValoraciones] = useState([]);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showExistingModal, setShowExistingModal] = useState(false);
  const [existingValoracion, setExistingValoracion] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Cargar datos del paciente
    apiRequest(`/pacientes-adultos/${id}`)
      .then(data => setPaciente(data))
      .catch(() => setError("No se pudo cargar el paciente"));
    
    // Cargar valoraciones del paciente adulto
    console.log('=== CARGANDO VALORACIONES FRONTEND ===');
    console.log('Paciente adulto ID:', id);
    console.log('URL de la petición:', `/valoraciones/adulto/${id}`);
    
    apiRequest(`/valoraciones/adulto/${id}`)
      .then(data => {
        console.log('=== RESPUESTA DEL BACKEND ===');
        console.log('Datos recibidos:', data);
        console.log('Tipo de datos:', typeof data);
        console.log('Es array:', Array.isArray(data));
        console.log('Número de valoraciones:', data?.length || 0);
        
        if (data && data.length > 0) {
          console.log('Primera valoración:', data[0]);
        }
        
        setValoraciones(data || []);
      })
      .catch(err => {
        console.error('=== ERROR CARGANDO VALORACIONES ===');
        console.error('Error completo:', err);
        console.error('Mensaje:', err.message);
        setValoraciones([]);
      });
  }, [id]);

  
  if (error) return <div className="p-8 text-red-600">{error}</div>;
  if (!paciente) return (
    <div className="flex flex-col items-center justify-center min-h-[300px] bg-gradient-to-br from-indigo-100 via-pink-100 to-green-100">
      <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-indigo-600 border-solid"></div>
      <span className="mt-4 text-indigo-700 font-bold">Cargando...</span>
    </div>
  );

  return (
    <div>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-pink-100 to-green-100 py-10 px-2">
        <div className="p-8 max-w-2xl w-full mx-auto bg-white rounded-3xl shadow-2xl border border-indigo-100">
          <h2 className="text-3xl font-extrabold mb-8 text-indigo-700 text-center tracking-tight drop-shadow">
            Detalle del Paciente Adulto
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-indigo-50 rounded-2xl p-4 shadow-sm">
              <h3 className="font-semibold text-indigo-600 mb-2">Datos Generales</h3>
              <div className="mb-1"><span className="font-bold">Nombres:</span> {paciente.nombres}</div>
              <div className="mb-1"><span className="font-bold">Cédula:</span> {paciente.cedula}</div>
              <div className="mb-1"><span className="font-bold">Género:</span> {paciente.genero}</div>
              <div className="mb-1"><span className="font-bold">Lugar de Nacimiento:</span> {paciente.lugarNacimiento}</div>
              <div className="mb-1"><span className="font-bold">Fecha de Nacimiento:</span> {paciente.fechaNacimiento}</div>
              <div className="mb-1"><span className="font-bold">Edad:</span> {paciente.edad}</div>
              <div className="mb-1"><span className="font-bold">Estado Civil:</span> {paciente.estadoCivil}</div>
            </div>
            <div className="bg-indigo-50 rounded-2xl p-4 shadow-sm">
              <h3 className="font-semibold text-indigo-600 mb-2">Contacto y Salud</h3>
              <div className="mb-1"><span className="font-bold">Dirección:</span> {paciente.direccion}</div>
              <div className="mb-1"><span className="font-bold">Teléfono:</span> {paciente.telefono}</div>
              <div className="mb-1"><span className="font-bold">Celular:</span> {paciente.celular}</div>
              <div className="mb-1"><span className="font-bold">Ocupación:</span> {paciente.ocupacion}</div>
              <div className="mb-1"><span className="font-bold">Nivel Educativo:</span> {paciente.nivelEducativo}</div>
              <div className="mb-1"><span className="font-bold">Médico Tratante:</span> {paciente.medicoTratante}</div>
              <div className="mb-1"><span className="font-bold">Aseguradora:</span> {paciente.aseguradora}</div>
            </div>
            <div className="bg-indigo-50 rounded-2xl p-4 shadow-sm md:col-span-2">
              <h3 className="font-semibold text-indigo-600 mb-2">Datos Familiares y Embarazo</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="mb-1"><span className="font-bold">Acompañante:</span> {paciente.acompanante}</div>
                  <div className="mb-1"><span className="font-bold">Teléfono Acompañante:</span> {paciente.telefonoAcompanante}</div>
                  <div className="mb-1"><span className="font-bold">Nombre del bebé:</span> {paciente.nombreBebe}</div>
                </div>
                <div>
                  {/* Indicador visual del estado - para retrocompatibilidad */}
                  <div className="mb-3">
                    <span className="font-bold">Estado del embarazo:</span> 
                    <span className={`ml-2 px-3 py-1 rounded-full text-sm font-bold ${
                      (paciente.estadoEmbarazo === 'gestacion' || !paciente.estadoEmbarazo) 
                        ? 'bg-pink-100 text-pink-800 border border-pink-300' 
                        : 'bg-blue-100 text-blue-800 border border-blue-300'
                    }`}>
                      {(paciente.estadoEmbarazo === 'gestacion' || !paciente.estadoEmbarazo) ? '🤰 En gestación' : '👶 Posparto'}
                    </span>
                  </div>
                  
                  {/* Campos condicionales para gestación - mostrar si hay datos o si es gestación */}
                  {((paciente.estadoEmbarazo === 'gestacion' || !paciente.estadoEmbarazo) || 
                    paciente.semanasGestacion || paciente.fum || paciente.fechaProbableParto) && (
                    <div className="bg-pink-50 rounded-xl p-3 border border-pink-200">
                      {paciente.semanasGestacion && (
                        <div className="mb-1"><span className="font-bold text-pink-700">Semanas de gestación:</span> {paciente.semanasGestacion}</div>
                      )}
                      {paciente.fum && (
                        <div className="mb-1"><span className="font-bold text-pink-700">FUM:</span> {paciente.fum}</div>
                      )}
                      {paciente.fechaProbableParto && (
                        <div className="mb-1"><span className="font-bold text-pink-700">Fecha probable de parto:</span> {paciente.fechaProbableParto}</div>
                      )}
                    </div>
                  )}
                  
                  {/* Mensaje para posparto */}
                  {paciente.estadoEmbarazo === 'posparto' && (
                    <div className="bg-blue-50 rounded-xl p-3 border border-blue-200">
                      <div className="text-blue-700 font-medium">Paciente en etapa posparto</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row justify-center gap-4 mt-8">
            <button
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 px-6 rounded-xl shadow transition flex items-center gap-2 text-lg"
              onClick={() => navigate("/pacientes-adultos")}
            >
              <ArrowLeftIcon className="h-6 w-6" />
              Volver a la lista
            </button>
            <button
              className="bg-yellow-400 hover:bg-yellow-500 text-white font-bold py-3 px-6 rounded-xl shadow transition flex items-center gap-2 text-lg"
              onClick={() => navigate(`/pacientes-adultos/editar/${paciente._id}`)}
            >
              <PencilSquareIcon className="h-6 w-6" />
              Editar Paciente
            </button>
            <button
              className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-3 px-6 rounded-xl shadow transition flex items-center gap-2 text-lg"
              onClick={() => navigate(`/pacientes/${paciente._id}/sesiones-perinatal`)}
            >
              <CalendarDaysIcon className="h-6 w-6" />
              Ver Sesiones
            </button>
            <button
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-xl shadow transition flex items-center gap-2 text-lg"
              onClick={async () => {
                try {
                  // Verificar si ya tiene valoraciones de lactancia o piso pélvico
                  const [lactanciaResponse, pisoPelvicoResponse] = await Promise.all([
                    apiRequest(`/valoracion-ingreso-adultos-lactancia/verificar/${paciente._id}`),
                    apiRequest(`/valoracion-piso-pelvico/verificar/${paciente._id}`)
                  ]);
                  
                  const tieneLactancia = lactanciaResponse.tieneValoracion;
                  const tienePisoPelvico = pisoPelvicoResponse.tieneValoracion;
                  
                  if (tieneLactancia && tienePisoPelvico) {
                    // Si ya tiene ambas valoraciones, mostrar mensaje
                    Swal.fire({
                      title: 'Valoraciones Completas',
                      html: `
                        <div class="text-center">
                          <div class="text-6xl mb-4">✅</div>
                          <p class="text-lg mb-4">Este paciente ya tiene todas las valoraciones registradas:</p>
                          <ul class="text-left text-gray-600 mb-4">
                            <li>• <strong>Lactancia:</strong> ${lactanciaResponse.valoracion.fecha || 'No especificada'}</li>
                            <li>• <strong>Piso Pélvico:</strong> ${pisoPelvicoResponse.valoracion.fecha || 'No especificada'}</li>
                          </ul>
                          <p class="text-sm text-gray-500">Puedes ver o editar las valoraciones existentes.</p>
                        </div>
                      `,
                      icon: 'info',
                      confirmButtonColor: '#3085d6',
                      confirmButtonText: 'Ver Valoraciones'
                    });
                  } else {
                    // Mostrar modal para seleccionar tipo de valoración
                    setShowModal(true);
                  }
                } catch (error) {
                  console.error('Error al verificar valoraciones:', error);
                  // En caso de error, mostrar modal normalmente
                  setShowModal(true);
                }
              }}
            >
              <ClipboardDocumentListIcon className="h-6 w-6" />
              Iniciar Valoración
            </button>
          </div>
          
          {/* Sección de Valoraciones del Paciente */}
          <div className="mt-8 bg-gradient-to-r from-gray-50 to-indigo-50 rounded-2xl p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-indigo-700 flex items-center gap-3">
                <ClipboardDocumentListIcon className="h-6 w-6" />
                Historial de Valoraciones
              </h3>
              <span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-medium">
                {valoraciones.length} valoración{valoraciones.length !== 1 ? 'es' : ''}
              </span>
            </div>
            
            {valoraciones.length > 0 ? (
              <div className="grid gap-4">
                {valoraciones.map((valoracion) => (
                  <div key={valoracion._id} className="bg-white rounded-xl p-5 shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <span className={valoracion.tipo === 'Lactancia' ? 'px-3 py-1 rounded-full text-sm font-semibold bg-blue-100 text-blue-800 border border-blue-200' : valoracion.tipo === 'Piso Pélvico' ? 'px-3 py-1 rounded-full text-sm font-semibold bg-pink-100 text-pink-800 border border-pink-200' : 'px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-800 border border-green-200'}>
                            {valoracion.tipo}
                          </span>
                          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                            {valoracion.fecha || (valoracion.createdAt ? new Date(valoracion.createdAt).toLocaleDateString() : 'Sin fecha')}
                          </span>
                        </div>


                      </div>
                      <button
                        onClick={() => navigate(valoracion.ruta)}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg font-medium transition-colors flex items-center gap-2 shadow-sm"
                      >
                        <EyeIcon className="h-4 w-4" />
                        Ver Detalle
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <ClipboardDocumentListIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h4 className="text-lg font-medium text-gray-600 mb-2">Sin valoraciones registradas</h4>
                <p className="text-gray-500 mb-4">Este paciente aún no tiene valoraciones en el sistema.</p>
                <button
                  onClick={() => setShowModal(true)}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                >
                  Crear Primera Valoración
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal de selección de valoración */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full flex flex-col items-center">
            <h2 className="text-2xl font-bold text-indigo-700 mb-6 text-center">Selecciona el tipo de valoración</h2>
            <div className="flex flex-col gap-4 w-full">
              <button
                className="flex items-center gap-3 bg-green-100 hover:bg-green-200 text-green-800 font-bold py-4 px-6 rounded-xl text-lg w-full justify-center transition"
                onClick={() => {
                  const existing = valoraciones.find(v => v.tipo === 'Perinatal');
                  if (existing) {
                    setExistingValoracion({ tipo: 'Perinatal', ruta: existing.ruta });
                    setShowModal(false);
                    setShowExistingModal(true);
                  } else {
                    setShowModal(false);
                    navigate(`/valoracion-ingreso-programa-perinatal/${paciente._id}`);
                  }
                }}
              >
                <ClipboardDocumentListIcon className="h-7 w-7" />
                Perinatal
              </button>
              <button
                className="flex items-center gap-3 bg-blue-100 hover:bg-blue-200 text-blue-800 font-bold py-4 px-6 rounded-xl text-lg w-full justify-center transition"
                onClick={() => {
                  const existing = valoraciones.find(v => v.tipo === 'Lactancia');
                  if (existing) {
                    setExistingValoracion({ tipo: 'Lactancia', ruta: existing.ruta });
                    setShowModal(false);
                    setShowExistingModal(true);
                  } else {
                    setShowModal(false);
                    navigate(`/valoracion-adultos/nueva/${paciente._id}`);
                  }
                }}
              >
                <ClipboardDocumentListIcon className="h-7 w-7" />
                Lactancia
              </button>
              <button
                className="flex items-center gap-3 bg-pink-100 hover:bg-pink-200 text-pink-800 font-bold py-4 px-6 rounded-xl text-lg w-full justify-center transition"
                onClick={() => {
                  const existing = valoraciones.find(v => v.tipo === 'Piso Pélvico');
                  if (existing) {
                    setExistingValoracion({ tipo: 'Piso Pélvico', ruta: existing.ruta });
                    setShowModal(false);
                    setShowExistingModal(true);
                  } else {
                    setShowModal(false);
                    navigate(`/valoracion-piso-pelvico/${paciente._id}`);
                  }
                }}
              >
                <HeartIcon className="h-7 w-7" />
                Piso Pélvico
              </button>
            </div>
            <button
              className="mt-8 text-gray-600 hover:text-gray-900 font-bold"
              onClick={() => setShowModal(false)}
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Modal de valoración existente */}
      {showExistingModal && existingValoracion && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full flex flex-col items-center">
            <div className="text-center mb-6">
              <div className="text-4xl mb-4">⚠️</div>
              <h2 className="text-2xl font-bold text-orange-700 mb-4">Valoración Existente</h2>
              <p className="text-gray-600 mb-2">
                Este paciente ya tiene una valoración de <strong>{existingValoracion.tipo}</strong> registrada.
              </p>
              <p className="text-gray-500 text-sm">
                Puedes ver o editar la valoración existente en lugar de crear una nueva.
              </p>
            </div>
            <div className="flex flex-col gap-3 w-full">
              <button
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-xl transition"
                onClick={() => {
                  setShowExistingModal(false);
                  navigate(existingValoracion.ruta);
                }}
              >
                Ver/Editar Valoración Existente
              </button>
              <button
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 px-6 rounded-xl transition"
                onClick={() => {
                  setShowExistingModal(false);
                  setExistingValoracion(null);
                }}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}