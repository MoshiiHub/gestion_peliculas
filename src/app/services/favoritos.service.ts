import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable } from 'rxjs';
import { URL_API } from 'src/environments/environment'; // ✅ Importa correctamente
import { CommonService } from '../shared/common.service';

const ENDPOINT = 'peliculas_favoritas';

@Injectable({
  providedIn: 'root'
})
export class FavoritosService {
  constructor(private http: HttpClient,
    private commonService: CommonService
  ) {}

  // Obtener películas favoritas de un usuario
  obtenerFavoritos(idUsuario: number): Observable<any> {
    return this.http.get(`${URL_API}/${ENDPOINT}.php?route=obtener_peliculas_usuario&id_usuario=${idUsuario}`).pipe(
      catchError((error) => {
        console.error('Error al obtener favoritos', error);
        throw error;
      })
    );
  }

  // Agregar película a favoritos
  agregarFavorito(idUsuario: number, idPelicula: number): Observable<any> {
    const body = { id_usuario: idUsuario, id_pelicula: idPelicula };
    console.log("Cuerpo del POST:", body);  // Revisa los valores en consola
    return this.http.post(`${URL_API}/${ENDPOINT}.php`, body, { headers: this.commonService.getHeaders() });
  }

  // Eliminar película de favoritos
  eliminarFavorito(idUsuario: number, idPelicula: number): Observable<any> {
    const options = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      body: { id_usuario: idUsuario, id_pelicula: idPelicula }
    };
    return this.http.delete(`${URL_API}/${ENDPOINT}.php`, options);
  }
}
