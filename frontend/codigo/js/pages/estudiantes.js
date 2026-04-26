const generarTablaEstudiantes = (estudiantes = []) => {
    const filas = estudiantes.length
        ? estudiantes
            .map(
                (estudiante, index) => `
            <tr>
              <th scope="row">${index + 1}</th>
              <td>${estudiante.documento ?? ""}</td>
              <td>${estudiante.apellido ?? ""}</td>
              <td>${estudiante.nombres ?? ""}</td>
              <td>${estudiante.email ?? ""}</td>
            </tr>`,
            )
            .join("")
        : `
        <tr>
          <td colspan="5" class="text-center py-4">No hay estudiantes para mostrar</td>
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

const renderizarTablaEstudiantes = async () => {
    const contenedor = document.getElementById("tabla-estudiantes");

    if (!contenedor) {
        return;
    }

    contenedor.innerHTML = '<p class="text-muted">Cargando estudiantes...</p>';

    try {
        const estudiantes = await obtenerEstudiantes();
        contenedor.innerHTML = generarTablaEstudiantes(estudiantes);
    } catch (error) {
        console.error("No se pudieron cargar los estudiantes:", error);
        contenedor.innerHTML =
            '<div class="alert alert-danger">No se pudo cargar la lista de estudiantes.</div>' + error;
    }
};

document.addEventListener("DOMContentLoaded", renderizarTablaEstudiantes);
