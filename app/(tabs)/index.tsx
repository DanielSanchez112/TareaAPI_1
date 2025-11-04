import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  ScrollView, 
  TextInput, 
  TouchableOpacity, 
  Alert,
  ActivityIndicator,
  RefreshControl
} from 'react-native';
import { Image } from 'expo-image';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { TMDBService, TMDBConfiguration, Movie, TMDBError } from '@/services/tmdbService';

export default function HomeScreen() {
  const [configuration, setConfiguration] = useState<TMDBConfiguration | null>(null);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadConfiguration();
    loadPopularMovies();
  }, []);

  const loadConfiguration = async () => {
    try {
      setError(null);
      // if (!TMDBService.isAPIKeyConfigured()) {
      //   setError('API Key no configurada. Por favor, configura tu TMDB_API_KEY en el archivo .env');
      //   return;
      // }

      const config = await TMDBService.getConfiguration();
      setConfiguration(config);
    } catch (error) {
      console.error('Error loading configuration:', error);
      if (error instanceof TMDBError) {
        setError(`Error de configuración: ${error.message}`);
      } else {
        setError('Error inesperado al cargar la configuración');
      }
    }
  };

  const loadPopularMovies = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // if (!TMDBService.isAPIKeyConfigured()) {
      //   setError('API Key no configurada');
      //   return;
      // }

      const response = await TMDBService.getPopularMovies();
      setMovies(response.results.slice(0, 10));
    } catch (error) {
      console.error('Error loading popular movies:', error);
      if (error instanceof TMDBError) {
        setError(`Error al cargar películas: ${error.message}`);
      } else {
        setError('Error inesperado al cargar películas');
      }
    } finally {
      setLoading(false);
    }
  };

  const searchMovies = async () => {
    if (!searchQuery.trim()) {
      Alert.alert('Error', 'Por favor ingresa un término de búsqueda');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const response = await TMDBService.searchMovies(searchQuery);
      setMovies(response.results.slice(0, 10));
      
      if (response.results.length === 0) {
        Alert.alert('Sin resultados', 'No se encontraron películas con ese término');
      }
    } catch (error) {
      console.error('Error searching movies:', error);
      if (error instanceof TMDBError) {
        Alert.alert('Error de búsqueda', error.message);
      } else {
        Alert.alert('Error', 'Error inesperado al buscar películas');
      }
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadConfiguration();
    await loadPopularMovies();
    setRefreshing(false);
  };

  const getImageUrl = (path: string | null): string | null => {
    if (!configuration || !path) return null;
    return TMDBService.buildImageUrl(configuration, path, 'w300');
  };

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <ThemedView style={styles.header}>
        <ThemedText type="title">TMDB Movie App</ThemedText>
        <ThemedText type="subtitle">The Movie Database API Demo</ThemedText>
      </ThemedView>

      {error && (
        <ThemedView style={styles.errorContainer}>
          <ThemedText style={styles.errorText}>{error}</ThemedText>
        </ThemedView>
      )}

      {/* Sección de búsqueda */}
      <ThemedView style={styles.section}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>Buscar Películas</ThemedText>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar películas..."
            placeholderTextColor="#666"
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={searchMovies}
          />
          <TouchableOpacity 
            style={styles.searchButton} 
            onPress={searchMovies}
            disabled={loading}
          >
            <ThemedText style={styles.searchButtonText}>
              {loading ? 'Buscando...' : 'Buscar'}
            </ThemedText>
          </TouchableOpacity>
        </View>
      </ThemedView>

      {/* Loading indicator */}
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0066cc" />
          <ThemedText>Cargando...</ThemedText>
        </View>
      )}

      {/* Lista de películas */}
      <ThemedView style={styles.section}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>
          {searchQuery ? `Resultados para "${searchQuery}"` : 'Películas Populares'}
        </ThemedText>
        
        {movies.map((movie) => (
          <ThemedView key={movie.id} style={styles.movieCard}>
            <View style={styles.movieContent}>
              {getImageUrl(movie.poster_path) ? (
                <Image
                  source={{ uri: getImageUrl(movie.poster_path)! }}
                  style={styles.moviePoster}
                  contentFit="cover"
                />
              ) : (
                <View style={styles.noPosterContainer}>
                  <ThemedText style={styles.noPosterText}>Sin imagen</ThemedText>
                </View>
              )}
              
              <View style={styles.movieDetails}>
                <ThemedText type="defaultSemiBold" style={styles.movieTitle}>
                  {movie.title}
                </ThemedText>
                
                <ThemedText style={styles.movieInfo}>
                  📅 {movie.release_date || 'Fecha no disponible'}
                </ThemedText>
                
                <ThemedText style={styles.movieInfo}>
                  ⭐ {movie.vote_average.toFixed(1)}/10 ({movie.vote_count} votos)
                </ThemedText>
                
                <ThemedText style={styles.movieInfo}>
                  🌟 Popularidad: {movie.popularity.toFixed(0)}
                </ThemedText>
                
                <ThemedText style={styles.movieInfo}>
                  🌍 Idioma: {movie.original_language.toUpperCase()}
                </ThemedText>
                
                {movie.overview && (
                  <ThemedText style={styles.movieOverview} numberOfLines={3}>
                    {movie.overview}
                  </ThemedText>
                )}
              </View>
            </View>
          </ThemedView>
        ))}
        
        {!loading && movies.length === 0 && !error && (
          <ThemedView style={styles.emptyContainer}>
            <ThemedText>No hay películas para mostrar</ThemedText>
          </ThemedView>
        )}
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#0066cc',
  },
  section: {
    margin: 16,
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  errorContainer: {
    margin: 16,
    padding: 16,
    backgroundColor: '#ffebee',
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#f44336',
  },
  errorText: {
    color: '#c62828',
    fontSize: 14,
  },
  sectionTitle: {
    color: '#000000',
    fontWeight: 'bold',
  },
  searchContainer: {
    flexDirection: 'row',
    marginTop: 8,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: 'white',
  },
  searchButton: {
    backgroundColor: '#0066cc',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    justifyContent: 'center',
  },
  searchButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
  },
  movieCard: {
    marginTop: 12,
    padding: 12,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#eee',
  },
  movieContent: {
    flexDirection: 'row',
  },
  moviePoster: {
    width: 80,
    height: 120,
    borderRadius: 8,
    marginRight: 12,
  },
  noPosterContainer: {
    width: 80,
    height: 120,
    backgroundColor: '#e0e0e0',
    borderRadius: 8,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noPosterText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  movieDetails: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  movieTitle: {
    fontSize: 16,
    marginBottom: 4,
    color: '#333',
  },
  movieInfo: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  movieOverview: {
    fontSize: 12,
    color: '#555',
    marginTop: 4,
    lineHeight: 16,
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
  },
});
