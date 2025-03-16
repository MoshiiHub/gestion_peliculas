import { Component } from '@angular/core';
import { PeliculasService } from 'src/app/services/peliculas.service';
import { Result } from 'src/app/shared/interfaces/peliculas';
import { ActivatedRoute, Router } from '@angular/router';
import { delay, switchMap } from 'rxjs';

@Component({
  selector: 'app-detalles-peliculas',
  templateUrl: './detalles-peliculas.component.html',
  styleUrls: ['./detalles-peliculas.component.css']
})
export class DetallesPeliculasComponent {

  public pelicula?: Result;

  constructor(
    private peliculasService: PeliculasService,
    private activatedRoute: ActivatedRoute,
    private router : Router
  ) { }

  ngOnInit(): void {
    this.activatedRoute.params.pipe(
      delay(1000),  // Puedes quitar esto en producción o usarlo si quieres simular carga
      switchMap(({ id }) => this.peliculasService.getMovieById(id))  // Llama al servicio con el id de la película
    ).subscribe(pelicula => {
      if (!pelicula) {
        // Redirige si no se encuentra la película
        this.router.navigate(['peliculas-list']);
        return;  // Asegúrate de retornar aquí para evitar el error
      }
      this.pelicula = pelicula;  // Asigna la película seleccionada
    });
  }

  // Función para obtener la URL de la imagen
  public getPosterUrl(posterPath: string | null): string {
    return posterPath ? `https://image.tmdb.org/t/p/w500${posterPath}` : 'assets/no-image.png';
  }

}
