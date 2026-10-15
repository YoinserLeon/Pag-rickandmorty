// Obtener la lista de favoritos del localStorage
export function obtenerFavoritos() {
  return JSON.parse(localStorage.getItem('favoritos')) || [];
}

// Verificar si un personaje ya es favorito
export function esFavorito(id) {
  const favoritos = obtenerFavoritos();
  return favoritos.some(p => p.id === id);
}

// Agregar o quitar un personaje de favoritos (Toggle)
export function toggleFavorito(personaje) {
  let favoritos = obtenerFavoritos();
  const index = favoritos.findIndex(p => p.id === personaje.id);

  if (index >= 0) {
    // Si ya existe, lo eliminamos
    favoritos.splice(index, 1);
    localStorage.setItem('favoritos', JSON.stringify(favoritos));
    return false; // Devuelve false indicando que ya no es favorito
  } else {
    // Si no existe, lo agregamos
    favoritos.push(personaje);
    localStorage.setItem('favoritos', JSON.stringify(favoritos));
    return true; // Devuelve true indicando que ahora es favorito
  }
}