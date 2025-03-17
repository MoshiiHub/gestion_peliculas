
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { URL_API } from 'src/environments/environment'; // ✅ Importa correctamente

@Injectable({
  providedIn: 'root'
})
export class FavoritosService {
  constructor(private http: HttpClient) {}

  // Obtener películas favoritas de un usuario
  obtenerFavoritos(idUsuario: number): Observable<any> {
    return this.http.get(`${URL_API}?route=obtener_peliculas_usuario&id_usuario=${idUsuario}`);
  }

  // Agregar película a favoritos
  agregarFavorito(idUsuario: number, idPelicula: number): Observable<any> {
    const body = { id_usuario: idUsuario, id_pelicula: idPelicula };
    return this.http.post(URL_API, body);
  }

  // Eliminar película de favoritos
  eliminarFavorito(idUsuario: number, idPelicula: number): Observable<any> {
    const options = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      body: { id_usuario: idUsuario, id_pelicula: idPelicula }
    };
    return this.http.delete(URL_API, options);
  }
}
