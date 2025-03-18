import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { Subject, takeUntil } from 'rxjs';
import { PeliculasService } from 'src/app/services/peliculas.service';
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

  constructor(private peliculaService: PeliculasService) {}

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

  public getPosterUrl(posterPath: string | null): string {
    return posterPath ? `${this.imageBaseUrl}${posterPath}` : 'assets/no-image.png';
  }

}
