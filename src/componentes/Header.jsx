import React from "react";
import { Link } from "react-router-dom";
import logo from "../assents/LOGO.png";
import {
  Bars3Icon,
  XMarkIcon,
  UserCircleIcon,
  ArrowLeftOnRectangleIcon,
} from "@heroicons/react/24/solid";

export default function Header({
  sidebarOpen,
  onToggleSidebar,
  userRole,
  userName,
  onLogout,
}) {
  const rolTexto =
    userRole === "fisioterapeuta"
      ? "Fisioterapeuta"
      : userRole === "auxiliar"
        ? "Auxiliar"
        : userRole === "administracion"
          ? "Administración"
          : userRole || "Usuario";

  return (
    <header className="sticky top-0 z-30 w-full bg-white/90 backdrop-blur-md border-b border-indigo-100 shadow-sm">
      <div className="px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
        {/* Izquierda: botón menú + marca */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            type="button"
            onClick={onToggleSidebar}
            title={sidebarOpen ? "Cerrar menú" : "Abrir menú"}
            className="inline-flex items-center justify-center p-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition-colors shrink-0"
          >
            {sidebarOpen ? (
              <XMarkIcon className="h-5 w-5" />
            ) : (
              <Bars3Icon className="h-5 w-5" />
            )}
          </button>

          <Link
            to="/"
            className="flex items-center gap-2 min-w-0 group"
          >
            <img
              src={logo}
              alt="D'Mamitas & Babies"
              className="h-8 w-8 sm:h-9 sm:w-9 object-contain rounded-lg shrink-0"
            />
            <div className="min-w-0">
              <span className="block font-extrabold text-indigo-700 text-sm sm:text-lg tracking-tight truncate group-hover:text-indigo-800 transition-colors leading-tight">
                D'Mamitas & Babies
              </span>
              <span className="block md:hidden text-[10px] font-bold text-indigo-500 capitalize truncate leading-tight">
                {rolTexto}
              </span>
            </div>
          </Link>
        </div>

        {/* Derecha: rol/usuario, perfil y cerrar sesión */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <div className="hidden md:flex flex-col items-end leading-tight pr-2 border-r border-indigo-100">
            {userName && (
              <span className="text-xs font-extrabold text-gray-800 max-w-[180px] truncate">
                {userName}
              </span>
            )}
            <span className="text-[11px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full capitalize">
              {rolTexto}
            </span>
          </div>

          <Link
            to="/mi-perfil"
            className="inline-flex items-center gap-1.5 bg-indigo-100 hover:bg-indigo-200 text-indigo-800 font-bold text-xs sm:text-sm py-2 px-3 sm:px-4 rounded-xl shadow-sm transition-colors"
            title="Mi Perfil / Firma"
          >
            <UserCircleIcon className="h-5 w-5 shrink-0" />
            <span className="hidden sm:inline">Mi Perfil / Firma</span>
          </Link>

          <button
            type="button"
            onClick={onLogout}
            className="inline-flex items-center gap-1.5 bg-red-100 hover:bg-red-200 text-red-700 font-bold text-xs sm:text-sm py-2 px-3 sm:px-4 rounded-xl shadow-sm transition-colors"
            title="Cerrar sesión"
          >
            <ArrowLeftOnRectangleIcon className="h-5 w-5 shrink-0" />
            <span className="hidden sm:inline">Cerrar sesión</span>
          </button>
        </div>
      </div>
    </header>
  );
}
