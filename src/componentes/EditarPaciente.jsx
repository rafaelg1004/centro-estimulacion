import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { apiRequest } from "../config/api";
import { parseFechaLocal, obtenerFechaInput, formatearFechaEspanol, calcularProximoCumpleanos } from "../utils/dateUtils";
import CustomDatePicker from "./ui/CustomDatePicker";

export default function EdicionHistoriaClinica() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [paciente, setPaciente] = useState(null);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isProcessing, setIsProcessing] = useState(true);
  const [loadingText, setLoadingText] = useState("Conectando con la base de datos...");

  useEffect(() => {
    setLoadingText("Descargando expediente del paciente...");
    apiRequest(`/pacientes/${id}`)
      .then(data => {
        setLoadingText("Mapeando datos de contacto y adicionales...");
        // Asegurar que existan objetos anidados
        setPaciente({
          ...data,
          datosContacto: data.datosContacto || {},
          datosAdicionales: data.datosAdicionales || {}
        });

        setLoadingText("Preparando la interfaz de edición...");
        setTimeout(() => {
          setIsProcessing(false);
        }, 1000);
      })
      .catch(() => {
        setError("Error al cargar la historia clínica");
        setIsProcessing(false);
      });
  }, [id]);

  // Un paciente es niño si esAdulto es explícitamente falso (o string "false")
  // o si el campo esAdulto está vacío/null pero el tipo de documento es obligatoriamente pediátrico.
  const isNino = paciente && (
    paciente.esAdulto === false ||
    paciente.esAdulto === "false" ||
    ((paciente.esAdulto === undefined || paciente.esAdulto === null || paciente.esAdulto === "") &&
      ['RC', 'TI', 'MS', 'CN', 'SC', 'AS'].includes(paciente.tipoDocumentoIdentificacion))
  );

  const calcularEdad = (fechaNac) => {
    if (!fechaNac) return '';
    const hoy = new Date();
    const nacimiento = parseFechaLocal(fechaNac);
    if (!nacimiento || isNaN(nacimiento.getTime())) return '';

    if (isNino) {
      const meses = (hoy.getFullYear() - nacimiento.getFullYear()) * 12 + (hoy.getMonth() - nacimiento.getMonth());
      return meses >= 0 ? meses : 0;
    } else {
      let edadAños = hoy.getFullYear() - nacimiento.getFullYear();
      if (hoy.getMonth() < nacimiento.getMonth() || (hoy.getMonth() === nacimiento.getMonth() && hoy.getDate() < nacimiento.getDate())) {
        edadAños--;
      }
      return edadAños >= 0 ? edadAños : 0;
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPaciente(prev => ({ ...prev, [name]: value }));
  };

  const handleGuardar = async (e) => {
    if (e) e.preventDefault();

    const fechaNac = paciente.fechaNacimiento;
    const fechaNacFormateada = formatearFechaEspanol(fechaNac);
    const proxCumple = calcularProximoCumpleanos(fechaNac);
    const nombres = `${paciente.nombres || ""} ${paciente.apellidos || ""}`.trim() || "Sin nombre";
    const documento = `${paciente.tipoDocumentoIdentificacion || ""} ${paciente.numDocumentoIdentificacion || ""}`.trim();
    const sexo = paciente.codSexo === "M" ? "Masculino" : paciente.codSexo === "F" ? "Femenino" : paciente.codSexo || "No especificado";
    const edad = isNino ? `${calcularEdad(fechaNac)} meses` : `${calcularEdad(fechaNac)} años`;
    const telefono = paciente.datosContacto?.celular || paciente.datosContacto?.telefono || "No registrado";
    const direccion = paciente.datosContacto?.direccion || "No registrada";

    const resumenHtml = `
      <div style="text-align: left; font-size: 14px; line-height: 1.5; color: #374151; max-height: 65vh; overflow-y: auto; padding-right: 4px;">
        <div style="background: linear-gradient(135deg, #eef2ff, #fdf2f8); border: 1px solid #c7d2fe; border-radius: 16px; padding: 14px; margin-bottom: 14px;">
          <div style="font-size: 17px; font-weight: 800; color: #4338ca; margin-bottom: 6px;">
            👤 ${nombres}
          </div>
          <div style="font-size: 13px; color: #4b5563; display: flex; flex-wrap: wrap; gap: 6px;">
            <span style="background: #ffffff; padding: 3px 8px; border-radius: 6px; border: 1px solid #e0e7ff; font-weight: 600; color: #3730a3;">
              🪪 ${documento}
            </span>
            <span style="background: #ffffff; padding: 3px 8px; border-radius: 6px; border: 1px solid #e0e7ff; font-weight: 600; color: #3730a3;">
              ⚧️ ${sexo}
            </span>
          </div>
        </div>

        <div style="background: #f9fafb; border-radius: 12px; padding: 12px 14px; border: 1px solid #f3f4f6; margin-bottom: 12px;">
          <div style="font-weight: 700; color: #1e1b4b; margin-bottom: 8px; font-size: 13px; border-bottom: 1px solid #e5e7eb; padding-bottom: 4px;">
            🎂 Cumpleaños y Edad
          </div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
            <div>
              <span style="color: #6b7280; font-size: 11px; text-transform: uppercase; font-weight: 600;">Fecha de Nacimiento:</span><br/>
              <strong style="color: #111827; font-size: 13.5px;">📅 ${fechaNacFormateada}</strong>
            </div>
            <div>
              <span style="color: #6b7280; font-size: 11px; text-transform: uppercase; font-weight: 600;">Edad Actual:</span><br/>
              <strong style="color: #111827; font-size: 13.5px;">⏳ ${edad}</strong>
            </div>
          </div>
          ${proxCumple ? `
            <div style="margin-top: 10px; padding: 10px; background: #ecfdf5; border-radius: 10px; border: 1px solid #a7f3d0;">
              <div style="color: #065f46; font-size: 11px; font-weight: 700; text-transform: uppercase;">🎈 Próximo Cumpleaños:</div>
              <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 4px; margin-top: 2px;">
                <strong style="color: #047857; font-size: 14px;">${proxCumple.fechaFormateada}</strong>
                <span style="background: #10b981; color: white; font-size: 11px; padding: 2px 8px; border-radius: 9999px; font-weight: 700;">
                  ${proxCumple.textoFaltante} ${proxCumple.edadACumplir ? `(Cumple ${proxCumple.edadACumplir} año${proxCumple.edadACumplir > 1 ? 's' : ''})` : ''}
                </span>
              </div>
            </div>
          ` : ''}
        </div>

        <div style="background: #f9fafb; border-radius: 12px; padding: 12px 14px; border: 1px solid #f3f4f6;">
          <div style="font-weight: 700; color: #1e1b4b; margin-bottom: 8px; font-size: 13px; border-bottom: 1px solid #e5e7eb; padding-bottom: 4px;">
            📞 Contacto
          </div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: 13px;">
            <div><span style="color: #6b7280; font-size: 11px;">Teléfono:</span><br/><strong>${telefono}</strong></div>
            <div><span style="color: #6b7280; font-size: 11px;">Dirección:</span><br/><strong>${direccion}</strong></div>
          </div>
        </div>
      </div>
    `;

    const confirmacion = await Swal.fire({
      title: `¿Guardar Cambios del Paciente?`,
      html: resumenHtml,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "✅ Confirmar y Guardar",
      cancelButtonText: "✏️ Modificar / Revisar",
      confirmButtonColor: "#4f46e5",
      cancelButtonColor: "#6b7280",
      customClass: {
        popup: "rounded-3xl shadow-2xl p-6 border border-indigo-100",
        confirmButton: "rounded-xl font-bold px-6 py-3",
        cancelButton: "rounded-xl font-bold px-6 py-3",
      },
      width: "550px",
    });

    if (!confirmacion.isConfirmed) {
      return;
    }

    setIsSubmitting(true);
    try {
      await apiRequest(`/pacientes/${id}`, {
        method: "PUT",
        body: JSON.stringify(paciente),
      });
      await Swal.fire({
        icon: "success",
        title: "Historia Clínica Actualizada",
        timer: 1500,
        showConfirmButton: false
      });
      navigate(`/pacientes/${id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isProcessing || !paciente)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50/50">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600 z-10 absolute inset-0"></div>
          <div className="rounded-full h-16 w-16 border-4 border-indigo-100"></div>
        </div>
        <p className="mt-6 text-indigo-800 font-semibold text-lg tracking-wide animate-pulse">
          {loadingText}
        </p>
        <p className="text-sm text-gray-500 mt-2">Asegurando la carga de la información clínica...</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-pink-50 py-10 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden border border-indigo-100">
        <div className="bg-indigo-600 p-6 text-white text-center">
          <h2 className="text-2xl font-bold uppercase tracking-widest">Edición de Historia Clínica Digital</h2>
          <p className="text-indigo-100 text-sm opacity-80 italic">Modificando expediente de {paciente.nombres} {paciente.apellidos}</p>
        </div>

        <form onSubmit={handleGuardar} className="p-8 space-y-10">

          {/* SECCIÓN 1: IDENTIFICACIÓN BÁSICA */}
          <section>
            <h3 className="text-indigo-700 font-black border-b-2 border-indigo-100 mb-6 flex items-center gap-2">
              🆔 IDENTIFICACIÓN Y DATOS BÁSICOS
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="col-span-1 md:col-span-3 grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-400">Nombres</label>
                  <input name="nombres" value={paciente.nombres || ''} onChange={handleChange} className="w-full border-b-2 border-gray-100 p-2 focus:border-indigo-400 outline-none transition" />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-400">Apellidos</label>
                  <input name="apellidos" value={paciente.apellidos || ''} onChange={handleChange} className="w-full border-b-2 border-gray-100 p-2 focus:border-indigo-400 outline-none transition" />
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-400">Tipo Doc</label>
                <input value={paciente.tipoDocumentoIdentificacion || ''} disabled className="w-full bg-gray-50 border-b-2 border-gray-200 p-2 text-gray-400" />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-400">Número</label>
                <input name="numDocumentoIdentificacion" value={paciente.numDocumentoIdentificacion || ''} onChange={handleChange} className="w-full border-b-2 border-gray-100 p-2 focus:border-indigo-400 outline-none transition" />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-400">Género</label>
                <select name="codSexo" value={paciente.codSexo || ''} onChange={handleChange} className="w-full border-b-2 border-gray-100 p-2 focus:border-indigo-400 outline-none transition">
                  <option value="M">Masculino</option>
                  <option value="F">Femenino</option>
                  <option value="O">Otro</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-400">Fecha Nacimiento</label>
                <CustomDatePicker
                  name="fechaNacimiento"
                  value={obtenerFechaInput(paciente.fechaNacimiento || paciente.fecha_nacimiento)}
                  onChange={handleChange}
                  placeholder="Seleccionar fecha..."
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-400">Edad Calculada ({isNino ? 'meses' : 'años'})</label>
                <input value={paciente.fechaNacimiento ? calcularEdad(paciente.fechaNacimiento) : ''} disabled className="w-full bg-gray-50 border-b-2 border-gray-200 p-2 text-gray-400 font-bold" />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-400">Aseguradora</label>
                <input name="aseguradora" value={paciente.aseguradora || ''} onChange={handleChange} className="w-full border-b-2 border-gray-100 p-2 focus:border-indigo-400 outline-none transition" />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-400">Lugar de Nacimiento</label>
                <input name="lugarNacimiento" value={paciente.lugarNacimiento || ''} onChange={handleChange} className="w-full border-b-2 border-gray-100 p-2 focus:border-indigo-400 outline-none transition" />
              </div>
              <div className="col-span-1 md:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-gray-50 pt-4">
                <div>
                  <label className="text-xs font-bold text-gray-400">Dirección</label>
                  <input name="direccion" value={paciente.direccion || ''} onChange={handleChange} className="w-full border-b-2 border-gray-100 p-2 focus:border-indigo-400 outline-none transition" />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-400">Teléfono Fijo</label>
                  <input name="telefono" value={paciente.telefono || ''} onChange={handleChange} className="w-full border-b-2 border-gray-100 p-2 focus:border-indigo-400 outline-none transition" />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-400">Celular</label>
                  <input name="celular" value={paciente.celular || ''} onChange={handleChange} className="w-full border-b-2 border-gray-100 p-2 focus:border-indigo-400 outline-none transition" />
                </div>
              </div>
            </div>
          </section>

          {/* SECCIÓN 2: CAMPOS ESPECÍFICOS (PEDIATRÍA O ADULTO) */}
          <section className={`p-6 rounded-2xl ${isNino ? 'bg-indigo-50 border border-indigo-100' : 'bg-pink-50 border border-pink-100'}`}>
            <h3 className={`${isNino ? 'text-indigo-700' : 'text-pink-700'} font-black mb-6 uppercase text-sm tracking-tighter`}>
              {isNino ? '🍼 Información Pediátrica Detallada' : '🤱 Información Programas Perinatales / Piso Pélvico'}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {isNino ? (
                <>
                  <div>
                    <label className="text-xs font-bold text-indigo-400">Nombre de la Madre</label>
                    <input name="nombreMadre" value={paciente.nombreMadre || ''} onChange={handleChange} className="w-full bg-white border border-indigo-100 rounded-lg p-2 outline-none" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-indigo-400">Tipo Doc. Madre</label>
                    <select name="tipoDocumentoMadre" value={paciente.tipoDocumentoMadre || ''} onChange={handleChange} className="w-full bg-white border border-indigo-100 rounded-lg p-2 outline-none">
                      <option value="">Seleccione...</option>
                      <option value="CC">Cédula de Ciudadanía (CC)</option>
                      <option value="CE">Cédula de Extranjería (CE)</option>
                      <option value="PA">Pasaporte (PA)</option>
                      <option value="TI">Tarjeta de Identidad (TI)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-indigo-400">No. Documento Madre</label>
                    <input name="numDocumentoMadre" value={paciente.numDocumentoMadre || ''} onChange={handleChange} className="w-full bg-white border border-indigo-100 rounded-lg p-2 outline-none" />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-indigo-400">Edad Madre</label>
                    <input name="edadMadre" value={paciente.edadMadre || ''} onChange={handleChange} className="w-full bg-white border border-indigo-100 rounded-lg p-2 outline-none" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-indigo-400">Ocupación Madre</label>
                    <input name="ocupacionMadre" value={paciente.ocupacionMadre || ''} onChange={handleChange} className="w-full bg-white border border-indigo-100 rounded-lg p-2 outline-none" />
                  </div>
                  <div></div>

                  <div>
                    <label className="text-xs font-bold text-indigo-400">Nombre del Padre</label>
                    <input name="nombrePadre" value={paciente.nombrePadre || ''} onChange={handleChange} className="w-full bg-white border border-indigo-100 rounded-lg p-2 outline-none" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-indigo-400">Tipo Doc. Padre</label>
                    <select name="tipoDocumentoPadre" value={paciente.tipoDocumentoPadre || ''} onChange={handleChange} className="w-full bg-white border border-indigo-100 rounded-lg p-2 outline-none">
                      <option value="">Seleccione...</option>
                      <option value="CC">Cédula de Ciudadanía (CC)</option>
                      <option value="CE">Cédula de Extranjería (CE)</option>
                      <option value="PA">Pasaporte (PA)</option>
                      <option value="TI">Tarjeta de Identidad (TI)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-indigo-400">No. Documento Padre</label>
                    <input name="numDocumentoPadre" value={paciente.numDocumentoPadre || ''} onChange={handleChange} className="w-full bg-white border border-indigo-100 rounded-lg p-2 outline-none" />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-indigo-400">Edad Padre</label>
                    <input name="edadPadre" value={paciente.edadPadre || ''} onChange={handleChange} className="w-full bg-white border border-indigo-100 rounded-lg p-2 outline-none" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-indigo-400">Ocupación Padre</label>
                    <input name="ocupacionPadre" value={paciente.ocupacionPadre || ''} onChange={handleChange} className="w-full bg-white border border-indigo-100 rounded-lg p-2 outline-none" />
                  </div>
                  <div></div>

                  <div>
                    <label className="text-xs font-bold text-indigo-400">Pediatra Tratante</label>
                    <input name="pediatra" value={paciente.pediatra || ''} onChange={handleChange} className="w-full bg-white border border-indigo-100 rounded-lg p-2 outline-none" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-indigo-400">Peso (kg)</label>
                    <input name="peso" value={paciente.peso || ''} onChange={handleChange} className="w-full bg-white border border-indigo-100 rounded-lg p-2 outline-none" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-indigo-400">Talla (cm)</label>
                    <input name="talla" value={paciente.talla || ''} onChange={handleChange} className="w-full bg-white border border-indigo-100 rounded-lg p-2 outline-none" />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="text-xs font-bold text-pink-400">Estado Civil</label>
                    <input name="estadoCivil" value={paciente.estadoCivil || ''} onChange={handleChange} className="w-full bg-white border border-pink-100 rounded-lg p-2 outline-none" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-pink-400">Ocupación</label>
                    <input name="ocupacion" value={paciente.ocupacion || ''} onChange={handleChange} className="w-full bg-white border border-pink-100 rounded-lg p-2 outline-none" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-pink-400">Nivel Educativo</label>
                    <input name="nivelEducativo" value={paciente.nivelEducativo || ''} onChange={handleChange} className="w-full bg-white border border-pink-100 rounded-lg p-2 outline-none" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-pink-400">Médico Tratante</label>
                    <input name="medicoTratante" value={paciente.medicoTratante || ''} onChange={handleChange} className="w-full bg-white border border-pink-100 rounded-lg p-2 outline-none" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-pink-400">Nombre Acompañante</label>
                    <input name="acompanante" value={paciente.acompanante || ''} onChange={handleChange} className="w-full bg-white border border-pink-100 rounded-lg p-2 outline-none" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-pink-400">Teléfono Acompañante</label>
                    <input name="telefonoAcompanante" value={paciente.telefonoAcompanante || ''} onChange={handleChange} className="w-full bg-white border border-pink-100 rounded-lg p-2 outline-none" />
                  </div>
                  <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-pink-100 pt-4">
                    <div>
                      <label className="text-xs font-bold text-pink-400">Nombre del Bebé (si aplica)</label>
                      <input name="nombreBebe" value={paciente.nombreBebe || ''} onChange={handleChange} className="w-full bg-white border border-pink-100 rounded-lg p-2 outline-none" />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-pink-400">Estado Embarazo</label>
                      <select name="estadoEmbarazo" value={paciente.estadoEmbarazo || ''} onChange={handleChange} className="w-full bg-white border border-pink-100 rounded-lg p-2 outline-none text-sm">
                        <option value="">Seleccione...</option>
                        <option value="gestacion">En gestación</option>
                        <option value="posparto">Posparto</option>
                      </select>
                    </div>
                  </div>
                  <div className="md:col-span-3 grid grid-cols-3 gap-4 border-t border-pink-100 pt-4">
                    <div>
                      <label className="text-xs font-bold text-pink-400 italic">FUM (Ult Menstruación)</label>
                      <CustomDatePicker
                        name="fum"
                        value={paciente.fum || ''}
                        onChange={handleChange}
                        placeholder="Seleccionar FUM..."
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-pink-400 italic">Semanas Gestación</label>
                      <input name="semanasGestacion" value={paciente.semanasGestacion || ''} onChange={handleChange} className="w-full bg-white border border-pink-100 rounded-lg p-2 outline-none text-xs" />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-pink-400 italic">Fecha Prob Parto</label>
                      <CustomDatePicker
                        name="fechaProbableParto"
                        value={paciente.fechaProbableParto || ''}
                        onChange={handleChange}
                        placeholder="Seleccionar FPP..."
                      />
                    </div>
                  </div>
                </>
              )}
            </div>
          </section>

          {/* BOTONES ACCIÓN */}
          <div className="flex justify-end gap-4 border-t border-gray-100 pt-8">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="text-gray-400 font-bold hover:text-gray-600 px-6 py-3 transition"
            >
              DESCARTAR
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-indigo-600 hover:bg-black text-white px-10 py-3 rounded-full font-black tracking-widest text-xs shadow-xl transition-all disabled:opacity-50"
            >
              {isSubmitting ? 'GUARDANDO...' : 'ACTUALIZAR HISTORIA CLÍNICA'}
            </button>
          </div>

          {error && <div className="bg-red-50 text-red-600 p-4 rounded-xl text-center font-bold text-sm border border-red-100 animate-shake">{error}</div>}
        </form>
      </div>
    </div>
  );
}