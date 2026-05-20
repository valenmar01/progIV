// Referencias a los elementos del DOM
const formulario = document.getElementById('formulario-login');
const inputUsuario = document.getElementById('input-usuario');
const inputContrasenia = document.getElementById('input-contrasenia');
const mensajeError = document.getElementById('error-login');

<<<<<<< HEAD
// sirve para manejar el evento de envío del formulario
=======
const mostrarError = (msg) => {
  mensajeError.textContent = msg;
  mensajeError.style.display = "block";
};

const ocultarError = () => {
  mensajeError.textContent = "";
  mensajeError.style.display = "none";
};

>>>>>>> c9a50f06472a261f40b729778a366f76e32dd7d4
formulario.addEventListener('submit', async (e) => {
    // Evitamos que la página se recargue
    e.preventDefault();

    const usuarioIngresado = inputUsuario.value.trim();
    const contraseniaIngresada = inputContrasenia.value;
    
<<<<<<< HEAD
    // Validación de campos vacíos
    if (!usuarioIngresado || !contrasenaIngresada) {
        mensajeError.textContent = 'Por favor, completa todos los campos.';
        return;
    }

    try {
        // Hacemos la llamada al backend
        const res = await fetch("http://localhost:3000/login", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                usuario: usuarioIngresado,
                contrasenia: contrasenaIngresada
            })
        });

        // Verificamos si la respuesta es correcta
        if (usuarioIngresado === "admin" && contrasenaIngresada === "1234") {
            // El usuario y contraseña son correctos, guardamos la sesión y redirigimos a index.html
            localStorage.setItem('estaAutenticado', 'true');
            alert('¡Bienvenido al sistema!');
            window.location.href = 'index.html';
        } else {
            // El usuario o contraseña fueron rechazados por el servidor
            mensajeError.textContent = 'Usuario o contraseña incorrectos.';
            inputContrasena.value = '';
            inputContrasena.focus();
        }

    } catch (error) {
        // Esto ocurre si el servidor está apagado o hay un error de conexión
        console.error("Error de conexión:", error);
        mensajeError.textContent = 'Error al conectar con el servidor. Inténtalo más tarde.';
    }
=======
    const res = await fetch("http://localhost:3000/login", {
        method: 'post',
        headers: {
            'Content-Type':'application/json'
        },
        body: JSON.stringify(
            {
            usuario: usuarioIngresado,
            //contrasenia: contraseniaIngresada
        })
    });

    const data = await res.json();

    console.log(res);
    console.log(usuarioIngresado);
    console.log(contraseniaIngresada);
    

    // Limpiar mensajes previos
    //mensajeError.textContent = '';
    ocultarError();

    // Lógica de validación
    if (res.status === 200) { 
                
        // Éxito: Guardamos una sesión simple (opcional) y redirigimos
        localStorage.setItem('estaAutenticado', 'true');
        alert('¡Bienvenido al sistema!');
        
        window.location.href = 'index.html';
    
    } else if (res.status === 404) {

      // El backend avisa que no existe
        mensajeError.textContent = 'Usuario o contraseña incorrectos.';
        mostrarError('Usuario o contraseña incorrectos.');
        inputContrasenia.value = ''; // Limpiar clave por seguridad
        console.log(mensajeError);
        inputUsuario.focus();
        inputContrasenia.focus();

  } else {
    
        mostrarError('Ocurrió un error en el servidor.');    
        console.log(mensajeError);
    } 
>>>>>>> c9a50f06472a261f40b729778a366f76e32dd7d4
});