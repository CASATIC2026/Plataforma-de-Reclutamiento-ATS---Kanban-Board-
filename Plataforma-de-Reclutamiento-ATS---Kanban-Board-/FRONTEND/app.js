const form = document.getElementById("applicationForm");
const positionSelect = document.getElementById("position");
const successMessage = document.getElementById("successMessage");
const yearSpan = document.getElementById("year");
const jobCards = document.querySelectorAll(".job-card");

yearSpan.textContent = new Date().getFullYear();

jobCards.forEach((card) => {
    const button = card.querySelector(".select-position");
    const position = card.dataset.position;
    if (!button || !position) return;

    button.addEventListener("click", () => {
        positionSelect.value = position;
        document.getElementById("applicationSection").scrollIntoView({ behavior: "smooth", block: "start" });
    });
});

function getStoredApplications() {
    try {
        const raw = localStorage.getItem("applications");
        if (!raw) return [];
        const data = JSON.parse(raw);
        return Array.isArray(data) ? data : [];
    } catch {
        return [];
    }
}

function saveApplications(list) {
    localStorage.setItem("applications", JSON.stringify(list));
}

function createId() {
    return `app_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

form.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!positionSelect.value) {
        alert("Por favor selecciona un puesto.");
        return;
    }

    const name = document.getElementById("name").value.trim();
    const age = document.getElementById("age").value.trim();
    const email = document.getElementById("email").value.trim();
    const cvInput = document.getElementById("cvFile");
    const cvFile = cvInput.files[0];

    if (!cvFile) {
        alert("Por favor adjunta tu CV en formato PDF.");
        return;
    }

    if (cvFile.type !== "application/pdf") {
        alert("Solo se permite subir archivos PDF.");
        return;
    }

    try {
        const cvDataUrl = await readFileAsDataURL(cvFile);

        const newApplication = {
            id: createId(),
            name,
            age,
            email,
            position: positionSelect.value,
            cvName: cvFile.name,
            cvDataUrl,
            status: "postulante",
            createdAt: Date.now()
        };

        const current = getStoredApplications();
        current.push(newApplication);
        saveApplications(current);

        form.reset();
        successMessage.hidden = false;
        setTimeout(() => {
            successMessage.hidden = true;
        }, 4000);
    } catch (error) {
        console.error("Error al leer el archivo PDF", error);
        alert("Ocurrió un error al procesar tu CV. Intenta nuevamente.");
    }
});

function readFileAsDataURL(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject(reader.error);
        reader.readAsDataURL(file);
    });
}

