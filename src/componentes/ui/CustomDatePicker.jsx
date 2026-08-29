import React, { useState, useEffect, useRef } from "react";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  CalendarDaysIcon,
  XMarkIcon,
  ClockIcon,
} from "@heroicons/react/24/solid";

const MESES = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

const DIAS_SEMANA = ["Lu", "Ma", "Mi", "Ju", "Vi", "Sá", "Do"];

/**
 * CustomDatePicker - Componente de calendario interactivo moderno y estilizado
 * 
 * Props:
 * - value: string en formato "YYYY-MM-DD" o "YYYY-MM-DDTHH:mm"
 * - onChange: callback({ target: { name, value } })
 * - name: string
 * - id: string
 * - placeholder: string
 * - disabled: boolean
 * - readOnly: boolean
 * - required: boolean
 * - includeTime: boolean (si es datetime-local)
 * - minDate: string
 * - maxDate: string
 */
export default function CustomDatePicker({
  value,
  onChange,
  name,
  id,
  placeholder = "Seleccionar fecha...",
  disabled = false,
  readOnly = false,
  required = false,
  includeTime = false,
  className = "",
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  // Parsear fecha actual o usar fecha de hoy
  const parseInitialDate = () => {
    if (!value) return new Date();
    try {
      const parts = String(value).split("T");
      const [y, m, d] = parts[0].split("-").map(Number);
      if (y && m && d) {
        return new Date(y, m - 1, d);
      }
    } catch {
      // Fallback
    }
    return new Date();
  };

  const initialDate = parseInitialDate();
  const [currentYear, setCurrentYear] = useState(initialDate.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(initialDate.getMonth());
  const [selectedTime, setSelectedTime] = useState(() => {
    if (includeTime && value && String(value).includes("T")) {
      return String(value).split("T")[1].substring(0, 5);
    }
    return "08:00";
  });

  const [viewMode, setViewMode] = useState("days"); // 'days' | 'months' | 'years'

  // Sincronizar mes y año cuando value cambie externamente
  useEffect(() => {
    if (value) {
      const parts = String(value).split("T");
      const [y, m] = parts[0].split("-").map(Number);
      if (y && m) {
        setCurrentYear(y);
        setCurrentMonth(m - 1);
      }
      if (includeTime && parts[1]) {
        setSelectedTime(parts[1].substring(0, 5));
      }
    }
  }, [value, includeTime]);

  // Click outside para cerrar el calendario
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
        setViewMode("days");
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Formato texto legible para el input trigger
  const getFormattedDisplay = () => {
    if (!value) return "";
    try {
      const parts = String(value).split("T");
      const [y, m, d] = parts[0].split("-").map(Number);
      if (y && m && d) {
        const mesNombre = MESES[m - 1];
        const horaStr = includeTime && parts[1] ? ` a las ${parts[1].substring(0, 5)}` : "";
        return `${d} de ${mesNombre} de ${y}${horaStr}`;
      }
    } catch {
      return value;
    }
    return value;
  };

  // Navegación de mes
  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  // Generar días del mes
  const generateDays = () => {
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
    const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);

    // Ajustar para que la semana empiece en Lunes (0 = Lunes, 6 = Domingo)
    let startDayOfWeek = firstDayOfMonth.getDay() - 1;
    if (startDayOfWeek === -1) startDayOfWeek = 6;

    const days = [];

    // Días del mes anterior
    const prevMonthLastDay = new Date(currentYear, currentMonth, 0).getDate();
    for (let i = startDayOfWeek - 1; i >= 0; i--) {
      days.push({
        day: prevMonthLastDay - i,
        month: currentMonth - 1,
        year: currentMonth === 0 ? currentYear - 1 : currentYear,
        isCurrentMonth: false,
      });
    }

    // Días del mes actual
    for (let i = 1; i <= lastDayOfMonth.getDate(); i++) {
      days.push({
        day: i,
        month: currentMonth,
        year: currentYear,
        isCurrentMonth: true,
      });
    }

    // Días del siguiente mes para completar las 6 filas (42 casillas)
    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        day: i,
        month: currentMonth + 1,
        year: currentMonth === 11 ? currentYear + 1 : currentYear,
        isCurrentMonth: false,
      });
    }

    return days;
  };

  // Manejar selección de día
  const handleSelectDay = (dayObj) => {
    const y = dayObj.year;
    const m = String(dayObj.month + 1).padStart(2, "0");
    const d = String(dayObj.day).padStart(2, "0");

    let finalValue = `${y}-${m}-${d}`;
    if (includeTime) {
      finalValue = `${finalValue}T${selectedTime || "08:00"}`;
    }

    if (onChange) {
      onChange({
        target: {
          name,
          value: finalValue,
        },
      });
    }

    if (!includeTime) {
      setIsOpen(false);
    }
  };

  // Manejar selección de "Hoy"
  const handleSelectToday = () => {
    const today = new Date();
    const y = today.getFullYear();
    const m = String(today.getMonth() + 1).padStart(2, "0");
    const d = String(today.getDate()).padStart(2, "0");

    setCurrentYear(y);
    setCurrentMonth(today.getMonth());

    let finalValue = `${y}-${m}-${d}`;
    if (includeTime) {
      const hh = String(today.getHours()).padStart(2, "0");
      const mm = String(today.getMinutes()).padStart(2, "0");
      finalValue = `${finalValue}T${hh}:${mm}`;
      setSelectedTime(`${hh}:${mm}`);
    }

    if (onChange) {
      onChange({
        target: {
          name,
          value: finalValue,
        },
      });
    }

    if (!includeTime) {
      setIsOpen(false);
    }
  };

  // Limpiar valor
  const handleClear = (e) => {
    e.stopPropagation();
    if (onChange) {
      onChange({
        target: {
          name,
          value: "",
        },
      });
    }
  };

  // Años disponibles para selección rápida (desde 1920 hasta año actual + 10)
  const anioActual = new Date().getFullYear();
  const yearsList = [];
  for (let y = anioActual + 10; y >= 1920; y--) {
    yearsList.push(y);
  }

  // Verificar si un día coincide con el valor seleccionado
  const isSelected = (dayObj) => {
    if (!value) return false;
    const parts = String(value).split("T");
    const [y, m, d] = parts[0].split("-").map(Number);
    return (
      dayObj.year === y &&
      dayObj.month === m - 1 &&
      dayObj.day === d
    );
  };

  // Verificar si un día es "Hoy"
  const isToday = (dayObj) => {
    const today = new Date();
    return (
      dayObj.year === today.getFullYear() &&
      dayObj.month === today.getMonth() &&
      dayObj.day === today.getDate()
    );
  };

  return (
    <div className={`relative w-full ${className}`} ref={containerRef}>
      {/* Input Trigger Principal */}
      <div
        id={id}
        onClick={() => {
          if (!disabled && !readOnly) setIsOpen(!isOpen);
        }}
        className={`flex items-center justify-between px-4 py-3 rounded-xl border transition-all cursor-pointer select-none ${
          disabled
            ? "bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed"
            : readOnly
            ? "bg-gray-50 border-gray-200 text-gray-600 cursor-default"
            : isOpen
            ? "border-indigo-500 ring-2 ring-indigo-200 bg-white shadow-sm"
            : "border-indigo-200 bg-white hover:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-300"
        }`}
      >
        <div className="flex items-center gap-2.5 truncate">
          <CalendarDaysIcon
            className={`w-5 h-5 flex-shrink-0 transition-colors ${
              value ? "text-indigo-600" : "text-gray-400"
            }`}
          />
          {value ? (
            <span className="font-semibold text-gray-800 text-sm tracking-tight truncate">
              {getFormattedDisplay()}
            </span>
          ) : (
            <span className="text-gray-400 text-sm font-normal">
              {placeholder}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1 ml-2">
          {value && !disabled && !readOnly && (
            <button
              type="button"
              onClick={handleClear}
              className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
              title="Limpiar fecha"
            >
              <XMarkIcon className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Popover del Calendario */}
      {isOpen && (
        <div
          className="absolute left-0 top-full mt-2 z-50 w-80 sm:w-88 bg-white rounded-3xl shadow-2xl border border-indigo-100 p-4 animate-fadeIn"
          style={{ minWidth: "310px" }}
        >
          {/* Header con Selectores Rápidos de Mes y Año */}
          <div className="flex items-center justify-between mb-3 px-1">
            <div className="flex items-center gap-1.5">
              {/* Selector de Mes */}
              <select
                value={currentMonth}
                onChange={(e) => setCurrentMonth(Number(e.target.value))}
                className="bg-indigo-50 hover:bg-indigo-100 text-indigo-900 font-bold text-xs py-1.5 px-2.5 rounded-xl border border-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 cursor-pointer transition"
              >
                {MESES.map((m, idx) => (
                  <option key={m} value={idx}>
                    {m}
                  </option>
                ))}
              </select>

              {/* Selector de Año */}
              <select
                value={currentYear}
                onChange={(e) => setCurrentYear(Number(e.target.value))}
                className="bg-indigo-50 hover:bg-indigo-100 text-indigo-900 font-bold text-xs py-1.5 px-2.5 rounded-xl border border-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 cursor-pointer transition"
              >
                {yearsList.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>

            {/* Flechas Navegación Mes a Mes */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={prevMonth}
                className="p-1.5 hover:bg-indigo-100 text-indigo-700 rounded-xl transition"
                title="Mes anterior"
              >
                <ChevronLeftIcon className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={nextMonth}
                className="p-1.5 hover:bg-indigo-100 text-indigo-700 rounded-xl transition"
                title="Mes siguiente"
              >
                <ChevronRightIcon className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Días de la semana */}
          <div className="grid grid-cols-7 gap-1 text-center mb-1.5">
            {DIAS_SEMANA.map((d, i) => (
              <span
                key={d}
                className={`text-[11px] font-extrabold uppercase py-1 ${
                  i >= 5 ? "text-pink-600" : "text-gray-400"
                }`}
              >
                {d}
              </span>
            ))}
          </div>

          {/* Grilla de Días */}
          <div className="grid grid-cols-7 gap-1">
            {generateDays().map((dayObj, idx) => {
              const selected = isSelected(dayObj);
              const today = isToday(dayObj);

              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectDay(dayObj)}
                  className={`h-8 text-xs font-bold rounded-xl flex flex-col items-center justify-center relative transition-all ${
                    selected
                      ? "bg-gradient-to-br from-indigo-600 to-indigo-700 text-white shadow-md shadow-indigo-200 scale-105 z-10"
                      : dayObj.isCurrentMonth
                      ? "text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
                      : "text-gray-300 hover:bg-gray-50"
                  }`}
                >
                  <span>{dayObj.day}</span>
                  {today && !selected && (
                    <span className="w-1 h-1 bg-pink-500 rounded-full absolute bottom-1"></span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Selector de Hora (Solo si includeTime está activado) */}
          {includeTime && (
            <div className="mt-3 pt-3 border-t border-indigo-50 flex items-center justify-between px-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-gray-700">
                <ClockIcon className="w-4 h-4 text-indigo-600" />
                <span>Hora:</span>
              </div>
              <input
                type="time"
                value={selectedTime}
                onChange={(e) => {
                  setSelectedTime(e.target.value);
                  if (value) {
                    const datePart = String(value).split("T")[0];
                    if (onChange) {
                      onChange({
                        target: {
                          name,
                          value: `${datePart}T${e.target.value}`,
                        },
                      });
                    }
                  }
                }}
                className="bg-indigo-50 border border-indigo-200 font-bold text-xs text-indigo-900 rounded-xl px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>
          )}

          {/* Barra Inferior con Accesos Rápidos */}
          <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
            <button
              type="button"
              onClick={handleSelectToday}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 px-3 py-1.5 rounded-xl transition"
            >
              ⚡ Hoy
            </button>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-1.5 rounded-xl transition shadow-sm"
            >
              Aceptar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
