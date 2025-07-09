import React, { useEffect, useState } from "react";
import { apiRequest } from "../../config/api";

import { useParams, Link } from "react-router-dom";
import Spinner from "../ui/Spinner";
import { PencilSquareIcon, ArrowLeftIcon } from "@heroicons/react/24/solid";

const Card = ({ title, children }) => (
  <div className="bg-indigo-50 rounded-2xl shadow p-6 mb-8 border border-indigo-100">
    <h3 className="text-lg font-bold text-indigo-700 mb-3 border-b border-indigo-200 pb-1">{title}</h3>
    {children}
  </div>
);

const Field = ({ label, value }) => (
  <div className="mb-2 flex flex-col md:flex-row">
    <span className="font-semibold text-gray-700 md:w-64">{label}:</span>
    <span className="text-gray-900 flex-1">{value || <span className="text-gray-400">Sin dato</span>}</span>
  </div>
);

const renderValue = (value) => {
  if (Array.isArray(value)) {
    // Si el array es de objetos (como hijos), muestra cada uno en una tarjeta vertical y compacta en dos columnas reales
    if (value.length > 0 && typeof value[0] === "object" && value[0] !== null) {
      return (
        <div className="flex flex-col gap-4">
          {value.map((obj, idx) => (
            <div
              key={idx}
              className="bg-white border border-indigo-200 rounded-xl p-4 shadow w-full max-w-md"
              style={{ minWidth: "220px" }}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1">
                {Object.entries(obj).filter(([k]) => k !== "_id").map(([k, v]) => (
                  <div key={k} className="mb-1">
                    <span className="font-semibold">
                      {k === "nombre" ? "Nombre" :
                        k === "fechaNacimiento" ? "Fecha Nacimiento" :
                        k === "peso" ? "Peso" :
                        k === "talla" ? "Talla" :
                        k === "tipoParto" ? "Tipo Parto" :
                        k === "semana" ? "Semana" :
                        k.replace(/([A-Z])/g, " $1").replace(/^./, s => s.toUpperCase())
                      }
                      :
                    </span>{" "}
                    <span>{v || <span className="text-gray-400">Sin dato</span>}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      );
    }
    // Si es un array simple, lista normal
    return value.length === 0 ? <span className="text-gray-400">Sin dato</span> : (
      <ul className="list-disc ml-6">
        {value.map((v, i) => <li key={i}>{renderValue(v)}</li>)}
      </ul>
    );
  }
  if (typeof value === "object" && value !== null) {
    return (
      <div className="bg-gray-50 rounded p-2 mb-1 border">
        {Object.entries(value).map(([k, v]) => (
          <div key={k}>
            <span className="font-semibold">{k.replace(/([A-Z])/g, " $1").replace(/^./, s => s.toUpperCase())}:</span> {renderValue(v)}
          </div>
        ))}
      </div>
    );
  }
  return value === "" || value === undefined || value === null
    ? <span className="text-gray-400">Sin dato</span>
    : value.toString();
};

export default function DetalleValoracionPisoPelvico() {
  const { id } = useParams();
  const [valoracion, setValoracion] = useState(null);
  const [paciente, setPaciente] = useState(null);

  useEffect(() => {
    apiRequest(`/valoracion-piso-pelvico/${id}`)
      .then(res => res.json())
      .then(async data => {
        setValoracion(data);
        if (data.paciente) {
          try {
            const res = await apiRequest(`/pacientes-adultos/${data.paciente}`);
            const pacienteData = await res.json();
            setPaciente(pacienteData);
          } catch {
            setPaciente(null);
          }
        }
      });
  }, [id]);

  if (!valoracion) return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-green-100">
      <Spinner />
    </div>
  );

  // Paso 1: Datos Generales
  const datosGenerales = [
    { label: "Nombres", value: paciente?.nombres },
    { label: "Cédula", value: paciente?.cedula },
    { label: "Fecha de nacimiento", value: paciente?.fechaNacimiento },
    { label: "Edad", value: paciente?.edad },
    { label: "Género", value: paciente?.genero },
    { label: "Dirección", value: paciente?.direccion },
    { label: "Teléfono", value: paciente?.telefono },
    { label: "Celular", value: paciente?.celular },
    { label: "Ocupación", value: paciente?.ocupacion },
    { label: "Nivel educativo", value: paciente?.nivelEducativo },
    { label: "Aseguradora", value: paciente?.aseguradora },
    { label: "Médico tratante", value: paciente?.medicoTratante },
    { label: "Motivo de consulta", value: valoracion.motivoConsulta },
  ];

  // Paso 2: Estado de Salud
  const estadoSalud = [
    { label: "Temperatura", value: valoracion.temperatura },
    { label: "TA", value: valoracion.ta },
    { label: "FR", value: valoracion.fr },
    { label: "FC", value: valoracion.fc },
    { label: "Peso previo", value: valoracion.pesoPrevio },
    { label: "Peso actual", value: valoracion.pesoActual },
    { label: "Talla", value: valoracion.talla },
    { label: "IMC", value: valoracion.imc },
    { label: "Deporte actual", value: valoracion.deporteActual },
    { label: "AVD / Trabajo", value: valoracion.avd },
    { label: "Observaciones AVD/Trabajo", value: valoracion.observacionesAvd },
    { label: "Farmacológicos", value: valoracion.farmaco },
    { label: "Otros (Farmacológicos)", value: valoracion.farmacoOtros },
    { label: "Información sobre medicación", value: valoracion.infoMedicacion },
    { label: "Alergias", value: valoracion.alergias },
    { label: "Última analítica", value: valoracion.ultimaAnalitica },
    { label: "Patología cardiaca", value: valoracion.patologiaCardio },
    { label: "Patología neurológica", value: valoracion.patologiaNeuro },
    { label: "Traumáticos", value: valoracion.trauma },
    { label: "Observaciones (Traumáticos)", value: valoracion.observacionesTrauma },
  ];

  // Paso 3: Enfermedad Crónica
  const enfermedadCronica = [
    { label: "Enfermedades crónicas", value: valoracion.cronica },
    { label: "Observaciones (Enfermedad Crónica)", value: valoracion.observacionesCronica },
    { label: "Enfermedades de transmisión sexual", value: valoracion.observacionesETS },
    { label: "Psicológicos", value: valoracion.psico },
    { label: "Psicológicos - Observaciones", value: valoracion.observacionesPsico },
    { label: "Quirúrgicos", value: valoracion.qx },
    { label: "Observaciones (Quirúrgicos)", value: valoracion.observacionesQx },
    { label: "Familiares", value: valoracion.familiares },
    { label: "Tóxicos", value: valoracion.toxicos },
  ];

  // Paso 4: Dinámica Obstétrica / Ginecológica
  const obstetrica = [
    { label: "No. Embarazos", value: valoracion.numEmbarazos },
    { label: "No. Abortos", value: valoracion.numAbortos },
    { label: "No. Partos Vaginales", value: valoracion.numPartosVaginales },
    { label: "No. Cesáreas", value: valoracion.numCesareas },
    { label: "Hijos", value: valoracion.hijos },
    { label: "Actividad física durante la gestación", value: valoracion.actividadFisicaGestacion },
    { label: "Medicación durante gestación", value: valoracion.medicacionGestacion },
    { label: "Trabajo de parto - dilatación", value: valoracion.trabajoPartoDilatacion },
    { label: "Desarrollo del expulsivo", value: valoracion.trabajoPartoExpulsivo },
    { label: "Técnica de expulsivo", value: valoracion.tecnicaExpulsivo },
    { label: "Observaciones", value: valoracion.observacionesDinamica },
    { label: "Actividad física postparto", value: valoracion.actividadFisicaPostparto },
    { label: "Incontinencia urinaria tras el parto", value: valoracion.incontinenciaUrinaria ? "Sí" : "No" },
    { label: "Incontinencia fecal", value: valoracion.incontinenciaFecal ? "Sí" : "No" },
    { label: "Gases vaginales", value: valoracion.gasesVaginales ? "Sí" : "No" },
    { label: "Bulto vaginal", value: valoracion.bultoVaginal ? "Sí" : "No" },
  ];

  // Paso 5: Dinámica Menstrual
  const menstrual = [
    { label: "Edad Menarquia", value: valoracion.edadMenarquia },
    { label: "Edad Menopausia", value: valoracion.edadMenopausia },
    { label: "Días de menstruación", value: valoracion.diasMenstruacion },
    { label: "Intervalo entre periodo", value: valoracion.intervaloPeriodo },
    { label: "Características del sangrado", value: valoracion.caracSangrado },
    { label: "Algias durante el periodo", value: valoracion.algiasPeriodo },
    { label: "Observaciones", value: valoracion.observacionesMenstrual },
    { label: "Durante los días de sangrado usa", value: valoracion.productoMenstrual },
    { label: "Dolor menstrual", value: valoracion.dolorMenstrual ? "Sí" : "No" },
    { label: "Ubicación dolor menstrual", value: valoracion.ubicacionDolorMenstrual },
    { label: "Factores perpetuadores", value: valoracion.factoresPerpetuadores },
    { label: "Factores calmantes", value: valoracion.factoresCalmantes },
    { label: "Métodos anticonceptivos", value: valoracion.anticonceptivo },
    { label: "Intentos de embarazo", value: valoracion.intentosEmbarazo },
    { label: "No me quedo embarazada", value: valoracion.noMeQuedoEmbarazada ? "Sí" : "No" },
    { label: "Fecundación in Vitro", value: valoracion.fecundacionInVitro ? "Sí" : "No" },
    { label: "Tratamiento Hormonal", value: valoracion.tratamientoHormonal ? "Sí" : "No" },
    { label: "Inseminación Artificial", value: valoracion.inseminacionArtificial ? "Sí" : "No" },
  ];

  // Paso 6: Dinámica Miccional
  const miccional = [
    { label: "Protector/Toalla/Pañal", value: valoracion.protectorMiccional },
    { label: "Tipo de ropa interior", value: valoracion.ropaInterior },
    { label: "N° Micciones al día", value: valoracion.numMiccionesDia },
    { label: "Cada cuántas horas", value: valoracion.cadaCuantasHoras },
    { label: "N° Micciones en la noche", value: valoracion.numMiccionesNoche },
    { label: "Características de la micción", value: valoracion.caracMiccion },
    { label: "Vaciado completo", value: valoracion.vaciadoCompleto ? "Sí" : "No" },
    { label: "Vaciado incompleto", value: valoracion.vaciadoIncompleto ? "Sí" : "No" },
    { label: "Postura miccional sentado", value: valoracion.posturaSentado ? "Sí" : "No" },
    { label: "Postura miccional hiperpresivo", value: valoracion.posturaHiperpresivo ? "Sí" : "No" },
    { label: "Forma de micción", value: valoracion.formaMiccion },
    { label: "Empujar para comenzar", value: valoracion.empujarComenzar ? "Sí" : "No" },
    { label: "Empujar para terminar", value: valoracion.empujarTerminar ? "Sí" : "No" },
    { label: "Tipo de incontinencia", value: valoracion.incontinenciaEsfuerzoRie || valoracion.incontinenciaEsfuerzoSalta || valoracion.incontinenciaEsfuerzoCorre || valoracion.incontinenciaUrgencia || valoracion.incontinenciaMixta },
    { label: "Dolor al orinar", value: valoracion.dolorOrinar },
  ];

  // Paso 7: ICIQ-SF
  const iciq = [
    { label: "Frecuencia de pérdida de orina", value: valoracion.icicq_frecuencia },
    { label: "Cantidad de orina que se escapa", value: valoracion.icicq_cantidad },
    { label: "Impacto en la vida diaria", value: valoracion.icicq_impacto },
    { label: "¿Cuándo pierde orina?", value: valoracion.icicq_cuando },
  ];

  // Paso 8: Dinámica Defecatoria y Sexual
  const defecatoria = [
    { label: "No. defecaciones al día", value: valoracion.numDefecacionesDia },
    { label: "No. Defecaciones en la noche", value: valoracion.numDefecacionesNoche },
    { label: "No. Defecaciones a la semana", value: valoracion.numDefecacionesSemana },
    { label: "Postura defecatoria", value: valoracion.posturaDefecatoria },
    { label: "Forma de defecación", value: valoracion.formaDefecacion },
    { label: "Dolor (Tipo – localización)", value: valoracion.dolorDefecacion },
    { label: "Escala de Bristol", value: valoracion.escalaBristol },
    { label: "Gases", value: valoracion.gases },
    { label: "Lubricación", value: valoracion.lubricacion },
    { label: "Orgasmos", value: valoracion.orgasmo },
    { label: "Disfunción Orgásmica", value: valoracion.disfuncionOrgasmica },
    { label: "IU Durante la penetración", value: valoracion.iuPenetracion },
    { label: "Tipo de Relación y Dinámica Sexual", value: valoracion.dinamicaSexual },
    { label: "Masturbación", value: valoracion.masturbacion },
    { label: "Historia Sexual", value: valoracion.historiaSexual },
    { label: "Factores emocionales y dolor", value: valoracion.factorEmocional },
    { label: "Dolor sexual", value: valoracion.dolorSexual },
    { label: "Relaciones Sexuales", value: valoracion.relacionesSexuales },
    { label: "Dolor en el introito", value: valoracion.dolorIntroito },
    { label: "Dolor al Fondo", value: valoracion.dolorFondo },
    { label: "Dolor irradiado a", value: valoracion.dolorIrradiado },
    { label: "Dolor perineal", value: valoracion.dolorPerineal },
  ];

  // Paso 9: Evaluación Fisioterapéutica
  const fisioterapeutica = [
    { label: "Marcha", value: valoracion.marcha },
    { label: "Postura (L3- Ombligo)", value: valoracion.postura },
    { label: "Diafragma Orofaringeo", value: valoracion.diafragmaOrofaringeo },
    { label: "Diafragma Torácico", value: valoracion.diafragmaToracico },
    { label: "Testing Centro Frénico", value: valoracion.testingCentroFrenico },
    { label: "Testing de Pilares", value: valoracion.testingPilares },
    { label: "Testing de Traslación Arco Costal", value: valoracion.testingArcoCostal },
    { label: "Diafragma Pélvico", value: valoracion.diafragmaPelvico },
    { label: "Tipo de Pelvis", value: valoracion.tipoPelvis },
    { label: "Abdomen (Test de Tos)", value: valoracion.abdomenTestTos },
    { label: "Diastasis", value: valoracion.diastasis },
    { label: "Supraumbilical", value: valoracion.supraumbilical },
    { label: "Umbilical", value: valoracion.umbilical },
    { label: "Infraumbilical", value: valoracion.infraumbilical },
    { label: "Movilidad", value: valoracion.movilidad },
    { label: "Test Dinámicos", value: valoracion.testDinamicos },
    { label: "Vulva", value: valoracion.vulva },
    { label: "Mucosa", value: valoracion.mucosa },
    { label: "Labios", value: valoracion.labios },
    { label: "Lubricación Perineal", value: valoracion.lubricacionPerineal },
    { label: "Flujo Olor – Color", value: valoracion.flujoOlorColor },
    { label: "Ph (Epitelio Vaginal)", value: valoracion.phVaginal },
    { label: "Vagina", value: valoracion.vagina },
    { label: "Diámetro apertura de la vagina/introito", value: valoracion.diametroIntroito },
    { label: "Clítoris", value: valoracion.clitoris },
    { label: "Destapar Capuchón (Dolor)", value: valoracion.capuchonDolor },
    { label: "Muevo Vulva Hacia Arriba Clítoris se eleva", value: valoracion.vulvaClitoris },
    { label: "Sensibilidad (Cada Lado)", value: valoracion.sensibilidadLados },
    { label: "Hemorroides – Varices Vulvares", value: valoracion.hemorroidesVarices },
    { label: "Cicatrices", value: valoracion.cicatrices },
    { label: "Cirugías Estéticas", value: valoracion.cirugiasEsteticas },
    { label: "Glándulas De Skene Eyaculación", value: valoracion.glandulasSkene },
    { label: "Glándulas De Bartolini Lubricación", value: valoracion.glandulasBartolini },
    { label: "Elasticidad de La Orquilla Vulvar", value: valoracion.elasticidadOrquilla },
    { label: "Uretra – Vagina – Ano", value: valoracion.uretraVaginaAno },
    { label: "Distancia Ano-Vulvar", value: valoracion.distanciaAnoVulvar },
    { label: "Diámetro Bituberoso", value: valoracion.diametroBituberoso },
    { label: "Núcleo Central Del Periné", value: valoracion.nucleoCentralPerine },
    { label: "Contracción y Observar", value: valoracion.contraccionObservar },
    { label: "Reflejo de Tos (Ano Cierra)", value: valoracion.reflejoTosAno ? "Sí" : "No" },
    { label: "Prurito", value: valoracion.prurito ? "Sí" : "No" },
    { label: "Escozor", value: valoracion.escozor ? "Sí" : "No" },
    { label: "Valoración neurológica", value: valoracion.valoracionNeuro },
  ];

  // Paso 10: Palpación Interna
  const palpacionInterna = [
    { label: "Cúpulas", value: valoracion.cupulaDerecha || valoracion.cupulaIzquierda },
    { label: "Tono General", value: valoracion.tonoGeneral },
    { label: "Observaciones sobre el tono", value: valoracion.tonoObservaciones },
    { label: "Capacidad Contráctil General", value: valoracion.capacidadContractil },
    { label: "Fuerza Oxford Global", value: valoracion.oxfordGlobal },
    { label: "Fuerza Oxford Derecha", value: valoracion.oxfordDerecha },
    { label: "Fuerza Oxford Izquierda", value: valoracion.oxfordIzquierda },
    { label: "PERFECT Power", value: valoracion.perfectPower },
    { label: "PERFECT Endurance", value: valoracion.perfectEndurance },
    { label: "PERFECT Repetitions", value: valoracion.perfectRepetitions },
    { label: "PERFECT Fast", value: valoracion.perfectFast },
    { label: "PERFECT ECT", value: valoracion.perfectECT },
  ];

  // Paso 11: Evaluación TRP
  const trp = [
    { label: "Ligamentos/Músculos Exopélvicos", value: valoracion.ligamentosMusculos },
    { label: "Prolapsos Organopélvicos", value: valoracion.prolapsos },
    { label: "Ligamentos/Músculos Endopélvicos", value: valoracion.ligEndopelvicos },
    { label: "Dolor", value: valoracion.dolorTRP },
    { label: "Diagnóstico fisioterapéutico", value: valoracion.diagnosticoFisio },
    { label: "Plan de intervención", value: valoracion.planIntervencion },
  ];

  // Paso 12: Consentimiento
  const consentimiento = [
    { label: "Fecha consentimiento", value: valoracion.consentimientoFecha },
    { label: "Ciudad", value: valoracion.consentimientoCiudad },
    { label: "Nombre completo", value: valoracion.consentimientoNombre },
    { label: "CC No.", value: valoracion.consentimientoCC },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-purple-100 to-green-100 py-10 px-2">
      <div className="max-w-5xl w-full mx-auto bg-white p-8 rounded-3xl shadow-2xl border border-indigo-100">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4">
          <h2 className="text-3xl font-extrabold text-indigo-800 text-center drop-shadow">
            Detalle Valoración Piso Pélvico
          </h2>
          <div className="mt-2 md:mt-0 text-sm text-gray-600 text-center md:text-right">
            <div>
              <span className="font-semibold">Fecha valoración:</span>{" "}
              {valoracion.fecha || <span className="text-gray-400">Sin dato</span>}
            </div>
            <div>
              <span className="font-semibold">Hora valoración:</span>{" "}
              {valoracion.hora || <span className="text-gray-400">Sin dato</span>}
            </div>
          </div>
        </div>

        <Card title="Datos Generales">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-1">
            {datosGenerales.map(({ label, value }) => (
              <Field key={label} label={label} value={renderValue(value)} />
            ))}
          </div>
        </Card>

        <Card title="Estado de Salud">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-1">
            {estadoSalud.map(({ label, value }) => (
              <Field key={label} label={label} value={renderValue(value)} />
            ))}
          </div>
        </Card>

        <Card title="Enfermedad Crónica y Antecedentes">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-1">
            {enfermedadCronica.map(({ label, value }) => (
              <Field key={label} label={label} value={renderValue(value)} />
            ))}
          </div>
        </Card>

        <Card title="Dinámica Obstétrica / Ginecológica">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-1">
            {obstetrica
              .filter(({ label }) => label !== "Hijos")
              .map(({ label, value }) => (
                <Field key={label} label={label} value={renderValue(value)} />
              ))}
          </div>
          {valoracion.hijos && valoracion.hijos.length > 0 && (
            <div className="mt-6">
              <h4 className="font-bold text-indigo-700 mb-2">Hijos</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {valoracion.hijos.map((obj, idx) => (
                  <div
                    key={idx}
                    className="bg-white border border-indigo-200 rounded-xl p-4 shadow w-full"
                  >
                    <div className="grid grid-cols-1 gap-y-1">
                      {Object.entries(obj).filter(([k]) => k !== "_id").map(([k, v]) => (
                        <div key={k} className="mb-1">
                          <span className="font-semibold">
                            {k === "nombre" ? "Nombre" :
                              k === "fechaNacimiento" ? "Fecha Nacimiento" :
                              k === "peso" ? "Peso" :
                              k === "talla" ? "Talla" :
                              k === "tipoParto" ? "Tipo Parto" :
                              k === "semana" ? "Semana" :
                              k.replace(/([A-Z])/g, " $1").replace(/^./, s => s.toUpperCase())
                            }
                            :
                          </span>{" "}
                          <span>{v || <span className="text-gray-400">Sin dato</span>}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Card>

        <Card title="Dinámica Menstrual">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-1">
            {menstrual.map(({ label, value }) => (
              <Field key={label} label={label} value={renderValue(value)} />
            ))}
          </div>
        </Card>

        <Card title="Dinámica Miccional">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-1">
            {miccional.map(({ label, value }) => (
              <Field key={label} label={label} value={renderValue(value)} />
            ))}
          </div>
        </Card>

        <Card title="ICIQ-SF - Incontinencia Urinaria">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-1">
            {iciq.map(({ label, value }) => (
              <Field key={label} label={label} value={renderValue(value)} />
            ))}
          </div>
        </Card>

        <Card title="Dinámica Defecatoria y Sexual">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-1">
            {defecatoria.map(({ label, value }) => (
              <Field key={label} label={label} value={renderValue(value)} />
            ))}
          </div>
        </Card>

        <Card title="Evaluación Fisioterapéutica">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-1">
            {fisioterapeutica.map(({ label, value }) => (
              <Field key={label} label={label} value={renderValue(value)} />
            ))}
          </div>
        </Card>

        <Card title="Palpación Interna">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-1">
            {palpacionInterna.map(({ label, value }) => (
              <Field key={label} label={label} value={renderValue(value)} />
            ))}
          </div>
        </Card>

        <Card title="Evaluación TRP">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-1">
            {trp.map(({ label, value }) => (
              <Field key={label} label={label} value={renderValue(value)} />
            ))}
          </div>
        </Card>

       
        {/* Firmas */}
        <Card title="Firmas">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
            <div>
              <strong>Firma paciente:</strong>
              {valoracion.firmaPaciente && (
                <img src={valoracion.firmaPaciente} alt="Firma paciente" className="h-12 mt-1 border" />
              )}
            </div>
            <div>
              <strong>Firma fisioterapeuta:</strong>
              {valoracion.firmaFisioterapeuta && (
                <img src={valoracion.firmaFisioterapeuta} alt="Firma fisioterapeuta" className="h-12 mt-1 border" />
              )}
            </div>
          </div>
        </Card>

        {/* Autorización imágenes */}
        <Card title="Autorización de uso de imágenes">
          <div className="mb-2 text-gray-700">
            Autorizo a D&#39;Mamitas &amp; Babies para reproducir fotografías e imágenes de las actividades en las que participe, para ser utilizadas en sus publicaciones, proyectos, redes sociales y página web.
          </div>
          <div>
            <strong>Firma autorización imágenes:</strong>
            {valoracion.firmaAutorizacion && (
              <img src={valoracion.firmaAutorizacion} alt="Firma autorización" className="h-12 mt-1 border" />
            )}
          </div>
        </Card>
         {/* Consentimiento Informado */}
        <Card title="Consentimiento Informado">
          <div className="mb-4 bg-gray-50 p-4 rounded text-justify text-sm border max-h-96 overflow-y-auto">
            <p>
              Reconozco y entiendo que me han remitido o que he venido por voluntad propia a fisioterapia pélvica para que se me realice una evaluación y tratamiento de la(s) disfunción(es) de mi piso pélvico.<br /><br />
              La/el fisioterapeuta pélvica(o) me ha enseñado la anatomía básica del piso pélvico, sus funciones y la relación con mi disfunción(es) actual(es).<br /><br />
              Entiendo que para evaluar y tratar mi condición será necesario, inicial y periódicamente, que mi fisioterapeuta realice un examen de inspección y palpación detallada del área abdominal, lumbar, pélvica y genital externa, así como la palpación interna específica a través de la vagina y/o ano según se requiera y sea posible, para lo cual será necesario que me desvista dejando expuestas estas regiones de mi cuerpo.<br /><br />
              Este examen incluirá, entre otras cosas, la evaluación del estado de la piel, el tejido eréctil, los reflejos, la presencia de tensión muscular, la estructura y el tono muscular, la fuerza y la resistencia, la movilidad de las cicatrices y la función del piso pélvico en general.<br /><br />
              Comprendo que durante la evaluación también se me solicitarán actividades como la tos, el pujo y la valsalva máxima, además de diferentes movimientos con los músculos del piso pélvico.<br /><br />
              Tengo conciencia de que la evaluación y tratamiento de fisioterapia pélvica, puede requerir la aplicación de procedimientos o técnicas que pueden ser tanto externas a nivel del abdomen, región lumbar, pelvis y zona genital, vulvar y/o anal, como internas en el canal vaginal y/o rectal con el fin de alcanzar los objetivos terapéuticos para mejorar o erradicar los síntomas de mi(s) disfunción(es).<br /><br />
              Estas técnicas pueden incluir pero no están limitadas a: técnicas manuales (digitopresión, masaje, tracción, movilización, entre otras) o técnicas con equipos (electroterapia con electrodo intracavitario o adhesivo, biofeedback con electrodo intracavitario o adhesivo, masajeadores con y sin vibración, masajeadores térmicos, paquetes fríos o calientes, bolitas pélvicas, pesas vaginales, balones vaginales/ rectales, dilatadores vaginales/anales, bombas de vacío, fotobiomodulación, radiofrecuencia, ecografía, etc).<br /><br />
              También soy consciente de que mi tratamiento puede involucrar ejercicios de movilidad pélvica con o sin balón, ejercicio de resistencia cardiovascular, de resistencia y fuerza muscular general y de flexibilidad, como también entrenamiento específico del piso pélvico.<br /><br />
              Entiendo que deberé realizar en casa, una pauta de ejercicios tal y como la fisioterapeuta pélvica me lo indique, pudiendo ser ésta de ejercicios específicos de contracción/relajación de la musculatura pélvica con o sin la aplicación de herramientas terapéuticas, ejercicios funcionales, automasaje manual o instrumentalizado o de flexibilidad muscular.<br /><br />
              <b>Posibles riesgos:</b> reconozco que una evaluación completa del piso pélvico y/o un tratamiento de fisioterapia pélvica pueden aumentar mi nivel actual de dolor o malestar, o agravar mi disfunción o síntomas existentes y que este malestar suele ser temporal. Si no desaparece en 1-3 días, acepto ponerme en contacto con mi fisioterapeuta.<br /><br />
              Dentro de los malestares físicos temporales, pueden presentarse los siguientes: Dolor, ardor, sensación de calambre, sangrado de la mucosa, ganas de orinar o defecar, escape de gases anales o vaginales, mareo, taquicardia, bradicardia o hipotensión momentánea.<br /><br />
              Dentro de las incomodidades psicológicas o emocionales pueden presentarse: Vergüenza, nerviosismo, ansiedad o temor principalmente en la sesión de evaluación por ser la primera vez en fisioterapia pélvica.<br /><br />
              <b>Posibles beneficios:</b> una evaluación completa del piso pélvico y/o un tratamiento de fisioterapia pélvica pueden aliviar mis síntomas, mejorando mi calidad de vida y aumentando mi capacidad para realizar mis actividades diarias. Es posible que experimente un aumento de la fuerza, la conciencia, la flexibilidad y la resistencia de los músculos de mi piso pélvico e igualmente, puede que note una disminución del dolor o los malestares asociados a la disfunción que tengo. También podré adquirir un mayor conocimiento sobre mi disfunción y seré más consciente de los recursos disponibles para manejar mis síntomas y mejorar mi condición.<br /><br />
              <b>No garantía:</b> comprendo que la/el fisioterapeuta no puede hacer promesas ni garantías con respecto a la cura o la completa mejora de mi disfunción. Entiendo que mi fisioterapeuta compartirá su opinión profesional conmigo sobre los posibles resultados de la fisioterapia y analizará todas las opciones de tratamiento antes de que yo dé mi consentimiento para el tratamiento, basado en los resultados subjetivos y objetivos de la evaluación.<br /><br />
              Entiendo que tengo el derecho a revocar mi consentimiento en cualquier momento y que mi consentimiento verbal será obtenido continuamente a lo largo de las sesiones. Yo estaré siempre en control de mi propio cuerpo y de las actividades que me sean solicitadas realizar en la consulta con la/el fisioterapeuta.<br /><br />
              Al firmar este documento, acepto que he leído y entendido el CONSENTIMIENTO INFORMADO PARA EVALUACIÓN Y TRATAMIENTO DE FISIOTERAPIA PÉLVICA y que doy mi consentimiento para la evaluación y tratamiento de mi piso pélvico.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {consentimiento.map(({ label, value }) => (
              <div key={label}>
                <span className="font-semibold">{label}:</span>{" "}
                <span>{value || <span className="text-gray-400">Sin dato</span>}</span>
              </div>
            ))}
          </div>
          <div className="flex flex-col items-center mt-4">
            <label className="font-semibold mb-2">Firma consentimiento:</label>
            {valoracion.consentimientoFirma ? (
              <img src={valoracion.consentimientoFirma} alt="Firma consentimiento" className="h-12 mt-1 border" />
            ) : (
              <div className="w-48 h-12 border border-dashed border-gray-400 rounded flex items-center justify-center text-gray-400">
                Sin firma
              </div>
            )}
          </div>
        </Card>


        {/* Botones de acción */}
        <div className="mt-8 text-center flex flex-col sm:flex-row justify-center gap-4">
          <Link
            to={`/valoraciones-piso-pelvico/${valoracion._id}/editar`}
            className="bg-yellow-400 hover:bg-yellow-500 text-white font-bold px-6 py-3 rounded-xl shadow transition flex items-center gap-2 text-lg justify-center"
          >
            <PencilSquareIcon className="h-6 w-6" />
            Editar
          </Link>
          <Link
            to="/valoraciones-piso-pelvico"
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold px-6 py-3 rounded-xl shadow transition flex items-center gap-2 text-lg justify-center"
          >
            <ArrowLeftIcon className="h-6 w-6" />
            Volver a la lista
          </Link>
        </div>
      </div>
    </div>
  );
}