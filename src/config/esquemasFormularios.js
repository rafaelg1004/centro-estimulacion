// Esta lista se repite en varios formularios, mejor tenerla centralizada
export const EPS_LIST = [
    "Nueva EPS", "Sanitas EPS", "Sura EPS", "Famisanar EPS", "Aliansalud EPS: MinTrabajo",
    "Comfenalco Valle", "Salud Total EPS", "Capital Salud: MinTrabajo", "Compesar EPS: MinTrabajo",
    "EPS y Medicina Prepagada Suramericana S.A.: MinTrabajo", "EPS Servicio Occidental de Salud S.A.: MinTrabajo",
    "Comfenalco Antioquia", "Asfamilias", "Cafam", "Mutual Ser Eps", "Coosalud EPS: consultorsalud",
    "Saludcoop: Ministerio de Salud y Protección Social", "Coomeva EPS", "Salud Colpatria",
    "EPS Servicio Occidental de Salud (SOS)", "EPS Familiar de Colombia", "EPM Salud",
    "Particular"
];

export const ESQUEMA_PACIENTE_NINO = {
    titulo: "Registrar Paciente Niño",
    endpoint: "/pacientes",
    redireccion: "/pacientes",
    secciones: [
        {
            titulo: "Datos del niño",
            campos: [
                { nombre: "esAdulto", etiqueta: "Adulto", tipo: "checkbox", lecsolo: true, valorPorDefecto: false, oculto: true },
                { nombre: "nombres", etiqueta: "Nombres", tipo: "text", requerido: true },
                { nombre: "apellidos", etiqueta: "Apellidos", tipo: "text", requerido: true },
                {
                    nombre: "tipoDocumentoIdentificacion", etiqueta: "Tipo de Documento", tipo: "select", opciones: [
                        { valor: "RC", etiqueta: "Registro Civil (RC)" },
                        { valor: "TI", etiqueta: "Tarjeta de Identidad (TI)" },
                        { valor: "MS", etiqueta: "Menor sin Identificación (MS)" },
                        { valor: "CC", etiqueta: "Cédula de Ciudadanía (CC)" }
                    ], requerido: true
                },
                { nombre: "numDocumentoIdentificacion", etiqueta: "Número de Documento", tipo: "text", requerido: true },
                {
                    nombre: "codSexo", etiqueta: "Sexo (RIPS)", tipo: "select", opciones: [
                        { valor: "M", etiqueta: "Masculino" },
                        { valor: "F", etiqueta: "Femenino" }
                    ], requerido: true
                },
                { nombre: "lugarNacimiento", etiqueta: "Lugar de Nacimiento", tipo: "text", requerido: true },
                { nombre: "fechaNacimiento", etiqueta: "Fecha de Nacimiento", tipo: "date", requerido: true },
                { nombre: "peso", etiqueta: "Peso (kg)", tipo: "number", paso: "0.01", min: "0", requerido: true },
                { nombre: "talla", etiqueta: "Talla (cm)", tipo: "number", paso: "0.1", min: "0", requerido: true },
            ]
        },
        {
            titulo: "Datos de contacto",
            campos: [
                { nombre: "direccion", etiqueta: "Dirección", tipo: "text", requerido: true },
                { nombre: "telefono", etiqueta: "Teléfono", tipo: "text", requerido: true },
                { nombre: "celular", etiqueta: "Celular", tipo: "text", requerido: true },
            ]
        },
        {
            titulo: "Pediatra y aseguradora",
            campos: [
                { nombre: "pediatra", etiqueta: "Pediatra", tipo: "text", requerido: true },
                { nombre: "aseguradora", etiqueta: "Aseguradora", tipo: "datalist", opciones: EPS_LIST, requerido: true },
            ]
        },
        {
            titulo: "Datos de la madre",
            campos: [
                { nombre: "nombreMadre", etiqueta: "Nombre de la Madre", tipo: "text", requerido: true },
                { nombre: "edadMadre", etiqueta: "Edad de la Madre", tipo: "text", requerido: true },
                { nombre: "ocupacionMadre", etiqueta: "Ocupación de la Madre", tipo: "text", requerido: true },
            ]
        },
        {
            titulo: "Datos del padre",
            campos: [
                { nombre: "nombrePadre", etiqueta: "Nombre del Padre", tipo: "text", requerido: true },
                { nombre: "edadPadre", etiqueta: "Edad del Padre", tipo: "text", requerido: true },
                { nombre: "ocupacionPadre", etiqueta: "Ocupación del Padre", tipo: "text", requerido: true },
            ]
        }
    ]
};

export const ESQUEMA_PACIENTE_ADULTO = {
    titulo: "Registrar Paciente Adulto (Mamá)",
    endpoint: "/pacientes",
    redireccion: "/pacientes",
    secciones: [
        {
            titulo: "Datos Personales",
            campos: [
                { nombre: "esAdulto", etiqueta: "Adulto", tipo: "checkbox", lecsolo: true, valorPorDefecto: true, oculto: true },
                { nombre: "nombres", etiqueta: "Nombres", tipo: "text", requerido: true },
                { nombre: "apellidos", etiqueta: "Apellidos", tipo: "text", requerido: true },
                {
                    nombre: "tipoDocumentoIdentificacion", etiqueta: "Tipo de Documento", tipo: "select", opciones: [
                        { valor: "CC", etiqueta: "Cédula de Ciudadanía (CC)" },
                        { valor: "CE", etiqueta: "Cédula de Extranjería (CE)" },
                        { valor: "PA", etiqueta: "Pasaporte (PA)" },
                        { valor: "PT", etiqueta: "Permiso por Protección Temporal (PT)" }
                    ], requerido: true
                },
                { nombre: "numDocumentoIdentificacion", etiqueta: "Número de Documento", tipo: "text", requerido: true },
                {
                    nombre: "codSexo", etiqueta: "Sexo (RIPS)", tipo: "select", opciones: [
                        { valor: "M", etiqueta: "Masculino" },
                        { valor: "F", etiqueta: "Femenino" }
                    ], requerido: true
                },
                { nombre: "lugarNacimiento", etiqueta: "Lugar de Nacimiento", tipo: "text", requerido: true },
                { nombre: "fechaNacimiento", etiqueta: "Fecha de Nacimiento", tipo: "date", requerido: true },
                { nombre: "estadoCivil", etiqueta: "Estado Civil", tipo: "text", requerido: true },
                { nombre: "ocupacion", etiqueta: "Ocupación", tipo: "text", requerido: true },
                { nombre: "nivelEducativo", etiqueta: "Nivel Educativo", tipo: "text", requerido: true },
            ]
        },
        {
            titulo: "Contacto y Salud",
            campos: [
                { nombre: "direccion", etiqueta: "Dirección de Domicilio", tipo: "text", requerido: true },
                { nombre: "telefono", etiqueta: "Teléfono", tipo: "text", requerido: true },
                { nombre: "celular", etiqueta: "Celular", tipo: "text", requerido: true },
                { nombre: "medicoTratante", etiqueta: "Médico Tratante", tipo: "text", requerido: true },
                { nombre: "aseguradora", etiqueta: "Aseguradora", tipo: "datalist", opciones: EPS_LIST, requerido: true },
                { nombre: "acompanante", etiqueta: "Nombre Acompañante", tipo: "text", requerido: true },
                { nombre: "telefonoAcompanante", etiqueta: "Teléfono Acompañante", tipo: "text", requerido: true },
            ]
        },
        {
            titulo: "Datos de Embarazo",
            campos: [
                { nombre: "nombreBebe", etiqueta: "Nombre del bebé (si aplica)", tipo: "text" },
                {
                    nombre: "estadoEmbarazo",
                    etiqueta: "Estado del embarazo",
                    tipo: "select",
                    opciones: [
                        { valor: "gestacion", etiqueta: "En gestación" },
                        { valor: "posparto", etiqueta: "Posparto" }
                    ],
                    requerido: true
                },
                {
                    nombre: "fum",
                    etiqueta: "FUM (Fecha de Última Menstruación)",
                    tipo: "date",
                    dependeDe: { campo: "estadoEmbarazo", valor: "gestacion" }
                },
                {
                    nombre: "semanasGestacion",
                    etiqueta: "Semanas de gestación",
                    tipo: "text",
                    dependeDe: { campo: "estadoEmbarazo", valor: "gestacion" }
                }
            ]
        }
    ]
};
