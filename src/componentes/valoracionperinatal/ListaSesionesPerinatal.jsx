import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiRequest } from "../../config/api";
import FirmaCanvas from "../valoraciondeingreso/FirmaCanvas";
import Swal from "sweetalert2";

export default function ListaSesionesPerinatal() {
  const { id } = useParams(); // id del paciente
  const navigate = useNavigate();
  const [sesiones, setSesiones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editIdx, setEditIdx] = useState(null);
  const [editData, setEditData] = useState({});

  useEffect(() => {
    async function fetchSesiones() {
      setLoading(true);
      const res = await apiRequest(`/sesiones-perinatal/paciente/${id}`);
      setSesiones(res || []);
      setLoading(false);
    }
    fetchSesiones();
  }, [id]);

  const handleEdit = (idx) => {
    setEditIdx(idx);
    setEditData({ ...sesiones[idx] });
  };

  const handleChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    // Verificar si ya existe una sesión activa (distinta a la que se está editando)
    const otraSesionActiva = sesiones.some((s, idx) => s.estado === 'activa' && idx !== editIdx);
    if (otraSesionActiva && editData.estado === 'activa') {
      await Swal.fire({
        icon: 'error',
        title: 'Ya existe una sesión activa',
        text: 'No puedes guardar porque ya hay otra sesión activa para este paciente.',
      });
      return;
    }
    await apiRequest(`/sesiones-perinatal/${editData._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editData),
    });
    setEditIdx(null);
    // Refrescar sesiones
    const res = await apiRequest(`/sesiones-perinatal/paciente/${id}`);
    setSesiones(res || []);
  };

  if (loading) return <div className="p-8 text-center">Cargando sesiones...</div>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow mt-8">
      <button
        onClick={() => navigate(`/pacientes-adultos/${id}`)}
        className="mb-4 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded transition"
      >
        ← Volver al paciente
      </button>
      <h2 className="text-2xl font-bold text-indigo-700 mb-4">Sesiones Activas del Paciente</h2>
      <table className="min-w-full border text-sm mb-4">
        <thead>
          <tr className="bg-indigo-100">
            <th className="px-2 py-1 border">Sesión</th>
            <th className="px-2 py-1 border">Fecha</th>
            <th className="px-2 py-1 border">Descripción</th>
            <th className="px-2 py-1 border">Firma Paciente</th>
            <th className="px-2 py-1 border">Estado</th>
            <th className="px-2 py-1 border">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {sesiones.map((s, idx) => (
            <tr key={s._id}>
              <td className="px-2 py-1 border">{s.nombreSesion}</td>
              <td className="px-2 py-1 border">
                {editIdx === idx ? (
                  <input
                    type="date"
                    name="fecha"
                    value={editData.fecha || ""}
                    onChange={handleChange}
                    className="border rounded p-1"
                  />
                ) : (
                  s.fecha || ""
                )}
              </td>
              <td className="px-2 py-1 border">
                {editIdx === idx ? (
                  <input
                    type="text"
                    name="descripcion"
                    value={editData.descripcion || ""}
                    onChange={handleChange}
                    className="border rounded p-1"
                  />
                ) : (
                  s.descripcion || ""
                )}
              </td>
              <td className="px-2 py-1 border">
                {editIdx === idx ? (
                  <FirmaCanvas
                    label="Firma del paciente"
                    name="firmaPaciente"
                    setFormulario={(campo, valor) => setEditData({ ...editData, [campo]: valor })}
                    formulario={editData}
                    onFirmaChange={() => {}}
                  />
                ) : (
                  s.firmaPaciente ? (
                    <img src={s.firmaPaciente} alt="Firma" style={{ height: 40, border: "1px solid #ccc" }} />
                  ) : ""
                )}
              </td>
              <td className="px-2 py-1 border">
                {editIdx === idx ? (
                  <select
                    name="estado"
                    value={editData.estado || ""}
                    onChange={handleChange}
                    className="border rounded p-1"
                  >
                    <option value="">Seleccione</option>
                    <option value="activa">Activa</option>
                    <option value="finalizada">Finalizada</option>
                    <option value="pendiente">Pendiente</option>
                  </select>
                ) : (
                  s.estado
                )}
              </td>
              <td className="px-2 py-1 border">
                {editIdx === idx ? (
                  <>
                    <button onClick={handleSave} className="bg-green-500 text-white px-2 py-1 rounded mr-2">Guardar</button>
                    <button onClick={() => setEditIdx(null)} className="bg-gray-300 px-2 py-1 rounded">Cancelar</button>
                  </>
                ) : (
                  <button onClick={() => handleEdit(idx)} className="bg-indigo-500 text-white px-2 py-1 rounded">Editar</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 