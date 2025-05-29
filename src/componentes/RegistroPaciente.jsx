import React, { useState, useRef } from "react";

const RegistroPaciente = () => {
  const [form, setForm] = useState({
    nombre: "",
    edad: "",
    procedimiento: "",
    // Nuevos campos:
    problemasSueno: "",
    descripcionSueno: "",
    duermeCon: "",
    patronSueno: "",
    pesadillas: "",
    siesta: "",
    dificultadesComer: "",
    motivoComida: "",
    problemasComer: "",
    detalleProblemasComer: "",
    alimentosPreferidos: "",
    alimentosNoLeGustan: "",
    viveConPadres: "",
    permaneceCon: "",
    prefiereA: "",
    relacionHermanos: "",
    emociones: "",
    juegaCon: "",
    juegosPreferidos: "",
    relacionDesconocidos: "",
    rutinaDiaria: "",
  });

  const canvasRef = useRef(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    const firmaData = canvas.toDataURL();

    const datosCompletos = {
      ...form,
      firma: firmaData,
    };

   fetch("https://centro-backend-production.up.railway.app/api/registro", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify(datosCompletos),
})
  .then((res) => res.json())
  .then((data) => {
    alert("Registro guardado en la base de datos.");
    setForm({ nombre: "", edad: "", procedimiento: "" });

    // Limpiar firma también
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  })
  .catch((err) => {
    alert("Error al guardar el registro.");
    console.error(err);
  });
  };

  const limpiarFirma = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const dibujarFirma = (e) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const comenzarFirma = (e) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.beginPath();
    dibujarFirma(e);
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 500, margin: "auto" }}>
      <h2>Registro de Paciente</h2>

      <label>Nombre:</label>
      <input
        type="text"
        name="nombre"
        value={form.nombre}
        onChange={handleChange}
        required
      />

      <label>Edad:</label>
      <input
        type="number"
        name="edad"
        value={form.edad}
        onChange={handleChange}
        required
      />

      <label>Procedimiento:</label>
      <input
        type="text"
        name="procedimiento"
        value={form.procedimiento}
        onChange={handleChange}
        required
      />

      <label>Firma del paciente:</label>
      <canvas
        ref={canvasRef}
        width={400}
        height={150}
        style={{ border: "1px solid #000", marginBottom: 10 }}
        onMouseDown={comenzarFirma}
        onMouseMove={(e) => {
          if (e.buttons === 1) dibujarFirma(e);
        }}
      />

      <button type="button" onClick={limpiarFirma}>
        Limpiar firma
      </button>

      <br />
      <br />
      <button type="submit">Guardar registro</button>
    </form>
  );
};

export default RegistroPaciente;
