# TMDB Movie App

Una aplicación React Native con Expo que consume la API de The Movie Database (TMDB) para mostrar información de películas.

## Características

- ✅ Configuración segura de API key usando expo-constants
- ✅ Manejo robusto de errores (401, 404, timeout, etc.)
- ✅ Verificación de response.status antes de procesar JSON
- ✅ Bloques try-catch en todas las peticiones
- ✅ Interfaz clara para mostrar datos de películas
- ✅ Búsqueda de películas por título
- ✅ Visualización de películas populares
- ✅ Muestra configuración de la API

## Configuración

### 1. Obtener API Key de TMDB

1. Ve a https://developer.themoviedb.org/docs/getting-started
2. Regístrate para obtener una cuenta
3. Ve a tu perfil > Settings > API
4. Genera tu API key y Access Token

### 2. Configurar variables de entorno

1. Copia el archivo `.env.example` a `.env`:
   ```bash
   cp .env.example .env
   ```

2. Edita el archivo `.env` y reemplaza los valores:
   ```
   EXPO_PUBLIC_TMDB_API_KEY=tu_api_key_real_aqui
   EXPO_PUBLIC_TMDB_ACCESS_TOKEN=tu_access_token_real_aqui
   ```

   **⚠️ IMPORTANTE:** 
   - NO incluyas el archivo `.env` en tu repositorio git
   - El archivo `.env` ya está en `.gitignore`
   - Usa solo la API key, no la hardcodees en el código

### 3. Instalar dependencias

```bash
npm install
```

### 4. Ejecutar la aplicación

```bash
# Para desarrollo
npm start

# Para ejecutar en Android
npm run android

# Para ejecutar en iOS
npm run ios

# Para ejecutar en web
npm run web
```

## Estructura del proyecto

```
├── services/
│   └── tmdbService.ts          # Servicio para API de TMDB
├── app/
│   └── (tabs)/
│       └── index.tsx           # Pantalla principal
├── .env                        # Variables de entorno (NO subir a git)
├── .env.example               # Ejemplo de variables de entorno
└── README.md                  # Este archivo
```

## Funcionalidades implementadas

### ✅ Manejo de errores robusto

- **Error 401**: API key inválida o faltante
- **Error 404**: Película o endpoint no encontrado
- **Error 429**: Límite de peticiones excedido
- **Errores de red**: Timeout o problemas de conectividad
- **Otros errores**: Manejo genérico con mensajes descriptivos

### ✅ Verificación de respuestas

- Verificación de `response.status` antes de procesar JSON
- Manejo de diferentes códigos de estado HTTP
- Timeout configurado para evitar bloqueos

### ✅ Seguridad

- API key no hardcodeada en el código fuente
- Uso de expo-constants para variables de entorno
- Archivo .env en .gitignore

### ✅ Interfaz de usuario

- Muestra configuración de TMDB (base URLs, tamaños disponibles)
- Lista de películas populares al inicio
- Búsqueda de películas por título
- Información detallada de cada película:
  - Título y fecha de estreno
  - Calificación y número de votos
  - Popularidad e idioma original
  - Sinopsis
  - Póster (cuando está disponible)

## Endpoints utilizados

1. **Configuration**: `GET /configuration`
   - Obtiene la configuración de la API de TMDB
   - Incluye URLs base para imágenes y tamaños disponibles

2. **Popular Movies**: `GET /movie/popular`
   - Obtiene las películas más populares

3. **Search Movies**: `GET /search/movie`
   - Busca películas por título

## Manejo de datos

La aplicación procesa y muestra la estructura JSON de TMDB de forma clara:

- **Información básica**: título, fecha, idioma
- **Métricas**: calificación, votos, popularidad
- **Contenido**: sinopsis, póster
- **Metadatos**: ID, géneros, estado adulto

## Tecnologías utilizadas

- React Native + Expo
- TypeScript
- Axios para peticiones HTTP
- expo-constants para variables de entorno
- expo-image para optimización de imágenes