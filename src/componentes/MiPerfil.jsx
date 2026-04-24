import React, { useState, useEffect, useRef } from "react";
import { apiRequest } from "../config/api";
import Swal from "sweetalert2";
import SignaturePad from "react-signature-canvas";

export default function MiPerfil() {
  const [perfil, setPerfil] = useState(null);
  const [guardando, setGuardando] = useState(false);
  const [modoFirma, setModoFirma] = useState("dibujar"); // "dibujar" | "imagen"
  const sigPadRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    apiRequest("/auth/me")
      .then((data) => setPerfil(data))
      .catch(() => Swal.fire("Error", "No se pudo cargar el perfil", "error"));
  }, []);

  const handleGuardarFirmaCanvas = async () => {
    const sigPad = sigPadRef.current;
    if (!sigPad || sigPad.isEmpty()) {
      Swal.fire("Aviso", "Primero dibuja la firma en el panel.", "warning");
      return;
    }
    const base64 = sigPad.toDataURL("image/png");
    await guardarFirma(base64);
  };

  const handleArchivoFirma = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (ev) => {
      await guardarFirma(ev.target.result);
    };
    reader.readAsDataURL(file);
  };

  const guardarFirma = async (base64) => {
    setGuardando(true);
    try {
      const data = await apiRequest("/auth/me", {
        method: "PUT",
        body: JSON.stringify({ firmaUrl: base64 }),
      });
      setPerfil((prev) => ({ ...prev, firmaUrl: data.firmaUrl }));
      Swal.fire(
        "Guardado",
        "Firma almacenada correctamente. Aparecerá automáticamente en los PDFs.",
        "success",
      );
    } catch (err) {
      Swal.fire(
        "Error",
        "No se pudo guardar la firma: " + err.message,
        "error",
      );
    } finally {
      setGuardando(false);
    }
  };

  const handleEliminarFirma = async () => {
    const result = await Swal.fire({
      title: "¿Eliminar firma?",
      text: "Se eliminará la firma estampada del perfil.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#e53e3e",
      cancelButtonColor: "#6366f1",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });
    if (!result.isConfirmed) return;
    setGuardando(true);
    try {
      await apiRequest("/auth/me", {
        method: "PUT",
        body: JSON.stringify({ firmaUrl: null }),
      });
      setPerfil((prev) => ({ ...prev, firmaUrl: null }));
      Swal.fire("Eliminada", "La firma fue eliminada del perfil.", "success");
    } catch (err) {
      Swal.fire("Error", err.message, "error");
    } finally {
      setGuardando(false);
    }
  };

  if (!perfil)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-indigo-600"></div>
        <p className="mt-4 text-indigo-700 font-bold">Cargando perfil...</p>
      </div>
    );

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold text-indigo-800">Mi Perfil</h1>

      {/* Datos del usuario */}
      <div className="bg-white rounded-2xl shadow p-5 space-y-2 border border-indigo-100">
        <h2 className="text-sm font-black text-indigo-400 uppercase tracking-widest mb-3">
          Datos del usuario
        </h2>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <span className="font-semibold text-gray-500">Nombre</span>
            <p className="text-gray-800 font-bold">{perfil.nombre}</p>
          </div>
          <div>
            <span className="font-semibold text-gray-500">Usuario</span>
            <p className="text-gray-800">{perfil.usuario || perfil.email}</p>
          </div>
          <div>
            <span className="font-semibold text-gray-500">Rol</span>
            <p className="text-gray-800 capitalize">{perfil.rol}</p>
          </div>
          <div>
            <span className="font-semibold text-gray-500">Registro Médico</span>
            <p className="text-gray-800">
              {perfil.registroMedico || "No especificado"}
            </p>
          </div>
        </div>
      </div>

      {/* Firma estampada */}
      <div className="bg-white rounded-2xl shadow p-5 border border-indigo-100 space-y-4">
        <h2 className="text-sm font-black text-indigo-400 uppercase tracking-widest">
          Firma Estampada para PDFs
        </h2>
        <p className="text-xs text-gray-500">
          Esta firma se insertará automáticamente en todos los reportes PDF
          generados con tu usuario. Solo aparece si inicias sesión con tus
          credenciales personales.
        </p>

        {/* Firma actual */}
        {perfil.firmaUrl ? (
          <div className="space-y-2">
            <p className="text-xs font-semibold text-green-700 uppercase tracking-wide">
              Firma actual guardada:
            </p>
            <div className="border-2 border-green-200 rounded-xl p-3 bg-green-50 flex items-center justify-center">
              <img
                src={perfil.firmaUrl}
                alt="Firma actual"
                className="max-h-24 object-contain"
              />
            </div>
            <button
              onClick={handleEliminarFirma}
              disabled={guardando}
              className="text-sm text-red-600 hover:underline"
            >
              Eliminar firma
            </button>
          </div>
        ) : (
          <p className="text-xs text-amber-600 bg-amber-50 rounded-lg p-2 border border-amber-200">
            No tienes firma guardada. Los PDFs mostrarán el espacio de firma en
            blanco.
          </p>
        )}

        {/* Selector de modo */}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setModoFirma("dibujar")}
            className={`px-4 py-2 text-sm font-bold rounded-lg border transition-colors ${modoFirma === "dibujar" ? "bg-indigo-600 text-white border-indigo-600" : "bg-white text-indigo-700 border-indigo-300 hover:bg-indigo-50"}`}
          >
            Dibujar firma
          </button>
          <button
            type="button"
            onClick={() => setModoFirma("imagen")}
            className={`px-4 py-2 text-sm font-bold rounded-lg border transition-colors ${modoFirma === "imagen" ? "bg-indigo-600 text-white border-indigo-600" : "bg-white text-indigo-700 border-indigo-300 hover:bg-indigo-50"}`}
          >
            Subir imagen
          </button>
        </div>

        {modoFirma === "dibujar" && (
          <div className="space-y-2">
            <p className="text-xs text-gray-500">
              Dibuja tu firma en el recuadro con el mouse o el dedo:
            </p>
            <div className="border-2 border-dashed border-indigo-300 rounded-xl bg-gray-50 aspect-[3/1]">
              <SignaturePad
                ref={sigPadRef}
                canvasProps={{ className: "w-full h-full rounded-xl" }}
              />
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => sigPadRef.current?.clear()}
                className="text-sm text-gray-500 hover:underline"
              >
                Limpiar
              </button>
              <button
                type="button"
                onClick={handleGuardarFirmaCanvas}
                disabled={guardando}
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg text-sm disabled:opacity-50"
              >
                {guardando ? "Guardando..." : "Guardar firma"}
              </button>
            </div>
          </div>
        )}

        {modoFirma === "imagen" && (
          <div className="space-y-2">
            <p className="text-xs text-gray-500">
              Sube una imagen de tu firma (PNG con fondo transparente
              recomendado). Se guardará directamente en la base de datos.
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={handleArchivoFirma}
              disabled={guardando}
              className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-bold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
            />
            {guardando && (
              <p className="text-xs text-indigo-600 font-semibold">
                Guardando firma en base de datos...
              </p>
            )}
          </div>
        )}
      </div>

      {/* Nota legal */}
      <div className="text-xs text-gray-400 bg-gray-50 rounded-xl p-3 border border-gray-200">
        Conforme a la <strong>Ley 527 de 1999</strong> de Colombia, los
        documentos firmados electrónicamente mediante acceso seguro con usuario
        y contraseña personal tienen plena validez legal. Cada PDF generado
        incluirá automáticamente la leyenda de firma electrónica con fecha y
        hora.
      </div>
    </div>
  );
}
