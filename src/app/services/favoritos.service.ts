import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable } from 'rxjs';
import { URL_API } from 'src/environments/environment'; // ✅ Asegúrate de importar correctamente
import { CommonService } from '../shared/common.service';
import { ApiResponse } from '../shared/interfaces/api-response';
import { Result } from '../shared/interfaces/peliculas';

const ENDPOINT = 'peliculas_favoritas'; // El endpoint correspondiente a la API PHP

@Injectable({
  providedIn: 'root'
})
export class FavoritosService {

  private apiKey = '8f6ad54766ad4f66cdf85a360b029b35';
  private serveUrl = 'https://api.themoviedb.org/3';

  constructor(private http: HttpClient, private commonService: CommonService) { }

  private token: string | null = localStorage.getItem('authToken');

  // Obtener películas favoritas del usuario


  obtenerFavoritos(): Observable<ApiResponse> {

    return this.http.get<ApiResponse>(`${URL_API}/${ENDPOINT}.php`, { headers: this.commonService.getHeaders() });

  }

  getMovieById(id: number) {
    const params = new HttpParams()
    .set('api_key', this.apiKey)
    .set('language', 'es-ES');
    return this.http.get<Result>(`${this.serveUrl}/movie/${id}`, { params });
  }

  agregarFavorito(idPelicula: number): Observable<any> {
    const body = { id_pelicula: idPelicula };
    console.log('Cuerpo del POST enviado:', body);

    const userToken = localStorage.getItem('authToken');
    if (!userToken) {
      console.error('No se encontró el token de autorización');
      throw new Error('Token no encontrado');
    }

    console.log('Token enviado en la cabecera:', userToken);

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${userToken}`,  // Usar el token obtenido de localStorage
      'Accept': 'application/json',  // Asegurarse de que el servidor acepte la respuesta JSON
    });

    // Enviar la solicitud POST a la URL sin 'route' en la URL
    return this.http.post(`${URL_API}/${ENDPOINT}.php`, body, { headers }).pipe(
      catchError((error) => {
        console.error('Error al agregar la película a favoritos:', error);
        throw error;
      })
    );
  }


 // Eliminar película de favoritos
eliminarFavorito(idPelicula: number): Observable<any> {
  const url = `${URL_API}/${ENDPOINT}.php?id_favorito=${idPelicula}`;  // Corrige la URL
  const headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${this.token}`,
  });

  return this.http.delete(url, { headers }).pipe(
    catchError((error) => {
      console.error('Error al eliminar la película de favoritos:', error);
      this.commonService.showError('No se pudo eliminar la película de favoritos.');
      throw error;
    })
  );
}
}
