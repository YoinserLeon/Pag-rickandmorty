document.addEventListener('DOMContentLoaded', () => {
  // 1. Verificar si hay una sesión activa en localStorage
  const sesionActiva = JSON.parse(localStorage.getItem('sesionActiva'));

  // 2. Proteger la ruta: si no hay sesión, expulsar al usuario al login
  if (!sesionActiva) {
    window.location.href = 'login.html';
    return; // Detiene la ejecución del resto del código
  }

  // 3. Mostrar el nombre del usuario en la barra de navegación
  const userGreeting = document.getElementById('userGreeting');
  if (userGreeting) {
    userGreeting.textContent = `Hola, ${sesionActiva.nombre}`;
  }

  // 4. Lógica para cerrar sesión
  const btnLogout = document.getElementById('btnLogout');
  if (btnLogout) {
    btnLogout.addEventListener('click', () => {
      // Eliminar solo la sesión activa (mantiene a los usuarios registrados)
      localStorage.removeItem('sesionActiva');
      // Redirigir al login
      window.location.href = 'login.html';
    });
  }
});