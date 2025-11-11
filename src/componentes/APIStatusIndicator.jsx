import React, { useState, useEffect } from 'react';
import { testAPIConnection, API_CONFIG } from '../config/api';

const APIStatusIndicator = () => {
  const [status, setStatus] = useState('testing');
  const [showDetails, setShowDetails] = useState(false);
  const [visible, setVisible] = useState(true);
  const [lastChecked, setLastChecked] = useState(null);

  const checkConnection = async () => {
    setStatus('testing');
    const success = await testAPIConnection();
    setStatus(success ? 'connected' : 'disconnected');
    setLastChecked(new Date().toLocaleTimeString());
    
    // Si está conectado, ocultar después de 3 segundos
    if (success) {
      setTimeout(() => {
        setVisible(false);
      }, 3000);
    }
  };

  useEffect(() => {
    checkConnection();
  }, []);

  // No mostrar nada si no está visible
  if (!visible) {
    return null;
  }

  if (status === 'connected') {
    return (
      <div className="fixed top-4 right-4 bg-green-100 border border-green-400 text-green-700 px-3 py-2 rounded z-50">
        <div className="flex items-center gap-2">
          ✅ API Conectada: {API_CONFIG.BASE_URL}
          {lastChecked && <span className="text-xs">({lastChecked})</span>}
        </div>
      </div>
    );
  }

  if (status === 'disconnected') {
    return (
      <div className="fixed top-4 right-4 bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded z-50 max-w-sm">
        <div className="flex items-center gap-2">
          ❌ API Desconectada
          <button 
            onClick={() => setShowDetails(!showDetails)}
            className="text-xs underline hover:no-underline"
          >
            {showDetails ? 'Ocultar' : 'Detalles'}
          </button>
          <button 
            onClick={checkConnection}
            className="text-xs bg-red-200 hover:bg-red-300 px-2 py-1 rounded"
            disabled={status === 'testing'}
          >
            Reintentar
          </button>
        </div>
        {showDetails && (
          <div className="mt-2 text-xs">
            <div><strong>Intentando:</strong> {API_CONFIG.BASE_URL}/api/pacientes</div>
            <div className="mt-1"><strong>Pasos para resolver:</strong></div>
            <div>1. Verifica que el backend esté corriendo</div>
            <div>2. Abre una terminal en la carpeta Backend</div>
            <div>3. Ejecuta: <code className="bg-gray-200 px-1 rounded">npm start</code></div>
            <div>4. Debe mostrar: "🚀 Servidor corriendo en http://localhost:5000"</div>
            {lastChecked && <div className="mt-1">Última verificación: {lastChecked}</div>}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="fixed top-4 right-4 bg-blue-100 border border-blue-400 text-blue-700 px-3 py-2 rounded z-50">
      <div className="flex items-center gap-2">
        <div className="animate-spin">🔄</div>
        <span>Probando conectividad con API...</span>
      </div>
    </div>
  );
};

export default APIStatusIndicator;
