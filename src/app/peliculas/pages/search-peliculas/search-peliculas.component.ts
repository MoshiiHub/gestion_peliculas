import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
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

  constructor(private peliculaService: PeliculasService) {}

  public searchMovie() {
    const value: string = this.searchInput.value?.trim() || '';
    if (!value) {
      this.movies = [];
      return;
    }

    this.peliculaService.buscarEtiqueta(value);
    this.peliculaService.listadoPeliculas$.subscribe(
      peliculas => this.movies = peliculas
    );
  }

   // Resetea la búsqueda cuando se presiona Enter sin nada en el campo
   public resetSearch() {
    const value: string = this.searchInput.value?.trim() || '';
    if (!value) {
      this.movies = []; // Limpia los resultados
      this.selectedMovie = undefined; // Limpia la película seleccionada
      this.searchInput.reset(); // Limpia el campo de búsqueda
    }
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
