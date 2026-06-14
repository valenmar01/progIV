const API_URL = "http://localhost:3000";

// Función para renderizar el estado de la inscripción como un badge
const renderEstadoBadge = (activo) => activo == 1
    ? '<span class="badge" style="background-color: var(--color-verde); color: white; padding: 4px; border-radius: 4px; font-size: 0.8em;">Activo</span>'
    : '<span class="badge" style="background-color: var(--color-gris); color: var(--color-blanco); padding: 4px 8px; border-radius: 4px; font-size: 0.8em;">Baja</span>';

// Función para cargar los selectores de estudiantes y cursos en el formulario de inscripciones
const cargarSelectores = async () => {
    try {
        const resEst = await fetch(`${API_URL}/estudiantes`);
        const dataEst = await resEst.json();
        const selectEstudiante = document.getElementById("form-ins-estudiante");

        if (selectEstudiante && dataEst.estudiantes) {
            dataEst.estudiantes.filter(e => e.activo === 1).forEach(e=>{
                const option = document.createElement("option");
                option.value = e.id;
                option.textContent = `${e.apellido}, ${e.nombre} (DNI: ${e.documento})`; 
                selectEstudiante.appendChild(option);
            });
        }

        const resCur = await fetch(`${API_URL}/cursos`);
        const dataCur = await resCur.json();
        const selectCurso = document.getElementById("form-ins-curso");

        if (selectCurso && dataCur.cursos) {
            dataCur.cursos.forEach(c=>{
                const option = document.createElement("option");
                option.value = c.id;
                option.textContent = `${c.nombre} (Max: ${c.incriptos_max} cupos)`;
                selectCurso.appendChild(option);
            });
        }
    } catch (error) {
        console.error("Error al poblar los selectores de formulario:", error);
    }
};

// Función para cargar la tabla de inscripciones con paginación
const cargarTablaInscripciones = async (pagina = 1) => {
    try {
        const res = await fetch(`${API_URL}/inscripciones?pagina=${pagina}`);
        const data = await res.json();
        const tbody = document.getElementById("tabla-inscripciones-body");

        if (!tbody) return;
        tbody.innerHTML = "";

        if (data.inscripciones && data.inscripciones.length > 0) {
            data.inscripciones.forEach(ins => {
                const fila = document.createElement("tr");
                fila.setAttribute("data-id", ins.id);

                const textoBoton = ins.activo == 1 ? "Dar de baja" : "Activar";
                const claseBoton = ins.activo == 1 ? "btn-peligro" : "btn-exito";

                fila.innerHTML = `
                    <td>${ins.id}</td>
                    <td><strong>${ins.estudiante}</strong></td>
                    <td>${ins.curso}</td>
                    <td>${new Date(ins.fecha).toLocaleDateString()}</td>
                    <td>${renderEstadoBadge(ins.activo)}</td>
                    <td>
                        <button class="btn ${claseBoton} btn-pequeno" data-accion="cambiar-estado" data-id="${ins.id}" data-activo="${ins.activo}">${textoBoton}
                        </button>
                    </td>
                `;
                tbody.appendChild(fila);
            });
        } else {
                tbody.innerHTML = `<tr><td colspan="6" style="text-align: center: padding: 20px;">No se encontraron inscripciones registradas.</td></tr>`;
        }
    } catch (error) {
        console.error("Error al cargar la tabla de inscripciones:", error);
    }
};

// Se usa para manejar la inscripción desde el formulario de inscripciones
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
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                id_estudiante,
                id_curso
            })
        });

        const json = await res.json();

        if (!res.ok) throw new Error(json.message || "Error al procesar la inscripción");

        alert('${json.message}');
        document.getElementById("formulario-inscripciones").reset();
        cargarTablaInscripciones(1); // Recargar la tabla para mostrar la nueva inscripción
    } catch (error) { 
        alert('${error.message}');
    }
};

// Sirve para manejar acciones como activar/desactivar desde la tabla de inscripciones
const manejarAccionesTabla = async (e) => {
    if (e.target.tagName === "BUTTON" && e.target.getAtribute("data-accion") === "cambiar-estado") {
        const id = e.target.getAttribute("data-id");
        const activoActual = e.target.getAttribute("data-activo");
        const nuevoActivo = activoActual == 1 ? 0 : 1;

        if (!confirm('¿Esta seguro que desea cambiar el estado de esta inscripción?')) return;

        try {
            const res = await fetch(`${API_URL}/inscripciones/${id}`, {
                method: "DELETE",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({ activo: nuevoActivo })
            });

            const json = await res.json();
            if (!res.ok) throw new Error(json.message);

            alert(json.message);
            cargarTablaInscripciones(1); // Recargar la tabla para mostrar la nueva inscripción
        } catch (error) {
            alert('Error: ${error.message}');
        }
    }
};

// Inicialización de la página
document.addEventListener("DOMContentLoaded", () => { 
    cargarSelectores();
    cargarTablaInscripciones(1);

    const btnInscribir = document.querySelector("#formulario-inscripciones button.btn-exito");
    if (btnInscribir) {
        btnInscribir.addEventListener("click", realizarInscripcion);
    }

    const tablaBody = document.getElementById("tabla-inscripciones-body");
    if (tablaBody) {
        tablaBody.addEventListener("click", manejarAccionesTabla);
    }
});