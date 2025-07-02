import React from "react";
import FirmaCanvas from "../valoraciondeingreso/FirmaCanvas";

export default function PasoLactanciaPrenatal({
  formulario,
  setFirma,
  handleChange,
  anterior,
  onSubmit,
  InputField,
}) {
  return (
    <div>
      <h3 className="text-lg font-bold mb-4 text-indigo-700">Lactancia Prenatal</h3>
      <p className="mb-4 text-gray-700">
        En lactancia prenatal, que consta de una sesión teórica y una visita en la clínica o en casa según su necesidad, es importante que nos avise la fecha posible del nacimiento. Además, contará con nuestro acompañamiento telefónico para cualquier duda e inquietud.
      </p>

      {/* Sesión 1 */}
      <div className="mb-6 border rounded p-4 bg-gray-50">
        <h4 className="font-semibold mb-2 text-indigo-600">Sesión No. 1 - Teórico-práctica</h4>
        <div className="flex flex-col items-center gap-2">
          <div className="w-full max-w-xs">
            <InputField
              label="Fecha sesión 1"
              name="fechaSesion1"
              type="date"
              value={formulario.fechaSesion1 || ""}
              onChange={handleChange}
            />
          </div>
          <div className="w-full max-w-xs">
            <FirmaCanvas
              label="Firma paciente sesión 1"
              name="firmaPacienteSesion1"
              setFormulario={setFirma}
              formulario={formulario}
            />
          </div>
        </div>
      </div>

      {/* Sesión 2 */}
      <div className="mb-6 border rounded p-4 bg-gray-50">
        <h4 className="font-semibold mb-2 text-indigo-600">Sesión No. 2 - Visita</h4>
        <div className="flex flex-col items-center gap-2">
          <div className="w-full max-w-xs">
            <InputField
              label="Fecha sesión 2"
              name="fechaSesion2"
              type="date"
              value={formulario.fechaSesion2 || ""}
              onChange={handleChange}
            />
          </div>
          <div className="w-full max-w-xs">
            <FirmaCanvas
              label="Firma paciente sesión 2"
              name="firmaPacienteSesion2"
              setFormulario={setFirma}
              formulario={formulario}
            />
          </div>
        </div>
      </div>

      {/* Consentimiento */}
      <div className="mb-6">
        <p className="mb-2 text-gray-700">
          Yo <span className="font-semibold underline">{formulario.nombres}</span> identificada con Cédula de Ciudadanía <span className="font-semibold underline">{formulario.cedula}</span> he entendido con claridad la explicación que me ha dado la Fisioterapeuta Dayan Ivonne Villegas Gamboa en las líneas anteriores. Por lo cual comprendo los beneficios y riesgos. Así mismo, me considero conforme y satisfecha con la información que se me ha suministrado comprendiendo de manera global todo lo que conlleva hacer parte de este programa. Por lo que a través de la presente, doy mi consentimiento expreso para que el tratamiento llevado a cabo. Si necesita una visita adicional de lactancia, esta tiene un costo de $80.000. Este servicio se programa según disponibilidad.
        </p>
      </div>

      {/* Firmas finales, una debajo de la otra */}
      <div className="flex flex-col items-center gap-8 mb-6">
        <div className="max-w-xs w-full">
          <FirmaCanvas
            label="Firma fisioterapeuta"
            name="firmaFisioterapeutaPrenatal"
            setFormulario={setFirma}
            formulario={formulario}
          />
        </div>
        <div className="max-w-xs w-full">
          <FirmaCanvas
            label="Firma final paciente"
            name="firmaPacientePrenatalFinal"
            setFormulario={setFirma}
            formulario={formulario}
          />
        </div>
      </div>

      <div className="flex justify-between">
        <button
          type="button"
          className="px-6 py-2 rounded-md text-white font-semibold bg-gray-400 hover:bg-gray-500 transition"
          onClick={anterior}
        >
          Anterior
        </button>
        <button
          type="button"
          className="px-6 py-2 rounded-md text-white font-semibold bg-indigo-600 hover:bg-indigo-700 transition"
          onClick={onSubmit}
        >
          Siguiente
        </button>
      </div>
    </div>
  );
}