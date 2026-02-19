const dropArea = document.getElementById("drop-area");
const fileInput = document.getElementById("fileInput");
const browseBtn = document.getElementById("browseBtn");
const fileNameLabel = document.getElementById("file-name");
const form = document.getElementById("registrationForm");

let uploadedFile = null; // Aquí se guardará el archivo

// Hacer que el botón "Browse" active el input oculto
browseBtn.onclick = () => fileInput.click();

fileInput.addEventListener("change", function() {
    handleFile(this.files[0]);
});

// Eventos de arrastre
dropArea.addEventListener("dragover", (e) => {
    e.preventDefault();
    dropArea.classList.add("active");
});

dropArea.addEventListener("dragleave", () => {
    dropArea.classList.remove("active");
});

dropArea.addEventListener("drop", (e) => {
    e.preventDefault();
    dropArea.classList.remove("active");
    const file = e.dataTransfer.files[0];
    handleFile(file);
});

function handleFile(file) {
    if (file) {
        uploadedFile = file;
        fileNameLabel.innerText = `Archivo seleccionado: ${file.name}`;
    }
}

// Manejo del envío del formulario
form.onsubmit = (e) => {
    e.preventDefault();

    if (!uploadedFile) {
        alert("Por favor, sube tu CV antes de enviar.");
        return;
    }

    const datos = {
        nombre: document.getElementById("nombre").value,
        fecha: document.getElementById("fechaNacimiento").value,
        correo: document.getElementById("correo").value,
        archivo: uploadedFile.name
    };

    console.log("Datos del formulario:", datos);
    alert(`¡Gracias ${datos.nombre}! Tu formulario se ha procesado (revisa la consola).`);
};