import React from "react";
import FirmaCanvas from "../valoraciondeingreso/FirmaCanvas";

const ligamentosMusculos = [
  "LIGAMENTO ILIO LUMBAR LIL",
  "LIGAMENTO SACRO ILIACO LSI",
  "LIGAMENTO SACROCIATICO LSC",
  "LIGAMENTO SACROTUBEROSO LST",
  "LIGAMENTO SACROCOCCIGEO LSC",
  "DXTORACICO DXOG",
  "RECTO ABDOMINAL",
  "OBLICUO EXTERNO",
  "OBLICUO INTERNO",
  "PSOAS ILIACO",
  "ERECTORES",
  "CUADRADO LUMBAR",
  "GLUTEO MAYOR",
  "GLUTEO MENOR",
  "ISQUIOTIBIALES",
  "PIRAMIDAL",
  "GLUTEO MEDIO",
  "SARTORIO",
  "PELVITROCANTEREOS",
  "CUADRADO CRURAL",
  "ADUCTORES",
  "CINTURA ESCAPULAR",
  "CUELLO/HOMBRO",
  "INTERESCAPULARES",
  "OTRO MUSCULO"
];

const prolapsos = [
  "VESICOCELE",
  "URETROCELE",
  "UTEROCELE",
  "RECTOCELE",
  "PROCTOCELE",
  "ELITROCELE / ENTEROCELE",
  "SINDROME PERINEO DESCENDENTE"
];

const ligEndopelvicos = [
  "LIG. URACO 12",
  "LIG. REDONDO",
  "LIG. ANCHO 3-9",
  "LIG. CARDINAL 4-8",
  "LIG. UTEROSACRO 5-7 RODEA AMPOLLA RECTAL",
  "LIG ANOCOCCIGEO /SACROCOGCIGEO",
  "NUCLEO FIBROSO CENTRAL PERINEAL",
  "TRANSVERSO SUPERFICIAL/ PROF",
  "BULBO CAVERNOSO",
  "ISQUICAVERNOSO",
  "DUG ESFINTER URETRALEXTERNO/COMPRESOR URETRAL /URETROVAGINAL",
  "PUBOURETRAL PU",
  "PUBOVAGINAL PV",
  "ESFINTER ANAL /PUBORECTAL EAE",
  "PUBOCOCCIGEO PC",
  "OBTURATOR INTERNO/ PIRAMIDAL OI",
  "ILIOCOCCIGEO IL",
  "COCCIGEO"
];

export default function Paso11EvaluacionTRP({ formulario, setFormulario, siguientePaso, pasoAnterior }) {
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormulario((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-100 via-purple-100 to-green-100">
      <div className="bg-white bg-opacity-90 p-2 md:p-6 rounded-3xl shadow-2xl flex flex-col gap-8 w-full max-w-3xl border border-indigo-100">
        <form
          onSubmit={e => {
            e.preventDefault();
            siguientePaso();
          }}
          className="space-y-8"
        >
          <h3 className="text-xl font-bold text-indigo-700 mb-4">Evaluación TRP Exopélvicos</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full text-xs border mb-4">
              <thead>
                <tr>
                  <th className="border px-2 py-1">Ligamento/Músculo</th>
                  <th className="border px-2 py-1">Izq. Activo</th>
                  <th className="border px-2 py-1">Izq. Latente</th>
                  <th className="border px-2 py-1">Der. Activo</th>
                  <th className="border px-2 py-1">Der. Latente</th>
                </tr>
              </thead>
              <tbody>
                {ligamentosMusculos.map((nombre) => (
                  <tr key={nombre}>
                    <td className="border px-2 py-1">{nombre}</td>
                    <td className="border px-2 py-1 text-center">
                      <input
                        type="checkbox"
                        name={`exo_${nombre}_izq_activo`}
                        checked={formulario[`exo_${nombre}_izq_activo`] || false}
                        onChange={handleChange}
                      />
                    </td>
                    <td className="border px-2 py-1 text-center">
                      <input
                        type="checkbox"
                        name={`exo_${nombre}_izq_latente`}
                        checked={formulario[`exo_${nombre}_izq_latente`] || false}
                        onChange={handleChange}
                      />
                    </td>
                    <td className="border px-2 py-1 text-center">
                      <input
                        type="checkbox"
                        name={`exo_${nombre}_der_activo`}
                        checked={formulario[`exo_${nombre}_der_activo`] || false}
                        onChange={handleChange}
                      />
                    </td>
                    <td className="border px-2 py-1 text-center">
                      <input
                        type="checkbox"
                        name={`exo_${nombre}_der_latente`}
                        checked={formulario[`exo_${nombre}_der_latente`] || false}
                        onChange={handleChange}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h4 className="text-lg font-bold text-indigo-600 mb-2">Evaluación Prolapso Organopélvico</h4>
          <div className="overflow-x-auto">
            <table className="min-w-full text-xs border mb-4">
              <thead>
                <tr>
                  <th className="border px-2 py-1">Órgano</th>
                  <th className="border px-2 py-1">Grado</th>
                </tr>
              </thead>
              <tbody>
                {prolapsos.map((nombre) => (
                  <tr key={nombre}>
                    <td className="border px-2 py-1">{nombre}</td>
                    <td className="border px-2 py-1">
                      <input
                        type="text"
                        name={`prolapso_${nombre}_grado`}
                        value={formulario[`prolapso_${nombre}_grado`] || ""}
                        onChange={handleChange}
                        className="w-16 px-1 py-1 border rounded"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h4 className="text-lg font-bold text-indigo-600 mb-2">Evaluación TRP Endopélvicos</h4>
          <div className="overflow-x-auto">
            <table className="min-w-full text-xs border mb-4">
              <thead>
                <tr>
                  <th className="border px-2 py-1">Ligamento/Músculo</th>
                  <th className="border px-2 py-1">Presente</th>
                </tr>
              </thead>
              <tbody>
                {ligEndopelvicos.map((nombre) => (
                  <tr key={nombre}>
                    <td className="border px-2 py-1">{nombre}</td>
                    <td className="border px-2 py-1 text-center">
                      <input
                        type="checkbox"
                        name={`endo_${nombre}_presente`}
                        checked={formulario[`endo_${nombre}_presente`] || false}
                        onChange={handleChange}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Sección de Diagnóstico y Plan */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-1 mt-8">
            <div className="flex flex-col md:flex-row gap-8">
              <div className="flex-1 flex flex-col gap-6">
                <div>
                  <label className="font-semibold mb-1">Dolor:</label>
                  <textarea
                    name="dolorTRP"
                    value={formulario.dolorTRP || ""}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-indigo-200 rounded resize-none"
                    rows={3}
                  />
                </div>
                <div>
                  <label className="font-semibold mb-1">Diagnóstico Fisioterapéutico:</label>
                  <textarea
                    name="diagnosticoFisio"
                    value={formulario.diagnosticoFisio || ""}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-indigo-200 rounded resize-none"
                    rows={3}
                  />
                </div>
                <div>
                  <label className="font-semibold mb-1">Plan de Intervención:</label>
                  <textarea
                    name="planIntervencion"
                    value={formulario.planIntervencion || ""}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-indigo-200 rounded resize-none"
                    rows={5}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Sección de Firmas */}
          <div className="flex flex-col gap-8 mt-8">
            <div className="flex flex-col items-center">
              <label className="font-semibold mb-2">Firma de Paciente:</label>
              <FirmaCanvas
                label="Firma de Paciente"
                name="firmaPaciente"
                formulario={formulario}
                setFormulario={(campo, valor) => setFormulario(f => ({ ...f, [campo]: valor }))}
              />
            </div>
            <div className="flex flex-col items-center">
              <label className="font-semibold mb-2">Firma del Fisioterapeuta:</label>
              <FirmaCanvas
                label="Firma del Fisioterapeuta"
                name="firmaFisioterapeuta"
                formulario={formulario}
                setFormulario={(campo, valor) => setFormulario(f => ({ ...f, [campo]: valor }))}
              />
            </div>
          </div>

          {/* Sección de Autorización */}
          <div className="border-t pt-6 mt-8">
            <p className="mb-4 text-justify">
              Autorizo a D'Mamitas & Babies para reproducir fotografías e imágenes de las actividades en las que participe, para ser utilizadas en sus publicaciones, proyectos, redes sociales y página Web.
            </p>
            <div className="flex flex-col items-center">
              <label className="font-semibold mb-2">Firma autorización (cc.):</label>
              <FirmaCanvas
                label="Firma autorización (cc.)"
                name="firmaAutorizacion"
                formulario={formulario}
                setFormulario={(campo, valor) => setFormulario(f => ({ ...f, [campo]: valor }))}
              />
            </div>
          </div>

          {/* Botones */}
          <div className="flex justify-between mt-8">
            <button
              type="button"
              onClick={pasoAnterior}
              className="bg-gray-300 hover:bg-gray-400 text-black px-6 py-2 rounded font-bold"
            >
              Anterior
            </button>
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded transition"
            >
              Siguiente
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}