// Referencias a elementos del DOM
const postulantesContainer = document.getElementById('postulantesContainer');
const entrevistasContainer = document.getElementById('entrevistasContainer');
const postulantesColumn = document.getElementById('postulantesColumn');
const entrevistasColumn = document.getElementById('entrevistasColumn');
const cvModal = document.getElementById('cvModal');
const cvContent = document.getElementById('cvContent');
const closeModal = document.querySelector('.close');

let draggedElement = null;
let draggedData = null;

// Cargar aplicaciones desde localStorage
function loadApplications() {
    const applications = JSON.parse(localStorage.getItem('jobApplications') || '[]');
    const entrevistas = JSON.parse(localStorage.getItem('entrevistas') || '[]');
    
    // Limpiar contenedores
    postulantesContainer.innerHTML = '';
    entrevistasContainer.innerHTML = '';
    
    // Separar aplicaciones entre postulantes y entrevistas
    const postulantesIds = new Set(entrevistas.map(e => e.id));
    
    applications.forEach(app => {
        if (postulantesIds.has(app.id)) {
            createCard(app, entrevistasContainer, true);
        } else {
            createCard(app, postulantesContainer, false);
        }
    });
    
    // Actualizar estado de columnas vacías
    updateEmptyState();
}

// Crear tarjeta de postulante
function createCard(data, container, isInEntrevistas) {
    const card = document.createElement('div');
    card.className = 'card';
    card.draggable = true;
    card.dataset.id = data.id;
    
    card.innerHTML = `
        <div class="card-header">
            <div>
                <div class="card-name">${data.nombre}</div>
                <div class="card-age">Edad: ${data.edad} años</div>
            </div>
            <div class="card-actions">
                <button class="btn-view-cv" onclick="viewCV('${data.id}')">Ver CV</button>
                <button class="btn-delete" onclick="deleteCard('${data.id}')">×</button>
            </div>
        </div>
        <div class="card-email">📧 ${data.correo}</div>
        <div class="card-puesto">Puesto: ${data.puesto}</div>
    `;
    
    // Event listeners para drag and drop
    card.addEventListener('dragstart', handleDragStart);
    card.addEventListener('dragend', handleDragEnd);
    card.addEventListener('dragover', handleDragOver);
    card.addEventListener('drop', handleDrop);
    
    container.appendChild(card);
}

// Manejar inicio del arrastre
function handleDragStart(e) {
    draggedElement = this;
    draggedData = {
        id: this.dataset.id,
        element: this
    };
    
    this.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', this.innerHTML);
}

// Manejar fin del arrastre
function handleDragEnd(e) {
    this.classList.remove('dragging');
    
    // Remover clases de drag-over de todos los contenedores
    document.querySelectorAll('.column, .cards-container').forEach(el => {
        el.classList.remove('drag-over');
    });
}

// Manejar arrastre sobre elemento
function handleDragOver(e) {
    if (e.preventDefault) {
        e.preventDefault();
    }
    e.dataTransfer.dropEffect = 'move';
    return false;
}

// Manejar soltar elemento
function handleDrop(e) {
    if (e.stopPropagation) {
        e.stopPropagation();
    }
    
    if (draggedElement !== this) {
        const container = this.closest('.cards-container');
        const targetContainer = e.currentTarget.closest('.cards-container');
        
        if (container && targetContainer && container !== targetContainer) {
            // Mover a otra columna
            targetContainer.appendChild(draggedElement);
            updateApplicationStatus(draggedData.id, targetContainer.id === 'entrevistasContainer');
        } else if (container) {
            // Reordenar dentro de la misma columna
            const afterElement = getDragAfterElement(container, e.clientY);
            if (afterElement == null) {
                container.appendChild(draggedElement);
            } else {
                container.insertBefore(draggedElement, afterElement);
            }
        }
    }
    
    return false;
}

// Obtener elemento después del cual insertar
function getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll('.card:not(.dragging)')];
    
    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        
        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child };
        } else {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}

// Event listeners para las columnas (drag over)
[postulantesContainer, entrevistasContainer].forEach(container => {
    container.addEventListener('dragover', (e) => {
        e.preventDefault();
        container.classList.add('drag-over');
        container.closest('.column').classList.add('drag-over');
    });
    
    container.addEventListener('dragleave', (e) => {
        container.classList.remove('drag-over');
        container.closest('.column').classList.remove('drag-over');
    });
    
    container.addEventListener('drop', (e) => {
        e.preventDefault();
        container.classList.remove('drag-over');
        container.closest('.column').classList.remove('drag-over');
        
        if (draggedElement) {
            const isEntrevistas = container.id === 'entrevistasContainer';
            container.appendChild(draggedElement);
            updateApplicationStatus(draggedData.id, isEntrevistas);
            updateEmptyState();
        }
    });
});

// Actualizar estado de la aplicación
function updateApplicationStatus(id, isInEntrevistas) {
    let entrevistas = JSON.parse(localStorage.getItem('entrevistas') || '[]');
    
    if (isInEntrevistas) {
        // Agregar a entrevistas si no está
        if (!entrevistas.find(e => e.id === id)) {
            const app = JSON.parse(localStorage.getItem('jobApplications') || '[]')
                .find(a => a.id === id);
            if (app) {
                entrevistas.push({ id: id, fecha: new Date().toISOString() });
            }
        }
    } else {
        // Remover de entrevistas
        entrevistas = entrevistas.filter(e => e.id !== id);
    }
    
    localStorage.setItem('entrevistas', JSON.stringify(entrevistas));
}

// Ver CV
function viewCV(id) {
    const applications = JSON.parse(localStorage.getItem('jobApplications') || '[]');
    const app = applications.find(a => a.id === id);
    
    if (app) {
        cvContent.textContent = app.cv || 'No hay CV disponible';
        cvModal.style.display = 'block';
    }
}

// Eliminar tarjeta
function deleteCard(id) {
    if (confirm('¿Estás seguro de eliminar esta aplicación?')) {
        let applications = JSON.parse(localStorage.getItem('jobApplications') || '[]');
        applications = applications.filter(a => a.id !== id);
        localStorage.setItem('jobApplications', JSON.stringify(applications));
        
        let entrevistas = JSON.parse(localStorage.getItem('entrevistas') || '[]');
        entrevistas = entrevistas.filter(e => e.id !== id);
        localStorage.setItem('entrevistas', JSON.stringify(entrevistas));
        
        loadApplications();
    }
}

// Cerrar modal
closeModal.addEventListener('click', () => {
    cvModal.style.display = 'none';
});

window.addEventListener('click', (e) => {
    if (e.target === cvModal) {
        cvModal.style.display = 'none';
    }
});

// Actualizar estado de columnas vacías
function updateEmptyState() {
    if (postulantesContainer.children.length === 0) {
        postulantesContainer.innerHTML = '<div class="empty-message">No hay postulantes</div>';
    }
    
    if (entrevistasContainer.children.length === 0) {
        entrevistasContainer.innerHTML = '<div class="empty-message">Arrastra postulantes aquí</div>';
    }
}

// Cargar aplicaciones al iniciar
loadApplications();

// Actualizar cada 2 segundos para detectar nuevas aplicaciones
setInterval(loadApplications, 2000);
