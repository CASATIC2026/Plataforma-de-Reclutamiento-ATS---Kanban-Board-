/* ============================================================
   TALENTBRIDGE — app.js
   Conectado al backend RecruitmentAPI (.NET 8 + PostgreSQL)

   Módulos:
   [1] API — Fetch live data from /api/vacantes
   [2] DATA MAP — Backend DTO → UI job object
   [3] STATE — App state
   [4] MODULE: Navbar
   [5] MODULE: Hero Tags (from live requisitos)
   [6] MODULE: Job Cards Renderer
   [7] MODULE: Filter Pills (by tipoContrato)
   [8] MODULE: Search & Filter Logic
   [9] MODULE: Job Detail Modal
   [10] MODULE: Apply Form Modal (UI only — backend coming soon)
   [11] MODULE: Dropzone (CV upload)
   [12] MODULE: Form Validation
   [13] MODULE: Form Submit (UI simulation)
   [14] INIT
============================================================ */


/* ============================================================
   [1] API — Live data from backend
============================================================ */
// Direct backend URL — no Vite proxy needed when opening portal as a static file
const API_BASE = 'http://localhost:5223/api';

async function fetchVacantesFromAPI() {
    const res = await fetch(`${API_BASE}/vacantes`);
    if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);
    return res.json();
}


/* ============================================================
   [2] DATA MAP — VacanteResponseDTO → UI job object
   Backend fields: id, titulo, descripcion, ubicacion,
   tipoContrato, salarioMin, salarioMax, estaActiva,
   createdAt, updatedAt, requisitos[]
============================================================ */

// Deterministic color palette based on vacante ID
const LOGO_COLORS = [
    { bg: '#1C3A5A', text: '#7EB8E8' },
    { bg: '#2E3A5A', text: '#9BB5E0' },
    { bg: '#3A2E1C', text: '#E8B87E' },
    { bg: '#1C3A2E', text: '#7EC4A8' },
    { bg: '#2E1C3A', text: '#B87EC4' },
    { bg: '#1C3A3A', text: '#7EC4C4' },
    { bg: '#3A1C1C', text: '#E87E7E' },
    { bg: '#1C2E3A', text: '#7EA8C4' },
    { bg: '#3A3A1C', text: '#C4C47E' },
    { bg: '#2E1C2E', text: '#C47EC4' },
];

function getColorForId(id) {
    // Simple deterministic hash from UUID string
    const hash = id.replace(/-/g, '').split('')
        .reduce((acc, c) => acc + c.charCodeAt(0), 0);
    return LOGO_COLORS[hash % LOGO_COLORS.length];
}

function getLogoLetters(titulo) {
    const words = titulo.trim().split(/\s+/).filter(Boolean);
    if (words.length >= 2) return (words[0][0] + words[1][0]).toUpperCase();
    return titulo.substring(0, 2).toUpperCase();
}

function formatSalary(min, max) {
    if (min && max) {
        return `$${Number(min).toLocaleString('es-MX')} – $${Number(max).toLocaleString('es-MX')} MXN`;
    }
    if (min) return `Desde $${Number(min).toLocaleString('es-MX')} MXN`;
    if (max) return `Hasta $${Number(max).toLocaleString('es-MX')} MXN`;
    return 'Salario a convenir';
}

function formatRelativeDate(isoString) {
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now - date;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Hoy';
    if (diffDays === 1) return 'Hace 1 día';
    if (diffDays < 7) return `Hace ${diffDays} días`;
    if (diffDays < 14) return 'Hace 1 semana';
    return `Hace ${Math.floor(diffDays / 7)} semanas`;
}

function isRecent(isoString) {
    const diffMs = new Date() - new Date(isoString);
    return diffMs < 2 * 24 * 60 * 60 * 1000; // less than 2 days old
}

function mapVacante(v) {
    const color = getColorForId(v.id);
    return {
        id: v.id,
        title: v.titulo,
        company: 'Empresa Privada',           // not in schema yet
        location: v.ubicacion,
        type: v.tipoContrato,
        salary: formatSalary(v.salarioMin, v.salarioMax),
        experience: v.requisitos.length > 0
            ? `${v.requisitos.length} requisito${v.requisitos.length !== 1 ? 's' : ''}`
            : 'Ver detalles',
        category: v.tipoContrato,             // used as display tag
        urgent: isRecent(v.createdAt),
        posted: formatRelativeDate(v.createdAt),
        logoLetters: getLogoLetters(v.titulo),
        logoBg: color.bg,
        logoColor: color.text,
        description: v.descripcion,
        requirements: v.requisitos,           // list of strings from backend
        responsibilities: [],                 // not in schema yet
        benefits: [],                         // not in schema yet
        estaActiva: v.estaActiva,
    };
}


/* ============================================================
   [3] STATE — App state
============================================================ */
const AppState = {
    allJobs: [],           // full mapped list from API
    filteredJobs: [],      // currently displayed
    activeFilter: 'all',
    searchQuery: '',
    locationFilter: '',
    currentJobId: null,
    loaded: false,
};


/* ============================================================
   [4] MODULE: Navbar
============================================================ */
const NavbarModule = (() => {
    const navbar = document.getElementById('navbar');

    function init() {
        window.addEventListener('scroll', onScroll);
    }

    function onScroll() {
        navbar.style.boxShadow = window.scrollY > 20
            ? '0 2px 20px rgba(28,43,58,0.12)'
            : 'none';
    }

    return { init };
})();


/* ============================================================
   [5] MODULE: Hero Tags (built from live requisitos)
============================================================ */
const HeroTagsModule = (() => {
    function init(jobs) {
        const container = document.getElementById('hero-tags');
        if (!container) return;

        // Collect all requisitos, pick the most frequent ones
        const freq = {};
        jobs.forEach(job => {
            job.requirements.forEach(r => {
                freq[r] = (freq[r] || 0) + 1;
            });
        });

        // Sort by frequency, take top 8
        const topTags = Object.entries(freq)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 8)
            .map(([tag]) => tag);

        // Fallback tags if no requisitos exist yet
        const tags = topTags.length > 0
            ? topTags
            : ['Remoto', 'Tiempo completo', 'Freelance', 'Junior', 'Senior'];

        container.innerHTML = '';
        tags.forEach(tag => {
            const btn = document.createElement('button');
            btn.className = 'hero__tag';
            btn.textContent = tag;
            btn.addEventListener('click', () => {
                document.getElementById('search-input').value = tag;
                AppState.searchQuery = tag;
                applyFilters();
                document.getElementById('jobs-section')
                    .scrollIntoView({ behavior: 'smooth', block: 'start' });
            });
            container.appendChild(btn);
        });
    }

    return { init };
})();


/* ============================================================
   [6] MODULE: Job Cards Renderer
============================================================ */
const JobCardsModule = (() => {
    function renderCard(job) {
        const card = document.createElement('div');
        card.className = `job-card${job.urgent ? ' job-card--urgent' : ''}`;
        card.setAttribute('role', 'button');
        card.setAttribute('tabindex', '0');
        card.setAttribute('aria-label', `Ver vacante: ${job.title}`);

        card.innerHTML = `
      <div class="job-card__header">
        <div class="job-card__logo" style="background:${job.logoBg};color:${job.logoColor};">${job.logoLetters}</div>
        <div class="job-card__badges">
          ${job.urgent ? '<span class="badge badge--urgent">🔥 Nueva</span>' : ''}
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
          <span class="detail-icon">📋</span>
          <span>${job.experience}</span>
        </div>
      </div>
      <p class="job-card__desc">${job.description}</p>
      <div class="job-card__footer">
        <span class="job-card__time">${job.posted}</span>
        <span class="job-card__cta">Ver detalles →</span>
      </div>
    `;

        card.addEventListener('click', () => JobDetailModalModule.open(job.id));
        card.addEventListener('keydown', e => {
            if (e.key === 'Enter' || e.key === ' ') JobDetailModalModule.open(job.id);
        });

        return card;
    }

    function render(jobs) {
        const grid = document.getElementById('jobs-grid');
        grid.innerHTML = '';

        if (jobs.length === 0) {
            grid.innerHTML = `
        <div class="no-results">
          <div class="no-results__icon">🔍</div>
          <h3>Sin resultados</h3>
          <p>Intenta con otros filtros o términos de búsqueda.</p>
        </div>`;
        } else {
            jobs.forEach(job => grid.appendChild(renderCard(job)));
        }

        document.getElementById('results-count').textContent =
            `Mostrando ${jobs.length} ${jobs.length === 1 ? 'vacante' : 'vacantes'}`;
    }

    function showLoading() {
        const grid = document.getElementById('jobs-grid');
        grid.innerHTML = `
      <div class="loading-state" style="grid-column:1/-1;">
        <div class="loading-spinner"></div>
        <p>Cargando vacantes...</p>
      </div>`;
        document.getElementById('results-count').textContent = 'Cargando...';
    }

    function showError(message) {
        const grid = document.getElementById('jobs-grid');
        grid.innerHTML = `
      <div class="error-state" style="grid-column:1/-1;">
        <div class="error-state__icon">⚠️</div>
        <h3>No se pudo conectar al servidor</h3>
        <p>${message}</p>
        <button class="btn btn--accent" onclick="loadVacantes()">Reintentar</button>
      </div>`;
        document.getElementById('results-count').textContent = 'Error al cargar';
    }

    return { render, showLoading, showError };
})();


/* ============================================================
   [7] MODULE: Filter Pills (filters by tipoContrato)
============================================================ */
const FilterPillsModule = (() => {
    function init() {
        const pills = document.querySelectorAll('[data-filter]');
        pills.forEach(pill => {
            pill.addEventListener('click', () => {
                pills.forEach(p => p.classList.remove('pill--active'));
                pill.classList.add('pill--active');
                AppState.activeFilter = pill.dataset.filter;
                applyFilters();
            });
        });
    }

    return { init };
})();


/* ============================================================
   [8] MODULE: Search & Filter Logic
============================================================ */
function applyFilters() {
    const query = AppState.searchQuery.toLowerCase().trim();
    const contractFilter = AppState.activeFilter;
    const locationFilter = document.getElementById('filter-location').value;

    const results = AppState.allJobs.filter(job => {
        // Contract type pill filter
        const matchContract = contractFilter === 'all'
            || job.type.toLowerCase().includes(contractFilter.toLowerCase());

        // Location dropdown filter
        const matchLocation = !locationFilter
            || job.location.toLowerCase().includes(locationFilter.toLowerCase());

        // Text search: title, description, location, type, requirements
        const matchQuery = !query
            || job.title.toLowerCase().includes(query)
            || job.description.toLowerCase().includes(query)
            || job.location.toLowerCase().includes(query)
            || job.type.toLowerCase().includes(query)
            || job.requirements.some(r => r.toLowerCase().includes(query));

        return matchContract && matchLocation && matchQuery;
    });

    AppState.filteredJobs = results;
    JobCardsModule.render(results);
}

// Global: called by HTML onclick on search button
function filterJobs() {
    AppState.searchQuery = document.getElementById('search-input').value;
    applyFilters();
}


/* ============================================================
   [9] MODULE: Job Detail Modal
============================================================ */
const JobDetailModalModule = (() => {
    const overlay = document.getElementById('job-modal');

    function open(jobId) {
        const job = AppState.allJobs.find(j => j.id === jobId);
        if (!job) return;
        AppState.currentJobId = jobId;
        populateModal(job);
        overlay.classList.add('is-open');
        document.body.style.overflow = 'hidden';
    }

    function close() {
        overlay.classList.remove('is-open');
        document.body.style.overflow = '';
    }

    function populateModal(job) {
        // Logo
        const logo = document.getElementById('modal-logo');
        logo.style.background = job.logoBg;
        logo.style.color = job.logoColor;
        logo.textContent = job.logoLetters;

        // Badges row
        document.getElementById('modal-tags-row').innerHTML = `
      ${job.urgent ? '<span class="badge badge--urgent">🔥 Nueva</span>' : ''}
      <span class="badge badge--category">${job.category}</span>
    `;

        // Title & company
        document.getElementById('modal-title').textContent = job.title;
        document.getElementById('modal-company').textContent = job.company;

        // Info grid
        document.getElementById('modal-info-grid').innerHTML = `
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
        <span class="modal__info-icon">📋</span>
        <div class="modal__info-content">
          <span class="modal__info-label">Publicado</span>
          <span class="modal__info-value">${job.posted}</span>
        </div>
      </div>
    `;

        // Body — show what we have from the backend
        const reqList = job.requirements.length > 0
            ? `<h3>Requisitos</h3>
         <ul>${job.requirements.map(r => `<li>${r}</li>`).join('')}</ul>`
            : '';

        // Responsibilities and benefits are not in schema yet — placeholder note
        const comingSoon = `
      <p style="font-size:0.82rem;color:var(--clr-muted);margin-top:18px;
         padding:10px 14px;background:var(--clr-surface-2);
         border-radius:var(--radius-sm);border-left:3px solid var(--clr-border);">
        ℹ️ Responsabilidades y beneficios estarán disponibles en próximas versiones del sistema.
      </p>`;

        document.getElementById('modal-body').innerHTML = `
      <h3>Descripción del puesto</h3>
      <p>${job.description}</p>
      ${reqList}
      ${job.responsibilities.length === 0 ? comingSoon : ''}
    `;
    }

    function init() {
        document.getElementById('modal-close').addEventListener('click', close);
        document.getElementById('modal-close-2').addEventListener('click', close);
        overlay.addEventListener('click', e => { if (e.target === overlay) close(); });

        document.getElementById('apply-btn').addEventListener('click', () => {
            close();
            ApplyFormModule.open(AppState.currentJobId);
        });

        document.addEventListener('keydown', e => {
            if (e.key === 'Escape' && overlay.classList.contains('is-open')) close();
        });
    }

    return { init, open, close };
})();


/* ============================================================
   [10] MODULE: Apply Form Modal
   UI only for now — postulación module coming in next step
============================================================ */
const ApplyFormModule = (() => {
    const overlay = document.getElementById('apply-modal');

    function open(jobId) {
        const job = AppState.allJobs.find(j => j.id === jobId);
        if (!job) return;
        AppState.currentJobId = jobId;

        document.getElementById('apply-modal-title').textContent = `Aplicar: ${job.title}`;
        document.getElementById('apply-modal-subtitle').textContent = `${job.location} · ${job.type}`;

        FormValidationModule.resetForm();
        DropzoneModule.reset();
        showForm();

        overlay.classList.add('is-open');
        document.body.style.overflow = 'hidden';
    }

    function close() {
        overlay.classList.remove('is-open');
        document.body.style.overflow = '';
    }

    function showForm() {
        document.getElementById('apply-form').style.display = 'flex';
        document.getElementById('form-success').style.display = 'none';
    }

    function showSuccess(name, jobTitle) {
        document.getElementById('apply-form').style.display = 'none';
        const success = document.getElementById('form-success');
        success.style.display = 'block';
        document.getElementById('success-text').textContent =
            `Gracias, ${name}. Tu aplicación para "${jobTitle}" ha sido recibida. Te contactaremos pronto.`;
    }

    function init() {
        document.getElementById('apply-modal-close').addEventListener('click', close);
        document.getElementById('success-close').addEventListener('click', close);
        overlay.addEventListener('click', e => { if (e.target === overlay) close(); });
        document.addEventListener('keydown', e => {
            if (e.key === 'Escape' && overlay.classList.contains('is-open')) close();
        });
    }

    return { init, open, close, showSuccess };
})();


/* ============================================================
   [11] MODULE: Dropzone (CV upload)
============================================================ */
const DropzoneModule = (() => {
    let selectedFile = null;
    const dropzone = document.getElementById('dropzone');
    const fileInput = document.getElementById('cv-input');
    const preview = document.getElementById('file-preview');

    function init() {
        dropzone.addEventListener('click', e => {
            if (!e.target.classList.contains('dropzone__input')) fileInput.click();
        });

        fileInput.addEventListener('change', () => {
            if (fileInput.files[0]) handleFile(fileInput.files[0]);
        });

        dropzone.addEventListener('dragover', e => {
            e.preventDefault();
            dropzone.classList.add('drag-over');
        });

        dropzone.addEventListener('dragleave', () => dropzone.classList.remove('drag-over'));

        dropzone.addEventListener('drop', e => {
            e.preventDefault();
            dropzone.classList.remove('drag-over');
            const file = e.dataTransfer.files[0];
            if (file) handleFile(file);
        });
    }

    function handleFile(file) {
        const allowed = [
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        ];

        if (!allowed.includes(file.type)) {
            showError('Solo se permiten archivos PDF, DOC o DOCX.');
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            showError('El archivo no debe superar los 5MB.');
            return;
        }

        selectedFile = file;
        clearError();
        showPreview(file);
    }

    function showPreview(file) {
        dropzone.style.display = 'none';
        const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
        preview.style.display = 'flex';
        preview.innerHTML = `
      <div class="file-preview__icon">📄</div>
      <div class="file-preview__name">${file.name}</div>
      <div class="file-preview__size">${sizeMB} MB</div>
      <button class="file-preview__remove" type="button" aria-label="Quitar archivo">✕</button>
    `;
        preview.querySelector('.file-preview__remove').addEventListener('click', reset);
    }

    function reset() {
        selectedFile = null;
        fileInput.value = '';
        dropzone.style.display = '';
        preview.style.display = 'none';
        preview.innerHTML = '';
        clearError();
    }

    function showError(msg) {
        document.getElementById('error-cv').textContent = msg;
    }

    function clearError() {
        document.getElementById('error-cv').textContent = '';
    }

    function getFile() { return selectedFile; }

    return { init, reset, getFile, showError };
})();


/* ============================================================
   [12] MODULE: Form Validation
============================================================ */
const FormValidationModule = (() => {
    function resetForm() {
        document.getElementById('apply-form').reset();
        document.querySelectorAll('.form-error').forEach(el => el.textContent = '');
        document.querySelectorAll('.form-input, .form-textarea').forEach(el => el.classList.remove('error'));
    }

    function validate() {
        let valid = true;

        const name = document.getElementById('field-name');
        if (!name.value.trim() || name.value.trim().length < 3) {
            setError('error-name', 'Ingresa tu nombre completo.', name);
            valid = false;
        } else clearError('error-name', name);

        const age = document.getElementById('field-age');
        const ageVal = parseInt(age.value);
        if (!age.value || isNaN(ageVal) || ageVal < 18 || ageVal > 70) {
            setError('error-age', 'Ingresa una edad válida (18–70).', age);
            valid = false;
        } else clearError('error-age', age);

        const email = document.getElementById('field-email');
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email.value.trim() || !emailRegex.test(email.value.trim())) {
            setError('error-email', 'Ingresa un correo electrónico válido.', email);
            valid = false;
        } else clearError('error-email', email);

        if (!DropzoneModule.getFile()) {
            DropzoneModule.showError('Por favor adjunta tu CV.');
            valid = false;
        }

        return valid;
    }

    function setError(errorId, msg, input) {
        document.getElementById(errorId).textContent = msg;
        if (input) input.classList.add('error');
    }

    function clearError(errorId, input) {
        document.getElementById(errorId).textContent = '';
        if (input) input.classList.remove('error');
    }

    return { validate, resetForm };
})();


/* ============================================================
   [13] MODULE: Form Submit
   Simulates success for now — real postulación backend = next step
============================================================ */
const FormSubmitModule = (() => {
    function init() {
        document.getElementById('apply-form').addEventListener('submit', handleSubmit);
    }

    function handleSubmit(e) {
        e.preventDefault();
        if (!FormValidationModule.validate()) return;

        const submitBtn = e.target.querySelector('[type="submit"]');
        submitBtn.disabled = true;
        submitBtn.textContent = 'Enviando...';

        // UI simulation — replace with real API call when postulación module is ready
        setTimeout(() => {
            const name = document.getElementById('field-name').value.trim();
            const job = AppState.allJobs.find(j => j.id === AppState.currentJobId);
            ApplyFormModule.showSuccess(name, job ? job.title : 'la vacante');
            submitBtn.disabled = false;
            submitBtn.textContent = 'Enviar Aplicación';
        }, 1200);
    }

    return { init };
})();


/* ============================================================
   [14] MAIN LOADER — Fetches vacantes from API then boots UI
============================================================ */
async function loadVacantes() {
    JobCardsModule.showLoading();

    try {
        const rawVacantes = await fetchVacantesFromAPI();

        // Only show active vacantes to candidates
        const activeVacantes = rawVacantes.filter(v => v.estaActiva);
        const jobs = activeVacantes.map(mapVacante);

        AppState.allJobs = jobs;
        AppState.filteredJobs = jobs;
        AppState.loaded = true;

        // Update hero eyebrow with live count
        const eyebrow = document.getElementById('hero-eyebrow');
        if (eyebrow) eyebrow.textContent = `${jobs.length} vacante${jobs.length !== 1 ? 's' : ''} activa${jobs.length !== 1 ? 's' : ''}`;

        // Update hero stat counter
        const statEl = document.getElementById('stat-vacantes');
        if (statEl) statEl.textContent = jobs.length > 0 ? `${jobs.length}` : '0';

        // Show live badge
        const liveBadge = document.getElementById('live-badge');
        if (liveBadge) liveBadge.style.display = 'inline-flex';

        // Populate hero tags from real requisitos
        HeroTagsModule.init(jobs);

        // Render cards
        JobCardsModule.render(jobs);

    } catch (err) {
        console.error('[TalentBridge] API error:', err);
        JobCardsModule.showError(
            'Verifica que el servidor esté corriendo en <code>localhost:5223</code> y vuelve a intentarlo.'
        );

        // Update hero to reflect error state
        const eyebrow = document.getElementById('hero-eyebrow');
        if (eyebrow) eyebrow.textContent = 'Sin conexión al servidor';
        const statEl = document.getElementById('stat-vacantes');
        if (statEl) statEl.textContent = '—';
    }
}


/* ============================================================
   INIT — Boot sequence
============================================================ */
document.addEventListener('DOMContentLoaded', () => {
    // Boot UI modules
    NavbarModule.init();
    FilterPillsModule.init();
    JobDetailModalModule.init();
    ApplyFormModule.init();
    DropzoneModule.init();
    FormSubmitModule.init();

    // Live search on keystroke
    document.getElementById('search-input').addEventListener('input', () => {
        AppState.searchQuery = document.getElementById('search-input').value;
        applyFilters();
    });

    // Load live data from API
    loadVacantes();
});