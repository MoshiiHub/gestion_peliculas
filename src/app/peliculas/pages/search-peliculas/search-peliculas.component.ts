import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { Subject, takeUntil } from 'rxjs';
import { FavoritosService } from 'src/app/services/favoritos.service';
import { PeliculasService } from 'src/app/services/peliculas.service';
import { CommonService } from 'src/app/shared/common.service';
import { Result } from 'src/app/shared/interfaces/peliculas';

@Component({
  selector: 'app-search-peliculas',
  templateUrl: './search-peliculas.component.html',
  styleUrls: ['./search-peliculas.component.css']
})
export class SearchPeliculasComponent {

  public searchInput = new FormControl('');
  public movies: Result[] = [];
  public selectedMovie?: Result;
  private imageBaseUrl = 'https://image.tmdb.org/t/p/w500';
  private destroy$ = new Subject<void>();
  userToken: string | null = localStorage.getItem('authToken');

  constructor(
    private peliculaService: PeliculasService,
    private favoritoService: FavoritosService,
    private commonService : CommonService

  ) {}

  public searchMovie() {
    const value: string = this.searchInput.value?.trim() || '';
    if (!value) {
      this.movies = [];
      return;
    }

    // Llamamos al servicio para buscar películas
    this.peliculaService.buscarEtiqueta(value);
    this.peliculaService.listadoPeliculas$.pipe(takeUntil(this.destroy$)).subscribe(
      peliculas => {
        this.movies = peliculas;
      },
      error => {
        console.error('Error en la búsqueda de películas', error);
      }
    );
  }

  // Resetea la búsqueda
  public resetSearch() {
    const value: string = this.searchInput.value?.trim() || '';
    if (!value) {
      this.movies = [];
      this.selectedMovie = undefined;
      this.searchInput.reset();
    }
  }

  // Limpia la suscripción cuando el componente se destruya
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public onSelectedOption(event: MatAutocompleteSelectedEvent) {
    if (!event.option.value) {
      this.selectedMovie = undefined;
      return;
    }
    const movie: Result = event.option.value;
    this.searchInput.setValue(movie.title);
    this.selectedMovie = movie;
  }
   // Verifica si el token está disponible y muestra un error si no lo está
   private checkToken(): boolean {
    if (!this.userToken) {
      this.commonService.showError('❌ Usuario no autenticado.');
      return false;
    }
    return true;
  }

   // Función para añadir una película a favoritos
   addToFavorites(pelicula: Result): void {
    if (this.checkToken()) {
      const id_pelicula = pelicula.id;
      this.favoritoService.agregarFavorito(id_pelicula).subscribe({
        next: (response) => {
          this.commonService.showSuccess(response.message || 'Película agregada a favoritos');
        },
        error: (error) => {
          console.error('Error al agregar película a favoritos:', error);

        },
      });
    }
  }

  public getPosterUrl(posterPath: string | null): string {
    return posterPath ? `${this.imageBaseUrl}${posterPath}` : 'assets/no-image.png';
  }

}
