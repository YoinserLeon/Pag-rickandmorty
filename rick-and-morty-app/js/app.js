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

// 5. Consumir la API de Rick and Morty
  const characterContainer = document.getElementById('characterContainer');

  const obtenerPersonajes = async () => {
    try {
      // Llamada a la API pública
      const respuesta = await fetch('https://rickandmortyapi.com/api/character');
      const datos = await respuesta.json();
      
      // Limpiar el contenedor del HTML
      characterContainer.innerHTML = '';

      // Recorrer el array de personajes (los primeros 20) y crear sus tarjetas
      datos.results.forEach(personaje => {
        const card = document.createElement('div');
        // Clases de Tailwind para la tarjeta
        card.className = 'bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300';
        
        // Lógica visual para el punto de estado (Verde = Vivo, Rojo = Muerto, Gris = Desconocido)
        const statusColor = personaje.status === 'Alive' ? 'bg-green-500' : personaje.status === 'Dead' ? 'bg-red-500' : 'bg-gray-500';

        // Inyectar el HTML de cada tarjeta usando interpolación (las comillas invertidas ` `)
        card.innerHTML = `
          <img src="${personaje.image}" alt="${personaje.name}" class="w-full h-48 object-cover">
          <div class="p-4">
            <h3 class="text-xl font-bold text-gray-800 mb-1 truncate">${personaje.name}</h3>
            <div class="flex items-center gap-2 text-sm text-gray-600 mb-2">
              <span class="w-3 h-3 rounded-full ${statusColor}"></span>
              <span>${personaje.status} - ${personaje.species}</span>
            </div>
            <p class="text-sm text-gray-500 truncate"><span class="font-semibold text-gray-700">Origen:</span> ${personaje.origin.name}</p>
          </div>
        `;
        
        // Agregar la tarjeta terminada al contenedor de la página
        characterContainer.appendChild(card);
      });
    } catch (error) {
      characterContainer.innerHTML = '<p class="text-red-600 font-bold col-span-full text-center">Error al conectar con la base de datos del multiverso.</p>';
      console.error('Error consumiendo la API:', error);
    }
  };

  // Ejecutar la función automáticamente al entrar
  obtenerPersonajes();