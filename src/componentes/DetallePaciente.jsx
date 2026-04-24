import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  ClipboardDocumentListIcon,
  ArrowLeftIcon,
  PencilSquareIcon,
  CreditCardIcon,
  ArrowDownTrayIcon,
  TrashIcon,
} from "@heroicons/react/24/solid";
import { apiRequest } from "../config/api";
import Swal from "sweetalert2";

export default function DetallePacienteUnificado() {
  const { id } = useParams();
  const [paciente, setPaciente] = useState(null);
  const [error, setError] = useState("");
  const [valoraciones, setValoraciones] = useState([]); // Historial de valoraciones unificado
  const [paquetes, setPaquetes] = useState([]);
  const [clases, setClases] = useState([]);
  const [paginaPaquetes, setPaginaPaquetes] = useState(1);
  const [paginaClases, setPaginaClases] = useState(1);
  const [itemsPorPagina] = useState(6);
  const [showValuationModal, setShowValuationModal] = useState(false);
  const [showPackageModal, setShowPackageModal] = useState(false);
  const [numeroFactura, setNumeroFactura] = useState("");
  const [clasesPagadas, setClasesPagadas] = useState(1);
  const [fechaPago, setFechaPago] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Cargar datos básicos del paciente (unificado en /pacientes)
    apiRequest(`/pacientes/${id}`)
      .then((data) => setPaciente(data))
      .catch(() => setError("No se pudo cargar la historia clínica"));

    // Cargar historial de valoraciones (unificado en /valoraciones)
    apiRequest(`/valoraciones/paciente/${id}`)
      .then(setValoraciones)
      .catch(() => []);

    // Cargar historial de paquetes y clases
    apiRequest(`/pagoPaquete/por-nino/${id}`)
      .then(setPaquetes)
      .catch(() => []);
    apiRequest(`/clases/paciente/${id}`)
      .then(setClases)
      .catch(() => []);
  }, [id]);

  const eliminarPaquete = async (paqueteId) => {
    const result = await Swal.fire({
      title: "¿Eliminar paquete?",
      text: "Esta acción no se puede deshacer.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#9ca3af",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      try {
        await apiRequest(`/pagoPaquete/${paqueteId}`, { method: "DELETE" });

        // Actualizar la vista eliminando el paquete localmente
        setPaquetes(paquetes.filter((p) => p.id !== paqueteId));

        Swal.fire("Eliminado", "El paquete ha sido eliminado.", "success");
      } catch (error) {
        // En caso de fallar usualmente porque se está usando en una sesión
        Swal.fire(
          "Error",
          error.message ||
            "No se pudo eliminar el paquete. Tal vez ya esté siendo usando en alguna clase.",
          "error",
        );
      }
    }
  };

  const handleRegistrarPaquete = async (e) => {
    e.preventDefault();
    try {
      if (!numeroFactura.trim() || !fechaPago) {
        return Swal.fire(
          "Atención",
          "Por favor llena todos los campos",
          "warning",
        );
      }

      await apiRequest("/pagoPaquete", {
        method: "POST",
        body: JSON.stringify({
          paciente: id,
          numeroFactura,
          clasesPagadas,
          fechaPago,
        }),
      });

      setShowPackageModal(false);
      setNumeroFactura("");
      setClasesPagadas(1);
      setFechaPago("");

      Swal.fire(
        "¡Paquete registrado!",
        "La compra se procesó correctamente.",
        "success",
      );

      // Recargar paquetes
      apiRequest(`/pagoPaquete/por-nino/${id}`)
        .then(setPaquetes)
        .catch(() => []);
    } catch (err) {
      Swal.fire(
        "Error",
        err.message ||
          "Hubo un problema al registrar el paquete. ¿El número de factura ya existe?",
        "error",
      );
    }
  };

  const descargarRDA = async () => {
    try {
      // Mostrar cargando
      Swal.fire({
        title: "Generando RDA...",
        text: "Construyendo el resumen digital en formato FHIR (Resolución 866 de 2021)",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      const response = await apiRequest(`/rda/patient/${paciente.id}`);

      const dataStr = JSON.stringify(response, null, 2);
      const dataUri =
        "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);

      const fileName = `RDA_PACIENTE_${paciente.num_documento_identificacion || paciente.registro_civil || id}.json`;

      const linkElement = document.createElement("a");
      linkElement.setAttribute("href", dataUri);
      linkElement.setAttribute("download", fileName);
      linkElement.click();

      Swal.fire({
        icon: "success",
        title: "¡RDA Generado!",
        text: "El Resumen Digital de Atención (FHIR) se ha descargado correctamente.",
        timer: 2500,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error("Error descargando RDA:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo generar el RDA FHIR. Verifique que el paciente tenga al menos una valoración registrada.",
      });
    }
  };

  if (error) return <div className="p-8 text-red-600">{error}</div>;
  if (!paciente)
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] bg-gradient-to-br from-indigo-100 via-pink-100 to-green-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-indigo-600 border-solid"></div>
        <span className="mt-4 text-indigo-700 font-bold">Cargando...</span>
      </div>
    );

  const isNino = !paciente.es_adulto;

  const calcularEdad = (fechaNac) => {
    if (!fechaNac) return "";
    const hoy = new Date();
    const nacimiento = new Date(fechaNac);
    if (isNaN(nacimiento.getTime())) return "";

    if (isNino) {
      const meses =
        (hoy.getFullYear() - nacimiento.getFullYear()) * 12 +
        (hoy.getMonth() - nacimiento.getMonth());
      return meses >= 0 ? meses : 0;
    } else {
      let edadAños = hoy.getFullYear() - nacimiento.getFullYear();
      if (
        hoy.getMonth() < nacimiento.getMonth() ||
        (hoy.getMonth() === nacimiento.getMonth() &&
          hoy.getDate() < nacimiento.getDate())
      ) {
        edadAños--;
      }
      return edadAños >= 0 ? edadAños : 0;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-pink-100 to-green-100 py-10 px-2">
      <div className="p-8 max-w-4xl w-full mx-auto bg-white rounded-3xl shadow-2xl border border-indigo-100">
        {/* Encabezado Principal */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <button
            onClick={() => navigate("/pacientes")}
            className="flex items-center gap-2 text-indigo-600 font-bold hover:text-indigo-800 transition"
          >
            <ArrowLeftIcon className="h-5 w-5" /> Volver
          </button>
          <h2 className="text-3xl font-extrabold text-indigo-700 tracking-tight drop-shadow">
            Expediente del Paciente
          </h2>
          <div
            className={`px-4 py-1 rounded-full text-sm font-bold border ${isNino ? "bg-indigo-100 text-indigo-800 border-indigo-200" : "bg-pink-100 text-pink-800 border-pink-200"}`}
          >
            {isNino ? "🧒 Pediátrico" : "🤰 Materno"}
          </div>
        </div>

        {/* Rejilla de Información del Paciente */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Bloque 1: Identificación */}
          <div className="bg-indigo-50 rounded-2xl p-5 shadow-sm border border-indigo-100">
            <h3 className="font-bold text-indigo-700 mb-3 flex items-center gap-2 border-b border-indigo-200 pb-1">
              🧔 Identificación
            </h3>
            <div className="space-y-1 text-sm">
              <p>
                <span className="font-bold">Nombres:</span> {paciente.nombres}{" "}
                {paciente.apellidos}
              </p>
              <p>
                <span className="font-bold">Doc:</span>{" "}
                {paciente.tipo_documento_identificacion}{" "}
                {paciente.num_documento_identificacion}
              </p>
              <p>
                <span className="font-bold">Edad:</span>{" "}
                {calcularEdad(paciente.fecha_nacimiento)}{" "}
                {isNino ? "meses" : "años"}
              </p>
              <p>
                <span className="font-bold">Género:</span>{" "}
                {paciente.cod_sexo === "M" ? "Masculino" : "Femenino"}
              </p>
              <p>
                <span className="font-bold">F. Nacimiento:</span>{" "}
                {paciente.fecha_nacimiento?.split("T")[0]}
              </p>
            </div>
          </div>

          {/* Bloque 2: Contacto */}
          <div className="bg-blue-50 rounded-2xl p-5 shadow-sm border border-blue-100">
            <h3 className="font-bold text-blue-700 mb-3 flex items-center gap-2 border-b border-blue-200 pb-1">
              📞 Contacto
            </h3>
            <div className="space-y-1 text-sm">
              <p>
                <span className="font-bold">Dirección:</span>{" "}
                {paciente.datos_contacto?.direccion || paciente.direccion}
              </p>
              <p>
                <span className="font-bold">Teléfono:</span>{" "}
                {paciente.datos_contacto?.telefono || paciente.telefono}
              </p>
              <p>
                <span className="font-bold">Celular:</span>{" "}
                {paciente.celular || paciente.telefono}
              </p>
              <p>
                <span className="font-bold">Acompañante:</span>{" "}
                {paciente.acompanante || "N/A"}
              </p>
              <p>
                <span className="font-bold">Aseguradora:</span>{" "}
                {paciente.aseguradora}
              </p>
            </div>
          </div>

          {/* Bloque 3: Datos Clínicos Específicos */}
          <div className="bg-green-50 rounded-2xl p-5 shadow-sm border border-green-100">
            <h3 className="font-bold text-green-700 mb-3 flex items-center gap-2 border-b border-green-200 pb-1">
              ⚕️ Datos Clínicos
            </h3>
            <div className="space-y-1 text-sm">
              {isNino ? (
                <>
                  <p>
                    <span className="font-bold">Pediatra:</span>{" "}
                    {paciente.pediatra || "No especificado"}
                  </p>
                  <p>
                    <span className="font-bold">Peso:</span>{" "}
                    {paciente.peso
                      ? paciente.peso.replace(/kg|gr/gi, "").trim() + " kg"
                      : "N/A"}
                  </p>
                  <p>
                    <span className="font-bold">Talla:</span>{" "}
                    {paciente.talla
                      ? paciente.talla.replace(/cm|m|mt/gi, "").trim() + " cm"
                      : "N/A"}
                  </p>

                  <div className="mt-2 pt-2 border-t border-green-200">
                    <p>
                      <span className="font-bold">Madre:</span>{" "}
                      {paciente.nombre_madre || "No especificada"}{" "}
                      {paciente.edad_madre
                        ? `(${paciente.edad_madre} años)`
                        : ""}
                    </p>
                    {paciente.ocupacion_madre && (
                      <p>
                        <span className="font-bold text-gray-500 text-xs">
                          Ocupación:
                        </span>{" "}
                        {paciente.ocupacion_madre}
                      </p>
                    )}
                  </div>
                  <div className="mt-2 pt-2 border-t border-green-200">
                    <p>
                      <span className="font-bold">Padre:</span>{" "}
                      {paciente.nombre_padre || "No especificado"}{" "}
                      {paciente.edad_padre
                        ? `(${paciente.edad_padre} años)`
                        : ""}
                    </p>
                    {paciente.ocupacion_padre && (
                      <p>
                        <span className="font-bold text-gray-500 text-xs">
                          Ocupación:
                        </span>{" "}
                        {paciente.ocupacion_padre}
                      </p>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <p>
                    <span className="font-bold">Ocupación:</span>{" "}
                    {paciente.ocupacion}
                  </p>
                  <p>
                    <span className="font-bold">FUM:</span> {paciente.fum}
                  </p>
                  <p>
                    <span className="font-bold">Semanas:</span>{" "}
                    {paciente.semanas_gestacion}
                  </p>
                  <p>
                    <span className="font-bold">FPP:</span>{" "}
                    {paciente.fecha_probable_parto}
                  </p>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Acciones Rápidas */}
        <div className="flex flex-wrap justify-center gap-3 mb-10 pb-10 border-b border-gray-100">
          <button
            onClick={() => setShowValuationModal(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-xl shadow transition flex items-center gap-2"
          >
            <ClipboardDocumentListIcon className="h-5 w-5" /> Iniciar Valoración
          </button>

          <button
            onClick={() => navigate(`/pacientes/editar/${id}`)}
            className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 px-6 rounded-xl shadow transition flex items-center gap-2"
          >
            <PencilSquareIcon className="h-5 w-5" /> Editar Datos
          </button>

          <button
            onClick={descargarRDA}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl shadow transition flex items-center gap-2"
          >
            <ArrowDownTrayIcon className="h-5 w-5" /> RDA (FHIR)
          </button>

          {isNino && (
            <button
              onClick={() => setShowPackageModal(true)}
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-xl shadow transition flex items-center gap-2"
            >
              <CreditCardIcon className="h-5 w-5" /> Comprar Paquete
            </button>
          )}

          {!isNino && (
            <button
              onClick={() => navigate(`/pacientes/${id}/sesiones-perinatal`)}
              className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-xl shadow transition flex items-center gap-2"
            >
              <ClipboardDocumentListIcon className="h-5 w-5" /> Ver Sesiones
            </button>
          )}
        </div>

        {/* Historial de Paquetes */}
        {isNino && (
          <div className="mb-10">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              🏷️ Paquetes Comprados
            </h3>
            {paquetes.length === 0 ? (
              <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl p-6 text-center text-gray-500">
                No hay paquetes comprados para este paciente.
              </div>
            ) : (
              <div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {paquetes
                    .slice(
                      (paginaPaquetes - 1) * itemsPorPagina,
                      paginaPaquetes * itemsPorPagina,
                    )
                    .map((p) => (
                      <div
                        key={p.id}
                        className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm hover:shadow-md transition"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-sm font-bold text-indigo-700">
                            Factura: {p.numero_factura}
                          </span>
                          <span
                            className={`text-xs font-bold px-2 py-1 rounded-full ${p.clases_usadas >= p.clases_pagadas ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}
                          >
                            {p.clases_usadas >= p.clases_pagadas
                              ? "Agotado"
                              : "Activo"}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">
                          Fecha de pago:{" "}
                          {new Date(p.fecha_pago).toLocaleDateString("es-ES", {
                            timeZone: "UTC",
                          })}
                        </p>
                        <p className="text-sm text-gray-600 mt-1 mb-3">
                          Usadas: <strong>{p.clases_usadas}</strong> / Pagadas:{" "}
                          <strong>{p.clases_pagadas}</strong>
                        </p>
                        <button
                          onClick={() => eliminarPaquete(p.id)}
                          className="flex justify-center items-center w-full gap-2 p-2 rounded-xl text-red-600 font-semibold hover:bg-red-50 transition border border-red-100"
                          title="Eliminar factura y registro de paquete"
                        >
                          <TrashIcon className="h-4 w-4" /> Eliminar
                        </button>
                      </div>
                    ))}
                </div>

                {Math.ceil(paquetes.length / itemsPorPagina) > 1 && (
                  <div className="flex justify-center items-center mt-6 gap-4">
                    <button
                      onClick={() =>
                        setPaginaPaquetes(Math.max(1, paginaPaquetes - 1))
                      }
                      disabled={paginaPaquetes === 1}
                      className="px-4 py-2 bg-indigo-50 text-indigo-700 rounded-xl font-bold hover:bg-indigo-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
                    >
                      Anterior
                    </button>
                    <span className="text-sm font-semibold text-gray-600">
                      Página {paginaPaquetes} de{" "}
                      {Math.ceil(paquetes.length / itemsPorPagina)}
                    </span>
                    <button
                      onClick={() =>
                        setPaginaPaquetes(
                          Math.min(
                            Math.ceil(paquetes.length / itemsPorPagina),
                            paginaPaquetes + 1,
                          ),
                        )
                      }
                      disabled={
                        paginaPaquetes ===
                        Math.ceil(paquetes.length / itemsPorPagina)
                      }
                      className="px-4 py-2 bg-indigo-50 text-indigo-700 rounded-xl font-bold hover:bg-indigo-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
                    >
                      Siguiente
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Historial de Sesiones (Clases) */}
        {isNino && (
          <div className="mb-10">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              🎈 Sesiones de Estimulación (Clases)
            </h3>
            {clases.length === 0 ? (
              <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl p-6 text-center text-gray-500">
                El paciente no ha participado en ninguna sesión de estimulación.
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Clase
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Fecha
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Factura Usada
                        </th>
                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                          Acción
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {clases
                        .slice(
                          (paginaClases - 1) * itemsPorPagina,
                          paginaClases * itemsPorPagina,
                        )
                        .map((c) => {
                          const infoPaciente = c.ninos.find(
                            (n) => (n.nino?.id || n.nino) === id,
                          );
                          return (
                            <tr key={c.id} className="hover:bg-gray-50">
                              <td className="px-4 py-3 font-medium text-gray-900">
                                {c.nombre}
                              </td>
                              <td className="px-4 py-3 text-gray-500">
                                {c.fecha}
                              </td>
                              <td className="px-4 py-3 text-gray-500">
                                {infoPaciente?.numero_factura ||
                                  infoPaciente?.paquete?.numero_factura || (
                                    <span className="text-xs text-red-500 italic">
                                      Sin paquete / Clase de prueba
                                    </span>
                                  )}
                              </td>
                              <td className="px-4 py-3 text-center">
                                <button
                                  onClick={() => navigate(`/clases/${c.id}`)}
                                  className="text-indigo-600 hover:text-indigo-900 font-semibold bg-indigo-50 px-3 py-1 rounded-lg"
                                >
                                  Ir a Clase
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>

                {Math.ceil(clases.length / itemsPorPagina) > 1 && (
                  <div className="flex justify-center items-center mt-6 mb-4 gap-4">
                    <button
                      onClick={() =>
                        setPaginaClases(Math.max(1, paginaClases - 1))
                      }
                      disabled={paginaClases === 1}
                      className="px-4 py-2 bg-indigo-50 text-indigo-700 rounded-xl font-bold hover:bg-indigo-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
                    >
                      Anterior
                    </button>
                    <span className="text-sm font-semibold text-gray-600">
                      Página {paginaClases} de{" "}
                      {Math.ceil(clases.length / itemsPorPagina)}
                    </span>
                    <button
                      onClick={() =>
                        setPaginaClases(
                          Math.min(
                            Math.ceil(clases.length / itemsPorPagina),
                            paginaClases + 1,
                          ),
                        )
                      }
                      disabled={
                        paginaClases ===
                        Math.ceil(clases.length / itemsPorPagina)
                      }
                      className="px-4 py-2 bg-indigo-50 text-indigo-700 rounded-xl font-bold hover:bg-indigo-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
                    >
                      Siguiente
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Historial de Valoraciones */}
        <div className="mb-10">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            📚 Historia Clínica Digital
          </h3>
          {valoraciones.length === 0 ? (
            <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl p-10 text-center text-gray-500">
              No hay valoraciones registradas en esta historia clínica.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {valoraciones.map((v) => (
                <div
                  key={v.id}
                  className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm hover:shadow-md transition group"
                >
                  <div className="flex justify-between items-start mb-2">
                    <span
                      className={`text-xs font-bold px-2 py-1 rounded-full ${
                        v.tipo === "Pediatría"
                          ? "bg-indigo-100 text-indigo-700"
                          : v.tipo === "Piso Pélvico"
                            ? "bg-pink-100 text-pink-700"
                            : v.tipo === "Lactancia"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-green-100 text-green-700"
                      }`}
                    >
                      {v.tipo}
                    </span>
                    <span className="text-xs text-gray-400 italic">
                      {new Date(
                        v.fecha_inicio_atencion || v.created_at,
                      ).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-1 italic">
                    {v.motivo_consulta ||
                      v.diagnostico_fisioterapeutico ||
                      "Evaluación general"}
                  </p>
                  <button
                    onClick={() => navigate(v.ruta || `/valoraciones/${v.id}`)}
                    className="w-full bg-gray-50 group-hover:bg-indigo-600 group-hover:text-white text-indigo-600 font-bold py-2 rounded-lg transition"
                  >
                    Ver Detalles
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal de Selección de Valoración (Unificado) */}
        {showValuationModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm">
            <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full flex flex-col items-center border border-indigo-100 animate-pop">
              <h2 className="text-2xl font-bold text-indigo-700 mb-6 text-center">
                Tipo de Valoración
              </h2>
              <div className="flex flex-col gap-4 w-full">
                {isNino ? (
                  <button
                    className="flex items-center gap-3 bg-indigo-100 hover:bg-indigo-600 hover:text-white text-indigo-800 font-bold py-4 px-6 rounded-2xl text-lg w-full justify-center transition"
                    onClick={() => {
                      setShowValuationModal(false);
                      navigate(`/valoracion?paciente=${id}`);
                    }}
                  >
                    🩺 Valoración Pediátrica
                  </button>
                ) : (
                  <>
                    <button
                      className="flex items-center gap-3 bg-pink-50 hover:bg-pink-600 hover:text-white text-pink-800 font-bold py-4 px-6 rounded-2xl text-lg w-full justify-center transition border border-pink-100"
                      onClick={() => {
                        setShowValuationModal(false);
                        navigate(`/valoracion?paciente=${id}&tipo=pisopelvico`);
                      }}
                    >
                      💖 Piso Pélvico
                    </button>
                    <button
                      className="flex items-center gap-3 bg-blue-50 hover:bg-blue-600 hover:text-white text-blue-800 font-bold py-4 px-6 rounded-2xl text-lg w-full justify-center transition border border-blue-100"
                      onClick={() => {
                        setShowValuationModal(false);
                        navigate(`/valoracion?paciente=${id}&tipo=lactancia`);
                      }}
                    >
                      🤱 Lactancia
                    </button>
                    <button
                      className="flex items-center gap-3 bg-green-50 hover:bg-green-600 hover:text-white text-green-800 font-bold py-4 px-6 rounded-2xl text-lg w-full justify-center transition border border-green-100"
                      onClick={() => {
                        setShowValuationModal(false);
                        navigate(`/valoracion?paciente=${id}&tipo=perinatal`);
                      }}
                    >
                      🤰 Perinatal
                    </button>
                  </>
                )}
              </div>
              <button
                className="mt-6 text-gray-400 hover:text-gray-600 font-medium transition"
                onClick={() => setShowValuationModal(false)}
              >
                Cerrar
              </button>
            </div>
          </div>
        )}

        {/* Modal para Registrar Paquete (Comprar) */}
        {showPackageModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm">
            <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full border border-green-100 animate-pop">
              <h2 className="text-2xl font-bold text-green-700 mb-6 text-center">
                🛒 Comprar Paquete
              </h2>
              <form
                onSubmit={handleRegistrarPaquete}
                className="flex flex-col gap-4"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Número de Factura *
                  </label>
                  <input
                    type="text"
                    value={numeroFactura}
                    onChange={(e) => setNumeroFactura(e.target.value)}
                    className="w-full border border-green-300 focus:border-green-500 focus:ring-green-500 rounded-xl px-4 py-3 transition outline-none bg-green-50"
                    placeholder="Ej: FAC-001"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Clases Pagadas *
                  </label>
                  <input
                    type="number"
                    value={clasesPagadas}
                    min={1}
                    onChange={(e) => setClasesPagadas(e.target.value)}
                    className="w-full border border-green-300 focus:border-green-500 focus:ring-green-500 rounded-xl px-4 py-3 transition outline-none bg-green-50"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fecha de Pago *
                  </label>
                  <input
                    type="date"
                    value={fechaPago}
                    onChange={(e) => setFechaPago(e.target.value)}
                    className="w-full border border-green-300 focus:border-green-500 focus:ring-green-500 rounded-xl px-4 py-3 transition outline-none bg-green-50"
                    required
                  />
                </div>
                <div className="flex gap-3 mt-4">
                  <button
                    type="button"
                    onClick={() => setShowPackageModal(false)}
                    className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-3 rounded-xl transition"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl shadow transition flex items-center justify-center gap-2"
                  >
                    <CreditCardIcon className="h-5 w-5" /> Registrar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
