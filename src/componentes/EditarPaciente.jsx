import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { apiRequest } from "../config/api";

const EPS_LIST = [
  "Nueva EPS", "Sanitas EPS", "Sura EPS", "Famisanar EPS", "Aliansalud EPS: MinTrabajo",
  "Comfenalco Valle", "Salud Total EPS", "Capital Salud: MinTrabajo", "Compesar EPS: MinTrabajo",
  "EPS y Medicina Prepagada Suramericana S.A.: MinTrabajo", "EPS Servicio Occidental de Salud S.A.: MinTrabajo",
  "Comfenalco Antioquia", "Asfamilias", "Cafam", "Mutual Ser Eps", "Coosalud EPS: consultorsalud",
  "Saludcoop: Ministerio de Salud y Protección Social", "Coomeva EPS", "Salud Colpatria",
  "EPS Servicio Occidental de Salud (SOS)", "EPS Familiar de Colombia", "EPM Salud"
];

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

  const isNino = paciente && ['RC', 'TI', 'MS', 'AS', 'CD', 'CN', 'SC'].includes(paciente.tipoDocumentoIdentificacion);

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
                <label className="text-xs font-bold text-gray-400">Edad ({isNino ? 'meses' : 'años'})</label>
                <input name="edad" value={paciente.edad || ''} onChange={handleChange} className="w-full border-b-2 border-gray-100 p-2 focus:border-indigo-400 outline-none transition" />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-400">Aseguradora</label>
                <input name="aseguradora" value={paciente.aseguradora || ''} onChange={handleChange} className="w-full border-b-2 border-gray-100 p-2 focus:border-indigo-400 outline-none transition" />
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
                    <label className="text-xs font-bold text-indigo-400">Nombre del Padre</label>
                    <input name="nombrePadre" value={paciente.nombrePadre || ''} onChange={handleChange} className="w-full bg-white border border-indigo-100 rounded-lg p-2 outline-none" />
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
                    <label className="text-xs font-bold text-pink-400">Ocupación</label>
                    <input name="ocupacion" value={paciente.ocupacion || ''} onChange={handleChange} className="w-full bg-white border border-pink-100 rounded-lg p-2 outline-none" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-pink-400">Acompañante</label>
                    <input name="acompanante" value={paciente.acompanante || ''} onChange={handleChange} className="w-full bg-white border border-pink-100 rounded-lg p-2 outline-none" />
                  </div>
                  <div className="md:col-span-3 grid grid-cols-3 gap-4 border-t border-pink-100 pt-4">
                    <div>
                      <label className="text-xs font-bold text-pink-400 italic">FUM (Ult Menstruación)</label>
                      <input type="date" name="fum" value={paciente.fum || ''} onChange={handleChange} className="w-full bg-white border border-pink-100 rounded-lg p-2 outline-none text-xs" />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-pink-400 italic">Semanas Gestación</label>
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