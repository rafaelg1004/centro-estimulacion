import React, { useState, useEffect } from 'react';
import { testAPIConnection, API_CONFIG } from '../config/api';

const APIStatusIndicator = () => {
  const [status, setStatus] = useState('testing');
  const [showDetails, setShowDetails] = useState(false);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    testAPIConnection().then(success => {
      setStatus(success ? 'connected' : 'disconnected');
      
      // Si está conectado, ocultar después de 3 segundos
      if (success) {
        setTimeout(() => {
          setVisible(false);
        }, 3000);
      }
    });
  }, []);

  // No mostrar nada si no está visible
  if (!visible) {
    return null;
  }

  if (status === 'connected') {
    return (
      <div className="fixed top-4 right-4 bg-green-100 border border-green-400 text-green-700 px-3 py-2 rounded z-50">
        ✅ API Conectada: {API_CONFIG.BASE_URL}
      </div>
    );
  }

  if (status === 'disconnected') {
    return (
      <div className="fixed top-4 right-4 bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded z-50">
        <div className="flex items-center gap-2">
          ❌ API Desconectada
          <button 
            onClick={() => setShowDetails(!showDetails)}
            className="text-xs underline"
          >
            {showDetails ? 'Ocultar' : 'Detalles'}
          </button>
        </div>
        {showDetails && (
          <div className="mt-2 text-xs">
            <div>Intentando: {API_CONFIG.BASE_URL}/api/pacientes</div>
            <div>1. Verifica que el backend esté corriendo</div>
            <div>2. cd Backend && npm start</div>
            <div>3. Debe mostrar: "🚀 Servidor corriendo en http://localhost:4000"</div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="fixed top-4 right-4 bg-blue-100 border border-blue-400 text-blue-700 px-3 py-2 rounded z-50">
      🔄 Probando conectividad...
    </div>
  );
};

export default APIStatusIndicator;
