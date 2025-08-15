import React, { useState } from "react";
import { BrowserRouter, Routes, Route, useLocation, Link, useNavigate } from "react-router-dom";
import RegistroPaciente from "./componentes/RegistroPaciente";
import VerRegistros from "./componentes/VerRegistros";
import ValoracionIngreso from "./componentes/ValoracionIngreso";
import ListaValoraciones from './componentes/ListaValoraciones';
import DetalleValoracion from './componentes/DetalleValoracion';
import Login from "./componentes/login";
import RegistroUsuario from "./componentes/RegistroUsuario";
import ListaPacientes from "./componentes/ListaPacientes";
import DetallePaciente from "./componentes/DetallePaciente";
import "./App.css"; // Asegúrate de tener tu CSS aquí
import CrearClase from "./componentes/CrearClase";
import DetalleClase from "./componentes/DetalleClase";
import ListaClases from "./componentes/ListaClases";
import RegistrarPaquete from "./componentes/RegistrarPaquete";
import Home from "./componentes/Home";
import EditarValoracion from "./componentes/EditarValoracion";
import EditarPaciente from "./componentes/EditarPaciente";
import DetallePacienteAdulto from "./componentes/DetallePacienteAdulto";

import RegistrarPacienteAdulto from "./componentes/RegistrarPacienteAdulto"; // Para adultos
import EditarPacienteAdulto from "./componentes/EditarPacienteAdulto";
import ValoracionIngresoAdultosLactancia from "./componentes/valoracionadultos_lactancia/ValoracionIngresoAdultosLactancia";
import ListaValoracionesIngresoAdultosLactancia from "./componentes/ListaValoracionesIngresoAdultosLactancia";
import DetalleValoracionIngresoAdultosLactancia from "./componentes/DetalleValoracionIngresoAdultosLactancia";

import EditarValoracionIngresoAdultosLactancia from "./componentes/valoracionadultos_lactancia/EditarValoracionIngresoAdultosLactancia";
//import ValoracionIngresoAdultosGeneral from "./componentes/valoracionadultos_general/ValoracionIngresoAdultosGeneral";
import ValoracionIngresoProgramaPerinatal from "./componentes/valoracionperinatal/ValoracionIngresoProgramaPerinatal";
import ListaConsentimientosPerinatales from "./componentes/valoracionperinatal/ListaConsentimientosPerinatales";
import DetalleConsentimientoPerinatal from "./componentes/valoracionperinatal/DetalleConsentimientoPerinatal";
import EditarConsentimientoPerinatal from "./componentes/valoracionperinatal/EditarConsentimientoPerinatal";
import ListaSesionesPerinatal from "./componentes/valoracionperinatal/ListaSesionesPerinatal";
import EditarClase from "./componentes/EditarClase";
import "./componentes/logout.css";
import Swal from "sweetalert2";
import ValoracionPisoPelvico from "./componentes/valoracionPisoPelvico/ValoracionPisoPelvico";
import ListaValoracionesPisoPelvico from "./componentes/valoracionPisoPelvico/ListaValoracionesPisoPelvico";
import DetalleValoracionPisoPelvico from "./componentes/valoracionPisoPelvico/DetalleValoracionPisoPelvico";
import EditarValoracionPisoPelvico from "./componentes/valoracionPisoPelvico/EditarValoracionPisoPelvico";
import APIStatusIndicator from "./componentes/APIStatusIndicator";
import ReportePaquetes from "./componentes/ReportePaquetes";


import {
  HomeIcon,
  UsersIcon,
  
  AcademicCapIcon,
 
  ArrowLeftOnRectangleIcon,
  
  
  ClipboardDocumentCheckIcon,
  ClipboardIcon,
  DocumentTextIcon,
  ChartBarIcon,
  
  
} from "@heroicons/react/24/solid";
import { logAPIConfig, testAPIConnection } from "./config/api";

// DEBUG: Mostrar configuración al iniciar
console.log('🚀 === INICIANDO APLICACIÓN ===');
logAPIConfig();

// DEBUG: Probar conectividad al iniciar (opcional)
if (process.env.NODE_ENV === 'development') {
  setTimeout(() => {
    testAPIConnection();
  }, 2000); // Esperar 2 segundos después de cargar
}

function App() {
  const [usuario, setUsuario] = useState(sessionStorage.getItem("token"));

  return (
    <BrowserRouter>
      <RutasAutenticadas usuario={usuario} setUsuario={setUsuario} />
    </BrowserRouter>
  );
}

function RutasAutenticadas({ usuario, setUsuario }) {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [submenuValoraciones, setSubmenuValoraciones] = useState(false); // <--- NUEVO
  const [cerrandoSesion, setCerrandoSesion] = useState(false);
  const navigate = useNavigate();

  if (!usuario && location.pathname !== "/registrar-usuario") {
    return <Login onLogin={() => setUsuario(sessionStorage.getItem("token"))} />;
  }

  if (cerrandoSesion) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-pink-100 to-green-100">
        <div className="flex flex-col items-center gap-4">
          <svg className="h-24 w-24 text-red-400 animate-pop" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="#fee2e2" />
            <path stroke="#ef4444" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" d="M15 12H9m6 0l-2-2m2 2l-2 2" />
          </svg>
          <span className="text-xl font-bold text-red-600 animate-fade">Cerrando sesión...</span>
        </div>
       
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      {/* Indicador de estado de API (solo en desarrollo) */}
      {process.env.NODE_ENV === 'development' && <APIStatusIndicator />}
      
      {/* Botón hamburguesa solo en móvil */}
      {usuario && (
        <button
          className="fixed top-4 left-4 z-50 bg-indigo-700 text-white p-2 rounded"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          {sidebarOpen ? "✖" : "☰"}
        </button>
      )}

      {/* Sidebar */}
      {usuario && (
        <aside
          className={`
            fixed z-40 top-0 left-0 h-full w-60 py-8 px-4 flex flex-col justify-between transition-transform duration-300 bg-gradient-to-b from-indigo-100 via-pink-100 to-green-100 shadow-xl border-r border-indigo-200 overflow-y-auto
            ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          `}
        >
          <div className="flex-1 overflow-y-auto">
            <h2 className="text-2xl font-bold mb-8 text-center text-indigo-700 drop-shadow">Menú</h2>
            <nav className="flex flex-col gap-4 pb-4">
              <Link
                to="/"
                className="bg-indigo-200 hover:bg-indigo-300 text-indigo-800 font-bold py-2 px-4 rounded transition text-center shadow flex items-center gap-2"
                onClick={() => setSidebarOpen(false)}
              >
                <HomeIcon className="h-5 w-5" />
                Ir a Home
              </Link>
              <Link
                to="/pacientes"
                className="bg-blue-100 hover:bg-blue-200 text-blue-800 font-bold py-2 px-4 rounded transition text-center shadow flex items-center gap-2"
                onClick={() => setSidebarOpen(false)}
              >
                <UsersIcon className="h-5 w-5" />
                Ver Pacientes
              </Link>
              <Link
                to="/clases"
                className="bg-purple-100 hover:bg-purple-200 text-purple-800 font-bold py-2 px-4 rounded transition text-center shadow flex items-center gap-2"
                onClick={() => setSidebarOpen(false)}
              >
                <AcademicCapIcon className="h-5 w-5" />
                Lista de Sesiones
              </Link>
              <Link
                to="/reporte-paquetes"
                className="bg-green-100 hover:bg-green-200 text-green-800 font-bold py-2 px-4 rounded transition text-center shadow flex items-center gap-2"
                onClick={() => setSidebarOpen(false)}
              >
                <ChartBarIcon className="h-5 w-5" />
                Reporte de Paquetes
              </Link>
              <div>
                <button
                  type="button"
                  className="w-full bg-pink-200 hover:bg-pink-300 text-pink-800 font-bold py-2 px-4 rounded transition text-center flex justify-between items-center shadow"
                  onClick={() => setSubmenuValoraciones(v => !v)}
                >
                  Lista de Valoraciones
                  <span>{submenuValoraciones ? "▲" : "▼"}</span>
                </button>
                {submenuValoraciones && (
                  <div className="ml-4 flex flex-col gap-2 mt-2">
                    <Link
                      to="/valoraciones"
                      className="bg-indigo-100 hover:bg-indigo-200 text-indigo-800 font-semibold py-2 px-4 rounded transition text-left shadow flex items-center gap-2"
                      onClick={() => {
                        setSidebarOpen(false);
                        setSubmenuValoraciones(false);
                      }}
                    >
                      <ClipboardDocumentCheckIcon className="h-5 w-5" />
                      Valoración Inicial
                    </Link>
                    <Link
                      to="/valoraciones-adultos-lactancia"
                      className="bg-blue-100 hover:bg-blue-200 text-blue-800 font-semibold py-2 px-4 rounded transition text-left shadow flex items-center gap-2"
                      onClick={() => {
                        setSidebarOpen(false);
                        setSubmenuValoraciones(false);
                      }}
                    >
                      <ClipboardIcon className="h-5 w-5" />
                      Valoración de Ingreso Asesoría en Lactancia
                    </Link>
                    <Link
                      to="/consentimientos-perinatales"
                      className="bg-green-100 hover:bg-green-200 text-green-800 font-semibold py-2 px-4 rounded transition text-left shadow flex items-center gap-2"
                      onClick={() => {
                        setSidebarOpen(false);
                        setSubmenuValoraciones(false);
                      }}
                    >
                      <DocumentTextIcon className="h-5 w-5" />
                      Consentimientos Perinatales
                    </Link>
                 
                    <Link
                      to="/valoraciones-piso-pelvico"
                      className="bg-pink-100 hover:bg-pink-200 text-pink-700 font-semibold py-2 px-4 rounded transition text-left shadow flex items-center gap-2"
                      onClick={() => {
                        setSidebarOpen(false);
                        setSubmenuValoraciones(false);
                      }}
                    >
                      <ClipboardDocumentCheckIcon className="h-5 w-5" />
                      Valoraciones Piso Pélvico
                    </Link>
                  </div>
                )}
              </div>
            </nav>
          </div>
          <button
            onClick={async () => {
              const result = await Swal.fire({
                title: "¿Deseas cerrar sesión?",
                text: "Tu sesión se cerrará y volverás al inicio.",
                icon: "question",
                showCancelButton: true,
                confirmButtonColor: "#e53e3e",
                cancelButtonColor: "#6366f1",
                confirmButtonText: "Sí, cerrar sesión",
                cancelButtonText: "Cancelar"
              });
              if (result.isConfirmed) {
                setCerrandoSesion(true);
                setTimeout(() => {
                  sessionStorage.removeItem("token");
                  setUsuario(null);
                  navigate("/");
                  setCerrandoSesion(false);
                }, 1200);
              }
            }}
            className="bg-red-200 hover:bg-red-300 text-red-700 font-bold py-2 px-4 rounded transition mt-8 shadow flex items-center gap-2"
          >
            <ArrowLeftOnRectangleIcon className="h-5 w-5" />
            Cerrar sesión
          </button>
        </aside>
      )}

      {/* Overlay para cerrar el sidebar en móvil */}
      {usuario && sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Contenido principal */}
      <main
        className={`flex-1 bg-gray-50 min-h-screen transition-all duration-300
          ${usuario && sidebarOpen 
            ? "md:ml-56" 
            : "flex items-center justify-center"
          }
        `}
      >
        <div className={usuario && !sidebarOpen ? "w-full max-w-8xl mx-auto px-2" : "w-full"}>
          <Routes>
            <Route path="/registrar-usuario" element={<RegistroUsuario />} />
          
            <Route path="/registros" element={<VerRegistros />} />
            <Route path="/valoracion" element={<ValoracionIngreso />} />
            <Route path="/valoraciones" element={<ListaValoraciones />} />
            <Route path="/valoraciones/:id" element={<DetalleValoracion />} />
            <Route path="/registro" element={<RegistroPaciente />} />
            <Route path="/pacientes" element={<ListaPacientes />} />
            <Route path="/pacientes/:id" element={<DetallePaciente />} />
            <Route path="/clases/nueva" element={<CrearClase />} />
            <Route path="/clases" element={<ListaClases />} />
            <Route path="/clases/:id" element={<DetalleClase />} />
            <Route path="/paquetes/nuevo/:id" element={<RegistrarPaquete />} />
            <Route path="/" element={<Home />} />
            <Route path="/valoraciones/editar/:id" element={<EditarValoracion />} />
            <Route path="/pacientes/editar/:id" element={<EditarPaciente />} />
            <Route path="/registrar-paciente-nino" element={<RegistroPaciente />} />
            <Route path="/registrar-paciente-adulto" element={<RegistrarPacienteAdulto  />} />
            <Route path="/pacientes-adultos" element={<ListaPacientes tipo="adulto" />} />
            <Route path="/pacientes-adultos/:id" element={<DetallePacienteAdulto />} />
            <Route path="/pacientes-adultos/editar/:id" element={<EditarPacienteAdulto />} />
            <Route path="/valoracion-adultos/nueva/:id" element={<ValoracionIngresoAdultosLactancia />}
            />
            <Route path="/valoraciones-adultos-lactancia" element={<ListaValoracionesIngresoAdultosLactancia />} />
            <Route path="/valoracion-ingreso-adultos-lactancia/:id" element={<DetalleValoracionIngresoAdultosLactancia />} />
            <Route path="/editar-valoracion-ingreso-adultos-lactancia/:id" element={<EditarValoracionIngresoAdultosLactancia />} />
            <Route path="/valoracion-ingreso-programa-perinatal/:id" element={<ValoracionIngresoProgramaPerinatal />} />
            <Route path="/consentimientos-perinatales" element={<ListaConsentimientosPerinatales />} />
            <Route path="/consentimientos-perinatales/:id" element={<DetalleConsentimientoPerinatal />} />
            <Route path="/consentimientos-perinatales/:id/editar" element={<EditarConsentimientoPerinatal />} />
            <Route path="/clases/editar/:id" element={<EditarClase />} />
            <Route path="/valoracion-piso-pelvico/:id" element={<ValoracionPisoPelvico />} />
            <Route path="/valoraciones-piso-pelvico" element={<ListaValoracionesPisoPelvico />} />
            <Route path="/valoraciones-piso-pelvico/:id" element={<DetalleValoracionPisoPelvico />} />
            <Route path="/valoraciones-piso-pelvico/:id/editar" element={<EditarValoracionPisoPelvico />} />
            <Route path="/pacientes/:id/sesiones-perinatal" element={<ListaSesionesPerinatal />} />
            <Route path="/reporte-paquetes" element={<ReportePaquetes />} />

          </Routes>
        </div>
      </main>
    </div>
  );
}

export default App;
