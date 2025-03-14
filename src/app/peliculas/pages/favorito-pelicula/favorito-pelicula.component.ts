import { Component } from '@angular/core';
import { PeliculasService } from 'src/app/services/peliculas.service';
import { Result } from 'src/app/shared/interfaces/peliculas';

@Component({
  selector: 'app-favorito-pelicula',
  templateUrl: './favorito-pelicula.component.html',
  styleUrls: ['./favorito-pelicula.component.css']
})
export class FavoritoPeliculaComponent {
  favoritos: Result[] = [];

  constructor(private peliculasService: PeliculasService) {}

  ngOnInit(): void {
    this.obtenerFavoritos();
  }

  obtenerFavoritos() {
    this.peliculasService.obtenerFavoritos();
    this.peliculasService.favoritos$.subscribe(favoritos => {
      this.favoritos = favoritos;
    });
  }
  quitarFavorito(pelicula: Result) {
    this.peliculasService.quitarFavorito(pelicula);  // Llamamos al método del servicio
    // Actualizamos la lista de favoritos después de quitar la película
    this.obtenerFavoritos();
  }
}
