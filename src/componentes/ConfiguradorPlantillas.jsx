import React, { useState, useEffect } from "react";
import { apiRequest } from "../config/api";
import Swal from "sweetalert2";

const TIPOS_CAMPO_OPCIONES = [
  { valor: "text", etiqueta: "Texto corto" },
  { valor: "textarea", etiqueta: "Texto largo (Párrafo)" },
  { valor: "number", etiqueta: "Número" },
  { valor: "select", etiqueta: "Lista desplegable (Opciones)" },
  { valor: "checkbox", etiqueta: "Casilla Sí / No" },
  { valor: "checkbox_group", etiqueta: "Selección múltiple" },
  { valor: "date", etiqueta: "Fecha" },
  { valor: "datetime-local", etiqueta: "Fecha y hora" },
  { valor: "cie10", etiqueta: "Diagnóstico CIE-10" },
  { valor: "cups", etiqueta: "Procedimiento CUPS" },
  { valor: "firma", etiqueta: "Firma digital" },
  { valor: "bloques_dinamicos", etiqueta: "Bloque de preguntas y tablas libres" },
];

const PROGRAMAS_OPCIONES = [
  "Pediatría",
  "Piso Pélvico",
  "Lactancia",
  "Perinatal",
  "General",
];

const PROGRAMAS_SEGUIMIENTO = [
  { clave: "PEDIATRIA", nombre: "Pediatría (Niños)" },
  { clave: "PISO_PELVICO", nombre: "Piso Pélvico" },
  { clave: "LACTANCIA", nombre: "Lactancia" },
  { clave: "PERINATAL", nombre: "Perinatal" },
];

function slugifyPath(texto) {
  return String(texto || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 48);
}

export default function ConfiguradorPlantillas() {
  const [pestana, setPestana] = useState("plantillas"); // "plantillas" | "seguimiento"

  // Estado Pestaña 1: Plantillas BD
  const [plantillas, setPlantillas] = useState([]);
  const [cargandoLista, setCargandoLista] = useState(true);
  const [sincronizando, setSincronizando] = useState(false);

  // Editor visual de plantilla (null = cerrado)
  const [editorAbierto, setEditorAbierto] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false); // false = crear, true = editar
  const [editId, setEditId] = useState(null);
  const [guardandoPlantilla, setGuardandoPlantilla] = useState(false);
  const [formPlantilla, setFormPlantilla] = useState({
    codigo: "",
    nombre: "",
    tipo_programa: "Pediatría",
    descripcion: "",
    secciones: [],
  });

  // Estado Pestaña 2: Preguntas y Tablas de Seguimiento por Programa
  const [programaSeg, setProgramaSeg] = useState("PEDIATRIA");
  const [bloquesSeg, setBloquesSeg] = useState([]);
  const [cargandoBloques, setCargandoBloques] = useState(false);
  const [guardandoBloques, setGuardandoBloques] = useState(false);

  useEffect(() => {
    cargarPlantillas();
  }, []);

  useEffect(() => {
    if (pestana === "seguimiento") {
      cargarBloquesSeguimiento(programaSeg);
    }
  }, [pestana, programaSeg]);

  const cargarPlantillas = async () => {
    setCargandoLista(true);
    try {
      const lista = await apiRequest("/plantillas");
      setPlantillas(Array.isArray(lista) ? lista : []);
    } catch {
      setPlantillas([]);
    } finally {
      setCargandoLista(false);
    }
  };

  const handleSincronizarPediatria = async () => {
    setSincronizando(true);
    try {
      const resp = await apiRequest("/plantillas/sincronizar-pediatria", { method: "POST" });
      await cargarPlantillas();
      Swal.fire({
        title: "¡Plantilla Sincronizada!",
        text: resp?.mensaje || "La historia clínica de Pediatría se cargó correctamente en PostgreSQL.",
        icon: "success",
        confirmButtonColor: "#4F46E5",
      });
    } catch (error) {
      Swal.fire("Error", error?.message || "No se pudo sincronizar la plantilla.", "error");
    } finally {
      setSincronizando(false);
    }
  };

  const abrirNuevaPlantilla = () => {
    setModoEdicion(false);
    setEditId(null);
    setFormPlantilla({
      codigo: "",
      nombre: "",
      tipo_programa: "General",
      descripcion: "",
      secciones: [
        {
          titulo: "Datos de Consulta",
          siempreVisible: true,
          campos: [
            {
              nombre: "motivoConsulta",
              etiqueta: "Motivo de Consulta",
              tipo: "textarea",
              requerido: true,
              placeholder: "Describa el motivo principal...",
            },
          ],
        },
      ],
    });
    setEditorAbierto(true);
  };

  const abrirEditarPlantilla = async (plantilla) => {
    try {
      const esq = await apiRequest(`/plantillas/${plantilla.id || plantilla.codigo}/esquema`);
      setModoEdicion(true);
      setEditId(plantilla.id);
      setFormPlantilla({
        codigo: esq.codigo || plantilla.codigo,
        nombre: esq.titulo || plantilla.nombre,
        tipo_programa: esq.tipo_programa || plantilla.tipo_programa || "General",
        descripcion: plantilla.descripcion || "",
        secciones: (esq.secciones || []).map((s) => ({
          titulo: s.titulo,
          siempreVisible: !!s.siempreVisible,
          campos: (s.campos || []).map((c) => ({
            ...c,
            opcionesTexto: Array.isArray(c.opciones)
              ? c.opciones.map((o) => (typeof o === "object" ? o.etiqueta || o.valor : o)).join(", ")
              : "",
          })),
        })),
      });
      setEditorAbierto(true);
    } catch (error) {
      Swal.fire("Error", error?.message || "No se pudo cargar la estructura de la plantilla.", "error");
    }
  };

  const eliminarPlantilla = async (plantilla) => {
    const res = await Swal.fire({
      title: "¿Desactivar plantilla?",
      text: `Se ocultará "${plantilla.nombre}" de la lista de plantillas activas.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#EF4444",
      confirmButtonText: "Sí, desactivar",
      cancelButtonText: "Cancelar",
    });
    if (!res.isConfirmed) return;

    try {
      await apiRequest(`/plantillas/${plantilla.id}`, { method: "DELETE" });
      await cargarPlantillas();
      Swal.fire("Listo", "Plantilla desactivada.", "success");
    } catch (error) {
      Swal.fire("Error", error?.message || "No se pudo desactivar la plantilla.", "error");
    }
  };

  // Helpers del Editor de Secciones y Campos
  const agregarSeccion = () => {
    setFormPlantilla((prev) => ({
      ...prev,
      secciones: [
        ...prev.secciones,
        {
          titulo: `Nueva Sección ${prev.secciones.length + 1}`,
          siempreVisible: false,
          campos: [],
        },
      ],
    }));
  };

  const eliminarSeccion = (sIdx) => {
    setFormPlantilla((prev) => ({
      ...prev,
      secciones: prev.secciones.filter((_, i) => i !== sIdx),
    }));
  };

  const moverSeccion = (sIdx, dir) => {
    setFormPlantilla((prev) => {
      const arr = [...prev.secciones];
      const target = sIdx + dir;
      if (target < 0 || target >= arr.length) return prev;
      [arr[sIdx], arr[target]] = [arr[target], arr[sIdx]];
      return { ...prev, secciones: arr };
    });
  };

  const actualizarSeccion = (sIdx, cambios) => {
    setFormPlantilla((prev) => ({
      ...prev,
      secciones: prev.secciones.map((s, i) => (i === sIdx ? { ...s, ...cambios } : s)),
    }));
  };

  const agregarCampo = (sIdx) => {
    setFormPlantilla((prev) => ({
      ...prev,
      secciones: prev.secciones.map((s, i) =>
        i === sIdx
          ? {
              ...s,
              campos: [
                ...(s.campos || []),
                {
                  nombre: `pregunta_${Date.now().toString().slice(-5)}`,
                  etiqueta: "",
                  tipo: "text",
                  requerido: false,
                  placeholder: "",
                  opcionesTexto: "",
                },
              ],
            }
          : s
      ),
    }));
  };

  const actualizarCampo = (sIdx, cIdx, cambios) => {
    setFormPlantilla((prev) => ({
      ...prev,
      secciones: prev.secciones.map((s, i) => {
        if (i !== sIdx) return s;
        return {
          ...s,
          campos: s.campos.map((c, j) => {
            if (j !== cIdx) return c;
            const actualizado = { ...c, ...cambios };
            // Si es campo nuevo sin nombre personalizado y se escribe etiqueta, sugerir nombre
            if (cambios.etiqueta !== undefined && (!c.nombre || c.nombre.startsWith("pregunta_"))) {
              const slug = slugifyPath(cambios.etiqueta);
              if (slug) actualizado.nombre = `personalizado.${slug}`;
            }
            return actualizado;
          }),
        };
      }),
    }));
  };

  const eliminarCampo = (sIdx, cIdx) => {
    setFormPlantilla((prev) => ({
      ...prev,
      secciones: prev.secciones.map((s, i) =>
        i === sIdx ? { ...s, campos: s.campos.filter((_, j) => j !== cIdx) } : s
      ),
    }));
  };

  const moverCampo = (sIdx, cIdx, dir) => {
    setFormPlantilla((prev) => ({
      ...prev,
      secciones: prev.secciones.map((s, i) => {
        if (i !== sIdx) return s;
        const arr = [...s.campos];
        const target = cIdx + dir;
        if (target < 0 || target >= arr.length) return s;
        [arr[cIdx], arr[target]] = [arr[target], arr[cIdx]];
        return { ...s, campos: arr };
      }),
    }));
  };

  const guardarPlantilla = async (e) => {
    e.preventDefault();
    if (!formPlantilla.nombre.trim()) {
      Swal.fire("Falta nombre", "Escribe un nombre para la plantilla.", "warning");
      return;
    }
    if (!modoEdicion && !formPlantilla.codigo.trim()) {
      Swal.fire("Falta código", "Escribe un código identificador (ej: VALORACION_DEPORTIVA).", "warning");
      return;
    }

    const seccionesLimpias = formPlantilla.secciones.map((sec) => ({
      titulo: sec.titulo.trim() || "Sección",
      siempreVisible: !!sec.siempreVisible,
      campos: (sec.campos || []).map((c) => {
        const { opcionesTexto, ...resto } = c;
        const necesitaOpciones = c.tipo === "select" || c.tipo === "checkbox_group";
        let opcionesFinal = c.opciones;
        if (necesitaOpciones && typeof opcionesTexto === "string") {
          opcionesFinal = opcionesTexto
            .split(",")
            .map((x) => x.trim())
            .filter(Boolean)
            .map((x) => ({ valor: x, etiqueta: x }));
        }
        return {
          ...resto,
          etiqueta: c.etiqueta || c.nombre,
          opciones: necesitaOpciones ? opcionesFinal : undefined,
        };
      }),
    }));

    setGuardandoPlantilla(true);
    try {
      if (modoEdicion && editId) {
        await apiRequest(`/plantillas/${editId}`, {
          method: "PUT",
          body: JSON.stringify({
            nombre: formPlantilla.nombre,
            tipo_programa: formPlantilla.tipo_programa,
            descripcion: formPlantilla.descripcion,
            secciones: seccionesLimpias,
          }),
        });
      } else {
        await apiRequest("/plantillas", {
          method: "POST",
          body: JSON.stringify({
            codigo: formPlantilla.codigo,
            nombre: formPlantilla.nombre,
            tipo_programa: formPlantilla.tipo_programa,
            descripcion: formPlantilla.descripcion,
            secciones: seccionesLimpias,
          }),
        });
      }
      await cargarPlantillas();
      setEditorAbierto(false);
      Swal.fire("¡Guardado!", "La plantilla se guardó correctamente en base de datos.", "success");
    } catch (error) {
      Swal.fire("Error", error?.message || "No se pudo guardar la plantilla.", "error");
    } finally {
      setGuardandoPlantilla(false);
    }
  };

  // --- Lógica Pestaña 2: Preguntas y Tablas de Seguimiento ---
  const cargarBloquesSeguimiento = async (programa) => {
    setCargandoBloques(true);
    try {
      const res = await apiRequest(`/plantillas/seguimiento-bloques/${programa}`);
      setBloquesSeg(Array.isArray(res?.bloques) ? res.bloques : []);
    } catch {
      setBloquesSeg([]);
    } finally {
      setCargandoBloques(false);
    }
  };

  const agregarPreguntaSeg = () => {
    setBloquesSeg((prev) => [
      ...prev,
      {
        id: `preg_${Date.now()}`,
        tipoBloque: "pregunta",
        pregunta: "",
        respuesta: "",
      },
    ]);
  };

  const agregarTablaSeg = () => {
    setBloquesSeg((prev) => [
      ...prev,
      {
        id: `tab_${Date.now()}`,
        tipoBloque: "tabla",
        titulo: "Tabla de Control",
        columnas: ["Parámetro", "Medición / Avance", "Observaciones"],
        filas: [["", "", ""]],
      },
    ]);
  };

  const eliminarBloqueSeg = (id) => {
    setBloquesSeg((prev) => prev.filter((b) => b.id !== id));
  };

  const actualizarBloqueSeg = (id, cambios) => {
    setBloquesSeg((prev) => prev.map((b) => (b.id === id ? { ...b, ...cambios } : b)));
  };

  const guardarBloquesSeguimiento = async () => {
    setGuardandoBloques(true);
    try {
      const res = await apiRequest(`/plantillas/seguimiento-bloques/${programaSeg}`, {
        method: "PUT",
        body: JSON.stringify({ bloques: bloquesSeg }),
      });
      setBloquesSeg(Array.isArray(res?.bloques) ? res.bloques : bloquesSeg);
      Swal.fire(
        "¡Guardado!",
        "Las preguntas y tablas de seguimiento quedaron configuradas para futuros controles.",
        "success"
      );
    } catch (error) {
      Swal.fire("Error", error?.message || "No se pudo guardar la configuración.", "error");
    } finally {
      setGuardandoBloques(false);
    }
  };

  const pediatriaEnBD = plantillas.some((p) => p.codigo === "PEDIATRIA_INICIAL");

  return (
    <div className="mt-8 bg-white rounded-2xl shadow-xl border border-indigo-50 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-white font-bold text-lg flex items-center gap-2">
            🧩 Plantillas de Historias Clínicas y Seguimiento
          </h2>
          <p className="text-indigo-100 text-xs mt-0.5">
            Crea o edita plantillas de historias clínicas y configura las preguntas fijas de cada seguimiento.
          </p>
        </div>
        <span
          className={`text-xs font-bold px-3 py-1 rounded-full ${
            pediatriaEnBD ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
          }`}
        >
          {pediatriaEnBD ? "✓ Base de datos conectada" : "⚠ Pendiente sincronizar Pediatría"}
        </span>
      </div>

      {/* Pestañas */}
      <div className="flex border-b border-gray-200 bg-gray-50/70 px-6 pt-3 gap-2">
        <button
          type="button"
          onClick={() => setPestana("plantillas")}
          className={`px-4 py-2.5 text-sm font-bold rounded-t-xl border-b-2 transition-colors ${
            pestana === "plantillas"
              ? "bg-white text-indigo-700 border-indigo-600"
              : "text-gray-500 border-transparent hover:text-gray-800"
          }`}
        >
          📋 Plantillas de Historia Clínica
        </button>
        <button
          type="button"
          onClick={() => setPestana("seguimiento")}
          className={`px-4 py-2.5 text-sm font-bold rounded-t-xl border-b-2 transition-colors ${
            pestana === "seguimiento"
              ? "bg-white text-pink-700 border-pink-600"
              : "text-gray-500 border-transparent hover:text-gray-800"
          }`}
        >
          ✨ Preguntas de Seguimiento (por Programa)
        </button>
      </div>

      <div className="p-6 md:p-8">
        {pestana === "plantillas" && !editorAbierto && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-gray-800">Plantillas Registradas</h3>
                <p className="text-xs text-gray-500">
                  Puedes crear nuevas historias clínicas o editar las existentes (secciones, preguntas y tipos de respuesta).
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={handleSincronizarPediatria}
                  disabled={sincronizando}
                  className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs px-4 py-2.5 rounded-xl border border-indigo-200 transition-all"
                >
                  {sincronizando ? "Sincronizando..." : "↻ Sincronizar Pediatría en BD"}
                </button>
                <button
                  type="button"
                  onClick={abrirNuevaPlantilla}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-sm transition-all"
                >
                  + Crear Nueva Plantilla
                </button>
              </div>
            </div>

            {cargandoLista ? (
              <div className="py-10 text-center text-sm text-gray-400">Cargando plantillas...</div>
            ) : plantillas.length === 0 ? (
              <div className="py-10 text-center bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                <p className="text-sm text-gray-600 font-medium">Aún no hay plantillas guardadas en base de datos.</p>
                <p className="text-xs text-gray-400 mt-1">
                  Haz clic en "Sincronizar Pediatría en BD" o en "+ Crear Nueva Plantilla" para empezar.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {plantillas.map((p) => (
                  <div
                    key={p.id}
                    className="p-5 rounded-2xl border border-gray-200 hover:border-indigo-200 bg-white shadow-sm flex flex-col justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700">
                          {p.tipo_programa || "General"}
                        </span>
                        <span className="text-[11px] font-mono text-gray-400">{p.codigo}</span>
                      </div>
                      <h4 className="text-base font-bold text-gray-800 mt-2">{p.nombre}</h4>
                      {p.descripcion && (
                        <p className="text-xs text-gray-500 mt-1 line-clamp-2">{p.descripcion}</p>
                      )}
                    </div>
                    <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
                      <button
                        type="button"
                        onClick={() => abrirEditarPlantilla(p)}
                        className="text-xs font-bold text-indigo-600 hover:bg-indigo-50 px-3 py-1.5 rounded-lg transition-colors"
                      >
                        ✏️ Editar secciones y preguntas
                      </button>
                      {p.codigo !== "PEDIATRIA_INICIAL" && (
                        <button
                          type="button"
                          onClick={() => eliminarPlantilla(p)}
                          className="text-xs font-bold text-red-500 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors"
                        >
                          🗑️ Eliminar
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Editor Visual de Plantilla */}
        {pestana === "plantillas" && editorAbierto && (
          <form onSubmit={guardarPlantilla} className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-gray-200">
              <div>
                <h3 className="text-lg font-bold text-gray-800">
                  {modoEdicion ? `Editando: ${formPlantilla.nombre}` : "Nueva Plantilla de Historia Clínica"}
                </h3>
                <p className="text-xs text-gray-500">
                  Agrega, edita o reordena las secciones y preguntas de esta plantilla.
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setEditorAbierto(false)}
                  className="px-4 py-2 text-xs font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={guardandoPlantilla}
                  className="px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm disabled:opacity-50"
                >
                  {guardandoPlantilla ? "Guardando..." : "💾 Guardar Plantilla"}
                </button>
              </div>
            </div>

            {/* Datos generales */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-50 p-4 rounded-2xl border border-gray-200">
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">Nombre / Título *</label>
                <input
                  type="text"
                  required
                  value={formPlantilla.nombre}
                  onChange={(e) => {
                    const val = e.target.value;
                    setFormPlantilla((prev) => ({
                      ...prev,
                      nombre: val,
                      codigo:
                        !modoEdicion && (!prev.codigo || prev.codigo === slugifyPath(prev.nombre).toUpperCase())
                          ? slugifyPath(val).toUpperCase()
                          : prev.codigo,
                    }));
                  }}
                  placeholder="Ej: Valoración Fisioterapia Deportiva"
                  className="w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-indigo-400"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">Código Interno *</label>
                <input
                  type="text"
                  required
                  disabled={modoEdicion}
                  value={formPlantilla.codigo}
                  onChange={(e) => setFormPlantilla((prev) => ({ ...prev, codigo: e.target.value.toUpperCase() }))}
                  placeholder="EJ: FISIO_DEPORTIVA"
                  className="w-full px-3 py-2 text-sm font-mono bg-white border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-indigo-400 disabled:bg-gray-100"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">Programa</label>
                <select
                  value={formPlantilla.tipo_programa}
                  onChange={(e) => setFormPlantilla((prev) => ({ ...prev, tipo_programa: e.target.value }))}
                  className="w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-indigo-400"
                >
                  {PROGRAMAS_OPCIONES.map((prog) => (
                    <option key={prog} value={prog}>
                      {prog}
                    </option>
                  ))}
                </select>
              </div>
              <div className="md:col-span-3">
                <label className="block text-xs font-bold text-gray-600 mb-1">Descripción (opcional)</label>
                <input
                  type="text"
                  value={formPlantilla.descripcion}
                  onChange={(e) => setFormPlantilla((prev) => ({ ...prev, descripcion: e.target.value }))}
                  placeholder="Breve descripción de cuándo se usa esta historia clínica..."
                  className="w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-indigo-400"
                />
              </div>
            </div>

            {/* Secciones y Campos */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-gray-700">
                  Secciones ({formPlantilla.secciones.length})
                </h4>
                <button
                  type="button"
                  onClick={agregarSeccion}
                  className="text-xs font-bold bg-indigo-50 text-indigo-700 hover:bg-indigo-100 px-3 py-2 rounded-xl border border-indigo-200"
                >
                  + Agregar Sección
                </button>
              </div>

              {formPlantilla.secciones.map((sec, sIdx) => (
                <div key={sIdx} className="border border-gray-200 rounded-2xl overflow-hidden bg-white shadow-sm">
                  <div className="bg-gray-100/80 px-4 py-3 flex flex-wrap items-center justify-between gap-2 border-b border-gray-200">
                    <div className="flex items-center gap-2 flex-1 min-w-[220px]">
                      <span className="text-xs font-bold text-indigo-600 bg-white px-2 py-0.5 rounded border border-indigo-100">
                        #{sIdx + 1}
                      </span>
                      <input
                        type="text"
                        value={sec.titulo}
                        onChange={(e) => actualizarSeccion(sIdx, { titulo: e.target.value })}
                        placeholder="Título de la sección..."
                        className="flex-1 px-3 py-1.5 text-sm font-bold text-gray-800 bg-white border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-400"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <label className="flex items-center gap-1.5 text-xs text-gray-600 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={!!sec.siempreVisible}
                          onChange={(e) => actualizarSeccion(sIdx, { siempreVisible: e.target.checked })}
                          className="rounded text-indigo-600"
                        />
                        Siempre abierta
                      </label>
                      <button
                        type="button"
                        onClick={() => moverSeccion(sIdx, -1)}
                        disabled={sIdx === 0}
                        title="Subir sección"
                        className="px-2 py-1 text-xs bg-white border rounded hover:bg-gray-50 disabled:opacity-30"
                      >
                        ↑
                      </button>
                      <button
                        type="button"
                        onClick={() => moverSeccion(sIdx, 1)}
                        disabled={sIdx === formPlantilla.secciones.length - 1}
                        title="Bajar sección"
                        className="px-2 py-1 text-xs bg-white border rounded hover:bg-gray-50 disabled:opacity-30"
                      >
                        ↓
                      </button>
                      <button
                        type="button"
                        onClick={() => eliminarSeccion(sIdx)}
                        className="px-2.5 py-1 text-xs font-bold text-red-600 hover:bg-red-50 rounded-lg"
                      >
                        Quitar sección
                      </button>
                    </div>
                  </div>

                  <div className="p-4 space-y-3">
                    {(sec.campos || []).map((campo, cIdx) => {
                      const usaOpciones = campo.tipo === "select" || campo.tipo === "checkbox_group";
                      return (
                        <div
                          key={cIdx}
                          className="p-3 bg-gray-50/70 border border-gray-200 rounded-xl grid grid-cols-1 md:grid-cols-12 gap-2.5 items-end"
                        >
                          <div className="md:col-span-4">
                            <label className="block text-[11px] font-bold text-gray-500 mb-1">
                              Pregunta / Etiqueta
                            </label>
                            <input
                              type="text"
                              value={campo.etiqueta || ""}
                              onChange={(e) => actualizarCampo(sIdx, cIdx, { etiqueta: e.target.value })}
                              placeholder="Ej: Antecedentes quirúrgicos"
                              className="w-full px-2.5 py-1.5 text-xs bg-white border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-300"
                            />
                          </div>

                          <div className="md:col-span-3">
                            <label className="block text-[11px] font-bold text-gray-500 mb-1">
                              Tipo de respuesta
                            </label>
                            <select
                              value={campo.tipo || "text"}
                              onChange={(e) => actualizarCampo(sIdx, cIdx, { tipo: e.target.value })}
                              className="w-full px-2.5 py-1.5 text-xs bg-white border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-300"
                            >
                              {TIPOS_CAMPO_OPCIONES.map((t) => (
                                <option key={t.valor} value={t.valor}>
                                  {t.etiqueta}
                                </option>
                              ))}
                              {!TIPOS_CAMPO_OPCIONES.some((t) => t.valor === campo.tipo) && campo.tipo && (
                                <option value={campo.tipo}>{campo.tipo}</option>
                              )}
                            </select>
                          </div>

                          <div className="md:col-span-3">
                            <label className="block text-[11px] font-bold text-gray-500 mb-1">
                              Texto de ayuda (Placeholder)
                            </label>
                            <input
                              type="text"
                              value={campo.placeholder || ""}
                              onChange={(e) => actualizarCampo(sIdx, cIdx, { placeholder: e.target.value })}
                              placeholder="Opcional..."
                              className="w-full px-2.5 py-1.5 text-xs bg-white border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-300"
                            />
                          </div>

                          <div className="md:col-span-2 flex items-center justify-between gap-1 pb-1">
                            <label className="flex items-center gap-1 text-[11px] font-medium text-gray-600 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={!!campo.requerido}
                                onChange={(e) => actualizarCampo(sIdx, cIdx, { requerido: e.target.checked })}
                              />
                              Oblig.
                            </label>
                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() => moverCampo(sIdx, cIdx, -1)}
                                disabled={cIdx === 0}
                                className="px-1.5 py-0.5 text-[11px] bg-white border rounded disabled:opacity-30"
                              >
                                ↑
                              </button>
                              <button
                                type="button"
                                onClick={() => moverCampo(sIdx, cIdx, 1)}
                                disabled={cIdx === sec.campos.length - 1}
                                className="px-1.5 py-0.5 text-[11px] bg-white border rounded disabled:opacity-30"
                              >
                                ↓
                              </button>
                              <button
                                type="button"
                                onClick={() => eliminarCampo(sIdx, cIdx)}
                                className="px-1.5 py-0.5 text-[11px] text-red-500 hover:bg-red-50 rounded"
                                title="Eliminar pregunta"
                              >
                                ✕
                              </button>
                            </div>
                          </div>

                          {usaOpciones && (
                            <div className="md:col-span-12">
                              <label className="block text-[11px] font-bold text-indigo-600 mb-1">
                                Opciones (separadas por coma)
                              </label>
                              <input
                                type="text"
                                value={campo.opcionesTexto || ""}
                                onChange={(e) => actualizarCampo(sIdx, cIdx, { opcionesTexto: e.target.value })}
                                placeholder="Ej: Sí, No, En proceso"
                                className="w-full px-2.5 py-1.5 text-xs bg-white border border-indigo-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-300"
                              />
                            </div>
                          )}
                        </div>
                      );
                    })}

                    <button
                      type="button"
                      onClick={() => agregarCampo(sIdx)}
                      className="text-xs font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50/70 hover:bg-indigo-100 px-3 py-1.5 rounded-lg border border-indigo-200"
                    >
                      + Agregar Pregunta a "{sec.titulo}"
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </form>
        )}

        {/* Pestaña 2: Configuración de Preguntas y Tablas de Seguimiento */}
        {pestana === "seguimiento" && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-gray-200">
              <div>
                <h3 className="text-base font-bold text-gray-800">
                  Preguntas y Tablas Fijas para Seguimientos
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Configura aquí qué preguntas o tablas aparecerán automáticamente cada vez que la doctora haga un seguimiento de este programa.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <label className="text-xs font-bold text-gray-600">Programa:</label>
                <select
                  value={programaSeg}
                  onChange={(e) => setProgramaSeg(e.target.value)}
                  className="px-3 py-2 text-sm font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 rounded-xl outline-none"
                >
                  {PROGRAMAS_SEGUIMIENTO.map((p) => (
                    <option key={p.clave} value={p.clave}>
                      {p.nombre}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={agregarPreguntaSeg}
                className="px-4 py-2 text-xs font-bold bg-pink-50 text-pink-700 hover:bg-pink-100 border border-pink-200 rounded-xl"
              >
                ➕ Agregar Pregunta Libre
              </button>
              <button
                type="button"
                onClick={agregarTablaSeg}
                className="px-4 py-2 text-xs font-bold bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200 rounded-xl"
              >
                📊 Agregar Tabla de Control
              </button>
            </div>

            {cargandoBloques ? (
              <div className="py-8 text-center text-sm text-gray-400">Cargando configuración...</div>
            ) : bloquesSeg.length === 0 ? (
              <div className="py-10 text-center bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                <p className="text-sm text-gray-600 font-medium">
                  Este programa no tiene preguntas ni tablas fijas configuradas todavía.
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Usa los botones superiores para agregar las preguntas que la doctora deberá llenar en cada seguimiento.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {bloquesSeg.map((b, idx) => (
                  <div key={b.id} className="p-4 rounded-2xl border border-gray-200 bg-gray-50/50 space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold text-indigo-700 uppercase">
                        {b.tipoBloque === "pregunta" ? `Pregunta #${idx + 1}` : `Tabla #${idx + 1}`}
                      </span>
                      <button
                        type="button"
                        onClick={() => eliminarBloqueSeg(b.id)}
                        className="text-xs font-bold text-red-500 hover:bg-red-50 px-2.5 py-1 rounded-lg"
                      >
                        Quitar
                      </button>
                    </div>

                    {b.tipoBloque === "pregunta" ? (
                      <input
                        type="text"
                        value={b.pregunta || ""}
                        onChange={(e) => actualizarBloqueSeg(b.id, { pregunta: e.target.value })}
                        placeholder="Escribe la pregunta que verá la doctora en el seguimiento..."
                        className="w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-pink-300"
                      />
                    ) : (
                      <div className="space-y-3">
                        <input
                          type="text"
                          value={b.titulo || ""}
                          onChange={(e) => actualizarBloqueSeg(b.id, { titulo: e.target.value })}
                          placeholder="Título de la tabla..."
                          className="w-full px-3 py-2 text-sm font-bold bg-white border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-indigo-300"
                        />
                        <div className="space-y-2">
                          <span className="text-xs font-bold text-gray-600 block">Columnas de la tabla:</span>
                          <div className="flex flex-wrap gap-2">
                            {(b.columnas || []).map((col, cIdx) => (
                              <div key={cIdx} className="flex items-center gap-1 bg-white border border-indigo-200 rounded-lg px-2 py-1">
                                <input
                                  type="text"
                                  value={col}
                                  onChange={(e) => {
                                    const nuevasCols = [...b.columnas];
                                    nuevasCols[cIdx] = e.target.value;
                                    actualizarBloqueSeg(b.id, { columnas: nuevasCols });
                                  }}
                                  className="text-xs font-medium text-gray-700 outline-none w-36"
                                />
                                {b.columnas.length > 1 && (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const nuevasCols = b.columnas.filter((_, i) => i !== cIdx);
                                      actualizarBloqueSeg(b.id, { columnas: nuevasCols });
                                    }}
                                    className="text-gray-400 hover:text-red-500 text-xs"
                                  >
                                    ✕
                                  </button>
                                )}
                              </div>
                            ))}
                            <button
                              type="button"
                              onClick={() =>
                                actualizarBloqueSeg(b.id, {
                                  columnas: [...(b.columnas || []), `Columna ${(b.columnas?.length || 0) + 1}`],
                                })
                              }
                              className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-200"
                            >
                              + Columna
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            <div className="flex justify-end pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={guardarBloquesSeguimiento}
                disabled={guardandoBloques}
                className="bg-pink-600 hover:bg-pink-700 disabled:opacity-50 text-white font-bold text-sm px-6 py-3 rounded-xl shadow-md transition-all"
              >
                {guardandoBloques ? "Guardando..." : "💾 Guardar Preguntas de Seguimiento"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

