import React, { useEffect, useState } from 'react';

function VerRegistros({onEditar}) {
  const [registros, setRegistros] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('https://centro-backend-production.up.railway.app/api/registros')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setRegistros(data);
        } else {
          throw new Error('Respuesta inválida del servidor');
        }
      })
      .catch(error => {
        console.error('Error al obtener registros:', error);
        setError('No se pudieron cargar los registros.');
      });
  }, []);

  if (error) return <div>{error}</div>;

  return (
    <div style={{ maxWidth: 800, margin: "auto" }}>
      <h2>Registros</h2>
      {registros.map((registro, index) => (
        <><div key={index} style={{ border: "1px solid #ccc", padding: 10, marginBottom: 10 }}>
              <p><strong>Nombre:</strong> {registro.nombre}</p>
              <p><strong>Edad:</strong> {registro.edad}</p>
              <p><strong>Procedimiento:</strong> {registro.procedimiento}</p>
              {registro.firma && (
                  <div>
                      <strong>Firma:</strong><br />
                      <img src={registro.firma} alt="Firma" width={300} />
                  </div>

              )}
          </div><button onClick={() => onEditar(registro)}>Editar</button></>
      ))}
    </div>
  );
}

export default VerRegistros;
