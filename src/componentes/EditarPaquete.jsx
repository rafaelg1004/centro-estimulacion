import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiRequest } from '../config/api';
import Swal from 'sweetalert2';
import { ArrowLeftIcon, PencilSquareIcon } from '@heroicons/react/24/solid';

export default function EditarPaquete() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [paquete, setPaquete] = useState(null);
  const [formData, setFormData] = useState({
    numeroFactura: '',
    clasesPagadas: '',
    fechaPago: ''
  });
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const cargarPaquete = async () => {
      try {
        setCargando(true);
        const data = await apiRequest(`/pagoPaquete/${id}`);
        setPaquete(data);
        setFormData({
          numeroFactura: data.numeroFactura || '',
          clasesPagadas: data.clasesPagadas || '',
          fechaPago: data.fechaPago ? data.fechaPago.slice(0, 10) : ''
        });
      } catch (error) {
        console.error('Error al cargar paquete:', error);
        setError('No se pudo cargar la información del paquete');
      } finally {
        setCargando(false);
      }
    };

    cargarPaquete();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Validaciones
      if (!formData.numeroFactura.trim()) {
        Swal.fire('Error', 'El número de factura es obligatorio', 'error');
        return;
      }
      
      if (!formData.clasesPagadas || formData.clasesPagadas <= 0) {
        Swal.fire('Error', 'El número de clases pagadas debe ser mayor a 0', 'error');
        return;
      }
      
      if (parseInt(formData.clasesPagadas) < paquete.clasesUsadas) {
        Swal.fire('Error', `No puedes establecer menos clases pagadas (${formData.clasesPagadas}) que las ya usadas (${paquete.clasesUsadas})`, 'error');
        return;
      }

      await apiRequest(`/pagoPaquete/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          numeroFactura: formData.numeroFactura.trim(),
          clasesPagadas: parseInt(formData.clasesPagadas),
          fechaPago: formData.fechaPago
        })
      });

      Swal.fire({
        title: '¡Actualizado!',
        text: 'El paquete ha sido actualizado correctamente.',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false
      });

      // Navegar de vuelta
      navigate(-1);
    } catch (error) {
      console.error('Error al actualizar paquete:', error);
      
      let errorMessage = 'No se pudo actualizar el paquete. Inténtalo de nuevo.';
      
      if (error.message && error.message.includes('ya existe')) {
        errorMessage = 'Ya existe un paquete con este número de factura.';
      }
      
      Swal.fire({
        title: 'Error',
        text: errorMessage,
        icon: 'error',
        confirmButtonText: 'Cerrar'
      });
    }
  };

  if (cargando) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-indigo-100 via-pink-100 to-green-100">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-indigo-600 border-solid"></div>
        <span className="mt-6 text-indigo-700 font-bold text-lg">Cargando paquete...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-pink-100 to-green-100">
        <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md text-center">
          <h2 className="text-xl font-bold text-red-700 mb-2">Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-xl transition"
          >
            Volver
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-pink-100 to-green-100 py-10 px-2">
      <div className="max-w-2xl mx-auto p-6 bg-white rounded-3xl shadow-2xl border border-indigo-100">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold text-indigo-700 drop-shadow">Editar Paquete</h2>
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 bg-gray-500 hover:bg-gray-600 text-white font-bold px-4 py-2 rounded-xl shadow transition"
          >
            <ArrowLeftIcon className="h-5 w-5" />
            Volver
          </button>
        </div>

        {paquete && (
          <div className="mb-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
            <h3 className="font-semibold text-blue-800 mb-2">Información del Paciente</h3>
            <p className="text-blue-700">
              <strong>Paciente:</strong> {paquete.paciente?.nombres || 'No disponible'}
            </p>
            <p className="text-blue-700">
              <strong>Registro Civil:</strong> {paquete.paciente?.registroCivil || 'No disponible'}
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Número de Factura *
            </label>
            <input
              type="text"
              value={formData.numeroFactura}
              onChange={(e) => setFormData({ ...formData, numeroFactura: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
              placeholder="Ej: FAC-001-2024"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Clases Pagadas *
            </label>
            <input
              type="number"
              min="1"
              value={formData.clasesPagadas}
              onChange={(e) => setFormData({ ...formData, clasesPagadas: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
              placeholder="Ej: 10"
              required
            />
            {paquete && (
              <p className="text-sm text-gray-500 mt-1">
                Clases ya usadas: {paquete.clasesUsadas} | Mínimo permitido: {paquete.clasesUsadas}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fecha de Pago
            </label>
            <input
              type="date"
              value={formData.fechaPago}
              onChange={(e) => setFormData({ ...formData, fechaPago: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
            />
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-xl shadow transition flex items-center justify-center gap-2"
            >
              <PencilSquareIcon className="h-5 w-5" />
              Actualizar Paquete
            </button>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-6 py-3 border border-gray-300 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
