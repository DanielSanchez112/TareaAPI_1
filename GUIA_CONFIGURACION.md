# Guía de Configuración y Captura de Pantallas

## ⚠️ PASO CRÍTICO: Configurar tu API Key

Antes de ejecutar la aplicación, DEBES configurar tu API Key de TMDB:

1. **Ve a https://developer.themoviedb.org/docs/getting-started**
2. **Regístrate o inicia sesión**
3. **Ve a tu perfil > Settings > API**
4. **Copia tu API Key**
5. **Edita el archivo `.env` en la raíz del proyecto:**

```env
EXPO_PUBLIC_TMDB_API_KEY=TU_API_KEY_REAL_AQUI
EXPO_PUBLIC_TMDB_ACCESS_TOKEN=TU_ACCESS_TOKEN_AQUI
```

## Ejecutar la aplicación

```bash
# Instalar dependencias si no lo has hecho
npm install

# Iniciar la aplicación
npm start
```

## Capturas de pantalla para el PDF

Para documentar el proyecto, toma capturas de:

### 1. Código fuente
- **tmdbService.ts**: Muestra el manejo de errores try-catch
- **index.tsx**: Muestra la implementación de la interfaz
- **.env.example**: Muestra que no se hardcodea la API key

### 2. Aplicación funcionando
- **Pantalla inicial**: Con configuración de TMDB y películas populares
- **Búsqueda**: Busca una película (ej: "Avengers")
- **Manejo de errores**: Sin API key configurada
- **Detalles de película**: Información completa mostrada

### 3. Configuración de TMDB
- **Panel de TMDB**: Muestra la API key generada
- **Documentación**: https://developer.themoviedb.org/reference/configuration-details

## Funciones implementadas que debes mostrar

### ✅ Endpoint de configuración
La app hace una petición a `/configuration` y muestra:
- Base URL de imágenes
- Tamaños disponibles para pósters
- Tamaños disponibles para backdrops

### ✅ Manejo de errores
- Error 401: API key inválida
- Error 404: Recurso no encontrado  
- Error de red: Sin conexión
- Timeout: Petición demorada

### ✅ Verificación de response.status
En `tmdbService.ts` línea ~67:
```typescript
if (response.status === 200 || response.status === 201) {
  return response.data;
} else {
  throw new TMDBError(...)
}
```

### ✅ Bloques try-catch
Todos los métodos del servicio usan try-catch:
- `getConfiguration()`
- `searchMovies()`
- `getPopularMovies()`

### ✅ Estructura JSON procesada
La app muestra de forma ordenada:
- Título, fecha de estreno
- Calificación y votos
- Popularidad
- Idioma original
- Sinopsis
- Póster (si disponible)

## Errores comunes y soluciones

### "API Key no configurada"
- Verifica que el archivo `.env` existe
- Verifica que la variable se llama `EXPO_PUBLIC_TMDB_API_KEY`
- Reinicia el servidor después de cambiar `.env`

### "Error 401"
- Tu API key es incorrecta
- Verifica que copiaste la API key completa
- Asegúrate de que tu cuenta TMDB esté activa

### No se muestran imágenes
- Las imágenes requieren configuración válida
- Verifica que el endpoint `/configuration` funcione primero

## Estructura del proyecto final

```
TareaAPI_1/
├── services/
│   └── tmdbService.ts     # ✅ Servicio con manejo de errores
├── app/
│   └── (tabs)/
│       └── index.tsx      # ✅ Interfaz con datos ordenados
├── .env                   # ✅ Variables de entorno (NO subir a git)
├── .env.example          # ✅ Ejemplo sin credenciales reales
├── README.md             # ✅ Documentación completa
└── package.json          # ✅ Con axios instalado
```

## Verificación final

Antes de crear el PDF, verifica que:
- [ ] La app se ejecuta sin errores
- [ ] Muestra la configuración de TMDB
- [ ] Busca películas correctamente
- [ ] Maneja errores apropiadamente
- [ ] No hay API keys hardcodeadas en el código
- [ ] El código usa try-catch y verifica response.status