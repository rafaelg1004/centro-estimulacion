import React from "react";
import {
  LockClosedIcon,
  ArrowLeftIcon,
  ArrowDownTrayIcon,
} from "@heroicons/react/24/solid";

const Card = ({ title, children }) => (
  <div className="bg-indigo-50/50 rounded-3xl shadow-sm p-6 mb-8 border border-indigo-100/50">
    <h3 className="text-xl font-bold text-indigo-700 mb-6 border-b border-indigo-100 pb-2">
      {title}
    </h3>
    {children}
  </div>
);

function Field({ label, value, isImage, audit, options, type }) {
  const [enrichedValue, setEnrichedValue] = React.useState(value);

  React.useEffect(() => {
    const resolveValue = async () => {
      if (!value) {
        setEnrichedValue(null);
        return;
      }

      // Si es un select, buscar la etiqueta en las opciones
      if (options && options.length > 0) {
        const option = options.find(
          (o) =>
            String(o.valor) === String(value) || String(o) === String(value),
        );
        if (option) {
          setEnrichedValue(option.etiqueta || option);
          return;
        }
      }

      // Si es CIE-10 y solo viene el código, intentar buscar la descripción
      if (
        type === "cie10" &&
        typeof value === "string" &&
        value.length > 0 &&
        !value.includes(" - ")
      ) {
        try {
          // Importar dinámicamente o usar fetch si está disponible
          const res = await fetch(
            `${window.location.origin}/api/cie10?q=${value}&limit=1`,
          );
          const data = await res.json();
          if (
            data &&
            data.length > 0 &&
            data[0].codigo.toUpperCase() === value.toUpperCase()
          ) {
            setEnrichedValue(`${data[0].codigo} - ${data[0].descripcion}`);
            return;
          }
        } catch (e) {
          console.warn("Error resolviendo CIE-10", e);
        }
      }

      // Si es una fecha (tipo datetime-local o parece una fecha ISO)
      if (
        type === "datetime-local" ||
        type === "date" ||
        (typeof value === "string" &&
          value.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/))
      ) {
        const date = new Date(value);
        if (!isNaN(date.getTime())) {
          setEnrichedValue(
            date.toLocaleString("es-CO", {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            }),
          );
          return;
        }
      }

      setEnrichedValue(value);
    };
    resolveValue();
  }, [value, options, type]);

  if (isImage && (enrichedValue || audit)) {
    return (
      <div className="flex flex-col items-center mb-6 p-4 bg-white rounded-2xl border border-dashed border-gray-200 shadow-sm">
        {label && (
          <span className="font-bold text-indigo-900 mb-3 text-sm uppercase tracking-wider">
            {label}
          </span>
        )}
        {enrichedValue ? (
          <img
            src={enrichedValue}
            alt={label}
            className="max-w-xs rounded-xl shadow-md border bg-gray-50 max-h-40 object-contain p-2 hover:scale-105 transition-transform"
          />
        ) : (
          <div className="h-24 w-48 flex items-center justify-center text-gray-300 italic border rounded-xl bg-gray-50">
            Sin firma registrada
          </div>
        )}
        {audit && (
          <div className="text-[10px] text-gray-400 mt-3 text-center font-mono leading-relaxed bg-gray-50 p-2 rounded-lg border w-full max-w-[250px]">
            <span className="text-indigo-400 font-bold">
              CERTIFICADO ELECTRÓNICO
            </span>
            <br />
            IP: {audit.ip || "N/A"} <br />
            {audit.fechaHora
              ? new Date(audit.fechaHora).toLocaleString()
              : "Fecha N/A"}
            {audit.registroProfesional && (
              <>
                <br />
                <span className="text-pink-400">
                  REG: {audit.registroProfesional}
                </span>
              </>
            )}
          </div>
        )}
      </div>
    );
  }

  if (typeof enrichedValue === "boolean") {
    return (
      <div className="flex items-center gap-2 mb-3 p-3 bg-white rounded-xl border border-indigo-50 shadow-sm">
        <span
          className={`h-3 w-3 rounded-full ${enrichedValue ? "bg-green-500 animate-pulse" : "bg-gray-300"}`}
        ></span>
        <span className="font-semibold text-gray-600 text-sm whitespace-nowrap">
          {label}:
        </span>
        <span
          className={`font-bold ${enrichedValue ? "text-green-700" : "text-gray-400"}`}
        >
          {enrichedValue ? "SÍ" : "NO"}
        </span>
      </div>
    );
  }

  return (
    <div className="flex flex-col mb-4 p-3 hover:bg-indigo-50/30 rounded-xl transition-colors">
      {label && (
        <span className="font-bold text-indigo-900 mb-1 text-xs uppercase tracking-tight">
          {label}
        </span>
      )}
      <span className="text-gray-800 font-medium break-words leading-relaxed">
        {enrichedValue ? (
          String(enrichedValue)
        ) : (
          <span className="text-gray-300 italic">No registrado</span>
        )}
      </span>
    </div>
  );
}

export default function DynamicDetailBuilder({
  esquema,
  data,
  onBack,
  onEdit,
  onPrint,
  onExportPDF,
  onLock,
}) {
  // Función para obtener valor anidado usando dot notation (ej. modulo.campo)
  const getNestedValue = (obj, path) => {
    if (!path) return null;
    return path.split(".").reduce((acc, part) => acc && acc[part], obj);
  };

  const calcularEdad = (fechaNac) => {
    if (!fechaNac) return "N/A";
    const hoy = new Date();
    const cumple = new Date(fechaNac);

    let edadAnos = hoy.getFullYear() - cumple.getFullYear();
    let edadMeses = hoy.getMonth() - cumple.getMonth();

    if (hoy.getDate() < cumple.getDate()) {
      edadMeses--;
    }

    if (edadMeses < 0) {
      edadAnos--;
      edadMeses += 12;
    }

    if (edadAnos < 2) {
      const totalMeses = edadAnos * 12 + edadMeses;
      return `${edadAnos} años (${totalMeses} meses)`;
    }

    return `${edadAnos} años`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-pink-50 py-10 px-4">
      <div className="max-w-5xl mx-auto bg-white p-6 md:p-12 rounded-[2.5rem] shadow-2xl border border-indigo-100 relative overflow-hidden">
        {/* Decoración Background */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-100 rounded-full blur-3xl opacity-20 -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-pink-100 rounded-full blur-3xl opacity-20 -ml-32 -mb-32"></div>

        <div className="relative z-10">
          {/* Header de Acciones */}
          <div className="flex flex-wrap justify-between items-center mb-10 gap-4 border-b border-indigo-100 pb-8">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-indigo-600 font-bold hover:bg-indigo-50 px-4 py-2 rounded-xl transition-all"
            >
              <ArrowLeftIcon className="h-5 w-5" /> Volver
            </button>

            <div className="flex flex-wrap gap-3">
              {!data.bloqueada && onEdit && (
                <button
                  onClick={onEdit}
                  className="bg-amber-400 hover:bg-amber-500 text-white font-bold py-2.5 px-6 rounded-xl shadow-lg transition-all flex items-center gap-2"
                >
                  Editar Historia
                </button>
              )}
              {onExportPDF && (
                <button
                  onClick={onExportPDF}
                  className="bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 px-6 rounded-xl shadow-lg transition-all flex items-center gap-2"
                >
                  <ArrowDownTrayIcon className="h-5 w-5" /> Exportar PDF
                </button>
              )}
              {!data.bloqueada && onLock && (
                <button
                  onClick={onLock}
                  className="bg-red-500 hover:bg-red-600 text-white font-bold py-2.5 px-6 rounded-xl shadow-lg transition-all flex items-center gap-2"
                >
                  <LockClosedIcon className="h-5 w-5" /> Cerrar Historia
                </button>
              )}
            </div>
          </div>

          {/* Título y Estado */}
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-700 to-pink-600 mb-4 uppercase tracking-tighter">
              {esquema.titulo}
            </h2>
            {data.bloqueada ? (
              <div className="inline-flex items-center gap-2 bg-green-100 border border-green-200 text-green-700 px-6 py-2 rounded-full font-black text-xs uppercase tracking-widest shadow-sm">
                <LockClosedIcon className="h-4 w-4" /> Historia Cerrada e
                Inmutable (Ley 527/99)
              </div>
            ) : (
              <div className="inline-flex items-center gap-2 bg-amber-100 border border-amber-200 text-amber-700 px-6 py-2 rounded-full font-black text-xs uppercase tracking-widest shadow-sm">
                ✍️ Documento en Proceso de Edición
              </div>
            )}
          </div>

          {/* Datos del Paciente - siempre debe venir del populate de paciente */}
          {data.paciente && (
            <Card title="Ficha del Paciente">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-2">
                <Field
                  label="Nombre Completo"
                  value={`${data.paciente.nombres} ${data.paciente.apellidos || ""}`}
                />
                <Field
                  label="Identificación"
                  value={`${data.paciente.tipoDocumentoIdentificacion || "CC"}: ${data.paciente.numDocumentoIdentificacion || "S.D"}`}
                />
                <Field
                  label="Edad Actual"
                  value={calcularEdad(data.paciente.fechaNacimiento)}
                />
                <Field
                  label="Sexo / Género"
                  value={
                    data.paciente.codSexo === "M"
                      ? "Masculino"
                      : data.paciente.codSexo === "F"
                        ? "Femenino"
                        : data.paciente.codSexo
                  }
                />
                <Field
                  label="Aseguradora"
                  value={data.paciente.aseguradora || "Particular"}
                />
                <Field
                  label="Teléfono / Celular"
                  value={
                    data.paciente.telefono ||
                    data.paciente.celular ||
                    data.paciente.datosContacto?.telefono ||
                    "S.D"
                  }
                />

                {/* Campos Extra para Niños */}
                {!data.paciente.esAdulto && (
                  <>
                    <Field label="Pediatra" value={data.paciente.pediatra} />
                    <Field label="Madre" value={data.paciente.nombreMadre} />
                    <Field label="Padre" value={data.paciente.nombrePadre} />
                  </>
                )}

                {/* Campos Extra para Adultos/Materno */}
                {data.paciente.esAdulto && (
                  <>
                    <Field
                      label="Sem. Gestación"
                      value={data.paciente.semanasGestacion}
                    />
                    <Field label="FUM" value={data.paciente.fum} />
                    <Field label="Ocupación" value={data.paciente.ocupacion} />
                  </>
                )}

                <div className="md:col-span-2 lg:col-span-3">
                  <Field
                    label="Dirección de Residencia"
                    value={
                      data.paciente.direccion ||
                      data.paciente.datosContacto?.direccion
                    }
                  />
                </div>
              </div>
            </Card>
          )}

          {/* Secciones del Cuerpo */}
          <div className="space-y-4">
            {esquema.secciones.map((seccion, sIdx) => (
              <Card key={sIdx} title={seccion.titulo}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-2">
                  {/* Campos estáticos del esquema */}
                  {seccion.campos &&
                    seccion.campos.map((campo, cIdx) => {
                      // Verificar visibilidad (dependeDe)
                      if (campo.dependeDe) {
                        const depValue = getNestedValue(
                          data,
                          campo.dependeDe.campo,
                        );
                        if (depValue !== campo.dependeDe.valor) return null;
                      }

                      const val = getNestedValue(data, campo.nombre);
                      const audit = data.auditTrail
                        ? getNestedValue(data.auditTrail, campo.nombre)
                        : null;

                      return (
                        <div
                          key={cIdx}
                          className={
                            campo.tipo === "firma" || campo.tipo === "textarea"
                              ? "md:col-span-2 lg:col-span-3"
                              : ""
                          }
                        >
                          <Field
                            label={campo.etiqueta}
                            value={val}
                            isImage={campo.tipo === "firma"}
                            audit={audit}
                            options={campo.opciones}
                            type={campo.tipo}
                          />
                        </div>
                      );
                    })}

                  {/* Campos dinámicos - muestra TODOS los datos del módulo */}
                  {seccion.camposDinamicos &&
                    data[seccion.camposDinamicos] &&
                    data[seccion.camposDinamicos].map((campo, cIdx) => (
                      <div
                        key={`dyn-${cIdx}`}
                        className={
                          String(campo.valor).length > 50
                            ? "md:col-span-2 lg:col-span-3"
                            : ""
                        }
                      >
                        <Field
                          label={campo.etiqueta}
                          value={campo.valor}
                          isImage={String(campo.valor).startsWith("http")}
                        />
                      </div>
                    ))}
                </div>
              </Card>
            ))}
          </div>

          {/* Datos de Migración (Legacy) */}
          {data._datosLegacy && Object.keys(data._datosLegacy).length > 0 && (
            <Card title="Datos Adicionales del Formulario Original">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-2">
                {Object.entries(data._datosLegacy).map(([key, val], idx) => {
                  // Omitir campos internos y ya mapeados
                  const lowerKey = key.toLowerCase();
                  if (
                    [
                      "__v",
                      "_id",
                      "paciente",
                      "idpaciente",
                      "nino",
                      "createdat",
                      "updatedat",
                      "bloqueada",
                      "datosformulario",
                    ].some((skip) => lowerKey.includes(skip))
                  )
                    return null;
                  if (
                    val === null ||
                    val === undefined ||
                    val === "" ||
                    val === false
                  )
                    return null;

                  // Si es un array directo (ej: ['1', '2'])
                  if (Array.isArray(val)) {
                    const arrayStr = val
                      .filter((v) => v && v !== "")
                      .join(", ");
                    if (!arrayStr) return null;
                    return (
                      <div key={idx} className="md:col-span-2 lg:col-span-3">
                        <Field
                          label={key
                            .replace(/([A-Z])/g, " $1")
                            .replace(/_/g, " ")
                            .toUpperCase()}
                          value={arrayStr}
                        />
                      </div>
                    );
                  }

                  // Si es un objeto, mostrar sus propiedades
                  if (typeof val === "object" && val !== null) {
                    return Object.entries(val).map(
                      ([subKey, subVal], subIdx) => {
                        if (
                          subVal === null ||
                          subVal === undefined ||
                          subVal === "" ||
                          subVal === false
                        )
                          return null;

                        let finalVal = subVal;
                        if (Array.isArray(subVal)) {
                          finalVal = subVal.filter((v) => v).join(", ");
                          if (!finalVal) return null;
                        } else if (typeof subVal === "object") {
                          return null; // Omitir objetos anidados muy profundos
                        }

                        const isFirma = String(finalVal).startsWith("http");
                        const etiqueta = `${key} - ${subKey}`
                          .replace(/([A-Z])/g, " $1")
                          .replace(/_/g, " ");

                        return (
                          <div
                            key={`${idx}-${subIdx}`}
                            className={
                              isFirma || String(finalVal).length > 50
                                ? "md:col-span-2 lg:col-span-3"
                                : ""
                            }
                          >
                            <Field
                              label={etiqueta.toUpperCase()}
                              value={finalVal}
                              isImage={isFirma}
                            />
                          </div>
                        );
                      },
                    );
                  }

                  // Valor simple
                  const isFirma = String(val).startsWith("http");
                  const etiqueta = key
                    .replace(/([A-Z])/g, " $1")
                    .replace(/_/g, " ");
                  return (
                    <div
                      key={idx}
                      className={
                        isFirma || String(val).length > 50
                          ? "md:col-span-2 lg:col-span-3"
                          : ""
                      }
                    >
                      <Field
                        label={etiqueta.toUpperCase()}
                        value={val}
                        isImage={isFirma}
                      />
                    </div>
                  );
                })}
              </div>
            </Card>
          )}

          {/* Sellado de Integridad */}
          {data.bloqueada && data.selloIntegridad && (
            <div className="mt-12 p-6 bg-gray-50 rounded-[2rem] border border-gray-100 shadow-inner">
              <div className="flex items-center gap-3 mb-4">
                <span className="h-10 w-10 rounded-full bg-green-500 flex items-center justify-center text-white shadow-md">
                  <LockClosedIcon className="h-6 w-6" />
                </span>
                <div>
                  <h4 className="font-black text-gray-800 text-sm uppercase tracking-widest">
                    Sellado de Integridad Criptográfico
                  </h4>
                  <p className="text-[10px] text-gray-500 font-medium">
                    CERTIFICADO DE NO REPUDIO Y ORIGINALIDAD
                  </p>
                </div>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-gray-200 font-mono text-[10px] break-all leading-relaxed shadow-sm text-gray-600">
                <strong>HASH SHA-256:</strong> {data.selloIntegridad}
              </div>
              <p className="mt-4 text-[10px] text-gray-400 italic text-center uppercase tracking-tighter">
                Documento guardado permanentemente el{" "}
                {new Date(data.fechaBloqueo).toLocaleString()}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
