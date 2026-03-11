import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { apiRequest } from "../config/api";



export default function EdicionHistoriaClinica() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [paciente, setPaciente] = useState(null);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    apiRequest(`/pacientes/${id}`)
      .then(data => {
        // Asegurar que existan objetos anidados
        setPaciente({
          ...data,
          datosContacto: data.datosContacto || {},
          datosAdicionales: data.datosAdicionales || {}
        });
      })
      .catch(() => setError("Error al cargar la historia clínica"));
  }, [id]);

  // Un paciente es niÃ±o si esAdulto es explÃcitamente falso (o string "false")
  // o si el campo esAdulto estÃ¡ vacÃo/null pero el tipo de documento es obligatoriamente pediÃ¡trico.
  const isNino = paciente && (
    paciente.esAdulto === false || 
    paciente.esAdulto === "false" ||
    ((paciente.esAdulto === undefined || paciente.esAdulto === null || paciente.esAdulto === "") && 
     ['RC', 'TI', 'MS', 'CN', 'SC', 'AS'].includes(paciente.tipoDocumentoIdentificacion))
  );

  const calcularEdad = (fechaNac) => {
    if (!fechaNac) return '';
    const hoy = new Date();
    const nacimiento = new Date(fechaNac);
    if (isNaN(nacimiento.getTime())) return '';

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

  if (!paciente) return <div className="p-20 text-center font-bold text-indigo-600 animate-pulse">Cargando Historia Clínica...</div>;

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
                <input type="date" name="fechaNacimiento" value={paciente.fechaNacimiento?.split('T')[0] || ''} onChange={handleChange} className="w-full border-b-2 border-gray-100 p-2 focus:border-indigo-400 outline-none transition" />
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
                  <label className="text-xs font-bold text-gray-400">DirecciÃ³n</label>
                  <input name="direccion" value={paciente.direccion || ''} onChange={handleChange} className="w-full border-b-2 border-gray-100 p-2 focus:border-indigo-400 outline-none transition" />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-400">TelÃ©fono Fijo</label>
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
                    <label className="text-xs font-bold text-indigo-400">Edad Madre</label>
                    <input name="edadMadre" value={paciente.edadMadre || ''} onChange={handleChange} className="w-full bg-white border border-indigo-100 rounded-lg p-2 outline-none" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-indigo-400">OcupaciÃ³n Madre</label>
                    <input name="ocupacionMadre" value={paciente.ocupacionMadre || ''} onChange={handleChange} className="w-full bg-white border border-indigo-100 rounded-lg p-2 outline-none" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-indigo-400">Nombre del Padre</label>
                    <input name="nombrePadre" value={paciente.nombrePadre || ''} onChange={handleChange} className="w-full bg-white border border-indigo-100 rounded-lg p-2 outline-none" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-indigo-400">Edad Padre</label>
                    <input name="edadPadre" value={paciente.edadPadre || ''} onChange={handleChange} className="w-full bg-white border border-indigo-100 rounded-lg p-2 outline-none" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-indigo-400">OcupaciÃ³n Padre</label>
                    <input name="ocupacionPadre" value={paciente.ocupacionPadre || ''} onChange={handleChange} className="w-full bg-white border border-indigo-100 rounded-lg p-2 outline-none" />
                  </div>
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
                    <label className="text-xs font-bold text-pink-400">OcupaciÃ³n</label>
                    <input name="ocupacion" value={paciente.ocupacion || ''} onChange={handleChange} className="w-full bg-white border border-pink-100 rounded-lg p-2 outline-none" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-pink-400">Nivel Educativo</label>
                    <input name="nivelEducativo" value={paciente.nivelEducativo || ''} onChange={handleChange} className="w-full bg-white border border-pink-100 rounded-lg p-2 outline-none" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-pink-400">MÃ©dico Tratante</label>
                    <input name="medicoTratante" value={paciente.medicoTratante || ''} onChange={handleChange} className="w-full bg-white border border-pink-100 rounded-lg p-2 outline-none" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-pink-400">Nombre AcompaÃ±ante</label>
                    <input name="acompanante" value={paciente.acompanante || ''} onChange={handleChange} className="w-full bg-white border border-pink-100 rounded-lg p-2 outline-none" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-pink-400">TelÃ©fono AcompaÃ±ante</label>
                    <input name="telefonoAcompanante" value={paciente.telefonoAcompanante || ''} onChange={handleChange} className="w-full bg-white border border-pink-100 rounded-lg p-2 outline-none" />
                  </div>
                  <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-pink-100 pt-4">
                    <div>
                      <label className="text-xs font-bold text-pink-400">Nombre del BebÃ© (si aplica)</label>
                      <input name="nombreBebe" value={paciente.nombreBebe || ''} onChange={handleChange} className="w-full bg-white border border-pink-100 rounded-lg p-2 outline-none" />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-pink-400">Estado Embarazo</label>
                      <select name="estadoEmbarazo" value={paciente.estadoEmbarazo || ''} onChange={handleChange} className="w-full bg-white border border-pink-100 rounded-lg p-2 outline-none text-sm">
                        <option value="">Seleccione...</option>
                        <option value="gestacion">En gestaciÃ³n</option>
                        <option value="posparto">Posparto</option>
                      </select>
                    </div>
                  </div>
                  <div className="md:col-span-3 grid grid-cols-3 gap-4 border-t border-pink-100 pt-4">
                    <div>
                      <label className="text-xs font-bold text-pink-400 italic">FUM (Ult MenstruaciÃ³n)</label>
                      <input type="date" name="fum" value={paciente.fum || ''} onChange={handleChange} className="w-full bg-white border border-pink-100 rounded-lg p-2 outline-none text-xs" />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-pink-400 italic">Semanas GestaciÃ³n</label>
                      <input name="semanasGestacion" value={paciente.semanasGestacion || ''} onChange={handleChange} className="w-full bg-white border border-pink-100 rounded-lg p-2 outline-none text-xs" />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-pink-400 italic">Fecha Prob Parto</label>
                      <input type="date" name="fechaProbableParto" value={paciente.fechaProbableParto || ''} onChange={handleChange} className="w-full bg-white border border-pink-100 rounded-lg p-2 outline-none text-xs" />
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