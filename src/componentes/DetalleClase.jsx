import { useEffect, useState, useRef } from "react";
import SignaturePad from "react-signature-canvas";
import { useNavigate, useParams } from "react-router-dom";
import { UserPlusIcon, TrashIcon, DocumentCheckIcon, PencilSquareIcon, CreditCardIcon } from "@heroicons/react/24/solid";
import Swal from "sweetalert2";
import { apiRequest } from "../config/api";

export default function DetalleClase() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [clase, setClase] = useState(null);
  const [ninos, setNinos] = useState([]);
  const [ninoId, setNinoId] = useState("");
  const [firmaNinoId, setFirmaNinoId] = useState("");
  const [busquedaNino, setBusquedaNino] = useState("");
  const [showSugerencias, setShowSugerencias] = useState(false);
  const sigRef = useRef();
  const [paquetes, setPaquetes] = useState([]);
  const [facturaAgregar, setFacturaAgregar] = useState("");
  const [asignarPaqueteId, setAsignarPaqueteId] = useState("");
  const [paquetesParaAsignar, setPaquetesParaAsignar] = useState([]);
  const [facturaAsignar, setFacturaAsignar] = useState("");

  useEffect(() => {
    apiRequest(`/clases/${id}`)
      .then(setClase);
  }, [id]);

  useEffect(() => {
    if (ninoId) {
      apiRequest(`/pagoPaquete/por-nino/${ninoId}`)
        .then(setPaquetes);
    } else {
      setPaquetes([]);
      setFacturaAgregar("");
    }
  }, [ninoId]);

  useEffect(() => {
    if (asignarPaqueteId) {
      apiRequest(`/pagoPaquete/por-nino/${asignarPaqueteId}`)
        .then(setPaquetesParaAsignar);
    } else {
      setPaquetesParaAsignar([]);
      setFacturaAsignar("");
    }
  }, [asignarPaqueteId]);

  useEffect(() => {
    if (busquedaNino.trim() === "") {
      setNinos([]);
      return;
    }
    const delayDebounce = setTimeout(() => {
      apiRequest(`/pacientes/buscar?q=${encodeURIComponent(busquedaNino)}`)
        .then(data => {
          if (Array.isArray(data)) setNinos(data);
          else setNinos([]);
        })
        .catch(() => setNinos([]));
    }, 400); // Espera 400ms después de dejar de escribir

    return () => clearTimeout(delayDebounce);
  }, [busquedaNino]);

  const agregarNino = async () => {
    // Permitir agregar sin paquete si no hay factura seleccionada
    if (!facturaAgregar) {
      const result = await Swal.fire({
        title: '¿Agregar sin paquete?',
        text: 'Este paciente no tiene paquete asignado. Se mostrará en rojo hasta que se le asigne un paquete.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#f59e0b',
        cancelButtonColor: '#6b7280',
        confirmButtonText: 'Sí, agregar',
        cancelButtonText: 'Cancelar'
      });
      
      if (!result.isConfirmed) return;
    } else {
      // Si hay factura seleccionada, validar que tenga clases disponibles
      const paquete = paquetes.find(p => p.numeroFactura === facturaAgregar);
      if (!paquete || paquete.clasesUsadas >= paquete.clasesPagadas) {
        alert("No quedan clases disponibles en este paquete/factura.");
        return;
      }
    }
    
    await apiRequest(`/clases/${id}/agregar-nino`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ninoId, numeroFactura: facturaAgregar || null }),
    });
    apiRequest(`/clases/${id}`)
      .then(setClase);
    setNinoId("");
    setBusquedaNino("");
    setFacturaAgregar("");
    setPaquetes([]);
  };

  const guardarFirmaNino = async () => {
    if (!firmaNinoId) {
      alert("Selecciona un niño para firmar");
      return;
    }
    const firma = sigRef.current.toDataURL("image/png");
    const numeroFactura = getFacturaDeNino(firmaNinoId);

    await apiRequest(`/clases/${id}/firma-nino`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ninoId: firmaNinoId, firma, numeroFactura }),
    });

    apiRequest(`/clases/${id}`)
      .then(setClase);

    setFirmaNinoId("");
    sigRef.current.clear();
  };

  const eliminarNinoDeClase = async (ninoId) => {
    const result = await Swal.fire({
      title: "¿Deseas eliminar este niño de la sesión?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#ef4444", // rojo pastel
      cancelButtonColor: "#d1d5db", // gris pastel
    });
    if (!result.isConfirmed) return;
    await apiRequest(`/clases/${id}/eliminar-nino`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ninoId }),
    });
    apiRequest(`/clases/${id}`)
      .then(setClase);
  };

  const getFacturaDeNino = (ninoId) => {
    const n = clase.ninos.find(n =>
      (n.nino._id || n.nino) === ninoId
    );
    return n?.numeroFactura || "";
  };

  const asignarPaquete = async () => {
    if (!facturaAsignar) {
      alert("Selecciona una factura/paquete");
      return;
    }
    
    const paquete = paquetesParaAsignar.find(p => p.numeroFactura === facturaAsignar);
    if (!paquete || paquete.clasesUsadas >= paquete.clasesPagadas) {
      alert("No quedan clases disponibles en este paquete/factura.");
      return;
    }

    await apiRequest(`/clases/${id}/asignar-paquete`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ninoId: asignarPaqueteId, numeroFactura: facturaAsignar }),
    });
    
    apiRequest(`/clases/${id}`)
      .then(setClase);
    
    setAsignarPaqueteId("");
    setFacturaAsignar("");
    setPaquetesParaAsignar([]);
    
    Swal.fire({
      title: '¡Paquete asignado!',
      text: 'El paquete ha sido asignado correctamente al paciente.',
      icon: 'success',
      timer: 2000,
      showConfirmButton: false
    });
  };

  if (!clase) return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-indigo-600 border-solid"></div>
      <span className="mt-6 text-indigo-700 font-bold text-lg">Cargando sesión...</span>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-pink-100 to-green-100 py-10 px-2">
      <div className="max-w-2xl mx-auto p-6 bg-white rounded-3xl shadow-2xl border border-indigo-100">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-3xl font-bold text-indigo-700 drop-shadow">{clase.nombre}</h2>
          <button
            onClick={() => navigate(`/clases/editar/${id}`)}
            className="flex items-center gap-2 bg-yellow-200 hover:bg-yellow-300 text-yellow-800 font-bold px-4 py-2 rounded-xl shadow transition"
            title="Editar clase"
          >
            <PencilSquareIcon className="h-5 w-5" />
            Editar
          </button>
        </div>
        <p className="mb-2 text-indigo-500 font-semibold">Fecha: {clase.fecha}</p>
        <p className="mb-6 text-gray-700">{clase.descripcion}</p>
        <div className="bg-indigo-50 border rounded-2xl p-6 mb-8 shadow">
          <h3 className="font-bold text-lg text-indigo-800 mb-4">Agregar niño a la clase</h3>
          <div className="mb-4">
            <label className="block mb-1 font-medium text-gray-700">Buscar y seleccionar niño:</label>
            <div className="relative flex items-center">
              <input
                type="text"
                placeholder="Buscar niño por nombre..."
                value={busquedaNino}
                onChange={e => {
                  setBusquedaNino(e.target.value);
                  setShowSugerencias(true);
                }}
                onFocus={() => setShowSugerencias(true)}
                onBlur={() => setTimeout(() => setShowSugerencias(false), 100)}
                className="border border-indigo-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-xl px-4 py-2 w-full transition outline-none shadow-sm bg-indigo-50"
                autoComplete="off"
              />
              <select
                value={ninoId}
                onChange={e => {
                  setNinoId(e.target.value);
                  setFacturaAgregar("");
                }}
                className="border border-indigo-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-xl px-4 py-2 w-full transition outline-none shadow-sm mt-2 bg-indigo-50"
                style={{ minWidth: "160px" }}
              >
                <option value="">Selecciona</option>
                {ninos.map(n => (
                  <option key={n._id} value={n._id}>{n.nombres}</option>
                ))}
              </select>
              {showSugerencias && busquedaNino && ninos.length > 0 && (
                <ul className="absolute left-0 top-full mt-1 w-full bg-white border border-indigo-300 rounded shadow-lg z-20 max-h-40 overflow-y-auto">
                  {ninos.map(n => (
                    <li
                      key={n._id}
                      className="px-3 py-2 hover:bg-indigo-100 cursor-pointer transition"
                      onMouseDown={() => {
                        setNinoId(n._id);
                        setBusquedaNino(n.nombres);
                        setShowSugerencias(false);
                        setFacturaAgregar("");
                      }}
                    >
                      {n.nombres}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            {ninoId && (
              <select
                value={facturaAgregar}
                onChange={e => setFacturaAgregar(e.target.value)}
                className="border p-2 mb-2 w-full rounded-xl mt-2 bg-green-50"
              >
                <option value="">Selecciona una factura/paquete</option>
                {paquetes.filter(p => (p.clasesUsadas || 0) < (p.clasesPagadas || 0)).map(p => (
                  <option key={p._id} value={p.numeroFactura}>
                    {p.numeroFactura} (usadas: {p.clasesUsadas}/{p.clasesPagadas})
                  </option>
                ))}
              </select>
            )}
            {ninoId && paquetes.filter(p => (p.clasesUsadas || 0) < (p.clasesPagadas || 0)).length === 0 && (
              <div className="text-red-600 text-sm mb-2">
                {paquetes.length === 0 
                  ? "Este niño no tiene paquetes/facturas disponibles." 
                  : "Todos los paquetes de este niño ya están utilizados completamente."
                }
              </div>
            )}
            <button
              onClick={agregarNino}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-xl mt-3 shadow flex items-center gap-2 text-lg transition"
            >
              <UserPlusIcon className="h-5 w-5" /> Agregar
            </button>
          </div>
        </div>
        <h3 className="font-semibold mb-2 text-indigo-700">Niños en la clase</h3>
        <ul className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          {clase.ninos.map(n => {
            const tienePaquete = n.numeroFactura && n.numeroFactura.trim() !== '';
            return (
              <li key={n.nino._id || n.nino} className={`border rounded-2xl shadow p-4 flex flex-col gap-2 relative ${
                tienePaquete 
                  ? 'bg-white border-green-200' 
                  : 'bg-red-50 border-red-300'
              }`}>
                <div className="flex items-center gap-2">
                  <span className={`font-semibold ${
                    tienePaquete ? 'text-indigo-700' : 'text-red-700'
                  }`}>
                    {n.nino.nombres || n.nombres}
                  </span>
                  {tienePaquete ? (
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded ml-2">
                      ✓ Factura: {n.numeroFactura}
                    </span>
                  ) : (
                    <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded ml-2">
                      ⚠ Sin paquete
                    </span>
                  )}
                </div>
                {n.firma && (
                  <img src={n.firma} alt="firma" className="border rounded max-h-12 mt-2" />
                )}
                <div className="absolute top-2 right-2 flex gap-1">
                  {!tienePaquete && (
                    <button
                      onClick={() => setAsignarPaqueteId(n.nino._id || n.nino)}
                      className="bg-yellow-200 hover:bg-yellow-300 text-yellow-800 rounded-full p-2 shadow"
                      title="Asignar paquete"
                    >
                      <CreditCardIcon className="h-5 w-5" />
                    </button>
                  )}
                  <button
                    onClick={() => eliminarNinoDeClase(n.nino._id || n.nino)}
                    className="bg-pink-200 hover:bg-pink-300 text-pink-800 rounded-full p-2 shadow"
                    title="Eliminar niño de la sesión"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
        
        {/* Sección para asignar paquetes */}
        {asignarPaqueteId && (
          <div className="bg-yellow-50 border border-yellow-300 rounded-2xl p-6 mb-6 shadow">
            <h3 className="font-bold text-lg text-yellow-800 mb-4">Asignar Paquete</h3>
            <div className="mb-4">
              <label className="block mb-2 font-medium text-gray-700">Paciente seleccionado:</label>
              <p className="text-yellow-700 font-semibold">
                {clase.ninos.find(n => (n.nino._id || n.nino) === asignarPaqueteId)?.nino.nombres || clase.ninos.find(n => (n.nino._id || n.nino) === asignarPaqueteId)?.nombres}
              </p>
            </div>
            <div className="mb-4">
              <label className="block mb-2 font-medium text-gray-700">Selecciona un paquete:</label>
              <select
                value={facturaAsignar}
                onChange={e => setFacturaAsignar(e.target.value)}
                className="border border-yellow-300 focus:border-yellow-500 focus:ring-yellow-500 rounded-xl px-4 py-2 w-full mb-4 transition outline-none shadow-sm bg-white"
              >
                <option value="">Selecciona una factura/paquete</option>
                {paquetesParaAsignar.filter(p => (p.clasesUsadas || 0) < (p.clasesPagadas || 0)).map(p => (
                  <option key={p._id} value={p.numeroFactura}>
                    {p.numeroFactura} (usadas: {p.clasesUsadas}/{p.clasesPagadas})
                  </option>
                ))}
              </select>
            </div>
            {paquetesParaAsignar.filter(p => (p.clasesUsadas || 0) < (p.clasesPagadas || 0)).length === 0 && (
              <div className="text-red-600 text-sm mb-4">
                {paquetesParaAsignar.length === 0 
                  ? "Este paciente no tiene paquetes disponibles." 
                  : "Todos los paquetes de este paciente ya están utilizados completamente."
                }
              </div>
            )}
            <div className="flex gap-2">
              <button
                onClick={asignarPaquete}
                disabled={!facturaAsignar || paquetesParaAsignar.filter(p => (p.clasesUsadas || 0) < (p.clasesPagadas || 0)).length === 0}
                className="bg-yellow-500 hover:bg-yellow-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-4 py-2 rounded-xl shadow flex items-center gap-2 text-lg transition"
              >
                <CreditCardIcon className="h-5 w-5" /> Asignar Paquete
              </button>
              <button
                onClick={() => {
                  setAsignarPaqueteId("");
                  setFacturaAsignar("");
                  setPaquetesParaAsignar([]);
                }}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-xl shadow text-lg transition"
              >
                Cancelar
              </button>
            </div>
          </div>
        )}
        
        <h3 className="font-semibold mb-2 mt-6 text-indigo-700">Firma de niño</h3>
        <div className="bg-green-50 border rounded-2xl p-6 mb-6 shadow">
          <label className="block mb-2 font-medium text-gray-700">Selecciona un niño para firmar:</label>
          <select
            value={firmaNinoId}
            onChange={e => setFirmaNinoId(e.target.value)}
            className="border border-indigo-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-xl px-4 py-2 w-full mb-4 transition outline-none shadow-sm bg-indigo-50"
          >
            <option value="">Selecciona un niño para firmar</option>
            {clase.ninos.filter(n => !n.firma).map(n => (
              <option key={n.nino._id || n.nino} value={n.nino._id || n.nino}>
                {n.nino.nombres || n.nombres}
              </option>
            ))}
          </select>
          <div className="border rounded bg-white mb-4">
            <SignaturePad ref={sigRef} canvasProps={{ className: "w-full h-40" }} />
          </div>
          <button
            onClick={guardarFirmaNino}
            disabled={!firmaNinoId}
            className={`px-4 py-2 rounded-xl flex items-center gap-2 shadow text-lg transition ${firmaNinoId ? 'bg-indigo-600 hover:bg-indigo-700 text-white' : 'bg-gray-300 text-gray-600 cursor-not-allowed'}`}
          >
            <DocumentCheckIcon className="h-5 w-5" /> Guardar Firma del Niño
          </button>
          {clase.ninos.filter(n => !n.firma).length === 0 && (
            <p className="mt-3 text-sm text-green-700">✅ Todos los niños ya han firmado esta sesión.</p>
          )}
        </div>
      </div>
      <div className="max-w-2xl mx-auto mt-6 flex justify-center">
        <button
          type="button"
          onClick={() => navigate("/clases")}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold px-6 py-3 rounded-xl shadow transition flex items-center justify-center gap-2 text-lg"
        >
          Volver a lista de clases
        </button>
      </div>
    </div>
  );
}