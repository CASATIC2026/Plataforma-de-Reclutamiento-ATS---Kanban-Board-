// Información de los trabajos
const jobsInfo = {
    doctor: {
        title: "Doctor en Medicina",
        description: "Buscamos un profesional médico con amplia experiencia en atención clínica.",
        requirements: [
            "Título de Doctor en Medicina",
            "Mínimo 5 años de experiencia",
            "Especialización en área clínica",
            "Licencia médica vigente"
        ],
        benefits: [
            "Salario competitivo",
            "Seguro médico",
            "Horario flexible",
            "Desarrollo profesional"
        ]
    },
    ingeniero: {
        title: "Ingeniero Informático",
        description: "Desarrollador de software con experiencia en tecnologías modernas.",
        requirements: [
            "Título en Ingeniería Informática o afín",
            "Experiencia en desarrollo web/móvil",
            "Conocimiento en lenguajes: JavaScript, Python, Java",
            "Mínimo 3 años de experiencia"
        ],
        benefits: [
            "Salario competitivo",
            "Trabajo remoto disponible",
            "Capacitación continua",
            "Ambiente de trabajo dinámico"
        ]
    },
    profesor: {
        title: "Profesorado",
        description: "Docente con pasión por la enseñanza y formación académica.",
        requirements: [
            "Título en Educación o área relacionada",
            "Experiencia docente mínima de 2 años",
            "Habilidades pedagógicas",
            "Disponibilidad para horarios variados"
        ],
        benefits: [
            "Salario competitivo",
            "Vacaciones escolares",
            "Desarrollo profesional",
            "Ambiente académico estimulante"
        ]
    }
};

// Elementos del DOM
const jobCards = document.querySelectorAll('.job-card');
const jobModal = document.getElementById('jobModal');
const formModal = document.getElementById('formModal');
const jobDetails = document.getElementById('jobDetails');
const btnApply = document.getElementById('btnApply');
const applicationForm = document.getElementById('applicationForm');
const successMessage = document.getElementById('successMessage');
const closeButtons = document.querySelectorAll('.close');

let selectedJob = null;

// Event listeners para las tarjetas de trabajo
jobCards.forEach(card => {
    card.addEventListener('click', () => {
        const jobType = card.getAttribute('data-job');
        showJobDetails(jobType);
    });
});

// Mostrar detalles del trabajo
function showJobDetails(jobType) {
    selectedJob = jobType;
    const job = jobsInfo[jobType];
    
    jobDetails.innerHTML = `
        <h2>${job.title}</h2>
        <p style="margin-bottom: 20px; color: #666;">${job.description}</p>
        
        <div class="detail-item">
            <strong>Requisitos:</strong>
            <ul style="margin-top: 10px; padding-left: 20px;">
                ${job.requirements.map(req => `<li>${req}</li>`).join('')}
            </ul>
        </div>
        
        <div class="detail-item" style="margin-top: 15px;">
            <strong>Beneficios:</strong>
            <ul style="margin-top: 10px; padding-left: 20px;">
                ${job.benefits.map(ben => `<li>${ben}</li>`).join('')}
            </ul>
        </div>
    `;
    
    jobModal.style.display = 'block';
}

// Botón aplicar
btnApply.addEventListener('click', () => {
    jobModal.style.display = 'none';
    formModal.style.display = 'block';
});

// Cerrar modales
closeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        jobModal.style.display = 'none';
        formModal.style.display = 'none';
    });
});

// Cerrar al hacer clic fuera del modal
window.addEventListener('click', (e) => {
    if (e.target === jobModal) {
        jobModal.style.display = 'none';
    }
    if (e.target === formModal) {
        formModal.style.display = 'none';
    }
});

// Manejar envío del formulario
applicationForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const formData = {
        nombre: document.getElementById('nombre').value,
        edad: document.getElementById('edad').value,
        correo: document.getElementById('correo').value,
        cv: document.getElementById('cv').value,
        puesto: jobsInfo[selectedJob].title,
        fecha: new Date().toISOString(),
        id: Date.now().toString()
    };
    
    // Guardar en localStorage
    let applications = JSON.parse(localStorage.getItem('jobApplications') || '[]');
    applications.push(formData);
    localStorage.setItem('jobApplications', JSON.stringify(applications));
    
    // Limpiar formulario
    applicationForm.reset();
    
    // Cerrar modal y mostrar mensaje de éxito
    formModal.style.display = 'none';
    successMessage.classList.add('show');
    
    setTimeout(() => {
        successMessage.classList.remove('show');
    }, 3000);
});
