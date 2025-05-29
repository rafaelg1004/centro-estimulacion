import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import RegistroPaciente from "./componentes/RegistroPaciente";
import VerRegistros from "./componentes/VerRegistros";
import ValoracionIngreso from "./componentes/ValoracionIngreso";
import ListaValoraciones from './componentes/ListaValoraciones';
import DetalleValoracion from './componentes/DetalleValoracion';

function App() {
  return (
    <BrowserRouter>
      <div>
        {/* Puedes quitar el nav si solo quieres mostrar valoraciones en la principal */}
        <Routes>
          <Route path="/" element={<ListaValoraciones />} />
          <Route path="/registros" element={<VerRegistros />} />
          <Route path="/valoracion" element={<ValoracionIngreso />} />
          <Route path="/valoraciones" element={<ListaValoraciones />} />
          <Route path="/valoraciones/:id" element={<DetalleValoracion />} />
          <Route path="/registro" element={<RegistroPaciente />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
