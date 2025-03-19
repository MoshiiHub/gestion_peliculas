import { HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';

import { FavoritosService } from 'src/app/services/favoritos.service';
import { PeliculasService } from 'src/app/services/peliculas.service';
import { CommonService } from 'src/app/shared/common.service';
import { Result } from 'src/app/shared/interfaces/peliculas';

@Component({
  selector: 'app-favorito-pelicula',
  templateUrl: './favorito-pelicula.component.html',
  styleUrls: ['./favorito-pelicula.component.css']
})
export class FavoritoPeliculaComponent {
  favoritos: Result[] = [];
  userToken: string | null = localStorage.getItem('authToken'); // Obtener token del localStorage
  favoritosId: number[] = [];
  constructor(
    private favoritosService: FavoritosService,
    private peliculasService: PeliculasService,
    private commonService: CommonService, // Inyecta el servicio para el snackbar
  ) {}

  ngOnInit(): void {
    this.checkTokenAndLoadFavorites();
    this.obtenerFavoritos();
  }

  // Verifica el token y obtiene los favoritos si es válido
  private checkTokenAndLoadFavorites(): void {
    if (!this.userToken) {
      console.error('Error: No hay token de usuario');

      return;
    }

    this.obtenerFavoritos();
  }

  // Obtener las películas favoritas
  obtenerFavoritos(): void {
    const userToken = localStorage.getItem('authToken');

    if (!userToken) {
      console.error('No se encontró el token de autorización');
      throw new Error('Token no encontrado');
    }

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${userToken}`,  // Usar el token de localStorage
      'Accept': 'application/json',
    });

    this.favoritosService.obtenerFavoritos().subscribe({
      next: (response) => {
        this.favoritos = response.data;
        console.log(response);
        console.log(this.favoritos);

      },
    });
  }

  public getPosterUrl(posterPath: string | null): string {
    return posterPath ? `https://image.tmdb.org/t/p/w500${posterPath}` : 'assets/no-image.png';
  }

  // Agregar una película a favoritos
  agregarFavorito(idPelicula: number): void {
    if (!this.userToken) {
      console.error('Error: No hay token de usuario');
      return;
    }

    this.favoritosService.agregarFavorito(idPelicula).subscribe({
      next: (response) => {
        if (response.status) {
          this.obtenerFavoritos();  // Recargar los favoritos después de agregar uno nuevo
          this.commonService.showSuccess(response.message); // Mostrar mensaje de éxito
        } else {
          this.commonService.showError(response.message); // Mostrar mensaje de error si no se pudo agregar
        }
      },
      error: (error) => {
        console.error('Error al agregar la película a favoritos:', error);

      },
    });
  }

  // Eliminar una película de favoritos
  eliminarFavorito(idPelicula: number): void {
    if (!this.userToken) {
      console.error('Error: No hay token de usuario');
      return;
    }
    if (confirm('¿Estás seguro de que deseas eliminar esta película de tus favoritos?')) {
      this.favoritosService.eliminarFavorito(idPelicula).subscribe({
        next: (response) => {
          if (response.status) {
            this.obtenerFavoritos();  // Recargar los favoritos después de eliminar uno
            this.commonService.showSuccess(response.message); // Mostrar mensaje de éxito
          } else {
            this.commonService.showError(response.message); // Mostrar mensaje de error
          }
        },
        error: (error) => {
          console.error('Error al eliminar la película de favoritos:', error);
        },
      });
    }
  }
}
