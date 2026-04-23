/**
 * Mock Data - Datos simulados para desarrollo sin backend
 * Emula las respuestas del servidor .NET en localhost:5223
 */

export const mockVacantes = [
  {
    id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    titulo: 'Desarrollador Full Stack',
    descripcion: 'Buscamos un desarrollador Full Stack con experiencia en React y Node.js para unirse a nuestro equipo de innovacion. El candidato ideal tendra experiencia construyendo aplicaciones web escalables y trabajando en equipos agiles.',
    ubicacion: 'San Salvador',
    tipoContrato: 'Tiempo completo',
    salarioMin: 1500,
    salarioMax: 2500,
    estaActiva: true,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
    requisitos: ['React', 'Node.js', 'PostgreSQL', 'TypeScript', '3+ años de experiencia'],
  },
  {
    id: 'b2c3d4e5-f6g7-8901-bcde-fg2345678901',
    titulo: 'Diseñador UX/UI',
    descripcion: 'Estamos en busqueda de un Diseñador UX/UI creativo para diseñar interfaces de usuario intuitivas y atractivas. Trabajaras de cerca con nuestro equipo de desarrollo para crear experiencias de usuario excepcionales.',
    ubicacion: 'La Libertad',
    tipoContrato: 'Remoto',
    salarioMin: 1200,
    salarioMax: 2000,
    estaActiva: true,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
    requisitos: ['Figma', 'Adobe XD', 'Prototipado', 'Design Thinking', 'Portfolio demostrable'],
  },
  {
    id: 'c3d4e5f6-g7h8-9012-cdef-gh3456789012',
    titulo: 'Analista de Datos',
    descripcion: 'Buscamos un Analista de Datos para transformar datos en insights accionables. El candidato debera tener experiencia en visualizacion de datos, SQL y herramientas de BI.',
    ubicacion: 'Santa Ana',
    tipoContrato: 'Tiempo completo',
    salarioMin: 1300,
    salarioMax: 1800,
    estaActiva: true,
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
    requisitos: ['SQL', 'Python', 'Power BI', 'Excel avanzado', 'Estadistica'],
  },
  {
    id: 'd4e5f6g7-h8i9-0123-defg-hi4567890123',
    titulo: 'Ingeniero DevOps',
    descripcion: 'Se requiere Ingeniero DevOps para automatizar y optimizar nuestros procesos de CI/CD. Experiencia con contenedores, orquestacion y servicios en la nube es esencial.',
    ubicacion: 'San Salvador',
    tipoContrato: 'Tiempo completo',
    salarioMin: 2000,
    salarioMax: 3000,
    estaActiva: true,
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
    requisitos: ['Docker', 'Kubernetes', 'AWS/Azure', 'Jenkins', 'Linux', 'Terraform'],
  },
  {
    id: 'e5f6g7h8-i9j0-1234-efgh-ij5678901234',
    titulo: 'Community Manager',
    descripcion: 'Buscamos un Community Manager dinamico para gestionar nuestras redes sociales y construir una comunidad comprometida. Creatividad y excelentes habilidades de comunicacion son esenciales.',
    ubicacion: 'Sonsonate',
    tipoContrato: 'Medio tiempo',
    salarioMin: 600,
    salarioMax: 900,
    estaActiva: true,
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
    requisitos: ['Redes sociales', 'Copywriting', 'Canva', 'Analisis de metricas', 'Creatividad'],
  },
  {
    id: 'f6g7h8i9-j0k1-2345-fghi-jk6789012345',
    titulo: 'Desarrollador Mobile',
    descripcion: 'Necesitamos un Desarrollador Mobile para crear aplicaciones nativas e hibridas. Experiencia con React Native o Flutter es altamente valorada.',
    ubicacion: 'San Miguel',
    tipoContrato: 'Freelance',
    salarioMin: 1800,
    salarioMax: 2800,
    estaActiva: true,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
    requisitos: ['React Native', 'Flutter', 'iOS', 'Android', 'APIs REST', 'Git'],
  },
  {
    id: 'g7h8i9j0-k1l2-3456-ghij-kl7890123456',
    titulo: 'Contador Junior',
    descripcion: 'Se busca Contador Junior para apoyar en las operaciones contables diarias. Conocimiento en normativas fiscales salvadoreñas y software contable es requerido.',
    ubicacion: 'La Libertad',
    tipoContrato: 'Tiempo completo',
    salarioMin: 700,
    salarioMax: 1000,
    estaActiva: true,
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
    requisitos: ['Contabilidad', 'Excel', 'SAP', 'Normativas fiscales', 'Atencion al detalle'],
  },
  {
    id: 'h8i9j0k1-l2m3-4567-hijk-lm8901234567',
    titulo: 'Gerente de Proyectos TI',
    descripcion: 'Buscamos un Gerente de Proyectos TI experimentado para liderar proyectos de transformacion digital. Certificacion PMP o Scrum Master es un plus.',
    ubicacion: 'San Salvador',
    tipoContrato: 'Tiempo completo',
    salarioMin: 2500,
    salarioMax: 3500,
    estaActiva: true,
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
    requisitos: ['Gestion de proyectos', 'Scrum', 'Jira', 'Liderazgo', 'Comunicacion efectiva', 'PMP'],
  },
  {
    id: 'i9j0k1l2-m3n4-5678-ijkl-mn9012345678',
    titulo: 'Asistente Administrativo',
    descripcion: 'Se requiere Asistente Administrativo para apoyar en tareas de oficina, gestion de documentos y atencion al cliente. Organizacion y proactividad son clave.',
    ubicacion: 'Cuscatlan',
    tipoContrato: 'Tiempo completo',
    salarioMin: 500,
    salarioMax: 700,
    estaActiva: true,
    createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
    requisitos: ['Microsoft Office', 'Organizacion', 'Atencion al cliente', 'Redaccion', 'Proactividad'],
  },
  {
    id: 'j0k1l2m3-n4o5-6789-jklm-no0123456789',
    titulo: 'Especialista en Marketing Digital',
    descripcion: 'Buscamos un Especialista en Marketing Digital para diseñar y ejecutar campañas de marketing online. Experiencia en SEO, SEM y publicidad en redes sociales es requerida.',
    ubicacion: 'San Salvador',
    tipoContrato: 'Remoto',
    salarioMin: 1400,
    salarioMax: 2200,
    estaActiva: true,
    createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
    requisitos: ['SEO', 'Google Ads', 'Facebook Ads', 'Google Analytics', 'Email Marketing', 'Copywriting'],
  },
  {
    id: 'k1l2m3n4-o5p6-7890-klmn-op1234567890',
    titulo: 'Practicante de Recursos Humanos',
    descripcion: 'Oportunidad de practicas en el area de Recursos Humanos. Apoyo en procesos de reclutamiento, seleccion y administracion de personal.',
    ubicacion: 'La Libertad',
    tipoContrato: 'Practicas',
    salarioMin: 300,
    salarioMax: 400,
    estaActiva: true,
    createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
    requisitos: ['Estudiante universitario', 'Psicologia o RRHH', 'Excel basico', 'Buena comunicacion'],
  },
  {
    id: 'l2m3n4o5-p6q7-8901-lmno-pq2345678901',
    titulo: 'Tecnico de Soporte IT',
    descripcion: 'Se busca Tecnico de Soporte IT para brindar asistencia tecnica a usuarios. Conocimiento en redes, hardware y software es necesario.',
    ubicacion: 'Usulutan',
    tipoContrato: 'Contrato temporal',
    salarioMin: 600,
    salarioMax: 900,
    estaActiva: true,
    createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
    requisitos: ['Soporte tecnico', 'Windows/Linux', 'Redes', 'Hardware', 'Atencion al cliente'],
  },
];

export const mockPostulaciones = [
  {
    id: 'post-001',
    vacanteId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    nombreCompleto: 'Juan Carlos Rodriguez',
    email: 'juan.rodriguez@email.com',
    telefono: '+503 7890-1234',
    estado: 'En revision',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    notas: '',
  },
  {
    id: 'post-002',
    vacanteId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    nombreCompleto: 'Maria Elena Perez',
    email: 'maria.perez@email.com',
    telefono: '+503 7654-3210',
    estado: 'Entrevista programada',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    notas: 'Candidata con excelente perfil',
  },
  {
    id: 'post-003',
    vacanteId: 'b2c3d4e5-f6g7-8901-bcde-fg2345678901',
    nombreCompleto: 'Carlos Alberto Gomez',
    email: 'carlos.gomez@email.com',
    telefono: '+503 6543-2109',
    estado: 'Nuevo',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    notas: '',
  },
  {
    id: 'post-004',
    vacanteId: 'c3d4e5f6-g7h8-9012-cdef-gh3456789012',
    nombreCompleto: 'Ana Sofia Martinez',
    email: 'ana.martinez@email.com',
    telefono: '+503 7777-8888',
    estado: 'Contratado',
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    notas: 'Inicio de labores el proximo mes',
  },
  {
    id: 'post-005',
    vacanteId: 'd4e5f6g7-h8i9-0123-defg-hi4567890123',
    nombreCompleto: 'Roberto Ernesto Lopez',
    email: 'roberto.lopez@email.com',
    telefono: '+503 6666-5555',
    estado: 'En revision',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    notas: '',
  },
  {
    id: 'post-006',
    vacanteId: 'f6g7h8i9-j0k1-2345-fghi-jk6789012345',
    nombreCompleto: 'Laura Patricia Hernandez',
    email: 'laura.hernandez@email.com',
    telefono: '+503 7111-2222',
    estado: 'Nuevo',
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    notas: '',
  },
  {
    id: 'post-007',
    vacanteId: 'h8i9j0k1-l2m3-4567-hijk-lm8901234567',
    nombreCompleto: 'Fernando Jose Ramirez',
    email: 'fernando.ramirez@email.com',
    telefono: '+503 7333-4444',
    estado: 'Rechazado',
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    notas: 'No cumple con los requisitos minimos',
  },
  {
    id: 'post-008',
    vacanteId: 'j0k1l2m3-n4o5-6789-jklm-no0123456789',
    nombreCompleto: 'Carmen Lucia Flores',
    email: 'carmen.flores@email.com',
    telefono: '+503 7555-6666',
    estado: 'Entrevista programada',
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    notas: 'Segunda entrevista agendada',
  },
];

// Simular delay de red
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// API simulada para vacantes
export const mockVacantesApi = {
  getAll: async () => {
    await delay(300);
    return { data: mockVacantes };
  },
  getById: async (id) => {
    await delay(200);
    const vacante = mockVacantes.find((v) => v.id === id);
    if (!vacante) throw new Error('Vacante no encontrada');
    return { data: vacante };
  },
  create: async (data) => {
    await delay(400);
    const newVacante = {
      ...data,
      id: `new-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      estaActiva: true,
    };
    mockVacantes.push(newVacante);
    return { data: newVacante };
  },
  update: async (id, data) => {
    await delay(300);
    const index = mockVacantes.findIndex((v) => v.id === id);
    if (index === -1) throw new Error('Vacante no encontrada');
    mockVacantes[index] = { ...mockVacantes[index], ...data, updatedAt: new Date().toISOString() };
    return { data: mockVacantes[index] };
  },
  delete: async (id) => {
    await delay(200);
    const index = mockVacantes.findIndex((v) => v.id === id);
    if (index === -1) throw new Error('Vacante no encontrada');
    mockVacantes.splice(index, 1);
    return { data: { success: true } };
  },
};

// API simulada para postulaciones
export const mockPostulacionesApi = {
  getAll: async () => {
    await delay(300);
    return { data: mockPostulaciones };
  },
  getByVacante: async (vacanteId) => {
    await delay(200);
    const postulaciones = mockPostulaciones.filter((p) => p.vacanteId === vacanteId);
    return { data: postulaciones };
  },
  create: async (formData) => {
    await delay(500);
    const newPostulacion = {
      id: `post-${Date.now()}`,
      vacanteId: formData.get('vacanteId') || formData.vacanteId,
      nombreCompleto: formData.get('nombreCompleto') || formData.nombreCompleto,
      email: formData.get('email') || formData.email,
      telefono: formData.get('telefono') || formData.telefono,
      estado: 'Nuevo',
      createdAt: new Date().toISOString(),
      notas: '',
    };
    mockPostulaciones.push(newPostulacion);
    return { data: newPostulacion };
  },
  updateEstado: async (id, estado) => {
    await delay(200);
    const postulacion = mockPostulaciones.find((p) => p.id === id);
    if (!postulacion) throw new Error('Postulacion no encontrada');
    postulacion.estado = estado;
    return { data: postulacion };
  },
  updateNotas: async (id, notas) => {
    await delay(200);
    const postulacion = mockPostulaciones.find((p) => p.id === id);
    if (!postulacion) throw new Error('Postulacion no encontrada');
    postulacion.notas = notas;
    return { data: postulacion };
  },
  delete: async (id) => {
    await delay(200);
    const index = mockPostulaciones.findIndex((p) => p.id === id);
    if (index === -1) throw new Error('Postulacion no encontrada');
    mockPostulaciones.splice(index, 1);
    return { data: { success: true } };
  },
};
