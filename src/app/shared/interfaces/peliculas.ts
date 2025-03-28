import { FavoritosService } from '../../services/favoritos.service';
export interface Peliculas {
  page:          number;
  results:       Result[];
  total_pages:   number;
  total_results: number;
}

export interface Result {
  adult:             boolean;
  backdrop_path:     null | string;
  genre_ids:         number[];
  id:                number;
  original_language: string;
  original_title:    string;
  overview:          string;
  popularity:        number;
  poster_path:       string;
  release_date:      string;
  title:             string;
  video:             boolean;
  vote_average:      number;
  vote_count:        number;
}

export interface DB{
  users: User[];
  peliculas: Peliculas[];

}

export interface Favoritos{
  id_favorito: number;
  id_usuario: number;
  id_pelicula: number;
}

export interface User {
  id_usuario: number;      // ID del usuario
  usuario: string;         // Nombre de usuario
  nombre_publico?: string; // Nombre visible públicamente
  id_rol?: number;         // ID del rol
  habilitado?: boolean;    // Estado del usuario (habilitado o no)
  token_sesion?: string;   // Token de sesión
  token_passwd?: string;   // Token para recuperación de contraseña
  token_passwd_expira?: string; // Fecha de expiración del token de recuperación
  observaciones?: string;  // Comentarios u observaciones
}
