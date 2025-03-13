import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, of } from 'rxjs';
import { Peliculas, Result } from 'src/app/shared/interfaces/peliculas';

@Injectable({
  providedIn: 'root'
})
export class PeliculasService {
  public listadoPeliculas: Result[] = [];

  private _historialEtiquetas: string[] = [];
  private apiKey = '8f6ad54766ad4f66cdf85a360b029b35';
  private serveUrl = 'https://api.themoviedb.org/3';

  get historialEtiqueta() {
    return [...this._historialEtiquetas];
  }

  constructor(private http: HttpClient) {
    // Cargar el historial de etiquetas desde el localStorage cuando el servicio se inicializa
    this.cargarLocalStorage();
  }

  private almacenarLocalStorage() {
    localStorage.setItem('historialEtiqueta', JSON.stringify(this._historialEtiquetas));
  }

  private cargarLocalStorage() {
    const historial = localStorage.getItem('historialEtiqueta');
    if (historial) {
      this._historialEtiquetas = JSON.parse(historial);
      // Opcional: Buscar la primera etiqueta en el historial al iniciar el servicio
      if (this._historialEtiquetas.length > 0) {
        this.buscarEtiqueta(this._historialEtiquetas[0]);
      }
    }
  }

  ordenarHistorial(etiqueta: string): void {
    etiqueta = etiqueta.toLowerCase().trim();
    if (etiqueta === "") {
      window.alert("No puedes introducir vacío");
      return;
    }

    if (this._historialEtiquetas.includes(etiqueta)) {
      this._historialEtiquetas = this._historialEtiquetas.filter(e => e !== etiqueta);
    }

    // Si el historial tiene 10 etiquetas, eliminamos la última
    if (this._historialEtiquetas.length === 10) {
      this._historialEtiquetas.pop();
    }

    // Añadir la nueva etiqueta al inicio
    this._historialEtiquetas.unshift(etiqueta);
    this.almacenarLocalStorage();
  }

  buscarEtiqueta(etiqueta: string) {
    this.ordenarHistorial(etiqueta);

    const params = new HttpParams()
      .set('api_key', this.apiKey)
      .set('query', etiqueta)
      .set('page', '1'); // Página 1, puedes implementar paginación si lo deseas

    // Realiza la solicitud HTTP GET a la API para buscar las películas
    this.http.get<Peliculas>(`${this.serveUrl}/search/movie`, { params })
      .pipe(
        catchError(err => {
          console.error('Error al buscar películas', err);
          return of({ page: 1, results: [], total_pages: 0, total_results: 0 }); // Devuelve un resultado vacío en caso de error
        })
      )
      .subscribe(resp => {
        this.listadoPeliculas = resp.results;
        console.log('Películas encontradas:', this.listadoPeliculas);
      });
  }
}
