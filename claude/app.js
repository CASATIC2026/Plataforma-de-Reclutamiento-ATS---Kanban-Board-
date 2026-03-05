/* ============================================================
   TALENTBRIDGE — app.js
   Módulos:
   [1] DATA — Datos de vacantes
   [2] STATE — Estado de la aplicación
   [3] MODULE: Navbar
   [4] MODULE: Hero Tags
   [5] MODULE: Job Cards Renderer
   [6] MODULE: Filter Pills
   [7] MODULE: Search & Filter Logic
   [8] MODULE: Job Detail Modal
   [9] MODULE: Apply Form Modal
   [10] MODULE: Dropzone (CV upload)
   [11] MODULE: Form Validation
   [12] MODULE: Form Submit
   [13] INIT — Inicialización
============================================================ */


/* ============================================================
   [1] DATA — Datos de vacantes
============================================================ */
const JOBS_DATA = [
  {
    id: 1,
    title: "Desarrollador Full Stack Senior",
    company: "TechInnovate Solutions",
    location: "Ciudad de México, CDMX",
    type: "Tiempo Completo",
    salary: "$55,000 – $85,000 MXN",
    experience: "5+ años",
    category: "Tecnología",
    urgent: true,
    posted: "Hace 2 días",
    logoLetters: "TI",
    logoBg: "#1C3A5A",
    logoColor: "#7EB8E8",
    description: "Buscamos un desarrollador full stack con sólida experiencia en React, Node.js y bases de datos SQL/NoSQL para liderar proyectos de transformación digital.",
    responsibilities: [
      "Diseñar y desarrollar aplicaciones web escalables con React y Node.js.",
      "Gestionar bases de datos relacionales (PostgreSQL) y no relacionales (MongoDB).",
      "Colaborar con equipos de diseño y producto en metodologías ágiles.",
      "Participar en revisiones de código y mentorías a desarrolladores junior.",
      "Implementar buenas prácticas de seguridad y rendimiento."
    ],
    requirements: [
      "5+ años de experiencia en desarrollo full stack.",
      "Dominio de React, TypeScript, Node.js, Express.",
      "Experiencia con Docker, CI/CD y servicios en la nube (AWS/GCP).",
      "Habilidades de comunicación y trabajo en equipo.",
      "Inglés intermedio-avanzado (deseable)."
    ],
    benefits: [
      "Salario competitivo con revisión anual.",
      "Home office 3 días a la semana.",
      "Seguro médico mayor para ti y familia.",
      "Presupuesto anual de capacitación.",
      "Vales de despensa y de restaurante."
    ]
  },
  {
    id: 2,
    title: "Diseñador UX/UI Lead",
    company: "Creative Digital Agency",
    location: "Guadalajara, JAL",
    type: "Tiempo Completo",
    salary: "$42,000 – $62,000 MXN",
    experience: "4+ años",
    category: "Diseño",
    urgent: false,
    posted: "Hace 3 días",
    logoLetters: "CD",
    logoBg: "#2E3A5A",
    logoColor: "#9BB5E0",
    description: "Únete a nuestro equipo creativo para diseñar experiencias digitales excepcionales para marcas globales.",
    responsibilities: [
      "Liderar el proceso de diseño de producto desde discovery hasta entrega.",
      "Crear wireframes, prototipos y sistemas de diseño en Figma.",
      "Realizar investigación de usuarios y pruebas de usabilidad.",
      "Colaborar con stakeholders y equipos de desarrollo.",
      "Mantener y evolucionar el Design System corporativo."
    ],
    requirements: [
      "4+ años de experiencia en UX/UI design.",
      "Dominio avanzado de Figma y Adobe Creative Suite.",
      "Portafolio demostrable con proyectos reales.",
      "Conocimientos de accesibilidad (WCAG) y diseño inclusivo.",
      "Capacidad para liderar y presentar decisiones de diseño."
    ],
    benefits: [
      "Trabajo híbrido flexible.",
      "Equipo MacBook Pro.",
      "Acceso a licencias de herramientas de diseño.",
      "Participación en conferencias internacionales.",
      "Plan de carrera definido."
    ]
  },
  {
    id: 3,
    title: "Gerente de Marketing Digital",
    company: "Growth Marketing Hub",
    location: "Monterrey, NL",
    type: "Tiempo Completo",
    salary: "$48,000 – $72,000 MXN",
    experience: "3+ años",
    category: "Marketing",
    urgent: true,
    posted: "Hace 1 día",
    logoLetters: "GM",
    logoBg: "#3A2E1C",
    logoColor: "#E8B87E",
    description: "Lidera estrategias de marketing digital para impulsar el crecimiento de startups y empresas consolidadas.",
    responsibilities: [
      "Desarrollar y ejecutar estrategias de marketing digital multicanal.",
      "Gestionar campañas de SEM, SEO y redes sociales.",
      "Analizar métricas de desempeño y optimizar el ROI.",
      "Coordinar equipo de contenido, diseño y pauta.",
      "Presentar reportes ejecutivos a la dirección."
    ],
    requirements: [
      "3+ años en roles de marketing digital.",
      "Experiencia con Google Ads, Meta Ads y herramientas de analytics.",
      "Dominio de Google Analytics 4 y herramientas de BI.",
      "Habilidades de liderazgo y gestión de equipos.",
      "Certificaciones en marketing digital (deseable)."
    ],
    benefits: [
      "Bono de desempeño trimestral.",
      "Vehículo de empresa o tarjeta de movilidad.",
      "Plan dental y de visión.",
      "Trabajo 100% remoto con visitas mensuales.",
      "Stock options disponibles."
    ]
  },
  {
    id: 4,
    title: "Analista Financiero Senior",
    company: "Financial Partners Group",
    location: "Querétaro, QRO",
    type: "Tiempo Completo",
    salary: "$40,000 – $58,000 MXN",
    experience: "4+ años",
    category: "Finanzas",
    urgent: false,
    posted: "Hace 5 días",
    logoLetters: "FP",
    logoBg: "#1C3A2E",
    logoColor: "#7EC4A8",
    description: "Análisis financiero, modelado y reportes para decisiones estratégicas corporativas.",
    responsibilities: [
      "Elaborar modelos financieros y proyecciones de largo plazo.",
      "Analizar estados financieros y generar reportes ejecutivos.",
      "Monitorear KPIs financieros y de desempeño operativo.",
      "Apoyar en procesos de due diligence y fusiones.",
      "Coordinar con auditoría externa y áreas corporativas."
    ],
    requirements: [
      "Licenciatura en Finanzas, Economía o Contaduría.",
      "4+ años en análisis financiero corporativo.",
      "Dominio avanzado de Excel y Power BI.",
      "Conocimiento de NIIF/IFRS.",
      "Inglés avanzado indispensable."
    ],
    benefits: [
      "Seguro de gastos médicos mayores.",
      "Fondo de ahorro al 13%.",
      "30 días de vacaciones.",
      "Apoyo para posgrado y certificaciones.",
      "Estacionamiento."
    ]
  },
  {
    id: 5,
    title: "Especialista en Ventas B2B",
    company: "Nexus Commercial Group",
    location: "Ciudad de México, CDMX",
    type: "Tiempo Completo",
    salary: "$35,000 – $50,000 + Comisiones",
    experience: "2+ años",
    category: "Ventas",
    urgent: false,
    posted: "Hace 4 días",
    logoLetters: "NC",
    logoBg: "#2E1C3A",
    logoColor: "#B87EC4",
    description: "Desarrolla y gestiona relaciones comerciales con clientes empresariales clave en el sector tecnológico.",
    responsibilities: [
      "Prospectar y desarrollar nuevas cuentas corporativas.",
      "Gestionar el ciclo completo de ventas consultivas.",
      "Elaborar propuestas comerciales personalizadas.",
      "Alcanzar y superar metas mensuales de ventas.",
      "Coordinar con equipos técnicos y de implementación."
    ],
    requirements: [
      "2+ años en ventas B2B o enterprise.",
      "Experiencia con CRM (Salesforce, HubSpot).",
      "Capacidad de presentación a nivel C-suite.",
      "Orientación a resultados y automotivación.",
      "Disponibilidad para viajar (20% del tiempo)."
    ],
    benefits: [
      "Esquema base + comisiones sin tope.",
      "Auto de empresa.",
      "Club de gastos corporativos.",
      "Incentivos de viaje por cumplimiento de metas.",
      "Capacitación comercial certificada."
    ]
  },
  {
    id: 6,
    title: "Business Intelligence Analyst",
    company: "DataDriven MX",
    location: "Remoto",
    type: "Remoto / Flex",
    salary: "$50,000 – $68,000 MXN",
    experience: "3+ años",
    category: "Tecnología",
    urgent: false,
    posted: "Hace 6 días",
    logoLetters: "DD",
    logoBg: "#1C3A3A",
    logoColor: "#7EC4C4",
    description: "Transforma datos complejos en insights accionables para la toma de decisiones estratégicas.",
    responsibilities: [
      "Diseñar y mantener dashboards en Power BI y Tableau.",
      "Extraer y transformar datos con SQL y Python.",
      "Colaborar con áreas de negocio para definir métricas clave.",
      "Documentar procesos y modelos de datos.",
      "Presentar hallazgos a equipos directivos."
    ],
    requirements: [
      "3+ años en Business Intelligence o Data Analytics.",
      "Dominio avanzado de SQL y Power BI.",
      "Experiencia con Python (pandas, numpy).",
      "Pensamiento analítico y atención al detalle.",
      "Experiencia con Azure o AWS Data Services."
    ],
    benefits: [
      "100% remoto.",
      "Equipo de trabajo enviado a domicilio.",
      "Horario flexible.",
      "Presupuesto de home office mensual.",
      "Acceso a plataformas de aprendizaje."
    ]
  },
  {
    id: 7,
    title: "Coordinador de Recursos Humanos",
    company: "PeopleFirst Corp",
    location: "Guadalajara, JAL",
    type: "Tiempo Completo",
    salary: "$30,000 – $42,000 MXN",
    experience: "3+ años",
    category: "Recursos Humanos",
    urgent: false,
    posted: "Hace 7 días",
    logoLetters: "PF",
    logoBg: "#3A1C1C",
    logoColor: "#E87E7E",
    description: "Coordina procesos de atracción, desarrollo y retención de talento para una empresa en crecimiento.",
    responsibilities: [
      "Gestionar procesos de reclutamiento y selección de personal.",
      "Coordinar onboarding y programas de inducción.",
      "Administrar evaluaciones de desempeño y planes de desarrollo.",
      "Apoyar en clima organizacional e iniciativas de cultura.",
      "Gestionar relaciones laborales y cumplimiento normativo."
    ],
    requirements: [
      "Licenciatura en Psicología, Administración o afín.",
      "3+ años en gestión de recursos humanos.",
      "Conocimiento de Ley Federal del Trabajo.",
      "Experiencia con ATS y sistemas HRIS.",
      "Habilidades de comunicación y empatía."
    ],
    benefits: [
      "Seguro de vida y gastos médicos.",
      "Caja de ahorro.",
      "Programa de bienestar corporativo.",
      "Viernes con salida temprana.",
      "Descuentos en tiendas asociadas."
    ]
  },
  {
    id: 8,
    title: "Product Manager – Fintech",
    company: "Kapital Digital",
    location: "Ciudad de México, CDMX",
    type: "Tiempo Completo",
    salary: "$70,000 – $95,000 MXN",
    experience: "5+ años",
    category: "Tecnología",
    urgent: true,
    posted: "Hoy",
    logoLetters: "KD",
    logoBg: "#1C2E3A",
    logoColor: "#7EA8C4",
    description: "Lidera la estrategia y roadmap de productos fintech innovadores que transforman el acceso al crédito en México.",
    responsibilities: [
      "Definir y ejecutar la visión y roadmap del producto.",
      "Trabajar de cerca con diseño, ingeniería y negocio.",
      "Priorizar features basado en datos y feedback de usuarios.",
      "Gestionar el ciclo de vida completo del producto.",
      "Coordinar con regulación y cumplimiento normativo fintech."
    ],
    requirements: [
      "5+ años como Product Manager en entornos tecnológicos.",
      "Experiencia en fintech, pagos o servicios financieros.",
      "Dominio de metodologías ágiles (Scrum, Kanban).",
      "Capacidad analítica y toma de decisiones basada en datos.",
      "Inglés avanzado."
    ],
    benefits: [
      "Salario top del mercado.",
      "Equity / opciones de acciones.",
      "Seguro de gastos médicos mayores premium.",
      "30 días de vacaciones desde el primer año.",
      "Presupuesto de desarrollo profesional ilimitado."
    ]
  }
];

const HERO_TAGS = ["React Developer", "UX Designer", "Product Manager", "Data Analyst", "Marketing", "Finanzas", "Remoto"];


/* ============================================================
   [2] STATE — Estado global de la aplicación
============================================================ */
const AppState = {
  activeFilter: "all",
  searchQuery: "",
  currentJobId: null,
};


/* ============================================================
   [3] MODULE: Navbar
============================================================ */
const NavbarModule = (() => {
  const navbar = document.getElementById("navbar");

  function init() {
    window.addEventListener("scroll", onScroll);
  }

  function onScroll() {
    if (window.scrollY > 20) {
      navbar.style.boxShadow = "0 2px 20px rgba(28,43,58,0.12)";
    } else {
      navbar.style.boxShadow = "none";
    }
  }

  return { init };
})();


/* ============================================================
   [4] MODULE: Hero Tags
============================================================ */
const HeroTagsModule = (() => {
  function init() {
    const container = document.getElementById("hero-tags");
    if (!container) return;

    HERO_TAGS.forEach(tag => {
      const btn = document.createElement("button");
      btn.className = "hero__tag";
      btn.textContent = tag;
      btn.addEventListener("click", () => {
        document.getElementById("search-input").value = tag;
        filterJobs();
        document.getElementById("jobs-section").scrollIntoView({ behavior: "smooth", block: "start" });
      });
      container.appendChild(btn);
    });
  }

  return { init };
})();


/* ============================================================
   [5] MODULE: Job Cards Renderer
============================================================ */
const JobCardsModule = (() => {
  function renderCard(job) {
    const card = document.createElement("div");
    card.className = `job-card${job.urgent ? " job-card--urgent" : ""}`;
    card.setAttribute("role", "button");
    card.setAttribute("tabindex", "0");
    card.setAttribute("aria-label", `Ver vacante: ${job.title}`);

    card.innerHTML = `
      <div class="job-card__header">
        <div class="job-card__logo" style="background:${job.logoBg};color:${job.logoColor};">${job.logoLetters}</div>
        <div class="job-card__badges">
          ${job.urgent ? '<span class="badge badge--urgent">🔥 Urgente</span>' : ""}
          <span class="badge badge--category">${job.category}</span>
        </div>
      </div>
      <h3 class="job-card__title">${job.title}</h3>
      <p class="job-card__company">${job.company}</p>
      <div class="job-card__details">
        <div class="job-card__detail">
          <span class="detail-icon">📍</span>
          <span>${job.location}</span>
        </div>
        <div class="job-card__detail">
          <span class="detail-icon">⏱</span>
          <span>${job.type}</span>
        </div>
        <div class="job-card__salary">
          <span>💰</span> ${job.salary}
        </div>
        <div class="job-card__detail">
          <span class="detail-icon">🎓</span>
          <span>${job.experience}</span>
        </div>
      </div>
      <p class="job-card__desc">${job.description}</p>
      <div class="job-card__footer">
        <span class="job-card__time">${job.posted}</span>
        <span class="job-card__cta">Ver detalles →</span>
      </div>
    `;

    card.addEventListener("click", () => JobDetailModalModule.open(job.id));
    card.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") JobDetailModalModule.open(job.id); });

    return card;
  }

  function render(jobs) {
    const grid = document.getElementById("jobs-grid");
    grid.innerHTML = "";

    if (jobs.length === 0) {
      grid.innerHTML = `
        <div class="no-results">
          <div class="no-results__icon">🔍</div>
          <h3>Sin resultados</h3>
          <p>Intenta con otros filtros o términos de búsqueda.</p>
        </div>`;
      return;
    }

    jobs.forEach(job => grid.appendChild(renderCard(job)));

    // Update count
    document.getElementById("results-count").textContent =
      `Mostrando ${jobs.length} ${jobs.length === 1 ? "vacante" : "vacantes"}`;
  }

  return { render };
})();


/* ============================================================
   [6] MODULE: Filter Pills
============================================================ */
const FilterPillsModule = (() => {
  function init() {
    const pills = document.querySelectorAll("[data-filter]");
    pills.forEach(pill => {
      pill.addEventListener("click", () => {
        pills.forEach(p => p.classList.remove("pill--active"));
        pill.classList.add("pill--active");
        AppState.activeFilter = pill.dataset.filter;
        applyFilters();
      });
    });
  }

  return { init };
})();


/* ============================================================
   [7] MODULE: Search & Filter Logic
============================================================ */
function applyFilters() {
  const query = AppState.searchQuery.toLowerCase().trim();
  const category = AppState.activeFilter;
  const location = document.getElementById("filter-location").value;

  let results = JOBS_DATA.filter(job => {
    const matchCategory = category === "all" || job.category === category;
    const matchLocation = !location || job.location.includes(location);
    const matchQuery = !query ||
      job.title.toLowerCase().includes(query) ||
      job.company.toLowerCase().includes(query) ||
      job.category.toLowerCase().includes(query) ||
      job.description.toLowerCase().includes(query);

    return matchCategory && matchLocation && matchQuery;
  });

  JobCardsModule.render(results);
}

// Global function called by HTML onclick
function filterJobs() {
  AppState.searchQuery = document.getElementById("search-input").value;
  applyFilters();
}

// Live search on input
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("search-input").addEventListener("input", () => {
    AppState.searchQuery = document.getElementById("search-input").value;
    applyFilters();
  });
});


/* ============================================================
   [8] MODULE: Job Detail Modal
============================================================ */
const JobDetailModalModule = (() => {
  const overlay = document.getElementById("job-modal");

  function open(jobId) {
    const job = JOBS_DATA.find(j => j.id === jobId);
    if (!job) return;
    AppState.currentJobId = jobId;
    populateModal(job);
    overlay.classList.add("is-open");
    document.body.style.overflow = "hidden";
  }

  function close() {
    overlay.classList.remove("is-open");
    document.body.style.overflow = "";
  }

  function populateModal(job) {
    // Logo
    const logo = document.getElementById("modal-logo");
    logo.style.background = job.logoBg;
    logo.style.color = job.logoColor;
    logo.textContent = job.logoLetters;

    // Tags
    document.getElementById("modal-tags-row").innerHTML = `
      ${job.urgent ? '<span class="badge badge--urgent">🔥 Urgente</span>' : ""}
      <span class="badge badge--category">${job.category}</span>
    `;

    // Title & company
    document.getElementById("modal-title").textContent = job.title;
    document.getElementById("modal-company").textContent = job.company;

    // Info grid
    document.getElementById("modal-info-grid").innerHTML = `
      <div class="modal__info-item">
        <span class="modal__info-icon">📍</span>
        <div class="modal__info-content">
          <span class="modal__info-label">Ubicación</span>
          <span class="modal__info-value">${job.location}</span>
        </div>
      </div>
      <div class="modal__info-item">
        <span class="modal__info-icon">⏱</span>
        <div class="modal__info-content">
          <span class="modal__info-label">Modalidad</span>
          <span class="modal__info-value">${job.type}</span>
        </div>
      </div>
      <div class="modal__info-item">
        <span class="modal__info-icon">💰</span>
        <div class="modal__info-content">
          <span class="modal__info-label">Salario mensual</span>
          <span class="modal__info-value">${job.salary}</span>
        </div>
      </div>
      <div class="modal__info-item">
        <span class="modal__info-icon">🎓</span>
        <div class="modal__info-content">
          <span class="modal__info-label">Experiencia</span>
          <span class="modal__info-value">${job.experience}</span>
        </div>
      </div>
    `;

    // Body
    const body = document.getElementById("modal-body");
    body.innerHTML = `
      <h3>Descripción del puesto</h3>
      <p>${job.description}</p>

      <h3>Responsabilidades</h3>
      <ul>${job.responsibilities.map(r => `<li>${r}</li>`).join("")}</ul>

      <h3>Requisitos</h3>
      <ul>${job.requirements.map(r => `<li>${r}</li>`).join("")}</ul>

      <h3>Beneficios</h3>
      <ul>${job.benefits.map(b => `<li>${b}</li>`).join("")}</ul>
    `;
  }

  function init() {
    // Close buttons
    document.getElementById("modal-close").addEventListener("click", close);
    document.getElementById("modal-close-2").addEventListener("click", close);
    overlay.addEventListener("click", e => { if (e.target === overlay) close(); });

    // Apply button → open apply form
    document.getElementById("apply-btn").addEventListener("click", () => {
      close();
      ApplyFormModule.open(AppState.currentJobId);
    });

    // Keyboard close
    document.addEventListener("keydown", e => {
      if (e.key === "Escape" && overlay.classList.contains("is-open")) close();
    });
  }

  return { init, open, close };
})();


/* ============================================================
   [9] MODULE: Apply Form Modal
============================================================ */
const ApplyFormModule = (() => {
  const overlay = document.getElementById("apply-modal");

  function open(jobId) {
    const job = JOBS_DATA.find(j => j.id === jobId);
    if (!job) return;
    AppState.currentJobId = jobId;

    document.getElementById("apply-modal-title").textContent = `Aplicar: ${job.title}`;
    document.getElementById("apply-modal-subtitle").textContent = `${job.company} · ${job.location}`;

    // Reset form
    FormValidationModule.resetForm();
    DropzoneModule.reset();
    showForm();

    overlay.classList.add("is-open");
    document.body.style.overflow = "hidden";
  }

  function close() {
    overlay.classList.remove("is-open");
    document.body.style.overflow = "";
  }

  function showForm() {
    document.getElementById("apply-form").style.display = "flex";
    document.getElementById("form-success").style.display = "none";
  }

  function showSuccess(name, jobTitle) {
    document.getElementById("apply-form").style.display = "none";
    const success = document.getElementById("form-success");
    success.style.display = "block";
    document.getElementById("success-text").textContent =
      `Gracias, ${name}. Tu aplicación para "${jobTitle}" ha sido recibida. Te contactaremos pronto a tu correo.`;
  }

  function init() {
    document.getElementById("apply-modal-close").addEventListener("click", close);
    document.getElementById("success-close").addEventListener("click", close);
    overlay.addEventListener("click", e => { if (e.target === overlay) close(); });

    document.addEventListener("keydown", e => {
      if (e.key === "Escape" && overlay.classList.contains("is-open")) close();
    });
  }

  return { init, open, close, showSuccess };
})();


/* ============================================================
   [10] MODULE: Dropzone (CV upload)
============================================================ */
const DropzoneModule = (() => {
  let selectedFile = null;
  const dropzone = document.getElementById("dropzone");
  const fileInput = document.getElementById("cv-input");
  const preview = document.getElementById("file-preview");

  function init() {
    // Click on dropzone opens file picker
    dropzone.addEventListener("click", e => {
      if (!e.target.classList.contains("dropzone__input")) fileInput.click();
    });

    fileInput.addEventListener("change", () => {
      if (fileInput.files[0]) handleFile(fileInput.files[0]);
    });

    // Drag & drop
    dropzone.addEventListener("dragover", e => {
      e.preventDefault();
      dropzone.classList.add("drag-over");
    });

    dropzone.addEventListener("dragleave", () => dropzone.classList.remove("drag-over"));

    dropzone.addEventListener("drop", e => {
      e.preventDefault();
      dropzone.classList.remove("drag-over");
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    });
  }

  function handleFile(file) {
    const allowed = ["application/pdf", "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];

    if (!allowed.includes(file.type)) {
      showError("Solo se permiten archivos PDF, DOC o DOCX.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      showError("El archivo no debe superar los 5MB.");
      return;
    }

    selectedFile = file;
    clearError();
    showPreview(file);
  }

  function showPreview(file) {
    dropzone.style.display = "none";
    const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
    preview.style.display = "flex";
    preview.innerHTML = `
      <div class="file-preview__icon">📄</div>
      <div class="file-preview__name">${file.name}</div>
      <div class="file-preview__size">${sizeMB} MB</div>
      <button class="file-preview__remove" type="button" aria-label="Quitar archivo">✕</button>
    `;
    preview.querySelector(".file-preview__remove").addEventListener("click", reset);
  }

  function reset() {
    selectedFile = null;
    fileInput.value = "";
    dropzone.style.display = "";
    preview.style.display = "none";
    preview.innerHTML = "";
    clearError();
  }

  function showError(msg) {
    document.getElementById("error-cv").textContent = msg;
  }

  function clearError() {
    document.getElementById("error-cv").textContent = "";
  }

  function getFile() { return selectedFile; }

  return { init, reset, getFile, showError };
})();


/* ============================================================
   [11] MODULE: Form Validation
============================================================ */
const FormValidationModule = (() => {
  function resetForm() {
    const form = document.getElementById("apply-form");
    form.reset();
    document.querySelectorAll(".form-error").forEach(el => el.textContent = "");
    document.querySelectorAll(".form-input, .form-textarea").forEach(el => el.classList.remove("error"));
  }

  function validate() {
    let valid = true;

    // Name
    const name = document.getElementById("field-name");
    if (!name.value.trim() || name.value.trim().length < 3) {
      setError("error-name", "Ingresa tu nombre completo.", name);
      valid = false;
    } else clearError("error-name", name);

    // Age
    const age = document.getElementById("field-age");
    const ageVal = parseInt(age.value);
    if (!age.value || isNaN(ageVal) || ageVal < 18 || ageVal > 70) {
      setError("error-age", "Ingresa una edad válida (18–70).", age);
      valid = false;
    } else clearError("error-age", age);

    // Email
    const email = document.getElementById("field-email");
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.value.trim() || !emailRegex.test(email.value.trim())) {
      setError("error-email", "Ingresa un correo electrónico válido.", email);
      valid = false;
    } else clearError("error-email", email);

    // CV
    if (!DropzoneModule.getFile()) {
      DropzoneModule.showError("Por favor adjunta tu CV.");
      valid = false;
    }

    return valid;
  }

  function setError(errorId, msg, input) {
    document.getElementById(errorId).textContent = msg;
    if (input) input.classList.add("error");
  }

  function clearError(errorId, input) {
    document.getElementById(errorId).textContent = "";
    if (input) input.classList.remove("error");
  }

  return { validate, resetForm };
})();


/* ============================================================
   [12] MODULE: Form Submit
============================================================ */
const FormSubmitModule = (() => {
  function init() {
    document.getElementById("apply-form").addEventListener("submit", handleSubmit);
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (!FormValidationModule.validate()) return;

    const submitBtn = e.target.querySelector('[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = "Enviando...";

    // Simulate API call
    setTimeout(() => {
      const name = document.getElementById("field-name").value.trim();
      const job = JOBS_DATA.find(j => j.id === AppState.currentJobId);
      ApplyFormModule.showSuccess(name, job ? job.title : "la vacante");
      submitBtn.disabled = false;
      submitBtn.textContent = "Enviar Aplicación";
    }, 1500);
  }

  return { init };
})();


/* ============================================================
   [13] INIT — Inicialización
============================================================ */
document.addEventListener("DOMContentLoaded", () => {
  NavbarModule.init();
  HeroTagsModule.init();
  FilterPillsModule.init();
  JobDetailModalModule.init();
  ApplyFormModule.init();
  DropzoneModule.init();
  FormSubmitModule.init();

  // Initial render
  JobCardsModule.render(JOBS_DATA);
});
