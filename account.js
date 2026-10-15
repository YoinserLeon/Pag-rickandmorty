// Gestión de la vista de Perfil y edición de datos de usuario
document.addEventListener('DOMContentLoaded', () => {
  // 1. Verificar si existe una sesión activa en sessionStorage
  const sesionActiva = JSON.parse(sessionStorage.getItem('sesionActiva'));
  if (!sesionActiva) {
    window.location.href = 'login.html';
    return;
  }

  // Elementos del DOM
  const inputNombre = document.getElementById('nombre');
  const inputApellido = document.getElementById('apellido');
  const inputCorreo = document.getElementById('correo');
  const inputPassword = document.getElementById('password');
  const inputConfirmPassword = document.getElementById('confirmPassword');
  const alertSuccess = document.getElementById('alertSuccess');
  const accountForm = document.getElementById('accountForm');
  const strengthContainer = document.getElementById('strengthContainer');
  const strengthBar = document.getElementById('strengthBar');
  const strengthText = document.getElementById('strengthText');
  const togglePassword = document.getElementById('togglePassword');
  const toggleConfirm = document.getElementById('toggleConfirm');

  // Alternar visibilidad de contraseñas (Input Text / Password)
  const alternarVisibilidad = (btn, input) => {
    const type = input.type === 'password' ? 'text' : 'password';
    input.type = type;
    btn.innerHTML = type === 'password' ? '<i class="fa-solid fa-eye-slash text-lg"></i>' : '<i class="fa-solid fa-eye text-lg"></i>';
  };

  if (togglePassword && inputPassword) togglePassword.addEventListener('click', () => alternarVisibilidad(togglePassword, inputPassword));
  if (toggleConfirm && inputConfirmPassword) toggleConfirm.addEventListener('click', () => alternarVisibilidad(toggleConfirm, inputConfirmPassword));

  // Indicador dinámico de fortaleza de contraseña
  if (inputPassword && strengthContainer) {
    inputPassword.addEventListener('input', (e) => {
      const val = e.target.value;
      if (val.length === 0) {
        strengthContainer.classList.add('hidden');
        return;
      }
      strengthContainer.classList.remove('hidden');
      
      // Cálculo de puntos según criterios de seguridad
      let puntos = 0;
      if (val.length >= 8) puntos++;
      if (/[A-Z]/.test(val)) puntos++;
      if (/[a-z]/.test(val)) puntos++;
      if (/\d/.test(val)) puntos++;
      if (/[@$!%*?&._\-]/.test(val)) puntos++;

      // Actualizar barra y texto de fortaleza
      if (puntos <= 2) {
        strengthBar.style.width = '33%'; strengthBar.className = 'h-full transition-all duration-300 bg-red-500'; strengthText.textContent = 'Débil'; strengthText.className = 'text-xs mt-1 font-bold text-right text-red-500';
      } else if (puntos <= 4) {
        strengthBar.style.width = '66%'; strengthBar.className = 'h-full transition-all duration-300 bg-yellow-500'; strengthText.textContent = 'Media'; strengthText.className = 'text-xs mt-1 font-bold text-right text-yellow-500';
      } else {
        strengthBar.style.width = '100%'; strengthBar.className = 'h-full transition-all duration-300 bg-green-500'; strengthText.textContent = 'Fuerte'; strengthText.className = 'text-xs mt-1 font-bold text-right text-green-500';
      }
    });
  }

  // Cargar datos actuales en los campos
  inputNombre.value = sesionActiva.nombre || '';
  inputApellido.value = sesionActiva.apellido || '';
  inputCorreo.value = sesionActiva.email || ''; 

  const mostrarError = (idError, mensaje) => {
    const p = document.getElementById(idError);
    if (p) {
      p.textContent = mensaje;
      p.classList.remove('hidden');
    }
  };

  // Procesar actualización de perfil
  accountForm.addEventListener('submit', (e) => {
    e.preventDefault();
    document.querySelectorAll('p[id^="error"]').forEach(p => p.classList.add('hidden'));

    const nombreVal = inputNombre.value.trim();
    const apellidoVal = inputApellido.value.trim();
    const emailVal = inputCorreo.value.trim();
    const passVal = inputPassword.value.trim();
    const confirmPassVal = inputConfirmPassword.value.trim();

    let esValido = true;
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const regexPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&._\-])[A-Za-z\d@$!%*?&._\-]{8,}$/;

    if (!nombreVal) { mostrarError('errorNombre', 'El nombre no puede estar vacío.'); esValido = false; }
    if (!apellidoVal) { mostrarError('errorApellido', 'El apellido no puede estar vacío.'); esValido = false; }
    if (!emailVal || !regexEmail.test(emailVal)) { mostrarError('errorCorreo', 'Ingresa un correo electrónico válido.'); esValido = false; }

    // Validar si el nuevo correo ya pertenece a otro usuario
    let usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
    if (emailVal !== sesionActiva.email) {
      const correoExistente = usuarios.some(u => u.email === emailVal);
      if (correoExistente) {
        mostrarError('errorCorreo', 'Este correo ya pertenece a otra cuenta.');
        esValido = false;
      }
    }

    // Validar nueva contraseña si fue ingresada
    if (passVal.length > 0) {
      if (!regexPassword.test(passVal)) {
        mostrarError('errorPassword', 'La contraseña debe tener mín. 8 caracteres, mayúscula, minúscula, número y carácter especial.');
        esValido = false;
      }
      if (passVal !== confirmPassVal) {
        mostrarError('errorConfirm', 'Las contraseñas no coinciden.');
        esValido = false;
      }
    }

    if (!esValido) return;

    // Actualizar registro en localStorage y sessionStorage
    const indexUsuario = usuarios.findIndex(u => u.email === sesionActiva.email);
    let contraseñaActual = sesionActiva.password;
    if(indexUsuario !== -1) {
        contraseñaActual = passVal.length > 0 ? passVal : usuarios[indexUsuario].password;
    }

    const usuarioActualizado = {
      ...sesionActiva,
      nombre: nombreVal,
      apellido: apellidoVal,
      email: emailVal,
      password: contraseñaActual
    };

    if (indexUsuario !== -1) {
      usuarios[indexUsuario] = usuarioActualizado;
      localStorage.setItem('usuarios', JSON.stringify(usuarios));
    }

    sessionStorage.setItem('sesionActiva', JSON.stringify(usuarioActualizado));

    alertSuccess.classList.remove('hidden');
    setTimeout(() => { alertSuccess.classList.add('hidden'); }, 3000);
  });
});