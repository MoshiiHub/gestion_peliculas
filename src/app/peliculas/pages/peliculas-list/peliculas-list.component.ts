import { Component } from '@angular/core';
import { PeliculasService } from 'src/app/services/peliculas.service';
import { Result } from 'src/app/shared/interfaces/peliculas';

@Component({
  selector: 'app-peliculas-list',
  templateUrl: './peliculas-list.component.html',
  styleUrls: ['./peliculas-list.component.css']
})
export class PeliculasListComponent {

  peliculas: Result[] = [];
  isLoading = true;  // Estado de carga
  paginaActual: number = 1;
  totalPages: number = 1;  // Total de páginas

constructor(private peliculasService: PeliculasService){}

ngOnInit(): void {
  // Llamamos a la función para obtener las películas populares
  this.peliculasService.buscarPeliculasPopulares();

  // Subscribimos al observable para obtener las películas
  this.peliculasService.listadoPeliculas$.subscribe((data) => {
    this.peliculas = data;
    this.isLoading = false; // Cambia el estado cuando se obtienen las películas
  });
}
 // Función para manejar la paginación
 cargarPagina(pagina: number) {
  this.paginaActual = pagina;
  this.peliculasService.buscarPeliculasPopulares(pagina);
}

imageUrl(posterPath: string): string {
  const baseUrl = 'https://image.tmdb.org/t/p/w500';
  return posterPath ? `${baseUrl}${posterPath}` : 'path-to-default-image.jpg'; // Imagen por defecto si no existe el póster
}
}
