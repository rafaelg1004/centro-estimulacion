import React, { useCallback } from "react";
import FirmaCanvas from "../valoraciondeingreso/FirmaCanvas";
import { 
  ClipboardDocumentCheckIcon,
  MagnifyingGlassIcon,
  DocumentTextIcon,
  PencilSquareIcon,
  ExclamationCircleIcon
} from "@heroicons/react/24/outline";

// Componente para secciones (fuera del componente principal para evitar re-creación)
const Section = ({ title, icon: Icon, children, bgColor = "bg-indigo-50", iconColor = "text-indigo-600" }) => (
  <div className={`${bgColor} border border-indigo-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300`}>
    <div className="flex items-center gap-3 mb-4">
      <div className={`p-2 ${iconColor} bg-white rounded-xl shadow-sm`}>
        <Icon className="w-5 h-5" />
      </div>
      <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
    </div>
    {children}
  </div>
);

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
  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setFormulario((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }, [setFormulario]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Título principal */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Valoración Piso Pélvico
          </h1>
          <h2 className="text-2xl font-semibold text-gray-700">
            Paso 11: Evaluación TRP
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 mx-auto mt-4 rounded-full"></div>
        </div>

        <form
          onSubmit={e => {
            e.preventDefault();
            siguientePaso();
          }}
          className="space-y-8"
        >
          {/* Evaluación TRP Exopélvicos */}
          <Section 
            title="Evaluación TRP Exopélvicos" 
            icon={ClipboardDocumentCheckIcon}
            bgColor="bg-blue-50"
            iconColor="text-blue-600"
          >
            <div className="overflow-x-auto">
              <div className="bg-white rounded-xl shadow-sm border border-blue-100">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="bg-blue-100 border-b border-blue-200">
                      <th className="px-4 py-3 text-left font-semibold text-blue-900">Ligamento/Músculo</th>
                      <th className="px-4 py-3 text-center font-semibold text-blue-900">Izq. Activo</th>
                      <th className="px-4 py-3 text-center font-semibold text-blue-900">Izq. Latente</th>
                      <th className="px-4 py-3 text-center font-semibold text-blue-900">Der. Activo</th>
                      <th className="px-4 py-3 text-center font-semibold text-blue-900">Der. Latente</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ligamentosMusculos.map((nombre, index) => (
                      <tr key={nombre} className={`border-b border-blue-100 hover:bg-blue-25 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-blue-25'}`}>
                        <td className="px-4 py-3 text-gray-800 font-medium">{nombre}</td>
                        <td className="px-4 py-3 text-center">
                          <input
                            type="checkbox"
                            name={`exo_${nombre}_izq_activo`}
                            checked={formulario[`exo_${nombre}_izq_activo`] || false}
                            onChange={handleChange}
                            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          />
                        </td>
                        <td className="px-4 py-3 text-center">
                          <input
                            type="checkbox"
                            name={`exo_${nombre}_izq_latente`}
                            checked={formulario[`exo_${nombre}_izq_latente`] || false}
                            onChange={handleChange}
                            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          />
                        </td>
                        <td className="px-4 py-3 text-center">
                          <input
                            type="checkbox"
                            name={`exo_${nombre}_der_activo`}
                            checked={formulario[`exo_${nombre}_der_activo`] || false}
                            onChange={handleChange}
                            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          />
                        </td>
                        <td className="px-4 py-3 text-center">
                          <input
                            type="checkbox"
                            name={`exo_${nombre}_der_latente`}
                            checked={formulario[`exo_${nombre}_der_latente`] || false}
                            onChange={handleChange}
                            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </Section>

          {/* Evaluación Prolapso Organopélvico */}
          <Section 
            title="Evaluación Prolapso Organopélvico" 
            icon={MagnifyingGlassIcon}
            bgColor="bg-purple-50"
            iconColor="text-purple-600"
          >
            <div className="overflow-x-auto">
              <div className="bg-white rounded-xl shadow-sm border border-purple-100">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="bg-purple-100 border-b border-purple-200">
                      <th className="px-4 py-3 text-left font-semibold text-purple-900">Órgano</th>
                      <th className="px-4 py-3 text-center font-semibold text-purple-900">Grado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {prolapsos.map((nombre, index) => (
                      <tr key={nombre} className={`border-b border-purple-100 hover:bg-purple-25 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-purple-25'}`}>
                        <td className="px-4 py-3 text-gray-800 font-medium">{nombre}</td>
                        <td className="px-4 py-3 text-center">
                          <input
                            type="text"
                            name={`prolapso_${nombre}_grado`}
                            value={formulario[`prolapso_${nombre}_grado`] || ""}
                            onChange={handleChange}
                            className="w-20 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm hover:border-gray-300 text-center"
                            placeholder="0-4"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </Section>

          {/* Evaluación TRP Endopélvicos */}
          <Section 
            title="Evaluación TRP Endopélvicos" 
            icon={DocumentTextIcon}
            bgColor="bg-green-50"
            iconColor="text-green-600"
          >
            <div className="overflow-x-auto">
              <div className="bg-white rounded-xl shadow-sm border border-green-100">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="bg-green-100 border-b border-green-200">
                      <th className="px-4 py-3 text-left font-semibold text-green-900">Ligamento/Músculo</th>
                      <th className="px-4 py-3 text-center font-semibold text-green-900">Presente</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ligEndopelvicos.map((nombre, index) => (
                      <tr key={nombre} className={`border-b border-green-100 hover:bg-green-25 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-green-25'}`}>
                        <td className="px-4 py-3 text-gray-800 font-medium">{nombre}</td>
                        <td className="px-4 py-3 text-center">
                          <input
                            type="checkbox"
                            name={`endo_${nombre}_presente`}
                            checked={formulario[`endo_${nombre}_presente`] || false}
                            onChange={handleChange}
                            className="h-4 w-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </Section>

          {/* Diagnóstico y Plan */}
          <Section 
            title="Diagnóstico y Plan de Intervención" 
            icon={ExclamationCircleIcon}
            bgColor="bg-red-50"
            iconColor="text-red-600"
          >
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Dolor</label>
                <textarea
                  name="dolorTRP"
                  value={formulario.dolorTRP || ""}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm hover:border-gray-300 resize-none"
                  placeholder="Descripción del dolor y localización..."
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Diagnóstico Fisioterapéutico</label>
                <textarea
                  name="diagnosticoFisio"
                  value={formulario.diagnosticoFisio || ""}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm hover:border-gray-300 resize-none"
                  placeholder="Diagnóstico fisioterapéutico del paciente..."
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Plan de Intervención</label>
                <textarea
                  name="planIntervencion"
                  value={formulario.planIntervencion || ""}
                  onChange={handleChange}
                  rows={5}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm hover:border-gray-300 resize-none"
                  placeholder="Detalle del plan de intervención y tratamiento propuesto..."
                />
              </div>
            </div>
          </Section>

          {/* Firmas */}
          <Section 
            title="Firmas y Autorizaciones" 
            icon={PencilSquareIcon}
            bgColor="bg-amber-50"
            iconColor="text-amber-600"
          >
            <div className="space-y-8">
              {/* Firma del Paciente */}
              <div className="bg-white p-6 rounded-xl border border-amber-200 shadow-sm">
                <h4 className="text-md font-semibold text-gray-800 mb-4 text-center">Firma del Paciente</h4>
                <div className="flex justify-center">
                  <FirmaCanvas
                    label="Firma de Paciente"
                    name="firmaPaciente"
                    formulario={formulario}
                    setFormulario={(campo, valor) => setFormulario(f => ({ ...f, [campo]: valor }))}
                  />
                </div>
              </div>

              {/* Firma del Fisioterapeuta */}
              <div className="bg-white p-6 rounded-xl border border-amber-200 shadow-sm">
                <h4 className="text-md font-semibold text-gray-800 mb-4 text-center">Firma del Fisioterapeuta</h4>
                <div className="flex justify-center">
                  <FirmaCanvas
                    label="Firma del Fisioterapeuta"
                    name="firmaFisioterapeuta"
                    formulario={formulario}
                    setFormulario={(campo, valor) => setFormulario(f => ({ ...f, [campo]: valor }))}
                  />
                </div>
              </div>

              {/* Autorización */}
              <div className="bg-white p-6 rounded-xl border border-amber-200 shadow-sm">
                <div className="mb-6">
                  <h4 className="text-md font-semibold text-gray-800 mb-3">Autorización para Uso de Imagen</h4>
                  <p className="text-sm text-gray-600 text-justify leading-relaxed">
                    Autorizo a D'Mamitas & Babies para reproducir fotografías e imágenes de las actividades en las que participe, para ser utilizadas en sus publicaciones, proyectos, redes sociales y página Web.
                  </p>
                </div>
                <h4 className="text-md font-semibold text-gray-800 mb-4 text-center">Firma autorización (cc.)</h4>
                <div className="flex justify-center">
                  <FirmaCanvas
                    label="Firma autorización (cc.)"
                    name="firmaAutorizacion"
                    formulario={formulario}
                    setFormulario={(campo, valor) => setFormulario(f => ({ ...f, [campo]: valor }))}
                  />
                </div>
              </div>
            </div>
          </Section>

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