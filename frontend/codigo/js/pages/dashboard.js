// Importar la función desde la carpeta api según tu estructura
import { fetchData } from './api/fetch.js';

async function DashboardEstadistico() {
    try {
        // Obtener los datos de los endpoints 'cursos' y 'estudiantes'
        const cursos = await fetchData('cursos');
        const estudiantes = await fetchData('estudiantes');

        // Selecciona los elementos del archivo HTML donde se mostrarán las cantidades
        const elCursos = document.getElementById('count-cursos');
        const elEstudiantes = document.getElementById('count-estudiantes');

        // Muestra la cantidad total usando .length
        if (elCursos) elCursos.textContent = cursos.length;
        if (elEstudiantes) elEstudiantes.textContent = estudiantes.length;

    } catch (e) {
        // Manejo de errores en caso de que la solicitud falle
        console.error("Error al cargar tarjetas:", e);
    }
}
// Ejecutar la función cuando el archivo HTML esté completamente cargado
document.addEventListener('DOMContentLoaded', DashboardEstadistico);