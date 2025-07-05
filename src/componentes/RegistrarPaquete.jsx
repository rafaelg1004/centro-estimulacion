import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export default function RegistrarPaquete() {
  const { id } = useParams(); // <-- este es el id del paciente si vienes de /paquetes/nuevo/:id
  const navigate = useNavigate();
  const [numeroFactura, setNumeroFactura] = useState("");
  const [clasesPagadas, setClasesPagadas] = useState(1);
  const [fechaPago, setFechaPago] = useState(""); // Nuevo estado
  const [paciente, setPaciente] = useState(null);

  useEffect(() => {
    if (id) {
      fetch(`/api/pacientes/${id}`)
        .then(res => res.json())
        .then(setPaciente);
    }
  }, [id]);

  const registrarPaquete = async (e) => {
    e.preventDefault();
    await fetch("/api/pagoPaquete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nino: id, numeroFactura, clasesPagadas, fechaPago }),
    });
    setNumeroFactura("");
    setClasesPagadas(1);
    setFechaPago("");
    alert("¡Paquete registrado!");
    navigate(`/pacientes/${id}`); // Redirige al detalle del paciente
  };

  if (!paciente) return <div className="p-4">Cargando datos del paciente...</div>;

  return (
    <form onSubmit={registrarPaquete} className="max-w-md mx-auto p-4 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Registrar paquete para {paciente.nombres}</h2>
      <input
        type="text"
        placeholder="Número de factura"
        value={numeroFactura}
        onChange={e => setNumeroFactura(e.target.value)}
        className="border p-2 mb-2 w-full rounded"
        required
      />
      <input
        type="number"
        placeholder="Clases pagadas"
        value={clasesPagadas}
        min={1}
        onChange={e => setClasesPagadas(e.target.value)}
        className="border p-2 mb-2 w-full rounded"
        required
      />
      <input
        type="date"
        placeholder="Fecha de pago"
        value={fechaPago}
        onChange={e => setFechaPago(e.target.value)}
        className="border p-2 mb-2 w-full rounded"
        required
      />
      <button className="bg-indigo-600 text-white px-4 py-2 rounded w-full" type="submit">
        Registrar paquete
      </button>
    </form>
  );
}