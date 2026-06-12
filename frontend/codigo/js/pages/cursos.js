// esta función se encarga de cargar los cursos desde un archivo JSON, crear filas para cada curso y agregarlas a la tabla en el HTML. Si ocurre un error durante la carga, muestra un mensaje de error en la página.
const cargarCursos = async () => {
    try {
        const respuesta = await fetch("http://localhost:3000/cursos");
        const datos = await respuesta.json();

        const tabla = document.getElementById("tabla-cursos-body");
        datos.cursos.forEach(curso => {
            const fila = document.createElement("tr");
            fila.innerHTML = `
            <td>${curso.id}</td>
            <td>${curso.nombre}</td>
            <td>${curso.descripcion}</td>
            <td class="text-center">${new Date(curso.fecha_inicio).toLocaleDateString()}</td>
            <td class="text-center">${curso.cantidad_horas}</td>
            <td class="text-center">${curso.inscriptos_max}</td>`;
            tabla.appendChild(fila);
        });

    } catch (error) {
        console.log(error)
    }
}
// llama la función cargarCursos cuando el contenido del DOM se haya cargado completamente, asegurando que la tabla esté lista para ser manipulada antes de intentar agregar filas con los datos de los cursos.
const agregarCurso = async () => {
    const nombre        = document.getElementById("form-cur-nombre").value.trim();
    const descripcion   = document.getElementById("form-cur-descripcion").value.trim();
    const cantidad_horas = parseInt(document.getElementById("form-cur-duracion").value);
    const inscriptos_max = parseInt(document.getElementById("form-cur-cupo").value);
    const fecha_inicio  = document.getElementById("form-cur-fecha").value;

    if (!nombre || !descripcion || !fecha_inicio || isNaN(cantidad_horas) || isNaN(inscriptos_max)) {
        alert("Por favor completá todos los campos.");
        return;
    }

    try {
        const res = await fetch("http://localhost:3000/cursos", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nombre, descripcion, fecha_inicio, cantidad_horas, inscriptos_max })
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.message ?? `Error HTTP ${res.status}`);

        document.getElementById("formulario-cursos").reset();
        document.getElementById("tabla-cursos-body").innerHTML = "";
        await cargarCursos();
    } catch (error) {
        alert("Error al agregar el curso: " + error.message);
    }
};

document.addEventListener("DOMContentLoaded", () => {
    cargarCursos();
    document.getElementById("btn-agregar-curso").addEventListener("click", agregarCurso);
});