const columnPostulantes = document.getElementById("column-postulantes");
const columnEntrevista = document.getElementById("column-entrevista");
const columnRechazado = document.getElementById("column-rechazado");

const countPostulantes = document.getElementById("count-postulantes");
const countEntrevista = document.getElementById("count-entrevista");
const countRechazado = document.getElementById("count-rechazado");

const cardTemplate = document.getElementById("card-template");

const cvDialog = document.getElementById("cvDialog");
const cvFrame = document.getElementById("cvFrame");
const cvTitle = document.getElementById("cvTitle");
const closeCvDialog = document.getElementById("closeCvDialog");

let draggedCard = null;

function getApplications() {
    try {
        const raw = localStorage.getItem("applications");
        if (!raw) return [];
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
}

function saveApplications(list) {
    localStorage.setItem("applications", JSON.stringify(list));
}

function renderBoard() {
    columnPostulantes.innerHTML = "";
    columnEntrevista.innerHTML = "";
    columnRechazado.innerHTML = "";

    const applications = getApplications().sort((a, b) => a.createdAt - b.createdAt);

    applications.forEach((app) => {
        const card = createCard(app);
        const targetColumn = getColumnElementForStatus(app.status || "postulante");
        targetColumn.appendChild(card);
    });

    updateEmptyHints();
    updateCounts();
}

function getColumnElementForStatus(status) {
    if (status === "entrevista") return columnEntrevista;
    if (status === "rechazado") return columnRechazado;
    return columnPostulantes;
}

function createCard(app) {
    const fragment = cardTemplate.content.cloneNode(true);
    const card = fragment.querySelector(".candidate-card");

    card.dataset.id = app.id;

    const nameEl = card.querySelector(".card-name");
    const ageEl = card.querySelector(".card-age");
    const emailEl = card.querySelector(".card-email");
    const positionEl = card.querySelector(".card-position");
    const viewCvBtn = card.querySelector(".view-cv");

    nameEl.textContent = app.name || "Sin nombre";
    ageEl.textContent = app.age ? `${app.age} años` : "";
    emailEl.textContent = app.email || "";
    positionEl.textContent = app.position || "";

    card.addEventListener("dragstart", (event) => {
        draggedCard = card;
        card.classList.add("dragging");
        event.dataTransfer.effectAllowed = "move";
        event.dataTransfer.setData("text/plain", app.id);
    });

    card.addEventListener("dragend", () => {
        draggedCard = null;
        card.classList.remove("dragging");
        updateEmptyHints();
        updateCounts();
    });

    viewCvBtn.addEventListener("click", () => {
        if (!app.cvDataUrl) {
            alert("Este postulante no tiene CV adjunto.");
            return;
        }
        cvFrame.src = app.cvDataUrl;
        cvTitle.textContent = `CV - ${app.name || "Postulante"}`;
        if (typeof cvDialog.showModal === "function") {
            cvDialog.showModal();
        } else {
            window.open(app.cvDataUrl, "_blank");
        }
    });

    return card;
}

[columnPostulantes, columnEntrevista, columnRechazado].forEach((columnEl) => {
    columnEl.addEventListener("dragover", (event) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = "move";

        columnEl.classList.add("drag-over");

        const afterElement = getDragAfterElement(columnEl, event.clientY);
        if (!draggedCard) return;

        if (afterElement == null) {
            columnEl.appendChild(draggedCard);
        } else {
            columnEl.insertBefore(draggedCard, afterElement);
        }
    });

    columnEl.addEventListener("dragleave", (event) => {
        if (!columnEl.contains(event.relatedTarget)) {
            columnEl.classList.remove("drag-over");
        }
    });

    columnEl.addEventListener("drop", (event) => {
        event.preventDefault();
        columnEl.classList.remove("drag-over");

        const appId = event.dataTransfer.getData("text/plain");
        const applications = getApplications();
        const appIndex = applications.findIndex((a) => a.id === appId);
        if (appIndex === -1) return;

        let status = "postulante";
        if (columnEl === columnEntrevista) status = "entrevista";
        if (columnEl === columnRechazado) status = "rechazado";

        applications[appIndex].status = status;

        const newOrderIds = Array.from(columnEl.querySelectorAll(".candidate-card")).map((c) => c.dataset.id);

        applications.sort((a, b) => {
            const aIndex = newOrderIds.indexOf(a.id);
            const bIndex = newOrderIds.indexOf(b.id);
            if (aIndex === -1 && bIndex === -1) return a.createdAt - b.createdAt;
            if (aIndex === -1) return 1;
            if (bIndex === -1) return -1;
            return aIndex - bIndex;
        });

        saveApplications(applications);
        updateEmptyHints();
        updateCounts();
    });
});

function getDragAfterElement(container, mouseY) {
    const draggableElements = [...container.querySelectorAll(".candidate-card:not(.dragging)")];

    return draggableElements.reduce(
        (closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = mouseY - box.top - box.height / 2;
            if (offset < 0 && offset > closest.offset) {
                return { offset, element: child };
            }
            return closest;
        },
        { offset: Number.NEGATIVE_INFINITY, element: null }
    ).element;
}

function updateCounts() {
    countPostulantes.textContent = columnPostulantes.querySelectorAll(".candidate-card").length;
    countEntrevista.textContent = columnEntrevista.querySelectorAll(".candidate-card").length;
    countRechazado.textContent = columnRechazado.querySelectorAll(".candidate-card").length;
}

function updateEmptyHints() {
    [columnPostulantes, columnEntrevista, columnRechazado].forEach((columnEl) => {
        if (columnEl.children.length === 0) {
            columnEl.classList.add("empty-hint");
        } else {
            columnEl.classList.remove("empty-hint");
        }
    });
}

closeCvDialog.addEventListener("click", () => {
    if (cvDialog.open) {
        cvDialog.close();
        cvFrame.src = "";
    }
});

cvDialog.addEventListener("close", () => {
    cvFrame.src = "";
});

window.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && cvDialog.open) {
        cvDialog.close();
    }
});

renderBoard();

