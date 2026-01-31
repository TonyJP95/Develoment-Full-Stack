// Clase que representa una tarea
class Tarea {
    constructor(nombre, estado = false) {
        this.nombre = nombre;
        this.estado = estado; // false = incompleta, true = completa
    }

    editar(nuevoNombre) {
        this.nombre = nuevoNombre;
    }

    toggleEstado() {
        this.estado = !this.estado;
    }
}

// Clase que gestiona todas las tareas
class GestorDeTareas {
    constructor() {
        this.tareas = JSON.parse(localStorage.getItem("tareas")) || [];
    }

    agregarTarea(tarea) {
        this.tareas.push(tarea);
        this.guardar();
    }

    eliminarTarea(index) {
        this.tareas.splice(index, 1);
        this.guardar();
    }

    editarTarea(index, nuevoNombre) {
        this.tareas[index].editar(nuevoNombre);
        this.guardar();
    }

    guardar() {
        localStorage.setItem("tareas", JSON.stringify(this.tareas));
    }
}

// Instancia del gestor
const gestor = new GestorDeTareas();

// Elementos del DOM
const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");
const errorMsg = document.getElementById("errorMsg");

// Función para renderizar tareas
const renderTareas = () => {
    taskList.innerHTML = "";
    gestor.tareas.forEach((tarea, index) => {
        const li = document.createElement("li");
        li.innerHTML = `
            <span style="text-decoration:${tarea.estado ? 'line-through' : 'none'}">
                ${tarea.nombre}
            </span>
            <div>
                <button class="editBtn">Editar</button>
                <button class="deleteBtn">Eliminar</button>
                <button class="toggleBtn">${tarea.estado ? 'Desmarcar' : 'Completar'}</button>
            </div>
        `;

        // Botón editar
        li.querySelector(".editBtn").addEventListener("click", () => {
            const nuevoNombre = prompt("Editar tarea:", tarea.nombre);
            if (nuevoNombre && nuevoNombre.trim() !== "") {
                gestor.editarTarea(index, nuevoNombre);
                renderTareas();
            }
        });

        // Botón eliminar
        li.querySelector(".deleteBtn").addEventListener("click", () => {
            gestor.eliminarTarea(index);
            renderTareas();
        });

        // Botón completar/incompleta
        li.querySelector(".toggleBtn").addEventListener("click", () => {
            tarea.toggleEstado();
            gestor.guardar();
            renderTareas();
        });

        taskList.appendChild(li);
    });
};

// Evento para agregar tarea
addTaskBtn.addEventListener("click", () => {
    const nombre = taskInput.value.trim();
    if (nombre === "") {
        errorMsg.textContent = "No puedes agregar una tarea vacía.";
        return;
    }
    const nuevaTarea = new Tarea(nombre);
    gestor.agregarTarea(nuevaTarea);
    taskInput.value = "";
    errorMsg.textContent = "";
    renderTareas();
});

// Render inicial
renderTareas();
