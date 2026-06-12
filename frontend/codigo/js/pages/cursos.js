// esta función se encarga de cargar los cursos desde un archivo JSON, crear filas para cada curso y agregarlas a la tabla en el HTML. Si ocurre un error durante la carga, muestra un mensaje de error en la página.
const API_URL = "http://localhost:3000/cursos";


const cargarCursos = async () => {
    try {
        const respuesta = await fetch(API_URL);


        if (!respuesta.ok) {
            throw new Error("Error al cargar los cursos, ${respuesta.status}");
        }
    
        const datos = await respuesta.json();


        const listaCursos = json.cursos;


        const tabla = document.getElementById("tbody-cursos");


        tabla.innerHTML = "";

        datos.forEach(curso => {
            const fila = document.createElement("tr");
            fila.innerHTML = `
            <td>${curso.id_curso}</td>
            <td>${curso.nombre}</td>
            <td>${curso.descripcion}</td>
            <td class="text-center">${new Date(curso.fecha_inicio).toLocaleDateString()}</td>
            <td class="text-center">${curso.cantidad_horas}</td>
            <td class="text-center">${curso.inscriptos_max}</td>`;
            tabla.appendChild(fila);
        });
        document.getElementById("error").style.display = "none";

    } catch (error) {
        document.getElementById("error").innerHTML = "<p>Error al cargar los cursos.</p>";
        document.getElementById("error").style.display = "block";
    }
}
// llama la función cargarCursos cuando el contenido del DOM se haya cargado completamente, asegurando que la tabla esté lista para ser manipulada antes de intentar agregar filas con los datos de los cursos.
document.addEventListener("DOMContentLoaded", cargarCursos);