import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import logo from "../assents/LOGO.png"; // Ajusta la ruta si es necesario
import { UserGroupIcon } from "@heroicons/react/24/outline";
import { ClipboardDocumentListIcon, AcademicCapIcon, ChartBarIcon } from "@heroicons/react/24/outline";

export default function Home() {
  const navigate = useNavigate();

  const handleListaValoraciones = async () => {
    const result = await Swal.fire({
      title: "¿A qué lista deseas ir?",
      showDenyButton: true,
      showCancelButton: true,
      showConfirmButton: true,
      confirmButtonText: "Niños",
      denyButtonText: "Adultos Lactancia",
      cancelButtonText: "Cancelar",
      html: `<button id="perinatal-btn" class="swal2-confirm swal2-styled" style="background-color:#ec4899;margin-top:1rem;">Valoración Perinatal</button>`,
      icon: "question",
      confirmButtonColor: "#6366f1",
      denyButtonColor: "#9333ea",
      cancelButtonColor: "#d33",
      didOpen: () => {
        const btn = document.getElementById("perinatal-btn");
        if (btn) {
          btn.onclick = () => {
            Swal.close();
            navigate("/consentimientos-perinatales");
          };
        }
      },
    });

    if (result.isConfirmed) {
      navigate("/valoraciones");
    } else if (result.isDenied) {
      navigate("/valoraciones-adultos-lactancia");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-100 via-purple-100 to-green-100">
      <div className="bg-white bg-opacity-90 p-10 rounded-3xl shadow-2xl flex flex-col gap-8 w-full max-w-lg items-center border border-indigo-100">
        <img src={logo} alt="Logo" className="w-40 mb-2 drop-shadow" />
        <h1 className="text-3xl font-extrabold text-indigo-700 mb-2 text-center drop-shadow">
          D'Mamitas & Babies
        </h1>
        <p className="text-indigo-500 text-center mb-4">
          Bienvenido al sistema de gestión de valoraciones y sesiones.<br />
          ¡Tu desarrollo y bienestar es nuestra prioridad!
        </p>
        <div className="flex flex-col gap-4 w-full">
          <Link
            to="/pacientes"
            className="flex items-center justify-center gap-2 bg-indigo-200 hover:bg-indigo-300 text-indigo-800 font-bold py-3 rounded-xl text-center transition transform hover:scale-105 shadow"
          >
            <UserGroupIcon className="h-6 w-6" /> Lista de Pacientes
          </Link>
          <Link
            to="/clases"
            className="flex items-center justify-center gap-2 bg-green-200 hover:bg-green-300 text-green-800 font-bold py-3 rounded-xl text-center transition transform hover:scale-105 shadow"
          >
            <AcademicCapIcon className="h-6 w-6" /> Sesiones
          </Link>
          <button
            type="button"
            onClick={handleListaValoraciones}
            className="flex items-center justify-center gap-2 bg-pink-200 hover:bg-pink-300 text-pink-800 font-bold py-3 rounded-xl text-center transition transform hover:scale-105 shadow"
          >
            <ClipboardDocumentListIcon className="h-6 w-6" /> Lista de Valoraciones
          </button>
          <Link
            to="/reporte-paquetes"
            className="flex items-center justify-center gap-2 bg-yellow-200 hover:bg-yellow-300 text-yellow-800 font-bold py-3 rounded-xl text-center transition transform hover:scale-105 shadow"
          >
            <ChartBarIcon className="h-6 w-6" /> Reporte de Paquetes
          </Link>
        </div>
      </div>
    </div>
  );
}