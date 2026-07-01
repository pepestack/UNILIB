export type BookCategory =
  | "Derecho"
  | "Medicina"
  | "Matemáticas"
  | "Historia"
  | "Administración"
  | "Psicología"
  | "Informática"
  | "Arquitectura"
  | "Sociología"
  | "Literatura"
  | "Ingeniería";

export interface Book {
  id: string;
  isbn: string;
  titulo: string;
  autor: string;
  editorial: string;
  anio: number;
  categoria: BookCategory;
  totalEjemplares: number;
  disponibles: number;
  ubicacion: string;
  descripcion: string;
}

export interface User {
  id: string;
  nombre: string;
  apellidos: string;
  matricula: string;
  carrera: string;
  tipo: "estudiante" | "docente" | "administrativo";
  email: string;
  telefono: string;
  prestamosActivos: number;
  limitePrestamos: number;
  fechaRegistro: string;
  estado: "activo" | "suspendido" | "inactivo";
}

export interface Loan {
  id: string;
  libroId: string;
  usuarioId: string;
  fechaPrestamo: string;
  fechaDevolucion: string;
  fechaDevolucionReal?: string;
  estado: "pendiente" | "activo" | "vencido" | "devuelto" | "rechazado";
  renovaciones: number;
  tipo?: "regular" | "externo";
  cantidad?: number;
  justificacion?: string;
}

export interface PurchaseRequest {
  id: string;
  usuarioId: string;
  titulo: string;
  autor: string;
  isbn?: string;
  editorial?: string;
  anio?: number;
  tipo: "libro_fisico" | "libro_electronico" | "licencia_digital";
  cantidad: number;
  justificacion: string;
  asignatura?: string;
  fechaSolicitud: string;
  estado: "pendiente" | "en_evaluacion" | "aprobada" | "rechazada";
  observaciones?: string;
}

export interface Reservation {
  id: string;
  libroId: string;
  usuarioId: string;
  fechaReserva: string;
  fechaVencimiento: string;
  estado: "pendiente" | "confirmada" | "cancelada" | "completada";
}

export interface InventoryItem {
  id: string;
  libroId: string;
  codigoEjemplar: string;
  condicion: "excelente" | "bueno" | "regular" | "deteriorado";
  disponible: boolean;
  fechaAdquisicion: string;
  ubicacion: string;
}

// ─── Mock Books ──────────────────────────────────────────────────────────────

export const BOOKS: Book[] = [
  {
    id: "B001",
    isbn: "978-970-07-9001-2",
    titulo: "Introducción al Derecho",
    autor: "Eduardo García Máynez",
    editorial: "Porrúa",
    anio: 2019,
    categoria: "Derecho",
    totalEjemplares: 6,
    disponibles: 3,
    ubicacion: "A-12-3",
    descripcion:
      "Obra clásica que introduce los conceptos fundamentales del ordenamiento jurídico.",
  },
  {
    id: "B002",
    isbn: "978-607-15-1862-4",
    titulo: "Anatomía Humana",
    autor: "Keith L. Moore",
    editorial: "Wolters Kluwer",
    anio: 2018,
    categoria: "Medicina",
    totalEjemplares: 4,
    disponibles: 1,
    ubicacion: "C-03-1",
    descripcion:
      "Texto de referencia en anatomía con enfoque clínico y atlas fotográfico completo.",
  },
  {
    id: "B003",
    isbn: "978-607-522-244-1",
    titulo: "Cálculo de Una Variable",
    autor: "James Stewart",
    editorial: "Cengage Learning",
    anio: 2020,
    categoria: "Matemáticas",
    totalEjemplares: 8,
    disponibles: 5,
    ubicacion: "D-07-2",
    descripcion:
      "Texto de cálculo diferencial e integral con enfoque en comprensión conceptual.",
  },
  {
    id: "B004",
    isbn: "978-607-01-0234-6",
    titulo: "Historia de México Contemporáneo",
    autor: "Lorenzo Meyer",
    editorial: "Grijalbo",
    anio: 2017,
    categoria: "Historia",
    totalEjemplares: 5,
    disponibles: 4,
    ubicacion: "B-05-2",
    descripcion:
      "Análisis de los principales procesos históricos de México en el siglo XX.",
  },
  {
    id: "B005",
    isbn: "978-970-10-7275-9",
    titulo: "Administración: Proceso Administrativo",
    autor: "Idalberto Chiavenato",
    editorial: "McGraw-Hill",
    anio: 2021,
    categoria: "Administración",
    totalEjemplares: 6,
    disponibles: 2,
    ubicacion: "E-02-4",
    descripcion:
      "Fundamentos del proceso administrativo con casos prácticos latinoamericanos.",
  },
  {
    id: "B006",
    isbn: "978-607-442-668-1",
    titulo: "Psicología",
    autor: "Charles G. Morris",
    editorial: "Pearson",
    anio: 2019,
    categoria: "Psicología",
    totalEjemplares: 5,
    disponibles: 3,
    ubicacion: "F-09-1",
    descripcion:
      "Introducción completa a la psicología científica y sus principales corrientes.",
  },
  {
    id: "B007",
    isbn: "978-84-481-8128-3",
    titulo: "Fundamentos de Programación",
    autor: "Luis Joyanes Aguilar",
    editorial: "McGraw-Hill",
    anio: 2020,
    categoria: "Informática",
    totalEjemplares: 7,
    disponibles: 4,
    ubicacion: "G-01-3",
    descripcion:
      "Conceptos fundamentales de programación con ejemplos en múltiples lenguajes.",
  },
  {
    id: "B008",
    isbn: "978-84-252-2474-7",
    titulo: "Arquitectura: Forma, Espacio y Orden",
    autor: "Francis D.K. Ching",
    editorial: "Gustavo Gili",
    anio: 2018,
    categoria: "Arquitectura",
    totalEjemplares: 3,
    disponibles: 0,
    ubicacion: "H-04-2",
    descripcion:
      "Referencia visual clásica de los principios fundamentales del diseño arquitectónico.",
  },
  {
    id: "B009",
    isbn: "978-84-206-8965-1",
    titulo: "Sociología",
    autor: "Anthony Giddens",
    editorial: "Alianza Editorial",
    anio: 2021,
    categoria: "Sociología",
    totalEjemplares: 5,
    disponibles: 3,
    ubicacion: "B-11-1",
    descripcion:
      "Visión panorámica de la sociología moderna y sus corrientes teóricas principales.",
  },
  {
    id: "B010",
    isbn: "978-84-376-0494-7",
    titulo: "Cien Años de Soledad",
    autor: "Gabriel García Márquez",
    editorial: "Real Academia Española",
    anio: 2019,
    categoria: "Literatura",
    totalEjemplares: 4,
    disponibles: 4,
    ubicacion: "B-02-3",
    descripcion:
      "Obra cumbre del realismo mágico latinoamericano. Edición conmemorativa.",
  },
  {
    id: "B011",
    isbn: "978-970-07-6803-5",
    titulo: "Derecho Civil: Bienes, Derechos Reales y Sucesiones",
    autor: "Rafael Rojina Villegas",
    editorial: "Porrúa",
    anio: 2018,
    categoria: "Derecho",
    totalEjemplares: 5,
    disponibles: 2,
    ubicacion: "A-14-1",
    descripcion:
      "Tratado clásico de derecho civil mexicano ampliamente utilizado en la academia.",
  },
  {
    id: "B012",
    isbn: "978-84-291-7600-0",
    titulo: "Bioquímica",
    autor: "Jeremy M. Berg",
    editorial: "Reverté",
    anio: 2020,
    categoria: "Medicina",
    totalEjemplares: 3,
    disponibles: 0,
    ubicacion: "C-07-2",
    descripcion:
      "Texto de referencia en bioquímica estructural y metabólica para ciencias de la salud.",
  },
  {
    id: "B013",
    isbn: "978-607-442-098-6",
    titulo: "Álgebra Lineal y Sus Aplicaciones",
    autor: "David C. Lay",
    editorial: "Pearson",
    anio: 2019,
    categoria: "Matemáticas",
    totalEjemplares: 6,
    disponibles: 3,
    ubicacion: "D-10-4",
    descripcion:
      "Tratamiento moderno del álgebra lineal con enfoque en aplicaciones computacionales.",
  },
  {
    id: "B014",
    isbn: "978-607-32-2893-0",
    titulo: "Administración Estratégica",
    autor: "Fred R. David",
    editorial: "Pearson",
    anio: 2021,
    categoria: "Administración",
    totalEjemplares: 4,
    disponibles: 2,
    ubicacion: "E-06-1",
    descripcion:
      "Marco conceptual y técnicas para la formulación e implementación de estrategias.",
  },
  {
    id: "B015",
    isbn: "978-607-32-4708-5",
    titulo: "Redes de Computadoras e Internet",
    autor: "James F. Kurose",
    editorial: "Pearson",
    anio: 2021,
    categoria: "Informática",
    totalEjemplares: 5,
    disponibles: 3,
    ubicacion: "G-05-2",
    descripcion:
      "Fundamentos de redes de computadoras con enfoque top-down y casos reales.",
  },
];

// ─── Mock Users ───────────────────────────────────────────────────────────────

export const USERS: User[] = [
  {
    id: "U001",
    nombre: "María",
    apellidos: "González Reyes",
    matricula: "20210345",
    carrera: "Licenciatura en Derecho",
    tipo: "estudiante",
    email: "mgonzalez@unilib.edu.mx",
    telefono: "55-1234-5678",
    prestamosActivos: 2,
    limitePrestamos: 3,
    fechaRegistro: "2021-09-01",
    estado: "activo",
  },
  {
    id: "U002",
    nombre: "Carlos",
    apellidos: "Morales Ávila",
    matricula: "20190872",
    carrera: "Medicina",
    tipo: "estudiante",
    email: "cmorales@unilib.edu.mx",
    telefono: "55-2345-6789",
    prestamosActivos: 1,
    limitePrestamos: 3,
    fechaRegistro: "2019-08-15",
    estado: "activo",
  },
  {
    id: "U003",
    nombre: "Ana",
    apellidos: "Hernández López",
    matricula: "20220156",
    carrera: "Ingeniería en Sistemas",
    tipo: "estudiante",
    email: "ahernandez@unilib.edu.mx",
    telefono: "55-3456-7890",
    prestamosActivos: 0,
    limitePrestamos: 3,
    fechaRegistro: "2022-01-10",
    estado: "activo",
  },
  {
    id: "U004",
    nombre: "Dr. Roberto",
    apellidos: "Sánchez Fuentes",
    matricula: "DOC-0045",
    carrera: "Facultad de Derecho",
    tipo: "docente",
    email: "rsanchez@unilib.edu.mx",
    telefono: "55-4567-8901",
    prestamosActivos: 3,
    limitePrestamos: 5,
    fechaRegistro: "2010-03-01",
    estado: "activo",
  },
  {
    id: "U005",
    nombre: "Laura",
    apellidos: "Ramírez Castro",
    matricula: "20200634",
    carrera: "Administración de Empresas",
    tipo: "estudiante",
    email: "lramirez@unilib.edu.mx",
    telefono: "55-5678-9012",
    prestamosActivos: 1,
    limitePrestamos: 3,
    fechaRegistro: "2020-08-20",
    estado: "activo",
  },
  {
    id: "U006",
    nombre: "Miguel",
    apellidos: "Torres Espinoza",
    matricula: "20180923",
    carrera: "Arquitectura",
    tipo: "estudiante",
    email: "mtorres@unilib.edu.mx",
    telefono: "55-6789-0123",
    prestamosActivos: 2,
    limitePrestamos: 3,
    fechaRegistro: "2018-09-05",
    estado: "suspendido",
  },
  {
    id: "U007",
    nombre: "Dra. Patricia",
    apellidos: "Vega Montes",
    matricula: "DOC-0123",
    carrera: "Facultad de Psicología",
    tipo: "docente",
    email: "pvega@unilib.edu.mx",
    telefono: "55-7890-1234",
    prestamosActivos: 2,
    limitePrestamos: 5,
    fechaRegistro: "2015-02-14",
    estado: "activo",
  },
  {
    id: "U008",
    nombre: "Javier",
    apellidos: "Mendoza Ruiz",
    matricula: "20230078",
    carrera: "Medicina",
    tipo: "estudiante",
    email: "jmendoza@unilib.edu.mx",
    telefono: "55-8901-2345",
    prestamosActivos: 1,
    limitePrestamos: 3,
    fechaRegistro: "2023-01-15",
    estado: "activo",
  },
  {
    id: "U009",
    nombre: "Sofía",
    apellidos: "Jiménez Rojas",
    matricula: "20210789",
    carrera: "Sociología",
    tipo: "estudiante",
    email: "sjimenez@unilib.edu.mx",
    telefono: "55-9012-3456",
    prestamosActivos: 0,
    limitePrestamos: 3,
    fechaRegistro: "2021-09-01",
    estado: "activo",
  },
  {
    id: "U010",
    nombre: "Fernando",
    apellidos: "Cruz Salinas",
    matricula: "ADM-0012",
    carrera: "Administración General",
    tipo: "administrativo",
    email: "fcruz@unilib.edu.mx",
    telefono: "55-0123-4567",
    prestamosActivos: 1,
    limitePrestamos: 3,
    fechaRegistro: "2017-06-01",
    estado: "activo",
  },
  {
    id: "U011",
    nombre: "Gabriela",
    apellidos: "Flores Medina",
    matricula: "20220411",
    carrera: "Licenciatura en Historia",
    tipo: "estudiante",
    email: "gflores@unilib.edu.mx",
    telefono: "55-1122-3344",
    prestamosActivos: 1,
    limitePrestamos: 3,
    fechaRegistro: "2022-09-02",
    estado: "activo",
  },
  {
    id: "U012",
    nombre: "Dr. Alfonso",
    apellidos: "Becerra Ortega",
    matricula: "DOC-0078",
    carrera: "Facultad de Matemáticas",
    tipo: "docente",
    email: "abecerra@unilib.edu.mx",
    telefono: "55-2233-4455",
    prestamosActivos: 0,
    limitePrestamos: 5,
    fechaRegistro: "2008-08-20",
    estado: "activo",
  },
];

// ─── Mock Loans ───────────────────────────────────────────────────────────────

export const INITIAL_LOANS: Loan[] = [
  {
    id: "P001",
    libroId: "B001",
    usuarioId: "U001",
    fechaPrestamo: "2026-06-02",
    fechaDevolucion: "2026-06-16",
    estado: "vencido",
    renovaciones: 0,
  },
  {
    id: "P002",
    libroId: "B005",
    usuarioId: "U001",
    fechaPrestamo: "2026-06-10",
    fechaDevolucion: "2026-06-24",
    estado: "activo",
    renovaciones: 0,
  },
  {
    id: "P003",
    libroId: "B002",
    usuarioId: "U002",
    fechaPrestamo: "2026-06-18",
    fechaDevolucion: "2026-07-09",
    estado: "activo",
    renovaciones: 0,
  },
  {
    id: "P004",
    libroId: "B007",
    usuarioId: "U003",
    fechaPrestamo: "2026-06-12",
    fechaDevolucion: "2026-06-26",
    estado: "activo",
    renovaciones: 0,
  },
  {
    id: "P005",
    libroId: "B011",
    usuarioId: "U004",
    fechaPrestamo: "2026-06-01",
    fechaDevolucion: "2026-06-22",
    estado: "activo",
    renovaciones: 0,
  },
  {
    id: "P006",
    libroId: "B009",
    usuarioId: "U004",
    fechaPrestamo: "2026-06-05",
    fechaDevolucion: "2026-06-26",
    estado: "activo",
    renovaciones: 0,
  },
  {
    id: "P007",
    libroId: "B014",
    usuarioId: "U004",
    fechaPrestamo: "2026-05-30",
    fechaDevolucion: "2026-06-13",
    estado: "vencido",
    renovaciones: 0,
  },
  {
    id: "P008",
    libroId: "B006",
    usuarioId: "U005",
    fechaPrestamo: "2026-06-14",
    fechaDevolucion: "2026-06-28",
    estado: "activo",
    renovaciones: 0,
  },
  {
    id: "P009",
    libroId: "B008",
    usuarioId: "U006",
    fechaPrestamo: "2026-05-20",
    fechaDevolucion: "2026-06-03",
    estado: "vencido",
    renovaciones: 1,
  },
  {
    id: "P010",
    libroId: "B012",
    usuarioId: "U006",
    fechaPrestamo: "2026-05-25",
    fechaDevolucion: "2026-06-08",
    estado: "vencido",
    renovaciones: 0,
  },
  {
    id: "P011",
    libroId: "B006",
    usuarioId: "U007",
    fechaPrestamo: "2026-06-08",
    fechaDevolucion: "2026-06-22",
    estado: "activo",
    renovaciones: 0,
  },
  {
    id: "P012",
    libroId: "B002",
    usuarioId: "U008",
    fechaPrestamo: "2026-06-13",
    fechaDevolucion: "2026-06-27",
    estado: "activo",
    renovaciones: 0,
  },
  {
    id: "P013",
    libroId: "B004",
    usuarioId: "U011",
    fechaPrestamo: "2026-06-11",
    fechaDevolucion: "2026-06-25",
    estado: "activo",
    renovaciones: 0,
  },
  {
    id: "P014",
    libroId: "B010",
    usuarioId: "U009",
    fechaPrestamo: "2026-05-15",
    fechaDevolucion: "2026-05-29",
    fechaDevolucionReal: "2026-05-28",
    estado: "devuelto",
    renovaciones: 0,
  },
  {
    id: "P015",
    libroId: "B003",
    usuarioId: "U012",
    fechaPrestamo: "2026-05-10",
    fechaDevolucion: "2026-05-24",
    fechaDevolucionReal: "2026-05-23",
    estado: "devuelto",
    renovaciones: 0,
  },
];

// ─── Mock Reservations ────────────────────────────────────────────────────────

export const INITIAL_RESERVATIONS: Reservation[] = [
  {
    id: "R001",
    libroId: "B008",
    usuarioId: "U003",
    fechaReserva: "2026-06-10",
    fechaVencimiento: "2026-06-17",
    estado: "pendiente",
  },
  {
    id: "R002",
    libroId: "B012",
    usuarioId: "U002",
    fechaReserva: "2026-06-11",
    fechaVencimiento: "2026-06-18",
    estado: "pendiente",
  },
  {
    id: "R003",
    libroId: "B008",
    usuarioId: "U009",
    fechaReserva: "2026-06-12",
    fechaVencimiento: "2026-06-19",
    estado: "confirmada",
  },
  {
    id: "R004",
    libroId: "B002",
    usuarioId: "U007",
    fechaReserva: "2026-06-13",
    fechaVencimiento: "2026-06-20",
    estado: "pendiente",
  },
  {
    id: "R005",
    libroId: "B005",
    usuarioId: "U010",
    fechaReserva: "2026-06-14",
    fechaVencimiento: "2026-06-21",
    estado: "confirmada",
  },
  {
    id: "R006",
    libroId: "B011",
    usuarioId: "U001",
    fechaReserva: "2026-06-08",
    fechaVencimiento: "2026-06-15",
    estado: "cancelada",
  },
  {
    id: "R007",
    libroId: "B012",
    usuarioId: "U008",
    fechaReserva: "2026-05-28",
    fechaVencimiento: "2026-06-04",
    estado: "completada",
  },
  {
    id: "R008",
    libroId: "B001",
    usuarioId: "U011",
    fechaReserva: "2026-06-15",
    fechaVencimiento: "2026-06-22",
    estado: "pendiente",
  },
];

// ─── Mock Inventory ───────────────────────────────────────────────────────────

export const INVENTORY_ITEMS: InventoryItem[] = [
  // B001 - 6 ejemplares
  { id: "I001", libroId: "B001", codigoEjemplar: "B001-E01", condicion: "excelente", disponible: true, fechaAdquisicion: "2019-09-01", ubicacion: "A-12-3" },
  { id: "I002", libroId: "B001", codigoEjemplar: "B001-E02", condicion: "bueno", disponible: true, fechaAdquisicion: "2019-09-01", ubicacion: "A-12-3" },
  { id: "I003", libroId: "B001", codigoEjemplar: "B001-E03", condicion: "bueno", disponible: false, fechaAdquisicion: "2019-09-01", ubicacion: "A-12-3" },
  { id: "I004", libroId: "B001", codigoEjemplar: "B001-E04", condicion: "regular", disponible: false, fechaAdquisicion: "2020-01-15", ubicacion: "A-12-3" },
  { id: "I005", libroId: "B001", codigoEjemplar: "B001-E05", condicion: "bueno", disponible: true, fechaAdquisicion: "2022-09-01", ubicacion: "A-12-3" },
  { id: "I006", libroId: "B001", codigoEjemplar: "B001-E06", condicion: "excelente", disponible: false, fechaAdquisicion: "2023-02-10", ubicacion: "A-12-3" },
  // B002 - 4 ejemplares
  { id: "I007", libroId: "B002", codigoEjemplar: "B002-E01", condicion: "excelente", disponible: false, fechaAdquisicion: "2018-09-01", ubicacion: "C-03-1" },
  { id: "I008", libroId: "B002", codigoEjemplar: "B002-E02", condicion: "bueno", disponible: false, fechaAdquisicion: "2018-09-01", ubicacion: "C-03-1" },
  { id: "I009", libroId: "B002", codigoEjemplar: "B002-E03", condicion: "regular", disponible: false, fechaAdquisicion: "2019-08-01", ubicacion: "C-03-1" },
  { id: "I010", libroId: "B002", codigoEjemplar: "B002-E04", condicion: "bueno", disponible: true, fechaAdquisicion: "2022-01-20", ubicacion: "C-03-1" },
  // B003 - 8 ejemplares
  { id: "I011", libroId: "B003", codigoEjemplar: "B003-E01", condicion: "excelente", disponible: true, fechaAdquisicion: "2020-09-01", ubicacion: "D-07-2" },
  { id: "I012", libroId: "B003", codigoEjemplar: "B003-E02", condicion: "excelente", disponible: true, fechaAdquisicion: "2020-09-01", ubicacion: "D-07-2" },
  { id: "I013", libroId: "B003", codigoEjemplar: "B003-E03", condicion: "bueno", disponible: true, fechaAdquisicion: "2020-09-01", ubicacion: "D-07-2" },
  { id: "I014", libroId: "B003", codigoEjemplar: "B003-E04", condicion: "bueno", disponible: false, fechaAdquisicion: "2021-01-10", ubicacion: "D-07-2" },
  { id: "I015", libroId: "B003", codigoEjemplar: "B003-E05", condicion: "regular", disponible: true, fechaAdquisicion: "2021-09-01", ubicacion: "D-07-2" },
  { id: "I016", libroId: "B003", codigoEjemplar: "B003-E06", condicion: "bueno", disponible: true, fechaAdquisicion: "2022-09-01", ubicacion: "D-07-2" },
  { id: "I017", libroId: "B003", codigoEjemplar: "B003-E07", condicion: "excelente", disponible: false, fechaAdquisicion: "2022-09-01", ubicacion: "D-07-2" },
  { id: "I018", libroId: "B003", codigoEjemplar: "B003-E08", condicion: "excelente", disponible: true, fechaAdquisicion: "2024-01-15", ubicacion: "D-07-2" },
  // B008 - 3 ejemplares (all loaned)
  { id: "I019", libroId: "B008", codigoEjemplar: "B008-E01", condicion: "bueno", disponible: false, fechaAdquisicion: "2018-09-01", ubicacion: "H-04-2" },
  { id: "I020", libroId: "B008", codigoEjemplar: "B008-E02", condicion: "regular", disponible: false, fechaAdquisicion: "2019-01-10", ubicacion: "H-04-2" },
  { id: "I021", libroId: "B008", codigoEjemplar: "B008-E03", condicion: "deteriorado", disponible: false, fechaAdquisicion: "2016-09-01", ubicacion: "H-04-2" },
  // B012 - 3 ejemplares (all loaned)
  { id: "I022", libroId: "B012", codigoEjemplar: "B012-E01", condicion: "bueno", disponible: false, fechaAdquisicion: "2020-09-01", ubicacion: "C-07-2" },
  { id: "I023", libroId: "B012", codigoEjemplar: "B012-E02", condicion: "bueno", disponible: false, fechaAdquisicion: "2020-09-01", ubicacion: "C-07-2" },
  { id: "I024", libroId: "B012", codigoEjemplar: "B012-E03", condicion: "deteriorado", disponible: false, fechaAdquisicion: "2017-08-01", ubicacion: "C-07-2" },
];

// ─── Mock Purchase Requests ───────────────────────────────────────────────────

export const INITIAL_PURCHASE_REQUESTS: PurchaseRequest[] = [
  {
    id: "SQ001",
    usuarioId: "U004",
    titulo: "Teoría del Derecho Constitucional",
    autor: "Luigi Ferrajoli",
    isbn: "978-84-9879-543-2",
    editorial: "Trotta",
    anio: 2022,
    tipo: "libro_fisico",
    cantidad: 5,
    justificacion: "Texto obligatorio para Derecho Constitucional Avanzado. Los 3 ejemplares existentes son insuficientes para un grupo de 35 estudiantes.",
    asignatura: "Derecho Constitucional Avanzado",
    fechaSolicitud: "2026-06-10",
    estado: "pendiente",
  },
  {
    id: "SQ002",
    usuarioId: "U007",
    titulo: "DSM-5-TR: Manual Diagnóstico y Estadístico de los Trastornos Mentales",
    autor: "American Psychiatric Association",
    editorial: "Panamericana",
    anio: 2023,
    tipo: "licencia_digital",
    cantidad: 30,
    justificacion: "Licencia digital para acceso concurrente de alumnos de posgrado en Psicología Clínica. La edición impresa actual está desactualizada.",
    asignatura: "Psicopatología Clínica",
    fechaSolicitud: "2026-06-12",
    estado: "en_evaluacion",
  },
  {
    id: "SQ003",
    usuarioId: "U004",
    titulo: "Código Civil Federal Comentado 2026",
    autor: "Instituto de Investigaciones Jurídicas UNAM",
    editorial: "UNAM",
    anio: 2026,
    tipo: "libro_fisico",
    cantidad: 10,
    justificacion: "Actualización urgente con las reformas vigentes. Imprescindible para prácticas de litigación.",
    asignatura: "Derecho Civil",
    fechaSolicitud: "2026-05-28",
    estado: "aprobada",
    observaciones: "Presupuesto asignado. Proceso de adquisición iniciado. Entrega estimada: julio 2026.",
  },
  {
    id: "SQ004",
    usuarioId: "U012",
    titulo: "Introduction to Linear Algebra, 5th Ed.",
    autor: "Gilbert Strang",
    isbn: "978-1-7331466-2-6",
    editorial: "Wellesley-Cambridge Press",
    anio: 2023,
    tipo: "libro_fisico",
    cantidad: 8,
    justificacion: "Texto de referencia internacional para los cursos de Álgebra Lineal de ingeniería. Superior a la edición actual en la biblioteca.",
    asignatura: "Álgebra Lineal Aplicada",
    fechaSolicitud: "2026-06-01",
    estado: "rechazada",
    observaciones: "Presupuesto no disponible en el ciclo actual. Se sugiere reenviar la solicitud en el próximo período.",
  },
];

export type ModuleId =
  | "dashboard"
  | "catalogo"
  | "prestamos"
  | "usuarios"
  | "reservas"
  | "gestion-libros"
  | "solicitudes-adquisicion"
  | "inicio"
  | "mis-prestamos"
  | "mis-reservas"
  | "mis-solicitudes"
  | "reportes"
  | "perfil";

export type UserRole = "guest" | "estudiante" | "docente" | "bibliotecario" | "admin";

export interface AuthUser {
  role: UserRole;
  userId?: string;
  name: string;
  email: string;
  initials: string;
}

export const DEMO_ACCOUNTS: {
  username: string;
  password: string;
  role: UserRole;
  userId?: string;
  name: string;
  email: string;
}[] = [
  {
    username: "admin",
    password: "admin2024",
    role: "admin",
    name: "Administrador General",
    email: "admin@unilib.edu.mx",
  },
  {
    username: "bibliotecario",
    password: "bib2024",
    role: "bibliotecario",
    name: "Lic. Carmen Vásquez",
    email: "cvasquez@unilib.edu.mx",
  },
  {
    username: "mgonzalez",
    password: "maria2024",
    role: "estudiante",
    userId: "U001",
    name: "María González Reyes",
    email: "mgonzalez@unilib.edu.mx",
  },
  {
    username: "cmorales",
    password: "carlos2024",
    role: "estudiante",
    userId: "U002",
    name: "Carlos Morales Ávila",
    email: "cmorales@unilib.edu.mx",
  },
  {
    username: "ahernandez",
    password: "ana2024",
    role: "estudiante",
    userId: "U003",
    name: "Ana Hernández López",
    email: "ahernandez@unilib.edu.mx",
  },
  {
    username: "rsanchez",
    password: "doc2024",
    role: "docente",
    userId: "U004",
    name: "Dr. Roberto Sánchez Fuentes",
    email: "rsanchez@unilib.edu.mx",
  },
  {
    username: "pvega",
    password: "doc2024",
    role: "docente",
    userId: "U007",
    name: "Dra. Patricia Vega Montes",
    email: "pvega@unilib.edu.mx",
  },
];
