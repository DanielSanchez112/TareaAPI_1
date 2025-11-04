import axios, { AxiosResponse } from 'axios';
import Constants from 'expo-constants';

// Configuración base de la API
const BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = Constants.expoConfig?.extra?.TMDB_API_KEY || process.env.EXPO_PUBLIC_TMDB_API_KEY;

// Instancia de axios configurada
const tmdbApi = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  params: {
    api_key: API_KEY,
  },
});

// Tipos de datos para TypeScript
export interface TMDBConfiguration {
  images: {
    base_url: string;
    secure_base_url: string;
    backdrop_sizes: string[];
    logo_sizes: string[];
    poster_sizes: string[];
    profile_sizes: string[];
    still_sizes: string[];
  };
  change_keys: string[];
}

export interface Movie {
  id: number;
  title: string;
  overview: string;
  release_date: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  vote_count: number;
  popularity: number;
  genre_ids: number[];
  adult: boolean;
  original_language: string;
  original_title: string;
  video: boolean;
}

export interface MovieSearchResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

// Clase de error personalizada para la API
export class TMDBError extends Error {
  constructor(
    message: string,
    public status?: number,
    public statusText?: string
  ) {
    super(message);
    this.name = 'TMDBError';
  }
}

// Función para manejar respuestas de la API
const handleResponse = async <T>(response: AxiosResponse): Promise<T> => {
  // Verificar el status de la respuesta
  if (response.status === 200 || response.status === 201) {
    return response.data;
  } else {
    throw new TMDBError(
      `Error en la respuesta: ${response.statusText}`,
      response.status,
      response.statusText
    );
  }
};

// Función para manejar errores de la API
const handleError = (error: any): never => {
  if (error.response) {
    // El servidor respondió con un código de error
    const { status, statusText, data } = error.response;
    
    switch (status) {
      case 401:
        throw new TMDBError(
          'Error de autenticación: API key inválida o faltante',
          status,
          statusText
        );
      case 404:
        throw new TMDBError(
          'Recurso no encontrado: La película o endpoint no existe',
          status,
          statusText
        );
      case 429:
        throw new TMDBError(
          'Límite de peticiones excedido: Intenta más tarde',
          status,
          statusText
        );
      default:
        throw new TMDBError(
          data?.status_message || `Error del servidor: ${statusText}`,
          status,
          statusText
        );
    }
  } else if (error.request) {
    // La petición se hizo pero no se recibió respuesta
    throw new TMDBError('Error de red: No se pudo conectar con el servidor');
  } else {
    // Error en la configuración de la petición
    throw new TMDBError(`Error de configuración: ${error.message}`);
  }
};

// Servicio principal para TMDB
export class TMDBService {
  // Obtener configuración de la API
  static async getConfiguration(): Promise<TMDBConfiguration> {
    try {
      const response = await tmdbApi.get('/configuration');
      return handleResponse<TMDBConfiguration>(response);
    } catch (error) {
      return handleError(error);
    }
  }

  // Buscar películas por título
  static async searchMovies(query: string, page: number = 1): Promise<MovieSearchResponse> {
    try {
      if (!query.trim()) {
        throw new TMDBError('El término de búsqueda no puede estar vacío');
      }

      const response = await tmdbApi.get('/search/movie', {
        params: {
          query: query.trim(),
          page,
          language: 'es-ES',
          include_adult: false,
        },
      });

      return handleResponse<MovieSearchResponse>(response);
    } catch (error) {
      return handleError(error);
    }
  }

  // Obtener películas populares
  static async getPopularMovies(page: number = 1): Promise<MovieSearchResponse> {
    try {
      const response = await tmdbApi.get('/movie/popular', {
        params: {
          page,
          language: 'es-ES',
        },
      });

      return handleResponse<MovieSearchResponse>(response);
    } catch (error) {
      return handleError(error);
    }
  }

  // Obtener detalles de una película específica
  static async getMovieDetails(movieId: number): Promise<Movie> {
    try {
      const response = await tmdbApi.get(`/movie/${movieId}`, {
        params: {
          language: 'es-ES',
        },
      });

      return handleResponse<Movie>(response);
    } catch (error) {
      return handleError(error);
    }
  }

  // Función helper para construir URLs de imágenes
  static buildImageUrl(configuration: TMDBConfiguration, path: string | null, size: string = 'w500'): string | null {
    if (!path || !configuration.images?.secure_base_url) {
      return null;
    }
    return `${configuration.images.secure_base_url}${size}${path}`;
  }

  // Verificar si la API key está configurada
//   static isAPIKeyConfigured(): boolean {
//     return !!API_KEY && API_KEY !== '';
//   }
}