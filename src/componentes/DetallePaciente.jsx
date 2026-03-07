import { useParams, useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { ClipboardDocumentListIcon, ArrowLeftIcon, PencilSquareIcon, CreditCardIcon, ArrowDownTrayIcon } from "@heroicons/react/24/solid";
import { apiRequest } from "../config/api";
import Swal from 'sweetalert2';

export default function DetallePacienteUnificado() {
  const { id } = useParams();
  const [paciente, setPaciente] = useState(null);
  const [error, setError] = useState("");
  const [valoraciones, setValoraciones] = useState([]); // Historial de valoraciones unificado
  const [showValuationModal, setShowValuationModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Cargar datos básicos del paciente (unificado en /pacientes)
    apiRequest(`/pacientes/${id}`)
      .then(data => setPaciente(data))
      .catch(() => setError("No se pudo cargar la historia clínica"));

    // Cargar historial de valoraciones (unificado en /valoraciones)
    apiRequest(`/valoraciones/paciente/${id}`).then(setValoraciones).catch(() => []);
  }, [id]);



  const descargarRDA = async () => {
    try {
      // Mostrar cargando
      Swal.fire({
        title: 'Generando RDA...',
        text: 'Construyendo el resumen digital en formato FHIR (Resolución 866 de 2021)',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });

      const response = await apiRequest(`/rda/patient/${paciente._id}`);

      const dataStr = JSON.stringify(response, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);

      const fileName = `RDA_PACIENTE_${paciente.numeroDocumento || paciente.registroCivil || id}.json`;

      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', fileName);
      linkElement.click();

      Swal.fire({
        icon: 'success',
        title: '¡RDA Generado!',
        text: 'El Resumen Digital de Atención (FHIR) se ha descargado correctamente.',
        timer: 2500,
        showConfirmButton: false
      });
    } catch (error) {
      console.error('Error descargando RDA:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo generar el RDA FHIR. Verifique que el paciente tenga al menos una valoración registrada.'
      });
    }
  };

  if (error) return <div className="p-8 text-red-600">{error}</div>;
  if (!paciente) return (
    <div className="flex flex-col items-center justify-center min-h-[300px] bg-gradient-to-br from-indigo-100 via-pink-100 to-green-100">
      <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-indigo-600 border-solid"></div>
      <span className="mt-4 text-indigo-700 font-bold">Cargando...</span>
    </div>
  );



  const isNino = !paciente.esAdulto;

  const calcularEdad = (fechaNac) => {
    if (!fechaNac) return '';
    const hoy = new Date();
    const nacimiento = new Date(fechaNac);
    if (isNaN(nacimiento.getTime())) return '';

    if (isNino) {
      const meses = (hoy.getFullYear() - nacimiento.getFullYear()) * 12 + (hoy.getMonth() - nacimiento.getMonth());
      return (meses >= 0 ? meses : 0);
    } else {
      let edadAños = hoy.getFullYear() - nacimiento.getFullYear();
      if (hoy.getMonth() < nacimiento.getMonth() || (hoy.getMonth() === nacimiento.getMonth() && hoy.getDate() < nacimiento.getDate())) {
        edadAños--;
      }
      return (edadAños >= 0 ? edadAños : 0);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-pink-100 to-green-100 py-10 px-2">
      <div className="p-8 max-w-4xl w-full mx-auto bg-white rounded-3xl shadow-2xl border border-indigo-100">

        {/* Encabezado Principal */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <button
            onClick={() => navigate("/pacientes")}
            className="flex items-center gap-2 text-indigo-600 font-bold hover:text-indigo-800 transition"
          >
            <ArrowLeftIcon className="h-5 w-5" /> Volver
          </button>
          <h2 className="text-3xl font-extrabold text-indigo-700 tracking-tight drop-shadow">
            Expediente del Paciente
          </h2>
          <div className={`px-4 py-1 rounded-full text-sm font-bold border ${isNino ? 'bg-indigo-100 text-indigo-800 border-indigo-200' : 'bg-pink-100 text-pink-800 border-pink-200'}`}>
            {isNino ? '🧒 Pediátrico' : '🤰 Materno'}
          </div>
        </div>

        {/* Rejilla de Información del Paciente */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">

          {/* Bloque 1: Identificación */}
          <div className="bg-indigo-50 rounded-2xl p-5 shadow-sm border border-indigo-100">
            <h3 className="font-bold text-indigo-700 mb-3 flex items-center gap-2 border-b border-indigo-200 pb-1">
              🧔 Identificación
            </h3>
            <div className="space-y-1 text-sm">
              <p><span className="font-bold">Nombres:</span> {paciente.nombres} {paciente.apellidos}</p>
              <p><span className="font-bold">Doc:</span> {paciente.tipoDocumentoIdentificacion} {paciente.numDocumentoIdentificacion}</p>
              <p><span className="font-bold">Edad:</span> {calcularEdad(paciente.fechaNacimiento)} {isNino ? 'meses' : 'años'}</p>
              <p><span className="font-bold">Género:</span> {paciente.codSexo === 'M' ? 'Masculino' : 'Femenino'}</p>
              <p><span className="font-bold">F. Nacimiento:</span> {paciente.fechaNacimiento?.split('T')[0]}</p>
            </div>
          </div>

          {/* Bloque 2: Contacto */}
          <div className="bg-blue-50 rounded-2xl p-5 shadow-sm border border-blue-100">
            <h3 className="font-bold text-blue-700 mb-3 flex items-center gap-2 border-b border-blue-200 pb-1">
              📞 Contacto
            </h3>
            <div className="space-y-1 text-sm">
              <p><span className="font-bold">Dirección:</span> {paciente.datosContacto?.direccion || paciente.direccion}</p>
              <p><span className="font-bold">Teléfono:</span> {paciente.datosContacto?.telefono || paciente.telefono}</p>
              <p><span className="font-bold">Celular:</span> {paciente.celular}</p>
              <p><span className="font-bold">Acompañante:</span> {paciente.datosContacto?.nombreAcompanante || paciente.acompanante}</p>
              <p><span className="font-bold">Aseguradora:</span> {paciente.aseguradora}</p>
            </div>
          </div>

          {/* Bloque 3: Datos Clínicos Específicos */}
          <div className="bg-green-50 rounded-2xl p-5 shadow-sm border border-green-100">
            <h3 className="font-bold text-green-700 mb-3 flex items-center gap-2 border-b border-green-200 pb-1">
              ⚕️ Datos Clínicos
            </h3>
            <div className="space-y-1 text-sm">
              {isNino ? (
                <>
                  <p><span className="font-bold">Pediatra:</span> {paciente.pediatra || 'No especificado'}</p>
                  <p><span className="font-bold">Peso:</span> {paciente.peso ? paciente.peso.replace(/kg|gr/ig, '').trim() + ' kg' : 'N/A'}</p>
                  <p><span className="font-bold">Talla:</span> {paciente.talla ? paciente.talla.replace(/cm|m|mt/ig, '').trim() + ' cm' : 'N/A'}</p>

                  <div className="mt-2 pt-2 border-t border-green-200">
                    <p><span className="font-bold">Madre:</span> {paciente.nombreMadre || 'No especificada'} {paciente.edadMadre ? `(${paciente.edadMadre} años)` : ''}</p>
                    {paciente.ocupacionMadre && <p><span className="font-bold text-gray-500 text-xs">Ocupación:</span> {paciente.ocupacionMadre}</p>}
                  </div>
                  <div className="mt-2 pt-2 border-t border-green-200">
                    <p><span className="font-bold">Padre:</span> {paciente.nombrePadre || 'No especificado'} {paciente.edadPadre ? `(${paciente.edadPadre} años)` : ''}</p>
                    {paciente.ocupacionPadre && <p><span className="font-bold text-gray-500 text-xs">Ocupación:</span> {paciente.ocupacionPadre}</p>}
                  </div>
                </>
              ) : (
                <>
                  <p><span className="font-bold">Ocupación:</span> {paciente.ocupacion}</p>
                  <p><span className="font-bold">FUM:</span> {paciente.fum}</p>
                  <p><span className="font-bold">Semanas:</span> {paciente.semanasGestacion}</p>
                  <p><span className="font-bold">FPP:</span> {paciente.fechaProbableParto}</p>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Acciones Rápidas */}
        <div className="flex flex-wrap justify-center gap-3 mb-10 pb-10 border-b border-gray-100">
          <button
            onClick={() => setShowValuationModal(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-xl shadow transition flex items-center gap-2"
          >
            <ClipboardDocumentListIcon className="h-5 w-5" /> Iniciar Valoración
          </button>

          <button
            onClick={() => navigate(`/pacientes/editar/${id}`)}
            className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 px-6 rounded-xl shadow transition flex items-center gap-2"
          >
            <PencilSquareIcon className="h-5 w-5" /> Editar Datos
          </button>

          <button
            onClick={descargarRDA}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl shadow transition flex items-center gap-2"
          >
            <ArrowDownTrayIcon className="h-5 w-5" /> RDA (FHIR)
          </button>

          {isNino && (
            <Link
              to={`/paquetes/nuevo/${id}`}
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-xl shadow transition flex items-center gap-2"
            >
              <CreditCardIcon className="h-5 w-5" /> Comprar Paquete
            </Link>
          )}

          {!isNino && (
            <button
              onClick={() => navigate(`/pacientes/${id}/sesiones-perinatal`)}
              className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-xl shadow transition flex items-center gap-2"
            >
              <ClipboardDocumentListIcon className="h-5 w-5" /> Ver Sesiones
            </button>
          )}
        </div>

        {/* Historial de Valoraciones */}
        <div className="mb-10">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            📚 Historia Clínica Digital
          </h3>
          {valoraciones.length === 0 ? (
            <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl p-10 text-center text-gray-500">
              No hay valoraciones registradas en esta historia clínica.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {valoraciones.map(v => (
                <div key={v._id} className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm hover:shadow-md transition group">
                  <div className="flex justify-between items-start mb-2">
                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${v.tipo === 'Pediatría' ? 'bg-indigo-100 text-indigo-700' :
                      v.tipo === 'Piso Pélvico' ? 'bg-pink-100 text-pink-700' :
                        v.tipo === 'Lactancia' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                      }`}>
                      {v.tipo}
                    </span>
                    <span className="text-xs text-gray-400 italic">
                      {new Date(v.fechaInicioAtencion || v.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-1 italic">
                    {v.motivoConsulta || v.diagnosticoFisioterapeutico || "Evaluación general"}
                  </p>
                  <button
                    onClick={() => navigate(v.ruta || `/valoraciones/${v._id}`)}
                    className="w-full bg-gray-50 group-hover:bg-indigo-600 group-hover:text-white text-indigo-600 font-bold py-2 rounded-lg transition"
                  >
                    Ver Detalles
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal de Selección de Valoración (Unificado) */}
        {showValuationModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm">
            <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full flex flex-col items-center border border-indigo-100 animate-pop">
              <h2 className="text-2xl font-bold text-indigo-700 mb-6 text-center">Tipo de Valoración</h2>
              <div className="flex flex-col gap-4 w-full">
                {isNino ? (
                  <button
                    className="flex items-center gap-3 bg-indigo-100 hover:bg-indigo-600 hover:text-white text-indigo-800 font-bold py-4 px-6 rounded-2xl text-lg w-full justify-center transition"
                    onClick={() => {
                      setShowValuationModal(false);
                      navigate(`/valoracion?paciente=${id}`);
                    }}
                  >
                    🩺 Valoración Pediátrica
                  </button>
                ) : (
                  <>
                    <button
                      className="flex items-center gap-3 bg-pink-50 hover:bg-pink-600 hover:text-white text-pink-800 font-bold py-4 px-6 rounded-2xl text-lg w-full justify-center transition border border-pink-100"
                      onClick={() => {
                        setShowValuationModal(false);
                        navigate(`/valoracion?paciente=${id}&tipo=pisopelvico`);
                      }}
                    >
                      💖 Piso Pélvico
                    </button>
                    <button
                      className="flex items-center gap-3 bg-blue-50 hover:bg-blue-600 hover:text-white text-blue-800 font-bold py-4 px-6 rounded-2xl text-lg w-full justify-center transition border border-blue-100"
                      onClick={() => {
                        setShowValuationModal(false);
                        navigate(`/valoracion?paciente=${id}&tipo=lactancia`);
                      }}
                    >
                      🤱 Lactancia
                    </button>
                    <button
                      className="flex items-center gap-3 bg-green-50 hover:bg-green-600 hover:text-white text-green-800 font-bold py-4 px-6 rounded-2xl text-lg w-full justify-center transition border border-green-100"
                      onClick={() => {
                        setShowValuationModal(false);
                        navigate(`/valoracion?paciente=${id}&tipo=perinatal`);
                      }}
                    >
                      🤰 Perinatal
                    </button>
                  </>
                )}
              </div>
              <button
                className="mt-6 text-gray-400 hover:text-gray-600 font-medium transition"
                onClick={() => setShowValuationModal(false)}
              >
                Cerrar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}