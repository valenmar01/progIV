// js/pages/cursos.js

const BASE_URL = 'http://localhost:3000/api/v1'; 
const authHeader = {
      'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
      'Content-Type': 'application/json'
     };
let paginaActual = 1;
let totalPaginas = 1;
let cursosPagina = [];

// --- Utilidades para UI ---
const getColorPorEstado = (idEstado) => {
    switch(Number(idEstado)) {
        case 1: return 'text-bg-secondary'; // Gris para Borrador
        case 2: return 'text-bg-success';   // Verde para Abierta
        case 3: return 'text-bg-warning';   // Amarillo para Cerrada
        case 4: return 'text-bg-danger';    // Rojo para Eliminado
        default: return 'text-bg-light';
    }
};

// Generador del select con colores dinámicos
const renderSelectorEstado = (id_curso_estado, id) => {
    const colorClass = getColorPorEstado(id_curso_estado);
    return `
        <select class="form-select form-select-sm selector-estado fw-bold shadow-sm border-0 ${colorClass}" data-id="${id}" style="min-width: 140px; cursor: pointer;">
            <option value="1" class="bg-white text-dark" ${id_curso_estado == 1 ? 'selected' : ''}>Borrador</option>
            <option value="2" class="bg-white text-dark" ${id_curso_estado == 2 ? 'selected' : ''}>Abierta</option>
            <option value="3" class="bg-white text-dark" ${id_curso_estado == 3 ? 'selected' : ''}>Cerrada</option>
            <option value="4" class="bg-white text-dark" ${id_curso_estado == 4 ? 'selected' : ''}>Eliminado</option>
        </select>
    `;
};

const renderAcciones = ({ id }) => `
    <button class="btn btn-sm btn-outline-primary" data-accion="editar" data-id="${id}">Editar</button>
`;

const crearFila = (curso, n) => `
    <tr data-id="${curso.id}">
        <td>${curso.nombre}</td>
        <td>${curso.descripcion || '-'}</td>
        <td>${curso.fecha_inicio ? new Date(curso.fecha_inicio).toLocaleDateString() : '-'}</td>
        <td>${curso.cantidad_horas} hs</td>
        <td>${curso.inscriptos_max}</td>
        <td data-col="estado">${renderSelectorEstado(curso.id_curso_estado, curso.id)}</td>
        <td data-col="acciones">${renderAcciones(curso)}</td>
    </tr>`;

const renderTabla = (data) => {
    cursosPagina = data.cursos;
    paginaActual = Number(data.pagina) || 1;       
    totalPaginas = Number(data.totalPaginas);

    const inicio = (paginaActual - 1) * 5;
    const filas = cursosPagina.length
        ? cursosPagina.map((c, i) => crearFila(c, inicio + i + 1)).join("")
        : '<tr><td colspan="7" class="text-center py-4">No hay cursos para mostrar</td></tr>';

    let paginacion = "";
    if (totalPaginas > 1) {
        const numeros = Array.from({ length: totalPaginas }, (_, i) =>
            `<li class="page-item ${i + 1 === paginaActual ? "active" : ""}">
                <button class="page-link" data-page="${i + 1}">${i + 1}</button></li>`
        ).join("");
        paginacion = `
            <nav class="mt-3"><ul class="pagination justify-content-end mb-0">
                <li class="page-item ${paginaActual === 1 ? "disabled" : ""}">
                    <button class="page-link" data-page="${paginaActual - 1}">Anterior</button></li>
                ${numeros}
                <li class="page-item ${paginaActual === totalPaginas ? "disabled" : ""}">
                    <button class="page-link" data-page="${paginaActual + 1}">Siguiente</button></li>
            </ul></nav>`;
    }

    document.getElementById("tabla-cursos").innerHTML = `
        <table class="table table-striped table-hover align-middle">
            <thead><tr>
                <th>Nombre</th><th>Descripción</th><th>Inicio</th><th>Horas</th><th>Cupo Max.</th><th>Estado</th><th>Acciones</th>
            </tr></thead>
            <tbody>${filas}</tbody>
        </table>${paginacion}`;
};

// --- Peticiones al backend ---
const cargarPagina = async (pagina) => {
    const contenedor = document.getElementById("tabla-cursos");
    if (!contenedor) return;
    contenedor.innerHTML = '<p class="text-muted">Cargando cursos...</p>';
    try {
        const res = await fetch(`${BASE_URL}/cursos?pagina=${pagina}`, {
            headers: authHeader
        });
        if (!res.ok) throw new Error(`Error HTTP ${res.status}`);
        const data = await res.json();
        renderTabla(data);
    } catch (error) {
        contenedor.innerHTML = `<div class="alert alert-danger">No se pudo cargar la lista de cursos. ${error.message}</div>`;
    }
};

const mostrarToast = (mensaje, tipo = "success") => {
    const contenedor = document.getElementById("toast-container");
    if (!contenedor || !window.bootstrap) return;
    const el = document.createElement("div");
    el.className = `toast align-items-center text-bg-${tipo} border-0`;
    el.setAttribute("role", "alert");
    el.setAttribute("aria-live", "assertive");
    el.setAttribute("aria-atomic", "true");
    el.innerHTML = `
        <div class="d-flex">
            <div class="toast-body">${mensaje}</div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
        </div>`;
    contenedor.appendChild(el);
    const toast = new window.bootstrap.Toast(el, { delay: 2500 });
    el.addEventListener("hidden.bs.toast", () => el.remove());
    toast.show();
};

const abrirModal = (modo = "crear", curso = null) => {
    const modalEl = document.getElementById("modal-agregar-curso");
    const form = document.getElementById("form-agregar-curso");
    if (!modalEl || !form || !window.bootstrap) return;

    form.dataset.modo = modo;
    document.getElementById("modal-agregar-curso-label").textContent = modo === "editar" ? "Editar Curso" : "Nuevo Curso";
    document.getElementById("btn-submit-curso").textContent = modo === "editar" ? "Guardar cambios" : "Crear";

    if (modo === "editar" && curso) {
        form.dataset.id = curso.id;
        form.elements.namedItem("nombre").value = curso.nombre ?? "";
        form.elements.namedItem("descripcion").value = curso.descripcion ?? "";
        form.elements.namedItem("fecha_inicio").value = (curso.fecha_inicio ?? "").toString().slice(0, 10);
        form.elements.namedItem("cantidad_horas").value = curso.cantidad_horas ?? "";
        form.elements.namedItem("inscriptos_max").value = curso.inscriptos_max ?? "";
        if(form.elements.namedItem("id_curso_estado")) {
            form.elements.namedItem("id_curso_estado").value = curso.id_curso_estado ?? 1;
        }
    } else {
        form.reset();
        if(form.elements.namedItem("id_curso_estado")) {
            form.elements.namedItem("id_curso_estado").value = 1; // Default a Borrador
        }
    }

    window.bootstrap.Modal.getOrCreateInstance(modalEl).show();
};

const manejarSubmit = async (evento) => {
    evento.preventDefault();
    const form = evento.currentTarget;
    const esEdicion = form.dataset.modo === "editar";
    const data = new FormData(form);

    const payload = {
        nombre: data.get("nombre")?.trim(),
        descripcion: data.get("descripcion")?.trim(),
        fecha_inicio: data.get("fecha_inicio")?.trim(),
        cantidad_horas: Number(data.get("cantidad_horas")),
        inscriptos_max: Number(data.get("inscriptos_max")),
        id_curso_estado: Number(data.get("id_curso_estado")) || 1 
    };

    if (!payload.nombre || !payload.fecha_inicio) {
        mostrarToast("Por favor completa los campos obligatorios", "warning");
        return;
    }
    
    try {
        const url = esEdicion ? `${BASE_URL}/cursos/${form.dataset.id}` : `${BASE_URL}/cursos`;
        
        const res = await fetch(url, {
            method: esEdicion ? "PUT" : "POST",
            headers: authHeader,
            body: JSON.stringify(payload)
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.message ?? `Error HTTP ${res.status}`);

        mostrarToast(json.message ?? (esEdicion ? "Curso actualizado" : "Curso creado"));
        window.bootstrap.Modal.getOrCreateInstance(document.getElementById("modal-agregar-curso")).hide();
        form.reset();
        form.dataset.modo = "crear";
        await cargarPagina(paginaActual);

    } catch (error) {
        mostrarToast(error.message ?? "No se pudo guardar el curso", "danger");
    }
};

// --- Manejo de Eventos y Cambio de Estado Dinámico ---
const manejarClick = async (evento) => {
    const botonPagina = evento.target.closest("[data-page]");
    if (botonPagina) {
        const n = Number(botonPagina.dataset.page);
        if (!Number.isNaN(n) && n > 0 && n <= totalPaginas) {
            await cargarPagina(n);
        }
        return;
    }

    const boton = evento.target.closest("[data-accion]");
    if (!boton) return;
    
    const { accion, id } = boton.dataset;

    if (accion === "editar") {
        const curso = cursosPagina.find(c => String(c.id) === String(id));
        if (!curso) { mostrarToast("No se encontraron los datos del curso", "warning"); return; }
        abrirModal("editar", curso);
        return;
    }
};

const manejarCambioEstado = async (evento) => {
    const select = evento.target.closest('.selector-estado');
    if (!select) return;

    const id = select.dataset.id;
    const nuevoEstado = select.value;

    try {
        // Ejecutamos el DELETE respetando la consigna y mandando el nuevo estado
        const res = await fetch(`${BASE_URL}/cursos/${id}`, {
            method: "DELETE",
            headers: authHeader,
            body: JSON.stringify({ id_curso_estado: Number(nuevoEstado) })
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.message ?? `Error HTTP ${res.status}`);

        mostrarToast(json.message ?? "Estado del curso actualizado");
        
        // Refrescamos para sincronizar UI y totales
        await cargarPagina(paginaActual); 
    } catch (error) {
        mostrarToast(error.message ?? "No se pudo actualizar el curso", "danger");
        await cargarPagina(paginaActual); // Revertir visualmente si falló
    }
};

// --- Inicialización ---
document.addEventListener("DOMContentLoaded", () => {
    const contenedor = document.getElementById("tabla-cursos");
    if (contenedor) {
        // Escuchamos los clicks de botones
        contenedor.addEventListener("click", manejarClick);
        // Escuchamos los cambios en el selector de estado
        contenedor.addEventListener("change", manejarCambioEstado);
    }

    document.getElementById("btn-agregar-curso")?.addEventListener("click", () => abrirModal("crear"));
    document.getElementById("form-agregar-curso")?.addEventListener("submit", manejarSubmit);

    cargarPagina(1);
});