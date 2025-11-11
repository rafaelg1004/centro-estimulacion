import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiRequest, API_ENDPOINTS } from '../config/api';

const GenerarRIPS = () => {
  const navigate = useNavigate();
  const [facturaData, setFacturaData] = useState({
    numFactura: '',
    pacienteIds: [],
    fechaInicio: '',
    fechaFin: ''
  });
  const [pacientes, setPacientes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [resultado, setResultado] = useState(null);
  const [error, setError] = useState('');
  const [config, setConfig] = useState(null);

  // Cargar configuración al montar el componente
  useEffect(() => {
    cargarConfiguracion();
    cargarPacientes();
  }, []);

  const cargarConfiguracion = async () => {
    try {
      const response = await apiRequest('/rips/config');
      setConfig(response.data);
    } catch (error) {
      console.error('Error cargando configuración:', error);
    }
  };

  const cargarPacientes = async () => {
    try {
      // Cargar pacientes niños
      const responseNinos = await apiRequest(API_ENDPOINTS.PACIENTES);
      // Cargar pacientes adultos
      const responseAdultos = await apiRequest('/pacientes-adultos');

      // Combinar ambos arrays y agregar tipo
      const pacientesNinos = responseNinos.map(p => ({ ...p, tipo: 'niño' }));
      const pacientesAdultos = responseAdultos.map(p => ({ ...p, tipo: 'adulto' }));

      const todosPacientes = [...pacientesNinos, ...pacientesAdultos];
      setPacientes(todosPacientes);
    } catch (error) {
      console.error('Error cargando pacientes:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFacturaData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePacienteChange = (pacienteId) => {
    setFacturaData(prev => ({
      ...prev,
      pacienteIds: prev.pacienteIds.includes(pacienteId)
        ? prev.pacienteIds.filter(id => id !== pacienteId)
        : [...prev.pacienteIds, pacienteId]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResultado(null);

    try {
      const response = await apiRequest('/rips/generate', {
        method: 'POST',
        body: JSON.stringify(facturaData)
      });
      setResultado(response);
    } catch (error) {
      setError(error.message || 'Error generando RIPS');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const descargarRIPS = () => {
    if (!resultado?.data?.rips) return;

    const dataStr = JSON.stringify(resultado.data.rips, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);

    const exportFileDefaultName = `RIPS_${facturaData.numFactura}_${new Date().toISOString().split('T')[0]}.json`;

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          Generar RIPS - Resolución 1036 de 2022
        </h2>
        <button
          onClick={() => navigate('/')}
          className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
        >
          ← Volver al Inicio
        </button>
      </div>

      {/* Información del prestador */}
      {config && (
        <div className="bg-blue-50 p-4 rounded-lg mb-6">
          <h3 className="text-lg font-semibold text-blue-800 mb-2">
            Información del Prestador
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">NIT:</span> {config.nitFacturador}
            </div>
            <div>
              <span className="font-medium">Código Prestador:</span> {config.codPrestador}
            </div>
            <div>
              <span className="font-medium">Resolución:</span> {config.versionResolucion}
            </div>
            <div>
              <span className="font-medium">Especialidad:</span> Fisioterapia Perinatal
            </div>
          </div>
        </div>
      )}

      {/* Formulario */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Datos de la factura */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Datos de la Factura
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Número de Factura *
              </label>
              <input
                type="text"
                name="numFactura"
                value={facturaData.numFactura}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ej: FE001-2024"
                required
              />
            </div>

            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha Inicio
                </label>
                <input
                  type="date"
                  name="fechaInicio"
                  value={facturaData.fechaInicio}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha Fin
                </label>
                <input
                  type="date"
                  name="fechaFin"
                  value={facturaData.fechaFin}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Selección de pacientes */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Seleccionar Pacientes
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-60 overflow-y-auto">
            {pacientes.map((paciente) => (
              <label key={paciente._id} className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded cursor-pointer">
                <input
                  type="checkbox"
                  checked={facturaData.pacienteIds.includes(paciente._id)}
                  onChange={() => handlePacienteChange(paciente._id)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <div className="text-sm">
                  <div className="font-medium">{paciente.nombres} {paciente.apellidos}</div>
                  <div className="text-gray-500">
                    {paciente.tipoDocumento} {paciente.numeroDocumento}
                  </div>
                  <div className="text-xs text-blue-600 capitalize">
                    {paciente.tipo}
                  </div>
                </div>
              </label>
            ))}
          </div>

          {pacientes.length === 0 && (
            <p className="text-gray-500 text-center py-4">
              No hay pacientes registrados
            </p>
          )}

          {pacientes.length > 0 && (
            <div className="mt-4 text-sm text-gray-600 bg-blue-50 p-3 rounded">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="font-medium">Total pacientes:</span> {pacientes.length}
                </div>
                <div>
                  <span className="font-medium">Niños:</span> {pacientes.filter(p => p.tipo === 'niño').length}
                </div>
                <div>
                  <span className="font-medium">Adultos:</span> {pacientes.filter(p => p.tipo === 'adulto').length}
                </div>
                <div>
                  <span className="font-medium">Seleccionados:</span> {facturaData.pacienteIds.length}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Botón de envío */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading || !facturaData.numFactura || facturaData.pacienteIds.length === 0}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Generando RIPS...' : 'Generar RIPS'}
          </button>
        </div>
      </form>

      {/* Mensaje de error */}
      {error && (
        <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Error generando RIPS
              </h3>
              <div className="mt-2 text-sm text-red-700">
                {error}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Resultado exitoso */}
      {resultado && resultado.success && (
        <div className="mt-6">
          {/* Resumen */}
          <div className="bg-green-50 p-4 rounded-lg mb-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-green-800">
                  RIPS generado exitosamente
                </h3>
                <div className="mt-2 text-sm text-green-700">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="font-medium">Factura:</span> {resultado.data.resumen.numFactura}
                    </div>
                    <div>
                      <span className="font-medium">Usuarios:</span> {resultado.data.resumen.usuariosProcesados}
                    </div>
                    <div>
                      <span className="font-medium">Consultas:</span> {resultado.data.resumen.totalConsultas}
                    </div>
                    <div>
                      <span className="font-medium">Procedimientos:</span> {resultado.data.resumen.totalProcedimientos}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Advertencias */}
          {resultado.data.warnings && resultado.data.warnings.length > 0 && (
            <div className="bg-yellow-50 p-4 rounded-lg mb-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-yellow-800">
                    Advertencias de validación
                  </h3>
                  <div className="mt-2 text-sm text-yellow-700">
                    <ul className="list-disc list-inside">
                      {resultado.data.warnings.map((warning, index) => (
                        <li key={index}>{warning}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Botón de descarga */}
          <div className="flex justify-end">
            <button
              onClick={descargarRIPS}
              className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              Descargar RIPS JSON
            </button>
          </div>

          {/* Vista previa (opcional) */}
          <details className="mt-4">
            <summary className="cursor-pointer text-sm text-gray-600 hover:text-gray-800">
              Ver estructura RIPS generada
            </summary>
            <pre className="mt-2 p-4 bg-gray-100 rounded text-xs overflow-x-auto max-h-96">
              {JSON.stringify(resultado.data.rips, null, 2)}
            </pre>
          </details>
        </div>
      )}
    </div>
  );
};

export default GenerarRIPS;