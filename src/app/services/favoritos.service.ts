import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable } from 'rxjs';
import { URL_API } from 'src/environments/environment'; // ✅ Asegúrate de importar correctamente
import { CommonService } from '../shared/common.service';
import { Peliculas } from '../shared/interfaces/peliculas';

const ENDPOINT = 'peliculas_favoritas'; // El endpoint correspondiente a la API PHP

@Injectable({
  providedIn: 'root'
})
export class FavoritosService {
  constructor(private http: HttpClient, private commonService: CommonService) {}

  private token: string | null = localStorage.getItem('authToken');

  // Obtener películas favoritas del usuario
  obtenerFavoritos(): Observable<any> {
    return this.http.get(`${URL_API}/${ENDPOINT}.php?route=listar_favoritas`, {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.token}`,
      })
    }).pipe(
      catchError((error) => {
        console.error('Error al obtener las películas favoritas', error);
        this.commonService.showError('No se pudo obtener las películas favoritas.');
        throw error;
      })
    );
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
    const url = `${URL_API}/${ENDPOINT}.php?route=eliminar_favorito&id_pelicula=${idPelicula}`;
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
