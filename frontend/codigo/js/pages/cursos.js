const cargarCursos = async () => {
    try {
        const respuesta = await fetch("progIV\frontend\codigo\js\cursos.json");
        const datos = await respuesta.json();

        const tabla = document.getElementById("tbody-cursos");
        datos.forEach(curso => {
            const fila = document.createElement("tr");
            fila.innerHTML = `
            <td>${curso.idCurso}</td>
            <td>${curso.nombre}</td>
            <td>${curso.descripcion}</td>
            <td class="text-center">${new Date(curso.fechaInicio).toLocaleDateString()}</td>
            <td class="text-center">${curso.cantidadHoras}</td>
            <td class="text-center">${curso.inscriptosMax}</td>`;
            tabla.appendChild(fila);
        });
        document.getElementById("error").style.display = "none";

    } catch (error) {
        document.getElementById("error").innerHTML = "<p>Error al cargar los cursos.</p>";
        document.getElementById("error").style.display = "block";
    }
}

document.addEventListener("DOMContentLoaded", cargarCursos);