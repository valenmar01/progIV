const API_URL = 'http://localhost:3000/api/v1';

const headersJWT = {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${sessionStorage.getItem('token')}`
};

let paginaActual = 1;
let totalPaginas = 1;
let inscripcionesPagina = [];

const renderEstadoBadge = (activo) => activo == 1
    ? '<span class="badge badge-success">Confirmada</span>'
    : '<span class="badge badge-warning">Cancelada</span>';

const cargarSelectores = async () => {
    try {
        const resEst = await fetch(`${API_URL}/estudiantes?limite=1000`, { headers: headersJWT }); 
        const dataEst = await resEst.json();
        const selectEstudiante = document.getElementById("form-ins-estudiante");

        if (selectEstudiante && dataEst.estudiantes) {
            dataEst.estudiantes.filter(e => e.activo === 1).forEach(e => {
                const option = document.createElement("option");
                option.value = e.id;
                option.textContent = `${e.apellido}, ${e.nombres} (DNI: ${e.documento})`; 
                selectEstudiante.appendChild(option);
            });
        }

        const resCur = await fetch(`${API_URL}/cursos?limite=1000`, { headers: headersJWT });
        const dataCur = await resCur.json();
        const selectCurso = document.getElementById("form-ins-curso");

        if (selectCurso && dataCur.cursos) {
            dataCur.cursos.filter(c => c.id_curso_estado === 2).forEach(c => {
                const option = document.createElement("option");
                option.value = c.id;
                option.textContent = `${c.nombre} (Max: ${c.inscriptos_max} cupos)`; 
                selectCurso.appendChild(option);
            });
        }
    } catch (error) {
        console.error("Error al poblar los selectores:", error);
    }
};

const renderTabla = (data) => {
    inscripcionesPagina = data.inscripciones;
    paginaActual = Number(data.pagina) || 1;
    totalPaginas = Number(data.totalPaginas);
    
    const totalInscriptos = data.totalInscriptos || 0;
    const labelTotal = document.getElementById("label-total-inscriptos");
    if(labelTotal) labelTotal.textContent = `Total Histórico: ${totalInscriptos}`;

    const tbody = document.getElementById("tabla-inscripciones-body");
    if (!tbody) return;
    
    tbody.innerHTML = inscripcionesPagina.length > 0 
        ? inscripcionesPagina.map(ins => crearFila(ins)).join("")
        : `<tr><td colspan="5" class="text-center">No se encontraron inscripciones.</td></tr>`;

    renderPaginacion();
};

const crearFila = (ins) => {
    const textoBoton = ins.activo == 1 ? "Cancelar Insc." : "Confirmar Insc.";
    const claseBoton = ins.activo == 1 ? "btn-peligro" : "btn-exito"; // Usamos tus botones

    return `
        <tr data-id="${ins.id}">
            <td><strong>${ins.estudiante}</strong></td>
            <td>${ins.curso}</td>
            <td>${new Date(ins.fecha_inscripcion).toLocaleDateString()}</td>
            <td>${renderEstadoBadge(ins.activo)}</td>
            <td>
                <button class="btn ${claseBoton}" style="padding: 5px 10px; font-size: 0.85rem;" data-accion="cambiar-estado" data-id="${ins.id}" data-activo="${ins.activo}">
                    ${textoBoton}
                </button>
            </td>
        </tr>
    `;
};

const renderPaginacion = () => {
    const contenedor = document.getElementById("paginacion-inscripciones"); // Creá un div con este id en tu HTML abajo de la tabla
    if (!contenedor) return;

    if (totalPaginas <= 1) {
        contenedor.innerHTML = "";
        return;
    }

    const numeros = Array.from({ length: totalPaginas }, (_, i) =>
        `<li class="page-item ${i + 1 === paginaActual ? "active" : ""}">
            <button class="page-link" data-page="${i + 1}">${i + 1}</button></li>`
    ).join("");

    contenedor.innerHTML = `
        <nav class="mt-3"><ul class="pagination justify-content-end mb-0">
            <li class="page-item ${paginaActual === 1 ? "disabled" : ""}">
                <button class="page-link" data-page="${paginaActual - 1}">Anterior</button></li>
            ${numeros}
            <li class="page-item ${paginaActual === totalPaginas ? "disabled" : ""}">
                <button class="page-link" data-page="${paginaActual + 1}">Siguiente</button></li>
        </ul></nav>`;
};

const cargarTablaInscripciones = async (pagina = 1) => {
    try {
        const res = await fetch(`${API_URL}/inscripciones?pagina=${pagina}`, { headers: headersJWT });
        const data = await res.json();
        renderTabla(data);
    } catch (error) {
        console.error("Error al cargar la tabla de inscripciones:", error);
    }
};

const filtrarTabla = (termino) => {
    const t = termino.toLowerCase().trim();
    const filtrados = t
        ? inscripcionesPagina.filter(ins =>
            ins.estudiante.toLowerCase().includes(t) ||
            ins.curso.toLowerCase().includes(t))
        : inscripcionesPagina;

    const tbody = document.getElementById("tabla-inscripciones-body");
    if (!tbody) return;

    tbody.innerHTML = filtrados.length
        ? filtrados.map(ins => crearFila(ins)).join("")
        : '<tr><td colspan="5" class="text-center py-4 text-muted">No se encontraron resultados</td></tr>';
};

const realizarInscripcion = async () => {
    const id_estudiante = document.getElementById("form-ins-estudiante").value;
    const id_curso = document.getElementById("form-ins-curso").value;
    
    if (!id_estudiante || !id_curso) {
        alert("Por favor, seleccione un estudiante y un curso válido.");
        return;
    }

    try {
        const res = await fetch(`${API_URL}/inscripciones`, {
            method: "POST",
            headers: headersJWT,
            body: JSON.stringify({ id_estudiante, id_curso })
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.message || "Error al procesar la inscripción");

        alert(`Éxito: ${json.message}`);
        cargarTablaInscripciones(paginaActual); // Recarga la página actual
    } catch (error) { 
        alert(`Error: ${error.message}`);
    }
};

const manejarAccionesTabla = async (e) => {
    const botonPagina = e.target.closest("[data-page]");
    if (botonPagina) {
        const n = Number(botonPagina.dataset.page);
        if (n > 0 && n <= totalPaginas) await cargarTablaInscripciones(n);
        return;
    }

    const botonEstado = e.target.closest('button[data-accion="cambiar-estado"]');
    if (botonEstado) {
        const id = botonEstado.getAttribute("data-id");
        const activoActual = botonEstado.getAttribute("data-activo");
        const nuevoActivo = activoActual == 1 ? 0 : 1;

        if (!confirm('¿Está seguro de cambiar el estado de esta inscripción?')) return;

        try {
            const res = await fetch(`${API_URL}/inscripciones/${id}`, {
                method: "DELETE",
                headers: headersJWT,
                body: JSON.stringify({ activo: nuevoActivo })
            });
            const json = await res.json();
            if (!res.ok) throw new Error(json.message);

            alert(json.message);
            cargarTablaInscripciones(paginaActual); 
        } catch (error) {
            alert(`Error: ${error.message}`);
        }
    }
};

document.addEventListener("DOMContentLoaded", () => { 
    cargarSelectores();
    cargarTablaInscripciones(1);

    const btnInscribir = document.querySelector("#btn-realizar-inscripcion");
    if (btnInscribir) btnInscribir.addEventListener("click", (e) => { e.preventDefault(); realizarInscripcion(); });

    const tablaContainer = document.getElementById("contenedor-tabla-inscripciones");
    if (tablaContainer) tablaContainer.addEventListener("click", manejarAccionesTabla);

    const inputBuscador = document.getElementById("buscar-inscripcion");
    if (inputBuscador) inputBuscador.addEventListener("input", e => filtrarTabla(e.target.value));
});