document.addEventListener('DOMContentLoaded', () => {
  // Objeto con las expresiones regulares (incluyendo el punto '.' en la contraseña)
  const regex = {
    nombres: /^[a-zA-ZÀ-ÿ\s]{2,10}$/,
    correo: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
    password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.])[A-Za-z\d@$!%*?&.]{8,}$/
  };

  // Función para gestionar los colores de los bordes y los mensajes de error
  const gestionarError = (input, mensajeElemento, esValido, mensaje = "") => {
    input.classList.remove('border-gray-300', 'border-red-500', 'border-green-500', 'bg-red-50', 'bg-green-50');

    if (esValido) {
      input.classList.add('border-green-500', 'bg-green-50');
      if (mensajeElemento) mensajeElemento.classList.add('hidden');
    } else {
      input.classList.add('border-red-500', 'bg-red-50');
      if (mensajeElemento) {
        mensajeElemento.classList.remove('hidden');
        if (mensaje) mensajeElemento.textContent = mensaje;
      }
    }
  };

  // ==========================================
  // LÓGICA DE MOSTRAR/OCULTAR CONTRASEÑA (Global)
  // ==========================================
  const toggleVisibility = (btnId, inputId) => {
    const btn = document.getElementById(btnId);
    const inputElement = document.getElementById(inputId);
    
    if(btn && inputElement) {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const isPassword = inputElement.type === 'password';
        inputElement.type = isPassword ? 'text' : 'password';
        
        const icon = btn.querySelector('i');
        if (isPassword) {
          icon.classList.remove('fa-eye-slash');
          icon.classList.add('fa-eye');
        } else {
          icon.classList.remove('fa-eye');
          icon.classList.add('fa-eye-slash');
        }
      });
    }
  };

  // ==========================================
  // LÓGICA DEL REGISTRO (Tu código intacto)
  // ==========================================
  const registerForm = document.getElementById('registerForm');
  if (registerForm) {
    const nombre = document.getElementById('nombre');
    const apellido = document.getElementById('apellido');
    const correo = document.getElementById('correo');
    const password = document.getElementById('password');
    const confirmPassword = document.getElementById('confirmPassword');

    toggleVisibility('togglePassword', 'password');
    toggleVisibility('toggleConfirm', 'confirmPassword');

    // Validaciones en tiempo real
    const validarTexto = (input, regla, errorId, mensajeRegla) => {
      const valor = input.value.trim();
      const mensajeElemento = document.getElementById(errorId);
      
      if (valor === '') {
        gestionarError(input, mensajeElemento, false, "Este campo es obligatorio.");
        return false;
      }
      if (!regla.test(valor)) {
        gestionarError(input, mensajeElemento, false, mensajeRegla);
        return false;
      }
      gestionarError(input, mensajeElemento, true);
      return true;
    };

    const validarCorreo = () => {
      const valor = correo.value.trim();
      const mensajeElemento = document.getElementById('errorCorreo');
      
      if (valor === '') {
        gestionarError(correo, mensajeElemento, false, "El correo es obligatorio.");
        return false;
      }
      if (!regex.correo.test(valor)) {
        gestionarError(correo, mensajeElemento, false, "Debes incluir un '@' y un formato válido.");
        return false;
      }
      
      let usuarios = JSON.parse(localStorage.getItem('users')) || [];
      const correoExiste = usuarios.some(user => user.correo === valor);
      if (correoExiste) {
        gestionarError(correo, mensajeElemento, false, "Este correo ya está registrado.");
        return false;
      }
      
      gestionarError(correo, mensajeElemento, true);
      return true;
    };

    const validarConfirmacion = () => {
      const valor = confirmPassword.value;
      const mensajeElemento = document.getElementById('errorConfirm');
      
      if (valor === '') {
        gestionarError(confirmPassword, mensajeElemento, false, "Debes confirmar tu contraseña.");
        return false;
      }
      if (valor !== password.value) {
        gestionarError(confirmPassword, mensajeElemento, false, "Las contraseñas no coinciden.");
        return false;
      }
      
      gestionarError(confirmPassword, mensajeElemento, true);
      return true;
    };

    nombre.addEventListener('input', () => validarTexto(nombre, regex.nombres, 'errorNombre', "Mínimo 2 letras, sin números."));
    apellido.addEventListener('input', () => validarTexto(apellido, regex.nombres, 'errorApellido', "Mínimo 2 letras, sin números."));
    correo.addEventListener('input', validarCorreo);
    
    password.addEventListener('input', () => {
      validarTexto(password, regex.password, 'errorPassword', "Mín 8 caracteres, 1 Mayúscula, 1 Minúscula, 1 Número, 1 Símbolo (puede incluir .).");
      if(confirmPassword.value.length > 0) {
        validarConfirmacion();
      }
    });

    confirmPassword.addEventListener('input', validarConfirmacion);

    registerForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const isNombreValid = validarTexto(nombre, regex.nombres, 'errorNombre', "Mínimo 2 letras, sin números.");
      const isApellidoValid = validarTexto(apellido, regex.nombres, 'errorApellido', "Mínimo 2 letras, sin números.");
      const isCorreoValid = validarCorreo();
      const isPasswordValid = validarTexto(password, regex.password, 'errorPassword', "Mín 8 caracteres, 1 Mayúscula, 1 Minúscula, 1 Número, 1 Símbolo (puede incluir .).");
      const isConfirmValid = validarConfirmacion();

      if (isNombreValid && isApellidoValid && isCorreoValid && isPasswordValid && isConfirmValid) {
        let usuarios = JSON.parse(localStorage.getItem('users')) || [];
        const nuevoUsuario = {
          id: Date.now(),
          nombre: nombre.value.trim(),
          apellido: apellido.value.trim(),
          correo: correo.value.trim(),
          password: password.value 
        };

        usuarios.push(nuevoUsuario);
        localStorage.setItem('users', JSON.stringify(usuarios));
        
        registerForm.reset();
        window.location.href = 'login.html';
      }
    });
  } // <-- Aquí termina tu código de registro seguro

  // ==========================================
  // LÓGICA DEL LOGIN (Nueva parte)
  // ==========================================
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    const loginCorreo = document.getElementById('loginCorreo');
    const loginPassword = document.getElementById('loginPassword');
    const loginAlert = document.getElementById('loginAlert');

    // Reutilizamos tu función del ojito para el login
    toggleVisibility('toggleLoginPassword', 'loginPassword');

    // Quitar alerta roja cuando el usuario empiece a corregir los datos
    const ocultarAlerta = () => {
      if(loginAlert) loginAlert.classList.add('hidden');
    };
    if (loginCorreo) loginCorreo.addEventListener('input', ocultarAlerta);
    if (loginPassword) loginPassword.addEventListener('input', ocultarAlerta);

    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const correoVal = loginCorreo.value.trim();
      const passVal = loginPassword.value;
      let isValid = true;

      // Validar que los campos no estén vacíos
      if (correoVal === '') {
        gestionarError(loginCorreo, document.getElementById('errorLoginCorreo'), false, "Por favor, ingresa tu correo.");
        isValid = false;
      } else {
        gestionarError(loginCorreo, document.getElementById('errorLoginCorreo'), true);
      }

      if (passVal === '') {
        gestionarError(loginPassword, document.getElementById('errorLoginPassword'), false, "Por favor, ingresa tu contraseña.");
        isValid = false;
      } else {
        gestionarError(loginPassword, document.getElementById('errorLoginPassword'), true);
      }

      if (!isValid) return; // Si algo está vacío, detenemos el proceso

      // Buscar al usuario en localStorage
      let usuarios = JSON.parse(localStorage.getItem('users')) || [];
      const usuarioEncontrado = usuarios.find(user => user.correo === correoVal && user.password === passVal);

      if (usuarioEncontrado) {
        // Inicio de sesión exitoso: Guardar la sesión y redirigir
        localStorage.setItem('sesionActiva', JSON.stringify(usuarioEncontrado));
        window.location.href = 'index.html'; 
      } else {
        // Correo o contraseña equivocados
        loginAlert.classList.remove('hidden');
        gestionarError(loginCorreo, null, false);
        gestionarError(loginPassword, null, false);
      }
    });
  }
});