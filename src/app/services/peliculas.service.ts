import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, of } from 'rxjs';
import { Peliculas, Result } from 'src/app/shared/interfaces/peliculas';

@Injectable({
  providedIn: 'root'
})
export class PeliculasService {
  public listadoPeliculas: Result[] = [];
  private _favoritos: Result[] = [];
  private _historialEtiquetas: string[] = [];
  private apiKey = '8f6ad54766ad4f66cdf85a360b029b35';
  private serveUrl = 'https://api.themoviedb.org/3';
  private sessionId: string | null = null;  // Guardamos la sessionId

  private favoritosSubject = new BehaviorSubject<Result[]>(this._favoritos);
  public favoritos$ = this.favoritosSubject.asObservable();

  private listadoPeliculasSubject = new BehaviorSubject<Result[]>([]);
  public listadoPeliculas$ = this.listadoPeliculasSubject.asObservable();

  get historialEtiqueta() {
    return [...this._historialEtiquetas];
  }

  constructor(private http: HttpClient) {
    this.cargarLocalStorage();
  }

  // Cargar historial de etiquetas desde el localStorage
  private cargarLocalStorage() {
    const historial = localStorage.getItem('historialEtiqueta');
    if (historial) {
      this._historialEtiquetas = JSON.parse(historial);
      if (this._historialEtiquetas.length > 0) {
        this.buscarEtiqueta(this._historialEtiquetas[0]);
      }
    }
  }

  // Almacenar historial de etiquetas en el localStorage
  private almacenarLocalStorage() {
    localStorage.setItem('historialEtiqueta', JSON.stringify(this._historialEtiquetas));
  }

  // Ordenar historial de búsqueda de etiquetas
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

  // Buscar películas por etiqueta
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

  // Buscar películas populares
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

  // Añadir película a favoritos
  ingresarFavorito(pelicula: Result) {
    const existe = this._favoritos.find(p => p.id === pelicula.id);
    if (!existe) {
      this._favoritos.push(pelicula);
      this.favoritosSubject.next(this._favoritos);  // Actualizamos la lista de favoritos
    }
  }

  // Obtener lista de películas favoritas
  obtenerFavoritos() {
    return [...this._favoritos];  // Devolver una copia de la lista de favoritos
  }

  // Obtener las películas favoritas desde la API
  obtenerFavoritosDesdeApi() {
    if (!this.sessionId) {
      console.error('No hay sesión activa');
      return;
    }

    const params = new HttpParams().set('api_key', this.apiKey);
    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    this.http.get<Peliculas>(`${this.serveUrl}/account/{account_id}/favorite/movies?session_id=${this.sessionId}`, { headers, params })
      .pipe(
        catchError(err => {
          console.error('Error al obtener películas favoritas', err);
          return of({ results: [] });
        })
      )
      .subscribe(resp => {
        if (resp.results) {
          this.favoritosSubject.next(resp.results);
        }
      });
  }

  // Quitar una película de favoritos
  quitarFavorito(pelicula: Result) {
    if (!this.sessionId) {
      console.error('No hay sesión activa');
      return;
    }

    const params = new HttpParams().set('api_key', this.apiKey);
    const body = {
      media_type: 'movie',
      media_id: pelicula.id,
      favorite: false  // Indicamos que queremos quitarla de favoritos
    };

    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    this.http.post(`${this.serveUrl}/account/{account_id}/favorite?session_id=${this.sessionId}`, body, { headers, params })
      .pipe(
        catchError(err => {
          console.error('Error al quitar película de favoritos', err);
          return of(null);
        })
      )
      .subscribe(resp => {
        if (resp) {
          console.log('Película eliminada de favoritos', resp);
          // Actualizamos la lista de favoritos después de quitarla
          this._favoritos = this._favoritos.filter(p => p.id !== pelicula.id);
          this.favoritosSubject.next(this._favoritos);
        }
      });
  }

  getImageUrl(path: string | null): string {
    const baseUrl = 'https://image.tmdb.org/t/p/w500';
    return path ? `${baseUrl}${path}` : 'assets/no-image.png';  // Ruta predeterminada si no hay imagen
  }
}
