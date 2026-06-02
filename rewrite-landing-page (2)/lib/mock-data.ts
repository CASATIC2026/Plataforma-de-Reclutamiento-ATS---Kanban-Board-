// Mock fixtures following the V0 Mocking Guide
// Uses camelCase to match the real API shape (VacanteResponseDTO)

export interface Vacante {
  id: string;
  titulo: string;
  descripcion: string;
  ubicacion: string;
  tipoContrato: string;
  salarioMin: number;
  salarioMax: number;
  estaActiva: boolean;
  umbralPuntaje: number;
  screeningActivo: boolean;
  createdAt: string;
  updatedAt: string;
  requisitos: string[];
  postulacionesCount: number;
  // UI-only fields added after mapping
  company?: string;
  icon?: string;
  badge?: "new" | "urgent" | null;
}

// Mock vacantes fixture matching VacanteResponseDTO shape
export const mockVacantes: Vacante[] = [
  {
    id: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    titulo: "Ingeniero Full-stack Senior (Next.js & Go)",
    descripcion:
      "Buscamos un ingeniero full-stack con experiencia sólida en Next.js, React y Go para construir productos de alta escala. Trabajarás en un equipo multidisciplinario desarrollando soluciones innovadoras.",
    ubicacion: "San Salvador (Remoto)",
    tipoContrato: "Tiempo completo",
    salarioMin: 3500,
    salarioMax: 5200,
    estaActiva: true,
    umbralPuntaje: 60,
    screeningActivo: true,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    updatedAt: new Date().toISOString(),
    requisitos: ["Next.js", "React", "Go", "PostgreSQL", "Docker"],
    postulacionesCount: 12,
    company: "InnovaTech Solutions",
    icon: "rocket_launch",
    badge: "new",
  },
  {
    id: "b2c3d4e5-f6a7-8901-bcde-f12345678901",
    titulo: "Arquitecto Líder de Ciberseguridad",
    descripcion:
      "Lidera la estrategia de seguridad para una empresa global. Diseñarás arquitecturas de seguridad, implementarás controles y capacitarás equipos técnicos.",
    ubicacion: "Santa Tecla",
    tipoContrato: "Tiempo completo",
    salarioMin: 4000,
    salarioMax: 6000,
    estaActiva: true,
    umbralPuntaje: 70,
    screeningActivo: true,
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), // 12 hours ago
    updatedAt: new Date().toISOString(),
    requisitos: ["CISSP", "AWS Security", "Penetration Testing", "SOC 2"],
    postulacionesCount: 8,
    company: "SecureGlobal SV",
    icon: "shield",
    badge: "urgent",
  },
  {
    id: "c3d4e5f6-a7b8-9012-cdef-123456789012",
    titulo: "Diseñador Senior de Producto UI/UX",
    descripcion:
      "Transforma ideas en experiencias digitales excepcionales. Colaborarás con equipos de producto y desarrollo para crear interfaces intuitivas y atractivas.",
    ubicacion: "San Benito, SS",
    tipoContrato: "Tiempo completo",
    salarioMin: 2500,
    salarioMax: 3800,
    estaActiva: true,
    umbralPuntaje: 55,
    screeningActivo: false,
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
    updatedAt: new Date().toISOString(),
    requisitos: ["Figma", "Design Systems", "User Research", "Prototyping"],
    postulacionesCount: 23,
    company: "CreativeFlow Agency",
    icon: "brush",
    badge: null,
  },
  {
    id: "d4e5f6a7-b8c9-0123-def0-234567890123",
    titulo: "Especialista Administrador de Bases de Datos",
    descripcion:
      "Gestiona y optimiza bases de datos PostgreSQL y MongoDB a gran escala. Asegura alta disponibilidad y rendimiento para aplicaciones críticas.",
    ubicacion: "Antiguo Cuscatlán",
    tipoContrato: "Tiempo completo",
    salarioMin: 3000,
    salarioMax: 4500,
    estaActiva: true,
    umbralPuntaje: 65,
    screeningActivo: true,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    updatedAt: new Date().toISOString(),
    requisitos: ["PostgreSQL", "MongoDB", "Redis", "Performance Tuning"],
    postulacionesCount: 6,
    company: "CloudData Systems",
    icon: "database",
    badge: "new",
  },
  {
    id: "e5f6a7b8-c9d0-1234-ef01-345678901234",
    titulo: "Desarrollador Móvil Senior (Kotlin)",
    descripcion:
      "Desarrolla aplicaciones Android nativas de alto rendimiento. Trabaja con las últimas tecnologías de Kotlin y Jetpack Compose.",
    ubicacion: "Remoto",
    tipoContrato: "Remoto",
    salarioMin: 3800,
    salarioMax: 5500,
    estaActiva: true,
    umbralPuntaje: 60,
    screeningActivo: true,
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
    updatedAt: new Date().toISOString(),
    requisitos: ["Kotlin", "Jetpack Compose", "MVVM", "Coroutines"],
    postulacionesCount: 15,
    company: "AppMakers El Salvador",
    icon: "smartphone",
    badge: null,
  },
  {
    id: "f6a7b8c9-d0e1-2345-f012-456789012345",
    titulo: "Científico de Datos Líder",
    descripcion:
      "Lidera iniciativas de machine learning y análisis predictivo. Construye modelos que impactan decisiones de negocio a nivel regional.",
    ubicacion: "San Salvador",
    tipoContrato: "Tiempo completo",
    salarioMin: 4500,
    salarioMax: 7000,
    estaActiva: true,
    umbralPuntaje: 75,
    screeningActivo: true,
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
    updatedAt: new Date().toISOString(),
    requisitos: ["Python", "TensorFlow", "SQL", "Statistics", "MLOps"],
    postulacionesCount: 4,
    company: "Insight SV Group",
    icon: "analytics",
    badge: "urgent",
  },
  {
    id: "a7b8c9d0-e1f2-3456-0123-567890123456",
    titulo: "Ingeniero DevOps (AWS/Azure)",
    descripcion:
      "Implementa y mantiene infraestructura cloud robusta. Automatiza pipelines CI/CD y mejora la eficiencia operativa del equipo.",
    ubicacion: "Santa Tecla (Híbrido)",
    tipoContrato: "Tiempo completo",
    salarioMin: 3200,
    salarioMax: 4800,
    estaActiva: true,
    umbralPuntaje: 60,
    screeningActivo: true,
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), // 4 days ago
    updatedAt: new Date().toISOString(),
    requisitos: ["AWS", "Azure", "Terraform", "Kubernetes", "CI/CD"],
    postulacionesCount: 9,
    company: "Nexus Infotech",
    icon: "cloud",
    badge: null,
  },
  {
    id: "b8c9d0e1-f2a3-4567-1234-678901234567",
    titulo: "Ingeniero de Automatización QA",
    descripcion:
      "Diseña e implementa frameworks de pruebas automatizadas. Asegura la calidad del software a través de testing end-to-end.",
    ubicacion: "Remoto",
    tipoContrato: "Remoto",
    salarioMin: 2200,
    salarioMax: 3500,
    estaActiva: true,
    umbralPuntaje: 55,
    screeningActivo: false,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    updatedAt: new Date().toISOString(),
    requisitos: ["Selenium", "Cypress", "Jest", "API Testing"],
    postulacionesCount: 11,
    company: "SoftTesting SV",
    icon: "verified_user",
    badge: "new",
  },
  {
    id: "c9d0e1f2-a3b4-5678-2345-789012345678",
    titulo: "Líder de Implementación de IA",
    descripcion:
      "Dirige proyectos de inteligencia artificial desde la conceptualización hasta producción. Colabora con stakeholders para identificar oportunidades de automatización.",
    ubicacion: "San Benito, SS",
    tipoContrato: "Tiempo completo",
    salarioMin: 5000,
    salarioMax: 8000,
    estaActiva: true,
    umbralPuntaje: 80,
    screeningActivo: true,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
    updatedAt: new Date().toISOString(),
    requisitos: ["AI/ML", "Python", "LLMs", "Project Management", "Strategy"],
    postulacionesCount: 7,
    company: "Future AI Labs",
    icon: "psychology",
    badge: null,
  },
];

// Statistics derived from mock data
export const mockStats = {
  newVacantesThisWeek: mockVacantes.filter(
    (v) =>
      new Date(v.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  ).length,
  averageSalary: 3200,
  totalCandidates: 12000,
};

// Filter options
export const CONTRACT_FILTERS = [
  { key: "Todos", label: "Todos" },
  { key: "Remoto", label: "Remoto" },
  { key: "Tiempo completo", label: "Tiempo completo" },
  { key: "Senior", label: "Senior" },
  { key: "Junior", label: "Junior" },
  { key: "Diseño UX", label: "Diseño UX" },
];

export const SALVADORAN_LOCATIONS = [
  "San Salvador",
  "La Libertad",
  "Santa Ana",
  "Cuscatlán",
  "Usulután",
  "Sonsonate",
  "Santa Tecla",
  "Antiguo Cuscatlán",
  "San Benito",
  "Remoto",
];

// Mock API response wrapper (matches axios shape)
export function mockResponse<T>(data: T, status = 200) {
  return Promise.resolve({
    data,
    status,
    statusText: "OK",
    headers: {},
    config: {},
  });
}

// Mock API functions
export const mockApi = {
  getVacantes: () =>
    mockResponse(mockVacantes.filter((v) => v.estaActiva)),
  getVacanteById: (id: string) =>
    mockResponse(mockVacantes.find((v) => v.id === id) || null),
};
