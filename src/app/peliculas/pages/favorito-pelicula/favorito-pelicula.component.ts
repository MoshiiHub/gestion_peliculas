import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { FavoritosService } from 'src/app/services/favoritos.service';
import { PeliculasService } from 'src/app/services/peliculas.service';
import { UsuarioService } from 'src/app/services/usuario.service';
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

  constructor(
    private favoritosService: FavoritosService,
    private commonService: CommonService, // Inyecta el servicio para el snackbar
  ) {}

  ngOnInit(): void {
    this.checkTokenAndLoadFavorites();
  }

  // Verifica el token y obtiene los favoritos si es válido
  private checkTokenAndLoadFavorites(): void {
    if (!this.userToken) {

      return;
    }

    this.obtenerFavoritos();
  }

  // Obtener las películas favoritas
  obtenerFavoritos(): void {
    if (!this.userToken) {
      console.error('Error: No hay token de usuario');
      return;
    }

    this.favoritosService.obtenerFavoritos().subscribe({
      next: (response) => {
        this.favoritos = response.data;
      },
      error: (error) => {
        console.error('Error al obtener los favoritos:', error);

      },
    });
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
