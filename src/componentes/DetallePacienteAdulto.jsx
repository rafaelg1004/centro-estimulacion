import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
//import Swal from "sweetalert2";
import { ClipboardDocumentListIcon, PencilSquareIcon, ArrowLeftIcon } from "@heroicons/react/24/solid";
import { HeartIcon } from "@heroicons/react/24/solid"; // Para el botón de piso pélvico

export default function DetallePacienteAdulto() {
  const { id } = useParams();
  const [paciente, setPaciente] = useState(null);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`/api/pacientes-adultos/${id}`)
      .then(res => res.json())
      .then(data => setPaciente(data))
      .catch(() => setError("No se pudo cargar el paciente"));
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
              <h3 className="font-semibold text-indigo-600 mb-2">Datos Familiares y Gestación</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="mb-1"><span className="font-bold">Acompañante:</span> {paciente.acompanante}</div>
                  <div className="mb-1"><span className="font-bold">Teléfono Acompañante:</span> {paciente.telefonoAcompanante}</div>
                  <div className="mb-1"><span className="font-bold">Nombre del bebé:</span> {paciente.nombreBebe}</div>
                </div>
                <div>
                  <div className="mb-1"><span className="font-bold">Semanas de gestación:</span> {paciente.semanasGestacion}</div>
                  <div className="mb-1"><span className="font-bold">FUM:</span> {paciente.fum}</div>
                  <div className="mb-1"><span className="font-bold">Fecha probable de parto:</span> {paciente.fechaProbableParto}</div>
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
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-xl shadow transition flex items-center gap-2 text-lg"
              onClick={() => setShowModal(true)}
            >
              <ClipboardDocumentListIcon className="h-6 w-6" />
              Iniciar Valoración
            </button>
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
                  setShowModal(false);
                  navigate(`/valoracion-ingreso-programa-perinatal/${paciente._id}`);
                }}
              >
                <ClipboardDocumentListIcon className="h-7 w-7" />
                Perinatal
              </button>
              <button
                className="flex items-center gap-3 bg-blue-100 hover:bg-blue-200 text-blue-800 font-bold py-4 px-6 rounded-xl text-lg w-full justify-center transition"
                onClick={() => {
                  setShowModal(false);
                  navigate(`/valoracion-adultos/nueva/${paciente._id}`);
                }}
              >
                <ClipboardDocumentListIcon className="h-7 w-7" />
                Lactancia
              </button>
              <button
                className="flex items-center gap-3 bg-pink-100 hover:bg-pink-200 text-pink-800 font-bold py-4 px-6 rounded-xl text-lg w-full justify-center transition"
                onClick={() => {
                  setShowModal(false);
                  navigate(`/valoracion-piso-pelvico/${paciente._id}`);
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
    </div>
  );
}