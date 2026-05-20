// Referencias a los elementos del DOM
const formulario = document.getElementById('formulario-login');
const inputUsuario = document.getElementById('input-usuario');
const inputContrasenia = document.getElementById('input-contrasenia');
const mensajeError = document.getElementById('error-login');

const mostrarError = (msg) => {
  mensajeError.textContent = msg;
  mensajeError.style.display = "block";
};

const ocultarError = () => {
  mensajeError.textContent = "";
  mensajeError.style.display = "none";
};

formulario.addEventListener('submit', async (e) => {
    // Evitamos que la página se recargue
    e.preventDefault();

    const usuarioIngresado = inputUsuario.value.trim();
    const contraseniaIngresada = inputContrasenia.value;
    
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
});