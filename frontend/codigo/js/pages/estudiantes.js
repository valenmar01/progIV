const estudiantes = [
    {
        documento: "12345678",
        apellido: "Cejas",
        nombres: "Claudio Alejandro",
        email: "cejasclaudioalejandro@gmail.com"
    },
    {
        documento: "87654321",
        apellido: "Martinez",
        nombres: "Valentina",
        email: "valentina.martinez@correo.com",
    },
    {
        documento: "11223344",
        apellido: "Magali",
        nombres: "Castell",
        email: "castell.magali@correo.com",
    },
    {
        documento: "1122134",
        apellido: "Segovia",
        nombres: "Tomas",
        email: "tomas.segovia@correo.com",
    },
    {
        documento: "1128907544",
        apellido: "Ignacio",
        nombres: "Denis",
        email: "denis.ignacio@correo.com",
    },

];





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
}






function renderizarTablaEstudiantes() {
    const contenedor = document.getElementById("tabla-estudiantes");

    if (!contenedor) {
        return;
    }

    contenedor.innerHTML = generarTablaEstudiantes(estudiantes);
}

document.addEventListener("DOMContentLoaded", renderizarTablaEstudiantes);