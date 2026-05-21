// Variables para manejar la paginación y el estado actual de los estudiantes mostrados en la tabla
let paginaActual = 1;
let totalPaginas = 1;
let estudiantesPagina = [];

// esta función se encarga de renderizar el estado de activo o inactivo de un estudiante, mostrando un badge verde para los activos y un badge oscuro para los inactivos
const renderActivo = (activo) => activo == 1
    ? '<span class="badge text-bg-success">Activo</span>'
    : '<span class="badge text-bg-dark">Inactivo</span>';

// esta función se encarga de renderizar los botones de acción para cada estudiante, dependiendo de si el estudiante está activo o inactivo, mostrando un botón de editar y desactivar para los activos, y un botón de activar para los inactivos
const renderAcciones = ({ id, documento, activo }) => {
    if (activo != 1) return `
        <button class="btn btn-sm btn-outline-success" data-accion="activar-desactivar" data-id="${id}" data-documento="${documento}" data-activo="0">Activar</button>`;
    return `
        <button class="btn btn-sm btn-outline-primary me-1" data-accion="editar" data-id="${id}" data-documento="${documento}" data-activo="1">Editar</button>
        <button class="btn btn-sm btn-outline-danger" data-accion="activar-desactivar" data-id="${id}" data-documento="${documento}" data-activo="1">Desactivar</button>`;
};

// esta función se encarga de crear una fila de la tabla de estudiantes a partir de los datos de un estudiante, incluyendo el estado de activo/inactivo y los botones de acción correspondientes
const crearFila = (estudiante, n) => `
    <tr data-documento="${estudiante.documento}">
        <td>${estudiante.documento}</td>
        <td>${estudiante.apellido}</td>
        <td>${estudiante.nombres}</td>
        <td>${estudiante.email}</td>
        <td data-col="activo">${renderActivo(estudiante.activo)}</td>
        <td data-col="acciones">${renderAcciones(estudiante)}</td>
    </tr>`;

const renderTabla = (data) => {
    estudiantesPagina = data.estudiantes;
    paginaActual = Number(data.pagina);       
    totalPaginas = Number(data.totalPaginas);

    const inicio = (paginaActual - 1) * 5;
    const filas = estudiantesPagina.length
        ? estudiantesPagina.map((e, i) => crearFila(e, inicio + i + 1)).join("")
        : '<tr><td colspan="7" class="text-center py-4">No hay estudiantes para mostrar</td></tr>';

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

    document.getElementById("tabla-estudiantes").innerHTML = `
        <table class="table table-striped table-hover align-middle">
            <thead><tr>
                <th>Documento</th><th>Apellido</th><th>Nombres</th><th>Email</th><th>Activo</th><th>Acciones</th>
            </tr></thead>
            <tbody>${filas}</tbody>
        </table>${paginacion}`;
};

// esta función se encarga de cargar la lista de estudiantes desde el backend, mostrando un mensaje de carga mientras se obtiene la información, y luego renderizando la tabla con los datos recibidos. Si ocurre un error durante la carga, muestra un mensaje de error en lugar de la tabla.
const cargarPagina = async (pagina) => {
    const contenedor = document.getElementById("tabla-estudiantes");
    contenedor.innerHTML = '<p class="text-muted">Cargando estudiantes...</p>';
    try {
        const res = await fetch(`http://localhost:3000/estudiantes?pagina=${pagina}`);
        if (!res.ok) throw new Error(`Error HTTP ${res.status}`);
        const data = await res.json();
        renderTabla(data);
    } catch (error) {
        contenedor.innerHTML = `<div class="alert alert-danger">No se pudo cargar la lista de estudiantes. ${error.message}</div>`;
    }
};

// esta función se encarga de mostrar un mensaje tipo toast en la esquina inferior derecha de la pantalla, con el mensaje y el tipo (success, warning, danger) que se le pase como argumento, y se oculta automáticamente después de unos segundos
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

// esta función se encarga de abrir el modal para agregar o editar un estudiante, dependiendo del modo en que se llame (crear o editar), y si es edición, también recibe los datos del estudiante a editar para llenar el formulario con esa información. Además, se asegura de configurar correctamente el título del modal y el texto del botón de submit según el modo, y de bloquear el campo de documento en caso de edición para evitar que se modifique un identificador único.
const abrirModal = (modo = "crear", estudiante = null) => {
    const modalEl = document.getElementById("modal-agregar-estudiante");
    const form = document.getElementById("form-agregar-estudiante");
    if (!modalEl || !form || !window.bootstrap) return;

    form.dataset.modo = modo;
    document.getElementById("modal-agregar-estudiante-label").textContent =
        modo === "editar" ? "Editar estudiante" : "Nuevo estudiante";
    document.getElementById("btn-submit-estudiante").textContent =
        modo === "editar" ? "Guardar cambios" : "Crear";
        

    // si el modo es edición y se proporcionó un estudiante, llena el formulario con los datos del estudiante, de lo contrario, resetea el formulario para crear un nuevo estudiante. Además, si es edición, se bloquea el campo de documento para evitar que se modifique, ya que es un identificador único.
    if (modo === "editar" && estudiante) {
        form.dataset.id = estudiante.id;
        form.elements.namedItem("nombres").value = estudiante.nombres ?? "";
        form.elements.namedItem("apellido").value = estudiante.apellido ?? "";
        form.elements.namedItem("documento").value = estudiante.documento ?? "";
        form.elements.namedItem("email").value = estudiante.email ?? "";
        form.elements.namedItem("fecha_nacimiento").value = (estudiante.fechaNacimiento ?? "").toString().slice(0, 10);
        form.elements.namedItem("activo").value = `${estudiante.activo ?? 1}`;
    } else {
        form.reset();
        form.elements.namedItem("documento").removeAttribute("readonly");
    }

    window.bootstrap.Modal.getOrCreateInstance(modalEl).show();
};

// este manejador se encarga de detectar el submit del formulario para agregar o editar un estudiante, y enviar la solicitud correspondiente al backend, ya sea para crear un nuevo estudiante o actualizar uno existente, dependiendo del modo en que se haya abierto el modal
const manejarSubmit = async (evento) => {
    evento.preventDefault();
    const form = evento.currentTarget;
    const esEdicion = form.dataset.modo === "editar";
    const data = new FormData(form);

    // crea el payload con los datos del formulario, asegurándose de convertir el campo "activo" a número y de manejar los valores nulos o indefinidos
    const payload = {
        documento: data.get("documento")?.trim(),
        apellido: data.get("apellido")?.trim(),
        nombres: data.get("nombres")?.trim(),
        email: data.get("email")?.trim(),
        fecha_nacimiento: data.get("fecha_nacimiento")?.trim(),
        activo: Number(data.get("activo") ?? 1)
    };

    // valida que los campos requeridos no estén vacíos
    if (!payload.documento || !payload.apellido || !payload.nombres) {
        mostrarToast("Por favor completa los campos obligatorios", "warning");
        return;
    }
    
    try {
        const url = esEdicion
            ? `http://localhost:3000/estudiantes/${form.dataset.id}`
            : "http://localhost:3000/estudiantes";
        const body = esEdicion
            ? { apellido: payload.apellido, nombres: payload.nombres, email: payload.email, fecha_nacimiento: payload.fecha_nacimiento, activo: payload.activo }
            : payload;

        const res = await fetch(url, {
            method: esEdicion ? "PUT" : "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body)
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.message ?? `Error HTTP ${res.status}`);

        mostrarToast(json.message ?? (esEdicion ? "Estudiante actualizado" : "Estudiante creado"));
        window.bootstrap.Modal.getOrCreateInstance(document.getElementById("modal-agregar-estudiante")).hide();
        form.reset();
        form.dataset.modo = "crear";
        await cargarPagina(1);

    } catch (error) {
        mostrarToast(error.message ?? "No se pudo guardar el estudiante", "danger");
    }
};

// este manejador se encarga de detectar los clicks en los botones de paginación, edición, activación y desactivación, y ejecutar la acción correspondiente según el botón clickeado
const manejarClick = async (evento) => {
    console.log("Clic detectado en:", evento.target); 
    
    // verifica si el clic fue en un botón de paginación
    const botonPagina = evento.target.closest("[data-page]");
    if (botonPagina) {
        const n = Number(botonPagina.dataset.page);
        if (!Number.isNaN(n) && n > 0 && n <= totalPaginas) {
            await cargarPagina(n);
        }
        return;
    }

    // si no fue en un botón de paginación, verifica si fue en un botón de acción (editar, activar/desactivar)
    const boton = evento.target.closest("[data-accion]");
    if (!boton) return;
    const { accion, id, documento, activo } = boton.dataset;

    if (accion === "editar") {
        const estudiante = estudiantesPagina.find(e => `${e.documento}` === `${documento}`);
        if (!estudiante) { mostrarToast("No se encontraron los datos del estudiante", "warning"); return; }
        abrirModal("editar", estudiante);
        return;
    }

    // si la acción es activar/desactivar, envía la solicitud al backend para actualizar el estado del estudiante, y luego actualiza la fila correspondiente en la tabla sin recargar toda la página
    if (accion === "activar-desactivar") {
        const nuevoActivo = activo === "1" ? 0 : 1;
        try {
            const res = await fetch(`http://localhost:3000/estudiantes/${id}`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ activo: nuevoActivo })
            });
            const json = await res.json();
            if (!res.ok) throw new Error(json.message ?? `Error HTTP ${res.status}`);

            const fila = document.querySelector(`tr[data-documento="${documento}"]`);
            if (fila) {
                fila.querySelector('[data-col="activo"]').innerHTML = renderActivo(nuevoActivo);
                fila.querySelector('[data-col="acciones"]').innerHTML = renderAcciones({ id, documento, activo: nuevoActivo });
            }
            mostrarToast(json.message ?? "Estudiante actualizado");
        } catch (error) {
            mostrarToast(error.message ?? "No se pudo actualizar el estudiante", "danger");
        }
    }
};

// esto sirve para cargar la lista de estudiantes al abrir la página, y también asigna los eventos a los botones de paginación, edición, activación y desactivación, así como al formulario del modal para agregar/editar estudiantes
document.addEventListener("DOMContentLoaded", () => {
    const contenedor = document.getElementById("tabla-estudiantes");
    contenedor.addEventListener("click", manejarClick);

    document.getElementById("btn-agregar-estudiante")?.addEventListener("click", () => abrirModal("crear"));
    document.getElementById("form-agregar-estudiante")?.addEventListener("submit", manejarSubmit);

    cargarPagina(1);
});
