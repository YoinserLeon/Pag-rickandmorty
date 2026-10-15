// Módulo de integración con la API REST pública de Rick and Morty
const API_URL = 'https://rickandmortyapi.com/api/character';

/**
 * Realiza la petición para obtener los primeros 20 personajes
 * @returns {Promise<Array>} Lista de personajes o arreglo vacío en caso de error
 */
export async function obtenerPersonajes() {
  try {
    const respuesta = await fetch(API_URL);
    if (!respuesta.ok) throw new Error(`Error HTTP: ${respuesta.status}`);
    const datos = await respuesta.json();
    return datos.results;
  } catch (error) {
    console.error('Error al consumir la API:', error);
    return [];
  }
}