 // verifica si el usuario está autenticado al cargar la página
document.addEventListener('DOMContentLoaded', () => {
  const sesionActiva = localStorage.getItem('estaAutenticado');
  if (sesionActiva !== 'true') {
    window.location.href = 'login.html';
  } else {
    document.getElementById('pantalla-app').style.display = 'block';
  }
});

// sirve para mostrar el menu lateral en dispositivos moviles
document.getElementById('btn-menu').addEventListener('click', () => {
  document.getElementById('menu-lateral').classList.toggle('mostrar');
}); 
// sirve para mostrar el contenido de cada pestana
document.querySelectorAll('.btn-pestana').forEach(enlace => {
  enlace.addEventListener('click', function () {
    document.querySelectorAll('.btn-pestana').forEach(el => el.classList.remove('activo'));
    this.classList.add('activo');
  });
});