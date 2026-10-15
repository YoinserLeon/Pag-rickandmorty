// Verifica si hay una sesión activa
export function verificarAutenticacion() {
  const usuarioGuardado = localStorage.getItem('usuarioLogueado');
  
  if (!usuarioGuardado) {
    // Si no hay sesión, redirige al login
    window.location.href = 'login.html';
    return null;
  }
  
  try {
    return JSON.parse(usuarioGuardado);
  } catch (error) {
    console.error('Error al parsear el usuario:', error);
    localStorage.removeItem('usuarioLogueado');
    window.location.href = 'login.html';
    return null;
  }
}

// Cierra la sesión borrando la clave y redirigiendo
export function cerrarSesion() {
  localStorage.removeItem('usuarioLogueado');
  window.location.href = 'login.html';
}