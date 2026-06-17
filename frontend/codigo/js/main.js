 // verifica si el usuario está autenticado al cargar la página
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('pantalla-app').style.display = 'block';
 
  const tokenGuardado = sessionStorage.getItem('token');
  
  if (!tokenGuardado && !window.location.href.includes('login.html')) {
    window.location.href = 'login.html';
    return;
  } 
  const pantallaApp = document.getElementById('pantalla-app');
  if (pantallaApp) {
      pantallaApp.style.display = 'block';
  }

  //cerrar sesión
  const btnCerrarSesion = document.getElementById('btn-cerrar-sesion');
  if (btnCerrarSesion){
    btnCerrarSesion.addEventListener("click", () => {
      sessionStorage.removeItem('token');
      sessionStorage.clear(); //limpia memoria de sesion
      window.location.href = 'login.html';
    })
  }

  // logica para el iframe
  const iframe = document.querySelector('iframe[name=\"contenedor-paginas\"]');
  document.querySelectorAll('.btn-pestana').forEach(enlace => {
    enlace.addEventListener('click', function (e) {
      e.preventDefault();
      document.querySelectorAll('.btn-pestana').forEach(el => el.classList.remove('activo'));
      this.classList.add('activo');
      iframe.src = this.getAttribute('href');
    });
  });
});

// sirve para mostrar el menu lateral en dispositivos moviles
const btnMenu = document.getElementById('btn-menu');
if (btnMenu) {
  btnMenu.addEventListener('click', () => {
    document.getElementById('menu-lateral').classList.toggle('mostrar');
  });
}