const ESTUDIANTES_CACHE_KEY = "estudiantes_cache";
const CANTIDAD_POR_PAGINA = 5;
let paginaActual = 1;

const obtenerEstudiantesCache = () => {
    try {
        const cacheCrudo = localStorage.getItem(ESTUDIANTES_CACHE_KEY);

        if (!cacheCrudo) {
            return [];
        }

        const cacheParseado = JSON.parse(cacheCrudo);
        return Array.isArray(cacheParseado) ? cacheParseado : [];
    } catch {
        return [];
    }
};

const guardarEstudiantesCache = (estudiantes) => {
    try {
        localStorage.setItem(ESTUDIANTES_CACHE_KEY, JSON.stringify(estudiantes));
    } catch {
        // No bloquear la app si localStorage no esta disponible.
    }
};

const actualizarEstudianteEnCache = (estudianteActualizado) => {
    if (!estudianteActualizado?.documento) {
        return;
    }

    const cacheActual = obtenerEstudiantesCache();
    const cacheActualizado = cacheActual.map((estudiante) => {
        if (`${estudiante.documento}` !== `${estudianteActualizado.documento}`) {
            return estudiante;
        }

        return {
            ...estudiante,
            ...estudianteActualizado
        };
    });

    guardarEstudiantesCache(cacheActualizado);
};

const obtenerContenedorTabla = () => document.getElementById("tabla-estudiantes");

const obtenerTotalPaginas = (totalItems) => {
    if (totalItems <= 0) {
        return 1;
    }

    return Math.ceil(totalItems / CANTIDAD_POR_PAGINA);
};

const generarControlesPaginacion = (pagina, totalPaginas) => {
    if (totalPaginas <= 1) {
        return "";
    }

    let items = "";

    items += `
            <li class="page-item ${pagina === 1 ? "disabled" : ""}">
                <button class="page-link" data-page="${pagina - 1}" aria-label="Anterior">Anterior</button>
            </li>`;

    for (let indice = 1; indice <= totalPaginas; indice += 1) {
        items += `
                    <li class="page-item ${indice === pagina ? "active" : ""}">
                        <button class="page-link" data-page="${indice}">${indice}</button>
                    </li>`;
    }

    items += `
            <li class="page-item ${pagina === totalPaginas ? "disabled" : ""}">
                <button class="page-link" data-page="${pagina + 1}" aria-label="Siguiente">Siguiente</button>
            </li>`;

    return `
            <nav class="mt-3" aria-label="Paginación de estudiantes">
                <ul class="pagination justify-content-end mb-0">
                    ${items}
                </ul>
            </nav>`;
};

const renderizarEstudiantesPaginados = (estudiantes = []) => {
    const contenedor = obtenerContenedorTabla();

    if (!contenedor) {
        return;
    }

    const totalPaginas = obtenerTotalPaginas(estudiantes.length);
    paginaActual = Math.min(Math.max(paginaActual, 1), totalPaginas);

    const inicio = (paginaActual - 1) * CANTIDAD_POR_PAGINA;
    const fin = inicio + CANTIDAD_POR_PAGINA;
    const estudiantesPagina = estudiantes.slice(inicio, fin);

    const tabla = generarTablaEstudiantes(estudiantesPagina, inicio);
    const paginacion = generarControlesPaginacion(paginaActual, totalPaginas);

    contenedor.innerHTML = `${tabla}${paginacion}`;
};

const renderActivo = (activo) => {
    const esActivo = activo === 1 || activo === "1";
    if (!esActivo) {
        return '<span class="badge text-bg-dark">Inactivo</span>';
    }
    return '<span class="badge text-bg-success">Activo</span>';


};

const renderAcciones = (estudiante) => {
    const documento = estudiante.documento ?? "";
    const esActivo = estudiante.activo === 1 || estudiante.activo === "1";
    const activo = esActivo ? "1" : "0";

    if (!esActivo) {
        return `
            <div class="btn-group-sm">
                <button
                    type="button"
                    class="btn btn-outline-success"
                    data-accion="activar-desactivar"
                    data-documento="${documento}"
                    data-activo="${activo}"
                >
                    Activar
                </button>
            </div>`;
    }

    return `
            <div class="btn-group-sm">
                <button
                    type="button"
                    class="btn btn-outline-primary"
                    data-accion="editar"
                    data-documento="${documento}"
                    data-activo="${activo}"
                >
                    Editar
                </button>
                <button
                    type="button"
                    class="btn btn-outline-danger"
                    data-accion="activar-desactivar"
                    data-documento="${documento}"
                    data-activo="${activo}"
                >
                    Desactivar
                </button>
            </div>`;
};

const actualizarFilaEstudiante = (documento, nuevoActivo) => {
    const fila = document.querySelector(`tr[data-documento="${documento}"]`);

    if (!fila) {
        return;
    }

    const estudiante = {
        documento,
        activo: nuevoActivo
    };

    const celdaActivo = fila.querySelector('[data-col="activo"]');
    const celdaAcciones = fila.querySelector('[data-col="acciones"]');

    if (celdaActivo) {
        celdaActivo.innerHTML = renderActivo(nuevoActivo);
    }

    if (celdaAcciones) {
        celdaAcciones.innerHTML = renderAcciones(estudiante);
    }
};

const mostrarToast = (mensaje, tipo = "success") => {
    const contenedor = document.getElementById("toast-container");

    if (!contenedor || !window.bootstrap) {
        return;
    }

    const toastElement = document.createElement("div");
    toastElement.className = `toast align-items-center text-bg-${tipo} border-0`;
    toastElement.setAttribute("role", "alert");
    toastElement.setAttribute("aria-live", "assertive");
    toastElement.setAttribute("aria-atomic", "true");

    toastElement.innerHTML = `
        <div class="d-flex">
            <div class="toast-body">${mensaje}</div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>`;

    contenedor.appendChild(toastElement);

    const toast = new window.bootstrap.Toast(toastElement, { delay: 2500 });

    toastElement.addEventListener("hidden.bs.toast", () => {
        toastElement.remove();
    });

    toast.show();
};

const abrirModalEstudiante = (modo = "crear", estudiante = null) => {
    const modalElement = document.getElementById("modal-agregar-estudiante");
    const formulario = document.getElementById("form-agregar-estudiante");
    const tituloModal = document.getElementById("modal-agregar-estudiante-label");
    const botonSubmit = document.getElementById("btn-submit-estudiante");

    if (!modalElement || !formulario || !window.bootstrap) {
        return;
    }

    formulario.dataset.modo = modo;

    if (modo === "editar" && estudiante) {
        if (tituloModal) {
            tituloModal.textContent = "Editar estudiante";
        }

        if (botonSubmit) {
            botonSubmit.textContent = "Guardar cambios";
        }

        formulario.elements.namedItem("nombres").value = estudiante.nombres ?? "";
        formulario.elements.namedItem("apellido").value = estudiante.apellido ?? "";
        formulario.elements.namedItem("documento").value = estudiante.documento ?? "";
        formulario.elements.namedItem("telefono").value = estudiante.telefono ?? "";
        formulario.elements.namedItem("email").value = estudiante.email ?? "";
        formulario.elements.namedItem("fecha_nacimiento").value = (estudiante.fecha_nacimiento ?? "").toString().slice(0, 10);
        formulario.elements.namedItem("activo").value = `${estudiante.activo ?? 1}`;
        formulario.elements.namedItem("documento").setAttribute("readonly", "true");
    } else {
        if (tituloModal) {
            tituloModal.textContent = "Nuevo estudiante";
        }

        if (botonSubmit) {
            botonSubmit.textContent = "Crear";
        }

        formulario.reset();
        formulario.elements.namedItem("documento").removeAttribute("readonly");
    }

    const modal = window.bootstrap.Modal.getOrCreateInstance(modalElement);
    modal.show();
};

const generarTablaEstudiantes = (estudiantes = [], offset = 0) => {
    const filas = estudiantes.length
        ? estudiantes
            .map(
                (estudiante, index) => `
                    <tr data-documento="${estudiante.documento ?? ""}">
              <th scope="row">${offset + index + 1}</th>
              <td>${estudiante.documento ?? ""}</td>
              <td>${estudiante.apellido ?? ""}</td>
              <td>${estudiante.nombres ?? ""}</td>
              <td>${estudiante.email ?? ""}</td>
                      <td data-col="activo">${renderActivo(estudiante.activo)}</td>
                      <td data-col="acciones">${renderAcciones(estudiante)}</td>
            </tr>`,
            )
            .join("")
        : `
        <tr>
                    <td colspan="7" class="text-center py-4">No hay estudiantes para mostrar</td>
        </tr>`;

    return `
    <table class="table table-striped table-hover align-middle">
      <thead>
        <tr>
          <th scope="col">#</th>
          <th scope="col">documento</th>
          <th scope="col">apellido</th>
          <th scope="col">nombres</th>
          <th scope="col">email</th>
          <th scope="col">activo</th>
          <th scope="col">acciones</th>
        </tr>
      </thead>
      <tbody>
        ${filas}
      </tbody>
    </table>`;
};

const obtenerEstudiantes = async () => {
    const response = await fetch("http://localhost:3000/estudiantes");

    if (!response.ok) {
        throw new Error(`Error HTTP ${response.status}`);
    }

    const data = await response.json();
    return Array.isArray(data.estudiantes) ? data.estudiantes : [];
};

const activarDesactivarEstudiante = async (documento, activoActual) => {
    console.log("Activar/Desactivar estudiante con documento:", documento);
    const nuevoActivo = activoActual === "1" ? 0 : 1;

    const response = await fetch(`http://localhost:3000/estudiantes/${documento}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ activo: nuevoActivo })
    });

    if (!response.ok) {
        throw new Error(`Error HTTP ${response.status}`);
    }

    const data = await response.json();

    const estudianteActualizado = data.estudiante ?? { documento, activo: nuevoActivo };
    actualizarEstudianteEnCache(estudianteActualizado);
    renderizarEstudiantesPaginados(obtenerEstudiantesCache());
    mostrarToast(data.message ?? "Estudiante actualizado correctamente");
};

const crearEstudiante = async (evento) => {
    evento.preventDefault();

    const formulario = evento.currentTarget;
    const modoFormulario = formulario.dataset.modo ?? "crear";
    const formData = new FormData(formulario);

    const payload = {
        documento: formData.get("documento")?.toString().trim(),
        apellido: formData.get("apellido")?.toString().trim(),
        nombres: formData.get("nombres")?.toString().trim(),
        email: formData.get("email")?.toString().trim(),
        fecha_nacimiento: formData.get("fecha_nacimiento")?.toString().trim(),
        activo: Number(formData.get("activo") ?? 1)
    };

    try {
        const esEdicion = modoFormulario === "editar";
        const endpoint = esEdicion
            ? `http://localhost:3000/estudiantes/${payload.documento}`
            : "http://localhost:3000/estudiantes";
        const method = esEdicion ? "PATCH" : "POST";

        const body = esEdicion
            ? JSON.stringify({
                apellido: payload.apellido,
                nombres: payload.nombres,
                email: payload.email,
                fecha_nacimiento: payload.fecha_nacimiento,
                activo: payload.activo
            })
            : JSON.stringify(payload);

        const response = await fetch(endpoint, {
            method,
            headers: {
                "Content-Type": "application/json"
            },
            body
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message ?? `Error HTTP ${response.status}`);
        }

        mostrarToast(
            data.message ?? (esEdicion ? "Estudiante actualizado correctamente" : "Estudiante creado correctamente")
        );

        if (window.bootstrap) {
            const modalElement = document.getElementById("modal-agregar-estudiante");
            if (modalElement) {
                const modal = window.bootstrap.Modal.getOrCreateInstance(modalElement);
                modal.hide();
            }
        }

        formulario.reset();
        formulario.dataset.modo = "crear";
        await renderizarTablaEstudiantes();
    } catch (error) {
        console.error("No se pudo guardar el estudiante:", error);
        mostrarToast(error.message ?? "No se pudo guardar el estudiante", "danger");
    }
};

const manejarAccionesTabla = (evento) => {
    const botonPagina = evento.target.closest("[data-page]");

    if (botonPagina) {
        const nuevaPagina = Number(botonPagina.dataset.page);

        if (!Number.isNaN(nuevaPagina)) {
            const totalPaginas = obtenerTotalPaginas(obtenerEstudiantesCache().length);
            paginaActual = Math.min(Math.max(nuevaPagina, 1), totalPaginas);
            renderizarEstudiantesPaginados(obtenerEstudiantesCache());
        }

        return;
    }

    const botonAccion = evento.target.closest("[data-accion]");

    if (!botonAccion) {
        return;
    }

    const { accion, documento, activo } = botonAccion.dataset;

    if (accion === "activar-desactivar") {
        activarDesactivarEstudiante(documento, activo);
        return;
    }

    if (accion === "editar") {
        const estudiante = obtenerEstudiantesCache().find((item) => `${item.documento}` === `${documento}`);

        if (!estudiante) {
            mostrarToast("No se encontraron los datos del estudiante", "warning");
            return;
        }

        abrirModalEstudiante("editar", estudiante);
    }
};

const renderizarTablaEstudiantes = async () => {
    const contenedor = obtenerContenedorTabla();

    if (!contenedor) {
        return;
    }

    if (!contenedor.dataset.listenerAcciones) {
        contenedor.addEventListener("click", manejarAccionesTabla);
        contenedor.dataset.listenerAcciones = "true";
    }

    contenedor.innerHTML = '<p class="text-muted">Cargando estudiantes...</p>';

    try {
        const estudiantes = await obtenerEstudiantes();
        guardarEstudiantesCache(estudiantes);
        renderizarEstudiantesPaginados(estudiantes);
    } catch (error) {
        console.error("No se pudieron cargar los estudiantes:", error);
        contenedor.innerHTML =
            '<div class="alert alert-danger">No se pudo cargar la lista de estudiantes.</div>' + error;
    }
};

const agregarEstudiante = () => {
    abrirModalEstudiante("crear");
};

const inicializarPaginaEstudiantes = () => {
    renderizarTablaEstudiantes();

    const botonAgregar = document.getElementById("btn-agregar-estudiante");
    if (botonAgregar) {
        botonAgregar.addEventListener("click", agregarEstudiante);
    }

    const formularioAgregar = document.getElementById("form-agregar-estudiante");
    if (formularioAgregar) {
        formularioAgregar.addEventListener("submit", crearEstudiante);
    }
};

document.addEventListener("DOMContentLoaded", inicializarPaginaEstudiantes);