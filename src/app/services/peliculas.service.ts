import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, of } from 'rxjs';
import { Peliculas, Result } from 'src/app/shared/interfaces/peliculas';

@Injectable({
  providedIn: 'root'
})
export class PeliculasService {
  public listadoPeliculas: Result[] = [];

  private _historialEtiquetas: string[] = [];
  private apiKey = '8f6ad54766ad4f66cdf85a360b029b35';
  private serveUrl = 'https://api.themoviedb.org/3';

  private listadoPeliculasSubject = new BehaviorSubject<Result[]>([]);
  public listadoPeliculas$ = this.listadoPeliculasSubject.asObservable();

  get historialEtiqueta() {
    return [...this._historialEtiquetas];
  }

  constructor(private http: HttpClient) {
    this.cargarLocalStorage();
  }

  private almacenarLocalStorage() {
    localStorage.setItem('historialEtiqueta', JSON.stringify(this._historialEtiquetas));
  }

  private cargarLocalStorage() {
    const historial = localStorage.getItem('historialEtiqueta');
    if (historial) {
      this._historialEtiquetas = JSON.parse(historial);
      if (this._historialEtiquetas.length > 0) {
        this.buscarEtiqueta(this._historialEtiquetas[0]);
      }
    }
  }

  ordenarHistorial(etiqueta: string): void {
    etiqueta = etiqueta.toLowerCase().trim();
    if (!etiqueta) {
      window.alert("No puedes introducir vacío");
      return;
    }

    this._historialEtiquetas = this._historialEtiquetas.filter(e => e !== etiqueta);
    if (this._historialEtiquetas.length === 10) {
      this._historialEtiquetas.pop();
    }

    this._historialEtiquetas.unshift(etiqueta);
    this.almacenarLocalStorage();
  }

  buscarEtiqueta(etiqueta: string, pagina: number = 1) {
    this.ordenarHistorial(etiqueta);

    const params = new HttpParams()
      .set('api_key', this.apiKey)
      .set('query', etiqueta)
      .set('page', pagina.toString());

    this.http.get<Peliculas>(`${this.serveUrl}/search/movie`, { params })
      .pipe(
        catchError(err => {
          console.error('Error al buscar películas', err);
          return of({ page: pagina, results: [], total_pages: 0, total_results: 0 });
        })
      )
      .subscribe(resp => {
        this.listadoPeliculas = resp.results || [];
        this.listadoPeliculasSubject.next(this.listadoPeliculas);
      });
  }

  getImageUrl(path: string | null): string {
    const baseUrl = 'https://image.tmdb.org/t/p/w500';
    return path ? `${baseUrl}${path}` : 'assets/no-image.png';
  }

  buscarPeliculasPopulares(pagina: number = 1) {
    const params = new HttpParams()
      .set('api_key', this.apiKey)
      .set('page', pagina.toString());

    this.http.get<Peliculas>(`${this.serveUrl}/movie/popular`, { params })
      .pipe(
        catchError(err => {
          console.error('Error al obtener películas populares', err);
          return of({ page: pagina, results: [], total_pages: 0, total_results: 0 });
        })
      )
      .subscribe(resp => {
        this.listadoPeliculas = resp.results || [];
        this.listadoPeliculasSubject.next(this.listadoPeliculas);
      });
  }
}
